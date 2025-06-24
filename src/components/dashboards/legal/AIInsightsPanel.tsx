
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';
import { LegalDemoData } from '@/utils/legalDemoData';

interface AIInsightsPanelProps {
  projectData: LegalDemoData;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const { summary, insights } = projectData;
  
  const keyMetrics = [
    { 
      label: 'Contracts', 
      value: summary.activeContracts, 
      status: 'normal' 
    },
    { 
      label: 'Compliance', 
      value: `${summary.complianceScore}%`, 
      status: summary.complianceScore > 90 ? 'positive' : summary.complianceScore > 75 ? 'normal' : 'warning' 
    },
    { 
      label: 'Claims', 
      value: summary.activeClaims, 
      status: summary.activeClaims === 0 ? 'positive' : summary.activeClaims < 3 ? 'normal' : 'warning' 
    },
    { 
      label: 'COIs', 
      value: `${summary.compliantCOIs}/${summary.totalCOIs}`, 
      status: summary.compliantCOIs === summary.totalCOIs ? 'positive' : 'normal' 
    }
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
            Portfolio includes <strong>{summary.totalContracts}</strong> contracts with total value of <strong>${(summary.totalContractValue / 1000000).toFixed(1)}M</strong>. 
            Compliance score at <strong>{summary.complianceScore}%</strong> with <strong>{summary.activeClaims}</strong> active claims. 
            <strong>{summary.contractsEndingSoon}</strong> contracts ending within 60 days requiring attention.
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
              <div className="flex items-start gap-2 text-xs">
                <Badge variant="outline" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                  •
                </Badge>
                <span className="text-muted-foreground leading-relaxed">{insights.contractCompliance}</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Badge variant="outline" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                  •
                </Badge>
                <span className="text-muted-foreground leading-relaxed">{insights.insuranceCompliance}</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Badge variant="outline" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                  •
                </Badge>
                <span className="text-muted-foreground leading-relaxed">{insights.claimsStatus}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowRight className="h-4 w-4 text-green-600" />
              Recommendations
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <Badge variant="secondary" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                  →
                </Badge>
                <span className="text-muted-foreground leading-relaxed">Monitor upcoming contract expirations and prepare renewal strategies</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Badge variant="secondary" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                  →
                </Badge>
                <span className="text-muted-foreground leading-relaxed">Continue proactive insurance compliance management</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <Badge variant="secondary" className="mt-0.5 h-4 w-4 p-0 flex items-center justify-center">
                  →
                </Badge>
                <span className="text-muted-foreground leading-relaxed">{insights.riskAssessment}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
