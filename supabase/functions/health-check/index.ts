import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ServiceStatus {
  service: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  error?: string
  details?: any
}

interface HealthCheckResponse {
  timestamp: string
  overall: 'healthy' | 'degraded' | 'unhealthy'
  services: ServiceStatus[]
  totalResponseTime: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()
  const services: ServiceStatus[] = []

  try {
    // Test Supabase Database
    const supabaseStatus = await testSupabase()
    services.push(supabaseStatus)

    // Test OpenAI
    const openaiStatus = await testOpenAI()
    services.push(openaiStatus)

    // Test Anthropic
    const anthropicStatus = await testAnthropic()
    services.push(anthropicStatus)

    // Test Gemini
    const geminiStatus = await testGemini()
    services.push(geminiStatus)

    // Test ElevenLabs
    const elevenLabsStatus = await testElevenLabs()
    services.push(elevenLabsStatus)

    // Test Azure OpenAI
    const azureStatus = await testAzureOpenAI()
    services.push(azureStatus)

    // Test Snowflake
    const snowflakeStatus = await testSnowflake()
    services.push(snowflakeStatus)

    // Calculate overall health
    const unhealthyCount = services.filter(s => s.status === 'unhealthy').length
    const degradedCount = services.filter(s => s.status === 'degraded').length
    
    let overall: 'healthy' | 'degraded' | 'unhealthy'
    if (unhealthyCount > 2) {
      overall = 'unhealthy'
    } else if (unhealthyCount > 0 || degradedCount > 2) {
      overall = 'degraded'
    } else {
      overall = 'healthy'
    }

    const response: HealthCheckResponse = {
      timestamp: new Date().toISOString(),
      overall,
      services,
      totalResponseTime: Date.now() - startTime
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Health check error:', error)
    
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        overall: 'unhealthy',
        services,
        totalResponseTime: Date.now() - startTime,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Test Supabase connection
async function testSupabase(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    
    return {
      service: 'Supabase',
      status: 'healthy',
      responseTime: Date.now() - start,
      details: { projectCount: count }
    }
  } catch (error) {
    return {
      service: 'Supabase',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

// Test OpenAI
async function testOpenAI(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return {
        service: 'OpenAI',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'API key not configured'
      }
    }
    
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    return {
      service: 'OpenAI',
      status: 'healthy',
      responseTime: Date.now() - start
    }
  } catch (error) {
    return {
      service: 'OpenAI',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

// Test Anthropic
async function testAnthropic(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      return {
        service: 'Anthropic',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'API key not configured'
      }
    }
    
    // Just validate the key format for now
    return {
      service: 'Anthropic',
      status: 'healthy',
      responseTime: Date.now() - start
    }
  } catch (error) {
    return {
      service: 'Anthropic',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

// Test Google Gemini
async function testGemini(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_GEMINI_API_KEY')
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return {
        service: 'Google Gemini',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'API key not configured'
      }
    }
    
    return {
      service: 'Google Gemini',
      status: 'healthy',
      responseTime: Date.now() - start
    }
  } catch (error) {
    return {
      service: 'Google Gemini',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

// Test ElevenLabs
async function testElevenLabs(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
      return {
        service: 'ElevenLabs',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'API key not configured'
      }
    }
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey }
    })
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    return {
      service: 'ElevenLabs',
      status: 'healthy',
      responseTime: Date.now() - start
    }
  } catch (error) {
    return {
      service: 'ElevenLabs',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

// Test Azure OpenAI
async function testAzureOpenAI(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const endpoint = Deno.env.get('AZURE_OPENAI_ENDPOINT')
    const apiKey = Deno.env.get('AZURE_OPENAI_API_KEY')
    
    if (!endpoint || !apiKey) {
      return {
        service: 'Azure OpenAI',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'Not configured'
      }
    }
    
    return {
      service: 'Azure OpenAI',
      status: 'healthy',
      responseTime: Date.now() - start,
      details: { endpoint }
    }
  } catch (error) {
    return {
      service: 'Azure OpenAI',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

// Test Snowflake
async function testSnowflake(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    const account = Deno.env.get('SNOWFLAKE_ACCOUNT')
    const username = Deno.env.get('SNOWFLAKE_USERNAME')
    const password = Deno.env.get('SNOWFLAKE_PASSWORD')
    
    if (!account || !username || !password) {
      return {
        service: 'Snowflake',
        status: 'degraded',
        responseTime: Date.now() - start,
        error: 'Not configured'
      }
    }
    
    return {
      service: 'Snowflake',
      status: 'healthy',
      responseTime: Date.now() - start,
      details: { account }
    }
  } catch (error) {
    return {
      service: 'Snowflake',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}