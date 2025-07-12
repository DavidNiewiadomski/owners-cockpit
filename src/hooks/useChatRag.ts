
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

      // Check if query needs external search
      const needsSearch = content.toLowerCase().includes('weather') || content.toLowerCase().includes('market') || content.toLowerCase().includes('news');
      let externalData = '';
      if (needsSearch) {
        // Mock external search instead of tool
        let externalData = '';
        if (needsSearch) {
          // Simulate web search with fetch or mock
          try {
            const response = await fetch(`https://api.example.com/search?q=${encodeURIComponent(content)}`);
            const data = await response.json();
            externalData = data.results ? data.results.join('\n') : '';
          } catch {} // Ignore errors
        }
      }

      // Query seeded DB for project context
      const { data: projectData } = await supabase.from('projects').select('*').limit(1);
      const context = projectData ? JSON.stringify(projectData[0]) : 'No project data';

      // Call actual Supabase function with enhanced prompt
      const result = await supabase.functions.invoke('chatRag', {
        body: {
          question: content,
          project_id: projectId,
          context: { external: externalData, db: context },
          match_count: 8
        }
      });

      if (result.error) throw result.error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.data.answer || 'No response',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(new Error('Failed to process message'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

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
