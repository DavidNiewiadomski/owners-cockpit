/**
 * Rate limiting and CSRF protection utilities
 * Prevents brute force attacks and unauthorized cross-site requests
 */

import { config } from '../config';
import { sanitizeRateLimitKey } from './inputValidation';

// Rate limiting store (in-memory for now, should use Redis in production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// CSRF token store
const csrfTokenStore = new Map<string, { token: string; expires: number }>();

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// Default rate limiting configs for different endpoints
export const RATE_LIMIT_CONFIGS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  register: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 attempts per hour
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  upload: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 uploads per hour
  aiChat: { windowMs: 5 * 60 * 1000, maxRequests: 20 }, // 20 AI requests per 5 minutes
  default: { windowMs: config.rateLimitWindowMs, maxRequests: config.rateLimitMaxRequests },
} as const;

/**
 * Rate limiting error
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number,
    public limit: number,
    public remaining: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * CSRF error
 */
export class CSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSRFError';
  }
}

/**
 * Generate a secure random token
 */
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Clean up expired CSRF tokens
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [key, entry] of csrfTokenStore.entries()) {
    if (now > entry.expires) {
      csrfTokenStore.delete(key);
    }
  }
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.default
): { allowed: boolean; limit: number; remaining: number; resetTime: number } {
  // Sanitize the identifier to prevent injection attacks
  const sanitizedKey = sanitizeRateLimitKey(identifier);
  
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean up
    cleanupExpiredEntries();
  }
  
  let entry = rateLimitStore.get(sanitizedKey);
  
  if (!entry) {
    // First request
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
      firstRequest: now,
    };
    rateLimitStore.set(sanitizedKey, entry);
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Check if window has expired
  if (now > entry.resetTime) {
    // Reset the window
    entry.count = 1;
    entry.resetTime = now + config.windowMs;
    entry.firstRequest = now;
    rateLimitStore.set(sanitizedKey, entry);
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment counter
  entry.count++;
  rateLimitStore.set(sanitizedKey, entry);
  
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Apply rate limiting to a function
 */
export function withRateLimit<T extends (...args: any[]) => any>(
  fn: T,
  getIdentifier: (...args: Parameters<T>) => string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.default
): T {
  return ((...args: Parameters<T>) => {
    const identifier = getIdentifier(...args);
    const result = checkRateLimit(identifier, config);
    
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
        result.limit,
        result.remaining
      );
    }
    
    return fn(...args);
  }) as T;
}

/**
 * Generate CSRF token for a user session
 */
export function generateCSRFToken(sessionId: string): string {
  // Clean up expired tokens periodically
  if (Math.random() < 0.1) {
    cleanupExpiredTokens();
  }
  
  const token = generateSecureToken();
  const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  csrfTokenStore.set(sessionId, { token, expires });
  return token;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const entry = csrfTokenStore.get(sessionId);
  
  if (!entry) {
    return false;
  }
  
  // Check if token is expired
  if (Date.now() > entry.expires) {
    csrfTokenStore.delete(sessionId);
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  return token.length === entry.token.length && 
    crypto.subtle.timingSafeEqual(
      new TextEncoder().encode(token),
      new TextEncoder().encode(entry.token)
    );
}

/**
 * Invalidate CSRF token
 */
export function invalidateCSRFToken(sessionId: string): void {
  csrfTokenStore.delete(sessionId);
}

/**
 * Get rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };
}

/**
 * Security headers for HTTP responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: This should be more restrictive in production
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  };
}

/**
 * Middleware factory for rate limiting
 */
export function createRateLimitMiddleware(
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.default
) {
  return (identifier: string) => {
    const result = checkRateLimit(identifier, config);
    
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
        result.limit,
        result.remaining
      );
    }
    
    return result;
  };
}

// Export store sizes for monitoring
export function getStoreSizes(): { rateLimitStore: number; csrfTokenStore: number } {
  return {
    rateLimitStore: rateLimitStore.size,
    csrfTokenStore: csrfTokenStore.size,
  };
}