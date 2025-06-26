
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
    <Card className="bg-[#0D1117] border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Construction Insights
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${
                metric.status === 'positive' ? 'text-green-400' : 
                metric.status === 'warning' ? 'text-yellow-400' : 
                'text-white'
              }`}>
                {metric.value}
              </div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="bg-[#0D1117]/50 rounded-lg p-4">
          <p className="text-slate-300 text-sm">
            {insights.summary}
          </p>
        </div>

        {/* Key Insights and Recommendations */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-white">Key Insights</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {insights.keyFindings.slice(0, 3).map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-white">Recommendations</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {insights.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
