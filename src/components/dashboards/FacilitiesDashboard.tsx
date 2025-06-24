
import React from 'react';
import AIInsightsPanel from './facilities/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateFacilitiesDemoData } from '@/utils/facilitiesDemoData';
import WorkOrders from '@/widgets/components/WorkOrders';
import EnergyUsage from '@/widgets/components/EnergyUsage';

interface FacilitiesDashboardProps {
  projectId: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId }) => {
  const projectData = generateFacilitiesDemoData();

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkOrders projectId={projectId} />
        <EnergyUsage projectId={projectId} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facilities Management Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Comprehensive facilities management dashboard showing work orders, energy usage, 
            and operational metrics for efficient building management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesDashboard;
