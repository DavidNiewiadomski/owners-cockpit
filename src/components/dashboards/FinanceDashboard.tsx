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
  console.log('💰 FinanceDashboard - Received projectId:', projectId);
  console.log('💰 FinanceDashboard - activeCategory:', activeCategory);
  
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  console.log('💰 FinanceDashboard - projects loaded:', projects);
  console.log('💰 FinanceDashboard - isPortfolioView:', isPortfolioView);
  console.log('💰 FinanceDashboard - displayProjectId:', displayProjectId);
  
  // Fetch all project data from Supabase
  const { data: financialMetrics, isLoading: loadingFinancial } = useFinancialMetrics(displayProjectId);
  
  console.log('💰 FinanceDashboard - financialMetrics:', financialMetrics);
  console.log('💰 FinanceDashboard - loadingFinancial:', loadingFinancial);
  const { data: monthlySpend, isLoading: loadingMonthlySpend } = useMonthlySpend(displayProjectId);
  const { data: cashFlow, isLoading: loadingCashFlow } = useCashFlow(displayProjectId);
  const { data: costBreakdown, isLoading: loadingCostBreakdown } = useCostBreakdown(displayProjectId);
  const { data: transactions, isLoading: loadingTransactions } = useTransactions(displayProjectId);
  const { data: insights, isLoading: loadingInsights } = useProjectInsights(displayProjectId);
  const { data: team, isLoading: loadingTeam } = useProjectTeam(displayProjectId);
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Financial Overview' : displayProject?.name;
  
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
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-foreground text-lg">Loading project data...</div>
      </div>
    );
  }
  
  // Provide fallback data for portfolio view or when data is unavailable
  const fallbackFinancialData = {
    totalBudget: 25000000,
    spentToDate: 12500000,
    forecastedCost: 24800000,
    contingencyUsed: 500000,
    contingencyRemaining: 1000000,
    roi: 0.125,
    npv: 5500000,
    costPerSqft: 285,
    marketValue: 32000000,
  };

  const effectiveFinancialData = financialData || (isPortfolioView ? {
    totalBudget: 95500000, // Portfolio totals
    spentToDate: 51700000,
    forecastedCost: 99200000,
    contingencyUsed: 1650000,
    contingencyRemaining: 2650000,
    roi: 0.153, // Portfolio average
    npv: 112000000,
    costPerSqft: 315,
    marketValue: 135000000,
  } : fallbackFinancialData);
  
  // Financial metrics calculations
  const budgetUtilization = effectiveFinancialData ? (effectiveFinancialData.spentToDate / effectiveFinancialData.totalBudget) * 100 : 0;
  const contingencyTotal = effectiveFinancialData ? (effectiveFinancialData.contingencyUsed + effectiveFinancialData.contingencyRemaining) : 0;
  const contingencyUsed = contingencyTotal > 0 ? (effectiveFinancialData.contingencyUsed / contingencyTotal) * 100 : 0;
  const forecastVariance = effectiveFinancialData ? effectiveFinancialData.forecastedCost - effectiveFinancialData.totalBudget : 0;
  const variancePercent = effectiveFinancialData ? (forecastVariance / effectiveFinancialData.totalBudget) * 100 : 0;

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
    'default': 'bg-slate-500'
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
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <DollarSign className="w-4 h-4 mr-2" />
            ${(effectiveFinancialData.totalBudget / 1000000).toFixed(1)}M Budget
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            {financialMetrics?.irr?.toFixed(1) || 'N/A'}% IRR
          </Badge>
        </div>
      </div>

      {/* AI Financial Insights */}
        <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <TrendingUp className="w-5 h-5 text-green-400" />
              AI Financial Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{budgetUtilization.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Budget Used</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{effectiveFinancialData.roi ? (effectiveFinancialData.roi * 100).toFixed(1) : 0}%</div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Variance</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{contingencyUsed.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Contingency</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              Financial performance shows {budgetUtilization.toFixed(1)}% budget utilization with {variancePercent > 0 ? 'over' : 'under'} budget variance of {Math.abs(variancePercent).toFixed(1)}%. ROI projection at {effectiveFinancialData.roi ? (effectiveFinancialData.roi * 100).toFixed(1) : 0}% exceeds market benchmarks. Contingency usage at {contingencyUsed.toFixed(1)}% maintains healthy reserves.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Budget tracking at {budgetUtilization.toFixed(1)}% with ${(effectiveFinancialData.spentToDate / 1000000).toFixed(1)}M of ${(effectiveFinancialData.totalBudget / 1000000).toFixed(1)}M spent</li>
                <li>• Financial variance {variancePercent > 0 ? 'above' : 'below'} forecast by {Math.abs(variancePercent).toFixed(1)}%</li>
                <li>• Strong ROI projection at {effectiveFinancialData.roi ? (effectiveFinancialData.roi * 100).toFixed(1) : 0}% vs market average 12-15%</li>
                <li>• Contingency reserves healthy at {contingencyUsed.toFixed(1)}% utilization</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Owner Financial Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Receipt className="w-4 h-4 mr-2" />
              Review Major Invoices
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Calculator className="w-4 h-4 mr-2" />
              Monitor ROI Performance
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Owner Report
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <CreditCard className="w-4 h-4 mr-2" />
              Review Cash Requirements
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <PieChart className="w-4 h-4 mr-2" />
              Analyze Investment Returns
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Banknote className="w-4 h-4 mr-2" />
              Approve Draw Requests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card border-border p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(effectiveFinancialData.totalBudget / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">
              ${(effectiveFinancialData.spentToDate / 1000000).toFixed(1)}M spent ({budgetUtilization.toFixed(1)}%)
            </div>
            <Progress value={budgetUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(effectiveFinancialData.forecastedCost / 1000000).toFixed(1)}M
            </div>
            <div className={`text-xs mt-1 ${variancePercent > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {variancePercent > 0 ? '+' : ''}${(forecastVariance / 1000).toFixed(0)}K variance
            </div>
            <div className="text-xs text-muted-foreground">
              {variancePercent > 0 ? 'Over' : 'Under'} budget by {Math.abs(variancePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Value</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${(effectiveFinancialData.marketValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-green-400 mt-1">
              +${((effectiveFinancialData.marketValue - effectiveFinancialData.totalBudget) / 1000000).toFixed(1)}M gain
            </div>
            <div className="text-xs text-muted-foreground">
              {((effectiveFinancialData.marketValue / effectiveFinancialData.totalBudget - 1) * 100).toFixed(1)}% appreciation
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contingency</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {contingencyUsed.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              ${(effectiveFinancialData.contingencyRemaining / 1000).toFixed(0)}K remaining
            </div>
            <Progress value={contingencyUsed} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {costBreakdownData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    ${(item.amount / 1000000).toFixed(1)}M ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-card rounded-full h-2">
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Monthly Budget vs Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyBudgetData.map((month, index) => (
              <div key={index} className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-foreground">{month.month} 2024</span>
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
                    <span className="font-medium ml-1 text-foreground">
                      ${(month.budgeted / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actual:</span>
                    <span className="font-medium ml-1 text-foreground">
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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-3 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.vendor} • {transaction.date}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.invoiceNumber} • {transaction.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </div>
                    <Badge variant={transaction.status === 'paid' ? 'default' : 'secondary'} className="text-xs bg-card text-foreground border border-border">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Financial Projections */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Financial Projections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Net Present Value</div>
                <div className="text-xl font-bold text-green-400">
                  ${(effectiveFinancialData.npv / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Internal Rate of Return</div>
                <div className="text-xl font-bold text-green-400">
                  {effectiveFinancialData.roi ? (effectiveFinancialData.roi * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Cost per Sq Ft</div>
                <div className="text-lg font-semibold text-foreground">
                  ${effectiveFinancialData.costPerSqft}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">10-Year Projection</div>
                <div className="text-lg font-semibold text-green-400">
                  ${(effectiveFinancialData.marketValue / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground mb-2">Pre-Leasing Revenue</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">Current: {financialMetrics?.leasing_projections ? financialMetrics.leasing_projections.toFixed(1) : '42.0'}%</span>
                <span className="text-sm text-foreground">Target: 95%</span>
              </div>
              <Progress value={financialMetrics?.leasing_projections || 42} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Revenue projections based on current leasing rate
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Controls & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Controls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              Financial Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-foreground">Budget Approval Process</span>
              </div>
              <div className="text-xs text-muted-foreground">
                All expenditures &gt;$10K require approval
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-foreground">Monthly Reporting</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Automated financial reports generated
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">Variance Monitoring</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Alert if &gt;5% budget variance detected
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              Cash Flow Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cashFlow && cashFlow.length > 0 ? (
              cashFlow.slice(-3).map((flow, index) => (
                <div key={index} className="p-2 rounded border border-border bg-card/50">
                  <div className="text-sm font-medium text-foreground">{flow.month}</div>
                  <div className="text-xs text-muted-foreground">2024</div>
                  <div className={`text-lg font-bold ${flow.cumulative >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {flow.cumulative >= 0 ? '+' : ''}${(flow.cumulative / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 rounded border border-border bg-card/50">
                <div className="text-sm font-medium text-foreground">No cash flow data available</div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default FinanceDashboard;
