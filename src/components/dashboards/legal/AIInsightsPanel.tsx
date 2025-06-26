
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';
import type { LegalDemoData } from '@/utils/legalDemoData';

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
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Legal Insights
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
            Portfolio includes <strong>{summary.totalContracts}</strong> contracts with total value of <strong>${(summary.totalContractValue / 1000000).toFixed(1)}M</strong>. 
            Compliance score at <strong>{summary.complianceScore}%</strong> with <strong>{summary.activeClaims}</strong> active claims. 
            <strong>{summary.contractsEndingSoon}</strong> contracts ending within 60 days requiring attention.
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
              <li>• {insights.contractCompliance}</li>
              <li>• {insights.insuranceCompliance}</li>
              <li>• {insights.claimsStatus}</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-white">Recommendations</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">→</span>
                <span>Monitor upcoming contract expirations and prepare renewal strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">→</span>
                <span>Continue proactive insurance compliance management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">→</span>
                <span>{insights.riskAssessment}</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
