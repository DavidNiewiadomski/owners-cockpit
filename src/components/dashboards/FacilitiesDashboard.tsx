
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Building, Wrench, Zap, Thermometer, FileText, Users, DollarSign, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateFacilitiesDemoData } from '@/utils/facilitiesDemoData';

interface FacilitiesDashboardProps {
  projectId: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId }) => {
  const dashboardData = generateFacilitiesDemoData();
  const { occupancy, workOrders, energy, sensors, compliance, portfolioSummary } = dashboardData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': case 'good': case 'current': return 'text-green-600';
      case 'moderate': case 'due_soon': return 'text-amber-600';
      case 'high': case 'low': case 'poor': case 'overdue': return 'text-red-600';
      default: return 'text-foreground';
    }
  };

  const workOrderTypeColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* AI Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            AI Facilities Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="default">Status</Badge>
              <div>
                <h4 className="font-medium">Portfolio Overview</h4>
                <p className="text-sm text-muted-foreground">
                  All facilities operating smoothly. Overall occupancy at {portfolioSummary.overallOccupancy}% 
                  with {occupancy.reduce((sum, b) => sum + b.upcomingExpirations.length, 0)} leases expiring in next 60 days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant={workOrders.overdue > 0 ? "destructive" : "secondary"}>
                {workOrders.overdue > 0 ? "Action Required" : "On Track"}
              </Badge>
              <div>
                <h4 className="font-medium">Maintenance Status</h4>
                <p className="text-sm text-muted-foreground">
                  {workOrders.overdue > 0 
                    ? `${workOrders.overdue} overdue work orders need immediate attention. Average resolution time: ${workOrders.avgResolutionHours}h.`
                    : `Maintenance under control: ${workOrders.open} open work orders, ${workOrders.completionRate}% completion rate.`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant={energy.electricity.percentChange > 5 ? "destructive" : "secondary"}>
                Energy Alert
              </Badge>
              <div>
                <h4 className="font-medium">Energy Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Energy usage this month is {energy.electricity.percentChange.toFixed(1)}% above last month 
                  ({energy.electricity.currentMonth.toLocaleString()} {energy.electricity.unit}). 
                  Consider optimizing HVAC settings for summer efficiency.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Occupancy</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{portfolioSummary.overallOccupancy}%</div>
            <p className="text-xs text-muted-foreground">
              {portfolioSummary.totalUnits - occupancy.reduce((sum, b) => sum + b.occupiedUnits, 0)} units vacant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(portfolioSummary.totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Across {portfolioSummary.totalBuildings} buildings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.open}</div>
            <p className="text-xs text-muted-foreground">
              {workOrders.overdue > 0 ? `${workOrders.overdue} overdue` : 'All on track'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Cost</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(portfolioSummary.energyCostThisMonth / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              {energy.electricity.percentChange > 0 ? '+' : ''}{energy.electricity.percentChange.toFixed(1)}% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Building Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {occupancy.map((building) => (
              <div key={building.buildingId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{building.buildingName}</h4>
                  <Badge variant={building.occupancyRate >= 90 ? "default" : "secondary"}>
                    {building.occupancyRate}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Occupied:</span>
                    <span className="ml-2">{building.occupiedUnits}/{building.totalUnits} units</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="ml-2">${(building.monthlyRevenue / 1000).toFixed(0)}K/mo</span>
                  </div>
                </div>
                {building.upcomingExpirations.length > 0 && (
                  <div className="mt-3 pt-2 border-t">
                    <span className="text-xs text-amber-600">
                      {building.upcomingExpirations.length} lease(s) expiring soon
                    </span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Orders Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Maintenance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{workOrders.open}</div>
                  <div className="text-xs text-muted-foreground">Open</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-600">{workOrders.inProgress}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{workOrders.completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{workOrders.overdue}</div>
                  <div className="text-xs text-muted-foreground">Overdue</div>
                </div>
              </div>

              {workOrders.critical.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-red-600">Critical Issues</h5>
                  {workOrders.critical.map((item) => (
                    <div key={item.id} className="border-l-4 border-red-500 pl-3 py-2 bg-red-50">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.building} • {item.daysOverdue} days overdue
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workOrders.byType}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {workOrders.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={workOrderTypeColors[index % workOrderTypeColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Energy Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">{energy.electricity.currentMonth.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">kWh This Month</div>
                  <div className={`text-xs ${energy.electricity.percentChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {energy.electricity.percentChange > 0 ? '+' : ''}{energy.electricity.percentChange.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">{energy.water.currentMonth.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Gallons</div>
                  <div className={`text-xs ${energy.water.percentChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {energy.water.percentChange > 0 ? '+' : ''}{energy.water.percentChange.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">{energy.gas.currentMonth.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Therms</div>
                  <div className={`text-xs ${energy.gas.percentChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {energy.gas.percentChange > 0 ? '+' : ''}{energy.gas.percentChange.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energy.trends}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Sensors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Building Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sensors.map((sensor) => (
              <div key={sensor.buildingId} className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">{sensor.buildingName}</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Temperature</div>
                    <div className={`font-medium ${getStatusColor(sensor.temperature.status)}`}>
                      {sensor.temperature.current}°F
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Humidity</div>
                    <div className={`font-medium ${getStatusColor(sensor.humidity.status)}`}>
                      {sensor.humidity.current}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Air Quality</div>
                    <div className={`font-medium ${getStatusColor(sensor.airQuality.status)}`}>
                      AQI {sensor.airQuality.aqi}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Dashboard */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance & Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-3">Upcoming & Overdue</h5>
                <div className="space-y-2">
                  {compliance.filter(c => c.status !== 'current').map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{item.description}</div>
                        <div className="text-xs text-muted-foreground">{item.building}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={item.status === 'overdue' ? 'destructive' : 'default'}>
                          {item.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3">Current Certifications</h5>
                <div className="space-y-2">
                  {compliance.filter(c => c.status === 'current').map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{item.description}</div>
                        <div className="text-xs text-muted-foreground">{item.building}</div>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="h-4 w-4 text-green-600 inline" />
                        <div className="text-xs text-muted-foreground mt-1">
                          Next: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacilitiesDashboard;
