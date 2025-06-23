
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Leaf, Zap, Droplets, Recycle, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface SustainabilityDashboardProps {
  projectId: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ projectId }) => {
  // Mock sustainability data
  const energyData = [
    { month: 'Jan', renewable: 65, grid: 35 },
    { month: 'Feb', renewable: 70, grid: 30 },
    { month: 'Mar', renewable: 68, grid: 32 },
    { month: 'Apr', renewable: 75, grid: 25 },
    { month: 'May', renewable: 80, grid: 20 },
    { month: 'Jun', renewable: 85, grid: 15 }
  ];

  const wasteData = [
    { category: 'Recycled', value: 65, color: '#10b981' },
    { category: 'Composted', value: 20, color: '#8b5cf6' },
    { category: 'Landfill', value: 15, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights - moved to top */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Sustainability Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="destructive">High Priority</Badge>
              <div>
                <h4 className="font-medium">Water Usage Spike</h4>
                <p className="text-sm text-muted-foreground">Water consumption up 23% this month. Check for leaks in zones 3 and 7.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Medium Priority</Badge>
              <div>
                <h4 className="font-medium">LEED Certification Progress</h4>
                <p className="text-sm text-muted-foreground">On track for Gold certification. Need to complete 3 more energy efficiency upgrades.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Achievement</Badge>
              <div>
                <h4 className="font-medium">Carbon Neutral Milestone</h4>
                <p className="text-sm text-muted-foreground">85% renewable energy achieved. Exceeded quarterly sustainability targets.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-45%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                vs. baseline year
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% this quarter
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Conservation</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-xs text-muted-foreground">
              Reduction vs. standard
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Diverted</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              From landfills
            </p>
          </CardContent>
        </Card>
      </div>

      {/* LEED Progress */}
      <Card>
        <CardHeader>
          <CardTitle>LEED Certification Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sustainable Sites</span>
                <span className="font-medium">24/26 points</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Water Efficiency</span>
                <span className="font-medium">9/10 points</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Energy & Atmosphere</span>
                <span className="font-medium">30/33 points</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Materials & Resources</span>
                <span className="font-medium">12/13 points</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Mix Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="renewable" stackId="1" stroke="#10b981" fill="#10b981" />
                <Area type="monotone" dataKey="grid" stackId="1" stroke="#ef4444" fill="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ category, value }) => `${category}: ${value}%`}
                >
                  {wasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
