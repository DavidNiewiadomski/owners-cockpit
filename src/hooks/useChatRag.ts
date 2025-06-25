
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  const [isStreaming, _setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const _queryClient = useQueryClient();

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

      // For demo purposes, create a simulated response
      // TODO: Replace with actual Supabase function call when deployed
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const demoResponses = [
        "I'm your AI-powered construction assistant! I can help you with project management, risk analysis, compliance checks, and much more. What would you like to know about your project?",
        "Based on your query, I can analyze construction data, review documents, track project progress, and provide insights. I'm currently in demo mode - once fully connected, I'll have access to all your project data.",
        "I understand you're looking for information about your construction project. In the full system, I'll be able to access real-time data, documents, communications, and provide detailed analysis. How can I assist you today?",
        "Great question! In a fully operational state, I can help with: risk assessments, compliance monitoring, schedule optimization, cost analysis, document review, and communication summaries. What specific area interests you?"
      ];
      
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date().toISOString(),
        citations: [
          {
            id: 'demo-1',
            snippet: 'Demo citation from project documentation...',
            source: 'document' as const,
            similarity: 0.85
          }
        ]
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
