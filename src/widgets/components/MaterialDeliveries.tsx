
import React from 'react';
import { Card } from '@/components/ui/card';
import { Truck } from 'lucide-react';

interface MaterialDeliveriesProps {
  projectId?: string;
}

const MaterialDeliveries: React.FC<MaterialDeliveriesProps> = ({ projectId }) => {
  const deliveries = [
    { item: 'Steel Beams', scheduled: '2024-06-25', status: 'on-time' },
    { item: 'Concrete Mix', scheduled: '2024-06-26', status: 'delayed' },
    { item: 'Electrical Panels', scheduled: '2024-06-28', status: 'on-time' }
  ];

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-4 h-4 text-green-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Material Deliveries</h3>
      </div>
      
      <div className="space-y-2">
        {deliveries.map((delivery, index) => (
          <div key={index} className="flex justify-between items-center text-xs">
            <span className="font-medium">{delivery.item}</span>
            <span className={`px-2 py-1 rounded ${
              delivery.status === 'on-time' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {delivery.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export { MaterialDeliveries };
