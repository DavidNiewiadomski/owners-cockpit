
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface PerformanceTrendsProps {
  projectData: {
    kpiTrends: Array<{
      week: string;
      efficiency: number;
      quality: number;
      safety: number;
    }>;
  };
}

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ projectData }) => {
  return (
    <Card className="linear-chart-container">
      <CardHeader>
        <CardTitle className="linear-chart-title">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Performance Trends (Last 4 Weeks)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectData.kpiTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="line"
              formatter={(value) => <span className="text-sm capitalize">{value}</span>}
            />
            <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} />
            <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
            <Line type="monotone" dataKey="safety" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceTrends;
