
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Wrench, Zap } from 'lucide-react';
import type { BuildingSystem } from '@/hooks/useFacilitiesData';

interface SystemStatusCardProps {
  system: BuildingSystem;
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ system }) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-yellow-600" />;
      case 'offline':
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{system.system_name}</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(system.status)}
            <Badge variant="outline" className={getStatusColor(system.status)}>
              {system.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {system.uptime_percentage !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Uptime</span>
              <span>{system.uptime_percentage}%</span>
            </div>
            <Progress value={system.uptime_percentage} className="h-2" />
          </div>
        )}

        {system.efficiency_rating !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Efficiency</span>
              <span>{system.efficiency_rating}%</span>
            </div>
            <Progress value={system.efficiency_rating} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Last Maintenance</span>
            <p className="font-medium">{formatDate(system.last_maintenance)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Next Maintenance</span>
            <p className="font-medium">{formatDate(system.next_maintenance)}</p>
          </div>
        </div>

        {system.energy_consumption !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-600" />
              <span className="text-muted-foreground">Energy Usage</span>
            </div>
            <span className="font-medium">{system.energy_consumption} kWh</span>
          </div>
        )}

        {system.alerts_count !== undefined && system.alerts_count > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-red-600" />
              <span className="text-muted-foreground">Active Alerts</span>
            </div>
            <Badge variant="destructive" className="text-xs">
              {system.alerts_count}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusCard;
