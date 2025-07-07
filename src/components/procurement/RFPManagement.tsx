import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RFPCreationWizard } from './RFPCreationWizard';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  Copy,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  Package,
  Truck,
  Settings,
  BarChart3,
  Target,
  Globe,
  Shield,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RFP {
  id: string;
  rfpNumber: string;
  title: string;
  description: string;
  category: string;
  division: string;
  estimatedValue: number;
  status: 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  publishDate: string;
  dueDate: string;
  awardDate?: string;
  responseCount: number;
  qualifiedBidders: number;
  prequalificationRequired: boolean;
  bondRequired: boolean;
  insuranceRequired: boolean;
  projectLocation: string;
  projectType: string;
  duration: string;
  tags: string[];
  contacts: {
    projectManager: string;
    procurementLead: string;
    technicalLead: string;
  };
  documents: {
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }[];
  amendments: number;
  clarifications: number;
  lastActivity: string;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface RFPManagementProps {
  projectDetails?: any; // Define proper types based on actual usage
  onScopeBuild?: (details: any) => void;
  projectId?: string;
  onSelectRFP?: (rfpId: string) => void;
  onCreateRFP?: () => void;
  onBidAnalysis?: (rfpId: string) => void;
  onAward?: (rfpId: string) => void;
}

export function RFPManagement({ onSelectRFP, onCreateRFP }: RFPManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRFPs, setSelectedRFPs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const { toast } = useToast();

  // Mock RFP data - would come from API
  const rfps: RFP[] = [
    {
      id: 'RFP-2024-001',
      rfpNumber: 'RFP-2024-001',
      title: 'Structural Steel Fabrication and Installation',
      description: 'Supply and installation of structural steel framework for main building including all connections, hardware, and field assembly.',
      category: 'Structural',
      division: 'Division 05 - Metals',
      estimatedValue: 3200000,
      status: 'published',
      priority: 'high',
      publishDate: '2024-08-15',
      dueDate: '2024-09-15',
      responseCount: 7,
      qualifiedBidders: 5,
      prequalificationRequired: true,
      bondRequired: true,
      insuranceRequired: true,
      projectLocation: 'Downtown District, Phase 1',
      projectType: 'Commercial High-Rise',
      duration: '180 days',
      tags: ['structural', 'steel', 'fabrication', 'high-rise'],
      contacts: {
        projectManager: 'Sarah Johnson',
        procurementLead: 'Michael Chen',
        technicalLead: 'David Rodriguez'
      },
      documents: [
        { name: 'RFP_Document.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2024-08-15' },
        { name: 'Technical_Specifications.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2024-08-15' },
        { name: 'Drawings_Package.dwg', type: 'DWG', size: '45.2 MB', uploadDate: '2024-08-16' }
      ],
      amendments: 2,
      clarifications: 8,
      lastActivity: '2024-08-28',
      complianceScore: 92,
      riskLevel: 'low'
    },
    {
      id: 'RFP-2024-002',
      rfpNumber: 'RFP-2024-002',
      title: 'MEP Systems Installation Package',
      description: 'Complete mechanical, electrical, and plumbing systems including HVAC, fire protection, lighting, and power distribution.',
      category: 'MEP',
      division: 'Division 23 - HVAC',
      estimatedValue: 5800000,
      status: 'closed',
      priority: 'critical',
      publishDate: '2024-07-20',
      dueDate: '2024-08-30',
      responseCount: 12,
      qualifiedBidders: 8,
      prequalificationRequired: true,
      bondRequired: true,
      insuranceRequired: true,
      projectLocation: 'Downtown District, All Phases',
      projectType: 'Mixed-Use Development',
      duration: '240 days',
      tags: ['mep', 'hvac', 'electrical', 'plumbing', 'fire-safety'],
      contacts: {
        projectManager: 'Jennifer Liu',
        procurementLead: 'Robert Kim',
        technicalLead: 'Maria Santos'
      },
      documents: [
        { name: 'MEP_RFP_Complete.pdf', type: 'PDF', size: '4.1 MB', uploadDate: '2024-07-20' },
        { name: 'HVAC_Specifications.pdf', type: 'PDF', size: '2.2 MB', uploadDate: '2024-07-20' },
        { name: 'Electrical_Plans.pdf', type: 'PDF', size: '3.8 MB', uploadDate: '2024-07-21' },
        { name: 'Fire_Protection_Standards.pdf', type: 'PDF', size: '1.5 MB', uploadDate: '2024-07-22' }
      ],
      amendments: 3,
      clarifications: 15,
      lastActivity: '2024-08-30',
      complianceScore: 88,
      riskLevel: 'medium'
    },
    {
      id: 'RFP-2024-003',
      rfpNumber: 'RFP-2024-003',
      title: 'Concrete Supply and Placement Services',
      description: 'Ready-mix concrete supply and placement services for foundations, slabs, and structural elements.',
      category: 'Concrete',
      division: 'Division 03 - Concrete',
      estimatedValue: 1850000,
      status: 'awarded',
      priority: 'medium',
      publishDate: '2024-07-01',
      dueDate: '2024-08-15',
      awardDate: '2024-08-25',
      responseCount: 9,
      qualifiedBidders: 7,
      prequalificationRequired: false,
      bondRequired: true,
      insuranceRequired: true,
      projectLocation: 'Downtown District, Phase 1',
      projectType: 'Commercial High-Rise',
      duration: '120 days',
      tags: ['concrete', 'ready-mix', 'placement', 'foundations'],
      contacts: {
        projectManager: 'Thomas Anderson',
        procurementLead: 'Lisa Wang',
        technicalLead: 'Carlos Mendez'
      },
      documents: [
        { name: 'Concrete_RFP.pdf', type: 'PDF', size: '1.9 MB', uploadDate: '2024-07-01' },
        { name: 'Mix_Design_Requirements.pdf', type: 'PDF', size: '980 KB', uploadDate: '2024-07-01' },
        { name: 'Quality_Control_Plan.pdf', type: 'PDF', size: '1.2 MB', uploadDate: '2024-07-02' }
      ],
      amendments: 1,
      clarifications: 6,
      lastActivity: '2024-08-25',
      complianceScore: 95,
      riskLevel: 'low'
    },
    {
      id: 'RFP-2024-004',
      rfpNumber: 'RFP-2024-004',
      title: 'Curtain Wall System Design-Build',
      description: 'Design-build package for high-performance curtain wall system including engineering, fabrication, and installation.',
      category: 'Facade',
      division: 'Division 08 - Openings',
      estimatedValue: 4200000,
      status: 'draft',
      priority: 'high',
      publishDate: '',
      dueDate: '2024-10-15',
      responseCount: 0,
      qualifiedBidders: 0,
      prequalificationRequired: true,
      bondRequired: true,
      insuranceRequired: true,
      projectLocation: 'Downtown District, Phase 2',
      projectType: 'Commercial High-Rise',
      duration: '200 days',
      tags: ['curtain-wall', 'facade', 'design-build', 'glazing'],
      contacts: {
        projectManager: 'Amanda Foster',
        procurementLead: 'Kevin Park',
        technicalLead: 'Elena Volkov'
      },
      documents: [
        { name: 'Draft_RFP_Curtain_Wall.pdf', type: 'PDF', size: '3.2 MB', uploadDate: '2024-08-20' },
        { name: 'Performance_Specifications.pdf', type: 'PDF', size: '2.1 MB', uploadDate: '2024-08-20' }
      ],
      amendments: 0,
      clarifications: 0,
      lastActivity: '2024-08-28',
      complianceScore: 85,
      riskLevel: 'medium'
    },
    {
      id: 'RFP-2024-005',
      rfpNumber: 'RFP-2024-005',
      title: 'Site Utilities and Infrastructure',
      description: 'Underground utilities including water, sewer, storm drainage, electrical service, and telecommunications infrastructure.',
      category: 'Sitework',
      division: 'Division 33 - Utilities',
      estimatedValue: 2100000,
      status: 'published',
      priority: 'high',
      publishDate: '2024-08-25',
      dueDate: '2024-09-25',
      responseCount: 4,
      qualifiedBidders: 3,
      prequalificationRequired: true,
      bondRequired: true,
      insuranceRequired: true,
      projectLocation: 'Downtown District, Site-wide',
      projectType: 'Infrastructure',
      duration: '150 days',
      tags: ['utilities', 'infrastructure', 'underground', 'site-prep'],
      contacts: {
        projectManager: 'Brian Thompson',
        procurementLead: 'Diana Chang',
        technicalLead: 'Alex Petrov'
      },
      documents: [
        { name: 'Utilities_RFP.pdf', type: 'PDF', size: '2.7 MB', uploadDate: '2024-08-25' },
        { name: 'Site_Survey_Data.pdf', type: 'PDF', size: '5.4 MB', uploadDate: '2024-08-25' },
        { name: 'Utility_Coordination_Plan.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2024-08-26' }
      ],
      amendments: 0,
      clarifications: 3,
      lastActivity: '2024-08-29',
      complianceScore: 90,
      riskLevel: 'medium'
    }
  ];

  const filteredRFPs = useMemo(() => {
    return rfps.filter(rfp => {
      const matchesSearch = rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfp.rfpNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfp.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || rfp.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || rfp.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || rfp.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [rfps, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'closed': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'awarded': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-blue-500';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleCreateRFP = () => {
    setShowCreateDialog(true);
  };

  const handleSubmitRFP = async (data: any) => {
    try {
      // Simulate API call to create RFP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close dialog
      setShowCreateDialog(false);
      
      // Show success message
      toast({
        title: "RFP Created",
        description: "New RFP has been created successfully."
      });

      // Callback if provided
      if (onCreateRFP) {
        onCreateRFP();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create RFP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectRFP = (rfpId: string) => {
    if (onSelectRFP) {
      onSelectRFP(rfpId);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedRFPs.length === 0) {
      toast({
        title: "No RFPs Selected",
        description: "Please select RFPs to perform bulk actions.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedRFPs.length} RFP(s).`,
    });
  };

  const stats = {
    total: rfps.length,
    published: rfps.filter(r => r.status === 'published').length,
    closed: rfps.filter(r => r.status === 'closed').length,
    awarded: rfps.filter(r => r.status === 'awarded').length,
    draft: rfps.filter(r => r.status === 'draft').length,
    totalValue: rfps.reduce((sum, r) => sum + r.estimatedValue, 0),
    avgResponseRate: Math.round(rfps.reduce((sum, r) => sum + r.responseCount, 0) / rfps.length),
    criticalPriority: rfps.filter(r => r.priority === 'critical').length
  };

  return (
    <div className="space-y-6">
      {/* Header and Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">RFP Management</h2>
          <p className="text-muted-foreground">Create, manage, and track Request for Proposals</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <FileText className="w-4 h-4 mr-2" />
            {stats.total} Total RFPs
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <DollarSign className="w-4 h-4 mr-2" />
            ${(stats.totalValue / 1000000).toFixed(1)}M Value
          </Badge>
          <Button onClick={handleCreateRFP}>
            <Plus className="w-4 h-4 mr-2" />
            Create RFP
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.published}</div>
                <div className="text-sm text-muted-foreground">Published</div>
              </div>
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.closed}</div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.awarded}</div>
                <div className="text-sm text-muted-foreground">Awarded</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
                <div className="text-sm text-muted-foreground">Draft</div>
              </div>
              <Edit className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.avgResponseRate}</div>
                <div className="text-sm text-muted-foreground">Avg Responses</div>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-rose-400">{stats.criticalPriority}</div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-rose-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search RFPs by title, number, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="awarded">Awarded</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Structural">Structural</SelectItem>
                  <SelectItem value="MEP">MEP</SelectItem>
                  <SelectItem value="Concrete">Concrete</SelectItem>
                  <SelectItem value="Facade">Facade</SelectItem>
                  <SelectItem value="Sitework">Sitework</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  toast({
                    title: "Advanced RFP Filters",
                    description: "Opening advanced filter options for RFPs",
                  });
                }}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {selectedRFPs.length > 0 && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">{selectedRFPs.length} RFP(s) selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Export')}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Archive')}>
                Archive
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedRFPs([])}>
                Clear Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RFP Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Active RFPs ({filteredRFPs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRFPs.length === filteredRFPs.length && filteredRFPs.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRFPs(filteredRFPs.map(rfp => rfp.id));
                      } else {
                        setSelectedRFPs([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>RFP</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRFPs.map((rfp) => (
                <TableRow key={rfp.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedRFPs.includes(rfp.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRFPs([...selectedRFPs, rfp.id]);
                        } else {
                          setSelectedRFPs(selectedRFPs.filter(id => id !== rfp.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{rfp.title}</div>
                      <div className="text-sm text-muted-foreground">{rfp.rfpNumber}</div>
                      <div className="flex gap-1 flex-wrap">
                        {rfp.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{rfp.category}</div>
                      <div className="text-sm text-muted-foreground">{rfp.division}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${rfp.estimatedValue.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(rfp.status)}>
                      {rfp.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(rfp.priority)}>
                      {rfp.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{rfp.dueDate}</div>
                      {rfp.status === 'published' && (
                        <div className="text-xs text-muted-foreground">
                          {Math.ceil((new Date(rfp.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{rfp.responseCount}</div>
                      <div className="text-xs text-muted-foreground">
                        {rfp.qualifiedBidders} qualified
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{rfp.complianceScore}%</div>
                      <Progress value={rfp.complianceScore} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getRiskColor(rfp.riskLevel)}`}>
                      {rfp.riskLevel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSelectRFP(rfp.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Edit RFP",
                            description: `Opening editor for ${rfp.title}`,
                          });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Export RFP",
                            description: `Exporting ${rfp.title} documents`,
                          });
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "More Options",
                            description: "Additional RFP actions menu",
                          });
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create RFP Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <RFPCreationWizard 
            onClose={() => setShowCreateDialog(false)}
            onComplete={(data) => handleSubmitRFP(data)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
