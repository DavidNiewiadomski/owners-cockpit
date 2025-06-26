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
import { luxuryOfficeProject } from '@/data/sampleProjectData';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';

interface FinanceDashboardProps {
  projectId: string;
  activeCategory: string;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ projectId, activeCategory }) => {
  const project = luxuryOfficeProject;
  const { data: projects = [] } = useProjects();
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

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
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
            <DollarSign className="w-4 h-4 mr-2" />
            ${(project.financial.totalBudget / 1000000).toFixed(1)}M Budget
          </Badge>
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
            {project.financial.roi.toFixed(1)}% ROI
          </Badge>
        </div>
      </div>

      {/* AI Financial Insights */}
      <Card className="bg-slate-900 border-slate-800">
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
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{budgetUtilization.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Budget Used</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{project.financial.roi.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">ROI</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Variance</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{contingencyUsed.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">Contingency</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Financial performance shows {budgetUtilization.toFixed(1)}% budget utilization with {variancePercent > 0 ? 'over' : 'under'} budget variance of {Math.abs(variancePercent).toFixed(1)}%. ROI projection at {project.financial.roi.toFixed(1)}% exceeds market benchmarks. Contingency usage at {contingencyUsed.toFixed(1)}% maintains healthy reserves.
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
                <li>• Budget tracking at {budgetUtilization.toFixed(1)}% with ${(project.financial.spentToDate / 1000000).toFixed(1)}M of ${(project.financial.totalBudget / 1000000).toFixed(1)}M spent</li>
                <li>• Financial variance {variancePercent > 0 ? 'above' : 'below'} forecast by {Math.abs(variancePercent).toFixed(1)}%</li>
                <li>• Strong ROI projection at {project.financial.roi.toFixed(1)}% vs market average 12-15%</li>
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
    
      {/* Quick Actions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Receipt className="w-4 h-4 mr-2" />
              Approve Pending Invoices
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Review Budget Variance
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Financial Report
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Update Cash Flow Forecast
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <PieChart className="w-4 h-4 mr-2" />
              Export Cost Analysis
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Banknote className="w-4 h-4 mr-2" />
              Process Draw Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Budget</CardTitle>
            <Calculator className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(project.financial.totalBudget / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-slate-400">
              ${(project.financial.spentToDate / 1000000).toFixed(1)}M spent ({budgetUtilization.toFixed(1)}%)
            </div>
            <Progress value={budgetUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(project.financial.forecastedCost / 1000000).toFixed(1)}M
            </div>
            <div className={`text-xs mt-1 ${variancePercent > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {variancePercent > 0 ? '+' : ''}${(forecastVariance / 1000).toFixed(0)}K variance
            </div>
            <div className="text-xs text-slate-400">
              {variancePercent > 0 ? 'Over' : 'Under'} budget by {Math.abs(variancePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Market Value</CardTitle>
            <Banknote className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${(project.financial.marketValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-green-400 mt-1">
              +${((project.financial.marketValue - project.financial.totalBudget) / 1000000).toFixed(1)}M gain
            </div>
            <div className="text-xs text-slate-400">
              {((project.financial.marketValue / project.financial.totalBudget - 1) * 100).toFixed(1)}% appreciation
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Contingency</CardTitle>
            <AlertCircle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {contingencyUsed.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">
              ${(project.financial.contingencyRemaining / 1000).toFixed(0)}K remaining
            </div>
            <Progress value={contingencyUsed} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown & Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChart className="h-5 w-5 text-slate-400" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {costBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{item.category}</span>
                  <span className="text-sm text-slate-400">
                    ${(item.amount / 1000000).toFixed(1)}M ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
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
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-slate-400" />
              Monthly Budget vs Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyBudgetData.map((month, index) => (
              <div key={index} className="p-3 rounded-lg border border-slate-700 bg-slate-800/50">
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
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Receipt className="h-5 w-5 text-slate-400" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
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
        <Card className="bg-slate-900 border-slate-800">
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
                  ${(project.financial.npv / 1000000).toFixed(1)}M
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Internal Rate of Return</div>
                <div className="text-xl font-bold text-green-400">
                  {project.financial.irr}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Cost per Sq Ft</div>
                <div className="text-lg font-semibold text-white">
                  ${project.financial.costPerSqft}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-400">10-Year Projection</div>
                <div className="text-lg font-semibold text-green-400">
                  ${(project.financial.leasingProjections / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Pre-Leasing Revenue</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">Current: {project.leasing.preLeasingRate.toFixed(1)}%</span>
                <span className="text-sm text-white">Target: {project.leasing.targetOccupancy}%</span>
              </div>
              <Progress value={project.leasing.preLeasingRate} className="h-2" />
              <div className="text-xs text-slate-400 mt-1">
                ${(project.leasing.preLeasedSpace * project.leasing.averageRent / 1000000).toFixed(1)}M annual revenue secured
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Controls & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Controls */}
        <Card className="bg-slate-900 border-slate-800">
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
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CreditCard className="h-5 w-5 text-slate-400" />
              Cash Flow Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 rounded border border-slate-700 bg-slate-800/50">
              <div className="text-sm font-medium text-white">Current Month</div>
              <div className="text-xs text-slate-400">Jun 2024</div>
              <div className="text-lg font-bold text-red-400">-$1.4M</div>
            </div>
            
            <div className="p-2 rounded border border-slate-700 bg-slate-800/50">
              <div className="text-sm font-medium text-white">Next Month</div>
              <div className="text-xs text-slate-400">Jul 2024 (Projected)</div>
              <div className="text-lg font-bold text-green-400">+$0.6M</div>
            </div>
            
            <div className="p-2 rounded border border-slate-700 bg-slate-800/50">
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
