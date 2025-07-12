/**
 * Comprehensive input validation and sanitization utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

import DOMPurify from 'dompurify';

// Common patterns for validation
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  phoneNumber: /^\+?[\d\s\-()]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  projectId: /^[a-zA-Z0-9_-]+$/,
  userId: /^[a-zA-Z0-9_-]+$/,
  sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|OR|AND)\b)|['";\\]/i,
  xssScript: /<script[^>]*>.*?<\/script>/gi,
  xssOnEvents: /on\w+\s*=/gi,
} as const;

// Validation errors
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Sanitization functions
export const sanitize = {
  /**
   * Sanitize HTML content to prevent XSS
   */
  html: (input: string): string => {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'title'],
      ALLOW_DATA_ATTR: false,
    });
  },

  /**
   * Sanitize plain text by removing HTML tags and suspicious characters
   */
  text: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .trim();
  },

  /**
   * Sanitize filename to prevent directory traversal
   */
  filename: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Remove invalid filename characters
      .replace(/^\.+/, '') // Remove leading dots
      .replace(/\.+$/, '') // Remove trailing dots
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim();
  },

  /**
   * Sanitize URL to prevent malicious redirects
   */
  url: (input: string): string => {
    if (typeof input !== 'string') return '';
    try {
      const url = new URL(input);
      // Only allow HTTP and HTTPS protocols
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new ValidationError('Invalid URL protocol');
      }
      return url.toString();
    } catch {
      throw new ValidationError('Invalid URL format');
    }
  },

  /**
   * Sanitize SQL input by escaping special characters
   */
  sql: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input.replace(/'/g, "''"); // Escape single quotes
  },
} as const;

// Validation functions
export const validate = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    if (typeof email !== 'string') return false;
    return VALIDATION_PATTERNS.email.test(email.trim());
  },

  /**
   * Validate UUID format
   */
  uuid: (uuid: string): boolean => {
    if (typeof uuid !== 'string') return false;
    return VALIDATION_PATTERNS.uuid.test(uuid);
  },

  /**
   * Validate string length
   */
  length: (input: string, min: number, max: number): boolean => {
    if (typeof input !== 'string') return false;
    const length = input.trim().length;
    return length >= min && length <= max;
  },

  /**
   * Validate against SQL injection patterns
   */
  sqlSafe: (input: string): boolean => {
    if (typeof input !== 'string') return true;
    return !VALIDATION_PATTERNS.sqlInjection.test(input);
  },

  /**
   * Validate against XSS patterns
   */
  xssSafe: (input: string): boolean => {
    if (typeof input !== 'string') return true;
    return !VALIDATION_PATTERNS.xssScript.test(input) && 
           !VALIDATION_PATTERNS.xssOnEvents.test(input);
  },

  /**
   * Validate project ID format
   */
  projectId: (id: string): boolean => {
    if (typeof id !== 'string') return false;
    return VALIDATION_PATTERNS.projectId.test(id) && id.length >= 1 && id.length <= 50;
  },

  /**
   * Validate user ID format
   */
  userId: (id: string): boolean => {
    if (typeof id !== 'string') return false;
    return VALIDATION_PATTERNS.userId.test(id) && id.length >= 1 && id.length <= 50;
  },

  /**
   * Validate phone number format
   */
  phoneNumber: (phone: string): boolean => {
    if (typeof phone !== 'string') return false;
    return VALIDATION_PATTERNS.phoneNumber.test(phone);
  },

  /**
   * Validate URL format
   */
  url: (url: string): boolean => {
    if (typeof url !== 'string') return false;
    return VALIDATION_PATTERNS.url.test(url);
  },
} as const;

// Combined validation and sanitization
export const validateAndSanitize = {
  /**
   * Validate and sanitize user input
   */
  userInput: (input: string, maxLength = 1000): string => {
    if (typeof input !== 'string') {
      throw new ValidationError('Input must be a string');
    }

    if (!validate.length(input, 1, maxLength)) {
      throw new ValidationError(`Input must be between 1 and ${maxLength} characters`);
    }

    if (!validate.sqlSafe(input)) {
      throw new ValidationError('Input contains potentially dangerous SQL patterns');
    }

    if (!validate.xssSafe(input)) {
      throw new ValidationError('Input contains potentially dangerous XSS patterns');
    }

    return sanitize.text(input);
  },

  /**
   * Validate and sanitize email
   */
  email: (email: string): string => {
    if (typeof email !== 'string') {
      throw new ValidationError('Email must be a string');
    }

    const sanitized = sanitize.text(email);
    if (!validate.email(sanitized)) {
      throw new ValidationError('Invalid email format');
    }

    return sanitized.toLowerCase();
  },

  /**
   * Validate and sanitize UUID
   */
  uuid: (uuid: string): string => {
    if (typeof uuid !== 'string') {
      throw new ValidationError('UUID must be a string');
    }

    const sanitized = sanitize.text(uuid);
    if (!validate.uuid(sanitized)) {
      throw new ValidationError('Invalid UUID format');
    }

    return sanitized;
  },

  /**
   * Validate and sanitize HTML content
   */
  html: (html: string, maxLength = 10000): string => {
    if (typeof html !== 'string') {
      throw new ValidationError('HTML must be a string');
    }

    if (!validate.length(html, 1, maxLength)) {
      throw new ValidationError(`HTML must be between 1 and ${maxLength} characters`);
    }

    return sanitize.html(html);
  },
} as const;

// Rate limiting key sanitization
export const sanitizeRateLimitKey = (key: string): string => {
  if (typeof key !== 'string') return 'invalid';
  return key.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 100);
};

// Export all utilities
export { VALIDATION_PATTERNS };