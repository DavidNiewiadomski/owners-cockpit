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
import { usePreconstructionMetrics } from '@/hooks/usePreconstructionMetrics';

interface PreconstructionDashboardProps {
  projectId: string;
  activeCategory: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  const { data: preconstructionData, error, loading } = usePreconstructionMetrics(projectId);
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  if (error) {
    console.error('Error fetching preconstruction metrics:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading preconstruction data</div>
      </div>
    );
  }

  if (loading || !preconstructionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading preconstruction data...</div>
      </div>
    );
  }

  const {
    project,
    keyMetrics,
    budgetBreakdown,
    permitStatus,
    biddingData,
    scheduleMilestones,
    costTrends
  } = preconstructionData;

  // Enhanced preconstruction metrics from Supabase data
  const preconstructionMetrics = {
    totalBudget: project.budget,
    softCosts: budgetBreakdown.find(b => b.category === 'Soft Costs')?.allocated || 0,
    hardCosts: budgetBreakdown.find(b => b.category === 'Hard Costs')?.allocated || 0,
    contingency: budgetBreakdown.find(b => b.category === 'Contingency')?.allocated || 0,
    designProgress: keyMetrics.designCompletion,
    permitsApproved: permitStatus.filter(p => p.status === 'approved').length,
    totalPermits: permitStatus.length,
    bidsReceived: biddingData.totalBids,
    bidsEvaluated: biddingData.bids.filter(b => b.status === 'evaluated').length,
    contractorsPrequalified: biddingData.bids.length,
    scheduleVariance: scheduleMilestones.reduce((acc, m) => acc + m.daysVariance, 0) / scheduleMilestones.length,
    budgetVariance: ((project.budget - budgetBreakdown.reduce((acc, b) => acc + b.spent, 0)) / project.budget) * 100
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
        return 'bg-[#0D1117] text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <ClipboardList className="w-4 h-4 mr-2" />
            {preconstructionMetrics.designProgress}% Design
          </Badge>
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {preconstructionMetrics.permitsApproved}/{preconstructionMetrics.totalPermits} Permits
          </Badge>
        </div>
      </div>

      {/* AI Preconstruction Insights */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <ClipboardList className="w-5 h-5 text-green-400" />
              AI Preconstruction Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{preconstructionMetrics.designProgress}%</div>
              <div className="text-sm text-slate-400">Design Progress</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{preconstructionMetrics.permitsApproved}/{preconstructionMetrics.totalPermits}</div>
              <div className="text-sm text-slate-400">Permits</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{preconstructionMetrics.bidsReceived}</div>
              <div className="text-sm text-slate-400">Bids Received</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{Math.abs(preconstructionMetrics.scheduleVariance)}</div>
              <div className="text-sm text-slate-400">Days Ahead</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-[#0D1117]/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Preconstruction phase at {preconstructionMetrics.designProgress}% design completion with {preconstructionMetrics.permitsApproved} of {preconstructionMetrics.totalPermits} permits approved. Bidding process yielded {preconstructionMetrics.bidsReceived} competitive proposals with {preconstructionMetrics.bidsEvaluated} evaluated. Project running {Math.abs(preconstructionMetrics.scheduleVariance)} days ahead of schedule.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Design development at {preconstructionMetrics.designProgress}% with strong contractor engagement</li>
                <li>• Permit approval rate at {Math.round((preconstructionMetrics.permitsApproved / preconstructionMetrics.totalPermits) * 100)}% indicates smooth regulatory process</li>
                <li>• Bidding competition healthy with {preconstructionMetrics.bidsReceived} proposals from pre-qualified contractors</li>
                <li>• Budget performance within {preconstructionMetrics.budgetVariance}% variance of forecast</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
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
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Calculator className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-blue-600 hover:bg-blue-700 text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Budget
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Submit Permit
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Gavel className="w-4 h-4 mr-2" />
              Review Bids
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Update Schedule
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Users className="w-4 h-4 mr-2" />
              Contractor Meeting
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Risk Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Preconstruction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Budget */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(preconstructionMetrics.totalBudget / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-slate-400 mt-1">project cost estimate</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+{preconstructionMetrics.budgetVariance}% variance</span>
            </div>
          </CardContent>
        </Card>

        {/* Design Progress */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Design Progress</CardTitle>
            <Building className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{preconstructionMetrics.designProgress}%</div>
            <div className="text-xs text-slate-400 mt-1">completion</div>
            <Progress value={preconstructionMetrics.designProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Bidding Status */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Bidding Process</CardTitle>
            <Gavel className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{preconstructionMetrics.bidsReceived}</div>
            <div className="text-xs text-slate-400 mt-1">bids received</div>
            <div className="flex items-center mt-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm">{preconstructionMetrics.bidsEvaluated} evaluated</span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Status */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.abs(preconstructionMetrics.scheduleVariance)}</div>
            <div className="text-xs text-slate-400 mt-1">days ahead</div>
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <PieChart className="h-5 w-5 text-slate-400" />
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <TrendingUp className="h-5 w-5 text-slate-400" />
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Target className="h-5 w-5 text-slate-400" />
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
                       milestone.status === 'nearly-complete' ? `${milestone.progress}%` :
                       milestone.status === 'in-progress' ? `${milestone.progress}%` : 'Upcoming'}
                    </Badge>
                  </div>
                  <Progress value={milestone.progress} className="h-3" />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Start: {milestone.startDate}</span>
                    <span>End: {milestone.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permit Status */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <FileText className="h-5 w-5 text-slate-400" />
              Permit Status Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permitStatus.map((permit, index) => (
                <div key={index} className="p-4 rounded-lg bg-[#0D1117]/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{permit.permit}</span>
                    <Badge className={getStatusColor(permit.status)}>
                      {permit.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Submitted:</span>
                      <span className="font-medium ml-2">{permit.submittedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Expected:</span>
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
        <Card className="lg:col-span-2 bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Gavel className="h-5 w-5 text-slate-400" />
              Contractor Bidding Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biddingData.bids.map((bid, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-[#0D1117]/50">
                  <div className={`w-3 h-3 rounded-full ${
                    bid.status === 'selected' ? 'bg-green-500' :
                    bid.status === 'finalist' ? 'bg-yellow-500' :
                    bid.status === 'evaluated' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{bid.contractor}</div>
                    <div className="text-sm text-slate-400">
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <ClipboardList className="h-5 w-5 text-slate-400" />
              Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0D1117]/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-indigo-300">On Track</span>
              </div>
              <div className="text-sm text-indigo-300">
                {Math.abs(preconstructionMetrics.scheduleVariance)} days ahead of schedule
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-indigo-600">{preconstructionMetrics.designProgress}%</div>
                <div className="text-slate-400">Design Complete</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{preconstructionMetrics.permitsApproved}</div>
                <div className="text-slate-400">Permits Approved</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-cyan-600">{preconstructionMetrics.bidsReceived}</div>
                <div className="text-slate-400">Bids Received</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{preconstructionMetrics.contractorsPrequalified}</div>
                <div className="text-slate-400">Contractors Qualified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreconstructionDashboard;
