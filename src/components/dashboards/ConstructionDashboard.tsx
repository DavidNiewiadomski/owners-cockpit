
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
  DollarSign
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
import { luxuryOfficeProject } from '@/data/sampleProjectData';

interface ConstructionDashboardProps {
  projectId: string;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId }) => {
  const project = luxuryOfficeProject;

  // Enhanced construction metrics
  const constructionMetrics = {
    overallProgress: 68,
    daysAheadBehind: -3,
    totalWorkforce: 145,
    activeSubcontractors: 12,
    completedMilestones: 8,
    totalMilestones: 12,
    qualityScore: 94,
    safetyScore: 97,
    budgetVariance: -2.3,
    scheduleVariance: 1.2,
    openRFIs: 23,
    pendingSubmittals: 8,
    activeWorkOrders: 156,
    completedInspections: 89
  };

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
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950 p-6 space-y-8">
      {/* Construction Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Construction Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            {project.name} • Live Construction Progress & Management
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-4 py-2 text-sm">
            <HardHat className="w-4 h-4 mr-2" />
            {constructionMetrics.overallProgress}% Complete
          </Badge>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-4 py-2 text-sm">
            {Math.abs(constructionMetrics.daysAheadBehind)} Days {constructionMetrics.daysAheadBehind < 0 ? 'Ahead' : 'Behind'}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wrench className="h-6 w-6 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
              <FileText className="w-4 h-4 mr-2" />
              Daily Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Crew Management
            </Button>
            <Button variant="outline" className="justify-start">
              <Truck className="w-4 h-4 mr-2" />
              Material Delivery
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety Inspection
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Update
            </Button>
            <Button variant="outline" className="justify-start">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Quality Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Construction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Overall Progress</CardTitle>
            <Building className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{constructionMetrics.overallProgress}%</div>
            <div className="text-sm text-orange-100 mt-1">{constructionMetrics.completedMilestones}/{constructionMetrics.totalMilestones} milestones</div>
            <Progress value={constructionMetrics.overallProgress} className="mt-3 bg-white/20" />
          </CardContent>
        </Card>

        {/* Workforce */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Active Workforce</CardTitle>
            <Users className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{constructionMetrics.totalWorkforce}</div>
            <div className="text-sm text-amber-100 mt-1">{constructionMetrics.activeSubcontractors} subcontractors</div>
            <div className="flex items-center mt-2 text-amber-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+8% productivity</span>
            </div>
          </CardContent>
        </Card>

        {/* Quality Score */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Quality Score</CardTitle>
            <Target className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{constructionMetrics.qualityScore}%</div>
            <div className="text-sm text-yellow-100 mt-1">{constructionMetrics.completedInspections} inspections passed</div>
            <div className="flex items-center mt-2 text-yellow-100">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm">Above target</span>
            </div>
          </CardContent>
        </Card>

        {/* Open Items */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Open Items</CardTitle>
            <Clock className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{constructionMetrics.openRFIs + constructionMetrics.pendingSubmittals}</div>
            <div className="text-sm text-blue-100 mt-1">{constructionMetrics.openRFIs} RFIs, {constructionMetrics.pendingSubmittals} submittals</div>
            <div className="flex items-center mt-2 text-blue-100">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">-12% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Progress Chart */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-6 w-6 text-orange-600" />
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
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-6 w-6 text-amber-600" />
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
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building className="h-6 w-6 text-yellow-600" />
              Trade Progress by Floor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tradeProgress.map((floor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{floor.floor}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Avg: {Math.round((floor.structural + floor.mechanical + floor.electrical + floor.plumbing + floor.finishes) / 5)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Struct</div>
                      <Progress value={floor.structural} className="h-2" />
                      <div className="text-xs text-slate-600 mt-1">{floor.structural}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Mech</div>
                      <Progress value={floor.mechanical} className="h-2" />
                      <div className="text-xs text-slate-600 mt-1">{floor.mechanical}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Elec</div>
                      <Progress value={floor.electrical} className="h-2" />
                      <div className="text-xs text-slate-600 mt-1">{floor.electrical}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Plumb</div>
                      <Progress value={floor.plumbing} className="h-2" />
                      <div className="text-xs text-slate-600 mt-1">{floor.plumbing}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Finish</div>
                      <Progress value={floor.finishes} className="h-2" />
                      <div className="text-xs text-slate-600 mt-1">{floor.finishes}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Deliveries Schedule */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Truck className="h-6 w-6 text-blue-600" />
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
                      <span className="text-slate-600 dark:text-slate-400">Supplier:</span>
                      <span className="font-medium ml-2">{delivery.supplier}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Date:</span>
                      <span className="font-medium ml-2">{delivery.scheduledDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                      <span className="font-medium ml-2">{delivery.quantity}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Cost:</span>
                      <span className="font-medium ml-2">${delivery.cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Construction Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Construction Activities */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-6 w-6 text-green-600" />
              Recent Construction Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{activity.activity}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.trade} • {activity.crew} • {activity.duration}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.notes}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.replace('-', ' ')}
                    </Badge>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {activity.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Construction Summary */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HardHat className="h-6 w-6 text-orange-600" />
              Construction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-800 dark:text-orange-200">Ahead of Schedule</span>
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                {Math.abs(constructionMetrics.daysAheadBehind)} days ahead of planned timeline
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-orange-600">{constructionMetrics.overallProgress}%</div>
                <div className="text-slate-600 dark:text-slate-400">Complete</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-amber-600">{constructionMetrics.totalWorkforce}</div>
                <div className="text-slate-600 dark:text-slate-400">Workers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-600">{constructionMetrics.qualityScore}%</div>
                <div className="text-slate-600 dark:text-slate-400">Quality</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{constructionMetrics.activeWorkOrders}</div>
                <div className="text-slate-600 dark:text-slate-400">Active Work Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionDashboard;
