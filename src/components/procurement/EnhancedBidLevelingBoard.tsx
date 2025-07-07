import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  LineChart, 
  Line, 
  Area, 
  AreaChart,
  ComposedChart,
  Legend,
  Scatter,
  ScatterChart
} from 'recharts';

interface BidLevelingBoardProps {
  rfpId: string;
  rfpTitle?: string;
  onComplete?: (results: any) => void;
}

export function EnhancedBidLevelingBoard({ 
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
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const { toast } = useToast();

  // Enhanced Mock Data
  const vendors = [
    {
      id: 'VEN-001',
      name: 'Advanced MEP Solutions LLC',
      totalBid: 5750000,
      technicalScore: 92.5,
      commercialScore: 88.0,
      complianceScore: 95.0,
      compositeScore: 90.3,
      rank: 1,
      status: 'qualified' as const,
      contact: {
        primary: 'Sarah Johnson, PE',
        email: 'sarah.johnson@advancedmep.com',
        phone: '(555) 987-6543',
        address: '1234 Industrial Blvd, Metro City, ST 12345'
      },
      qualifications: {
        bonding: true,
        insurance: true,
        experience: true,
        licensing: true,
        minorityOwned: false,
        womanOwned: false,
        veteranOwned: true
      },
      performance: {
        onTimeDelivery: 96,
        qualityRating: 4.8,
        budgetCompliance: 94,
        safetyRecord: 99,
        projectsCompleted: 87
      },
      submissionDetails: {
        date: '2024-08-28T16:30:00Z',
        alternates: 3,
        exceptions: 1,
        clarifications: 2,
        bondAmount: 57500,
        bondRate: 1.0
      }
    },
    {
      id: 'VEN-002',
      name: 'Premier HVAC Corporation',
      totalBid: 5920000,
      technicalScore: 89.0,
      commercialScore: 85.5,
      complianceScore: 93.0,
      compositeScore: 87.3,
      rank: 2,
      status: 'qualified' as const,
      contact: {
        primary: 'Michael Rodriguez',
        email: 'm.rodriguez@premierhvac.com',
        phone: '(555) 234-5678',
        address: '5678 Commerce Way, Metro City, ST 12345'
      },
      qualifications: {
        bonding: true,
        insurance: true,
        experience: true,
        licensing: true,
        minorityOwned: true,
        womanOwned: false,
        veteranOwned: false
      },
      performance: {
        onTimeDelivery: 92,
        qualityRating: 4.6,
        budgetCompliance: 89,
        safetyRecord: 97,
        projectsCompleted: 65
      },
      submissionDetails: {
        date: '2024-08-29T14:15:00Z',
        alternates: 2,
        exceptions: 2,
        clarifications: 1,
        bondAmount: 59200,
        bondRate: 1.0
      }
    },
    {
      id: 'VEN-003',
      name: 'Integrated Building Systems Inc',
      totalBid: 6100000,
      technicalScore: 85.0,
      commercialScore: 82.0,
      complianceScore: 85.0,
      compositeScore: 83.5,
      rank: 3,
      status: 'under-review' as const,
      contact: {
        primary: 'Lisa Chen, PE',
        email: 'l.chen@integratedbuilding.com',
        phone: '(555) 345-6789',
        address: '9012 Tech Drive, Metro City, ST 12345'
      },
      qualifications: {
        bonding: true,
        insurance: false,
        experience: true,
        licensing: true,
        minorityOwned: true,
        womanOwned: true,
        veteranOwned: false
      },
      performance: {
        onTimeDelivery: 88,
        qualityRating: 4.3,
        budgetCompliance: 86,
        safetyRecord: 95,
        projectsCompleted: 42
      },
      submissionDetails: {
        date: '2024-08-30T11:45:00Z',
        alternates: 1,
        exceptions: 4,
        clarifications: 5,
        bondAmount: 76250,
        bondRate: 1.25
      }
    },
    {
      id: 'VEN-004',
      name: 'Metro Mechanical Contractors',
      totalBid: 5450000,
      technicalScore: 78.5,
      commercialScore: 95.0,
      complianceScore: 88.0,
      compositeScore: 86.8,
      rank: 4,
      status: 'qualified' as const,
      contact: {
        primary: 'David Kim',
        email: 'd.kim@metromechanical.com',
        phone: '(555) 456-7890',
        address: '3456 Industrial Park Rd, Metro City, ST 12345'
      },
      qualifications: {
        bonding: true,
        insurance: true,
        experience: false,
        licensing: true,
        minorityOwned: false,
        womanOwned: false,
        veteranOwned: false
      },
      performance: {
        onTimeDelivery: 85,
        qualityRating: 4.1,
        budgetCompliance: 91,
        safetyRecord: 93,
        projectsCompleted: 28
      },
      submissionDetails: {
        date: '2024-08-27T13:20:00Z',
        alternates: 0,
        exceptions: 6,
        clarifications: 8,
        bondAmount: 81750,
        bondRate: 1.5
      }
    }
  ];

  const bidLineItems = [
    {
      id: 'LI-001',
      csiCode: '23 05 00',
      description: 'HVAC System - Main Air Handling Units',
      quantity: 4,
      unit: 'EA',
      category: 'HVAC',
      subcategory: 'Air Handling',
      estimates: {
        engineerEstimate: 450000,
        marketAverage: 425000,
        lowEstimate: 400000,
        highEstimate: 500000
      },
      vendorBids: [
        { vendorId: 'VEN-001', vendorName: 'Advanced MEP Solutions LLC', unitPrice: 112500, totalPrice: 450000, notes: 'Premium efficiency units with advanced controls' },
        { vendorId: 'VEN-002', vendorName: 'Premier HVAC Corporation', unitPrice: 118750, totalPrice: 475000, notes: 'Standard efficiency with 5-year warranty' },
        { vendorId: 'VEN-003', vendorName: 'Integrated Building Systems Inc', unitPrice: 122500, totalPrice: 490000, notes: 'High-efficiency with smart controls' },
        { vendorId: 'VEN-004', vendorName: 'Metro Mechanical Contractors', unitPrice: 106250, totalPrice: 425000, notes: 'Basic efficiency meeting specifications' }
      ],
      statistics: {
        mean: 460000,
        median: 462500,
        min: 425000,
        max: 490000,
        standardDeviation: 28867,
        variance: 833333333,
        coefficientOfVariation: 6.3
      },
      outliers: [],
      riskLevel: 'low' as const,
      complianceStatus: 'compliant' as const,
      marketCompetitiveness: 'good' as const
    },
    {
      id: 'LI-002',
      csiCode: '23 07 00',
      description: 'Ductwork and Distribution System',
      quantity: 15000,
      unit: 'LF',
      category: 'HVAC',
      subcategory: 'Ductwork',
      estimates: {
        engineerEstimate: 850000,
        marketAverage: 820000,
        lowEstimate: 750000,
        highEstimate: 950000
      },
      vendorBids: [
        { vendorId: 'VEN-001', vendorName: 'Advanced MEP Solutions LLC', unitPrice: 56.67, totalPrice: 850000, notes: 'Includes all fittings and supports' },
        { vendorId: 'VEN-002', vendorName: 'Premier HVAC Corporation', unitPrice: 58.00, totalPrice: 870000, notes: 'Galvanized steel with acoustic lining' },
        { vendorId: 'VEN-003', vendorName: 'Integrated Building Systems Inc', unitPrice: 60.67, totalPrice: 910000, notes: 'Stainless steel with premium insulation' },
        { vendorId: 'VEN-004', vendorName: 'Metro Mechanical Contractors', unitPrice: 52.00, totalPrice: 780000, notes: 'Basic galvanized with standard insulation' }
      ],
      statistics: {
        mean: 852500,
        median: 860000,
        min: 780000,
        max: 910000,
        standardDeviation: 54772,
        variance: 3000000000,
        coefficientOfVariation: 6.4
      },
      outliers: ['VEN-004'],
      riskLevel: 'medium' as const,
      complianceStatus: 'requires-review' as const,
      marketCompetitiveness: 'fair' as const
    },
    {
      id: 'LI-003',
      csiCode: '26 05 00',
      description: 'Electrical Service and Distribution',
      quantity: 1,
      unit: 'LS',
      category: 'Electrical',
      subcategory: 'Power Distribution',
      estimates: {
        engineerEstimate: 1200000,
        marketAverage: 1180000,
        lowEstimate: 1100000,
        highEstimate: 1350000
      },
      vendorBids: [
        { vendorId: 'VEN-001', vendorName: 'Advanced MEP Solutions LLC', unitPrice: 1250000, totalPrice: 1250000, notes: '2000A service with monitoring systems' },
        { vendorId: 'VEN-002', vendorName: 'Premier HVAC Corporation', unitPrice: 1180000, totalPrice: 1180000, notes: 'Standard 2000A service' },
        { vendorId: 'VEN-003', vendorName: 'Integrated Building Systems Inc', unitPrice: 1320000, totalPrice: 1320000, notes: 'Enhanced service with smart grid ready' },
        { vendorId: 'VEN-004', vendorName: 'Metro Mechanical Contractors', unitPrice: 1095000, totalPrice: 1095000, notes: 'Basic service meeting code minimum' }
      ],
      statistics: {
        mean: 1211250,
        median: 1215000,
        min: 1095000,
        max: 1320000,
        standardDeviation: 95743,
        variance: 9166666667,
        coefficientOfVariation: 7.9
      },
      outliers: ['VEN-003', 'VEN-004'],
      riskLevel: 'high' as const,
      complianceStatus: 'requires-review' as const,
      marketCompetitiveness: 'poor' as const
    },
    {
      id: 'LI-004',
      csiCode: '22 10 00',
      description: 'Domestic Water Distribution System',
      quantity: 1,
      unit: 'LS',
      category: 'Plumbing',
      subcategory: 'Water Systems',
      estimates: {
        engineerEstimate: 485000,
        marketAverage: 470000,
        lowEstimate: 420000,
        highEstimate: 550000
      },
      vendorBids: [
        { vendorId: 'VEN-001', vendorName: 'Advanced MEP Solutions LLC', unitPrice: 485000, totalPrice: 485000, notes: 'Complete distribution with backflow prevention' },
        { vendorId: 'VEN-002', vendorName: 'Premier HVAC Corporation', unitPrice: 495000, totalPrice: 495000, notes: 'Copper distribution with pressure reducing valves' },
        { vendorId: 'VEN-003', vendorName: 'Integrated Building Systems Inc', unitPrice: 520000, totalPrice: 520000, notes: 'Enhanced system with water quality monitoring' },
        { vendorId: 'VEN-004', vendorName: 'Metro Mechanical Contractors', unitPrice: 445000, totalPrice: 445000, notes: 'Standard distribution system' }
      ],
      statistics: {
        mean: 486250,
        median: 490000,
        min: 445000,
        max: 520000,
        standardDeviation: 31622,
        variance: 1000000000,
        coefficientOfVariation: 6.5
      },
      outliers: [],
      riskLevel: 'low' as const,
      complianceStatus: 'compliant' as const,
      marketCompetitiveness: 'good' as const
    }
  ];

  // Chart data
  const chartData = bidLineItems.map(item => ({
    name: item.description.length > 25 ? item.description.substring(0, 25) + '...' : item.description,
    lowBid: item.statistics.min,
    avgBid: item.statistics.mean,
    highBid: item.statistics.max,
    estimate: item.estimates.engineerEstimate,
    category: item.category
  }));

  const riskDistributionData = [
    { name: 'Low Risk', value: bidLineItems.filter(item => item.riskLevel === 'low').length, color: '#10B981' },
    { name: 'Medium Risk', value: bidLineItems.filter(item => item.riskLevel === 'medium').length, color: '#F59E0B' },
    { name: 'High Risk', value: bidLineItems.filter(item => item.riskLevel === 'high').length, color: '#EF4444' }
  ];

  const vendorComparisonData = vendors.map(vendor => ({
    name: vendor.name.split(' ')[0],
    technical: vendor.technicalScore,
    commercial: vendor.commercialScore,
    compliance: vendor.complianceScore,
    composite: vendor.compositeScore,
    totalBid: vendor.totalBid / 1000000
  }));

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
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    toast({
      title: "Analysis Complete",
      description: "Bid leveling analysis has been completed successfully.",
    });
  };

  const getVarianceColor = (actual: number, estimate: number) => {
    const variance = ((actual - estimate) / estimate) * 100;
    if (variance <= -10) return 'text-green-600 dark:text-green-400';
    if (variance <= 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'under-review': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'disqualified': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* AI Insights Panel */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Zap className="h-5 w-5 text-blue-400" />
            AI Procurement Insights
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border">
              <div className="text-2xl font-bold text-foreground">{vendors.length}</div>
              <div className="text-sm text-muted-foreground">Qualified Bidders</div>
            </div>
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border">
              <div className="text-2xl font-bold text-green-400">${Math.min(...vendors.map(v => v.totalBid)).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Lowest Total Bid</div>
            </div>
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border">
              <div className="text-2xl font-bold text-foreground">94%</div>
              <div className="text-sm text-muted-foreground">Compliance Rate</div>
            </div>
            <div className="bg-card/50 rounded-lg p-4 text-center border border-border">
              <div className="text-2xl font-bold text-blue-400">${((Math.max(...vendors.map(v => v.totalBid)) - Math.min(...vendors.map(v => v.totalBid))) / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Bid Spread</div>
            </div>
          </div>
          
          <div className="bg-card/50 rounded-lg p-4 border border-border">
            <p className="text-foreground text-sm">
              <strong>AI Recommendation:</strong> Advanced MEP Solutions LLC presents the best value proposition with a competitive bid of $5.75M, 
              strong technical qualifications (92.5%), and excellent past performance. Consider for award with minor clarifications on HVAC control sequences.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calculator className="h-5 w-5 text-muted-foreground" />
            Bid Analysis Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Run Statistical Analysis
                  </>
                )}
              </Button>
              
              {analysisComplete && (
                <Button 
                  onClick={() => setActiveTab('summary')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  View Recommendations
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-border hover:bg-accent text-foreground"
                onClick={() => {
                  toast({
                    title: "Export Analysis",
                    description: "Bid analysis data exported to Excel successfully.",
                  });
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-border hover:bg-accent text-foreground"
                onClick={() => {
                  toast({
                    title: "Generate Report",
                    description: "Comprehensive bid analysis report generated.",
                  });
                }}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Generate PDF Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bid Comparison Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Bid Comparison by Line Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 60, right: 30, left: 40, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  width={60}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={60}
                  iconType="rect"
                  wrapperStyle={{
                    paddingBottom: '20px',
                    fontSize: '14px'
                  }}
                />
                <Bar dataKey="lowBid" fill="#10B981" name="Low Bid" radius={[2, 2, 0, 0]} maxBarSize={50} />
                <Bar dataKey="avgBid" fill="#3B82F6" name="Average Bid" radius={[2, 2, 0, 0]} maxBarSize={50} />
                <Bar dataKey="highBid" fill="#EF4444" name="High Bid" radius={[2, 2, 0, 0]} maxBarSize={50} />
                <Bar dataKey="estimate" fill="#8B5CF6" name="Engineer Estimate" radius={[2, 2, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={30}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={entry.color}
                      strokeWidth={2}
                      filter="url(#shadow)"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value} items`, name]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">line items</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Performance Comparison */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Award className="h-5 w-5 text-muted-foreground" />
            Vendor Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={vendorComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="technical" fill="#3B82F6" name="Technical Score" />
              <Bar yAxisId="left" dataKey="commercial" fill="#10B981" name="Commercial Score" />
              <Bar yAxisId="left" dataKey="compliance" fill="#F59E0B" name="Compliance Score" />
              <Line yAxisId="right" type="monotone" dataKey="totalBid" stroke="#EF4444" strokeWidth={3} name="Total Bid ($M)" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vendor Rankings Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trophy className="h-5 w-5 text-muted-foreground" />
            Vendor Rankings & Evaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Rank</TableHead>
                <TableHead className="text-muted-foreground">Vendor</TableHead>
                <TableHead className="text-muted-foreground">Total Bid</TableHead>
                <TableHead className="text-muted-foreground">Technical</TableHead>
                <TableHead className="text-muted-foreground">Commercial</TableHead>
                <TableHead className="text-muted-foreground">Compliance</TableHead>
                <TableHead className="text-muted-foreground">Composite</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {vendor.rank === 1 && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      #{vendor.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.contact.primary}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">${vendor.totalBid.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{vendor.technicalScore.toFixed(1)}%</span>
                      <Progress value={vendor.technicalScore} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{vendor.commercialScore.toFixed(1)}%</span>
                      <Progress value={vendor.commercialScore} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{vendor.complianceScore.toFixed(1)}%</span>
                      <Progress value={vendor.complianceScore} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{vendor.compositeScore.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVendor(vendor.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
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
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Label className="text-foreground">Category:</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px] border-border">
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
              <Label className="text-foreground">Risk Level:</Label>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[120px] border-border">
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
              <Label htmlFor="outliers" className="text-foreground">Show outliers only</Label>
            </div>

            <div className="ml-auto">
              <Badge variant="outline" className="border-border text-foreground">
                {filteredLineItems.length} of {bidLineItems.length} items
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Item Analysis */}
      <div className="space-y-4">
        {filteredLineItems.map((item) => (
          <Card key={item.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{item.description}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    CSI: {item.csiCode} • {item.quantity.toLocaleString()} {item.unit} • {item.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRiskBadgeColor(item.riskLevel)}>
                    {item.riskLevel} risk
                  </Badge>
                  {item.outliers.length > 0 && (
                    <Badge variant="destructive">
                      {item.outliers.length} outlier{item.outliers.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Engineer Estimate</div>
                  <div className="font-medium text-foreground">${item.estimates.engineerEstimate.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mean Bid</div>
                  <div className="font-medium text-foreground">${item.statistics.mean.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Median Bid</div>
                  <div className="font-medium text-foreground">${item.statistics.median.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Bid Range</div>
                  <div className="font-medium text-foreground">${item.statistics.min.toLocaleString()} - ${item.statistics.max.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">CV%</div>
                  <div className="font-medium text-foreground">{item.statistics.coefficientOfVariation.toFixed(1)}%</div>
                </div>
              </div>

              {/* Vendor Bids Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">Vendor</TableHead>
                    <TableHead className="text-muted-foreground">Unit Price</TableHead>
                    <TableHead className="text-muted-foreground">Total Price</TableHead>
                    <TableHead className="text-muted-foreground">vs. Estimate</TableHead>
                    <TableHead className="text-muted-foreground">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.vendorBids.map((bid) => (
                    <TableRow key={bid.vendorId} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{bid.vendorName}</span>
                          {item.outliers.includes(bid.vendorId) && (
                            <Badge variant="destructive" className="text-xs">
                              Outlier
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        ${typeof bid.unitPrice === 'number' ? bid.unitPrice.toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">${bid.totalPrice.toLocaleString()}</TableCell>
                      <TableCell className={getVarianceColor(bid.totalPrice, item.estimates.engineerEstimate)}>
                        {((bid.totalPrice - item.estimates.engineerEstimate) / item.estimates.engineerEstimate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {bid.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Analysis Charts for this line item */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-foreground mb-2">Bid Distribution</h5>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={item.vendorBids.map(bid => ({ name: bid.vendorName.split(' ')[0], value: bid.totalPrice }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Bid Amount']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Bar dataKey="value" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">Statistical Analysis</h5>
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Standard Deviation:</span>
                      <span className="font-medium text-foreground">${item.statistics.standardDeviation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coefficient of Variation:</span>
                      <span className="font-medium text-foreground">{item.statistics.coefficientOfVariation.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Market Competitiveness:</span>
                      <Badge className={
                        item.marketCompetitiveness === 'good' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        item.marketCompetitiveness === 'fair' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }>
                        {item.marketCompetitiveness}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Assessment:</span>
                      <Badge className={getRiskBadgeColor(item.riskLevel)}>
                        {item.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-green-500" />
            Bid Analysis Summary & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recommended Award */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recommended Award
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-green-800 dark:text-green-400">Vendor: Advanced MEP Solutions LLC</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Total Bid: $5,750,000</p>
                <p className="text-sm text-green-700 dark:text-green-300">Composite Score: 90.3</p>
                <p className="text-sm text-green-700 dark:text-green-300">Technical Score: 92.5%</p>
              </div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-400">Estimated Savings: $245,000</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">4.1% below engineer estimate</p>
                <p className="text-sm text-green-700 dark:text-green-300">Risk Assessment: Low</p>
                <p className="text-sm text-green-700 dark:text-green-300">Compliance: Fully Compliant</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">$5.75M</div>
                <div className="text-sm text-muted-foreground">Recommended Bid</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">90.3</div>
                <div className="text-sm text-muted-foreground">Composite Score</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">94%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">18</div>
                <div className="text-sm text-muted-foreground">Days to Award</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Justification */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Award Justification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Technical Evaluation</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced MEP Solutions LLC demonstrated superior technical expertise with a score of 92.5%. 
                  Their proposal includes premium efficiency equipment with advanced controls, experienced project team, 
                  and comprehensive quality assurance plan. The vendor has extensive experience with similar projects 
                  and maintains excellent safety records.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Commercial Evaluation</h4>
                <p className="text-sm text-muted-foreground">
                  The bid of $5,750,000 represents excellent value, being 4.1% below the engineer's estimate while 
                  providing superior technical solutions. Strong financial stability, adequate bonding capacity, 
                  and competitive pricing justify the commercial score of 88.0%.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Risk Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  Low overall risk profile with 96% on-time delivery rate, 99% safety record, and proven ability 
                  to deliver complex MEP projects. Insurance and bonding are adequate for project scope. 
                  Veteran-owned business provides additional value for diversity goals.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-foreground">Bid analysis and leveling completed</div>
                    <div className="text-sm text-muted-foreground">Statistical analysis shows competitive pricing with low risk</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Clarify HVAC control sequences</div>
                    <div className="text-sm text-muted-foreground">Request detailed control narrative from Advanced MEP Solutions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Generate award recommendation memo</div>
                    <div className="text-sm text-muted-foreground">Prepare formal recommendation for approval</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Submit for stakeholder approval</div>
                    <div className="text-sm text-muted-foreground">Route through approval workflow</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full mt-0.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-foreground">Issue award notification</div>
                    <div className="text-sm text-muted-foreground">Notify successful and unsuccessful bidders</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => onComplete?.(vendors.find(v => v.rank === 1))}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Recommendation
              </Button>
              <Button 
                variant="outline"
                className="border-border hover:bg-accent text-foreground"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Award Package
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Analysis completed on {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">Bid Leveling Analysis</h2>
          <p className="text-muted-foreground mt-1">{rfpTitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <Users className="w-4 h-4 mr-2" />
            {vendors.length} Bidders
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <FileCheck className="w-4 h-4 mr-2" />
            {bidLineItems.length} Line Items
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <DollarSign className="w-4 h-4 mr-2" />
            ${(Math.min(...vendors.map(v => v.totalBid)) / 1000000).toFixed(2)}M Low Bid
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 gap-4 w-full p-1 mb-6 bg-muted/50">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background">
                <BarChart3 className="h-4 w-4" />
                Overview & Analytics
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Calculator className="h-4 w-4" />
                Detailed Analysis
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Target className="h-4 w-4" />
                Summary & Recommendations
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                {renderOverview()}
              </TabsContent>

              <TabsContent value="analysis" className="mt-0">
                {renderDetailedAnalysis()}
              </TabsContent>

              <TabsContent value="summary" className="mt-0">
                {renderSummary()}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
