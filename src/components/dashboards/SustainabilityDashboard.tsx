
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, Droplets, Recycle, Zap, Target, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SustainabilityDashboardProps {
  projectId: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ projectId }) => {
  const sustainabilityMetrics = {
    carbonFootprint: 245, // tons CO2
    carbonTarget: 200,
    energyReduction: 18, // percentage
    waterSavings: 25, // percentage
    wasteRecycling: 78, // percentage
    leedProgress: 85 // percentage toward certification
  };

  const energyData = [
    { month: 'Jan', usage: 120, target: 115 },
    { month: 'Feb', usage: 118, target: 115 },
    { month: 'Mar', usage: 115, target: 115 },
    { month: 'Apr', usage: 110, target: 115 },
    { month: 'May', usage: 108, target: 115 },
    { month: 'Jun', usage: 105, target: 115 }
  ];

  const esgScorecard = [
    { category: 'Energy Efficiency', score: 92, target: 90 },
    { category: 'Water Conservation', score: 88, target: 85 },
    { category: 'Waste Management', score: 78, target: 80 },
    { category: 'Indoor Air Quality', score: 95, target: 90 },
    { category: 'Green Transportation', score: 72, target: 75 }
  ];

  return (
    <div className="space-y-6">
      {/* Sustainability KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sustainabilityMetrics.carbonFootprint}t</div>
            <Progress 
              value={(sustainabilityMetrics.carbonFootprint / sustainabilityMetrics.carbonTarget) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-2">
              Target: {sustainabilityMetrics.carbonTarget}t CO₂
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Reduction</CardTitle>
            <Zap className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sustainabilityMetrics.energyReduction}%</div>
            <p className="text-xs text-muted-foreground flex items-center mt-2">
              <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
              vs. baseline consumption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Savings</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sustainabilityMetrics.waterSavings}%</div>
            <p className="text-xs text-muted-foreground">
              Reduction in water usage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Recycling</CardTitle>
            <Recycle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sustainabilityMetrics.wasteRecycling}%</div>
            <Progress value={sustainabilityMetrics.wasteRecycling} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Diversion from landfill
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Energy Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`${value} kWh/sqft`, name === 'usage' ? 'Actual' : 'Target']} />
                <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              LEED Certification Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{sustainabilityMetrics.leedProgress}%</div>
                <p className="text-sm text-muted-foreground">Progress toward LEED Gold</p>
                <Progress value={sustainabilityMetrics.leedProgress} className="mt-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Energy & Atmosphere</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Water Efficiency</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Materials & Resources</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Indoor Environmental Quality</span>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Scorecard */}
      <Card>
        <CardHeader>
          <CardTitle>ESG Performance Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {esgScorecard.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Target: {item.target}</span>
                    <Badge variant={item.score >= item.target ? 'default' : 'secondary'}>
                      {item.score}/100
                    </Badge>
                  </div>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">This Month's Achievements</h4>
              <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-950 p-3 rounded-r">
                <h5 className="font-medium text-green-900 dark:text-green-100">Energy Milestone</h5>
                <p className="text-sm text-green-800 dark:text-green-200">Achieved 18% energy reduction vs. baseline - exceeding annual target.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-950 p-3 rounded-r">
                <h5 className="font-medium text-blue-900 dark:text-blue-100">Water Conservation</h5>
                <p className="text-sm text-blue-800 dark:text-blue-200">Rainwater harvesting system installed, projected 30% reduction in municipal water use.</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Upcoming Initiatives</h4>
              <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 dark:bg-amber-950 p-3 rounded-r">
                <h5 className="font-medium text-amber-900 dark:text-amber-100">Solar Installation</h5>
                <p className="text-sm text-amber-800 dark:text-amber-200">Rooftop solar project scheduled for Q4, targeting 40% renewable energy mix.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 dark:bg-purple-950 p-3 rounded-r">
                <h5 className="font-medium text-purple-900 dark:text-purple-100">Green Transportation</h5>
                <p className="text-sm text-purple-800 dark:text-purple-200">EV charging stations deployment to support carbon-neutral commuting goals.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityDashboard;
