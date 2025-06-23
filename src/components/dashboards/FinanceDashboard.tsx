
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface FinanceDashboardProps {
  projectId: string;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ projectId }) => {
  const financialMetrics = {
    totalBudget: 2500000,
    spentToDate: 1875000,
    remainingBudget: 625000,
    projectedOverrun: 125000,
    cashFlowPositive: true,
    roi: 14.2,
    paymentsPending: 285000
  };

  const budgetBreakdown = [
    { category: 'Labor', budgeted: 800000, spent: 650000, color: '#3b82f6' },
    { category: 'Materials', budgeted: 600000, spent: 520000, color: '#10b981' },
    { category: 'Equipment', budgeted: 400000, spent: 385000, color: '#f59e0b' },
    { category: 'Subcontractors', budgeted: 500000, spent: 420000, color: '#ef4444' },
    { category: 'Other', budgeted: 200000, spent: 175000, color: '#8b5cf6' }
  ];

  const cashFlowData = [
    { month: 'Jan', income: 320000, expenses: 280000, net: 40000 },
    { month: 'Feb', income: 380000, expenses: 340000, net: 40000 },
    { month: 'Mar', income: 290000, expenses: 310000, net: -20000 },
    { month: 'Apr', income: 450000, expenses: 380000, net: 70000 },
    { month: 'May', income: 380000, expenses: 360000, net: 20000 },
    { month: 'Jun', income: 420000, expenses: 390000, net: 30000 }
  ];

  const changeOrders = [
    { id: 'CO-001', description: 'Additional electrical outlets', amount: 12500, status: 'Approved', impact: 'Low' },
    { id: 'CO-002', description: 'HVAC system upgrade', amount: 45000, status: 'Pending', impact: 'Medium' },
    { id: 'CO-003', description: 'Flooring material change', amount: 8200, status: 'Rejected', impact: 'Low' },
    { id: 'CO-004', description: 'Structural reinforcement', amount: 67500, status: 'Under Review', impact: 'High' }
  ];

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((financialMetrics.spentToDate / financialMetrics.totalBudget) * 100)}%
            </div>
            <Progress 
              value={(financialMetrics.spentToDate / financialMetrics.totalBudget) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              ${(financialMetrics.spentToDate / 1000000).toFixed(1)}M of ${(financialMetrics.totalBudget / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(financialMetrics.remainingBudget / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              {financialMetrics.projectedOverrun > 0 ? 
                `Projected overrun: $${(financialMetrics.projectedOverrun / 1000).toFixed(0)}K` :
                'On track with budget'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.roi}%</div>
            <p className="text-xs text-muted-foreground">
              Projected return on investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(financialMetrics.paymentsPending / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval/processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Breakdown and Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${(value as number / 1000).toFixed(0)}K`, '']} />
                <Bar dataKey="budgeted" fill="#e2e8f0" name="Budgeted" />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${(value as number / 1000).toFixed(0)}K`, '']} />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Change Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Change Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {changeOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{order.id}</span>
                    <Badge 
                      variant={order.status === 'Approved' ? 'default' : 
                               order.status === 'Pending' ? 'secondary' : 
                               order.status === 'Rejected' ? 'destructive' : 'outline'}
                    >
                      {order.status}
                    </Badge>
                    <Badge 
                      variant={order.impact === 'Low' ? 'secondary' : 
                               order.impact === 'Medium' ? 'default' : 'destructive'}
                    >
                      {order.impact} Impact
                    </Badge>
                  </div>
                  <h4 className="font-medium mt-1">{order.description}</h4>
                  <p className="text-sm text-muted-foreground">
                    Amount: ${order.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Alerts & Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 bg-red-50 dark:bg-red-950 p-3 rounded-r">
              <h4 className="font-medium text-red-900 dark:text-red-100">Budget Alert</h4>
              <p className="text-sm text-red-800 dark:text-red-200">
                Current spending rate projects 5% budget overrun. Recommend cost control measures for remaining phases.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 dark:bg-amber-950 p-3 rounded-r">
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Cash Flow Warning</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                $285K in pending payments may impact next month's cash flow. Consider expediting approvals.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-950 p-3 rounded-r">
              <h4 className="font-medium text-green-900 dark:text-green-100">Cost Savings Opportunity</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Material costs 8% under budget due to favorable negotiations. Savings can offset projected overruns.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-950 p-3 rounded-r">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">ROI Projection</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Current project performance tracking toward 14.2% ROI, exceeding initial 12% target.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
