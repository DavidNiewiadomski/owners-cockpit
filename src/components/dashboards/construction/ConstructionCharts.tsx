
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Calendar, Shield } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, LineChart, Line } from 'recharts';

interface ConstructionChartsProps {
  projectData: {
    constructionProgress: Array<{
      phase: string;
      planned: number;
      actual: number;
      variance: number;
    }>;
    materialDeliveries: Array<{
      week: string;
      planned: number;
      actual: number;
      delayed: number;
    }>;
    safetyTrends: Array<{
      month: string;
      incidents: number;
      nearMiss: number;
      training: number;
    }>;
  };
}

const ConstructionCharts: React.FC<ConstructionChartsProps> = ({ projectData }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Construction Phase Progress */}
        <Card className="linear-chart-container">
          <CardHeader>
            <CardTitle className="linear-chart-title">
              <Wrench className="h-5 w-5 text-blue-600" />
              Construction Phase Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData.constructionProgress} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis dataKey="phase" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  formatter={(value, name) => [`${value}%`, name === 'planned' ? 'Planned' : 'Actual']}
                />
                <Bar dataKey="planned" fill="hsl(var(--muted))" name="Planned" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actual" fill="hsl(var(--primary))" name="Actual" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Material Delivery Trends */}
        <Card className="linear-chart-container">
          <CardHeader>
            <CardTitle className="linear-chart-title">
              <Calendar className="h-5 w-5 text-green-600" />
              Material Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectData.materialDeliveries}>
                <defs>
                  <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="planned" stroke="#10b981" fillOpacity={0.6} fill="url(#plannedGradient)" />
                <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fillOpacity={0.6} fill="url(#actualGradient)" />
                <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Safety Trends */}
      <Card className="linear-chart-container">
        <CardHeader>
          <CardTitle className="linear-chart-title">
            <Shield className="h-5 w-5 text-orange-600" />
            Safety Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectData.safetyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} name="Incidents" />
              <Line type="monotone" dataKey="nearMiss" stroke="#f59e0b" strokeWidth={3} name="Near Miss" />
              <Line type="monotone" dataKey="training" stroke="#10b981" strokeWidth={3} name="Training Hours" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default ConstructionCharts;
