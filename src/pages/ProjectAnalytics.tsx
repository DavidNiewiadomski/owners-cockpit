import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  Users,
  Building,
  Target,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  PieChart,
  LineChart as LineChartIcon
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { Progress } from '@/components/ui/progress';

interface ProjectMetrics {
  project: string;
  budget: number;
  spent: number;
  progress: number;
  schedule: 'on-time' | 'delayed' | 'ahead';
  roi: number;
  issues: number;
  safety: number;
}

interface PerformanceTrend {
  month: string;
  budget: number;
  actual: number;
  forecast: number;
  productivity: number;
}

interface KPIMetric {
  metric: string;
  actual: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

const ProjectAnalytics: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');

  // Mock project metrics
  const projectMetrics: ProjectMetrics[] = [
    {
      project: 'Metro Plaza Development',
      budget: 35000000,
      spent: 18500000,
      progress: 52.8,
      schedule: 'on-time',
      roi: 21.4,
      issues: 3,
      safety: 98.5
    },
    {
      project: 'Riverside Commercial Complex',
      budget: 22000000,
      spent: 15000000,
      progress: 68.2,
      schedule: 'delayed',
      roi: 12.7,
      issues: 5,
      safety: 96.2
    },
    {
      project: 'Tech Hub Renovation',
      budget: 12000000,
      spent: 8000000,
      progress: 66.7,
      schedule: 'ahead',
      roi: 10.0,
      issues: 1,
      safety: 99.8
    },
    {
      project: 'Downtown Office Tower',
      budget: 45000000,
      spent: 12000000,
      progress: 26.7,
      schedule: 'on-time',
      roi: 15.2,
      issues: 2,
      safety: 97.5
    }
  ];

  // Mock performance trend data
  const performanceTrends: PerformanceTrend[] = [
    { month: 'Jan', budget: 8500000, actual: 8200000, forecast: 8400000, productivity: 92 },
    { month: 'Feb', budget: 9200000, actual: 8900000, forecast: 9000000, productivity: 94 },
    { month: 'Mar', budget: 10500000, actual: 10200000, forecast: 10300000, productivity: 96 },
    { month: 'Apr', budget: 11800000, actual: 11500000, forecast: 11600000, productivity: 95 },
    { month: 'May', budget: 13200000, actual: 13000000, forecast: 13100000, productivity: 97 },
    { month: 'Jun', budget: 14500000, actual: 14300000, forecast: 14400000, productivity: 98 },
    { month: 'Jul', budget: 16000000, actual: 15800000, forecast: 15900000, productivity: 96 },
    { month: 'Aug', budget: 17500000, actual: 17200000, forecast: 17300000, productivity: 97 }
  ];

  // Mock KPI metrics
  const kpiMetrics: KPIMetric[] = [
    { metric: 'Cost Performance Index', actual: 1.08, target: 1.0, unit: 'ratio', trend: 'up', status: 'good' },
    { metric: 'Schedule Performance', actual: 0.95, target: 1.0, unit: 'ratio', trend: 'down', status: 'warning' },
    { metric: 'Quality Score', actual: 94.5, target: 95.0, unit: '%', trend: 'stable', status: 'warning' },
    { metric: 'Safety Incident Rate', actual: 0.2, target: 0.5, unit: 'per 100k hrs', trend: 'down', status: 'good' },
    { metric: 'Change Order Rate', actual: 8.2, target: 10.0, unit: '%', trend: 'down', status: 'good' },
    { metric: 'Labor Productivity', actual: 96.5, target: 95.0, unit: '%', trend: 'up', status: 'good' }
  ];

  // Calculate portfolio statistics
  const totalBudget = projectMetrics.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projectMetrics.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress = projectMetrics.reduce((sum, p) => sum + p.progress, 0) / projectMetrics.length;
  const avgROI = projectMetrics.reduce((sum, p) => sum + p.roi, 0) / projectMetrics.length;
  const totalIssues = projectMetrics.reduce((sum, p) => sum + p.issues, 0);
  const avgSafety = projectMetrics.reduce((sum, p) => sum + p.safety, 0) / projectMetrics.length;

  // Prepare data for charts
  const budgetUtilization = projectMetrics.map(p => ({
    project: p.project,
    budget: p.budget / 1000000,
    spent: p.spent / 1000000,
    remaining: (p.budget - p.spent) / 1000000
  }));

