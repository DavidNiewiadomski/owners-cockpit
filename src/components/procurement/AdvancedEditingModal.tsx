import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Minus,
  Copy,
  Trash2,
  Edit3,
  Calculator,
  Percent,
  DollarSign,
  Users,
  Building,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvancedEditingModalProps {
  isOpen: boolean;
  onClose: () => void;
  editableLineItems: any[];
  editableVendors: any[];
  onUpdateLineItems: (lineItems: any[]) => void;
  onUpdateVendors: (vendors: any[]) => void;
}

export function AdvancedEditingModal({
  isOpen,
  onClose,
  editableLineItems,
  editableVendors,
  onUpdateLineItems,
  onUpdateVendors
}: AdvancedEditingModalProps) {
  const [activeTab, setActiveTab] = useState('bulk-edit');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [bulkEditValue, setBulkEditValue] = useState('');
  const [bulkEditField, setBulkEditField] = useState('');
  const [bulkEditType, setBulkEditType] = useState<'replace' | 'multiply' | 'add'>('replace');
  const [newLineItem, setNewLineItem] = useState({
    csiCode: '',
    description: '',
    quantity: 1,
    unit: 'EA',
    category: 'General',
    engineerEstimate: 0
  });
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bondAmount: 0,
    bondRate: 1.0,
    prequalified: true,
    insuranceCompliant: true
  });
  const { toast } = useToast();

  const handleBulkEdit = () => {
    if (!bulkEditField || !bulkEditValue) {
      toast({
        title: "Invalid Input",
        description: "Please select a field and enter a value.",
        variant: "destructive"
      });
      return;
    }

    const numValue = parseFloat(bulkEditValue);
    if (isNaN(numValue)) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid number.",
        variant: "destructive"
      });
      return;
    }

    const updatedLineItems = editableLineItems.map(lineItem => {
      if (!selectedItems.includes(lineItem.id)) return lineItem;

      const updatedVendorBids = lineItem.vendorBids.map((bid: any) => {
        if (!selectedVendors.includes(bid.vendorId)) return bid;

        let newValue = numValue;
        const currentValue = bid[bulkEditField] || 0;

        switch (bulkEditType) {
          case 'multiply':
            newValue = currentValue * numValue;
            break;
          case 'add':
            newValue = currentValue + numValue;
            break;
          case 'replace':
          default:
            newValue = numValue;
            break;
        }

        const updatedBid = {
          ...bid,
          [bulkEditField]: newValue,
          isEdited: true
        };

        // Auto-calculate related field if editing unit price or total price
        if (bulkEditField === 'unitPrice') {
          updatedBid.totalPrice = newValue * lineItem.quantity;
        } else if (bulkEditField === 'totalPrice') {
          updatedBid.unitPrice = lineItem.quantity > 0 ? newValue / lineItem.quantity : 0;
        }

        return updatedBid;
      });

      return {
        ...lineItem,
        vendorBids: updatedVendorBids,
        hasUnsavedChanges: true
      };
    });

    onUpdateLineItems(updatedLineItems);

    toast({
      title: "Bulk Edit Applied",
      description: `Updated ${selectedItems.length} line items for ${selectedVendors.length} vendors.`,
    });

    // Reset selections
    setSelectedItems([]);
    setSelectedVendors([]);
    setBulkEditValue('');
  };

  const handleAddLineItem = () => {
    if (!newLineItem.description) {
      toast({
        title: "Missing Description",
        description: "Please enter a line item description.",
        variant: "destructive"
      });
      return;
    }

    const lineItemId = `LI-${Date.now()}`;
    const vendorBids = editableVendors.map(vendor => ({
      vendorId: vendor.id,
      vendorName: vendor.name,
      unitPrice: 0,
      totalPrice: 0,
      notes: '',
      isAlternate: false,
      hasException: false,
      isEdited: false,
      qualifications: vendor.qualifications
    }));

    const newItem = {
      id: lineItemId,
      csiCode: newLineItem.csiCode || `99 ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} 00`,
      description: newLineItem.description,
      quantity: newLineItem.quantity,
      unit: newLineItem.unit,
      category: newLineItem.category,
      engineerEstimate: newLineItem.engineerEstimate,
      isLocked: false,
      hasUnsavedChanges: true,
      vendorBids
    };

    onUpdateLineItems([...editableLineItems, newItem]);

    // Reset form
    setNewLineItem({
      csiCode: '',
      description: '',
      quantity: 1,
      unit: 'EA',
      category: 'General',
      engineerEstimate: 0
    });

    toast({
      title: "Line Item Added",
      description: "New line item has been added successfully.",
    });
  };

  const handleAddVendor = () => {
    if (!newVendor.name) {
      toast({
        title: "Missing Vendor Name",
        description: "Please enter a vendor name.",
        variant: "destructive"
      });
      return;
    }

    const vendorId = `VEN-${Date.now()}`;
    const vendor = {
      id: vendorId,
      name: newVendor.name,
      totalBid: 0,
      originalTotalBid: 0,
      technicalScore: 85,
      commercialScore: 85,
      compositeScore: 85,
      rank: editableVendors.length + 1,
      originalRank: editableVendors.length + 1,
      status: 'qualified' as const,
      hasUnsavedChanges: true,
      qualifications: {
        bonding: true,
        insurance: newVendor.insuranceCompliant,
        experience: newVendor.prequalified,
        licensing: true
      },
      pastPerformance: {
        onTimeDelivery: 90,
        qualityRating: 4.0,
        budgetCompliance: 90,
        safetyRecord: 95
      },
      alternatesSubmitted: 0,
      exceptionsNoted: 0,
      submissionDate: new Date().toISOString().split('T')[0]
    };

    // Add vendor bids to all existing line items
    const updatedLineItems = editableLineItems.map(lineItem => ({
      ...lineItem,
      vendorBids: [
        ...lineItem.vendorBids,
        {
          vendorId: vendorId,
          vendorName: newVendor.name,
          unitPrice: 0,
          totalPrice: 0,
          notes: '',
          isAlternate: false,
          hasException: false,
          isEdited: false,
          qualifications: vendor.qualifications
        }
      ],
      hasUnsavedChanges: true
    }));

    onUpdateVendors([...editableVendors, vendor]);
    onUpdateLineItems(updatedLineItems);

    // Reset form
    setNewVendor({
      name: '',
      email: '',
      phone: '',
      address: '',
      bondAmount: 0,
      bondRate: 1.0,
      prequalified: true,
      insuranceCompliant: true
    });

    toast({
      title: "Vendor Added",
      description: "New vendor has been added successfully.",
    });
  };

  const handleRemoveLineItem = (lineItemId: string) => {
    const updatedLineItems = editableLineItems.filter(item => item.id !== lineItemId);
    onUpdateLineItems(updatedLineItems);

    toast({
      title: "Line Item Removed",
      description: "Line item has been removed successfully.",
    });
  };

  const handleRemoveVendor = (vendorId: string) => {
    const updatedVendors = editableVendors.filter(vendor => vendor.id !== vendorId);
    const updatedLineItems = editableLineItems.map(lineItem => ({
      ...lineItem,
      vendorBids: lineItem.vendorBids.filter((bid: any) => bid.vendorId !== vendorId),
      hasUnsavedChanges: true
    }));

    onUpdateVendors(updatedVendors);
    onUpdateLineItems(updatedLineItems);

    toast({
      title: "Vendor Removed",
      description: "Vendor has been removed successfully.",
    });
  };

  const handleDuplicateLineItem = (lineItem: any) => {
    const newId = `LI-${Date.now()}`;
    const duplicatedItem = {
      ...lineItem,
      id: newId,
      description: `${lineItem.description} (Copy)`,
      hasUnsavedChanges: true,
      vendorBids: lineItem.vendorBids.map((bid: any) => ({
        ...bid,
        isEdited: false
      }))
    };

    onUpdateLineItems([...editableLineItems, duplicatedItem]);

    toast({
      title: "Line Item Duplicated",
      description: "Line item has been duplicated successfully.",
    });
  };

  const exportToCSV = () => {
    const headers = ['Line Item', 'CSI Code', 'Description', 'Quantity', 'Unit', 'Engineer Estimate'];
    editableVendors.forEach(vendor => {
      headers.push(`${vendor.name} - Unit Price`);
      headers.push(`${vendor.name} - Total Price`);
    });

    const rows = [headers];
    
    editableLineItems.forEach(lineItem => {
      const row = [
        lineItem.id,
        lineItem.csiCode,
        lineItem.description,
        lineItem.quantity.toString(),
        lineItem.unit,
        lineItem.engineerEstimate.toString()
      ];

      editableVendors.forEach(vendor => {
        const bid = lineItem.vendorBids.find((b: any) => b.vendorId === vendor.id);
        row.push(bid?.unitPrice?.toString() || '0');
        row.push(bid?.totalPrice?.toString() || '0');
      });

      rows.push(row);
    });

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bid_leveling_sheet.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Bid leveling sheet has been exported to CSV.",
    });
  };

  const renderBulkEditTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Edit Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Field to Edit</Label>
              <Select value={bulkEditField} onValueChange={setBulkEditField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unitPrice">Unit Price</SelectItem>
                  <SelectItem value="totalPrice">Total Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Operation</Label>
              <Select value={bulkEditType} onValueChange={setBulkEditType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="replace">Replace</SelectItem>
                  <SelectItem value="multiply">Multiply by</SelectItem>
                  <SelectItem value="add">Add</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                value={bulkEditValue}
                onChange={(e) => setBulkEditValue(e.target.value)}
                placeholder="Enter value"
                step="0.01"
              />
            </div>
          </div>
          <Button 
            onClick={handleBulkEdit}
            disabled={!bulkEditField || !bulkEditValue || selectedItems.length === 0 || selectedVendors.length === 0}
            className="w-full"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Apply Bulk Edit to {selectedItems.length} items, {selectedVendors.length} vendors
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Item Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Select Line Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedItems.length === editableLineItems.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems(editableLineItems.map(item => item.id));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                />
                <Label className="font-medium">Select All</Label>
              </div>
              <Separator />
              {editableLineItems.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems(prev => [...prev, item.id]);
                      } else {
                        setSelectedItems(prev => prev.filter(id => id !== item.id));
                      }
                    }}
                  />
                  <Label className="text-sm">
                    {item.description} ({item.csiCode})
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedVendors.length === editableVendors.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedVendors(editableVendors.map(vendor => vendor.id));
                    } else {
                      setSelectedVendors([]);
                    }
                  }}
                />
                <Label className="font-medium">Select All</Label>
              </div>
              <Separator />
              {editableVendors.map(vendor => (
                <div key={vendor.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedVendors.includes(vendor.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedVendors(prev => [...prev, vendor.id]);
                      } else {
                        setSelectedVendors(prev => prev.filter(id => id !== vendor.id));
                      }
                    }}
                  />
                  <Label className="text-sm">{vendor.name}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderManageItemsTab = () => (
    <div className="space-y-6">
      {/* Add New Line Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Line Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>CSI Code</Label>
              <Input
                value={newLineItem.csiCode}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, csiCode: e.target.value }))}
                placeholder="e.g., 23 05 00"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select 
                value={newLineItem.category} 
                onValueChange={(value) => setNewLineItem(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unit</Label>
              <Select 
                value={newLineItem.unit} 
                onValueChange={(value) => setNewLineItem(prev => ({ ...prev, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EA">Each (EA)</SelectItem>
                  <SelectItem value="LF">Linear Feet (LF)</SelectItem>
                  <SelectItem value="SF">Square Feet (SF)</SelectItem>
                  <SelectItem value="LS">Lump Sum (LS)</SelectItem>
                  <SelectItem value="LB">Pounds (LB)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label>Description *</Label>
              <Input
                value={newLineItem.description}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter line item description"
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={newLineItem.quantity}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                min="1"
              />
            </div>
            <div>
              <Label>Engineer Estimate</Label>
              <Input
                type="number"
                value={newLineItem.engineerEstimate}
                onChange={(e) => setNewLineItem(prev => ({ ...prev, engineerEstimate: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddLineItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Line Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manage Existing Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editableLineItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.csiCode} • {item.quantity} {item.unit} • ${item.engineerEstimate.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateLineItem(item)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveLineItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderManageVendorsTab = () => (
    <div className="space-y-6">
      {/* Add New Vendor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Vendor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Company Name *</Label>
              <Input
                value={newVendor.name}
                onChange={(e) => setNewVendor(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Vendor Company Name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newVendor.email}
                onChange={(e) => setNewVendor(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@vendor.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={newVendor.phone}
                onChange={(e) => setNewVendor(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label>Bond Rate (%)</Label>
              <Input
                type="number"
                value={newVendor.bondRate}
                onChange={(e) => setNewVendor(prev => ({ ...prev, bondRate: parseFloat(e.target.value) || 1.0 }))}
                placeholder="1.0"
                step="0.1"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                value={newVendor.address}
                onChange={(e) => setNewVendor(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Street Address, City, State ZIP"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newVendor.prequalified}
                onCheckedChange={(checked) => setNewVendor(prev => ({ ...prev, prequalified: !!checked }))}
              />
              <Label>Prequalified</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newVendor.insuranceCompliant}
                onCheckedChange={(checked) => setNewVendor(prev => ({ ...prev, insuranceCompliant: !!checked }))}
              />
              <Label>Insurance Compliant</Label>
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleAddVendor} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manage Existing Vendors */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editableVendors.map(vendor => (
              <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{vendor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Rank #{vendor.rank} • ${vendor.totalBid.toLocaleString()} • {vendor.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={vendor.status === 'qualified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                    {vendor.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveVendor(vendor.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Advanced Editing Tools
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="bulk-edit" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Bulk Edit
            </TabsTrigger>
            <TabsTrigger value="manage-items" className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Line Items
            </TabsTrigger>
            <TabsTrigger value="manage-vendors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="bulk-edit">
              {renderBulkEditTab()}
            </TabsContent>

            <TabsContent value="manage-items">
              {renderManageItemsTab()}
            </TabsContent>

            <TabsContent value="manage-vendors">
              {renderManageVendorsTab()}
            </TabsContent>

            <TabsContent value="export">
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button onClick={exportToCSV} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export to CSV
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export to Excel
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export Summary
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>• CSV export includes all line items and vendor bids</p>
                    <p>• Excel export includes formatted tables and calculations</p>
                    <p>• Summary export includes vendor rankings and analysis</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {editableLineItems.length} line items • {editableVendors.length} vendors
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
