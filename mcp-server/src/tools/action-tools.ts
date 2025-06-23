
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { NextActionSchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getNextAction(args: unknown) {
  const params = NextActionSchema.parse(args);

  // Verify project exists
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, status')
    .eq('id', params.project_id)
    .single();

  if (projectError || !project) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Project not found: ${params.project_id}`
    );
  }

  // Get project data for analysis
  const [tasksResult, rfisResult, alertsResult, budgetResult] = await Promise.all([
    // Get overdue and high priority tasks
    supabase
      .from('tasks')
      .select('*')
      .eq('project_id', params.project_id)
      .in('status', ['not_started', 'in_progress'])
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true }),
    
    // Get open RFIs, especially overdue ones
    supabase
      .from('rfi')
      .select('*')
      .eq('project_id', params.project_id)
      .eq('status', 'open')
      .order('due_date', { ascending: true }),
    
    // Get unresolved alerts
    supabase
      .from('alerts')
      .select('*')
      .eq('project_id', params.project_id)
      .eq('resolved', false)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: true }),
    
    // Get budget items with variance
    supabase
      .from('budget_items')
      .select('*')
      .eq('project_id', params.project_id)
  ]);

  const tasks = tasksResult.data || [];
  const rfis = rfisResult.data || [];
  const alerts = alertsResult.data || [];
  const budgetItems = budgetResult.data || [];

  // Analyze and prioritize actions
  const today = new Date();
  let highestImpactAction = null;
  let maxScore = 0;

  // Score overdue RFIs (highest priority)
  for (const rfi of rfis) {
    if (rfi.due_date && new Date(rfi.due_date) < today) {
      const daysOverdue = Math.ceil((today.getTime() - new Date(rfi.due_date).getTime()) / (1000 * 60 * 60 * 24));
      const score = 100 + daysOverdue * 5; // Base score 100 + overdue penalty
      
      if (score > maxScore) {
        maxScore = score;
        highestImpactAction = {
          title: `Resolve Overdue RFI: ${rfi.title}`,
          description: `This RFI is ${daysOverdue} days overdue and blocking project progress. ${rfi.description || 'Immediate attention required to prevent further delays.'}`,
          assignee: rfi.assigned_to || 'Project Manager'
        };
      }
    }
  }

  // Score critical alerts
  for (const alert of alerts) {
    let score = 80; // Base score for unresolved alerts
    if (alert.severity === 'critical') score += 30;
    else if (alert.severity === 'high') score += 20;
    else if (alert.severity === 'medium') score += 10;
    
    const daysSinceAlert = Math.ceil((today.getTime() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60 * 24));
    score += daysSinceAlert * 2; // Urgency increases with time
    
    if (score > maxScore) {
      maxScore = score;
      highestImpactAction = {
        title: `Address Critical Alert: ${alert.title}`,
        description: `${alert.description} This ${alert.severity} severity alert has been open for ${daysSinceAlert} days and requires immediate action.`,
        assignee: 'Project Manager'
      };
    }
  }

  // Score overdue high-priority tasks
  for (const task of tasks) {
    let score = 50 + (task.priority || 1) * 15; // Base score + priority bonus
    
    if (task.due_date && new Date(task.due_date) < today) {
      const daysOverdue = Math.ceil((today.getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24));
      score += daysOverdue * 3; // Overdue penalty
    }
    
    if (score > maxScore) {
      maxScore = score;
      const overdueText = task.due_date && new Date(task.due_date) < today 
        ? ` This task is ${Math.ceil((today.getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue.`
        : '';
      
      highestImpactAction = {
        title: `Complete High-Priority Task: ${task.name}`,
        description: `${task.description || 'Critical task requiring immediate attention.'}${overdueText}`,
        assignee: task.assigned_to || 'Project Team'
      };
    }
  }

  // Score budget variance issues
  for (const budgetItem of budgetItems) {
    if (budgetItem.budgeted_amount && budgetItem.actual_amount) {
      const variance = (budgetItem.actual_amount - budgetItem.budgeted_amount) / budgetItem.budgeted_amount;
      if (variance > 0.1) { // More than 10% over budget
        const score = 60 + variance * 100; // Score based on variance percentage
        
        if (score > maxScore) {
          maxScore = score;
          highestImpactAction = {
            title: `Address Budget Overrun: ${budgetItem.category}`,
            description: `Budget item "${budgetItem.category}" is ${(variance * 100).toFixed(1)}% over budget (${budgetItem.actual_amount} vs ${budgetItem.budgeted_amount} budgeted). Immediate cost control measures needed.`,
            assignee: 'Project Manager'
          };
        }
      }
    }
  }

  // Default action if no specific issues found
  if (!highestImpactAction) {
    // Look for the next upcoming task
    const nextTask = tasks.find(task => task.status === 'not_started');
    if (nextTask) {
      highestImpactAction = {
        title: `Start Next Planned Task: ${nextTask.name}`,
        description: nextTask.description || 'Begin work on the next scheduled task to maintain project momentum.',
        assignee: nextTask.assigned_to || 'Project Team'
      };
    } else {
      highestImpactAction = {
        title: 'Review Project Status',
        description: 'Conduct a comprehensive review of project progress, update schedules, and identify any emerging issues or opportunities.',
        assignee: 'Project Manager'
      };
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          project_name: project.name,
          next_action: highestImpactAction,
          analysis_summary: {
            tasks_analyzed: tasks.length,
            open_rfis: rfis.length,
            unresolved_alerts: alerts.length,
            budget_items: budgetItems.length,
            impact_score: maxScore
          }
        }, null, 2),
      },
    ],
  };
}
