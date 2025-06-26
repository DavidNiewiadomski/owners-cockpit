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
  Square
} from 'lucide-react';
import { luxuryOfficeProject } from '@/data/sampleProjectData';

interface DesignDashboardProps {
  projectId: string;
}

const DesignDashboard: React.FC<DesignDashboardProps> = ({ projectId }) => {
  const project = luxuryOfficeProject;

  // Design-specific data
  const designPhases = [
    { 
      id: 'concept', 
      name: 'Conceptual Design', 
      status: 'completed', 
      progress: 100, 
      documents: 15,
      dueDate: '2023-09-15',
      approvalDate: '2023-09-20'
    },
    { 
      id: 'schematic', 
      name: 'Schematic Design', 
      status: 'completed', 
      progress: 100, 
      documents: 28,
      dueDate: '2023-11-30',
      approvalDate: '2023-12-05'
    },
    { 
      id: 'design-dev', 
      name: 'Design Development', 
      status: 'completed', 
      progress: 100, 
      documents: 45,
      dueDate: '2024-02-15',
      approvalDate: '2024-02-18'
    },
    { 
      id: 'construction-docs', 
      name: 'Construction Documents', 
      status: 'in-progress', 
      progress: 85, 
      documents: 67,
      dueDate: '2024-07-30',
      approvalDate: null
    },
    { 
      id: 'shop-drawings', 
      name: 'Shop Drawings Review', 
      status: 'in-progress', 
      progress: 45, 
      documents: 23,
      dueDate: '2024-10-15',
      approvalDate: null
    }
  ];

  const recentDesignSubmissions = [
    {
      id: 1,
      title: 'Lobby Marble Selection - Final',
      type: 'Material Selection',
      submittedBy: 'Sarah Chen',
      submittedDate: '2024-06-20',
      status: 'pending-approval',
      priority: 'high',
      category: 'Interior Finishes',
      estimatedCost: 125000
    },
    {
      id: 2,
      title: 'Elevator Cab Design Options',
      type: 'Design Review',
      submittedBy: 'Arc Design Studio',
      submittedDate: '2024-06-18',
      status: 'approved',
      priority: 'medium',
      category: 'Vertical Transportation',
      estimatedCost: 85000
    },
    {
      id: 3,
      title: 'Rooftop Garden Layout',
      type: 'Landscape Design',
      submittedBy: 'Green Space Designs',
      submittedDate: '2024-06-15',
      status: 'revisions-requested',
      priority: 'medium',
      category: 'Landscape',
      estimatedCost: 45000
    },
    {
      id: 4,
      title: 'Exterior Lighting Scheme',
      type: 'Lighting Design',
      submittedBy: 'Illumination Experts',
      submittedDate: '2024-06-12',
      status: 'approved',
      priority: 'low',
      category: 'Exterior',
      estimatedCost: 35000
    }
  ];

  const materialSelections = [
    {
      category: 'Lobby Flooring',
      selected: 'Calacatta Gold Marble',
      alternatives: ['Nero Marquina', 'Carrara White'],
      cost: 45,
      unit: 'sq ft',
      quantity: 2800,
      status: 'pending-approval',
      supplier: 'Premium Stone Co.'
    },
    {
      category: 'Exterior Cladding',
      selected: 'Curtain Wall - Clear Glass',
      alternatives: ['Tinted Glass', 'Ceramic Panel'],
      cost: 85,
      unit: 'sq ft',
      quantity: 35000,
      status: 'approved',
      supplier: 'Modern Facades Ltd.'
    },
    {
      category: 'Interior Doors',
      selected: 'Walnut Wood Veneer',
      alternatives: ['Oak Veneer', 'Painted Steel'],
      cost: 1200,
      unit: 'door',
      quantity: 180,
      status: 'approved',
      supplier: 'Custom Millwork Inc.'
    },
    {
      category: 'Lighting Fixtures',
      selected: 'LED Recessed + Pendant',
      alternatives: ['Traditional Fluorescent', 'Track Lighting'],
      cost: 450,
      unit: 'fixture',
      quantity: 850,
      status: 'in-review',
      supplier: 'Lighting Solutions Pro'
    }
  ];

  const designMetrics = {
    totalDesignBudget: 1200000,
    spentToDate: 850000,
    documentsApproved: 143,
    totalDocuments: 178,
    changeOrders: 8,
    totalChangeOrderValue: 125000
  };

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
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const designProgress = (designMetrics.documentsApproved / designMetrics.totalDocuments) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 p-6 space-y-8">
      {/* Design Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            Design Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            {project.name} • Architectural Design & Materials
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2 text-sm">
            <Palette className="w-4 h-4 mr-2" />
            {designProgress.toFixed(1)}% Complete
          </Badge>
          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 px-4 py-2 text-sm">
            {designMetrics.changeOrders} Change Orders
          </Badge>
        </div>
      </div>

      {/* Design KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Design Progress */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Design Progress</CardTitle>
            <Palette className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{designProgress.toFixed(1)}%</div>
            <div className="text-sm text-purple-100 mt-1">{designMetrics.documentsApproved}/{designMetrics.totalDocuments} documents</div>
            <Progress value={designProgress} className="mt-3 bg-white/20" />
          </CardContent>
        </Card>

        {/* Design Budget */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Design Budget</CardTitle>
            <PaintBucket className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">${(designMetrics.spentToDate / 1000).toFixed(0)}K</div>
            <div className="text-sm text-pink-100 mt-1">of ${(designMetrics.totalDesignBudget / 1000).toFixed(0)}K budget</div>
            <div className="flex items-center mt-2 text-pink-100">
              <span className="text-sm">{((designMetrics.spentToDate / designMetrics.totalDesignBudget) * 100).toFixed(1)}% used</span>
            </div>
          </CardContent>
        </Card>

        {/* Change Orders */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Change Orders</CardTitle>
            <AlertCircle className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{designMetrics.changeOrders}</div>
            <div className="text-sm text-rose-100 mt-1">${(designMetrics.totalChangeOrderValue / 1000).toFixed(0)}K total value</div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Pending Approvals</CardTitle>
            <Clock className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{recentDesignSubmissions.filter(s => s.status === 'pending-approval').length}</div>
            <div className="text-sm text-orange-100 mt-1">submissions waiting</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Design Phase Progress */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Layers className="h-6 w-6 text-purple-600" />
              Design Phase Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {designPhases.map((phase) => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{phase.name}</span>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status === 'completed' ? 'Complete' : 
                       phase.status === 'in-progress' ? `${phase.progress}%` : 'Pending'}
                    </Badge>
                  </div>
                  <Progress value={phase.progress} className="h-3" />
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
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Square className="h-6 w-6 text-pink-600" />
              Material Selection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materialSelections.map((material, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{material.category}</span>
                    <Badge className={getStatusColor(material.status)}>
                      {material.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Selected: {material.selected}
                  </div>
                  <div className="text-sm">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Design Submissions */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileImage className="h-6 w-6 text-rose-600" />
              Recent Design Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDesignSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className={`w-3 h-3 rounded-full ${
                    submission.status === 'approved' ? 'bg-green-500' :
                    submission.status === 'pending-approval' ? 'bg-yellow-500' :
                    submission.status === 'revisions-requested' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{submission.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {submission.type} • {submission.submittedBy} • {submission.submittedDate}
                    </div>
                    <div className="text-sm font-medium text-green-600">
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

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-6 w-6 text-orange-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <FileImage className="w-4 h-4 mr-2" />
              Upload Design
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Review Submissions
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Designer Meeting
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Download Plans
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Ruler className="w-4 h-4 mr-2" />
              3D Model View
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Design Team Performance */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-6 w-6 text-purple-600" />
            Design Team & Consultants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Arc Design Studio', role: 'Lead Architect', contact: 'Sarah Chen', performance: 95, deliverables: 28 },
              { name: 'Structural Pro', role: 'Structural Engineer', contact: 'James Wright', performance: 92, deliverables: 15 },
              { name: 'MEP Solutions', role: 'MEP Engineer', contact: 'Lisa Rodriguez', performance: 88, deliverables: 22 },
              { name: 'Interior Concepts', role: 'Interior Designer', contact: 'David Kim', performance: 96, deliverables: 18 },
              { name: 'Landscape Plus', role: 'Landscape Architect', contact: 'Maria Garcia', performance: 90, deliverables: 8 },
              { name: 'Lighting Experts', role: 'Lighting Consultant', contact: 'Tom Wilson', performance: 94, deliverables: 12 }
            ].map((team, index) => (
              <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="font-medium">{team.name}</div>
                <div className="text-sm text-muted-foreground">{team.role}</div>
                <div className="text-sm text-muted-foreground">{team.contact}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance</span>
                    <span>{team.performance}%</span>
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Palette className="h-8 w-8 text-purple-600" />
            Design Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Architectural plans, material selections, and design approvals
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            {designProgress.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Design Complete
          </div>
        </div>
      </div>

      {/* Design Phase Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {designPhases.map((phase) => (
          <Card key={phase.id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{phase.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{phase.progress}%</span>
                  <Badge variant="outline" className={getStatusColor(phase.status)}>
                    {phase.status === 'completed' ? 'Done' :
                     phase.status === 'in-progress' ? 'Active' : 'Upcoming'}
                  </Badge>
                </div>
                <Progress value={phase.progress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {phase.documents} documents
                </div>
                <div className="text-xs text-muted-foreground">
                  Due: {phase.dueDate}
                </div>
                {phase.approvalDate && (
                  <div className="text-xs text-green-600">
                    ✓ Approved: {phase.approvalDate}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Design Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Design Budget</CardTitle>
            <PaintBucket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(designMetrics.spentToDate / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-muted-foreground">
              of ${(designMetrics.totalDesignBudget / 1000).toFixed(0)}K budget
            </div>
            <Progress 
              value={(designMetrics.spentToDate / designMetrics.totalDesignBudget) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designMetrics.documentsApproved}</div>
            <div className="text-xs text-muted-foreground">
              of {designMetrics.totalDocuments} approved
            </div>
            <Progress value={designProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Change Orders</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designMetrics.changeOrders}</div>
            <div className="text-xs text-muted-foreground">
              ${(designMetrics.totalChangeOrderValue / 1000).toFixed(0)}K value
            </div>
            <div className="text-xs text-orange-600 mt-1">
              +{((designMetrics.totalChangeOrderValue / designMetrics.totalDesignBudget) * 100).toFixed(1)}% budget impact
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sustainability</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {project.sustainability.currentScore}
            </div>
            <div className="text-xs text-muted-foreground">
              LEED points (Target: {project.sustainability.requiredScore})
            </div>
            <Progress 
              value={(project.sustainability.currentScore / 100) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Design Submissions & Material Selections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Recent Design Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDesignSubmissions.map((submission) => (
              <div key={submission.id} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{submission.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {submission.type} • {submission.category}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      By {submission.submittedBy} • {submission.submittedDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(submission.status)}>
                      {submission.status.replace('-', ' ')}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      ${submission.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Comment
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Material Selections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              Material Selections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {materialSelections.map((material, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{material.category}</div>
                    <div className="text-xs text-blue-600 font-medium">
                      {material.selected}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {material.supplier}
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(material.status)}>
                    {material.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Cost:</span> 
                    <span className="font-medium ml-1">
                      ${material.cost}/{material.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium ml-1">
                      {material.quantity.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-1">
                  Total: ${(material.cost * material.quantity).toLocaleString()}
                </div>
                
                {material.alternatives.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Alternatives: {material.alternatives.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Design Team & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Design Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Design Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border">
              <div className="font-medium text-sm">Sarah Chen</div>
              <div className="text-xs text-muted-foreground">Lead Architect</div>
              <div className="text-xs text-muted-foreground">Arc Design Studio</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="text-xs">Active</Badge>
                <span className="text-xs text-green-600">98% approval rate</span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border">
              <div className="font-medium text-sm">Lisa Wang</div>
              <div className="text-xs text-muted-foreground">Interior Designer</div>
              <div className="text-xs text-muted-foreground">Arc Design Studio</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="text-xs">Active</Badge>
                <span className="text-xs text-green-600">95% approval rate</span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border">
              <div className="font-medium text-sm">David Kim</div>
              <div className="text-xs text-muted-foreground">Landscape Architect</div>
              <div className="text-xs text-muted-foreground">Green Space Designs</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">Consultant</Badge>
                <span className="text-xs text-yellow-600">85% approval rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 rounded border border-orange-200 bg-orange-50">
              <div className="text-sm font-medium">Lobby Marble Selection</div>
              <div className="text-xs text-muted-foreground">Due: Today</div>
              <div className="text-xs text-orange-600">High Priority</div>
            </div>
            
            <div className="p-2 rounded border border-yellow-200 bg-yellow-50">
              <div className="text-sm font-medium">Lighting Fixture Package</div>
              <div className="text-xs text-muted-foreground">Due: Jun 25</div>
              <div className="text-xs text-yellow-600">Medium Priority</div>
            </div>
            
            <div className="p-2 rounded border border-blue-200 bg-blue-50">
              <div className="text-sm font-medium">Rooftop Garden Revisions</div>
              <div className="text-xs text-muted-foreground">Due: Jun 28</div>
              <div className="text-xs text-blue-600">Low Priority</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-sm">
              <FileImage className="h-4 w-4 mr-2" />
              Review Design Submissions
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <PaintBucket className="h-4 w-4 mr-2" />
              Approve Material Selections
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <Ruler className="h-4 w-4 mr-2" />
              View 3D Models
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <Layers className="h-4 w-4 mr-2" />
              Process Change Orders
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Design Team
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export Plans (PDF)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DesignDashboard;
