
import React from 'react';
import AIInsightsPanel from './facilities/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Wrench, Zap } from 'lucide-react';
import { generateFacilitiesDemoData } from '@/utils/facilitiesDemoData';
import { luxuryOfficeProject } from '@/data/sampleProjectData';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import WorkOrders from '@/widgets/components/WorkOrders';
import EnergyUsage from '@/widgets/components/EnergyUsage';

interface FacilitiesDashboardProps {
  projectId: string;
  activeCategory: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId, activeCategory }) => {
  const project = luxuryOfficeProject;
  const projectData = generateFacilitiesDemoData();
  const { title, subtitle } = getDashboardTitle(activeCategory, projectId);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <Building className="w-4 h-4 mr-2" />
            {project.basicInfo.floors} Floors
          </Badge>
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <Zap className="w-4 h-4 mr-2" />
            Operational
          </Badge>
        </div>
      </div>

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
