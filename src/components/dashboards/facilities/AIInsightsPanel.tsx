
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';
import { FacilitiesDashboardData } from '@/utils/facilitiesDemoData';

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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Facilities Insights
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
            {insights.summary}
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
              {insights.alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Badge variant="outline" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                    •
                  </Badge>
                  <span className="text-muted-foreground leading-relaxed">{alert.message}</span>
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
