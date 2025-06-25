
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TimelineChartProps {
  projectId: string;
}

export function TimelineChart({ projectId: _projectId }: TimelineChartProps) {
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
          <BarChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <XAxis dataKey="phase" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              formatter={(value, name) => [
                `${value} days`, 
                name === 'planned' ? 'Planned Duration' : 'Actual Duration'
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={20}
              iconType="rect"
              formatter={(value) => <span className="text-xs">{value === 'planned' ? 'Planned' : 'Actual'}</span>}
            />
            <Bar dataKey="planned" fill="#e5e7eb" name="planned" />
            <Bar dataKey="actual" fill="#3b82f6" name="actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TimelineChart;
