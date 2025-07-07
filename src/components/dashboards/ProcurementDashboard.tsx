import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  BarChart3,
  Gavel,
  Trophy,
  Target,
  Building,
  Calendar,
  MessageSquare,
  Download,
  Plus,
  Eye,
  Filter,
  RefreshCw,
  Settings,
  Package,
  Truck,
  ClipboardCheck,
  Search,
  ArrowUpDown,
  Zap,
  PieChart,
  Activity,
  TrendingDown,
  FileCheck,
  UserCheck,
  AlertCircle,
  Star,
  Map,
  Phone,
  Mail,
  ExternalLink,
  Info
} from 'lucide-react';
import EnterpriseCRM from '@/components/crm/EnterpriseCRM';
import PerformanceScorecards from '@/components/procurement/PerformanceScorecards';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import { LevelingBoard } from '@/components/bidding/LevelingBoard';
import { EnhancedBidLevelingBoard } from '@/components/procurement/EnhancedBidLevelingBoard';
import { RFPManagement } from '@/components/procurement/RFPManagement';
import { VendorManagement } from '@/components/procurement/VendorManagement';
import { AwardCenter } from '@/components/procurement/AwardCenter';
import LeadTimeTracker from '@/components/procurement/LeadTimeTracker';
import { ComplianceVerification } from '@/components/procurement/ComplianceVerification';
import { useToast } from '@/hooks/use-toast';

interface ProcurementDashboardProps {
  projectId: string;
  activeCategory: string;
}

