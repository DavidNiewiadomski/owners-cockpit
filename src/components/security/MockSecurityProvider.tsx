/**
 * Mock Security Provider for Development
 * Provides the security context without any external connections
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SecurityContext } from '../../lib/security';

interface SecurityProviderContextType {
  securityContext: SecurityContext | null;
  isLoading: boolean;
  error: Error | null;
  refreshSecurity: () => Promise<void>;
  healthCheck: any;
}

const SecurityProviderContext = createContext<SecurityProviderContextType | undefined>(undefined);

export function useSecurityContext() {
  const context = useContext(SecurityProviderContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}

interface MockSecurityProviderProps {
  children: React.ReactNode;
}

export function MockSecurityProvider({ children }: MockSecurityProviderProps) {
  const [securityContext] = useState<SecurityContext>({
    session: null,
    ipAddress: 'client',
    userAgent: navigator.userAgent,
  });

  const refreshSecurity = async () => {
    console.log('Mock security refresh - no external connections');
  };

  const value: SecurityProviderContextType = {
    securityContext,
    isLoading: false,
    error: null,
    refreshSecurity,
    healthCheck: {
      status: 'warning',
      checks: [{
        name: 'Mock Security',
        status: 'warn',
        message: 'Using mock security provider for development'
      }]
    }
  };

  useEffect(() => {
    console.log('MockSecurityProvider initialized - no Supabase connections');
  }, []);

  return (
    <SecurityProviderContext.Provider value={value}>
      {children}
    </SecurityProviderContext.Provider>
  );
}

// Export components that might be imported from the original
export { MockSecurityProvider as SecurityProvider };
export const SecurityGuard = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SecurityStatus = () => null;