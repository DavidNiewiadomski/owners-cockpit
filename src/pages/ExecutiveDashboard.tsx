
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Users, 
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ExecutiveDashboard: React.FC = () => {
  // Mock portfolio data
  const portfolioData = {
    totalBudget: 47500000,
    actualSpent: 35200000,
    plannedSpend: 33800000,
    variance: 4.1,
    activeProjects: 8,
    projectsOnTrack: 5,
    avgDaysDelayed: 12,
    forecastedROI: 14.2,
    actualROI: 12.8
  };

  const projectData = [
    { name: 'Metro Office Tower', budget: 12500000, spent: 9800000, progress: 78, daysDelayed: 0, status: 'on_track' },
    { name: 'Riverside Residential', budget: 8900000, spent: 7200000, progress: 81, daysDelayed: 14, status: 'delayed' },
    { name: 'Tech Campus Phase 2', budget: 15200000, spent: 11500000, progress: 72, daysDelayed: 7, status: 'at_risk' },
    { name: 'Downtown Retail Center', budget: 6800000, spent: 4900000, progress: 68, daysDelayed: 0, status: 'on_track' },
    { name: 'Industrial Warehouse', budget: 4100000, spent: 1800000, progress: 35, daysDelayed: 21, status: 'delayed' }
  ];

  const budgetVarianceData = [
    { project: 'Metro Tower', planned: 9800, actual: 9800, variance: 0 },
    { project: 'Riverside', planned: 7000, actual: 7200, variance: 200 },
    { project: 'Tech Campus', planned: 11200, actual: 11500, variance: 300 },
    { project: 'Retail Center', planned: 4800, actual: 4900, variance: 100 },
    { project: 'Warehouse', planned: 1800, actual: 1800, variance: 0 }
  ];

  const riskData = [
    { category: 'Schedule Risk', value: 3, color: '#f59e0b' },
    { category: 'Budget Risk', value: 2, color: '#ef4444' },
    { category: 'Safety Issues', value: 1, color: '#10b981' },
    { category: 'Legal Claims', value: 0, color: '#6b7280' }
  ];

  const monthlyTrend = [
    { month: 'Jan', planned: 2800, actual: 2600 },
    { month: 'Feb', planned: 5200, actual: 4900 },
    { month: 'Mar', planned: 7800, actual: 7400 },
    { month: 'Apr', planned: 12400, actual: 11800 },
    { month: 'May', planned: 18200, actual: 17500 },
    { month: 'Jun', planned: 24800, actual: 24200 },
    { month: 'Jul', planned: 29400, actual: 28800 },
    { month: 'Aug', planned: 33800, actual: 35200 }
  ];

  const pendingApprovals = [
    { type: 'Change Orders', count: 7, urgency: 'high' },
    { type: 'Budget Revisions', count: 3, urgency: 'medium' },
    { type: 'Contract Amendments', count: 2, urgency: 'high' },
    { type: 'Permit Applications', count: 4, urgency: 'medium' }
  ];

  const recentDocuments = [
    { title: 'Q3 Financial Summary', type: 'Financial Report', date: '2024-08-15' },
    { title: 'Metro Tower Progress Report', type: 'Project Update', date: '2024-08-14' },
    { title: 'Safety Compliance Audit', type: 'Safety Report', date: '2024-08-13' },
    { title: 'Environmental Impact Assessment', type: 'Environmental', date: '2024-08-12' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-600 bg-green-100';
      case 'at_risk': return 'text-yellow-600 bg-yellow-100';
      case 'delayed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return <CheckCircle className="w-4 h-4" />;
      case 'at_risk': return <Clock className="w-4 h-4" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Portfolio Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights across your construction portfolio</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">Live Data</Badge>
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* AI Insight Summary */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-blue-600" />
            AI Portfolio Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            <strong>Portfolio Health:</strong> Overall performance is solid with minor budget overruns. 
            Total spend is $35.2M vs $33.8M planned (4.1% over). Five of eight projects are on schedule. 
            <strong>Key concerns:</strong> Riverside Residential is 14 days behind due to permit delays, and Tech Campus Phase 2 
            needs attention on material procurement. <strong>Recommendation:</strong> Accelerate permit processes 
            for delayed projects and review contractor performance on Tech Campus.
          </p>
        </CardContent>
      </Card>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(portfolioData.totalBudget / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +8.2% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Performance</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">+{portfolioData.variance}%</div>
            <p className="text-xs text-muted-foreground">
              ${((portfolioData.actualSpent - portfolioData.plannedSpend) / 1000000).toFixed(1)}M over planned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects on Track</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.projectsOnTrack}/{portfolioData.activeProjects}</div>
            <div className="mt-2">
              <Progress value={(portfolioData.projectsOnTrack / portfolioData.activeProjects) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.actualROI}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {portfolioData.forecastedROI}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Variance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Performance by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetVarianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, '']} />
                <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
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
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="value"
                  label={({ category, value }) => value > 0 ? `${category}: ${value}` : ''}
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

      {/* Monthly Spend Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spend Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, '']} />
              <Line type="monotone" dataKey="planned" stroke="#e5e7eb" strokeWidth={2} name="Planned" />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectData.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status.replace('_', ' ')}
                  </div>
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600">
                      Budget: ${(project.budget / 1000000).toFixed(1)}M | 
                      Spent: ${(project.spent / 1000000).toFixed(1)}M
                      {project.daysDelayed > 0 && (
                        <span className="text-red-600 ml-2">({project.daysDelayed} days behind)</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{project.progress}%</div>
                  <Progress value={project.progress} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={item.urgency === 'high' ? 'destructive' : 'secondary'}>
                      {item.urgency}
                    </Badge>
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{item.count}</span>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h4 className="font-medium">{doc.title}</h4>
                    <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                  </div>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
