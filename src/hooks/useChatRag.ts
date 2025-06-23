
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  id: string;
  snippet: string;
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
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async (question: string): Promise<ChatResponse> => {
      const response = await fetch('/functions/v1/chatRag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase-token')}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          question,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      return response.json();
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
    onSuccess: (data: ChatResponse, question: string) => {
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    onError: (error: Error) => {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    },
  });

  const clearConversation = () => {
    setMessages([]);
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
  };
}

export type { ChatMessage, Citation, ChatResponse };
