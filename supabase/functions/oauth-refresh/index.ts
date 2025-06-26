import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const { provider, refresh_token } = await req.json()

    if (!provider || !refresh_token) {
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

    // Prepare refresh request
    const refreshData = new FormData()
    
    if (provider === 'slack') {
      // Slack doesn't typically support refresh tokens in the same way
      return new Response(
        JSON.stringify({ error: 'Slack requires re-authentication' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else if (provider === 'zoom') {
      refreshData.append('grant_type', 'refresh_token')
      refreshData.append('refresh_token', refresh_token)
    } else {
      // Microsoft and others
      refreshData.append('client_id', credentials.client_id!)
      refreshData.append('client_secret', credentials.client_secret!)
      refreshData.append('grant_type', 'refresh_token')
      refreshData.append('refresh_token', refresh_token)
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (provider === 'zoom') {
      headers['Authorization'] = `Basic ${btoa(`${credentials.client_id}:${credentials.client_secret}`)}`
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers,
      body: new URLSearchParams(refreshData as any)
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('Token refresh failed:', responseData)
      return new Response(
        JSON.stringify({ error: 'Token refresh failed', details: responseData }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return refreshed tokens
    return new Response(
      JSON.stringify({
        access_token: responseData.access_token,
        refresh_token: responseData.refresh_token || refresh_token, // Some providers don't issue new refresh tokens
        expires_in: responseData.expires_in || 3600,
        token_type: responseData.token_type || 'Bearer',
        scope: responseData.scope
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Token refresh error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
