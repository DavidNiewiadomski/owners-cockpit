
import React from 'react';
import AIInsightsPanel from './legal/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateLegalDemoData } from '@/utils/legalDemoData';
import { Badge } from '@/components/ui/badge';
import { Scale, Shield, FileText } from 'lucide-react';
import { luxuryOfficeProject } from '@/data/sampleProjectData';

interface LegalDashboardProps {
  projectId: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId: _projectId }) => {
  const project = luxuryOfficeProject;
  const projectData = generateLegalDemoData();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Legal & Insurance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {project.name} • Contracts, Compliance & Risk Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <Scale className="w-4 h-4 mr-2" />
            {projectData.summary.complianceScore}% Compliant
          </Badge>
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <Shield className="w-4 h-4 mr-2" />
            {projectData.summary.activeClaims} Active Claims
          </Badge>
        </div>
      </div>

      <AIInsightsPanel projectData={projectData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Contract Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Contracts</span>
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">{projectData.summary.activeContracts}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Pending Reviews</span>
                <Badge variant={projectData.summary.pendingChangeOrders > 10 ? "destructive" : "secondary"} className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                  {projectData.summary.pendingChangeOrders}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Renewals Next Quarter</span>
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">{projectData.summary.contractsEndingSoon}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance & Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Compliance Score</span>
                <Badge variant={projectData.summary.complianceScore > 90 ? "default" : "secondary"} className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                  {projectData.summary.complianceScore}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Risk Level</span>
                <Badge variant={
                  projectData.summary.complianceScore > 90 ? 'default' : 
                  projectData.summary.complianceScore > 75 ? 'secondary' : 'destructive'
                } className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                  {projectData.summary.complianceScore > 90 ? 'low' : projectData.summary.complianceScore > 75 ? 'medium' : 'high'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Open Disputes</span>
                <Badge variant={projectData.summary.activeClaims > 2 ? "destructive" : "secondary"} className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                  {projectData.summary.activeClaims}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Legal Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Manage contracts, ensure compliance, track legal risks, and maintain 
            regulatory adherence across all project activities and agreements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDashboard;
