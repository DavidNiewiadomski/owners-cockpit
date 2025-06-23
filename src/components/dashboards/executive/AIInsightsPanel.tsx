
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageSquare } from 'lucide-react';

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
  const handleInsightClick = (insight: string) => {
    console.log('Opening chat with insight:', insight);
  };

  return (
    <Card className="linear-insight-panel">
      <CardHeader>
        <CardTitle className="linear-chart-title">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          AI Executive Insights - {projectData.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start p-3 h-auto text-left hover:bg-accent/50"
            onClick={() => handleInsightClick("Project Performance Analysis")}
          >
            <div className="flex items-start gap-3 w-full">
              <Badge variant="destructive" className="mt-0.5">High Priority</Badge>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Project Performance Analysis</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {projectData.name} is at {projectData.progress}% completion with {((projectData.spentBudget / projectData.totalBudget) * 100).toFixed(1)}% budget utilization. 
                  Risk score is {projectData.riskScore}/100 - {projectData.riskScore <= 25 ? 'Low Risk' : projectData.riskScore <= 50 ? 'Medium Risk' : 'High Risk'}.
                </p>
              </div>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start p-3 h-auto text-left hover:bg-accent/50"
            onClick={() => handleInsightClick("Financial Forecast")}
          >
            <div className="flex items-start gap-3 w-full">
              <Badge variant="default" className="mt-0.5">Medium Priority</Badge>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Financial Forecast</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Current burn rate suggests completion within budget. ROI projected at {projectData.roi}% - exceeding target by {(projectData.roi - 12).toFixed(1)}%.
                </p>
              </div>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start p-3 h-auto text-left hover:bg-accent/50"
            onClick={() => handleInsightClick("Milestone Achievement")}
          >
            <div className="flex items-start gap-3 w-full">
              <Badge variant="secondary" className="mt-0.5">Success</Badge>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Milestone Achievement</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {projectData.milestonesCompleted} of {projectData.totalMilestones} milestones completed. 
                  Team performance trending upward with {projectData.stakeholders} active stakeholders.
                </p>
              </div>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
