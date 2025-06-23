
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';

interface RFISubmittalsProps {
  activeRFIs: number;
  pendingSubmittals: number;
}

const RFISubmittals: React.FC<RFISubmittalsProps> = ({ activeRFIs, pendingSubmittals }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600" />
          RFIs & Submittals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Active RFIs</span>
            <Badge variant="outline">{activeRFIs}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Pending Submittals</span>
            <Badge variant="outline">{pendingSubmittals}</Badge>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              Review RFIs
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Process Submittals
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RFISubmittals;
