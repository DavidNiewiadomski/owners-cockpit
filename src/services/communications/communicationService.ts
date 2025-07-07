import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  provider: 'outlook' | 'teams' | 'slack' | 'zoom' | 'whatsapp' | 'calendar';
  thread_id?: string;
  subject?: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  timestamp: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  metadata?: Record<string, any>;
  priority?: 'high' | 'medium' | 'low';
  status: 'sent' | 'delivered' | 'read' | 'draft';
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
}

export interface CommunicationChannel {
  id: string;
  provider: string;
  name: string;
  type: 'channel' | 'dm' | 'group' | 'meeting' | 'inbox';
  members: string[];
  unread_count: number;
  last_activity: string;
  metadata?: Record<string, any>;
}

export interface AIAssistantRequest {
  action: 'draft_reply' | 'summarize' | 'translate' | 'extract_action_items' | 'sentiment_analysis';
  content: string;
  context?: {
    thread_messages?: Message[];
    project_id?: string;
    user_preferences?: Record<string, any>;
  };
  instructions?: string;
}

export interface AIAssistantResponse {
  success: boolean;
  result: {
    content?: string;
    summary?: string;
    action_items?: Array<{
      task: string;
      assignee?: string;
      due_date?: string;
      priority: string;
    }>;
    sentiment?: {
      overall: 'positive' | 'neutral' | 'negative';
      confidence: number;
      emotions: Record<string, number>;
    };
    translation?: {
      target_language: string;
      translated_text: string;
    };
  };
  metadata?: Record<string, any>;
}

class CommunicationService {
  private static instance: CommunicationService;
  private listeners: Map<string, (messages: Message[]) => void> = new Map();
  private channels: Map<string, CommunicationChannel[]> = new Map();

  static getInstance(): CommunicationService {
    if (!CommunicationService.instance) {
      CommunicationService.instance = new CommunicationService();
    }
    return CommunicationService.instance;
  }

  // Real-time message listening
  async subscribeToMessages(provider: string, callback: (messages: Message[]) => void) {
    this.listeners.set(provider, callback);
    
    // Subscribe to real-time changes for this provider
    const channel = supabase
      .channel(`messages_${provider}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'communications',
          filter: `provider=eq.${provider}`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          this.fetchMessages(provider).then(callback);
        }
      )
      .subscribe();

    // Initial fetch
    const messages = await this.fetchMessages(provider);
    callback(messages);

    return () => {
      channel.unsubscribe();
      this.listeners.delete(provider);
    };
  }

  // Fetch messages for a provider
  async fetchMessages(provider: string, channelId?: string): Promise<Message[]> {
    try {
      let query = supabase
        .from('communications')
        .select('*')
        .eq('provider', provider)
        .order('message_ts', { ascending: false })
        .limit(50);

      if (channelId) {
        query = query.eq('thread_id', channelId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(this.transformToMessage);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
  }

  // Send a message
  async sendMessage(
    provider: string, 
    message: Partial<Message>,
    channelId?: string
  ): Promise<Message> {
    try {
      // For demo purposes, create a mock message
      const newMessage: Message = {
        id: `${Date.now()}_${Math.random()}`,
        provider: provider as any,
        thread_id: channelId,
        subject: message.subject,
        content: message.content || '',
        sender: message.sender || {
          id: 'current_user',
          name: 'David Johnson',
          email: 'david@johnsondev.com'
        },
        recipients: message.recipients || [],
        timestamp: new Date().toISOString(),
        attachments: message.attachments || [],
        metadata: message.metadata || {},
        priority: message.priority || 'medium',
        status: 'sent',
        reactions: []
      };

      // In production, this would call the appropriate API
      // For now, we'll simulate a real message send
      await this.simulateMessageSend(newMessage);

      // Notify listeners
      const callback = this.listeners.get(provider);
      if (callback) {
        const messages = await this.fetchMessages(provider, channelId);
        callback(messages);
      }

      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // AI Assistant integration
  async requestAIAssistance(request: AIAssistantRequest): Promise<AIAssistantResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('communication-ai-assistant', {
        body: request
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('AI Assistant request failed:', error);
      
      // Fallback mock response
      return this.generateMockAIResponse(request);
    }
  }

  // Draft smart reply
  async draftSmartReply(
    originalMessage: Message,
    context?: string,
    tone?: 'professional' | 'friendly' | 'formal'
  ): Promise<string> {
    const request: AIAssistantRequest = {
      action: 'draft_reply',
      content: originalMessage.content,
      context: {
        project_id: 'current_project',
      },
      instructions: `Draft a ${tone || 'professional'} reply. Context: ${context || 'Construction project communication'}`
    };

    const response = await this.requestAIAssistance(request);
    return response.result.content || '';
  }

  // Summarize conversation
  async summarizeConversation(messages: Message[]): Promise<string> {
    const conversationText = messages
      .map(m => `${m.sender.name}: ${m.content}`)
      .join('\n');

    const request: AIAssistantRequest = {
      action: 'summarize',
      content: conversationText,
      instructions: 'Provide a concise summary of this construction project conversation, highlighting key decisions, action items, and concerns.'
    };

    const response = await this.requestAIAssistance(request);
    return response.result.summary || '';
  }

  // Extract action items
  async extractActionItems(messages: Message[]): Promise<Array<{
    task: string;
    assignee?: string;
    due_date?: string;
    priority: string;
  }>> {
    const conversationText = messages
      .map(m => `${m.sender.name}: ${m.content}`)
      .join('\n');

    const request: AIAssistantRequest = {
      action: 'extract_action_items',
      content: conversationText,
      instructions: 'Extract clear action items from this construction project conversation.'
    };

    const response = await this.requestAIAssistance(request);
    return response.result.action_items || [];
  }

  // Analyze sentiment
  async analyzeSentiment(content: string): Promise<{
    overall: 'positive' | 'neutral' | 'negative';
    confidence: number;
    emotions: Record<string, number>;
  }> {
    const request: AIAssistantRequest = {
      action: 'sentiment_analysis',
      content,
      instructions: 'Analyze the sentiment and emotional tone of this construction project communication.'
    };

    const response = await this.requestAIAssistance(request);
    return response.result.sentiment || {
      overall: 'neutral',
      confidence: 0.5,
      emotions: {}
    };
  }

  // Get channels for a provider
  async getChannels(provider: string): Promise<CommunicationChannel[]> {
    // For demo purposes, return mock channels
    return this.getMockChannels(provider);
  }

  // Mark messages as read
  async markAsRead(messageIds: string[]): Promise<void> {
    // Implementation would update the database
    console.log('Marking messages as read:', messageIds);
  }

  // Add reaction to message
  async addReaction(messageId: string, emoji: string): Promise<void> {
    // Implementation would update the database
    console.log('Adding reaction:', messageId, emoji);
  }

  // Search messages
  async searchMessages(
    query: string, 
    provider?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<Message[]> {
    try {
      let supabaseQuery = supabase
        .from('communications')
        .select('*')
        .or(`subject.ilike.%${query}%,body.ilike.%${query}%`)
        .order('message_ts', { ascending: false })
        .limit(20);

      if (provider) {
        supabaseQuery = supabaseQuery.eq('provider', provider);
      }

      if (dateRange) {
        supabaseQuery = supabaseQuery
          .gte('message_ts', dateRange.start.toISOString())
          .lte('message_ts', dateRange.end.toISOString());
      }

      const { data, error } = await supabaseQuery;
      if (error) throw error;

      return (data || []).map(this.transformToMessage);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  // Private helper methods
  private transformToMessage(dbRecord: any): Message {
    return {
      id: dbRecord.id,
      provider: dbRecord.provider,
      thread_id: dbRecord.thread_id,
      subject: dbRecord.subject,
      content: dbRecord.body || '',
      sender: dbRecord.speaker || { id: 'unknown', name: 'Unknown' },
      recipients: dbRecord.participants || [],
      timestamp: dbRecord.message_ts,
      attachments: dbRecord.metadata?.attachments || [],
      metadata: dbRecord.metadata || {},
      priority: dbRecord.metadata?.priority || 'medium',
      status: 'delivered',
      reactions: dbRecord.metadata?.reactions || []
    };
  }

  private async simulateMessageSend(message: Message): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would make actual API calls to:
    // - Microsoft Graph API for Outlook/Teams
    // - Slack API for Slack
    // - Zoom API for Zoom
    // - WhatsApp Business API for WhatsApp
  }

  private generateMockAIResponse(request: AIAssistantRequest): AIAssistantResponse {
    switch (request.action) {
      case 'draft_reply':
        return {
          success: true,
          result: {
            content: `Thank you for the update. I'll review this and get back to you shortly. Best regards, David Johnson`
          }
        };
      