  const progressComparison = projectMetrics.map(p => ({
    project: p.project,
    progress: p.progress,
    budgetUsed: (p.spent / p.budget) * 100
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getScheduleColor = (schedule: string) => {
    switch (schedule) {
      case 'on-time': return 'bg-green-100 text-green-700';
      case 'ahead': return 'bg-blue-100 text-blue-700';
      case 'delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'warning': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Project Analytics & Insights
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive performance metrics and predictive analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${(totalBudget / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total budget
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Spent to Date</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                ${(totalSpent / 1000000).toFixed(1)}M
              </div>
              <Progress value={(totalSpent / totalBudget) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {avgProgress.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Across all projects
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {avgROI.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Portfolio return
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{totalIssues}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Across portfolio
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Safety Score</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {avgSafety.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Avg compliance
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="kpis">Key Metrics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Project Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectMetrics.map((project, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-foreground text-lg">{project.project}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge className={getScheduleColor(project.schedule)}>
                              {project.schedule}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {project.progress}% complete
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{project.roi}%</div>
                          <div className="text-xs text-muted-foreground">ROI</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Budget</span>
                          <div className="font-medium text-foreground">
                            ${(project.budget / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Spent</span>
                          <div className="font-medium text-foreground">
                            ${(project.spent / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Issues</span>
                          <div className="font-medium text-yellow-400">
                            {project.issues} open
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Safety</span>
                          <div className="font-medium text-green-400">
                            {project.safety}%
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={project.progress} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    Budget vs Actual Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip 
                        formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: 'none',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="budget" fill="#8b5cf6" name="Budget" />
                      <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
                      <Line 
                        type="monotone" 
                        dataKey="forecast" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Forecast"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-muted-foreground" />
                    Productivity Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, '']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: 'none',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="productivity" 
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Productivity %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Budget Utilization by Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetUtilization} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" className="text-sm" tickFormatter={(value) => `$${value}M`} />
                    <YAxis type="category" dataKey="project" className="text-sm" width={150} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(1)}M`, '']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="spent" stackId="a" fill="#ef4444" name="Spent" />
                    <Bar dataKey="remaining" stackId="a" fill="#10b981" name="Remaining" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kpiMetrics.map((kpi, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-foreground">{kpi.metric}</h4>
                        {getStatusIcon(kpi.status)}
                      </div>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold text-foreground">
                            {kpi.actual}{kpi.unit === '%' ? '%' : ''}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Target: {kpi.target}{kpi.unit === '%' ? '%' : ''} {kpi.unit !== '%' && kpi.unit}
                          </div>
                        </div>
                        <Badge className={
                          kpi.status === 'good' ? 'bg-green-100 text-green-700' :
                          kpi.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {kpi.status}
                        </Badge>
                      </div>
                      <Progress 
                        value={Math.min((kpi.actual / kpi.target) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Cost Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Cost Savings YTD</span>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-green-400">$2.3M</div>
                      <div className="text-xs text-muted-foreground">8.2% under budget</div>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Schedule Variance</span>
                        <Activity className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-400">-5 days</div>
                      <div className="text-xs text-muted-foreground">Slightly behind schedule</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Productivity Growth</span>
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-400">+12%</div>
                      <div className="text-xs text-muted-foreground">vs. last quarter</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="font-medium text-foreground mb-2">Completion Forecast</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Based on current performance trends
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Best Case</span>
                          <span className="text-green-400">June 15, 2025</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Most Likely</span>
                          <span className="text-blue-400">June 30, 2025</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Worst Case</span>
                          <span className="text-red-400">July 20, 2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="font-medium text-foreground mb-2">Budget Forecast</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Projected final costs at completion
                      </p>
                      <div className="text-2xl font-bold text-foreground">$112.5M</div>
                      <div className="text-sm text-green-400">$1.5M under budget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Project Progress vs Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={progressComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="project" className="text-sm" angle={-45} textAnchor="end" height={100} />
                    <YAxis className="text-sm" tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="progress" fill="#10b981" name="Progress %" />
                    <Bar dataKey="budgetUsed" fill="#f59e0b" name="Budget Used %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProjectAnalytics;