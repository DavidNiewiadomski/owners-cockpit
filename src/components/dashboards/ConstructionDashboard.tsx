
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, DollarSign, FileText, Shield, TrendingUp, Calendar, Users } from 'lucide-react';
import { Task } from '@/types/tasks';
import { ProjectMetrics, SafetyIncident } from '@/types/construction';
import ConstructionKPIs from '@/components/construction/ConstructionKPIs';
import SafetyDashboard from '@/components/construction/SafetyDashboard';
import RFISubmittals from '@/components/construction/RFISubmittals';
import ProjectSchedule from '@/components/construction/ProjectSchedule';
import DailyOperations from '@/components/construction/DailyOperations';

interface ConstructionDashboardProps {
  projectId: string;
}

interface ConstructionProject {
  id: string;
  name: string;
  progressPercent: number;
  dueDate: string;
  status: 'on_track' | 'delayed' | 'ahead' | 'at_risk';
  daysAheadBehind: number;
  budgetTotal: number;
  budgetSpent: number;
  changeOrders: number;
  changeOrderValue: number;
  safetyIncidents: number;
  openRFIs: number;
  overdueRFIs: number;
  pendingSubmittals: number;
  openQAIssues: number;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId }) => {
  // Mock construction portfolio data
  const projects: ConstructionProject[] = [
    {
      id: 'lotus',
      name: 'Project Lotus',
      progressPercent: 68,
      dueDate: 'Dec 1, 2025',
      status: 'on_track',
      daysAheadBehind: 0,
      budgetTotal: 25000000,
      budgetSpent: 20000000,
      changeOrders: 3,
      changeOrderValue: 800000,
      safetyIncidents: 1,
      openRFIs: 8,
      overdueRFIs: 1,
      pendingSubmittals: 4,
      openQAIssues: 2
    },
    {
      id: 'zeta',
      name: 'Project Zeta',
      progressPercent: 45,
      dueDate: 'Jan 15, 2026',
      status: 'delayed',
      daysAheadBehind: -10,
      budgetTotal: 18000000,
      budgetSpent: 9450000,
      changeOrders: 5,
      changeOrderValue: 1200000,
      safetyIncidents: 2,
      openRFIs: 12,
      overdueRFIs: 4,
      pendingSubmittals: 5,
      openQAIssues: 5
    },
    {
      id: 'alpha',
      name: 'Project Alpha',
      progressPercent: 85,
      dueDate: 'Nov 10, 2025',
      status: 'ahead',
      daysAheadBehind: 5,
      budgetTotal: 12000000,
      budgetSpent: 9800000,
      changeOrders: 2,
      changeOrderValue: 300000,
      safetyIncidents: 0,
      openRFIs: 3,
      overdueRFIs: 0,
      pendingSubmittals: 2,
      openQAIssues: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'ahead': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budgetTotal, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.budgetSpent, 0);
  const totalChangeOrders = projects.reduce((sum, p) => sum + p.changeOrderValue, 0);
  const totalSafetyIncidents = projects.reduce((sum, p) => sum + p.safetyIncidents, 0);
  const totalOpenRFIs = projects.reduce((sum, p) => sum + p.openRFIs, 0);
  const totalOverdueRFIs = projects.reduce((sum, p) => sum + p.overdueRFIs, 0);

  // Mock tasks for Gantt chart
  const tasks: Task[] = [
    {
      id: '1',
      name: 'Foundation Work - Lotus',
      progress: 95,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-28'),
      priority: 'high',
      assignee: 'Foundation Crew',
      projectId: 'lotus',
      isLate: false
    },
    {
      id: '2',
      name: 'Structural Steel - Zeta',
      progress: 45,
      startDate: new Date('2024-02-20'),
      endDate: new Date('2024-04-15'),
      priority: 'high',
      assignee: 'Steel Crew',
      projectId: 'zeta',
      isLate: true
    },
    {
      id: '3',
      name: 'MEP Installation - Alpha',
      progress: 85,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-30'),
      priority: 'medium',
      assignee: 'MEP Contractors',
      projectId: 'alpha',
      isLate: false
    }
  ];

  const safetyIncidents: SafetyIncident[] = [
    { date: '2024-06-20', type: 'Near Miss', severity: 'Low', description: 'Unsecured ladder - Project Zeta' },
    { date: '2024-06-18', type: 'First Aid', severity: 'Low', description: 'Minor cut - Project Lotus' },
    { date: '2024-06-15', type: 'Near Miss', severity: 'Medium', description: 'Fall protection issue - Project Zeta' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Construction Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Portfolio Status:</strong> Project Lotus is on schedule and within budget. Project Zeta is 10 days behind due to weather delays with a 6.7% budget overrun from change orders. Project Alpha is 5 days ahead of schedule. Safety is stable with 3 minor incidents this quarter, no major incidents reported.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive">High Priority</Badge>
              <div>
                <h4 className="font-medium">4 Overdue RFIs</h4>
                <p className="text-sm text-muted-foreground">Mostly on Project Zeta - resolving these could prevent further delays</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Medium Priority</Badge>
              <div>
                <h4 className="font-medium">Budget Monitoring</h4>
                <p className="text-sm text-muted-foreground">Project Zeta trending over budget - monitor change orders closely</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Success</Badge>
              <div>
                <h4 className="font-medium">Project Alpha</h4>
                <p className="text-sm text-muted-foreground">Ahead of schedule with excellent safety record</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(totalSpent)} spent</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Change Orders</p>
                <p className="text-2xl font-bold">{formatCurrency(totalChangeOrders)}</p>
                <p className="text-xs text-green-600">+{((totalChangeOrders / totalBudget) * 100).toFixed(1)}% impact</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safety Incidents</p>
                <p className="text-2xl font-bold">{totalSafetyIncidents}</p>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open RFIs</p>
                <p className="text-2xl font-bold">{totalOpenRFIs}</p>
                <p className="text-xs text-red-600">{totalOverdueRFIs} overdue</p>
              </div>
              <FileText className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Progress Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Active Construction Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      {project.daysAheadBehind !== 0 && (
                        <span className={`text-sm ${project.daysAheadBehind > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {project.daysAheadBehind > 0 ? '+' : ''}{project.daysAheadBehind} days
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progressPercent} className="flex-1" />
                      <span className="text-sm font-medium">{project.progressPercent}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Due: {project.dueDate}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{formatCurrency(project.budgetSpent)} / {formatCurrency(project.budgetTotal)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((project.budgetSpent / project.budgetTotal) * 100).toFixed(1)}% utilized
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Change Orders</p>
                    <p className="font-medium">{project.changeOrders} orders</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(project.changeOrderValue)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">RFIs & QA</p>
                    <p className="font-medium">{project.openRFIs} RFIs ({project.overdueRFIs} overdue)</p>
                    <p className="text-xs text-muted-foreground">{project.openQAIssues} QA issues</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget & Change Orders Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => {
                const budgetUtilization = (project.budgetSpent / project.budgetTotal) * 100;
                const isOverBudget = budgetUtilization > 90;
                
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{project.name}</span>
                      <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                        {budgetUtilization.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={budgetUtilization} 
                      className={isOverBudget ? 'bg-red-100' : ''} 
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCurrency(project.budgetSpent)} spent</span>
                      <span>{formatCurrency(project.budgetTotal)} total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Orders Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.changeOrders} approved change orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(project.changeOrderValue)}</p>
                    <p className="text-sm text-muted-foreground">
                      +{((project.changeOrderValue / project.budgetTotal) * 100).toFixed(1)}% impact
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety & QA Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-muted-foreground">Major Incidents</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-yellow-600">{totalSafetyIncidents}</p>
                  <p className="text-sm text-muted-foreground">Minor Incidents</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Recent Incidents</h4>
                {safetyIncidents.slice(0, 3).map((incident, index) => (
                  <div key={index} className="text-sm p-2 border rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{incident.type}</span>
                      <span className="text-muted-foreground">{incident.date}</span>
                    </div>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active RFIs & Submittals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-3 border rounded">
                  <h4 className="font-medium mb-2">{project.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">RFIs</p>
                      <p className="font-medium">
                        {project.openRFIs} open 
                        {project.overdueRFIs > 0 && (
                          <span className="text-red-600 ml-1">({project.overdueRFIs} overdue)</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Submittals</p>
                      <p className="font-medium">{project.pendingSubmittals} pending</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents & Critical Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Critical Documents & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Overdue Items</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-red-600">RFI #123 - Structural clarification</span>
                    <span className="text-sm text-muted-foreground">Project Zeta • Opened 5 days ago</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-amber-600">Change Order #8 - Site conditions</span>
                    <span className="text-sm text-muted-foreground">Project Zeta • Pending approval</span>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Today's Reports</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Daily Field Report - Project Lotus</span>
                    <span className="text-sm text-muted-foreground">Updated 2 hours ago</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Schedule Update - Project Alpha</span>
                    <span className="text-sm text-muted-foreground">Updated this morning</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Schedule Timeline */}
      <ProjectSchedule tasks={tasks} />
    </div>
  );
};

export default ConstructionDashboard;
