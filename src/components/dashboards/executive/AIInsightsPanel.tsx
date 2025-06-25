
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    progress: number;
    spentBudget: number;
    totalBudget: number;
    riskScore: number;
    roi: number;
    milestonesCompleted: number;
    totalMilestones: number;
    stakeholders: number;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const budgetUtilizationNum = (projectData.spentBudget / projectData.totalBudget) * 100;
  const budgetUtilization = budgetUtilizationNum.toFixed(1);
  const _milestoneProgress = ((projectData.milestonesCompleted / projectData.totalMilestones) * 100).toFixed(0);
  
  const riskLevel = projectData.riskScore <= 25 ? 'low' : projectData.riskScore <= 50 ? 'medium' : 'high';
  const riskColor = riskLevel === 'low' ? 'text-green-600' : riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600';
  
  const keyMetrics = [
    { label: 'Progress', value: `${projectData.progress}%`, status: 'normal' },
    { label: 'Budget', value: `${budgetUtilization}%`, status: budgetUtilizationNum > 95 ? 'warning' : 'normal' },
    { label: 'ROI', value: `${projectData.roi}%`, status: 'positive' },
    { label: 'Risk', value: `${riskLevel}`, status: riskLevel === 'high' ? 'warning' : 'normal' }
  ];

  const insights = [
    `Project ${projectData.progress >= 75 ? 'on track' : 'needs attention'} with ${projectData.progress}% completion`,
    `Budget utilization at ${budgetUtilization}% ${budgetUtilizationNum > 100 ? 'over target' : 'within limits'}`,
    `ROI projection of ${projectData.roi}% exceeds 12% baseline by ${(projectData.roi - 12).toFixed(1)}%`,
    `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk profile requires ${riskLevel === 'high' ? 'immediate' : 'standard'} monitoring`
  ];

  const recommendations = [
    projectData.riskScore > 50 ? 'Implement risk mitigation strategies' : 'Maintain current risk controls',
    budgetUtilizationNum > 95 ? 'Monitor budget closely' : 'Continue budget discipline',
    'Leverage ROI performance for stakeholder buy-in',
    projectData.milestonesCompleted < projectData.totalMilestones * 0.8 ? 'Accelerate milestone delivery' : 'Maintain delivery pace'
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Portfolio Insights
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
            <strong className={`${riskColor}`}>{projectData.name}</strong> shows{' '}
            <strong>{budgetUtilizationNum > 100 ? 'budget overrun' : 'healthy budget control'}</strong> with{' '}
            {budgetUtilization}% utilization. ROI projection of <strong className="text-green-600">{projectData.roi}%</strong>{' '}
            exceeds targets. <strong className={riskColor}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk</strong>{' '}
            profile with {projectData.milestonesCompleted}/{projectData.totalMilestones} milestones completed.
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
              {insights.slice(0, 3).map((insight, index) => (
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
              {recommendations.slice(0, 3).map((rec, index) => (
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
