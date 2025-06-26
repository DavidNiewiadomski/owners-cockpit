// Comprehensive project sample data for all dashboards
// This creates realistic, detailed project data that changes when projects are switched

import { Project } from '@/hooks/useProjects';

export interface ProjectMetrics {
  financial: {
    totalBudget: number;
    spentToDate: number;
    forecastedCost: number;
    contingencyUsed: number;
    contingencyRemaining: number;
    roi: number;
    npv: number;
    costPerSqft: number;
    marketValue: number;
    monthlySpend: Array<{
      month: string;
      budget: number;
      actual: number;
      forecast: number;
    }>;
  };
  construction: {
    overallProgress: number;
    daysAheadBehind: number;
    totalWorkforce: number;
    activeSubcontractors: number;
    completedMilestones: number;
    totalMilestones: number;
    qualityScore: number;
    safetyScore: number;
    openRFIs: number;
    pendingSubmittals: number;
    dailyProgress: Array<{
      date: string;
      planned: number;
      actual: number;
      workforce: number;
    }>;
  };
  executive: {
    portfolioValue: number;
    stakeholders: number;
    riskScore: number;
    strategicAlignment: number;
    marketPosition: number;
    kpiTrends: Array<{
      week: string;
      efficiency: number;
      quality: number;
      safety: number;
    }>;
  };
  design: {
    designProgress: number;
    approvedDrawings: number;
    totalDrawings: number;
    revisionCycles: number;
    stakeholderApprovals: number;
    designChanges: number;
  };
  legal: {
    contractsActive: number;
    contractsPending: number;
    complianceScore: number;
    permitStatus: string;
    legalRisks: number;
    documentationComplete: number;
  };
  sustainability: {
    leedTarget: string;
    currentScore: number;
    energyEfficiency: number;
    carbonReduction: number;
    sustainableMaterials: number;
    certifications: string[];
  };
  facilities: {
    operationalReadiness: number;
    systemsCommissioned: number;
    maintenancePlanned: number;
    energyPerformance: number;
    occupancyReadiness: number;
  };
  planning: {
    masterPlanApproval: number;
    zoningCompliance: number;
    communityEngagement: number;
    regulatoryApprovals: number;
    feasibilityComplete: number;
  };
  preconstruction: {
    designDevelopment: number;
    biddingProgress: number;
    contractorSelection: number;
    permitSubmissions: number;
    valueEngineering: number;
  };
}

export interface DetailedProject extends Project {
  metrics: ProjectMetrics;
  insights: {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
    alerts: string[];
  };
  timeline: Array<{
    phase: string;
    startDate: string;
    endDate: string;
    status: 'completed' | 'active' | 'upcoming';
    progress: number;
  }>;
  team: {
    projectManager: string;
    architect: string;
    contractor: string;
    owner: string;
  };
}

