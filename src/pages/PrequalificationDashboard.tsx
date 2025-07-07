import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Search,
  Plus,
  Download,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

interface DashboardStats {
  total_vendors: number;
  approved: number;
  pending: number;
  denied: number;
  expiring_soon: number;
  average_score: number;
  documents_pending: number;
  this_month_submissions: number;
}

interface PrequalVendor {
  id: string;
  company_id: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  score?: number;
  expiry_date?: string;
  submission_date?: string;
  review_date?: string;
  review_notes?: string;
  project_size_limit?: number;
  requested_trades: string[];
  company: {
    name: string;
    primary_contact_name?: string;
    phone?: string;
    email?: string;
    specialty_trades: string[];
    company_type?: string;
    city?: string;
    state?: string;
    annual_revenue?: number;
    employee_count?: number;
    bonding_capacity?: number;
  };
}

const PrequalificationDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<PrequalVendor[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load prequalification records with company data using correct table names
      const { data: prequalData, error: prequalError } = await supabase
        .from('prequal')
        .select(`
          *,
          companies!inner(*)
        `)
        .order('created_at', { ascending: false });

      if (prequalError) {
        console.error('Error loading prequalification data:', prequalError);
        throw prequalError;
      }

      // Transform the data to match our interface
      const transformedVendors: PrequalVendor[] = (prequalData || []).map(record => ({
        id: record.id,
        company_id: record.company_id,
        status: record.status,
        score: record.score,
        expiry_date: record.expiry_date,
        submission_date: record.submitted_at,
        review_date: record.reviewed_at,
        review_notes: record.review_notes,
        project_size_limit: record.project_size_limit,
        requested_trades: record.requested_trades || [],
        company: {
          name: record.companies.name,
          primary_contact_name: record.companies.primary_contact_name,
          phone: record.companies.phone,
          email: record.companies.email,
          specialty_trades: record.companies.specialty_codes || [],
          company_type: record.companies.company_type,
          city: record.companies.city,
          state: record.companies.state,
          annual_revenue: record.companies.annual_revenue,
          employee_count: record.companies.employee_count,
          bonding_capacity: record.companies.bonding_capacity
        }
      }));
        
      setVendors(transformedVendors);

      // Calculate stats
      const allVendors = transformedVendors;
      const dashboardStats: DashboardStats = {
        total_vendors: allVendors.length,
        approved: allVendors.filter(v => v.status === 'approved').length,
        pending: allVendors.filter(v => v.status === 'pending').length,
        denied: allVendors.filter(v => v.status === 'denied').length,
        expiring_soon: allVendors.filter(v => {
          if (!v.expiry_date) return false;
          const expiryDate = new Date(v.expiry_date);
          const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
          return expiryDate <= ninetyDaysFromNow;
        }).length,
        average_score: allVendors.length > 0 && allVendors.some(v => v.score) ? 
          allVendors.filter(v => v.score).reduce((sum, v) => sum + v.score!, 0) / allVendors.filter(v => v.score).length : 0,
        documents_pending: allVendors.filter(v => v.status === 'pending').length,
        this_month_submissions: allVendors.filter(v => {
          if (!v.submission_date) return false;
          const submissionDate = new Date(v.submission_date);
          const thisMonth = new Date();
          return submissionDate.getMonth() === thisMonth.getMonth() && 
                 submissionDate.getFullYear() === thisMonth.getFullYear();
        }).length
      };

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

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
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

  const VendorTable = ({ vendors, title }: { vendors: PrequalVendor[]; title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendors.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No vendors found</p>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{vendor.company.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={vendor.status === 'approved' ? 'default' : 
                               vendor.status === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {vendor.status}
                    </Badge>
                    {vendor.score && (
                      <span className="text-sm text-muted-foreground">
                        Score: {vendor.score}/100
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {vendor.company.city}, {vendor.company.state}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {vendor.requested_trades.join(', ')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
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
            <h1 className="text-3xl font-bold">Vendor Prequalification</h1>
            <p className="text-muted-foreground">
              Manage vendor prequalification and review submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Vendors"
              value={stats.total_vendors}
              icon={Users}
              trend="All time"
              color="blue"
            />
            <StatCard
              title="Pending Review"
              value={stats.pending}
              icon={Clock}
              trend="Awaiting action"
              color="orange"
            />
            <StatCard
              title="Approved Vendors"
              value={stats.approved}
              icon={CheckCircle}
              trend={`${((stats.approved / stats.total_vendors) * 100).toFixed(1)}% approval rate`}
              color="green"
            />
            <StatCard
              title="Average Score"
              value={`${stats.average_score.toFixed(1)}/100`}
              icon={TrendingUp}
              trend="Across all submissions"
              color="purple"
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VendorTable 
                vendors={vendors.slice(0, 5)} 
                title="Recent Applications" 
              />
              <VendorTable 
                vendors={vendors.filter(v => {
                  if (!v.expiry_date) return false;
                  const expiryDate = new Date(v.expiry_date);
                  const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                  return expiryDate <= ninetyDaysFromNow;
                })} 
                title="Expiring Soon" 
              />
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pending Review</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {vendors.filter(v => v.status === 'pending').length > 0 ? (
                  <VendorTable 
                    vendors={vendors.filter(v => v.status === 'pending')} 
                    title="" 
                  />
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending applications found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Applications will appear here when vendors submit their prequalification forms.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Approved Vendors</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search approved vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {vendors.filter(v => v.status === 'approved').length > 0 ? (
                  <VendorTable 
                    vendors={vendors.filter(v => v.status === 'approved')} 
                    title="" 
                  />
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No approved vendors yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Approved vendors will appear here after successful prequalification review.
                    </p>
                  </div>
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                <div className="text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Create Request</div>
                  <div className="text-sm text-muted-foreground">Send prequalification to vendor</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Review Submissions</div>
                  <div className="text-sm text-muted-foreground">Process pending applications</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-6 h-auto">
                <div className="text-center">
                  <Download className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Generate Reports</div>
                  <div className="text-sm text-muted-foreground">Export vendor data</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrequalificationDashboard;
