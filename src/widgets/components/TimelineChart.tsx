
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface TimelineChartProps {
  projectId?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ projectId }) => {
  const timelineData = [
    { phase: 'Foundation', planned: 30, actual: 32 },
    { phase: 'Framing', planned: 45, actual: 43 },
    { phase: 'Electrical', planned: 25, actual: 0 },
    { phase: 'Plumbing', planned: 20, actual: 0 },
    { phase: 'Finishing', planned: 40, actual: 0 }
  ];

  return (
    <Card className="p-4 h-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Project Timeline</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="phase" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
            <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded" />
          <span>Planned</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span>Actual</span>
        </div>
      </div>
    </Card>
  );
};

export default TimelineChart;
