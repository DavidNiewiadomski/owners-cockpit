
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, ArrowRight } from 'lucide-react';
import type { SustainabilityDemoData } from '@/utils/sustainabilityDemoData';

interface AIInsightsPanelProps {
  projectData: SustainabilityDemoData;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ projectData }) => {
  const { kpis, insights } = projectData;
  
  const keyMetrics = [
    { 
      label: 'Energy Score', 
      value: `${kpis.averageEnergyStarScore}`, 
      status: kpis.averageEnergyStarScore > 80 ? 'positive' : 'normal' 
    },
    { 
      label: 'Renewable %', 
      value: `${kpis.renewablePercentage}%`, 
      status: kpis.renewablePercentage > 20 ? 'positive' : 'normal' 
    },
    { 
      label: 'Recycling', 
      value: `${kpis.totalRecyclingRate}%`, 
      status: kpis.totalRecyclingRate > 60 ? 'positive' : 'normal' 
    },
    { 
      label: 'Compliance', 
      value: `${kpis.compliantBuildings}/${kpis.totalBuildings}`, 
      status: kpis.compliantBuildings === kpis.totalBuildings ? 'positive' : 'normal' 
    }
  ];

  return (
    <Card className="bg-[#0D1117] border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Brain className="w-5 h-5 text-blue-400" />
            AI Sustainability Insights
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
            {insights.summary}
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
              {insights.keyFindings.slice(0, 3).map((finding, index) => (
                <li key={index}>• {finding}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-white">Recommendations</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
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
