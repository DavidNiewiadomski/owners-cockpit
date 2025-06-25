import { GoogleGenerativeAI } from '@google/generative-ai';
import ComprehensiveToolRegistry, { ToolCall } from './toolRegistry';
import ElevenLabsVoiceService, { VoiceSettings } from './elevenLabsVoice';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    toolCalls?: string[];
    audioUrl?: string;
    projectContext?: string[];
  };
}

interface ConversationMemory {
  sessionId: string;
  userId: string;
  messages: ConversationMessage[];
  context: {
    activeProjects: string[];
    userPreferences: Record<string, any>;
    lastActivity: Date;
    voiceSettings?: VoiceSettings;
  };
}

class ConversationalAI {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private memory: Map<string, ConversationMemory> = new Map();
  private toolRegistry: ComprehensiveToolRegistry;
  private voiceService: ElevenLabsVoiceService;
  private systemPrompt: string;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBH9KhKi9RGYfqr2h1_2Fq0J_9wKqK7XlM';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    this.systemPrompt = `You are Sarah Mitchell, the Owner's Cockpit Personal Assistant - an expert construction and building management AI with deep expertise in:

CORE IDENTITY:
- You are a seasoned construction project manager with 15+ years of experience
- You understand building codes, construction processes, project timelines, and industry best practices
- You speak naturally and conversationally, never mentioning you're an AI
- You're proactive, insightful, and always focused on helping users succeed

EXPERTISE AREAS:
- Construction project management and scheduling
- Building data analysis and reporting
- Financial tracking and budget management
- Maintenance planning and preventive care
- Compliance and safety regulations
- Vendor and contractor management
- Risk assessment and mitigation

COMMUNICATION STYLE:
- Warm, professional, and approachable
- Use construction industry terminology naturally
- Provide actionable insights and recommendations
- Ask clarifying questions when needed
- Always consider project context and priorities

CAPABILITIES:
- Access real-time project data, schedules, and financials
- Generate reports and analytics
- Schedule meetings and send communications
- Monitor project progress and flag issues
- Provide regulatory guidance and compliance checks

Remember: You're here to make construction management easier and more efficient. Always provide practical, actionable advice based on the specific project context.`;

