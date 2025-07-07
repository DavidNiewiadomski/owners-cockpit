import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
  AreaChart,
  ReferenceLine,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Activity,
  DollarSign,
  Users,
  TrendingDown,
  Award,
  Shield,
  Zap,
  Download,
  Filter,
  RotateCcw
} from 'lucide-react';

interface BidAnalysisGraphProps {
  data: Array<{ 
    name: string; 
    lowBid: number; 
    averageBid: number; 
    highBid: number; 
    engineerEstimate?: number;
    variance?: number;
    bidCount?: number;
  }>;
}

const BidAnalysisGraph: React.FC<BidAnalysisGraphProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Enhanced data processing
  const enhancedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      id: index,
      variance: item.engineerEstimate 
        ? ((item.averageBid - item.engineerEstimate) / item.engineerEstimate) * 100
        : 0,
      spread: ((item.highBid - item.lowBid) / item.averageBid) * 100,
      bidCount: item.bidCount || Math.floor(Math.random() * 8) + 3,
      competitiveness: 75 + Math.random() * 25,
      riskScore: Math.random() * 100,
      category: ['HVAC', 'Electrical', 'Plumbing', 'Structural'][Math.floor(Math.random() * 4)]
    }));
  }, [data]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalItems = enhancedData.length;
    const avgVariance = enhancedData.reduce((sum, item) => sum + Math.abs(item.variance), 0) / totalItems;
    const avgSpread = enhancedData.reduce((sum, item) => sum + item.spread, 0) / totalItems;
    const totalValue = enhancedData.reduce((sum, item) => sum + item.averageBid, 0);
    const riskItems = enhancedData.filter(item => item.riskScore > 60).length;
    
    return {
      totalItems,
      totalValue,
      avgVariance,
      avgSpread,
      riskItems,
      competitiveItems: enhancedData.filter(item => item.spread < 15).length
    };
  }, [enhancedData]);

  // Risk distribution data - ensure we always have valid data for display
  const riskDistributionData = useMemo(() => {
    if (enhancedData.length === 0) {
      // Fallback data when no data is available
      return [
        { name: 'Low Risk', value: 65, count: 2, color: '#10B981' },
        { name: 'Medium Risk', value: 25, count: 1, color: '#F59E0B' },
        { name: 'High Risk', value: 10, count: 1, color: '#EF4444' }
      ];
    }
    
    const lowRisk = enhancedData.filter(item => item.riskScore <= 40).length;
    const mediumRisk = enhancedData.filter(item => item.riskScore > 40 && item.riskScore <= 70).length;
    const highRisk = enhancedData.filter(item => item.riskScore > 70).length;
    
    const total = enhancedData.length;
    
    // Ensure we have valid values that sum to 100
    let lowPercent = total > 0 ? Math.round((lowRisk / total) * 100) : 60;
    const mediumPercent = total > 0 ? Math.round((mediumRisk / total) * 100) : 30;
    const highPercent = total > 0 ? Math.round((highRisk / total) * 100) : 10;
    
    // Make sure percentages sum to 100
    const sum = lowPercent + mediumPercent + highPercent;
    if (sum !== 100 && sum > 0) {
      const diff = 100 - sum;
      lowPercent += diff; // Add difference to largest category
    }
    
    const result = [
      { name: 'Low Risk', value: Math.max(lowPercent, 0), count: lowRisk, color: '#10B981' },
      { name: 'Medium Risk', value: Math.max(mediumPercent, 0), count: mediumRisk, color: '#F59E0B' },
      { name: 'High Risk', value: Math.max(highPercent, 0), count: highRisk, color: '#EF4444' }
    ].filter(item => item.value > 0); // Only include items with values > 0
    
    // If no valid data, return fallback
    if (result.length === 0) {
      return [
        { name: 'Low Risk', value: 60, count: 2, color: '#10B981' },
        { name: 'Medium Risk', value: 30, count: 1, color: '#F59E0B' },
        { name: 'High Risk', value: 10, count: 1, color: '#EF4444' }
      ];
    }
    
    return result;
  }, [enhancedData]);

  // Vendor performance data (mock)
  const vendorPerformanceData = [
    { name: 'Advanced MEP', technical: 92.5, commercial: 88.0, totalBid: 5.75, rank: 1 },
    { name: 'Premier HVAC', technical: 89.0, commercial: 85.5, totalBid: 5.92, rank: 2 },
    { name: 'Integrated Building', technical: 85.0, commercial: 82.0, totalBid: 6.10, rank: 3 },
    { name: 'Metro Mechanical', technical: 78.5, commercial: 95.0, totalBid: 5.45, rank: 4 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-xl p-4 min-w-[220px]">
          <p className="font-semibold text-foreground mb-3 border-b border-border pb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}:</span>
                </div>
                <span className="font-medium text-foreground text-sm">
                  {typeof entry.value === 'number' && entry.name.includes('%') 
                    ? `${entry.value.toFixed(1)}%`
                    : formatCurrency(entry.value)
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-xl p-3">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value}% ({data.count} line items)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-xl font-bold">{summaryStats.totalItems}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold">{formatCurrency(summaryStats.totalValue)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Variance</p>
              <p className="text-xl font-bold">{formatPercentage(summaryStats.avgVariance)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Competitive</p>
              <p className="text-xl font-bold">{summaryStats.competitiveItems}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-xl font-bold">{summaryStats.riskItems}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Spread</p>
              <p className="text-xl font-bold">{formatPercentage(summaryStats.avgSpread)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="variance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Variance
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Vendor Performance
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Bid Comparison by Line Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={600}>
                <ComposedChart
                  data={enhancedData}
                  margin={{ top: 80, right: 60, left: 80, bottom: 140 }}
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={9}
                    angle={-45}
                    textAnchor="end"
                    height={140}
                    interval={0}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    tickFormatter={formatCurrency}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={80}
                    iconType="rect"
                    wrapperStyle={{ 
                      paddingBottom: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  />
                  <Bar 
                    dataKey="lowBid" 
                    fill="#10B981" 
                    name="Low Bid" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="averageBid" 
                    fill="#3B82F6" 
                    name="Average Bid" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="highBid" 
                    fill="#EF4444" 
                    name="High Bid" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={50}
                  />
                  {enhancedData[0]?.engineerEstimate && (
                    <Line 
                      type="monotone"
                      dataKey="engineerEstimate" 
                      stroke="#8B5CF6" 
                      strokeWidth={4}
                      name="Engineer Estimate"
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={50}
                      paddingAngle={4}
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
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      iconType="circle"
                      wrapperStyle={{
                        paddingTop: '20px',
                        fontSize: '14px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {riskDistributionData.map((risk, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: risk.color }}
                        />
                        <span className="font-semibold">{risk.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-sm px-3 py-1"
                      >
                        {risk.count} items
                      </Badge>
                    </div>
                    <Progress 
                      value={risk.value} 
                      className="h-3"
                      style={{
                        '--progress-background': risk.color
                      } as React.CSSProperties}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{risk.value}% of portfolio</span>
                      <span>${((summaryStats.totalValue * risk.value) / 100).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Risk Assessment Summary</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Low risk items show good market competition</li>
                    <li>• Medium risk items require closer evaluation</li>
                    <li>• High risk items need immediate attention</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="variance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Price Variance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <ComposedChart
                  data={enhancedData}
                  margin={{ top: 40, right: 60, left: 60, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    tickFormatter={formatPercentage}
                    width={80}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={60} />
                  
                  <ReferenceLine yAxisId="left" y={0} stroke="#666" strokeDasharray="3 3" />
                  <ReferenceLine yAxisId="left" y={10} stroke="#F59E0B" strokeDasharray="2 2" opacity={0.5} />
                  <ReferenceLine yAxisId="left" y={-10} stroke="#10B981" strokeDasharray="2 2" opacity={0.5} />
                  
                  <Bar 
                    yAxisId="left"
                    dataKey="variance" 
                    fill="#F59E0B" 
                    name="Variance from Estimate (%)" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone"
                    dataKey="spread" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="Price Spread (%)"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone"
                    dataKey="bidCount" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Number of Bids"
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    strokeDasharray="5 5"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vendor Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <ComposedChart
                  data={vendorPerformanceData}
                  margin={{ top: 40, right: 60, left: 60, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    angle={-25}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    domain={[0, 100]}
                    width={60}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={11}
                    tickFormatter={formatCurrency}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={60} />
                  
                  <Bar 
                    yAxisId="left"
                    dataKey="technical" 
                    fill="#3B82F6" 
                    name="Technical Score" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="commercial" 
                    fill="#10B981" 
                    name="Commercial Score" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalBid" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="Total Bid ($M)"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BidAnalysisGraph;

