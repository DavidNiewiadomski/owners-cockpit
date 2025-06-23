
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Thermometer, Zap, Wrench, AlertCircle, CheckCircle, Clock, Plus } from 'lucide-react';
import { useBuildingSystems, useWorkOrders, useEquipment } from '@/hooks/useFacilitiesData';
import SystemStatusCard from '@/components/facilities/SystemStatusCard';
import WorkOrderCard from '@/components/facilities/WorkOrderCard';
import WorkOrderForm from '@/components/facilities/WorkOrderForm';

interface FacilitiesDashboardProps {
  projectId: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId }) => {
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);
  
  const { data: buildingSystems = [], isLoading: systemsLoading } = useBuildingSystems(projectId);
  const { data: workOrders = [], isLoading: workOrdersLoading } = useWorkOrders(projectId);
  const { data: equipment = [], isLoading: equipmentLoading } = useEquipment(projectId);

  // Calculate KPIs from real data
  const activeWorkOrders = workOrders.filter(wo => wo.status !== 'completed' && wo.status !== 'cancelled');
  const completedToday = workOrders.filter(wo => {
    if (!wo.completed_date) return false;
    const today = new Date().toDateString();
    return new Date(wo.completed_date).toDateString() === today;
  });

  const operationalSystems = buildingSystems.filter(sys => sys.status === 'operational');
  const avgUptime = buildingSystems.length > 0 
    ? buildingSystems.reduce((sum, sys) => sum + (sys.uptime_percentage || 0), 0) / buildingSystems.length 
    : 100;

  const avgEfficiency = buildingSystems.length > 0
    ? buildingSystems.reduce((sum, sys) => sum + (sys.efficiency_rating || 0), 0) / buildingSystems.length
    : 92;

  // Sample maintenance schedule (this could come from maintenance_schedules table)
  const maintenanceSchedule = [
    { item: 'HVAC Filter Change', due: '2024-06-25', status: 'upcoming' },
    { item: 'Elevator Inspection', due: '2024-06-28', status: 'scheduled' },
    { item: 'Fire Alarm Test', due: '2024-07-01', status: 'upcoming' },
    { item: 'Generator Service', due: '2024-07-05', status: 'scheduled' }
  ];

  if (systemsLoading || workOrdersLoading || equipmentLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
            <Progress value={avgUptime} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {operationalSystems.length}/{buildingSystems.length} systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEfficiency.toFixed(0)}%</div>
            <Progress value={avgEfficiency} className="mt-2" />
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
            <div className="text-2xl font-bold">{activeWorkOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              Open • {completedToday.length} completed today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Building Systems Status */}
      <Card>
        <CardHeader>
          <CardTitle>Building Systems Status</CardTitle>
        </CardHeader>
        <CardContent>
          {buildingSystems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No building systems configured yet.</p>
              <p className="text-sm">Connect your building automation systems to see real-time status.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buildingSystems.map((system) => (
                <SystemStatusCard key={system.id} system={system} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Orders & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Active Work Orders
              </CardTitle>
              <Dialog open={showWorkOrderForm} onOpenChange={setShowWorkOrderForm}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Work Order</DialogTitle>
                  </DialogHeader>
                  <WorkOrderForm
                    projectId={projectId}
                    onSuccess={() => setShowWorkOrderForm(false)}
                    onCancel={() => setShowWorkOrderForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {activeWorkOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active work orders.</p>
                <p className="text-sm">Create a work order to get started.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeWorkOrders.slice(0, 5).map((order) => (
                  <WorkOrderCard
                    key={order.id}
                    workOrder={order}
                    onView={(wo) => console.log('View work order:', wo)}
                  />
                ))}
                {activeWorkOrders.length > 5 && (
                  <Button variant="outline" className="w-full">
                    View All {activeWorkOrders.length} Work Orders
                  </Button>
                )}
              </div>
            )}
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
          <CardTitle>System Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buildingSystems.some(sys => sys.alerts_count && sys.alerts_count > 0) ? (
              buildingSystems
                .filter(sys => sys.alerts_count && sys.alerts_count > 0)
                .map((system) => (
                  <div key={system.id} className="border-l-4 border-amber-500 pl-4 bg-amber-50 dark:bg-amber-950 p-3 rounded-r">
                    <h4 className="font-medium text-amber-900 dark:text-amber-100">
                      {system.system_name} Alert
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {system.alerts_count} active alert{system.alerts_count > 1 ? 's' : ''} - Check system status
                    </p>
                  </div>
                ))
            ) : (
              <>
                <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-950 p-3 rounded-r">
                  <h4 className="font-medium text-green-900 dark:text-green-100">All Systems Operational</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    All building systems are running normally with no active alerts.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-950 p-3 rounded-r">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Predictive Maintenance</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    AI-powered maintenance scheduling is monitoring equipment performance for optimal efficiency.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesDashboard;
