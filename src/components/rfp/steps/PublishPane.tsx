import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info } from 'lucide-react';

interface PublishPaneProps {
  data: {
    title: string;
    facility_id: string;
    scope_items: Array<{ csi_code: string; description: string }>;
    timeline_events: Array<{ name: string; deadline: string; mandatory: boolean }>;
    compliance: { [key: string]: any };
  };
  onComplete: () => void;
  rfpId?: string;
}

export function PublishPane({ data, onComplete, rfpId }: PublishPaneProps) {
  const [checklist, setChecklist] = useState([
    'Project title is defined',
    'Facility ID is assigned',
    'Scope includes at least one item',
    'Timeline events are complete',
    'Compliance requirements are defined'
  ]);

  const validateChecklist = () => {
    let valid = true;
    const checks = [...checklist];

    if (!data.title) {
      checks[0] = 'Project title is missing';
      valid = false;
    }
    if (!data.facility_id) {
      checks[1] = 'Facility ID is missing';
      valid = false;
    }
    if (data.scope_items.length === 0) {
      checks[2] = 'Scope items are missing';
      valid = false;
    }
    if (data.timeline_events.length === 0) {
      checks[3] = 'Timeline events are incomplete';
      valid = false;
    }
    if (Object.keys(data.compliance).length === 0) {
      checks[4] = 'Compliance requirements are not defined';
      valid = false;
    }

    setChecklist(checks);
    return valid;
  };

  const handlePublish = () => {
    if (validateChecklist()) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Publish RFP</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="info">
            <Info className="w-5 h-5 text-blue-400" />
            <AlertTitle>Ready to Publish?</AlertTitle>
            <AlertDescription>
              Review the checklist below to ensure all necessary data is complete
              before publishing the RFP.
            </AlertDescription>
          </Alert>

          <ul className="space-y-2">
            {checklist.map((item, idx) => (
              <li key={idx} className={`flex items-center space-x-2 ${item.includes('missing') ? 'text-red-400' : 'text-green-400'}`}>
                <CheckCircle className="w-4 h-4" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <Button onClick={handlePublish} className="mt-4">
              Confirm and Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
