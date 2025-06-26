
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
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';

interface SustainabilityDashboardProps {
  projectId: string;
  activeCategory: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ projectId, activeCategory }) => {
  const project = luxuryOfficeProject;
  const { data: projects = [] } = useProjects();
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

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
    <div className="min-h-screen bg-[#0D1117] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
            <Award className="w-4 h-4 mr-2" />
            LEED {project.sustainability.leedTarget} Target
          </Badge>
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
            {sustainabilityMetrics.leedScore} Points Earned
          </Badge>
        </div>
      </div>

      {/* AI Sustainability Insights */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Leaf className="w-5 h-5 text-green-400" />
              AI Sustainability Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{sustainabilityMetrics.leedScore}</div>
              <div className="text-sm text-slate-400">LEED Score</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{sustainabilityMetrics.energyEfficiency}%</div>
              <div className="text-sm text-slate-400">Energy Savings</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{sustainabilityMetrics.waterReduction}%</div>
              <div className="text-sm text-slate-400">Water Reduction</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{sustainabilityMetrics.carbonSaved}</div>
              <div className="text-sm text-slate-400">CO2 Saved (tons)</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Sustainability performance exceeds targets with LEED score of {sustainabilityMetrics.leedScore} points (target: {sustainabilityMetrics.leedTarget}). Energy efficiency at {sustainabilityMetrics.energyEfficiency}% improvement, water reduction {sustainabilityMetrics.waterReduction}%, saving {sustainabilityMetrics.carbonSaved} tons CO2 annually.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• LEED certification on track with {sustainabilityMetrics.leedScore} points vs {sustainabilityMetrics.leedTarget} target</li>
                <li>• Energy performance {sustainabilityMetrics.energyEfficiency}% above baseline with solar capacity of {sustainabilityMetrics.solarCapacity}kW</li>
                <li>• Water conservation achieving {sustainabilityMetrics.waterReduction}% reduction vs conventional design</li>
                <li>• Waste recycling at {sustainabilityMetrics.wasteRecycling}% during construction phase</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Continue ESG reporting excellence to maintain certification timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Optimize HVAC scheduling to maximize energy efficiency gains</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Implement rainwater harvesting to exceed water reduction targets</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Target className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="justify-start bg-green-600 hover:bg-green-700 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Generate ESG Report
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Award className="w-4 h-4 mr-2" />
              Update LEED Scorecard
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Energy Audit
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Droplets className="w-4 h-4 mr-2" />
              Water Usage Report
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <Recycle className="w-4 h-4 mr-2" />
              Waste Analysis
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
              <TreePine className="w-4 h-4 mr-2" />
              Carbon Calculator
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Sustainability KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LEED Score */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">LEED Score</CardTitle>
            <Award className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sustainabilityMetrics.leedScore}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">Target: {sustainabilityMetrics.leedTarget} points</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+12 points this quarter</span>
            </div>
          </CardContent>
        </Card>

        {/* Energy Efficiency */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Energy Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sustainabilityMetrics.energyEfficiency}%</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">improvement vs baseline</div>
            <Progress value={sustainabilityMetrics.energyEfficiency} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Water Conservation */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Water Reduction</CardTitle>
            <Droplets className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sustainabilityMetrics.waterReduction}%</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">usage reduction</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">25K gal/month saved</span>
            </div>
          </CardContent>
        </Card>

        {/* Waste Recycling */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Waste Recycling</CardTitle>
            <Recycle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sustainabilityMetrics.wasteRecycling}%</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">construction waste recycled</div>
            <Progress value={sustainabilityMetrics.wasteRecycling} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Energy Consumption Trends */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Zap className="h-5 w-5 text-slate-400" />
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
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <TreePine className="h-5 w-5 text-slate-400" />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEED Categories Progress */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Award className="h-5 w-5 text-slate-400" />
              LEED Certification Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leedCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-white">{category.category}</span>
                    <span className="text-sm text-slate-400">
                      {category.earned}/{category.available} points
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="text-xs text-slate-400">
                    {category.percentage}% complete
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Water Usage Breakdown */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Droplets className="h-5 w-5 text-slate-400" />
              Water Usage Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {waterUsage.map((usage, index) => (
                  <div key={index} className="p-3 rounded-md bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{usage.category}</span>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                      -{usage.reduction}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Current:</span>
                      <span className="font-medium ml-2 text-white">{usage.current.toLocaleString()} gal/month</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Baseline:</span>
                      <span className="font-medium ml-2 text-white">{usage.baseline.toLocaleString()} gal/month</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Green Features and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Green Building Features */}
        <Card className="lg:col-span-2 bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Building className="h-5 w-5 text-slate-400" />
              Green Building Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.sustainability.greenFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-md bg-slate-800/50 border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-white">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-md bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-300">Environmental Impact</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">{sustainabilityMetrics.carbonSaved}</div>
                  <div className="text-green-300">tons CO2 saved annually</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{sustainabilityMetrics.solarCapacity}kW</div>
                  <div className="text-green-300">solar capacity</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{sustainabilityMetrics.greenRoofArea}</div>
                  <div className="text-green-300">sq ft green roof</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Summary */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Leaf className="h-5 w-5 text-slate-400" />
              Sustainability Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-md bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-300">Exceeding Targets</span>
              </div>
              <div className="text-sm text-green-300">
                LEED score {sustainabilityMetrics.leedScore - sustainabilityMetrics.leedTarget} points above target
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-white">{sustainabilityMetrics.energyEfficiency}%</div>
                <div className="text-slate-400">Energy Savings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{sustainabilityMetrics.waterReduction}%</div>
                <div className="text-slate-400">Water Savings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{sustainabilityMetrics.wasteRecycling}%</div>
                <div className="text-slate-400">Waste Recycled</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{sustainabilityMetrics.carbonSaved}</div>
                <div className="text-slate-400">CO2 Saved (tons)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
