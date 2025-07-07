import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  BarChart3,
  Calculator,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  FileSpreadsheet,
  Download,
  Filter,
  Settings,
  RefreshCw,
  MessageCircle,
  CheckCircle,
  XCircle,
  Flag,
  Target,
  Users,
  DollarSign,
  Percent,
  ArrowUpDown,
  Info,
  Zap,
  Star,
  Award,
  AlertCircle,
  Loader2,
  PieChart,
  Activity,
  Building,
  Calendar,
  Clock,
  FileCheck,
  Search,
  Gavel,
  Trophy,
  Upload,
  Plus,
  Save,
  Undo,
  Edit3,
  Lock,
  Unlock,
  History,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BidUploadModal } from './BidUploadModal';
import { AdvancedEditingModal } from './AdvancedEditingModal';

interface EditableLineItem {
  id: string;
  csiCode: string;
  description: string;
  quantity: number;
  unit: string;
  category: string;
  engineerEstimate: number;
  vendorBids: EditableVendorBid[];
  isLocked: boolean;
  hasUnsavedChanges: boolean;
  originalData?: any;
}

interface EditableVendorBid {
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  totalPrice: number;
  notes: string;
  isAlternate: boolean;
  hasException: boolean;
  isEdited: boolean;
  originalUnitPrice?: number;
  originalTotalPrice?: number;
  qualifications: {
    bonding: boolean;
    insurance: boolean;
    experience: boolean;
    licensing: boolean;
  };
}

interface EditableVendor {
  id: string;
  name: string;
  totalBid: number;
  originalTotalBid: number;
  technicalScore: number;
  commercialScore: number;
  compositeScore: number;
  rank: number;
  originalRank: number;
  status: 'qualified' | 'disqualified' | 'under-review';
  hasUnsavedChanges: boolean;
  qualifications: {
    bonding: boolean;
    insurance: boolean;
    experience: boolean;
    licensing: boolean;
  };
  pastPerformance: {
    onTimeDelivery: number;
    qualityRating: number;
    budgetCompliance: number;
    safetyRecord: number;
  };
  alternatesSubmitted: number;
  exceptionsNoted: number;
  submissionDate: string;
}

interface EditableBidLevelingBoardProps {
  rfpId: string;
  rfpTitle?: string;
  onComplete?: (results: any) => void;
}

