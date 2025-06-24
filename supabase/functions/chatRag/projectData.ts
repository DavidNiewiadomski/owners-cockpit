
export async function getProjectData(supabase: any, projectId: string): Promise<any> {
  console.log('Getting project data...');
  
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

  // Get RFI count
  const { data: rfiStats } = await supabase
    .from('rfis')
    .select('id')
    .eq('project_id', projectId);

  // Process task summary
  const taskSummary = taskStats?.reduce((acc: any, task: any) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Process budget summary
  const budgetSummary = budgetStats?.reduce((acc: any, item: any) => {
    acc.budgeted += item.budgeted_amount || 0;
    acc.actual += item.actual_amount || 0;
    return acc;
  }, { budgeted: 0, actual: 0 }) || { budgeted: 0, actual: 0 };

  return {
    name: projectData?.name || 'Unknown Project',
    status: projectData?.status || 'unknown',
    description: projectData?.description || '',
    tasks: taskStats || [],
    budget_items: budgetStats || [],
    rfis: rfiStats || [],
    taskSummary,
    budgetSummary,
  };
}
