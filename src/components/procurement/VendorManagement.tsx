import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Star,
  Phone,
  Mail,
  MapPin,
  Award,
  TrendingUp,
  TrendingDown,
  UserCheck,
  AlertCircle,
  FileCheck,
  Briefcase,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PrequalificationDashboard from '@/pages/PrequalificationDashboard';

interface Vendor {
  id: string;
  name: string;
  companyType: 'general' | 'subcontractor' | 'supplier' | 'consultant';
  category: string;
  specialties: string[];
  status: 'active' | 'preferred' | 'qualified' | 'suspended' | 'inactive';
  tier: 1 | 2 | 3;
  
  // Contact Information
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website: string;
  
  // Financial Information
  annualRevenue: number;
  bondingCapacity: number;
  currentBacklog: number;
  creditRating: string;
  
  // Performance Metrics
  performance: {
    overallRating: number;
    qualityScore: number;
    scheduleScore: number;
    budgetScore: number;
    safetyScore: number;
    communicationScore: number;
  };
  
  // Project History
  projectStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalContractValue: number;
    averageProjectSize: number;
    onTimeDeliveryRate: number;
    budgetComplianceRate: number;
  };
  
  // Qualifications
  certifications: string[];
  licenses: string[];
  insuranceLimits: {
    general: number;
    professional: number;
    umbrella: number;
  };
  
  // Risk Assessment
  riskProfile: {
    financial: 'low' | 'medium' | 'high';
    operational: 'low' | 'medium' | 'high';
    quality: 'low' | 'medium' | 'high';
    overall: 'low' | 'medium' | 'high';
  };
  
  // Recent Activity
  lastContact: string;
  lastProject: string;
  recentBids: number;
  prequalificationExpiry: string;
  
  // Additional Info
  businessStructure: string;
  yearsInBusiness: number;
  employeeCount: number;
  minorityOwned: boolean;
  womanOwned: boolean;
  veteranOwned: boolean;
  smallBusiness: boolean;
}

interface VendorManagementProps {
  onSelectVendor?: (vendorId: string) => void;
  onCreateVendor?: () => void;
}

