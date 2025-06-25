
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetKPIProps {
  projectId: string;
}

export function BudgetKPI({ projectId }: BudgetKPIProps) {
  // Mock data - in real app would fetch from API based on project
  const getBudgetData = () => {
    const budgetData: Record<string, any> = {
      '11111111-1111-1111-1111-111111111111': {
        total: 45000000,
        spent: 32750000,
        remaining: 12250000,
        variance: -3.2,
        categories: [
          { name: 'MEP Systems', budgeted: 12500000, spent: 11200000 },
          { name: 'Medical Equipment', budgeted: 15000000, spent: 8750000 },
          { name: 'Structural', budgeted: 8750000, spent: 8650000 },
          { name: 'Site Work', budgeted: 2500000, spent: 2385000 }
        ],
        monthlyBurn: 2800000,
        projectedOverrun: 1450000
      },
      '22222222-2222-2222-2222-222222222222': {
        total: 28500000,
        spent: 9550000,
        remaining: 18950000,
        variance: 2.1,
        categories: [
          { name: 'Building Structure', budgeted: 7200000, spent: 3850000 },
          { name: 'Smart Building Systems', budgeted: 2800000, spent: 750000 },
          { name: 'Site Development', budgeted: 1800000, spent: 950000 }
        ],
        monthlyBurn: 2100000,
        projectedOverrun: 0
      },
      'portfolio': {
        total: 139200000,
        spent: 89850000,
        remaining: 49350000,
        variance: -1.8,
        categories: [
          { name: 'Construction', budgeted: 85000000, spent: 62500000 },
          { name: 'Equipment', budgeted: 32000000, spent: 18200000 },
          { name: 'Professional Services', budgeted: 15000000, spent: 6800000 },
          { name: 'Permits & Fees', budgeted: 7200000, spent: 2350000 }
        ],
        monthlyBurn: 8500000,
        projectedOverrun: 2500000
      }
    };
    
    return budgetData[projectId] || budgetData.portfolio;
  };

  const budgetData = getBudgetData();

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
