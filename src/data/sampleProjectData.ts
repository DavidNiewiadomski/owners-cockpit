// Comprehensive building owner project data for the AI agent demo
// This represents a realistic luxury office complex project from the owner's perspective

export interface ProjectMetrics {
  financial: {
    totalBudget: number;
    spentToDate: number;
    forecastedCost: number;
    contingencyUsed: number;
    contingencyRemaining: number;
    roi: number;
    npv: number;
    irr: number;
    costPerSqft: number;
    marketValue: number;
    leasingProjections: number;
  };
  schedule: {
    totalDuration: number;
    elapsedDays: number;
    remainingDays: number;
    percentComplete: number;
    criticalPathDelay: number;
    majorMilestones: number;
    completedMilestones: number;
  };
  quality: {
    inspectionScore: number;
    defectRate: number;
    reworkPercentage: number;
    qualityAudits: number;
    passedInspections: number;
    totalInspections: number;
  };
  safety: {
    recordableDays: number;
    incidentRate: number;
    nearMisses: number;
    safetyTraining: number;
    complianceScore: number;
    lastIncident: string;
  };
  sustainability: {
    leedTarget: string;
    currentScore: number;
    energyEfficiency: number;
    waterUsageReduction: number;
    wasteRecycling: number;
    carbonFootprint: number;
    sustainableMaterials: number;
  };
}

export interface Stakeholder {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  primaryContact: boolean;
  activeProjects: string[];
  performanceRating: number;
  contractValue?: number;
  lastContact: string;
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'schedule' | 'quality' | 'safety' | 'regulatory' | 'market';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  riskScore: number;
  mitigation: string;
  owner: string;
  status: 'open' | 'mitigating' | 'closed';
  dateIdentified: string;
  targetResolution: string;
}

export interface ComplianceItem {
  id: string;
  title: string;
  authority: string;
  type: 'permit' | 'inspection' | 'certification' | 'filing';
  status: 'pending' | 'submitted' | 'approved' | 'expired' | 'rejected';
  deadline: string;
  submittedDate?: string;
  approvalDate?: string;
  cost: number;
  assignedTo: string;
  documents: string[];
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  category: 'labor' | 'materials' | 'equipment' | 'permits' | 'professional' | 'other';
  amount: number;
  vendor: string;
  approvedBy: string;
  invoiceNumber: string;
  budgetCategory: string;
  variance: number;
}

