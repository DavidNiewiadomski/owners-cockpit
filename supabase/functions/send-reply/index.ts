
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message_id, reply_body, project_id, user_id } = await req.json();

    if (!message_id || !reply_body || !project_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's Outlook token
    const { data: tokenData, error: tokenError } = await supabase
      .from('integration_tokens')
      .select('*')
      .eq('user_id', user_id)
      .eq('project_id', project_id)
      .eq('provider', 'outlook')
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ error: 'Outlook integration not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send reply via Microsoft Graph
    const replyResponse = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${message_id}/reply`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          body: {
            contentType: 'HTML',
            content: reply_body.replace(/\n/g, '<br>')
          }
        }
      })
    });

    if (!replyResponse.ok) {
      const errorText = await replyResponse.text();
      console.error('Failed to send reply:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send reply', details: errorText }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Reply sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Send reply error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
