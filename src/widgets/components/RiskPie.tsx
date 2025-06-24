
import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RiskPieProps {
  projectId?: string;
}

const RiskPie: React.FC<RiskPieProps> = ({ projectId }) => {
  const riskData = [
    { name: 'Technical', value: 28, color: '#3b82f6', description: 'Technical implementation risks' },
    { name: 'Financial', value: 32, color: '#10b981', description: 'Budget and cost overrun risks' },
    { name: 'Schedule', value: 25, color: '#f59e0b', description: 'Timeline and delivery risks' },
    { name: 'External', value: 15, color: '#ef4444', description: 'External dependencies and regulatory risks' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium" style={{ color: data.payload.color }}>
            {data.payload.name}: {data.value}%
          </p>
          <p className="text-sm text-gray-600">{data.payload.description}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {entry.value}: {riskData.find(d => d.name === entry.value)?.value}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <h3 className="text-sm font-medium text-gray-900">Risk Distribution Analysis</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={30}
              paddingAngle={2}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RiskPie;
