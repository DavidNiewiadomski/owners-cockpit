
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

export interface WorkOrder {
  id: string;
  title: string;
  issue: string;
  building: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  daysOpen: number;
  assignedTo?: string;
  category: string;
  estimatedHours?: number;
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
  workOrders: WorkOrder[];
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
  monthlyUsage: Array<{
    month: string;
    electricity: number;
    water: number;
    gas: number;
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
  recentReadings: Array<{
    timestamp: string;
    temperature: number;
    humidity: number;
    aqi: number;
  }>;
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
  inspector?: string;
  documents?: Array<{
    name: string;
    url: string;
    uploadDate: string;
  }>;
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
    highestEnergyBuilding: string;
    lowestOccupancyBuilding: string;
  };
  insights: {
    summary: string;
    alerts: Array<{
      type: 'warning' | 'info' | 'success';
      message: string;
      building?: string;
    }>;
  };
}

export const generateFacilitiesDemoData = (): FacilitiesDashboardData => {
  // Generate dynamic dates
  const now = new Date();
  const getRandomDate = (daysFromNow: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  // Building occupancy data with more variety
  const buildings: BuildingOccupancy[] = [
    {
      buildingId: 'bldg-001',
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
        { unitNumber: '1501', tenant: 'Smith & Associates', leaseEndDate: getRandomDate(45), monthlyRent: 4200 },
        { unitNumber: '3302', tenant: 'Tech Solutions Inc', leaseEndDate: getRandomDate(75), monthlyRent: 3800 },
        { unitNumber: '2204', tenant: 'Creative Design LLC', leaseEndDate: getRandomDate(30), monthlyRent: 3500 }
      ]
    },
    {
      buildingId: 'bldg-002',
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
        { unitNumber: '205', tenant: 'Marketing Pro LLC', leaseEndDate: getRandomDate(15), monthlyRent: 3200 },
        { unitNumber: '1002', tenant: 'Global Consulting', leaseEndDate: getRandomDate(105), monthlyRent: 4500 }
      ]
    },
    {
      buildingId: 'bldg-003',
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
        { unitNumber: '405', tenant: 'Legal Partners', leaseEndDate: getRandomDate(120), monthlyRent: 5200 },
        { unitNumber: '602', tenant: 'Medical Group', leaseEndDate: getRandomDate(25), monthlyRent: 4800 }
      ]
    }
  ];

  // Generate comprehensive work orders
  const workOrdersList: WorkOrder[] = [
    { id: 'WO-001', title: 'HVAC Filter Replacement', issue: 'Routine maintenance - replace air filters', building: 'Plaza Tower A', status: 'Open', priority: 'Medium', daysOpen: 2, assignedTo: 'John Smith', category: 'HVAC', estimatedHours: 2 },
    { id: 'WO-002', title: 'Elevator Inspection', issue: 'Annual safety inspection required', building: 'Commerce Center B', status: 'Open', priority: 'High', daysOpen: 7, assignedTo: 'Mike Johnson', category: 'Elevator', estimatedHours: 4 },
    { id: 'WO-003', title: 'Light Fixture Repair', issue: 'Flickering lights in lobby', building: 'Executive Suites C', status: 'In Progress', priority: 'Low', daysOpen: 1, assignedTo: 'Sarah Davis', category: 'Electrical', estimatedHours: 1 },
    { id: 'WO-004', title: 'Plumbing Leak', issue: 'Water leak in restroom on 3rd floor', building: 'Plaza Tower A', status: 'Open', priority: 'High', daysOpen: 1, assignedTo: 'Tom Wilson', category: 'Plumbing', estimatedHours: 3 },
    { id: 'WO-005', title: 'Security Camera Maintenance', issue: 'Clean and test security cameras', building: 'Commerce Center B', status: 'Closed', priority: 'Medium', daysOpen: 0, assignedTo: 'Lisa Brown', category: 'Security', estimatedHours: 2 },
    { id: 'WO-006', title: 'Fire Alarm Test', issue: 'Monthly fire alarm system test', building: 'Executive Suites C', status: 'In Progress', priority: 'High', daysOpen: 3, assignedTo: 'David Lee', category: 'Safety', estimatedHours: 1 },
    { id: 'WO-007', title: 'HVAC System Overhaul', issue: 'Annual maintenance and cleaning', building: 'Plaza Tower A', status: 'Open', priority: 'Critical', daysOpen: 12, assignedTo: 'John Smith', category: 'HVAC', estimatedHours: 8 },
    { id: 'WO-008', title: 'Carpet Cleaning', issue: 'Deep clean carpets in common areas', building: 'Commerce Center B', status: 'Closed', priority: 'Low', daysOpen: 0, assignedTo: 'Cleaning Crew', category: 'General', estimatedHours: 4 }
  ];

  const openWorkOrders = workOrdersList.filter(wo => wo.status === 'Open');
  const inProgressWorkOrders = workOrdersList.filter(wo => wo.status === 'In Progress');
  const completedWorkOrders = workOrdersList.filter(wo => wo.status === 'Closed');
  const overdueWorkOrders = workOrdersList.filter(wo => wo.daysOpen > 7 && wo.status !== 'Closed');

  const workOrders: WorkOrderSummary = {
    total: workOrdersList.length,
    open: openWorkOrders.length,
    inProgress: inProgressWorkOrders.length,
    completed: completedWorkOrders.length,
    overdue: overdueWorkOrders.length,
    avgResolutionHours: 18,
    completionRate: Math.round((completedWorkOrders.length / workOrdersList.length) * 100),
    byType: [
      { type: 'HVAC', count: workOrdersList.filter(wo => wo.category === 'HVAC').length, avgResolutionTime: 24 },
      { type: 'Plumbing', count: workOrdersList.filter(wo => wo.category === 'Plumbing').length, avgResolutionTime: 12 },
      { type: 'Electrical', count: workOrdersList.filter(wo => wo.category === 'Electrical').length, avgResolutionTime: 16 },
      { type: 'Security', count: workOrdersList.filter(wo => wo.category === 'Security').length, avgResolutionTime: 8 },
      { type: 'Elevator', count: workOrdersList.filter(wo => wo.category === 'Elevator').length, avgResolutionTime: 36 },
      { type: 'General', count: workOrdersList.filter(wo => wo.category === 'General').length, avgResolutionTime: 6 }
    ],
    critical: overdueWorkOrders.map(wo => ({
      id: wo.id,
      title: wo.title,
      building: wo.building,
      daysOverdue: wo.daysOpen - 7,
      priority: wo.priority.toLowerCase() as 'high' | 'critical'
    })),
    workOrders: workOrdersList
  };

  // Enhanced energy metrics with 12 months of data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = now.getMonth();
  
  const generateMonthlyData = (baseValue: number, variation: number = 0.2) => {
    return monthNames.map((month, index) => {
      const seasonal = Math.sin((index / 12) * 2 * Math.PI) * variation;
      const random = (Math.random() - 0.5) * 0.1;
      return Math.round(baseValue * (1 + seasonal + random));
    });
  };

  const electricityData = generateMonthlyData(45000, 0.3);
  const waterData = generateMonthlyData(1500, 0.2);
  const gasData = generateMonthlyData(2000, 0.4);

  const energy: EnergyMetrics = {
    electricity: {
      currentMonth: electricityData[currentMonth],
      lastMonth: electricityData[currentMonth - 1] || electricityData[11],
      lastYear: electricityData[currentMonth] * 0.95,
      percentChange: ((electricityData[currentMonth] - (electricityData[currentMonth - 1] || electricityData[11])) / (electricityData[currentMonth - 1] || electricityData[11])) * 100,
      target: 50000,
      unit: 'kWh'
    },
    water: {
      currentMonth: waterData[currentMonth],
      lastMonth: waterData[currentMonth - 1] || waterData[11],
      percentChange: ((waterData[currentMonth] - (waterData[currentMonth - 1] || waterData[11])) / (waterData[currentMonth - 1] || waterData[11])) * 100,
      unit: 'gallons'
    },
    gas: {
      currentMonth: gasData[currentMonth],
      lastMonth: gasData[currentMonth - 1] || gasData[11],
      percentChange: ((gasData[currentMonth] - (gasData[currentMonth - 1] || gasData[11])) / (gasData[currentMonth - 1] || gasData[11])) * 100,
      unit: 'therms'
    },
    monthlyCosts: monthNames.map((month, index) => ({
      month,
      electricity: Math.round(electricityData[index] * 0.12),
      water: Math.round(waterData[index] * 0.005),
      gas: Math.round(gasData[index] * 0.85)
    })),
    trends: monthNames.map((month, index) => ({
      month,
      consumption: electricityData[index],
      target: 50000
    })),
    monthlyUsage: monthNames.map((month, index) => ({
      month,
      electricity: electricityData[index],
      water: waterData[index],
      gas: gasData[index]
    }))
  };

  // Enhanced sensor data with historical readings
  const generateSensorReadings = (baseTemp: number, baseHumidity: number, baseAqi: number) => {
    const readings = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      readings.push({
        timestamp: time.toISOString(),
        temperature: baseTemp + (Math.random() - 0.5) * 4,
        humidity: Math.max(20, Math.min(80, baseHumidity + (Math.random() - 0.5) * 10)),
        aqi: Math.max(0, Math.min(150, baseAqi + (Math.random() - 0.5) * 20))
      });
    }
    return readings;
  };

  const sensors: BuildingSensors[] = [
    {
      buildingId: 'bldg-001',
      buildingName: 'Plaza Tower A',
      temperature: { current: 72, target: 72, status: 'optimal' },
      humidity: { current: 45, optimal: 50, status: 'optimal' },
      airQuality: { aqi: 28, status: 'good' },
      lastUpdated: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      recentReadings: generateSensorReadings(72, 45, 28)
    },
    {
      buildingId: 'bldg-002',
      buildingName: 'Commerce Center B',
      temperature: { current: 74, target: 72, status: 'high' },
      humidity: { current: 38, optimal: 50, status: 'low' },
      airQuality: { aqi: 35, status: 'good' },
      lastUpdated: new Date(now.getTime() - 28 * 60 * 1000).toISOString(),
      recentReadings: generateSensorReadings(74, 38, 35)
    },
    {
      buildingId: 'bldg-003',
      buildingName: 'Executive Suites C',
      temperature: { current: 71, target: 72, status: 'optimal' },
      humidity: { current: 52, optimal: 50, status: 'optimal' },
      airQuality: { aqi: 42, status: 'moderate' },
      lastUpdated: new Date(now.getTime() - 32 * 60 * 1000).toISOString(),
      recentReadings: generateSensorReadings(71, 52, 42)
    }
  ];

  // Enhanced compliance data
  const compliance: ComplianceItem[] = [
    {
      id: 'comp-001',
      type: 'Fire Safety',
      description: 'Annual Fire Safety Inspection',
      building: 'Plaza Tower A',
      dueDate: getRandomDate(22),
      status: 'due_soon',
      lastCompleted: getRandomDate(-343),
      inspector: 'Fire Marshal Office',
      documents: [
        { name: 'Fire Safety Certificate 2023.pdf', url: '/docs/fire-cert-2023.pdf', uploadDate: getRandomDate(-343) }
      ]
    },
    {
      id: 'comp-002',
      type: 'Elevator',
      description: 'Elevator Annual Inspection',
      building: 'Commerce Center B',
      dueDate: getRandomDate(-7),
      status: 'overdue',
      lastCompleted: getRandomDate(-372),
      inspector: 'State Elevator Inspector',
      documents: [
        { name: 'Elevator Inspection 2023.pdf', url: '/docs/elevator-2023.pdf', uploadDate: getRandomDate(-372) }
      ]
    },
    {
      id: 'comp-003',
      type: 'HVAC',
      description: 'Air Quality Certification',
      building: 'Executive Suites C',
      dueDate: getRandomDate(87),
      status: 'current',
      lastCompleted: getRandomDate(-102),
      inspector: 'Environmental Health Dept',
      documents: [
        { name: 'Air Quality Report 2024.pdf', url: '/docs/air-quality-2024.pdf', uploadDate: getRandomDate(-102) }
      ]
    },
    {
      id: 'comp-004',
      type: 'Security',
      description: 'Security System Certification',
      building: 'Plaza Tower A',
      dueDate: getRandomDate(158),
      status: 'current',
      lastCompleted: getRandomDate(-207),
      inspector: 'Security Systems Inc',
      documents: [
        { name: 'Security Audit 2023.pdf', url: '/docs/security-2023.pdf', uploadDate: getRandomDate(-207) }
      ]
    },
    {
      id: 'comp-005',
      type: 'Plumbing',
      description: 'Backflow Prevention Test',
      building: 'Commerce Center B',
      dueDate: getRandomDate(45),
      status: 'due_soon',
      lastCompleted: getRandomDate(-320),
      inspector: 'City Water Department'
    }
  ];

  // Calculate portfolio summary with insights
  const totalUnits = buildings.reduce((sum, b) => sum + b.totalUnits, 0);
  const totalOccupied = buildings.reduce((sum, b) => sum + b.occupiedUnits, 0);
  const overallOccupancy = Math.round((totalOccupied / totalUnits) * 100);
  const totalRevenue = buildings.reduce((sum, b) => sum + b.monthlyRevenue, 0);
  const complianceIssues = compliance.filter(c => c.status === 'overdue' || c.status === 'due_soon').length;
  
  // Find insights
  const lowestOccupancyBuilding = buildings.reduce((lowest, building) => 
    building.occupancyRate < lowest.occupancyRate ? building : lowest
  );
  
  const highestEnergyBuilding = 'Plaza Tower A'; // Could be calculated based on building-specific energy data

  const portfolioSummary = {
    totalBuildings: buildings.length,
    totalUnits,
    overallOccupancy,
    totalRevenue,
    totalWorkOrders: workOrders.total,
    energyCostThisMonth: energy.monthlyCosts[currentMonth].electricity + 
                         energy.monthlyCosts[currentMonth].water + 
                         energy.monthlyCosts[currentMonth].gas,
    complianceIssues,
    highestEnergyBuilding,
    lowestOccupancyBuilding: lowestOccupancyBuilding.buildingName
  };

  // Generate AI insights
  const insights = {
    summary: `Portfolio operating at ${overallOccupancy}% occupancy across ${buildings.length} buildings (${totalOccupied}/${totalUnits} units occupied). ${workOrders.open} open work orders with ${workOrders.overdue} overdue. Energy usage is ${energy.electricity.percentChange.toFixed(1)}% ${energy.electricity.percentChange > 0 ? 'above' : 'below'} last month at ${energy.electricity.currentMonth.toLocaleString()} kWh. ${complianceIssues} compliance items need attention.`,
    alerts: [
      ...(workOrders.overdue > 0 ? [{
        type: 'warning' as const,
        message: `${workOrders.overdue} work orders are overdue and require immediate attention`,
      }] : []),
      ...(Math.abs(energy.electricity.percentChange) > 10 ? [{
        type: 'warning' as const,
        message: `Energy usage has ${energy.electricity.percentChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(energy.electricity.percentChange).toFixed(1)}% this month`,
      }] : []),
      ...(complianceIssues > 0 ? [{
        type: 'warning' as const,
        message: `${complianceIssues} compliance items are due soon or overdue`,
      }] : []),
      ...(lowestOccupancyBuilding.occupancyRate < 90 ? [{
        type: 'info' as const,
        message: `${lowestOccupancyBuilding.buildingName} has lower occupancy at ${lowestOccupancyBuilding.occupancyRate}%`,
        building: lowestOccupancyBuilding.buildingName
      }] : [])
    ]
  };

  return {
    occupancy: buildings,
    workOrders,
    energy,
    sensors,
    compliance,
    portfolioSummary,
    insights
  };
};

