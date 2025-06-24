
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
    const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
    const tenantId = Deno.env.get('MICROSOFT_TENANT_ID');

    if (!clientId || !clientSecret || !tenantId) {
      return new Response('Microsoft Graph credentials not configured', { status: 400 });
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return new Response(`OAuth error: ${error}`, { status: 400 });
    }

    if (!code || !state) {
      return new Response('Missing code or state parameter', { status: 400 });
    }

    const [projectId, originalState] = state.split('|');

    // Exchange code for tokens
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${supabaseUrl}/functions/v1/office365-callback`
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return new Response('Token exchange failed', { status: 400 });
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    if (!userResponse.ok) {
      console.error('Failed to get user info');
      return new Response('Failed to get user info', { status: 400 });
    }

    const userInfo = await userResponse.json();

    // Store tokens in integration_tokens table
    const { error: dbError } = await supabase
      .from('integration_tokens')
      .upsert({
        user_id: userInfo.id,
        project_id: projectId,
        provider: 'outlook',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        token_data: {
          scope: tokens.scope,
          tenant_id: tenantId,
          user_info: userInfo
        }
      }, {
        onConflict: 'user_id,project_id,provider'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response('Failed to store tokens', { status: 500 });
    }

    // Also store Teams tokens if needed
    await supabase
      .from('integration_tokens')
      .upsert({
        user_id: userInfo.id,
        project_id: projectId,
        provider: 'teams',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        token_data: {
          scope: tokens.scope,
          tenant_id: tenantId,
          user_info: userInfo
        }
      }, {
        onConflict: 'user_id,project_id,provider'
      });

    // Redirect back to the app
    const redirectUrl = `${supabaseUrl.replace('.supabase.co', '.vercel.app')}/dashboard?office365_connected=true`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl
      }
    });

  } catch (error) {
    console.error('Callback error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});
