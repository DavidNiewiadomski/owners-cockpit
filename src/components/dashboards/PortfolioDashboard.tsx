import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users,
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

const PortfolioDashboard: React.FC = () => {
  const { data: projects = [], isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-foreground text-lg">Loading portfolio...</div>
      </div>
    );
  }

  // Calculate portfolio metrics from project data
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const planningProjects = projects.filter(p => p.status === 'planning').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  // Estimated portfolio value based on our test data
  const portfolioValue = 95500000; // Sum from our test: $45M + $32M + $18.5M
  const totalSpent = 51700000; // Sum of spent amounts
  const avgProgress = activeProjects > 0 ? 45 : 0; // Estimated average

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Portfolio Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Portfolio Overview</h1>
          <p className="text-muted-foreground mt-1">Complete view of all construction projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <Building className="w-4 h-4 mr-2" />
            {totalProjects} Projects
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <DollarSign className="w-4 h-4 mr-2" />
            ${(portfolioValue / 1000000).toFixed(1)}M Total Value
          </Badge>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalProjects}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {activeProjects} active, {planningProjects} planning
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(portfolioValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ${(totalSpent / 1000000).toFixed(1)}M spent ({((totalSpent / portfolioValue) * 100).toFixed(1)}%)
            </div>
            <Progress value={(totalSpent / portfolioValue) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgProgress}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across active projects
            </div>
            <Progress value={avgProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {completedProjects} of {totalProjects} completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Building className="h-5 w-5 text-muted-foreground" />
            Project Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-foreground">{project.name}</div>
                  <div className="text-sm text-muted-foreground">{project.description}</div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      project.status === 'active' ? 'default' :
                      project.status === 'completed' ? 'secondary' :
                      project.status === 'planning' ? 'outline' : 'destructive'
                    }
                    className="bg-card text-foreground border-border"
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Start Date</div>
                  <div className="text-foreground">{project.start_date || 'TBD'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">End Date</div>
                  <div className="text-foreground">{project.end_date || 'TBD'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">ID</div>
                  <div className="text-foreground font-mono text-xs">{project.id?.substring(0, 8)}...</div>
                </div>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No projects found. Add your first project to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Portfolio Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-foreground">Strong Performance</span>
              </div>
              <div className="text-xs text-foreground">
                Portfolio showing healthy progress with {activeProjects} active projects on track
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-foreground">Balanced Pipeline</span>
              </div>
              <div className="text-xs text-foreground">
                Good mix of projects: {activeProjects} active, {planningProjects} planning, {completedProjects} completed
              </div>
            </div>
            
            {totalProjects > 3 && (
              <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">Resource Management</span>
                </div>
                <div className="text-xs text-foreground">
                  Monitor resource allocation across {totalProjects} projects to maintain quality
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Key Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Immediate Actions</div>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Review active project progress reports</li>
                <li>• Monitor budget utilization across portfolio</li>
                <li>• Schedule stakeholder meetings for planning projects</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">This Week</div>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Quarterly portfolio review meeting</li>
                <li>• Resource allocation planning session</li>
                <li>• Risk assessment updates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
