
import { ProjectData, PendingApproval, RecentReport, RiskMetric } from './types';

export const generateMockProjects = (): ProjectData[] => [
  {
    id: 'proj-001',
    projectName: 'Metro Office Tower',
    budgetPlanned: 52000000,
    budgetActual: 54600000,
    variancePercent: 5.0,
    varianceAmount: 2600000,
    percentComplete: 85,
    scheduleDelayDays: 0,
    status: 'on_track',
    startDate: '2023-01-15',
    endDate: '2024-12-30',
    safetyIncidents: 1,
    openRFIs: 3,
    contractorName: 'Premier Construction',
    location: 'Downtown District'
  },
  {
    id: 'proj-002',
    projectName: 'Riverside Residential Complex',
    budgetPlanned: 38500000,
    budgetActual: 42100000,
    variancePercent: 9.4,
    varianceAmount: 3600000,
    percentComplete: 72,
    scheduleDelayDays: 18,
    status: 'delayed',
    startDate: '2023-03-01',
    endDate: '2024-11-15',
    safetyIncidents: 0,
    openRFIs: 7,
    contractorName: 'Riverside Builders',
    location: 'Riverside District'
  },
  {
    id: 'proj-003',
    projectName: 'Tech Campus Phase 2',
    budgetPlanned: 67200000,
    budgetActual: 65800000,
    variancePercent: -2.1,
    varianceAmount: -1400000,
    percentComplete: 78,
    scheduleDelayDays: 5,
    status: 'at_risk',
    startDate: '2022-08-01',
    endDate: '2024-09-30',
    safetyIncidents: 2,
    openRFIs: 4,
    contractorName: 'TechBuild Solutions',
    location: 'Innovation Park'
  },
  {
    id: 'proj-004',
    projectName: 'Downtown Retail Center',
    budgetPlanned: 29800000,
    budgetActual: 28900000,
    variancePercent: -3.0,
    varianceAmount: -900000,
    percentComplete: 95,
    scheduleDelayDays: -3,
    status: 'on_track',
    startDate: '2023-05-15',
    endDate: '2024-08-30',
    safetyIncidents: 0,
    openRFIs: 1,
    contractorName: 'Urban Development Co',
    location: 'Central Business District'
  },
  {
    id: 'proj-005',
    projectName: 'Industrial Warehouse Complex',
    budgetPlanned: 18700000,
    budgetActual: 19500000,
    variancePercent: 4.3,
    varianceAmount: 800000,
    percentComplete: 89,
    scheduleDelayDays: 0,
    status: 'on_track',
    startDate: '2023-02-01',
    endDate: '2024-10-15',
    safetyIncidents: 1,
    openRFIs: 2,
    contractorName: 'Industrial Builders Inc',
    location: 'Industrial Zone'
  },
  {
    id: 'proj-006',
    projectName: 'Healthcare Facility Expansion',
    budgetPlanned: 45300000,
    budgetActual: 48200000,
    variancePercent: 6.4,
    varianceAmount: 2900000,
    percentComplete: 68,
    scheduleDelayDays: 12,
    status: 'delayed',
    startDate: '2023-06-01',
    endDate: '2025-01-30',
    safetyIncidents: 0,
    openRFIs: 8,
    contractorName: 'MedBuild Specialists',
    location: 'Medical District'
  },
  {
    id: 'proj-007',
    projectName: 'University Student Housing',
    budgetPlanned: 33600000,
    budgetActual: 33100000,
    variancePercent: -1.5,
    varianceAmount: -500000,
    percentComplete: 100,
    scheduleDelayDays: 0,
    status: 'completed',
    startDate: '2022-01-15',
    endDate: '2023-08-15',
    safetyIncidents: 0,
    openRFIs: 0,
    contractorName: 'Campus Builders',
    location: 'University District'
  },
  {
    id: 'proj-008',
    projectName: 'Mixed-Use Development',
    budgetPlanned: 71500000,
    budgetActual: 76800000,
    variancePercent: 7.4,
    varianceAmount: 5300000,
    percentComplete: 61,
    scheduleDelayDays: 25,
    status: 'delayed',
    startDate: '2023-04-01',
    endDate: '2025-06-30',
    safetyIncidents: 3,
    openRFIs: 12,
    contractorName: 'Metropolitan Developers',
    location: 'Midtown'
  }
];

