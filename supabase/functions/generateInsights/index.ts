
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProjectData {
  id: string;
  name: string;
  status: string;
  budget_items: any[];
  tasks: any[];
  rfi: any[];
  safety_incidents: any[];
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

    console.log('Starting insight generation...');

    // Get all active projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .in('status', ['active', 'in_progress']);

    if (projectsError) {
      throw new Error(`Failed to fetch projects: ${projectsError.message}`);
    }

    let totalInsights = 0;

    for (const project of projects || []) {
      console.log(`Generating insights for project: ${project.name}`);
      
      // Get project data for analysis
      const projectData = await gatherProjectData(supabase, project.id);
      
      // Generate insights using AI
      const insights = await generateProjectInsights(project, projectData);
      
      // Save insights to database
      for (const insight of insights) {
        const { error: insertError } = await supabase
          .from('insights')
          .insert({
            project_id: project.id,
            severity: insight.severity,
            title: insight.title,
            summary: insight.summary,
            context_data: insight.context_data
          });

        if (insertError) {
          console.error(`Failed to insert insight: ${insertError.message}`);
        } else {
          totalInsights++;
        }
      }
    }

    console.log(`Generated ${totalInsights} total insights`);

    return new Response(JSON.stringify({ 
      success: true, 
      insights_generated: totalInsights,
      projects_analyzed: projects?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Insight generation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function gatherProjectData(supabase: unknown, projectId: string): Promise<ProjectData | null> {
  try {
    // Get recent data (last 24 hours for real-time insights)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const [budgetItems, tasks, rfis, safetyIncidents] = await Promise.all([
      supabase.from('budget_items').select('*').eq('project_id', projectId),
      supabase.from('tasks').select('*').eq('project_id', projectId).gte('updated_at', yesterday.toISOString()),
      supabase.from('rfi').select('*').eq('project_id', projectId).gte('updated_at', yesterday.toISOString()),
      supabase.from('safety_incidents').select('*').eq('project_id', projectId).gte('updated_at', yesterday.toISOString())
    ]);

    return {
      id: projectId,
      name: '',
      status: '',
      budget_items: budgetItems.data || [],
      tasks: tasks.data || [],
      rfi: rfis.data || [],
      safety_incidents: safetyIncidents.data || []
    };
  } catch (error) {
    console.error(`Error gathering data for project ${projectId}:`, error);
    return null;
  }
}

async function generateProjectInsights(project: unknown, projectData: ProjectData | null): Promise<any[]> {
  if (!projectData) return [];

  const insights = [];

  // Analyze overdue tasks
  const overdueTasks = projectData.tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
  );

  if (overdueTasks.length > 0) {
    const severity = overdueTasks.length > 5 ? 'critical' : overdueTasks.length > 2 ? 'high' : 'medium';
    insights.push({
      severity,
      title: `${overdueTasks.length} Overdue Tasks Detected`,
      summary: `Project has ${overdueTasks.length} overdue tasks that may impact schedule. Most critical: ${overdueTasks[0]?.name || 'Task'} (${Math.ceil((new Date().getTime() - new Date(overdueTasks[0]?.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue).`,
      context_data: { 
        type: 'overdue_tasks', 
        count: overdueTasks.length,
        tasks: overdueTasks.slice(0, 3).map(t => ({ name: t.name, due_date: t.due_date }))
      }
    });
  }

  // Analyze budget overruns
  const budgetAnalysis = analyzeBudgetOverruns(projectData.budget_items);
  if (budgetAnalysis.overruns.length > 0) {
    const totalOverrun = budgetAnalysis.overruns.reduce((sum, item) => sum + (item.actual_amount - item.budgeted_amount), 0);
    const severity = totalOverrun > 100000 ? 'critical' : totalOverrun > 50000 ? 'high' : 'medium';
    
    insights.push({
      severity,
      title: `Budget Overrun Alert: $${Math.round(totalOverrun).toLocaleString()}`,
      summary: `${budgetAnalysis.overruns.length} budget categories are over budget by a total of $${Math.round(totalOverrun).toLocaleString()}. Largest overrun: ${budgetAnalysis.overruns[0]?.category} ($${Math.round(budgetAnalysis.overruns[0]?.actual_amount - budgetAnalysis.overruns[0]?.budgeted_amount).toLocaleString()}).`,
      context_data: { 
        type: 'budget_overrun', 
        total_overrun: totalOverrun,
        categories: budgetAnalysis.overruns.slice(0, 3)
      }
    });
  }

  // Analyze safety incidents
  if (projectData.safety_incidents.length > 0) {
    const criticalIncidents = projectData.safety_incidents.filter(i => i.severity === 'critical' || i.severity === 'high');
    if (criticalIncidents.length > 0) {
      insights.push({
        severity: 'critical',
        title: `${criticalIncidents.length} Critical Safety Incident(s)`,
        summary: `New critical safety incidents reported in the last 24 hours. Immediate attention required for: ${criticalIncidents[0]?.title}`,
        context_data: { 
          type: 'safety_incidents', 
          count: criticalIncidents.length,
          incidents: criticalIncidents.slice(0, 2)
        }
      });
    }
  }

  // Analyze overdue RFIs
  const overdueRFIs = projectData.rfi.filter(rfi => 
    rfi.due_date && new Date(rfi.due_date) < new Date() && rfi.status === 'open'
  );

  if (overdueRFIs.length > 0) {
    insights.push({
      severity: overdueRFIs.length > 3 ? 'high' : 'medium',
      title: `${overdueRFIs.length} Overdue RFI(s)`,
      summary: `${overdueRFIs.length} RFIs are past their due date and may be blocking project progress. Oldest: ${overdueRFIs[0]?.title} (${Math.ceil((new Date().getTime() - new Date(overdueRFIs[0]?.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue).`,
      context_data: { 
        type: 'overdue_rfis', 
        count: overdueRFIs.length,
        rfis: overdueRFIs.slice(0, 3).map(r => ({ title: r.title, due_date: r.due_date }))
      }
    });
  }

  return insights;
}

function analyzeBudgetOverruns(budgetItems: any[]) {
  const overruns = budgetItems.filter(item => 
    item.actual_amount > item.budgeted_amount && item.budgeted_amount > 0
  ).sort((a, b) => (b.actual_amount - b.budgeted_amount) - (a.actual_amount - a.budgeted_amount));

  return { overruns };
}
