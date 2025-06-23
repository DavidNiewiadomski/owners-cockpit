
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';

interface ContractRenewalsProps {
  projectId?: string;
}

const ContractRenewals: React.FC<ContractRenewalsProps> = ({ projectId }) => {
  const contracts = [
    { id: 'C-001', vendor: 'Security Services Inc', expiryDate: '2024-07-15', value: 45000, status: 'expiring' },
    { id: 'C-002', vendor: 'Cleaning Solutions LLC', expiryDate: '2024-08-30', value: 24000, status: 'upcoming' },
    { id: 'C-003', vendor: 'Landscaping Pro', expiryDate: '2024-09-12', value: 18000, status: 'upcoming' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expiring': return 'destructive';
      case 'upcoming': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Contract Renewals</h3>
      </div>
      
      <div className="space-y-3">
        {contracts.map((contract) => (
          <div key={contract.id} className="border rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium">{contract.vendor}</span>
              <Badge variant={getStatusColor(contract.status)} className="text-xs">
                {contract.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{contract.expiryDate}</span>
              </div>
              <span>${contract.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ContractRenewals;
