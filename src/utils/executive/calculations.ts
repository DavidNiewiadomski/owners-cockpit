
import { ProjectData, PortfolioKPIs } from './types';

export const calculatePortfolioKPIs = (projects: ProjectData[]): PortfolioKPIs => {
  const activeProjects = projects.filter(p => p.status !== 'completed');
  const onTrackProjects = activeProjects.filter(p => p.status === 'on_track');
  const delayedProjects = activeProjects.filter(p => p.status === 'delayed');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const totalBudgetPlanned = projects.reduce((sum, p) => sum + p.budgetPlanned, 0);
  const totalBudgetActual = projects.reduce((sum, p) => sum + p.budgetActual, 0);
  const overallVarianceAmount = totalBudgetActual - totalBudgetPlanned;
  const overallVariancePercent = (overallVarianceAmount / totalBudgetPlanned) * 100;

  return {
    totalBudgetPlanned,
    totalBudgetActual,
    overallVariancePercent: Number(overallVariancePercent.toFixed(1)),
    overallVarianceAmount,
    activeProjectsCount: activeProjects.length,
    onTrackProjectsCount: onTrackProjects.length,
    delayedProjectsCount: delayedProjects.length,
    completedProjectsCount: completedProjects.length,
    portfolioROI: 14.2,
    averageDelayDays: Math.round(activeProjects.reduce((sum, p) => sum + Math.max(0, p.scheduleDelayDays), 0) / activeProjects.length),
    totalSafetyIncidents: projects.reduce((sum, p) => sum + p.safetyIncidents, 0),
    totalOpenRFIs: projects.reduce((sum, p) => sum + p.openRFIs, 0)
  };
};

export const generateInsights = (projects: ProjectData[], portfolioKPIs: PortfolioKPIs) => {
  const highestVarianceProject = projects.reduce((max, project) => 
    Math.abs(project.variancePercent) > Math.abs(max.variancePercent) ? project : max
  );

  const mostDelayedProject = projects.reduce((max, project) => 
    project.scheduleDelayDays > max.scheduleDelayDays ? project : max
  );

  const delayedProjects = projects.filter(p => p.status === 'delayed');
  const pendingApprovalsCount = 5; // This would come from the pendingApprovals array

  return {
    summary: `Portfolio performance shows ${portfolioKPIs.overallVariancePercent > 0 ? 'budget overruns' : 'savings'} of ${Math.abs(portfolioKPIs.overallVariancePercent).toFixed(1)}% (${Math.abs(portfolioKPIs.overallVarianceAmount / 1000000).toFixed(1)}M). ${portfolioKPIs.onTrackProjectsCount} of ${portfolioKPIs.activeProjectsCount} active projects are on schedule. Key concern: ${mostDelayedProject.projectName} is ${mostDelayedProject.scheduleDelayDays} days behind schedule.`,
    keyPoints: [
      `${highestVarianceProject.projectName} has highest budget variance at ${highestVarianceProject.variancePercent > 0 ? '+' : ''}${highestVarianceProject.variancePercent.toFixed(1)}%`,
      `${portfolioKPIs.totalOpenRFIs} open RFIs across portfolio requiring attention`,
      `${portfolioKPIs.totalSafetyIncidents} safety incidents reported this quarter`,
      `${pendingApprovalsCount} high-priority approvals pending`
    ],
    recommendations: [
      'Expedite permit approvals for Mixed-Use Development to prevent further delays',
      'Review material procurement strategy to mitigate cost escalations',
      'Implement enhanced safety protocols on projects with recent incidents',
      'Consider resource reallocation to support delayed projects'
    ],
    alerts: [
      delayedProjects.length > 2 ? `${delayedProjects.length} projects significantly behind schedule` : '',
      pendingApprovalsCount > 3 ? `${pendingApprovalsCount} approvals pending over 10 days` : '',
      portfolioKPIs.overallVariancePercent > 5 ? 'Portfolio budget variance exceeds 5% threshold' : ''
    ].filter(alert => alert !== '')
  };
};
