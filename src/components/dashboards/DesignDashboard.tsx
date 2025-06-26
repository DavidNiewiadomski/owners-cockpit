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
import { getDashboardTitle } from '@/utils/dashboardUtils';

interface DesignDashboardProps {
  projectId: string;
  activeCategory: string;
}

const DesignDashboard: React.FC<DesignDashboardProps> = ({ projectId, activeCategory }) => {
  const project = luxuryOfficeProject;
  const { title, subtitle } = getDashboardTitle(activeCategory, projectId);

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
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* Design Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            <Palette className="w-4 h-4 mr-2" />
            {designProgress.toFixed(1)}% Complete
          </Badge>
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
            {designMetrics.changeOrders} Change Orders
          </Badge>
        </div>
      </div>

      {/* AI Design Insights */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Lightbulb className="w-5 h-5 text-green-400" />
              AI Design Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{designPhases.find(phase => phase.id === 'construction-docs')?.progress}%</div>
            <div className="text-sm text-slate-400">Design Progress</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{((designMetrics.spentToDate / designMetrics.totalDesignBudget) * 100).toFixed(1)}%</div>
            <div className="text-sm text-slate-400">Budget Used</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{designMetrics.changeOrders}</div>
            <div className="text-sm text-slate-400">Change Orders</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{designMetrics.documentsApproved}</div>
            <div className="text-sm text-slate-400">Docs Approved</div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-slate-300 text-sm">
            Design portfolio shows {designPhases.find(phase => phase.id === 'construction-docs')?.progress}% completion with {((designMetrics.spentToDate / designMetrics.totalDesignBudget) * 100).toFixed(1)}% budget utilization. {designMetrics.changeOrders} change orders pending review. Lobby marble selection requires immediate approval for schedule alignment.
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
              <li>• Construction documents at {designPhases.find(phase => phase.id === 'construction-docs')?.progress}% with {designPhases.find(phase => phase.id === 'construction-docs')?.documents} documents</li>
              <li>• Material selections {materialSelections.filter(m => m.status === 'approved').length} approved, {materialSelections.filter(m => m.status === 'pending-approval').length} pending</li>
              <li>• Design team delivering {designProgress.toFixed(1)}% completion across all phases</li>
              <li>• Quality submissions showing {recentDesignSubmissions.filter(s => s.status === 'approved').length} approvals vs {recentDesignSubmissions.filter(s => s.status === 'pending-approval').length} pending</li>
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
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <Lightbulb className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-blue-600 hover:bg-blue-700 text-white">
              <FileImage className="w-4 h-4 mr-2" />
              Upload Design
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Eye className="w-4 h-4 mr-2" />
              Review Submissions
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <MessageSquare className="w-4 h-4 mr-2" />
              Designer Meeting
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Download Plans
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Ruler className="w-4 h-4 mr-2" />
              3D Model View
            </Button>
            <Button variant="outline" className="justify-start border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Design KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Design Progress */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Design Progress</CardTitle>
            <Palette className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{designProgress.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{designMetrics.documentsApproved}/{designMetrics.totalDocuments} documents</div>
            <Progress value={designProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Design Budget */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Design Budget</CardTitle>
            <PaintBucket className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${(designMetrics.spentToDate / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">of ${(designMetrics.totalDesignBudget / 1000).toFixed(0)}K budget</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {((designMetrics.spentToDate / designMetrics.totalDesignBudget) * 100).toFixed(1)}% used
            </div>
          </CardContent>
        </Card>

        {/* Change Orders */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Change Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{designMetrics.changeOrders}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">${(designMetrics.totalChangeOrderValue / 1000).toFixed(0)}K total value</div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{recentDesignSubmissions.filter(s => s.status === 'pending-approval').length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">submissions waiting</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Design Phase Progress */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Layers className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Design Phase Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {designPhases.map((phase) => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{phase.name}</span>
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status === 'completed' ? 'Complete' : 
                       phase.status === 'in-progress' ? `${phase.progress}%` : 'Pending'}
                    </Badge>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{phase.documents} documents</span>
                    <span>Due: {phase.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Material Selection Status */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Square className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Material Selection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materialSelections.map((material, index) => (
                <div key={index} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{material.category}</span>
                    <Badge className={getStatusColor(material.status)}>
                      {material.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Selected: {material.selected}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">${material.cost.toLocaleString()}</span> per {material.unit} • 
                    <span className="text-gray-600 dark:text-gray-400">{material.quantity.toLocaleString()} {material.unit}s</span>
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
        <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <FileImage className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Recent Design Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDesignSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center gap-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className={`w-2 h-2 rounded-full ${
                    submission.status === 'approved' ? 'bg-green-500' :
                    submission.status === 'pending-approval' ? 'bg-yellow-500' :
                    submission.status === 'revisions-requested' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{submission.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {submission.type} • {submission.submittedBy} • {submission.submittedDate}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Design Team Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Overall Performance</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {designMetrics.documentsApproved} of {designMetrics.totalDocuments} documents approved
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">6</div>
                <div className="text-gray-600 dark:text-gray-400">Team Members</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">95%</div>
                <div className="text-gray-600 dark:text-gray-400">Avg Performance</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">{designMetrics.changeOrders}</div>
                <div className="text-gray-600 dark:text-gray-400">Change Orders</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">18</div>
                <div className="text-gray-600 dark:text-gray-400">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Design Team Performance */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <Palette className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
              <div key={index} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-white">{team.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{team.role}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{team.contact}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Performance</span>
                    <span className="text-gray-900 dark:text-white">{team.performance}%</span>
                  </div>
                  <Progress value={team.performance} className="h-2" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
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
