import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { conversationalMemory } from './conversationalMemory';
import { toolRegistry } from './toolRegistry';
import { elevenLabsVoiceService } from './elevenLabsVoice';

export interface AIConfig {
  provider: 'openai' | 'gemini' | 'hybrid';
  model: string;
  temperature: number;
  maxTokens: number;
  enableVoice: boolean;
  voiceName: string;
  streamResponses: boolean;
}

export interface ConversationRequest {
  message: string;
  projectId: string;
  userId?: string;
  context?: any;
  enableVoice?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface ConversationResponse {
  message: string;
  audioUrl?: string;
  toolCalls?: any[];
  metadata: {
    model: string;
    tokens: number;
    responseTime: number;
    hasVoice: boolean;
    toolsUsed: string[];
  };
  success: boolean;
  error?: string;
}

class ConversationalAIService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private isInitialized = false;
  private config: AIConfig;

  constructor() {
    this.config = {
      provider: 'hybrid',
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 1500,
      enableVoice: true,
      voiceName: 'sarah',
      streamResponses: true
    };
  }

  async initialize(apiKeys: {
    openai?: string;
    gemini?: string;
    elevenlabs?: string;
  }): Promise<boolean> {
    try {
      // Initialize OpenAI
      if (apiKeys.openai) {
        this.openai = new OpenAI({
          apiKey: apiKeys.openai,
          dangerouslyAllowBrowser: true
        });
        console.log('✅ OpenAI initialized');
      }

      // Initialize Gemini (Better browser support than Anthropic)
      if (apiKeys.gemini) {
        try {
          this.gemini = new GoogleGenerativeAI(apiKeys.gemini);
          console.log('✅ Gemini initialized');
        } catch (error) {
          console.warn('❌ Gemini initialization failed:', error);
        }
      }

      // Initialize ElevenLabs
      if (apiKeys.elevenlabs) {
        const voiceInitialized = await elevenLabsVoiceService.initialize(apiKeys.elevenlabs);
        if (voiceInitialized) {
          console.log('✅ ElevenLabs voice service initialized');
        }
      }

      this.isInitialized = true;
      console.log('🤖 Conversational AI Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AI services:', error);
      return false;
    }
  }

