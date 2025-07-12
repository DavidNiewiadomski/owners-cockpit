import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Download,
  Calculator,
  Building,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Award
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Progress } from '@/components/ui/progress';

interface ReturnMetric {
  metric: string;
  actual: number;
  target: number;
  variance: number;
  status: 'exceeds' | 'meets' | 'below';
}

interface ProjectReturn {
  project: string;
  investment: number;
  currentValue: number;
  realizedGain: number;
  unrealizedGain: number;
  roi: number;
  irr: number;
  status: 'performing' | 'on-target' | 'underperforming';
}

interface AssetAllocation {
  assetClass: string;
  value: number;
  percentage: number;
  targetPercentage: number;
  performance: number;
}

interface PerformanceData {
  period: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  alpha: number;
}

const InvestmentReturns: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const view = searchParams.get('view');
  const [selectedPeriod, setSelectedPeriod] = useState('1year');
  const [activeTab, setActiveTab] = useState(view === 'roi' ? 'performance' : 'overview');

  // Mock return metrics
  const returnMetrics: ReturnMetric[] = [
    { metric: 'Portfolio IRR', actual: 18.2, target: 15.0, variance: 3.2, status: 'exceeds' },
    { metric: 'Cash-on-Cash Return', actual: 12.5, target: 10.0, variance: 2.5, status: 'exceeds' },
    { metric: 'Equity Multiple', actual: 2.8, target: 2.5, variance: 0.3, status: 'exceeds' },
    { metric: 'Average Cap Rate', actual: 6.8, target: 6.5, variance: 0.3, status: 'meets' },
    { metric: 'Total Return', actual: 156, target: 125, variance: 31, status: 'exceeds' }
  ];

  // Mock project returns
  const projectReturns: ProjectReturn[] = [
    {
      project: 'Metro Plaza Development',
      investment: 35000000,
      currentValue: 42500000,
      realizedGain: 2500000,
      unrealizedGain: 5000000,
      roi: 21.4,
      irr: 18.2,
      status: 'performing'
    },
    {
      project: 'Riverside Commercial Complex',
      investment: 22000000,
      currentValue: 24800000,
      realizedGain: 1200000,
      unrealizedGain: 1600000,
      roi: 12.7,
      irr: 14.8,
      status: 'on-target'
    },
    {
      project: 'Tech Hub Renovation',
      investment: 12000000,
      currentValue: 13200000,
      realizedGain: 800000,
      unrealizedGain: 400000,
      roi: 10.0,
      irr: 11.2,
      status: 'underperforming'
    },
    {
      project: 'Downtown Office Tower',
      investment: 45000000,
      currentValue: 58500000,
      realizedGain: 5500000,
      unrealizedGain: 8000000,
      roi: 30.0,
      irr: 22.5,
      status: 'performing'
    }
  ];

  // Mock asset allocation
  const assetAllocation: AssetAllocation[] = [
    { assetClass: 'Office', value: 58500000, percentage: 42, targetPercentage: 40, performance: 22.5 },
    { assetClass: 'Mixed-Use', value: 42500000, percentage: 31, targetPercentage: 30, performance: 18.2 },
    { assetClass: 'Retail', value: 24800000, percentage: 18, targetPercentage: 20, performance: 14.8 },
    { assetClass: 'Industrial', value: 13200000, percentage: 9, targetPercentage: 10, performance: 11.2 }
  ];

  // Mock performance data
  const performanceData: PerformanceData[] = [
    { period: 'Q1 2023', portfolioReturn: 3.2, benchmarkReturn: 2.8, alpha: 0.4 },
    { period: 'Q2 2023', portfolioReturn: 4.1, benchmarkReturn: 3.5, alpha: 0.6 },
    { period: 'Q3 2023', portfolioReturn: 4.8, benchmarkReturn: 3.9, alpha: 0.9 },
    { period: 'Q4 2023', portfolioReturn: 5.2, benchmarkReturn: 4.2, alpha: 1.0 },
    { period: 'Q1 2024', portfolioReturn: 4.5, benchmarkReturn: 3.8, alpha: 0.7 },
    { period: 'Q2 2024', portfolioReturn: 5.8, benchmarkReturn: 4.5, alpha: 1.3 },
    { period: 'Q3 2024', portfolioReturn: 6.2, benchmarkReturn: 4.8, alpha: 1.4 },
    { period: 'Q4 2024', portfolioReturn: 6.5, benchmarkReturn: 5.0, alpha: 1.5 }
  ];

  // Calculate totals
  const totalInvestment = projectReturns.reduce((sum, p) => sum + p.investment, 0);
  const totalCurrentValue = projectReturns.reduce((sum, p) => sum + p.currentValue, 0);
  const totalRealizedGain = projectReturns.reduce((sum, p) => sum + p.realizedGain, 0);
  const totalUnrealizedGain = projectReturns.reduce((sum, p) => sum + p.unrealizedGain, 0);
  const portfolioROI = ((totalCurrentValue - totalInvestment) / totalInvestment) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeds':
      case 'performing': return 'bg-green-100 text-green-700';
      case 'meets':
      case 'on-target': return 'bg-blue-100 text-blue-700';
      case 'below':
      case 'underperforming': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (variance < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-yellow-500" />;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Prepare radar chart data
  const radarData = returnMetrics.map(metric => ({
    metric: metric.metric,
    actual: (metric.actual / metric.target) * 100,
    target: 100
  }));

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Investment Returns & Performance
            </h1>
            <p className="text-muted-foreground mt-1">
              Track ROI, IRR, and portfolio performance metrics
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Calculator className="w-4 h-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${(totalCurrentValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +${((totalCurrentValue - totalInvestment) / 1000000).toFixed(1)}M gain
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio IRR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">18.2%</div>
              <div className="text-xs text-muted-foreground mt-1">
                vs 15% target
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total ROI</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {portfolioROI.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Overall return
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Realized Gains</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                ${(totalRealizedGain / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Cash distributed
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unrealized Gains</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                ${(totalUnrealizedGain / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Paper gains
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="projects">Project Returns</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    Return Metrics Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="metric" className="text-xs" />
                      <PolarRadiusAxis angle={90} domain={[0, 150]} />
                      <Radar 
                        name="Actual vs Target" 
                        dataKey="actual" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Target" 
                        dataKey="target" 
                        stroke="#ef4444" 
                        fill="none"
                        strokeDasharray="5 5"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {returnMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium text-foreground">{metric.metric}</div>
                          <div className="text-sm text-muted-foreground">
                            Target: {metric.metric.includes('%') || metric.metric.includes('Rate') ? `${metric.target}%` : metric.target}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {metric.metric.includes('%') || metric.metric.includes('Rate') || metric.metric.includes('IRR') || metric.metric.includes('Return') 
                                ? `${metric.actual}%` 
                                : metric.actual}
                            </span>
                            {getVarianceIcon(metric.variance)}
                          </div>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Portfolio vs Benchmark Performance</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPeriod === '1year' ? 'default' : 'outline'}
                      onClick={() => setSelectedPeriod('1year')}
                      size="sm"
                    >
                      1 Year
                    </Button>
                    <Button
                      variant={selectedPeriod === '3years' ? 'default' : 'outline'}
                      onClick={() => setSelectedPeriod('3years')}
                      size="sm"
                    >
                      3 Years
                    </Button>
                    <Button
                      variant={selectedPeriod === '5years' ? 'default' : 'outline'}
                      onClick={() => setSelectedPeriod('5years')}
                      size="sm"
                    >
                      5 Years
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="period" className="text-sm" />
                    <YAxis className="text-sm" tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="portfolioReturn" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Portfolio Return"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmarkReturn" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Benchmark"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alpha" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Alpha"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Returns Tab */}
          <TabsContent value="projects">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  Individual Project Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectReturns.map((project, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-foreground text-lg">{project.project}</h4>
                          <p className="text-sm text-muted-foreground">
                            Investment: ${(project.investment / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Current Value</span>
                          <div className="font-medium text-foreground">
                            ${(project.currentValue / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Total Gain</span>
                          <div className="font-medium text-green-400">
                            ${((project.realizedGain + project.unrealizedGain) / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">ROI</span>
                          <div className="font-medium text-foreground">
                            {project.roi}%
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">IRR</span>
                          <div className="font-medium text-foreground">
                            {project.irr}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
                          <div className="text-green-400 font-medium">
                            Realized: ${(project.realizedGain / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                          <div className="text-yellow-400 font-medium">
                            Unrealized: ${(project.unrealizedGain / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Asset Allocation Tab */}
          <TabsContent value="allocation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-muted-foreground" />
                    Current Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percentage }) => `${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {assetAllocation.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-foreground">{asset.assetClass}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-foreground">
                            ${(asset.value / 1000000).toFixed(1)}M
                          </span>
                          <Badge variant="outline">{asset.performance}% return</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Allocation vs Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assetAllocation.map((asset, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{asset.assetClass}</span>
                          <span className="text-sm text-muted-foreground">
                            {asset.percentage}% / {asset.targetPercentage}% target
                          </span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={asset.percentage} className="h-2" />
                          <div className="relative h-2">
                            <div 
                              className="absolute h-full w-0.5 bg-red-500"
                              style={{ left: `${asset.targetPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Key Metrics Tab */}
          <TabsContent value="metrics">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Detailed Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Time-Weighted Returns</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">1 Year</span>
                        <span className="text-green-400">+18.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">3 Years</span>
                        <span className="text-green-400">+52.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">5 Years</span>
                        <span className="text-green-400">+98.6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Since Inception</span>
                        <span className="text-green-400">+156%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Risk Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sharpe Ratio</span>
                        <span className="text-foreground">1.85</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sortino Ratio</span>
                        <span className="text-foreground">2.12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Drawdown</span>
                        <span className="text-red-400">-12.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beta</span>
                        <span className="text-foreground">0.82</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Income Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Yield</span>
                        <span className="text-foreground">5.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distribution Rate</span>
                        <span className="text-foreground">Quarterly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">YTD Distributions</span>
                        <span className="text-green-400">$8.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Distributions</span>
                        <span className="text-green-400">$24.5M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default InvestmentReturns;