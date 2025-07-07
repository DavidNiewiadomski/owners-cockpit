import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Package,
  Truck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Factory,
  Target,
  Zap,
  Activity,
  BarChart3,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

interface LeadTimeTrackerProps {
  rfpId?: string;
  onSelectItem?: (itemId: string) => void;
}

const LeadTimeTracker: React.FC<LeadTimeTrackerProps> = ({ rfpId, onSelectItem }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [leadTimes, setLeadTimes] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Direct Supabase fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔥 DIRECT FETCH - Starting...');
        setDebugInfo('Starting direct fetch...');
        
        const { data, error } = await supabase
          .from('lead_time')
          .select('*')
          .order('delivery_est', { ascending: true });
        
        console.log('🔥 DIRECT FETCH - Result:', { data, error });
        
        if (error) {
          setDebugInfo(`ERROR: ${error.message}`);
          console.error('Supabase error:', error);
        } else {
          setLeadTimes(data || []);
          setDebugInfo(`SUCCESS: Fetched ${data?.length || 0} items`);
          
          // Create comprehensive summary from data
          const totalItems = data?.length || 0;
          const lateItems = data?.filter(item => item.status === 'late').length || 0;
          const criticalItems = data?.filter(item => item.priority === 'critical').length || 0;
          const deliveredItems = data?.filter(item => item.status === 'delivered').length || 0;
          const ontrackItems = data?.filter(item => item.status === 'ontrack').length || 0;
          const pendingItems = data?.filter(item => item.status === 'pending').length || 0;
          const totalValue = data?.reduce((sum, item) => sum + (item.contract_value || 0), 0) || 0;
          const avgLeadDays = totalItems > 0 ? 
            data.reduce((sum, item) => sum + (item.fab_lead_days || 0), 0) / totalItems : 0;
          
          setSummary({
            total_items: totalItems,
            late_items: lateItems,
            critical_items: criticalItems,
            delivered_items: deliveredItems,
            ontrack_items: ontrackItems,
            pending_items: pendingItems,
            avg_lead_days: avgLeadDays,
            total_value: totalValue
          });
        }
      } catch (err) {
        console.error('🔥 DIRECT FETCH - Exception:', err);
        setDebugInfo(`EXCEPTION: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Helper functions (defined before usage)
  const calculateDaysUntilDelivery = (deliveryDate: string) => {
    const today = new Date();
    const delivery = parseISO(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate derived data
  const upcomingDeliveries = leadTimes.filter(item => {
    const daysUntil = calculateDaysUntilDelivery(item.delivery_est);
    return daysUntil >= 0 && daysUntil <= 30 && item.status !== 'delivered';
  }).sort((a, b) => new Date(a.delivery_est).getTime() - new Date(b.delivery_est).getTime());
  
  const criticalPath = leadTimes.filter(item => 
    item.priority === 'critical' || item.status === 'late'
  ).sort((a, b) => new Date(a.delivery_est).getTime() - new Date(b.delivery_est).getTime());
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ontrack':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'late':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-card text-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      case 'medium':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      default:
        return 'bg-card text-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'ontrack':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Package className="w-4 h-4" />;
      case 'late':
        return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };


  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    try {
      // Direct update to database
      const { error } = await supabase
        .from('lead_time')
        .update({ status: newStatus })
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Refresh data
      window.location.reload();
      
      toast({
        title: "Status Updated",
        description: "Lead time status has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter lead times based on search and filters
  const filteredLeadTimes = leadTimes.filter(item => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      item.work_pkg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scope_csi.some(csi => csi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    // Priority filter
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    // Sort by delivery date, late items first
    if (a.status === 'late' && b.status !== 'late') return -1;
    if (b.status === 'late' && a.status !== 'late') return 1;
    return new Date(a.delivery_est).getTime() - new Date(b.delivery_est).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Lead Time Tracker</h2>
          <p className="text-muted-foreground">Monitor procurement schedules and delivery timelines</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead Time
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{summary?.total_items || 0}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{summary?.late_items || 0}</div>
                <div className="text-sm text-muted-foreground">Late Items</div>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            {summary && summary.total_items > 0 && (
              <div className="mt-2 text-xs text-red-400">
                {Math.round((summary.late_items / summary.total_items) * 100)}% of total
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{summary?.critical_items || 0}</div>
                <div className="text-sm text-muted-foreground">Critical Items</div>
              </div>
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {summary?.avg_lead_days ? Math.round(summary.avg_lead_days) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Lead Days</div>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Factory className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="critical">Critical Path</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ontrack">On Track</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => {
                    setSelectedStatus('all');
                    setSelectedPriority('all');
                    setSearchTerm('');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Time Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Time Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Work Package</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Award Due</TableHead>
                    <TableHead>Delivery Est.</TableHead>
                    <TableHead>Lead Days</TableHead>
                    <TableHead>Days Until</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeadTimes.map((item) => {
                    const daysUntil = calculateDaysUntilDelivery(item.delivery_est);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.work_pkg}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.scope_csi.join(', ')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(parseISO(item.award_due), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(item.delivery_est), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{item.fab_lead_days}</span> days
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            daysUntil < 0 ? 'text-red-600' : 
                            daysUntil <= 7 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {daysUntil < 0 ? `${Math.abs(daysUntil)} overdue` : `${daysUntil} days`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onSelectItem?.(item.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Select onValueChange={(value) => handleStatusUpdate(item.id, value)}>
                              <SelectTrigger className="w-8 h-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Mark Pending</SelectItem>
                                <SelectItem value="ontrack">Mark On Track</SelectItem>
                                <SelectItem value="late">Mark Late</SelectItem>
                                <SelectItem value="delivered">Mark Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Deliveries Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Deliveries (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeliveries.map((item) => {
                  const daysUntil = calculateDaysUntilDelivery(item.delivery_est);
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getPriorityColor(item.priority)}`}>
                          {getStatusIcon(item.status)}
                        </div>
                        <div>
                          <div className="font-medium">{item.work_pkg}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(item.delivery_est), 'EEEE, MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          daysUntil <= 7 ? 'text-red-600' : 
                          daysUntil <= 14 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {daysUntil} days
                        </div>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {upcomingDeliveries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming deliveries in the next 30 days
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critical Path Tab */}
        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Critical Path Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalPath.map((item, index) => {
                  const daysUntil = calculateDaysUntilDelivery(item.delivery_est);
                  
                  return (
                    <div key={item.id} className="relative">
                      {index < criticalPath.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-red-200"></div>
                      )}
                      <div className="flex items-start gap-4 p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.work_pkg}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.scope_csi.join(', ')}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm">
                              <strong>Delivery:</strong> {format(parseISO(item.delivery_est), 'MMM dd, yyyy')}
                            </span>
                            <span className="text-sm">
                              <strong>Lead Time:</strong> {item.fab_lead_days} days
                            </span>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          {item.notes && (
                            <div className="text-sm text-muted-foreground mt-2 p-2 bg-white rounded border">
                              {item.notes}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${
                            daysUntil < 0 ? 'text-red-600' : 
                            daysUntil <= 7 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {criticalPath.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No critical path items found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'delivered', count: summary?.delivered_items || 0, color: 'bg-green-400' },
                    { status: 'ontrack', count: summary?.ontrack_items || 0, color: 'bg-blue-400' },
                    { status: 'pending', count: summary?.pending_items || 0, color: 'bg-yellow-400' },
                    { status: 'late', count: summary?.late_items || 0, color: 'bg-red-400' },
                  ].map(({ status, count, color }) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        <span className="capitalize">{status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{count}</span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${color}`} 
                            style={{ 
                              width: `${summary?.total_items ? (count / summary.total_items) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>On-Time Delivery Rate</span>
                    <span className="font-medium text-green-600">
                      {summary ? Math.round(((summary.delivered_items + summary.ontrack_items) / summary.total_items) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Lead Time</span>
                    <span className="font-medium">
                      {summary?.avg_lead_days ? Math.round(summary.avg_lead_days) : 0} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Critical Items</span>
                    <span className="font-medium text-orange-600">
                      {summary?.critical_items || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Value</span>
                    <span className="font-medium">
                      ${((summary?.total_value || 0) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Lead Time Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead Time Item</DialogTitle>
          </DialogHeader>
          <CreateLeadTimeForm 
            onSuccess={() => {
              setShowCreateDialog(false);
              window.location.reload();
              toast({
                title: "Lead Time Added",
                description: "New lead time item has been added successfully."
              });
            }}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Create Lead Time Form Component
const CreateLeadTimeForm: React.FC<{
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    work_pkg: '',
    scope_csi: '',
    rfq_issue_date: '',
    award_due: '',
    fab_lead_days: '',
    delivery_est: '',
    status: 'pending',
    priority: 'medium',
    contract_value: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('lead_time')
        .insert([{
          work_pkg: formData.work_pkg,
          scope_csi: formData.scope_csi.split(',').map(s => s.trim()),
          rfq_issue_date: formData.rfq_issue_date,
          award_due: formData.award_due,
          fab_lead_days: parseInt(formData.fab_lead_days),
          delivery_est: formData.delivery_est,
          status: formData.status,
          priority: formData.priority,
          contract_value: formData.contract_value ? parseFloat(formData.contract_value) : null,
          notes: formData.notes || null
        }]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating lead time:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="work_pkg">Work Package *</Label>
          <Input
            id="work_pkg"
            value={formData.work_pkg}
            onChange={(e) => setFormData({ ...formData, work_pkg: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="scope_csi">CSI Codes (comma-separated) *</Label>
          <Input
            id="scope_csi"
            placeholder="05 10 00, 05 20 00"
            value={formData.scope_csi}
            onChange={(e) => setFormData({ ...formData, scope_csi: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="rfq_issue_date">RFQ Issue Date *</Label>
          <Input
            id="rfq_issue_date"
            type="date"
            value={formData.rfq_issue_date}
            onChange={(e) => setFormData({ ...formData, rfq_issue_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="award_due">Award Due Date *</Label>
          <Input
            id="award_due"
            type="date"
            value={formData.award_due}
            onChange={(e) => setFormData({ ...formData, award_due: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="fab_lead_days">Fabrication Lead Days *</Label>
          <Input
            id="fab_lead_days"
            type="number"
            value={formData.fab_lead_days}
            onChange={(e) => setFormData({ ...formData, fab_lead_days: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="delivery_est">Estimated Delivery Date *</Label>
          <Input
            id="delivery_est"
            type="date"
            value={formData.delivery_est}
            onChange={(e) => setFormData({ ...formData, delivery_est: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="contract_value">Contract Value ($)</Label>
          <Input
            id="contract_value"
            type="number"
            step="0.01"
            value={formData.contract_value}
            onChange={(e) => setFormData({ ...formData, contract_value: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Lead Time'}
        </Button>
      </div>
    </form>
  );
};

export default LeadTimeTracker;