export function VendorManagement({ onSelectVendor, onCreateVendor }: VendorManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Mock vendor data - would come from API
  const vendors: Vendor[] = [
    {
      id: 'VEN-001',
      name: 'Metropolitan Steel Works',
      companyType: 'subcontractor',
      category: 'Structural Steel',
      specialties: ['Steel Fabrication', 'Erection', 'Heavy Steel', 'Architectural Steel'],
      status: 'preferred',
      tier: 1,
      primaryContact: {
        name: 'John Smith',
        title: 'Project Manager',
        email: 'j.smith@metrosteel.com',
        phone: '(555) 123-4567'
      },
      address: {
        street: '1234 Industrial Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      website: 'www.metropolitansteel.com',
      annualRevenue: 45000000,
      bondingCapacity: 25000000,
      currentBacklog: 18500000,
      creditRating: 'A+',
      performance: {
        overallRating: 4.8,
        qualityScore: 96,
        scheduleScore: 94,
        budgetScore: 92,
        safetyScore: 98,
        communicationScore: 95
      },
      projectStats: {
        totalProjects: 23,
        activeProjects: 4,
        completedProjects: 19,
        totalContractValue: 127000000,
        averageProjectSize: 5500000,
        onTimeDeliveryRate: 96,
        budgetComplianceRate: 94
      },
      certifications: ['AISC Certified', 'AWS D1.1', 'ISO 9001:2015', 'OSHA 30-Hour'],
      licenses: ['State of Illinois General Contractor', 'City of Chicago Building Permit'],
      insuranceLimits: {
        general: 5000000,
        professional: 2000000,
        umbrella: 10000000
      },
      riskProfile: {
        financial: 'low',
        operational: 'low',
        quality: 'low',
        overall: 'low'
      },
      lastContact: '2024-08-28',
      lastProject: 'Downtown Tower Phase 1',
      recentBids: 3,
      prequalificationExpiry: '2025-03-15',
      businessStructure: 'Corporation',
      yearsInBusiness: 28,
      employeeCount: 145,
      minorityOwned: false,
      womanOwned: false,
      veteranOwned: true,
      smallBusiness: false
    },
    {
      id: 'VEN-002',
      name: 'Advanced MEP Solutions',
      companyType: 'subcontractor',
      category: 'Mechanical/Electrical',
      specialties: ['HVAC Systems', 'Electrical Distribution', 'Fire Protection', 'Controls'],
      status: 'active',
      tier: 1,
      primaryContact: {
        name: 'Sarah Johnson',
        title: 'Business Development Manager',
        email: 's.johnson@advancedmep.com',
        phone: '(555) 987-6543'
      },
      address: {
        street: '5678 Technology Dr',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        country: 'USA'
      },
      website: 'www.advancedmep.com',
      annualRevenue: 62000000,
      bondingCapacity: 35000000,
      currentBacklog: 28000000,
      creditRating: 'A',
      performance: {
        overallRating: 4.6,
        qualityScore: 89,
        scheduleScore: 91,
        budgetScore: 88,
        safetyScore: 95,
        communicationScore: 92
      },
      projectStats: {
        totalProjects: 18,
        activeProjects: 6,
        completedProjects: 12,
        totalContractValue: 156000000,
        averageProjectSize: 8600000,
        onTimeDeliveryRate: 89,
        budgetComplianceRate: 91
      },
      certifications: ['NECA Member', 'SMACNA Certified', 'LEED AP', 'NFPA Certified'],
      licenses: ['Colorado Electrical License', 'Mechanical Contractor License'],
      insuranceLimits: {
        general: 8000000,
        professional: 5000000,
        umbrella: 15000000
      },
      riskProfile: {
        financial: 'low',
        operational: 'medium',
        quality: 'low',
        overall: 'low'
      },
      lastContact: '2024-08-25',
      lastProject: 'Medical Center Expansion',
      recentBids: 5,
      prequalificationExpiry: '2025-01-20',
      businessStructure: 'LLC',
      yearsInBusiness: 15,
      employeeCount: 89,
      minorityOwned: true,
      womanOwned: false,
      veteranOwned: false,
      smallBusiness: false
    },
    {
      id: 'VEN-003',
      name: 'Premier Concrete Co.',
      companyType: 'supplier',
      category: 'Concrete & Masonry',
      specialties: ['Ready-Mix Concrete', 'Precast', 'Concrete Pumping', 'Testing Services'],
      status: 'preferred',
      tier: 1,
      primaryContact: {
        name: 'Mike Rodriguez',
        title: 'Operations Manager',
        email: 'm.rodriguez@premierconcrete.com',
        phone: '(555) 456-7890'
      },
      address: {
        street: '9101 Concrete Way',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'USA'
      },
      website: 'www.premierconcrete.com',
      annualRevenue: 38000000,
      bondingCapacity: 15000000,
      currentBacklog: 12000000,
      creditRating: 'A+',
      performance: {
        overallRating: 4.9,
        qualityScore: 98,
        scheduleScore: 97,
        budgetScore: 95,
        safetyScore: 99,
        communicationScore: 96
      },
      projectStats: {
        totalProjects: 31,
        activeProjects: 8,
        completedProjects: 23,
        totalContractValue: 89000000,
        averageProjectSize: 2900000,
        onTimeDeliveryRate: 98,
        budgetComplianceRate: 96
      },
      certifications: ['NRMCA Certified', 'ACI Certified', 'Green Concrete Certified'],
      licenses: ['Arizona Concrete Supplier License'],
      insuranceLimits: {
        general: 3000000,
        professional: 1000000,
        umbrella: 5000000
      },
      riskProfile: {
        financial: 'low',
        operational: 'low',
        quality: 'low',
        overall: 'low'
      },
      lastContact: '2024-08-30',
      lastProject: 'Residential Complex Phase 2',
      recentBids: 7,
      prequalificationExpiry: '2025-06-10',
      businessStructure: 'Partnership',
      yearsInBusiness: 32,
      employeeCount: 67,
      minorityOwned: false,
      womanOwned: true,
      veteranOwned: false,
      smallBusiness: true
    },
    {
      id: 'VEN-004',
      name: 'Glass Tech Systems',
      companyType: 'subcontractor',
      category: 'Glazing & Facades',
      specialties: ['Curtain Wall', 'Structural Glazing', 'Window Systems', 'Facade Engineering'],
      status: 'active',
      tier: 2,
      primaryContact: {
        name: 'Lisa Chen',
        title: 'Project Director',
        email: 'l.chen@glasstech.com',
        phone: '(555) 234-5678'
      },
      address: {
        street: '2468 Glass Ave',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      website: 'www.glasstechsystems.com',
      annualRevenue: 24000000,
      bondingCapacity: 12000000,
      currentBacklog: 8500000,
      creditRating: 'B+',
      performance: {
        overallRating: 4.5,
        qualityScore: 92,
        scheduleScore: 85,
        budgetScore: 89,
        safetyScore: 93,
        communicationScore: 90
      },
      projectStats: {
        totalProjects: 14,
        activeProjects: 3,
        completedProjects: 11,
        totalContractValue: 67000000,
        averageProjectSize: 4800000,
        onTimeDeliveryRate: 92,
        budgetComplianceRate: 87
      },
      certifications: ['GANA Certified', 'IGMA Certified', 'Glazing Industry Code Committee'],
      licenses: ['Washington State Glazing License'],
      insuranceLimits: {
        general: 4000000,
        professional: 2000000,
        umbrella: 8000000
      },
      riskProfile: {
        financial: 'medium',
        operational: 'medium',
        quality: 'low',
        overall: 'medium'
      },
      lastContact: '2024-08-22',
      lastProject: 'Corporate Headquarters',
      recentBids: 2,
      prequalificationExpiry: '2024-12-05',
      businessStructure: 'Corporation',
      yearsInBusiness: 19,
      employeeCount: 42,
      minorityOwned: true,
      womanOwned: true,
      veteranOwned: false,
      smallBusiness: true
    }
  ];

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
      const matchesTier = tierFilter === 'all' || vendor.tier.toString() === tierFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesTier;
    });
  }, [vendors, searchTerm, statusFilter, categoryFilter, tierFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preferred': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'qualified': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'suspended': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-gold-100 text-gold-700 border-gold-200';
      case 2: return 'bg-silver-100 text-silver-700 border-silver-200';
      case 3: return 'bg-bronze-100 text-bronze-700 border-bronze-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-rose-400';
      case 'medium': return 'text-blue-500';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleCreateVendor = () => {
    if (onCreateVendor) {
      onCreateVendor();
    } else {
      setShowCreateDialog(true);
    }
  };

  const handleSelectVendor = (vendorId: string) => {
    if (onSelectVendor) {
      onSelectVendor(vendorId);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No Vendors Selected",
        description: "Please select vendors to perform bulk actions.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedVendors.length} vendor(s).`,
    });
  };

  const stats = {
    total: vendors.length,
    preferred: vendors.filter(v => v.status === 'preferred').length,
    active: vendors.filter(v => v.status === 'active').length,
    tier1: vendors.filter(v => v.tier === 1).length,
    avgRating: (vendors.reduce((sum, v) => sum + v.performance.overallRating, 0) / vendors.length).toFixed(1),
    totalValue: vendors.reduce((sum, v) => sum + v.projectStats.totalContractValue, 0),
    diverseVendors: vendors.filter(v => v.minorityOwned || v.womanOwned || v.veteranOwned).length
  };

  return (
    <div className="space-y-6">
      {/* Header and Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">Manage vendor relationships and performance tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="w-4 h-4 mr-2" />
            {stats.total} Total Vendors
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Star className="w-4 h-4 mr-2" />
            {stats.avgRating} Avg Rating
          </Badge>
          <Button onClick={handleCreateVendor}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.preferred}</div>
                <div className="text-sm text-muted-foreground">Preferred</div>
              </div>
              <Star className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gold-600">{stats.tier1}</div>
                <div className="text-sm text-muted-foreground">Tier 1</div>
              </div>
              <Award className="h-8 w-8 text-gold-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.avgRating}</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">${(stats.totalValue / 1000000).toFixed(0)}M</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.diverseVendors}</div>
                <div className="text-sm text-muted-foreground">Diverse</div>
              </div>
              <UserCheck className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600">{vendors.filter(v => new Date(v.prequalificationExpiry) < new Date(Date.now() + 90*24*60*60*1000)).length}</div>
                <div className="text-sm text-muted-foreground">Expiring Soon</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vendor Directory</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="diversity">Diversity Tracking</TabsTrigger>
          <TabsTrigger value="prequalification">Prequalification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search vendors by name, category, or specialty..."
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
                      <SelectItem value="preferred">Preferred</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Structural Steel">Structural Steel</SelectItem>
                      <SelectItem value="Mechanical/Electrical">MEP</SelectItem>
                      <SelectItem value="Concrete & Masonry">Concrete</SelectItem>
                      <SelectItem value="Glazing & Facades">Glazing</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="1">Tier 1</SelectItem>
                      <SelectItem value="2">Tier 2</SelectItem>
                      <SelectItem value="3">Tier 3</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      toast({
                        title: "Advanced Filters",
                        description: "Opening advanced filter options",
                      });
                    }}
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {selectedVendors.length > 0 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">{selectedVendors.length} vendor(s) selected</span>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Export')}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Update Status')}>
                    Update Status
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedVendors([])}>
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vendor Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vendor Directory ({filteredVendors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedVendors(filteredVendors.map(vendor => vendor.id));
                          } else {
                            setSelectedVendors([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Contract Value</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedVendors.includes(vendor.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedVendors([...selectedVendors, vendor.id]);
                            } else {
                              setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">{vendor.primaryContact.name}</div>
                          <div className="flex gap-1 flex-wrap">
                            {vendor.minorityOwned && <Badge variant="secondary" className="text-xs">MBE</Badge>}
                            {vendor.womanOwned && <Badge variant="secondary" className="text-xs">WBE</Badge>}
                            {vendor.veteranOwned && <Badge variant="secondary" className="text-xs">VBE</Badge>}
                            {vendor.smallBusiness && <Badge variant="secondary" className="text-xs">SB</Badge>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{vendor.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.specialties.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(vendor.status)}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTierColor(vendor.tier)}>
                          Tier {vendor.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < vendor.performance.overallRating ? 'text-blue-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{vendor.performance.overallRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{vendor.projectStats.totalProjects}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.projectStats.activeProjects} active
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${(vendor.projectStats.totalContractValue / 1000000).toFixed(1)}M</div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getRiskColor(vendor.riskProfile.overall)}`}>
                          {vendor.riskProfile.overall}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSelectVendor(vendor.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Edit Vendor",
                                description: `Opening profile editor for ${vendor.name}`,
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setActiveTab('performance');
                              toast({
                                title: "Performance Analytics",
                                description: `Viewing performance data for ${vendor.name}`,
                              });
                            }}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "More Options",
                                description: "Additional vendor actions menu",
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
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendors.slice(0, 4).map((vendor) => (
                  <div key={vendor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{vendor.name}</h4>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Quality Score</span>
                        <div className="flex items-center gap-2">
                          <Progress value={vendor.performance.qualityScore} className="w-20 h-2" />
                          <span className="text-sm font-medium">{vendor.performance.qualityScore}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Schedule Score</span>
                        <div className="flex items-center gap-2">
                          <Progress value={vendor.performance.scheduleScore} className="w-20 h-2" />
                          <span className="text-sm font-medium">{vendor.performance.scheduleScore}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Budget Score</span>
                        <div className="flex items-center gap-2">
                          <Progress value={vendor.performance.budgetScore} className="w-20 h-2" />
                          <span className="text-sm font-medium">{vendor.performance.budgetScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Vendors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendors
                  .sort((a, b) => b.performance.overallRating - a.performance.overallRating)
                  .slice(0, 5)
                  .map((vendor, index) => (
                    <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-lg">#{index + 1}</div>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">{vendor.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{vendor.performance.overallRating}</div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {vendors.filter(v => v.minorityOwned).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Minority-Owned (MBE)</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {vendors.filter(v => v.womanOwned).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Woman-Owned (WBE)</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {vendors.filter(v => v.veteranOwned).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Veteran-Owned (VBE)</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {vendors.filter(v => v.smallBusiness).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Small Business</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Diversity Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Certifications</TableHead>
                    <TableHead>Contract Value</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors
                    .filter(v => v.minorityOwned || v.womanOwned || v.veteranOwned || v.smallBusiness)
                    .map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>{vendor.category}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {vendor.minorityOwned && <Badge variant="secondary" className="text-xs">MBE</Badge>}
                            {vendor.womanOwned && <Badge variant="secondary" className="text-xs">WBE</Badge>}
                            {vendor.veteranOwned && <Badge variant="secondary" className="text-xs">VBE</Badge>}
                            {vendor.smallBusiness && <Badge variant="secondary" className="text-xs">SB</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>${(vendor.projectStats.totalContractValue / 1000000).toFixed(1)}M</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-blue-500 fill-current mr-1" />
                            {vendor.performance.overallRating}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prequalification" className="space-y-6">
          <PrequalificationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
