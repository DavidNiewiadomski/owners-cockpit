
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetKPIProps {
  projectId: string;
}

export function BudgetKPI({ projectId: _projectId }: BudgetKPIProps) {
  // Mock data - in real app would fetch from API
  const budgetData = {
    total: 2500000,
    spent: 1875000,
    remaining: 625000,
    variance: -5.2
  };

  const spentPercentage = (budgetData.spent / budgetData.total) * 100;
  const isOverBudget = budgetData.variance < 0;

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Budget Status</h3>
        <div className={`flex items-center gap-1 text-xs ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
          {isOverBudget ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          {Math.abs(budgetData.variance)}%
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Spent</span>
            <span>${(budgetData.spent / 1000000).toFixed(1)}M</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${spentPercentage > 90 ? 'bg-red-500' : spentPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Total Budget</span>
            <div className="font-medium">${(budgetData.total / 1000000).toFixed(1)}M</div>
          </div>
          <div>
            <span className="text-muted-foreground">Remaining</span>
            <div className="font-medium">${(budgetData.remaining / 1000000).toFixed(1)}M</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetKPI;
