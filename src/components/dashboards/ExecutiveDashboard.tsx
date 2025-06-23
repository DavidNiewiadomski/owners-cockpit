
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, MessageSquare } from 'lucide-react';
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

  const handleInsightClick = (insight: string) => {
    // This would open the chat window with the insight as context
    console.log('Opening chat with insight:', insight);
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground flex items-center justify-between">
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Office Complex A Budget Alert")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="destructive" className="mt-0.5">High</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Office Complex A Budget Alert</h4>
                  <p className="text-xs text-muted-foreground mt-1">Project is 75% complete but has used 83% of budget. Recommend immediate cost review.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Q3 Portfolio Performance")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="default" className="mt-0.5">Medium</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Q3 Portfolio Performance</h4>
                  <p className="text-xs text-muted-foreground mt-1">6 of 8 active projects are on schedule. Overall portfolio ROI projected at 14.2%.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Sustainability Investment")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="secondary" className="mt-0.5">Opportunity</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Sustainability Investment</h4>
                  <p className="text-xs text-muted-foreground mt-1">Solar installation across 3 properties could reduce operational costs by $180K annually.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${(portfolioMetrics.totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{Math.round((portfolioMetrics.spentBudget / portfolioMetrics.totalBudget) * 100)}%</div>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ${(portfolioMetrics.spentBudget / 1000000).toFixed(1)}M spent
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{portfolioMetrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioMetrics.onTimeProjects} on schedule
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{portfolioMetrics.scheduledCompletion}</div>
            <p className="text-xs text-muted-foreground">
              Expected completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Project Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any, name: string) => [
                    `$${(value / 1000000).toFixed(1)}M`,
                    name === 'budget' ? 'Budget' : 'Spent'
                  ]}
                />
                <Bar dataKey="budget" fill="#e5e7eb" name="Budget" radius={[2, 2, 0, 0]} />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  dataKey="value"
                  label={({ category, value }) => `${category}: ${value}`}
                  labelLine={false}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
