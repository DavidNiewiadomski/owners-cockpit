
import React, { useState } from 'react';
import AIInsightsPanel from './executive/AIInsightsPanel';
import KPICards from './executive/KPICards';
import ChartsSection from './executive/ChartsSection';
import PerformanceTrends from './executive/PerformanceTrends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BarChart3, Calendar, CheckCircle2, Building, DollarSign, Target } from 'lucide-react';
import { useExecutiveMetrics } from '@/hooks/useExecutiveMetrics';
import { useRouter } from '@/hooks/useRouter';
import { toast } from 'sonner';
import { navigateWithProjectId, getValidProjectId } from '@/utils/navigationUtils';
import { useProjects } from '@/hooks/useProjects';

interface ExecutiveDashboardProps {
  projectId: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ projectId }) => {
  const router = useRouter();
  const { data: projects = [] } = useProjects();
  const [showROIModal, setShowROIModal] = useState(false);
  const [showChangeOrderModal, setShowChangeOrderModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  // Get comprehensive project-specific data based on displayProjectId
  const { data: projectData, error } = useExecutiveMetrics(displayProjectId);

  if (error) {
    console.error('Error fetching executive metrics:', error);
    // Handle error appropriately
    return null;
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-foreground">Loading executive data...</div>
      </div>
    );
  }

  const displayData = projectData;

  // Prepare data for AIInsightsPanel
  const activePhase = displayData.timeline?.find(t => t.status === 'active');
  const completedMilestones = displayData.timeline?.filter(t => t.status === 'completed').length || 0;
  const totalMilestones = displayData.timeline?.length || 0;
  
  const aiInsightsData = {
    name: 'Current Project',
    progress: activePhase?.progress || 0,
    spentBudget: displayData.financial?.spentToDate || 0,
    totalBudget: displayData.financial?.totalBudget || 0,
    riskScore: displayData.riskScore || 0,
    roi: displayData.financial?.roi || 0,
    milestonesCompleted: completedMilestones,
    totalMilestones: totalMilestones,
    stakeholders: displayData.stakeholders || 0
  };

  // Button click handlers
  const handleReviewROI = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/finance', validProjectId, {
      additionalParams: { view: 'roi' },
      allowPortfolio: true,
      fallbackMessage: 'Please select a project to review ROI'
    });
    if (validProjectId || isPortfolioView) {
      toast.success('Opening ROI Performance Dashboard');
    }
  };

  const handleScheduleMeeting = () => {
    // In a real app, this would open a calendar/scheduling interface
    toast.info('Opening calendar to schedule meeting with Project Manager');
    window.open('https://calendar.google.com/calendar/u/0/r/eventedit', '_blank');
  };

  const handleApproveChangeOrders = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/action-items', validProjectId, {
      additionalParams: { filter: 'change-orders' },
      allowPortfolio: false,
      fallbackMessage: 'Please select a project to view change orders'
    });
    if (validProjectId) {
      toast.info('Navigating to pending change orders');
    }
  };

  const handleInspectProgress = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/3d-model', validProjectId, {
      allowPortfolio: false,
      fallbackMessage: 'Please select a project to inspect progress'
    });
    if (validProjectId) {
      toast.success('Opening 3D model view for property inspection');
    }
  };

  const handleReviewBudget = () => {
    const validProjectId = getValidProjectId(displayProjectId, isPortfolioView);
    navigateWithProjectId(router, '/finance', validProjectId, {
      additionalParams: { view: 'budget-vs-actual' },
      allowPortfolio: true,
      fallbackMessage: 'Please select a project to review budget'
    });
    if (validProjectId || isPortfolioView) {
      toast.info('Loading budget vs actual comparison');
    }
  };

  const handleGenerateReport = () => {
    toast.promise(
      new Promise((resolve) => {
        // Simulate report generation
        setTimeout(() => {
          resolve('Report generated successfully');
        }, 2000);
      }),
      {
        loading: 'Generating owner report...',
        success: 'Owner report generated and sent to your email',
        error: 'Failed to generate report'
      }
    );
  };

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={aiInsightsData} />
      
      {/* Owner Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Owner Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleReviewROI}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Review ROI Performance
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleScheduleMeeting}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Meet with Project Manager
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleApproveChangeOrders}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Change Orders
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleInspectProgress}
            >
              <Building className="w-4 h-4 mr-2" />
              Inspect Property Progress
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleReviewBudget}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Review Budget vs Actual
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleGenerateReport}
            >
              <Target className="w-4 h-4 mr-2" />
              Generate Owner Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <KPICards projectData={{
        totalBudget: displayData.financial?.totalBudget || 0,
        spentBudget: displayData.financial?.spentToDate || 0,
        progress: activePhase?.progress || 0,
        timeline: activePhase?.status === 'active' ? 'On Track' : 'TBD',
        milestonesCompleted: completedMilestones,
        totalMilestones: totalMilestones,
        riskScore: displayData.riskScore || 0,
        stakeholders: displayData.stakeholders || 0,
        roi: displayData.financial?.roi || 0
      }} />
      <ChartsSection projectData={{
        monthlySpend: displayData.financial?.monthlySpend || [],
        riskBreakdown: [
          { category: 'Technical', value: Math.round(displayData.riskScore * 0.35), color: '#3b82f6' },
          { category: 'Financial', value: Math.round(displayData.riskScore * 0.20), color: '#10b981' },
          { category: 'Schedule', value: Math.round(displayData.riskScore * 0.30), color: '#f59e0b' },
          { category: 'External', value: Math.round(displayData.riskScore * 0.15), color: '#ef4444' }
        ]
      }} />
      <PerformanceTrends projectData={{
        kpiTrends: displayData.kpiTrends || []
      }} />
    </div>
  );
};

export default ExecutiveDashboard;
