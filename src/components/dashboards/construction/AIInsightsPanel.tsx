
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

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

  const keyMetrics = [
    { label: 'Progress', value: `${projectData.progressPercent}%`, status: 'normal' },
    { label: 'Budget', value: `${budgetUtilization}%`, status: parseFloat(budgetUtilization) > 100 ? 'warning' : 'normal' },
    { label: 'Productivity', value: `${projectData.productivity}%`, status: projectData.productivity < 85 ? 'warning' : 'positive' },
    { label: 'Safety', value: `${projectData.safetyIncidents}`, status: projectData.safetyIncidents > 0 ? 'warning' : 'positive' }
  ];

  const insights = {
    summary: `${projectData.name} is ${projectData.progressPercent}% complete and ${scheduleStatus}. Budget utilization is ${budgetUtilization}% with ${projectData.changeOrders} change orders totaling ${formatCurrency(projectData.changeOrderValue)}. Safety performance shows ${projectData.safetyIncidents} incidents with productivity at ${projectData.productivity}%. Quality metrics indicate ${projectData.qualityMetrics.defectRate}% defect rate and ${projectData.qualityMetrics.inspectionPass}% inspection pass rate.`,
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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Construction Insights
          <Badge variant="secondary" className="ml-auto text-xs">
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-lg font-semibold ${
                metric.status === 'positive' ? 'text-green-600' : 
                metric.status === 'warning' ? 'text-yellow-600' : 
                'text-foreground'
              }`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm leading-relaxed">
            {insights.summary}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Key Insights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 text-blue-600" />
              Key Insights
            </div>
            <div className="space-y-2">
              {insights.keyFindings.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Badge variant="outline" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                    •
                  </Badge>
                  <span className="text-muted-foreground leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowRight className="h-4 w-4 text-green-600" />
              Recommendations
            </div>
            <div className="space-y-2">
              {insights.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Badge variant="secondary" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                    →
                  </Badge>
                  <span className="text-muted-foreground leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
