
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

export interface SustainabilityDemoData {
  energyData: EnergyData[];
  carbonData: CarbonData[];
  buildingsEfficiency: BuildingEfficiency[];
  waterUsage: WaterUsage;
  wasteManagement: WasteManagement[];
  certifications: Certification[];
  alerts: SustainabilityAlert[];
  reports: SustainabilityReport[];
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
