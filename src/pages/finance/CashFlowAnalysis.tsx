import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  BarChart3,
  Download,
  Filter,
  Activity,
  Wallet
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Progress } from '@/components/ui/progress';

interface CashFlowData {
  month: string;
  inflow: number;
  outflow: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

interface CashFlowCategory {
  category: string;
  type: 'inflow' | 'outflow';
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  variance: number;
}

interface ProjectCashFlow {
  project: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  burnRate: number;
  projectedCompletion: string;
  status: 'on-track' | 'at-risk' | 'critical';
}

const CashFlowAnalysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock cash flow data
  const cashFlowData: CashFlowData[] = [
    { month: 'Jul', inflow: 2100000, outflow: 1800000, netCashFlow: 300000, cumulativeCashFlow: 300000 },
    { month: 'Aug', inflow: 2400000, outflow: 2200000, netCashFlow: 200000, cumulativeCashFlow: 500000 },
    { month: 'Sep', inflow: 2800000, outflow: 2500000, netCashFlow: 300000, cumulativeCashFlow: 800000 },
    { month: 'Oct', inflow: 3200000, outflow: 3000000, netCashFlow: 200000, cumulativeCashFlow: 1000000 },
    { month: 'Nov', inflow: 2900000, outflow: 3100000, netCashFlow: -200000, cumulativeCashFlow: 800000 },
    { month: 'Dec', inflow: 3500000, outflow: 2800000, netCashFlow: 700000, cumulativeCashFlow: 1500000 }
  ];

  // Mock category breakdown
  const inflowCategories: CashFlowCategory[] = [
    { category: 'Loan Drawdowns', type: 'inflow', amount: 8500000, percentage: 45, trend: 'up', variance: 12 },
    { category: 'Investor Contributions', type: 'inflow', amount: 5200000, percentage: 28, trend: 'stable', variance: 0 },
    { category: 'Pre-lease Deposits', type: 'inflow', amount: 2800000, percentage: 15, trend: 'up', variance: 8 },
    { category: 'Tax Incentives', type: 'inflow', amount: 1200000, percentage: 6, trend: 'down', variance: -5 },
    { category: 'Other Income', type: 'inflow', amount: 1200000, percentage: 6, trend: 'stable', variance: 2 }
  ];

  const outflowCategories: CashFlowCategory[] = [
    { category: 'Construction Costs', type: 'outflow', amount: 9800000, percentage: 58, trend: 'up', variance: 15 },
    { category: 'Professional Fees', type: 'outflow', amount: 2500000, percentage: 15, trend: 'stable', variance: 3 },
    { category: 'Land & Permits', type: 'outflow', amount: 2000000, percentage: 12, trend: 'down', variance: -10 },
    { category: 'Equipment & Materials', type: 'outflow', amount: 1500000, percentage: 9, trend: 'up', variance: 20 },
    { category: 'Operating Expenses', type: 'outflow', amount: 1000000, percentage: 6, trend: 'stable', variance: 0 }
  ];

  // Mock project cash flows
  const projectCashFlows: ProjectCashFlow[] = [
    {
      project: 'Metro Plaza Development',
      totalBudget: 35000000,
      spent: 18500000,
      remaining: 16500000,
      burnRate: 2800000,
      projectedCompletion: '2025-06-30',
      status: 'on-track'
    },
    {
      project: 'Riverside Commercial Complex',
      totalBudget: 22000000,
      spent: 15000000,
      remaining: 7000000,
      burnRate: 1800000,
      projectedCompletion: '2025-03-15',
      status: 'at-risk'
    },
    {
      project: 'Tech Hub Renovation',
      totalBudget: 12000000,
      spent: 8000000,
      remaining: 4000000,
      burnRate: 1200000,
      projectedCompletion: '2025-02-28',
      status: 'on-track'
    }
  ];

  // Calculate current month statistics
  const currentMonthData = cashFlowData[cashFlowData.length - 1];
  const totalInflow = inflowCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalOutflow = outflowCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const netPosition = totalInflow - totalOutflow;
  const cashBurnRate = totalOutflow / 6; // 6 months average

