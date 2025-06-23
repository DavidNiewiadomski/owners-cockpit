
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Scale, Calendar, Clock, CheckCircle, MessageSquare } from 'lucide-react';
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

  const handleInsightClick = (insight: string) => {
    console.log('Opening chat with insight:', insight);
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Contract Renewal Deadline")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="destructive" className="mt-0.5">High Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Contract Renewal Deadline</h4>
                  <p className="text-xs text-muted-foreground mt-1">Steel supplier contract expires in 15 days. Schedule renewal meeting with procurement.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Regulatory Update")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="default" className="mt-0.5">Medium Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Regulatory Update</h4>
                  <p className="text-xs text-muted-foreground mt-1">New building codes effective Q4. Review impact on 3 active projects.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Compliance Achievement")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="secondary" className="mt-0.5">Success</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Compliance Achievement</h4>
                  <p className="text-xs text-muted-foreground mt-1">94% compliance score maintained. All safety and environmental standards met.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
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
