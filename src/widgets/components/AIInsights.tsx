
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle } from 'lucide-react';

interface AIInsightsProps {
  projectId?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ projectId }) => {
  const insights = {
    summary: 'Foundation costs are 12% over budget due to unexpected soil conditions, requiring additional structural reinforcement. Electrical and plumbing work can be parallelized to recover 3-5 days from schedule. Overall project health remains good with 2 minor safety incidents and 85% productivity rate.',
    keyFindings: [
      'Foundation budget variance detected at 12% over planned costs',
      'Schedule optimization opportunity identified in MEP coordination',
      'Safety performance within acceptable parameters',
      'Productivity metrics trending at 85% efficiency'
    ],
    recommendations: [
      'Implement value engineering for remaining foundation work',
      'Coordinate parallel MEP installation to optimize timeline',
      'Continue current safety protocol enforcement',
      'Monitor productivity trends for potential improvements'
    ]
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-muted-foreground">AI Insights</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs">{insights.summary}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Key Findings:</h4>
          {insights.keyFindings.slice(0, 2).map((finding, index) => (
            <div key={index} className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 text-xs">•</Badge>
              <p className="text-xs text-muted-foreground">{finding}</p>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium">Recommendations:</h4>
          {insights.recommendations.slice(0, 2).map((rec, index) => (
            <div key={index} className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 text-xs">→</Badge>
              <p className="text-xs text-muted-foreground">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AIInsights;
