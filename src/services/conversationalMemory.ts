import { v4 as uuidv4 } from 'uuid';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  projectId?: string;
  metadata?: {
    toolCalls?: ToolCall[];
    context?: any;
    sentiment?: 'positive' | 'neutral' | 'negative';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    topics?: string[];
  };
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: any;
  result?: any;
  timestamp: string;
}

export interface ConversationSession {
  id: string;
  projectId: string;
  userId?: string;
  startTime: string;
  lastActivity: string;
  messages: ConversationMessage[];
  summary?: string;
  topics: string[];
  keyInsights: string[];
  actionItems: string[];
}

class ConversationalMemoryService {
  private sessions: Map<string, ConversationSession> = new Map();
  private currentSessionId: string | null = null;
  private readonly maxSessionsInMemory = 50;
  private readonly sessionTimeoutMs = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.loadFromStorage();
  }

  // Session Management
  startSession(projectId: string, userId?: string): string {
    const sessionId = uuidv4();
    const session: ConversationSession = {
      id: sessionId,
      projectId,
      userId,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messages: [],
      topics: [],
      keyInsights: [],
      actionItems: []
    };

    this.sessions.set(sessionId, session);
    this.currentSessionId = sessionId;
    this.saveToStorage();
    
    console.log(`🧠 Started new conversation session: ${sessionId}`);
    return sessionId;
  }

  getCurrentSession(): ConversationSession | null {
    if (!this.currentSessionId) return null;
    return this.sessions.get(this.currentSessionId) || null;
  }

  switchToSession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      this.currentSessionId = sessionId;
      return true;
    }
    return false;
  }

  // Message Management
  addMessage(
    content: string,
    role: 'user' | 'assistant' | 'system',
    metadata?: ConversationMessage['metadata']
  ): ConversationMessage {
    const message: ConversationMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date().toISOString(),
      projectId: this.getCurrentSession()?.projectId,
      metadata
    };

    const session = this.getCurrentSession();
    if (session) {
      session.messages.push(message);
      session.lastActivity = new Date().toISOString();
      
      // Update session topics based on message content
      this.updateSessionTopics(session, content);
      
      // Extract action items and insights
      if (role === 'assistant') {
        this.extractInsights(session, content);
      }
      
      this.saveToStorage();
    }

    return message;
  }

  // Context Retrieval
  getConversationContext(limit: number = 20): ConversationMessage[] {
    const session = this.getCurrentSession();
    if (!session) return [];
    
    return session.messages.slice(-limit);
  }

  getProjectHistory(projectId: string, limit: number = 100): ConversationMessage[] {
    const projectMessages: ConversationMessage[] = [];
    
    for (const session of this.sessions.values()) {
      if (session.projectId === projectId) {
        projectMessages.push(...session.messages);
      }
    }
    
    return projectMessages
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-limit);
  }

  getRelevantContext(query: string, projectId?: string): {
    messages: ConversationMessage[];
    insights: string[];
    actionItems: string[];
  } {
    const lowerQuery = query.toLowerCase();
    const relevantMessages: ConversationMessage[] = [];
    const insights: string[] = [];
    const actionItems: string[] = [];

    for (const session of this.sessions.values()) {
      if (projectId && session.projectId !== projectId) continue;

      // Find messages with relevant content
      for (const message of session.messages) {
        if (this.isRelevantMessage(message, lowerQuery)) {
          relevantMessages.push(message);
        }
      }

      // Collect relevant insights and action items
      insights.push(...session.keyInsights.filter(insight => 
        insight.toLowerCase().includes(lowerQuery)
      ));
      
      actionItems.push(...session.actionItems.filter(item => 
        item.toLowerCase().includes(lowerQuery)
      ));
    }

    return {
      messages: relevantMessages.slice(-10), // Last 10 relevant messages
      insights: insights.slice(-5),
      actionItems: actionItems.slice(-5)
    };
  }

  // Advanced Memory Features
  getPersonalizationData(): {
    preferences: Record<string, any>;
    communicationStyle: string;
    frequentTopics: string[];
    expertiseAreas: string[];
  } {
    const allMessages = Array.from(this.sessions.values()).flatMap(s => s.messages);
    const userMessages = allMessages.filter(m => m.role === 'user');
    
    return {
      preferences: this.extractPreferences(userMessages),
      communicationStyle: this.analyzeCommunicationStyle(userMessages),
      frequentTopics: this.getFrequentTopics(),
      expertiseAreas: this.identifyExpertiseAreas(userMessages)
    };
  }

  generateSystemPrompt(projectId?: string): string {
    const personalization = this.getPersonalizationData();
    const recentContext = this.getConversationContext(5);
    const projectHistory = projectId ? this.getProjectHistory(projectId, 20) : [];

    let systemPrompt = `You are Sarah, an advanced AI construction management assistant with extensive experience in building projects, construction management, and facility operations.

PERSONALITY & COMMUNICATION:
- Professional yet approachable, with deep construction expertise
- Proactive in offering solutions and identifying potential issues
- Clear, concise communication with technical accuracy
- Always focused on safety, efficiency, and project success

CURRENT CONTEXT:`;

    if (projectHistory.length > 0) {
      systemPrompt += `\n- This is an ongoing conversation about Project ${projectId}`;
      systemPrompt += `\n- Previous interactions show focus on: ${personalization.frequentTopics.slice(0, 3).join(', ')}`;
    }

    if (recentContext.length > 0) {
      systemPrompt += `\n- Recent conversation context: ${recentContext.map(m => `${m.role}: ${m.content.substring(0, 100)}`).join(' | ')}`;
    }

    systemPrompt += `

CAPABILITIES:
- Real-time access to construction progress, financials, schedules, and safety data
- Integration with project management tools and communication platforms
- Ability to perform actions like sending notifications, creating reports, updating statuses
- Voice-optimized responses with ElevenLabs text-to-speech

RESPONSE GUIDELINES:
- Keep responses conversational and natural for voice interaction
- Always provide actionable insights when possible
- Mention specific data points and numbers when available
- Offer to perform relevant actions (create reports, send messages, schedule meetings)
- For complex topics, break down information into digestible parts

USER PREFERENCES:
- Communication style: ${personalization.communicationStyle}
- Areas of expertise: ${personalization.expertiseAreas.join(', ')}
- Frequent topics: ${personalization.frequentTopics.slice(0, 5).join(', ')}`;

    return systemPrompt;
  }

  // Private Helper Methods
  private updateSessionTopics(session: ConversationSession, content: string): void {
    const topics = this.extractTopics(content);
    for (const topic of topics) {
      if (!session.topics.includes(topic)) {
        session.topics.push(topic);
      }
    }
  }

  private extractTopics(content: string): string[] {
    const topicKeywords = {
      'schedule': ['schedule', 'timeline', 'deadline', 'milestone', 'delay'],
      'budget': ['budget', 'cost', 'expense', 'financial', 'price', 'money'],
      'safety': ['safety', 'incident', 'hazard', 'ppe', 'osha', 'accident'],
      'quality': ['quality', 'inspection', 'defect', 'rework', 'standards'],
      'materials': ['materials', 'delivery', 'supplier', 'inventory', 'equipment'],
      'team': ['team', 'contractor', 'subcontractor', 'crew', 'workers'],
      'permits': ['permit', 'approval', 'inspection', 'compliance', 'code'],
      'weather': ['weather', 'rain', 'temperature', 'conditions', 'climate']
    };

    const lowerContent = content.toLowerCase();
    const foundTopics: string[] = [];

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        foundTopics.push(topic);
      }
    }

    return foundTopics;
  }

  private extractInsights(session: ConversationSession, content: string): void {
    // Simple pattern matching for insights
    const insightPatterns = [
      /(?:I (?:found|discovered|identified|noticed) that|analysis shows|data indicates) (.+?)(?:\.|$)/gi,
      /(?:recommendation|suggestion|advice): (.+?)(?:\.|$)/gi,
      /(?:key finding|important note|critical issue): (.+?)(?:\.|$)/gi
    ];

    for (const pattern of insightPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (!session.keyInsights.includes(match)) {
            session.keyInsights.push(match);
          }
        }
      }
    }

    // Extract action items
    const actionPatterns = [
      /(?:I recommend|you should|action needed|next step): (.+?)(?:\.|$)/gi,
      /(?:would you like me to|I can|shall I) (.+?)(?:\?|$)/gi
    ];

    for (const pattern of actionPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (!session.actionItems.includes(match)) {
            session.actionItems.push(match);
          }
        }
      }
    }
  }

  private isRelevantMessage(message: ConversationMessage, query: string): boolean {
    const content = message.content.toLowerCase();
    const topics = message.metadata?.topics || [];
    
    return content.includes(query) || 
           topics.some(topic => topic.toLowerCase().includes(query)) ||
           (message.metadata?.toolCalls?.some(call => 
             call.name.toLowerCase().includes(query)
           ) || false);
  }

  private extractPreferences(messages: ConversationMessage[]): Record<string, any> {
    // Analyze user preferences from message patterns
    return {
      preferredReportFormat: 'detailed', // Default
      communicationFrequency: 'regular',
      focusAreas: this.extractTopics(messages.map(m => m.content).join(' '))
    };
  }

  private analyzeCommunicationStyle(messages: ConversationMessage[]): string {
    const avgLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;
    
    if (avgLength < 50) return 'concise';
    if (avgLength > 200) return 'detailed';
    return 'balanced';
  }

  private getFrequentTopics(): string[] {
    const topicCounts = new Map<string, number>();
    
    for (const session of this.sessions.values()) {
      for (const topic of session.topics) {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      }
    }
    
    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic);
  }

  private identifyExpertiseAreas(messages: ConversationMessage[]): string[] {
    const expertiseKeywords = {
      'construction': ['construction', 'building', 'structural', 'foundation'],
      'project_management': ['project', 'management', 'planning', 'coordination'],
      'finance': ['budget', 'cost', 'financial', 'accounting'],
      'safety': ['safety', 'compliance', 'regulations', 'osha'],
      'engineering': ['engineering', 'design', 'technical', 'specifications']
    };

    const content = messages.map(m => m.content).join(' ').toLowerCase();
    const areas: string[] = [];

    for (const [area, keywords] of Object.entries(expertiseKeywords)) {
      const matches = keywords.filter(keyword => content.includes(keyword)).length;
      if (matches >= 3) { // Threshold for expertise
        areas.push(area);
      }
    }

    return areas;
  }

  // Storage Management
  private saveToStorage(): void {
    try {
      const data = {
        sessions: Array.from(this.sessions.entries()),
        currentSessionId: this.currentSessionId
      };
      localStorage.setItem('conversational_memory', JSON.stringify(data));
    } catch (error) {
      console.error('❌ Failed to save memory to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('conversational_memory');
      if (data) {
        const parsed = JSON.parse(data);
        this.sessions = new Map(parsed.sessions);
        this.currentSessionId = parsed.currentSessionId;
        
        // Clean up old sessions
        this.cleanupOldSessions();
        
        console.log(`🧠 Loaded ${this.sessions.size} conversation sessions from storage`);
      }
    } catch (error) {
      console.error('❌ Failed to load memory from storage:', error);
    }
  }

  private cleanupOldSessions(): void {
    const now = Date.now();
    const sessionsToDelete: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      const lastActivity = new Date(session.lastActivity).getTime();
      if (now - lastActivity > this.sessionTimeoutMs) {
        sessionsToDelete.push(sessionId);
      }
    }

    for (const sessionId of sessionsToDelete) {
      this.sessions.delete(sessionId);
    }

    // Keep only recent sessions if too many
    if (this.sessions.size > this.maxSessionsInMemory) {
      const sorted = Array.from(this.sessions.entries())
        .sort((a, b) => new Date(b[1].lastActivity).getTime() - new Date(a[1].lastActivity).getTime());
      
      this.sessions.clear();
      sorted.slice(0, this.maxSessionsInMemory).forEach(([id, session]) => {
        this.sessions.set(id, session);
      });
    }
  }

  // Public API
  exportConversations(): string {
    return JSON.stringify({
      sessions: Array.from(this.sessions.entries()),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  importConversations(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.sessions) {
        this.sessions = new Map(parsed.sessions);
        this.saveToStorage();
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to import conversations:', error);
    }
    return false;
  }

  clearAllMemory(): void {
    this.sessions.clear();
    this.currentSessionId = null;
    localStorage.removeItem('conversational_memory');
    console.log('🧠 All conversational memory cleared');
  }
}

export const conversationalMemory = new ConversationalMemoryService();
export default conversationalMemory;