export function EditableBidLevelingBoard({ 
  rfpId, 
  rfpTitle = "MEP Systems Installation - RFP-2024-002",
  onComplete 
}: EditableBidLevelingBoardProps) {
  const [activeTab, setActiveTab] = useState('leveling');
  const [editMode, setEditMode] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [importedBids, setImportedBids] = useState<any[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [showAdvancedEditing, setShowAdvancedEditing] = useState(false);
  const { toast } = useToast();

  // Initialize with mock data
  const [editableVendors, setEditableVendors] = useState<EditableVendor[]>([
    {
      id: 'VEN-001',
      name: 'Advanced MEP Solutions',
      totalBid: 5750000,
      originalTotalBid: 5750000,
      technicalScore: 92.5,
      commercialScore: 88.0,
      compositeScore: 90.3,
      rank: 1,
      originalRank: 1,
      status: 'qualified',
      hasUnsavedChanges: false,
      qualifications: {
        bonding: true,
        insurance: true,
        experience: true,
        licensing: true
      },
      pastPerformance: {
        onTimeDelivery: 96,
        qualityRating: 4.8,
        budgetCompliance: 94,
        safetyRecord: 99
      },
      alternatesSubmitted: 3,
      exceptionsNoted: 1,
      submissionDate: '2024-08-28'
    },
    {
      id: 'VEN-002',
      name: 'Premier HVAC Corp',
      totalBid: 5920000,
      originalTotalBid: 5920000,
      technicalScore: 89.0,
      commercialScore: 85.5,
      compositeScore: 87.3,
      rank: 2,
      originalRank: 2,
      status: 'qualified',
      hasUnsavedChanges: false,
      qualifications: {
        bonding: true,
        insurance: true,
        experience: true,
        licensing: true
      },
      pastPerformance: {
        onTimeDelivery: 92,
        qualityRating: 4.6,
        budgetCompliance: 89,
        safetyRecord: 97
      },
      alternatesSubmitted: 2,
      exceptionsNoted: 2,
      submissionDate: '2024-08-29'
    },
    {
      id: 'VEN-003',
      name: 'Integrated Building Systems',
      totalBid: 6100000,
      originalTotalBid: 6100000,
      technicalScore: 85.0,
      commercialScore: 82.0,
      compositeScore: 83.5,
      rank: 3,
      originalRank: 3,
      status: 'under-review',
      hasUnsavedChanges: false,
      qualifications: {
        bonding: true,
        insurance: false,
        experience: true,
        licensing: true
      },
      pastPerformance: {
        onTimeDelivery: 88,
        qualityRating: 4.3,
        budgetCompliance: 86,
        safetyRecord: 95
      },
      alternatesSubmitted: 1,
      exceptionsNoted: 4,
      submissionDate: '2024-08-30'
    },
    {
      id: 'VEN-004',
      name: 'Metro Mechanical',
      totalBid: 5450000,
      originalTotalBid: 5450000,
      technicalScore: 78.5,
      commercialScore: 95.0,
      compositeScore: 86.8,
      rank: 4,
      originalRank: 4,
      status: 'qualified',
      hasUnsavedChanges: false,
      qualifications: {
        bonding: true,
        insurance: true,
        experience: false,
        licensing: true
      },
      pastPerformance: {
        onTimeDelivery: 85,
        qualityRating: 4.1,
        budgetCompliance: 91,
        safetyRecord: 93
      },
      alternatesSubmitted: 0,
      exceptionsNoted: 6,
      submissionDate: '2024-08-27'
    }
  ]);

  const [editableLineItems, setEditableLineItems] = useState<EditableLineItem[]>([
    {
      id: 'LI-001',
      csiCode: '23 05 00',
      description: 'HVAC System - Main Air Handling Units',
      quantity: 4,
      unit: 'EA',
      category: 'HVAC',
      engineerEstimate: 450000,
      isLocked: false,
      hasUnsavedChanges: false,
      vendorBids: [
        { 
          vendorId: 'VEN-001', 
          vendorName: 'Advanced MEP Solutions', 
          unitPrice: 112500, 
          totalPrice: 450000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-002', 
          vendorName: 'Premier HVAC Corp', 
          unitPrice: 118750, 
          totalPrice: 475000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-003', 
          vendorName: 'Integrated Building Systems', 
          unitPrice: 122500, 
          totalPrice: 490000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: false, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-004', 
          vendorName: 'Metro Mechanical', 
          unitPrice: 106250, 
          totalPrice: 425000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: false, licensing: true } 
        }
      ]
    },
    {
      id: 'LI-002',
      csiCode: '23 07 00',
      description: 'Ductwork and Distribution System',
      quantity: 15000,
      unit: 'LF',
      category: 'HVAC',
      engineerEstimate: 850000,
      isLocked: false,
      hasUnsavedChanges: false,
      vendorBids: [
        { 
          vendorId: 'VEN-001', 
          vendorName: 'Advanced MEP Solutions', 
          unitPrice: 56.67, 
          totalPrice: 850000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-002', 
          vendorName: 'Premier HVAC Corp', 
          unitPrice: 58.00, 
          totalPrice: 870000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-003', 
          vendorName: 'Integrated Building Systems', 
          unitPrice: 60.67, 
          totalPrice: 910000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: false, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-004', 
          vendorName: 'Metro Mechanical', 
          unitPrice: 52.00, 
          totalPrice: 780000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: false, licensing: true } 
        }
      ]
    },
    {
      id: 'LI-003',
      csiCode: '26 05 00',
      description: 'Electrical Service and Distribution',
      quantity: 1,
      unit: 'LS',
      category: 'Electrical',
      engineerEstimate: 1200000,
      isLocked: false,
      hasUnsavedChanges: false,
      vendorBids: [
        { 
          vendorId: 'VEN-001', 
          vendorName: 'Advanced MEP Solutions', 
          unitPrice: 1250000, 
          totalPrice: 1250000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-002', 
          vendorName: 'Premier HVAC Corp', 
          unitPrice: 1180000, 
          totalPrice: 1180000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-003', 
          vendorName: 'Integrated Building Systems', 
          unitPrice: 1320000, 
          totalPrice: 1320000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: false, experience: true, licensing: true } 
        },
        { 
          vendorId: 'VEN-004', 
          vendorName: 'Metro Mechanical', 
          unitPrice: 1095000, 
          totalPrice: 1095000, 
          notes: '', 
          isAlternate: false, 
          hasException: false, 
          isEdited: false, 
          qualifications: { bonding: true, insurance: true, experience: false, licensing: true } 
        }
      ]
    }
  ]);

  // Recalculate vendor totals when line items change
  const recalculateVendorTotals = useCallback(() => {
    if (!autoCalculate) return;

    setEditableVendors(prev => prev.map(vendor => {
      const newTotal = editableLineItems.reduce((sum, lineItem) => {
        const vendorBid = lineItem.vendorBids.find(bid => bid.vendorId === vendor.id);
        return sum + (vendorBid?.totalPrice || 0);
      }, 0);

      const hasChanged = newTotal !== vendor.totalBid;
      
      return {
        ...vendor,
        totalBid: newTotal,
        hasUnsavedChanges: hasChanged || vendor.hasUnsavedChanges
      };
    }));

    // Recalculate rankings
    setTimeout(() => {
      setEditableVendors(prev => {
        const sorted = [...prev].sort((a, b) => {
          // Simple ranking by total bid and composite score
          const aScore = (1 / a.totalBid) * 1000000 + a.compositeScore;
          const bScore = (1 / b.totalBid) * 1000000 + b.compositeScore;
          return bScore - aScore;
        });

        return sorted.map((vendor, index) => ({
          ...vendor,
          rank: index + 1,
          hasUnsavedChanges: vendor.hasUnsavedChanges || vendor.rank !== index + 1
        }));
      });
    }, 100);
  }, [editableLineItems, autoCalculate]);

  useEffect(() => {
    recalculateVendorTotals();
  }, [editableLineItems, recalculateVendorTotals]);

  // Handle bid value changes
  const handleBidValueChange = useCallback((lineItemId: string, vendorId: string, field: 'unitPrice' | 'totalPrice', value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setEditableLineItems(prev => prev.map(lineItem => {
      if (lineItem.id !== lineItemId) return lineItem;
      
      const updatedVendorBids = lineItem.vendorBids.map(bid => {
        if (bid.vendorId !== vendorId) return bid;
        
        const originalUnitPrice = bid.originalUnitPrice ?? bid.unitPrice;
        const originalTotalPrice = bid.originalTotalPrice ?? bid.totalPrice;
        
        const updatedBid = {
          ...bid,
          [field]: numValue,
          isEdited: true,
          originalUnitPrice,
          originalTotalPrice
        };

        // Auto-calculate the other field if auto-calculate is enabled
        if (autoCalculate) {
          if (field === 'unitPrice') {
            updatedBid.totalPrice = numValue * lineItem.quantity;
          } else if (field === 'totalPrice') {
            updatedBid.unitPrice = lineItem.quantity > 0 ? numValue / lineItem.quantity : 0;
          }
        }

        return updatedBid;
      });

      return {
        ...lineItem,
        vendorBids: updatedVendorBids,
        hasUnsavedChanges: true
      };
    }));

    // Add to change history
    setChangeHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      action: 'bid_value_change',
      lineItemId,
      vendorId,
      field,
      oldValue: editableLineItems.find(li => li.id === lineItemId)
        ?.vendorBids.find(bid => bid.vendorId === vendorId)?.[field],
      newValue: numValue
    }]);

    setHasUnsavedChanges(true);
  }, [editableLineItems, autoCalculate]);

  // Handle notes changes
  const handleNotesChange = useCallback((lineItemId: string, vendorId: string, notes: string) => {
    setEditableLineItems(prev => prev.map(lineItem => {
      if (lineItem.id !== lineItemId) return lineItem;
      
      return {
        ...lineItem,
        vendorBids: lineItem.vendorBids.map(bid => 
          bid.vendorId === vendorId 
            ? { ...bid, notes, isEdited: true }
            : bid
        ),
        hasUnsavedChanges: true
      };
    }));
    
    setHasUnsavedChanges(true);
  }, []);

  // Lock/unlock line item
  const toggleLineItemLock = useCallback((lineItemId: string) => {
    setEditableLineItems(prev => prev.map(lineItem => 
      lineItem.id === lineItemId 
        ? { ...lineItem, isLocked: !lineItem.isLocked }
        : lineItem
    ));
  }, []);

  // Save changes
  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    
    try {
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark all items as saved
      setEditableLineItems(prev => prev.map(lineItem => ({
        ...lineItem,
        hasUnsavedChanges: false,
        vendorBids: lineItem.vendorBids.map(bid => ({
          ...bid,
          isEdited: false,
          originalUnitPrice: bid.unitPrice,
          originalTotalPrice: bid.totalPrice
        }))
      })));

      setEditableVendors(prev => prev.map(vendor => ({
        ...vendor,
        hasUnsavedChanges: false,
        originalTotalBid: vendor.totalBid,
        originalRank: vendor.rank
      })));

      setHasUnsavedChanges(false);
      
      toast({
        title: "Changes Saved",
        description: "All bid leveling changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Undo last change
  const undoLastChange = useCallback(() => {
    if (changeHistory.length === 0) return;
    
    const lastChange = changeHistory[changeHistory.length - 1];
    
    if (lastChange.action === 'bid_value_change') {
      setEditableLineItems(prev => prev.map(lineItem => {
        if (lineItem.id !== lastChange.lineItemId) return lineItem;
        
        return {
          ...lineItem,
          vendorBids: lineItem.vendorBids.map(bid => 
            bid.vendorId === lastChange.vendorId 
              ? { ...bid, [lastChange.field]: lastChange.oldValue }
              : bid
          )
        };
      }));
    }

    setChangeHistory(prev => prev.slice(0, -1));
    
    toast({
      title: "Change Undone",
      description: "Last change has been undone.",
    });
  }, [changeHistory, toast]);

  // Reset all changes
  const resetAllChanges = useCallback(() => {
    setEditableLineItems(prev => prev.map(lineItem => ({
      ...lineItem,
      hasUnsavedChanges: false,
      vendorBids: lineItem.vendorBids.map(bid => ({
        ...bid,
        unitPrice: bid.originalUnitPrice ?? bid.unitPrice,
        totalPrice: bid.originalTotalPrice ?? bid.totalPrice,
        isEdited: false
      }))
    })));

    setEditableVendors(prev => prev.map(vendor => ({
      ...vendor,
      totalBid: vendor.originalTotalBid,
      rank: vendor.originalRank,
      hasUnsavedChanges: false
    })));

    setChangeHistory([]);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Changes Reset",
      description: "All changes have been reset to original values.",
    });
  }, [toast]);

  const handleBidsUploaded = (newBids: any[]) => {
    setImportedBids(prev => [...prev, ...newBids]);
    toast({
      title: "Bids Imported Successfully",
      description: `${newBids.length} bid(s) have been imported and integrated into the analysis.`,
    });
  };

  const getVarianceColor = (actual: number, estimate: number) => {
    const variance = ((actual - estimate) / estimate) * 100;
    if (variance <= -10) return 'text-green-600';
    if (variance <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderEditableLevelingSheet = () => (
    <div className="space-y-6">
      {/* Edit Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={editMode} 
                  onCheckedChange={setEditMode}
                  id="edit-mode"
                />
                <Label htmlFor="edit-mode" className="flex items-center gap-2">
                  {editMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  Edit Mode
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={autoCalculate} 
                  onCheckedChange={setAutoCalculate}
                  id="auto-calc"
                />
                <Label htmlFor="auto-calc">Auto Calculate</Label>
              </div>

              {hasUnsavedChanges && (
                <Badge variant="destructive">
                  Unsaved Changes
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undoLastChange}
                disabled={changeHistory.length === 0 || !editMode}
              >
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllChanges}
                disabled={!hasUnsavedChanges || !editMode}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
              
              <Button
                onClick={saveChanges}
                disabled={!hasUnsavedChanges || isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Line Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Bid Leveling Sheet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {editableLineItems.map((lineItem) => (
              <div key={lineItem.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{lineItem.description}</h4>
                      {lineItem.hasUnsavedChanges && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Modified
                        </Badge>
                      )}
                      {lineItem.isLocked && (
                        <Badge variant="outline" className="text-gray-600">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      CSI: {lineItem.csiCode} • {lineItem.quantity} {lineItem.unit} • {lineItem.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Engineer Estimate: ${lineItem.engineerEstimate.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLineItemLock(lineItem.id)}
                      disabled={!editMode}
                    >
                      {lineItem.isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>vs. Estimate</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItem.vendorBids.map((bid) => (
                        <TableRow key={bid.vendorId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {bid.vendorName}
                              {bid.isEdited && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                                  Edited
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            {editMode && !lineItem.isLocked ? (
                              <Input
                                type="number"
                                value={bid.unitPrice}
                                onChange={(e) => handleBidValueChange(lineItem.id, bid.vendorId, 'unitPrice', e.target.value)}
                                className={`w-32 ${bid.isEdited ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                step="0.01"
                              />
                            ) : (
                              <span className={bid.isEdited ? 'text-blue-600 font-medium' : ''}>
                                ${bid.unitPrice.toLocaleString()}
                              </span>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            {editMode && !lineItem.isLocked ? (
                              <Input
                                type="number"
                                value={bid.totalPrice}
                                onChange={(e) => handleBidValueChange(lineItem.id, bid.vendorId, 'totalPrice', e.target.value)}
                                className={`w-36 ${bid.isEdited ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                step="1"
                              />
                            ) : (
                              <span className={`font-medium ${bid.isEdited ? 'text-blue-600' : ''}`}>
                                ${bid.totalPrice.toLocaleString()}
                              </span>
                            )}
                          </TableCell>
                          
                          <TableCell className={getVarianceColor(bid.totalPrice, lineItem.engineerEstimate)}>
                            {((bid.totalPrice - lineItem.engineerEstimate) / lineItem.engineerEstimate * 100).toFixed(1)}%
                          </TableCell>
                          
                          <TableCell>
                            {editMode && !lineItem.isLocked ? (
                              <Input
                                value={bid.notes}
                                onChange={(e) => handleNotesChange(lineItem.id, bid.vendorId, e.target.value)}
                                placeholder="Add notes..."
                                className="w-48"
                              />
                            ) : (
                              <span className="text-sm">{bid.notes || '-'}</span>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {Object.entries(bid.qualifications).map(([key, value]) => (
                                value ? (
                                  <CheckCircle key={key} className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle key={key} className="w-4 h-4 text-rose-400" />
                                )
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Updated Vendor Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Updated Vendor Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total Bid</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Technical Score</TableHead>
                <TableHead>Commercial Score</TableHead>
                <TableHead>Composite Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {vendor.rank === 1 && <Star className="w-4 h-4 text-yellow-400" />}
                      #{vendor.rank}
                      {vendor.rank !== vendor.originalRank && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                          {vendor.rank < vendor.originalRank ? '↑' : '↓'}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {vendor.name}
                      {vendor.hasUnsavedChanges && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                          Modified
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`font-medium ${vendor.totalBid !== vendor.originalTotalBid ? 'text-blue-600' : ''}`}>
                        ${vendor.totalBid.toLocaleString()}
                      </span>
                      {vendor.totalBid !== vendor.originalTotalBid && (
                        <span className="text-xs text-muted-foreground">
                          Was: ${vendor.originalTotalBid.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {vendor.totalBid !== vendor.originalTotalBid && (
                      <div className={`text-sm ${
                        vendor.totalBid < vendor.originalTotalBid ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {vendor.totalBid < vendor.originalTotalBid ? '-' : '+'}
                        ${Math.abs(vendor.totalBid - vendor.originalTotalBid).toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{vendor.technicalScore.toFixed(1)}%</TableCell>
                  <TableCell>{vendor.commercialScore.toFixed(1)}%</TableCell>
                  <TableCell className="font-medium">{vendor.compositeScore.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge className={vendor.status === 'qualified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Change History */}
      {changeHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Change History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {changeHistory.slice(-10).reverse().map((change, index) => (
                <div key={index} className="text-sm p-2 bg-muted rounded flex justify-between">
                  <span>
                    {change.action === 'bid_value_change' && (
                      `Changed ${change.field} for ${editableLineItems.find(li => li.id === change.lineItemId)?.vendorBids.find(bid => bid.vendorId === change.vendorId)?.vendorName} from ${change.oldValue} to ${change.newValue}`
                    )}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(change.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bid Leveling Analysis</h2>
          <p className="text-muted-foreground">{rfpTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Bids
          </Button>
          <Button 
            onClick={() => setShowAdvancedEditing(true)}
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            Advanced Tools
          </Button>
          <Badge variant="outline">{editableVendors.length} Bidders</Badge>
          <Badge variant="outline">{editableLineItems.length} Line Items</Badge>
          {importedBids.length > 0 && (
            <Badge className="bg-green-100 text-green-700">
              +{importedBids.length} Imported
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="leveling" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Editable Leveling Sheet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leveling">
          {renderEditableLevelingSheet()}
        </TabsContent>
      </Tabs>

      {/* Bid Upload Modal */}
      <BidUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        rfpId={rfpId}
        rfpTitle={rfpTitle}
        onBidsUploaded={handleBidsUploaded}
      />

      {/* Advanced Editing Modal */}
      <AdvancedEditingModal
        isOpen={showAdvancedEditing}
        onClose={() => setShowAdvancedEditing(false)}
        editableLineItems={editableLineItems}
        editableVendors={editableVendors}
        onUpdateLineItems={setEditableLineItems}
        onUpdateVendors={setEditableVendors}
      />
    </div>
  );
}
