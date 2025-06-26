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

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <FileImage className="w-4 h-4 mr-2" />
              Upload Design
            </Button>
            <Button variant="outline" className="justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Review Submissions
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Designer Meeting
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Download Plans
            </Button>
            <Button variant="outline" className="justify-start">
              <Ruler className="w-4 h-4 mr-2" />
              3D Model View
            </Button>
            <Button variant="outline" className="justify-start">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Changes
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
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
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Selected: {material.selected}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">${material.cost.toLocaleString()}</span> per {material.unit} • 
                    <span className="text-slate-600 dark:text-slate-400">{material.quantity.toLocaleString()} {material.unit}s</span>
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
                    <div className="text-sm text-slate-600 dark:text-slate-400">
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

        {/* Design Team Summary */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-6 w-6 text-blue-600" />
              Design Team Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-800 dark:text-purple-200">Overall Performance</span>
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                {designMetrics.documentsApproved} of {designMetrics.totalDocuments} documents approved
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-purple-600">6</div>
                <div className="text-slate-600 dark:text-slate-400">Team Members</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-pink-600">95%</div>
                <div className="text-slate-600 dark:text-slate-400">Avg Performance</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-rose-600">{designMetrics.changeOrders}</div>
                <div className="text-slate-600 dark:text-slate-400">Change Orders</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">18</div>
                <div className="text-slate-600 dark:text-slate-400">Active Projects</div>
              </div>
            </div>
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
                <div className="text-sm text-slate-600 dark:text-slate-400">{team.role}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{team.contact}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance</span>
                    <span>{team.performance}%</span>
                  </div>
                  <Progress value={team.performance} className="h-2" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
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
