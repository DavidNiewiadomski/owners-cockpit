
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
    { label: 'Progress', value: `${projectData.progress.toFixed(2)}%`, status: 'normal' },
    { label: 'Budget', value: `${budgetUtilization}%`, status: budgetUtilizationNum > 95 ? 'warning' : 'normal' },
    { label: 'ROI', value: `${projectData.roi}%`, status: 'positive' },
    { label: 'Risk', value: `${riskLevel}`, status: riskLevel === 'high' ? 'warning' : 'normal' }
  ];

  const insights = [
    `Project ${projectData.progress >= 75 ? 'on track' : 'needs attention'} with ${projectData.progress.toFixed(2)}% completion`,
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
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Strategic Insights
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-card rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${
                metric.status === 'positive' ? 'text-green-400' : 
                metric.status === 'warning' ? 'text-yellow-400' : 
                'text-foreground'
              }`}>
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="bg-card/50 rounded-lg p-4">
          <p className="text-foreground text-sm">
            Strategic portfolio analysis shows <strong>{projectData.name}</strong> maintaining 
            <strong>{projectData.progress.toFixed(2)}%</strong> completion rate with
            <strong>${(projectData.spentBudget / 1000000).toFixed(1)}M</strong> of 
            <strong>${(projectData.totalBudget / 1000000).toFixed(1)}M</strong> budget utilized. 
            ROI projection at <strong>{projectData.roi}%</strong> exceeds market expectations 
            with risk score of <strong>{projectData.riskScore}</strong>.
          </p>
        </div>
        {/* Key Insights and Recommendations */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-foreground">Key Insights</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              {insights.slice(0, 3).map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-foreground">Recommendations</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              {recommendations.slice(0, 3).map((rec, index) => (
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
