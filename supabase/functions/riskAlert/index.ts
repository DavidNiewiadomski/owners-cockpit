import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { 
  sendSlackNotification, 
  createRiskAlertSlackPayload 
} from "../_shared/sendSlack.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RiskAlert {
  project_id: string;
  project_name: string;
  alert_type: 'overdue_tasks' | 'budget_variance' | 'overdue_rfi';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  alert_key: string;
  metadata: any;
}

async function checkOverdueTasks(supabase: any): Promise<RiskAlert[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: overdueTasks } = await supabase
    .from('tasks')
    .select(`
      id, name, due_date, project_id,
      projects!inner(name, owner_id)
    `)
    .eq('status', 'in_progress')
    .lt('due_date', today);

  const alerts: RiskAlert[] = [];
  
  for (const task of overdueTasks || []) {
    // Check if we've already sent an alert for this task
    const { data: alreadySent } = await supabase
      .from('alerts_sent')
      .select('id')
      .eq('project_id', task.project_id)
      .eq('alert_type', 'overdue_tasks')
      .eq('alert_key', task.id)
      .single();

    if (!alreadySent) {
      const daysPastDue = Math.ceil((new Date().getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24));
      
      alerts.push({
        project_id: task.project_id,
        project_name: task.projects.name,
        alert_type: 'overdue_tasks',
        severity: daysPastDue > 7 ? 'high' : daysPastDue > 3 ? 'medium' : 'low',
        title: `Overdue Task: ${task.name}`,
        description: `Task "${task.name}" is ${daysPastDue} day(s) overdue (due: ${task.due_date})`,
        alert_key: task.id,
        metadata: {
          task_id: task.id,
          task_name: task.name,
          due_date: task.due_date,
          days_overdue: daysPastDue
        }
      });
    }
  }

  return alerts;
}