const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({ 
  projectId, 
  activeCategory 
}) => {
  const { data: projects = [] } = useProjects();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRfp, setSelectedRfp] = useState<string | null>(null);
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Procurement Overview' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle('Procurement', projectName);

  // Mock procurement data
  const procurementMetrics = {
    activeRFPs: 12,
    totalBids: 47,
    awardedContracts: 8,
    pendingApprovals: 5,
    totalContractValue: 24500000,
    avgBidTime: 18, // days
    complianceRate: 94,
    vendorCount: 156
  };

  const rfpData = [
    {
      id: 'RFP-2024-001',
      title: 'Structural Steel Supply and Installation',
      category: 'Structural',
      status: 'bidding',
      dueDate: '2024-09-15',
      estimatedValue: 3200000,
      bidCount: 7,
      daysRemaining: 12,
      compliance: 'high',
      priority: 'high'
    },
    {
      id: 'RFP-2024-002', 
      title: 'MEP Systems Installation',
      category: 'Mechanical',
      status: 'evaluation',
      dueDate: '2024-08-30',
      estimatedValue: 5800000,
      bidCount: 12,
      daysRemaining: 0,
      compliance: 'medium',
      priority: 'high'
    },
    {
      id: 'RFP-2024-003',
      title: 'Concrete Supply and Placement',
      category: 'Concrete',
      status: 'awarded',
      dueDate: '2024-08-15',
      estimatedValue: 1850000,
      bidCount: 9,
      daysRemaining: -15,
      compliance: 'high',
      priority: 'medium'
    },
    {
      id: 'RFP-2024-004',
      title: 'Glass Curtain Wall System',
      category: 'Facade',
      status: 'draft',
      dueDate: '2024-10-01',
      estimatedValue: 4200000,
      bidCount: 0,
      daysRemaining: 28,
      compliance: 'high',
      priority: 'high'
    }
  ];

  const vendorData = [
    {
      id: 'VEN-001',
      name: 'Metropolitan Steel Works',
      category: 'Structural',
      rating: 4.8,
      projects: 23,
      onTime: 96,
      value: 12300000,
      status: 'preferred',
      contact: 'John Smith',
      phone: '(555) 123-4567',
      email: 'j.smith@metrosteel.com'
    },
    {
      id: 'VEN-002',
      name: 'Advanced MEP Solutions',
      category: 'Mechanical',
      rating: 4.6,
      projects: 18,
      onTime: 89,
      value: 8900000,
      status: 'active',
      contact: 'Sarah Johnson',
      phone: '(555) 987-6543',
      email: 's.johnson@advancedmep.com'
    },
    {
      id: 'VEN-003',
      name: 'Premier Concrete Co.',
      category: 'Concrete',
      rating: 4.9,
      projects: 31,
      onTime: 98,
      value: 6700000,
      status: 'preferred',
      contact: 'Mike Rodriguez',
      phone: '(555) 456-7890',
      email: 'm.rodriguez@premierconcrete.com'
    },
    {
      id: 'VEN-004',
      name: 'Glass Tech Systems',
      category: 'Facade',
      rating: 4.5,
      projects: 14,
      onTime: 92,
      value: 5400000,
      status: 'active',
      contact: 'Lisa Chen',
      phone: '(555) 234-5678',
      email: 'l.chen@glasstech.com'
    }
  ];

  const contractData = [
    {
      id: 'CON-2024-001',
      vendor: 'Metropolitan Steel Works',
      title: 'Structural Steel Supply',
      value: 3200000,
      status: 'active',
      startDate: '2024-07-01',
      endDate: '2024-12-15',
      progress: 45,
      milestones: 4,
      completedMilestones: 2
    },
    {
      id: 'CON-2024-002',
      vendor: 'Premier Concrete Co.',
      title: 'Foundation Work',
      value: 1850000,
      status: 'completed',
      startDate: '2024-05-15',
      endDate: '2024-08-30',
      progress: 100,
      milestones: 5,
      completedMilestones: 5
    },
    {
      id: 'CON-2024-003',
      vendor: 'Advanced MEP Solutions',
      title: 'HVAC Installation',
      value: 2100000,
      status: 'pending',
      startDate: '2024-09-01',
      endDate: '2025-02-28',
      progress: 0,
      milestones: 6,
      completedMilestones: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'awarded':
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'bidding':
      case 'evaluation':
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-card text-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-card text-foreground border-border';
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-rfp':
        setActiveTab('rfp');
        break;
      case 'bid-leveling':
        setActiveTab('bidding');
        break;
      case 'award-contract':
        setActiveTab('awards');
        break;
      case 'vendor-management':
        setActiveTab('vendors');
        break;
      case 'compliance-check':
        setActiveTab('compliance');
        toast({
          title: "Compliance Check",
          description: "Opening vendor compliance verification center",
        });
        break;
      case 'performance-report':
        setActiveTab('performance');
        toast({
          title: "Performance Report",
          description: "Generating procurement performance analytics report...",
        });
        // Simulate report generation
        setTimeout(() => {
          toast({
            title: "Report Ready",
            description: "Your procurement performance report has been generated and downloaded.",
          });
        }, 2000);
        break;
    }
  };

  const handleNewRFP = () => {
    setActiveTab('rfp');
  };

  const handleViewRFP = (rfpId: string) => {
    setSelectedRfp(rfpId);
    setActiveTab('rfp');
  };

  const handleBidEvaluation = (rfpId: string) => {
    setSelectedRfp(rfpId);
    setActiveTab('bidding');
  };

  const handleAwardContract = (rfpId: string) => {
    setSelectedRfp(rfpId);
    setActiveTab('awards');
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* AI Procurement Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Zap className="w-5 h-5 text-blue-400" />
              AI Procurement Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{procurementMetrics.activeRFPs}</div>
              <div className="text-sm text-muted-foreground">Active RFPs</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">${(procurementMetrics.totalContractValue / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground">Contract Value</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{procurementMetrics.complianceRate}%</div>
              <div className="text-sm text-muted-foreground">Compliance Rate</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{procurementMetrics.avgBidTime}</div>
              <div className="text-sm text-muted-foreground">Avg Bid Days</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              Procurement pipeline shows {procurementMetrics.activeRFPs} active RFPs with total value of ${(procurementMetrics.totalContractValue / 1000000).toFixed(1)}M. 
              {procurementMetrics.complianceRate}% compliance rate maintained with {procurementMetrics.avgBidTime}-day average bid cycle.
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
                <li>• {procurementMetrics.totalBids} bids received across {procurementMetrics.activeRFPs} active RFPs</li>
                <li>• {procurementMetrics.awardedContracts} contracts awarded, {procurementMetrics.pendingApprovals} pending approval</li>
                <li>• {procurementMetrics.vendorCount} qualified vendors in database</li>
                <li>• Structural steel and MEP systems critical path items</li>
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
                  <span>Expedite MEP evaluation to meet construction schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Pre-qualify additional structural steel vendors for redundancy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Initiate curtain wall RFP to maintain 90-day lead time</span>
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
            <Activity className="h-5 w-5 text-muted-foreground" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button 
              className="justify-start bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleQuickAction('new-rfp')}
            >
              <Plus className="w-4 h-4 mr-2" />
              New RFP
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={() => handleQuickAction('bid-leveling')}
            >
              <Gavel className="w-4 h-4 mr-2" />
              Bid Leveling
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={() => handleQuickAction('award-contract')}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Award Contract
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={() => handleQuickAction('vendor-management')}
            >
              <Users className="w-4 h-4 mr-2" />
              Vendor Management
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={() => handleQuickAction('compliance-check')}
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Compliance Check
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={() => handleQuickAction('performance-report')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Procurement KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active RFPs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{procurementMetrics.activeRFPs}</div>
            <div className="text-xs text-muted-foreground mt-1">{procurementMetrics.totalBids} total bids</div>
            <div className="flex items-center mt-2 text-blue-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+2 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contract Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${(procurementMetrics.totalContractValue / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground mt-1">{procurementMetrics.awardedContracts} contracts awarded</div>
            <div className="flex items-center mt-2 text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">12% savings</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{procurementMetrics.complianceRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">All vendors verified</div>
            <Progress value={procurementMetrics.complianceRate} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Bid Cycle</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{procurementMetrics.avgBidTime}</div>
            <div className="text-xs text-muted-foreground mt-1">days to award</div>
            <div className="flex items-center mt-2 text-green-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">-3 days improved</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RFP Status and Vendor Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active RFPs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Active RFPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rfpData.slice(0, 4).map((rfp) => (
                <div key={rfp.id} className="p-3 rounded-md bg-card/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{rfp.title}</span>
                    <Badge className={getStatusColor(rfp.status)}>
                      {rfp.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {rfp.id} • {rfp.category}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      ${rfp.estimatedValue.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      {rfp.bidCount} bids • Due {rfp.dueDate}
                    </span>
                  </div>
                  {rfp.daysRemaining > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Time remaining</span>
                        <span className="text-foreground">{rfp.daysRemaining} days</span>
                      </div>
                      <Progress value={(30 - rfp.daysRemaining) / 30 * 100} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Users className="h-5 w-5 text-muted-foreground" />
              Top Performing Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorData.slice(0, 4).map((vendor) => (
                <div key={vendor.id} className="p-3 rounded-md bg-card/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{vendor.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {vendor.category} • {vendor.projects} projects
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      ${(vendor.value / 1000000).toFixed(1)}M contract value
                    </span>
                    <span className="text-green-600">
                      {vendor.onTime}% on-time
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

const renderRFPTab = () => (
    <RFPManagement 
      projectId={displayProjectId || ''}
      onSelectRFP={(rfpId) => {
        setSelectedRfp(rfpId);
        setActiveTab('bidding');
      }}
      onCreateRFP={() => {
        toast({
          title: "RFP Created",
          description: "New RFP has been created successfully."
        });
      }}
      onBidAnalysis={(rfpId) => {
        setSelectedRfp(rfpId);
        setActiveTab('bidding');
      }}
      onAward={(rfpId) => {
        setSelectedRfp(rfpId);
        setActiveTab('awards');
      }}
    />
  );

  const renderBiddingTab = () => {
    // Show a default RFP for demonstration if none is selected
    const displayRfpId = selectedRfp || 'RFP-2024-002';
    const displayRfp = rfpData.find(rfp => rfp.id === displayRfpId) || rfpData[1];
    
    return (
      <EnhancedBidLevelingBoard 
        rfpId={displayRfpId}
        rfpTitle={displayRfp.title}
        onComplete={(results) => {
          console.log('Bid analysis complete:', results);
          // Automatically navigate to awards tab when analysis is complete
          setActiveTab('awards');
        }}
      />
    );
  };

  const renderAwardsTab = () => (
    <div className="space-y-6">
      <AwardCenter 
        facilityId={displayProjectId || ''}
        onClose={() => {}}
        bidId="RFP-2024-002"
        bidTitle="MEP Systems Installation"
        rfpNumber="RFP-2024-002"
        currentStatus="evaluation"
      />
    </div>
  );

  const renderVendorsTab = () => (
    <VendorManagement 
      onSelectVendor={(vendorId) => {
        // Handle vendor selection
        console.log('Selected vendor:', vendorId);
      }}
      onCreateVendor={() => {
        // Handle new vendor creation
      }}
    />
  );

  const renderContractsTab = () => (
    <div className="space-y-6">
      {/* Contract Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Contract Management</h3>
          <p className="text-sm text-muted-foreground">Monitor active contracts and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Contract Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{contractData.length}</div>
                <div className="text-sm text-muted-foreground">Total Contracts</div>
              </div>
              <FileCheck className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  ${(contractData.reduce((sum, contract) => sum + contract.value, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {contractData.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(contractData.reduce((sum, contract) => sum + contract.progress, 0) / contractData.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Progress</div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <FileCheck className="h-5 w-5 text-muted-foreground" />
            Active Contracts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contractData.map((contract) => (
              <div key={contract.id} className="border rounded-lg p-4 hover:bg-card/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg text-foreground">{contract.title}</h4>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{contract.id} • {contract.vendor}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Value:</span> ${contract.value.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Start Date:</span> {contract.startDate}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span> {contract.endDate}
                      </div>
                      <div>
                        <span className="font-medium">Milestones:</span> {contract.completedMilestones}/{contract.milestones}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{contract.progress}%</span>
                      </div>
                      <Progress value={contract.progress} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Contract
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Vendor
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Performance
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Milestones
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Procurement Header */}
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
            <ShoppingCart className="w-4 h-4 mr-2" />
            {procurementMetrics.activeRFPs} Active RFPs
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            ${(procurementMetrics.totalContractValue / 1000000).toFixed(1)}M Contract Value
          </Badge>
        </div>
      </div>

      {/* Main Procurement Tabs */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-10 gap-4 w-full p-1 mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="rfp" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                RFP Management
              </TabsTrigger>
              <TabsTrigger value="bidding" className="flex items-center gap-2">
                <Gavel className="h-4 w-4" />
                Bid Analysis
              </TabsTrigger>
              <TabsTrigger value="awards" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Award Center
              </TabsTrigger>
              <TabsTrigger value="vendors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Vendors
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="crm" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                CRM
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="leadtime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Lead Times
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                {renderOverviewTab()}
              </TabsContent>
              
              <TabsContent value="rfp" className="mt-0">
                {renderRFPTab()}
              </TabsContent>
              
              <TabsContent value="bidding" className="mt-0">
                {renderBiddingTab()}
              </TabsContent>
              
              <TabsContent value="awards" className="mt-0">
                {renderAwardsTab()}
              </TabsContent>
              
              <TabsContent value="vendors" className="mt-0">
                {renderVendorsTab()}
              </TabsContent>
              
              <TabsContent value="contracts" className="mt-0">
                {renderContractsTab()}
              </TabsContent>
              
              <TabsContent value="crm" className="mt-0">
                <div className="h-[calc(100vh-200px)]">
                  <EnterpriseCRM />
                </div>
              </TabsContent>
              
              <TabsContent value="compliance" className="mt-0">
                <ComplianceVerification />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-0">
                <PerformanceScorecards />
              </TabsContent>
              
              <TabsContent value="leadtime" className="mt-0">
                <LeadTimeTracker 
                  rfpId={displayProjectId || undefined}
                  onSelectItem={(itemId) => {
                    console.log('Selected lead time item:', itemId);
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcurementDashboard;
