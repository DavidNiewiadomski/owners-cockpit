
export interface PreconstructionProject {
  id: string;
  name: string;
  stage: 'feasibility' | 'design' | 'permitting' | 'bidding' | 'preconstruction';
  initialBudget: number;
  currentEstimate: number;
  budgetVariancePercent: number;
  budgetVarianceAmount: number;
  designCompletion: number;
  permitInfo: {
    status: 'not_started' | 'pending' | 'approved' | 'rejected' | 'expired';
    daysPending?: number;
    approvalDate?: string;
    expiryDate?: string;
    permitType: string;
  };
  bidData?: {
    bidsReceived: number;
    lowestBid?: number;
    highestBid?: number;
    averageBid?: number;
    biddingDeadline?: string;
    biddingStatus: 'open' | 'closed' | 'awarded';
  };
  location: string;
  projectType: string;
  startDate: string;
  estimatedDuration: number; // in months
  riskFlags: string[];
  lastUpdated: string;
}

export interface PreconstructionAlert {
  id: string;
  project: string;
  projectId: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  daysOverdue?: number;
  category: 'budget' | 'schedule' | 'permit' | 'design' | 'bidding';
}

export interface PreconstructionDocument {
  id: string;
  project: string;
  projectId: string;
  documentType: string;
  title: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  author: string;
}

