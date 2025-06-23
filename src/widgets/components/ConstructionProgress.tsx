
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface ConstructionProgressProps {
  projectId?: string;
}

const ConstructionProgress: React.FC<ConstructionProgressProps> = ({ projectId }) => {
  const progress = 68;
  const target = 70;

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Construction Progress</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="text-xs text-muted-foreground">
          Target: {target}% • {progress >= target ? 'On Track' : 'Behind Schedule'}
        </div>
      </div>
    </Card>
  );
};

export { ConstructionProgress };
