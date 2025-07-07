import React, { useState, useMemo, useCallback } from 'react';
import type {
  SortingState,
  ColumnFiltersState,
  PaginationState} from '@tanstack/react-table';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2,
  Download,
  MessageCircle,
  AlertTriangle,
  TrendingUp,
  Filter,
  Settings,
  RefreshCw,
  BarChart3,
  FileSpreadsheet,
  Eye,
  EyeOff,
  Users,
  Calculator,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Target,
  Zap,
  PieChart,
  TrendingDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  LevelingVendor} from '@/hooks/useLevelingData';
import {
  useLevelingSnapshot,
  useLevelingAnalysis,
  useVendorBaseBids,
  useClarificationRequest,
  LevelingLineItem
} from '@/hooks/useLevelingData';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Enhanced interfaces for sophisticated bid leveling
interface LevelingBoardProps {
  rfpId: string;
  className?: string;
  onSelectionChange?: (selectedItems: string[]) => void;
  onDataRefresh?: () => void;
}

interface VendorCellData {
  vendor: LevelingVendor;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  isHighlighted?: boolean;
  showDetails?: boolean;
}

interface TableRow {
  id: string;
  lineItem: string;
  csiCode: string;
  description: string;
  quantity: number;
  uom: string;
  vendors: Record<string, VendorCellData>;
  statistics: {
    median: number;
    mean: number;
    min: number;
    max: number;
    std: number;
    iqr: number;
    cv: number; // Coefficient of variation
  };
  hasOutliers: boolean;
  outlierCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  compliance: {
    allVendorsResponded: boolean;
    missingVendors: string[];
    dataQuality: number; // 0-100
  };
}

interface AnalysisSettings {
  outlierThreshold: number;
  includeAllowances: boolean;
  includeAlternates: boolean;
  showMissingData: boolean;
  confidenceThreshold: number;
  groupByCSI: boolean;
  showUnitPrices: boolean;
  highlightRisks: boolean;
}

interface FilterState {
  csiCodes: string[];
  vendors: string[];
  outlierLevels: string[];
  riskLevels: string[];
  priceRange: [number, number];
  searchTerm: string;
}

const columnHelper = createColumnHelper<TableRow>();

