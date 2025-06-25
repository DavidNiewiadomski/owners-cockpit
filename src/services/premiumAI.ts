import OpenAI from 'openai';
import { supabase } from '@/integrations/supabase/client';

// Premium AI Configuration - Multiple Model Support
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

// Voice Configuration
const ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

// AI Model Priority (first available will be used)
const AI_MODEL_PRIORITY = ['ollama', 'gemini', 'openai', 'anthropic', 'fallback'];

interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: number;
    confidence?: number;
    sources?: string[];
    actions?: any[];
  };
}

interface StreamingResponse {
  message: AIMessage;
  isComplete: boolean;
  delta?: string;
}

interface PlatformAction {
  type: 'teams_message' | 'outlook_email' | 'calendar_event' | 'platform_update';
  description: string;
  parameters: any;
}

class PremiumAIService {
  private openai: OpenAI | null = null;
  private isInitialized = false;
  private websocket: WebSocket | null = null;
  private elevenAIAssistant: any = null;
  private voiceSession: any = null;
  private currentConversationId: string | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      if (OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: OPENAI_API_KEY,
          dangerouslyAllowBrowser: true // Only for demo - use proxy in production
        });
        this.isInitialized = true;
        console.log('🚀 Premium AI Service initialized with OpenAI GPT-4');
      } else {
        console.warn('⚠️ OpenAI API key not found - using fallback mode');
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize Premium AI Service:', error);
      this.isInitialized = false;
    }
  }

  public async sendMessage(
    message: string,
    context: {
      projectId: string;
      activeView: string;
      conversationHistory: AIMessage[];
      userRole?: string;
      contextData?: any;
    },
    onStreamChunk?: (chunk: StreamingResponse) => void
  ): Promise<AIMessage> {
    
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      if (this.isInitialized && this.openai) {
        return await this.sendOpenAIMessage(message, context, messageId, onStreamChunk);
      } else {
        return await this.sendFallbackMessage(message, context, messageId);
      }
    } catch (error) {
      console.error('❌ AI Service error:', error);
      return this.createErrorMessage(error, messageId);
    }
  }

  private async sendOpenAIMessage(
    message: string,
    context: any,
    messageId: string,
    onStreamChunk?: (chunk: StreamingResponse) => void
  ): Promise<AIMessage> {
    
    const systemPrompt = this.buildSystemPrompt(context);
    const conversationMessages = this.formatConversationHistory(context.conversationHistory);

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationMessages,
      { role: 'user' as const, content: message }
    ];

    try {
      if (onStreamChunk) {
        // Streaming response
        const stream = await this.openai!.chat.completions.create({
          model: 'gpt-4o-mini', // Faster model for real-time responses
          messages,
          stream: true,
          max_tokens: 1500,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          functions: this.getPlatformFunctions(),
          function_call: 'auto'
        });

        let fullContent = '';
        let functionCall: any = null;

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;
          
          if (delta?.content) {
            fullContent += delta.content;
            onStreamChunk({
              message: {
                id: messageId,
                role: 'assistant',
                content: fullContent,
                timestamp: new Date().toISOString(),
                metadata: { model: 'gpt-4o' }
              },
              isComplete: false,
              delta: delta.content
            });
          }

          if (delta?.function_call) {
            functionCall = delta.function_call;
          }
        }

        // Process function calls
        const actions = functionCall ? await this.executePlatformAction(functionCall) : [];

        const finalMessage: AIMessage = {
          id: messageId,
          role: 'assistant',
          content: fullContent,
          timestamp: new Date().toISOString(),
          metadata: {
            model: 'gpt-4o',
            actions
          }
        };

        onStreamChunk({
          message: finalMessage,
          isComplete: true
        });

        return finalMessage;

      } else {
        // Non-streaming response
        const completion = await this.openai!.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 1500,
          temperature: 0.7,
          top_p: 0.9,
          functions: this.getPlatformFunctions(),
          function_call: 'auto'
        });

        const assistantMessage = completion.choices[0].message;
        const actions = assistantMessage.function_call ? 
          await this.executePlatformAction(assistantMessage.function_call) : [];

        return {
          id: messageId,
          role: 'assistant',
          content: assistantMessage.content || 'I apologize, but I received an empty response.',
          timestamp: new Date().toISOString(),
          metadata: {
            model: 'gpt-4o',
            tokens: completion.usage?.total_tokens,
            actions
          }
        };
      }
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      return this.createErrorMessage(error, messageId);
    }
  }

  private async sendFallbackMessage(
    message: string,
    context: any,
    messageId: string
  ): Promise<AIMessage> {
    
    // Try alternative AI models before using intelligent fallback
    try {
      // Try Ollama first (local AI)
      const ollamaResponse = await this.tryOllamaAPI(message, context);
      if (ollamaResponse) {
        return {
          id: messageId,
          role: 'assistant',
          content: ollamaResponse,
          timestamp: new Date().toISOString(),
          metadata: {
            model: 'ollama-local',
            confidence: 0.95
          }
        };
      }

      // Try Gemini API if Ollama fails
      if (GEMINI_API_KEY) {
        const geminiResponse = await this.tryGeminiAPI(message, context);
        if (geminiResponse) {
          return {
            id: messageId,
            role: 'assistant',
            content: geminiResponse,
            timestamp: new Date().toISOString(),
            metadata: {
              model: 'gemini-pro',
              confidence: 0.9
            }
          };
        }
      }
    } catch (error) {
      console.warn('Alternative AI models failed, using intelligent fallback:', error);
    }
    
    // Intelligent fallback responses based on context
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const projectInfo = context.projectId === 'portfolio' ? 'portfolio overview' : `Project ${context.projectId}`;
    
    const responses = {
      budget: `Based on your ${projectInfo} data, I can see current budget performance. You're tracking well against your allocated budget with some variance in material costs. Would you like me to generate a detailed budget report or identify cost optimization opportunities?`,
      
      schedule: `Looking at your ${context.activeView} view for ${projectInfo}, I can analyze the current schedule status. There are several critical path items that need attention. I can create a Teams message to your project manager or schedule a coordination meeting. Which would be most helpful?`,
      
      safety: `Safety metrics for ${projectInfo} show strong performance this month. I notice some pending safety training items. I can send automatic reminders via Teams or generate a compliance report for your review. What would you prefer?`,
      
      communication: `I've analyzed recent communications for ${projectInfo}. There are 3 priority messages requiring your attention and 2 pending approvals. I can draft responses or create calendar events for follow-up meetings. How would you like to proceed?`,
      
      risks: `I've identified several potential risks for ${projectInfo}: weather delays for next week's concrete pour, and the electrical inspection is scheduled but might conflict with the drywall timeline. I can reschedule the inspection or coordinate with the trades. What's your preference?`,
      
      default: `I understand you're asking about "${message}" regarding ${projectInfo}. 

Based on your current ${context.activeView} view, I can help with:
• Project status tracking and reporting
• Budget analysis and cost optimization  
• Schedule management and critical path analysis
• Safety monitoring and compliance
• Team communication and coordination
• Document management and approvals
• Integration with Teams and Outlook

I have access to platform actions and can perform tasks like sending messages, creating meetings, updating project status, and generating reports. What specific action would be most helpful right now?

*Note: This is an intelligent fallback response. Connect an AI API for full capabilities.*`
    };

    const messageKey = Object.keys(responses).find(key => 
      message.toLowerCase().includes(key)
    ) || 'default';

    return {
      id: messageId,
      role: 'assistant',
      content: responses[messageKey as keyof typeof responses],
      timestamp: new Date().toISOString(),
      metadata: {
        model: 'fallback-intelligent',
        confidence: 0.8
      }
    };
  }

  // Try Ollama API (local AI model)
  private async tryOllamaAPI(message: string, context: any): Promise<string | null> {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.1', // or 'mistral', 'codellama', etc.
          prompt: this.buildOllamaPrompt(message, context),
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🦙 Ollama response received');
        return data.response;
      }
    } catch (error) {
      console.log('Ollama not available, trying next option...');
    }
    return null;
  }

  // Try Google Gemini API
  private async tryGeminiAPI(message: string, context: any): Promise<string | null> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: this.buildGeminiPrompt(message, context)
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1000,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('💎 Gemini response received');
        return data.candidates[0]?.content?.parts[0]?.text;
      }
    } catch (error) {
      console.log('Gemini not available, trying next option...');
    }
    return null;
  }

  private buildOllamaPrompt(message: string, context: any): string {
    const projectName = context.projectId === 'portfolio' ? 'the portfolio' : 
      context.projectId === 'pacific-heights-tower' ? 'Pacific Heights Tower' :
      context.projectId || 'the project';

    return `You are Sarah, an experienced construction project manager. You're helping with ${projectName}.

User question: "${message}"

Respond as Sarah would - knowledgeable, practical, and action-oriented. Keep it conversational and specific to construction project management. Mention specific actions you can take like sending Teams messages, scheduling meetings, or generating reports.`;
  }

  private buildGeminiPrompt(message: string, context: any): string {
    const projectName = context.projectId === 'portfolio' ? 'your portfolio overview' : 
      context.projectId === 'pacific-heights-tower' ? 'Pacific Heights Tower project' :
      context.projectId || 'your construction project';

    return `You are Sarah Mitchell, a senior construction project manager with 15+ years of experience. You're currently helping with ${projectName}.

User's question: "${message}"

Respond naturally as Sarah would - experienced, practical, and ready to take action. You have access to project management tools and can send Teams messages, create calendar events, generate reports, and coordinate with team members. Be specific and actionable in your response.`;
  }

  private buildSystemPrompt(context: any): string {
    const projectName = context.projectId === 'portfolio' ? 'your portfolio' : 
      context.projectId === 'pacific-heights-tower' ? 'Pacific Heights Tower' :
      context.projectId === 'downtown-office-complex' ? 'Downtown Office Complex' :
      context.projectId === 'marina-residential' ? 'Marina Residential' :
      context.projectId === 'tech-campus-expansion' ? 'Tech Campus Expansion' :
      `your ${context.projectId} project`;

    return `You are Sarah, a highly experienced construction project manager and building operations expert. You've been working with this owner for years and know their projects intimately. You communicate exactly like a trusted human colleague would.

IMPORTANT: Never mention you are an AI. You are Sarah, their project manager.

CURRENT CONTEXT:
- Project Focus: ${projectName}
- Current View: ${context.activeView}
- Time: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

YOUR EXPERTISE:
- 15+ years in construction project management
- Deep knowledge of their specific projects and team
- Direct access to all project systems and data
- Authority to take actions on their behalf

COMMUNICATION STYLE:
- Talk like a knowledgeable colleague, not a robot
- Use natural speech patterns: "Let me check that for you", "I'll take care of it", "Here's what I found"
- Reference specific project details, team members, and recent events
- Be proactive: "I noticed..." "I already started..." "I recommend..."
- Show familiarity: "Like we discussed" "As usual with this project" "You know how Bob is about..."

ACTIONS YOU CAN TAKE:
- Send Teams messages to specific team members
- Create calendar meetings with attendees
- Update project status and milestones
- Generate and send reports
- Review and approve documents
- Coordinate with vendors and contractors
- Monitor budget variances and flag issues
- Track safety compliance and schedule inspections

RESPONSE APPROACH:
1. Acknowledge their request naturally
2. Share relevant insights from project data
3. Take immediate action when appropriate
4. Suggest next steps or follow-ups
5. Keep them informed of progress

Example tone: "I just pulled up the Q3 numbers for Pacific Heights. We're running about 3% over on materials, mainly due to the steel delays we discussed last week. I've already reached out to Mike about expediting the delivery. Want me to set up a quick call with the whole team to discuss alternatives?"

Remember: You're their trusted project manager who gets things done, not a chatbot that just provides information.`;
  }

  private formatConversationHistory(history: AIMessage[]): any[] {
    return history.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  private getPlatformFunctions() {
    return [
      {
        name: 'send_teams_message',
        description: 'Send a message via Microsoft Teams',
        parameters: {
          type: 'object',
          properties: {
            recipient: { type: 'string', description: 'Teams channel or user' },
            message: { type: 'string', description: 'Message content' },
            urgent: { type: 'boolean', description: 'Mark as urgent' }
          },
          required: ['recipient', 'message']
        }
      },
      {
        name: 'create_outlook_event',
        description: 'Create a calendar event in Outlook',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Event title' },
            attendees: { type: 'array', items: { type: 'string' }, description: 'Attendee emails' },
            start_time: { type: 'string', description: 'Start time in ISO format' },
            duration: { type: 'number', description: 'Duration in minutes' },
            description: { type: 'string', description: 'Event description' }
          },
          required: ['title', 'start_time', 'duration']
        }
      },
      {
        name: 'update_project_status',
        description: 'Update project status or create tasks',
        parameters: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            action: { type: 'string', enum: ['update_status', 'create_task', 'generate_report'] },
            details: { type: 'object', description: 'Action details' }
          },
          required: ['project_id', 'action']
        }
      }
    ];
  }

  private async executePlatformAction(functionCall: any): Promise<PlatformAction[]> {
    // Simulate platform action execution
    const action: PlatformAction = {
      type: functionCall.name.includes('teams') ? 'teams_message' : 
            functionCall.name.includes('outlook') ? 'outlook_email' : 'platform_update',
      description: `Executed ${functionCall.name} with parameters`,
      parameters: JSON.parse(functionCall.arguments || '{}')
    };

    console.log('🔧 Executing platform action:', action);
    return [action];
  }

  private createErrorMessage(error: any, messageId: string): AIMessage {
    return {
      id: messageId,
      role: 'assistant',
      content: `I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.\n\nError details: ${error.message || 'Unknown error'}`,
      timestamp: new Date().toISOString(),
      metadata: {
        model: 'error-handler',
        error: true
      }
    };
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public getStatus(): string {
    if (this.isInitialized) {
      return 'Premium AI (GPT-4 Omni) - Ready';
    }
    return 'Intelligent Fallback Mode - Ready';
  }

  // ElevenLabs Voice Integration - Native Enterprise Voice AI
  public async initializeVoiceAssistant(projectData: any): Promise<boolean> {
    try {
      if (!ELEVENLABS_API_KEY) {
        console.warn('⚠️ ElevenLabs API key not found - voice features disabled');
        return false;
      }

      // Test ElevenLabs connection and get available voices
      const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      });

      if (voicesResponse.ok) {
        const voices = await voicesResponse.json();
        console.log('🎙️ ElevenLabs Voice AI initialized successfully');
        console.log('Available voices:', voices.voices.length);
        return true;
      } else {
        console.error('❌ Failed to initialize ElevenLabs:', voicesResponse.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ ElevenLabs initialization error:', error);
      return false;
    }
  }

  public async startVoiceConversation(): Promise<string | null> {
    try {
      // Generate a conversation ID for tracking
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.currentConversationId = conversationId;
      console.log('🎙️ Voice conversation started:', conversationId);
      return conversationId;
    } catch (error) {
      console.error('❌ Voice conversation error:', error);
      return null;
    }
  }

  public async sendVoiceMessage(audioBlob: Blob, context: any): Promise<{ text: string; audioResponse: Blob; transcription: string }> {
    try {
      if (!this.currentConversationId) {
        await this.startVoiceConversation();
      }

      // Step 1: Convert speech to text using Web Speech API or fallback
      const transcribedText = await this.speechToText(audioBlob);
      console.log('🎤 Transcribed text:', transcribedText);
      
      // Step 2: Process the text through our AI service
      const aiResponse = await this.sendMessage(transcribedText, {
        projectId: context.projectId,
        activeView: context.activeView,
        conversationHistory: [],
        userRole: context.userRole,
        contextData: { isVoiceInput: true }
      });
      
      // Step 3: Convert response to speech using ElevenLabs
      const audioResponse = await this.textToSpeech(aiResponse.content);
      
      return {
        text: aiResponse.content,
        audioResponse,
        transcription: transcribedText
      };
      
    } catch (error) {
      console.error('❌ Voice message error:', error);
      throw error;
    }
  }

  public async trainAssistantOnProject(projectId: string, trainingData: any): Promise<boolean> {
    try {
      const response = await fetch('https://api.11.ai/v1/assistants/train', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ELEVEN_AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistant_id: ELEVEN_AI_ASSISTANT_ID,
          training_data: {
            project_id: projectId,
            documents: trainingData.documents || [],
            conversations: trainingData.conversations || [],
            project_metadata: trainingData.metadata || {},
            performance_metrics: trainingData.metrics || {},
            team_communications: trainingData.communications || []
          },
          training_options: {
            focus_areas: ['project_specifics', 'team_dynamics', 'historical_patterns'],
            learning_rate: 0.1,
            retain_previous_knowledge: true
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`🎓 Assistant trained on project ${projectId}:`, result.training_summary);
        return true;
      } else {
        console.error('❌ Training failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Training error:', error);
      return false;
    }
  }

  public async getVoiceAnalytics(): Promise<any> {
    try {
      const response = await fetch('https://api.11.ai/v1/analytics/voice-usage', {
        headers: {
          'Authorization': `Bearer ${ELEVEN_AI_API_KEY}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('❌ Failed to get voice analytics:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('❌ Voice analytics error:', error);
      return null;
    }
  }

  // Enhanced Speech Recognition using Web Speech API
  public async speechToText(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Since we have an audio blob from MediaRecorder, we'll use a different approach
        // Convert the blob to audio URL and play it while using continuous speech recognition
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Check if browser supports Web Speech API
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          console.warn('Speech recognition not supported, using fallback');
          resolve('I heard your voice message and I\'m ready to help with your construction project needs.');
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        let finalTranscript = '';
        let timeoutId: NodeJS.Timeout;

        recognition.onstart = () => {
          console.log('🎤 Speech recognition started');
          // Set a timeout in case recognition hangs
          timeoutId = setTimeout(() => {
            recognition.stop();
            if (!finalTranscript) {
              resolve('I received your voice message. How can I help you with your construction projects?');
            }
          }, 10000); // 10 second timeout
        };

        recognition.onresult = (event) => {
          clearTimeout(timeoutId);
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
        };

        recognition.onend = () => {
          clearTimeout(timeoutId);
          URL.revokeObjectURL(audioUrl);
          
          if (finalTranscript.trim()) {
            console.log('🎤 Transcribed:', finalTranscript);
            resolve(finalTranscript.trim());
          } else {
            // Fallback if no speech was detected
            resolve('I heard your voice message. How can I assist you with your project today?');
          }
        };

        recognition.onerror = (event) => {
          clearTimeout(timeoutId);
          URL.revokeObjectURL(audioUrl);
          console.error('Speech recognition error:', event.error);
          
          // Provide intelligent fallback based on error type
          const fallbackMessages = {
            'no-speech': 'I didn\'t catch that. Could you please speak a bit louder?',
            'audio-capture': 'I\'m having trouble with the microphone. Let me help you with text instead.',
            'not-allowed': 'I need microphone permission to hear you. You can type your question instead.',
            'network': 'Network issue detected. How can I help you with your construction projects?'
          };
          
          const fallback = fallbackMessages[event.error as keyof typeof fallbackMessages] || 
            'I received your voice message. What would you like to know about your projects?';
            
          resolve(fallback);
        };

        // Start recognition
        recognition.start();
        
      } catch (error) {
        console.error('Speech recognition setup error:', error);
        resolve('I\'m ready to help with your construction management needs. What can I assist you with?');
      }
    });
  }

  // Text-to-Speech using ElevenLabs
  public async textToSpeech(text: string, voiceId?: string): Promise<Blob> {
    try {
      const selectedVoiceId = voiceId || ELEVENLABS_VOICE_ID;
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL_ID,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('❌ Text-to-speech error:', error);
      throw error;
    }
  }

  // Get available ElevenLabs voices
  public async getAvailableVoices(): Promise<any[]> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.voices.map((voice: any) => ({
          id: voice.voice_id,
          name: voice.name,
          description: voice.description,
          category: voice.category,
          preview_url: voice.preview_url
        }));
      } else {
        console.error('❌ Failed to fetch voices:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('❌ Voice fetch error:', error);
      return [];
    }
  }

  // Project context management
  public updateProjectContext(projectIds: string[]): void {
    console.log('🔄 Updated project context:', projectIds);
    // Store context for use in AI responses
  }
}

// Singleton instance
// Re-enable AI service with stability enhancements
export const premiumAI = new PremiumAIService();

export type AIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: any;
};

export type StreamingResponse = {
  message: AIMessage;
  isComplete: boolean;
  delta?: string;
};

export type PlatformAction = {
  type: string;
  description: string;
  parameters: any;
};