// Helper functions for specific data access
export const getBuildingOccupancy = (buildingId: string): BuildingOccupancy | undefined => {
  const data = generateFacilitiesDemoData();
  return data.occupancy.find(b => b.buildingId === buildingId);
};

export const getWorkOrdersByBuilding = (buildingId: string): WorkOrder[] => {
  const data = generateFacilitiesDemoData();
  const building = data.occupancy.find(b => b.buildingId === buildingId);
  if (!building) return [];
  
  return data.workOrders.workOrders.filter(wo => wo.building === building.buildingName);
};

export const getEnergyEfficiencyScore = (): number => {
  const data = generateFacilitiesDemoData();
  const currentUsage = data.energy.electricity.currentMonth;
  const target = data.energy.electricity.target;
  return Math.max(0, Math.round((1 - Math.max(0, currentUsage - target) / target) * 100));
};

export const getUpcomingLeaseExpirations = (daysAhead: number = 60): Array<{
  building: string;
  unitNumber: string;
  tenant: string;
  leaseEndDate: string;
  monthlyRent: number;
  daysUntilExpiration: number;
}> => {
  const data = generateFacilitiesDemoData();
  const now = new Date();
  const cutoffDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  const upcomingExpirations: Array<{
    building: string;
    unitNumber: string;
    tenant: string;
    leaseEndDate: string;
    monthlyRent: number;
    daysUntilExpiration: number;
  }> = [];

  data.occupancy.forEach(building => {
    building.upcomingExpirations.forEach(lease => {
      const leaseDate = new Date(lease.leaseEndDate);
      const daysUntil = Math.ceil((leaseDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      
      if (leaseDate <= cutoffDate && daysUntil >= 0) {
        upcomingExpirations.push({
          building: building.buildingName,
          unitNumber: lease.unitNumber,
          tenant: lease.tenant,
          leaseEndDate: lease.leaseEndDate,
          monthlyRent: lease.monthlyRent,
          daysUntilExpiration: daysUntil
        });
      }
    });
  });

  return upcomingExpirations.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
};

export const getComplianceAlerts = (): ComplianceItem[] => {
  const data = generateFacilitiesDemoData();
  return data.compliance.filter(item => item.status === 'overdue' || item.status === 'due_soon');
};