// Enhanced utility functions
const formatCurrency = (amount: number, compact = false): string => {
  if (amount === 0) return '$0';
  if (compact) {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const getOutlierIcon = (vendor: LevelingVendor): string => {
  if (!vendor.isOutlier) return '';
  
  switch (vendor.outlierSeverity) {
    case 'severe':
      return vendor.outlierType === 'high' ? '🔺' : '🔻';
    case 'moderate':
      return '⚠️';
    case 'mild':
      return '❗';
    default:
      return '';
  }
};

const getOutlierColor = (vendor: LevelingVendor): string => {
  if (!vendor.isOutlier) return '';
  
  switch (vendor.outlierSeverity) {
    case 'severe':
      return vendor.outlierType === 'high' 
        ? 'bg-red-50 border-red-300 text-red-900' 
        : 'bg-blue-50 border-blue-300 text-blue-900';
    case 'moderate':
      return 'bg-orange-50 border-orange-300 text-orange-900';
    case 'mild':
      return 'bg-yellow-50 border-yellow-300 text-yellow-900';
    default:
      return '';
  }
};

const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Enhanced VendorCell component with detailed information
const VendorCell: React.FC<VendorCellData> = ({ 
  vendor, 
  isSelected, 
  onSelect, 
  isHighlighted, 
  showDetails = false 
}) => {
  const outlierIcon = getOutlierIcon(vendor);
  const outlierColor = getOutlierColor(vendor);
  const deviationText = formatPercentage(vendor.deviationFromMedian);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "relative p-3 rounded-lg border transition-all duration-200",
              "hover:shadow-md cursor-pointer",
              outlierColor,
              isSelected && "ring-2 ring-blue-500 ring-offset-1",
              isHighlighted && "ring-2 ring-yellow-400 ring-offset-1",
              !vendor.extended && "bg-gray-50 border-dashed border-gray-300"
            )}
            onClick={() => onSelect?.(!isSelected)}
          >
            {/* Selection checkbox */}
            {onSelect && (
              <Checkbox 
                checked={isSelected}
                onChange={(e) => onSelect((e.target as HTMLInputElement).checked)}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-1 right-1 w-4 h-4"
              />
            )}

            {/* Main content */}
            <div className="space-y-1">
              {vendor.extended ? (
                <>
                  <div className="font-semibold text-lg">
                    {formatCurrency(vendor.extended)}
                  </div>
                  {showDetails && (
                    <>
                      <div className="text-sm text-gray-600">
                        {vendor.quantity} {vendor.unitOfMeasure} @ {formatCurrency(vendor.unitPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Rank: {vendor.percentileRank.toFixed(0)}%
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-gray-400 text-sm font-medium">
                  No Response
                </div>
              )}

              {/* Outlier indicator */}
              <div className="flex items-center justify-between">
                {outlierIcon && (
                  <span className="text-lg" title={`${vendor.outlierSeverity} ${vendor.outlierType} outlier`}>
                    {outlierIcon}
                  </span>
                )}
                {vendor.isOutlier && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {deviationText}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-2">
            <div className="font-semibold">{vendor.vendorName}</div>
            {vendor.extended ? (
              <>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Extended: {formatCurrency(vendor.extended)}</div>
                  <div>Unit Price: {formatCurrency(vendor.unitPrice)}</div>
                  <div>Quantity: {vendor.quantity}</div>
                  <div>UOM: {vendor.unitOfMeasure}</div>
                  <div>Deviation: {deviationText}</div>
                  <div>Percentile: {vendor.percentileRank.toFixed(1)}%</div>
                </div>
                {vendor.isOutlier && (
                  <div className="text-red-600 text-sm font-medium">
                    {vendor.outlierSeverity?.toUpperCase()} {vendor.outlierType?.toUpperCase()} OUTLIER
                  </div>
                )}
                {vendor.isAllowance && (
                  <Badge variant="secondary" className="text-xs">
                    Allowance Item
                  </Badge>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-sm">
                No pricing submitted for this item
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Statistics panel component
const StatisticsPanel: React.FC<{ statistics: TableRow['statistics']; vendors: VendorCellData[] }> = ({ 
  statistics, 
  vendors 
}) => {
  const validVendors = vendors.filter(v => v.vendor.extended > 0);
  const responseRate = validVendors.length / vendors.length;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
      <div>
        <div className="text-gray-500">Median</div>
        <div className="font-semibold">{formatCurrency(statistics.median, true)}</div>
      </div>
      <div>
        <div className="text-gray-500">Range</div>
        <div className="font-semibold">{formatCurrency(statistics.max - statistics.min, true)}</div>
      </div>
      <div>
        <div className="text-gray-500">Std Dev</div>
        <div className="font-semibold">{formatCurrency(statistics.std, true)}</div>
      </div>
      <div>
        <div className="text-gray-500">Response</div>
        <div className="font-semibold">{(responseRate * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
};

export function LevelingBoard({ 
  rfpId, 
  className, 
  onSelectionChange, 
  onDataRefresh 
}: LevelingBoardProps) {
  // State management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [analysisSettings, setAnalysisSettings] = useState<AnalysisSettings>({
    outlierThreshold: 1.5,
    includeAllowances: true,
    includeAlternates: false,
    showMissingData: true,
    confidenceThreshold: 0.8,
    groupByCSI: true,
    showUnitPrices: false,
    highlightRisks: true,
  });
  
  const [filterState, setFilterState] = useState<FilterState>({
    csiCodes: [],
    vendors: [],
    outlierLevels: [],
    riskLevels: [],
    priceRange: [0, 10000000],
    searchTerm: '',
  });
  
  const [dialogStates, setDialogStates] = useState({
    clarification: false,
    settings: false,
    export: false,
    analysis: false,
  });
  
  const [activeTab, setActiveTab] = useState('matrix');
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');

  // Data fetching with error handling
  const { 
    data: snapshot, 
    isLoading, 
    error, 
    refetch 
  } = useLevelingSnapshot(rfpId);
  
  const levelingAnalysis = useLevelingAnalysis();
  const clarificationRequest = useClarificationRequest();
  const vendorBaseBids = useVendorBaseBids(snapshot?.matrixData || []);

  // Memoized computations
  const processedData = useMemo((): TableRow[] => {
    if (!snapshot?.matrixData?.length) return [];

    return snapshot.matrixData
      .filter(item => {
        // Apply analysis settings filters
        if (!analysisSettings.includeAllowances && item.vendors.some(v => v.isAllowance)) {
          return false;
        }
        return true;
      })
      .map(item => {
        const vendorData: Record<string, VendorCellData> = {};
        const uniqueVendors = new Set<string>();
        
        // Process vendors
        item.vendors.forEach(vendor => {
          if (!uniqueVendors.has(vendor.submissionId)) {
            uniqueVendors.add(vendor.submissionId);
            const cellId = `${item.groupKey}-${vendor.submissionId}`;
            
            vendorData[vendor.submissionId] = {
              vendor,
              isSelected: selectedCells.has(cellId),
              onSelect: (selected) => {
                const newSelected = new Set(selectedCells);
                if (selected) {
                  newSelected.add(cellId);
                } else {
                  newSelected.delete(cellId);
                }
                setSelectedCells(newSelected);
                onSelectionChange?.(Array.from(newSelected));
              },
              showDetails: viewMode === 'detailed',
            };
          }
        });
        
        // Calculate risk level based on statistics and outliers
        const cv = item.statistics.std / item.statistics.mean;
        const outlierRatio = item.outlierCount / item.vendors.length;
        
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if (cv > 0.3 || outlierRatio > 0.4) riskLevel = 'high';
        else if (cv > 0.15 || outlierRatio > 0.2) riskLevel = 'medium';
        
        // Calculate compliance metrics
        const respondedVendors = item.vendors.filter(v => v.extended > 0);
        const totalVendors = item.vendors.length;
        const missingVendors = item.vendors
          .filter(v => v.extended === 0)
          .map(v => v.vendorName);
        
        return {
          id: item.groupKey,
          lineItem: item.description,
          csiCode: item.csiCode || 'N/A',
          description: item.description,
          quantity: item.vendors[0]?.quantity || 0,
          uom: item.vendors[0]?.unitOfMeasure || '',
          vendors: vendorData,
          statistics: {
            ...item.statistics,
            cv, // Add coefficient of variation
          },
          hasOutliers: item.hasOutliers,
          outlierCount: item.outlierCount,
          riskLevel,
          compliance: {
            allVendorsResponded: respondedVendors.length === totalVendors,
            missingVendors,
            dataQuality: (respondedVendors.length / totalVendors) * 100,
          },
        };
      })
      .filter(row => {
        // Apply additional filters
        if (filterState.searchTerm && 
            !row.lineItem.toLowerCase().includes(filterState.searchTerm.toLowerCase()) &&
            !row.csiCode.toLowerCase().includes(filterState.searchTerm.toLowerCase())) {
          return false;
        }
        
        if (filterState.csiCodes.length > 0 && 
            !filterState.csiCodes.includes(row.csiCode)) {
          return false;
        }
        
        if (filterState.riskLevels.length > 0 && 
            !filterState.riskLevels.includes(row.riskLevel)) {
          return false;
        }
        
        return true;
      });
  }, [snapshot, analysisSettings, selectedCells, filterState, viewMode, onSelectionChange]);

  // Get unique values for filters
  const uniqueCSICodes = useMemo(() => {
    return Array.from(new Set(processedData.map(row => row.csiCode))).sort();
  }, [processedData]);
  
  const uniqueVendors = useMemo(() => {
    const vendors = new Set<string>();
    processedData.forEach(row => {
      Object.values(row.vendors).forEach(vendorData => {
        vendors.add(vendorData.vendor.vendorName);
      });
    });
    return Array.from(vendors).sort();
  }, [processedData]);

  // Table columns with enhanced functionality
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor('lineItem', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Line Item
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="space-y-2 min-w-[250px]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {row.csiCode}
                  </Badge>
                  <Badge 
                    className={cn("text-xs", getRiskLevelColor(row.riskLevel))}
                  >
                    {row.riskLevel} risk
                  </Badge>
                </div>
                <div className="font-medium text-sm leading-tight">
                  {info.getValue()}
                </div>
                {viewMode === 'detailed' && (
                  <div className="text-xs text-gray-500">
                    {row.quantity} {row.uom}
                  </div>
                )}
              </div>
              
              {row.hasOutliers && (
                <Badge variant="destructive" className="text-xs">
                  {row.outlierCount} outlier{row.outlierCount !== 1 ? 's' : ''}
                </Badge>
              )}
              
              {!row.compliance.allVendorsResponded && (
                <Badge variant="secondary" className="text-xs">
                  {row.compliance.missingVendors.length} missing
                </Badge>
              )}
              
              {viewMode === 'detailed' && (
                <StatisticsPanel 
                  statistics={row.statistics} 
                  vendors={Object.values(row.vendors)} 
                />
              )}
            </div>
          );
        },
        size: viewMode === 'detailed' ? 350 : 250,
        enableSorting: true,
      }),
    ];

    // Add vendor columns dynamically
    const vendorColumns = uniqueVendors.map(vendorName => {
      const vendorId = vendorName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      return columnHelper.accessor(
        (row) => {
          // Find vendor data by name since vendor IDs might be different
          const vendorEntry = Object.values(row.vendors).find(
            vendorData => vendorData.vendor.vendorName === vendorName
          );
          return vendorEntry?.vendor.extended || 0;
        },
        {
          id: vendorId,
          header: ({ column }) => (
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-auto p-0 font-semibold text-left"
              >
                {vendorName}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
              {viewMode === 'detailed' && (
                <div className="text-xs text-gray-500 font-normal">
                  Click to sort by price
                </div>
              )}
            </div>
          ),
          cell: (info) => {
            const vendorEntry = Object.values(info.row.original.vendors).find(
              vendorData => vendorData.vendor.vendorName === vendorName
            );
            
            return vendorEntry ? (
              <VendorCell {...vendorEntry} />
            ) : (
              <div className="p-3 text-gray-400 text-center border border-dashed rounded">
                No Data
              </div>
            );
          },
          size: viewMode === 'detailed' ? 200 : 160,
          enableSorting: true,
        }
      );
    });

    // Add summary column for detailed view
    if (viewMode === 'detailed') {
      const summaryColumn = columnHelper.display({
        id: 'summary',
        header: 'Analysis Summary',
        cell: (info) => {
          const row = info.row.original;
          const validPrices = Object.values(row.vendors)
            .map(v => v.vendor.extended)
            .filter(price => price > 0);
          
          if (validPrices.length === 0) {
            return (
              <div className="p-3 text-gray-500 text-center">
                No pricing data
              </div>
            );
          }
          
          return (
            <div className="space-y-3 p-3 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Lowest</div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(row.statistics.min)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Highest</div>
                  <div className="font-semibold text-red-600">
                    {formatCurrency(row.statistics.max)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Spread</div>
                  <div className="font-semibold">
                    {formatCurrency(row.statistics.max - row.statistics.min)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">CV</div>
                  <div className="font-semibold">
                    {(row.statistics.cv * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <Progress 
                value={row.compliance.dataQuality} 
                className="h-2" 
              />
              <div className="text-xs text-gray-600">
                {row.compliance.dataQuality.toFixed(0)}% response rate
              </div>
            </div>
          );
        },
        size: 200,
      });
      
      return [...baseColumns, ...vendorColumns, summaryColumn];
    }

    return [...baseColumns, ...vendorColumns];
  }, [uniqueVendors, viewMode]);

  // Table instance
  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    enableSorting: true,
    enableFilters: true,
  });

  // Event handlers
  const handleRefreshAnalysis = useCallback(() => {
    levelingAnalysis.mutate(
      { 
        rfpId, 
        forceRefresh: true, 
        outlierThreshold: analysisSettings.outlierThreshold 
      },
      {
        onSuccess: () => {
          toast.success('Analysis refreshed successfully');
          refetch();
          onDataRefresh?.();
        },
        onError: (error) => {
          toast.error(`Failed to refresh analysis: ${error.message}`);
        },
      }
    );
  }, [levelingAnalysis, rfpId, analysisSettings.outlierThreshold, refetch, onDataRefresh]);

  const handleExportToExcel = useCallback(() => {
    if (!snapshot?.matrixData?.length) {
      toast.error('No data to export');
      return;
    }

    try {
      // Prepare main data
      const exportData = processedData.map(row => {
        const rowData: Record<string, any> = {
          'CSI Code': row.csiCode,
          'Description': row.lineItem,
          'Quantity': row.quantity,
          'UOM': row.uom,
          'Risk Level': row.riskLevel,
          'Outliers': row.outlierCount,
          'Response Rate': `${row.compliance.dataQuality.toFixed(0)}%`,
          'Median Price': formatCurrency(row.statistics.median),
          'Mean Price': formatCurrency(row.statistics.mean),
          'Min Price': formatCurrency(row.statistics.min),
          'Max Price': formatCurrency(row.statistics.max),
          'Std Dev': formatCurrency(row.statistics.std),
          'Coefficient of Variation': `${(row.statistics.cv * 100).toFixed(1)}%`,
        };

        // Add vendor columns
        Object.values(row.vendors).forEach(vendorData => {
          const vendor = vendorData.vendor;
          const columnName = vendor.vendorName;
          
          if (vendor.extended > 0) {
            let cellValue = formatCurrency(vendor.extended);
            if (vendor.isOutlier) {
              cellValue += ` (${vendor.outlierSeverity} ${vendor.outlierType})`;
            }
            rowData[columnName] = cellValue;
          } else {
            rowData[columnName] = 'No Response';
          }
        });

        return rowData;
      });

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Main analysis sheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leveling Analysis');
      
      // Summary statistics sheet
      const summaryData = [
        ['RFP ID', rfpId],
        ['Analysis Date', new Date(snapshot.analysisDate).toLocaleDateString()],
        ['Total Line Items', snapshot.totalLineItems],
        ['Total Vendors', snapshot.totalSubmissions],
        ['Total Outliers', snapshot.summaryStats.totalOutliers],
        ['Outlier Percentage', `${snapshot.summaryStats.outlierPercentage.toFixed(1)}%`],
        ['Mean Base Bid', formatCurrency(snapshot.summaryStats.baseBidStatistics.mean)],
        ['Median Base Bid', formatCurrency(snapshot.summaryStats.baseBidStatistics.median)],
        ['Bid Range', formatCurrency(snapshot.summaryStats.baseBidStatistics.max - snapshot.summaryStats.baseBidStatistics.min)],
        ['Processing Time', `${snapshot.processingTime}ms`],
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      // Vendor base bids sheet
      const vendorBidsData = vendorBaseBids.map(vendor => ({
        'Vendor Name': vendor.vendorName,
        'Base Total': formatCurrency(vendor.baseTotal),
        'Allowance Total': formatCurrency(vendor.allowanceTotal),
        'Adjusted Total': formatCurrency(vendor.adjustedTotal),
      }));
      
      const vendorBidsSheet = XLSX.utils.json_to_sheet(vendorBidsData);
      XLSX.utils.book_append_sheet(workbook, vendorBidsSheet, 'Vendor Totals');
      
      // Export file
      const fileName = `Leveling_Analysis_${rfpId}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success('Excel file exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Excel file');
    }
  }, [snapshot, processedData, vendorBaseBids, rfpId]);

  const handleClarificationRequest = useCallback(() => {
    if (selectedCells.size === 0) {
      toast.error('Please select items to request clarifications');
      return;
    }

    const flaggedItems = Array.from(selectedCells).map(cellId => {
      const [groupKey, vendorId] = cellId.split('-');
      const row = processedData.find(r => r.id === groupKey);
      const vendorData = row?.vendors[vendorId];
      
      if (!row || !vendorData) return null;
      
      return {
        groupKey,
        description: row.lineItem,
        vendors: [{
          vendorName: vendorData.vendor.vendorName,
          issue: vendorData.vendor.isOutlier 
            ? `Outlier detected: ${vendorData.vendor.outlierSeverity} ${vendorData.vendor.outlierType}` 
            : 'Selected for clarification',
          amount: vendorData.vendor.extended,
        }],
      };
    }).filter(Boolean) as any[];

    clarificationRequest.mutate(
      { rfpId, flaggedItems },
      {
        onSuccess: () => {
          toast.success('Clarification requests sent successfully');
          setDialogStates(prev => ({ ...prev, clarification: false }));
          setSelectedCells(new Set());
        },
        onError: (error) => {
          toast.error(`Failed to send clarification requests: ${error.message}`);
        },
      }
    );
  }, [selectedCells, processedData, clarificationRequest, rfpId]);

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <div className="space-y-2">
              <div className="font-medium">Loading leveling analysis...</div>
              <div className="text-sm text-gray-600">
                Processing bid data and detecting outliers
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Error Loading Leveling Data</h3>
              <p className="text-gray-600">{error.message}</p>
            </div>
            <Button onClick={() => refetch()} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!snapshot) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Leveling Analysis Available</h3>
              <p className="text-gray-600">
                Generate a leveling analysis to compare vendor bids and detect outliers.
              </p>
            </div>
            <Button 
              onClick={handleRefreshAnalysis}
              disabled={levelingAnalysis.isPending}
              size="lg"
            >
              {levelingAnalysis.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Zap className="mr-2 h-4 w-4" />
              Generate Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6" />
                Bid Leveling Board
                <Badge variant="outline" className="ml-2">
                  {processedData.length} items
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Analysis from {new Date(snapshot.analysisDate).toLocaleDateString()} • 
                {snapshot.totalSubmissions} vendors • 
                {snapshot.totalLineItems} line items • 
                {selectedCells.size} selected
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex rounded-lg border p-1">
                <Button
                  variant={viewMode === 'compact' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('compact')}
                >
                  Compact
                </Button>
                <Button
                  variant={viewMode === 'detailed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('detailed')}
                >
                  Detailed
                </Button>
              </div>
              
              {/* Action buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogStates(prev => ({ ...prev, settings: true }))}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToExcel}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogStates(prev => ({ ...prev, clarification: true }))}
                disabled={selectedCells.size === 0}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Clarify ({selectedCells.size})
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAnalysis}
                disabled={levelingAnalysis.isPending}
              >
                {levelingAnalysis.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-sm font-medium text-gray-600">Total Outliers</div>
                <div className="text-2xl font-bold">{snapshot.summaryStats.totalOutliers}</div>
                <div className="text-xs text-gray-500">
                  {snapshot.summaryStats.outlierPercentage.toFixed(1)}% of submissions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-gray-600">Median Bid</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(snapshot.summaryStats.baseBidStatistics.median, true)}
                </div>
                <div className="text-xs text-gray-500">Base bid median</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-medium text-gray-600">Bid Range</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    snapshot.summaryStats.baseBidStatistics.max - 
                    snapshot.summaryStats.baseBidStatistics.min, 
                    true
                  )}
                </div>
                <div className="text-xs text-gray-500">High - Low</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-sm font-medium text-gray-600">Vendors</div>
                <div className="text-2xl font-bold">{snapshot.summaryStats.vendorCount}</div>
                <div className="text-xs text-gray-500">Submitted bids</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-sm font-medium text-gray-600">Std Deviation</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(snapshot.summaryStats.baseBidStatistics.std, true)}
                </div>
                <div className="text-xs text-gray-500">Bid variance</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-600">Processed</div>
                <div className="text-2xl font-bold">{snapshot.processingTime}ms</div>
                <div className="text-xs text-gray-500">Analysis time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="h-auto p-1 bg-transparent">
                <TabsTrigger value="matrix" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Leveling Matrix
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="outliers" className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Outlier Analysis
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="matrix" className="mt-0">
              {/* Controls */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder="Search line items or CSI codes..."
                      value={filterState.searchTerm}
                      onChange={(e) => setFilterState(prev => ({ 
                        ...prev, 
                        searchTerm: e.target.value 
                      }))}
                      className="max-w-sm"
                    />
                    
                    <Select
                      value={filterState.riskLevels.join(',')}
                      onValueChange={(value) => 
                        setFilterState(prev => ({ 
                          ...prev, 
                          riskLevels: value ? value.split(',') : [] 
                        }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by risk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Risk Levels</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="low">Low Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-allowances"
                        checked={analysisSettings.includeAllowances}
                        onCheckedChange={(checked) => 
                          setAnalysisSettings(prev => ({ 
                            ...prev, 
                            includeAllowances: checked 
                          }))
                        }
                      />
                      <Label htmlFor="include-allowances">Include Allowances</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="highlight-risks"
                        checked={analysisSettings.highlightRisks}
                        onCheckedChange={(checked) => 
                          setAnalysisSettings(prev => ({ 
                            ...prev, 
                            highlightRisks: checked 
                          }))
                        }
                      />
                      <Label htmlFor="highlight-risks">Highlight Risks</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-auto" style={{ maxHeight: '600px' }}>
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            style={{ width: header.getSize() }}
                            className="bg-white border-b-2"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className={cn(
                            "hover:bg-gray-50",
                            analysisSettings.highlightRisks && 
                            row.original.riskLevel === 'high' && 
                            "bg-red-50 border-l-4 border-red-400"
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell 
                              key={cell.id} 
                              style={{ width: cell.column.getSize() }}
                              className="p-2"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell 
                          colSpan={columns.length} 
                          className="h-24 text-center"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <BarChart3 className="h-8 w-8 text-gray-400" />
                            <div className="text-gray-500">No matching line items found</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setFilterState({
                                csiCodes: [],
                                vendors: [],
                                outlierLevels: [],
                                riskLevels: [],
                                priceRange: [0, 10000000],
                                searchTerm: '',
                              })}
                            >
                              Clear Filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-700">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} entries
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: table.getPageCount() }, (_, i) => (
                        <Button
                          key={i}
                          variant={table.getState().pagination.pageIndex === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => table.setPageIndex(i)}
                          className="w-8 h-8 p-0"
                        >
                          {i + 1}
                        </Button>
                      )).slice(
                        Math.max(0, table.getState().pagination.pageIndex - 2),
                        Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 3)
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="p-6">
                <div className="text-center text-gray-500">
                  Analytics dashboard coming soon...
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="outliers">
              <div className="p-6">
                <div className="text-center text-gray-500">
                  Detailed outlier analysis coming soon...
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog 
        open={dialogStates.settings} 
        onOpenChange={(open) => setDialogStates(prev => ({ ...prev, settings: open }))}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Analysis Settings</DialogTitle>
            <DialogDescription>
              Adjust the parameters for outlier detection and data filtering.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Outlier Threshold (IQR Multiplier)</Label>
                <Slider
                  value={[analysisSettings.outlierThreshold]}
                  onValueChange={(value) => 
                    setAnalysisSettings(prev => ({ 
                      ...prev, 
                      outlierThreshold: value[0] 
                    }))
                  }
                  min={1.0}
                  max={3.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-gray-600">
                  Current: {analysisSettings.outlierThreshold}x (Higher = Less Sensitive)
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <Slider
                  value={[analysisSettings.confidenceThreshold * 100]}
                  onValueChange={(value) => 
                    setAnalysisSettings(prev => ({ 
                      ...prev, 
                      confidenceThreshold: value[0] / 100 
                    }))
                  }
                  min={50}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-sm text-gray-600">
                  Current: {(analysisSettings.confidenceThreshold * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="setting-allowances"
                  checked={analysisSettings.includeAllowances}
                  onCheckedChange={(checked) => 
                    setAnalysisSettings(prev => ({ 
                      ...prev, 
                      includeAllowances: checked 
                    }))
                  }
                />
                <Label htmlFor="setting-allowances">Include Allowance Items</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="setting-alternates"
                  checked={analysisSettings.includeAlternates}
                  onCheckedChange={(checked) => 
                    setAnalysisSettings(prev => ({ 
                      ...prev, 
                      includeAlternates: checked 
                    }))
                  }
                />
                <Label htmlFor="setting-alternates">Include Alternate Bids</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="setting-missing"
                  checked={analysisSettings.showMissingData}
                  onCheckedChange={(checked) => 
                    setAnalysisSettings(prev => ({ 
                      ...prev, 
                      showMissingData: checked 
                    }))
                  }
                />
                <Label htmlFor="setting-missing">Show Missing Data Warnings</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="setting-group-csi"
                  checked={analysisSettings.groupByCSI}
                  onCheckedChange={(checked) => 
                    setAnalysisSettings(prev => ({ 
                      ...prev, 
                      groupByCSI: checked 
                    }))
                  }
                />
                <Label htmlFor="setting-group-csi">Group by CSI Division</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="setting-unit-prices"
                  checked={analysisSettings.showUnitPrices}
                  onCheckedChange={(checked) => 
                    setAnalysisSettings(prev => ({ 
                      ...prev, 
                      showUnitPrices: checked 
                    }))
                  }
                />
                <Label htmlFor="setting-unit-prices">Show Unit Price Analysis</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDialogStates(prev => ({ ...prev, settings: false }))}
            >
              Cancel
            </Button>
            <Button onClick={handleRefreshAnalysis}>
              Apply & Refresh
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clarification Dialog */}
      <AlertDialog 
        open={dialogStates.clarification} 
        onOpenChange={(open) => setDialogStates(prev => ({ ...prev, clarification: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Clarifications</AlertDialogTitle>
            <AlertDialogDescription>
              You have selected {selectedCells.size} item(s) for clarification. 
              This will generate automated clarification requests to the relevant vendors.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {Array.from(selectedCells).map(cellId => {
                const [groupKey, vendorId] = cellId.split('-');
                const row = processedData.find(r => r.id === groupKey);
                const vendorData = row?.vendors[vendorId];
                
                if (!row || !vendorData) return null;
                
                return (
                  <div key={cellId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="text-sm">
                      <div className="font-medium">{row.csiCode} - {row.lineItem}</div>
                      <div className="text-gray-600">{vendorData.vendor.vendorName}</div>
                    </div>
                    <Badge variant={vendorData.vendor.isOutlier ? "destructive" : "secondary"}>
                      {vendorData.vendor.isOutlier ? 'Outlier' : 'Selected'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClarificationRequest}
              disabled={clarificationRequest.isPending}
            >
              {clarificationRequest.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Requests
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
