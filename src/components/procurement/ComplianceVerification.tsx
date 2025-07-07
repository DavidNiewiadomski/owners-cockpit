import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Shield,
  Users,
  Building,
  FileText,
  Download,
  RefreshCw,
  Info,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  category: string;
  item: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'expired';
  dueDate?: string;
  notes?: string;
  documents?: string[];
}

interface VendorCompliance {
  vendorId: string;
  vendorName: string;
  overallScore: number;
  certifications: ComplianceItem[];
  insurance: ComplianceItem[];
  financials: ComplianceItem[];
  safety: ComplianceItem[];
  lastReviewDate: string;
}

export const ComplianceVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  // Mock data for demonstration
  const complianceMetrics = {
    totalVendors: 127,
    compliantVendors: 108,
    pendingReviews: 12,
    expiringSoon: 7,
    overallComplianceRate: 85,
    avgResponseTime: 3.2,
  };

  const vendorCompliance: VendorCompliance[] = [
    {
      vendorId: 'VEN-001',
      vendorName: 'Metropolitan Steel Works',
      overallScore: 92,
      certifications: [
        { id: 'cert-1', category: 'License', item: 'State Contractor License', status: 'compliant', dueDate: '2025-03-15' },
        { id: 'cert-2', category: 'License', item: 'City Business License', status: 'compliant', dueDate: '2024-12-31' },
        { id: 'cert-3', category: 'Certification', item: 'ISO 9001:2015', status: 'compliant', dueDate: '2025-06-30' },
      ],
      insurance: [
        { id: 'ins-1', category: 'Insurance', item: 'General Liability', status: 'compliant', dueDate: '2024-12-31' },
        { id: 'ins-2', category: 'Insurance', item: 'Workers Compensation', status: 'compliant', dueDate: '2024-12-31' },
        { id: 'ins-3', category: 'Insurance', item: 'Auto Insurance', status: 'pending', notes: 'Renewal in progress' },
      ],
      financials: [
        { id: 'fin-1', category: 'Financial', item: 'Bonding Capacity', status: 'compliant' },
        { id: 'fin-2', category: 'Financial', item: 'Financial Statements', status: 'compliant', dueDate: '2024-12-31' },
        { id: 'fin-3', category: 'Financial', item: 'Credit Report', status: 'compliant' },
      ],
      safety: [
        { id: 'saf-1', category: 'Safety', item: 'OSHA Compliance', status: 'compliant' },
        { id: 'saf-2', category: 'Safety', item: 'EMR Rating', status: 'compliant', notes: 'EMR: 0.82' },
        { id: 'saf-3', category: 'Safety', item: 'Safety Program', status: 'compliant' },
      ],
      lastReviewDate: '2024-10-15',
    },
    {
      vendorId: 'VEN-002',
      vendorName: 'Premier Concrete Co.',
      overallScore: 78,
      certifications: [
        { id: 'cert-4', category: 'License', item: 'State Contractor License', status: 'compliant' },
        { id: 'cert-5', category: 'License', item: 'City Business License', status: 'expired', dueDate: '2024-09-30' },
      ],
      insurance: [
        { id: 'ins-4', category: 'Insurance', item: 'General Liability', status: 'compliant' },
        { id: 'ins-5', category: 'Insurance', item: 'Workers Compensation', status: 'non-compliant', notes: 'Policy expired' },
      ],
      financials: [
        { id: 'fin-4', category: 'Financial', item: 'Bonding Capacity', status: 'pending', notes: 'Under review' },
      ],
      safety: [
        { id: 'saf-4', category: 'Safety', item: 'OSHA Compliance', status: 'compliant' },
      ],
      lastReviewDate: '2024-10-01',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'non-compliant':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'non-compliant':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.totalVendors}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceMetrics.compliantVendors}</div>
            <p className="text-xs text-muted-foreground">Fully compliant vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{complianceMetrics.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{complianceMetrics.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Compliance Rate</CardTitle>
          <CardDescription>Percentage of vendors meeting all compliance requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{complianceMetrics.overallComplianceRate}%</span>
              <Badge variant="outline" className="bg-green-100 text-green-700">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3% from last month
              </Badge>
            </div>
            <Progress value={complianceMetrics.overallComplianceRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            7 vendors have documents expiring within the next 30 days. Review and request updates.
          </AlertDescription>
        </Alert>

        <Alert className="border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Compliance Review Scheduled</AlertTitle>
          <AlertDescription>
            Quarterly compliance audit scheduled for November 15, 2024. 12 vendors pending review.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  const renderVendorCompliance = () => (
    <div className="space-y-6">
      {vendorCompliance.map((vendor) => (
        <Card key={vendor.vendorId}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {vendor.vendorName}
                </CardTitle>
                <CardDescription>
                  Last reviewed: {new Date(vendor.lastReviewDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(vendor.overallScore)}`}>
                  {vendor.overallScore}%
                </div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Certifications */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Certifications & Licenses
                </h4>
                <div className="space-y-2">
                  {vendor.certifications.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm">{item.item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Expires: {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Insurance Coverage
                </h4>
                <div className="space-y-2">
                  {vendor.insurance.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm">{item.item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.notes && (
                          <span className="text-xs text-muted-foreground">{item.notes}</span>
                        )}
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // This would trigger an email or notification to vendor
                    alert(`Requesting compliance updates from ${vendor.vendorName}`);
                  }}
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Request Updates
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // This would generate and download a vendor compliance report
                    alert(`Generating compliance report for ${vendor.vendorName}`);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // This would run automated verification checks
                    alert(`Running compliance verification for ${vendor.vendorName}`);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Verification
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Verification Center</h1>
          <p className="text-muted-foreground">Monitor and verify vendor compliance status</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              alert('Syncing all vendor compliance data...');
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All
          </Button>
          <Button
            onClick={() => {
              alert('Generating comprehensive compliance report for all vendors...');
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Compliance Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Compliance</TabsTrigger>
          <TabsTrigger value="bids">Bid Compliance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="vendors">
          {renderVendorCompliance()}
        </TabsContent>

        <TabsContent value="bids">
          <div className="text-center py-12">
            <FileCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Bid Compliance Verification</h3>
            <p className="text-muted-foreground">Verify bid submissions meet all requirements</p>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Compliance Documents</h3>
            <p className="text-muted-foreground">Manage and track all compliance documentation</p>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="text-center py-12">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Compliance Audit Trail</h3>
            <p className="text-muted-foreground">Track all compliance verification activities</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
