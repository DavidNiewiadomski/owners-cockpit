/**
 * Security module exports
 * Provides a centralized interface for all security utilities
 */

// Authentication and authorization
export {
  login,
  logout,
  validateSession,
  hasPermission,
  requirePermission,
  getUserPermissions,
  createAuthMiddleware,
  generateSessionToken,
  hashPassword,
  verifyPassword,
  UserRole,
  UserSession,
  Permission,
  AuthenticationError,
  AuthorizationError,
} from './authentication';

// Input validation and sanitization
export {
  sanitize,
  validate,
  validateAndSanitize,
  sanitizeRateLimitKey,
  ValidationError,
  VALIDATION_PATTERNS,
} from './inputValidation';

// Rate limiting and CSRF protection
export {
  checkRateLimit,
  withRateLimit,
  generateCSRFToken,
  validateCSRFToken,
  invalidateCSRFToken,
  getRateLimitHeaders,
  getSecurityHeaders,
  createRateLimitMiddleware,
  getStoreSizes,
  RateLimitError,
  CSRFError,
  RATE_LIMIT_CONFIGS,
} from './rateLimiting';

// Security middleware
export {
  createSecurityMiddleware,
  createExpressSecurityMiddleware,
  createSupabaseSecurityMiddleware,
  withSecurity,
  securityAudit,
  SecurityContext,
  SecurityMiddlewareOptions,
  SecurityMiddlewareResult,
  SECURITY_PRESETS,
} from './middleware';

// Common security utilities
export { config, ConfigError } from '../config';

/**
 * Initialize security system
 */
export function initializeSecurity() {
  // Set up global error handlers
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      securityAudit.logEvent({
        type: 'validation',
        action: 'javascript_error',
        ipAddress: 'client',
        userAgent: navigator.userAgent,
        success: false,
        details: {
          message: event.error?.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      securityAudit.logEvent({
        type: 'validation',
        action: 'promise_rejection',
        ipAddress: 'client',
        userAgent: navigator.userAgent,
        success: false,
        details: {
          reason: event.reason,
        },
      });
    });
  }

  // Set up security headers if running in a server environment
  if (typeof globalThis !== 'undefined' && 'Response' in globalThis) {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Add security headers to responses
      const securityHeaders = getSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    };
  }
}

/**
 * Security health check
 */
export function performSecurityHealthCheck(): {
  status: 'healthy' | 'warning' | 'error';
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
  }>;
} {
  const checks = [];
  
  // Check environment configuration
  try {
    config.supabaseUrl; // This will throw if not configured
    checks.push({
      name: 'Environment Configuration',
      status: 'pass' as const,
      message: 'Environment variables properly configured',
    });
  } catch (error) {
    checks.push({
      name: 'Environment Configuration',
      status: 'fail' as const,
      message: `Configuration error: ${error.message}`,
    });
  }
  
  // Check if running in production with proper secrets
  if (config.nodeEnv === 'production') {
    if (!config.jwtSecret || !config.encryptionKey) {
      checks.push({
        name: 'Production Secrets',
        status: 'fail' as const,
        message: 'Missing required secrets for production environment',
      });
    } else {
      checks.push({
        name: 'Production Secrets',
        status: 'pass' as const,
        message: 'Production secrets properly configured',
      });
    }
  }
  
  // Check rate limiting store size
  const storeSizes = getStoreSizes();
  if (storeSizes.rateLimitStore > 10000) {
    checks.push({
      name: 'Rate Limiting Store',
      status: 'warn' as const,
      message: `Rate limit store size is large (${storeSizes.rateLimitStore}). Consider using Redis.`,
    });
  } else {
    checks.push({
      name: 'Rate Limiting Store',
      status: 'pass' as const,
      message: 'Rate limiting store size is healthy',
    });
  }
  
  // Check CSRF token store size
  if (storeSizes.csrfTokenStore > 10000) {
    checks.push({
      name: 'CSRF Token Store',
      status: 'warn' as const,
      message: `CSRF token store size is large (${storeSizes.csrfTokenStore}). Consider cleanup.`,
    });
  } else {
    checks.push({
      name: 'CSRF Token Store',
      status: 'pass' as const,
      message: 'CSRF token store size is healthy',
    });
  }
  
  // Determine overall status
  const hasErrors = checks.some(check => check.status === 'fail');
  const hasWarnings = checks.some(check => check.status === 'warn');
  
  let status: 'healthy' | 'warning' | 'error' = 'healthy';
  if (hasErrors) {
    status = 'error';
  } else if (hasWarnings) {
    status = 'warning';
  }
  
  return { status, checks };
}

/**
 * Security testing utilities
 */
export const securityTesting = {
  /**
   * Test input validation
   */
  testInputValidation: () => {
    const testCases = [
      { input: '<script>alert("xss")</script>', expected: 'sanitized' },
      { input: "'; DROP TABLE users; --", expected: 'blocked' },
      { input: 'normal input', expected: 'allowed' },
    ];
    
    const results = testCases.map(testCase => {
      try {
        validateAndSanitize.userInput(testCase.input);
        return { ...testCase, result: 'allowed' };
      } catch (error) {
        return { ...testCase, result: 'blocked', error: error.message };
      }
    });
    
    return results;
  },

  /**
   * Test rate limiting
   */
  testRateLimiting: async () => {
    const testKey = 'test_rate_limit';
    const results = [];
    
    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit(testKey, { windowMs: 60000, maxRequests: 5 });
      results.push({ attempt: i + 1, allowed: result.allowed, remaining: result.remaining });
    }
    
    return results;
  },

  /**
   * Test CSRF protection
   */
  testCSRFProtection: () => {
    const sessionId = 'test_session';
    const token = generateCSRFToken(sessionId);
    
    return {
      tokenGenerated: !!token,
      validToken: validateCSRFToken(sessionId, token),
      invalidToken: validateCSRFToken(sessionId, 'invalid_token'),
    };
  },
};

// Import securityAudit for the exports
import { securityAudit } from './middleware';
import { getSecurityHeaders, getStoreSizes } from './rateLimiting';