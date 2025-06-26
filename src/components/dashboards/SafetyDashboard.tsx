import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  AlertCircle,
  Eye,
  HardHat,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart, 
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

interface SafetyDashboardProps {
  projectId: string;
}

const SafetyDashboard: React.FC<SafetyDashboardProps> = ({ projectId }) => {
  const project = luxuryOfficeProject;

  // Enhanced safety metrics with more comprehensive data
  const safetyMetrics = {
    recordableDays: 450,
    incidentRate: 0.8,
    nearMisses: 12,
    safetyTraining: 98,
    complianceScore: 94,
    lastIncident: '2024-04-15',
    inspections: 45,
    violations: 0,
    totalWorkers: 85,
    certifiedWorkers: 82,
    safetyMeetings: 24,
    emergencyDrills: 6
  };

  // Safety incidents trend data
  const incidentTrends = [
    { month: 'Jan', incidents: 2, nearMisses: 5, trainingHours: 120 },
    { month: 'Feb', incidents: 1, nearMisses: 3, trainingHours: 95 },
    { month: 'Mar', incidents: 0, nearMisses: 4, trainingHours: 110 },
    { month: 'Apr', incidents: 1, nearMisses: 2, trainingHours: 130 },
    { month: 'May', incidents: 0, nearMisses: 1, trainingHours: 140 },
    { month: 'Jun', incidents: 0, nearMisses: 2, trainingHours: 115 }
  ];

  // Safety category breakdown
  const safetyCategories = [
    { name: 'Fall Protection', value: 35, color: '#22c55e' },
    { name: 'Equipment Safety', value: 25, color: '#3b82f6' },
    { name: 'Fire Safety', value: 20, color: '#f59e0b' },
    { name: 'Chemical Safety', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ];

  // Training completion data
  const trainingData = [
    { category: 'Fall Protection', completed: 98, total: 100 },
    { category: 'OSHA 30', completed: 95, total: 100 },
    { category: 'First Aid/CPR', completed: 88, total: 100 },
    { category: 'Equipment Operation', completed: 92, total: 100 },
    { category: 'Emergency Response', completed: 100, total: 100 }
  ];

  // Inspection results
  const inspectionResults = [
    { week: 'Week 1', score: 95, issues: 2 },
    { week: 'Week 2', score: 98, issues: 1 },
    { week: 'Week 3', score: 92, issues: 3 },
    { week: 'Week 4', score: 97, issues: 1 },
    { week: 'Week 5', score: 100, issues: 0 },
    { week: 'Week 6', score: 96, issues: 2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Safety Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            {project.name} • Safety Monitoring & Compliance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            {safetyMetrics.recordableDays} Days Safe
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-sm">
            {safetyMetrics.complianceScore}% Compliance
          </Badge>
        </div>
      </div>

      {/* Key Safety KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Days Without Incident */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Days Without Incident</CardTitle>
            <Shield className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{safetyMetrics.recordableDays}</div>
            <div className="flex items-center mt-2 text-green-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+15 days from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Incident Rate */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Incident Rate</CardTitle>
            <AlertTriangle className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{safetyMetrics.incidentRate}</div>
            <div className="text-sm text-blue-100 mt-1">per 100 workers</div>
            <div className="flex items-center mt-2 text-blue-100">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">-20% vs industry avg</span>
            </div>
          </CardContent>
        </Card>

        {/* Training Completion */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Training Completion</CardTitle>
            <Award className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{safetyMetrics.safetyTraining}%</div>
            <div className="text-sm text-purple-100 mt-1">workforce certified</div>
            <Progress value={safetyMetrics.safetyTraining} className="mt-3 bg-white/20" />
          </CardContent>
        </Card>

        {/* OSHA Compliance */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">OSHA Compliance</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{safetyMetrics.complianceScore}%</div>
            <div className="text-sm text-orange-100 mt-1">{safetyMetrics.violations} violations</div>
            <div className="flex items-center mt-2 text-orange-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+2% this quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Safety Trends Chart */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="h-6 w-6 text-blue-600" />
              Safety Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={incidentTrends}>
                <defs>
                  <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="nearMissGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm" />
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
                  dataKey="incidents" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#incidentGradient)" 
                  name="Incidents"
                />
                <Area 
                  type="monotone" 
                  dataKey="nearMisses" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#nearMissGradient)" 
                  name="Near Misses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training Progress */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HardHat className="h-6 w-6 text-purple-600" />
              Training Completion Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingData.map((training, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{training.category}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {training.completed}/{training.total}
                    </span>
                  </div>
                  <Progress 
                    value={(training.completed / training.total) * 100} 
                    className="h-3"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Categories and Inspection Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Safety Categories Pie Chart */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Eye className="h-6 w-6 text-green-600" />
              Safety Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={safetyCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {safetyCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inspection Results */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-blue-600" />
              Weekly Inspection Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inspectionResults}>
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
                <Bar 
                  dataKey="score" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]}
                  name="Score"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Safety Activities */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-6 w-6 text-orange-600" />
              Recent Safety Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'inspection', title: 'Weekly Safety Inspection - Floor 8', time: '2 hours ago', status: 'completed' },
                { type: 'training', title: 'Fall Protection Training Session', time: '1 day ago', status: 'completed' },
                { type: 'incident', title: 'Near Miss Report - Crane Operation', time: '2 days ago', status: 'resolved' },
                { type: 'meeting', title: 'Daily Safety Briefing', time: '1 day ago', status: 'completed' },
                { type: 'drill', title: 'Emergency Evacuation Drill', time: '3 days ago', status: 'completed' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'incident' ? 'bg-orange-500' :
                    activity.type === 'training' ? 'bg-purple-500' :
                    activity.type === 'inspection' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{activity.time}</div>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Schedule Inspection
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Safety Training
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Emergency Drill
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Award className="w-4 h-4 mr-2" />
              View Certifications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Safety Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyDashboard;
