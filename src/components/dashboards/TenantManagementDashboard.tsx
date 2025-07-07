import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Calendar,
  FileText,
  Target,
  BarChart3,
  Activity,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Star,
  MessageSquare,
  CreditCard,
  Home
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';

interface TenantManagementDashboardProps {
  projectId: string;
  activeCategory: string;
}

const TenantManagementDashboard: React.FC<TenantManagementDashboardProps> = ({ projectId, activeCategory }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Tenant Management' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  // Comprehensive tenant metrics for owners
  const tenantMetrics = {
    totalUnits: 248,
    occupiedUnits: 235,
    vacantUnits: 13,
    occupancyRate: 94.8,
    avgRentPerSqFt: 65.40,
    totalMonthlyRevenue: 1285000,
    preLeasedUnits: 8,
    leaseExpirations30Days: 12,
    leaseExpirations90Days: 28,
    renewalRate: 87.5,
    avgLeaseLength: 24.8,
    tenantSatisfactionScore: 4.2,
    maintenanceRequests: 23,
    overduePayments: 3
  };

  // Current tenants data
  const currentTenants = [
    {
      id: 'T-001',
      companyName: 'TechCorp Solutions',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '(555) 123-4567',
      units: ['Suite 1200', 'Suite 1201'],
      totalSqFt: 12500,
      monthlyRent: 81250,
      leaseStart: '2023-01-15',
      leaseEnd: '2025-01-14',
      renewalStatus: 'Negotiating',
      paymentStatus: 'Current',
      creditRating: 'A+',
      satisfactionScore: 4.5,
      industryType: 'Technology',
      employeeCount: 125,
      tenancyDuration: '18 months'
    },
    {
      id: 'T-002',
      companyName: 'Legal Partners LLP',
      contactPerson: 'Michael Chen',
      email: 'mchen@legalpartners.com',
      phone: '(555) 987-6543',
      units: ['Suite 850'],
      totalSqFt: 8500,
      monthlyRent: 55250,
      leaseStart: '2022-06-01',
      leaseEnd: '2025-05-31',
      renewalStatus: 'Confirmed',
      paymentStatus: 'Current',
      creditRating: 'A',
      satisfactionScore: 4.7,
      industryType: 'Legal Services',
      employeeCount: 45,
      tenancyDuration: '2.5 years'
    },
    {
      id: 'T-003',
      companyName: 'Healthcare Innovations',
      contactPerson: 'Dr. Lisa Rodriguez',
      email: 'lisa.rodriguez@healthinnov.com',
      phone: '(555) 456-7890',
      units: ['Suite 650', 'Suite 660'],
      totalSqFt: 10200,
      monthlyRent: 66300,
      leaseStart: '2024-03-01',
      leaseEnd: '2027-02-28',
      renewalStatus: 'Current',
      paymentStatus: 'Current',
      creditRating: 'A+',
      satisfactionScore: 4.3,
      industryType: 'Healthcare',
      employeeCount: 78,
      tenancyDuration: '9 months'
    },
    {
      id: 'T-004',
      companyName: 'Finance Forward Inc',
      contactPerson: 'Robert Kim',
      email: 'robert.kim@financeforward.com',
      phone: '(555) 321-0987',
      units: ['Suite 1050'],
      totalSqFt: 6800,
      monthlyRent: 44200,
      leaseStart: '2023-09-01',
      leaseEnd: '2024-12-31',
      renewalStatus: 'Expiring Soon',
      paymentStatus: 'Late',
      creditRating: 'B+',
      satisfactionScore: 3.8,
      industryType: 'Financial Services',
      employeeCount: 32,
      tenancyDuration: '15 months'
    }
  ];

  // Lease expiration data
  const leaseExpirations = [
    { month: 'Jan 2025', expiring: 8, renewed: 6, vacant: 2, newLeases: 3 },
    { month: 'Feb 2025', expiring: 12, renewed: 10, vacant: 2, newLeases: 4 },
    { month: 'Mar 2025', expiring: 6, renewed: 5, vacant: 1, newLeases: 2 },
    { month: 'Apr 2025', expiring: 15, renewed: 12, vacant: 3, newLeases: 5 },
    { month: 'May 2025', expiring: 9, renewed: 8, vacant: 1, newLeases: 3 },
    { month: 'Jun 2025', expiring: 18, renewed: 14, vacant: 4, newLeases: 6 }
  ];

  // Revenue trends
  const revenueTrends = [
    { month: 'Jul', baseRent: 1200000, parking: 45000, utilities: 32000, amenities: 18000, total: 1295000 },
    { month: 'Aug', baseRent: 1215000, parking: 46000, utilities: 33000, amenities: 19000, total: 1313000 },
    { month: 'Sep', baseRent: 1205000, parking: 44000, utilities: 31000, amenities: 17000, total: 1297000 },
    { month: 'Oct', baseRent: 1230000, parking: 47000, utilities: 34000, amenities: 20000, total: 1331000 },
    { month: 'Nov', baseRent: 1245000, parking: 48000, utilities: 35000, amenities: 21000, total: 1349000 },
    { month: 'Dec', baseRent: 1260000, parking: 49000, utilities: 36000, amenities: 22000, total: 1367000 }
  ];

  // Tenant satisfaction trends
  const satisfactionTrends = [
    { quarter: 'Q1 2024', overall: 4.1, amenities: 4.3, maintenance: 3.9, management: 4.2, location: 4.5 },
    { quarter: 'Q2 2024', overall: 4.2, amenities: 4.4, maintenance: 4.0, management: 4.3, location: 4.5 },
    { quarter: 'Q3 2024', overall: 4.1, amenities: 4.2, maintenance: 3.8, management: 4.1, location: 4.6 },
    { quarter: 'Q4 2024', overall: 4.2, amenities: 4.5, maintenance: 4.1, management: 4.4, location: 4.6 }
  ];

  // Tenant mix by industry
  const tenantIndustryMix = [
    { industry: 'Technology', count: 45, percentage: 35, revenue: 450000 },
    { industry: 'Financial Services', count: 32, percentage: 25, revenue: 380000 },
    { industry: 'Legal Services', count: 28, percentage: 22, revenue: 285000 },
    { industry: 'Healthcare', count: 18, percentage: 14, revenue: 195000 },
    { industry: 'Other', count: 5, percentage: 4, revenue: 55000 }
  ];

  // Recent tenant activities
  const recentActivities = [
    {
      id: 'ACT-001',
      type: 'Lease Renewal',
      tenant: 'Legal Partners LLP',
      description: 'Renewed 3-year lease with 2% annual increase',
      date: '2024-12-10',
      status: 'Completed',
      value: 'Suite 850 - $55,250/month'
    },
    {
      id: 'ACT-002',
      type: 'New Lease',
      tenant: 'Digital Marketing Pro',
      description: 'Signed 2-year lease for Suite 420',
      date: '2024-12-08',
      status: 'Signed',
      value: 'Suite 420 - $38,500/month'
    },
    {
      id: 'ACT-003',
      type: 'Maintenance Request',
      tenant: 'TechCorp Solutions',
      description: 'HVAC system maintenance - Suite 1200',
      date: '2024-12-07',
      status: 'In Progress',
      value: 'Priority: Medium'
    },
    {
      id: 'ACT-004',
      type: 'Payment Issue',
      tenant: 'Finance Forward Inc',
      description: 'Late payment - December rent',
      date: '2024-12-05',
      status: 'Following Up',
      value: '$44,200 - 5 days overdue'
    }
  ];

  // Prospective tenants
  const prospectiveTenants = [
    {
      id: 'PROS-001',
      companyName: 'AI Innovations Labs',
      contactPerson: 'Jennifer Wu',
      targetUnits: ['Suite 1500'],
      targetSqFt: 9500,
      proposedRent: 61750,
      leaseLength: 36,
      stage: 'Negotiating Terms',
      industry: 'Technology',
      moveInDate: '2025-02-01',
      creditScore: 'A-',
      probability: 85
    },
    {
      id: 'PROS-002',
      companyName: 'Consulting Excellence',
      contactPerson: 'David Martinez',
      targetUnits: ['Suite 750'],
      targetSqFt: 7200,
      proposedRent: 46800,
      leaseLength: 24,
      stage: 'Credit Review',
      industry: 'Professional Services',
      moveInDate: '2025-01-15',
      creditScore: 'B+',
      probability: 70
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'current':
      case 'completed':
      case 'confirmed':
      case 'signed':
        return 'text-green-400';
      case 'late':
      case 'expiring soon':
      case 'following up':
        return 'text-red-400';
      case 'negotiating':
      case 'in progress':
      case 'credit review':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A+':
      case 'A':
        return 'text-green-400';
      case 'A-':
      case 'B+':
        return 'text-yellow-400';
      case 'B':
      case 'B-':
        return 'text-orange-400';
      default:
        return 'text-red-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
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
            <Building className="w-4 h-4 mr-2" />
            {tenantMetrics.occupancyRate}% Occupied
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <DollarSign className="w-4 h-4 mr-2" />
            {formatCurrency(tenantMetrics.totalMonthlyRevenue)}/month
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <Users className="w-4 h-4 mr-2" />
            {tenantMetrics.leaseExpirations30Days} Expiring Soon
          </Badge>
        </div>
      </div>

      {/* AI Tenant Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Activity className="w-5 h-5 text-blue-400" />
              AI Tenant Management Insights
            </CardTitle>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{tenantMetrics.occupancyRate}%</div>
              <div className="text-sm text-muted-foreground">Occupancy Rate</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{tenantMetrics.renewalRate}%</div>
              <div className="text-sm text-muted-foreground">Renewal Rate</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">${tenantMetrics.avgRentPerSqFt.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Avg Rent/Sq Ft</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{tenantMetrics.tenantSatisfactionScore.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Satisfaction Score</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              Tenant portfolio performing strongly with {tenantMetrics.occupancyRate}% occupancy and {tenantMetrics.renewalRate}% renewal rate. Monthly revenue of {formatCurrency(tenantMetrics.totalMonthlyRevenue)} from {tenantMetrics.occupiedUnits} occupied units. Tenant satisfaction at {tenantMetrics.tenantSatisfactionScore}/5.0 with {tenantMetrics.leaseExpirations30Days} leases requiring immediate attention.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Portfolio Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Strong occupancy at {tenantMetrics.occupancyRate}% with only {tenantMetrics.vacantUnits} vacant units</li>
                <li>• Healthy renewal rate of {tenantMetrics.renewalRate}% indicating tenant satisfaction</li>
                <li>• Diverse tenant mix across technology, finance, and professional services</li>
                <li>• {tenantMetrics.preLeasedUnits} units pre-leased for upcoming vacancies</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Action Items</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Prioritize renewal discussions for {tenantMetrics.leaseExpirations90Days} expiring leases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Follow up on {tenantMetrics.overduePayments} overdue payments immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Address {tenantMetrics.maintenanceRequests} pending maintenance requests</span>
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
            <Target className="h-5 w-5 text-muted-foreground" />
            Tenant Management Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Users className="w-4 h-4 mr-2" />
              Contact Tenants
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Review Leases
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Renewals
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <DollarSign className="w-4 h-4 mr-2" />
              Payment Follow-up
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <MessageSquare className="w-4 h-4 mr-2" />
              Satisfaction Survey
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{tenantMetrics.occupancyRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">{tenantMetrics.occupiedUnits}/{tenantMetrics.totalUnits} units occupied</div>
            <Progress value={tenantMetrics.occupancyRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(tenantMetrics.totalMonthlyRevenue)}</div>
            <div className="text-xs text-muted-foreground mt-1">${tenantMetrics.avgRentPerSqFt.toFixed(2)}/sq ft average</div>
            <div className="flex items-center mt-2 text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+3.2% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lease Renewals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{tenantMetrics.renewalRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">{tenantMetrics.leaseExpirations30Days} expiring this month</div>
            <div className="flex items-center mt-2 text-yellow-400">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{tenantMetrics.leaseExpirations90Days} in next 90 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{tenantMetrics.tenantSatisfactionScore.toFixed(1)}/5.0</div>
            <div className="text-xs text-muted-foreground mt-1">Based on quarterly surveys</div>
            <div className="flex items-center mt-2 text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+0.1 vs last quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Tenant Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-muted border-border">
          <TabsTrigger value="overview" className="text-foreground data-[state=active]:bg-card">Current Tenants</TabsTrigger>
          <TabsTrigger value="renewals" className="text-foreground data-[state=active]:bg-card">Lease Renewals</TabsTrigger>
          <TabsTrigger value="prospects" className="text-foreground data-[state=active]:bg-card">Prospects</TabsTrigger>
          <TabsTrigger value="analytics" className="text-foreground data-[state=active]:bg-card">Analytics</TabsTrigger>
          <TabsTrigger value="activities" className="text-foreground data-[state=active]:bg-card">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {currentTenants.map((tenant) => (
              <Card key={tenant.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tenant Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{tenant.companyName}</h3>
                        <Badge className={getRatingColor(tenant.creditRating)}>
                          {tenant.creditRating}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{tenant.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{tenant.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{tenant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{tenant.industryType} • {tenant.employeeCount} employees</span>
                        </div>
                      </div>
                    </div>

                    {/* Lease Details */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Lease Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Units:</span>
                          <span className="font-medium ml-2 text-foreground">{tenant.units.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium ml-2 text-foreground">{tenant.totalSqFt.toLocaleString()} sq ft</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly Rent:</span>
                          <span className="font-medium ml-2 text-foreground">{formatCurrency(tenant.monthlyRent)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lease End:</span>
                          <span className="font-medium ml-2 text-foreground">{tenant.leaseEnd}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tenancy:</span>
                          <span className="font-medium ml-2 text-foreground">{tenant.tenancyDuration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Satisfaction:</span>
                          <span className="font-medium ml-2 text-foreground">{tenant.satisfactionScore}/5.0</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Renewal Status:</span>
                          <Badge className={getStatusColor(tenant.renewalStatus)}>
                            {tenant.renewalStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Payment Status:</span>
                          <Badge className={getStatusColor(tenant.paymentStatus)}>
                            {tenant.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="w-4 h-4 mr-1" />
                          Lease
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="renewals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lease Expiration Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Lease Expirations & Renewals</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leaseExpirations}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                    <Legend />
                    <Bar dataKey="expiring" fill="#ef4444" name="Expiring" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="renewed" fill="#10b981" name="Renewed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="newLeases" fill="#3b82f6" name="New Leases" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Renewal Priority List */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Renewal Priority Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentTenants
                    .filter(t => t.renewalStatus === 'Expiring Soon' || t.renewalStatus === 'Negotiating')
                    .map((tenant) => (
                      <div key={tenant.id} className="p-3 border border-border rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-foreground font-medium">{tenant.companyName}</p>
                            <p className="text-sm text-muted-foreground">{tenant.units.join(', ')} • {formatCurrency(tenant.monthlyRent)}/month</p>
                          </div>
                          <Badge className={getStatusColor(tenant.renewalStatus)}>
                            {tenant.renewalStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Expires: {tenant.leaseEnd}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Contact
                            </Button>
                            <Button size="sm">
                              Negotiate
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prospects" className="space-y-4">
          <div className="grid gap-4">
            {prospectiveTenants.map((prospect) => (
              <Card key={prospect.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Prospect Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{prospect.companyName}</h3>
                        <Badge className={getRatingColor(prospect.creditScore)}>
                          {prospect.creditScore}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{prospect.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{prospect.industry}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Target Move-in: {prospect.moveInDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lease Proposal */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Proposal Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Target Units:</span>
                          <span className="font-medium ml-2 text-foreground">{prospect.targetUnits.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium ml-2 text-foreground">{prospect.targetSqFt.toLocaleString()} sq ft</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Proposed Rent:</span>
                          <span className="font-medium ml-2 text-foreground">{formatCurrency(prospect.proposedRent)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lease Length:</span>
                          <span className="font-medium ml-2 text-foreground">{prospect.leaseLength} months</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Stage:</span>
                          <Badge className={getStatusColor(prospect.stage)}>
                            {prospect.stage}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Probability:</span>
                          <span className="text-sm font-medium text-foreground">{prospect.probability}%</span>
                        </div>
                        <Progress value={prospect.probability} className="h-2" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" className="flex-1">
                          <FileText className="w-4 h-4 mr-1" />
                          Proposal
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueTrends}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis className="text-sm" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value) => [`$${(value as number / 1000).toFixed(0)}K`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#revenueGradient)" 
                      name="Total Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tenant Mix by Industry */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Tenant Mix by Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tenantIndustryMix}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="percentage"
                    >
                      {tenantIndustryMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Satisfaction Trends */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Tenant Satisfaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={satisfactionTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="quarter" className="text-sm" />
                    <YAxis className="text-sm" domain={[3.5, 5]} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={3} name="Overall" />
                    <Line type="monotone" dataKey="amenities" stroke="#10b981" strokeWidth={2} name="Amenities" />
                    <Line type="monotone" dataKey="maintenance" stroke="#f59e0b" strokeWidth={2} name="Maintenance" />
                    <Line type="monotone" dataKey="management" stroke="#ef4444" strokeWidth={2} name="Management" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Industry Revenue Distribution */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Revenue by Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenantIndustryMix.map((industry, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{industry.industry}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(industry.revenue)} ({industry.percentage}%)
                        </span>
                      </div>
                      <Progress value={industry.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">Recent Tenant Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border border-border rounded">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{activity.type}</h4>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{activity.tenant}</p>
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Date: {activity.date}</span>
                        <span>{activity.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantManagementDashboard;
