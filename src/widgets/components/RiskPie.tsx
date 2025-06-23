
import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface RiskPieProps {
  projectId?: string;
}

const RiskPie: React.FC<RiskPieProps> = ({ projectId }) => {
  const riskData = [
    { name: 'Low', value: 45, color: '#10b981' },
    { name: 'Medium', value: 30, color: '#f59e0b' },
    { name: 'High', value: 20, color: '#ef4444' },
    { name: 'Critical', value: 5, color: '#dc2626' }
  ];

  return (
    <Card className="p-4 h-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Risk Distribution</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RiskPie;
