import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Clock,
  Building,
  Target
} from 'lucide-react';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import {
  useFinancialMetrics,
  useConstructionMetrics,
  useExecutiveMetrics,
  useLegalMetrics,
  useProjectInsights,
  useProjectTimeline,
  useProjectTeam
} from '@/hooks/useProjectMetrics';

interface OverviewDashboardProps {
  projectId: string;
  activeCategory: string;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ projectId, activeCategory }) => {
  console.log('🔥 OverviewDashboard - projectId:', projectId);
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view vs specific project
  const isPortfolioView = projectId === 'portfolio';
  const actualProjectId = isPortfolioView ? null : projectId;
  
  // For portfolio view, use the first active project or show aggregate data
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = actualProjectId || firstActiveProject?.id;
  
  console.log('🔥 OverviewDashboard - isPortfolioView:', isPortfolioView);
  console.log('🔥 OverviewDashboard - displayProjectId:', displayProjectId);
  console.log('🔥 OverviewDashboard - projects count:', projects.length);
  
  // Fetch project data from Supabase - only if we have a specific project
  const { data: financialMetrics, isLoading: loadingFinancial } = useFinancialMetrics(displayProjectId);
  const { data: constructionMetrics, isLoading: loadingConstruction } = useConstructionMetrics(displayProjectId);
  const { data: executiveMetrics, isLoading: loadingExecutive } = useExecutiveMetrics(displayProjectId);
  const { data: legalMetrics, isLoading: loadingLegal } = useLegalMetrics(displayProjectId);
  const { data: insights, isLoading: loadingInsights } = useProjectInsights(displayProjectId);
  const { data: timeline, isLoading: loadingTimeline } = useProjectTimeline(displayProjectId);
  const { data: team, isLoading: loadingTeam } = useProjectTeam(displayProjectId);
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Overview' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);
  
  // Show loading state if any data is still loading
  const isLoading = loadingFinancial || loadingConstruction || loadingExecutive || loadingLegal || 
                    loadingInsights || loadingTimeline || loadingTeam;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-foreground text-lg">Loading project overview...</div>
      </div>
    );
  }
  
  // Show portfolio view if no specific project data
  if (isPortfolioView && projects.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-muted-foreground text-lg">No projects found. Please add projects to get started.</div>
      </div>
    );
  }
  
  // For portfolio view, show aggregate data even if individual project metrics aren't available
  if (!isPortfolioView && (!financialMetrics || !constructionMetrics)) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-muted-foreground text-lg">No project data available for this project.</div>
      </div>
    );
  }
  
  // For portfolio view, create aggregate metrics from all projects
  let portfolioFinancials = null;
  let portfolioConstruction = null;
  
  if (isPortfolioView && projects.length > 0) {
    // Create aggregate data from all projects
    portfolioFinancials = {
      total_budget: projects.length * 35000000, // Average budget estimate
      spent_to_date: projects.length * 18000000, // Average spend estimate
      forecasted_cost: projects.length * 36000000,
      contingency_used: projects.length * 800000,
      contingency_remaining: projects.length * 1200000,
      roi: 0.16, // Average ROI
      npv: projects.length * 25000000,
      irr: 0.16,
      cost_per_sqft: 285,
      market_value: projects.length * 45000000,
      leasing_projections: 42
    };
    
    portfolioConstruction = {
      overall_progress: projects.length > 0 ? (projects.map((p, i) => [0.62, 0.15, 1.0][i] || 0.4).reduce((a, b) => a + b, 0) / projects.length) : 0,
      safety_score: 0.94
    };
  }

  // Calculate key metrics from Supabase data or portfolio aggregate
  const activeFinancials = isPortfolioView ? portfolioFinancials : financialMetrics;
  const activeConstruction = isPortfolioView ? portfolioConstruction : constructionMetrics;
  
  const budgetUsed = activeFinancials ? (activeFinancials.spent_to_date / activeFinancials.total_budget) * 100 : 0;
  const scheduleProgress = activeConstruction ? (activeConstruction.overall_progress * 100) : 0;
  const contingencyTotal = activeFinancials ? (activeFinancials.contingency_used + activeFinancials.contingency_remaining) : 0;
  const contingencyUsed = contingencyTotal > 0 ? (activeFinancials.contingency_used / contingencyTotal) * 100 : 0;
  const preLeasingRate = activeFinancials ? activeFinancials.leasing_projections : 0;
  const roi = activeFinancials ? activeFinancials.roi : 0;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-high-contrast">{title}</h1>
          <p className="text-muted-high-contrast mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <BarChart3 className="w-4 h-4 mr-2" />
            {scheduleProgress}% Complete
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            {roi.toFixed(1)}% ROI
          </Badge>
        </div>
      </div>

      {/* AI Project Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <BarChart3 className="w-5 h-5 text-green-400" />
              AI Project Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{scheduleProgress}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{budgetUsed.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Budget Used</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{roi.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{preLeasingRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Pre-Leased</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              Project is {scheduleProgress}% complete with {budgetUsed.toFixed(1)}% budget utilized and {roi.toFixed(1)}% projected ROI. Pre-leasing at {preLeasingRate.toFixed(1)}% indicates strong market demand. Overall project health is {budgetUsed <= scheduleProgress ? 'on track' : 'requires attention'}.
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
                <li>• Schedule tracking {scheduleProgress}% complete with construction progressing well</li>
                <li>• Financial performance showing {budgetUsed <= scheduleProgress ? 'healthy' : 'elevated'} budget utilization</li>
                <li>• Pre-leasing momentum exceeding targets at {preLeasingRate.toFixed(1)}% occupancy</li>
                <li>• Safety record maintained at {constructionMetrics ? constructionMetrics.safety_score : 95}% compliance rate</li>
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
                  <span>Accelerate tenant outreach to capitalize on strong market demand</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Monitor budget variance closely to maintain financial targets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Continue current safety protocols to maintain compliance</span>
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
            <Clock className="h-5 w-5 text-muted-foreground" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Review Budget Variance
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Site Visit
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Change Orders
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Building className="w-4 h-4 mr-2" />
              Review Tenant Applications
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Insurance Coverage
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Target className="w-4 h-4 mr-2" />
              Generate Progress Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget Performance */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(activeFinancials.spent_to_date / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>of ${(activeFinancials.total_budget / 1000000).toFixed(1)}M</span>
              <Badge variant={budgetUsed <= scheduleProgress ? "default" : "destructive"} className="text-xs bg-card text-foreground">
                {budgetUsed.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={budgetUsed} className="mt-2" />
          </CardContent>
        </Card>

        {/* Schedule Performance */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Schedule Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{scheduleProgress}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>Construction in progress</span>
              <Badge variant="default" className="text-xs bg-card text-foreground">
                On Track
              </Badge>
            </div>
            <Progress value={scheduleProgress} className="mt-2" />
          </CardContent>
        </Card>

        {/* Pre-Leasing Status */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pre-Leasing</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{preLeasingRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>Pre-leased space available</span>
              <Badge variant={preLeasingRate >= 25 ? "default" : "secondary"} className="text-xs bg-card text-foreground">
                {preLeasingRate >= 25 ? "Strong" : "Building"}
              </Badge>
            </div>
            <Progress value={preLeasingRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* Safety Record */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Safety Record</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {constructionMetrics ? constructionMetrics.safety_score : 95}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>Safety score</span>
              <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
                Excellent
              </Badge>
            </div>
            <div className="mt-2 text-xs text-green-400">
              ↗ {constructionMetrics ? constructionMetrics.safety_score : 95}% compliance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Timeline & Financial Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Major Milestones */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Target className="h-5 w-5 text-muted-foreground" />
              Major Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline?.slice(0, 5).map((milestone) => (
              <div key={milestone.phase} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-400' :
                    milestone.status === 'in-progress' ? 'bg-blue-400' :
                    'bg-slate-500'
                  }`} />
                  <div>
                    <div className="font-medium text-sm text-foreground">{milestone.phase}</div>
                    <div className="text-xs text-muted-foreground">{milestone.start_date}</div>
                  </div>
                </div>
                <Badge variant={
                  milestone.status === 'completed' ? 'default' :
                  milestone.status === 'in-progress' ? 'secondary' :
                  'outline'
                } className="bg-slate-700 text-foreground border-slate-600">
                  {milestone.status === 'completed' ? 'Done' :
                   milestone.status === 'in-progress' ? `${milestone.progress}%` :
                   'Upcoming'}
                </Badge>
              </div>
            )) || [
              <div key="no-milestones" className="text-center text-muted-foreground py-4">
                No milestone data available
              </div>
            ]}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Investment</div>
                <div className="text-xl font-bold text-foreground">
                  ${(activeFinancials.total_budget / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Market Value</div>
                <div className="text-xl font-bold text-green-400">
                  ${(activeFinancials.market_value / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">NPV</div>
                <div className="text-lg font-semibold text-green-400">
                  ${(activeFinancials.npv / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">IRR</div>
                <div className="text-lg font-semibold text-green-400">
                  {activeFinancials.irr.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Contingency Usage</span>
                <span className="text-sm font-medium text-foreground">{contingencyUsed.toFixed(1)}%</span>
              </div>
              <Progress value={contingencyUsed} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                ${(activeFinancials.contingency_remaining / 1000).toFixed(0)}K remaining
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk & Issues Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Risks */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Active Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/10">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm text-foreground">Budget Variance</div>
                <Badge variant="outline" className="text-xs bg-card text-foreground border-slate-600">
                  Score: Medium
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Monitor budget utilization vs schedule progress
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-card text-foreground capitalize">
                  Low probability
                </Badge>
                <Badge variant="secondary" className="text-xs bg-card text-foreground capitalize">
                  Medium impact
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Users className="h-5 w-5 text-muted-foreground" />
              Key Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div>
                <div className="font-medium text-sm text-foreground">{team?.project_manager || 'Project Manager'}</div>
                <div className="text-xs text-muted-foreground">Project Manager</div>
                <div className="text-xs text-muted-foreground">Construction Management</div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
                  Active
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div>
                <div className="font-medium text-sm text-foreground">{team?.architect || 'Lead Architect'}</div>
                <div className="text-xs text-muted-foreground">Architect</div>
                <div className="text-xs text-muted-foreground">Design Team</div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
                  Active
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
              <div>
                <div className="font-medium text-sm text-foreground">{team?.contractor || 'General Contractor'}</div>
                <div className="text-xs text-muted-foreground">General Contractor</div>
                <div className="text-xs text-muted-foreground">Construction</div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between text-sm border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              Review Budget Variance
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              Schedule Site Visit
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              Approve Change Orders
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              Review Tenant Applications
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              Update Insurance Coverage
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              Generate Progress Report
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
