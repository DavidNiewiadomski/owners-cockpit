
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ExecutiveDashboardProps {
  projectId: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ projectId }) => {
  // Mock data - in real implementation, this would come from API
  const portfolioMetrics = {
    totalProjects: 12,
    activeProjects: 8,
    totalBudget: 15000000,
    spentBudget: 11250000,
    onTimeProjects: 6,
    scheduledCompletion: '2024-Q3'
  };

  const projectData = [
    { name: 'Office Complex A', budget: 2500000, spent: 1875000, progress: 75 },
    { name: 'Retail Center B', budget: 1800000, spent: 1260000, progress: 70 },
    { name: 'Mixed Use C', budget: 3200000, spent: 2240000, progress: 65 },
    { name: 'Warehouse D', budget: 1500000, spent: 1200000, progress: 80 }
  ];

  const riskData = [
    { category: 'Schedule', value: 3, color: '#f59e0b' },
    { category: 'Budget', value: 2, color: '#ef4444' },
    { category: 'Safety', value: 1, color: '#10b981' },
    { category: 'Quality', value: 2, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(portfolioMetrics.totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last quarter
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((portfolioMetrics.spentBudget / portfolioMetrics.totalBudget) * 100)}%</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              ${(portfolioMetrics.spentBudget / 1000000).toFixed(1)}M spent of ${(portfolioMetrics.totalBudget / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioMetrics.onTimeProjects} on schedule
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioMetrics.scheduledCompletion}</div>
            <p className="text-xs text-muted-foreground">
              Expected completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${(value as number / 1000000).toFixed(1)}M`, '']} />
                <Bar dataKey="budget" fill="#e2e8f0" name="Budget" />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ category, value }) => `${category}: ${value}`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive">High Priority</Badge>
              <div>
                <h4 className="font-medium">Office Complex A Budget Alert</h4>
                <p className="text-sm text-muted-foreground">Project is 75% complete but has used 83% of budget. Recommend immediate cost review.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Medium Priority</Badge>
              <div>
                <h4 className="font-medium">Q3 Portfolio Performance</h4>
                <p className="text-sm text-muted-foreground">6 of 8 active projects are on schedule. Overall portfolio ROI projected at 14.2%.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Opportunity</Badge>
              <div>
                <h4 className="font-medium">Sustainability Investment</h4>
                <p className="text-sm text-muted-foreground">Solar installation across 3 properties could reduce operational costs by $180K annually.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;
