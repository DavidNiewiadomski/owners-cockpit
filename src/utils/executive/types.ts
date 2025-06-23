
export interface ProjectData {
  id: string;
  projectName: string;
  budgetPlanned: number;
  budgetActual: number;
  variancePercent: number;
  varianceAmount: number;
  percentComplete: number;
  scheduleDelayDays: number;
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed';
  startDate: string;
  endDate: string;
  safetyIncidents: number;
  openRFIs: number;
  contractorName: string;
  location: string;
}

export interface PortfolioKPIs {
  totalBudgetPlanned: number;
  totalBudgetActual: number;
  overallVariancePercent: number;
  overallVarianceAmount: number;
  activeProjectsCount: number;
  onTrackProjectsCount: number;
  delayedProjectsCount: number;
  completedProjectsCount: number;
  portfolioROI: number;
  averageDelayDays: number;
  totalSafetyIncidents: number;
  totalOpenRFIs: number;
}

export interface PendingApproval {
  id: string;
  type: 'change_order' | 'contract_amendment' | 'budget_revision' | 'permit_application';
  title: string;
  projectName: string;
  amount?: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  daysWaiting: number;
  description: string;
}

export interface RecentReport {
  id: string;
  title: string;
  type: 'financial' | 'safety' | 'progress' | 'compliance' | 'risk';
  date: string;
  author: string;
  projectName?: string;
  summary: string;
}

export interface RiskMetric {
  category: string;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trend: 'improving' | 'stable' | 'worsening';
  description: string;
}

export interface ExecutiveDashboardData {
  projects: ProjectData[];
  portfolioKPIs: PortfolioKPIs;
  pendingApprovals: PendingApproval[];
  recentReports: RecentReport[];
  riskMetrics: RiskMetric[];
  monthlyTrend: Array<{
    month: string;
    planned: number;
    actual: number;
    variance: number;
  }>;
  insights: {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
    alerts: string[];
  };
}
