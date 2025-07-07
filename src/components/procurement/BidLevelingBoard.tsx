import React, { useState, useMemo } from 'react';
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
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBidAnalysis } from '@/hooks/useBidAnalysis';
import type { BidAnalysisFilters } from '@/types/bidAnalysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { BidUploadModal } from './BidUploadModal';
import BidAnalysisGraph from './BidAnalysisGraph';

interface BidItem {
  id: string;
  csiCode: string;
  description: string;
  quantity: number;
  unit: string;
  category: string;
}

interface VendorBid {
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  isAlternate?: boolean;
  hasException?: boolean;
  qualifications: {
    bonding: boolean;
    insurance: boolean;
    experience: boolean;
    licensing: boolean;
  };
}

interface BidLineItem extends BidItem {
  estimates: {
    engineerEstimate: number;
    marketAverage: number;
    lowEstimate: number;
    highEstimate: number;
  };
  vendorBids: VendorBid[];
  statistics: {
    mean: number;
    median: number;
    min: number;
    max: number;
    standardDeviation: number;
    variance: number;
  };
  outliers: string[]; // vendor IDs with outlier bids
  riskLevel: 'low' | 'medium' | 'high';
  complianceStatus: 'compliant' | 'non-compliant' | 'requires-review';
}

interface Vendor {
  id: string;
  name: string;
  totalBid: number;
  technicalScore: number;
  commercialScore: number;
  compositeScore: number;
  rank: number;
  status: 'qualified' | 'disqualified' | 'under-review';
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

interface BidLevelingBoardProps {
  rfpId: string;
  rfpTitle?: string;
  onComplete?: (results: any) => void;
}

export function BidLevelingBoard({ 
  rfpId, 
  rfpTitle = "MEP Systems Installation - RFP-2024-002",
  onComplete 
}: BidLevelingBoardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLineItems, setSelectedLineItems] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showOutliersOnly, setShowOutliersOnly] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [importedBids, setImportedBids] = useState<any[]>([]);
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const vendors: Vendor[] = [
    {
      id: 'VEN-001',
      name: 'Advanced MEP Solutions',
      totalBid: 5750000,
      technicalScore: 92.5,
      commercialScore: 88.0,
      compositeScore: 90.3,
      rank: 1,
      status: 'qualified',
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
      technicalScore: 89.0,
      commercialScore: 85.5,
      compositeScore: 87.3,
      rank: 2,
      status: 'qualified',
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
      technicalScore: 85.0,
      commercialScore: 82.0,
      compositeScore: 83.5,
      rank: 3,
      status: 'under-review',
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
      technicalScore: 78.5,
      commercialScore: 95.0,
      compositeScore: 86.8,
      rank: 4,
      status: 'qualified',
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
  ];

  const bidLineItems: BidLineItem[] = [
    {
      id: 'LI-001',
      csiCode: '23 05 00',
      description: 'HVAC System - Main Air Handling Units',
      quantity: 4,
      unit: 'EA',
      category: 'HVAC',
      estimates: {
        engineerEstimate: 450000,
        marketAverage: 425000,
        lowEstimate: 400000,
        highEstimate: 500000
      },
      vendorBids: [
        { vendorId: 'VEN-001', vendorName: 'Advanced MEP Solutions', unitPrice: 112500, totalPrice: 450000, qualifications: { bonding: true, insurance: true, experience: true, licensing: true } },
        { vendorId: 'VEN-002', vendorName: 'Premier HVAC Corp', unitPrice: 118750, totalPrice: 475000, qualifications: { bonding: true, insurance: true, experience: true, licensing: true } },
        { vendorId: 'VEN-003', vendorName: 'Integrated Building Systems', unitPrice: 122500, totalPrice: 490000, qualifications: { bonding: true, insurance: false, experience: true, licensing: true } },
        { vendorId: 'VEN-004', vendorName: 'Metro Mechanical', unitPrice: 106250, totalPrice: 425000, qualifications: { bonding: true, insurance: true, experience: false, licensing: true } }
      ],
      statistics: {
        mean: 460000,
        median: 462500,
        min: 425000,
        max: 490000,
        standardDeviation: 28867,
        variance: 833333333
      },
      outliers: [],
      riskLevel: 'low',
      complianceStatus: 'compliant'
    },
    {
      id: 'LI-002',
      csiCode: '23 07 00',
      description: 'Ductwork and Distribution System',
      quantity: 15000,
      unit: 'LF',
      category: 'HVAC',
      estimates: {
        engineerEstimate: 850000,
        marketAverage: 820000,
        lowEstimate: 750000,
        highEstimate: 950000
      },
      vendorBids: [
        { vendorId: 'VEN-001', vendorName: 'Advanced MEP Solutions', unitPrice: 56.67, totalPrice: 850000, qualifications: { bonding: true, insurance: true, experience: true, licensing: true } },
        { vendorId: 'VEN-002', vendorName: 'Premier HVAC Corp', unitPrice: 58.00, totalPrice: 870000, qualifications: { bonding: true, insurance: true, experience: true, licensing: true } },
        { vendorId: 'VEN-003', vendorName: 'Integrated Building Systems', unitPrice: 60.67, totalPrice: 910000, qualifications: { bonding: true, insurance: false, experience: true, licensing: true } },
        { vendorId: 'VEN-004', vendorName: 'Metro Mechanical', unitPrice: 52.00, totalPrice: 780000, qualifications: { bonding: true, insurance: true, experience: false, licensing: true } }
      ],
      statistics: {
        mean: 852500,
        median: 860000,
        min: 780000,
        max: 910000,
        standardDeviation: 54772,
        variance: 3000000000
      },
      outliers: ['VEN-004'],
      riskLevel: 'medium',
      complianceStatus: 'requires-review'
    },
    {
      id: 'LI-003',
      csiCode: '26 05 00',
      description: 'Electrical Service and Distribution',
      quantity: 1,
      unit: 'LS',
      category: 'Electrical',
      estimates: {
        engineerEstimate: 1200000,
        marketAverage: 1180000,
        lowEstimate: 1100000,
        highEstimate: 1350000
      },
      vendorBids: [
        { vendorId: 'VEN-001', vendorName: 'Advanced MEP Solutions', unitPrice: 1250000, totalPrice: 1250000, qualifications: { bonding: true, insurance: true, experience: true, licensing: true } },
        { vendorId: 'VEN-002', vendorName: 'Premier HVAC Corp', unitPrice: 1180000, totalPrice: 1180000, qualifications: { bonding: true, insurance: true, experience: true, licensing: true } },
        { vendorId: 'VEN-003', vendorName: 'Integrated Building Systems', unitPrice: 1320000, totalPrice: 1320000, qualifications: { bonding: true, insurance: false, experience: true, licensing: true } },
        { vendorId: 'VEN-004', vendorName: 'Metro Mechanical', unitPrice: 1095000, totalPrice: 1095000, qualifications: { bonding: true, insurance: true, experience: false, licensing: true } }
      ],
      statistics: {
        mean: 1211250,
        median: 1215000,
        min: 1095000,
        max: 1320000,
        standardDeviation: 95743,
        variance: 9166666667
      },
      outliers: ['VEN-003', 'VEN-004'],
      riskLevel: 'high',
      complianceStatus: 'requires-review'
    }
  ];

  const filteredLineItems = useMemo(() => {
    let filtered = bidLineItems;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    if (filterRisk !== 'all') {
      filtered = filtered.filter(item => item.riskLevel === filterRisk);
    }
    
    if (showOutliersOnly) {
      filtered = filtered.filter(item => item.outliers.length > 0);
    }
    
    return filtered;
  }, [filterCategory, filterRisk, showOutliersOnly]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    toast({
      title: "Analysis Complete",
      description: "Bid leveling analysis has been completed successfully.",
    });
  };

  const handleCompleteEvaluation = () => {
    if (onComplete) {
      onComplete({
        rfpId,
        vendors: vendors.map(v => ({ ...v, rank: v.rank })),
        recommendations: {
          recommendedVendor: vendors.find(v => v.rank === 1),
          totalSavings: 245000,
          riskAssessment: 'Low overall risk with good vendor qualification'
        }
      });
    }
    setActiveTab('summary');
  };

  const handleBidsUploaded = (newBids: any[]) => {
    setImportedBids(prev => [...prev, ...newBids]);
    toast({
      title: "Bids Imported Successfully",
      description: `${newBids.length} bid(s) have been imported and integrated into the analysis.`,
    });
    // In a real application, you would update the vendors and bidLineItems arrays
    // with the newly imported bid data
  };

  const getVarianceColor = (actual: number, estimate: number) => {
    const variance = ((actual - estimate) / estimate) * 100;
    if (variance <= -10) return 'text-green-600';
    if (variance <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getComplianceBadgeColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700 border-green-200';
      case 'requires-review': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'non-compliant': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

const renderOverview = () => (
    <div className="space-y-6">
      {/* Analysis Controls */}

      {/* Enhanced Bid Analysis Graphs */}
      <BidAnalysisGraph 
        data={bidLineItems.map(item => ({
          name: item.description.length > 25 ? item.description.substring(0, 25) + '...' : item.description,
          lowBid: item.statistics.min,
          averageBid: item.statistics.mean,
          highBid: item.statistics.max,
          engineerEstimate: item.estimates.engineerEstimate,
          variance: ((item.statistics.mean - item.estimates.engineerEstimate) / item.estimates.engineerEstimate) * 100,
          bidCount: item.vendorBids.length
        }))}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Bid Analysis Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
              
              {analysisComplete && (
                <Button 
                  onClick={handleCompleteEvaluation}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Evaluation
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Export Analysis",
                    description: "Exporting bid analysis data to Excel...",
                  });
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Generate Report",
                    description: "Generating comprehensive bid analysis report...",
                  });
                }}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{vendors.length}</div>
                <div className="text-sm text-muted-foreground">Total Bidders</div>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${Math.min(...vendors.map(v => v.totalBid)).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Lowest Bid</div>
              </div>
              <TrendingDown className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {bidLineItems.filter(item => item.outliers.length > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Items with Outliers</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Vendor Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total Bid</TableHead>
                <TableHead>Technical Score</TableHead>
                <TableHead>Commercial Score</TableHead>
                <TableHead>Composite Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">
                    {vendor.rank === 1 && <Star className="w-4 h-4 inline mr-1 text-yellow-400" />}
                    #{vendor.rank}
                  </TableCell>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>${vendor.totalBid.toLocaleString()}</TableCell>
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
    </div>
  );

  const renderDetailedAnalysis = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Label>Filter by Category:</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label>Risk Level:</Label>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="outliers" 
                checked={showOutliersOnly}
                onCheckedChange={setShowOutliersOnly}
              />
              <Label htmlFor="outliers">Show outliers only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Item Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Line Item Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLineItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{item.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      CSI: {item.csiCode} • {item.quantity} {item.unit} • {item.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskBadgeColor(item.riskLevel)}>
                      {item.riskLevel} risk
                    </Badge>
                    <Badge className={getComplianceBadgeColor(item.complianceStatus)}>
                      {item.complianceStatus}
                    </Badge>
                    {item.outliers.length > 0 && (
                      <Badge variant="destructive">
                        {item.outliers.length} outlier{item.outliers.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>vs. Estimate</TableHead>
                      <TableHead>Qualifications</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.vendorBids.map((bid) => (
                      <TableRow key={bid.vendorId} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {bid.vendorName}
                            {item.outliers.includes(bid.vendorId) && (
                              <Badge variant="destructive" className="text-xs">
                                Outlier
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>${bid.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${bid.totalPrice.toLocaleString()}</TableCell>
                        <TableCell className={getVarianceColor(bid.totalPrice, item.estimates.engineerEstimate)}>
                          {((bid.totalPrice - item.estimates.engineerEstimate) / item.estimates.engineerEstimate * 100).toFixed(1)}%
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

                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Engineer Estimate:</span>
                    <div>${item.estimates.engineerEstimate.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Mean Bid:</span>
                    <div>${item.statistics.mean.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Median Bid:</span>
                    <div>${item.statistics.median.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Range:</span>
                    <div>${item.statistics.min.toLocaleString()} - ${item.statistics.max.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Std. Deviation:</span>
                    <div>${item.statistics.standardDeviation.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Evaluation Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Recommended Award</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Vendor: Advanced MEP Solutions</p>
                <p className="text-sm text-muted-foreground">Total Bid: $5,750,000</p>
                <p className="text-sm text-muted-foreground">Composite Score: 90.3</p>
              </div>
              <div>
                <p className="font-medium">Estimated Savings: $245,000</p>
                <p className="text-sm text-muted-foreground">4.1% below engineer estimate</p>
                <p className="text-sm text-muted-foreground">Risk Assessment: Low</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">$5.75M</div>
                <div className="text-sm text-muted-foreground">Recommended Bid</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">90.3</div>
                <div className="text-sm text-muted-foreground">Composite Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Next Steps:</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Bid analysis and leveling completed</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 rounded-full mt-0.5"></div>
                <span className="text-sm">Generate award recommendation memo</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mt-0.5"></div>
                <span className="text-sm">Submit for approval</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mt-0.5"></div>
                <span className="text-sm">Issue award notification</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
          <Badge variant="outline">{vendors.length} Bidders</Badge>
          <Badge variant="outline">{bidLineItems.length} Line Items</Badge>
          {importedBids.length > 0 && (
            <Badge className="bg-green-100 text-green-700">
              +{importedBids.length} Imported
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Detailed Analysis
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="analysis">
          {renderDetailedAnalysis()}
        </TabsContent>

        <TabsContent value="summary">
          {renderSummary()}
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
    </div>
  );
}
