
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, FileCheck, TrendingUp, DollarSign, Calendar, MessageSquare, MapPin, AlertTriangle, Clock, Users } from 'lucide-react';
import PreconstructionAssistant from '@/components/preconstruction/PreconstructionAssistant';
import { 
  generatePreconDemoData, 
  formatPreconCurrency, 
  getStageColor, 
  getPermitStatusColor, 
  getAlertSeverityColor,
  type PreconstructionDashboardData 
} from '@/utils/preconstructionDemoData';

interface PreconstructionDashboardProps {
  projectId: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId }) => {
  const [dashboardData, setDashboardData] = useState<PreconstructionDashboardData | null>(null);

  useEffect(() => {
    // Load the demo data
    const data = generatePreconDemoData();
    setDashboardData(data);
  }, []);

  const handleInsightClick = (insight: string) => {
    console.log('Opening chat with insight:', insight);
  };

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const { projects, alerts, recentDocuments, pendingApprovals, kpis, insights } = dashboardData;

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
            {insights.urgentItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
                onClick={() => handleInsightClick(item)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Badge variant="destructive" className="mt-0.5">Critical</Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item}</h4>
                  </div>
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            ))}
            
            {insights.recommendations.slice(0, 2).map((rec, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
                onClick={() => handleInsightClick(rec)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Badge variant="default" className="mt-0.5">Recommended</Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{rec}</h4>
                  </div>
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {formatPreconCurrency(kpis.totalBudgetPlanned)} planned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Design Progress</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.designCompletionAverage}%</div>
            <Progress value={kpis.designCompletionAverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpis.averageBudgetVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {kpis.averageBudgetVariance > 0 ? '+' : ''}{kpis.averageBudgetVariance}%
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.overBudgetProjects} projects over budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permit Delays</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{kpis.delayedPermits}</div>
            <p className="text-xs text-muted-foreground">
              Projects with delays > 14 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Design Progress</TableHead>
                <TableHead>Permit Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStageColor(project.stage)} variant="secondary">
                      {project.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatPreconCurrency(project.currentEstimate)}</div>
                      <div className="text-sm text-muted-foreground">
                        vs {formatPreconCurrency(project.initialBudget)} planned
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${project.budgetVariancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {project.budgetVariancePercent > 0 ? '+' : ''}{project.budgetVariancePercent}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{project.designCompletion}%</span>
                      </div>
                      <Progress value={project.designCompletion} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPermitStatusColor(project.permitInfo.status)} variant="secondary">
                      {project.permitInfo.status}
                      {project.permitInfo.daysPending && ` (${project.permitInfo.daysPending}d)`}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Badge className={getAlertSeverityColor(alert.severity)} variant="secondary">
                    {alert.severity}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{alert.project}</h4>
                    <p className="text-sm text-muted-foreground">{alert.issue}</p>
                  </div>
                  {alert.daysOverdue && (
                    <span className="text-xs text-red-600 font-medium">
                      {alert.daysOverdue}d overdue
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <Badge variant="outline" className="mt-0.5">
                    {approval.urgency}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{approval.approvalType}</h4>
                    <p className="text-sm text-muted-foreground">{approval.project}</p>
                    <p className="text-xs text-muted-foreground mt-1">{approval.description}</p>
                  </div>
                  <span className="text-xs text-orange-600 font-medium">
                    {approval.daysWaiting}d waiting
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{doc.title}</h4>
                  <p className="text-sm text-muted-foreground">{doc.project} • {doc.author}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{doc.status}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{doc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preconstruction Assistant */}
      <PreconstructionAssistant />
    </div>
  );
};

export default PreconstructionDashboard;
