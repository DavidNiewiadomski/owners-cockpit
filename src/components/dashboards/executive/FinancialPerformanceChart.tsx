
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface FinancialPerformanceChartProps {
  monthlySpend: Array<{
    month: string;
    budget: number;
    actual: number;
    forecast: number;
  }>;
}

const CustomFinancialTooltip = ({ active, payload, label }: unknown) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-2xl">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: unknown, index: number) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: entry.color,
                boxShadow: `0 0 8px ${entry.color}60`
              }}
            />
            <span className="text-sm text-foreground">
              {entry.name === 'budget' ? 'Budget' : entry.name === 'actual' ? 'Actual Spend' : 'Forecast'}: 
              <span className="font-bold ml-1" style={{ color: entry.color }}>
                ${(entry.value / 1000000).toFixed(1)}M
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomFinancialLegend = ({ payload }: unknown) => {
  return (
    <div className="flex justify-center gap-8 mt-6">
      {payload.map((entry: unknown, index: number) => (
        <div key={index} className="flex items-center gap-3 group cursor-pointer">
          <div 
            className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-110"
            style={{ 
              backgroundColor: entry.color,
              boxShadow: `0 0 8px ${entry.color}60, inset 0 0 8px ${entry.color}40`
            }}
          />
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            {entry.value === 'budget' ? 'Budget' : entry.value === 'actual' ? 'Actual Spend' : 'Forecast'}
          </span>
        </div>
      ))}
    </div>
  );
};

const FinancialPerformanceChart: React.FC<FinancialPerformanceChartProps> = ({ monthlySpend }) => {
  return (
    <Card className="linear-chart-container relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="linear-chart-title">
          <div className="relative">
            <DollarSign className="h-5 w-5 text-blue-400 drop-shadow-lg" />
            <div className="absolute inset-0 h-5 w-5 text-blue-400 blur-sm opacity-50" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
            Financial Performance & Forecast
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlySpend}>
            <defs>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomFinancialTooltip />} />
            <Legend content={<CustomFinancialLegend />} />
            <Area 
              type="monotone" 
              dataKey="budget" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={0.6} 
              fill="url(#budgetGradient)"
              name="budget"
              style={{
                filter: 'drop-shadow(0 0 6px #3b82f640)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={0.6} 
              fill="url(#actualGradient)"
              name="actual"
              style={{
                filter: 'drop-shadow(0 0 6px #10b98140)',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="forecast" 
              stroke="#f59e0b" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              fill="transparent"
              name="forecast"
              style={{
                filter: 'drop-shadow(0 0 6px #f59e0b40)',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Central glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl pointer-events-none" />
      </CardContent>
    </Card>
  );
};

export default FinancialPerformanceChart;
