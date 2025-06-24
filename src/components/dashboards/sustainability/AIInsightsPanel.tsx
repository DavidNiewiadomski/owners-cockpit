
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    carbonFootprint: number;
    energyConsumption: number;
    wasteReduction: number;
    certificationProgress: number;
    esgScore: number;
    renewableEnergy: number;
    waterUsage: number;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const esgRating = projectData.esgScore > 80 ? 'excellent' : projectData.esgScore > 60 ? 'good' : 'needs improvement';
  const carbonStatus = projectData.carbonFootprint < 50 ? 'low' : projectData.carbonFootprint < 100 ? 'moderate' : 'high';
  const energyStatus = projectData.renewableEnergy > 70 ? 'excellent' : projectData.renewableEnergy > 40 ? 'good' : 'improving';
  
  const keyMetrics = [
    { label: 'ESG Score', value: `${projectData.esgScore}%`, status: esgRating === 'excellent' ? 'positive' : esgRating === 'good' ? 'normal' : 'warning' },
    { label: 'Carbon', value: `${projectData.carbonFootprint}T`, status: carbonStatus === 'low' ? 'positive' : carbonStatus === 'moderate' ? 'normal' : 'warning' },
    { label: 'Renewable', value: `${projectData.renewableEnergy}%`, status: energyStatus === 'excellent' ? 'positive' : 'normal' },
    { label: 'Waste Red.', value: `${projectData.wasteReduction}%`, status: projectData.wasteReduction > 30 ? 'positive' : 'normal' }
  ];

  const insights = [
    `ESG performance rated ${esgRating} with ${projectData.esgScore}% overall score`,
    `Carbon footprint at ${projectData.carbonFootprint} tons with ${carbonStatus} environmental impact`,
    `Renewable energy adoption at ${projectData.renewableEnergy}% showing ${energyStatus} progress`,
    `Waste reduction achieving ${projectData.wasteReduction}% improvement over baseline`
  ];

  const recommendations = [
    projectData.esgScore < 60 ? 'Accelerate ESG initiative implementation' : 'Maintain current ESG excellence',
    projectData.carbonFootprint > 100 ? 'Implement carbon reduction strategies' : 'Continue carbon footprint monitoring',
    projectData.renewableEnergy < 40 ? 'Increase renewable energy adoption' : 'Optimize renewable energy systems',
    projectData.wasteReduction < 30 ? 'Enhance waste reduction programs' : 'Expand successful waste management practices'
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Sustainability Insights
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
            <strong>{projectData.name}</strong> sustainability performance shows{' '}
            <strong className={esgRating === 'excellent' ? 'text-green-600' : esgRating === 'good' ? 'text-foreground' : 'text-yellow-600'}>
              {esgRating} ESG rating
            </strong>{' '}
            at {projectData.esgScore}% with{' '}
            <strong className={carbonStatus === 'low' ? 'text-green-600' : carbonStatus === 'moderate' ? 'text-foreground' : 'text-yellow-600'}>
              {projectData.carbonFootprint}T carbon footprint
            </strong>.{' '}
            Renewable energy at <strong>{projectData.renewableEnergy}%</strong> adoption with{' '}
            <strong className="text-green-600">{projectData.wasteReduction}% waste reduction</strong>{' '}
            demonstrating strong environmental commitment.
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
