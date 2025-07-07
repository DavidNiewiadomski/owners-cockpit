import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';

interface AIInsightsPanelProps {
  projectData: {
    name: string;
    compliancePercent: number;
    overdueItems: number;
    missingDocs: number;
    daysUntilNextDeadline: number;
    sectionsCompliant: number;
    totalSections: number;
    criticalAlerts: Array<{
      id: string;
      description: string;
    }>;
    upcomingDeadlines: Array<{
      id: string;
      title: string;
      daysUntil: number;
    }>;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const complianceStatus = projectData.compliancePercent >= 85 ? 'excellent' : 
                          projectData.compliancePercent >= 70 ? 'good' : 
                          projectData.compliancePercent >= 50 ? 'needs attention' : 'critical';

  const urgentDeadlines = projectData.upcomingDeadlines.filter(d => d.daysUntil <= 5);
  const riskLevel = projectData.overdueItems > 5 ? 'high' : 
                   projectData.overdueItems > 2 ? 'medium' : 'low';

  const keyMetrics = [
    { 
      label: 'Compliance', 
      value: `${projectData.compliancePercent}%`, 
      status: projectData.compliancePercent >= 80 ? 'positive' : 
              projectData.compliancePercent >= 60 ? 'warning' : 'critical' 
    },
    { 
      label: 'Overdue', 
      value: `${projectData.overdueItems}`, 
      status: projectData.overdueItems === 0 ? 'positive' : 
              projectData.overdueItems <= 2 ? 'warning' : 'critical' 
    },
    { 
      label: 'Missing Docs', 
      value: `${projectData.missingDocs}`, 
      status: projectData.missingDocs === 0 ? 'positive' : 
              projectData.missingDocs <= 3 ? 'warning' : 'critical' 
    },
    { 
      label: 'Next Deadline', 
      value: `${projectData.daysUntilNextDeadline}d`, 
      status: projectData.daysUntilNextDeadline > 7 ? 'positive' : 
              projectData.daysUntilNextDeadline > 3 ? 'warning' : 'critical' 
    }
  ];

  const insights = {
    summary: `Division 1 compliance is at ${projectData.compliancePercent}% with ${projectData.sectionsCompliant} of ${projectData.totalSections} sections compliant. ${projectData.overdueItems} items are overdue and ${projectData.missingDocs} documents are missing. Critical attention needed for ${urgentDeadlines.length} upcoming deadlines within 5 days.`,
    keyFindings: [
      `${projectData.compliancePercent}% overall compliance rate with ${complianceStatus} performance`,
      `${projectData.overdueItems} overdue items requiring immediate attention`,
      `${projectData.missingDocs} missing documents impacting project progression`,
      `${urgentDeadlines.length} critical deadlines approaching within 5 days`,
      `${projectData.criticalAlerts.length} active compliance alerts requiring resolution`
    ],
    recommendations: [
      projectData.overdueItems > 0 ? `Prioritize resolution of ${projectData.overdueItems} overdue compliance items` : 'Maintain current compliance schedule',
      projectData.missingDocs > 0 ? `Expedite collection of ${projectData.missingDocs} missing documents` : 'Continue document maintenance procedures',
      urgentDeadlines.length > 0 ? `Focus on ${urgentDeadlines.length} critical deadlines in next 5 days` : 'Monitor upcoming deadline pipeline',
      projectData.compliancePercent < 80 ? 'Implement enhanced compliance tracking procedures' : 'Sustain current compliance standards',
      projectData.criticalAlerts.length > 0 ? 'Address critical compliance alerts to prevent project delays' : 'Continue proactive compliance monitoring'
    ]
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Division 1 Insights
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-card rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${
                metric.status === 'positive' ? 'text-green-400' : 
                metric.status === 'warning' ? 'text-yellow-400' : 
                metric.status === 'critical' ? 'text-red-400' :
                'text-foreground'
              }`}>
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="bg-card/50 rounded-lg p-4">
          <p className="text-foreground text-sm">
            {insights.summary}
          </p>
        </div>

        {/* Key Insights and Recommendations */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium text-foreground">Key Insights</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              {insights.keyFindings.slice(0, 3).map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-foreground">Recommendations</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              {insights.recommendations.slice(0, 3).map((rec, index) => (
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