export const luxuryOfficeProject = {
  id: 'luxury-office-complex-2024',
  name: 'Metropolitan Towers - Luxury Office Complex',
  description: 'Premium 12-story Class A office building in downtown business district',
  type: 'Commercial Office',
  status: 'In Construction',
  phase: 'Construction Phase 2',
  
  basicInfo: {
    address: '123 Business District Avenue, Metropolitan City, MC 12345',
    totalSquareFootage: 450000,
    floors: 12,
    unitCount: 150, // office suites
    parkingSpaces: 400,
    elevators: 6,
    startDate: '2024-01-15',
    estimatedCompletion: '2024-12-30',
    actualStartDate: '2024-01-22',
    currentProgress: 35,
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },

  financial: {
    totalBudget: 24000000,
    spentToDate: 8200000,
    forecastedCost: 23850000,
    contingencyTotal: 1200000,
    contingencyUsed: 180000,
    contingencyRemaining: 1020000,
    roi: 18.5,
    npv: 4200000,
    irr: 22.1,
    costPerSqft: 53.3,
    marketValue: 32000000,
    leasingProjections: 28800000, // 10-year projection
    cashFlow: [
      { month: 'Jan 2024', inflow: 0, outflow: 1200000, cumulative: -1200000 },
      { month: 'Feb 2024', inflow: 0, outflow: 1450000, cumulative: -2650000 },
      { month: 'Mar 2024', inflow: 0, outflow: 1680000, cumulative: -4330000 },
      { month: 'Apr 2024', inflow: 0, outflow: 1520000, cumulative: -5850000 },
      { month: 'May 2024', inflow: 0, outflow: 1750000, cumulative: -7600000 },
      { month: 'Jun 2024', inflow: 0, outflow: 600000, cumulative: -8200000 },
      { month: 'Jul 2024', inflow: 2400000, outflow: 1800000, cumulative: -7600000 }, // Pre-leasing begins
      { month: 'Aug 2024', inflow: 1200000, outflow: 1900000, cumulative: -8300000 },
      { month: 'Sep 2024', inflow: 800000, outflow: 2100000, cumulative: -9600000 },
      { month: 'Oct 2024', inflow: 600000, outflow: 2200000, cumulative: -11200000 },
      { month: 'Nov 2024', inflow: 400000, outflow: 2000000, cumulative: -12800000 },
      { month: 'Dec 2024', inflow: 3200000, outflow: 1800000, cumulative: -11400000 }, // CO and move-ins
    ]
  },

  schedule: {
    totalDuration: 350, // days
    elapsedDays: 125,
    remainingDays: 225,
    percentComplete: 35,
    criticalPathDelay: 0,
    majorMilestones: 8,
    completedMilestones: 3,
    milestones: [
      { id: 'foundation', name: 'Foundation Complete', date: '2024-03-15', status: 'completed', progress: 100 },
      { id: 'structure', name: 'Structural Steel - Floors 1-6', date: '2024-05-30', status: 'completed', progress: 100 },
      { id: 'envelope', name: 'Building Envelope - 60%', date: '2024-07-15', status: 'completed', progress: 100 },
      { id: 'mep-rough', name: 'MEP Rough-in - Floors 1-6', date: '2024-08-30', status: 'in-progress', progress: 75 },
      { id: 'elevator', name: 'Elevator Installation', date: '2024-09-15', status: 'upcoming', progress: 0 },
      { id: 'interior', name: 'Interior Build-out - Floors 1-3', date: '2024-10-30', status: 'upcoming', progress: 0 },
      { id: 'final-systems', name: 'Final Systems & Testing', date: '2024-11-30', status: 'upcoming', progress: 0 },
      { id: 'completion', name: 'Certificate of Occupancy', date: '2024-12-30', status: 'upcoming', progress: 0 }
    ]
  },

  team: {
    owner: {
      company: 'Johnson Development Group',
      contact: 'David Johnson',
      role: 'Principal Developer',
      email: 'david.johnson@johnsondevelopment.com',
      phone: '(555) 123-4567'
    },
    architect: {
      company: 'Arc Design Studio',
      contact: 'Sarah Chen',
      role: 'Lead Architect',
      email: 'sarah.chen@arcdesignstudio.com',
      phone: '(555) 345-6789',
      contractValue: 1200000
    },
    contractor: {
      company: 'Premium Builders Inc.',
      contact: 'Mike Rodriguez',
      role: 'General Contractor',
      email: 'mike.rodriguez@premiumbuilders.com',
      phone: '(555) 234-5678',
      contractValue: 18500000
    },
    engineer: {
      company: 'Wright & Associates Engineering',
      contact: 'James Wright',
      role: 'Structural Engineer',
      email: 'james.wright@structuraleng.com',
      phone: '(555) 456-7890',
      contractValue: 850000
    },
    management: {
      company: 'Pinnacle Project Management',
      contact: 'Lisa Thompson',
      role: 'Owner\'s Representative',
      email: 'lisa.thompson@pinnaclepm.com',
      phone: '(555) 567-8901',
      contractValue: 650000
    }
  },

  sustainability: {
    leedTarget: 'Gold',
    currentScore: 68,
    requiredScore: 60,
    projectedScore: 72,
    energyEfficiency: 35, // % improvement over baseline
    waterUsageReduction: 40, // % reduction
    wasteRecycling: 85, // % of construction waste recycled
    carbonFootprint: 245, // tons CO2 saved annually
    sustainableMaterials: 60, // % sustainable/recycled materials
    certifications: ['LEED Gold Target', 'ENERGY STAR Design', 'Green Building Certification'],
    greenFeatures: [
      'High-performance glazing system',
      'LED lighting throughout',
      'Smart HVAC with demand-controlled ventilation',
      'Rainwater harvesting system',
      'Electric vehicle charging stations',
      'Rooftop green space',
      'Energy-efficient elevators',
      'Smart building automation system'
    ]
  },

  safety: {
    recordableDays: 450,
    incidentRate: 0.8, // per 100 workers
    nearMisses: 12,
    safetyTraining: 98, // % completion
    complianceScore: 94,
    lastIncident: '2024-04-15',
    osha: {
      inspections: 3,
      violations: 0,
      citations: 0,
      fines: 0
    },
    protocols: [
      'Daily safety briefings',
      'Weekly safety walks',
      'Monthly safety training',
      'Fall protection program',
      'Crane safety protocols',
      'Emergency response procedures'
    ]
  },

  quality: {
    inspectionScore: 92,
    defectRate: 2.1, // % of work requiring correction
    reworkPercentage: 1.8,
    qualityAudits: 15,
    passedInspections: 28,
    totalInspections: 30,
    qualityPlan: 'ISO 9001 compliant quality management system',
    testing: [
      'Concrete strength testing',
      'Steel weld inspections',
      'Waterproofing integrity',
      'HVAC commissioning',
      'Fire safety systems',
      'Elevator certification'
    ]
  },

  permits: [
    {
      id: 'BP-2024-1847',
      name: 'Building Permit',
      authority: 'City Building Department',
      status: 'approved',
      issueDate: '2024-01-10',
      expirationDate: '2025-01-10',
      cost: 45000
    },
    {
      id: 'ZV-2024-0234',
      name: 'Zoning Variance',
      authority: 'City Planning Commission',
      status: 'approved',
      issueDate: '2023-11-15',
      expirationDate: '2026-11-15',
      cost: 12000
    },
    {
      id: 'ENV-2024-0567',
      name: 'Environmental Impact',
      authority: 'State Environmental Agency',
      status: 'approved',
      issueDate: '2023-10-20',
      expirationDate: '2027-10-20',
      cost: 8500
    }
  ],

  risks: [
    {
      id: 'risk-001',
      title: 'Weather Impact on Schedule',
      description: 'Potential delays due to seasonal weather patterns',
      category: 'schedule' as const,
      probability: 'medium' as const,
      impact: 'medium' as const,
      riskScore: 6,
      mitigation: 'Weather contingency built into schedule, covered work areas planned',
      owner: 'Mike Rodriguez',
      status: 'mitigating' as const,
      dateIdentified: '2024-02-15',
      targetResolution: '2024-06-30'
    },
    {
      id: 'risk-002',
      title: 'Steel Price Volatility',
      description: 'Market fluctuations affecting material costs',
      category: 'financial' as const,
      probability: 'high' as const,
      impact: 'medium' as const,
      riskScore: 8,
      mitigation: 'Fixed-price contracts with suppliers, contingency allocation',
      owner: 'David Johnson',
      status: 'mitigating' as const,
      dateIdentified: '2024-01-20',
      targetResolution: '2024-07-30'
    },
    {
      id: 'risk-003',
      title: 'Labor Shortage - Skilled Trades',
      description: 'Potential shortage of qualified electricians and HVAC technicians',
      category: 'schedule' as const,
      probability: 'medium' as const,
      impact: 'high' as const,
      riskScore: 7,
      mitigation: 'Early contractor selection, workforce development partnerships',
      owner: 'Mike Rodriguez',
      status: 'open' as const,
      dateIdentified: '2024-03-10',
      targetResolution: '2024-08-15'
    }
  ],

  contracts: [
    {
      id: 'contract-gc-001',
      name: 'General Construction Contract',
      contractor: 'Premium Builders Inc.',
      value: 18500000,
      type: 'Fixed Price',
      startDate: '2024-01-15',
      completionDate: '2024-12-30',
      status: 'active',
      retentionPercent: 10,
      retentionAmount: 1850000
    },
    {
      id: 'contract-arch-001',
      name: 'Architectural Services',
      contractor: 'Arc Design Studio',
      value: 1200000,
      type: 'Percentage of Construction',
      startDate: '2023-08-01',
      completionDate: '2025-03-30',
      status: 'active',
      retentionPercent: 5,
      retentionAmount: 60000
    }
  ],

  leasing: {
    totalLeasableSpace: 420000, // sq ft (excluding common areas)
    preLeasedSpace: 125000,
    preLeasingRate: 29.8, // %
    targetOccupancy: 95,
    averageRent: 48, // per sq ft annually
    leasingCommission: 4, // % of first year rent
    tenantImprovementAllowance: 35, // per sq ft
    majorteTenants: [
      {
        name: 'TechCorp Solutions',
        industry: 'Technology',
        sqft: 45000,
        floors: ['10', '11'],
        leaseLength: '10 years',
        rent: 52, // per sq ft
        moveInDate: '2025-02-01'
      },
      {
        name: 'Metropolitan Law Group',
        industry: 'Legal Services',
        sqft: 35000,
        floors: ['8', '9'],
        leaseLength: '7 years',
        rent: 48,
        moveInDate: '2025-01-15'
      },
      {
        name: 'Global Finance Partners',
        industry: 'Financial Services',
        sqft: 25000,
        floors: ['12'],
        leaseLength: '5 years',
        rent: 55,
        moveInDate: '2025-03-01'
      }
    ]
  },

  operations: {
    propertyManager: 'Elite Property Management',
    managementFee: 4, // % of gross rent
    maintenanceReserve: 2.50, // per sq ft annually
    insurance: {
      propertyInsurance: 285000, // annually
      liabilityInsurance: 125000,
      workersComp: 45000,
      builderRisk: 180000 // during construction
    },
    utilities: {
      estimatedElectric: 125000, // annually when operational
      estimatedGas: 45000,
      estimatedWater: 35000,
      estimatedInternet: 24000
    }
  }
};

