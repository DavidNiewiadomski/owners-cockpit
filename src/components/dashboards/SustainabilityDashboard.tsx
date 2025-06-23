
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Leaf, Zap, Droplets, Recycle, TrendingUp, TrendingDown, Target, Award, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { generateSustainabilityDemoData } from '@/utils/sustainabilityDemoData';

interface SustainabilityDashboardProps {
  projectId: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ projectId }) => {
  // Generate demo data
  const sustainabilityData = generateSustainabilityDemoData();

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Certified':
        return <Badge variant="default" className="bg-green-600">Certified</Badge>;
      case 'On Track':
        return <Badge variant="secondary">On Track</Badge>;
      case 'Under Review':
        return <Badge variant="outline">Under Review</Badge>;
      case 'At Risk':
        return <Badge variant="destructive">At Risk</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'Warning':
        return <Badge variant="destructive">Warning</Badge>;
      case 'Achievement':
        return <Badge variant="default">Achievement</Badge>;
      case 'Reminder':
        return <Badge variant="secondary">Reminder</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge variant="default">Available</Badge>;
      case 'Due Soon':
        return <Badge variant="secondary">Due Soon</Badge>;
      case 'Overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Sustainability Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{sustainabilityData.insights.summary}</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Key Findings:</h4>
              {sustainabilityData.insights.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">•</Badge>
                  <p className="text-sm text-muted-foreground">{finding}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Recommendations:</h4>
              {sustainabilityData.insights.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">→</Badge>
                  <p className="text-sm text-muted-foreground">{rec}</p>
                </div>
              ))}
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
            <div className="text-2xl font-bold">{sustainabilityData.kpis.currentEnergyUsage} MWh</div>
            <p className="text-xs text-muted-foreground">
              <span className={`flex items-center ${sustainabilityData.kpis.energyDeviationPercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {sustainabilityData.kpis.energyDeviationPercent > 0 ? 
                  <TrendingUp className="h-3 w-3 mr-1" /> : 
                  <TrendingDown className="h-3 w-3 mr-1" />
                }
                {Math.abs(sustainabilityData.kpis.energyDeviationPercent)}% {sustainabilityData.kpis.energyDeviationPercent > 0 ? 'above' : 'below'} target
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
            <div className="text-2xl font-bold">{sustainabilityData.kpis.currentEmissions} tons</div>
            <p className="text-xs text-muted-foreground">
              CO₂ YTD ({sustainabilityData.kpis.emissionsDeviationPercent > 0 ? '+' : ''}{sustainabilityData.kpis.emissionsDeviationPercent}% vs target)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sustainabilityData.kpis.renewablePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{sustainabilityData.kpis.renewablesIncreasePercent}% from last year
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
            <div className="text-2xl font-bold text-green-600">{sustainabilityData.kpis.totalRecyclingRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average across all facilities
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
              <AreaChart data={sustainabilityData.energyData}>
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
              <BarChart data={sustainabilityData.carbonData}>
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
                <span className="font-bold">{(sustainabilityData.waterUsage.ytdGallons / 1000000).toFixed(1)}M gallons</span>
              </div>
              <div className="flex justify-between items-center">
                <span>vs. Last Year</span>
                <span className={`flex items-center ${sustainabilityData.waterUsage.changePercent < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {sustainabilityData.waterUsage.changePercent < 0 ? 
                    <TrendingDown className="h-4 w-4 mr-1" /> : 
                    <TrendingUp className="h-4 w-4 mr-1" />
                  }
                  {Math.abs(sustainabilityData.waterUsage.changePercent)}% {sustainabilityData.waterUsage.changePercent < 0 ? 'reduction' : 'increase'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conservation Target</span>
                  <span>5% reduction</span>
                </div>
                <Progress value={Math.abs(sustainabilityData.waterUsage.changePercent) * 20} className="h-2" />
                <p className="text-xs text-muted-foreground">{Math.abs(sustainabilityData.waterUsage.changePercent) * 20}% of target achieved</p>
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
                <span className="font-bold text-green-600">{sustainabilityData.kpis.averageEnergyStarScore}</span>
              </div>
              <div className="space-y-3">
                {sustainabilityData.buildingsEfficiency.map((building, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{building.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={building.energyStarScore} className="w-20 h-2" />
                      <span className="text-sm font-medium">{building.energyStarScore}</span>
                    </div>
                  </div>
                ))}
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
            {sustainabilityData.certifications.map((cert, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.certification}</p>
                  </div>
                  {getStatusBadge(cert.status)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{cert.progressPoints}/{cert.goalPoints} points</span>
                  </div>
                  <Progress value={(cert.progressPoints / cert.goalPoints) * 100} className="h-2" />
                  {cert.expectedCompletion && (
                    <p className="text-xs text-muted-foreground">
                      Expected: {cert.expectedCompletion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Sustainability Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sustainabilityData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getAlertBadge(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents & Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sustainabilityData.reports.map((report, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getReportStatusBadge(report.status)}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{report.name}</h4>
                    <p className="text-xs text-muted-foreground">{report.type} • {report.date}</p>
                  </div>
                  <Badge variant="outline">View</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;
