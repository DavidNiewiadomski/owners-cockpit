
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, RoleState, RolePermissions } from '@/types/roles';
import { ROLE_CONFIGS } from '@/config/roleConfig';

interface AgentMemory {
  conversationSummary: string;
  persona: string;
  context: Record<string, any>;
  messageHistory: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

interface RoleContextType {
  currentRole: UserRole;
  roleState: Record<UserRole, RoleState>;
  agentMemories: Record<UserRole, AgentMemory>;
  permissions: RolePermissions;
  switchRole: (newRole: UserRole) => void;
  updateRoleState: (updates: Partial<RoleState>) => void;
  getRoleConfig: (role: UserRole) => typeof ROLE_CONFIGS[UserRole];
  captureUIState: () => RoleState;
  restoreUIState: (state: RoleState) => void;
  updateAgentMemory: (messages: any[]) => void;
  getActiveAgentMemory: () => AgentMemory;
  getRolePersona: (role: UserRole) => string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: React.ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('Executive');
  const [roleState, setRoleState] = useState<Record<UserRole, RoleState>>({
    Executive: {},
    Preconstruction: {},
    Construction: {},
    Facilities: {},
    Sustainability: {},
    Legal: {},
    Finance: {},
  });
  
  // Enhanced agent memories with conversation history
  const [agentMemories, setAgentMemories] = useState<Record<UserRole, AgentMemory>>({
    Executive: { 
      conversationSummary: '', 
      persona: 'Executive Assistant focused on strategic insights and high-level summaries', 
      context: {},
      messageHistory: []
    },
    Preconstruction: { 
      conversationSummary: '', 
      persona: 'Preconstruction Manager Assistant specializing in project planning and feasibility', 
      context: {},
      messageHistory: []
    },
    Construction: { 
      conversationSummary: '', 
      persona: 'Construction Manager Assistant focused on operational controls and safety', 
      context: {},
      messageHistory: []
    },
    Facilities: { 
      conversationSummary: '', 
      persona: 'Facilities Manager Assistant for building operations and maintenance', 
      context: {},
      messageHistory: []
    },
    Sustainability: { 
      conversationSummary: '', 
      persona: 'Sustainability Manager Assistant for environmental metrics and ESG reporting', 
      context: {},
      messageHistory: []
    },
    Legal: { 
      conversationSummary: '', 
      persona: 'Legal/Contracts Assistant for compliance and contract management', 
      context: {},
      messageHistory: []
    },
    Finance: { 
      conversationSummary: '', 
      persona: 'Finance Manager Assistant for budgets, costs, and financial analysis', 
      context: {},
      messageHistory: []
    },
  });

  // Load saved role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole') as UserRole;
    if (savedRole && Object.keys(ROLE_CONFIGS).includes(savedRole)) {
      console.log('Loading saved role from localStorage:', savedRole);
      setCurrentRole(savedRole);
    }

    const savedRoleState = localStorage.getItem('roleState');
    if (savedRoleState) {
      try {
        setRoleState(JSON.parse(savedRoleState));
      } catch (error) {
        console.error('Failed to parse saved role state:', error);
      }
    }

