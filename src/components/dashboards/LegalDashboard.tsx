
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Scale, Calendar, Clock, CheckCircle, MessageSquare, AlertTriangle, Shield, DollarSign, FileCheck } from 'lucide-react';
import ContractsDashboard from '@/components/contracts/ContractsDashboard';
import { generateLegalDemoData, LegalDemoData } from '@/utils/legalDemoData';

interface LegalDashboardProps {
  projectId: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [demoData, setDemoData] = useState<LegalDemoData | null>(null);

  useEffect(() => {
    // Generate demo data on component mount
    const data = generateLegalDemoData();
    setDemoData(data);
  }, []);

  if (!demoData) {
    return <div>Loading...</div>;
  }

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
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
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
      case 'active':
        return <Badge variant="destructive">Active</Badge>;
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

  const getInsuranceStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge variant="default">Valid</Badge>;
      case 'expiring':
        return <Badge variant="secondary">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                  <p className="text-xs text-muted-foreground mt-1">{demoData.insights.contractCompliance}</p>
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
                  <p className="text-xs text-muted-foreground mt-1">{demoData.insights.insuranceCompliance}</p>
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
                  <p className="text-xs text-muted-foreground mt-1">{demoData.insights.claimsStatus}</p>
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
            <div className="text-2xl font-bold">{demoData.summary.activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              ${(demoData.summary.totalContractValue / 1000000).toFixed(1)}M total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Changes</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{demoData.summary.pendingChangeOrders}</div>
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
            <div className="text-2xl font-bold text-orange-600">{demoData.summary.activeClaims}</div>
            <p className="text-xs text-muted-foreground">
              ${demoData.claims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} total exposure
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{demoData.summary.compliantCOIs}/{demoData.summary.totalCOIs}</div>
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
            <div className="text-2xl font-bold text-green-600">{demoData.summary.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              {demoData.summary.complianceScore >= 90 ? 'Excellent' : demoData.summary.complianceScore >= 75 ? 'Good' : 'Needs Attention'}
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
                  {demoData.contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.projectOrScope}</TableCell>
                      <TableCell>{contract.vendor}</TableCell>
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
                    <Badge variant="default">{demoData.summary.compliantCOIs}/{demoData.summary.totalCOIs}</Badge>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Insurance Details</h4>
                    {demoData.insuranceStatuses.map((insurance, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{insurance.vendorName}</div>
                          <div className="text-sm text-muted-foreground">{insurance.policyType}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{insurance.expiryDate}</div>
                          {getInsuranceStatusBadge(insurance.status)}
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
                  {demoData.alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
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
                {demoData.claims.length > 0 ? (
                  <div className="space-y-4">
                    {demoData.claims.map((claim) => (
                      <div key={claim.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{claim.type}</h4>
                          {getClaimStatusBadge(claim.status)}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>Project: {claim.project}</div>
                          <div>Claimant: {claim.claimant}</div>
                          <div>Value: ${claim.amount.toLocaleString()}</div>
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
                  {demoData.changeOrders.map((co) => (
                    <div key={co.id} className="border rounded-lg p-4">
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
