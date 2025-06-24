
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { project_id } = await req.json();

    if (!project_id) {
      return new Response(
        JSON.stringify({ error: 'project_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Setting up AI Autopilot for project: ${project_id}`);

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('name')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize autopilot configuration
    const { error: configError } = await supabase
      .from('project_integrations')
      .upsert({
        project_id: project_id,
        provider: 'ai_autopilot',
        status: 'connected',
        config: {
          weekly_summary: true,
          daily_reports: true,
          next_actions: true,
          daily_limit: 10,
          last_action_count: 0,
          last_reset_date: new Date().toISOString().split('T')[0],
          setup_date: new Date().toISOString()
        }
      });

    if (configError) {
      console.error('Error setting up autopilot config:', configError);
      return new Response(
        JSON.stringify({ error: 'Failed to setup autopilot configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the autopilot activation
    await supabase
      .from('integration_logs')
      .insert({
        project_id: project_id,
        source: 'ai_autopilot',
        operation: 'activate',
        status: 'success',
        metadata: {
          project_name: project.name,
          features_enabled: ['weekly_summary', 'daily_reports', 'next_actions']
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: `AI Autopilot activated for project: ${project.name}`,
        project_id: project_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Setup autopilot error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
