
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, BarChart3, Target, AlertTriangle, TrendingUp } from 'lucide-react';

interface KPICardsProps {
  projectData: {
    totalBudget: number;
    spentBudget: number;
    progress: number;
    timeline: string;
    milestonesCompleted: number;
    totalMilestones: number;
    riskScore: number;
    stakeholders: number;
    roi: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ projectData }) => {
  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-green-600';
    if (score <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="linear-kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="linear-kpi-label">Project Value</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="linear-kpi-value text-green-700">
            ${(projectData.totalBudget / 1000000).toFixed(1)}M
          </div>
          <p className="linear-kpi-trend text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{projectData.roi}% ROI projected
          </p>
        </CardContent>
      </Card>

      <Card className="linear-kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="linear-kpi-label">Budget Utilization</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="linear-kpi-value text-blue-700">
            {Math.round((projectData.spentBudget / projectData.totalBudget) * 100)}%
          </div>
          <div className="mt-2">
            <Progress value={(projectData.spentBudget / projectData.totalBudget) * 100} className="h-2" />
          </div>
          <p className="linear-kpi-trend text-blue-600 mt-2">
            ${(projectData.spentBudget / 1000000).toFixed(1)}M utilized
          </p>
        </CardContent>
      </Card>

      <Card className="linear-kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="linear-kpi-label">Progress Status</CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="linear-kpi-value text-purple-700">{projectData.progress}%</div>
          <div className="mt-2">
            <Progress value={projectData.progress} className="h-2" />
          </div>
          <p className="linear-kpi-trend text-purple-600 mt-2">
            {projectData.timeline} - {projectData.milestonesCompleted}/{projectData.totalMilestones} milestones
          </p>
        </CardContent>
      </Card>

      <Card className="linear-kpi-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="linear-kpi-label">Risk Assessment</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className={`linear-kpi-value ${getRiskColor(projectData.riskScore)}`}>
            {projectData.riskScore}/100
          </div>
          <div className="mt-2">
            <Progress value={projectData.riskScore} className="h-2" />
          </div>
          <p className="linear-kpi-trend text-orange-600 mt-2">
            {projectData.stakeholders} stakeholders monitored
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
