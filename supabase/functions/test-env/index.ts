import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  // Skip auth check for testing
  console.log('🧪 Test environment function called')

  try {
    // Check all API keys
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const elevenlabsKey = Deno.env.get('ELEVENLABS_API_KEY')

    const response = {
      success: true,
      environment_check: {
        openai: {
          has_key: !!openaiKey,
          key_length: openaiKey?.length || 0,
          key_prefix: openaiKey?.substring(0, 10) || 'none',
          is_placeholder: openaiKey === 'your_openai_api_key_here'
        },
        anthropic: {
          has_key: !!anthropicKey,
          key_length: anthropicKey?.length || 0,
          key_prefix: anthropicKey?.substring(0, 10) || 'none'
        },
        gemini: {
          has_key: !!geminiKey,
          key_length: geminiKey?.length || 0,
          key_prefix: geminiKey?.substring(0, 10) || 'none'
        },
        elevenlabs: {
          has_key: !!elevenlabsKey,
          key_length: elevenlabsKey?.length || 0,
          key_prefix: elevenlabsKey?.substring(0, 10) || 'none'
        }
      }
    }

    return new Response(JSON.stringify(response, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Test environment error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
