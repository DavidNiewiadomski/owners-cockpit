/**
 * Local Security Provider for Development
 * Safely connects to local Supabase without hanging
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../../integrations/supabase/client';

// Simple security context type
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

interface LocalSecurityProviderProps {
  children: React.ReactNode;
}

// Safe config access
const getSafeConfig = () => {
  try {
    // Try to access config values safely
    const url = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
    return { url, key, valid: url && key && url !== 'placeholder-url' };
  } catch (error) {
    console.warn('Config access failed:', error);
    return { url: '', key: '', valid: false };
  }
};

export function LocalSecurityProvider({ children }: LocalSecurityProviderProps) {
  const [securityContext, setSecurityContext] = useState<SecurityContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<SecurityProviderContextType['connectionStatus']>('connecting');
  const [healthCheck, setHealthCheck] = useState<any>(null);
  
  // Circuit breaker
  const connectionAttempts = useRef(0);
  const maxAttempts = 3;
  const lastAttemptTime = useRef(0);
  const retryDelay = 5000; // 5 seconds between retries
  
  // Check if we should attempt connection
  const shouldAttemptConnection = () => {
    const now = Date.now();
    if (connectionAttempts.current >= maxAttempts) {
      if (now - lastAttemptTime.current < retryDelay) {
        return false; // Still in cooldown
      }
      // Reset after cooldown
      connectionAttempts.current = 0;
    }
    return true;
  };

  const refreshSecurity = async () => {
    if (!shouldAttemptConnection()) {
      console.log('Circuit breaker active - skipping connection attempt');
      return;
    }

    try {
      setIsLoading(true);
      setConnectionStatus('connecting');
      connectionAttempts.current++;
      lastAttemptTime.current = Date.now();

      // Create base security context
      const context: SecurityContext = {
        session: null,
        ipAddress: 'client',
        userAgent: navigator.userAgent,
      };

      // Check config
      const config = getSafeConfig();
      if (!config.valid) {
        console.log('Invalid config - using offline mode');
        setConnectionStatus('disconnected');
        setSecurityContext(context);
        setHealthCheck({
          status: 'offline',
          message: 'No valid Supabase configuration'
        });
        return;
      }

      // Try to get session with aggressive timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 second timeout
        
        // Create a promise that will resolve with session or timeout
        const sessionPromise = new Promise<any>(async (resolve, reject) => {
          try {
            const { data, error } = await supabase.auth.getSession();
            clearTimeout(timeoutId);
            if (error) reject(error);
            else resolve(data);
          } catch (err) {
            clearTimeout(timeoutId);
            reject(err);
          }
        });

        const sessionData = await Promise.race([
          sessionPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session timeout')), 1500)
          )
        ]);

        if (sessionData?.session) {
          context.session = sessionData.session;
          console.log('Successfully connected to local Supabase');
        }
        
        setConnectionStatus('connected');
        connectionAttempts.current = 0; // Reset on success
        
      } catch (sessionError) {
        console.warn('Session fetch failed (non-critical):', sessionError);
        setConnectionStatus('disconnected');
      }

      setSecurityContext(context);
      setHealthCheck({
        status: connectionStatus,
        message: `Local Supabase: ${connectionStatus}`,
        attempts: connectionAttempts.current
      });

    } catch (err) {
      console.error('Security refresh error:', err);
      setError(err instanceof Error ? err : new Error('Security error'));
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initialize = async () => {
      if (!mounted) return;
      
      console.log('LocalSecurityProvider initializing...');
      
      // Initial connection attempt
      await refreshSecurity();

      // Only set up auth listener if we connected successfully
      if (connectionStatus === 'connected' && mounted) {
        try {
          // Set up auth listener with error handling
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            if (mounted && connectionStatus === 'connected') {
              // Debounce refresh
              setTimeout(() => refreshSecurity(), 100);
            }
          });
          authSubscription = subscription;
        } catch (err) {
          console.warn('Auth listener setup failed:', err);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (authSubscription) {
        try {
          authSubscription.unsubscribe();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []); // Empty deps - only run once

  const value: SecurityProviderContextType = {
    securityContext,
    isLoading,
    error,
    refreshSecurity,
    healthCheck,
    connectionStatus,
  };

  return (
    <SecurityProviderContext.Provider value={value}>
      {/* Optional: Show connection status in development */}
      {import.meta.env.DEV && (
        <div style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          padding: '5px 10px',
          background: connectionStatus === 'connected' ? '#10b981' : 
                     connectionStatus === 'error' ? '#ef4444' : '#f59e0b',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}>
          Supabase: {connectionStatus}
          {connectionAttempts.current > 0 && ` (${connectionAttempts.current}/${maxAttempts})`}
        </div>
      )}
      {children}
    </SecurityProviderContext.Provider>
  );
}

// Export with same name as original for compatibility
export { LocalSecurityProvider as SecurityProvider };
export const SecurityGuard = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SecurityStatus = () => null;