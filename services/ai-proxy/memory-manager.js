export class MemoryManager {
  constructor() {
    // Simple in-memory storage for conversation history
    this.conversations = new Map();
  }

  getConversationKey(userId, projectId) {
    return `${userId}_${projectId}`;
  }

  async retrieve(userId, projectId) {
    const key = this.getConversationKey(userId, projectId);
    const conversation = this.conversations.get(key) || [];
    
    return {
      conversation_history: conversation,
      total_messages: conversation.length
    };
  }

  async store(userId, projectId, userMessage, assistantMessage) {
    const key = this.getConversationKey(userId, projectId);
    let conversation = this.conversations.get(key) || [];
    
    // Add messages
    conversation.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });
    
    conversation.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 messages to prevent memory issues
    if (conversation.length > 20) {
      conversation = conversation.slice(-20);
    }
    
    this.conversations.set(key, conversation);
    
    return {
      total_messages: conversation.length,
      was_summarized: false
    };
  }

  clear(userId, projectId) {
    const key = this.getConversationKey(userId, projectId);
    this.conversations.delete(key);
  }
}