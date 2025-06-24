
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    totalBudget: number;
    actualSpend: number;
    budgetVariance: number;
    cashFlow: number;
    profitMargin: number;
    invoicesPending: number;
    paymentDelay: number;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const budgetHealth = Math.abs(projectData.budgetVariance) < 5 ? 'on track' : projectData.budgetVariance > 5 ? 'over budget' : 'under budget';
  const cashFlowStatus = projectData.cashFlow > 0 ? 'positive' : 'negative';
  const profitabilityStatus = projectData.profitMargin > 15 ? 'excellent' : projectData.profitMargin > 10 ? 'good' : 'concerning';
  
  const keyMetrics = [
    { label: 'Budget Var.', value: `${projectData.budgetVariance > 0 ? '+' : ''}${projectData.budgetVariance}%`, status: Math.abs(projectData.budgetVariance) < 5 ? 'normal' : 'warning' },
    { label: 'Cash Flow', value: `$${(projectData.cashFlow / 1000).toFixed(0)}K`, status: projectData.cashFlow > 0 ? 'positive' : 'warning' },
    { label: 'Profit', value: `${projectData.profitMargin}%`, status: projectData.profitMargin > 15 ? 'positive' : projectData.profitMargin > 10 ? 'normal' : 'warning' },
    { label: 'Invoices', value: `${projectData.invoicesPending}`, status: projectData.invoicesPending > 20 ? 'warning' : 'normal' }
  ];

  const insights = [
    `Budget performance ${budgetHealth} with ${projectData.budgetVariance > 0 ? '+' : ''}${projectData.budgetVariance}% variance`,
    `Cash flow ${cashFlowStatus} at $${(projectData.cashFlow / 1000).toFixed(0)}K monthly position`,
    `Profitability ${profitabilityStatus} with ${projectData.profitMargin}% margin performance`,
    `${projectData.invoicesPending} pending invoices with ${projectData.paymentDelay}-day average collection`
  ];

  const recommendations = [
    Math.abs(projectData.budgetVariance) > 5 ? 'Implement budget control measures' : 'Maintain current budget discipline',
    projectData.cashFlow < 0 ? 'Focus on cash flow improvement strategies' : 'Optimize cash flow management',
    projectData.profitMargin < 10 ? 'Review cost structure and pricing strategy' : 'Maintain profitability focus',
    projectData.invoicesPending > 20 ? 'Accelerate accounts receivable collection' : 'Continue efficient billing process'
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Finance Insights
          <Badge variant="secondary" className="ml-auto text-xs">
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-lg font-semibold ${
                metric.status === 'positive' ? 'text-green-600' : 
                metric.status === 'warning' ? 'text-yellow-600' : 
                'text-foreground'
              }`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm leading-relaxed">
            <strong>{projectData.name}</strong> financial performance shows{' '}
            <strong className={budgetHealth === 'on track' ? 'text-green-600' : 'text-yellow-600'}>
              {budgetHealth} budget status
            </strong>{' '}
            with {projectData.budgetVariance > 0 ? '+' : ''}{projectData.budgetVariance}% variance.{' '}
            <strong className={cashFlowStatus === 'positive' ? 'text-green-600' : 'text-yellow-600'}>
              {cashFlowStatus.charAt(0).toUpperCase() + cashFlowStatus.slice(1)} cash flow
            </strong>{' '}
            at $${(projectData.cashFlow / 1000).toFixed(0)}K with{' '}
            <strong className={profitabilityStatus === 'excellent' ? 'text-green-600' : profitabilityStatus === 'good' ? 'text-foreground' : 'text-yellow-600'}>
              {projectData.profitMargin}% profit margin
            </strong>{' '}
            maintaining {profitabilityStatus} profitability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Key Insights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 text-blue-600" />
              Key Insights
            </div>
            <div className="space-y-2">
              {insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Badge variant="outline" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                    •
                  </Badge>
                  <span className="text-muted-foreground leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowRight className="h-4 w-4 text-green-600" />
              Recommendations
            </div>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Badge variant="secondary" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                    →
                  </Badge>
                  <span className="text-muted-foreground leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
