
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, RoleState, RolePermissions } from '@/types/roles';
import { ROLE_CONFIGS } from '@/config/roleConfig';

interface AgentMemory {
  conversationSummary: string;
  persona: string;
  context: Record<string, any>;
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
  const [agentMemories, setAgentMemories] = useState<Record<UserRole, AgentMemory>>({
    Executive: { conversationSummary: '', persona: 'Executive', context: {} },
    Preconstruction: { conversationSummary: '', persona: 'Preconstruction Manager', context: {} },
    Construction: { conversationSummary: '', persona: 'Construction Manager', context: {} },
    Facilities: { conversationSummary: '', persona: 'Facilities Manager', context: {} },
    Sustainability: { conversationSummary: '', persona: 'Sustainability Manager', context: {} },
    Legal: { conversationSummary: '', persona: 'Legal/Contracts Manager', context: {} },
    Finance: { conversationSummary: '', persona: 'Finance Manager', context: {} },
  });

  // Load saved role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole') as UserRole;
    if (savedRole && Object.keys(ROLE_CONFIGS).includes(savedRole)) {
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
  }, []);

  // Save role state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedRole', currentRole);
    localStorage.setItem('roleState', JSON.stringify(roleState));
  }, [currentRole, roleState]);

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
    // For now, we'll just log it - in a real implementation, this would
    // update various UI components through refs or additional context
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

  const switchRole = useCallback((newRole: UserRole) => {
    console.log('Switching from', currentRole, 'to', newRole);
    
    // Save current role state
    const currentState = captureUIState();
    setRoleState(prev => ({
      ...prev,
      [currentRole]: currentState,
    }));

    // Update agent memory for current role
    setAgentMemories(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        conversationSummary: `Role context saved at ${new Date().toISOString()}`,
        context: { lastActiveProject: currentState.selectedProject },
      }
    }));

    // Switch to new role
    setCurrentRole(newRole);

    // Restore state for new role
    const newRoleState = roleState[newRole] || {};
    restoreUIState(newRoleState);

    console.log('Role switched to:', newRole, 'with permissions:', ROLE_CONFIGS[newRole].permissions);
  }, [currentRole, captureUIState, restoreUIState, roleState]);

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
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
