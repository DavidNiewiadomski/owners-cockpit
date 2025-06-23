
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, DollarSign, FileText, Shield, TrendingUp, Calendar, Users, Wrench, CheckCircle } from 'lucide-react';
import { Task } from '@/types/tasks';
import { ProjectMetrics, SafetyIncident } from '@/types/construction';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ConstructionDashboardProps {
  projectId: string;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId }) => {
  // Project-specific construction data
  const getProjectData = (id: string) => {
    const projectsData = {
      'lotus': {
        name: 'Project Lotus',
        progressPercent: 68,
        dueDate: 'Dec 1, 2025',
        status: 'on_track' as const,
        daysAheadBehind: 0,
        budgetTotal: 25000000,
        budgetSpent: 20000000,
        changeOrders: 3,
        changeOrderValue: 800000,
        safetyIncidents: 1,
        openRFIs: 8,
        overdueRFIs: 1,
        pendingSubmittals: 4,
        openQAIssues: 2,
        workforce: 45,
        productivity: 94,
        weatherDelays: 2,
        materialDeliveries: [
          { week: 'W1', planned: 85, actual: 88, delayed: 3 },
          { week: 'W2', planned: 92, actual: 90, delayed: 2 },
          { week: 'W3', planned: 78, actual: 82, delayed: 1 },
          { week: 'W4', planned: 95, actual: 91, delayed: 4 }
        ],
        constructionProgress: [
          { phase: 'Foundation', planned: 100, actual: 100, variance: 0 },
          { phase: 'Structure', planned: 85, actual: 88, variance: 3 },
          { phase: 'MEP Rough', planned: 60, actual: 55, variance: -5 },
          { phase: 'Exterior', planned: 40, actual: 45, variance: 5 },
          { phase: 'Interior', planned: 20, actual: 18, variance: -2 },
          { phase: 'Finishes', planned: 5, actual: 3, variance: -2 }
        ],
        qualityMetrics: {
          defectRate: 2.1,
          reworkHours: 45,
          inspectionPass: 94,
          punchListItems: 23
        },
        safetyTrends: [
          { month: 'Jan', incidents: 0, nearMiss: 2, training: 12 },
          { month: 'Feb', incidents: 1, nearMiss: 1, training: 8 },
          { month: 'Mar', incidents: 0, nearMiss: 3, training: 15 },
          { month: 'Apr', incidents: 0, nearMiss: 1, training: 10 },
          { month: 'May', incidents: 0, nearMiss: 2, training: 14 },
          { month: 'Jun', incidents: 1, nearMiss: 1, training: 9 }
        ]
      },
      'portfolio': {
        name: 'Portfolio Construction',
        progressPercent: 65,
        dueDate: 'Q4 2025',
        status: 'mixed' as const,
        daysAheadBehind: -5,
        budgetTotal: 75000000,
        budgetSpent: 58500000,
        changeOrders: 12,
        changeOrderValue: 2800000,
        safetyIncidents: 4,
        openRFIs: 28,
        overdueRFIs: 7,
        pendingSubmittals: 15,
        openQAIssues: 8,
        workforce: 156,
        productivity: 87,
        weatherDelays: 8,
        materialDeliveries: [
          { week: 'W1', planned: 245, actual: 238, delayed: 7 },
          { week: 'W2', planned: 268, actual: 255, delayed: 13 },
          { week: 'W3', planned: 223, actual: 231, delayed: 5 },
          { week: 'W4', planned: 287, actual: 275, delayed: 12 }
        ],
        constructionProgress: [
          { phase: 'Foundation', planned: 100, actual: 98, variance: -2 },
          { phase: 'Structure', planned: 78, actual: 75, variance: -3 },
          { phase: 'MEP Rough', planned: 52, actual: 48, variance: -4 },
          { phase: 'Exterior', planned: 35, actual: 38, variance: 3 },
          { phase: 'Interior', planned: 18, actual: 15, variance: -3 },
          { phase: 'Finishes', planned: 8, actual: 6, variance: -2 }
        ],
        qualityMetrics: {
          defectRate: 3.2,
          reworkHours: 128,
          inspectionPass: 89,
          punchListItems: 67
        },
        safetyTrends: [
          { month: 'Jan', incidents: 1, nearMiss: 5, training: 35 },
          { month: 'Feb', incidents: 2, nearMiss: 3, training: 28 },
          { month: 'Mar', incidents: 0, nearMiss: 7, training: 42 },
          { month: 'Apr', incidents: 1, nearMiss: 4, training: 31 },
          { month: 'May', incidents: 0, nearMiss: 6, training: 38 },
          { month: 'Jun', incidents: 2, nearMiss: 2, training: 25 }
        ]
      }
    };
    return projectsData[id as keyof typeof projectsData] || projectsData.lotus;
  };

  const projectData = getProjectData(projectId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'linear-badge-success';
      case 'ahead': return 'linear-badge-default';
      case 'delayed': return 'linear-badge-destructive';
      case 'at_risk': return 'linear-badge-warning';
      default: return 'linear-badge-secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Summary */}
      <Card className="linear-insight-panel">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Construction Insights - {projectData.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-accent/50 border border-border rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground">
              <strong>Project Status:</strong> {projectData.name} is {projectData.progressPercent}% complete and {projectData.status === 'on_track' ? 'on track' : projectData.daysAheadBehind > 0 ? `${projectData.daysAheadBehind} days ahead` : `${Math.abs(projectData.daysAheadBehind)} days behind`}. 
              Budget utilization is {((projectData.budgetSpent / projectData.budgetTotal) * 100).toFixed(1)}% with {projectData.changeOrders} change orders totaling {formatCurrency(projectData.changeOrderValue)}. 
              Safety metrics show {projectData.safetyIncidents} incidents with productivity at {projectData.productivity}%.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Badge className={projectData.overdueRFIs > 0 ? "linear-badge-destructive" : "linear-badge-secondary"}>
                {projectData.overdueRFIs > 0 ? "High Priority" : "Normal"}
              </Badge>
              <div>
                <h4 className="font-medium text-foreground">{projectData.overdueRFIs} Overdue RFIs</h4>
                <p className="text-sm text-muted-foreground">
                  {projectData.openRFIs} total RFIs - resolving overdue items critical for schedule
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className={projectData.productivity >= 90 ? "linear-badge-success" : "linear-badge-default"}>
                {projectData.productivity >= 90 ? "Success" : "Monitor"}
              </Badge>
              <div>
                <h4 className="font-medium text-foreground">Productivity at {projectData.productivity}%</h4>
                <p className="text-sm text-muted-foreground">
                  {projectData.workforce} workers on site with {projectData.weatherDelays} weather delays
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className={projectData.qualityMetrics.defectRate <= 2.5 ? "linear-badge-success" : "linear-badge-default"}>
                {projectData.qualityMetrics.defectRate <= 2.5 ? "Success" : "Monitor"}
              </Badge>
              <div>
                <h4 className="font-medium text-foreground">Quality Score</h4>
                <p className="text-sm text-muted-foreground">
                  {projectData.qualityMetrics.defectRate}% defect rate, {projectData.qualityMetrics.inspectionPass}% pass rate
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="linear-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="linear-kpi-label">Project Budget</p>
                <p className="linear-kpi-value text-green-700">{formatCurrency(projectData.budgetTotal)}</p>
                <p className="linear-kpi-trend text-green-600">{formatCurrency(projectData.budgetSpent)} spent</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={(projectData.budgetSpent / projectData.budgetTotal) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="linear-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="linear-kpi-label">Progress</p>
                <p className="linear-kpi-value text-blue-700">{projectData.progressPercent}%</p>
                <p className="linear-kpi-trend text-blue-600">Due: {projectData.dueDate}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={projectData.progressPercent} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="linear-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="linear-kpi-label">Workforce</p>
                <p className="linear-kpi-value text-purple-700">{projectData.workforce}</p>
                <p className="linear-kpi-trend text-purple-600">{projectData.productivity}% productivity</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="linear-kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="linear-kpi-label">Safety Score</p>
                <p className="linear-kpi-value text-orange-700">{projectData.safetyIncidents}</p>
                <p className="linear-kpi-trend text-orange-600">incidents this quarter</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Construction Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Construction Phase Progress */}
        <Card className="linear-chart-container">
          <CardHeader>
            <CardTitle className="linear-chart-title">
              <Wrench className="h-5 w-5 text-blue-600" />
              Construction Phase Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData.constructionProgress} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="phase" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value, name) => [`${value}%`, name === 'planned' ? 'Planned' : 'Actual']}
                />
                <Bar dataKey="planned" fill="hsl(var(--muted))" name="Planned" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actual" fill="hsl(var(--primary))" name="Actual" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Material Delivery Trends */}
        <Card className="linear-chart-container">
          <CardHeader>
            <CardTitle className="linear-chart-title">
              <Calendar className="h-5 w-5 text-green-600" />
              Material Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectData.materialDeliveries}>
                <defs>
                  <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Area type="monotone" dataKey="planned" stroke="#10b981" fillOpacity={0.6} fill="url(#plannedGradient)" />
                <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fillOpacity={0.6} fill="url(#actualGradient)" />
                <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Safety Trends */}
      <Card className="linear-chart-container">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <Shield className="h-5 w-5 text-orange-600" />
            Safety Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectData.safetyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} name="Incidents" />
              <Line type="monotone" dataKey="nearMiss" stroke="#f59e0b" strokeWidth={3} name="Near Miss" />
              <Line type="monotone" dataKey="training" stroke="#10b981" strokeWidth={3} name="Training Hours" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quality Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="linear-kpi-card">
          <CardContent className="p-4 text-center">
            <div className="linear-kpi-value text-red-700">{projectData.qualityMetrics.defectRate}%</div>
            <p className="linear-kpi-label">Defect Rate</p>
            <p className="text-xs text-muted-foreground mt-1">Target: &lt;2.5%</p>
          </CardContent>
        </Card>
        
        <Card className="linear-kpi-card">
          <CardContent className="p-4 text-center">
            <div className="linear-kpi-value text-yellow-700">{projectData.qualityMetrics.reworkHours}</div>
            <p className="linear-kpi-label">Rework Hours</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        
        <Card className="linear-kpi-card">
          <CardContent className="p-4 text-center">
            <div className="linear-kpi-value text-green-700">{projectData.qualityMetrics.inspectionPass}%</div>
            <p className="linear-kpi-label">Inspection Pass</p>
            <p className="text-xs text-muted-foreground mt-1">First time right</p>
          </CardContent>
        </Card>
        
        <Card className="linear-kpi-card">
          <CardContent className="p-4 text-center">
            <div className="linear-kpi-value text-blue-700">{projectData.qualityMetrics.punchListItems}</div>
            <p className="linear-kpi-label">Open Punch Items</p>
            <p className="text-xs text-muted-foreground mt-1">Pending completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents & Critical Items */}
      <Card className="linear-card">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <FileText className="h-5 w-5" />
            Critical Documents & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Overdue Items</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-red-600">RFI #456 - MEP Coordination</span>
                    <span className="text-sm text-muted-foreground">{projectData.name} • Opened 3 days ago</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-amber-600">Submittal #789 - Elevator specs</span>
                    <span className="text-sm text-muted-foreground">{projectData.name} • Pending approval</span>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Today's Reports</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-foreground">Daily Field Report - {projectData.name}</span>
                    <span className="text-sm text-muted-foreground">Updated 1 hour ago</span>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-foreground">Weekly Safety Report</span>
                    <span className="text-sm text-muted-foreground">Generated this morning</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionDashboard;
