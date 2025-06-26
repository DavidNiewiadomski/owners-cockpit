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
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Safety Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {project.name} • Safety Monitoring & Compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <Shield className="w-4 h-4 mr-2" />
            {safetyMetrics.recordableDays} Days Safe
          </Badge>
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            {safetyMetrics.complianceScore}% Compliance
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-red-600 hover:bg-red-700 text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <FileText className="w-4 h-4 mr-2" />
              Schedule Inspection
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Users className="w-4 h-4 mr-2" />
              Safety Training
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Calendar className="w-4 h-4 mr-2" />
              Emergency Drill
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Award className="w-4 h-4 mr-2" />
              View Certifications
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <TrendingUp className="w-4 h-4 mr-2" />
              Safety Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Safety KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days Without Incident */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Days Without Incident</CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{safetyMetrics.recordableDays}</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+15 days from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Incident Rate */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Incident Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{safetyMetrics.incidentRate}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">per 100 workers</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">-20% vs industry avg</span>
            </div>
          </CardContent>
        </Card>

        {/* Training Completion */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Training Completion</CardTitle>
            <Award className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{safetyMetrics.safetyTraining}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">workforce certified</div>
            <Progress value={safetyMetrics.safetyTraining} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* OSHA Compliance */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">OSHA Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{safetyMetrics.complianceScore}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{safetyMetrics.violations} violations</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+2% this quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Safety Trends Chart */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <HardHat className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Training Completion Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingData.map((training, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{training.category}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {training.completed}/{training.total}
                    </span>
                  </div>
                  <Progress 
                    value={(training.completed / training.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Categories and Inspection Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Safety Categories Pie Chart */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Safety Activities */}
        <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Recent Safety Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'inspection', title: 'Weekly Safety Inspection - Floor 8', time: '2 hours ago', status: 'completed' },
                { type: 'training', title: 'Fall Protection Training Session', time: '1 day ago', status: 'completed' },
                { type: 'incident', title: 'Near Miss Report - Crane Operation', time: '2 days ago', status: 'resolved' },
                { type: 'meeting', title: 'Daily Safety Briefing', time: '1 day ago', status: 'completed' },
                { type: 'drill', title: 'Emergency Evacuation Drill', time: '3 days ago', status: 'completed' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'incident' ? 'bg-orange-500' :
                    activity.type === 'training' ? 'bg-purple-500' :
                    activity.type === 'inspection' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{activity.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</div>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Panel */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Safety Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Excellent Safety Record</span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                No major incidents in {safetyMetrics.recordableDays} days
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{safetyMetrics.totalWorkers}</div>
                <div className="text-gray-600 dark:text-gray-400">Total Workers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{safetyMetrics.certifiedWorkers}</div>
                <div className="text-gray-600 dark:text-gray-400">Certified</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{safetyMetrics.inspections}</div>
                <div className="text-gray-600 dark:text-gray-400">Inspections</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{safetyMetrics.emergencyDrills}</div>
                <div className="text-gray-600 dark:text-gray-400">Emergency Drills</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyDashboard;
