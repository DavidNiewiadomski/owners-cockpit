
import React from 'react';
import AIInsightsPanel from './preconstruction/AIInsightsPanel';
import PreconstructionAssistant from '@/components/preconstruction/PreconstructionAssistant';
import { generatePreconstructionDemoData } from '@/utils/preconstructionDemoData';

interface PreconstructionDashboardProps {
  projectId: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId }) => {
  const projectData = generatePreconstructionDemoData(projectId);

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      <PreconstructionAssistant />
    </div>
  );
};

export default PreconstructionDashboard;