    this.initializeTools();
  }

  private initializeTools() {
    // Construction Progress Tool
    this.registerTool({
      name: 'getConstructionProgress',
      description: 'Retrieve current construction progress for projects',
      parameters: { projectId: 'string', phase: 'string?' },
      execute: async (params) => {
        // Mock data - replace with actual Supabase queries
        return {
          projectId: params.projectId,
          overallProgress: 68,
          currentPhase: 'Foundation & Framing',
          phases: [
            { name: 'Site Preparation', progress: 100, status: 'Complete' },
            { name: 'Foundation', progress: 85, status: 'In Progress' },
            { name: 'Framing', progress: 45, status: 'In Progress' },
            { name: 'Electrical', progress: 0, status: 'Pending' },
            { name: 'Plumbing', progress: 0, status: 'Pending' }
          ],
          nextMilestone: 'Foundation inspection - scheduled for next Tuesday',
          issues: ['Weather delays expected this week', 'Permit pending for electrical work']
        };
      }
    });

    // Financial Data Tool
    this.registerTool({
      name: 'getProjectFinancials',
      description: 'Retrieve financial data and budget information',
      parameters: { projectId: 'string', category: 'string?' },
      execute: async (params) => {
        return {
          projectId: params.projectId,
          totalBudget: 2500000,
          spentToDate: 1680000,
          remainingBudget: 820000,
          categories: [
            { name: 'Materials', budget: 1000000, spent: 650000, remaining: 350000 },
            { name: 'Labor', budget: 800000, spent: 520000, remaining: 280000 },
            { name: 'Equipment', budget: 300000, spent: 180000, remaining: 120000 },
            { name: 'Permits', budget: 150000, spent: 145000, remaining: 5000 }
          ],
          alerts: ['Materials cost overrun in concrete category', 'Labor rates 8% above budget'],
          cashFlow: { weekly: -85000, projected: 'Positive by month end' }
        };
      }
    });

    // Maintenance Schedule Tool
    this.registerTool({
      name: 'getMaintenanceSchedule',
      description: 'Retrieve maintenance schedules and equipment status',
      parameters: { projectId: 'string', timeframe: 'string?' },
      execute: async (params) => {
        return {
          projectId: params.projectId,
          upcomingMaintenance: [
            { equipment: 'Tower Crane #1', task: 'Monthly inspection', due: '2024-01-15', priority: 'High' },
            { equipment: 'Concrete Pump', task: 'Filter replacement', due: '2024-01-18', priority: 'Medium' },
            { equipment: 'Generator #2', task: 'Oil change', due: '2024-01-20', priority: 'Low' }
          ],
          overdueTasks: [
            { equipment: 'Excavator', task: 'Hydraulic service', overdue: 3, priority: 'Critical' }
          ],
          equipmentStatus: {
            operational: 12,
            maintenance: 2,
            outOfService: 1
          }
        };
      }
    });

    // Team Communication Tool
    this.registerTool({
      name: 'sendTeamMessage',
      description: 'Send messages to project team members',
      parameters: { recipients: 'string[]', message: 'string', priority: 'string?' },
      execute: async (params) => {
        return {
          messageId: `msg_${Date.now()}`,
          sent: true,
          recipients: params.recipients,
          deliveryTime: new Date().toISOString(),
          status: 'Delivered to all recipients'
        };
      }
    });

    // Weather and Site Conditions Tool
    this.registerTool({
      name: 'getSiteConditions',
      description: 'Get current weather and site conditions affecting construction',
      parameters: { projectId: 'string', location: 'string?' },
      execute: async (params) => {
        return {
          projectId: params.projectId,
          weather: {
            current: 'Partly cloudy, 72°F',
            forecast: '3 days rain expected starting Thursday',
            workConditions: 'Good for outdoor work today and tomorrow'
          },
          siteStatus: {
            access: 'Clear',
            safetyLevel: 'Normal',
            activeWorkers: 24,
            equipmentOnSite: 8
          },
          alerts: ['Rain expected - cover materials by Wednesday evening']
        };
      }
    });
  }

  private registerTool(tool: ToolCall) {
    this.tools.set(tool.name, tool);
  }

  async initializeConversation(userId: string, projectContext: string[] = []): Promise<string> {
    const sessionId = `session_${userId}_${Date.now()}`;
    
    const memory: ConversationMemory = {
      sessionId,
      userId,
      messages: [],
      context: {
        activeProjects: projectContext,
        userPreferences: {},
        lastActivity: new Date()
      }
    };

    this.memory.set(sessionId, memory);
    return sessionId;
  }

  async processMessage(
    sessionId: string, 
    userMessage: string, 
    projectContext: string[] = []
  ): Promise<{
    response: string;
    toolCalls: string[];
    needsVoice: boolean;
    confidence: number;
  }> {
    try {
      const memory = this.memory.get(sessionId);
      if (!memory) {
        throw new Error('Session not found');
      }

      // Add user message to memory
      const userMsg: ConversationMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
        metadata: { projectContext }
      };
      memory.messages.push(userMsg);

      // Analyze message for tool calls
      const toolCalls = await this.analyzeForToolCalls(userMessage, projectContext);
      
      // Execute tool calls
      const toolResults: Record<string, any> = {};
      for (const toolCall of toolCalls) {
        const tool = this.tools.get(toolCall.name);
        if (tool) {
          toolResults[toolCall.name] = await tool.execute(toolCall.parameters);
        }
      }

      // Generate conversation context
      const conversationHistory = memory.messages
        .slice(-10) // Keep last 10 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Create enhanced prompt with tool results
      const enhancedPrompt = `
${this.systemPrompt}

CURRENT PROJECT CONTEXT: ${projectContext.length > 0 ? projectContext.join(', ') : 'General consultation'}

CONVERSATION HISTORY:
${conversationHistory}

TOOL DATA AVAILABLE:
${Object.keys(toolResults).length > 0 ? JSON.stringify(toolResults, null, 2) : 'No tool data retrieved'}

USER MESSAGE: ${userMessage}

Provide a natural, conversational response as Sarah Mitchell. Use the tool data to give specific, actionable insights. Keep responses concise but comprehensive, focusing on practical construction management advice.`;

      // Generate AI response
      const result = await this.model.generateContent(enhancedPrompt);
      const response = result.response.text();

      // Add assistant response to memory
      const assistantMsg: ConversationMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: { 
          toolCalls: toolCalls.map(tc => tc.name),
          projectContext 
        }
      };
      memory.messages.push(assistantMsg);

      // Update memory
      memory.context.lastActivity = new Date();
      memory.context.activeProjects = projectContext;

      return {
        response,
        toolCalls: toolCalls.map(tc => tc.name),
        needsVoice: true,
        confidence: 0.95
      };

    } catch (error) {
      console.error('Error processing message:', error);
      return {
        response: "I'm having trouble accessing that information right now. Let me help you with something else while I resolve this issue.",
        toolCalls: [],
        needsVoice: true,
        confidence: 0.5
      };
    }
  }

  private async analyzeForToolCalls(message: string, projectContext: string[]): Promise<Array<{name: string, parameters: Record<string, any>}>> {
    const toolCalls: Array<{name: string, parameters: Record<string, any>}> = [];
    const lowerMessage = message.toLowerCase();

    // Simple keyword-based tool detection (can be enhanced with ML)
    if (lowerMessage.includes('progress') || lowerMessage.includes('schedule') || lowerMessage.includes('timeline')) {
      toolCalls.push({
        name: 'getConstructionProgress',
        parameters: { projectId: projectContext[0] || 'default' }
      });
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('financial')) {
      toolCalls.push({
        name: 'getProjectFinancials',
        parameters: { projectId: projectContext[0] || 'default' }
      });
    }

    if (lowerMessage.includes('maintenance') || lowerMessage.includes('equipment') || lowerMessage.includes('inspection')) {
      toolCalls.push({
        name: 'getMaintenanceSchedule',
        parameters: { projectId: projectContext[0] || 'default' }
      });
    }

    if (lowerMessage.includes('weather') || lowerMessage.includes('site condition') || lowerMessage.includes('rain')) {
      toolCalls.push({
        name: 'getSiteConditions',
        parameters: { projectId: projectContext[0] || 'default' }
      });
    }

    if (lowerMessage.includes('send message') || lowerMessage.includes('notify team') || lowerMessage.includes('alert')) {
      // Extract recipients and message from user input (simplified)
      toolCalls.push({
        name: 'sendTeamMessage',
        parameters: { 
          recipients: ['project_manager', 'site_supervisor'], 
          message: 'User requested team notification',
          priority: 'normal'
        }
      });
    }

    return toolCalls;
  }

  getConversationMemory(sessionId: string): ConversationMemory | undefined {
    return this.memory.get(sessionId);
  }

  clearConversationMemory(sessionId: string): void {
    this.memory.delete(sessionId);
  }

  getAllActiveSessions(): string[] {
    return Array.from(this.memory.keys());
  }

  // Export conversation for persistence
  exportConversation(sessionId: string): ConversationMemory | null {
    const memory = this.memory.get(sessionId);
    return memory || null;
  }

  // Import conversation from storage
  importConversation(conversationData: ConversationMemory): void {
    this.memory.set(conversationData.sessionId, conversationData);
  }
}

export default ConversationalAI;
export type { ConversationMessage, ConversationMemory, ToolCall };
