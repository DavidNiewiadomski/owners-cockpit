
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, TrendingUp } from 'lucide-react';

interface AIInsightsProps {
  projectId?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ projectId }) => {
  const insights = [
    {
      type: 'alert',
      icon: AlertTriangle,
      title: 'Budget Variance Detected',
      description: 'Foundation costs 12% over budget',
      priority: 'high'
    },
    {
      type: 'opportunity',
      icon: TrendingUp,
      title: 'Schedule Optimization',
      description: 'Parallelize electrical and plumbing',
      priority: 'medium'
    }
  ];

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-muted-foreground">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-start gap-2">
              <insight.icon className={`w-4 h-4 mt-0.5 ${
                insight.priority === 'high' ? 'text-red-500' : 
                insight.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{insight.title}</span>
                  <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIInsights;
