
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wrench, Zap, Thermometer, Settings } from 'lucide-react';
import SystemStatusCard from '@/components/facilities/SystemStatusCard';
import WorkOrderCard from '@/components/facilities/WorkOrderCard';
import WorkOrderForm from '@/components/facilities/WorkOrderForm';
import { BuildingSystem, WorkOrder } from '@/hooks/useFacilitiesData';

interface FacilitiesDashboardProps {
  projectId: string;
}

const FacilitiesDashboard: React.FC<FacilitiesDashboardProps> = ({ projectId }) => {
  const systemsData: BuildingSystem[] = [
    { 
      id: 'sys-1',
      project_id: projectId,
      system_name: 'HVAC System A', 
      system_type: 'HVAC',
      status: 'operational', 
      efficiency_rating: 94, 
      last_maintenance: '2024-05-15',
      uptime_percentage: 98,
      energy_consumption: 150,
      alerts_count: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    { 
      id: 'sys-2',
      project_id: projectId,
      system_name: 'Electrical Grid', 
      system_type: 'Electrical',
      status: 'operational', 
      efficiency_rating: 98, 
      last_maintenance: '2024-06-01',
      uptime_percentage: 99,
      energy_consumption: 200,
      alerts_count: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    { 
      id: 'sys-3',
      project_id: projectId,
      system_name: 'Fire Safety', 
      system_type: 'Safety',
      status: 'maintenance', 
      efficiency_rating: 87, 
      last_maintenance: '2024-04-20',
      uptime_percentage: 95,
      energy_consumption: 50,
      alerts_count: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    { 
      id: 'sys-4',
      project_id: projectId,
      system_name: 'Security System', 
      system_type: 'Security',
      status: 'operational', 
      efficiency_rating: 96, 
      last_maintenance: '2024-05-28',
      uptime_percentage: 97,
      energy_consumption: 75,
      alerts_count: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  const workOrders: WorkOrder[] = [
    { 
      id: 'WO-001', 
      project_id: projectId,
      title: 'HVAC Filter Replacement', 
      work_type: 'maintenance',
      priority: 'medium', 
      status: 'in_progress', 
      assigned_to: 'John Smith',
      description: 'Replace HVAC filters',
      estimated_hours: 4,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    { 
      id: 'WO-002', 
      project_id: projectId,
      title: 'Elevator Inspection', 
      work_type: 'inspection',
      priority: 'high', 
      status: 'assigned', 
      assigned_to: 'Mike Johnson',
      description: 'Annual elevator safety inspection',
      estimated_hours: 8,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    { 
      id: 'WO-003', 
      project_id: projectId,
      title: 'Parking Lot Lighting', 
      work_type: 'repair',
      priority: 'low', 
      status: 'completed', 
      assigned_to: 'Sarah Davis',
      description: 'Fix broken parking lot lights',
      estimated_hours: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
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
