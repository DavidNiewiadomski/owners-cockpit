import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// OAuth token exchange endpoints
const tokenEndpoints = {
  outlook: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  teams: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  zoom: 'https://zoom.us/oauth/token',
  slack: 'https://slack.com/api/oauth.v2.access',
  whatsapp: 'https://graph.facebook.com/v18.0/oauth/access_token'
}

const oauthCredentials = {
  outlook: {
    client_id: Deno.env.get('MICROSOFT_CLIENT_ID'),
    client_secret: Deno.env.get('MICROSOFT_CLIENT_SECRET'),
  },
  teams: {
    client_id: Deno.env.get('MICROSOFT_CLIENT_ID'),
    client_secret: Deno.env.get('MICROSOFT_CLIENT_SECRET'),
  },
  zoom: {
    client_id: Deno.env.get('ZOOM_CLIENT_ID'),
    client_secret: Deno.env.get('ZOOM_CLIENT_SECRET'),
  },
  slack: {
    client_id: Deno.env.get('SLACK_CLIENT_ID'),
    client_secret: Deno.env.get('SLACK_CLIENT_SECRET'),
  },
  whatsapp: {
    client_id: Deno.env.get('WHATSAPP_CLIENT_ID'),
    client_secret: Deno.env.get('WHATSAPP_CLIENT_SECRET'),
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { provider, code, code_verifier, redirect_uri } = await req.json()

    if (!provider || !code || !redirect_uri) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const credentials = oauthCredentials[provider as keyof typeof oauthCredentials]
    const tokenEndpoint = tokenEndpoints[provider as keyof typeof tokenEndpoints]

    if (!credentials || !tokenEndpoint) {
      return new Response(
        JSON.stringify({ error: `Provider ${provider} not supported` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prepare token exchange request
    const tokenData = new FormData()
    
    if (provider === 'slack') {
      // Slack specific format
      tokenData.append('client_id', credentials.client_id!)
      tokenData.append('client_secret', credentials.client_secret!)
      tokenData.append('code', code)
      tokenData.append('redirect_uri', redirect_uri)
    } else if (provider === 'whatsapp') {
      // Facebook/WhatsApp specific format
      tokenData.append('client_id', credentials.client_id!)
      tokenData.append('client_secret', credentials.client_secret!)
      tokenData.append('code', code)
      tokenData.append('redirect_uri', redirect_uri)
    } else if (provider === 'zoom') {
      // Zoom specific format
      tokenData.append('grant_type', 'authorization_code')
      tokenData.append('code', code)
      tokenData.append('redirect_uri', redirect_uri)
      
      // Zoom requires Basic auth
      const auth = btoa(`${credentials.client_id}:${credentials.client_secret}`)
    } else {
      // Microsoft (Outlook/Teams) format
      tokenData.append('client_id', credentials.client_id!)
      tokenData.append('client_secret', credentials.client_secret!)
      tokenData.append('code', code)
      tokenData.append('redirect_uri', redirect_uri)
      tokenData.append('grant_type', 'authorization_code')
      if (code_verifier) {
        tokenData.append('code_verifier', code_verifier)
      }
    }

    // Make token exchange request
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (provider === 'zoom') {
      headers['Authorization'] = `Basic ${btoa(`${credentials.client_id}:${credentials.client_secret}`)}`
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers,
      body: new URLSearchParams(tokenData as any)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Token exchange failed:', responseData)
      return new Response(
        JSON.stringify({ error: 'Token exchange failed', details: responseData }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Normalize response format across providers
    let normalizedResponse = {
      access_token: responseData.access_token,
      refresh_token: responseData.refresh_token,
      expires_in: responseData.expires_in || 3600,
      token_type: responseData.token_type || 'Bearer',
      scope: responseData.scope
    }

    // Handle provider-specific response formats
    if (provider === 'slack' && responseData.ok) {
      normalizedResponse = {
        access_token: responseData.access_token,
        refresh_token: responseData.refresh_token,
        expires_in: responseData.expires_in || 43200, // Slack default
        token_type: 'Bearer',
        scope: responseData.scope
      }
    }

    return new Response(
      JSON.stringify(normalizedResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('OAuth exchange error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
