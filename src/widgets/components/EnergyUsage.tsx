
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';
import { generateFacilitiesDemoData } from '@/utils/facilitiesDemoData';

interface EnergyUsageProps {
  projectId?: string;
}

const EnergyUsage: React.FC<EnergyUsageProps> = ({ projectId }) => {
  const { energy } = generateFacilitiesDemoData();

  const energyData = [
    { month: 'Jan', usage: 45000 },
    { month: 'Feb', usage: 42000 },
    { month: 'Mar', usage: 41000 },
    { month: 'Apr', usage: 43000 },
    { month: 'May', usage: 48000 },
    { month: 'Jun', usage: 52000 }
  ];

  const currentUsage = energy.electricity.currentMonth;
  const efficiency = -energy.electricity.percentChange;

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-600" />
          <h3 className="text-sm font-medium text-muted-foreground">Energy Usage</h3>
        </div>
        <div className={`text-xs ${efficiency > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {efficiency > 0 ? '+' : ''}{efficiency.toFixed(1)}% vs target
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
          <div className="font-medium">{(currentUsage / 1000).toFixed(0)}k kWh</div>
        </div>
        <div>
          <span className="text-muted-foreground">Target</span>
          <div className="font-medium">{(energy.electricity.target / 1000).toFixed(0)}k kWh</div>
        </div>
      </div>
    </Card>
  );
};

export default EnergyUsage;
