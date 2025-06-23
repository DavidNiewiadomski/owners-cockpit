
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Clock } from 'lucide-react';

interface WorkOrdersProps {
  projectId?: string;
}

const WorkOrders: React.FC<WorkOrdersProps> = ({ projectId }) => {
  const workOrders = [
    { id: 'WO-001', title: 'HVAC Filter Replacement', priority: 'high', dueDate: '2024-06-25' },
    { id: 'WO-002', title: 'Elevator Inspection', priority: 'medium', dueDate: '2024-06-28' },
    { id: 'WO-003', title: 'Light Fixture Repair', priority: 'low', dueDate: '2024-07-01' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Work Orders</h3>
      </div>
      
      <div className="space-y-3">
        {workOrders.map((wo) => (
          <div key={wo.id} className="border rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium">{wo.title}</span>
              <Badge variant={getPriorityColor(wo.priority)} className="text-xs">
                {wo.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{wo.id}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{wo.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WorkOrders;
