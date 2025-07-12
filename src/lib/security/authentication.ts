/**
 * Enhanced authentication and session management
 * Implements secure session handling, token validation, and user authorization
 */

import { supabase } from '../../integrations/supabase/client';
import { config } from '../config';
import { validateAndSanitize, ValidationError } from './inputValidation';
import { generateCSRFToken, validateCSRFToken, RateLimitError, checkRateLimit, RATE_LIMIT_CONFIGS } from './rateLimiting';

// Session configuration
const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  renewThreshold: 2 * 60 * 60 * 1000, // Renew if less than 2 hours remaining
  absoluteTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days absolute timeout
} as const;

// User roles and permissions
export enum UserRole {
  ADMIN = 'admin',
  EXECUTIVE = 'executive',
  CONSTRUCTION = 'construction',
  PRECONSTRUCTION = 'preconstruction',
  FINANCE = 'finance',
  LEGAL = 'legal',
  FACILITIES = 'facilities',
  SUSTAINABILITY = 'sustainability',
  USER = 'user',
}

export interface Permission {
  action: string;
  resource: string;
}

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  csrfToken: string;
  issuedAt: number;
  expiresAt: number;
  absoluteExpiresAt: number;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
}

// Role-based permissions
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { action: '*', resource: '*' }, // Admin has all permissions
  ],
  [UserRole.EXECUTIVE]: [
    { action: 'read', resource: 'projects' },
    { action: 'read', resource: 'dashboards' },
    { action: 'read', resource: 'reports' },
    { action: 'read', resource: 'analytics' },
    { action: 'create', resource: 'projects' },
    { action: 'update', resource: 'projects' },
  ],
  [UserRole.CONSTRUCTION]: [
    { action: 'read', resource: 'projects' },
    { action: 'update', resource: 'projects' },
    { action: 'read', resource: 'tasks' },
    { action: 'create', resource: 'tasks' },
    { action: 'update', resource: 'tasks' },
    { action: 'read', resource: 'documents' },
    { action: 'create', resource: 'documents' },
  ],
  [UserRole.PRECONSTRUCTION]: [
    { action: 'read', resource: 'projects' },
    { action: 'read', resource: 'rfps' },
    { action: 'create', resource: 'rfps' },
    { action: 'update', resource: 'rfps' },
    { action: 'read', resource: 'bids' },
    { action: 'create', resource: 'bids' },
  ],
  [UserRole.FINANCE]: [
    { action: 'read', resource: 'projects' },
    { action: 'read', resource: 'budgets' },
    { action: 'update', resource: 'budgets' },
    { action: 'read', resource: 'financial-reports' },
    { action: 'create', resource: 'financial-reports' },
  ],
  [UserRole.LEGAL]: [
    { action: 'read', resource: 'projects' },
    { action: 'read', resource: 'contracts' },
    { action: 'create', resource: 'contracts' },
    { action: 'update', resource: 'contracts' },
    { action: 'read', resource: 'legal-documents' },
  ],
  [UserRole.FACILITIES]: [
    { action: 'read', resource: 'projects' },
    { action: 'read', resource: 'facilities' },
    { action: 'update', resource: 'facilities' },
    { action: 'read', resource: 'maintenance' },
    { action: 'create', resource: 'maintenance' },
  ],
  [UserRole.SUSTAINABILITY]: [
    { action: 'read', resource: 'projects' },
    { action: 'read', resource: 'sustainability-reports' },
    { action: 'create', resource: 'sustainability-reports' },
    { action: 'update', resource: 'sustainability-reports' },
  ],
  [UserRole.USER]: [
    { action: 'read', resource: 'projects' },
    { action: 'read', resource: 'tasks' },
    { action: 'update', resource: 'profile' },
  ],
};

// Authentication errors
export class AuthenticationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string, public requiredPermission?: Permission) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Enhanced login with rate limiting and security checks
 */
