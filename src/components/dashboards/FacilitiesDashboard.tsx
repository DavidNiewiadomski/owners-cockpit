
import React from 'react';
import AIInsightsPanel from './facilities/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Wrench, Zap, Clock, BarChart3, Calendar, CheckCircle2, DollarSign, Target } from 'lucide-react';
import { generateFacilitiesDemoData } from '@/utils/facilitiesDemoData';
import { luxuryOfficeProject } from '@/data/sampleProjectData';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import WorkOrders from '@/widgets/components/WorkOrders';
import EnergyUsage from '@/widgets/components/EnergyUsage';

interface FacilitiesDashboardProps {
  projectId: string;
  activeCategory: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId, activeCategory }) => {
  const project = luxuryOfficeProject;
  const projectData = generateFacilitiesDemoData();
  const { data: projects = [] } = useProjects();
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  return (
    <div className="min-h-screen bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <Building className="w-4 h-4 mr-2" />
            {project.basicInfo.floors} Floors
          </Badge>
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <Zap className="w-4 h-4 mr-2" />
            Operational
          </Badge>
        </div>
      </div>

      <AIInsightsPanel projectData={projectData} />
      
      {/* Quick Actions */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Wrench className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Review Energy Reports
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Building className="w-4 h-4 mr-2" />
              Inspect Building Systems
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Operating Costs
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Generate Facilities Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkOrders projectId={projectId} />
        <EnergyUsage projectId={projectId} />
      </div>

      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle>Facilities Management Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">
            Comprehensive facilities management dashboard showing work orders, energy usage, 
            and operational metrics for efficient building management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesDashboard;