      case 'summarize':
        return {
          success: true,
          result: {
            summary: 'Key discussion points: Project timeline updates, budget considerations, and next milestones. Action items identified for follow-up.'
          }
        };
      
      case 'extract_action_items':
        return {
          success: true,
          result: {
            action_items: [
              {
                task: 'Review updated project timeline',
                assignee: 'Project Manager',
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'high'
              }
            ]
          }
        };
      
      case 'sentiment_analysis':
        return {
          success: true,
          result: {
            sentiment: {
              overall: 'neutral',
              confidence: 0.75,
              emotions: {
                positive: 0.3,
                neutral: 0.5,
                concern: 0.2
              }
            }
          }
        };
      
      default:
        return {
          success: false,
          result: {}
        };
    }
  }

  private getMockChannels(provider: string): CommunicationChannel[] {
    const channelTemplates = {
      slack: [
        { name: 'construction-updates', type: 'channel', members: 24, unread: 8 },
        { name: 'owner-contractor', type: 'channel', members: 2, unread: 2 },
        { name: 'vendor-coordination', type: 'channel', members: 15, unread: 4 }
      ],
      teams: [
        { name: 'Project Management', type: 'channel', members: 8, unread: 3 },
        { name: 'Weekly Owner Updates', type: 'channel', members: 2, unread: 1 },
        { name: 'Design Team', type: 'channel', members: 5, unread: 0 }
      ],
      outlook: [
        { name: 'Inbox', type: 'inbox', members: 1, unread: 3 },
        { name: 'Project Communications', type: 'inbox', members: 1, unread: 2 }
      ]
    };

    return (channelTemplates[provider as keyof typeof channelTemplates] || []).map((template, index) => ({
      id: `${provider}_${index}`,
      provider,
      name: template.name,
      type: template.type as any,
      members: Array.from({ length: template.members }, (_, i) => `user_${i}`),
      unread_count: template.unread,
      last_activity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {}
    }));
  }
}

export const communicationService = CommunicationService.getInstance();
export default communicationService;