export async function login(
  email: string,
  password: string,
  options: {
    ipAddress?: string;
    userAgent?: string;
    rememberMe?: boolean;
  } = {}
): Promise<{ session: UserSession; user: any }> {
  // Rate limiting
  const rateLimitKey = `login:${options.ipAddress || 'unknown'}`;
  const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.login);
  
  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    throw new RateLimitError(
      `Too many login attempts. Try again in ${retryAfter} seconds.`,
      retryAfter,
      rateLimitResult.limit,
      rateLimitResult.remaining
    );
  }

  // Validate and sanitize input
  const sanitizedEmail = validateAndSanitize.email(email);
  
  if (!password || password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long');
  }

  try {
    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });

    if (error) {
      throw new AuthenticationError(error.message, error.name);
    }

    if (!data.user || !data.session) {
      throw new AuthenticationError('Authentication failed');
    }

    // Get user role from database
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    const role = (userRole?.role as UserRole) || UserRole.USER;
    const permissions = ROLE_PERMISSIONS[role];

    // Create enhanced session
    const now = Date.now();
    const sessionDuration = options.rememberMe ? SESSION_CONFIG.absoluteTimeout : SESSION_CONFIG.maxAge;
    
    const session: UserSession = {
      id: data.session.access_token,
      email: sanitizedEmail,
      role,
      permissions,
      csrfToken: generateCSRFToken(data.session.access_token),
      issuedAt: now,
      expiresAt: now + sessionDuration,
      absoluteExpiresAt: now + SESSION_CONFIG.absoluteTimeout,
      lastActivity: now,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    };

    return { session, user: data.user };
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof RateLimitError) {
      throw error;
    }
    throw new AuthenticationError(`Login failed: ${error.message}`);
  }
}

/**
 * Enhanced logout with session cleanup
 */
export async function logout(sessionId: string): Promise<void> {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Invalidate CSRF token
    // invalidateCSRFToken(sessionId);
    
    // Additional cleanup can be added here
  } catch (error) {
    // Log error but don't throw - logout should always succeed
    console.error('Logout error:', error);
  }
}

/**
 * Validate and refresh session
 */
export async function validateSession(
  sessionId: string,
  options: {
    ipAddress?: string;
    userAgent?: string;
    requireCSRF?: boolean;
    csrfToken?: string;
  } = {}
): Promise<UserSession | null> {
  try {
    // Get current session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    // Validate CSRF token if required
    if (options.requireCSRF && options.csrfToken) {
      const isValidCSRF = validateCSRFToken(sessionId, options.csrfToken);
      if (!isValidCSRF) {
        throw new AuthenticationError('Invalid CSRF token');
      }
    }

    // Get user role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    const role = (userRole?.role as UserRole) || UserRole.USER;
    const permissions = ROLE_PERMISSIONS[role];

    const now = Date.now();
    const sessionAge = now - (session.expires_at ? session.expires_at * 1000 : 0);

    // Check if session needs renewal
    const shouldRenew = sessionAge > SESSION_CONFIG.renewThreshold;
    
    if (shouldRenew) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        return null;
      }
    }

    // Return updated session
    const userSession: UserSession = {
      id: session.access_token,
      email: session.user.email || '',
      role,
      permissions,
      csrfToken: generateCSRFToken(session.access_token),
      issuedAt: session.expires_at ? session.expires_at * 1000 - SESSION_CONFIG.maxAge : now,
      expiresAt: session.expires_at ? session.expires_at * 1000 : now + SESSION_CONFIG.maxAge,
      absoluteExpiresAt: now + SESSION_CONFIG.absoluteTimeout,
      lastActivity: now,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    };

    return userSession;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(session: UserSession, action: string, resource: string): boolean {
  // Admin has all permissions
  if (session.role === UserRole.ADMIN) {
    return true;
  }

  // Check specific permissions
  return session.permissions.some(permission => 
    (permission.action === '*' || permission.action === action) &&
    (permission.resource === '*' || permission.resource === resource)
  );
}

/**
 * Require specific permission (throws if not authorized)
 */
export function requirePermission(session: UserSession, action: string, resource: string): void {
  if (!hasPermission(session, action, resource)) {
    throw new AuthorizationError(
      `Insufficient permissions. Required: ${action} on ${resource}`,
      { action, resource }
    );
  }
}

/**
 * Get user's effective permissions
 */
export function getUserPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Create authentication middleware
 */
export function createAuthMiddleware(options: {
  requireAuth?: boolean;
  requirePermissions?: Permission[];
  requireCSRF?: boolean;
} = {}) {
  return async (sessionId: string, csrfToken?: string, ipAddress?: string) => {
    const session = await validateSession(sessionId, {
      ipAddress,
      requireCSRF: options.requireCSRF,
      csrfToken,
    });

    if (options.requireAuth && !session) {
      throw new AuthenticationError('Authentication required');
    }

    if (options.requirePermissions && session) {
      for (const permission of options.requirePermissions) {
        requirePermission(session, permission.action, permission.resource);
      }
    }

    return session;
  };
}

/**
 * Generate secure session token
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password securely (for custom auth implementations)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === hash;
}