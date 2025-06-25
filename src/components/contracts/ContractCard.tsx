
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Building, AlertTriangle, CheckCircle, Clock, Users, FileText } from 'lucide-react';
import type { Contract, ContractStatus, RiskLevel } from '@/types/contracts';
import { format } from 'date-fns';

interface ContractCardProps {
  contract: Contract;
  onSelect: (contract: Contract) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({ contract, onSelect }) => {
  const getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'negotiation':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'pending_signature':
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: ContractStatus) => {
    switch (status) {
      case 'executed':
        return 'default';
      case 'under_review':
        return 'secondary';
      case 'negotiation':
        return 'outline';
      case 'pending_signature':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRiskVariant = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatContractType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDaysUntilExpiry = () => {
    if (!contract.end_date) return null;
    const endDate = new Date(contract.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(contract)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{contract.title}</h3>
              <Badge variant={getStatusVariant(contract.status)} className="flex items-center gap-1">
                {getStatusIcon(contract.status)}
                {contract.status.replace('_', ' ')}
              </Badge>
              {contract.risk_level && (
                <Badge variant={getRiskVariant(contract.risk_level)} className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {contract.risk_level} risk
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{contract.counterparty}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{formatContractType(contract.type)}</span>
              </div>
              {contract.value && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(contract.value, contract.currency)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {contract.start_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Start: {format(new Date(contract.start_date), 'MMM dd, yyyy')}</span>
                </div>
              )}
              {contract.end_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>End: {format(new Date(contract.end_date), 'MMM dd, yyyy')}</span>
                </div>
              )}
              {daysUntilExpiry !== null && daysUntilExpiry <= 60 && (
                <div className={`flex items-center gap-1 ${daysUntilExpiry <= 30 ? 'text-red-600' : 'text-yellow-600'}`}>
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    {daysUntilExpiry > 0 ? `Expires in ${daysUntilExpiry} days` : 'Expired'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {contract.ai_risk_score && (
              <div className="text-right">
                <div className="text-sm font-medium">AI Risk Score</div>
                <div className={`text-lg font-bold ${
                  contract.ai_risk_score < 30 ? 'text-green-600' : 
                  contract.ai_risk_score < 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {contract.ai_risk_score}%
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              onSelect(contract);
            }}>
              Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
