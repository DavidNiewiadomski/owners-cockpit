
export async function getPortfolioData(supabase: unknown): Promise<any> {
  console.log('Getting portfolio data...');
  
  try {
    // Get all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, description, status, start_date, end_date')
      .limit(50);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return { projects: [], risks: [], summary: 'No portfolio data available' };
    }

    if (!projects || projects.length === 0) {
      return { 
        projects: [], 
        risks: [],
        summary: 'No projects found in portfolio'
      };
    }

    const projectIds = projects.map(p => p.id);

    // Get aggregated data across all projects
    const [tasksResult, budgetResult, rfiResult, alertsResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('id, name, status, due_date, project_id, projects(name)')
        .in('project_id', projectIds)
        .limit(100),
      
      supabase
        .from('budget_items')
        .select('budgeted_amount, actual_amount, category, project_id, projects(name)')
        .in('project_id', projectIds),
      
      supabase
        .from('rfi')
        .select('id, title, status, due_date, project_id, projects(name)')
        .in('project_id', projectIds)
        .limit(50),
      
      supabase
        .from('alerts')
        .select('id, title, severity, alert_type, project_id, projects(name)')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false })
        .limit(20)
    ]);

    const tasks = tasksResult.data || [];
    const budgetItems = budgetResult.data || [];
    const rfis = rfiResult.data || [];
    const alerts = alertsResult.data || [];

    // Analyze risks across portfolio
    const risks = analyzePortfolioRisks(projects, tasks, budgetItems, rfis, alerts);

    // Generate summary
    const summary = generatePortfolioSummary(projects, tasks, budgetItems, rfis, alerts, risks);

    return {
      projects,
      tasks,
      budgetItems,
      rfis,
      alerts,
      risks,
      summary,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active' || p.status === 'in_progress').length
    };
  } catch (error) {
    console.error('Error getting portfolio data:', error);
    return { 
      projects: [], 
      risks: [],
      summary: 'Error retrieving portfolio data'
    };
  }
}

function analyzePortfolioRisks(projects: any[], tasks: any[], budgetItems: any[], rfis: any[], alerts: any[]) {
  const risks = [];

  // Analyze overdue tasks
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
  );
  
  if (overdueTasks.length > 0) {
    risks.push({
      type: 'Schedule Risk',
      severity: overdueTasks.length > 10 ? 'High' : overdueTasks.length > 5 ? 'Medium' : 'Low',
      description: `${overdueTasks.length} overdue tasks across portfolio`,
      impact: 'Project delays and schedule slippage',
      affectedProjects: [...new Set(overdueTasks.map(t => t.projects?.name).filter(Boolean))]
    });
  }

  // Analyze budget variances
  const projectBudgets = {};
  budgetItems.forEach(item => {
    const projectId = item.project_id;
    if (!projectBudgets[projectId]) {
      projectBudgets[projectId] = { budgeted: 0, actual: 0, name: item.projects?.name };
    }
    projectBudgets[projectId].budgeted += item.budgeted_amount || 0;
    projectBudgets[projectId].actual += item.actual_amount || 0;
  });

  const overBudgetProjects = Object.values(projectBudgets).filter((budget: unknown) => 
    budget.budgeted > 0 && budget.actual > budget.budgeted * 1.1
  );

  if (overBudgetProjects.length > 0) {
    risks.push({
      type: 'Financial Risk',
      severity: 'Medium',
      description: `${overBudgetProjects.length} projects over budget by >10%`,
      impact: 'Cost overruns affecting portfolio profitability',
      affectedProjects: overBudgetProjects.map((p: unknown) => p.name).filter(Boolean)
    });
  }

  // Analyze open RFIs
  const overdueRFIs = rfis.filter(rfi => 
    rfi.due_date && new Date(rfi.due_date) < new Date() && rfi.status === 'open'
  );

  if (overdueRFIs.length > 0) {
    risks.push({
      type: 'Operational Risk',
      severity: 'Medium',
      description: `${overdueRFIs.length} overdue RFIs may block progress`,
      impact: 'Delayed decision-making affecting project execution',
      affectedProjects: [...new Set(overdueRFIs.map(r => r.projects?.name).filter(Boolean))]
    });
  }

  // Analyze critical alerts
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');
  
  if (criticalAlerts.length > 0) {
    risks.push({
      type: 'Operational Risk',
      severity: 'High',
      description: `${criticalAlerts.length} critical/high-severity alerts require attention`,
      impact: 'Immediate operational issues requiring resolution',
      affectedProjects: [...new Set(criticalAlerts.map(a => a.projects?.name).filter(Boolean))]
    });
  }

  return risks;
}

function generatePortfolioSummary(projects: any[], tasks: any[], budgetItems: any[], rfis: any[], alerts: any[], risks: any[]) {
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
  const totalBudget = budgetItems.reduce((sum, item) => sum + (item.budgeted_amount || 0), 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
  const openTasks = tasks.filter(t => t.status !== 'completed').length;
  const openRFIs = rfis.filter(r => r.status === 'open').length;

  return `Portfolio Overview: ${projects.length} total projects (${activeProjects} active), $${(totalBudget/1000000).toFixed(1)}M total budget with $${(totalSpent/1000000).toFixed(1)}M spent. ${openTasks} open tasks, ${openRFIs} open RFIs. ${risks.length} identified risk areas requiring attention.`;
}
