
import { ProjectContext } from './types.ts';

export async function getProjectContext(supabase: any, projectId: string): Promise<ProjectContext> {
  // Get project basic info
  const { data: projectData } = await supabase
    .from('projects')
    .select('name, description, status, start_date, end_date')
    .eq('id', projectId)
    .single();

  // Get task statistics
  const { data: taskStats } = await supabase
    .from('tasks')
    .select('status')
    .eq('project_id', projectId);

  // Get budget statistics
  const { data: budgetStats } = await supabase
    .from('budget_items')
    .select('budgeted_amount, actual_amount')
    .eq('project_id', projectId);

  // Process task summary
  const taskSummary = taskStats?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Process budget summary
  const budgetSummary = budgetStats?.reduce((acc, item) => {
    acc.budgeted += item.budgeted_amount || 0;
    acc.actual += item.actual_amount || 0;
    return acc;
  }, { budgeted: 0, actual: 0 }) || { budgeted: 0, actual: 0 };

  return {
    name: projectData?.name,
    status: projectData?.status,
    description: projectData?.description,
    taskSummary,
    budgetSummary,
  };
}
