import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Building,
  Calendar,
  Download,
  Gavel,
  FileCheck,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Progress } from '@/components/ui/progress';

interface LegalDocument {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'pending' | 'expired' | 'in-review';
  parties: string[];
  effectiveDate: string;
  expirationDate?: string;
  value?: number;
  lastReviewed: string;
  nextReview?: string;
}

interface ComplianceItem {
  id: string;
  requirement: string;
  category: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'at-risk';
  dueDate: string;
  responsible: string;
  description: string;
  lastChecked: string;
}

interface LegalIssue {
  id: string;
  title: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  dateRaised: string;
  assignedTo: string;
  description: string;
  estimatedResolution?: string;
}

interface PermitLicense {
  id: string;
  name: string;
  type: string;
  issuingAuthority: string;
  status: 'active' | 'pending' | 'expired' | 'renewal-due';
  issueDate: string;
  expiryDate: string;
  renewalDate?: string;
  cost: number;
}

const LegalDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const view = searchParams.get('view');
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab based on view parameter
    if (view === 'contracts') return 'contracts';
    if (view === 'insurance' || view === 'insurance-management') return 'insurance';
    if (view === 'disputes') return 'issues';
    if (view === 'compliance' || view === 'compliance-report' || view === 'compliance-audit') return 'compliance';
    return 'overview';
  });

  // Mock legal documents
  const legalDocuments: LegalDocument[] = [
    {
      id: '1',
      title: 'General Contractor Agreement - BuildRight Construction',
      type: 'Contract',
      status: 'active',
      parties: ['Metro Development Partners', 'BuildRight Construction'],
      effectiveDate: '2024-01-15',
      expirationDate: '2025-12-31',
      value: 35000000,
      lastReviewed: '2024-11-01',
      nextReview: '2025-02-01'
    },
    {
      id: '2',
      title: 'Architectural Services Agreement',
      type: 'Contract',
      status: 'active',
      parties: ['Metro Development Partners', 'Stellar Architecture Group'],
      effectiveDate: '2023-10-01',
      value: 2500000,
      lastReviewed: '2024-09-15'
    },
    {
      id: '3',
      title: 'Property Purchase Agreement',
      type: 'Purchase Agreement',
      status: 'active',
      parties: ['Metro Development Partners', 'Downtown Properties LLC'],
      effectiveDate: '2023-06-15',
      value: 12500000,
      lastReviewed: '2024-06-15'
    },
    {
      id: '4',
      title: 'Construction Loan Agreement',
      type: 'Loan Agreement',
      status: 'active',
      parties: ['Metro Development Partners', 'First National Bank'],
      effectiveDate: '2024-01-01',
      expirationDate: '2026-01-01',
      value: 25000000,
      lastReviewed: '2024-10-01',
      nextReview: '2025-01-01'
    },
    {
      id: '5',
      title: 'Environmental Indemnity Agreement',
      type: 'Indemnity',
      status: 'pending',
      parties: ['Metro Development Partners', 'City of Metro'],
      effectiveDate: '2024-12-20',
      lastReviewed: '2024-12-01'
    }
  ];

  // Mock compliance items
  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      requirement: 'Building Permit Renewal',
      category: 'Permits',
      status: 'compliant',
      dueDate: '2025-03-15',
      responsible: 'Legal Team',
      description: 'Annual building permit renewal required',
      lastChecked: '2024-12-01'
    },
    {
      id: '2',
      requirement: 'OSHA Safety Compliance',
      category: 'Safety',
      status: 'compliant',
      dueDate: '2024-12-31',
      responsible: 'Safety Manager',
      description: 'Quarterly OSHA compliance review',
      lastChecked: '2024-11-15'
    },
    {
      id: '3',
      requirement: 'Environmental Impact Assessment',
      category: 'Environmental',
      status: 'at-risk',
      dueDate: '2024-12-30',
      responsible: 'Environmental Consultant',
      description: 'Annual environmental compliance report',
      lastChecked: '2024-10-01'
    },
    {
      id: '4',
      requirement: 'Zoning Compliance Review',
      category: 'Zoning',
      status: 'compliant',
      dueDate: '2025-06-30',
      responsible: 'Legal Team',
      description: 'Semi-annual zoning compliance verification',
      lastChecked: '2024-11-20'
    },
    {
      id: '5',
      requirement: 'Insurance Coverage Review',
      category: 'Insurance',
      status: 'pending',
      dueDate: '2025-01-15',
      responsible: 'Risk Manager',
      description: 'Annual insurance adequacy review',
      lastChecked: '2024-01-15'
    }
  ];

  // Mock legal issues
  const legalIssues: LegalIssue[] = [
    {
      id: '1',
      title: 'Subcontractor Payment Dispute',
      type: 'Contract Dispute',
      severity: 'high',
      status: 'in-progress',
      dateRaised: '2024-11-15',
      assignedTo: 'Legal Counsel',
      description: 'Dispute over change order payments with electrical subcontractor',
      estimatedResolution: '2025-01-15'
    },
    {
      id: '2',
      title: 'Neighbor Noise Complaint',
      type: 'Compliance',
      severity: 'medium',
      status: 'open',
      dateRaised: '2024-12-05',
      assignedTo: 'Project Manager',
      description: 'Adjacent property owner complaint about construction noise',
      estimatedResolution: '2024-12-20'
    },
    {
      id: '3',
      title: 'Warranty Claim - Foundation',
      type: 'Warranty',
      severity: 'low',
      status: 'resolved',
      dateRaised: '2024-10-20',
      assignedTo: 'Construction Manager',
      description: 'Minor foundation settling issue addressed under warranty'
    }
  ];

  // Mock permits and licenses
  const permitsLicenses: PermitLicense[] = [
    {
      id: '1',
      name: 'Building Permit',
      type: 'Construction',
      issuingAuthority: 'City Building Department',
      status: 'active',
      issueDate: '2024-03-01',
      expiryDate: '2025-03-01',
      renewalDate: '2025-02-15',
      cost: 45000
    },
    {
      id: '2',
      name: 'Electrical Permit',
      type: 'Trade',
      issuingAuthority: 'City Electrical Inspector',
      status: 'active',
      issueDate: '2024-04-15',
      expiryDate: '2025-04-15',
      cost: 8500
    },
    {
      id: '3',
      name: 'Environmental Permit',
      type: 'Environmental',
      issuingAuthority: 'State Environmental Agency',
      status: 'renewal-due',
      issueDate: '2023-12-01',
      expiryDate: '2024-12-31',
      renewalDate: '2024-12-15',
      cost: 12000
    },
    {
      id: '4',
      name: 'Occupancy Permit',
      type: 'Occupancy',
      issuingAuthority: 'City Planning Department',
      status: 'pending',
      issueDate: '2025-06-01',
      expiryDate: '2030-06-01',
      cost: 5000
    }
  ];

  // Calculate statistics
  const activeContracts = legalDocuments.filter(d => d.status === 'active').length;
  const pendingReviews = legalDocuments.filter(d => d.status === 'pending' || d.status === 'in-review').length;
  const complianceRate = Math.round((complianceItems.filter(c => c.status === 'compliant').length / complianceItems.length) * 100);
  const openIssues = legalIssues.filter(i => i.status === 'open' || i.status === 'in-progress').length;
  const activePermits = permitsLicenses.filter(p => p.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'compliant':
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'pending':
      case 'in-progress':
      case 'renewal-due': return 'bg-yellow-100 text-yellow-700';
      case 'expired':
      case 'non-compliant':
      case 'at-risk': return 'bg-red-100 text-red-700';
      case 'in-review': return 'bg-blue-100 text-blue-700';
      case 'open': return 'bg-orange-100 text-orange-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Legal & Compliance Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage contracts, compliance, permits, and legal matters
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeContracts}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {pendingReviews} pending review
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{complianceRate}%</div>
              <Progress value={complianceRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{openIssues}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Requiring attention
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Permits</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activePermits}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Of {permitsLicenses.length} total
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contract Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$75M</div>
              <div className="text-xs text-muted-foreground mt-1">
                Total managed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="issues">Legal Issues</TabsTrigger>
            <TabsTrigger value="permits">Permits & Licenses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    Urgent Matters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-foreground">Environmental Permit Expiring</div>
                          <div className="text-xs text-muted-foreground">Due for renewal by Dec 31, 2024</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-yellow-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-foreground">Contract Review Due</div>
                          <div className="text-xs text-muted-foreground">Construction loan agreement - Jan 1, 2025</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/10">
                      <div className="flex items-start gap-2">
                        <Gavel className="h-4 w-4 text-orange-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-foreground">Open Legal Issue</div>
                          <div className="text-xs text-muted-foreground">Subcontractor payment dispute - High priority</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-foreground">OSHA compliance review completed</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span className="text-foreground">Environmental indemnity agreement drafted</span>
                      </div>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-foreground">New legal issue raised - Noise complaint</span>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-foreground">Insurance coverage review initiated</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 weeks ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Contract Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {legalDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{doc.title}</h4>
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                            <Badge variant="outline">{doc.type}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Parties:</span>
                              <div className="text-foreground mt-1">
                                {doc.parties.map((party, idx) => (
                                  <div key={idx} className="text-xs">{party}</div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Effective:</span>
                              <span className="ml-2 text-foreground">{doc.effectiveDate}</span>
                            </div>
                            {doc.expirationDate && (
                              <div>
                                <span className="text-muted-foreground">Expires:</span>
                                <span className="ml-2 text-foreground">{doc.expirationDate}</span>
                              </div>
                            )}
                            {doc.value && (
                              <div>
                                <span className="text-muted-foreground">Value:</span>
                                <span className="ml-2 text-foreground font-medium">
                                  ${(doc.value / 1000000).toFixed(1)}M
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Last reviewed: {doc.lastReviewed}</span>
                            {doc.nextReview && (
                              <span className="text-yellow-400">Next review: {doc.nextReview}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Compliance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{item.requirement}</h4>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Due Date:</span>
                              <span className="ml-2 text-foreground">{item.dueDate}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Responsible:</span>
                              <span className="ml-2 text-foreground">{item.responsible}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last Checked:</span>
                              <span className="ml-2 text-foreground">{item.lastChecked}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Issues Tab */}
          <TabsContent value="issues">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Legal Issues & Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {legalIssues.map((issue) => (
                    <div key={issue.id} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{issue.title}</h4>
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity} severity
                            </Badge>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <span className="ml-2 text-foreground">{issue.type}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date Raised:</span>
                              <span className="ml-2 text-foreground">{issue.dateRaised}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Assigned To:</span>
                              <span className="ml-2 text-foreground">{issue.assignedTo}</span>
                            </div>
                            {issue.estimatedResolution && (
                              <div>
                                <span className="text-muted-foreground">Est. Resolution:</span>
                                <span className="ml-2 text-foreground">{issue.estimatedResolution}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permits & Licenses Tab */}
          <TabsContent value="permits">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Permits & Licenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permitsLicenses.map((permit) => (
                    <div key={permit.id} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{permit.name}</h4>
                            <Badge className={getStatusColor(permit.status)}>
                              {permit.status}
                            </Badge>
                            <Badge variant="outline">{permit.type}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Authority:</span>
                              <span className="ml-2 text-foreground">{permit.issuingAuthority}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Issue Date:</span>
                              <span className="ml-2 text-foreground">{permit.issueDate}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Expiry Date:</span>
                              <span className="ml-2 text-foreground">{permit.expiryDate}</span>
                            </div>
                            {permit.renewalDate && (
                              <div>
                                <span className="text-muted-foreground">Renewal Due:</span>
                                <span className="ml-2 text-yellow-400">{permit.renewalDate}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">Cost:</span>
                              <span className="ml-2 text-foreground">${permit.cost.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        {permit.status === 'renewal-due' && (
                          <Button size="sm" className="ml-4 bg-yellow-600 hover:bg-yellow-700">
                            Renew Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LegalDashboard;