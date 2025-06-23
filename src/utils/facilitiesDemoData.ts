
export interface BuildingOccupancy {
  buildingId: string;
  buildingName: string;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
  vacantUnits: Array<{
    unitNumber: string;
    sqft: number;
    monthsVacant: number;
  }>;
  upcomingExpirations: Array<{
    unitNumber: string;
    tenant: string;
    leaseEndDate: string;
    monthlyRent: number;
  }>;
}

export interface WorkOrderSummary {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  overdue: number;
  avgResolutionHours: number;
  completionRate: number;
  byType: Array<{
    type: string;
    count: number;
    avgResolutionTime: number;
  }>;
  critical: Array<{
    id: string;
    title: string;
    building: string;
    daysOverdue: number;
    priority: 'high' | 'critical';
  }>;
}

export interface EnergyMetrics {
  electricity: {
    currentMonth: number;
    lastMonth: number;
    lastYear: number;
    percentChange: number;
    target: number;
    unit: string;
  };
  water: {
    currentMonth: number;
    lastMonth: number;
    percentChange: number;
    unit: string;
  };
  gas: {
    currentMonth: number;
    lastMonth: number;
    percentChange: number;
    unit: string;
  };
  monthlyCosts: Array<{
    month: string;
    electricity: number;
    water: number;
    gas: number;
  }>;
  trends: Array<{
    month: string;
    consumption: number;
    target: number;
  }>;
}

export interface BuildingSensors {
  buildingId: string;
  buildingName: string;
  temperature: {
    current: number;
    target: number;
    status: 'optimal' | 'high' | 'low';
  };
  humidity: {
    current: number;
    optimal: number;
    status: 'optimal' | 'high' | 'low';
  };
  airQuality: {
    aqi: number;
    status: 'good' | 'moderate' | 'poor';
  };
  lastUpdated: string;
}

export interface ComplianceItem {
  id: string;
  type: string;
  description: string;
  building: string;
  dueDate: string;
  status: 'current' | 'due_soon' | 'overdue';
  lastCompleted?: string;
  nextInspection?: string;
}

export interface FacilitiesDashboardData {
  occupancy: BuildingOccupancy[];
  workOrders: WorkOrderSummary;
  energy: EnergyMetrics;
  sensors: BuildingSensors[];
  compliance: ComplianceItem[];
  portfolioSummary: {
    totalBuildings: number;
    totalUnits: number;
    overallOccupancy: number;
    totalRevenue: number;
    totalWorkOrders: number;
    energyCostThisMonth: number;
    complianceIssues: number;
  };
}

