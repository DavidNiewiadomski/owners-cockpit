import { supabase } from '@/lib/supabase';

interface AIRequest {
  message: string;
  projectId: string;
  userId?: string;
  context?: any;
  enableVoice?: boolean;
  conversationId?: string;
}

interface AIResponse {
  message: string;
  audioUrl?: string;
  conversationId: string;
  toolCalls?: any[];
  metadata: {
    responseTime: number;
    model: string;
    hasVoice: boolean;
    tokensUsed: number;
  };
  success: boolean;
  error?: string;
}

class EnterpriseAIService {
  private conversationId: string | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Initialize conversation session
      this.conversationId = this.generateConversationId();
      this.isInitialized = true;
      console.log('🏢 Enterprise AI Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Enterprise AI:', error);
    }
  }

  private generateConversationId(): string {
    return `conversation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async processConversation(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      if (!this.isInitialized) {
        throw new Error('Enterprise AI Service not initialized');
      }

      // Use the conversation ID from request or create new one
      const conversationId = request.conversationId || this.conversationId || this.generateConversationId();

      // Call Supabase Edge Function for AI processing
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: request.message,
          projectId: request.projectId,
          userId: request.userId,
          context: request.context,
          enableVoice: request.enableVoice || true,
          conversationId: conversationId,
          persona: 'atlas_construction_assistant',
          capabilities: {
            toolCalling: true,
            voiceSynthesis: true,
            conversationalMemory: true,
            realTimeData: true
          }
        }
      });

      if (error) {
        throw new Error(`AI processing failed: ${error.message}`);
      }

      const response: AIResponse = {
        message: data.message || 'I apologize, but I encountered an issue processing your request.',
        audioUrl: data.audioUrl,
        conversationId: conversationId,
        toolCalls: data.toolCalls || [],
        metadata: {
          responseTime: Date.now() - startTime,
          model: data.model || 'gpt-4-turbo',
          hasVoice: !!data.audioUrl,
          tokensUsed: data.tokensUsed || 0
        },
        success: true
      };

      console.log('✅ Enterprise AI Response:', {
        responseTime: response.metadata.responseTime,
        hasVoice: response.metadata.hasVoice,
        toolsUsed: response.toolCalls?.length || 0
      });

      return response;

    } catch (error) {
      console.error('❌ Enterprise AI Error:', error);
      
      return {
        message: `I apologize for the technical difficulty. As your construction AI assistant, I'm currently experiencing connectivity issues. Please try again in a moment. In the meantime, I can still help with general project management questions.`,
        conversationId: request.conversationId || this.conversationId || 'error_session',
        metadata: {
          responseTime: Date.now() - startTime,
          model: 'error_fallback',
          hasVoice: false,
          tokensUsed: 0
        },
        success: false,
        error: error.message
      };
    }
  }

  async processVoiceInput(audioBlob: Blob, projectId: string): Promise<AIResponse> {
    try {
      // Convert audio blob to base64 for edge function
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: {
          audioData: base64Audio,
          projectId: projectId
        }
      });

      if (error || !data.transcript) {
        throw new Error('Voice transcription failed');
      }

      // Process the transcribed text as a normal conversation
      return await this.processConversation({
        message: data.transcript,
        projectId: projectId,
        enableVoice: true,
        conversationId: this.conversationId || undefined
      });

    } catch (error) {
      console.error('❌ Voice processing error:', error);
      return {
        message: "I'm sorry, I couldn't process your voice input. Please try speaking again or type your message.",
        conversationId: this.conversationId || 'voice_error',
        metadata: {
          responseTime: 0,
          model: 'voice_error',
          hasVoice: false,
          tokensUsed: 0
        },
        success: false,
        error: error.message
      };
    }
  }

  async getConversationHistory(limit: number = 10): Promise<any[]> {
    try {
      if (!this.conversationId) return [];

      const { data, error } = await supabase.functions.invoke('get-conversation-history', {
        body: {
          conversationId: this.conversationId,
          limit: limit
        }
      });

      if (error) {
        console.error('❌ Failed to get conversation history:', error);
        return [];
      }

      return data.history || [];
    } catch (error) {
      console.error('❌ Conversation history error:', error);
      return [];
    }
  }

  async clearConversation(): Promise<void> {
    try {
      if (this.conversationId) {
        await supabase.functions.invoke('clear-conversation', {
          body: { conversationId: this.conversationId }
        });
      }
      this.conversationId = this.generateConversationId();
      console.log('🧹 Conversation cleared, new session started');
    } catch (error) {
      console.error('❌ Failed to clear conversation:', error);
    }
  }

  getConversationId(): string | null {
    return this.conversationId;
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  // Health check for enterprise monitoring
  async healthCheck(): Promise<{ status: string; latency: number; services: any }> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-health-check', {
        body: { timestamp: startTime }
      });

      const latency = Date.now() - startTime;

      if (error) {
        return {
          status: 'degraded',
          latency,
          services: { ai: 'error', voice: 'unknown', database: 'unknown' }
        };
      }

      return {
        status: 'healthy',
        latency,
        services: data.services || { ai: 'healthy', voice: 'healthy', database: 'healthy' }
      };
    } catch (error) {
      return {
        status: 'down',
        latency: Date.now() - startTime,
        services: { ai: 'error', voice: 'error', database: 'error' }
      };
    }
  }
}

// Singleton instance for enterprise use
export const enterpriseAI = new EnterpriseAIService();
export default enterpriseAI;