// Sample portfolio data (additional projects for portfolio view)
export const portfolioProjects = [
  {
    id: 'retail-plaza-2023',
    name: 'Westside Retail Plaza',
    type: 'Retail',
    status: 'Operational',
    completionDate: '2023-09-15',
    budget: 8500000,
    currentValue: 12200000,
    sqft: 85000,
    occupancy: 94,
    noi: 1150000 // Net Operating Income
  },
  {
    id: 'residential-towers-2025',
    name: 'Riverside Residential Towers',
    type: 'Residential',
    status: 'Design Phase',
    startDate: '2025-03-01',
    budget: 35000000,
    sqft: 285000,
    units: 240,
    phase: 'Conceptual Design'
  },
  {
    id: 'mixed-use-downtown-2024',
    name: 'Downtown Mixed-Use Development',
    type: 'Mixed Use',
    status: 'Preconstruction',
    startDate: '2024-08-15',
    budget: 42000000,
    sqft: 380000,
    phase: 'Permitting'
  }
];

export const constructionProjects = [
  {
    id: 'construction-project-001',
    name: 'Skyline Apartments',
    description: '26-story residential complex featuring luxury amenities.',
    status: 'active',
    startDate: '2024-04-01',
    endDate: '2025-04-01',
    metrics: {
      progress: 45,
      budget: {
        planned: 18000000,
        actual: 17000000,
        variance: 5.5
      },
      safety: {
        incidents: 2,
        trainingCompletion: 92
      },
      quality: {
        inspectionsPassed: 28,
        defectsReported: 1
      }
    }
  }
];

export const financeProjects = [
  {
    id: 'finance-project-002',
    name: 'GreenTech Headquarters',
    description: 'Eco-friendly company headquarters implementing LEED Platinum standards.',
    status: 'planning',
    startDate: '2024-08-01',
    endDate: '2025-12-01',
    budget: {
      total: 35000000,
      allocated: 23000000,
      spent: 8000000
    },
    financeMetrics: {
      roi: 12.3,
      npv: 7500000
    }
  }
];

export const executiveProjects = [
  {
    id: 'executive-project-003',
    name: 'Global Trade Campus',
    description: 'International trade center with a focus on sustainable architecture.',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2025-10-15',
    portfolioKPI: {
      budgetPlanned: 72000000,
      budgetActual: 68500000,
      overallVariance: 4.8
    },
    strategyInsights: {
      opportunities: 'Expansion into new markets',
      risks: 'Fluctuating material costs'
    }
  }
];

export default {
  luxuryOfficeProject,
  portfolioProjects,
  constructionProjects,
  financeProjects,
  executiveProjects
};
