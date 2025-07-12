# Security Implementation Guide

## Overview

This document outlines the comprehensive security measures implemented in the GitHub Desktop Owners Cockpit platform. The security system includes authentication, authorization, input validation, rate limiting, CSRF protection, and secure session management.

## Security Architecture

### 1. Environment Configuration Security
- **Secure Configuration Management**: All sensitive credentials moved to environment variables
- **Runtime Validation**: Configuration validates required environment variables at startup
- **Type-safe Configuration**: TypeScript interfaces ensure proper configuration usage

**Files:**
- `src/lib/config.ts` - Centralized configuration management
- `.env.example` - Template for environment variables

### 2. Input Validation and Sanitization
- **XSS Prevention**: DOMPurify integration for HTML sanitization
- **SQL Injection Protection**: Parameterized queries and input escaping
- **Data Validation**: Comprehensive regex patterns for common data types
- **Type Safety**: TypeScript validation with runtime checks

**Files:**
- `src/lib/security/inputValidation.ts` - Input validation utilities

**Key Features:**
- Email validation
- UUID validation
- Filename sanitization
- URL validation
- HTML content sanitization
- SQL injection pattern detection

### 3. Authentication and Authorization
- **Role-Based Access Control (RBAC)**: Comprehensive role and permission system
- **Session Management**: Secure session handling with automatic renewal
- **Multi-Factor Authentication Ready**: Infrastructure for MFA implementation
- **OAuth Integration**: Secure OAuth flow with Supabase Auth

**Files:**
- `src/lib/security/authentication.ts` - Authentication utilities

**Roles Supported:**
- Admin (full access)
- Executive (projects, dashboards, reports)
- Construction (projects, tasks, documents)
- Preconstruction (RFPs, bids)
- Finance (budgets, financial reports)
- Legal (contracts, legal documents)
- Facilities (facilities management)
- Sustainability (sustainability reports)
- User (basic access)

### 4. Rate Limiting and CSRF Protection
- **Intelligent Rate Limiting**: Different limits for different endpoints
- **CSRF Token Management**: Secure token generation and validation
- **Brute Force Protection**: Login attempt limiting
- **API Protection**: Request rate limiting for API endpoints

**Files:**
- `src/lib/security/rateLimiting.ts` - Rate limiting and CSRF utilities

**Rate Limit Configs:**
- Login: 5 attempts per 15 minutes
- Registration: 3 attempts per hour
- API: 100 requests per 15 minutes
- File uploads: 10 uploads per hour
- AI Chat: 20 requests per 5 minutes

### 5. Security Headers and CSP
- **Content Security Policy**: Prevents XSS and injection attacks
- **Security Headers**: Comprehensive HTTP security headers
- **HTTPS Enforcement**: Strict transport security
- **Frame Protection**: Clickjacking prevention

**Security Headers Implemented:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`

### 6. Security Middleware
- **Unified Security**: Single middleware for all security concerns
- **Express Compatibility**: Works with Express.js applications
- **Supabase Integration**: Native Supabase Edge Function support
- **React HOC**: Client-side security wrapper components

**Files:**
- `src/lib/security/middleware.ts` - Comprehensive security middleware

## Usage Examples

### 1. Basic Authentication Check
```typescript
import { createAuthMiddleware } from '@/lib/security';

const authMiddleware = createAuthMiddleware({
  requireAuth: true,
  requirePermissions: [{ action: 'read', resource: 'projects' }]
});

const session = await authMiddleware(sessionId, csrfToken, ipAddress);
```

### 2. Input Validation
```typescript
import { validateAndSanitize } from '@/lib/security';

// Sanitize user input
const cleanInput = validateAndSanitize.userInput(userInput);

// Validate email
const email = validateAndSanitize.email(emailInput);

// Sanitize HTML content
const safeHtml = validateAndSanitize.html(htmlContent);
```

### 3. Rate Limiting
```typescript
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/security';