export const generateFacilitiesDemoData = (): FacilitiesDashboardData => {
  const buildings: BuildingOccupancy[] = [
    {
      buildingId: 'bldg-a',
      buildingName: 'Plaza Tower A',
      totalUnits: 40,
      occupiedUnits: 38,
      occupancyRate: 95,
      monthlyRevenue: 152000,
      vacantUnits: [
        { unitNumber: '1205', sqft: 850, monthsVacant: 2 },
        { unitNumber: '2108', sqft: 1200, monthsVacant: 1 }
      ],
      upcomingExpirations: [
        { unitNumber: '1501', tenant: 'Smith & Associates', leaseEndDate: '2024-08-15', monthlyRent: 4200 },
        { unitNumber: '3302', tenant: 'Tech Solutions Inc', leaseEndDate: '2024-09-30', monthlyRent: 3800 }
      ]
    },
    {
      buildingId: 'bldg-b',
      buildingName: 'Commerce Center B',
      totalUnits: 32,
      occupiedUnits: 28,
      occupancyRate: 88,
      monthlyRevenue: 118000,
      vacantUnits: [
        { unitNumber: '502', sqft: 950, monthsVacant: 3 },
        { unitNumber: '801', sqft: 1100, monthsVacant: 1 },
        { unitNumber: '1203', sqft: 750, monthsVacant: 4 },
        { unitNumber: '1501', sqft: 1300, monthsVacant: 2 }
      ],
      upcomingExpirations: [
        { unitNumber: '205', tenant: 'Marketing Pro LLC', leaseEndDate: '2024-07-31', monthlyRent: 3200 },
        { unitNumber: '1002', tenant: 'Global Consulting', leaseEndDate: '2024-10-15', monthlyRent: 4500 }
      ]
    },
    {
      buildingId: 'bldg-c',
      buildingName: 'Executive Suites C',
      totalUnits: 24,
      occupiedUnits: 22,
      occupancyRate: 92,
      monthlyRevenue: 94000,
      vacantUnits: [
        { unitNumber: '301', sqft: 600, monthsVacant: 1 },
        { unitNumber: '1105', sqft: 800, monthsVacant: 2 }
      ],
      upcomingExpirations: [
        { unitNumber: '405', tenant: 'Legal Partners', leaseEndDate: '2024-11-30', monthlyRent: 5200 }
      ]
    }
  ];

  const workOrders: WorkOrderSummary = {
    total: 87,
    open: 12,
    inProgress: 8,
    completed: 67,
    overdue: 3,
    avgResolutionHours: 18,
    completionRate: 92,
    byType: [
      { type: 'HVAC', count: 25, avgResolutionTime: 24 },
      { type: 'Plumbing', count: 18, avgResolutionTime: 12 },
      { type: 'Electrical', count: 15, avgResolutionTime: 16 },
      { type: 'Security', count: 12, avgResolutionTime: 8 },
      { type: 'Elevator', count: 10, avgResolutionTime: 36 },
      { type: 'General', count: 7, avgResolutionTime: 6 }
    ],
    critical: [
      { id: 'WO-2301', title: 'HVAC System A - Preventive Maintenance', building: 'Plaza Tower A', daysOverdue: 5, priority: 'high' },
      { id: 'WO-2298', title: 'Elevator 2 - Annual Inspection', building: 'Commerce Center B', daysOverdue: 12, priority: 'critical' },
      { id: 'WO-2305', title: 'Fire Alarm Panel Battery', building: 'Executive Suites C', daysOverdue: 2, priority: 'high' }
    ]
  };

  const energy: EnergyMetrics = {
    electricity: {
      currentMonth: 52000,
      lastMonth: 48000,
      lastYear: 49500,
      percentChange: 8.3,
      target: 50000,
      unit: 'kWh'
    },
    water: {
      currentMonth: 1850,
      lastMonth: 1720,
      percentChange: 7.6,
      unit: 'gallons'
    },
    gas: {
      currentMonth: 2100,
      lastMonth: 2350,
      percentChange: -10.6,
      unit: 'therms'
    },
    monthlyCosts: [
      { month: 'Jan', electricity: 6200, water: 920, gas: 1850 },
      { month: 'Feb', electricity: 5800, water: 880, gas: 2100 },
      { month: 'Mar', electricity: 5400, water: 950, gas: 1950 },
      { month: 'Apr', electricity: 5100, water: 1020, gas: 1200 },
      { month: 'May', electricity: 5600, water: 1150, gas: 950 },
      { month: 'Jun', electricity: 7200, water: 1280, gas: 850 }
    ],
    trends: [
      { month: 'Jan', consumption: 45000, target: 50000 },
      { month: 'Feb', consumption: 42000, target: 50000 },
      { month: 'Mar', consumption: 41000, target: 50000 },
      { month: 'Apr', consumption: 43000, target: 50000 },
      { month: 'May', consumption: 48000, target: 50000 },
      { month: 'Jun', consumption: 52000, target: 50000 }
    ]
  };

  const sensors: BuildingSensors[] = [
    {
      buildingId: 'bldg-a',
      buildingName: 'Plaza Tower A',
      temperature: { current: 72, target: 72, status: 'optimal' },
      humidity: { current: 45, optimal: 50, status: 'optimal' },
      airQuality: { aqi: 28, status: 'good' },
      lastUpdated: '2024-06-23T14:30:00Z'
    },
    {
      buildingId: 'bldg-b',
      buildingName: 'Commerce Center B',
      temperature: { current: 74, target: 72, status: 'high' },
      humidity: { current: 38, optimal: 50, status: 'low' },
      airQuality: { aqi: 35, status: 'good' },
      lastUpdated: '2024-06-23T14:28:00Z'
    },
    {
      buildingId: 'bldg-c',
      buildingName: 'Executive Suites C',
      temperature: { current: 71, target: 72, status: 'optimal' },
      humidity: { current: 52, optimal: 50, status: 'optimal' },
      airQuality: { aqi: 42, status: 'moderate' },
      lastUpdated: '2024-06-23T14:32:00Z'
    }
  ];

  const compliance: ComplianceItem[] = [
    {
      id: 'comp-001',
      type: 'Fire Safety',
      description: 'Annual Fire Safety Inspection',
      building: 'Plaza Tower A',
      dueDate: '2024-07-15',
      status: 'due_soon',
      lastCompleted: '2023-07-10'
    },
    {
      id: 'comp-002',
      type: 'Elevator',
      description: 'Elevator Annual Inspection',
      building: 'Commerce Center B',
      dueDate: '2024-06-30',
      status: 'overdue',
      lastCompleted: '2023-06-25'
    },
    {
      id: 'comp-003',
      type: 'HVAC',
      description: 'Air Quality Certification',
      building: 'Executive Suites C',
      dueDate: '2024-09-20',
      status: 'current',
      lastCompleted: '2024-03-15'
    },
    {
      id: 'comp-004',
      type: 'Security',
      description: 'Security System Certification',
      building: 'Plaza Tower A',
      dueDate: '2024-12-01',
      status: 'current',
      lastCompleted: '2023-12-05'
    }
  ];

  const portfolioSummary = {
    totalBuildings: buildings.length,
    totalUnits: buildings.reduce((sum, b) => sum + b.totalUnits, 0),
    overallOccupancy: Math.round(
      buildings.reduce((sum, b) => sum + (b.occupiedUnits / b.totalUnits), 0) / buildings.length * 100
    ),
    totalRevenue: buildings.reduce((sum, b) => sum + b.monthlyRevenue, 0),
    totalWorkOrders: workOrders.total,
    energyCostThisMonth: energy.monthlyCosts[energy.monthlyCosts.length - 1].electricity + 
                         energy.monthlyCosts[energy.monthlyCosts.length - 1].water + 
                         energy.monthlyCosts[energy.monthlyCosts.length - 1].gas,
    complianceIssues: compliance.filter(c => c.status === 'overdue' || c.status === 'due_soon').length
  };

  return {
    occupancy: buildings,
    workOrders,
    energy,
    sensors,
    compliance,
    portfolioSummary
  };
};

// Helper function to get occupancy data by building
export const getBuildingOccupancy = (buildingId: string): BuildingOccupancy | undefined => {
  const data = generateFacilitiesDemoData();
  return data.occupancy.find(b => b.buildingId === buildingId);
};

// Helper function to get energy efficiency score
export const getEnergyEfficiencyScore = (): number => {
  const data = generateFacilitiesDemoData();
  const currentUsage = data.energy.electricity.currentMonth;
  const target = data.energy.electricity.target;
  return Math.max(0, Math.round((1 - (currentUsage - target) / target) * 100));
};
