
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface SafetyIncidentsProps {
  projectId: string;
}

export function SafetyIncidents({ projectId: _projectId }: SafetyIncidentsProps) {
  const incidents = {
    thisMonth: 0,
    lastMonth: 2,
    daysWithoutIncident: 45
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-green-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Safety Incidents</h3>
      </div>
      
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{incidents.daysWithoutIncident}</div>
          <div className="text-xs text-muted-foreground">Days without incident</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-center">
          <div>
            <div className="font-semibold">{incidents.thisMonth}</div>
            <div className="text-muted-foreground">This Month</div>
          </div>
          <div>
            <div className="font-semibold">{incidents.lastMonth}</div>
            <div className="text-muted-foreground">Last Month</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

