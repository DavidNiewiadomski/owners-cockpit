
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface CriticalDocumentsProps {
  projectName: string;
}

const CriticalDocuments: React.FC<CriticalDocumentsProps> = ({ projectName }) => {
  return (
    <Card className="linear-card">
      <CardHeader>
        <CardTitle className="linear-chart-title">
          <FileText className="h-5 w-5" />
          Critical Documents & Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Overdue Items</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-red-600">RFI #456 - MEP Coordination</span>
                  <span className="text-sm text-muted-foreground">{projectName} • Opened 3 days ago</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-amber-600">Submittal #789 - Elevator specs</span>
                  <span className="text-sm text-muted-foreground">{projectName} • Pending approval</span>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Today's Reports</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-foreground">Daily Field Report - {projectName}</span>
                  <span className="text-sm text-muted-foreground">Updated 1 hour ago</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-foreground">Weekly Safety Report</span>
                  <span className="text-sm text-muted-foreground">Generated this morning</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalDocuments;
