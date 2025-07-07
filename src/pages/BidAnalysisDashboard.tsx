import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  BarChart3,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calculator,
  Download,
  Plus,
  Eye,
  Filter,
  Search
} from 'lucide-react';

interface BidProject {
  id: string;
  rfp_id: string;
  project_name: string;
  project_location?: string;
  total_budget?: number;
  status: 'draft' | 'bidding' | 'evaluation' | 'awarded' | 'cancelled';
  bid_due_date?: string;
  created_at: string;
  vendor_count?: number;
  line_item_count?: number;
  lowest_bid?: number;
  highest_bid?: number;
  average_bid?: number;
}

interface DashboardStats {
  total_projects: number;
  active_bidding: number;
  under_evaluation: number;
  awarded: number;
  total_vendors: number;
  average_bid_amount: number;
  projects_this_month: number;
  completion_rate: number;
}

const BidAnalysisDashboard: React.FC = () => {
  const [projects, setProjects] = useState<BidProject[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load projects with bid summary data
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_bid_summary')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Load basic projects data if the view doesn't exist
      const { data: basicProjects, error: basicError } = await supabase
        .from('bid_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (basicError) {
        console.warn('project_bid_summary view not found, using basic projects:', basicError);
        setProjects(basicProjects || []);
      } else {
        setProjects(projectsData || []);
      }

      // Calculate stats
      const allProjects = projectsData || basicProjects || [];
      const dashboardStats: DashboardStats = {
        total_projects: allProjects.length,
        active_bidding: allProjects.filter(p => p.status === 'bidding').length,
        under_evaluation: allProjects.filter(p => p.status === 'evaluation').length,
        awarded: allProjects.filter(p => p.status === 'awarded').length,
        total_vendors: 0, // Will be calculated from vendor_bid_submissions
        average_bid_amount: allProjects.reduce((sum, p) => sum + (p.average_bid || 0), 0) / (allProjects.length || 1),
        projects_this_month: allProjects.filter(p => 
          new Date(p.created_at).getMonth() === new Date().getMonth()
        ).length,
        completion_rate: allProjects.length > 0 ? 
          (allProjects.filter(p => p.status === 'awarded').length / allProjects.length) * 100 : 0
      };

      // Get vendor count
      const { data: vendorsData } = await supabase
        .from('bid_vendors')
        .select('id');
      
      dashboardStats.total_vendors = vendorsData?.length || 0;

      setStats(dashboardStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSampleProject = async () => {
    try {
      const sampleProject = {
        rfp_id: `RFP-${Date.now()}`,
        project_name: 'Sample MEP Installation Project',
        project_location: 'Downtown Office Complex',
        total_budget: 2500000,
        status: 'bidding',
        bid_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimated_duration: 180
      };

      const { data, error } = await supabase
        .from('bid_projects')
        .insert([sampleProject])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sample project created successfully!",
      });

      loadDashboardData();
    } catch (error) {
      console.error('Error creating sample project:', error);
      toast({
        title: "Error",
        description: "Failed to create sample project.",
        variant: "destructive"
      });
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue", format = "number" }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    trend?: string;
    color?: string;
    format?: 'number' | 'currency' | 'percentage';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `$${val.toLocaleString()}`;
        case 'percentage':
          return `${val.toFixed(1)}%`;
        default:
          return val.toLocaleString();
      }
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{formatValue(value)}</p>
              {trend && (
                <p className="text-xs text-muted-foreground mt-1">{trend}</p>
              )}
            </div>
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProjectCard = ({ project }: { project: BidProject }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{project.project_name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{project.rfp_id}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={
                  project.status === 'awarded' ? 'default' :
                  project.status === 'bidding' ? 'secondary' :
                  project.status === 'evaluation' ? 'outline' : 'destructive'
                }
                className="text-xs"
              >
                {project.status}
              </Badge>
              {project.total_budget && (
                <span className="text-xs text-muted-foreground">
                  ${project.total_budget.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {project.vendor_count !== undefined && (
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">
              {project.vendor_count} vendors • {project.line_item_count || 0} line items
            </div>
            {project.vendor_count > 0 && (
              <Progress value={Math.min((project.vendor_count / 5) * 100, 100)} className="h-1" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bid Analysis Dashboard</h1>
            <p className="text-muted-foreground">
              Manage RFPs, analyze vendor submissions, and make award decisions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={createSampleProject}>
              <Plus className="w-4 h-4 mr-2" />
              New RFP
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Projects"
              value={stats.total_projects}
              icon={FileSpreadsheet}
              trend="All time"
              color="blue"
            />
            <StatCard
              title="Active Bidding"
              value={stats.active_bidding}
              icon={Clock}
              trend="Awaiting bids"
              color="orange"
            />
            <StatCard
              title="Under Evaluation"
              value={stats.under_evaluation}
              icon={Calculator}
              trend="In review"
              color="purple"
            />
            <StatCard
              title="Completion Rate"
              value={stats.completion_rate}
              icon={CheckCircle}
              trend="Projects awarded"
              color="green"
              format="percentage"
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bidding">Active</TabsTrigger>
            <TabsTrigger value="evaluation">Review</TabsTrigger>
            <TabsTrigger value="completed">Complete</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projects.length === 0 ? (
                      <div className="text-center py-8">
                        <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No projects found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create your first RFP to get started with bid analysis.
                        </p>
                        <Button onClick={createSampleProject} className="mt-4" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Sample Project
                        </Button>
                      </div>
                    ) : (
                      projects.slice(0, 5).map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average Bid Value</span>
                        <span className="text-sm font-bold">
                          ${stats.average_bid_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Registered Vendors</span>
                        <span className="text-sm font-bold">{stats.total_vendors}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Projects This Month</span>
                        <span className="text-sm font-bold">{stats.projects_this_month}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-sm font-bold">{stats.completion_rate.toFixed(1)}%</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bidding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Bidding Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.filter(p => p.status === 'bidding').length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active bidding projects</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Projects in the bidding phase will appear here.
                      </p>
                    </div>
                  ) : (
                    projects
                      .filter(p => p.status === 'bidding')
                      .map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Under Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.filter(p => p.status === 'evaluation').length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No projects under evaluation</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Projects ready for bid analysis will appear here.
                      </p>
                    </div>
                  ) : (
                    projects
                      .filter(p => p.status === 'evaluation')
                      .map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.filter(p => p.status === 'awarded').length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No completed projects yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Awarded projects will appear here.
                      </p>
                    </div>
                  ) : (
                    projects
                      .filter(p => p.status === 'awarded')
                      .map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center p-6 h-auto"
                onClick={createSampleProject}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Create RFP</div>
                  <div className="text-sm text-muted-foreground">Start new bidding process</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Analyze Bids</div>
                  <div className="text-sm text-muted-foreground">Review submitted proposals</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Manage Vendors</div>
                  <div className="text-sm text-muted-foreground">View vendor profiles</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                <div className="text-center">
                  <Download className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Export Reports</div>
                  <div className="text-sm text-muted-foreground">Generate analysis reports</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BidAnalysisDashboard;
