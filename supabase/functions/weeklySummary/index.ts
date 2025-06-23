
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeeklyContext {
  project_id: string;
  project_name: string;
  tasks: {
    completed: number;
    overdue: number;
    total: number;
    recent_completions: Array<{
      name: string;
      completed_date: string;
    }>;
  };
  budget: {
    total_budgeted: number;
    total_actual: number;
    variance: number;
    recent_expenses: Array<{
      category: string;
      amount: number;
      date: string;
    }>;
  };
  rfi: {
    open: number;
    closed: number;
    overdue: number;
  };
  documents: {
    uploaded: number;
    processed: number;
  };
}

async function getWeeklyContext(supabase: any, projectId: string): Promise<WeeklyContext> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoISO = weekAgo.toISOString();

  // Get project info
  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', projectId)
    .single();

  // Get task metrics
  const { data: tasks } = await supabase
    .from('tasks')
    .select('name, status, updated_at')
    .eq('project_id', projectId);

  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
  const overdueTasks = tasks?.filter(t => t.status === 'overdue') || [];
  const recentCompletions = completedTasks
    .filter(t => new Date(t.updated_at) >= weekAgo)
    .slice(0, 5)
    .map(t => ({
      name: t.name,
      completed_date: t.updated_at
    }));

  // Get budget metrics
  const { data: budgetItems } = await supabase
    .from('budget_items')
    .select('category, budgeted_amount, actual_amount, updated_at')
    .eq('project_id', projectId);

  const totalBudgeted = budgetItems?.reduce((sum, item) => sum + (item.budgeted_amount || 0), 0) || 0;
  const totalActual = budgetItems?.reduce((sum, item) => sum + (item.actual_amount || 0), 0) || 0;
  const recentExpenses = budgetItems
    ?.filter(item => new Date(item.updated_at) >= weekAgo && item.actual_amount > 0)
    .slice(0, 5)
    .map(item => ({
      category: item.category,
      amount: item.actual_amount,
      date: item.updated_at
    })) || [];

  // Get RFI metrics
  const { data: rfis } = await supabase
    .from('rfi')
    .select('status, due_date')
    .eq('project_id', projectId);

  const openRfis = rfis?.filter(r => r.status === 'open').length || 0;
  const closedRfis = rfis?.filter(r => r.status === 'closed').length || 0;
  const overdueRfis = rfis?.filter(r => 
    r.status === 'open' && r.due_date && new Date(r.due_date) < new Date()
  ).length || 0;

  // Get document metrics
  const { data: documents } = await supabase
    .from('documents')
    .select('processed, created_at')
    .eq('project_id', projectId)
    .gte('created_at', weekAgoISO);

  const uploadedDocs = documents?.length || 0;
  const processedDocs = documents?.filter(d => d.processed).length || 0;

  return {
    project_id: projectId,
    project_name: project?.name || 'Unknown Project',
    tasks: {
      completed: completedTasks.length,
      overdue: overdueTasks.length,
      total: tasks?.length || 0,
      recent_completions: recentCompletions
    },
    budget: {
      total_budgeted: totalBudgeted,
      total_actual: totalActual,
      variance: totalBudgeted - totalActual,
      recent_expenses: recentExpenses
    },
    rfi: {
      open: openRfis,
      closed: closedRfis,
      overdue: overdueRfis
    },
    documents: {
      uploaded: uploadedDocs,
      processed: processedDocs
    }
  };
}

async function generateSummary(context: WeeklyContext, openaiKey: string): Promise<string> {
  const systemPrompt = `You are a construction project assistant generating a weekly summary report for project owners. 
Keep the summary under 300 words, professional, and actionable. Focus on progress, issues, and key metrics.
Include specific numbers and percentages where relevant.`;

  const userPrompt = `Generate a weekly summary for project "${context.project_name}" based on this data:

TASKS: ${context.tasks.completed} completed, ${context.tasks.overdue} overdue out of ${context.tasks.total} total
Recent completions: ${context.tasks.recent_completions.map(t => t.name).join(', ') || 'None'}

BUDGET: $${context.budget.total_actual.toLocaleString()} spent of $${context.budget.total_budgeted.toLocaleString()} budgeted
Variance: ${context.budget.variance >= 0 ? 'Under' : 'Over'} budget by $${Math.abs(context.budget.variance).toLocaleString()}
Recent expenses: ${context.budget.recent_expenses.map(e => `${e.category}: $${e.amount}`).join(', ') || 'None'}

RFI: ${context.rfi.open} open, ${context.rfi.closed} closed, ${context.rfi.overdue} overdue

DOCUMENTS: ${context.documents.uploaded} uploaded, ${context.documents.processed} processed this week`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function saveReport(supabase: any, projectId: string, summary: string, context: WeeklyContext) {
  const reportData = {
    project_id: projectId,
    report_type: 'weekly_summary',
    content: summary,
    metadata: {
      week_ending: new Date().toISOString(),
      metrics: context
    }
  };

  const { data, error } = await supabase
    .from('reports')
    .insert(reportData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function postToSlack(webhookUrl: string, projectName: string, summary: string) {
  const slackPayload = {
    text: `📊 Weekly Project Summary: ${projectName}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📊 ${projectName} - Weekly Summary`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: summary
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Generated on ${new Date().toLocaleDateString()} by Owners Cockpit`
          }
        ]
      }
    ]
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackPayload),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook error: ${response.status}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_KEY');
    const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_KEY environment variable is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { project_id, scheduled = false } = await req.json();

    if (!project_id) {
      return new Response(
        JSON.stringify({ error: 'project_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating weekly summary for project: ${project_id}`);

    // Get project context for the past week
    const context = await getWeeklyContext(supabase, project_id);
    console.log('Context gathered:', context);

    // Generate AI summary
    const summary = await generateSummary(context, openaiKey);
    console.log('Summary generated:', summary.substring(0, 100) + '...');

    // Save report to database
    const report = await saveReport(supabase, project_id, summary, context);
    console.log('Report saved:', report.id);

    // Post to Slack if webhook is configured
    if (slackWebhook) {
      try {
        await postToSlack(slackWebhook, context.project_name, summary);
        console.log('Posted to Slack successfully');
      } catch (error) {
        console.error('Failed to post to Slack:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        summary: summary,
        project_name: context.project_name,
        posted_to_slack: !!slackWebhook
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Weekly summary error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
