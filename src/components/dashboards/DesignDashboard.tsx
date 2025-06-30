import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  FileImage, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
  Layers,
  Ruler,
  PaintBucket,
  Lightbulb,
  Square,
  Users
} from 'lucide-react';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import { useDesignMetrics } from '@/hooks/useProjectMetrics';

interface DesignDashboardProps {
  projectId: string;
  activeCategory: string;
}

const DesignDashboard: React.FC<DesignDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  const { data: designMetrics, error, isLoading } = useDesignMetrics(displayProjectId);
  const loading = isLoading;
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Design Overview' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  // Provide fallback data for portfolio view or when data is unavailable
  const fallbackData = {
    design_progress: 75,
    approved_drawings: 82,
    total_drawings: 115,
    revision_cycles: 3,
    stakeholder_approvals: 89,
    design_changes: 12
  };

  const effectiveData = designMetrics || (isPortfolioView ? {
    design_progress: 78, // Portfolio average
    approved_drawings: 156, // Portfolio total
    total_drawings: 203,
    revision_cycles: 2,
    stakeholder_approvals: 91,
    design_changes: 8
  } : fallbackData);

  if (error && !isPortfolioView) {
    console.error('Error fetching design metrics:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading design data</div>
      </div>
    );
  }

  if (loading && !isPortfolioView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-foreground">Loading design data...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
      case 'pending-approval':
      case 'in-review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'revisions-requested':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-card text-foreground border-border';
    }
  };

  const designProgress = Number(((effectiveData.approved_drawings / effectiveData.total_drawings) * 100).toFixed(2));
  
  // Mock data for components not yet in backend
  const designPhases = [
    { id: 'schematic', name: 'Schematic Design', status: 'completed', progress: 100, documents: 25, dueDate: '2024-03-01' },
    { id: 'design-dev', name: 'Design Development', status: 'completed', progress: 100, documents: 38, dueDate: '2024-05-15' },
    { id: 'construction-docs', name: 'Construction Documents', status: 'in-progress', progress: designProgress, documents: effectiveData.total_drawings, dueDate: '2024-09-30' }
  ];
  
  const recentDesignSubmissions = [
    { id: 1, title: 'Facade Detail Package', type: 'Construction Documents', submittedBy: 'Arc Design Studio', submittedDate: '2024-08-15', status: 'pending-approval', priority: 'high', category: 'Architectural', estimatedCost: 85000 },
    { id: 2, title: 'MEP Coordination Drawings', type: 'Design Review', submittedBy: 'MEP Solutions', submittedDate: '2024-08-14', status: 'approved', priority: 'medium', category: 'Engineering', estimatedCost: 42000 },
    { id: 3, title: 'Structural Shop Drawings', type: 'Submittal', submittedBy: 'Structural Pro', submittedDate: '2024-08-13', status: 'revisions-requested', priority: 'high', category: 'Structural', estimatedCost: 67000 }
  ];
  
  const materialSelections = [
    { category: 'Flooring', selected: 'Premium Marble', alternatives: ['Standard Marble', 'Luxury Vinyl'], cost: 120, unit: 'sq ft', quantity: 2500, status: 'pending-approval', supplier: 'Stone Supply Co.' },
    { category: 'Windows', selected: 'High-Performance Glass', alternatives: ['Standard Glass', 'Energy Glass'], cost: 450, unit: 'sq ft', quantity: 1800, status: 'approved', supplier: 'Window Systems Inc.' },
    { category: 'Exterior Cladding', selected: 'Premium Aluminum', alternatives: ['Standard Aluminum', 'Composite'], cost: 85, unit: 'sq ft', quantity: 3200, status: 'approved', supplier: 'Cladding Solutions LLC' }
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Design Header */}
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
            <Palette className="w-4 h-4 mr-2" />
            {designProgress.toFixed(1)}% Complete
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            {effectiveData.design_changes} Design Changes
          </Badge>
        </div>
      </div>

      {/* AI Design Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Lightbulb className="w-5 h-5 text-green-400" />
              AI Design Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{designPhases.find(phase => phase.id === 'construction-docs')?.progress.toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Design Progress</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{effectiveData.design_progress}%</div>
            <div className="text-sm text-muted-foreground">Budget Used</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{effectiveData.design_changes}</div>
            <div className="text-sm text-muted-foreground">Change Orders</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{effectiveData.approved_drawings}</div>
            <div className="text-sm text-muted-foreground">Docs Approved</div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-card/50 rounded-lg p-4">
          <p className="text-foreground text-sm">
            Design portfolio shows {designProgress.toFixed(1)}% completion with {effectiveData.design_changes} design changes submitted. {effectiveData.revision_cycles} revision cycles completed.
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
              <li>• Construction documents at {designPhases.find(phase => phase.id === 'construction-docs')?.progress.toFixed(2)}% with {designPhases.find(phase => phase.id === 'construction-docs')?.documents} documents</li>
              <li>• Material selections {materialSelections.filter(m => m.status === 'approved').length} approved, {materialSelections.filter(m => m.status === 'pending-approval').length} pending</li>
              <li>• Design team delivering {designProgress.toFixed(1)}% completion across all phases</li>
              <li>• Quality submissions showing {recentDesignSubmissions.filter(s => s.status === 'approved').length} approvals vs {recentDesignSubmissions.filter(s => s.status === 'pending-approval').length} pending</li>
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
                <span>Prioritize lobby marble selection approval to maintain critical path</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">→</span>
                <span>Accelerate shop drawing reviews to prevent downstream delays</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">→</span>
                <span>Schedule material supplier coordination meetings for floors 3-4</span>
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
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-blue-600 hover:bg-blue-700 text-foreground">
              <FileImage className="w-4 h-4 mr-2" />
              Upload Design
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Eye className="w-4 h-4 mr-2" />
              Review Submissions
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <MessageSquare className="w-4 h-4 mr-2" />
              Designer Meeting
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Download className="w-4 h-4 mr-2" />
              Download Plans
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Ruler className="w-4 h-4 mr-2" />
              3D Model View
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Design KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Design Progress */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Design Progress</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{designProgress.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">{effectiveData.approved_drawings}/{effectiveData.total_drawings} documents</div>
            <Progress value={designProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Design Budget */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Design Budget</CardTitle>
            <PaintBucket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{effectiveData.stakeholder_approvals}</div>
            <div className="text-xs text-muted-foreground mt-1">stakeholder approvals</div>
            <div className="text-xs text-muted-foreground mt-1">
              {effectiveData.revision_cycles} revision cycles
            </div>
          </CardContent>
        </Card>

        {/* Change Orders */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Change Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{effectiveData.design_changes}</div>
            <div className="text-xs text-muted-foreground mt-1">{effectiveData.revision_cycles} revision cycles</div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{recentDesignSubmissions.filter(s => s.status === 'pending-approval').length}</div>
            <div className="text-xs text-muted-foreground mt-1">submissions waiting</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Design Phase Progress */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Layers className="h-5 w-5 text-muted-foreground" />
              Design Phase Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {designPhases.map((phase) => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{phase.name}</span>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status === 'completed' ? 'Complete' : 
                       phase.status === 'in-progress' ? `${phase.progress.toFixed(2)}%` : 'Pending'}
                    </Badge>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{phase.documents} documents</span>
                    <span>Due: {phase.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Selection Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Square className="h-5 w-5 text-muted-foreground" />
              Material Selection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materialSelections.map((material, index) => (
                <div key={index} className="p-3 rounded-md bg-card/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{material.category}</span>
                    <Badge className={getStatusColor(material.status)}>
                      {material.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Selected: {material.selected}
                  </div>
                  <div className="text-sm text-foreground">
                    <span className="font-medium">${material.cost.toLocaleString()}</span> per {material.unit} • 
                    <span className="text-muted-foreground">{material.quantity.toLocaleString()} {material.unit}s</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Design Submissions */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <FileImage className="h-5 w-5 text-muted-foreground" />
              Recent Design Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDesignSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center gap-4 p-3 rounded-md bg-card/50 border border-border">
                  <div className={`w-2 h-2 rounded-full ${
                    submission.status === 'approved' ? 'bg-green-500' :
                    submission.status === 'pending-approval' ? 'bg-yellow-500' :
                    submission.status === 'revisions-requested' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{submission.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {submission.type} • {submission.submittedBy} • {submission.submittedDate}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      ${submission.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Design Team Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Users className="h-5 w-5 text-muted-foreground" />
              Design Team Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-md bg-card/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">Overall Performance</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {effectiveData.approved_drawings} of {effectiveData.total_drawings} documents approved
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-foreground">6</div>
                <div className="text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-foreground">95%</div>
                <div className="text-muted-foreground">Avg Performance</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-foreground">{effectiveData.design_changes}</div>
                <div className="text-muted-foreground">Change Orders</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-foreground">18</div>
                <div className="text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Team Performance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Palette className="h-5 w-5 text-muted-foreground" />
            Design Team & Consultants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Arc Design Studio', role: 'Lead Architect', contact: 'Sarah Chen', performance: 95, deliverables: 28 },
              { name: 'Structural Pro', role: 'Structural Engineer', contact: 'James Wright', performance: 92, deliverables: 15 },
              { name: 'MEP Solutions', role: 'MEP Engineer', contact: 'Lisa Rodriguez', performance: 88, deliverables: 22 },
              { name: 'Interior Concepts', role: 'Interior Designer', contact: 'David Kim', performance: 96, deliverables: 18 },
              { name: 'Landscape Plus', role: 'Landscape Architect', contact: 'Maria Garcia', performance: 90, deliverables: 8 },
              { name: 'Lighting Experts', role: 'Lighting Consultant', contact: 'Tom Wilson', performance: 94, deliverables: 12 }
            ].map((team, index) => (
              <div key={index} className="p-3 rounded-md bg-card/50 border border-border">
                <div className="font-medium text-foreground">{team.name}</div>
                <div className="text-sm text-muted-foreground">{team.role}</div>
                <div className="text-sm text-muted-foreground">{team.contact}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="text-foreground">{team.performance}%</span>
                  </div>
                  <Progress value={team.performance} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {team.deliverables} deliverables
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignDashboard;
