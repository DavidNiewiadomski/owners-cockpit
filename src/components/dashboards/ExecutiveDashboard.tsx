
import React from 'react';
import AIInsightsPanel from './executive/AIInsightsPanel';
import KPICards from './executive/KPICards';
import ChartsSection from './executive/ChartsSection';
import PerformanceTrends from './executive/PerformanceTrends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BarChart3, Calendar, CheckCircle2, Building, DollarSign, Target } from 'lucide-react';
import { useExecutiveMetrics } from '@/hooks/useExecutiveMetrics';

interface ExecutiveDashboardProps {
  projectId: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ projectId }) => {
  // Get comprehensive project-specific data based on projectId
  const { data: projectData, error } = useExecutiveMetrics(projectId);

  if (error) {
    console.error('Error fetching executive metrics:', error);
    // Handle error appropriately
    return null;
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading executive data...</div>
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

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={aiInsightsData} />
      
      {/* Owner Quick Actions */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Owner Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Review ROI Performance
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Meet with Project Manager
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Change Orders
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Building className="w-4 h-4 mr-2" />
              Inspect Property Progress
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Review Budget vs Actual
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
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
