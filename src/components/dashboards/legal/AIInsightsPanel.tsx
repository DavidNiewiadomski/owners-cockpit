
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    activeContracts: number;
    pendingReviews: number;
    complianceScore: number;
    riskLevel: string;
    renewalsNextQuarter: number;
    disputesOpen: number;
    avgReviewTime: number;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const complianceStatus = projectData.complianceScore > 90 ? 'excellent' : projectData.complianceScore > 80 ? 'good' : 'needs attention';
  const riskColor = projectData.riskLevel === 'low' ? 'text-green-600' : projectData.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600';
  const reviewEfficiency = projectData.avgReviewTime < 5 ? 'fast' : projectData.avgReviewTime < 10 ? 'standard' : 'slow';
  
  const keyMetrics = [
    { label: 'Compliance', value: `${projectData.complianceScore}%`, status: complianceStatus === 'excellent' ? 'positive' : complianceStatus === 'good' ? 'normal' : 'warning' },
    { label: 'Risk Level', value: projectData.riskLevel, status: projectData.riskLevel === 'low' ? 'positive' : projectData.riskLevel === 'medium' ? 'normal' : 'warning' },
    { label: 'Contracts', value: `${projectData.activeContracts}`, status: 'normal' },
    { label: 'Reviews', value: `${projectData.pendingReviews}`, status: projectData.pendingReviews > 10 ? 'warning' : 'normal' }
  ];

  const insights = [
    `Legal compliance at ${projectData.complianceScore}% with ${complianceStatus} regulatory adherence`,
    `${projectData.activeContracts} active contracts with ${projectData.pendingReviews} pending reviews`,
    `${projectData.riskLevel} risk profile with ${projectData.disputesOpen} open disputes requiring attention`,
    `Contract review averaging ${projectData.avgReviewTime} days with ${reviewEfficiency} processing time`
  ];

  const recommendations = [
    projectData.complianceScore < 80 ? 'Strengthen compliance monitoring procedures' : 'Maintain current compliance excellence',
    projectData.pendingReviews > 10 ? 'Accelerate contract review process' : 'Continue current review timeline',
    projectData.renewalsNextQuarter > 5 ? 'Prioritize upcoming contract renewals' : 'Monitor renewal timeline',
    projectData.disputesOpen > 2 ? 'Focus on dispute resolution strategies' : 'Maintain proactive dispute prevention'
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Legal Insights
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
            <strong>{projectData.name}</strong> legal operations maintain{' '}
            <strong className={complianceStatus === 'excellent' ? 'text-green-600' : complianceStatus === 'good' ? 'text-foreground' : 'text-yellow-600'}>
              {complianceStatus} compliance
            </strong>{' '}
            at {projectData.complianceScore}% with{' '}
            <strong className={riskColor}>{projectData.riskLevel} risk profile</strong>.{' '}
            Managing <strong>{projectData.activeContracts} active contracts</strong> with{' '}
            <strong className={projectData.pendingReviews > 10 ? 'text-yellow-600' : 'text-green-600'}>
              {projectData.pendingReviews} pending reviews
            </strong>{' '}
            and {projectData.avgReviewTime}-day average processing time.
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
