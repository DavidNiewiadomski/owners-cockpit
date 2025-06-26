import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// OAuth client configurations - these should be stored as Supabase secrets
const oauthCredentials = {
  outlook: {
    client_id: Deno.env.get('MICROSOFT_CLIENT_ID'),
    client_secret: Deno.env.get('MICROSOFT_CLIENT_SECRET'),
  },
  teams: {
    client_id: Deno.env.get('MICROSOFT_CLIENT_ID'), // Same as Outlook for Microsoft Graph
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { provider } = await req.json()

    if (!provider) {
      return new Response(
        JSON.stringify({ error: 'Provider is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const credentials = oauthCredentials[provider as keyof typeof oauthCredentials]

    if (!credentials || !credentials.client_id) {
      return new Response(
        JSON.stringify({ error: `OAuth credentials not configured for ${provider}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Only return client_id, keep client_secret secure
    return new Response(
      JSON.stringify({ 
        client_id: credentials.client_id,
        provider: provider 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error getting OAuth credentials:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
