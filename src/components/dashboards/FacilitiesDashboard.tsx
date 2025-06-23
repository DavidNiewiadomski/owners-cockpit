
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Thermometer, Zap, Wrench, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface FacilitiesDashboardProps {
  projectId: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId }) => {
  const buildingMetrics = {
    energyEfficiency: 92,
    systemUptime: 99.2,
    openWorkOrders: 7,
    completedToday: 12,
    nextMaintenance: '3 days',
    occupancySatisfaction: 4.2
  };

  const systemStatus = [
    { system: 'HVAC Zone A', status: 'operational', temp: 72, target: 72 },
    { system: 'HVAC Zone B', status: 'maintenance', temp: 75, target: 72 },
    { system: 'Elevator Bank 1', status: 'operational', uptime: 100 },
    { system: 'Elevator Bank 2', status: 'operational', uptime: 98 },
    { system: 'Fire Safety', status: 'operational', lastTest: '2 weeks ago' },
    { system: 'Security System', status: 'operational', uptime: 100 }
  ];

  const workOrders = [
    { id: 'WO-001', type: 'HVAC', priority: 'High', description: 'Zone B temperature control issue', assignee: 'Tech A' },
    { id: 'WO-002', type: 'Electrical', priority: 'Medium', description: 'Lobby lighting flickering', assignee: 'Tech B' },
    { id: 'WO-003', type: 'Plumbing', priority: 'Low', description: 'Restroom faucet replacement', assignee: 'Tech C' }
  ];

  const maintenanceSchedule = [
    { item: 'HVAC Filter Change', due: '2024-06-25', status: 'upcoming' },
    { item: 'Elevator Inspection', due: '2024-06-28', status: 'scheduled' },
    { item: 'Fire Alarm Test', due: '2024-07-01', status: 'upcoming' },
    { item: 'Generator Service', due: '2024-07-05', status: 'scheduled' }
  ];

  return (
    <div className="space-y-6">
      {/* Building Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildingMetrics.systemUptime}%</div>
            <Progress value={buildingMetrics.systemUptime} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Critical systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildingMetrics.energyEfficiency}%</div>
            <Progress value={buildingMetrics.energyEfficiency} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              vs. building baseline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildingMetrics.openWorkOrders}</div>
            <p className="text-xs text-muted-foreground">
              Open • {buildingMetrics.completedToday} completed today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Building Systems Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.map((system, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{system.system}</h4>
                  <Badge 
                    variant={system.status === 'operational' ? 'default' : 'destructive'}
                    className={system.status === 'operational' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {system.status}
                  </Badge>
                </div>
                {'temp' in system && (
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="h-4 w-4" />
                    <span>{system.temp}°F (Target: {system.target}°F)</span>
                  </div>
                )}
                {'uptime' in system && (
                  <div className="text-sm text-muted-foreground">
                    Uptime: {system.uptime}%
                  </div>
                )}
                {'lastTest' in system && (
                  <div className="text-sm text-muted-foreground">
                    Last test: {system.lastTest}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Orders & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Active Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge 
                        variant={order.priority === 'High' ? 'destructive' : order.priority === 'Medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{order.description}</p>
                    <p className="text-xs text-muted-foreground">Assigned to: {order.assignee}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              Create Work Order
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Maintenance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceSchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium text-sm">{item.item}</h4>
                    <p className="text-sm text-muted-foreground">Due: {item.due}</p>
                  </div>
                  <Badge variant={item.status === 'upcoming' ? 'secondary' : 'default'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Building Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4 bg-amber-50 dark:bg-amber-950 p-3 rounded-r">
              <h4 className="font-medium text-amber-900 dark:text-amber-100">Temperature Alert</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">HVAC Zone B running 3°F above target. Maintenance scheduled.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-950 p-3 rounded-r">
              <h4 className="font-medium text-green-900 dark:text-green-100">Energy Optimization</h4>
              <p className="text-sm text-green-800 dark:text-green-200">Building consuming 12% less energy than projected for this period.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-950 p-3 rounded-r">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Preventive Maintenance</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">HVAC filter change due in 3 days. Parts inventory confirmed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesDashboard;
