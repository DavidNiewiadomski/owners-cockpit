
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search, AlertTriangle, Clock, CheckCircle, Users } from 'lucide-react';
import type { Contract, ContractStatus, ContractType, RiskLevel } from '@/types/contracts';
import { ContractCard } from './ContractCard';
import { ContractDraftDialog } from './ContractDraftDialog';
import { ContractReviewPanel } from './ContractReviewPanel';
import { useToast } from '@/hooks/use-toast';

const ContractsDashboard: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContractType | 'all'>('all');
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const { toast } = useToast();

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockContracts: Contract[] = [
      {
        id: '1',
        title: 'General Construction Agreement - Tower A',
        type: 'construction',
        status: 'executed',
        counterparty: 'ABC Construction Corp',
        value: 2500000,
        currency: 'USD',
        start_date: '2024-01-15',
        end_date: '2024-12-31',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-15T14:30:00Z',
        created_by: 'legal@company.com',
        project_id: 'proj-001',
        risk_level: 'medium',
        ai_risk_score: 65
      },
      {
        id: '2',
        title: 'MEP Service Agreement',
        type: 'service_agreement',
        status: 'under_review',
        counterparty: 'ElectroMech Systems',
        value: 850000,
        currency: 'USD',
        start_date: '2024-02-01',
        end_date: '2024-09-30',
        created_at: '2024-01-20T09:00:00Z',
        updated_at: '2024-01-22T16:45:00Z',
        created_by: 'legal@company.com',
        project_id: 'proj-001',
        risk_level: 'high',
        ai_risk_score: 78
      },
      {
        id: '3',
        title: 'Insurance Policy - General Liability',
        type: 'insurance',
        status: 'pending_signature',
        counterparty: 'SafeGuard Insurance',
        value: 75000,
        currency: 'USD',
        start_date: '2024-07-01',
        end_date: '2025-06-30',
        created_at: '2024-06-01T11:00:00Z',
        updated_at: '2024-06-20T10:15:00Z',
        created_by: 'legal@company.com',
        risk_level: 'low',
        ai_risk_score: 25
      }
    ];
    setContracts(mockContracts);
    setFilteredContracts(mockContracts);
  }, []);

  // Filter contracts based on search and filters
  useEffect(() => {
    let filtered = contracts;

    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.counterparty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(contract => contract.type === typeFilter);
    }

    setFilteredContracts(filtered);
  }, [contracts, searchTerm, statusFilter, typeFilter]);

  const _getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'negotiation':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'pending_signature':
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const _getRiskBadgeVariant = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleContractSelect = (contract: Contract) => {
    setSelectedContract(contract);
    setShowReviewPanel(true);
  };

  const contractStats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'executed').length,
    pending: contracts.filter(c => ['under_review', 'negotiation', 'pending_signature'].includes(c.status)).length,
    expiringSoon: contracts.filter(c => {
      if (!c.end_date) return false;
      const endDate = new Date(c.end_date);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contracts Management</h1>
        <Button onClick={() => setShowDraftDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Draft New Contract
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractStats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractStats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractStats.expiringSoon}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ContractStatus | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="pending_signature">Pending Signature</SelectItem>
            <SelectItem value="executed">Executed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ContractType | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="service_agreement">Service Agreement</SelectItem>
            <SelectItem value="lease">Lease</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="nda">NDA</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredContracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onSelect={handleContractSelect}
          />
        ))}
      </div>

      {/* Draft Dialog */}
      <ContractDraftDialog
        open={showDraftDialog}
        onOpenChange={setShowDraftDialog}
        onContractDrafted={(contract) => {
          setContracts(prev => [contract, ...prev]);
          toast({
            title: "Contract Drafted",
            description: "Your contract has been successfully drafted by AI.",
          });
        }}
      />

      {/* Review Panel */}
      {selectedContract && (
        <ContractReviewPanel
          contract={selectedContract}
          open={showReviewPanel}
          onOpenChange={setShowReviewPanel}
        />
      )}
    </div>
  );
};

export default ContractsDashboard;