    const savedAgentMemories = localStorage.getItem('agentMemories');
    if (savedAgentMemories) {
      try {
        const parsed = JSON.parse(savedAgentMemories);
        // Convert timestamp strings back to Date objects
        Object.keys(parsed).forEach(role => {
          if (parsed[role].messageHistory) {
            parsed[role].messageHistory = parsed[role].messageHistory.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
          }
        });
        setAgentMemories(parsed);
      } catch (error) {
        console.error('Failed to parse saved agent memories:', error);
      }
    }
  }, []);

  // Save role state and agent memories to localStorage when they change
  useEffect(() => {
    console.log('Saving to localStorage - currentRole:', currentRole);
    localStorage.setItem('selectedRole', currentRole);
    localStorage.setItem('roleState', JSON.stringify(roleState));
    localStorage.setItem('agentMemories', JSON.stringify(agentMemories));
  }, [currentRole, roleState, agentMemories]);

  const captureUIState = useCallback((): RoleState => {
    // Capture current UI state - this would be expanded based on actual UI components
    const currentState: RoleState = {
      selectedProject: roleState[currentRole]?.selectedProject,
      filters: roleState[currentRole]?.filters || {},
      activeView: roleState[currentRole]?.activeView || 'dashboard',
      dashboardConfig: roleState[currentRole]?.dashboardConfig || {},
    };
    
    console.log('Capturing UI state for role:', currentRole, currentState);
    return currentState;
  }, [currentRole, roleState]);

  const restoreUIState = useCallback((state: RoleState) => {
    console.log('Restoring UI state:', state);
    // This would trigger UI updates based on the restored state
  }, []);

  const updateRoleState = useCallback((updates: Partial<RoleState>) => {
    setRoleState(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        ...updates,
      }
    }));
  }, [currentRole]);

  const updateAgentMemory = useCallback((messages: any[]) => {
    setAgentMemories(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        messageHistory: messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        conversationSummary: messages.length > 0 ? 
          `Last updated: ${new Date().toISOString()} with ${messages.length} messages` : 
          prev[currentRole].conversationSummary
      }
    }));
  }, [currentRole]);

  const getActiveAgentMemory = useCallback(() => {
    return agentMemories[currentRole];
  }, [agentMemories, currentRole]);

  const getRolePersona = useCallback((role: UserRole) => {
    const roleConfig = ROLE_CONFIGS[role];
    const basePersona = agentMemories[role].persona;
    
    // Enhanced persona based on role-specific context
    const personaEnhancements = {
      Executive: "Provide strategic, high-level insights with executive summaries. Focus on ROI, portfolio performance, and key decisions.",
      Preconstruction: "Offer detailed planning assistance with feasibility analysis, cost estimation, and site evaluation expertise.",
      Construction: "Deliver operational support with safety protocols, schedule management, and real-time construction monitoring.",
      Facilities: "Focus on building operations, preventive maintenance, energy efficiency, and occupant comfort optimization.",
      Sustainability: "Emphasize environmental metrics, ESG compliance, energy management, and sustainability best practices.",
      Legal: "Concentrate on contract management, compliance requirements, risk mitigation, and regulatory adherence.",
      Finance: "Provide financial analysis, budget tracking, cost control insights, and investment performance metrics."
    };

    return `${basePersona}. ${personaEnhancements[role]} Use ${roleConfig.displayName} terminology and focus on ${roleConfig.description}.`;
  }, [agentMemories]);

  const switchRole = useCallback((newRole: UserRole) => {
    console.log('RoleContext: Switching from', currentRole, 'to', newRole);
    
    // Save current role state
    const currentState = captureUIState();
    setRoleState(prev => ({
      ...prev,
      [currentRole]: currentState,
    }));

    // Switch to new role - force re-render by using functional update
    setCurrentRole(() => {
      console.log('RoleContext: Setting new role state to:', newRole);
      return newRole;
    });

    // Restore state for new role
    const newRoleState = roleState[newRole] || {};
    restoreUIState(newRoleState);

    console.log('RoleContext: Role switched to:', newRole, 'with persona:', getRolePersona(newRole));
  }, [currentRole, captureUIState, restoreUIState, roleState, getRolePersona]);

  const getRoleConfig = useCallback((role: UserRole) => {
    return ROLE_CONFIGS[role];
  }, []);

  const permissions = ROLE_CONFIGS[currentRole].permissions;

  const value: RoleContextType = {
    currentRole,
    roleState,
    agentMemories,
    permissions,
    switchRole,
    updateRoleState,
    getRoleConfig,
    captureUIState,
    restoreUIState,
    updateAgentMemory,
    getActiveAgentMemory,
    getRolePersona,
  };

  console.log('RoleProvider rendering with currentRole:', currentRole);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
