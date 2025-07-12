import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  DollarSign,
  Calendar,
  Building,
  Users,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Send,
  Eye,
  X
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Progress } from '@/components/ui/progress';

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  project: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'approved' | 'pending' | 'rejected' | 'overdue';
  category: string;
  description: string;
  attachments: number;
  reviewer?: string;
  approvedBy?: string;
  paymentTerms: string;
}

interface VendorSummary {
  vendor: string;
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  averagePaymentTime: number;
}

const InvoicesReview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Mock invoice data
  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-0156',
      vendor: 'BuildRight Construction',
      project: 'Metro Plaza Development',
      amount: 1250000,
      date: '2024-12-15',
      dueDate: '2025-01-15',
      status: 'pending',
      category: 'Construction',
      description: 'Progress Payment #5 - Foundation and Structural Work',
      attachments: 3,
      paymentTerms: 'Net 30'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-0155',
      vendor: 'Stellar Architecture Group',
      project: 'Metro Plaza Development',
      amount: 85000,
      date: '2024-12-14',
      dueDate: '2025-01-14',
      status: 'approved',
      category: 'Design Services',
      description: 'Design Development Phase - Final Payment',
      attachments: 2,
      approvedBy: 'John Anderson',
      paymentTerms: 'Net 30'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-0154',
      vendor: 'Metro Steel Supply',
      project: 'Metro Plaza Development',
      amount: 420000,
      date: '2024-12-10',
      dueDate: '2024-12-25',
      status: 'paid',
      category: 'Materials',
      description: 'Structural Steel Delivery - Batch 2',
      attachments: 4,
      paymentTerms: 'Net 15'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-0153',
      vendor: 'City Engineering Consultants',
      project: 'Metro Plaza Development',
      amount: 32500,
      date: '2024-12-08',
      dueDate: '2025-01-08',
      status: 'pending',
      category: 'Consulting',
      description: 'MEP Engineering Services - December',
      attachments: 1,
      paymentTerms: 'Net 30'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-0152',
      vendor: 'SafeGuard Security Systems',
      project: 'Metro Plaza Development',
      amount: 18900,
      date: '2024-12-05',
      dueDate: '2024-12-20',
      status: 'overdue',
      category: 'Security',
      description: 'Site Security Services - November',
      attachments: 1,
      paymentTerms: 'Net 15'
    },
    {
      id: '6',
      invoiceNumber: 'INV-2024-0151',
      vendor: 'Green Earth Landscaping',
      project: 'Metro Plaza Development',
      amount: 65000,
      date: '2024-12-01',
      dueDate: '2024-12-31',
      status: 'rejected',
      category: 'Landscaping',
      description: 'Site Preparation and Initial Landscaping',
      attachments: 2,
      reviewer: 'Sarah Mitchell',
      paymentTerms: 'Net 30'
    }
  ];

  // Mock vendor summary data
  const vendorSummaries: VendorSummary[] = [
    {
      vendor: 'BuildRight Construction',
      totalInvoices: 12,
      totalAmount: 8500000,
      paidAmount: 7250000,
      pendingAmount: 1250000,
      averagePaymentTime: 28
    },
    {
      vendor: 'Stellar Architecture Group',
      totalInvoices: 8,
      totalAmount: 680000,
      paidAmount: 595000,
      pendingAmount: 85000,
      averagePaymentTime: 25
    },
    {
      vendor: 'Metro Steel Supply',
      totalInvoices: 5,
      totalAmount: 1200000,
      paidAmount: 780000,
      pendingAmount: 420000,
      averagePaymentTime: 18
    }
  ];

  // Calculate statistics
  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
  const approvedInvoices = invoices.filter(i => i.status === 'approved').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    if (selectedStatus === 'all') return true;
    return invoice.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="h-4 w-4" />;
      case 'approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Invoice Review & Approval
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage vendor invoices and payment approvals
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Invoices
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Process Payments
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalInvoices}</div>
              <div className="text-xs text-muted-foreground mt-1">
                This month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{pendingInvoices}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{approvedInvoices}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Ready for payment
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${(totalAmount / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                All invoices
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{overdueInvoices}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Requires attention
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="invoices">Invoice Queue</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Summary</TabsTrigger>
            <TabsTrigger value="analytics">Payment Analytics</TabsTrigger>
          </TabsList>

          {/* Invoice Queue */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pending Invoices</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Button
                    variant={selectedStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('all')}
                    size="sm"
                  >
                    All Invoices
                  </Button>
                  <Button
                    variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('pending')}
                    size="sm"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={selectedStatus === 'approved' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('approved')}
                    size="sm"
                  >
                    Approved
                  </Button>
                  <Button
                    variant={selectedStatus === 'overdue' ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus('overdue')}
                    size="sm"
                  >
                    Overdue
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{invoice.invoiceNumber}</h4>
                            <Badge className={getStatusColor(invoice.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(invoice.status)}
                                {invoice.status}
                              </span>
                            </Badge>
                            <Badge variant="outline">{invoice.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{invoice.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Vendor:</span>
                              <span className="ml-2 text-foreground">{invoice.vendor}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="ml-2 text-foreground font-medium">
                                ${invoice.amount.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date:</span>
                              <span className="ml-2 text-foreground">{invoice.date}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Due:</span>
                              <span className="ml-2 text-foreground">{invoice.dueDate}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Terms:</span>
                              <span className="ml-2 text-foreground">{invoice.paymentTerms}</span>
                            </div>
                          </div>
                          {invoice.attachments > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              {invoice.attachments} attachments
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          {invoice.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor Summary */}
          <TabsContent value="vendors">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Vendor Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorSummaries.map((vendor, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">{vendor.vendor}</h4>
                        <Badge variant="secondary">{vendor.totalInvoices} invoices</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Amount:</span>
                          <div className="font-medium text-foreground">
                            ${(vendor.totalAmount / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Paid:</span>
                          <div className="font-medium text-green-400">
                            ${(vendor.paidAmount / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pending:</span>
                          <div className="font-medium text-yellow-400">
                            ${(vendor.pendingAmount / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Payment Time:</span>
                          <div className="font-medium text-foreground">
                            {vendor.averagePaymentTime} days
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Payment Progress</span>
                          <span className="text-foreground">
                            {Math.round((vendor.paidAmount / vendor.totalAmount) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(vendor.paidAmount / vendor.totalAmount) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Payment Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">Paid</span>
                        <span className="text-sm font-medium text-green-400">
                          ${(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0) / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <Progress value={30} className="h-2 bg-green-900" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">Approved</span>
                        <span className="text-sm font-medium text-blue-400">
                          ${(invoices.filter(i => i.status === 'approved').reduce((sum, i) => sum + i.amount, 0) / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <Progress value={20} className="h-2 bg-blue-900" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">Pending</span>
                        <span className="text-sm font-medium text-yellow-400">
                          ${(pendingAmount / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <Progress value={40} className="h-2 bg-yellow-900" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">Overdue</span>
                        <span className="text-sm font-medium text-red-400">
                          ${(invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0) / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <Progress value={10} className="h-2 bg-red-900" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Construction', 'Design Services', 'Materials', 'Consulting'].map((category) => {
                      const categoryInvoices = invoices.filter(i => i.category === category);
                      const categoryAmount = categoryInvoices.reduce((sum, i) => sum + i.amount, 0);
                      return (
                        <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium text-foreground">{category}</div>
                            <div className="text-sm text-muted-foreground">
                              {categoryInvoices.length} invoices
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-foreground">
                              ${(categoryAmount / 1000000).toFixed(2)}M
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((categoryAmount / totalAmount) * 100)}% of total
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default InvoicesReview;