async function checkBudgetVariance(supabase: any): Promise<RiskAlert[]> {
  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id, name,
      budget_items(budgeted_amount, actual_amount)
    `);

  const alerts: RiskAlert[] = [];

  for (const project of projects || []) {
    const totalBudgeted = project.budget_items?.reduce((sum: number, item: any) => sum + (item.budgeted_amount || 0), 0) || 0;
    const totalActual = project.budget_items?.reduce((sum: number, item: any) => sum + (item.actual_amount || 0), 0) || 0;
    
    if (totalBudgeted > 0) {
      const variancePercent = ((totalActual - totalBudgeted) / totalBudgeted) * 100;
      
      if (Math.abs(variancePercent) > 5) {
        // Check if we've already sent an alert for this project's budget variance
        const alertKey = `budget_variance_${Math.floor(Math.abs(variancePercent) / 5) * 5}`; // Group by 5% bands
        
        const { data: alreadySent } = await supabase
          .from('alerts_sent')
          .select('id')
          .eq('project_id', project.id)
          .eq('alert_type', 'budget_variance')
          .eq('alert_key', alertKey)
          .single();

        if (!alreadySent) {
          alerts.push({
            project_id: project.id,
            project_name: project.name,
            alert_type: 'budget_variance',
            severity: Math.abs(variancePercent) > 20 ? 'critical' : Math.abs(variancePercent) > 15 ? 'high' : 'medium',
            title: `Budget Variance Alert: ${project.name}`,
            description: `Project budget is ${variancePercent > 0 ? 'over' : 'under'} by ${Math.abs(variancePercent).toFixed(1)}% ($${Math.abs(totalActual - totalBudgeted).toLocaleString()})`,
            alert_key: alertKey,
            metadata: {
              total_budgeted: totalBudgeted,
              total_actual: totalActual,
              variance_percent: variancePercent,
              variance_amount: totalActual - totalBudgeted
            }
          });
        }
      }
    }
  }

  return alerts;
}

async function checkOverdueRFIs(supabase: any): Promise<RiskAlert[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString().split('T')[0];

  const { data: overdueRFIs } = await supabase
    .from('rfi')
    .select(`
      id, title, due_date, created_at, project_id,
      projects!inner(name, owner_id)
    `)
    .eq('status', 'open')
    .or(`due_date.lt.${new Date().toISOString().split('T')[0]},created_at.lt.${sevenDaysAgoISO}`);

  const alerts: RiskAlert[] = [];

  for (const rfi of overdueRFIs || []) {
    // Check if we've already sent an alert for this RFI
    const { data: alreadySent } = await supabase
      .from('alerts_sent')
      .select('id')
      .eq('project_id', rfi.project_id)
      .eq('alert_type', 'overdue_rfi')
      .eq('alert_key', rfi.id)
      .single();

    if (!alreadySent) {
      const isOverdueDueDate = rfi.due_date && new Date(rfi.due_date) < new Date();
      const daysSinceCreated = Math.ceil((new Date().getTime() - new Date(rfi.created_at).getTime()) / (1000 * 60 * 60 * 24));
      
      let description = `RFI "${rfi.title}" has been open for ${daysSinceCreated} days`;
      if (isOverdueDueDate) {
        const daysPastDue = Math.ceil((new Date().getTime() - new Date(rfi.due_date).getTime()) / (1000 * 60 * 60 * 24));
        description += ` and is ${daysPastDue} day(s) past due date`;
      }

      alerts.push({
        project_id: rfi.project_id,
        project_name: rfi.projects.name,
        alert_type: 'overdue_rfi',
        severity: daysSinceCreated > 14 ? 'high' : daysSinceCreated > 10 ? 'medium' : 'low',
        title: `Overdue RFI: ${rfi.title}`,
        description: description,
        alert_key: rfi.id,
        metadata: {
          rfi_id: rfi.id,
          rfi_title: rfi.title,
          due_date: rfi.due_date,
          days_since_created: daysSinceCreated,
          is_overdue_due_date: isOverdueDueDate
        }
      });
    }
  }

  return alerts;
}

async function saveAlert(supabase: any, alert: RiskAlert) {
  // Insert the alert
  const { data: savedAlert, error: alertError } = await supabase
    .from('alerts')
    .insert({
      project_id: alert.project_id,
      alert_type: alert.alert_type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      metadata: alert.metadata
    })
    .select()
    .single();

  if (alertError) throw alertError;

  // Mark as sent to prevent duplicates
  const { error: sentError } = await supabase
    .from('alerts_sent')
    .insert({
      project_id: alert.project_id,
      alert_type: alert.alert_type,
      alert_key: alert.alert_key
    });

  if (sentError) throw sentError;

  return savedAlert;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { project_id, scheduled = false } = await req.json();

    console.log('Running risk alert checks...');

    // Collect all alerts
    const allAlerts: RiskAlert[] = [];

    // Check overdue tasks
    const overdueTaskAlerts = await checkOverdueTasks(supabase);
    allAlerts.push(...overdueTaskAlerts);

    // Check budget variance
    const budgetAlerts = await checkBudgetVariance(supabase);
    allAlerts.push(...budgetAlerts);

    // Check overdue RFIs
    const rfiAlerts = await checkOverdueRFIs(supabase);
    allAlerts.push(...rfiAlerts);

    // Filter by project if specified
    const filteredAlerts = project_id ? 
      allAlerts.filter(alert => alert.project_id === project_id) : 
      allAlerts;

    console.log(`Found ${filteredAlerts.length} new alerts`);

    const savedAlerts = [];

    // Process each alert
    for (const alert of filteredAlerts) {
      try {
        // Save alert to database
        const savedAlert = await saveAlert(supabase, alert);
        savedAlerts.push(savedAlert);

        // Send to Slack if webhook is configured
        if (slackWebhook) {
          const slackPayload = createRiskAlertSlackPayload(
            alert.project_name,
            alert.title,
            alert.severity,
            alert.description
          );
          await sendSlackNotification(slackWebhook, slackPayload);
          console.log(`Sent Slack notification for: ${alert.title}`);
        }
      } catch (error) {
        console.error(`Failed to process alert: ${alert.title}`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alerts_found: filteredAlerts.length,
        alerts_saved: savedAlerts.length,
        alerts: savedAlerts.map(alert => ({
          id: alert.id,
          type: alert.alert_type,
          severity: alert.severity,
          title: alert.title
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Risk alert error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
