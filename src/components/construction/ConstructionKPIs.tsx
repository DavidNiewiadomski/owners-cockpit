
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, FileText } from 'lucide-react';
import type { ProjectMetrics } from '@/types/construction';

interface ConstructionKPIsProps {
  metrics: ProjectMetrics;
}

const ConstructionKPIs: React.FC<ConstructionKPIsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.overallProgress}%</div>
          <Progress value={metrics.overallProgress} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            On track for Q3 completion
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.budgetUtilization}%</div>
          <Progress value={metrics.budgetUtilization} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            $1.8M spent of $2.5M budget
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Workforce</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.workforceCount}</div>
          <p className="text-xs text-muted-foreground">
            Personnel on site today
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionKPIs;
