
import React from 'react';
import AIInsightsPanel from './legal/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateLegalDemoData } from '@/utils/legalDemoData';
import { Badge } from '@/components/ui/badge';

interface LegalDashboardProps {
  projectId: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId }) => {
  const projectData = generateLegalDemoData(projectId);

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contract Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Contracts</span>
                <Badge variant="outline">{projectData.activeContracts}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Reviews</span>
                <Badge variant={projectData.pendingReviews > 10 ? "destructive" : "secondary"}>
                  {projectData.pendingReviews}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Renewals Next Quarter</span>
                <Badge variant="outline">{projectData.renewalsNextQuarter}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Compliance Score</span>
                <Badge variant={projectData.complianceScore > 90 ? "default" : "secondary"}>
                  {projectData.complianceScore}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Risk Level</span>
                <Badge variant={
                  projectData.riskLevel === 'low' ? 'default' : 
                  projectData.riskLevel === 'medium' ? 'secondary' : 'destructive'
                }>
                  {projectData.riskLevel}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Open Disputes</span>
                <Badge variant={projectData.disputesOpen > 2 ? "destructive" : "secondary"}>
                  {projectData.disputesOpen}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Legal Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage contracts, ensure compliance, track legal risks, and maintain 
            regulatory adherence across all project activities and agreements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDashboard;
