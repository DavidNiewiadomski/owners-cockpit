/**
 * Secure environment configuration
 * Validates and provides type-safe access to environment variables
 */

interface EnvironmentConfig {
  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
  
  // Application Configuration
  appUrl: string;
  nodeEnv: 'development' | 'production' | 'test';
  
  // Security Configuration
  jwtSecret?: string;
  encryptionKey?: string;
  sessionSecret?: string;
  
  // Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

class ConfigError extends Error {
  constructor(message: string) {
    super(`Configuration Error: ${message}`);
    this.name = 'ConfigError';
  }
}

function getRequiredEnvVar(name: string, fallback?: string): string {
  const value = import.meta.env[name] || 
    (typeof process !== 'undefined' && process.env[name]);
  
  if (!value) {
    if (fallback && import.meta.env.DEV) {
      console.warn(`Using fallback value for ${name} in development mode`);
      return fallback;
    }
    throw new ConfigError(`Missing required environment variable: ${name}`);
  }
  
  return value;
}

function getOptionalEnvVar(name: string, defaultValue?: string): string | undefined {
  return import.meta.env[name] || 
    (typeof process !== 'undefined' && process.env[name]) || 
    defaultValue;
}

function validateUrl(url: string, name: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    throw new ConfigError(`Invalid URL for ${name}: ${url}`);
  }
}

function validateNodeEnv(env: string): 'development' | 'production' | 'test' {
  if (env !== 'development' && env !== 'production' && env !== 'test') {
    throw new ConfigError(`Invalid NODE_ENV: ${env}. Must be 'development', 'production', or 'test'`);
  }
  return env;
}

function getConfig(): EnvironmentConfig {
  const isDev = import.meta.env.DEV;
  
  return {
    // Supabase Configuration
    supabaseUrl: validateUrl(getRequiredEnvVar('VITE_SUPABASE_URL', isDev ? 'http://localhost:54321' : undefined), 'VITE_SUPABASE_URL'),
    supabaseAnonKey: getRequiredEnvVar('VITE_SUPABASE_ANON_KEY', isDev ? 'dev-anon-key' : undefined),
    supabaseServiceRoleKey: getOptionalEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    
    // Application Configuration
    appUrl: validateUrl(getOptionalEnvVar('VITE_APP_URL', 'http://localhost:8080'), 'VITE_APP_URL'),
    nodeEnv: validateNodeEnv(getOptionalEnvVar('NODE_ENV', 'development')),
    
    // Security Configuration
    jwtSecret: getOptionalEnvVar('JWT_SECRET', isDev ? 'dev-jwt-secret' : undefined),
    encryptionKey: getOptionalEnvVar('ENCRYPTION_KEY', isDev ? 'dev-encryption-key' : undefined),
    sessionSecret: getOptionalEnvVar('SESSION_SECRET', isDev ? 'dev-session-secret' : undefined),
    
    // Rate Limiting
    rateLimitWindowMs: parseInt(getOptionalEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    rateLimitMaxRequests: parseInt(getOptionalEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  };
}

// Export configuration with error handling
let config: EnvironmentConfig;
try {
  config = getConfig();
} catch (error) {
  console.error('Configuration error:', error);
  // Provide minimal fallback config for development
  if (import.meta.env.DEV) {
    config = {
      supabaseUrl: 'http://localhost:54321',
      supabaseAnonKey: 'dev-anon-key',
      supabaseServiceRoleKey: 'dev-service-role-key',
      appUrl: 'http://localhost:8080',
      nodeEnv: 'development',
      jwtSecret: 'dev-jwt-secret',
      encryptionKey: 'dev-encryption-key',
      sessionSecret: 'dev-session-secret',
      rateLimitWindowMs: 900000,
      rateLimitMaxRequests: 100,
    };
  } else {
    throw error;
  }
}

export { config, ConfigError };

// Runtime validation
if (config.nodeEnv === 'production') {
  const requiredSecrets = ['jwtSecret', 'encryptionKey', 'sessionSecret'];
  const missingSecrets = requiredSecrets.filter(secret => !config[secret as keyof EnvironmentConfig]);
  
  if (missingSecrets.length > 0) {
    throw new ConfigError(`Missing required secrets for production: ${missingSecrets.join(', ')}`);
  }
}