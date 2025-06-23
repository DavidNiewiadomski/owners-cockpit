
import { useState, useEffect } from 'react';
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
  const { 
    currentRole, 
    getRoleConfig, 
    updateAgentMemory, 
    getActiveAgentMemory, 
    getRolePersona 
  } = useRole();

  // Load role-specific conversation history when component mounts or role changes
  useEffect(() => {
    const activeMemory = getActiveAgentMemory();
    if (activeMemory.messageHistory.length > 0) {
      // Restore conversation from role-specific memory
      const restoredMessages: ChatMessage[] = activeMemory.messageHistory.map(msg => ({
        ...msg,
        citations: [],
        isStreaming: false
      }));
      setMessages(restoredMessages);
      console.log(`Restored ${restoredMessages.length} messages for ${currentRole} role`);
    } else {
      // Start fresh for this role
      setMessages([]);
      console.log(`Starting fresh conversation for ${currentRole} role`);
    }
  }, [currentRole, getActiveAgentMemory]);

  // Update agent memory whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      updateAgentMemory(messages);
    }
  }, [messages, updateAgentMemory]);

  const sendMessage = useMutation({
    mutationFn: async (question: string): Promise<void> => {
      const roleConfig = getRoleConfig(currentRole);
      const rolePersona = getRolePersona(currentRole);
      
      console.log('Sending message with role context:', currentRole, question);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate role-specific mock response with enhanced context awareness
      let mockAnswer = `As your ${roleConfig.displayName} assistant, `;
      let mockCitations: Citation[] = [];
      
      // Role-specific responses with enhanced context
      if (currentRole === 'Executive') {
        if (question.toLowerCase().includes('budget')) {
          mockAnswer += "here's your executive summary: Total portfolio value is $2.5M with 75% budget utilization across all projects. Key performance indicators show strong ROI potential with managed risk exposure.";
        } else if (question.toLowerCase().includes('progress')) {
          mockAnswer += "your portfolio overview shows 65% overall completion rate. Three projects are on track for Q3 delivery, with strategic milestones achieved on schedule. Recommend resource reallocation for optimal outcomes.";
        } else if (question.toLowerCase().includes('risk')) {
          mockAnswer += "current portfolio risk assessment identifies weather delays as primary concern, with mitigation strategies in place. Financial exposure is within acceptable parameters.";
        } else {
          mockAnswer += "I provide strategic insights and executive summaries. I can help with portfolio oversight, investment decisions, and high-level performance metrics.";
        }
      } else if (currentRole === 'Construction') {
        if (question.toLowerCase().includes('safety')) {
          mockAnswer += "current safety status: Zero incidents this week, 100% PPE compliance achieved. Daily safety briefings completed with all crews. OSHA inspection readiness at 95%.";
        } else if (question.toLowerCase().includes('progress')) {
          mockAnswer += "today's construction update: Foundation 85% complete, structural steel 45% complete. MEP rough-in scheduled for next week. Material deliveries on schedule, weather conditions favorable.";
        } else if (question.toLowerCase().includes('schedule')) {
          mockAnswer += "project timeline analysis: Current activities are 2 days ahead of baseline schedule. Critical path shows no delays. Resource allocation optimized for continued progress.";
        } else {
          mockAnswer += "I'm your construction operations assistant. I can help with daily progress tracking, safety management, quality control, and schedule optimization.";
        }
      } else if (currentRole === 'Finance') {
        if (question.toLowerCase().includes('budget')) {
          mockAnswer += "financial analysis: $1.875M spent of $2.5M total budget (75% utilization). Cost breakdown: Labor 42%, Materials 32%, Equipment 16%, Other 10%. Variance tracking within 3% tolerance.";
        } else if (question.toLowerCase().includes('cost')) {
          mockAnswer += "cost performance metrics: Actual cost per square foot is $125 vs. budgeted $120 (4% variance). Change orders total $45K within contingency allowance.";
        } else if (question.toLowerCase().includes('cash')) {
          mockAnswer += "cash flow projection: Current period shows positive flow of $180K. Upcoming major expenditures: Equipment rental $85K, Material delivery $120K. Liquidity position strong.";
        } else {
          mockAnswer += "I provide comprehensive financial analysis, budget variance reporting, cash flow management, and cost control insights.";
        }
      } else if (currentRole === 'Facilities') {
        if (question.toLowerCase().includes('maintenance')) {
          mockAnswer += "facilities status: Preventive maintenance 98% current, HVAC systems operating at optimal efficiency. 3 work orders pending, 12 completed this week. Energy consumption 5% below target.";
        } else if (question.toLowerCase().includes('energy')) {
          mockAnswer += "energy management report: Current consumption 15% below baseline, HVAC optimization yielding $2,800 monthly savings. LED retrofit ROI tracking ahead of projections.";
        } else if (question.toLowerCase().includes('building')) {
          mockAnswer += "building performance metrics: All systems operational with 99.2% uptime. Temperature variance within ±2°F, humidity controlled at 45-55%. Occupant satisfaction scores at 4.2/5.0.";
        } else {
          mockAnswer += "I manage building operations, preventive maintenance scheduling, energy optimization, and facilities performance tracking.";
        }
      } else if (currentRole === 'Sustainability') {
        if (question.toLowerCase().includes('energy')) {
          mockAnswer += "sustainability metrics: Energy usage down 18% YoY, renewable energy comprising 35% of total consumption. Carbon footprint reduced by 1,200 tons CO2 equivalent this quarter.";
        } else if (question.toLowerCase().includes('waste')) {
          mockAnswer += "waste management performance: 78% diversion rate achieved, recycling up 15% from last period. Composting program yielding 2.3 tons monthly organic waste processing.";
        } else if (question.toLowerCase().includes('certification')) {
          mockAnswer += "certification status: LEED Gold tracking at 85% completion, ENERGY STAR score improved to 92. ESG reporting compliance at 100% with quarterly targets met.";
        } else {
          mockAnswer += "I focus on environmental performance, sustainability metrics, ESG compliance, and green building optimization strategies.";
        }
      } else if (currentRole === 'Legal') {
        if (question.toLowerCase().includes('contract')) {
          mockAnswer += "contract portfolio overview: 28 active agreements totaling $4.2M value. 3 contracts expiring next quarter requiring renewal action. Compliance tracking at 98% with no material breaches.";
        } else if (question.toLowerCase().includes('compliance')) {
          mockAnswer += "regulatory compliance status: All permits current, insurance certificates updated. Environmental compliance audit scheduled. No outstanding legal issues requiring immediate attention.";
        } else if (question.toLowerCase().includes('risk')) {
          mockAnswer += "legal risk assessment: Low exposure profile with standard construction risks mitigated. Contract terms provide adequate protection. Recommend quarterly compliance review.";
        } else {
          mockAnswer += "I provide contract management, regulatory compliance oversight, risk assessment, and legal document administration support.";
        }
      } else if (currentRole === 'Preconstruction') {
        if (question.toLowerCase().includes('feasibility')) {
          mockAnswer += "project feasibility analysis: Site A shows 15% higher ROI potential with optimal zoning compliance. Construction timeline estimated at 18 months with $2.1M total cost projection.";
        } else if (question.toLowerCase().includes('site')) {
          mockAnswer += "site evaluation summary: 3 locations under review with Site B offering best utility access. Geotechnical surveys complete, environmental clearances pending for 2 sites.";
        } else if (question.toLowerCase().includes('planning')) {
          mockAnswer += "preconstruction planning status: Design development 70% complete, permit applications submitted. Material procurement planning initiated with 12-week lead times identified.";
        } else {
          mockAnswer += "I assist with project planning, feasibility studies, site selection analysis, and preconstruction coordination activities.";
        }
      } else {
        // Default response with role context
        mockAnswer += `I'm specialized for ${roleConfig.displayName} functions. ${rolePersona}`;
      }

      // Role-appropriate citations
      mockCitations = [
        {
          id: `${currentRole.toLowerCase()}-doc-1`,
          snippet: `${roleConfig.displayName} specific data and analysis`,
          source: `${roleConfig.displayName}_Report_${new Date().toISOString().split('T')[0]}.pdf`,
          page: Math.floor(Math.random() * 10) + 1
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
    // Clear the role-specific memory
    updateAgentMemory([]);
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
