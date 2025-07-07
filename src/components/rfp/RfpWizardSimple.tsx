import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RfpWizardSimpleProps {
  facilityId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function RfpWizardSimple({ facilityId, onComplete, onCancel }: RfpWizardSimpleProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>RFP Wizard - Coming Soon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>RFP Wizard functionality is being integrated...</p>
        <p className="text-sm text-muted-foreground">Facility ID: {facilityId}</p>
        
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onComplete}>
            Complete (Test)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
