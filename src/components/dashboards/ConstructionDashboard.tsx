
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  HardHat, 
  Users, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Truck,
  FileText,
  Clock,
  Target,
  Building,
  BarChart3,
  Activity,
  DollarSign,
  Shield,
  UserCheck,
  Clipboard
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useProjects } from '@/hooks/useProjects';
import {
  useConstructionMetrics,
  useDailyProgress,
  useProjectInsights,
  useProjectTeam,
  useProjectTimeline
} from '@/hooks/useProjectMetrics';
import { getDashboardTitle } from '@/utils/dashboardUtils';

interface ConstructionDashboardProps {
  projectId: string;
  activeCategory: string;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  
  // Fetch all construction data from Supabase
  const { data: constructionMetrics, isLoading: loadingConstruction } = useConstructionMetrics(projectId);
  const { data: dailyProgressData, isLoading: loadingProgress } = useDailyProgress(projectId);
  const { data: insights, isLoading: loadingInsights } = useProjectInsights(projectId);
  const { data: team, isLoading: loadingTeam } = useProjectTeam(projectId);
  const { data: timeline, isLoading: loadingTimeline } = useProjectTimeline(projectId);
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);
  
  // Show loading state if any data is still loading
  const isLoading = loadingConstruction || loadingProgress || loadingInsights || loadingTeam || loadingTimeline;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading construction data...</div>
      </div>
    );
  }
  
  if (!constructionMetrics) {
    return (
      <div className="min-h-screen bg-[#0D1117] p-6 flex items-center justify-center">
        <div className="text-slate-400 text-lg">No construction data available for this project.</div>
      </div>
    );
  }

  // Format construction metrics from database
  const metricsData = {
    overallProgress: constructionMetrics.overall_progress,
    daysAheadBehind: constructionMetrics.days_ahead_behind,
    totalWorkforce: constructionMetrics.total_workforce,
    activeSubcontractors: constructionMetrics.active_subcontractors,
    completedMilestones: constructionMetrics.completed_milestones,
    totalMilestones: constructionMetrics.total_milestones,
    qualityScore: constructionMetrics.quality_score,
    safetyScore: constructionMetrics.safety_score,
    openRFIs: constructionMetrics.open_rfis,
    pendingSubmittals: constructionMetrics.pending_submittals,
    budgetVariance: -2.3,
    scheduleVariance: 1.2,
    activeWorkOrders: 156,
    completedInspections: 89
  };

  // Safety metrics and data
  const safetyMetrics = {
    recordableDays: 287,
    totalIncidents: 2,
    nearMisses: 8,
    safetyTrainingHours: 1240,
    complianceScore: 97,
    oshaRating: 'Excellent',
    lastIncidentDate: '2024-01-15',
    activeSafetyPrograms: 6,
    monthlyInspections: 12,
    correctiveActions: 3
  };

  // Safety incidents and near misses
  const safetyIncidents = [
    {
      id: 1,
      type: 'Near Miss',
      description: 'Tool dropped from height - caught by safety net',
      date: '2024-06-18',
      severity: 'Low',
      status: 'Investigated',
      corrective: 'Reinforced tool tethering protocol'
    },
    {
      id: 2,
      type: 'Minor Injury',
      description: 'Cut finger on metal edge',
      date: '2024-06-10',
      severity: 'Low',
      status: 'Closed',
      corrective: 'Enhanced PPE training, edge guards installed'
    },
    {
      id: 3,
      type: 'Near Miss',
      description: 'Crane load swing too close to workers',
      date: '2024-06-05',
      severity: 'Medium',
      status: 'Closed',
      corrective: 'Revised crane operation procedures'
    }
  ];

  // Safety training progress
  const safetyTraining = [
    { program: 'OSHA 30-Hour', completed: 95, required: 100, deadline: '2024-07-01' },
    { program: 'Fall Protection', completed: 142, required: 145, deadline: '2024-06-30' },
    { program: 'Electrical Safety', completed: 38, required: 45, deadline: '2024-07-15' },
    { program: 'Confined Space', completed: 25, required: 30, deadline: '2024-08-01' }
  ];

  // Daily progress tracking
  const dailyProgress = [
    { date: 'Jun 15', planned: 65, actual: 67, workforce: 142 },
    { date: 'Jun 16', planned: 65.5, actual: 67.2, workforce: 145 },
    { date: 'Jun 17', planned: 66, actual: 67.8, workforce: 148 },
    { date: 'Jun 18', planned: 66.5, actual: 68.1, workforce: 144 },
    { date: 'Jun 19', planned: 67, actual: 68.5, workforce: 149 },
    { date: 'Jun 20', planned: 67.5, actual: 68.8, workforce: 145 },
    { date: 'Jun 21', planned: 68, actual: 69.2, workforce: 152 }
  ];

  // Trade progress by floor
  const tradeProgress = [
    { floor: 'Foundation', structural: 100, mechanical: 95, electrical: 90, plumbing: 85, finishes: 0 },
    { floor: 'Floor 1', structural: 100, mechanical: 88, electrical: 85, plumbing: 80, finishes: 25 },
    { floor: 'Floor 2', structural: 95, mechanical: 82, electrical: 78, plumbing: 75, finishes: 15 },
    { floor: 'Floor 3', structural: 90, mechanical: 75, electrical: 70, plumbing: 65, finishes: 5 },
    { floor: 'Floor 4', structural: 85, mechanical: 60, electrical: 55, plumbing: 50, finishes: 0 },
    { floor: 'Floor 5', structural: 70, mechanical: 40, electrical: 35, plumbing: 30, finishes: 0 }
  ];

  // Recent construction activities
  const recentActivities = [
    {
      id: 1,
      activity: 'Concrete Pour - Floor 4 Slab',
      trade: 'Structural',
      status: 'completed',
      date: '2024-06-20',
      crew: 'Team Alpha',
      duration: '8 hours',
      notes: 'Quality inspection passed'
    },
    {
      id: 2,
      activity: 'HVAC Duct Installation - Floor 3',
      trade: 'Mechanical',
      status: 'in-progress',
      date: '2024-06-19',
      crew: 'HVAC Specialists',
      duration: '12 hours',
      notes: 'On schedule'
    },
    {
      id: 3,
      activity: 'Electrical Rough-in - Floor 2',
      trade: 'Electrical',
      status: 'completed',
      date: '2024-06-18',
      crew: 'Electrical Crew B',
      duration: '10 hours',
      notes: 'Minor cable routing adjustment'
    },
    {
      id: 4,
      activity: 'Plumbing Installation - Floor 3',
      trade: 'Plumbing',
      status: 'scheduled',
      date: '2024-06-22',
      crew: 'Plumbing Team 1',
      duration: '14 hours',
      notes: 'Materials confirmed delivered'
    }
  ];

  // Quality and safety metrics
  const qualityMetrics = [
    { week: 'Week 1', qualityScore: 92, reworkItems: 5, inspectionPass: 94 },
    { week: 'Week 2', qualityScore: 94, reworkItems: 3, inspectionPass: 96 },
    { week: 'Week 3', qualityScore: 91, reworkItems: 7, inspectionPass: 93 },
    { week: 'Week 4', qualityScore: 95, reworkItems: 2, inspectionPass: 98 },
    { week: 'Week 5', qualityScore: 93, reworkItems: 4, inspectionPass: 95 },
    { week: 'Week 6', qualityScore: 96, reworkItems: 1, inspectionPass: 99 }
  ];

  // Material deliveries schedule
  const materialDeliveries = [
    {
      material: 'Steel Beams - Floor 5',
      supplier: 'Metropolitan Steel',
      scheduledDate: '2024-06-24',
      status: 'confirmed',
      quantity: '45 tons',
      cost: 89500
    },
    {
      material: 'Concrete - Floor 4 Pour',
      supplier: 'Ready Mix Corp',
      scheduledDate: '2024-06-22',
      status: 'delivered',
      quantity: '120 cubic yards',
      cost: 18400
    },
    {
      material: 'HVAC Units - Floors 2-3',
      supplier: 'Climate Solutions',
      scheduledDate: '2024-06-26',
      status: 'in-transit',
      quantity: '8 units',
      cost: 125000
    },
    {
      material: 'Electrical Panels',
      supplier: 'Power Systems Inc',
      scheduledDate: '2024-06-23',
      status: 'pending',
      quantity: '12 panels',
      cost: 45200
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
      case 'in-transit':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'scheduled':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-[#0D1117] text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] p-6 space-y-6">
      {/* Construction Header */}
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
            <HardHat className="w-4 h-4 mr-2" />
            {metricsData.overallProgress}% Complete
          </Badge>
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            {Math.abs(metricsData.daysAheadBehind)} Days {metricsData.daysAheadBehind < 0 ? 'Ahead' : 'Behind'}
          </Badge>
        </div>
      </div>

      {/* Owner's Construction Overview */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Activity className="w-5 h-5 text-green-400" />
              Construction Progress & Investment Protection
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Owner Dashboard</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Owner-Focused Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{metricsData.overallProgress}%</div>
                <div className="text-sm text-slate-400">Complete</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{metricsData.safetyScore}%</div>
                <div className="text-sm text-slate-400">Safety Score</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{metricsData.qualityScore}%</div>
                <div className="text-sm text-slate-400">Quality Score</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{Math.abs(metricsData.daysAheadBehind)}</div>
                <div className="text-sm text-slate-400">Days {metricsData.daysAheadBehind < 0 ? 'Ahead' : 'Behind'}</div>
            </div>
          </div>
          
          {/* Owner Summary */}
          <div className="bg-[#0D1117]/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Your construction project is {metricsData.overallProgress}% complete and running {Math.abs(metricsData.daysAheadBehind)} days {metricsData.daysAheadBehind < 0 ? 'ahead of' : 'behind'} schedule. Quality standards are maintained at {metricsData.qualityScore}% with excellent safety performance at {metricsData.safetyScore}%. All contractor teams are performing to specifications.
            </p>
          </div>
          
          {/* Owner Insights and Actions */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Investment Status</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Project {metricsData.overallProgress}% complete with {metricsData.completedMilestones}/{metricsData.totalMilestones} major milestones achieved</li>
                <li>• Contractors maintaining {metricsData.safetyScore}% safety standards - protecting against liability</li>
                <li>• Quality control at {metricsData.qualityScore}% ensures asset value protection</li>
                <li>• {metricsData.openRFIs} open information requests - monitor for potential delays</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Owner Actions Needed</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Schedule walk-through with project manager this week</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Review and approve pending change orders requiring owner sign-off</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Verify contractor insurance and bonding remains current</span>
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
            <Wrench className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-orange-600 hover:bg-orange-700 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Daily Report
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Users className="w-4 h-4 mr-2" />
              Crew Management
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Truck className="w-4 h-4 mr-2" />
              Material Delivery
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety Inspection
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Update
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Quality Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Construction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Overall Progress</CardTitle>
            <Building className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metricsData.overallProgress}%</div>
            <div className="text-xs text-slate-400 mt-1">{metricsData.completedMilestones}/{metricsData.totalMilestones} milestones</div>
            <Progress value={metricsData.overallProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Workforce */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Workforce</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metricsData.totalWorkforce}</div>
            <div className="text-xs text-slate-400 mt-1">{metricsData.activeSubcontractors} subcontractors</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+8% productivity</span>
            </div>
          </CardContent>
        </Card>

        {/* Safety Score */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricsData.safetyScore}%</div>
            <div className="text-xs text-slate-400 mt-1">{safetyMetrics.recordableDays} days without incident</div>
            <div className="flex items-center mt-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm">{safetyMetrics.oshaRating}</span>
            </div>
          </CardContent>
        </Card>

        {/* Open Items */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Open Items</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metricsData.openRFIs + metricsData.pendingSubmittals}</div>
            <div className="text-xs text-slate-400 mt-1">{metricsData.openRFIs} RFIs, {metricsData.pendingSubmittals} submittals</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">-12% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Progress Chart */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Activity className="h-5 w-5 text-slate-400" />
              Daily Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyProgress}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="planned" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0} 
                  name="Planned %"
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#progressGradient)" 
                  name="Actual %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <BarChart3 className="h-5 w-5 text-slate-400" />
              Quality & Inspection Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={qualityMetrics}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="qualityScore" 
                  fill="#f59e0b" 
                  name="Quality Score" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="inspectionPass" 
                  fill="#10b981" 
                  name="Inspection Pass Rate" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trade Progress and Material Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trade Progress by Floor */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Building className="h-5 w-5 text-slate-400" />
              Trade Progress by Floor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tradeProgress.map((floor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{floor.floor}</span>
                    <span className="text-sm text-slate-400">
                      Avg: {Math.round((floor.structural + floor.mechanical + floor.electrical + floor.plumbing + floor.finishes) / 5)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Struct</div>
                      <Progress value={floor.structural} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">{floor.structural}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Mech</div>
                      <Progress value={floor.mechanical} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">{floor.mechanical}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Elec</div>
                      <Progress value={floor.electrical} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">{floor.electrical}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Plumb</div>
                      <Progress value={floor.plumbing} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">{floor.plumbing}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Finish</div>
                      <Progress value={floor.finishes} className="h-2" />
                    <div className="text-xs text-slate-400 mt-1">{floor.finishes}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Deliveries Schedule */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Truck className="h-5 w-5 text-slate-400" />
              Material Deliveries Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materialDeliveries.map((delivery, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{delivery.material}</span>
                    <Badge className={getStatusColor(delivery.status)}>
                      {delivery.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Supplier:</span>
                      <span className="font-medium ml-2">{delivery.supplier}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Date:</span>
                      <span className="font-medium ml-2">{delivery.scheduledDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Quantity:</span>
                      <span className="font-medium ml-2">{delivery.quantity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Cost:</span>
                      <span className="font-medium ml-2">${delivery.cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-white">Safety & Compliance</h2>
        </div>
        
        {/* Safety KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#0D1117] border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Days Without Incident</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{safetyMetrics.recordableDays}</div>
            <div className="text-xs text-slate-400 mt-1">Last incident: {safetyMetrics.lastIncidentDate}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0D1117] border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Compliance Score</CardTitle>
              <Clipboard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{safetyMetrics.complianceScore}%</div>
            <div className="text-xs text-slate-400 mt-1">{safetyMetrics.oshaRating} OSHA rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0D1117] border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Training Hours</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{safetyMetrics.safetyTrainingHours}</div>
            <div className="text-xs text-slate-400 mt-1">This quarter</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0D1117] border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Near Misses</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{safetyMetrics.nearMisses}</div>
            <div className="text-xs text-slate-400 mt-1">All investigated</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Safety Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Safety Incidents */}
          <Card className="bg-[#0D1117] border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Recent Safety Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safetyIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 rounded-lg bg-[#0D1117]/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={incident.type === 'Near Miss' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}>
                        {incident.type}
                      </Badge>
                      <span className="text-sm text-slate-400">{incident.date}</span>
                    </div>
                    <div className="font-medium text-sm mb-1">{incident.description}</div>
                    <div className="text-xs text-slate-400">
                      <strong>Corrective Action:</strong> {incident.corrective}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {incident.severity} Severity
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Safety Training Progress */}
          <Card className="bg-[#0D1117] border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Safety Training Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safetyTraining.map((training, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{training.program}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {training.completed}/{training.required}
                      </span>
                    </div>
                    <Progress value={(training.completed / training.required) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{((training.completed / training.required) * 100).toFixed(1)}% complete</span>
                      <span>Due: {training.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities and Construction Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Construction Activities */}
        <Card className="lg:col-span-2 bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Activity className="h-5 w-5 text-slate-400" />
              Recent Construction Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-[#0D1117]/50">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{activity.activity}</div>
                    <div className="text-sm text-slate-400">
                      {activity.trade} • {activity.crew} • {activity.duration}
                    </div>
                    <div className="text-sm text-slate-400">
                      {activity.notes}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.replace('-', ' ')}
                    </Badge>
                    <div className="text-sm text-slate-400 mt-1">
                      {activity.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Construction Summary */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <HardHat className="h-5 w-5 text-slate-400" />
              Construction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0D1117]/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-300">Ahead of Schedule</span>
              </div>
              <div className="text-sm text-orange-300">
                {Math.abs(metricsData.daysAheadBehind)} days ahead of planned timeline
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-orange-600">{metricsData.overallProgress}%</div>
                <div className="text-slate-400">Complete</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-amber-600">{metricsData.totalWorkforce}</div>
                <div className="text-slate-400">Workers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{metricsData.safetyScore}%</div>
                <div className="text-slate-400">Safety</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{metricsData.activeWorkOrders}</div>
                <div className="text-slate-400">Active Work Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionDashboard;
