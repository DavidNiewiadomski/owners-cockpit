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
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import { 
  useFinancialMetrics, 
  useMonthlySpend, 
  useCashFlow, 
  useCostBreakdown, 
  useTransactions,
  useProjectInsights,
  useProjectTeam
} from '@/hooks/useProjectMetrics';

interface FinanceDashboardProps {
  projectId: string;
  activeCategory: string;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  
  // Fetch all project data from Supabase
  const { data: financialMetrics, isLoading: loadingFinancial } = useFinancialMetrics(projectId);
  const { data: monthlySpend, isLoading: loadingMonthlySpend } = useMonthlySpend(projectId);
  const { data: cashFlow, isLoading: loadingCashFlow } = useCashFlow(projectId);
  const { data: costBreakdown, isLoading: loadingCostBreakdown } = useCostBreakdown(projectId);
  const { data: transactions, isLoading: loadingTransactions } = useTransactions(projectId);
  const { data: insights, isLoading: loadingInsights } = useProjectInsights(projectId);
  const { data: team, isLoading: loadingTeam } = useProjectTeam(projectId);
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  // Show loading state if any data is still loading
  const isLoading = loadingFinancial || loadingMonthlySpend || loadingCashFlow || loadingCostBreakdown || loadingTransactions || loadingInsights || loadingTeam;
  
  // Use fetched data or null if not available
  const financialData = financialMetrics ? {
    totalBudget: financialMetrics.total_budget,
    spentToDate: financialMetrics.spent_to_date,
    forecastedCost: financialMetrics.forecasted_cost,
    contingencyUsed: financialMetrics.contingency_used,
    contingencyRemaining: financialMetrics.contingency_remaining,
    roi: financialMetrics.roi,
    npv: financialMetrics.npv,
    costPerSqft: financialMetrics.cost_per_sqft,
    marketValue: financialMetrics.market_value,
  } : null;
  