// Sample projects with detailed data for each dashboard type
export const sampleProjects: DetailedProject[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Downtown Office Building',
    description: 'A 12-story modern office building project in downtown area with sustainable design features.',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-12-31',
    org_id: '00000000-0000-0000-0000-000000000000',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z',
    team: {
      projectManager: 'Sarah Johnson',
      architect: 'Michael Chen',
      contractor: 'BuildTech Solutions',
      owner: 'Metro Development Corp'
    },
    timeline: [
      { phase: 'Pre-Construction', startDate: '2024-01-15', endDate: '2024-03-30', status: 'completed', progress: 100 },
      { phase: 'Foundation', startDate: '2024-04-01', endDate: '2024-06-15', status: 'completed', progress: 100 },
      { phase: 'Structure', startDate: '2024-06-16', endDate: '2024-09-30', status: 'active', progress: 68 },
      { phase: 'MEP & Interiors', startDate: '2024-10-01', endDate: '2024-12-15', status: 'upcoming', progress: 0 },
      { phase: 'Final Commissioning', startDate: '2024-12-16', endDate: '2024-12-31', status: 'upcoming', progress: 0 }
    ],
    insights: {
      summary: 'Project is progressing well with structural work 68% complete. On track for year-end completion.',
      keyPoints: [
        'Structural steel installation ahead of schedule',
        'Weather delays minimal this quarter',
        'Subcontractor performance exceeding expectations',
        'Budget variance within acceptable range'
      ],
      recommendations: [
        'Accelerate MEP coordination meetings',
        'Finalize interior tenant requirements',
        'Review winter weather contingencies',
        'Update stakeholder communications'
      ],
      alerts: [
        'Material delivery scheduled for next week',
        'City inspection required for structural completion'
      ]
    },
    metrics: {
      financial: {
        totalBudget: 52000000,
        spentToDate: 35400000,
        forecastedCost: 51200000,
        contingencyUsed: 1200000,
        contingencyRemaining: 1400000,
        roi: 16.8,
        npv: 8500000,
        costPerSqft: 347,
        marketValue: 68000000,
        monthlySpend: [
          { month: 'Jan', budget: 2100000, actual: 1950000, forecast: 2000000 },
          { month: 'Feb', budget: 2100000, actual: 2250000, forecast: 2200000 },
          { month: 'Mar', budget: 2100000, actual: 2050000, forecast: 2100000 },
          { month: 'Apr', budget: 2100000, actual: 2180000, forecast: 2150000 },
          { month: 'May', budget: 2100000, actual: 2020000, forecast: 2080000 },
          { month: 'Jun', budget: 2100000, actual: 2200000, forecast: 2180000 }
        ]
      },
      construction: {
        overallProgress: 68,
        daysAheadBehind: 3,
        totalWorkforce: 145,
        activeSubcontractors: 12,
        completedMilestones: 8,
        totalMilestones: 12,
        qualityScore: 94,
        safetyScore: 97,
        openRFIs: 23,
        pendingSubmittals: 8,
        dailyProgress: [
          { date: 'Jun 15', planned: 65, actual: 67, workforce: 142 },
          { date: 'Jun 16', planned: 65.5, actual: 67.2, workforce: 145 },
          { date: 'Jun 17', planned: 66, actual: 67.8, workforce: 148 },
          { date: 'Jun 18', planned: 66.5, actual: 68.1, workforce: 144 },
          { date: 'Jun 19', planned: 67, actual: 68.5, workforce: 149 },
          { date: 'Jun 20', planned: 67.5, actual: 68.8, workforce: 145 },
          { date: 'Jun 21', planned: 68, actual: 69.2, workforce: 152 }
        ]
      },
      executive: {
        portfolioValue: 68000000,
        stakeholders: 24,
        riskScore: 25,
        strategicAlignment: 88,
        marketPosition: 92,
        kpiTrends: [
          { week: 'W1', efficiency: 78, quality: 92, safety: 98 },
          { week: 'W2', efficiency: 82, quality: 89, safety: 97 },
          { week: 'W3', efficiency: 85, quality: 94, safety: 99 },
          { week: 'W4', efficiency: 88, quality: 96, safety: 98 }
        ]
      },
      design: {
        designProgress: 95,
        approvedDrawings: 127,
        totalDrawings: 134,
        revisionCycles: 3,
        stakeholderApprovals: 18,
        designChanges: 12
      },
      legal: {
        contractsActive: 15,
        contractsPending: 2,
        complianceScore: 96,
        permitStatus: 'All Approved',
        legalRisks: 2,
        documentationComplete: 94
      },
      sustainability: {
        leedTarget: 'Gold',
        currentScore: 68,
        energyEfficiency: 35,
        carbonReduction: 28,
        sustainableMaterials: 60,
        certifications: ['LEED Gold Target', 'ENERGY STAR Design', 'Green Building Certification']
      },
      facilities: {
        operationalReadiness: 35,
        systemsCommissioned: 12,
        maintenancePlanned: 85,
        energyPerformance: 88,
        occupancyReadiness: 40
      },
      planning: {
        masterPlanApproval: 100,
        zoningCompliance: 100,
        communityEngagement: 92,
        regulatoryApprovals: 98,
        feasibilityComplete: 100
      },
      preconstruction: {
        designDevelopment: 100,
        biddingProgress: 100,
        contractorSelection: 100,
        permitSubmissions: 100,
        valueEngineering: 95
      }
    }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Residential Complex Phase 1',
    description: 'Construction of 50-unit residential complex with modern amenities and green spaces.',
    status: 'planning',
    start_date: '2024-03-01',
    end_date: '2025-02-28',
    org_id: '00000000-0000-0000-0000-000000000000',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z',
    team: {
      projectManager: 'David Kim',
      architect: 'Elena Rodriguez',
      contractor: 'Residential Builders Inc',
      owner: 'Urban Living Development'
    },
    timeline: [
      { phase: 'Planning & Design', startDate: '2024-03-01', endDate: '2024-06-30', status: 'active', progress: 75 },
      { phase: 'Permit & Approvals', startDate: '2024-07-01', endDate: '2024-09-15', status: 'upcoming', progress: 0 },
      { phase: 'Site Preparation', startDate: '2024-09-16', endDate: '2024-11-30', status: 'upcoming', progress: 0 },
      { phase: 'Construction', startDate: '2024-12-01', endDate: '2025-01-31', status: 'upcoming', progress: 0 },
      { phase: 'Final Inspections', startDate: '2025-02-01', endDate: '2025-02-28', status: 'upcoming', progress: 0 }
    ],
    insights: {
      summary: 'Design phase progressing well with 75% completion. Preparing for permit submissions next quarter.',
      keyPoints: [
        'Architectural drawings 80% complete',
        'Community engagement sessions completed',
        'Environmental impact assessment approved',
        'Pre-leasing interest exceeding projections'
      ],
      recommendations: [
        'Expedite final design reviews',
        'Prepare permit submission packages',
        'Finalize contractor pre-qualification',
        'Update construction phasing plan'
      ],
      alerts: [
        'Design review meeting scheduled for next week',
        'Permit application deadline approaching'
      ]
    },
    metrics: {
      financial: {
        totalBudget: 28500000,
        spentToDate: 2850000,
        forecastedCost: 28200000,
        contingencyUsed: 150000,
        contingencyRemaining: 1275000,
        roi: 14.2,
        npv: 5200000,
        costPerSqft: 285,
        marketValue: 35000000,
        monthlySpend: [
          { month: 'Mar', budget: 500000, actual: 475000, forecast: 480000 },
          { month: 'Apr', budget: 600000, actual: 625000, forecast: 610000 },
          { month: 'May', budget: 550000, actual: 540000, forecast: 545000 },
          { month: 'Jun', budget: 750000, actual: 780000, forecast: 765000 },
          { month: 'Jul', budget: 850000, actual: 0, forecast: 850000 },
          { month: 'Aug', budget: 900000, actual: 0, forecast: 900000 }
        ]
      },
      construction: {
        overallProgress: 15,
        daysAheadBehind: 2,
        totalWorkforce: 25,
        activeSubcontractors: 4,
        completedMilestones: 2,
        totalMilestones: 18,
        qualityScore: 0,
        safetyScore: 95,
        openRFIs: 8,
        pendingSubmittals: 15,
        dailyProgress: [
          { date: 'Jun 15', planned: 14, actual: 14.5, workforce: 22 },
          { date: 'Jun 16', planned: 14.2, actual: 14.8, workforce: 25 },
          { date: 'Jun 17', planned: 14.4, actual: 15.1, workforce: 28 },
          { date: 'Jun 18', planned: 14.6, actual: 15.3, workforce: 24 },
          { date: 'Jun 19', planned: 14.8, actual: 15.5, workforce: 29 },
          { date: 'Jun 20', planned: 15, actual: 15.8, workforce: 25 },
          { date: 'Jun 21', planned: 15.2, actual: 16, workforce: 30 }
        ]
      },
      executive: {
        portfolioValue: 35000000,
        stakeholders: 18,
        riskScore: 32,
        strategicAlignment: 85,
        marketPosition: 88,
        kpiTrends: [
          { week: 'W1', efficiency: 72, quality: 0, safety: 95 },
          { week: 'W2', efficiency: 76, quality: 0, safety: 94 },
          { week: 'W3', efficiency: 78, quality: 0, safety: 96 },
          { week: 'W4', efficiency: 81, quality: 0, safety: 95 }
        ]
      },
      design: {
        designProgress: 75,
        approvedDrawings: 45,
        totalDrawings: 68,
        revisionCycles: 2,
        stakeholderApprovals: 12,
        designChanges: 8
      },
      legal: {
        contractsActive: 8,
        contractsPending: 6,
        complianceScore: 88,
        permitStatus: 'In Review',
        legalRisks: 3,
        documentationComplete: 78
      },
      sustainability: {
        leedTarget: 'Silver',
        currentScore: 45,
        energyEfficiency: 25,
        carbonReduction: 20,
        sustainableMaterials: 45,
        certifications: ['LEED Silver Target', 'ENERGY STAR Design']
      },
      facilities: {
        operationalReadiness: 15,
        systemsCommissioned: 0,
        maintenancePlanned: 60,
        energyPerformance: 75,
        occupancyReadiness: 20
      },
      planning: {
        masterPlanApproval: 95,
        zoningCompliance: 98,
        communityEngagement: 88,
        regulatoryApprovals: 75,
        feasibilityComplete: 90
      },
      preconstruction: {
        designDevelopment: 75,
        biddingProgress: 25,
        contractorSelection: 40,
        permitSubmissions: 65,
        valueEngineering: 70
      }
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Highway Bridge Renovation',
    description: 'Major renovation and structural upgrades to the Main Street bridge infrastructure.',
    status: 'active',
    start_date: '2024-02-01',
    end_date: '2024-10-31',
    org_id: '00000000-0000-0000-0000-000000000000',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z',
    team: {
      projectManager: 'Robert Chang',
      architect: 'Infrastructure Design Group',
      contractor: 'Heavy Construction LLC',
      owner: 'State Transportation Dept'
    },
    timeline: [
      { phase: 'Inspection & Assessment', startDate: '2024-02-01', endDate: '2024-03-15', status: 'completed', progress: 100 },
      { phase: 'Structural Repairs', startDate: '2024-03-16', endDate: '2024-07-31', status: 'active', progress: 82 },
      { phase: 'Deck Replacement', startDate: '2024-08-01', endDate: '2024-09-30', status: 'upcoming', progress: 0 },
      { phase: 'Final Testing', startDate: '2024-10-01', endDate: '2024-10-31', status: 'upcoming', progress: 0 }
    ],
    insights: {
      summary: 'Structural repairs ahead of schedule at 82% completion. Preparing for deck replacement phase.',
      keyPoints: [
        'Structural steel reinforcement completed',
        'Traffic management plan working effectively',
        'Weather has been favorable for outdoor work',
        'Material quality exceeding specifications'
      ],
      recommendations: [
        'Prepare for deck replacement phase mobilization',
        'Coordinate with traffic control authorities',
        'Update public communications on progress',
        'Review contingencies for autumn weather'
      ],
      alerts: [
        'Deck materials delivery scheduled for August 1st',
        'Traffic impact assessment due next week'
      ]
    },
    metrics: {
      financial: {
        totalBudget: 12500000,
        spentToDate: 8750000,
        forecastedCost: 12200000,
        contingencyUsed: 420000,
        contingencyRemaining: 580000,
        roi: 8.5,
        npv: 2100000,
        costPerSqft: 156,
        marketValue: 18000000,
        monthlySpend: [
          { month: 'Feb', budget: 800000, actual: 750000, forecast: 775000 },
          { month: 'Mar', budget: 1200000, actual: 1250000, forecast: 1225000 },
          { month: 'Apr', budget: 1400000, actual: 1380000, forecast: 1390000 },
          { month: 'May', budget: 1600000, actual: 1620000, forecast: 1610000 },
          { month: 'Jun', budget: 1800000, actual: 1850000, forecast: 1825000 },
          { month: 'Jul', budget: 2000000, actual: 0, forecast: 2000000 }
        ]
      },
      construction: {
        overallProgress: 82,
        daysAheadBehind: 8,
        totalWorkforce: 85,
        activeSubcontractors: 8,
        completedMilestones: 6,
        totalMilestones: 8,
        qualityScore: 96,
        safetyScore: 99,
        openRFIs: 5,
        pendingSubmittals: 3,
        dailyProgress: [
          { date: 'Jun 15', planned: 80, actual: 82, workforce: 82 },
          { date: 'Jun 16', planned: 80.5, actual: 82.3, workforce: 85 },
          { date: 'Jun 17', planned: 81, actual: 82.6, workforce: 88 },
          { date: 'Jun 18', planned: 81.5, actual: 82.8, workforce: 84 },
          { date: 'Jun 19', planned: 82, actual: 83.1, workforce: 89 },
          { date: 'Jun 20', planned: 82.5, actual: 83.4, workforce: 85 },
          { date: 'Jun 21', planned: 83, actual: 83.7, workforce: 92 }
        ]
      },
      executive: {
        portfolioValue: 18000000,
        stakeholders: 15,
        riskScore: 18,
        strategicAlignment: 95,
        marketPosition: 85,
        kpiTrends: [
          { week: 'W1', efficiency: 88, quality: 94, safety: 99 },
          { week: 'W2', efficiency: 91, quality: 96, safety: 98 },
          { week: 'W3', efficiency: 93, quality: 97, safety: 100 },
          { week: 'W4', efficiency: 95, quality: 98, safety: 99 }
        ]
      },
      design: {
        designProgress: 100,
        approvedDrawings: 58,
        totalDrawings: 58,
        revisionCycles: 1,
        stakeholderApprovals: 15,
        designChanges: 3
      },
      legal: {
        contractsActive: 12,
        contractsPending: 0,
        complianceScore: 98,
        permitStatus: 'All Approved',
        legalRisks: 1,
        documentationComplete: 98
      },
      sustainability: {
        leedTarget: 'N/A',
        currentScore: 0,
        energyEfficiency: 15,
        carbonReduction: 12,
        sustainableMaterials: 35,
        certifications: ['Environmental Compliance', 'Material Recycling']
      },
      facilities: {
        operationalReadiness: 75,
        systemsCommissioned: 8,
        maintenancePlanned: 95,
        energyPerformance: 82,
        occupancyReadiness: 85
      },
      planning: {
        masterPlanApproval: 100,
        zoningCompliance: 100,
        communityEngagement: 95,
        regulatoryApprovals: 100,
        feasibilityComplete: 100
      },
      preconstruction: {
        designDevelopment: 100,
        biddingProgress: 100,
        contractorSelection: 100,
        permitSubmissions: 100,
        valueEngineering: 100
      }
    }
  }
];

