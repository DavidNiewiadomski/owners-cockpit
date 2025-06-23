
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Scale, Calendar, Clock, CheckCircle, MessageSquare, AlertTriangle, Shield, DollarSign, FileCheck } from 'lucide-react';
import ContractsDashboard from '@/components/contracts/ContractsDashboard';

interface LegalDashboardProps {
  projectId: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Sample contract data
  const contracts = [
    {
      id: 'C001',
      name: 'GC Contract – Tower Alpha',
      contractor: 'ABC Construction Corp',
      value: 50000000,
      spent: 40000000,
      percentComplete: 80,
      endDate: '2024-12-31',
      status: 'active',
      type: 'construction'
    },
    {
      id: 'C002',
      name: 'MEP Services – Tower Alpha',
      contractor: 'ElectroMech Systems',
      value: 8500000,
      spent: 7200000,
      percentComplete: 85,
      endDate: '2024-11-15',
      status: 'nearing_completion',
      type: 'service'
    },
    {
      id: 'C003',
      name: 'Architect Agreement – Project Beta',
      contractor: 'Design Partners LLC',
      value: 2500000,
      spent: 2100000,
      percentComplete: 84,
      endDate: '2025-02-10',
      status: 'active',
      type: 'professional'
    },
    {
      id: 'C004',
      name: 'Site Security Services',
      contractor: 'SecureGuard Inc',
      value: 450000,
      spent: 475000,
      percentComplete: 105,
      endDate: '2025-01-31',
      status: 'over_budget',
      type: 'service'
    }
  ];

  // Insurance and compliance data
  const insuranceData = {
    cois: {
      total: 12,
      current: 10,
      expiring: 2,
      expired: 0
    },
    bonds: {
      total: 4,
      current: 4,
      expiring: 0
    },
    expiringInsurance: [
      { contractor: 'ACME Concrete', type: 'General Liability', expires: '2024-07-15', daysRemaining: 22 },
      { contractor: 'Steel Solutions', type: 'Workers Comp', expires: '2024-07-28', daysRemaining: 35 }
    ]
  };

  // Claims and disputes
  const claims = [
    {
      id: 'CL001',
      project: 'Tower Alpha',
      claimant: 'ABC Construction Corp',
      type: 'Delay Claim',
      value: 200000,
      status: 'negotiation',
      filedDate: '2024-05-15',
      description: 'Weather delays extending project timeline'
    }
  ];

  // Change orders
  const changeOrders = [
    {
      project: 'Tower Alpha',
      number: 'CO-005',
      description: 'Additional HVAC capacity',
      value: 125000,
      status: 'signed',
      cumulativeValue: 1200000
    },
    {
      project: 'Project Beta',
      number: 'CO-002',
      description: 'Electrical system upgrade',
      value: 75000,
      status: 'pending_signature',
      cumulativeValue: 150000
    }
  ];

  // Upcoming deadlines and alerts
  const alerts = [
    {
      type: 'contract_expiration',
      message: 'Architect Agreement for Project Beta ends in 45 days',
      priority: 'medium',
      dueDate: '2025-02-10'
    },
    {
      type: 'lien_release',
      message: 'Lien release needed for Tower Alpha final payment',
      priority: 'high',
      dueDate: '2024-07-20'
    },
    {
      type: 'insurance_expiring',
      message: 'ACME Concrete insurance expires in 22 days',
      priority: 'medium',
      dueDate: '2024-07-15'
    }
  ];

  const legalMetrics = {
    activeContracts: contracts.filter(c => c.status === 'active').length,
    totalContractValue: contracts.reduce((sum, c) => sum + c.value, 0),
    pendingChangeOrders: changeOrders.filter(co => co.status === 'pending_signature').length,
    activeClaims: claims.length,
    complianceScore: 94
  };

  const handleInsightClick = (insight: string) => {
    console.log('Opening chat with insight:', insight);
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'nearing_completion':
        return <Badge variant="secondary">Nearing Completion</Badge>;
      case 'over_budget':
        return <Badge variant="destructive">Over Budget</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case 'negotiation':
        return <Badge variant="secondary">In Negotiation</Badge>;
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
      case 'resolved':
        return <Badge variant="outline">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            AI Legal Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Contract Compliance Status")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="default" className="mt-0.5">Insight</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Contract Compliance Status</h4>
                  <p className="text-xs text-muted-foreground mt-1">All contracts are on track with no major issues. Tower Alpha GC contract is 6 months from completion – start reviewing close-out terms.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Insurance Compliance")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="secondary" className="mt-0.5">Alert</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Insurance Compliance</h4>
                  <p className="text-xs text-muted-foreground mt-1">Insurance compliance is strong; 2 vendor insurances expire next month (reminders sent). Overall risk exposure is minimal.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Claims Status")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="outline" className="mt-0.5">Update</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Claims & Disputes</h4>
                  <p className="text-xs text-muted-foreground mt-1">1 active delay claim ($200K) in negotiation. No new claims this quarter. Legal risk remains low.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{legalMetrics.activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              ${(legalMetrics.totalContractValue / 1000000).toFixed(1)}M total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Changes</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{legalMetrics.pendingChangeOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting signature
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{legalMetrics.activeClaims}</div>
            <p className="text-xs text-muted-foreground">
              $200K total exposure
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{insuranceData.cois.current}/{insuranceData.cois.total}</div>
            <p className="text-xs text-muted-foreground">
              COIs current
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{legalMetrics.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Above target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Contract Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="claims">Claims & Changes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Contractor</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>% Complete</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.name}</TableCell>
                      <TableCell>{contract.contractor}</TableCell>
                      <TableCell>${(contract.value / 1000000).toFixed(1)}M</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contract.percentComplete}%
                          {contract.percentComplete > 100 && 
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          }
                        </div>
                      </TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell>{getContractStatusBadge(contract.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Certificates of Insurance (COIs)</span>
                    <Badge variant="default">{insuranceData.cois.current}/{insuranceData.cois.total}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Surety Bonds</span>
                    <Badge variant="default">{insuranceData.bonds.current}/{insuranceData.bonds.total}</Badge>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Expiring Soon</h4>
                    {insuranceData.expiringInsurance.map((insurance, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{insurance.contractor}</div>
                          <div className="text-sm text-muted-foreground">{insurance.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{insurance.expires}</div>
                          <Badge variant="secondary">{insurance.daysRemaining} days</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">Due: {alert.dueDate}</div>
                      </div>
                      {getPriorityBadge(alert.priority)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Claims & Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                {claims.length > 0 ? (
                  <div className="space-y-4">
                    {claims.map((claim) => (
                      <div key={claim.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{claim.type}</h4>
                          {getClaimStatusBadge(claim.status)}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>Project: {claim.project}</div>
                          <div>Claimant: {claim.claimant}</div>
                          <div>Value: ${claim.value.toLocaleString()}</div>
                          <div>Filed: {claim.filedDate}</div>
                        </div>
                        <p className="text-sm mt-2">{claim.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    No active disputes
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {changeOrders.map((co, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{co.number}</h4>
                        <Badge variant={co.status === 'signed' ? 'default' : 'secondary'}>
                          {co.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="font-medium">{co.project}</div>
                        <div className="text-muted-foreground">{co.description}</div>
                        <div className="flex justify-between">
                          <span>Value: ${co.value.toLocaleString()}</span>
                          <span>Cumulative: ${co.cumulativeValue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <ContractsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalDashboard;
