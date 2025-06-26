
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Recycle, 
  TreePine, 
  Sun,
  Wind,
  Building,
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { luxuryOfficeProject } from '@/data/sampleProjectData';

interface SustainabilityDashboardProps {
  projectId: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ projectId }) => {
  const project = luxuryOfficeProject;

  // Enhanced sustainability metrics
  const sustainabilityMetrics = {
    leedScore: 72,
    leedTarget: 60,
    energyEfficiency: 35,
    waterReduction: 40,
    wasteRecycling: 85,
    carbonSaved: 245,
    sustainableMaterials: 60,
    greenRoofArea: 3500,
    solarCapacity: 150,
    rainwaterCapacity: 25000
  };

  // Energy consumption trends
  const energyTrends = [
    { month: 'Jan', consumption: 120, baseline: 180, target: 140 },
    { month: 'Feb', consumption: 115, baseline: 175, target: 135 },
    { month: 'Mar', consumption: 110, baseline: 170, target: 130 },
    { month: 'Apr', consumption: 105, baseline: 165, target: 125 },
    { month: 'May', consumption: 100, baseline: 160, target: 120 },
    { month: 'Jun', consumption: 95, baseline: 155, target: 115 }
  ];

  // Sustainability initiatives breakdown
  const sustainabilityBreakdown = [
    { name: 'Energy Systems', value: 30, color: '#f59e0b' },
    { name: 'Water Management', value: 25, color: '#3b82f6' },
    { name: 'Waste Reduction', value: 20, color: '#10b981' },
    { name: 'Green Materials', value: 15, color: '#8b5cf6' },
    { name: 'Air Quality', value: 10, color: '#ef4444' }
  ];

  // Water usage data
  const waterUsage = [
    { category: 'Potable Water', current: 1200, baseline: 2000, reduction: 40 },
    { category: 'Irrigation', current: 800, baseline: 1500, reduction: 47 },
    { category: 'Cooling Systems', current: 900, baseline: 1200, reduction: 25 },
    { category: 'Cleaning/Other', current: 300, baseline: 400, reduction: 25 }
  ];

  // LEED certification progress
  const leedCategories = [
    { category: 'Sustainable Sites', earned: 18, available: 26, percentage: 69 },
    { category: 'Water Efficiency', earned: 8, available: 10, percentage: 80 },
    { category: 'Energy & Atmosphere', earned: 25, available: 35, percentage: 71 },
    { category: 'Materials & Resources', earned: 12, available: 14, percentage: 86 },
    { category: 'Indoor Environmental Quality', earned: 9, available: 15, percentage: 60 }
  ];

  // Carbon footprint tracking
  const carbonData = [
    { month: 'Jan', emissions: 450, offset: 380, net: 70 },
    { month: 'Feb', emissions: 420, offset: 390, net: 30 },
    { month: 'Mar', emissions: 400, offset: 410, net: -10 },
    { month: 'Apr', emissions: 380, offset: 420, net: -40 },
    { month: 'May', emissions: 360, offset: 430, net: -70 },
    { month: 'Jun', emissions: 340, offset: 440, net: -100 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Sustainability Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            {project.name} • Environmental Impact & ESG Compliance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm">
            <Award className="w-4 h-4 mr-2" />
            LEED {project.sustainability.leedTarget} Target
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 text-sm">
            {sustainabilityMetrics.leedScore} Points Earned
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="h-6 w-6 text-teal-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate ESG Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="w-4 h-4 mr-2" />
              Update LEED Scorecard
            </Button>
            <Button variant="outline" className="justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Energy Audit
            </Button>
            <Button variant="outline" className="justify-start">
              <Droplets className="w-4 h-4 mr-2" />
              Water Usage Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Recycle className="w-4 h-4 mr-2" />
              Waste Analysis
            </Button>
            <Button variant="outline" className="justify-start">
              <TreePine className="w-4 h-4 mr-2" />
              Carbon Calculator
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Sustainability KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* LEED Score */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">LEED Score</CardTitle>
            <Award className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{sustainabilityMetrics.leedScore}</div>
            <div className="text-sm text-green-100 mt-1">Target: {sustainabilityMetrics.leedTarget} points</div>
            <div className="flex items-center mt-2 text-green-100">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+12 points this quarter</span>
            </div>
          </CardContent>
        </Card>

        {/* Energy Efficiency */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Energy Efficiency</CardTitle>
            <Zap className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{sustainabilityMetrics.energyEfficiency}%</div>
            <div className="text-sm text-yellow-100 mt-1">improvement vs baseline</div>
            <Progress value={sustainabilityMetrics.energyEfficiency} className="mt-3 bg-white/20" />
          </CardContent>
        </Card>

        {/* Water Conservation */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Water Reduction</CardTitle>
            <Droplets className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{sustainabilityMetrics.waterReduction}%</div>
            <div className="text-sm text-blue-100 mt-1">usage reduction</div>
            <div className="flex items-center mt-2 text-blue-100">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">25K gal/month saved</span>
            </div>
          </CardContent>
        </Card>

        {/* Waste Recycling */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Waste Recycling</CardTitle>
            <Recycle className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{sustainabilityMetrics.wasteRecycling}%</div>
            <div className="text-sm text-purple-100 mt-1">construction waste recycled</div>
            <Progress value={sustainabilityMetrics.wasteRecycling} className="mt-3 bg-white/20" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Energy Consumption Trends */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-6 w-6 text-yellow-600" />
              Energy Consumption Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={energyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Baseline"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  name="Target"
                />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Carbon Footprint */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TreePine className="h-6 w-6 text-green-600" />
              Carbon Footprint Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={carbonData}>
                <defs>
                  <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="offsetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#emissionsGradient)" 
                  name="Emissions (tons CO2)"
                />
                <Area 
                  type="monotone" 
                  dataKey="offset" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#offsetGradient)" 
                  name="Carbon Offset (tons CO2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* LEED Categories and Water Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEED Categories Progress */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Award className="h-6 w-6 text-green-600" />
              LEED Certification Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leedCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{category.category}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {category.earned}/{category.available} points
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-3" />
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {category.percentage}% complete
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Water Usage Breakdown */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Droplets className="h-6 w-6 text-blue-600" />
              Water Usage Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {waterUsage.map((usage, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{usage.category}</span>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      -{usage.reduction}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Current:</span>
                      <span className="font-medium ml-2">{usage.current.toLocaleString()} gal/month</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Baseline:</span>
                      <span className="font-medium ml-2">{usage.baseline.toLocaleString()} gal/month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Green Features and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Green Building Features */}
        <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building className="h-6 w-6 text-emerald-600" />
              Green Building Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.sustainability.greenFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Environmental Impact</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">{sustainabilityMetrics.carbonSaved}</div>
                  <div className="text-green-700 dark:text-green-300">tons CO2 saved annually</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{sustainabilityMetrics.solarCapacity}kW</div>
                  <div className="text-green-700 dark:text-green-300">solar capacity</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{sustainabilityMetrics.greenRoofArea}</div>
                  <div className="text-green-700 dark:text-green-300">sq ft green roof</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Summary */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Leaf className="h-6 w-6 text-green-600" />
              Sustainability Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Exceeding Targets</span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                LEED score {sustainabilityMetrics.leedScore - sustainabilityMetrics.leedTarget} points above target
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-yellow-600">{sustainabilityMetrics.energyEfficiency}%</div>
                <div className="text-slate-600 dark:text-slate-400">Energy Savings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">{sustainabilityMetrics.waterReduction}%</div>
                <div className="text-slate-600 dark:text-slate-400">Water Savings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{sustainabilityMetrics.wasteRecycling}%</div>
                <div className="text-slate-600 dark:text-slate-400">Waste Recycled</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{sustainabilityMetrics.carbonSaved}</div>
                <div className="text-slate-600 dark:text-slate-400">CO2 Saved (tons)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
