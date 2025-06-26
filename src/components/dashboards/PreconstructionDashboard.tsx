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
import { luxuryOfficeProject } from '@/data/sampleProjectData';

interface PreconstructionDashboardProps {
  projectId: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId }) => {
  const project = luxuryOfficeProject;

  // Enhanced preconstruction metrics
  const preconstructionMetrics = {
    totalBudget: 24000000,
    softCosts: 3200000,
    hardCosts: 20800000,
    contingency: 1200000,
    designProgress: 85,
    permitsApproved: 12,
    totalPermits: 15,
    bidsReceived: 8,
    bidsEvaluated: 6,
    contractorsPrequalified: 12,
    scheduleVariance: -5,
    budgetVariance: 2.1
  };

  // Budget breakdown data
  const budgetBreakdown = [
    { category: 'Site Work', estimated: 2400000, actual: 2350000, variance: -2.1 },
    { category: 'Structure', estimated: 8500000, actual: 8750000, variance: 2.9 },
    { category: 'MEP Systems', estimated: 4200000, actual: 4100000, variance: -2.4 },
    { category: 'Finishes', estimated: 3800000, actual: 3900000, variance: 2.6 },
    { category: 'Equipment', estimated: 1900000, actual: 1850000, variance: -2.6 }
  ];

  // Permit status tracking
  const permitStatus = [
    { permit: 'Building Permit', status: 'approved', submittedDate: '2023-10-15', approvalDate: '2024-01-10', cost: 45000 },
    { permit: 'Zoning Variance', status: 'approved', submittedDate: '2023-09-20', approvalDate: '2023-11-15', cost: 12000 },
    { permit: 'Environmental Impact', status: 'approved', submittedDate: '2023-08-30', approvalDate: '2023-10-20', cost: 8500 },
    { permit: 'Fire Department', status: 'pending', submittedDate: '2024-02-15', approvalDate: null, cost: 3500 },
    { permit: 'Utility Connections', status: 'pending', submittedDate: '2024-03-01', approvalDate: null, cost: 15000 },
    { permit: 'Traffic Impact', status: 'in-review', submittedDate: '2024-02-20', approvalDate: null, cost: 7500 }
  ];

  // Bidding process data
  const biddingData = [
    { contractor: 'Premium Builders Inc.', bid: 18500000, score: 95, status: 'selected', experience: 25 },
    { contractor: 'Metro Construction Co.', bid: 19200000, score: 88, status: 'finalist', experience: 18 },
    { contractor: 'Elite Building Corp.', bid: 18950000, score: 92, status: 'finalist', experience: 22 },
    { contractor: 'Downtown Developers', bid: 20100000, score: 82, status: 'evaluated', experience: 15 },
    { contractor: 'City Construction LLC', bid: 19750000, score: 85, status: 'evaluated', experience: 20 },
    { contractor: 'Modern Build Solutions', bid: 21200000, score: 78, status: 'rejected', experience: 12 }
  ];

  // Schedule milestones
  const scheduleMilestones = [
    { phase: 'Site Analysis', progress: 100, startDate: '2023-06-01', endDate: '2023-08-15', status: 'completed' },
    { phase: 'Design Development', progress: 95, startDate: '2023-07-15', endDate: '2024-02-28', status: 'nearly-complete' },
    { phase: 'Permitting', progress: 80, startDate: '2023-09-01', endDate: '2024-04-30', status: 'in-progress' },
    { phase: 'Contractor Selection', progress: 85, startDate: '2024-01-15', endDate: '2024-05-15', status: 'in-progress' },
    { phase: 'Final Design', progress: 60, startDate: '2024-03-01', endDate: '2024-06-30', status: 'in-progress' },
    { phase: 'Construction Start', progress: 0, startDate: '2024-07-15', endDate: '2024-07-15', status: 'upcoming' }
  ];

  // Cost trends over time
  const costTrends = [
    { month: 'Jan', estimate: 22500000, actual: 22650000, variance: 0.7 },
    { month: 'Feb', estimate: 23000000, actual: 23200000, variance: 0.9 },
    { month: 'Mar', estimate: 23200000, actual: 23400000, variance: 0.9 },
    { month: 'Apr', estimate: 23500000, actual: 23650000, variance: 0.6 },
    { month: 'May', estimate: 23800000, actual: 23950000, variance: 0.6 },
    { month: 'Jun', estimate: 24000000, actual: 24050000, variance: 0.2 }
  ];

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
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Preconstruction Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {project.name} • Planning, Bidding & Design Development
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <ClipboardList className="w-4 h-4 mr-2" />
            {preconstructionMetrics.designProgress}% Design Complete
          </Badge>
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            {preconstructionMetrics.permitsApproved}/{preconstructionMetrics.totalPermits} Permits
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <Calculator className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-blue-600 hover:bg-blue-700 text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Budget
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <FileText className="w-4 h-4 mr-2" />
              Submit Permit
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Gavel className="w-4 h-4 mr-2" />
              Review Bids
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Calendar className="w-4 h-4 mr-2" />
              Update Schedule
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Users className="w-4 h-4 mr-2" />
              Contractor Meeting
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Target className="w-4 h-4 mr-2" />
              Risk Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Preconstruction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Budget */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${(preconstructionMetrics.totalBudget / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">project cost estimate</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+{preconstructionMetrics.budgetVariance}% variance</span>
            </div>
          </CardContent>
        </Card>

        {/* Design Progress */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Design Progress</CardTitle>
            <Building className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{preconstructionMetrics.designProgress}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">completion</div>
            <Progress value={preconstructionMetrics.designProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Bidding Status */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Bidding Process</CardTitle>
            <Gavel className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{preconstructionMetrics.bidsReceived}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">bids received</div>
            <div className="flex items-center mt-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm">{preconstructionMetrics.bidsEvaluated} evaluated</span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Status */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.abs(preconstructionMetrics.scheduleVariance)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">days ahead</div>
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <PieChart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
                <Bar dataKey="estimated" fill="#6366f1" name="Estimated" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Trends */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
                  dataKey="estimate" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Estimated"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Start: {milestone.startDate}</span>
                    <span>End: {milestone.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permit Status */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Permit Status Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permitStatus.map((permit, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{permit.permit}</span>
                    <Badge className={getStatusColor(permit.status)}>
                      {permit.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Submitted:</span>
                      <span className="font-medium ml-2">{permit.submittedDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Cost:</span>
                      <span className="font-medium ml-2">${permit.cost.toLocaleString()}</span>
                    </div>
                  </div>
                  {permit.approvalDate && (
                    <div className="text-sm text-green-600 mt-2">
                      ✓ Approved: {permit.approvalDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bidding Process and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contractor Bidding */}
        <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Gavel className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Contractor Bidding Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biddingData.map((bid, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className={`w-3 h-3 rounded-full ${
                    bid.status === 'selected' ? 'bg-green-500' :
                    bid.status === 'finalist' ? 'bg-yellow-500' :
                    bid.status === 'evaluated' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{bid.contractor}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {bid.experience} years experience • Score: {bid.score}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">${(bid.bid / 1000000).toFixed(1)}M</div>
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <ClipboardList className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-indigo-800 dark:text-indigo-200">On Track</span>
              </div>
              <div className="text-sm text-indigo-700 dark:text-indigo-300">
                {Math.abs(preconstructionMetrics.scheduleVariance)} days ahead of schedule
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-indigo-600">{preconstructionMetrics.designProgress}%</div>
                <div className="text-slate-600 dark:text-slate-400">Design Complete</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{preconstructionMetrics.permitsApproved}</div>
                <div className="text-slate-600 dark:text-slate-400">Permits Approved</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-cyan-600">{preconstructionMetrics.bidsReceived}</div>
                <div className="text-slate-600 dark:text-slate-400">Bids Received</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{preconstructionMetrics.contractorsPrequalified}</div>
                <div className="text-slate-600 dark:text-slate-400">Contractors Qualified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreconstructionDashboard;
