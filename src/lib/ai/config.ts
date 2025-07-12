/**
 * AI Service Configuration
 * Handles routing between local proxy server (development) and Supabase edge functions (production)
 */

interface AIServiceConfig {
  useLocalProxy: boolean;
  localProxyUrl: string;
  supabaseUrl: string;
  environment: 'development' | 'production' | 'test';
}

/**
 * Get AI service configuration based on environment
 */
export function getAIServiceConfig(): AIServiceConfig {
  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const localProxyUrl = import.meta.env.VITE_AI_PROXY_URL || 'http://localhost:3001';
  
  return {
    useLocalProxy: isDevelopment && !import.meta.env.VITE_FORCE_SUPABASE,
    localProxyUrl,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    environment: isDevelopment ? 'development' : 'production'
  };
}

/**
 * Get the appropriate endpoint for AI calls
 */
export function getAIEndpoint(functionName: string): string {
  const config = getAIServiceConfig();
  
  if (config.useLocalProxy) {
    // Use local proxy server
    return `${config.localProxyUrl}/functions/v1/${functionName}`;
  } else {
    // Use Supabase edge functions (handled by Supabase client)
    return functionName;
  }
}

/**
 * Check if we should use the local AI proxy
 */
export function shouldUseLocalProxy(): boolean {
  const config = getAIServiceConfig();
  return config.useLocalProxy;
}

/**
 * Log AI configuration (for debugging)
 */
export function logAIConfig(): void {
  const config = getAIServiceConfig();
  console.log('🤖 AI Service Configuration:', {
    environment: config.environment,
    useLocalProxy: config.useLocalProxy,
    localProxyUrl: config.localProxyUrl,
    supabaseConfigured: !!config.supabaseUrl
  });
}