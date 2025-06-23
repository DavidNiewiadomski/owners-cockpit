
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Users, Shield } from 'lucide-react';

interface ConstructionKPICardsProps {
  projectData: {
    budgetTotal: number;
    budgetSpent: number;
    progressPercent: number;
    dueDate: string;
    workforce: number;
    productivity: number;
    safetyIncidents: number;
  };
}

const ConstructionKPICards: React.FC<ConstructionKPICardsProps> = ({ projectData }) => {
  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="linear-kpi-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="linear-kpi-label">Project Budget</p>
              <p className="linear-kpi-value text-green-700">{formatCurrency(projectData.budgetTotal)}</p>
              <p className="linear-kpi-trend text-green-600">{formatCurrency(projectData.budgetSpent)} spent</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <Progress value={(projectData.budgetSpent / projectData.budgetTotal) * 100} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="linear-kpi-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="linear-kpi-label">Progress</p>
              <p className="linear-kpi-value text-blue-700">{projectData.progressPercent}%</p>
              <p className="linear-kpi-trend text-blue-600">Due: {projectData.dueDate}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <Progress value={projectData.progressPercent} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="linear-kpi-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="linear-kpi-label">Workforce</p>
              <p className="linear-kpi-value text-purple-700">{projectData.workforce}</p>
              <p className="linear-kpi-trend text-purple-600">{projectData.productivity}% productivity</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="linear-kpi-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="linear-kpi-label">Safety Score</p>
              <p className="linear-kpi-value text-orange-700">{projectData.safetyIncidents}</p>
              <p className="linear-kpi-trend text-orange-600">incidents this quarter</p>
            </div>
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionKPICards;
