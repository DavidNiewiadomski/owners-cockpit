
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wrench, Zap, Thermometer, Settings } from 'lucide-react';
import SystemStatusCard from '@/components/facilities/SystemStatusCard';
import WorkOrderCard from '@/components/facilities/WorkOrderCard';
import WorkOrderForm from '@/components/facilities/WorkOrderForm';

interface FacilitiesDashboardProps {
  projectId: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId }) => {
  const systemsData = [
    { name: 'HVAC System A', status: 'operational', efficiency: 94, lastMaintenance: '2024-05-15' },
    { name: 'Electrical Grid', status: 'operational', efficiency: 98, lastMaintenance: '2024-06-01' },
    { name: 'Fire Safety', status: 'warning', efficiency: 87, lastMaintenance: '2024-04-20' },
    { name: 'Security System', status: 'operational', efficiency: 96, lastMaintenance: '2024-05-28' }
  ];

  const workOrders = [
    { id: 'WO-001', title: 'HVAC Filter Replacement', priority: 'Medium', status: 'In Progress', assignee: 'John Smith' },
    { id: 'WO-002', title: 'Elevator Inspection', priority: 'High', status: 'Pending', assignee: 'Mike Johnson' },
    { id: 'WO-003', title: 'Parking Lot Lighting', priority: 'Low', status: 'Completed', assignee: 'Sarah Davis' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights - moved to top */}
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
              <Badge variant="destructive">High Priority</Badge>
              <div>
                <h4 className="font-medium">Fire Safety System Alert</h4>
                <p className="text-sm text-muted-foreground">Fire suppression system efficiency at 87%. Schedule maintenance within 48 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Medium Priority</Badge>
              <div>
                <h4 className="font-medium">Energy Optimization</h4>
                <p className="text-sm text-muted-foreground">HVAC runtime can be optimized during off-peak hours. Potential 12% energy savings.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">Success</Badge>
              <div>
                <h4 className="font-medium">Preventive Maintenance</h4>
                <p className="text-sm text-muted-foreground">All critical systems maintained on schedule. 98% uptime achieved this quarter.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <p className="text-xs text-muted-foreground">
              Above 95% target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Optimal performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              2 high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature Control</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72°F</div>
            <p className="text-xs text-muted-foreground">
              Optimal comfort zone
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemsData.map((system, index) => (
              <SystemStatusCard key={index} system={system} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workOrders.map((order, index) => (
              <WorkOrderCard key={index} workOrder={order} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Work Order Form */}
      <WorkOrderForm projectId={projectId} />
    </div>
  );
};

export default FacilitiesDashboard;
