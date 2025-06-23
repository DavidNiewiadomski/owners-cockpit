import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRole } from '@/contexts/RoleContext';

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
  const { currentRole, getRoleConfig } = useRole();

  const sendMessage = useMutation({
    mutationFn: async (question: string): Promise<void> => {
      console.log('Sending message (mock mode) with role:', currentRole, question);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate role-specific mock response
      const roleConfig = getRoleConfig(currentRole);
      let mockAnswer = `As a ${roleConfig.displayName}, I can help you with ${roleConfig.description.toLowerCase()}. `;
      let mockCitations: Citation[] = [];
      
      // Role-specific responses
      if (currentRole === 'Executive') {
        if (question.toLowerCase().includes('budget')) {
          mockAnswer += "The overall project is tracking at 75% budget utilization with key cost centers performing within expected parameters. Total project value: $2.5M.";
        } else if (question.toLowerCase().includes('progress')) {
          mockAnswer += "Project is 65% complete and on track for Q3 delivery. Key milestones achieved on schedule.";
        } else {
          mockAnswer += "I provide high-level strategic insights and executive summaries. Ask me about overall project status, budget performance, or strategic decisions.";
        }
      } else if (currentRole === 'Construction') {
        if (question.toLowerCase().includes('safety')) {
          mockAnswer += "Current safety metrics: 0 incidents this week, 100% hard hat compliance, daily safety briefings completed. OSHA requirements up to date.";
        } else if (question.toLowerCase().includes('progress')) {
          mockAnswer += "Daily progress: Foundation 85% complete, framing 45% complete. Electrical rough-in starting next week. Weather delays minimal.";
        } else {
          mockAnswer += "I can help with construction progress, safety protocols, daily operations, and resource management.";
        }
      } else if (currentRole === 'Finance') {
        if (question.toLowerCase().includes('budget')) {
          mockAnswer += "Budget analysis: $1.875M spent of $2.5M budget (75%). Largest expenses: Labor $800K, Materials $600K, Equipment $300K. Variance tracking within 3%.";
        } else if (question.toLowerCase().includes('cost')) {
          mockAnswer += "Cost per square foot: $125. Original estimate: $120/sqft. Variance acceptable within project parameters.";
        } else {
          mockAnswer += "I provide detailed financial analysis, budget tracking, cost control, and payment status updates.";
        }
      } else if (currentRole === 'Facilities') {
        if (question.toLowerCase().includes('maintenance')) {
          mockAnswer += "Maintenance schedule: HVAC inspection due next week, elevator service current, fire safety systems tested quarterly.";
        } else if (question.toLowerCase().includes('building')) {
          mockAnswer += "Building systems operational: 99.2% uptime, energy efficiency within targets, all safety systems functional.";
        } else {
          mockAnswer += "I manage building operations, maintenance schedules, work orders, and facility performance metrics.";
        }
      } else {
        // Default role-based response
        mockAnswer += `I'm configured for ${roleConfig.displayName} tasks. Ask me about areas relevant to ${roleConfig.description.toLowerCase()}.`;
      }

      // Role-appropriate citations
      mockCitations = [
        {
          id: `${currentRole.toLowerCase()}-1`,
          snippet: `${roleConfig.displayName} report data`,
          source: `${roleConfig.displayName}_Report.pdf`,
          page: 1
        }
      ];

      // Create assistant message for the response
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: mockAnswer,
        citations: mockCitations,
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
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
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
