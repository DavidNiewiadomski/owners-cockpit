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
import { luxuryOfficeProject } from '@/data/sampleProjectData';

interface OverviewDashboardProps {
  projectId: string;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ projectId }) => {
  const project = luxuryOfficeProject;

  // Calculate key metrics
  const budgetUsed = (project.financial.spentToDate / project.financial.totalBudget) * 100;
  const scheduleProgress = project.schedule.percentComplete;
  const contingencyUsed = (project.financial.contingencyUsed / project.financial.contingencyTotal) * 100;
  const preLeasingRate = project.leasing.preLeasingRate;
  const roi = project.financial.roi;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{project.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
              {project.status}
            </Badge>
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
              {project.phase}
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {project.basicInfo.totalSquareFootage.toLocaleString()} sq ft • {project.basicInfo.floors} floors
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {roi.toFixed(1)}% ROI
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Projected Return
          </div>
        </div>
      </div>

      {/* AI Project Insights */}
      <Card className="bg-slate-900 border-slate-800">
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
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{scheduleProgress}%</div>
              <div className="text-sm text-slate-400">Progress</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{budgetUsed.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Budget Used</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{roi.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">ROI</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{preLeasingRate.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Pre-Leased</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-slate-800/50 rounded-lg p-4">
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
                <li>• Schedule tracking {scheduleProgress}% complete with {project.schedule.remainingDays} days remaining</li>
                <li>• Financial performance showing {budgetUsed <= scheduleProgress ? 'healthy' : 'elevated'} budget utilization</li>
                <li>• Pre-leasing momentum exceeding targets at {preLeasingRate.toFixed(1)}% occupancy</li>
                <li>• Safety record maintained at {project.safety.complianceScore}% compliance rate</li>
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

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget Performance */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(project.financial.spentToDate / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>of ${(project.financial.totalBudget / 1000000).toFixed(1)}M</span>
              <Badge variant={budgetUsed <= scheduleProgress ? "default" : "destructive"} className="text-xs">
                {budgetUsed.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={budgetUsed} className="mt-2" />
          </CardContent>
        </Card>

        {/* Schedule Performance */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Schedule Progress</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduleProgress}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>{project.schedule.remainingDays} days remaining</span>
              <Badge variant={project.schedule.criticalPathDelay === 0 ? "default" : "destructive"} className="text-xs">
                On Track
              </Badge>
            </div>
            <Progress value={scheduleProgress} className="mt-2" />
          </CardContent>
        </Card>

        {/* Pre-Leasing Status */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pre-Leasing</CardTitle>
            <Building className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preLeasingRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>{(project.leasing.preLeasedSpace / 1000).toFixed(0)}K sq ft</span>
              <Badge variant={preLeasingRate >= 25 ? "default" : "secondary"} className="text-xs">
                {preLeasingRate >= 25 ? "Strong" : "Building"}
              </Badge>
            </div>
            <Progress value={preLeasingRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* Safety Record */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Safety Record</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {project.safety.recordableDays}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>Days without incident</span>
              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                Excellent
              </Badge>
            </div>
            <div className="mt-2 text-xs text-green-600">
              ↗ {project.safety.complianceScore}% compliance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Timeline & Financial Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Major Milestones */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Major Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.schedule.milestones.slice(0, 5).map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-500' :
                    milestone.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{milestone.name}</div>
                    <div className="text-xs text-muted-foreground">{milestone.date}</div>
                  </div>
                </div>
                <Badge variant={
                  milestone.status === 'completed' ? 'default' :
                  milestone.status === 'in-progress' ? 'secondary' :
                  'outline'
                }>
                  {milestone.status === 'completed' ? 'Done' :
                   milestone.status === 'in-progress' ? `${milestone.progress}%` :
                   'Upcoming'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Investment</div>
                <div className="text-xl font-bold">
                  ${(project.financial.totalBudget / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Market Value</div>
                <div className="text-xl font-bold text-green-600">
                  ${(project.financial.marketValue / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">NPV</div>
                <div className="text-lg font-semibold text-green-600">
                  ${(project.financial.npv / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">IRR</div>
                <div className="text-lg font-semibold text-green-600">
                  {project.financial.irr}%
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Contingency Usage</span>
                <span className="text-sm font-medium">{contingencyUsed.toFixed(1)}%</span>
              </div>
              <Progress value={contingencyUsed} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                ${(project.financial.contingencyRemaining / 1000).toFixed(0)}K remaining
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk & Issues Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Risks */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Active Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.risks.filter(r => r.status !== 'closed').map((risk) => (
              <div key={risk.id} className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{risk.title}</div>
                  <Badge variant="outline" className="text-xs">
                    Score: {risk.riskScore}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {risk.description}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {risk.probability} probability
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {risk.impact} impact
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Key Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.values(project.team).map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium text-sm">{member.contact}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                  <div className="text-xs text-muted-foreground">{member.company}</div>
                </div>
                <div className="text-right">
                  {member.contractValue && (
                    <div className="text-sm font-medium">
                      ${(member.contractValue / 1000000).toFixed(1)}M
                    </div>
                  )}
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between text-sm">
              Review Budget Variance
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Schedule Site Visit
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Approve Change Orders
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Review Tenant Applications
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Update Insurance Coverage
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
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
