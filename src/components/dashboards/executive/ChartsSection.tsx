
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Line, PieChart, Pie, Cell, Legend } from 'recharts';

interface ChartsSectionProps {
  projectData: {
    monthlySpend: Array<{
      month: string;
      budget: number;
      actual: number;
      forecast: number;
    }>;
    riskBreakdown: Array<{
      category: string;
      value: number;
      color: string;
    }>;
  };
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ projectData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Financial Performance with Forecast */}
      <Card className="linear-chart-container">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Financial Performance & Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectData.monthlySpend}>
              <defs>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                formatter={(value: any, name: string) => [
                  `$${(value / 1000000).toFixed(1)}M`,
                  name === 'budget' ? 'Budget' : name === 'actual' ? 'Actual' : 'Forecast'
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="rect"
                formatter={(value) => <span className="text-sm">{value === 'budget' ? 'Budget' : value === 'actual' ? 'Actual Spend' : 'Forecast'}</span>}
              />
              <Area type="monotone" dataKey="budget" stroke="hsl(var(--primary))" fillOpacity={0.6} fill="url(#budgetGradient)" />
              <Area type="monotone" dataKey="actual" stroke="#10b981" fillOpacity={0.6} fill="url(#actualGradient)" />
              <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Distribution Pie Chart */}
      <Card className="linear-chart-container">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Risk Distribution Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectData.riskBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={30}
                paddingAngle={2}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {projectData.riskBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
                formatter={(value: any, name: string) => [`${value}%`, name]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span className="text-sm" style={{ color: entry.color }}>
                    {value}: {entry.payload.value}%
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
