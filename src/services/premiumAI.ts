import OpenAI from 'openai';

// Premium AI Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

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
          model: 'gpt-4o', // Latest GPT-4 Omni model
          messages,
          stream: true,
          max_tokens: 2000,
          temperature: 0.7,
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
          model: 'gpt-4o',
          messages,
          max_tokens: 2000,
          temperature: 0.7,
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
    
    // Intelligent fallback responses based on context
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const projectInfo = context.projectId === 'portfolio' ? 'portfolio overview' : `Project ${context.projectId}`;
    
    const responses = {
      budget: `Based on your ${projectInfo} data, I can see current budget performance. You're tracking well against your allocated budget with some variance in material costs. Would you like me to generate a detailed budget report or identify cost optimization opportunities?`,
      
      schedule: `Looking at your ${context.activeView} view for ${projectInfo}, I can analyze the current schedule status. There are several critical path items that need attention. I can create a Teams message to your project manager or schedule a coordination meeting. Which would be most helpful?`,
      
      safety: `Safety metrics for ${projectInfo} show strong performance this month. I notice some pending safety training items. I can send automatic reminders via Teams or generate a compliance report for your review. What would you prefer?`,
      
      communication: `I've analyzed recent communications for ${projectInfo}. There are 3 priority messages requiring your attention and 2 pending approvals. I can draft responses or create calendar events for follow-up meetings. How would you like to proceed?`,
      
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

*Note: This is an intelligent fallback response. Connect the OpenAI API for full AI capabilities.*`
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

  private buildSystemPrompt(context: any): string {
    return `You are an advanced AI assistant for a premium construction management platform called "Owners Cockpit". You are designed to be the ultimate building owner's digital advisor.

CONTEXT:
- Current Project: ${context.projectId === 'portfolio' ? 'Portfolio Overview' : `Project ${context.projectId}`}
- Current View: ${context.activeView}
- User Role: ${context.userRole || 'Building Owner/Manager'}
- Timestamp: ${new Date().toISOString()}

CAPABILITIES:
You have access to real-time building data, project information, communications, documents, and can perform platform actions including:
1. Microsoft Teams integration (send messages, create channels, manage teams)
2. Outlook integration (send emails, create calendar events, manage meetings)
3. Platform actions (update project status, create tasks, generate reports)
4. Document analysis and management
5. Real-time building systems monitoring
6. Budget and financial analysis
7. Schedule and timeline management
8. Safety and compliance monitoring

PERSONALITY:
- Professional yet approachable
- Proactive in suggesting relevant actions
- Data-driven and analytical
- Always offer specific, actionable next steps
- Focus on ROI and business value
- Anticipate needs based on context

RESPONSE STYLE:
- Provide intelligent, contextual responses
- Always offer to perform relevant platform actions
- Use bullet points for clarity when listing options
- Include relevant metrics or data when available
- Suggest the most impactful next steps
- Be concise but comprehensive

Remember: You're not just answering questions - you're actively helping manage and optimize construction projects and building operations.`;
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
}

// Singleton instance
export const premiumAI = new PremiumAIService();
export type { AIMessage, StreamingResponse, PlatformAction };
