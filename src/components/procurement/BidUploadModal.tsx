import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  File,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Trash2,
  Plus,
  FileCheck,
  Loader2,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Users,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BidUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfpId: string;
  rfpTitle: string;
  onBidsUploaded: (bids: any[]) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  vendorName?: string;
  totalBid?: number;
  lineItemCount?: number;
  errors?: string[];
  data?: any;
}

interface VendorInfo {
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  bondAmount: number;
  bondRate: number;
  insuranceCompliant: boolean;
  prequalified: boolean;
}

export function BidUploadModal({ isOpen, onClose, rfpId, rfpTitle, onBidsUploaded }: BidUploadModalProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    bondAmount: 0,
    bondRate: 0,
    insuranceCompliant: false,
    prequalified: false
  });
  const [manualBidData, setManualBidData] = useState({
    vendorName: '',
    totalBid: '',
    lineItems: [
      { description: '', quantity: '', unit: '', unitPrice: '', totalPrice: '', notes: '' }
    ]
  });
  const { toast } = useToast();

  const handleFileUpload = useCallback((files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file processing
    newFiles.forEach(file => {
      simulateFileProcessing(file);
    });
  }, []);

  const simulateFileProcessing = async (file: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, progress } : f
      ));
    }

    // Simulate processing
    setUploadedFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, status: 'processing' } : f
    ));

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate completion with mock data
    const mockData = generateMockBidData(file.name);
    setUploadedFiles(prev => prev.map(f => 
      f.id === file.id ? { 
        ...f, 
        status: 'completed',
        vendorName: mockData.vendorName,
        totalBid: mockData.totalBid,
        lineItemCount: mockData.lineItems.length,
        data: mockData
      } : f
    ));
  };

  const generateMockBidData = (fileName: string) => {
    const vendorNames = [
      'Advanced MEP Solutions LLC',
      'Premier HVAC Corporation', 
      'Integrated Building Systems Inc',
      'Metro Mechanical Contractors',
      'Elite Electrical Systems',
      'ProTech Construction Services'
    ];
    
    const vendorName = vendorNames[Math.floor(Math.random() * vendorNames.length)];
    const basePrice = 5000000 + Math.random() * 2000000;
    
    return {
      vendorName,
      totalBid: Math.round(basePrice),
      submissionDate: new Date().toISOString(),
      bondAmount: Math.round(basePrice * 0.01),
      bondRate: 1.0,
      contact: {
        primary: 'John Smith, PE',
        email: 'j.smith@company.com',
        phone: '(555) 123-4567',
        address: '1234 Business St, Metro City, ST 12345'
      },
      lineItems: [
        {
          id: 'LI-001',
          csiCode: '23 05 00',
          description: 'HVAC System - Main Air Handling Units',
          quantity: 4,
          unit: 'EA',
          unitPrice: 112500,
          totalPrice: 450000,
          notes: 'Premium efficiency units with advanced controls'
        },
        {
          id: 'LI-002',
          csiCode: '23 07 00',
          description: 'Ductwork and Distribution System',
          quantity: 15000,
          unit: 'LF',
          unitPrice: 56.67,
          totalPrice: 850000,
          notes: 'Includes all fittings and supports'
        },
        {
          id: 'LI-003',
          csiCode: '26 05 00',
          description: 'Electrical Service and Distribution',
          quantity: 1,
          unit: 'LS',
          unitPrice: 1250000,
          totalPrice: 1250000,
          notes: '2000A service with monitoring systems'
        }
      ],
      compliance: {
        bidForm: true,
        bond: true,
        insurance: true,
        references: true,
        financials: true,
        schedule: true
      },
      alternates: [
        {
          number: 1,
          description: 'Upgrade to premium efficiency equipment',
          price: 125000
        }
      ]
    };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const addLineItem = () => {
    setManualBidData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, {
        description: '',
        quantity: '',
        unit: '',
        unitPrice: '',
        totalPrice: '',
        notes: ''
      }]
    }));
  };

  const updateLineItem = (index: number, field: string, value: string) => {
    setManualBidData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeLineItem = (index: number) => {
    setManualBidData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const submitBids = async () => {
    setIsProcessing(true);
    
    // Collect all completed bids
    const completedBids = uploadedFiles
      .filter(file => file.status === 'completed' && file.data)
      .map(file => file.data);

    // Add manual bid if filled out
    if (manualBidData.vendorName && manualBidData.totalBid) {
      completedBids.push({
        vendorName: manualBidData.vendorName,
        totalBid: parseFloat(manualBidData.totalBid),
        submissionDate: new Date().toISOString(),
        lineItems: manualBidData.lineItems.filter(item => item.description),
        source: 'manual'
      });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    onBidsUploaded(completedBids);
    setIsProcessing(false);
    onClose();

    toast({
      title: "Bids Imported Successfully",
      description: `${completedBids.length} bids have been imported and are ready for analysis.`,
    });
  };

  const renderUploadTab = () => (
    <div className="space-y-6">
      {/* Upload Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Supported File Formats</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <p><strong>Excel Files (.xlsx, .xls)</strong></p>
            <p>• Standard bid forms</p>
            <p>• Line item schedules</p>
            <p>• Unit price schedules</p>
          </div>
          <div>
            <p><strong>PDF Files (.pdf)</strong></p>
            <p>• Scanned bid forms</p>
            <p>• Formal proposals</p>
            <p>• OCR text extraction</p>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Area */}
      <div 
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Drop bid files here</h3>
        <p className="text-muted-foreground mb-4">or click to browse and select files</p>
        <input
          type="file"
          multiple
          accept=".xlsx,.xls,.pdf,.csv"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Select Files
          </label>
        </Button>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                        {file.type.includes('pdf') ? (
                          <FileText className="w-5 h-5 text-blue-600" />
                        ) : (
                          <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : file.status === 'error' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {file.status === 'uploading' && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uploading...</span>
                        <span>{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}

                  {file.status === 'processing' && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing bid data...
                    </div>
                  )}

                  {file.status === 'completed' && file.data && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Vendor:</span>
                          <p className="text-foreground">{file.vendorName}</p>
                        </div>
                        <div>
                          <span className="font-medium">Total Bid:</span>
                          <p className="text-foreground">${file.totalBid?.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Line Items:</span>
                          <p className="text-foreground">{file.lineItemCount}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Data
                      </Button>
                    </div>
                  )}

                  {file.status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-red-800 dark:text-red-400">Processing Error</span>
                      </div>
                      {file.errors?.map((error, index) => (
                        <p key={index} className="text-sm text-red-700 dark:text-red-300">• {error}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderManualTab = () => (
    <div className="space-y-6">
      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Vendor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor-name">Company Name *</Label>
              <Input
                id="vendor-name"
                value={vendorInfo.name}
                onChange={(e) => setVendorInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label htmlFor="contact-name">Primary Contact</Label>
              <Input
                id="contact-name"
                value={vendorInfo.contact}
                onChange={(e) => setVendorInfo(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="Contact Name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={vendorInfo.email}
                onChange={(e) => setVendorInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@company.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={vendorInfo.phone}
                onChange={(e) => setVendorInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={vendorInfo.address}
                onChange={(e) => setVendorInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street Address, City, State ZIP"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bid Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Bid Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor-name-bid">Vendor Name *</Label>
              <Input
                id="vendor-name-bid"
                value={manualBidData.vendorName}
                onChange={(e) => setManualBidData(prev => ({ ...prev, vendorName: e.target.value }))}
                placeholder="Vendor Company Name"
              />
            </div>
            <div>
              <Label htmlFor="total-bid">Total Bid Amount *</Label>
              <Input
                id="total-bid"
                type="number"
                value={manualBidData.totalBid}
                onChange={(e) => setManualBidData(prev => ({ ...prev, totalBid: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Line Items
            </div>
            <Button onClick={addLineItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Line Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {manualBidData.lineItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Line Item {index + 1}</h4>
                  {manualBidData.lineItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      value={item.unit}
                      onChange={(e) => updateLineItem(index, 'unit', e.target.value)}
                      placeholder="EA, LF, SF, etc."
                    />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Total Price</Label>
                    <Input
                      type="number"
                      value={item.totalPrice}
                      onChange={(e) => updateLineItem(index, 'totalPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input
                      value={item.notes}
                      onChange={(e) => updateLineItem(index, 'notes', e.target.value)}
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewTab = () => {
    const completedBids = uploadedFiles.filter(f => f.status === 'completed');
    const hasManualBid = manualBidData.vendorName && manualBidData.totalBid;
    const totalBids = completedBids.length + (hasManualBid ? 1 : 0);

    return (
      <div className="space-y-6">
        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Import Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{totalBids}</div>
                <div className="text-sm text-muted-foreground">Total Bids</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{completedBids.length}</div>
                <div className="text-sm text-muted-foreground">From Files</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{hasManualBid ? 1 : 0}</div>
                <div className="text-sm text-muted-foreground">Manual Entry</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bid Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Bid Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedBids.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{file.vendorName}</h4>
                    <Badge className="bg-green-100 text-green-700">
                      ${file.totalBid?.toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {file.lineItemCount} line items • Source: {file.name}
                  </p>
                </div>
              ))}

              {hasManualBid && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{manualBidData.vendorName}</h4>
                    <Badge className="bg-blue-100 text-blue-700">
                      ${parseFloat(manualBidData.totalBid || '0').toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {manualBidData.lineItems.filter(item => item.description).length} line items • Source: Manual Entry
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Bids - {rfpTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Review & Import
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="upload">
              {renderUploadTab()}
            </TabsContent>

            <TabsContent value="manual">
              {renderManualTab()}
            </TabsContent>

            <TabsContent value="review">
              {renderReviewTab()}
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {activeTab === 'upload' && `${uploadedFiles.length} files uploaded`}
            {activeTab === 'manual' && 'Enter bid data manually'}
            {activeTab === 'review' && `Ready to import ${uploadedFiles.filter(f => f.status === 'completed').length + (manualBidData.vendorName ? 1 : 0)} bids`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {activeTab === 'review' && (
              <Button 
                onClick={submitBids}
                disabled={isProcessing || (uploadedFiles.filter(f => f.status === 'completed').length === 0 && !manualBidData.vendorName)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Import Bids
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
