
import React from 'react';
import AIInsightsPanel from './finance/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceDashboardProps {
  projectId: string;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ projectId }) => {
  // Mock finance data specific to project
  const projectData = {
    name: projectId === 'portfolio' ? 'Portfolio Overview' : 'Project Lotus',
    totalBudget: 25000000,
    actualSpend: 17000000,
    budgetVariance: 4.2,
    cashFlow: 850000,
    profitMargin: 16.8,
    invoicesPending: 12,
    paymentDelay: 8
  };

  const monthlyFinancials = [
    { month: 'Jan', revenue: 2100, costs: 1800, profit: 300 },
    { month: 'Feb', revenue: 2250, costs: 1950, profit: 300 },
    { month: 'Mar', revenue: 2050, costs: 1750, profit: 300 },
    { month: 'Apr', revenue: 2180, costs: 1880, profit: 300 },
    { month: 'May', revenue: 2020, costs: 1720, profit: 300 },
    { month: 'Jun', revenue: 2200, costs: 1900, profit: 300 }
  ];

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Budget</span>
                <span className="font-semibold">${(projectData.totalBudget / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Actual Spend</span>
                <span className="font-semibold">${(projectData.actualSpend / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Budget Variance</span>
                <Badge variant={Math.abs(projectData.budgetVariance) < 5 ? "default" : "destructive"}>
                  {projectData.budgetVariance > 0 ? '+' : ''}{projectData.budgetVariance}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow & Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Monthly Cash Flow</span>
                <span className={`font-semibold ${projectData.cashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(projectData.cashFlow / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Profit Margin</span>
                <Badge variant={projectData.profitMargin > 15 ? "default" : "secondary"}>
                  {projectData.profitMargin}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Invoices</span>
                <Badge variant={projectData.invoicesPending > 20 ? "destructive" : "secondary"}>
                  {projectData.invoicesPending}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Financial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyFinancials}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value}K`} />
              <Tooltip formatter={(value: any) => [`$${value}K`, '']} />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="costs" fill="#ef4444" name="Costs" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
