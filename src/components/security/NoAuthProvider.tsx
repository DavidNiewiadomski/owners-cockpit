import React, { createContext, useContext } from 'react';

interface SecurityContext {
  session: any | null;
  ipAddress: string;
  userAgent: string;
}

interface SecurityProviderContextType {
  securityContext: SecurityContext | null;
  isLoading: boolean;
  error: Error | null;
  refreshSecurity: () => Promise<void>;
  healthCheck: any;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const SecurityProviderContext = createContext<SecurityProviderContextType | undefined>(undefined);

export function useSecurityContext() {
  const context = useContext(SecurityProviderContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}

// No-auth provider for demo
export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: SecurityProviderContextType = {
    securityContext: {
      session: null,
      ipAddress: '127.0.0.1',
      userAgent: 'Demo User'
    },
    isLoading: false,
    error: null,
    refreshSecurity: async () => {},
    healthCheck: { status: 'demo' },
    connectionStatus: 'disconnected'
  };

  return (
    <SecurityProviderContext.Provider value={value}>
      {children}
    </SecurityProviderContext.Provider>
  );
};