const result = checkRateLimit(userId, RATE_LIMIT_CONFIGS.login);
if (!result.allowed) {
  throw new Error('Rate limit exceeded');
}
```

### 4. React Security Components
```tsx
import { SecurityProvider, SecurityGuard } from '@/components/security/SecurityProvider';

// Wrap app with security provider
<SecurityProvider>
  <App />
</SecurityProvider>

// Protect sensitive components
<SecurityGuard 
  requireAuth={true}
  requirePermissions={[{ action: 'admin', resource: '*' }]}
  fallback={<div>Access denied</div>}
>
  <AdminPanel />
</SecurityGuard>
```

### 5. Security Middleware in API Routes
```typescript
import { createSupabaseSecurityMiddleware, SECURITY_PRESETS } from '@/lib/security';

export default async function handler(req: Request) {
  const securityMiddleware = createSupabaseSecurityMiddleware(SECURITY_PRESETS.authenticated);
  
  const { context, headers, sanitizedInput } = await securityMiddleware(req);
  
  // Your API logic here
  
  return new Response(JSON.stringify(result), { headers });
}
```

## Security Testing

### Health Check
```typescript
import { performSecurityHealthCheck } from '@/lib/security';

const healthCheck = performSecurityHealthCheck();
console.log('Security Status:', healthCheck.status);
console.log('Security Checks:', healthCheck.checks);
```

### Security Testing Utilities
```typescript
import { securityTesting } from '@/lib/security';

// Test input validation
const inputResults = securityTesting.testInputValidation();

// Test rate limiting
const rateLimitResults = await securityTesting.testRateLimiting();

// Test CSRF protection
const csrfResults = securityTesting.testCSRFProtection();
```

## Configuration

### Environment Variables Required

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security Configuration (Production)
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
SESSION_SECRET=your-session-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Best Practices

1. **Environment Variables**: Never commit sensitive credentials to version control
2. **HTTPS Only**: Always use HTTPS in production
3. **Regular Updates**: Keep dependencies updated for security patches
4. **Input Validation**: Validate and sanitize all user inputs
5. **Principle of Least Privilege**: Grant minimum necessary permissions
6. **Security Headers**: Implement comprehensive security headers
7. **Rate Limiting**: Protect against brute force and DoS attacks
8. **Audit Logging**: Log security events for monitoring
9. **Regular Security Reviews**: Conduct periodic security assessments
10. **Error Handling**: Don't leak sensitive information in error messages

## Monitoring and Alerting

### Security Events Logged
- Authentication attempts (success/failure)
- Authorization failures
- Rate limit violations
- Input validation failures
- CSRF token violations
- Session anomalies

### Health Check Endpoints
- `/api/security/health` - Security system health check
- `/api/security/metrics` - Security metrics and statistics

## Compliance and Standards

This security implementation follows:
- OWASP Top 10 security guidelines
- NIST Cybersecurity Framework
- SOC 2 Type II controls
- GDPR data protection requirements
- Industry best practices for web application security

## Emergency Procedures

### Security Incident Response
1. Identify and contain the threat
2. Assess the scope of the incident
3. Implement immediate countermeasures
4. Document the incident
5. Review and update security measures

### Contact Information
- Security Team: security@company.com
- Emergency Hotline: +1-XXX-XXX-XXXX

## Updates and Maintenance

This security implementation should be reviewed and updated:
- Monthly for dependency updates
- Quarterly for security assessments
- Annually for comprehensive security audits
- Immediately for critical security patches

## Dependencies

### Security-Related Dependencies
- `@supabase/supabase-js` - Authentication and database
- `dompurify` - HTML sanitization
- `zod` - Runtime type validation
- Web Crypto API - Cryptographic operations

### Development Dependencies
- `@types/dompurify` - TypeScript types for DOMPurify
- Various linting and testing tools

## Conclusion

This comprehensive security implementation provides enterprise-grade protection for the GitHub Desktop Owners Cockpit platform. Regular maintenance, monitoring, and updates are essential to maintain security effectiveness.

For questions or security concerns, please contact the development team or security team immediately.