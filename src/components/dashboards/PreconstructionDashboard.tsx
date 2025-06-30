import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  DollarSign, 
  Calendar, 
  Users, 
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Target,
  Gavel,
  MapPin,
  Calculator,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar,
  LineChart, 
  Line,
  AreaChart, 
  Area,
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import { usePreconstructionMetrics } from '@/hooks/useProjectMetrics';

interface PreconstructionDashboardProps {
  projectId: string;
  activeCategory: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  // Fetch preconstruction metrics from Supabase
  const { data: preconstructionMetrics, error, isLoading } = usePreconstructionMetrics(displayProjectId);
  const loading = isLoading;
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Preconstruction Overview' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  if (error) {
    console.error('Error fetching preconstruction metrics:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading preconstruction data</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-foreground">Loading preconstruction data...</div>
      </div>
    );
  }

  // Use Supabase data if available, otherwise fallback to demo data
  const actualMetrics = preconstructionMetrics || {
    design_development: 75,
    bidding_progress: 60,
    contractor_selection: 40,
    permit_submissions: 80,
    value_engineering: 30
  };

  // Create sample data for demo purposes
  const budgetBreakdown = [
    { category: 'Hard Costs', allocated: 25000000, spent: 12000000 },
    { category: 'Soft Costs', allocated: 8000000, spent: 4500000 },
    { category: 'Contingency', allocated: 2000000, spent: 500000 },
    { category: 'FF&E', allocated: 3000000, spent: 800000 }
  ];

  const permitStatus = [
    { permit: 'Building Permit', status: 'approved', submittedDate: '2024-03-15', expectedApproval: '2024-04-15' },
    { permit: 'Environmental Permit', status: 'pending', submittedDate: '2024-04-01', expectedApproval: '2024-05-01' },
    { permit: 'Zoning Variance', status: 'approved', submittedDate: '2024-02-20', expectedApproval: '2024-03-20' }
  ];

  const biddingData = {
    totalBids: 6,
    bids: [
      { contractor: 'BuildTech Solutions', amount: 28500000, score: 95, status: 'selected', timeline: '18 months' },
      { contractor: 'Premier Construction', amount: 29200000, score: 88, status: 'finalist', timeline: '19 months' },
      { contractor: 'Metro Builders', amount: 30100000, score: 82, status: 'evaluated', timeline: '20 months' }
    ]
  };

  const scheduleMilestones = [
    { phase: 'Design Development', progress: 100, status: 'completed', startDate: '2024-01-15', endDate: '2024-03-30' },
    { phase: 'Permit Applications', progress: 85, status: 'in-progress', startDate: '2024-02-01', endDate: '2024-05-15' },
    { phase: 'Contractor Selection', progress: 60, status: 'in-progress', startDate: '2024-03-15', endDate: '2024-06-30' },
    { phase: 'Value Engineering', progress: 30, status: 'in-progress', startDate: '2024-04-01', endDate: '2024-07-15' }
  ];

  const costTrends = [
    { month: 'Jan', budget: 35000000, forecast: 35200000, actual: 35100000 },
    { month: 'Feb', budget: 35000000, forecast: 35400000, actual: 35250000 },
    { month: 'Mar', budget: 35000000, forecast: 35300000, actual: 35150000 },
    { month: 'Apr', budget: 35000000, forecast: 35500000, actual: 35400000 }
  ];

  // Enhanced preconstruction metrics
  const preconstructionKPIs = {
    totalBudget: 35000000,
    softCosts: 8000000,
    hardCosts: 25000000,
    contingency: 2000000,
    designProgress: actualMetrics.design_development || 75,
    permitsApproved: permitStatus.filter(p => p.status === 'approved').length,
    totalPermits: permitStatus.length,
    bidsReceived: biddingData.totalBids,
    bidsEvaluated: biddingData.bids.filter(b => b.status === 'evaluated').length,
    contractorsPrequalified: biddingData.bids.length,
    scheduleVariance: -5, // Days ahead
    budgetVariance: 2.1 // Percentage over budget
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'selected':
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'in-progress':
      case 'in-review':
      case 'finalist':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-card text-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <ClipboardList className="w-4 h-4 mr-2" />
            {preconstructionKPIs.designProgress}% Design
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {preconstructionKPIs.permitsApproved}/{preconstructionKPIs.totalPermits} Permits
          </Badge>
        </div>
      </div>

      {/* AI Preconstruction Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <ClipboardList className="w-5 h-5 text-green-400" />
              AI Preconstruction Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{preconstructionKPIs.designProgress}%</div>
              <div className="text-sm text-muted-foreground">Design Progress</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{preconstructionKPIs.permitsApproved}/{preconstructionKPIs.totalPermits}</div>
              <div className="text-sm text-muted-foreground">Permits</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{preconstructionKPIs.bidsReceived}</div>
              <div className="text-sm text-muted-foreground">Bids Received</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{Math.abs(preconstructionKPIs.scheduleVariance)}</div>
              <div className="text-sm text-muted-foreground">Days Ahead</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              Preconstruction phase at {preconstructionKPIs.designProgress}% design completion with {preconstructionKPIs.permitsApproved} of {preconstructionKPIs.totalPermits} permits approved. Bidding process yielded {preconstructionKPIs.bidsReceived} competitive proposals with {preconstructionKPIs.bidsEvaluated} evaluated. Project running {Math.abs(preconstructionKPIs.scheduleVariance)} days ahead of schedule.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Design development at {preconstructionKPIs.designProgress}% with strong contractor engagement</li>
                <li>• Permit approval rate at {Math.round((preconstructionKPIs.permitsApproved / preconstructionKPIs.totalPermits) * 100)}% indicates smooth regulatory process</li>
                <li>• Bidding competition healthy with {preconstructionKPIs.bidsReceived} proposals from pre-qualified contractors</li>
                <li>• Budget performance within {preconstructionKPIs.budgetVariance}% variance of forecast</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Finalize contractor selection to maintain schedule advantage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Expedite remaining permit applications to avoid delays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Lock in material pricing to mitigate supply chain risks</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Calculator className="h-5 w-5 text-muted-foreground" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-blue-600 hover:bg-blue-700 text-foreground">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Budget
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Submit Permit
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Gavel className="w-4 h-4 mr-2" />
              Review Bids
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Update Schedule
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Users className="w-4 h-4 mr-2" />
              Contractor Meeting
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Target className="w-4 h-4 mr-2" />
              Risk Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Preconstruction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Budget */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${(preconstructionKPIs.totalBudget / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground mt-1">project cost estimate</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+{preconstructionKPIs.budgetVariance}% variance</span>
            </div>
          </CardContent>
        </Card>

        {/* Design Progress */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Design Progress</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{preconstructionKPIs.designProgress}%</div>
            <div className="text-xs text-muted-foreground mt-1">completion</div>
            <Progress value={preconstructionKPIs.designProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Bidding Status */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bidding Process</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{preconstructionKPIs.bidsReceived}</div>
            <div className="text-xs text-muted-foreground mt-1">bids received</div>
            <div className="flex items-center mt-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm">{preconstructionKPIs.bidsEvaluated} evaluated</span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Status */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{Math.abs(preconstructionKPIs.scheduleVariance)}</div>
            <div className="text-xs text-muted-foreground mt-1">days ahead</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">On track</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              Budget Breakdown by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" className="text-sm" angle={-45} textAnchor="end" height={60} />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                  formatter={(value) => [`$${(value as number / 1000000).toFixed(1)}M`, 'Amount']}
                />
                <Bar dataKey="allocated" fill="#6366f1" name="Allocated" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Trends */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Cost Estimate Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                  formatter={(value) => [`$${(value as number / 1000000).toFixed(1)}M`, 'Cost']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Budget"
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Forecast"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Milestones and Permit Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule Milestones */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Target className="h-5 w-5 text-muted-foreground" />
              Project Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduleMilestones.map((milestone, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{milestone.phase}</span>
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status === 'completed' ? 'Complete' : 
                       milestone.status === 'nearly-complete' ? `${milestone.progress.toFixed(2)}%` :
                       milestone.status === 'in-progress' ? `${milestone.progress.toFixed(2)}%` : 'Upcoming'}
                    </Badge>
                  </div>
                  <Progress value={milestone.progress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Start: {milestone.startDate}</span>
                    <span>End: {milestone.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permit Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Permit Status Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permitStatus.map((permit, index) => (
                <div key={index} className="p-4 rounded-lg bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{permit.permit}</span>
                    <Badge className={getStatusColor(permit.status)}>
                      {permit.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="font-medium ml-2">{permit.submittedDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected:</span>
                      <span className="font-medium ml-2">{permit.expectedApproval}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bidding Process and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contractor Bidding */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Gavel className="h-5 w-5 text-muted-foreground" />
              Contractor Bidding Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biddingData.bids.map((bid, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-card/50">
                  <div className={`w-3 h-3 rounded-full ${
                    bid.status === 'selected' ? 'bg-green-500' :
                    bid.status === 'finalist' ? 'bg-yellow-500' :
                    bid.status === 'evaluated' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{bid.contractor}</div>
                    <div className="text-sm text-muted-foreground">
                      {bid.timeline} • Score: {bid.score}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${(bid.amount / 1000000).toFixed(1)}M</div>
                    <Badge className={getStatusColor(bid.status)}>
                      {bid.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-indigo-300">On Track</span>
              </div>
              <div className="text-sm text-indigo-300">
                {Math.abs(preconstructionKPIs.scheduleVariance)} days ahead of schedule
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-indigo-600">{preconstructionKPIs.designProgress}%</div>
                <div className="text-muted-foreground">Design Complete</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{preconstructionKPIs.permitsApproved}</div>
                <div className="text-muted-foreground">Permits Approved</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-cyan-600">{preconstructionKPIs.bidsReceived}</div>
                <div className="text-muted-foreground">Bids Received</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{preconstructionKPIs.contractorsPrequalified}</div>
                <div className="text-muted-foreground">Contractors Qualified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreconstructionDashboard;