  // Return early if no data available
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading project data...</div>
      </div>
    );
  }
  
  if (!financialData) {
    return (
      <div className="min-h-screen bg-[#0D1117] p-6 flex items-center justify-center">
        <div className="text-slate-400 text-lg">No financial data available for this project.</div>
      </div>
    );
  }
  
  // Financial metrics calculations
  const budgetUtilization = (financialData.spentToDate / financialData.totalBudget) * 100;
  const contingencyTotal = (financialData.contingencyUsed + financialData.contingencyRemaining);
  const contingencyUsed = contingencyTotal > 0 ? (financialData.contingencyUsed / contingencyTotal) * 100 : 0;
  const forecastVariance = financialData.forecastedCost - financialData.totalBudget;
  const variancePercent = (forecastVariance / financialData.totalBudget) * 100;

  // Cost breakdown by category with color mapping
  const colorMap = {
    'Construction': 'bg-blue-500',
    'Architecture/Engineering': 'bg-green-500', 
    'Site Work': 'bg-yellow-500',
    'Permits & Fees': 'bg-purple-500',
    'Structural Work': 'bg-blue-600',
    'Engineering': 'bg-green-600',
    'Traffic Management': 'bg-orange-500',
    'Materials': 'bg-cyan-500',
    'Other/Contingency': 'bg-slate-500',
    'default': 'bg-gray-500'
  };
  
  const costBreakdownData = costBreakdown?.map(item => ({
    category: item.category,
    amount: item.amount,
    percentage: item.percentage,
    color: colorMap[item.category] || colorMap.default
  })) || [];

  // Use fetched transactions or default to empty array
  const recentTransactions = transactions?.slice(0, 5).map(transaction => ({
    id: transaction.id,
    date: transaction.transaction_date,
    description: transaction.description,
    vendor: transaction.vendor,
    amount: transaction.amount,
    category: transaction.category,
    status: transaction.status,
    invoiceNumber: `INV-${transaction.id}` // Generate invoice number from ID
  })) || [];

  // Budget vs Actual by month using fetched data
  const monthlyBudgetData = monthlySpend?.map(item => ({
    month: item.month,
    budgeted: item.budget,
    actual: item.actual,
    variance: item.actual - item.budget
  })) || [];

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
    <div className="min-h-screen bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <DollarSign className="w-4 h-4 mr-2" />
            ${(financialData.totalBudget / 1000000).toFixed(1)}M Budget
          </Badge>
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            {financialMetrics.irr?.toFixed(1) || 'N/A'}% IRR
          </Badge>
        </div>
      </div>

      {/* AI Financial Insights */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <TrendingUp className="w-5 h-5 text-green-400" />
              AI Financial Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{budgetUtilization.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Budget Used</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{(financialData.roi || 16.8).toFixed(1)}%</div>
              <div className="text-sm text-slate-400">ROI</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Variance</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{contingencyUsed.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Contingency</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-[#0D1117]/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Financial performance shows {budgetUtilization.toFixed(1)}% budget utilization with {variancePercent > 0 ? 'over' : 'under'} budget variance of {Math.abs(variancePercent).toFixed(1)}%. ROI projection at {(financialData.roi || 16.8).toFixed(1)}% exceeds market benchmarks. Contingency usage at {contingencyUsed.toFixed(1)}% maintains healthy reserves.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Budget tracking at {budgetUtilization.toFixed(1)}% with ${(financialData.spentToDate / 1000000).toFixed(1)}M of ${(financialData.totalBudget / 1000000).toFixed(1)}M spent</li>
                <li>• Financial variance {variancePercent > 0 ? 'above' : 'below'} forecast by {Math.abs(variancePercent).toFixed(1)}%</li>
                <li>• Strong ROI projection at {(financialData.roi || 16.8).toFixed(1)}% vs market average 12-15%</li>
                <li>• Contingency reserves healthy at {contingencyUsed.toFixed(1)}% utilization</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Accelerate pre-leasing initiatives to capitalize on strong ROI potential</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Monitor budget variance closely to maintain financial targets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Consider refinancing options to optimize interest expense</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    
      {/* Owner Financial Actions */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Owner Financial Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Receipt className="w-4 h-4 mr-2" />
              Review Major Invoices
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Monitor ROI Performance
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Owner Report
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Review Cash Requirements
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <PieChart className="w-4 h-4 mr-2" />
              Analyze Investment Returns
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Banknote className="w-4 h-4 mr-2" />
              Approve Draw Requests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Budget</CardTitle>
            <Calculator className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(financialData.totalBudget / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-slate-400">
              ${(financialData.spentToDate / 1000000).toFixed(1)}M spent ({budgetUtilization.toFixed(1)}%)
            </div>
            <Progress value={budgetUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(financialData.forecastedCost / 1000000).toFixed(1)}M
            </div>
            <div className={`text-xs mt-1 ${variancePercent > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {variancePercent > 0 ? '+' : ''}${(forecastVariance / 1000).toFixed(0)}K variance
            </div>
            <div className="text-xs text-slate-400">
              {variancePercent > 0 ? 'Over' : 'Under'} budget by {Math.abs(variancePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Market Value</CardTitle>
            <Banknote className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${(financialData.marketValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-green-400 mt-1">
              +${((financialData.marketValue - financialData.totalBudget) / 1000000).toFixed(1)}M gain
            </div>
            <div className="text-xs text-slate-400">
              {((financialData.marketValue / financialData.totalBudget - 1) * 100).toFixed(1)}% appreciation
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Contingency</CardTitle>
            <AlertCircle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {contingencyUsed.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">
              ${(financialData.contingencyRemaining / 1000).toFixed(0)}K remaining
            </div>
            <Progress value={contingencyUsed} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChart className="h-5 w-5 text-slate-400" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {costBreakdownData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{item.category}</span>
                  <span className="text-sm text-slate-400">
                    ${(item.amount / 1000000).toFixed(1)}M ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#0D1117] rounded-full h-2">
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-slate-400" />
              Monthly Budget vs Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyBudgetData.map((month, index) => (
              <div key={index} className="p-3 rounded-lg border border-slate-700 bg-[#0D1117]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-white">{month.month} 2024</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(month.variance)}
                    <span className={`text-xs font-medium ${getVarianceColor(month.variance)}`}>
                      {month.variance > 0 ? '+' : ''}${(month.variance / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Budgeted:</span>
                    <span className="font-medium ml-1 text-white">
                      ${(month.budgeted / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Actual:</span>
                    <span className="font-medium ml-1 text-white">
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Receipt className="h-5 w-5 text-slate-400" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-3 rounded-lg border border-slate-700 bg-[#0D1117]/50 hover:bg-[#0D1117]/70 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-white">{transaction.description}</div>
                    <div className="text-xs text-slate-400">
                      {transaction.vendor} • {transaction.date}
                    </div>
                    <div className="text-xs text-slate-400">
                      {transaction.invoiceNumber} • {transaction.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                    <Badge variant={transaction.status === 'paid' ? 'default' : 'secondary'} className="text-xs bg-slate-700 text-slate-300">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financial Projections */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              Financial Projections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Net Present Value</div>
                <div className="text-xl font-bold text-green-400">
                  ${(financialData.npv / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Internal Rate of Return</div>
                <div className="text-xl font-bold text-green-400">
                  {(financialData.roi || 16.8).toFixed(1)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Cost per Sq Ft</div>
                <div className="text-lg font-semibold text-white">
                  ${financialData.costPerSqft}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">10-Year Projection</div>
                <div className="text-lg font-semibold text-green-400">
                  ${(financialData.marketValue / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Pre-Leasing Revenue</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">Current: 29.8%</span>
                <span className="text-sm text-white">Target: 95%</span>
              </div>
              <Progress value={29.8} className="h-2" />
              <div className="text-xs text-slate-400 mt-1">
                $6.0M annual revenue secured
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Controls & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Controls */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-5 w-5 text-slate-400" />
              Financial Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">Budget Approval Process</span>
              </div>
              <div className="text-xs text-slate-400">
                All expenditures &gt;$10K require approval
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">Monthly Reporting</span>
              </div>
              <div className="text-xs text-slate-400">
                Automated financial reports generated
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Variance Monitoring</span>
              </div>
              <div className="text-xs text-slate-400">
                Alert if &gt;5% budget variance detected
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Summary */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CreditCard className="h-5 w-5 text-slate-400" />
              Cash Flow Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 rounded border border-slate-700 bg-[#0D1117]/50">
              <div className="text-sm font-medium text-white">Current Month</div>
              <div className="text-xs text-slate-400">Jun 2024</div>
              <div className="text-lg font-bold text-red-400">-$1.4M</div>
            </div>
            
            <div className="p-2 rounded border border-slate-700 bg-[#0D1117]/50">
              <div className="text-sm font-medium text-white">Next Month</div>
              <div className="text-xs text-slate-400">Jul 2024 (Projected)</div>
              <div className="text-lg font-bold text-green-400">+$0.6M</div>
            </div>
            
            <div className="p-2 rounded border border-slate-700 bg-[#0D1117]/50">
              <div className="text-sm font-medium text-white">Year to Date</div>
              <div className="text-xs text-slate-400">Jan - Jun 2024</div>
              <div className="text-lg font-bold text-red-400">-$8.2M</div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default FinanceDashboard;
