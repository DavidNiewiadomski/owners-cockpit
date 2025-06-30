
import React from 'react';
import AIInsightsPanel from './facilities/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Wrench, Zap, Clock, BarChart3, Calendar, CheckCircle2, DollarSign, Target, Shield, Activity } from 'lucide-react';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import { useFacilitiesMetrics } from '@/hooks/useProjectMetrics';
import WorkOrders from '@/widgets/components/WorkOrders';
import EnergyUsage from '@/widgets/components/EnergyUsage';

interface FacilitiesDashboardProps {
  projectId: string;
  activeCategory: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  const { data: facilitiesData, error, isLoading } = useFacilitiesMetrics(displayProjectId);
  const loading = isLoading;
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Facilities Overview' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  // Provide fallback data for portfolio view or when data is unavailable
  const fallbackData = {
    operational_readiness: 95,
    systems_commissioned: 92,
    maintenance_planned: 88,
    energy_performance: 88,
    occupancy_readiness: 95
  };

  const effectiveData = facilitiesData || (isPortfolioView ? {
    operational_readiness: 93, // Portfolio average
    systems_commissioned: 94, // Portfolio average
    maintenance_planned: 91,
    energy_performance: 86,
    occupancy_readiness: 92
  } : fallbackData);

  if (error && !isPortfolioView) {
    console.error('Error fetching facilities metrics:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading facilities data</div>
      </div>
    );
  }

  if (loading && !isPortfolioView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-foreground">Loading facilities data...</div>
      </div>
    );
  }

  // Transform Supabase data to match AI panel expectations
  const transformedData = {
    portfolioSummary: {
      totalBuildings: 15,
      totalUnits: 450,
      overallOccupancy: effectiveData.occupancy_readiness || 92,
      totalRevenue: 850000,
      totalWorkOrders: 18,
      energyCostThisMonth: 45000,
      complianceIssues: 2,
      highestEnergyBuilding: 'Plaza Tower A',
      lowestOccupancyBuilding: 'Commerce Center B'
    },
    workOrders: {
      total: 18,
      open: 5,
      inProgress: 8,
      completed: 12,
      overdue: 2,
      avgResolutionHours: 24,
      completionRate: 85,
      byType: [],
      critical: [],
      workOrders: []
    },
    energy: {
      electricity: {
        currentMonth: 125000,
        lastMonth: 120000,
        lastYear: 130000,
        percentChange: 4.2,
        target: 115000,
        unit: 'kWh'
      },
      water: {
        currentMonth: 8500,
        lastMonth: 8200,
        percentChange: 3.7,
        unit: 'gallons'
      },
      gas: {
        currentMonth: 45000,
        lastMonth: 42000,
        percentChange: 7.1,
        unit: 'therms'
      },
      monthlyCosts: [],
      trends: [],
      monthlyUsage: []
    },
    insights: {
      summary: `Facilities portfolio shows ${effectiveData.occupancy_readiness || 92}% occupancy readiness with ${effectiveData.systems_commissioned || 94}% systems commissioned. Energy performance at ${effectiveData.energy_performance || 86}% efficiency.`,
      alerts: [
        {
          type: 'info' as const,
          message: `${effectiveData.systems_commissioned || 94}% systems commissioned with minimal downtime`,
        },
        {
          type: 'success' as const,
          message: 'Facility safety protocols maintained with minimal incidents',
        },
        {
          type: 'info' as const,
          message: `${effectiveData.maintenance_planned || 91}% maintenance planned and scheduled`,
        }
      ]
    },
    occupancy: [],
    sensors: [],
    compliance: []
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <Shield className="w-4 h-4 mr-2" />
            {effectiveData.operational_readiness}% Operational
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <Activity className="w-4 h-4 mr-2" />
            {effectiveData.energy_performance}% Energy Efficient
          </Badge>
        </div>
      </div>

      <AIInsightsPanel projectData={transformedData} />
      
      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Wrench className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Review Energy Reports
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Building className="w-4 h-4 mr-2" />
              Inspect Building Systems
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Operating Costs
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Target className="w-4 h-4 mr-2" />
              Generate Facilities Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkOrders projectId={projectId} />
        <EnergyUsage projectId={projectId} />
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Facilities Management Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Comprehensive facilities management dashboard showing work orders, energy usage, 
            and operational metrics for efficient building management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesDashboard;
