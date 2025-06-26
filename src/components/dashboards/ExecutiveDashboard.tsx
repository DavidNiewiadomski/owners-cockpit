
import React from 'react';
import AIInsightsPanel from './executive/AIInsightsPanel';
import KPICards from './executive/KPICards';
import ChartsSection from './executive/ChartsSection';
import PerformanceTrends from './executive/PerformanceTrends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BarChart3, Calendar, CheckCircle2, Building, DollarSign, Target } from 'lucide-react';

interface ExecutiveDashboardProps {
  projectId: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ projectId }) => {
  // Project-specific data based on projectId
  const getProjectData = (id: string) => {
    const projectsData = {
      'lotus': {
        name: 'Project Lotus',
        totalBudget: 25000000,
        spentBudget: 17000000,
        progress: 68,
        timeline: 'On Track',
        roi: 16.8,
        riskScore: 25,
        stakeholders: 24,
        milestonesCompleted: 8,
        totalMilestones: 12,
        monthlySpend: [
          { month: 'Jan', budget: 2100000, actual: 1950000, forecast: 2000000 },
          { month: 'Feb', budget: 2100000, actual: 2250000, forecast: 2200000 },
          { month: 'Mar', budget: 2100000, actual: 2050000, forecast: 2100000 },
          { month: 'Apr', budget: 2100000, actual: 2180000, forecast: 2150000 },
          { month: 'May', budget: 2100000, actual: 2020000, forecast: 2080000 },
          { month: 'Jun', budget: 2100000, actual: 2200000, forecast: 2180000 }
        ],
        riskBreakdown: [
          { category: 'Technical', value: 35, color: '#3b82f6' },
          { category: 'Financial', value: 20, color: '#10b981' },
          { category: 'Schedule', value: 30, color: '#f59e0b' },
          { category: 'External', value: 15, color: '#ef4444' }
        ],
        kpiTrends: [
          { week: 'W1', efficiency: 78, quality: 92, safety: 98 },
          { week: 'W2', efficiency: 82, quality: 89, safety: 97 },
          { week: 'W3', efficiency: 85, quality: 94, safety: 99 },
          { week: 'W4', efficiency: 88, quality: 96, safety: 98 }
        ]
      },
      'portfolio': {
        name: 'Portfolio Overview',
        totalBudget: 75000000,
        spentBudget: 56250000,
        progress: 72,
        timeline: 'Mixed',
        roi: 14.2,
        riskScore: 35,
        stakeholders: 68,
        milestonesCompleted: 28,
        totalMilestones: 42,
        monthlySpend: [
          { month: 'Jan', budget: 6300000, actual: 5850000, forecast: 6000000 },
          { month: 'Feb', budget: 6300000, actual: 6750000, forecast: 6600000 },
          { month: 'Mar', budget: 6300000, actual: 6150000, forecast: 6300000 },
          { month: 'Apr', budget: 6300000, actual: 6540000, forecast: 6450000 },
          { month: 'May', budget: 6300000, actual: 6060000, forecast: 6240000 },
          { month: 'Jun', budget: 6300000, actual: 6600000, forecast: 6540000 }
        ],
        riskBreakdown: [
          { category: 'Technical', value: 28, color: '#3b82f6' },
          { category: 'Financial', value: 32, color: '#10b981' },
          { category: 'Schedule', value: 25, color: '#f59e0b' },
          { category: 'External', value: 15, color: '#ef4444' }
        ],
        kpiTrends: [
          { week: 'W1', efficiency: 74, quality: 88, safety: 96 },
          { week: 'W2', efficiency: 78, quality: 91, safety: 95 },
          { week: 'W3', efficiency: 81, quality: 89, safety: 97 },
          { week: 'W4', efficiency: 79, quality: 92, safety: 96 }
        ]
      }
    };
    return projectsData[id as keyof typeof projectsData] || projectsData.lotus;
  };

  const projectData = getProjectData(projectId);

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      
      {/* Quick Actions */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Review Budget Variance
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Board Meeting
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Strategic Decisions
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Building className="w-4 h-4 mr-2" />
              Review Portfolio Performance
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Financial Forecasts
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Generate Executive Report
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
