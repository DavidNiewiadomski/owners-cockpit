
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { project_id, provider } = await req.json();

    if (!project_id || !provider) {
      return new Response(
        JSON.stringify({ error: 'Missing project_id or provider' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`🔄 Mock sync started for project: ${project_id}, provider: ${provider}`);

    // First, update status to syncing
    const { error: syncingError } = await supabase
      .from('project_integrations')
      .update({ 
        status: 'syncing',
        sync_error: null,
        updated_at: new Date().toISOString()
      })
      .eq('project_id', project_id)
      .eq('provider', provider);

    if (syncingError) {
      console.error('❌ Error updating to syncing:', syncingError);
      return new Response(
        JSON.stringify({ error: 'Failed to update sync status' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simulate sync delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update to connected status
    const { data, error } = await supabase
      .from('project_integrations')
      .update({
        status: 'connected',
        last_sync: new Date().toISOString(),
        sync_error: null,
        updated_at: new Date().toISOString()
      })
      .eq('project_id', project_id)
      .eq('provider', provider)
      .select()
      .single();

    if (error) {
      console.error('❌ Error completing sync:', error);
      
      // Update to error status
      await supabase
        .from('project_integrations')
        .update({
          status: 'error',
          sync_error: 'Mock sync failed',
          updated_at: new Date().toISOString()
        })
        .eq('project_id', project_id)
        .eq('provider', provider);

      return new Response(
        JSON.stringify({ error: 'Sync failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`✅ Mock sync completed for project: ${project_id}, provider: ${provider}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sync completed successfully',
        integration: data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Mock sync error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
