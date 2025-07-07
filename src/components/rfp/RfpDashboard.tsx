import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  DollarSign,
  Building,
  Users,
  Clock,
  Edit,
  Trash2,
  Copy,
  Eye,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3
} from 'lucide-react';
import { useRfps, useRfpMutations } from '@/hooks/useRfpData';
import type { Rfp } from '@/types/rfp';

interface RfpDashboardProps {
  facilityId?: string;
  onCreateNew: () => void;
  onEditRfp: (rfp: Rfp) => void;
}

export function RfpDashboard({ facilityId, onCreateNew, onEditRfp }: RfpDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated_at');

  const { rfps, loading, error, refetch } = useRfps(facilityId);
  const { deleteRfp, loading: deleteLoading } = useRfpMutations();

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'open': return 'bg-green-100 text-green-800 border-green-200';
        case 'evaluation': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'leveling_complete': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'awarded': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'open': return <Send className="w-3 h-3" />;
      case 'evaluation': return <Clock className="w-3 h-3" />;
      case 'leveling_complete': return <CheckCircle className="w-3 h-3" />;
      case 'awarded': return <CheckCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredRfps = rfps
    .filter(rfp => {
      const matchesSearch = rfp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (rfp.project_id && rfp.project_id.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || rfp.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'status': return a.status.localeCompare(b.status);
        case 'created_at': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated_at':
        default: return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  const handleDeleteRfp = async (rfpId: string) => {
    if (window.confirm('Are you sure you want to delete this RFP? This action cannot be undone.')) {
      const success = await deleteRfp(rfpId);
      if (success) {
        refetch();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading RFPs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load RFPs: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">RFP Management</h2>
          <p className="text-muted-foreground">
            Create, manage, and track your Request for Proposals
          </p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New RFP
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search RFPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="evaluation">Evaluation</SelectItem>
                <SelectItem value="leveling_complete">Leveling Complete</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">Last Updated</SelectItem>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredRfps.length} of {rfps.length} RFPs
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFP Grid */}
      {filteredRfps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No RFPs Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {rfps.length === 0 
                ? "Get started by creating your first RFP"
                : "No RFPs match your current filters"
              }
            </p>
            {rfps.length === 0 && (
              <Button onClick={onCreateNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Your First RFP
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRfps.map((rfp, index) => (
            <motion.div
              key={rfp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {rfp.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(rfp.status)}>
                          {getStatusIcon(rfp.status)}
                          <span className="ml-1 capitalize">{rfp.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Project:</span>
                    </div>
                    <span className="font-medium truncate">{rfp.project_id || 'N/A'}</span>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Value:</span>
                    </div>
                    <span className="font-medium">{formatCurrency(rfp.estimated_value)}</span>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    {rfp.submission_deadline && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Due:</span>
                        </div>
                        <span className="font-medium">
                          {new Date(rfp.submission_deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Updated:</span>
                      </div>
                      <span className="text-xs">
                        {formatDate(rfp.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onEditRfp(rfp)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {rfp.status === 'draft' ? 'Continue' : 'Edit'}
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRfp(rfp.id);
                      }}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            RFP Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {rfps.filter(r => r.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {rfps.filter(r => r.status === 'open').length}
              </div>
              <div className="text-sm text-muted-foreground">Open</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {rfps.filter(r => r.status === 'evaluation').length}
              </div>
              <div className="text-sm text-muted-foreground">Evaluation</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {rfps.filter(r => r.status === 'awarded').length}
              </div>
              <div className="text-sm text-muted-foreground">Awarded</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
