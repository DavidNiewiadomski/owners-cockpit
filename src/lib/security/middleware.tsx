/**
 * Comprehensive security middleware
 * Integrates all security measures: authentication, authorization, rate limiting, CSRF protection
 */

import React from 'react';
import { createAuthMiddleware, UserSession, AuthenticationError, AuthorizationError } from './authentication';
import { createRateLimitMiddleware, RateLimitError, getSecurityHeaders, getRateLimitHeaders } from './rateLimiting';
import { validateAndSanitize, ValidationError } from './inputValidation';
import { config } from '../config';

// Security context for requests
export interface SecurityContext {
  session: UserSession | null;
  ipAddress: string;
  userAgent: string;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    resetTime: number;
  };
}

// Security middleware options
export interface SecurityMiddlewareOptions {
  requireAuth?: boolean;
  requirePermissions?: Array<{ action: string; resource: string }>;
  requireCSRF?: boolean;
  rateLimitConfig?: string; // Key from RATE_LIMIT_CONFIGS
  validateInput?: boolean;
  sanitizeInput?: boolean;
}

// Security middleware result
export interface SecurityMiddlewareResult {
  context: SecurityContext;
  headers: Record<string, string>;
  sanitizedInput?: any;
}

/**
 * Main security middleware factory
 */
export function createSecurityMiddleware(options: SecurityMiddlewareOptions = {}) {
  const authMiddleware = createAuthMiddleware({
    requireAuth: options.requireAuth,
    requirePermissions: options.requirePermissions,
    requireCSRF: options.requireCSRF,
  });

  const rateLimitMiddleware = options.rateLimitConfig 
    ? createRateLimitMiddleware() 
    : null;

  return async (request: {
    sessionId?: string;
    csrfToken?: string;
    ipAddress: string;
    userAgent: string;
    input?: any;
  }): Promise<SecurityMiddlewareResult> => {
    const headers = getSecurityHeaders();
    
    try {
      // Rate limiting
      let rateLimitInfo;
      if (rateLimitMiddleware) {
        const identifier = `${request.ipAddress}:${request.sessionId || 'anonymous'}`;
        rateLimitInfo = rateLimitMiddleware(identifier);
        
        // Add rate limit headers
        Object.assign(headers, getRateLimitHeaders(
          rateLimitInfo.limit,
          rateLimitInfo.remaining,
          rateLimitInfo.resetTime
        ));
      }

      // Authentication and authorization
      const session = await authMiddleware(
        request.sessionId || '',
        request.csrfToken,
        request.ipAddress
      );

      // Input validation and sanitization
      let sanitizedInput;
      if (options.validateInput && request.input) {
        sanitizedInput = await validateAndSanitizeInput(request.input, options.sanitizeInput);
      }

      const context: SecurityContext = {
        session,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        rateLimitInfo,
      };

      return {
        context,
        headers,
        sanitizedInput,
      };
    } catch (error) {
      // Add appropriate error headers
      if (error instanceof RateLimitError) {
        headers['Retry-After'] = error.retryAfter.toString();
      }
      
      throw error;
    }
  };
}

/**
 * Validate and sanitize input based on type
 */
