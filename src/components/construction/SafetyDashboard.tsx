
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HardHat } from 'lucide-react';
import type { SafetyIncident } from '@/types/construction';

interface SafetyDashboardProps {
  safetyDays: number;
  incidents: SafetyIncident[];
}

const SafetyDashboard: React.FC<SafetyDashboardProps> = ({ safetyDays, incidents }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-green-600" />
          Safety Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Days Without Incident</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {safetyDays} days
            </Badge>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Safety Reports</h4>
            {incidents.map((incident, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{incident.date}: {incident.type}</span>
                <Badge variant={incident.severity === 'Low' ? 'secondary' : 'destructive'}>
                  {incident.severity}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            View Safety Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyDashboard;
