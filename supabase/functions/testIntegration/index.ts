import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestIntegrationRequest {
  provider: string;
  apiKey?: string;
  refreshToken?: string;
  oauthData?: any;
  config?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { provider, apiKey, refreshToken, oauthData, config }: TestIntegrationRequest = await req.json()

    console.log(`Testing integration for provider: ${provider}`)

    let testResult = { ok: false, error: 'Unknown provider' }

    switch (provider) {
      case 'procore':
        testResult = await testProcoreConnection(apiKey, oauthData)
        break
      case 'primavera':
        testResult = await testPrimaveraConnection(apiKey, config)
        break
      case 'box':
        testResult = await testBoxConnection(oauthData)
        break
      case 'iot_sensors':
        testResult = await testIoTConnection(apiKey, config)
        break
      case 'smartsheet':
        testResult = await testSmartsheetConnection(apiKey)
        break
      case 'green_badger':
        testResult = await testGreenBadgerConnection(apiKey)
        break
      case 'billy':
        testResult = await testBillyConnection(apiKey)
        break
      case 'clearstory':
        testResult = await testClearstoryConnection(oauthData)
        break
      case 'track3d':
        testResult = await testTrack3DConnection(apiKey, config)
        break
      default:
        testResult = { ok: false, error: `Unsupported provider: ${provider}` }
    }

    return new Response(
      JSON.stringify(testResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: testResult.ok ? 200 : 400
      }
    )
  } catch (error) {
    console.error('Error testing integration:', error)
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function testProcoreConnection(apiKey?: string, oauthData?: any) {
  try {
    if (!apiKey && !oauthData?.access_token) {
      return { ok: false, error: 'API key or OAuth token required for Procore' }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (oauthData?.access_token) {
      headers['Authorization'] = `Bearer ${oauthData.access_token}`
    } else if (apiKey) {
      headers['Procore-Api-Key'] = apiKey
    }

    // Test with Procore's /me endpoint (mock for demo)
    // In production, you'd make actual API call:
    // const response = await fetch('https://api.procore.com/vapid/me', { headers })
    
    console.log('Testing Procore connection with headers:', Object.keys(headers))
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Procore connection successful' }
  } catch (error) {
    return { ok: false, error: `Procore connection failed: ${error.message}` }
  }
}

async function testPrimaveraConnection(apiKey?: string, config?: any) {
  try {
    if (!apiKey) {
      return { ok: false, error: 'API key required for Primavera' }
    }

    console.log('Testing Primavera connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Primavera connection successful' }
  } catch (error) {
    return { ok: false, error: `Primavera connection failed: ${error.message}` }
  }
}

async function testBoxConnection(oauthData?: any) {
  try {
    if (!oauthData?.access_token) {
      return { ok: false, error: 'OAuth token required for Box' }
    }

    console.log('Testing Box connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Box connection successful' }
  } catch (error) {
    return { ok: false, error: `Box connection failed: ${error.message}` }
  }
}

async function testIoTConnection(apiKey?: string, config?: any) {
  try {
    if (!apiKey || !config?.endpoint) {
      return { ok: false, error: 'API key and endpoint required for IoT sensors' }
    }

    console.log('Testing IoT sensors connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'IoT sensors connection successful' }
  } catch (error) {
    return { ok: false, error: `IoT sensors connection failed: ${error.message}` }
  }
}

async function testSmartsheetConnection(apiKey?: string) {
  try {
    if (!apiKey) {
      return { ok: false, error: 'API key required for Smartsheet' }
    }

    console.log('Testing Smartsheet connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Smartsheet connection successful' }
  } catch (error) {
    return { ok: false, error: `Smartsheet connection failed: ${error.message}` }
  }
}

async function testGreenBadgerConnection(apiKey?: string) {
  try {
    if (!apiKey) {
      return { ok: false, error: 'API key required for Green Badger' }
    }

    console.log('Testing Green Badger connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Green Badger connection successful' }
  } catch (error) {
    return { ok: false, error: `Green Badger connection failed: ${error.message}` }
  }
}

async function testBillyConnection(apiKey?: string) {
  try {
    if (!apiKey) {
      return { ok: false, error: 'API key required for Billy' }
    }

    console.log('Testing Billy connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Billy connection successful' }
  } catch (error) {
    return { ok: false, error: `Billy connection failed: ${error.message}` }
  }
}

async function testClearstoryConnection(oauthData?: any) {
  try {
    if (!oauthData?.access_token) {
      return { ok: false, error: 'OAuth token required for Clearstory' }
    }

    console.log('Testing Clearstory connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Clearstory connection successful' }
  } catch (error) {
    return { ok: false, error: `Clearstory connection failed: ${error.message}` }
  }
}

async function testTrack3DConnection(apiKey?: string, config?: any) {
  try {
    if (!apiKey) {
      return { ok: false, error: 'API key required for Track3D' }
    }

    console.log('Testing Track3D connection')
    
    // Simulate successful connection for demo
    return { ok: true, message: 'Track3D connection successful' }
  } catch (error) {
    return { ok: false, error: `Track3D connection failed: ${error.message}` }
  }
}
