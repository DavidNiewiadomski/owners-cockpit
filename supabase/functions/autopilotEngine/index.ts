
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutopilotConfig {
  weekly_summary: boolean;
  daily_reports: boolean;
  next_actions: boolean;
  daily_limit: number;
  last_action_count: number;
  last_reset_date: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action_type, project_id, scheduled = false } = await req.json();

    console.log(`Autopilot engine triggered: ${action_type} for project ${project_id || 'all'}`);

    // Get all projects with autopilot enabled
    const { data: autopilotProjects, error: projectsError } = await supabase
      .from('project_integrations')
      .select('project_id, config, projects!inner(name)')
      .eq('provider', 'ai_autopilot')
      .eq('status', 'connected');

    if (projectsError) {
      throw new Error(`Failed to fetch autopilot projects: ${projectsError.message}`);
    }

    const today = new Date().toISOString().split('T')[0];
    const results = [];

    for (const autopilot of autopilotProjects || []) {
      const config = autopilot.config as AutopilotConfig;
      
      // Reset daily action count if new day
      if (config.last_reset_date !== today) {
        config.last_action_count = 0;
        config.last_reset_date = today;
        
        await supabase
          .from('project_integrations')
          .update({ config })
          .eq('project_id', autopilot.project_id)
          .eq('provider', 'ai_autopilot');
      }

      // Check daily limit
      if (config.last_action_count >= config.daily_limit) {
        console.log(`Daily limit reached for project ${autopilot.project_id}`);
        continue;
      }

      // Execute based on action type
      let actionTaken = false;

      switch (action_type) {
        case 'weekly_summary':
          if (config.weekly_summary) {
            await executeWeeklySummary(supabase, autopilot.project_id);
            actionTaken = true;
          }
          break;

        case 'daily_report':
          if (config.daily_reports) {
            await executeDailyReport(supabase, autopilot.project_id);
            actionTaken = true;
          }
          break;

        case 'next_actions':
          if (config.next_actions) {
            await executeNextActions(supabase, autopilot.project_id);
            actionTaken = true;
          }
          break;

        case 'all':
          // Execute all enabled features
          if (config.weekly_summary && isWeeklyTime()) {
            await executeWeeklySummary(supabase, autopilot.project_id);
            actionTaken = true;
          }
          if (config.daily_reports) {
            await executeDailyReport(supabase, autopilot.project_id);
            actionTaken = true;
          }
          if (config.next_actions) {
            await executeNextActions(supabase, autopilot.project_id);
            actionTaken = true;
          }
          break;
      }

      if (actionTaken) {
        // Increment action count
        config.last_action_count += 1;
        
        await supabase
          .from('project_integrations')
          .update({ config })
          .eq('project_id', autopilot.project_id)
          .eq('provider', 'ai_autopilot');

        results.push({
          project_id: autopilot.project_id,
          project_name: autopilot.projects.name,
          action_taken: action_type,
          actions_remaining: config.daily_limit - config.last_action_count
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        total_actions: results.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Autopilot engine error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function executeWeeklySummary(supabase: any, projectId: string) {
  console.log(`Executing weekly summary for project ${projectId}`);
  
  try {
    // Call the existing weekly summary function
    const { error } = await supabase.functions.invoke('weeklySummary', {
      body: { project_id: projectId, autopilot: true }
    });

    if (error) throw error;

    // Log the action
    await supabase
      .from('integration_logs')
      .insert({
        project_id: projectId,
        source: 'ai_autopilot',
        operation: 'weekly_summary',
        status: 'success',
        metadata: { automated: true }
      });

  } catch (error) {
    console.error(`Failed to execute weekly summary for ${projectId}:`, error);
    await supabase
      .from('integration_logs')
      .insert({
        project_id: projectId,
        source: 'ai_autopilot',
        operation: 'weekly_summary',
        status: 'error',
        error_message: error.message
      });
  }
}

async function executeDailyReport(supabase: any, projectId: string) {
  console.log(`Executing daily report for project ${projectId}`);
  
  try {
    // Get project data for daily report
    const [tasksResult, rfisResult, documentsResult] = await Promise.all([
      supabase.from('tasks').select('*').eq('project_id', projectId).limit(10),
      supabase.from('rfi').select('*').eq('project_id', projectId).eq('status', 'open').limit(5),
      supabase.from('documents').select('*').eq('project_id', projectId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    const reportContent = generateDailyReportContent({
      tasks: tasksResult.data || [],
      rfis: rfisResult.data || [],
      documents: documentsResult.data || []
    });

    // Save the daily report as a document
    const { error } = await supabase
      .from('documents')
      .insert({
        project_id: projectId,
        title: `Daily Site Report - ${new Date().toLocaleDateString()}`,
        doc_type: 'report',
        source: 'ai_autopilot',
        processed: true,
        file_path: `reports/daily-${projectId}-${Date.now()}.txt`
      });

    if (error) throw error;

    // Log the action
    await supabase
      .from('integration_logs')
      .insert({
        project_id: projectId,
        source: 'ai_autopilot',
        operation: 'daily_report',
        status: 'success',
        metadata: { 
          automated: true,
          report_items: {
            tasks: tasksResult.data?.length || 0,
            rfis: rfisResult.data?.length || 0,
            documents: documentsResult.data?.length || 0
          }
        }
      });

  } catch (error) {
    console.error(`Failed to execute daily report for ${projectId}:`, error);
  }
}

async function executeNextActions(supabase: any, projectId: string) {
  console.log(`Executing next actions for project ${projectId}`);
  
  try {
    // Get project context and generate next best actions
    const [overdueTasks, overdueRfis, criticalAlerts] = await Promise.all([
      supabase.from('tasks').select('*').eq('project_id', projectId)
        .lt('due_date', new Date().toISOString()).eq('status', 'not_started'),
      supabase.from('rfi').select('*').eq('project_id', projectId)
        .eq('status', 'open').lt('due_date', new Date().toISOString()),
      supabase.from('alerts').select('*').eq('project_id', projectId)
        .eq('resolved', false).in('severity', ['high', 'critical'])
    ]);

    const nextActions = generateNextBestActions({
      overdueTasks: overdueTasks.data || [],
      overdueRfis: overdueRfis.data || [],
      criticalAlerts: criticalAlerts.data || []
    });

    // Create tasks for next actions
    for (const action of nextActions) {
      await supabase
        .from('tasks')
        .insert({
          project_id: projectId,
          name: action.title,
          description: action.description,
          priority: action.priority,
          assigned_to: action.assignee,
          due_date: action.due_date,
          source: 'ai_autopilot',
          status: 'not_started'
        });
    }

    // Log the action
    await supabase
      .from('integration_logs')
      .insert({
        project_id: projectId,
        source: 'ai_autopilot',
        operation: 'next_actions',
        status: 'success',
        metadata: { 
          automated: true,
          actions_created: nextActions.length
        }
      });

  } catch (error) {
    console.error(`Failed to execute next actions for ${projectId}:`, error);
  }
}

function generateDailyReportContent(data: any) {
  const today = new Date().toLocaleDateString();
  return `
Daily Site Report - ${today}

TASKS SUMMARY:
- Active Tasks: ${data.tasks.filter((t: any) => t.status === 'in_progress').length}
- Overdue Tasks: ${data.tasks.filter((t: any) => new Date(t.due_date) < new Date()).length}

RFI STATUS:
- Open RFIs: ${data.rfis.length}
- Overdue RFIs: ${data.rfis.filter((r: any) => new Date(r.due_date) < new Date()).length}

DOCUMENTS:
- New Documents Today: ${data.documents.length}

Generated automatically by AI Autopilot
`;
}

function generateNextBestActions(context: any) {
  const actions = [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Generate actions for overdue tasks
  if (context.overdueTasks.length > 0) {
    actions.push({
      title: 'Review Overdue Tasks',
      description: `${context.overdueTasks.length} tasks are overdue and need immediate attention`,
      priority: 3,
      assignee: 'Project Manager',
      due_date: tomorrow.toISOString().split('T')[0]
    });
  }

  // Generate actions for overdue RFIs
  if (context.overdueRfis.length > 0) {
    actions.push({
      title: 'Follow Up on Overdue RFIs',
      description: `${context.overdueRfis.length} RFIs are past due and blocking progress`,
      priority: 3,
      assignee: 'Project Manager',
      due_date: tomorrow.toISOString().split('T')[0]
    });
  }

  // Generate actions for critical alerts
  if (context.criticalAlerts.length > 0) {
    actions.push({
      title: 'Address Critical Alerts',
      description: `${context.criticalAlerts.length} critical alerts require immediate action`,
      priority: 3,
      assignee: 'Site Supervisor',
      due_date: tomorrow.toISOString().split('T')[0]
    });
  }

  return actions;
}

function isWeeklyTime() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  
  // Friday at 5 PM
  return dayOfWeek === 5 && hour === 17;
}
