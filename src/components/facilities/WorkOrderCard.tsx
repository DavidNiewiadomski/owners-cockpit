
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Wrench } from 'lucide-react';
import { WorkOrder } from '@/hooks/useFacilitiesData';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onView?: (workOrder: WorkOrder) => void;
  onUpdate?: (workOrder: WorkOrder) => void;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onView, onUpdate }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <CardTitle className="text-lg font-medium">{workOrder.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(workOrder.priority)} className="text-xs">
              {workOrder.priority}
            </Badge>
            <Badge variant="outline" className={getStatusColor(workOrder.status)}>
              {workOrder.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {workOrder.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {workOrder.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Type:</span>
            <span className="capitalize">{workOrder.work_type}</span>
          </div>
          
          {workOrder.assigned_to && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Assigned:</span>
              <span>{workOrder.assigned_to}</span>
            </div>
          )}
          
          {workOrder.due_date && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Due:</span>
              <span>{formatDate(workOrder.due_date)}</span>
            </div>
          )}
          
          {workOrder.estimated_hours && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Est. Hours:</span>
              <span>{workOrder.estimated_hours}h</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(workOrder)}>
              View Details
            </Button>
          )}
          {onUpdate && workOrder.status !== 'completed' && (
            <Button size="sm" onClick={() => onUpdate(workOrder)}>
              Update Status
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderCard;
