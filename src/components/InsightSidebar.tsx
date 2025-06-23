
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  FileText,
  ChevronRight
} from 'lucide-react';

interface InsightSidebarProps {
  selectedProject: string | null;
}

const InsightSidebar: React.FC<InsightSidebarProps> = ({ selectedProject }) => {
  // Mock data - in real implementation, this would come from your database
  const insights = {
    budget: {
      total: 2500000,
      spent: 1750000,
      remaining: 750000,
      variance: -125000
    },
    schedule: {
      totalTasks: 156,
      completed: 89,
      overdue: 7,
      upcoming: 23
    },
    documents: {
      total: 234,
      recent: 12,
      needsReview: 5
    },
    risks: [
      { id: 1, title: 'Foundation delays', severity: 'high', days: 2 },
      { id: 2, title: 'Material shortage', severity: 'medium', days: 5 },
      { id: 3, title: 'Weather concerns', severity: 'low', days: 1 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  if (!selectedProject) {
    return (
      <div className="w-80 border-l border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border/40">
          <h2 className="text-lg font-semibold">Project Insights</h2>
        </div>
        <div className="p-4">
          <div className="text-center text-muted-foreground">
            Select a project to view insights
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="p-4 border-b border-border/40">
        <h2 className="text-lg font-semibold">Project Insights</h2>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-121px)]">
        {/* Budget Overview */}
        <Card className="neumorphic-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-green-500" />
            <h3 className="font-medium">Budget</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-mono">{formatCurrency(insights.budget.spent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-mono">{formatCurrency(insights.budget.remaining)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ 
                  width: `${(insights.budget.spent / insights.budget.total) * 100}%` 
                }}
              />
            </div>
            {insights.budget.variance < 0 && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <TrendingUp className="w-3 h-3" />
                <span>{formatCurrency(Math.abs(insights.budget.variance))} over budget</span>
              </div>
            )}
          </div>
        </Card>

        {/* Schedule Overview */}
        <Card className="neumorphic-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h3 className="font-medium">Schedule</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">
                {insights.schedule.completed}
              </div>
              <div className="text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">
                {insights.schedule.upcoming}
              </div>
              <div className="text-muted-foreground">Upcoming</div>
            </div>
          </div>
          {insights.schedule.overdue > 0 && (
            <div className="mt-3 p-2 bg-red-500/10 rounded-lg">
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertTriangle className="w-3 h-3" />
                <span>{insights.schedule.overdue} tasks overdue</span>
              </div>
            </div>
          )}
        </Card>

        {/* Documents */}
        <Card className="neumorphic-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-purple-500" />
            <h3 className="font-medium">Documents</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono">{insights.documents.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Added this week</span>
              <span className="font-mono">{insights.documents.recent}</span>
            </div>
            {insights.documents.needsReview > 0 && (
              <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-600 text-sm">
                    {insights.documents.needsReview} need review
                  </span>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Risk Alerts */}
        <Card className="neumorphic-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h3 className="font-medium">Risk Alerts</h3>
          </div>
          <div className="space-y-2">
            {insights.risks.map((risk) => (
              <div key={risk.id} className="p-2 bg-background/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{risk.title}</span>
                  <Badge variant={getSeverityColor(risk.severity) as any} className="text-xs">
                    {risk.severity}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {risk.days} days ago
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="neumorphic-card p-4">
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Review
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Budget Analysis
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InsightSidebar;
