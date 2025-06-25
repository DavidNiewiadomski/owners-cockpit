
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsProps {
  projectId: string;
}

export function AIInsights({ projectId }: AIInsightsProps) {
  // Get project-specific insights
  const getInsights = () => {
    const insightData: Record<string, any> = {
      '11111111-1111-1111-1111-111111111111': {
        summary: 'Medical Center construction shows MEP installation 12 days behind critical path, but medical equipment coordination offers parallel installation opportunity. Fire safety systems performing exceptionally with zero rework. Overall project health strong with 3.2% budget variance and excellent safety record.',
        keyFindings: [
          'MEP rough-in behind schedule by 12 days on critical path',
          'Medical equipment delivery optimization potential identified', 
          'Fire safety installation ahead of schedule with zero defects',
          'Overall budget variance at 3.2% over planned costs'
        ],
        recommendations: [
          'Add weekend MEP crew and coordinate equipment vendor parallel work',
          'Implement consolidated equipment deliveries for 15% cost savings',
          'Document fire safety best practices for future projects',
          'Continue current cost control measures and monitor equipment spending'
        ]
      },
      '22222222-2222-2222-2222-222222222222': {
        summary: 'Corporate Campus steel erection affected by extended weather forecast showing 8 days of adverse conditions. Smart building systems installation progressing 15% ahead of schedule. Energy efficiency design targets being exceeded, positioning for additional LEED points.',
        keyFindings: [
          'Weather impact threatens steel erection schedule by 2 weeks',
          'Smart building IoT infrastructure 15% ahead of timeline',
          'Energy efficiency design exceeding LEED Gold targets',
          'Site preparation completed under budget with quality performance'
        ],
        recommendations: [
          'Implement weather protection or accelerate indoor preparation tasks',
          'Leverage early IoT completion for extended testing and optimization',
          'Document energy efficiency achievements for LEED Platinum consideration',
          'Apply site preparation lessons learned to future campus phases'
        ]
      },
      'portfolio': {
        summary: 'Portfolio-wide analysis identifies cross-project resource optimization opportunities and material cost trend concerns. Energy efficiency targets exceeded by 18% across all projects. Steel price increases of 12% expected next quarter requiring procurement acceleration.',
        keyFindings: [
          'Cross-project equipment sharing could reduce costs by $125K quarterly',
          'Steel price increases of 12% forecasted for next quarter',
          'Portfolio energy efficiency exceeding targets by 18%',
          'Specialized labor resources optimizable across 3 active projects'
        ],
        recommendations: [
          'Implement coordinated resource scheduling across portfolio',
          'Accelerate Q2 steel procurement to lock current pricing',
          'Document sustainability practices for enhanced bidding position',
          'Establish cross-project labor pool for specialized trades'
        ]
      }
    };
    
    return insightData[projectId] || insightData.portfolio;
  };

  const getMetrics = () => {
    const metricsData: Record<string, any[]> = {
      '11111111-1111-1111-1111-111111111111': [
        { label: 'Progress', value: '68%', status: 'normal' },
        { label: 'Budget', value: '103.2%', status: 'warning' },
        { label: 'ROI', value: '16.8%', status: 'positive' },
        { label: 'Risk', value: 'Medium', status: 'warning' }
      ],
      '22222222-2222-2222-2222-222222222222': [
        { label: 'Progress', value: '32%', status: 'normal' },
        { label: 'Budget', value: '98.9%', status: 'positive' },
        { label: 'ROI', value: '14.2%', status: 'positive' },
        { label: 'Risk', value: 'High', status: 'warning' }
      ],
      'portfolio': [
        { label: 'Progress', value: '52%', status: 'normal' },
        { label: 'Budget', value: '101.8%', status: 'warning' },
        { label: 'ROI', value: '15.3%', status: 'positive' },
        { label: 'Risk', value: 'Medium', status: 'normal' }
      ]
    };
    
    return metricsData[projectId] || metricsData.portfolio;
  };

  const insights = getInsights();
  const keyMetrics = getMetrics();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Project Insights
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
              {insights.keyFindings.slice(0, 3).map((insight, index) => (
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
              {insights.recommendations.slice(0, 3).map((rec, index) => (
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

export default AIInsights;
