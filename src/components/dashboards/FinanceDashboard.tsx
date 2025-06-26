import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  PieChart,
  Receipt,
  Banknote,
  Calculator,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { luxuryOfficeProject } from '@/data/sampleProjectData';

interface FinanceDashboardProps {
  projectId: string;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ projectId }) => {
  const project = luxuryOfficeProject;

  // Financial metrics calculations
  const budgetUtilization = (project.financial.spentToDate / project.financial.totalBudget) * 100;
  const contingencyUsed = (project.financial.contingencyUsed / project.financial.contingencyTotal) * 100;
  const forecastVariance = project.financial.forecastedCost - project.financial.totalBudget;
  const variancePercent = (forecastVariance / project.financial.totalBudget) * 100;

  // Cost breakdown by category
  const costBreakdown = [
    { category: 'Construction', amount: 18500000, percentage: 77.1, color: 'bg-blue-500' },
    { category: 'Architecture/Engineering', amount: 2050000, percentage: 8.5, color: 'bg-green-500' },
    { category: 'Site Work', amount: 1200000, percentage: 5.0, color: 'bg-yellow-500' },
    { category: 'Permits & Fees', amount: 850000, percentage: 3.5, color: 'bg-purple-500' },
    { category: 'Other/Contingency', amount: 1400000, percentage: 5.9, color: 'bg-gray-500' }
  ];

  // Recent financial transactions
  const recentTransactions = [
    {
      id: 1,
      date: '2024-06-20',
      description: 'Steel Supplier Payment - Floors 7-9',
      vendor: 'Metropolitan Steel Supply',
      amount: -89450,
      category: 'Materials',
      status: 'paid',
      invoiceNumber: 'MS-2024-0456'
    },
    {
      id: 2,
      date: '2024-06-18',
      description: 'Pre-leasing Commission - TechCorp',
      vendor: 'Elite Leasing Group',
      amount: -52000,
      category: 'Leasing',
      status: 'paid',
      invoiceNumber: 'ELG-2024-0234'
    },
    {
      id: 3,
      date: '2024-06-15',
      description: 'Monthly Progress Payment - GC',
      vendor: 'Premium Builders Inc.',
      amount: -1850000,
      category: 'Construction',
      status: 'paid',
      invoiceNumber: 'PB-2024-0567'
    },
    {
      id: 4,
      date: '2024-06-15',
      description: 'Tenant Deposit - Global Finance Partners',
      vendor: 'Global Finance Partners',
      amount: 137500,
      category: 'Pre-leasing',
      status: 'received',
      invoiceNumber: 'DEP-2024-0123'
    },
    {
      id: 5,
      date: '2024-06-12',
      description: 'Insurance Premium - Q2',
      vendor: 'Metropolitan Insurance Corp',
      amount: -71250,
      category: 'Insurance',
      status: 'paid',
      invoiceNumber: 'MIC-2024-0789'
    }
  ];

  // Budget vs Actual by month
  const monthlyBudgetData = [
    { month: 'Jan', budgeted: 1200000, actual: 1185000, variance: -15000 },
    { month: 'Feb', budgeted: 1450000, actual: 1465000, variance: 15000 },
    { month: 'Mar', budgeted: 1680000, actual: 1675000, variance: -5000 },
    { month: 'Apr', budgeted: 1520000, actual: 1545000, variance: 25000 },
    { month: 'May', budgeted: 1750000, actual: 1780000, variance: 30000 },
    { month: 'Jun', budgeted: 600000, actual: 550000, variance: -50000 }
  ];

  const getTrendIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (variance < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <TrendingUp className="h-4 w-4 text-gray-500" />;
  };

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 50000) return 'text-green-600';
    if (Math.abs(variance) < 100000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* AI Financial Insights */}
      <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-green-600" />
            AI Financial Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Budget Performance:</strong> {budgetUtilization.toFixed(1)}% budget utilized with {variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}% variance from forecast. 
            <strong>Cash Flow:</strong> {contingencyUsed.toFixed(1)}% contingency used, maintaining healthy reserve levels. 
            <strong>Investment Health:</strong> {project.financial.roi.toFixed(1)}% ROI projection exceeding market benchmarks, consider accelerating pre-leasing initiatives.
          </p>
        </CardContent>
      </Card>

      {/* Finance Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            Financial Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Budget tracking, cash flow analysis, and financial performance
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {project.financial.roi.toFixed(1)}% ROI
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Projected Return
          </div>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</CardTitle>
            <Calculator className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(project.financial.totalBudget / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">
              ${(project.financial.spentToDate / 1000000).toFixed(1)}M spent ({budgetUtilization.toFixed(1)}%)
            </div>
            <Progress value={budgetUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(project.financial.forecastedCost / 1000000).toFixed(1)}M
            </div>
            <div className={`text-xs mt-1 ${variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {variancePercent > 0 ? '+' : ''}${(forecastVariance / 1000).toFixed(0)}K variance
            </div>
            <div className="text-xs text-muted-foreground">
              {variancePercent > 0 ? 'Over' : 'Under'} budget by {Math.abs(variancePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Value</CardTitle>
            <Banknote className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(project.financial.marketValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-green-600 mt-1">
              +${((project.financial.marketValue - project.financial.totalBudget) / 1000000).toFixed(1)}M gain
            </div>
            <div className="text-xs text-muted-foreground">
              {((project.financial.marketValue / project.financial.totalBudget - 1) * 100).toFixed(1)}% appreciation
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Contingency</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contingencyUsed.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              ${(project.financial.contingencyRemaining / 1000).toFixed(0)}K remaining
            </div>
            <Progress value={contingencyUsed} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {costBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    ${(item.amount / 1000000).toFixed(1)}M ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Budget vs Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Budget vs Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyBudgetData.map((month, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{month.month} 2024</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(month.variance)}
                    <span className={`text-xs font-medium ${getVarianceColor(month.variance)}`}>
                      {month.variance > 0 ? '+' : ''}${(month.variance / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Budgeted:</span>
                    <span className="font-medium ml-1">
                      ${(month.budgeted / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actual:</span>
                    <span className="font-medium ml-1">
                      ${(month.actual / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions & Financial Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.vendor} • {transaction.date}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.invoiceNumber} • {transaction.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                    <Badge variant={transaction.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financial Projections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Projections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Net Present Value</div>
                <div className="text-xl font-bold text-green-600">
                  ${(project.financial.npv / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Internal Rate of Return</div>
                <div className="text-xl font-bold text-green-600">
                  {project.financial.irr}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Cost per Sq Ft</div>
                <div className="text-lg font-semibold">
                  ${project.financial.costPerSqft}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">10-Year Projection</div>
                <div className="text-lg font-semibold text-green-600">
                  ${(project.financial.leasingProjections / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-2">Pre-Leasing Revenue</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Current: {project.leasing.preLeasingRate.toFixed(1)}%</span>
                <span className="text-sm">Target: {project.leasing.targetOccupancy}%</span>
              </div>
              <Progress value={project.leasing.preLeasingRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                ${(project.leasing.preLeasedSpace * project.leasing.averageRent / 1000000).toFixed(1)}M annual revenue secured
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Controls & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Financial Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Budget Approval Process</span>
              </div>
              <div className="text-xs text-muted-foreground">
                All expenditures &gt;$10K require approval
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-green-200 bg-green-50">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Monthly Reporting</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Automated financial reports generated
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Variance Monitoring</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Alert if &gt;5% budget variance detected
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Cash Flow Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 rounded border">
              <div className="text-sm font-medium">Current Month</div>
              <div className="text-xs text-muted-foreground">Jun 2024</div>
              <div className="text-lg font-bold text-red-600">-$1.4M</div>
            </div>
            
            <div className="p-2 rounded border">
              <div className="text-sm font-medium">Next Month</div>
              <div className="text-xs text-muted-foreground">Jul 2024 (Projected)</div>
              <div className="text-lg font-bold text-green-600">+$0.6M</div>
            </div>
            
            <div className="p-2 rounded border">
              <div className="text-sm font-medium">Year to Date</div>
              <div className="text-xs text-muted-foreground">Jan - Jun 2024</div>
              <div className="text-lg font-bold text-red-600">-$8.2M</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-sm">
              <Receipt className="h-4 w-4 mr-2" />
              Approve Pending Invoices
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <Calculator className="h-4 w-4 mr-2" />
              Review Budget Variance
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Financial Report
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Update Cash Flow Forecast
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <PieChart className="h-4 w-4 mr-2" />
              Export Cost Analysis
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              <Banknote className="h-4 w-4 mr-2" />
              Process Draw Request
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceDashboard;
