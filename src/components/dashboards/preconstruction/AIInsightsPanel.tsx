
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    siteCount: number;
    averageScore: number;
    feasibilityScores: number[];
    averageCost: number;
    averageTimeline: number;
    riskFactors: string[];
    permitComplexity: string;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const avgFeasibility = projectData.averageScore;
  const costEfficiency = projectData.averageCost < 500000 ? 'excellent' : projectData.averageCost < 800000 ? 'good' : 'moderate';
  const timelineEfficiency = projectData.averageTimeline < 18 ? 'fast' : projectData.averageTimeline < 24 ? 'standard' : 'extended';
  
  const keyMetrics = [
    { label: 'Sites', value: `${projectData.siteCount}`, status: 'normal' },
    { label: 'Avg Score', value: `${avgFeasibility}%`, status: avgFeasibility > 80 ? 'positive' : avgFeasibility > 60 ? 'normal' : 'warning' },
    { label: 'Avg Cost', value: `$${(projectData.averageCost / 1000).toFixed(0)}K`, status: costEfficiency === 'excellent' ? 'positive' : 'normal' },
    { label: 'Timeline', value: `${projectData.averageTimeline}mo`, status: timelineEfficiency === 'fast' ? 'positive' : 'normal' }
  ];

  const insights = [
    `${projectData.siteCount} sites analyzed with average feasibility score of ${avgFeasibility}%`,
    `Cost efficiency rated as ${costEfficiency} with average development cost of $${(projectData.averageCost / 1000).toFixed(0)}K`,
    `Timeline projection shows ${timelineEfficiency} development at ${projectData.averageTimeline} months average`,
    `Permit complexity assessed as ${projectData.permitComplexity} across analyzed sites`
  ];

  const recommendations = [
    avgFeasibility < 70 ? 'Review site selection criteria for better feasibility scores' : 'Maintain current site evaluation standards',
    projectData.averageCost > 800000 ? 'Explore cost optimization opportunities' : 'Continue cost-effective development approach',
    projectData.averageTimeline > 24 ? 'Implement timeline acceleration strategies' : 'Maintain current development pace',
    projectData.permitComplexity === 'high' ? 'Engage permit consultants early in process' : 'Continue standard permit approach'
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Preconstruction Insights
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
            <strong>{projectData.name}</strong> preconstruction analysis shows{' '}
            <strong className={avgFeasibility > 80 ? 'text-green-600' : avgFeasibility > 60 ? 'text-foreground' : 'text-yellow-600'}>
              {avgFeasibility}% average feasibility
            </strong>{' '}
            across {projectData.siteCount} evaluated sites. Development costs averaging{' '}
            <strong>${(projectData.averageCost / 1000).toFixed(0)}K</strong> with{' '}
            <strong>{projectData.averageTimeline}-month</strong> timeline projections.{' '}
            <strong className={projectData.permitComplexity === 'high' ? 'text-yellow-600' : 'text-green-600'}>
              {projectData.permitComplexity.charAt(0).toUpperCase() + projectData.permitComplexity.slice(1)} permit complexity
            </strong>{' '}
            identified across portfolio.
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
