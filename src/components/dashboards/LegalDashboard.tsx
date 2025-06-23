
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Scale, Calendar, Clock, CheckCircle } from 'lucide-react';
import ContractsDashboard from '@/components/contracts/ContractsDashboard';

interface LegalDashboardProps {
  projectId: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId }) => {
  const legalMetrics = {
    activeContracts: 23,
    pendingReviews: 5,
    complianceScore: 94,
    upcomingDeadlines: 8
  };

  return (
    <div className="space-y-6">
      {/* AI Insights - moved to top */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Legal Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive">High Priority</Badge>
              <div>
                <h4 className="font-medium">Contract Renewal Deadline</h4>
                <p className="text-sm text-muted-foreground">Steel supplier contract expires in 15 days. Schedule renewal meeting with procurement.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Medium Priority</Badge>
              <div>
                <h4 className="font-medium">Regulatory Update</h4>
                <p className="text-sm text-muted-foreground">New building codes effective Q4. Review impact on 3 active projects.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Success</Badge>
              <div>
                <h4 className="font-medium">Compliance Achievement</h4>
                <p className="text-sm text-muted-foreground">94% compliance score maintained. All safety and environmental standards met.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{legalMetrics.activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              Total value: $12.5M
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{legalMetrics.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Avg. review time: 3.2 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{legalMetrics.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Above target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{legalMetrics.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              Next: In 15 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Dashboard */}
      <ContractsDashboard />
    </div>
  );
};

export default LegalDashboard;
