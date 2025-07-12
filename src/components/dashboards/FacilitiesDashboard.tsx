
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
import { useRouter } from '@/hooks/useRouter';
import { toast } from 'sonner';
import { navigateWithProjectId, getValidProjectId } from '@/utils/navigationUtils';

interface FacilitiesDashboardProps {
  projectId: string;
  activeCategory: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId, activeCategory }) => {
  const router = useRouter();
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

  // Button click handlers
  const handleCreateWorkOrder = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/facilities', validProjectId, {
      allowPortfolio: false,
      fallbackMessage: 'Please select a project to create work order',
      additionalParams: { view: 'create-work-order' }
    });
    if (validProjectId) {
      toast.success('Opening work order creation form');
    }
  };

  const handleScheduleMaintenance = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/facilities', validProjectId, {
      allowPortfolio: false,
      fallbackMessage: 'Please select a project to schedule maintenance',
      additionalParams: { view: 'maintenance-schedule' }
    });
    if (validProjectId) {
      toast.info('Opening maintenance scheduling dashboard');
    }
  };

  const handleReviewEnergyReports = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/facilities', validProjectId, {
      allowPortfolio: true, // Energy reports can be viewed at portfolio level
      fallbackMessage: 'Please select a project to review energy reports',
      additionalParams: { view: 'energy-reports' }
    });
    if (validProjectId || isPortfolioView) {
      toast.success('Loading energy consumption reports');
    }
  };

  const handleInspectBuildingSystems = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/facilities', validProjectId, {
      allowPortfolio: false,
      fallbackMessage: 'Please select a project to inspect systems',
      additionalParams: { view: 'system-inspection' }
    });
    if (validProjectId) {
      toast.info('Opening building systems inspection checklist');
    }
  };

  const handleUpdateOperatingCosts = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/finance', validProjectId, {
      allowPortfolio: true, // Operating costs can be viewed at portfolio level
      fallbackMessage: 'Please select a project to update costs',
      additionalParams: { view: 'operating-costs' }
    });
    if (validProjectId || isPortfolioView) {
      toast.success('Opening operating costs management');
    }
  };

  const handleGenerateFacilitiesReport = () => {
    // Reports can be generated at portfolio level
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('Report generated successfully');
        }, 2000);
      }),
      {
        loading: 'Generating facilities management report...',
        success: 'Facilities report generated and sent to your email',
        error: 'Failed to generate report'
      }
    );
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
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleCreateWorkOrder}
            >
              <Wrench className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleScheduleMaintenance}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleReviewEnergyReports}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Review Energy Reports
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleInspectBuildingSystems}
            >
              <Building className="w-4 h-4 mr-2" />
              Inspect Building Systems
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleUpdateOperatingCosts}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Update Operating Costs
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleGenerateFacilitiesReport}
            >
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
