/**
 * Enterprise-grade security utilities
 * Input validation, sanitization, and security best practices
 */

// Input validation utilities
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  url: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  projectId: (id: string): boolean => {
    // UUID v4 validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  },

  userId: (id: string): boolean => {
    return validateInput.projectId(id); // Same UUID format
  },

  fileName: (name: string): boolean => {
    // Prevent path traversal and dangerous characters
    const dangerousChars = /[<>:"/\\|?*]/;
    return !dangerousChars.test(name) && name.length > 0 && name.length <= 255;
  },

  alphanumeric: (input: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(input);
  },

  safeString: (input: string, maxLength = 1000): boolean => {
    return typeof input === 'string' && 
           input.length <= maxLength && 
           !/<script|javascript:|data:/i.test(input);
  }
};

// Sanitization utilities
export const sanitize = {
  html: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  sql: (input: string): string => {
    // Basic SQL injection prevention (use parameterized queries instead)
    return input.replace(/['";\\]/g, '');
  },

  fileName: (name: string): string => {
    return name
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\.{2,}/g, '.')
      .substring(0, 255);
  },

  url: (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (['http:', 'https:'].includes(urlObj.protocol)) {
        return urlObj.toString();
      }
    } catch {
      // Invalid URL
    }
    return '';
  }
};

// Content Security Policy helpers
export const csp = {
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },

  isAllowedDomain: (domain: string, allowedDomains: string[]): boolean => {
    return allowedDomains.some(allowed => 
      domain === allowed || domain.endsWith(`.${allowed}`)
    );
  }
};

// Rate limiting utilities
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 10,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - record.count);
  }
}

// Secure local storage wrapper
export const secureStorage = {
  setItem: (key: string, value: unknown): void => {
    try {
      const sanitizedKey = sanitize.html(key);
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(sanitizedKey, jsonValue);
    } catch (error) {
      console.error('Failed to save to secure storage:', error);
    }
  },

  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const sanitizedKey = sanitize.html(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from secure storage:', error);
      return defaultValue;
    }
  },

  removeItem: (key: string): void => {
    try {
      const sanitizedKey = sanitize.html(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Failed to remove from secure storage:', error);
    }
  }
};

// Data privacy utilities
export const privacy = {
  maskEmail: (email: string): string => {
    if (!validateInput.email(email)) return '***';
    const [local, domain] = email.split('@');
    const maskedLocal = local.length > 2 
      ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
      : '***';
    return `${maskedLocal}@${domain}`;
  },

  maskPhone: (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 4) return '***';
    return `***-***-${digitsOnly.slice(-4)}`;
  },

  redactSensitiveData: (obj: Record<string, unknown>): Record<string, unknown> => {
    const sensitive = ['password', 'token', 'key', 'secret', 'auth'];
    const redacted = { ...obj };
    
    Object.keys(redacted).forEach(key => {
      if (sensitive.some(word => key.toLowerCase().includes(word))) {
        redacted[key] = '[REDACTED]';
      }
    });
    
    return redacted;
  }
};

// CSRF protection utilities
export const csrf = {
  generateToken: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  validateToken: (token: string, expectedToken: string): boolean => {
    if (!token || !expectedToken || token.length !== expectedToken.length) {
      return false;
    }
    
    // Constant-time comparison to prevent timing attacks
    let result = 0;
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
    }
    return result === 0;
  }
};

// Error logging with security considerations
export const secureLogger = {
  logError: (error: Error, context?: Record<string, unknown>): void => {
    const safeContext = context ? privacy.redactSensitiveData(context) : {};
    const logEntry = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      context: safeContext,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Secure Log Entry:', logEntry);
    
    // In production, send to secure logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToSecureLoggingService(logEntry);
    }
  },

  logSecurityEvent: (event: string, details?: Record<string, unknown>): void => {
    const logEntry = {
      type: 'SECURITY_EVENT',
      event,
      details: details ? privacy.redactSensitiveData(details) : {},
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.warn('Security Event:', logEntry);
    
    // In production, send to security monitoring
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToSecurityMonitoring(logEntry);
    }
  }
};
