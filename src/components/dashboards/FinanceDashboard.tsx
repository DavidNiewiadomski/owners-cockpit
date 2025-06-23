
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface FinanceDashboardProps {
  projectId: string;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ projectId }) => {
  // Mock financial data
  const cashFlowData = [
    { month: 'Jan', inflow: 2400, outflow: 1800 },
    { month: 'Feb', inflow: 2100, outflow: 1900 },
    { month: 'Mar', inflow: 2800, outflow: 2200 },
    { month: 'Apr', inflow: 2600, outflow: 2100 },
    { month: 'May', inflow: 3200, outflow: 2400 },
    { month: 'Jun', inflow: 2900, outflow: 2300 }
  ];

  const expenseData = [
    { category: 'Labor', value: 45, color: '#3b82f6' },
    { category: 'Materials', value: 30, color: '#10b981' },
    { category: 'Equipment', value: 15, color: '#f59e0b' },
    { category: 'Other', value: 10, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights - moved to top */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive">High Priority</Badge>
              <div>
                <h4 className="font-medium">Cash Flow Alert</h4>
                <p className="text-sm text-muted-foreground">Projected cash shortfall of $180K in Q4. Accelerate billing for completed phases.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Medium Priority</Badge>
              <div>
                <h4 className="font-medium">Material Cost Variance</h4>
                <p className="text-sm text-muted-foreground">Steel costs up 12% from budget. Consider alternative suppliers or value engineering.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Opportunity</Badge>
              <div>
                <h4 className="font-medium">Early Payment Discount</h4>
                <p className="text-sm text-muted-foreground">5 suppliers offer 2% discount for early payment. Potential savings of $45K.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.8M</div>
            <p className="text-xs text-muted-foreground">
              Approved funding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent to Date</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.9M</div>
            <Progress value={68} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              68% of budget used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Burn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$320K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% vs. budget
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Projection</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">14.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Above target
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}K`, '']} />
                <Area type="monotone" dataKey="inflow" stackId="1" stroke="#10b981" fill="#10b981" />
                <Area type="monotone" dataKey="outflow" stackId="2" stroke="#ef4444" fill="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ category, value }) => `${category}: ${value}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceDashboard;
