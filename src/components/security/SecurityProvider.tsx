/**
 * Security Provider Component
 * Integrates security measures with the existing React application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SecurityContext, initializeSecurity, performSecurityHealthCheck } from '../../lib/security';
import { supabase } from '../../integrations/supabase/client';
import { config } from '../../lib/config';

interface SecurityProviderContextType {
  securityContext: SecurityContext | null;
  isLoading: boolean;
  error: Error | null;
  refreshSecurity: () => Promise<void>;
  healthCheck: ReturnType<typeof performSecurityHealthCheck> | null;
}

const SecurityProviderContext = createContext<SecurityProviderContextType | undefined>(undefined);

export function useSecurityContext() {
  const context = useContext(SecurityProviderContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}

interface SecurityProviderProps {
  children: React.ReactNode;
}

// Utility function to safely execute Supabase operations
async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName: string,
  timeoutMs: number = 5000
): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timeout after ${timeoutMs}ms`)), timeoutMs)
    );
    
    return await Promise.race([operation(), timeoutPromise]);
  } catch (error) {
    console.warn(`${operationName} failed:`, error);
    return fallback;
  }
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [securityContext, setSecurityContext] = useState<SecurityContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [healthCheck, setHealthCheck] = useState<ReturnType<typeof performSecurityHealthCheck> | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSecurity = async () => {
    // Prevent concurrent refresh calls
    if (isRefreshing) {
      console.log('Security refresh already in progress, skipping...');
      return;
    }

    try {
      setIsRefreshing(true);
      setIsLoading(true);
      setError(null);

      // Create a fallback security context for development mode
      let context: SecurityContext = {
        session: null,
        ipAddress: 'client',
        userAgent: navigator.userAgent,
      };

      // Check if Supabase is properly configured
      const isSupabaseConfigured = () => {
        try {
          const url = config.supabaseUrl;
          const key = config.supabaseAnonKey;
          return url && url !== 'http://localhost:54321' && key && key !== 'dev-anon-key';
        } catch {
          return false;
        }
      };

      // Only attempt Supabase connection if properly configured AND not in dev mode
      if (isSupabaseConfigured() && import.meta.env.PROD) {
        console.log('Production mode: Attempting Supabase connection...');
        const sessionData = await safeSupabaseOperation(
          async () => supabase.auth.getSession(),
          { data: { session: null }, error: null },
          'Supabase getSession',
          5000
        );

        if (sessionData.error) {
          console.warn('Supabase session error:', sessionData.error);
        } else if (sessionData.data.session) {
          const session = sessionData.data.session;
          context.session = {
            id: session.access_token,
            email: session.user?.email || '',
            role: 'user' as any, // This would be fetched from user_roles table
            permissions: [],
            csrfToken: '', // Would be generated
            issuedAt: Date.now(),
            expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 24 * 60 * 60 * 1000,
            absoluteExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
            lastActivity: Date.now(),
          };
        }
      } else {
        console.log('Supabase not configured or using local defaults - using fallback security context');
      }

      setSecurityContext(context);

      // Perform health check
      try {
        const health = performSecurityHealthCheck();
        setHealthCheck(health);
      } catch (healthError) {
        console.warn('Security health check failed:', healthError);
        // Set a basic health check result
        setHealthCheck({
          status: 'warning',
          checks: [
            {
              name: 'Security Context',
              status: 'warn',
              message: isSupabaseConfigured() 
                ? 'Running with limited security features' 
                : 'Running with fallback security context (Supabase not configured)',
            },
          ],
        });
      }

    } catch (err) {
      console.error('Security initialization error:', err);
      setError(err instanceof Error ? err : new Error('Unknown security error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Initialize security system
    try {
      initializeSecurity();
    } catch (initError) {
      console.warn('Security initialization failed:', initError);
    }
    
    // Load initial security context
    refreshSecurity();

    // Check if Supabase is properly configured before setting up listeners
    const isSupabaseConfigured = () => {
      try {
        const url = config.supabaseUrl;
        const key = config.supabaseAnonKey;
        return url && url !== 'http://localhost:54321' && key && key !== 'dev-anon-key';
      } catch {
        return false;
      }
    };

    // Only set up auth state listener if Supabase is configured AND not in development
    let subscription: any = null;
    if (isSupabaseConfigured() && import.meta.env.PROD) {
      console.log('Setting up auth state change listener...');
      try {
        // Set up auth state change listener with timeout protection
        const setupAuthListener = async () => {
          const authData = await safeSupabaseOperation(
            async () => supabase.auth.onAuthStateChange((event, session) => {
              console.log('Auth state changed:', event);
              // Refresh security context on auth state change
              refreshSecurity();
            }),
            { data: { subscription: null } },
            'Auth state change listener setup',
            3000
          );
          
          if (authData.data.subscription) {
            subscription = authData.data.subscription;
          }
        };

        setupAuthListener();
      } catch (authError) {
        console.warn('Auth state change listener failed:', authError);
      }
    } else {
      console.log('Skipping auth state listener - Supabase not configured');
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (unsubError) {
          console.warn('Failed to unsubscribe from auth changes:', unsubError);
        }
      }
    };
  }, []);

  const value: SecurityProviderContextType = {
    securityContext,
    isLoading,
    error,
    refreshSecurity,
    healthCheck,
  };

  return (
    <SecurityProviderContext.Provider value={value}>
      {children}
    </SecurityProviderContext.Provider>
  );
}

/**
 * Security Guard Component - Wraps content that requires specific permissions
 */
interface SecurityGuardProps {
  requireAuth?: boolean;
  requirePermissions?: Array<{ action: string; resource: string }>;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function SecurityGuard({ 
  requireAuth = false, 
  requirePermissions = [], 
  fallback = <div>Access denied</div>,
  children 
}: SecurityGuardProps) {
  const { securityContext, isLoading, error } = useSecurityContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Security error: {error.message}</div>;
  }

  // Check authentication requirement
  if (requireAuth && !securityContext?.session) {
    return <>{fallback}</>;
  }

  // Check permission requirements
  if (requirePermissions.length > 0 && securityContext?.session) {
    const hasAllPermissions = requirePermissions.every(perm => {
      return securityContext.session?.permissions.some(sessionPerm =>
        (sessionPerm.action === '*' || sessionPerm.action === perm.action) &&
        (sessionPerm.resource === '*' || sessionPerm.resource === perm.resource)
      );
    });

    if (!hasAllPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Security Status Component - Shows security health status
 */
export function SecurityStatus() {
  const { healthCheck } = useSecurityContext();

  if (!healthCheck) {
    return null;
  }

  const statusColor = {
    healthy: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Security Status</h3>
      <div className={`mb-2 ${statusColor[healthCheck.status]}`}>
        Status: {healthCheck.status.toUpperCase()}
      </div>
      <div className="space-y-1">
        {healthCheck.checks.map((check, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className={
              check.status === 'pass' ? 'text-green-500' :
              check.status === 'warn' ? 'text-yellow-500' :
              'text-red-500'
            }>
              {check.status === 'pass' ? '✓' : check.status === 'warn' ? '⚠' : '✗'}
            </span>
            <span className="text-sm">{check.name}: {check.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}