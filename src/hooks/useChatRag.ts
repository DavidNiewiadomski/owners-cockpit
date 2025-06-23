
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

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

  const sendMessage = useMutation({
    mutationFn: async (question: string): Promise<void> => {
      console.log('Sending message (mock mode):', question);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock response based on the question
      let mockAnswer = "I'm currently in demo mode without authentication. ";
      let mockCitations: Citation[] = [];
      
      if (question.toLowerCase().includes('budget')) {
        mockAnswer += "Based on the project data, the total budget is $2.5M with 75% allocated. Key budget items include foundation work ($500K), steel structure ($800K), and electrical systems ($300K).";
        mockCitations = [
          {
            id: 'budget-1',
            snippet: 'Foundation work budget allocation: $500,000',
            source: 'Budget_Analysis_Q1.pdf',
            page: 2
          }
        ];
      } else if (question.toLowerCase().includes('task') || question.toLowerCase().includes('progress')) {
        mockAnswer += "Current tasks include foundation work (85% complete), framing phase (45% complete), and electrical installation (20% complete). The framing phase is currently behind schedule.";
        mockCitations = [
          {
            id: 'task-1',
            snippet: 'Foundation work is 85% complete as of latest update',
            source: 'Weekly_Progress_Report.pdf',
            page: 1
          }
        ];
      } else if (question.toLowerCase().includes('safety') || question.toLowerCase().includes('requirement')) {
        mockAnswer += "Safety requirements include mandatory hard hats, safety harnesses for work above 6 feet, daily safety briefings, and emergency evacuation procedures. All workers must complete OSHA 30-hour training.";
        mockCitations = [
          {
            id: 'safety-1',
            snippet: 'All personnel must wear hard hats and safety equipment',
            source: 'Safety_Manual_v2.pdf',
            page: 5
          }
        ];
      } else if (question.toLowerCase().includes('specification') || question.toLowerCase().includes('foundation')) {
        mockAnswer += "Foundation specifications call for reinforced concrete with 4000 PSI strength, #6 rebar at 12\" centers, and waterproof membrane application. Excavation depth is 8 feet below grade.";
        mockCitations = [
          {
            id: 'spec-1',
            snippet: 'Concrete strength requirement: 4000 PSI minimum',
            source: 'Foundation_Specifications.pdf',
            page: 3
          }
        ];
      } else {
        mockAnswer += "I can help you with questions about this construction project including budget status, task progress, safety requirements, specifications, and more. The system is currently in demo mode - try asking about budget, tasks, safety, or specifications!";
      }

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
