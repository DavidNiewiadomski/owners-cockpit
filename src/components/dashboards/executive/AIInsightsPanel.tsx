
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

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
  const budgetUtilization = ((projectData.spentBudget / projectData.totalBudget) * 100).toFixed(1);
  const milestoneProgress = ((projectData.milestonesCompleted / projectData.totalMilestones) * 100).toFixed(0);
  
  const insights = {
    summary: `${projectData.name} is ${projectData.progress}% complete with ${budgetUtilization}% budget utilization. Risk assessment shows ${projectData.riskScore <= 25 ? 'low risk' : projectData.riskScore <= 50 ? 'medium risk' : 'high risk'} profile (${projectData.riskScore}/100). ROI is projected at ${projectData.roi}%, exceeding the target of 12% by ${(projectData.roi - 12).toFixed(1)}%. Milestone achievement is ${milestoneProgress}% with ${projectData.milestonesCompleted} of ${projectData.totalMilestones} completed. ${projectData.stakeholders} stakeholders are actively engaged across all project phases.`,
    keyFindings: [
      `Project completion at ${projectData.progress}% with budget performance ${budgetUtilization > 100 ? 'over' : 'under'} target`,
      `ROI projection of ${projectData.roi}% exceeds baseline expectations`,
      `Risk score of ${projectData.riskScore} indicates ${projectData.riskScore <= 25 ? 'minimal' : projectData.riskScore <= 50 ? 'manageable' : 'elevated'} project risk`,
      `Milestone delivery rate at ${milestoneProgress}% completion`,
      `Stakeholder engagement shows ${projectData.stakeholders} active participants`
    ],
    recommendations: [
      projectData.riskScore > 50 ? 'Implement additional risk mitigation strategies' : 'Continue current risk management approach',
      budgetUtilization > 95 ? 'Monitor budget closely to prevent overruns' : 'Maintain current budget discipline',
      'Leverage strong ROI performance for future project approvals',
      projectData.milestonesCompleted < projectData.totalMilestones * 0.8 ? 'Accelerate milestone completion to maintain schedule' : 'Maintain current milestone delivery pace',
      'Continue stakeholder engagement to ensure project alignment'
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          AI Executive Insights
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