export const generateMockPendingApprovals = (): PendingApproval[] => [
  {
    id: 'app-001',
    type: 'change_order',
    title: 'Change Order #CO-2024-15',
    projectName: 'Metro Office Tower',
    amount: 1200000,
    urgency: 'high',
    daysWaiting: 8,
    description: 'Elevator system upgrade and additional safety features'
  },
  {
    id: 'app-002',
    type: 'budget_revision',
    title: 'Budget Revision - Material Cost Increase',
    projectName: 'Riverside Residential Complex',
    amount: 2400000,
    urgency: 'critical',
    daysWaiting: 12,
    description: 'Steel and concrete price escalation adjustment'
  },
  {
    id: 'app-003',
    type: 'contract_amendment',
    title: 'Contract Amendment - Scope Extension',
    projectName: 'Tech Campus Phase 2',
    amount: 850000,
    urgency: 'medium',
    daysWaiting: 5,
    description: 'Additional networking infrastructure requirements'
  },
  {
    id: 'app-004',
    type: 'permit_application',
    title: 'Environmental Impact Permit',
    projectName: 'Mixed-Use Development',
    urgency: 'high',
    daysWaiting: 22,
    description: 'Updated environmental assessment for revised design'
  },
  {
    id: 'app-005',
    type: 'change_order',
    title: 'Change Order #CO-2024-18',
    projectName: 'Healthcare Facility Expansion',
    amount: 675000,
    urgency: 'medium',
    daysWaiting: 3,
    description: 'Medical equipment integration and power upgrades'
  }
];

export const generateMockRecentReports = (): RecentReport[] => [
  {
    id: 'rep-001',
    title: 'Q3 2024 Portfolio Financial Summary',
    type: 'financial',
    date: '2024-09-30',
    author: 'Finance Team',
    summary: 'Comprehensive financial analysis showing 3.2% portfolio variance with detailed project breakdowns'
  },
  {
    id: 'rep-002',
    title: 'Safety Compliance Audit Report',
    type: 'safety',
    date: '2024-09-28',
    author: 'Safety Department',
    projectName: 'Mixed-Use Development',
    summary: 'Monthly safety audit revealing 3 minor incidents and recommendations for improved protocols'
  },
  {
    id: 'rep-003',
    title: 'Metro Office Tower Progress Report',
    type: 'progress',
    date: '2024-09-25',
    author: 'Project Management',
    projectName: 'Metro Office Tower',
    summary: '85% completion milestone reached with elevator installation ahead of schedule'
  },
  {
    id: 'rep-004',
    title: 'Environmental Impact Assessment',
    type: 'compliance',
    date: '2024-09-22',
    author: 'Environmental Consultants',
    projectName: 'Riverside Residential Complex',
    summary: 'Updated environmental compliance report addressing water management and green building certifications'
  },
  {
    id: 'rep-005',
    title: 'Risk Assessment - Delayed Projects',
    type: 'risk',
    date: '2024-09-20',
    author: 'Risk Management',
    summary: 'Analysis of schedule delays across 3 projects with mitigation strategies and resource reallocation plans'
  }
];

export const generateMockRiskMetrics = (): RiskMetric[] => [
  {
    category: 'Budget Overruns',
    count: 4,
    severity: 'medium',
    trend: 'stable',
    description: '4 projects showing budget variance above 5% threshold'
  },
  {
    category: 'Schedule Delays',
    count: 3,
    severity: 'high',
    trend: 'worsening',
    description: '3 active projects behind schedule by more than 10 days'
  },
  {
    category: 'Safety Incidents',
    count: 7,
    severity: 'low',
    trend: 'improving',
    description: '7 total safety incidents across portfolio, trending down 15% from last quarter'
  },
  {
    category: 'Regulatory Compliance',
    count: 2,
    severity: 'medium',
    trend: 'stable',
    description: '2 projects pending regulatory approvals with potential schedule impact'
  }
];

export const generateMockMonthlyTrend = () => [
  { month: 'Jan', planned: 12500000, actual: 11800000, variance: -700000 },
  { month: 'Feb', planned: 25800000, actual: 24600000, variance: -1200000 },
  { month: 'Mar', planned: 41200000, actual: 40100000, variance: -1100000 },
  { month: 'Apr', planned: 58600000, actual: 59800000, variance: 1200000 },
  { month: 'May', planned: 78300000, actual: 81200000, variance: 2900000 },
  { month: 'Jun', planned: 98700000, actual: 102400000, variance: 3700000 },
  { month: 'Jul', planned: 122400000, actual: 127100000, variance: 4700000 },
  { month: 'Aug', planned: 148900000, actual: 154200000, variance: 5300000 },
  { month: 'Sep', planned: 176500000, actual: 183600000, variance: 7100000 }
];
