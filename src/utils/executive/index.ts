
import { ExecutiveDashboardData } from './types';
import { 
  generateMockProjects, 
  generateMockPendingApprovals, 
  generateMockRecentReports, 
  generateMockRiskMetrics, 
  generateMockMonthlyTrend 
} from './mockData';
import { calculatePortfolioKPIs, generateInsights } from './calculations';

export function generateExecutiveDemoData(): ExecutiveDashboardData {
  const projects = generateMockProjects();
  const portfolioKPIs = calculatePortfolioKPIs(projects);
  const pendingApprovals = generateMockPendingApprovals();
  const recentReports = generateMockRecentReports();
  const riskMetrics = generateMockRiskMetrics();
  const monthlyTrend = generateMockMonthlyTrend();
  const insights = generateInsights(projects, portfolioKPIs);

  return {
    projects,
    portfolioKPIs,
    pendingApprovals,
    recentReports,
    riskMetrics,
    monthlyTrend,
    insights
  };
}

// Re-export types and utilities
export * from './types';
export * from './formatters';
