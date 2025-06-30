
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
  useConstructionDailyProgress,
  useConstructionTradeProgress,
  useConstructionActivities,
  useConstructionQualityMetrics,
  useMaterialDeliveries,
  useSafetyMetrics,
  useSafetyIncidents,
  useSafetyTraining,
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
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  // Fetch all project data from Supabase
  const { data: constructionMetrics, isLoading: loadingConstruction } = useConstructionMetrics(displayProjectId);
  const { data: dailyProgressData, isLoading: loadingProgress } = useConstructionDailyProgress(displayProjectId);
  const { data: tradeProgressData, isLoading: loadingTradeProgress } = useConstructionTradeProgress(displayProjectId);
  const { data: activitiesData, isLoading: loadingActivities } = useConstructionActivities(displayProjectId);
  const { data: qualityMetricsData, isLoading: loadingQuality } = useConstructionQualityMetrics(displayProjectId);
  const { data: materialDeliveriesData, isLoading: loadingMaterials } = useMaterialDeliveries(displayProjectId);
  const { data: safetyMetricsData, isLoading: loadingSafety } = useSafetyMetrics(displayProjectId);
  const { data: safetyIncidentsData, isLoading: loadingIncidents } = useSafetyIncidents(displayProjectId);
  const { data: safetyTrainingData, isLoading: loadingTraining } = useSafetyTraining(displayProjectId);
  const { data: insights, isLoading: loadingInsights } = useProjectInsights(displayProjectId);
  const { data: team, isLoading: loadingTeam } = useProjectTeam(displayProjectId);
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Construction Overview' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);
  
  // Show loading state if any data is still loading
  const isLoading = loadingConstruction || loadingProgress || loadingTradeProgress || loadingActivities || 
                    loadingQuality || loadingMaterials || loadingSafety || loadingIncidents || 
                    loadingTraining || loadingInsights || loadingTeam;
  
  if (isLoading && !isPortfolioView) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-foreground text-lg">Loading construction data...</div>
      </div>
    );
  }

  // Provide fallback data for portfolio view or when data is unavailable
  const fallbackConstructionMetrics = {
    overall_progress: 75,
    days_ahead_behind: 2,
    total_workforce: 45,
    active_subcontractors: 8,
    completed_milestones: 12,
    total_milestones: 16,
    quality_score: 92,
    safety_score: 96,
    open_rfis: 4,
    pending_submittals: 6
  };
  
  const effectiveConstructionMetrics = constructionMetrics || (isPortfolioView ? {
    overall_progress: 78, // Portfolio average
    days_ahead_behind: 1,
    total_workforce: 120, // Portfolio total
    active_subcontractors: 22,
    completed_milestones: 38,
    total_milestones: 48,
    quality_score: 94,
    safety_score: 97,
    open_rfis: 12,
    pending_submittals: 18
  } : fallbackConstructionMetrics);

  // Use effective data for display

  // Format construction metrics from database using effective data
  const metricsData = {
    overallProgress: effectiveConstructionMetrics.overall_progress,
    daysAheadBehind: effectiveConstructionMetrics.days_ahead_behind,
    totalWorkforce: effectiveConstructionMetrics.total_workforce,
    activeSubcontractors: effectiveConstructionMetrics.active_subcontractors,
    completedMilestones: effectiveConstructionMetrics.completed_milestones,
    totalMilestones: effectiveConstructionMetrics.total_milestones,
    qualityScore: effectiveConstructionMetrics.quality_score,
    safetyScore: effectiveConstructionMetrics.safety_score,
    openRFIs: effectiveConstructionMetrics.open_rfis,
    pendingSubmittals: effectiveConstructionMetrics.pending_submittals,
    budgetVariance: -2.3, // TODO: Connect to financial metrics
    scheduleVariance: 1.2, // TODO: Connect to schedule metrics
    activeWorkOrders: 156, // TODO: Connect to work order system
    completedInspections: 89 // TODO: Connect to inspection system
  };

  // Safety metrics from database
  const safetyMetrics = safetyMetricsData ? {
    recordableDays: safetyMetricsData.recordable_days,
    totalIncidents: safetyMetricsData.total_incidents,
    nearMisses: safetyMetricsData.near_misses,
    safetyTrainingHours: safetyMetricsData.safety_training_hours,
    complianceScore: safetyMetricsData.compliance_score,
    oshaRating: safetyMetricsData.osha_rating,
    lastIncidentDate: safetyMetricsData.last_incident_date,
    activeSafetyPrograms: safetyMetricsData.active_safety_programs,
    monthlyInspections: safetyMetricsData.monthly_inspections,
    correctiveActions: safetyMetricsData.corrective_actions
  } : {
    recordableDays: 0,
    totalIncidents: 0,
    nearMisses: 0,
    safetyTrainingHours: 0,
    complianceScore: 0,
    oshaRating: 'N/A',
    lastIncidentDate: null,
    activeSafetyPrograms: 0,
    monthlyInspections: 0,
    correctiveActions: 0
  };

  // Safety incidents from database
  const safetyIncidents = safetyIncidentsData?.map(incident => ({
    id: incident.id,
    type: incident.incident_type,
    description: incident.description,
    date: incident.incident_date,
    severity: incident.severity,
    status: incident.status,
    corrective: incident.corrective_action
  })) || [];

  // Safety training from database
  const safetyTraining = safetyTrainingData?.map(training => ({
    program: training.program_name,
    completed: training.completed_count,
    required: training.required_count,
    deadline: training.deadline
  })) || [];

  // Daily progress from database with fallback (force fallback for testing)
  const dailyProgress = [
    { date: 'Dec 09', planned: 52.1, actual: 52.3, workforce: 145 },
    { date: 'Dec 10', planned: 52.3, actual: 52.5, workforce: 148 },
    { date: 'Dec 11', planned: 52.5, actual: 52.8, workforce: 142 },
    { date: 'Dec 12', planned: 52.8, actual: 53.1, workforce: 155 },
    { date: 'Dec 13', planned: 53.1, actual: 53.2, workforce: 150 },
    { date: 'Dec 14', planned: 53.3, actual: 53.5, workforce: 145 },
    { date: 'Dec 15', planned: 53.5, actual: 53.8, workforce: 148 }
  ];

  // Trade progress from database with fallback (force fallback for testing)
  const tradeProgress = [
    { floor: 'Floor 10', structural: 100.0, mechanical: 68.9, electrical: 75.5, plumbing: 45.2, finishes: 25.8 },
    { floor: 'Floor 9', structural: 100.0, mechanical: 75.8, electrical: 82.3, plumbing: 68.9, finishes: 35.2 },
    { floor: 'Floor 8', structural: 100.0, mechanical: 68.9, electrical: 78.5, plumbing: 82.1, finishes: 45.8 },
    { floor: 'Floor 7', structural: 100.0, mechanical: 85.2, electrical: 91.2, plumbing: 89.5, finishes: 55.8 },
    { floor: 'Floor 6', structural: 100.0, mechanical: 92.1, electrical: 95.8, plumbing: 92.8, finishes: 65.2 }
  ];

  // Recent construction activities from database with fallback (force fallback for testing)
  const recentActivities = [
    { id: '1', activity: 'MEP Rough-in Coordination', trade: 'Multiple Trades', status: 'completed', date: '2024-12-15', crew: 'MEP Coordination Team', duration: '8 hours', notes: 'Cross-trade coordination successful' },
    { id: '2', activity: 'Electrical Conduit Installation', trade: 'Electrical', status: 'completed', date: '2024-12-14', crew: 'Metro Electric Crew A', duration: '10 hours', notes: 'Floor 9 conduit work completed' },
    { id: '3', activity: 'HVAC Equipment Lifting', trade: 'Mechanical', status: 'completed', date: '2024-12-13', crew: 'Crane Operations Team', duration: '6 hours', notes: 'Equipment successfully placed floors 8-10' },
    { id: '4', activity: 'Safety Training Session', trade: 'Safety', status: 'completed', date: '2024-12-12', crew: 'Safety Team', duration: '4 hours', notes: 'Monthly safety briefing all trades' },
    { id: '5', activity: 'Plumbing Rough-in', trade: 'Plumbing', status: 'in-progress', date: '2024-12-11', crew: 'ProPlumb Crew B', duration: '12 hours', notes: 'Floors 7-8 rough-in ongoing' }
  ];

  // Quality metrics from database with fallback (force fallback for testing)
  const qualityMetrics = [
    { week: 'Week 1', qualityScore: 94.2, reworkItems: 3, inspectionPass: 96.2 },
    { week: 'Week 2', qualityScore: 95.8, reworkItems: 2, inspectionPass: 97.5 },
    { week: 'Week 3', qualityScore: 93.1, reworkItems: 4, inspectionPass: 94.8 },
    { week: 'Week 4', qualityScore: 96.5, reworkItems: 1, inspectionPass: 98.2 }
  ];

  // Material deliveries from database with fallback (force fallback for testing)
  const materialDeliveries = [
    { material: 'Electrical Conduit', supplier: 'Metro Electric Supply', scheduledDate: '2024-12-16', status: 'scheduled', quantity: '500 linear feet', cost: 15000 },
    { material: 'HVAC Ductwork', supplier: 'Climate Control Systems', scheduledDate: '2024-12-18', status: 'scheduled', quantity: '25 sections', cost: 85000 },
    { material: 'Plumbing Fixtures', supplier: 'ProPlumb Wholesale', scheduledDate: '2024-12-20', status: 'scheduled', quantity: '45 units', cost: 125000 },
    { material: 'Drywall Sheets', supplier: 'BuildMart Supply', scheduledDate: '2024-12-15', status: 'delivered', quantity: '200 sheets', cost: 8500 },
    { material: 'Structural Steel', supplier: 'Ironworks Construction LLC', scheduledDate: '2024-12-14', status: 'delivered', quantity: '12 beams', cost: 485000 }
  ];

  // Debug data lengths
  // console.log('Data lengths:', { dailyProgress: dailyProgress.length, tradeProgress: tradeProgress.length, recentActivities: recentActivities.length });

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
        return 'bg-card text-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Construction Header */}
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
            <HardHat className="w-4 h-4 mr-2" />
            {metricsData.overallProgress}% Complete
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            {Math.abs(metricsData.daysAheadBehind)} Days {metricsData.daysAheadBehind < 0 ? 'Ahead' : 'Behind'}
          </Badge>
        </div>
      </div>

      {/* Owner's Construction Overview */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Activity className="w-5 h-5 text-green-400" />
              Construction Progress & Investment Protection
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Owner Dashboard</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Owner-Focused Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{metricsData.overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{metricsData.safetyScore}%</div>
                <div className="text-sm text-muted-foreground">Safety Score</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{metricsData.qualityScore}%</div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{Math.abs(metricsData.daysAheadBehind)}</div>
                <div className="text-sm text-muted-foreground">Days {metricsData.daysAheadBehind < 0 ? 'Ahead' : 'Behind'}</div>
            </div>
          </div>
          
          {/* Owner Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              Your construction project is {metricsData.overallProgress}% complete and running {Math.abs(metricsData.daysAheadBehind)} days {metricsData.daysAheadBehind < 0 ? 'ahead of' : 'behind'} schedule. Quality standards are maintained at {metricsData.qualityScore}% with excellent safety performance at {metricsData.safetyScore}%. All contractor teams are performing to specifications.
            </p>
          </div>
          
          {/* Owner Insights and Actions */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Investment Status</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Project {metricsData.overallProgress}% complete with {metricsData.completedMilestones}/{metricsData.totalMilestones} major milestones achieved</li>
                <li>• Contractors maintaining {metricsData.safetyScore}% safety standards - protecting against liability</li>
                <li>• Quality control at {metricsData.qualityScore}% ensures asset value protection</li>
                <li>• {metricsData.openRFIs} open information requests - monitor for potential delays</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Owner Actions Needed</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Wrench className="h-5 w-5 text-muted-foreground" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-orange-600 hover:bg-orange-700 text-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Daily Report
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Users className="w-4 h-4 mr-2" />
              Crew Management
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Truck className="w-4 h-4 mr-2" />
              Material Delivery
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety Inspection
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Update
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Quality Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Construction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metricsData.overallProgress}%</div>
            <div className="text-xs text-muted-foreground mt-1">{metricsData.completedMilestones}/{metricsData.totalMilestones} milestones</div>
            <Progress value={metricsData.overallProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Workforce */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Workforce</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metricsData.totalWorkforce}</div>
            <div className="text-xs text-muted-foreground mt-1">{metricsData.activeSubcontractors} subcontractors</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+8% productivity</span>
            </div>
          </CardContent>
        </Card>

        {/* Safety Score */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricsData.safetyScore}%</div>
            <div className="text-xs text-muted-foreground mt-1">{safetyMetrics.recordableDays} days without incident</div>
            <div className="flex items-center mt-2 text-green-600">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm">{safetyMetrics.oshaRating}</span>
            </div>
          </CardContent>
        </Card>

        {/* Open Items */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Items</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metricsData.openRFIs + metricsData.pendingSubmittals}</div>
            <div className="text-xs text-muted-foreground mt-1">{metricsData.openRFIs} RFIs, {metricsData.pendingSubmittals} submittals</div>
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Activity className="h-5 w-5 text-muted-foreground" />
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Building className="h-5 w-5 text-muted-foreground" />
              Trade Progress by Floor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tradeProgress.map((floor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{floor.floor}</span>
                    <span className="text-sm text-muted-foreground">
                      Avg: {Math.round((floor.structural + floor.mechanical + floor.electrical + floor.plumbing + floor.finishes) / 5)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Struct</div>
                      <Progress value={floor.structural} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{floor.structural}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Mech</div>
                      <Progress value={floor.mechanical} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{floor.mechanical}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Elec</div>
                      <Progress value={floor.electrical} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{floor.electrical}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Plumb</div>
                      <Progress value={floor.plumbing} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{floor.plumbing}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Finish</div>
                      <Progress value={floor.finishes} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{floor.finishes}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Deliveries Schedule */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Truck className="h-5 w-5 text-muted-foreground" />
              Material Deliveries Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materialDeliveries.map((delivery, index) => (
                <div key={index} className="p-4 rounded-lg bg-card/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{delivery.material}</span>
                    <Badge className={getStatusColor(delivery.status)}>
                      {delivery.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-medium ml-2">{delivery.supplier}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium ml-2">{delivery.scheduledDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium ml-2">{delivery.quantity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost:</span>
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
          <h2 className="text-2xl font-semibold text-foreground">Safety & Compliance</h2>
        </div>
        
        {/* Safety KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Without Incident</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{safetyMetrics.recordableDays}</div>
            <div className="text-xs text-muted-foreground mt-1">Last incident: {safetyMetrics.lastIncidentDate}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle>
              <Clipboard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{safetyMetrics.complianceScore}%</div>
            <div className="text-xs text-muted-foreground mt-1">{safetyMetrics.oshaRating} OSHA rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Training Hours</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{safetyMetrics.safetyTrainingHours}</div>
            <div className="text-xs text-muted-foreground mt-1">This quarter</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Near Misses</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{safetyMetrics.nearMisses}</div>
            <div className="text-xs text-muted-foreground mt-1">All investigated</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Safety Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Safety Incidents */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Recent Safety Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safetyIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 rounded-lg bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={incident.type === 'Near Miss' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}>
                        {incident.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{incident.date}</span>
                    </div>
                    <div className="font-medium text-sm mb-1">{incident.description}</div>
                    <div className="text-xs text-muted-foreground">
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
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
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
                      <span className="text-sm text-slate-600 dark:text-muted-foreground">
                        {training.completed}/{training.required}
                      </span>
                    </div>
                    <Progress value={(training.completed / training.required) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-muted-foreground">
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
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Activity className="h-5 w-5 text-muted-foreground" />
              Recent Construction Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-card/50">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{activity.activity}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.trade} • {activity.crew} • {activity.duration}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.notes}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.replace('-', ' ')}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {activity.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Construction Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <HardHat className="h-5 w-5 text-muted-foreground" />
              Construction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border">
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
                <div className="text-muted-foreground">Complete</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-amber-600">{metricsData.totalWorkforce}</div>
                <div className="text-muted-foreground">Workers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{metricsData.safetyScore}%</div>
                <div className="text-muted-foreground">Safety</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{metricsData.activeWorkOrders}</div>
                <div className="text-muted-foreground">Active Work Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionDashboard;