  const getTrendIcon = (trend: string, variance: number) => {
    if (trend === 'up') return <ArrowUpRight className={`h-4 w-4 ${variance > 0 ? 'text-green-500' : 'text-red-500'}`} />;
    if (trend === 'down') return <ArrowDownRight className={`h-4 w-4 ${variance < 0 ? 'text-red-500' : 'text-green-500'}`} />;
    return <Activity className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-700';
      case 'at-risk': return 'bg-yellow-100 text-yellow-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Cash Flow Analysis
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor cash inflows, outflows, and liquidity position
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Customize View
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Cash Position</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${(currentMonthData.cumulativeCashFlow / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Available liquidity
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Burn Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                ${(cashBurnRate / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Average monthly spend
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Cash Flow</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netPosition > 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${(Math.abs(netPosition) / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {netPosition > 0 ? 'Positive' : 'Negative'} 6-month trend
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Runway</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">5.4 months</div>
              <div className="text-xs text-muted-foreground mt-1">
                At current burn rate
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
            <TabsTrigger value="projects">Project Analysis</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    Cash Flow Trend
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPeriod === '3months' ? 'default' : 'outline'}
                      onClick={() => setSelectedPeriod('3months')}
                      size="sm"
                    >
                      3 Months
                    </Button>
                    <Button
                      variant={selectedPeriod === '6months' ? 'default' : 'outline'}
                      onClick={() => setSelectedPeriod('6months')}
                      size="sm"
                    >
                      6 Months
                    </Button>
                    <Button
                      variant={selectedPeriod === '12months' ? 'default' : 'outline'}
                      onClick={() => setSelectedPeriod('12months')}
                      size="sm"
                    >
                      12 Months
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis className="text-sm" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="inflow" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Cash Inflow"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outflow" 
                      stackId="2"
                      stroke="#ef4444" 
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Cash Outflow"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Net Cash Flow & Cumulative Position</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis className="text-sm" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: 'none',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="netCashFlow" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Net Cash Flow"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeCashFlow" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Cumulative Position"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Breakdown */}
          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Cash Inflows by Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inflowCategories.map((category, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{category.category}</h4>
                            {getTrendIcon(category.trend, category.variance)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {category.variance > 0 ? '+' : ''}{category.variance}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-green-400">
                            ${(category.amount / 1000000).toFixed(2)}M
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {category.percentage}% of total
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    Cash Outflows by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {outflowCategories.map((category, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{category.category}</h4>
                            {getTrendIcon(category.trend, -category.variance)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {category.variance > 0 ? '+' : ''}{category.variance}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-red-400">
                            ${(category.amount / 1000000).toFixed(2)}M
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {category.percentage}% of total
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Project Analysis */}
          <TabsContent value="projects">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  Project-Level Cash Flow Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectCashFlows.map((project, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-foreground text-lg">{project.project}</h4>
                          <p className="text-sm text-muted-foreground">
                            Projected completion: {project.projectedCompletion}
                          </p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Total Budget</span>
                          <div className="font-medium text-foreground">
                            ${(project.totalBudget / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Spent to Date</span>
                          <div className="font-medium text-red-400">
                            ${(project.spent / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Remaining</span>
                          <div className="font-medium text-green-400">
                            ${(project.remaining / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Monthly Burn</span>
                          <div className="font-medium text-foreground">
                            ${(project.burnRate / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Budget Utilization</span>
                          <span className="text-foreground">
                            {Math.round((project.spent / project.totalBudget) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(project.spent / project.totalBudget) * 100} 
                          className="h-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecast */}
          <TabsContent value="forecast">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Cash Flow Forecast & Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Cash Flow Alert</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on current burn rate, additional funding of $8.5M will be required by March 2025 
                        to maintain positive cash position through project completion.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Base Case Scenario</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cash Position (Q2 2025)</span>
                        <span className="text-green-400">$2.5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peak Funding Need</span>
                        <span className="text-red-400">$8.5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Break-even Month</span>
                        <span className="text-foreground">Jul 2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Optimistic Scenario</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cash Position (Q2 2025)</span>
                        <span className="text-green-400">$5.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peak Funding Need</span>
                        <span className="text-yellow-400">$4.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Break-even Month</span>
                        <span className="text-foreground">May 2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Pessimistic Scenario</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cash Position (Q2 2025)</span>
                        <span className="text-red-400">-$1.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peak Funding Need</span>
                        <span className="text-red-400">$12.3M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Break-even Month</span>
                        <span className="text-foreground">Oct 2025</span>
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

export default CashFlowAnalysis;