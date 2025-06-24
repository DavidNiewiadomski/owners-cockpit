
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    openWorkOrders: number;
    avgResolutionTime: number;
    energyEfficiency: number;
    maintenanceCosts: number;
    facilityHealth: number;
    criticalSystems: number;
    uptime: number;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const healthStatus = projectData.facilityHealth > 85 ? 'excellent' : projectData.facilityHealth > 70 ? 'good' : 'needs attention';
  const energyStatus = projectData.energyEfficiency > 80 ? 'efficient' : projectData.energyEfficiency > 60 ? 'moderate' : 'inefficient';
  const uptimeStatus = projectData.uptime > 98 ? 'excellent' : projectData.uptime > 95 ? 'good' : 'concerning';
  
  const keyMetrics = [
    { label: 'Health', value: `${projectData.facilityHealth}%`, status: healthStatus === 'excellent' ? 'positive' : healthStatus === 'good' ? 'normal' : 'warning' },
    { label: 'Uptime', value: `${projectData.uptime}%`, status: uptimeStatus === 'excellent' ? 'positive' : uptimeStatus === 'good' ? 'normal' : 'warning' },
    { label: 'Energy', value: `${projectData.energyEfficiency}%`, status: energyStatus === 'efficient' ? 'positive' : 'normal' },
    { label: 'Work Orders', value: `${projectData.openWorkOrders}`, status: projectData.openWorkOrders > 20 ? 'warning' : 'normal' }
  ];

  const insights = [
    `Facility health at ${projectData.facilityHealth}% with ${healthStatus} operational status`,
    `${projectData.openWorkOrders} open work orders with ${projectData.avgResolutionTime}-hour average resolution`,
    `Energy efficiency rated ${energyStatus} at ${projectData.energyEfficiency}% performance`,
    `System uptime maintaining ${uptimeStatus} levels at ${projectData.uptime}%`
  ];

  const recommendations = [
    projectData.facilityHealth < 70 ? 'Implement preventive maintenance program' : 'Continue current maintenance schedule',
    projectData.openWorkOrders > 20 ? 'Prioritize work order backlog reduction' : 'Maintain current work order response time',
    projectData.energyEfficiency < 60 ? 'Investigate energy optimization opportunities' : 'Monitor energy performance trends',
    projectData.uptime < 95 ? 'Review critical system redundancy' : 'Maintain current uptime excellence'
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
            <strong>{projectData.name}</strong> facilities operations show{' '}
            <strong className={healthStatus === 'excellent' ? 'text-green-600' : healthStatus === 'good' ? 'text-foreground' : 'text-yellow-600'}>
              {healthStatus} facility health
            </strong>{' '}
            at {projectData.facilityHealth}% with{' '}
            <strong className={uptimeStatus === 'excellent' ? 'text-green-600' : 'text-foreground'}>
              {projectData.uptime}% uptime
            </strong>.{' '}
            Energy efficiency at <strong>{projectData.energyEfficiency}%</strong> with{' '}
            <strong className={projectData.openWorkOrders > 20 ? 'text-yellow-600' : 'text-green-600'}>
              {projectData.openWorkOrders} open work orders
            </strong>{' '}
            averaging {projectData.avgResolutionTime}-hour resolution.
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
