
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Clock } from 'lucide-react';
import { generateFacilitiesDemoData } from '@/utils/facilitiesDemoData';

interface WorkOrdersProps {
  projectId?: string;
}

const WorkOrders: React.FC<WorkOrdersProps> = ({ projectId }) => {
  const { workOrders } = generateFacilitiesDemoData();

  const recentWorkOrders = [
    { id: 'WO-001', title: 'HVAC Filter Replacement', priority: 'medium', dueDate: '2024-06-25', building: 'Plaza Tower A' },
    { id: 'WO-002', title: 'Elevator Inspection', priority: 'high', dueDate: '2024-06-28', building: 'Commerce Center B' },
    { id: 'WO-003', title: 'Light Fixture Repair', priority: 'low', dueDate: '2024-07-01', building: 'Executive Suites C' }
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
        <Badge variant="outline" className="ml-auto">{workOrders.open} Open</Badge>
      </div>
      
      <div className="space-y-3">
        {recentWorkOrders.map((wo) => (
          <div key={wo.id} className="border rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium">{wo.title}</span>
              <Badge variant={getPriorityColor(wo.priority)} className="text-xs">
                {wo.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{wo.building}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{wo.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-xs text-center">
        <div>
          <div className="font-semibold text-amber-600">{workOrders.inProgress}</div>
          <div className="text-muted-foreground">In Progress</div>
        </div>
        <div>
          <div className="font-semibold text-red-600">{workOrders.overdue}</div>
          <div className="text-muted-foreground">Overdue</div>
        </div>
      </div>
    </Card>
  );
};

export default WorkOrders;
