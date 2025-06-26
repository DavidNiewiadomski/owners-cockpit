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
  const { data: projects = [] } = useProjects();
  
  // Fetch all project data from Supabase
  const { data: financialMetrics, isLoading: loadingFinancial } = useFinancialMetrics(projectId);
  const { data: constructionMetrics, isLoading: loadingConstruction } = useConstructionMetrics(projectId);
  const { data: executiveMetrics, isLoading: loadingExecutive } = useExecutiveMetrics(projectId);
  const { data: legalMetrics, isLoading: loadingLegal } = useLegalMetrics(projectId);
  const { data: insights, isLoading: loadingInsights } = useProjectInsights(projectId);
  const { data: timeline, isLoading: loadingTimeline } = useProjectTimeline(projectId);
  const { data: team, isLoading: loadingTeam } = useProjectTeam(projectId);
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);
  
  // Show loading state if any data is still loading
  const isLoading = loadingFinancial || loadingConstruction || loadingExecutive || loadingLegal || 
                    loadingInsights || loadingTimeline || loadingTeam;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading project overview...</div>
      </div>
    );
  }
  
  if (!financialMetrics || !constructionMetrics) {
    return (
      <div className="min-h-screen bg-[#0D1117] p-6 flex items-center justify-center">
        <div className="text-slate-400 text-lg">No project data available.</div>
      </div>
    );
  }

  // Calculate key metrics from Supabase data
  const budgetUsed = financialMetrics ? (financialMetrics.spent_to_date / financialMetrics.total_budget) * 100 : 0;
  const scheduleProgress = constructionMetrics ? constructionMetrics.overall_progress : 0;
  const contingencyTotal = financialMetrics ? (financialMetrics.contingency_used + financialMetrics.contingency_remaining) : 0;
  const contingencyUsed = contingencyTotal > 0 ? (financialMetrics.contingency_used / contingencyTotal) * 100 : 0;
  const preLeasingRate = financialMetrics ? financialMetrics.leasing_projections : 0;
  const roi = financialMetrics ? financialMetrics.roi : 0;

  return (
    <div className="min-h-screen bg-[#0D1117] p-6 space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            {scheduleProgress}% Complete
          </Badge>
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            {roi.toFixed(1)}% ROI
          </Badge>
        </div>
      </div>

      {/* AI Project Insights */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <BarChart3 className="w-5 h-5 text-green-400" />
              AI Project Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{scheduleProgress}%</div>
              <div className="text-sm text-slate-400">Progress</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{budgetUsed.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Budget Used</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{roi.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">ROI</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{preLeasingRate.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Pre-Leased</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-[#0D1117]/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Project is {scheduleProgress}% complete with {budgetUsed.toFixed(1)}% budget utilized and {roi.toFixed(1)}% projected ROI. Pre-leasing at {preLeasingRate.toFixed(1)}% indicates strong market demand. Overall project health is {budgetUsed <= scheduleProgress ? 'on track' : 'requires attention'}.
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
                <li>• Schedule tracking {scheduleProgress}% complete with construction progressing well</li>
                <li>• Financial performance showing {budgetUsed <= scheduleProgress ? 'healthy' : 'elevated'} budget utilization</li>
                <li>• Pre-leasing momentum exceeding targets at {preLeasingRate.toFixed(1)}% occupancy</li>
                <li>• Safety record maintained at {constructionMetrics ? constructionMetrics.safety_score : 95}% compliance rate</li>
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
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Review Budget Variance
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Site Visit
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Change Orders
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Building className="w-4 h-4 mr-2" />
              Review Tenant Applications
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Update Insurance Coverage
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Generate Progress Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget Performance */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(financialMetrics.spent_to_date / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
              <span>of ${(financialMetrics.total_budget / 1000000).toFixed(1)}M</span>
              <Badge variant={budgetUsed <= scheduleProgress ? "default" : "destructive"} className="text-xs bg-[#0D1117] text-slate-300">
                {budgetUsed.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={budgetUsed} className="mt-2" />
          </CardContent>
        </Card>

        {/* Schedule Performance */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Schedule Progress</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{scheduleProgress}%</div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
              <span>Construction in progress</span>
              <Badge variant="default" className="text-xs bg-[#0D1117] text-slate-300">
                On Track
              </Badge>
            </div>
            <Progress value={scheduleProgress} className="mt-2" />
          </CardContent>
        </Card>

        {/* Pre-Leasing Status */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pre-Leasing</CardTitle>
            <Building className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{preLeasingRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
              <span>Pre-leased space available</span>
              <Badge variant={preLeasingRate >= 25 ? "default" : "secondary"} className="text-xs bg-[#0D1117] text-slate-300">
                {preLeasingRate >= 25 ? "Strong" : "Building"}
              </Badge>
            </div>
            <Progress value={preLeasingRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* Safety Record */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Safety Record</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {constructionMetrics ? constructionMetrics.safety_score : 95}
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Target className="h-5 w-5 text-slate-400" />
              Major Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline?.slice(0, 5).map((milestone) => (
              <div key={milestone.phase} className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-[#0D1117]/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-400' :
                    milestone.status === 'in-progress' ? 'bg-blue-400' :
                    'bg-slate-500'
                  }`} />
                  <div>
                    <div className="font-medium text-sm text-white">{milestone.phase}</div>
                    <div className="text-xs text-slate-400">{milestone.start_date}</div>
                  </div>
                </div>
                <Badge variant={
                  milestone.status === 'completed' ? 'default' :
                  milestone.status === 'in-progress' ? 'secondary' :
                  'outline'
                } className="bg-slate-700 text-slate-300 border-slate-600">
                  {milestone.status === 'completed' ? 'Done' :
                   milestone.status === 'in-progress' ? `${milestone.progress}%` :
                   'Upcoming'}
                </Badge>
              </div>
            )) || [
              <div key="no-milestones" className="text-center text-slate-400 py-4">
                No milestone data available
              </div>
            ]}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <BarChart3 className="h-5 w-5 text-slate-400" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Total Investment</div>
                <div className="text-xl font-bold text-white">
                  ${(financialMetrics.total_budget / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Market Value</div>
                <div className="text-xl font-bold text-green-400">
                  ${(financialMetrics.market_value / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">NPV</div>
                <div className="text-lg font-semibold text-green-400">
                  ${(financialMetrics.npv / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">IRR</div>
                <div className="text-lg font-semibold text-green-400">
                  {financialMetrics.irr}%
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Contingency Usage</span>
                <span className="text-sm font-medium text-white">{contingencyUsed.toFixed(1)}%</span>
              </div>
              <Progress value={contingencyUsed} className="h-2" />
              <div className="text-xs text-slate-400 mt-1">
                ${(financialMetrics.contingency_remaining / 1000).toFixed(0)}K remaining
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk & Issues Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Risks */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Active Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/10">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm text-white">Budget Variance</div>
                <Badge variant="outline" className="text-xs bg-[#0D1117] text-slate-300 border-slate-600">
                  Score: Medium
                </Badge>
              </div>
              <div className="text-xs text-slate-400 mb-2">
                Monitor budget utilization vs schedule progress
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs bg-[#0D1117] text-slate-300 capitalize">
                  Low probability
                </Badge>
                <Badge variant="secondary" className="text-xs bg-[#0D1117] text-slate-300 capitalize">
                  Medium impact
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Users className="h-5 w-5 text-slate-400" />
              Key Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-[#0D1117]/50">
              <div>
                <div className="font-medium text-sm text-white">{team?.project_manager || 'Project Manager'}</div>
                <div className="text-xs text-slate-400">Project Manager</div>
                <div className="text-xs text-slate-400">Construction Management</div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
                  Active
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-[#0D1117]/50">
              <div>
                <div className="font-medium text-sm text-white">{team?.architect || 'Lead Architect'}</div>
                <div className="text-xs text-slate-400">Architect</div>
                <div className="text-xs text-slate-400">Design Team</div>
              </div>
              <div className="text-right">
                <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
                  Active
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-[#0D1117]/50">
              <div>
                <div className="font-medium text-sm text-white">{team?.contractor || 'General Contractor'}</div>
                <div className="text-xs text-slate-400">General Contractor</div>
                <div className="text-xs text-slate-400">Construction</div>
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Clock className="h-5 w-5 text-slate-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between text-sm border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              Review Budget Variance
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              Schedule Site Visit
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              Approve Change Orders
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              Review Tenant Applications
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              Update Insurance Coverage
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
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
