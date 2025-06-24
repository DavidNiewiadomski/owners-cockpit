
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
  const keyMetrics = [
    { 
      label: 'Budget', 
      value: `$${(projectData.totalBudget / 1000000).toFixed(1)}M`, 
      status: 'normal' 
    },
    { 
      label: 'Variance', 
      value: `${projectData.budgetVariance > 0 ? '+' : ''}${projectData.budgetVariance}%`, 
      status: Math.abs(projectData.budgetVariance) < 5 ? 'positive' : 'warning' 
    },
    { 
      label: 'Cash Flow', 
      value: `$${(projectData.cashFlow / 1000).toFixed(0)}K`, 
      status: projectData.cashFlow > 0 ? 'positive' : 'warning' 
    },
    { 
      label: 'Margin', 
      value: `${projectData.profitMargin}%`, 
      status: projectData.profitMargin > 15 ? 'positive' : 'normal' 
    }
  ];

  const insights = [
    `Budget variance of ${projectData.budgetVariance > 0 ? '+' : ''}${projectData.budgetVariance}% ${Math.abs(projectData.budgetVariance) < 5 ? 'within acceptable range' : 'requires attention'}`,
    `Monthly cash flow of $${(projectData.cashFlow / 1000).toFixed(0)}K indicates ${projectData.cashFlow > 0 ? 'healthy' : 'concerning'} liquidity position`,
    `Profit margin at ${projectData.profitMargin}% ${projectData.profitMargin > 15 ? 'exceeds' : 'meets'} target performance`,
    `${projectData.invoicesPending} pending invoices with ${projectData.paymentDelay} day average delay`
  ];

  const recommendations = [
    Math.abs(projectData.budgetVariance) > 5 ? 'Review budget controls and cost management processes' : 'Maintain current budget discipline',
    projectData.cashFlow < 0 ? 'Improve cash flow management and collection processes' : 'Continue strong cash flow management',
    projectData.invoicesPending > 15 ? 'Accelerate invoice processing and payment collection' : 'Maintain efficient payment processing',
    projectData.profitMargin < 15 ? 'Identify opportunities to improve project margins' : 'Sustain current profitability levels'
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Financial Insights
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
            <strong>{projectData.name}</strong> showing budget variance of{' '}
            <strong className={Math.abs(projectData.budgetVariance) < 5 ? 'text-green-600' : 'text-yellow-600'}>
              {projectData.budgetVariance > 0 ? '+' : ''}{projectData.budgetVariance}%
            </strong>{' '}
            with current spend at <strong>${(projectData.actualSpend / 1000000).toFixed(1)}M</strong> of{' '}
            <strong>${(projectData.totalBudget / 1000000).toFixed(1)}M</strong> budget. Monthly cash flow{' '}
            <strong className={projectData.cashFlow > 0 ? 'text-green-600' : 'text-red-600'}>
              ${(projectData.cashFlow / 1000).toFixed(0)}K
            </strong>{' '}
            with profit margin at <strong>{projectData.profitMargin}%</strong>.
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