  async processConversation(request: ConversationRequest): Promise<ConversationResponse> {
    const startTime = Date.now();
    
    try {
      console.log('🤖 Processing conversation via Supabase Edge Function...');
      
      // Call our Supabase Edge Function instead of browser-based AI
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('construction-assistant', {
        body: {
          message: request.message,
          user_id: request.userId || 'demo_user',
          project_id: request.projectId,
          conversation_id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          task_type: 'analysis',
          latency_requirement: request.priority === 'urgent' ? 'low' : 'medium',
          ai_budget: 1000, // 10 dollars in cents
          enable_voice: request.enableVoice || false,
          voice_optimized: false,
          context: request.context,
          tools_enabled: true,
          require_approval: false
        }
      });
      
      if (error) {
        console.error('❌ Edge Function error:', error);
        throw new Error(`AI processing failed: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No response from AI service');
      }
      
      console.log('✅ AI Response received:', {
        model: data.model_info?.final_model_used,
        tokens: data.model_info?.token_count,
        cost: data.model_info?.estimated_cost_cents
      });
      
      // Start or continue conversation session for local memory
      let sessionId = conversationalMemory.getCurrentSession()?.id;
      if (!sessionId) {
        sessionId = conversationalMemory.startSession(request.projectId, request.userId);
      }

      // Add messages to local memory
      conversationalMemory.addMessage(request.message, 'user', {
        context: request.context,
        priority: request.priority
      });
      
      conversationalMemory.addMessage(data.response, 'assistant', {
        toolCalls: data.tool_results || [],
        context: request.context
      });

      return {
        message: data.response,
        audioUrl: data.audio_url,
        toolCalls: data.tool_results || [],
        metadata: {
          model: data.model_info?.final_model_used || 'unknown',
          tokens: data.model_info?.token_count || 0,
          responseTime: Date.now() - startTime,
          hasVoice: !!data.audio_url,
          toolsUsed: (data.tool_results || []).map((t: any) => t.name || 'tool')
        },
        success: true
      };

    } catch (error) {
      console.error('❌ Conversation processing failed:', error);
      return this.createErrorResponse(error.message || 'Conversation processing failed', startTime);
    }
  }

  private async analyzeAndExecuteTools(request: ConversationRequest) {
    const toolCalls: any[] = [];
    const message = request.message.toLowerCase();

    // Intelligent tool selection based on message content
    const toolMappings = [
      {
        keywords: ['progress', 'status', 'milestone', 'completion', 'schedule'],
        tool: 'getConstructionProgress'
      },
      {
        keywords: ['budget', 'cost', 'financial', 'money', 'expense', 'price'],
        tool: 'getProjectFinancials'
      },
      {
        keywords: ['safety', 'incident', 'compliance', 'training', 'hazard'],
        tool: 'getSafetyMetrics'
      },
      {
        keywords: ['maintenance', 'facility', 'repair', 'service', 'inspection'],
        tool: 'getMaintenanceSchedule'
      },
      {
        keywords: ['team', 'communication', 'message', 'notification', 'rfi'],
        tool: 'getTeamCommunications'
      },
      {
        keywords: ['weather', 'conditions', 'forecast', 'temperature', 'rain'],
        tool: 'getWeatherConditions'
      }
    ];

    // Execute relevant tools
    for (const mapping of toolMappings) {
      if (mapping.keywords.some(keyword => message.includes(keyword))) {
        try {
          const result = await toolRegistry.executeTool(mapping.tool, {
            projectId: request.projectId,
            includeDetails: true
          });
          
          if (result.success) {
            toolCalls.push({
              name: mapping.tool,
              parameters: { projectId: request.projectId },
              result: result.data,
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error(`Tool execution failed for ${mapping.tool}:`, error);
        }
      }
    }

    // Action tools based on intent
    if (message.includes('send') || message.includes('notify')) {
      // Would implement notification sending
    }

    if (message.includes('create') && message.includes('report')) {
      // Would implement report generation
    }

    return toolCalls;
  }

  private async generateResponse(params: {
    systemPrompt: string;
    conversationHistory: any[];
    currentMessage: string;
    toolResults: any[];
    projectId: string;
  }): Promise<{ content: string; model: string; tokens: number }> {
    
    // Build context with tool results
    let contextualInfo = '';
    if (params.toolResults.length > 0) {
      contextualInfo = '\n\nREAL-TIME DATA:\n';
      for (const tool of params.toolResults) {
        contextualInfo += `${tool.name}: ${JSON.stringify(tool.result, null, 2)}\n\n`;
      }
    }

    const messages = [
      {
        role: 'system',
        content: params.systemPrompt + contextualInfo
      },
      ...params.conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      {
        role: 'user',
        content: params.currentMessage
      }
    ];

    // Try OpenAI first (most reliable for browser)
    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: this.config.model,
          messages: messages as any,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          stream: false
        });

        return {
          content: completion.choices[0]?.message?.content || 'I apologize, but I received an empty response.',
          model: completion.model,
          tokens: completion.usage?.total_tokens || 0
        };
      } catch (error) {
        console.error('OpenAI request failed:', error);
      }
    }

    // Fallback to intelligent demo response with tool data
    return {
      content: this.generateIntelligentFallbackResponse(params.currentMessage, params.toolResults, params.projectId),
      model: 'demo-fallback',
      tokens: 0
    };
  }

  private generateIntelligentFallbackResponse(message: string, toolResults: any[], projectId: string): string {
    const lowerMessage = message.toLowerCase();
    
    // If we have tool data, use it to create rich responses
    if (toolResults.length > 0) {
      const toolData = toolResults[0].result;
      
      if (toolResults[0].name === 'getConstructionProgress') {
        return `Based on the latest project data, your ${projectId} project is ${toolData.overallProgress}% complete and currently in the ${toolData.currentPhase} phase. 

Key highlights:
• Overall progress: ${toolData.overallProgress}% (${toolData.weeklyProgress}% this week)
• Current phase: ${toolData.currentPhase}
• Timeline: Projected completion ${toolData.timeline.currentProjection} (${toolData.timeline.variance} from original)

Critical path items requiring attention:
${toolData.criticalPath.map((item: string) => `• ${item}`).join('\n')}

The project is showing good momentum with ${toolData.weeklyProgress}% progress this week. I recommend focusing on the critical path items to maintain schedule. Would you like me to generate a detailed progress report or send notifications to the team about these priorities?`;
      }

      if (toolResults[0].name === 'getProjectFinancials') {
        return `Here's your current financial status for ${projectId}:

Budget Overview:
• Total Budget: $${(toolData.budget.total / 1000000).toFixed(2)}M
• Spent to Date: $${(toolData.budget.spent / 1000000).toFixed(2)}M (${((toolData.budget.spent / toolData.budget.total) * 100).toFixed(1)}%)
• Remaining: $${(toolData.budget.remaining / 1000000).toFixed(2)}M

Current Variance: +$${(toolData.variance.amount / 1000).toFixed(0)}K (${toolData.variance.percentage}%)
Primary reason: ${toolData.variance.reason}

Cash Flow Status:
• Monthly burn rate: $${(toolData.cashFlow.monthlyBurn / 1000).toFixed(0)}K
• Projected runway: ${toolData.cashFlow.projectedRunway}
• Next payment due: $${(toolData.cashFlow.nextPayment.amount / 1000).toFixed(0)}K on ${toolData.cashFlow.nextPayment.dueDate}

The budget variance is within acceptable limits but requires monitoring. I can help you create a variance analysis report or set up budget alerts. Would you like me to take either action?`;
      }

      if (toolResults[0].name === 'getSafetyMetrics') {
        return `Excellent safety performance on your ${projectId} project! Here's the current status:

Safety Score: ${toolData.summary.safetyScore}/100 ⭐
• ${toolData.summary.incidentFreedays} consecutive incident-free days
• ${toolData.summary.nearMisses} near misses reported (good safety culture indicator)
• Zero incidents this ${toolData.timeframe}

Compliance Status:
• Training: ${toolData.compliance.trainingCompliance}% (${toolData.training.overdue} overdue)
• PPE: ${toolData.compliance.ppeCompliance}%
• Inspections: ${toolData.compliance.inspectionCompliance}%

Your team is performing exceptionally well. The ${toolData.training.overdue} overdue training items should be addressed before ${toolData.training.nextDeadline}. I can send reminders to those team members or generate a safety compliance report. Which would be most helpful?`;
      }
    }

    // General intelligent responses based on message intent
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I'm Sarah, your AI construction assistant! I can help you with:

🏗️ **Project Management**
• Real-time progress tracking and milestone updates
• Schedule analysis and critical path monitoring
• Budget tracking and variance analysis

📊 **Data & Reports**
• Safety compliance and incident tracking
• Financial summaries and forecasts
• Maintenance schedules and facility status
• Weather impact assessments

🔧 **Actions & Automation**
• Send team notifications and updates
• Create maintenance requests
• Generate comprehensive reports
• Update project statuses

💬 **Smart Communication**
• Natural voice conversations with ElevenLabs
• Contextual responses with project memory
• Proactive insights and recommendations

Just ask me about your project status, budget, safety, weather, or request specific actions. I have access to real-time data and can perform tasks to keep your project running smoothly!`;
    }

    // Default personalized response
    return `I understand you're asking about "${message}" for your ${projectId === 'portfolio' ? 'portfolio' : `Project ${projectId}`}. 

As your construction management AI assistant, I have access to real-time project data including progress, financials, safety metrics, maintenance schedules, team communications, and weather conditions. I can also perform actions like sending notifications, creating reports, and updating project statuses.

To give you the most accurate and helpful response, could you be more specific about what aspect you'd like me to focus on? For example:
• "What's the current progress status?"
• "Show me the budget variance"
• "Are there any safety issues?"
• "What's the weather forecast for this week?"
• "Send the team an update about..."

I'm here to help you stay on top of every aspect of your construction project!`;
  }

  private createErrorResponse(error: string, startTime: number): ConversationResponse {
    return {
      message: `I apologize, but I encountered an error: ${error}. Please try again or contact support if the issue persists.`,
      success: false,
      error,
      metadata: {
        model: 'error',
        tokens: 0,
        responseTime: Date.now() - startTime,
        hasVoice: false,
        toolsUsed: []
      }
    };
  }

  // Voice-optimized response processing
  async processVoiceInput(audioBlob: Blob, projectId: string): Promise<ConversationResponse> {
    try {
      // Use Web Speech API for transcription (browser-native)
      const text = await this.transcribeAudio(audioBlob);
      
      if (!text) {
        throw new Error('Could not transcribe audio');
      }

      // Process as normal conversation with voice enabled
      return await this.processConversation({
        message: text,
        projectId,
        enableVoice: true,
        priority: 'normal'
      });
    } catch (error) {
      console.error('❌ Voice input processing failed:', error);
      return this.createErrorResponse('Voice processing failed', Date.now());
    }
  }

  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = () => {
        reject(new Error('Speech recognition failed'));
      };

      recognition.start();
    });
  }

  // Configuration methods
  updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 AI configuration updated:', this.config);
  }

  getConfig(): AIConfig {
    return { ...this.config };
  }

  // Performance optimization
  async warmupModels(): Promise<void> {
    try {
      if (this.openai) {
        await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10
        });
      }
      console.log('🔥 AI models warmed up');
    } catch (error) {
      console.log('⚠️ Model warmup failed, but service will continue normally');
    }
  }

  isReady(): boolean {
    return this.isInitialized && (!!this.openai || !!this.gemini);
  }

  dispose(): void {
    this.openai = null;
    this.gemini = null;
    this.isInitialized = false;
    elevenLabsVoiceService.dispose();
  }
}

// Singleton instance
export const conversationalAI = new ConversationalAIService();
export default conversationalAI;
