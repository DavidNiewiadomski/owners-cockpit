
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    progressPercent: number;
    status: string;
    daysAheadBehind: number;
    budgetSpent: number;
    budgetTotal: number;
    changeOrders: number;
    changeOrderValue: number;
    safetyIncidents: number;
    productivity: number;
    overdueRFIs: number;
    openRFIs: number;
    workforce: number;
    weatherDelays: number;
    qualityMetrics: {
      defectRate: number;
      inspectionPass: number;
    };
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <Card className="linear-insight-panel">
      <CardHeader>
        <CardTitle className="linear-chart-title">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          AI Construction Insights - {projectData.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-accent/50 border border-border rounded-lg p-4 mb-4">
          <p className="text-sm text-foreground">
            <strong>Project Status:</strong> {projectData.name} is {projectData.progressPercent}% complete and {projectData.status === 'on_track' ? 'on track' : projectData.daysAheadBehind > 0 ? `${projectData.daysAheadBehind} days ahead` : `${Math.abs(projectData.daysAheadBehind)} days behind`}. 
            Budget utilization is {((projectData.budgetSpent / projectData.budgetTotal) * 100).toFixed(1)}% with {projectData.changeOrders} change orders totaling {formatCurrency(projectData.changeOrderValue)}. 
            Safety metrics show {projectData.safetyIncidents} incidents with productivity at {projectData.productivity}%.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Badge className={projectData.overdueRFIs > 0 ? "linear-badge-destructive" : "linear-badge-secondary"}>
              {projectData.overdueRFIs > 0 ? "High Priority" : "Normal"}
            </Badge>
            <div>
              <h4 className="font-medium text-foreground">{projectData.overdueRFIs} Overdue RFIs</h4>
              <p className="text-sm text-muted-foreground">
                {projectData.openRFIs} total RFIs - resolving overdue items critical for schedule
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className={projectData.productivity >= 90 ? "linear-badge-success" : "linear-badge-default"}>
              {projectData.productivity >= 90 ? "Success" : "Monitor"}
            </Badge>
            <div>
              <h4 className="font-medium text-foreground">Productivity at {projectData.productivity}%</h4>
              <p className="text-sm text-muted-foreground">
                {projectData.workforce} workers on site with {projectData.weatherDelays} weather delays
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className={projectData.qualityMetrics.defectRate <= 2.5 ? "linear-badge-success" : "linear-badge-default"}>
              {projectData.qualityMetrics.defectRate <= 2.5 ? "Success" : "Monitor"}
            </Badge>
            <div>
              <h4 className="font-medium text-foreground">Quality Score</h4>
              <p className="text-sm text-muted-foreground">
                {projectData.qualityMetrics.defectRate}% defect rate, {projectData.qualityMetrics.inspectionPass}% pass rate
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
