
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Citation {
  id: string;
  snippet: string;
  source: 'document' | 'communication';
  similarity?: number;
  speaker?: string;
  timestamp?: string;
  comm_type?: string;
  provider?: string;
  page?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  isStreaming?: boolean;
}

interface UseChatRagResult {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  resendLastMessage: () => void;
  error: Error | null;
}

export function useChatRag({ projectId }: { projectId: string }): UseChatRagResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initialize conversation ID on mount
    setConversationId(crypto.randomUUID());
  }, []);

  const clearConversation = () => {
    setMessages([]);
    setConversationId(crypto.randomUUID());
  };

  const resendLastMessage = async () => {
    if (messages.length === 0) return;

    // Find last user message using reverse iteration
    let lastMessage: Message | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastMessage = messages[i];
        break;
      }
    }
    
    if (!lastMessage) return;

    setMessages(prev => prev.filter(m => m.id !== lastMessage!.id));
    await sendMessage(lastMessage.content);
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      console.log('🤖 Sending message to AI:', content);

      const { data, error } = await supabase.functions.invoke('chatRag', {
        body: {
          question: content,
          project_id: projectId,
          conversation_id: conversationId,
          include_communications: true
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        citations: data.citations || []
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('❌ Chat error:', err);
      setError(err as Error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, conversationId]);

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    clearConversation,
    resendLastMessage,
    error,
  };
}
