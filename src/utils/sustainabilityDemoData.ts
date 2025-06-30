
import { format, subMonths, startOfMonth } from 'date-fns';

export interface EnergyData {
  month: string;
  consumption: number;
  target: number;
  renewable: number;
  grid: number;
}

export interface CarbonData {
  month: string;
  emissions: number;
  target: number;
}

export interface BuildingEfficiency {
  name: string;
  energyStarScore: number;
  efficiency: number;
}

export interface WaterUsage {
  currentYear: number;
  lastYear: number;
  ytdGallons: number;
  targetGallons: number;
  changePercent: number;
}

export interface WasteManagement {
  project: string;
  type: 'construction' | 'operations';
  recyclingRate: number;
  diversionRate: number;
  totalWaste: number;
}

export interface Certification {
  name: string;
  certification: string;
  progressPoints: number;
  goalPoints: number;
  status: 'On Track' | 'At Risk' | 'Certified' | 'Under Review';
  expectedCompletion?: string;
}

export interface SustainabilityAlert {
  id: string;
  message: string;
  type: 'Warning' | 'Reminder' | 'Achievement' | 'Critical';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
}

export interface SustainabilityReport {
  name: string;
  date: string;
  type: 'Quarterly' | 'Annual' | 'Audit' | 'Compliance';
  status: 'Available' | 'Due Soon' | 'Overdue';
}

export interface ActionItem {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  due_date?: string;
  assignee?: string;
  source_type?: string;
  source_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SustainabilityDemoData {
  energyData: EnergyData[];
  carbonData: CarbonData[];
  buildingsEfficiency: BuildingEfficiency[];
  waterUsage: WaterUsage;
  wasteManagement: WasteManagement[];
  certifications: Certification[];
  alerts: SustainabilityAlert[];
  reports: SustainabilityReport[];
  actionItems: ActionItem[];
  kpis: {
    currentEnergyUsage: number;
    energyTarget: number;
    energyDeviationPercent: number;
    currentEmissions: number;
    emissionsTarget: number;
    emissionsDeviationPercent: number;
    renewablePercentage: number;
    renewablesIncreasePercent: number;
    averageEnergyStarScore: number;
    totalRecyclingRate: number;
    compliantBuildings: number;
    totalBuildings: number;
  };
  insights: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
  };
}

