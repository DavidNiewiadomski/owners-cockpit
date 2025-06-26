
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';
import type { FacilitiesDashboardData } from '@/utils/facilitiesDemoData';

interface AIInsightsPanelProps {
  projectData: FacilitiesDashboardData;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const { portfolioSummary, workOrders, energy, insights } = projectData;
  
  const keyMetrics = [
    { 
      label: 'Occupancy', 
      value: `${portfolioSummary.overallOccupancy}%`, 
      status: portfolioSummary.overallOccupancy > 90 ? 'positive' : 'normal' 
    },
    { 
      label: 'Open WOs', 
      value: workOrders.open, 
      status: workOrders.open < 5 ? 'positive' : workOrders.open < 10 ? 'normal' : 'warning' 
    },
    { 
      label: 'Energy Cost', 
      value: `$${(portfolioSummary.energyCostThisMonth / 1000).toFixed(0)}K`, 
      status: energy.electricity.percentChange < 0 ? 'positive' : 'normal' 
    },
    { 
      label: 'Uptime', 
      value: `${Math.round(98.5)}%`, 
      status: 'positive' 
    }
  ];

  const recommendations = [
    workOrders.overdue > 0 ? `Address ${workOrders.overdue} overdue work orders immediately` : 'Maintain current work order response times',
    Math.abs(energy.electricity.percentChange) > 10 ? `Investigate ${Math.abs(energy.electricity.percentChange).toFixed(1)}% energy usage change` : 'Continue energy efficiency initiatives',
    portfolioSummary.overallOccupancy < 90 ? 'Focus on lease renewals and tenant retention' : 'Maintain high occupancy levels',
    portfolioSummary.complianceIssues > 0 ? `Address ${portfolioSummary.complianceIssues} compliance items` : 'Maintain compliance standards'
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Facilities Insights
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-4 text-center">
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
        <div className="bg-slate-800/50 rounded-lg p-4">
          <p className="text-slate-300 text-sm">
            {insights.summary}
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
              {insights.alerts.slice(0, 3).map((alert, index) => (
                <li key={index}>• {alert.message}</li>
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
