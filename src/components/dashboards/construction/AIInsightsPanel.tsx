
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

  const budgetUtilization = ((projectData.budgetSpent / projectData.budgetTotal) * 100).toFixed(1);
  const scheduleStatus = projectData.daysAheadBehind > 0 ? `${projectData.daysAheadBehind} days ahead` : projectData.daysAheadBehind < 0 ? `${Math.abs(projectData.daysAheadBehind)} days behind` : 'on schedule';

  const insights = {
    summary: `${projectData.name} is ${projectData.progressPercent}% complete and ${scheduleStatus}. Budget utilization is ${budgetUtilization}% with ${projectData.changeOrders} change orders totaling ${formatCurrency(projectData.changeOrderValue)}. Safety performance shows ${projectData.safetyIncidents} incidents with productivity at ${projectData.productivity}%. Quality metrics indicate ${projectData.qualityMetrics.defectRate}% defect rate and ${projectData.qualityMetrics.inspectionPass}% inspection pass rate. Workforce of ${projectData.workforce} personnel with ${projectData.weatherDelays} weather-related delays reported.`,
    keyFindings: [
      `Project ${projectData.progressPercent}% complete with ${scheduleStatus} performance`,
      `Budget performance at ${budgetUtilization}% utilization`,
      `${projectData.overdueRFIs} overdue RFIs out of ${projectData.openRFIs} total requiring attention`,
      `Productivity metrics show ${projectData.productivity}% efficiency`,
      `Quality performance: ${projectData.qualityMetrics.defectRate}% defect rate, ${projectData.qualityMetrics.inspectionPass}% pass rate`
    ],
    recommendations: [
      projectData.overdueRFIs > 0 ? `Prioritize resolution of ${projectData.overdueRFIs} overdue RFIs` : 'Maintain current RFI response time',
      projectData.productivity < 85 ? 'Implement productivity improvement measures' : 'Sustain current productivity levels',
      projectData.qualityMetrics.defectRate > 3 ? 'Enhance quality control procedures' : 'Continue current quality standards',
      projectData.safetyIncidents > 0 ? 'Review and strengthen safety protocols' : 'Maintain excellent safety record',
      projectData.daysAheadBehind < 0 ? 'Implement schedule recovery measures' : 'Maintain current project pace'
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          AI Construction Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{insights.summary}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Key Findings:</h4>
            {insights.keyFindings.map((finding, index) => (
              <div key={index} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">•</Badge>
                <p className="text-sm text-muted-foreground">{finding}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Recommendations:</h4>
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">→</Badge>
                <p className="text-sm text-muted-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