export const generateSustainabilityDemoData = (): SustainabilityDemoData => {
  // Generate monthly energy data for the past 12 months
  const energyData: EnergyData[] = [];
  const carbonData: CarbonData[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(startOfMonth(new Date()), i);
    const month = format(date, 'MMM');
    
    // Base consumption with seasonal variation (higher in summer)
    const baseConsumption = 450;
    const seasonalMultiplier = Math.sin((new Date().getMonth() - i) * Math.PI / 6) * 0.2 + 1;
    const consumption = Math.round(baseConsumption * seasonalMultiplier + (Math.random() - 0.5) * 50);
    const target = 480;
    
    // Renewable energy gradually increasing
    const renewableBase = 90;
    const renewableGrowth = (12 - i) * 3; // 3 units per month growth
    const renewable = Math.round(renewableBase + renewableGrowth + (Math.random() - 0.5) * 10);
    
    energyData.push({
      month,
      consumption,
      target,
      renewable,
      grid: consumption - renewable
    });
    
    // Carbon emissions roughly proportional to energy consumption
    const emissions = Math.round(consumption * 0.1 + (Math.random() - 0.5) * 5);
    const emissionsTarget = 40;
    
    carbonData.push({
      month,
      emissions,
      target: emissionsTarget
    });
  }

  // Building efficiency data
  const buildingsEfficiency: BuildingEfficiency[] = [
    { name: 'Building A', energyStarScore: 78, efficiency: 85 },
    { name: 'Building B', energyStarScore: 92, efficiency: 95 },
    { name: 'Building C', energyStarScore: 85, efficiency: 88 },
    { name: 'HQ Tower', energyStarScore: 88, efficiency: 90 },
    { name: 'Warehouse D', energyStarScore: 75, efficiency: 82 }
  ];

  // Water usage data
  const waterUsage: WaterUsage = {
    currentYear: 1200000, // 1.2M gallons
    lastYear: 1224000,
    ytdGallons: 1200000,
    targetGallons: 1140000, // 5% reduction target
    changePercent: -2 // 2% reduction from last year
  };

  // Waste management data
  const wasteManagement: WasteManagement[] = [
    {
      project: 'Project Alpha',
      type: 'construction',
      recyclingRate: 75,
      diversionRate: 80,
      totalWaste: 245 // tons
    },
    {
      project: 'Project Beta',
      type: 'construction',
      recyclingRate: 68,
      diversionRate: 72,
      totalWaste: 189
    },
    {
      project: 'Building A Operations',
      type: 'operations',
      recyclingRate: 60,
      diversionRate: 65,
      totalWaste: 12 // tons per month
    },
    {
      project: 'Building B Operations',
      type: 'operations',
      recyclingRate: 70,
      diversionRate: 75,
      totalWaste: 15
    }
  ];

  // Certification tracking
  const certifications: Certification[] = [
    {
      name: 'Project Alpha',
      certification: 'LEED Gold',
      progressPoints: 68,
      goalPoints: 80,
      status: 'On Track',
      expectedCompletion: '2025-09-15'
    },
    {
      name: 'Office Complex Beta',
      certification: 'WELL Building Standard',
      progressPoints: 78,
      goalPoints: 100,
      status: 'Under Review',
      expectedCompletion: '2025-07-30'
    },
    {
      name: 'HQ Tower',
      certification: 'Energy Star',
      progressPoints: 92,
      goalPoints: 100,
      status: 'Certified'
    },
    {
      name: 'Residential Gamma',
      certification: 'LEED Silver',
      progressPoints: 45,
      goalPoints: 60,
      status: 'At Risk',
      expectedCompletion: '2025-12-01'
    }
  ];

  // Sustainability alerts
  const alerts: SustainabilityAlert[] = [
    {
      id: '1',
      message: 'Building A energy consumption 15% above target this month',
      type: 'Warning',
      priority: 'High',
      date: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '2',
      message: 'Quarterly sustainability report due in 2 weeks',
      type: 'Reminder',
      priority: 'Medium',
      date: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '3',
      message: 'Solar panel installation increased renewable energy to 22%',
      type: 'Achievement',
      priority: 'Low',
      date: format(subMonths(new Date(), 1), 'yyyy-MM-dd')
    },
    {
      id: '4',
      message: 'Annual emissions audit for Building B due next month',
      type: 'Reminder',
      priority: 'Medium',
      date: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '5',
      message: 'Carbon emissions exceed 2030 target trajectory by 7%',
      type: 'Critical',
      priority: 'High',
      date: format(new Date(), 'yyyy-MM-dd')
    }
  ];

  // Sustainability reports
  const reports: SustainabilityReport[] = [
    {
      name: '2025 Q2 Sustainability Report',
      date: '2025-07-15',
      type: 'Quarterly',
      status: 'Available'
    },
    {
      name: 'Annual ESG Performance Review 2024',
      date: '2024-12-31',
      type: 'Annual',
      status: 'Available'
    },
    {
      name: 'Building B Energy Audit',
      date: '2025-07-30',
      type: 'Audit',
      status: 'Due Soon'
    },
    {
      name: 'Carbon Emissions Compliance Report',
      date: '2025-08-15',
      type: 'Compliance',
      status: 'Due Soon'
    }
  ];

  // Calculate KPIs
  const currentEnergyUsage = energyData[energyData.length - 1].consumption;
  const energyTarget = energyData[energyData.length - 1].target;
  const energyDeviationPercent = Math.round(((currentEnergyUsage - energyTarget) / energyTarget) * 100);

  const currentEmissions = carbonData.reduce((sum, month) => sum + month.emissions, 0);
  const emissionsTarget = carbonData.reduce((sum, month) => sum + month.target, 0);
  const emissionsDeviationPercent = Math.round(((currentEmissions - emissionsTarget) / emissionsTarget) * 100);

  const currentRenewableEnergy = energyData[energyData.length - 1].renewable;
  const currentTotalEnergy = energyData[energyData.length - 1].consumption;
  const renewablePercentage = Math.round((currentRenewableEnergy / currentTotalEnergy) * 100);

  const lastYearRenewablePercentage = 20; // Previous year baseline
  const renewablesIncreasePercent = renewablePercentage - lastYearRenewablePercentage;

  const averageEnergyStarScore = Math.round(
    buildingsEfficiency.reduce((sum, building) => sum + building.energyStarScore, 0) / buildingsEfficiency.length
  );

  const totalRecyclingRate = Math.round(
    wasteManagement.reduce((sum, item) => sum + item.recyclingRate, 0) / wasteManagement.length
  );

  const compliantBuildings = buildingsEfficiency.filter(b => b.energyStarScore >= 75).length;
  const totalBuildings = buildingsEfficiency.length;

  // Generate action items
  const actionItems: ActionItem[] = [
    {
      id: 'sai-001',
      project_id: 'building-a',
      title: 'Implement energy efficiency upgrades in Building A',
      description: 'Install smart HVAC controls and LED lighting to reduce 15% energy overconsumption',
      status: 'Open',
      priority: 'High',
      due_date: '2024-10-20',
      assignee: 'Tom Green - Energy Manager',
      source_type: 'energy_alert',
      source_id: '1',
      created_by: 'system',
      created_at: '2024-09-25T08:00:00Z',
      updated_at: '2024-09-25T08:00:00Z'
    },
    {
      id: 'sai-002',
      project_id: 'portfolio',
      title: 'Prepare quarterly sustainability report',
      description: 'Compile Q3 2024 sustainability metrics and prepare quarterly report for stakeholders',
      status: 'In Progress',
      priority: 'Medium',
      due_date: '2024-10-14',
      assignee: 'Sarah Wilson - Sustainability Coordinator',
      source_type: 'report_due',
      source_id: '2',
      created_by: 'system',
      created_at: '2024-09-15T10:30:00Z',
      updated_at: '2024-09-28T14:45:00Z'
    },
    {
      id: 'sai-003',
      project_id: 'gamma',
      title: 'Accelerate LEED Silver certification for Residential Gamma',
      description: 'Implement missing sustainability features to improve certification progress from at-risk status',
      status: 'Open',
      priority: 'Medium',
      due_date: '2024-11-15',
      assignee: 'Lisa Martinez - LEED Coordinator',
      source_type: 'certification_risk',
      source_id: 'gamma-leed',
      created_by: 'system',
      created_at: '2024-09-20T09:15:00Z',
      updated_at: '2024-09-20T09:15:00Z'
    },
    {
      id: 'sai-004',
      project_id: 'building-b',
      title: 'Schedule annual emissions audit for Building B',
      description: 'Coordinate with third-party auditor for required annual carbon emissions audit',
      status: 'Open',
      priority: 'Medium',
      due_date: '2024-10-30',
      assignee: 'Mike Johnson - Facilities Manager',
      source_type: 'audit_reminder',
      source_id: '4',
      created_by: 'system',
      created_at: '2024-09-22T11:00:00Z',
      updated_at: '2024-09-22T11:00:00Z'
    },
    {
      id: 'sai-005',
      project_id: 'portfolio',
      title: 'Develop carbon reduction strategy',
      description: 'Create action plan to address 7% carbon emissions overage and align with 2030 targets',
      status: 'Open',
      priority: 'Critical',
      due_date: '2024-10-15',
      assignee: 'Jennifer Chen - Sustainability Director',
      source_type: 'emissions_critical',
      source_id: '5',
      created_by: 'system',
      created_at: '2024-09-18T16:20:00Z',
      updated_at: '2024-09-18T16:20:00Z'
    },
    {
      id: 'sai-006',
      project_id: 'alpha',
      title: 'Finalize LEED Gold documentation for Project Alpha',
      description: 'Complete remaining 12 points worth of documentation for LEED Gold certification',
      status: 'In Progress',
      priority: 'Medium',
      due_date: '2024-11-01',
      assignee: 'David Park - Project Manager',
      source_type: 'certification_progress',
      source_id: 'alpha-leed',
      created_by: 'system',
      created_at: '2024-09-10T13:30:00Z',
      updated_at: '2024-09-25T10:15:00Z'
    },
    {
      id: 'sai-007',
      project_id: 'portfolio',
      title: 'Expand renewable energy capacity',
      description: 'Plan additional solar installations to reach 25% renewable energy target by year-end',
      status: 'Open',
      priority: 'Medium',
      due_date: '2024-12-31',
      assignee: 'Rachel Kim - Energy Development',
      source_type: 'renewable_target',
      source_id: 'renewable-expansion',
      created_by: 'system',
      created_at: '2024-09-05T14:00:00Z',
      updated_at: '2024-09-05T14:00:00Z'
    },
    {
      id: 'sai-008',
      project_id: 'beta',
      title: 'Improve construction waste diversion rate',
      description: 'Implement enhanced recycling procedures to increase Project Beta waste diversion from 72% to 80%',
      status: 'Open',
      priority: 'Low',
      due_date: '2024-11-30',
      assignee: 'Mark Thompson - Site Supervisor',
      source_type: 'waste_improvement',
      source_id: 'beta-waste',
      created_by: 'system',
      created_at: '2024-09-12T11:45:00Z',
      updated_at: '2024-09-12T11:45:00Z'
    }
  ];

  // Generate insights
  const insights = {
    summary: `Overall energy consumption is ${energyDeviationPercent}% above target (${currentEnergyUsage} MWh vs ${energyTarget} MWh goal), primarily due to increased cooling demands in Building A. Renewable energy contribution has increased to ${renewablePercentage}% after new solar panel installations. Carbon emissions are ${emissionsDeviationPercent}% above the 2030 reduction trajectory. Water usage is ${Math.abs(waterUsage.changePercent)}% below last year, and average waste recycling across all facilities is ${totalRecyclingRate}%. ${compliantBuildings}/${totalBuildings} buildings meet Energy Star compliance standards.`,
    keyFindings: [
      `Energy consumption ${energyDeviationPercent > 0 ? 'exceeded' : 'met'} monthly targets`,
      `Renewable energy increased by ${renewablesIncreasePercent}% from solar installations`,
      `${certifications.filter(c => c.status === 'On Track').length} green building certifications on track`,
      `Water conservation achieved ${Math.abs(waterUsage.changePercent)}% reduction vs last year`,
      `Construction waste diversion averaging ${wasteManagement.filter(w => w.type === 'construction').reduce((sum, w) => sum + w.diversionRate, 0) / wasteManagement.filter(w => w.type === 'construction').length}%`
    ],
    recommendations: [
      'Implement energy efficiency measures in Building A to reduce cooling loads',
      'Accelerate renewable energy expansion to reach 25% target by year-end',
      'Review carbon reduction strategies to align with 2030 emissions goals',
      'Continue water conservation initiatives across all properties',
      'Focus on waste reduction strategies for operational facilities'
    ]
  };

  return {
    energyData,
    carbonData,
    buildingsEfficiency,
    waterUsage,
    wasteManagement,
    certifications,
    alerts,
    reports,
    actionItems,
    kpis: {
      currentEnergyUsage,
      energyTarget,
      energyDeviationPercent,
      currentEmissions,
      emissionsTarget,
      emissionsDeviationPercent,
      renewablePercentage,
      renewablesIncreasePercent,
      averageEnergyStarScore,
      totalRecyclingRate,
      compliantBuildings,
      totalBuildings
    },
    insights
  };
};
