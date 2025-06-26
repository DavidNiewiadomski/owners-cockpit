
import React from 'react';
import AIInsightsPanel from './legal/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scale, Shield, FileText, Clock, BarChart3, Calendar, CheckCircle2, Building, DollarSign, Target } from 'lucide-react';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import { useLegalMetrics } from '@/hooks/useProjectMetrics';

interface LegalDashboardProps {
  projectId: string;
  activeCategory: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  const { data: legalData, error, isLoading } = useLegalMetrics(projectId);
  const loading = isLoading;
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  if (error) {
    console.error('Error fetching legal metrics:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading legal data</div>
      </div>
    );
  }

  if (loading || !legalData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading legal data...</div>
      </div>
    );
  }

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
            <Scale className="w-4 h-4 mr-2" />
            {legalData.compliance_score}% Compliant
          </Badge>
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <Shield className="w-4 h-4 mr-2" />
            {legalData.legal_risks} Legal Risks
          </Badge>
        </div>
      </div>

      <AIInsightsPanel projectData={legalData} />
      
      {/* Owner Legal Actions */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Owner Legal Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Review Major Contracts
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Meet with Legal Counsel
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Sign Change Orders
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Review Insurance Coverage
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Scale className="w-4 h-4 mr-2" />
              Address Owner Disputes
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Generate Compliance Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Contract Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Contracts</span>
                <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">{legalData.contracts_active}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pending Reviews</span>
                <Badge variant={legalData.contracts_pending > 3 ? "destructive" : "secondary"} className="bg-[#0D1117] text-slate-300 border-slate-700">
                  {legalData.contracts_pending}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Documentation Complete</span>
                <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">{legalData.documentation_complete}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">Compliance & Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Compliance Score</span>
                <Badge variant={legalData.compliance_score > 90 ? "default" : "secondary"} className="bg-[#0D1117] text-slate-300 border-slate-700">
                  {legalData.compliance_score}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Risk Level</span>
                <Badge variant={
                  legalData.compliance_score > 90 ? 'default' : 
                  legalData.compliance_score > 75 ? 'secondary' : 'destructive'
                } className="bg-[#0D1117] text-slate-300 border-slate-700">
                  {legalData.compliance_score > 90 ? 'low' : legalData.compliance_score > 75 ? 'medium' : 'high'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Open Disputes</span>
                <Badge variant={legalData.legal_risks > 2 ? "destructive" : "secondary"} className="bg-[#0D1117] text-slate-300 border-slate-700">
                  {legalData.legal_risks}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0D1117] border-slate-800">
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
