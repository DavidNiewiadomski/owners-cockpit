
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

interface EnergyUsageProps {
  projectId?: string;
}

const EnergyUsage: React.FC<EnergyUsageProps> = ({ projectId }) => {
  const energyData = [
    { month: 'Jan', usage: 120 },
    { month: 'Feb', usage: 115 },
    { month: 'Mar', usage: 110 },
    { month: 'Apr', usage: 105 },
    { month: 'May', usage: 98 },
    { month: 'Jun', usage: 95 }
  ];

  const currentUsage = energyData[energyData.length - 1].usage;
  const previousUsage = energyData[energyData.length - 2].usage;
  const efficiency = ((previousUsage - currentUsage) / previousUsage * 100).toFixed(1);

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-600" />
          <h3 className="text-sm font-medium text-muted-foreground">Energy Usage</h3>
        </div>
        <div className="text-xs text-green-600">
          -{efficiency}% vs last month
        </div>
      </div>
      
      <div className="h-32 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={energyData}>
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Line 
              type="monotone" 
              dataKey="usage" 
              stroke="#eab308" 
              strokeWidth={2}
              dot={{ fill: '#eab308', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Current</span>
          <div className="font-medium">{currentUsage} kWh</div>
        </div>
        <div>
          <span className="text-muted-foreground">Target</span>
          <div className="font-medium">90 kWh</div>
        </div>
      </div>
    </Card>
  );
};

export default EnergyUsage;