// Function to get project by ID
export function getProjectById(projectId: string): DetailedProject | undefined {
  return sampleProjects.find(project => project.id === projectId);
}

// Function to get all projects for dropdown
export function getAllProjects(): Project[] {
  return sampleProjects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    start_date: project.start_date,
    end_date: project.end_date,
    org_id: project.org_id,
    created_at: project.created_at,
    updated_at: project.updated_at
  }));
}

// Function to get project metrics for specific dashboard
export function getProjectMetrics(projectId: string, dashboardType: string): any {
  const project = getProjectById(projectId);
  if (!project) return null;

  switch (dashboardType) {
    case 'construction':
      return {
        ...project.metrics.construction,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'executive':
      return {
        ...project.metrics.executive,
        financial: project.metrics.financial,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'finance':
      return {
        ...project.metrics.financial,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'design':
      return {
        ...project.metrics.design,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'legal':
      return {
        ...project.metrics.legal,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'sustainability':
      return {
        ...project.metrics.sustainability,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'facilities':
      return {
        ...project.metrics.facilities,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'planning':
      return {
        ...project.metrics.planning,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    case 'preconstruction':
      return {
        ...project.metrics.preconstruction,
        insights: project.insights,
        timeline: project.timeline,
        team: project.team
      };
    default:
      return project.metrics;
  }
}
