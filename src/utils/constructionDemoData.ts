
export interface ConstructionProject {
  id: string;
  name: string;
  percentComplete: number;
  plannedCompletionDate: string;
  daysDelayed: number;
  budgetTotal: number;
  costToDate: number;
  changeOrdersCount: number;
  changeOrderValue: number;
  costVariancePercent: number;
  incidentsMajor: number;
  incidentsMinor: number;
  openQAIssues: number;
  openRFIs: number;
  overdueRFIs: number;
  openSubmittals: number;
  status: 'on_track' | 'at_risk' | 'delayed';
  workforce: number;
  productivity: number;
  weatherDelays: number;
  qualityMetrics: {
    defectRate: number;
    reworkHours: number;
    inspectionPass: number;
    punchListItems: number;
  };
}

export interface CriticalDocument {
  id: string;
  type: 'rfi' | 'change_order' | 'submittal';
  projectName: string;
  title: string;
  status: string;
  daysOpen: number;
  value?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ConstructionDashboardData {
  projects: ConstructionProject[];
  portfolioSummary: {
    totalBudget: number;
    totalSpent: number;
    totalChangeOrders: number;
    totalChangeOrderValue: number;
    portfolioCostVariance: number;
    totalIncidentsMajor: number;
    totalIncidentsMinor: number;
    totalOpenQAIssues: number;
    totalOpenRFIs: number;
    totalOverdueRFIs: number;
    totalOpenSubmittals: number;
    averageProgress: number;
    projectsOnTrack: number;
    projectsAtRisk: number;
    projectsDelayed: number;
  };
  criticalDocuments: CriticalDocument[];
  insightFactors: {
    mostDelayedProject: string;
    largestCostOverrun: string;
    highestRiskProject: string;
    safetyLeader: string;
    qualityLeader: string;
  };
  materialDeliveries: Array<{
    week: string;
    planned: number;
    actual: number;
    delayed: number;
  }>;
  constructionProgress: Array<{
    phase: string;
    planned: number;
    actual: number;
    variance: number;
  }>;
  safetyTrends: Array<{
    month: string;
    incidents: number;
    nearMiss: number;
    training: number;
  }>;
}

export const generateConstructionDemoData = (): ConstructionDashboardData => {
  // Generate 5 construction projects with varying statuses
  const projects: ConstructionProject[] = [
    {
      id: 'lotus',
      name: 'Project Lotus',
      percentComplete: 68,
      plannedCompletionDate: '2025-12-01',
      daysDelayed: 0,
      budgetTotal: 25000000,
      costToDate: 20000000,
      changeOrdersCount: 3,
      changeOrderValue: 800000,
      costVariancePercent: 3.2,
      incidentsMajor: 0,
      incidentsMinor: 1,
      openQAIssues: 2,
      openRFIs: 8,
      overdueRFIs: 1,
      openSubmittals: 4,
      status: 'on_track',
      workforce: 45,
      productivity: 94,
      weatherDelays: 2,
      qualityMetrics: {
        defectRate: 2.1,
        reworkHours: 45,
        inspectionPass: 94,
        punchListItems: 23
      }
    },
    {
      id: 'zeta',
      name: 'Project Zeta',
      percentComplete: 45,
      plannedCompletionDate: '2025-11-15',
      daysDelayed: 10,
      budgetTotal: 30000000,
      costToDate: 28000000,
      changeOrdersCount: 5,
      changeOrderValue: 1200000,
      costVariancePercent: 9.3,
      incidentsMajor: 0,
      incidentsMinor: 1,
      openQAIssues: 5,
      openRFIs: 9,
      overdueRFIs: 3,
      openSubmittals: 3,
      status: 'at_risk',
      workforce: 62,
      productivity: 87,
      weatherDelays: 5,
      qualityMetrics: {
        defectRate: 3.2,
        reworkHours: 128,
        inspectionPass: 89,
        punchListItems: 67
      }
    },
    {
      id: 'alpha',
      name: 'Project Alpha',
      percentComplete: 82,
      plannedCompletionDate: '2025-10-30',
      daysDelayed: -3,
      budgetTotal: 18000000,
      costToDate: 16500000,
      changeOrdersCount: 2,
      changeOrderValue: 400000,
      costVariancePercent: -2.8,
      incidentsMajor: 0,
      incidentsMinor: 0,
      openQAIssues: 1,
      openRFIs: 3,
      overdueRFIs: 0,
      openSubmittals: 1,
      status: 'on_track',
      workforce: 38,
      productivity: 96,
      weatherDelays: 1,
      qualityMetrics: {
        defectRate: 1.8,
        reworkHours: 22,
        inspectionPass: 96,
        punchListItems: 12
      }
    },
    {
      id: 'beta',
      name: 'Project Beta',
      percentComplete: 34,
      plannedCompletionDate: '2026-01-15',
      daysDelayed: 15,
      budgetTotal: 42000000,
      costToDate: 38000000,
      changeOrdersCount: 8,
      changeOrderValue: 2100000,
      costVariancePercent: 12.5,
      incidentsMajor: 1,
      incidentsMinor: 2,
      openQAIssues: 8,
      openRFIs: 12,
      overdueRFIs: 5,
      openSubmittals: 6,
      status: 'delayed',
      workforce: 74,
      productivity: 81,
      weatherDelays: 8,
      qualityMetrics: {
        defectRate: 4.1,
        reworkHours: 185,
        inspectionPass: 84,
        punchListItems: 89
      }
    },
    {
      id: 'gamma',
      name: 'Project Gamma',
      percentComplete: 91,
      plannedCompletionDate: '2025-09-30',
      daysDelayed: -7,
      budgetTotal: 22000000,
      costToDate: 21200000,
      changeOrdersCount: 4,
      changeOrderValue: 650000,
      costVariancePercent: -1.4,
      incidentsMajor: 0,
      incidentsMinor: 0,
      openQAIssues: 0,
      openRFIs: 2,
      overdueRFIs: 0,
      openSubmittals: 1,
      status: 'on_track',
      workforce: 28,
      productivity: 98,
      weatherDelays: 0,
      qualityMetrics: {
        defectRate: 1.2,
        reworkHours: 18,
        inspectionPass: 98,
        punchListItems: 8
      }
    }
  ];

  // Calculate portfolio summary
  const portfolioSummary = {
    totalBudget: projects.reduce((sum, p) => sum + p.budgetTotal, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.costToDate, 0),
    totalChangeOrders: projects.reduce((sum, p) => sum + p.changeOrdersCount, 0),
    totalChangeOrderValue: projects.reduce((sum, p) => sum + p.changeOrderValue, 0),
    portfolioCostVariance: 0, // Will calculate below
    totalIncidentsMajor: projects.reduce((sum, p) => sum + p.incidentsMajor, 0),
    totalIncidentsMinor: projects.reduce((sum, p) => sum + p.incidentsMinor, 0),
    totalOpenQAIssues: projects.reduce((sum, p) => sum + p.openQAIssues, 0),
    totalOpenRFIs: projects.reduce((sum, p) => sum + p.openRFIs, 0),
    totalOverdueRFIs: projects.reduce((sum, p) => sum + p.overdueRFIs, 0),
    totalOpenSubmittals: projects.reduce((sum, p) => sum + p.openSubmittals, 0),
    averageProgress: Math.round(projects.reduce((sum, p) => sum + p.percentComplete, 0) / projects.length),
    projectsOnTrack: projects.filter(p => p.status === 'on_track').length,
    projectsAtRisk: projects.filter(p => p.status === 'at_risk').length,
    projectsDelayed: projects.filter(p => p.status === 'delayed').length,
  };

  // Calculate portfolio cost variance
  portfolioSummary.portfolioCostVariance = Number(
    (((portfolioSummary.totalSpent / portfolioSummary.totalBudget) - 1) * 100).toFixed(1)
  );

  // Generate critical documents
  const criticalDocuments: CriticalDocument[] = [
    {
      id: 'rfi-456',
      type: 'rfi',
      projectName: 'Project Lotus',
      title: 'RFI #456 - MEP Coordination',
      status: 'Open',
      daysOpen: 3,
      priority: 'high'
    },
    {
      id: 'co-789',
      type: 'change_order',
      projectName: 'Project Zeta',
      title: 'CO #789 - Structural Modifications',
      status: 'Under Review',
      daysOpen: 7,
      value: 450000,
      priority: 'high'
    },
    {
      id: 'rfi-123',
      type: 'rfi',
      projectName: 'Project Zeta',
      title: 'RFI #123 - Structural Beam Clarification',
      status: 'Open',
      daysOpen: 5,
      priority: 'medium'
    },
    {
      id: 'sub-567',
      type: 'submittal',
      projectName: 'Project Beta',
      title: 'Submittal #567 - Elevator Specifications',
      status: 'Pending Approval',
      daysOpen: 12,
      priority: 'high'
    },
    {
      id: 'co-234',
      type: 'change_order',
      projectName: 'Project Beta',
      title: 'CO #234 - HVAC System Upgrade',
      status: 'Submitted',
      daysOpen: 4,
      value: 320000,
      priority: 'medium'
    }
  ];

  // Generate insight factors
  const insightFactors = {
    mostDelayedProject: projects.reduce((max, p) => p.daysDelayed > max.daysDelayed ? p : max).name,
    largestCostOverrun: projects.reduce((max, p) => p.costVariancePercent > max.costVariancePercent ? p : max).name,
    highestRiskProject: projects.filter(p => p.status === 'delayed')[0]?.name || projects.filter(p => p.status === 'at_risk')[0]?.name,
    safetyLeader: projects.reduce((best, p) => (p.incidentsMajor + p.incidentsMinor) < (best.incidentsMajor + best.incidentsMinor) ? p : best).name,
    qualityLeader: projects.reduce((best, p) => p.qualityMetrics.defectRate < best.qualityMetrics.defectRate ? p : best).name,
  };

  // Generate sample chart data
  const materialDeliveries = [
    { week: 'W1', planned: 85, actual: 88, delayed: 3 },
    { week: 'W2', planned: 92, actual: 90, delayed: 2 },
    { week: 'W3', planned: 78, actual: 82, delayed: 1 },
    { week: 'W4', planned: 95, actual: 91, delayed: 4 }
  ];

  const constructionProgress = [
    { phase: 'Foundation', planned: 100, actual: 100, variance: 0 },
    { phase: 'Structure', planned: 85, actual: 88, variance: 3 },
    { phase: 'MEP Rough', planned: 60, actual: 55, variance: -5 },
    { phase: 'Exterior', planned: 40, actual: 45, variance: 5 },
    { phase: 'Interior', planned: 20, actual: 18, variance: -2 },
    { phase: 'Finishes', planned: 5, actual: 3, variance: -2 }
  ];

  const safetyTrends = [
    { month: 'Jan', incidents: 0, nearMiss: 2, training: 12 },
    { month: 'Feb', incidents: 1, nearMiss: 1, training: 8 },
    { month: 'Mar', incidents: 0, nearMiss: 3, training: 15 },
    { month: 'Apr', incidents: 0, nearMiss: 1, training: 10 },
    { month: 'May', incidents: 0, nearMiss: 2, training: 14 },
    { month: 'Jun', incidents: 1, nearMiss: 1, training: 9 }
  ];

  return {
    projects,
    portfolioSummary,
    criticalDocuments,
    insightFactors,
    materialDeliveries,
    constructionProgress,
    safetyTrends
  };
};

// Helper function to get project data by ID
export const getConstructionProjectData = (projectId: string): ConstructionProject => {
  const data = generateConstructionDemoData();
  return data.projects.find(p => p.id === projectId) || data.projects[0];
};

// Helper function to get portfolio-level data
export const getConstructionPortfolioData = () => {
  const data = generateConstructionDemoData();
  return {
    ...data.portfolioSummary,
    criticalDocuments: data.criticalDocuments,
    insightFactors: data.insightFactors
  };
};
