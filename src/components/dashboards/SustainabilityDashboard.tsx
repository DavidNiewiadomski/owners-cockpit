
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Leaf, Zap, Droplets, Recycle, TrendingUp, TrendingDown, Target, Award, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface SustainabilityDashboardProps {
  projectId: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ projectId }) => {
  // Mock sustainability data
  const energyData = [
    { month: 'Jan', consumption: 450, target: 480, renewable: 90, grid: 360 },
    { month: 'Feb', consumption: 420, target: 480, renewable: 95, grid: 325 },
    { month: 'Mar', consumption: 460, target: 480, renewable: 98, grid: 362 },
    { month: 'Apr', consumption: 485, target: 480, renewable: 105, grid: 380 },
    { month: 'May', consumption: 520, target: 480, renewable: 110, grid: 410 },
    { month: 'Jun', consumption: 550, target: 480, renewable: 120, grid: 430 }
  ];

  const carbonData = [
    { month: 'Jan', emissions: 45, target: 40 },
    { month: 'Feb', emissions: 42, target: 40 },
    { month: 'Mar', emissions: 46, target: 40 },
    { month: 'Apr', emissions: 48, target: 40 },
    { month: 'May', emissions: 52, target: 40 },
    { month: 'Jun', emissions: 55, target: 40 }
  ];

  const wasteData = [
    { category: 'Recycled', value: 65, color: '#10b981' },
    { category: 'Composted', value: 20, color: '#8b5cf6' },
    { category: 'Landfill', value: 15, color: '#ef4444' }
  ];

  const renewableEnergyData = [
    { source: 'Solar', percentage: 22, color: '#f59e0b' },
    { source: 'Wind', percentage: 8, color: '#06b6d4' },
    { source: 'Grid (Clean)', percentage: 15, color: '#10b981' },
    { source: 'Fossil Fuels', percentage: 55, color: '#ef4444' }
  ];

  const projectCertifications = [
    {
      project: 'Tower Alpha',
      certification: 'LEED Gold',
      status: 'In Progress',
      pointsEarned: 65,
      pointsTotal: 110,
      expectedCompletion: '2025-09-15'
    },
    {
      project: 'Office Complex Beta',
      certification: 'WELL Certification',
      status: 'Under Review',
      pointsEarned: 78,
      pointsTotal: 100,
      expectedCompletion: '2025-07-30'
    },
    {
      project: 'Residential Gamma',
      certification: 'Energy Star',
      status: 'Achieved',
      pointsEarned: 92,
      pointsTotal: 100,
      expectedCompletion: 'Completed'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Achieved':
        return <Badge variant="default" className="bg-green-600">Achieved</Badge>;
      case 'In Progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'Under Review':
        return <Badge variant="outline">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                <h4 className="font-medium">Energy Consumption Above Target</h4>
                <p className="text-sm text-muted-foreground">Monthly energy use is 15% above target (550 MWh vs 480 MWh goal). Summer cooling demands in Building A are the primary driver.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Achievement</Badge>
              <div>
                <h4 className="font-medium">Renewable Energy Milestone</h4>
                <p className="text-sm text-muted-foreground">Renewable energy contribution increased to 22% after new solar panel installation. On track to reach 25% by year-end.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Action Required</Badge>
              <div>
                <h4 className="font-medium">Carbon Emissions Trending High</h4>
                <p className="text-sm text-muted-foreground">YTD emissions 300 tons CO₂ (target 280 tons). Implement energy efficiency measures in Building A to meet 2030 reduction goals.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">550 MWh</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                15% above target (480 MWh)
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Emissions</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300 tons</div>
            <p className="text-xs text-muted-foreground">
              CO₂ YTD (target 280 tons)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">22%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +10% from last quarter
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Diversion</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-muted-foreground">
              From landfills
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Energy & Carbon Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="consumption" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carbonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="target" fill="#10b981" />
                <Bar dataKey="emissions" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Renewable Energy & Waste Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Sources Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={renewableEnergyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="percentage"
                  label={({ source, percentage }) => `${source}: ${percentage}%`}
                >
                  {renewableEnergyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
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

      {/* Water Usage & Building Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Water Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>YTD Consumption</span>
                <span className="font-bold">1.2M gallons</span>
              </div>
              <div className="flex justify-between items-center">
                <span>vs. Last Year</span>
                <span className="text-green-600 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -2% reduction
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conservation Target</span>
                  <span>5% reduction</span>
                </div>
                <Progress value={40} className="h-2" />
                <p className="text-xs text-muted-foreground">40% of target achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Building Efficiency Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Average Energy Star Score</span>
                <span className="font-bold text-green-600">85</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Building A</span>
                  <div className="flex items-center gap-2">
                    <Progress value={90} className="w-20 h-2" />
                    <span className="text-sm font-medium">90</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Building B</span>
                  <div className="flex items-center gap-2">
                    <Progress value={80} className="w-20 h-2" />
                    <span className="text-sm font-medium">80</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Building C</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="w-20 h-2" />
                    <span className="text-sm font-medium">85</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Sustainability Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectCertifications.map((cert, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{cert.project}</h4>
                    <p className="text-sm text-muted-foreground">{cert.certification}</p>
                  </div>
                  {getStatusBadge(cert.status)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{cert.pointsEarned}/{cert.pointsTotal} points</span>
                  </div>
                  <Progress value={(cert.pointsEarned / cert.pointsTotal) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Expected: {cert.expectedCompletion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents & Compliance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Badge variant="default">Available</Badge>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Q2 2025 Sustainability Report</h4>
                <p className="text-xs text-muted-foreground">Comprehensive ESG metrics and performance analysis</p>
              </div>
              <Badge variant="outline">View Report</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Badge variant="secondary">Due Soon</Badge>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Annual Emissions Audit - Building B</h4>
                <p className="text-xs text-muted-foreground">Due: July 30, 2025</p>
              </div>
              <Badge variant="outline">Schedule</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Badge variant="destructive">Alert</Badge>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Energy Efficiency Inspection Required</h4>
                <p className="text-xs text-muted-foreground">Building A exceeds energy consumption thresholds</p>
              </div>
              <Badge variant="outline">Review</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityDashboard;
