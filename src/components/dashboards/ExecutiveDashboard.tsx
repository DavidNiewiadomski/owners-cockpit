import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, MessageSquare, AlertTriangle, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';

interface ExecutiveDashboardProps {
  projectId: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ projectId }) => {
  // Project-specific data based on projectId
  const getProjectData = (id: string) => {
    const projectsData = {
      'lotus': {
        name: 'Project Lotus',
        totalBudget: 25000000,
        spentBudget: 17000000,
        progress: 68,
        timeline: 'On Track',
        roi: 16.8,
        riskScore: 25,
        stakeholders: 24,
        milestonesCompleted: 8,
        totalMilestones: 12,
        monthlySpend: [
          { month: 'Jan', budget: 2100000, actual: 1950000, forecast: 2000000 },
          { month: 'Feb', budget: 2100000, actual: 2250000, forecast: 2200000 },
          { month: 'Mar', budget: 2100000, actual: 2050000, forecast: 2100000 },
          { month: 'Apr', budget: 2100000, actual: 2180000, forecast: 2150000 },
          { month: 'May', budget: 2100000, actual: 2020000, forecast: 2080000 },
          { month: 'Jun', budget: 2100000, actual: 2200000, forecast: 2180000 }
        ],
        riskBreakdown: [
          { category: 'Technical', value: 35, color: '#3b82f6' },
          { category: 'Financial', value: 20, color: '#10b981' },
          { category: 'Schedule', value: 30, color: '#f59e0b' },
          { category: 'External', value: 15, color: '#ef4444' }
        ],
        kpiTrends: [
          { week: 'W1', efficiency: 78, quality: 92, safety: 98 },
          { week: 'W2', efficiency: 82, quality: 89, safety: 97 },
          { week: 'W3', efficiency: 85, quality: 94, safety: 99 },
          { week: 'W4', efficiency: 88, quality: 96, safety: 98 }
        ]
      },
      'portfolio': {
        name: 'Portfolio Overview',
        totalBudget: 75000000,
        spentBudget: 56250000,
        progress: 72,
        timeline: 'Mixed',
        roi: 14.2,
        riskScore: 35,
        stakeholders: 68,
        milestonesCompleted: 28,
        totalMilestones: 42,
        monthlySpend: [
          { month: 'Jan', budget: 6300000, actual: 5850000, forecast: 6000000 },
          { month: 'Feb', budget: 6300000, actual: 6750000, forecast: 6600000 },
          { month: 'Mar', budget: 6300000, actual: 6150000, forecast: 6300000 },
          { month: 'Apr', budget: 6300000, actual: 6540000, forecast: 6450000 },
          { month: 'May', budget: 6300000, actual: 6060000, forecast: 6240000 },
          { month: 'Jun', budget: 6300000, actual: 6600000, forecast: 6540000 }
        ],
        riskBreakdown: [
          { category: 'Technical', value: 28, color: '#3b82f6' },
          { category: 'Financial', value: 32, color: '#10b981' },
          { category: 'Schedule', value: 25, color: '#f59e0b' },
          { category: 'External', value: 15, color: '#ef4444' }
        ],
        kpiTrends: [
          { week: 'W1', efficiency: 74, quality: 88, safety: 96 },
          { week: 'W2', efficiency: 78, quality: 91, safety: 95 },
          { week: 'W3', efficiency: 81, quality: 89, safety: 97 },
          { week: 'W4', efficiency: 79, quality: 92, safety: 96 }
        ]
      }
    };
    return projectsData[id as keyof typeof projectsData] || projectsData.lotus;
  };

  const projectData = getProjectData(projectId);

  const handleInsightClick = (insight: string) => {
    console.log('Opening chat with insight:', insight);
  };

  const getRiskColor = (score: number) => {
    if (score <= 25) return 'text-green-600';
    if (score <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="linear-insight-panel">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Executive Insights - {projectData.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-accent/50"
              onClick={() => handleInsightClick("Project Performance Analysis")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="destructive" className="mt-0.5">High Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Project Performance Analysis</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projectData.name} is at {projectData.progress}% completion with {((projectData.spentBudget / projectData.totalBudget) * 100).toFixed(1)}% budget utilization. 
                    Risk score is {projectData.riskScore}/100 - {projectData.riskScore <= 25 ? 'Low Risk' : projectData.riskScore <= 50 ? 'Medium Risk' : 'High Risk'}.
                  </p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-accent/50"
              onClick={() => handleInsightClick("Financial Forecast")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="default" className="mt-0.5">Medium Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Financial Forecast</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current burn rate suggests completion within budget. ROI projected at {projectData.roi}% - exceeding target by {(projectData.roi - 12).toFixed(1)}%.
                  </p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-accent/50"
              onClick={() => handleInsightClick("Milestone Achievement")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="secondary" className="mt-0.5">Success</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Milestone Achievement</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projectData.milestonesCompleted} of {projectData.totalMilestones} milestones completed. 
                    Team performance trending upward with {projectData.stakeholders} active stakeholders.
                  </p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="linear-kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="linear-kpi-label">Project Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="linear-kpi-value text-green-700">
              ${(projectData.totalBudget / 1000000).toFixed(1)}M
            </div>
            <p className="linear-kpi-trend text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{projectData.roi}% ROI projected
            </p>
          </CardContent>
        </Card>

        <Card className="linear-kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="linear-kpi-label">Budget Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="linear-kpi-value text-blue-700">
              {Math.round((projectData.spentBudget / projectData.totalBudget) * 100)}%
            </div>
            <div className="mt-2">
              <Progress value={(projectData.spentBudget / projectData.totalBudget) * 100} className="h-2" />
            </div>
            <p className="linear-kpi-trend text-blue-600 mt-2">
              ${(projectData.spentBudget / 1000000).toFixed(1)}M utilized
            </p>
          </CardContent>
        </Card>

        <Card className="linear-kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="linear-kpi-label">Progress Status</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="linear-kpi-value text-purple-700">{projectData.progress}%</div>
            <div className="mt-2">
              <Progress value={projectData.progress} className="h-2" />
            </div>
            <p className="linear-kpi-trend text-purple-600 mt-2">
              {projectData.timeline} - {projectData.milestonesCompleted}/{projectData.totalMilestones} milestones
            </p>
          </CardContent>
        </Card>

        <Card className="linear-kpi-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="linear-kpi-label">Risk Assessment</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className={`linear-kpi-value ${getRiskColor(projectData.riskScore)}`}>
              {projectData.riskScore}/100
            </div>
            <div className="mt-2">
              <Progress value={projectData.riskScore} className="h-2" />
            </div>
            <p className="linear-kpi-trend text-orange-600 mt-2">
              {projectData.stakeholders} stakeholders monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Performance with Forecast */}
        <Card className="linear-chart-container">
          <CardHeader>
            <CardTitle className="linear-chart-title">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Financial Performance & Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectData.monthlySpend}>
                <defs>
                  <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value: any, name: string) => [
                    `$${(value / 1000000).toFixed(1)}M`,
                    name === 'budget' ? 'Budget' : name === 'actual' ? 'Actual' : 'Forecast'
                  ]}
                />
                <Area type="monotone" dataKey="budget" stroke="hsl(var(--primary))" fillOpacity={0.6} fill="url(#budgetGradient)" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" fillOpacity={0.6} fill="url(#actualGradient)" />
                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution Radar */}
        <Card className="linear-chart-container">
          <CardHeader>
            <CardTitle className="linear-chart-title">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Risk Distribution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={projectData.riskBreakdown}>
                <RadialBar dataKey="value" cornerRadius={10} fill="hsl(var(--primary))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {projectData.riskBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium text-foreground">{item.category}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Trends */}
      <Card className="linear-chart-container">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Performance Trends (Last 4 Weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectData.kpiTrends}>
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
              <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="safety" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;
