
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface OpenIssuesProps {
  projectId: string;
}

export function OpenIssues({ projectId: _projectId }: OpenIssuesProps) {
  const issues = {
    critical: 2,
    high: 5,
    medium: 8,
    low: 12
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Open Issues</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="font-semibold text-red-600">{issues.critical}</div>
          <div className="text-muted-foreground">Critical</div>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded">
          <div className="font-semibold text-orange-600">{issues.high}</div>
          <div className="text-muted-foreground">High</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="font-semibold text-yellow-600">{issues.medium}</div>
          <div className="text-muted-foreground">Medium</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="font-semibold text-blue-600">{issues.low}</div>
          <div className="text-muted-foreground">Low</div>
        </div>
      </div>
    </Card>
  );
};

