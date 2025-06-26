
import React from 'react';
import AIInsightsPanel from './legal/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateLegalDemoData } from '@/utils/legalDemoData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scale, Shield, FileText, Clock, BarChart3, Calendar, CheckCircle2, Building, DollarSign, Target } from 'lucide-react';
import { luxuryOfficeProject } from '@/data/sampleProjectData';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';

interface LegalDashboardProps {
  projectId: string;
  activeCategory: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId, activeCategory }) => {
  const project = luxuryOfficeProject;
  const { data: projects = [] } = useProjects();
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);
  const projectData = generateLegalDemoData();

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
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
            <Scale className="w-4 h-4 mr-2" />
            {projectData.summary.complianceScore}% Compliant
          </Badge>
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
            <Shield className="w-4 h-4 mr-2" />
            {projectData.summary.activeClaims} Active Claims
          </Badge>
        </div>
      </div>

      <AIInsightsPanel projectData={projectData} />
      
      {/* Quick Actions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Review Contracts
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Legal Review
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Change Orders
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Update Compliance Status
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Scale className="w-4 h-4 mr-2" />
              Resolve Disputes
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Generate Legal Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Contract Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Contracts</span>
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{projectData.summary.activeContracts}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pending Reviews</span>
                <Badge variant={projectData.summary.pendingChangeOrders > 10 ? "destructive" : "secondary"} className="bg-slate-800 text-slate-300 border-slate-700">
                  {projectData.summary.pendingChangeOrders}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Renewals Next Quarter</span>
                <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">{projectData.summary.contractsEndingSoon}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Compliance & Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Compliance Score</span>
                <Badge variant={projectData.summary.complianceScore > 90 ? "default" : "secondary"} className="bg-slate-800 text-slate-300 border-slate-700">
                  {projectData.summary.complianceScore}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Risk Level</span>
                <Badge variant={
                  projectData.summary.complianceScore > 90 ? 'default' : 
                  projectData.summary.complianceScore > 75 ? 'secondary' : 'destructive'
                } className="bg-slate-800 text-slate-300 border-slate-700">
                  {projectData.summary.complianceScore > 90 ? 'low' : projectData.summary.complianceScore > 75 ? 'medium' : 'high'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Open Disputes</span>
                <Badge variant={projectData.summary.activeClaims > 2 ? "destructive" : "secondary"} className="bg-slate-800 text-slate-300 border-slate-700">
                  {projectData.summary.activeClaims}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-400">Legal Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">
            Manage contracts, ensure compliance, track legal risks, and maintain 
            regulatory adherence across all project activities and agreements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDashboard;
