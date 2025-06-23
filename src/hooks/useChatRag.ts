import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
  isStreaming?: boolean;
}

interface Citation {
  id: string;
  snippet: string;
  source?: string;
  page?: number;
}

interface ChatResponse {
  answer: string;
  citations: Citation[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface UseChatRagOptions {
  projectId: string;
  conversationId?: string;
}

export function useChatRag({ projectId, conversationId }: UseChatRagOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const sendMessage = useMutation({
    mutationFn: async (question: string): Promise<void> => {
      if (!user) {
        throw new Error('You must be signed in to use the chat feature');
      }

      console.log('Sending message to chatRag function...');
      
      const { data, error } = await supabase.functions.invoke('chatRag', {
        body: {
          project_id: projectId,
          question,
          conversation_id: conversationId,
        },
      });

      console.log('Response data:', data);
      console.log('Response error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        
        // Check for specific Gemini API errors
        if (error.message && error.message.includes('API key')) {
          throw new Error('Gemini API key issue. Please check your API key configuration.');
        }
        
        // Check for quota errors
        if (error.message && error.message.includes('quota') || error.message.includes('rate limit')) {
          throw new Error('Gemini API quota exceeded. Please try again later or check your quota limits.');
        }
        
        throw new Error(error.message || 'Failed to send message');
      }

      // Create assistant message for the response
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: data.answer || 'No response received',
        citations: data.citations || [],
        timestamp: new Date(),
        isStreaming: false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    },
    onMutate: async (question: string) => {
      setIsLoading(true);
      
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: (error: Error) => {
      console.error('Chat error:', error);
      
      // Add error message with more specific information
      let errorContent = `Sorry, I encountered an error: ${error.message}`;
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        errorContent = `⚠️ Gemini API quota exceeded. Please try again later.`;
      } else if (error.message.includes('API key')) {
        errorContent = `🔑 Gemini API key issue. Please verify your API key is configured correctly.`;
      } else if (error.message.includes('signed in')) {
        errorContent = `🔐 Please sign in to use the chat feature.`;
      }
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setStreamingMessageId(null);
    },
  });

  const clearConversation = () => {
    setMessages([]);
    setStreamingMessageId(null);
  };

  const resendLastMessage = () => {
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'user');
    
    if (lastUserMessage) {
      // Remove messages after the last user message
      const lastUserIndex = messages.lastIndexOf(lastUserMessage);
      setMessages(prev => prev.slice(0, lastUserIndex + 1));
      
      // Resend the message
      sendMessage.mutate(lastUserMessage.content);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
    clearConversation,
    resendLastMessage,
    error: sendMessage.error,
    isError: sendMessage.isError,
    isStreaming: streamingMessageId !== null,
  };
}

export type { ChatMessage, Citation, ChatResponse };
