
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
  // Enhanced futuristic color palette for risk categories
  const futuristicRiskData = projectData.riskBreakdown.map((item, index) => {
    const futuristicColors = [
      '#00D4FF', // Cyan blue for Technical
      '#00FF88', // Neon green for Financial  
      '#FFB800', // Golden yellow for Schedule
      '#FF3366'  // Neon red for External
    ];
    return {
      ...item,
      color: futuristicColors[index] || item.color
    };
  });

  const CustomRiskTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-primary/20 rounded-lg p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ 
                backgroundColor: data.payload.color,
                boxShadow: `0 0 10px ${data.payload.color}40`
              }}
            />
            <div>
              <p className="font-semibold text-foreground text-sm">
                {data.payload.category}
              </p>
              <p className="text-2xl font-bold" style={{ color: data.payload.color }}>
                {data.value}%
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomRiskLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-6 mt-6">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 group cursor-pointer">
            <div 
              className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-110"
              style={{ 
                backgroundColor: entry.color,
                boxShadow: `0 0 8px ${entry.color}60, inset 0 0 8px ${entry.color}40`
              }}
            />
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {entry.value}: {futuristicRiskData.find(d => d.category === entry.value)?.value}%
            </span>
          </div>
        ))}
      </div>
    );
  };

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

      {/* Enhanced Futuristic Risk Distribution */}
      <Card className="linear-chart-container relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <CardHeader className="relative">
          <CardTitle className="linear-chart-title">
            <div className="relative">
              <AlertTriangle className="h-5 w-5 text-orange-400 drop-shadow-lg" />
              <div className="absolute inset-0 h-5 w-5 text-orange-400 blur-sm opacity-50" />
            </div>
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-semibold">
              Risk Distribution Analysis
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                {futuristicRiskData.map((entry, index) => (
                  <radialGradient key={index} id={`riskGradient${index}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                    <stop offset="70%" stopColor={entry.color} stopOpacity={0.7}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.4}/>
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={futuristicRiskData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={35}
                paddingAngle={3}
                dataKey="value"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              >
                {futuristicRiskData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#riskGradient${index})`}
                    style={{
                      filter: `drop-shadow(0 0 6px ${entry.color}40)`,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomRiskTooltip />} />
              <Legend content={<CustomRiskLegend />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Central glow effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl pointer-events-none" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
