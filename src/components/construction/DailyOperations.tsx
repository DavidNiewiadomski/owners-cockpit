
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const DailyOperations: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Daily Operations Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-4 border-amber-500 pl-4">
            <h4 className="font-medium">Weather Alert</h4>
            <p className="text-sm text-muted-foreground">Rain expected tomorrow. Consider adjusting concrete pour schedule.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">Material Delivery</h4>
            <p className="text-sm text-muted-foreground">Steel delivery scheduled for 7 AM. Crane crew on standby.</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">Milestone Achievement</h4>
            <p className="text-sm text-muted-foreground">Foundation work completed ahead of schedule. Team recognized for quality work.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyOperations;