async function validateAndSanitizeInput(input: any, sanitize: boolean = true): Promise<any> {
  if (typeof input === 'string') {
    return sanitize ? validateAndSanitize.userInput(input) : input;
  }
  
  if (Array.isArray(input)) {
    return Promise.all(input.map(item => validateAndSanitizeInput(item, sanitize)));
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      const sanitizedKey = sanitize ? validateAndSanitize.userInput(key, 100) : key;
      sanitized[sanitizedKey] = await validateAndSanitizeInput(value, sanitize);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Express-style middleware adapter
 */
export function createExpressSecurityMiddleware(options: SecurityMiddlewareOptions = {}) {
  const securityMiddleware = createSecurityMiddleware(options);
  
  return async (req: any, res: any, next: any) => {
    try {
      const result = await securityMiddleware({
        sessionId: req.headers['authorization']?.replace('Bearer ', ''),
        csrfToken: req.headers['x-csrf-token'],
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        input: req.body,
      });
      
      // Set security headers
      Object.entries(result.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
      
      // Attach security context to request
      req.security = result.context;
      req.sanitizedInput = result.sanitizedInput;
      
      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        res.status(401).json({ error: 'Authentication required', code: error.code });
      } else if (error instanceof AuthorizationError) {
        res.status(403).json({ error: 'Insufficient permissions', required: error.requiredPermission });
      } else if (error instanceof RateLimitError) {
        res.status(429).json({ 
          error: 'Rate limit exceeded', 
          retryAfter: error.retryAfter,
          limit: error.limit,
          remaining: error.remaining 
        });
      } else if (error instanceof ValidationError) {
        res.status(400).json({ error: 'Invalid input', field: error.field });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

/**
 * Supabase Edge Function middleware adapter
 */
export function createSupabaseSecurityMiddleware(options: SecurityMiddlewareOptions = {}) {
  const securityMiddleware = createSecurityMiddleware(options);
  
  return async (req: Request): Promise<{ context: SecurityContext; headers: Headers; sanitizedInput?: any }> => {
    const headers = new Headers();
    
    try {
      const result = await securityMiddleware({
        sessionId: req.headers.get('authorization')?.replace('Bearer ', ''),
        csrfToken: req.headers.get('x-csrf-token'),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        input: req.method === 'POST' ? await req.json() : null,
      });
      
      // Set security headers
      Object.entries(result.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return {
        context: result.context,
        headers,
        sanitizedInput: result.sanitizedInput,
      };
    } catch (error) {
      // Set error headers
      Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      if (error instanceof RateLimitError) {
        headers.set('Retry-After', error.retryAfter.toString());
      }
      
      throw error;
    }
  };
}

/**
 * React component HOC for client-side security
 */
export function withSecurity<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: SecurityMiddlewareOptions = {}
) {
  return function SecurityWrapper(props: T) {
    const [securityContext, setSecurityContext] = React.useState<SecurityContext | null>(null);
    const [error, setError] = React.useState<Error | null>(null);
    
    React.useEffect(() => {
      const checkSecurity = async () => {
        try {
          const securityMiddleware = createSecurityMiddleware(options);
          const sessionId = localStorage.getItem('supabase.auth.token');
          const csrfToken = localStorage.getItem('csrf_token');
          
          const result = await securityMiddleware({
            sessionId: sessionId || undefined,
            csrfToken: csrfToken || undefined,
            ipAddress: 'client',
            userAgent: navigator.userAgent,
          });
          
          setSecurityContext(result.context);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Security check failed'));
        }
      };
      
      checkSecurity();
    }, []);
    
    if (error) {
      if (error instanceof AuthenticationError) {
        return <div>Authentication required. Please log in.</div>;
      }
      if (error instanceof AuthorizationError) {
        return <div>Access denied. Insufficient permissions.</div>;
      }
      if (error instanceof RateLimitError) {
        return <div>Rate limit exceeded. Please try again later.</div>;
      }
      return <div>Security error: {error.message}</div>;
    }
    
    if (!securityContext) {
      return <div>Loading...</div>;
    }
    
    return <Component {...props} securityContext={securityContext} />;
  };
}

/**
 * Security audit utilities
 */
export const securityAudit = {
  /**
   * Log security event
   */
  logEvent: (event: {
    type: 'auth' | 'authz' | 'rate_limit' | 'validation' | 'csrf';
    action: string;
    userId?: string;
    sessionId?: string;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    details?: any;
  }) => {
    // In production, this should send to a secure logging service
    console.log(`[SECURITY] ${event.type.toUpperCase()}: ${event.action}`, {
      timestamp: new Date().toISOString(),
      ...event,
    });
  },

  /**
   * Generate security report
   */
  generateReport: () => {
    // This would generate a comprehensive security report
    // Including rate limit statistics, failed auth attempts, etc.
    return {
      timestamp: new Date().toISOString(),
      // Add actual metrics here
    };
  },
};

// Export security middleware presets
export const SECURITY_PRESETS = {
  public: {
    requireAuth: false,
    requireCSRF: false,
    validateInput: true,
    sanitizeInput: true,
  },
  authenticated: {
    requireAuth: true,
    requireCSRF: true,
    validateInput: true,
    sanitizeInput: true,
  },
  admin: {
    requireAuth: true,
    requirePermissions: [{ action: 'admin', resource: '*' }],
    requireCSRF: true,
    validateInput: true,
    sanitizeInput: true,
  },
  api: {
    requireAuth: true,
    rateLimitConfig: 'api',
    validateInput: true,
    sanitizeInput: true,
  },
} as const;