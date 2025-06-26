
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
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Preconstruction Insights
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
            <strong>{projectData.name}</strong> preconstruction analysis shows{' '}
            <strong>{avgFeasibility}% average feasibility</strong>{' '}
            across {projectData.siteCount} evaluated sites. Development costs averaging{' '}
            <strong>${(projectData.averageCost / 1000).toFixed(0)}K</strong> with{' '}
            <strong>{projectData.averageTimeline}-month</strong> timeline projections.{' '}
            <strong>{projectData.permitComplexity.charAt(0).toUpperCase() + projectData.permitComplexity.slice(1)} permit complexity</strong>{' '}
            identified across portfolio.
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
