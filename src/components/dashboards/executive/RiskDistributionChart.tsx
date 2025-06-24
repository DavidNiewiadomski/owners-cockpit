
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface RiskDistributionChartProps {
  riskBreakdown: Array<{
    category: string;
    value: number;
    color: string;
  }>;
}

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

const CustomRiskLegend = ({ payload, futuristicRiskData }: any) => {
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
            {entry.value}: {futuristicRiskData.find((d: any) => d.category === entry.value)?.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ riskBreakdown }) => {
  // Enhanced futuristic color palette for risk categories
  const futuristicRiskData = riskBreakdown.map((item, index) => {
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

  return (
    <Card className="linear-chart-container relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 pointer-events-none" />
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
            <Legend content={(props) => <CustomRiskLegend {...props} futuristicRiskData={futuristicRiskData} />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Central glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl pointer-events-none" />
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;
