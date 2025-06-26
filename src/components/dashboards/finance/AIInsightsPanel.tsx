
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
    <Card className="bg-[#0D1117] border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Financial Insights
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${
                metric.status === 'positive' ? 'text-green-400' : 
                metric.status === 'warning' ? 'text-yellow-400' : 
                'text-white'
              }`}>
                {metric.value}
              </div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="bg-[#0D1117]/50 rounded-lg p-4">
          <p className="text-slate-300 text-sm">
            Financial performance for <strong>{projectData.name}</strong> shows 
            <strong>${(projectData.totalBudget / 1000000).toFixed(1)}M</strong> total budget with 
            <strong>${(projectData.actualSpend / 1000000).toFixed(1)}M</strong> spent. 
            Budget variance at <strong>{projectData.budgetVariance > 0 ? '+' : ''}{projectData.budgetVariance}%</strong> with 
            <strong>{projectData.profitMargin}%</strong> profit margin and 
            <strong>${(projectData.cashFlow / 1000).toFixed(0)}K</strong> monthly cash flow.
          </p>
        </div>

        {/* Key Insights and Recommendations */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-white">Key Insights</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {insights.slice(0, 3).map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-white">Recommendations</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
