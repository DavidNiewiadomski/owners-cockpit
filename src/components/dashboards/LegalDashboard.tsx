import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, FileText, AlertTriangle, Calendar, Shield, Clock, Plus, Zap } from 'lucide-react';
import ContractsDashboard from '../contracts/ContractsDashboard';

interface LegalDashboardProps {
  projectId: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const legalMetrics = {
    activeContracts: 24,
    pendingReviews: 6,
    expiringInMonth: 3,
    complianceScore: 94,
    openClaims: 2,
    riskLevel: 'Low',
    aiAnalyzedContracts: 18,
    avgReviewTime: '2.3 days'
  };

  const contracts = [
    { id: 'C-001', type: 'Construction', party: 'ABC Construction Corp', value: 2500000, start: '2024-01-15', end: '2024-12-31', status: 'Active', risk: 'Low', aiScore: 25 },
    { id: 'C-002', type: 'MEP', party: 'ElectroMech Systems', value: 850000, start: '2024-02-01', end: '2024-09-30', status: 'Active', risk: 'Medium', aiScore: 65 },
    { id: 'C-003', type: 'Insurance', party: 'SafeGuard Insurance', value: 75000, start: '2024-01-01', end: '2024-06-30', status: 'Expiring', risk: 'High', aiScore: 85 },
    { id: 'C-004', type: 'Lease', party: 'TechCorp Tenant', value: 480000, start: '2024-01-01', end: '2026-12-31', status: 'Active', risk: 'Low', aiScore: 20 }
  ];

  const complianceItems = [
    { item: 'Building Permits', status: 'Current', expires: '2024-12-31', authority: 'City Planning' },
    { item: 'Fire Safety Certificate', status: 'Current', expires: '2024-08-15', authority: 'Fire Department' },
    { item: 'Environmental Permit', status: 'Renewal Due', expires: '2024-07-01', authority: 'EPA' },
    { item: 'Occupancy Certificate', status: 'Current', expires: '2025-01-15', authority: 'Building Dept' }
  ];

  const legalAlerts = [
    { type: 'Contract Renewal', message: 'Insurance policy expires in 7 days - renewal required', priority: 'High', dueDate: '2024-06-30', aiGenerated: true },
    { type: 'Compliance Review', message: 'Environmental permit renewal application due', priority: 'Medium', dueDate: '2024-07-01', aiGenerated: false },
    { type: 'Document Review', message: 'MEP contract change order requires legal review', priority: 'Medium', dueDate: '2024-06-28', aiGenerated: true },
    { type: 'AI Risk Alert', message: 'High-risk clauses detected in pending service agreement', priority: 'High', dueDate: '2024-06-25', aiGenerated: true }
  ];

  if (activeTab === 'contracts') {
    return <ContractsDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* Header with AI-Enhanced Badge */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Legal Dashboard
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI-Enhanced
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Contract management with AI-powered drafting, review, and risk analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('contracts')}>
            <FileText className="h-4 w-4 mr-2" />
            Manage Contracts
          </Button>
          <Button onClick={() => setActiveTab('contracts')}>
            <Plus className="h-4 w-4 mr-2" />
            Draft New Contract
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            AI Contracts
          </TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Legal KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{legalMetrics.activeContracts}</div>
                <p className="text-xs text-muted-foreground">
                  {legalMetrics.aiAnalyzedContracts} AI-analyzed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Review Time</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{legalMetrics.avgReviewTime}</div>
                <p className="text-xs text-muted-foreground">
                  65% faster with AI
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{legalMetrics.complianceScore}%</div>
                <p className="text-xs text-muted-foreground">
                  All critical items current
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{legalMetrics.riskLevel}</div>
                <p className="text-xs text-muted-foreground">
                  AI-monitored risks
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI-Enhanced Contract Portfolio */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                AI-Enhanced Contract Portfolio
              </CardTitle>
              <Button variant="outline" onClick={() => setActiveTab('contracts')}>
                View All Contracts
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.slice(0, 3).map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{contract.id}</span>
                        <Badge variant="outline">{contract.type}</Badge>
                        <Badge 
                          variant={contract.status === 'Active' ? 'default' : contract.status === 'Expiring' ? 'destructive' : 'secondary'}
                        >
                          {contract.status}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          AI Score: {contract.aiScore}%
                        </Badge>
                      </div>
                      <h4 className="font-medium mt-1">{contract.party}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Value: ${(contract.value / 1000000).toFixed(1)}M</span>
                        <span>Term: {contract.start} - {contract.end}</span>
                        <span className={`font-medium ${
                          contract.risk === 'Low' ? 'text-green-600' : 
                          contract.risk === 'Medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          Risk: {contract.risk}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Zap className="h-3 w-3 mr-1" />
                        AI Review
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI-Enhanced Legal Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                AI-Enhanced Legal Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalAlerts.map((alert, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={alert.priority === 'High' ? 'destructive' : 'default'}
                          >
                            {alert.priority}
                          </Badge>
                          <span className="text-sm font-medium">{alert.type}</span>
                          {alert.aiGenerated && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {alert.dueDate}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <ContractsDashboard />
        </TabsContent>

        <TabsContent value="compliance">
          {/* ... keep existing compliance content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{item.item}</h4>
                        <p className="text-sm text-muted-foreground">Authority: {item.authority}</p>
                        <p className="text-sm text-muted-foreground">Expires: {item.expires}</p>
                      </div>
                      <Badge 
                        variant={item.status === 'Current' ? 'default' : 'destructive'}
                        className={item.status === 'Current' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Permits
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalDashboard;
