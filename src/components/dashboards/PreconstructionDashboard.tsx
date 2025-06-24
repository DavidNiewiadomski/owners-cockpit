
import React from 'react';
import AIInsightsPanel from './preconstruction/AIInsightsPanel';
import PreconstructionAssistant from '@/components/preconstruction/PreconstructionAssistant';
import { generatePreconDemoData } from '@/utils/preconstructionDemoData';

interface PreconstructionDashboardProps {
  projectId: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId }) => {
  const projectData = generatePreconDemoData();

  // Transform the data to match the expected structure for AIInsightsPanel
  const transformedData = {
    name: 'Portfolio Preconstruction Analysis',
    siteCount: projectData.projects.length,
    averageScore: Math.round(projectData.projects.reduce((sum, p) => sum + (p.designCompletion || 0), 0) / projectData.projects.length),
    feasibilityScores: projectData.projects.map(p => p.designCompletion || 0),
    averageCost: Math.round(projectData.projects.reduce((sum, p) => sum + p.currentEstimate, 0) / projectData.projects.length),
    averageTimeline: Math.round(projectData.projects.reduce((sum, p) => sum + p.estimatedDuration, 0) / projectData.projects.length),
    riskFactors: projectData.projects.flatMap(p => p.riskFlags).slice(0, 5),
    permitComplexity: projectData.alerts.length > 2 ? 'high' : projectData.alerts.length > 0 ? 'medium' : 'low'
  };

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={transformedData} />
      <PreconstructionAssistant />
    </div>
  );
};

export default PreconstructionDashboard;
