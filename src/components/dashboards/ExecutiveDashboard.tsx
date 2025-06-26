
import React from 'react';
import AIInsightsPanel from './executive/AIInsightsPanel';
import KPICards from './executive/KPICards';
import ChartsSection from './executive/ChartsSection';
import PerformanceTrends from './executive/PerformanceTrends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BarChart3, Calendar, CheckCircle2, Building, DollarSign, Target } from 'lucide-react';
import { getProjectMetrics } from '@/utils/projectSampleData';

interface ExecutiveDashboardProps {
  projectId: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ projectId }) => {
  // Get comprehensive project-specific data based on projectId
  const projectData = getProjectMetrics(projectId, 'executive');
  
  // Fallback data if no project found
  const fallbackData = {
    portfolioValue: 68000000,
    stakeholders: 24,
    riskScore: 25,
    strategicAlignment: 88,
    marketPosition: 92,
    financial: {
      totalBudget: 52000000,
      spentToDate: 35400000,
      roi: 16.8,
      monthlySpend: [
        { month: 'Jan', budget: 2100000, actual: 1950000, forecast: 2000000 },
        { month: 'Feb', budget: 2100000, actual: 2250000, forecast: 2200000 },
        { month: 'Mar', budget: 2100000, actual: 2050000, forecast: 2100000 },
        { month: 'Apr', budget: 2100000, actual: 2180000, forecast: 2150000 },
        { month: 'May', budget: 2100000, actual: 2020000, forecast: 2080000 },
        { month: 'Jun', budget: 2100000, actual: 2200000, forecast: 2180000 }
      ]
    },
    kpiTrends: [
      { week: 'W1', efficiency: 78, quality: 92, safety: 98 },
      { week: 'W2', efficiency: 82, quality: 89, safety: 97 },
      { week: 'W3', efficiency: 85, quality: 94, safety: 99 },
      { week: 'W4', efficiency: 88, quality: 96, safety: 98 }
    ],
    insights: {
      summary: 'Project performing well with strong metrics across all areas.',
      keyPoints: ['Strong ROI performance', 'Stakeholder alignment high', 'Risk levels manageable'],
      recommendations: ['Continue current trajectory', 'Monitor market conditions'],
      alerts: ['Quarterly review due next week']
    },
    timeline: [
      { phase: 'Planning', startDate: '2024-01-01', endDate: '2024-03-31', status: 'completed', progress: 100 },
      { phase: 'Execution', startDate: '2024-04-01', endDate: '2024-10-31', status: 'active', progress: 68 },
      { phase: 'Completion', startDate: '2024-11-01', endDate: '2024-12-31', status: 'upcoming', progress: 0 }
    ],
    team: {
      projectManager: 'Sarah Johnson',
      architect: 'Michael Chen',
      contractor: 'BuildTech Solutions',
      owner: 'Metro Development Corp'
    }
  };
  
  const displayData = projectData || fallbackData;

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      
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
      
      <KPICards projectData={projectData} />
      <ChartsSection projectData={projectData} />
      <PerformanceTrends projectData={projectData} />
    </div>
  );
};

export default ExecutiveDashboard;