export interface PreconstructionApproval {
  id: string;
  project: string;
  projectId: string;
  approvalType: string;
  description: string;
  status: 'waiting_signature' | 'under_review' | 'approved' | 'rejected';
  daysWaiting: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface PreconstructionKPIs {
  totalProjects: number;
  projectsByStage: {
    feasibility: number;
    design: number;
    permitting: number;
    bidding: number;
    preconstruction: number;
  };
  averageBudgetVariance: number;
  totalBudgetPlanned: number;
  totalCurrentEstimate: number;
  overBudgetProjects: number;
  onScheduleProjects: number;
  delayedPermits: number;
  activeBiddings: number;
  averageBidVariance: number;
  designCompletionAverage: number;
}

export interface PreconstructionInsights {
  summary: string;
  keyMetrics: {
    label: string;
    value: string | number;
    trend: 'up' | 'down' | 'stable';
  }[];
  recommendations: string[];
  urgentItems: string[];
}

export interface PreconstructionDashboardData {
  projects: PreconstructionProject[];
  alerts: PreconstructionAlert[];
  recentDocuments: PreconstructionDocument[];
  pendingApprovals: PreconstructionApproval[];
  kpis: PreconstructionKPIs;
  insights: PreconstructionInsights;
  monthlyProgress: Array<{
    month: string;
    projectsStarted: number;
    permitsApproved: number;
    designsCompleted: number;
    bidsAwarded: number;
  }>;
}

export function generatePreconDemoData(): PreconstructionDashboardData {
  // Generate realistic preconstruction project data
  const projects: PreconstructionProject[] = [
    {
      id: 'pre-001',
      name: 'Central Plaza Mixed-Use',
      stage: 'design',
      initialBudget: 45000000,
      currentEstimate: 47500000,
      budgetVariancePercent: 5.6,
      budgetVarianceAmount: 2500000,
      designCompletion: 75,
      permitInfo: {
        status: 'pending',
        daysPending: 18,
        permitType: 'Building Permit',
      },
      location: 'Downtown District',
      projectType: 'Mixed-Use Development',
      startDate: '2024-03-15',
      estimatedDuration: 24,
      riskFlags: ['Budget variance > 5%', 'Permit delay'],
      lastUpdated: '2024-06-22'
    },
    {
      id: 'pre-002',
      name: 'Greenfield Office Park',
      stage: 'bidding',
      initialBudget: 28000000,
      currentEstimate: 27200000,
      budgetVariancePercent: -2.9,
      budgetVarianceAmount: -800000,
      designCompletion: 95,
      permitInfo: {
        status: 'approved',
        approvalDate: '2024-05-20',
        permitType: 'Environmental Permit',
      },
      bidData: {
        bidsReceived: 4,
        lowestBid: 26800000,
        highestBid: 28500000,
        averageBid: 27600000,
        biddingDeadline: '2024-07-15',
        biddingStatus: 'open'
      },
      location: 'Business Park',
      projectType: 'Office Complex',
      startDate: '2024-02-01',
      estimatedDuration: 18,
      riskFlags: [],
      lastUpdated: '2024-06-22'
    },
    {
      id: 'pre-003',
      name: 'Riverside Residential Tower',
      stage: 'permitting',
      initialBudget: 62000000,
      currentEstimate: 68500000,
      budgetVariancePercent: 10.5,
      budgetVarianceAmount: 6500000,
      designCompletion: 88,
      permitInfo: {
        status: 'pending',
        daysPending: 35,
        permitType: 'Zoning Variance',
      },
      location: 'Riverside District',
      projectType: 'Residential High-Rise',
      startDate: '2024-01-10',
      estimatedDuration: 30,
      riskFlags: ['Budget variance > 10%', 'Permit severely delayed', 'Zoning issues'],
      lastUpdated: '2024-06-21'
    },
    {
      id: 'pre-004',
      name: 'Tech Hub Expansion',
      stage: 'feasibility',
      initialBudget: 35000000,
      currentEstimate: 34200000,
      budgetVariancePercent: -2.3,
      budgetVarianceAmount: -800000,
      designCompletion: 25,
      permitInfo: {
        status: 'not_started',
        permitType: 'Master Use Permit',
      },
      location: 'Innovation District',
      projectType: 'Technology Campus',
      startDate: '2024-05-01',
      estimatedDuration: 22,
      riskFlags: [],
      lastUpdated: '2024-06-23'
    },
    {
      id: 'pre-005',
      name: 'Industrial Logistics Center',
      stage: 'bidding',
      initialBudget: 18500000,
      currentEstimate: 19800000,
      budgetVariancePercent: 7.0,
      budgetVarianceAmount: 1300000,
      designCompletion: 100,
      permitInfo: {
        status: 'approved',
        approvalDate: '2024-04-10',
        permitType: 'Industrial Development Permit',
      },
      bidData: {
        bidsReceived: 2,
        lowestBid: 19200000,
        highestBid: 20400000,
        averageBid: 19800000,
        biddingDeadline: '2024-06-30',
        biddingStatus: 'open'
      },
      location: 'Industrial Zone',
      projectType: 'Warehouse/Distribution',
      startDate: '2024-03-01',
      estimatedDuration: 14,
      riskFlags: ['Limited bidders', 'Budget variance > 5%'],
      lastUpdated: '2024-06-22'
    },
    {
      id: 'pre-006',
      name: 'Community Recreation Center',
      stage: 'preconstruction',
      initialBudget: 12000000,
      currentEstimate: 11800000,
      budgetVariancePercent: -1.7,
      budgetVarianceAmount: -200000,
      designCompletion: 100,
      permitInfo: {
        status: 'approved',
        approvalDate: '2024-06-01',
        permitType: 'Public Works Permit',
      },
      bidData: {
        bidsReceived: 5,
        lowestBid: 11500000,
        highestBid: 12200000,
        averageBid: 11840000,
        biddingDeadline: '2024-06-15',
        biddingStatus: 'awarded'
      },
      location: 'Community District',
      projectType: 'Public Recreation',
      startDate: '2024-04-15',
      estimatedDuration: 16,
      riskFlags: [],
      lastUpdated: '2024-06-23'
    }
  ];

  // Generate alerts based on project data
  const alerts: PreconstructionAlert[] = [
    {
      id: 'alert-001',
      project: 'Riverside Residential Tower',
      projectId: 'pre-003',
      issue: 'Zoning variance permit delayed 35 days',
      severity: 'critical',
      daysOverdue: 15,
      category: 'permit'
    },
    {
      id: 'alert-002',
      project: 'Riverside Residential Tower',
      projectId: 'pre-003',
      issue: 'Budget variance exceeds 10% threshold',
      severity: 'high',
      category: 'budget'
    },
    {
      id: 'alert-003',
      project: 'Central Plaza Mixed-Use',
      projectId: 'pre-001',
      issue: 'Building permit pending 18 days',
      severity: 'medium',
      daysOverdue: 3,
      category: 'permit'
    },
    {
      id: 'alert-004',
      project: 'Industrial Logistics Center',
      projectId: 'pre-005',
      issue: 'Only 2 bids received, below target of 4',
      severity: 'medium',
      category: 'bidding'
    }
  ];

  // Generate recent documents
  const recentDocuments: PreconstructionDocument[] = [
    {
      id: 'doc-001',
      project: 'Central Plaza Mixed-Use',
      projectId: 'pre-001',
      documentType: 'Geotechnical Report',
      title: 'Soil Analysis and Foundation Recommendations',
      date: '2024-06-20',
      status: 'approved',
      author: 'GeoConsult Engineering'
    },
    {
      id: 'doc-002',
      project: 'Greenfield Office Park',
      projectId: 'pre-002',
      documentType: 'Environmental Impact Study',
      title: 'Phase I Environmental Site Assessment',
      date: '2024-06-18',
      status: 'under_review',
      author: 'EnviroTech Solutions'
    },
    {
      id: 'doc-003',
      project: 'Tech Hub Expansion',
      projectId: 'pre-004',
      documentType: 'Feasibility Study',
      title: 'Market Analysis and Financial Projections',
      date: '2024-06-15',
      status: 'pending',
      author: 'Development Analytics'
    },
    {
      id: 'doc-004',
      project: 'Riverside Residential Tower',
      projectId: 'pre-003',
      documentType: 'Traffic Impact Study',
      title: 'Transportation and Parking Analysis',
      date: '2024-06-12',
      status: 'approved',
      author: 'Urban Planning Associates'
    },
    {
      id: 'doc-005',
      project: 'Community Recreation Center',
      projectId: 'pre-006',
      documentType: 'Construction Documents',
      title: 'Final Plans and Specifications',
      date: '2024-06-10',
      status: 'approved',
      author: 'Design Architecture Group'
    }
  ];

  // Generate pending approvals
  const pendingApprovals: PreconstructionApproval[] = [
    {
      id: 'appr-001',
      project: 'Riverside Residential Tower',
      projectId: 'pre-003',
      approvalType: 'Zoning Variance',
      description: 'Height variance for 45-story residential tower',
      status: 'under_review',
      daysWaiting: 35,
      urgency: 'critical'
    },
    {
      id: 'appr-002',
      project: 'Central Plaza Mixed-Use',
      projectId: 'pre-001',
      approvalType: 'Building Permit',
      description: 'Mixed-use development building permit application',
      status: 'waiting_signature',
      daysWaiting: 18,
      urgency: 'high'
    },
    {
      id: 'appr-003',
      project: 'Tech Hub Expansion',
      projectId: 'pre-004',
      approvalType: 'Design Review',
      description: 'Architectural design committee review',
      status: 'under_review',
      daysWaiting: 8,
      urgency: 'medium'
    },
    {
      id: 'appr-004',
      project: 'Greenfield Office Park',
      projectId: 'pre-002',
      approvalType: 'Contractor Selection',
      description: 'Board approval for selected general contractor',
      status: 'waiting_signature',
      daysWaiting: 5,
      urgency: 'high'
    }
  ];

  // Calculate KPIs
  const totalBudgetPlanned = projects.reduce((sum, p) => sum + p.initialBudget, 0);
  const totalCurrentEstimate = projects.reduce((sum, p) => sum + p.currentEstimate, 0);
  const overBudgetProjects = projects.filter(p => p.budgetVariancePercent > 0).length;
  const delayedPermits = projects.filter(p => 
    p.permitInfo.status === 'pending' && p.permitInfo.daysPending && p.permitInfo.daysPending > 14
  ).length;
  const activeBiddings = projects.filter(p => p.stage === 'bidding').length;
  
  const averageBudgetVariance = projects.reduce((sum, p) => sum + p.budgetVariancePercent, 0) / projects.length;
  const designCompletionAverage = projects.reduce((sum, p) => sum + p.designCompletion, 0) / projects.length;
  
  const biddingProjects = projects.filter(p => p.bidData);
  const averageBidVariance = biddingProjects.length > 0 
    ? biddingProjects.reduce((sum, p) => {
        if (p.bidData && p.bidData.lowestBid) {
          return sum + ((p.bidData.lowestBid - p.currentEstimate) / p.currentEstimate) * 100;
        }
        return sum;
      }, 0) / biddingProjects.length
    : 0;

  const kpis: PreconstructionKPIs = {
    totalProjects: projects.length,
    projectsByStage: {
      feasibility: projects.filter(p => p.stage === 'feasibility').length,
      design: projects.filter(p => p.stage === 'design').length,
      permitting: projects.filter(p => p.stage === 'permitting').length,
      bidding: projects.filter(p => p.stage === 'bidding').length,
      preconstruction: projects.filter(p => p.stage === 'preconstruction').length,
    },
    averageBudgetVariance: Number(averageBudgetVariance.toFixed(1)),
    totalBudgetPlanned,
    totalCurrentEstimate,
    overBudgetProjects,
    onScheduleProjects: projects.length - overBudgetProjects,
    delayedPermits,
    activeBiddings,
    averageBidVariance: Number(averageBidVariance.toFixed(1)),
    designCompletionAverage: Number(designCompletionAverage.toFixed(1))
  };

  // Generate insights
  const highestVarianceProject = projects.reduce((max, project) => 
    Math.abs(project.budgetVariancePercent) > Math.abs(max.budgetVariancePercent) ? project : max
  );

  const mostDelayedPermit = projects
    .filter(p => p.permitInfo.status === 'pending' && p.permitInfo.daysPending)
    .reduce((max, project) => 
      (project.permitInfo.daysPending || 0) > (max.permitInfo.daysPending || 0) ? project : max
    , { permitInfo: { daysPending: 0 } } as PreconstructionProject);

  const insights: PreconstructionInsights = {
    summary: `Portfolio includes ${projects.length} preconstruction projects with total planned budget of $${(totalBudgetPlanned / 1000000).toFixed(1)}M. Average budget variance is ${averageBudgetVariance > 0 ? '+' : ''}${averageBudgetVariance.toFixed(1)}%. ${delayedPermits} projects have permit delays exceeding 14 days.`,
    keyMetrics: [
      {
        label: 'Avg Design Completion',
        value: `${designCompletionAverage.toFixed(1)}%`,
        trend: 'up'
      },
      {
        label: 'Budget Variance',
        value: `${averageBudgetVariance > 0 ? '+' : ''}${averageBudgetVariance.toFixed(1)}%`,
        trend: averageBudgetVariance > 2 ? 'down' : 'stable'
      },
      {
        label: 'Permit Delays',
        value: delayedPermits,
        trend: delayedPermits > 1 ? 'down' : 'stable'
      },
      {
        label: 'Active Biddings',
        value: activeBiddings,
        trend: 'stable'
      }
    ],
    recommendations: [
      mostDelayedPermit.permitInfo.daysPending > 0 ? `Expedite ${mostDelayedPermit.name} permit approval (${mostDelayedPermit.permitInfo.daysPending} days pending)` : '',
      Math.abs(highestVarianceProject.budgetVariancePercent) > 5 ? `Review budget controls for ${highestVarianceProject.name} (${highestVarianceProject.budgetVariancePercent > 0 ? '+' : ''}${highestVarianceProject.budgetVariancePercent.toFixed(1)}% variance)` : '',
      activeBiddings > 0 ? 'Monitor ongoing bid processes to ensure competitive pricing' : '',
      'Implement early contractor involvement to improve cost certainty'
    ].filter(rec => rec !== ''),
    urgentItems: [
      alerts.filter(a => a.severity === 'critical').length > 0 ? `${alerts.filter(a => a.severity === 'critical').length} critical alerts require immediate attention` : '',
      pendingApprovals.filter(a => a.urgency === 'critical').length > 0 ? `${pendingApprovals.filter(a => a.urgency === 'critical').length} critical approvals pending` : '',
      delayedPermits > 2 ? 'Multiple permit delays impacting project schedules' : ''
    ].filter(item => item !== '')
  };

  // Generate monthly progress data
  const monthlyProgress = [
    { month: 'Jan', projectsStarted: 1, permitsApproved: 0, designsCompleted: 1, bidsAwarded: 0 },
    { month: 'Feb', projectsStarted: 1, permitsApproved: 1, designsCompleted: 0, bidsAwarded: 1 },
    { month: 'Mar', projectsStarted: 2, permitsApproved: 0, designsCompleted: 1, bidsAwarded: 0 },
    { month: 'Apr', projectsStarted: 1, permitsApproved: 2, designsCompleted: 1, bidsAwarded: 0 },
    { month: 'May', projectsStarted: 1, permitsApproved: 1, designsCompleted: 0, bidsAwarded: 1 },
    { month: 'Jun', projectsStarted: 0, permitsApproved: 1, designsCompleted: 2, bidsAwarded: 1 }
  ];

  return {
    projects,
    alerts,
    recentDocuments,
    pendingApprovals,
    kpis,
    insights,
    monthlyProgress
  };
}

// Helper function to format currency
export function formatPreconCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
}

// Helper function to get stage color
export function getStageColor(stage: string): string {
  switch (stage) {
    case 'feasibility': return 'text-blue-600 bg-blue-100';
    case 'design': return 'text-purple-600 bg-purple-100';
    case 'permitting': return 'text-orange-600 bg-orange-100';
    case 'bidding': return 'text-green-600 bg-green-100';
    case 'preconstruction': return 'text-indigo-600 bg-indigo-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

// Helper function to get permit status color
export function getPermitStatusColor(status: string): string {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'expired': return 'text-red-600 bg-red-100';
    case 'not_started': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

// Helper function to get alert severity color
export function getAlertSeverityColor(severity: string): string {
  switch (severity) {
    case 'low': return 'text-gray-600 bg-gray-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'critical': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}
