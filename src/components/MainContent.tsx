
import React from 'react';
import Dashboard from '@/components/Dashboard';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import ChatWindow from '@/components/ChatWindow';
import CommunicationsIntegration from '@/components/communications/CommunicationsIntegration';
import ActionItemsPage from '@/pages/ActionItemsPage';
import ModelViewer from '@/components/ModelViewer';
import { ActiveView } from '@/hooks/useAppState';

interface MainContentProps {
  activeView: ActiveView;
  selectedProject: string | null;
}

const MainContent: React.FC<MainContentProps> = ({ activeView, selectedProject }) => {
  if (activeView === 'communications') {
    const communicationsProjectId = selectedProject || 'portfolio';
    return <CommunicationsIntegration projectId={communicationsProjectId} />;
  }
  
  if (activeView === 'portfolio') {
    return <PortfolioDashboard />;
  }

  if (activeView === 'chat') {
    const chatProjectId = selectedProject || 'portfolio';
    return (
      <div className="flex h-full">
        <div className="flex-1">
          {selectedProject ? (
            <Dashboard projectId={selectedProject} />
          ) : (
            <PortfolioDashboard />
          )}
        </div>
        <div className="w-96 border-l border-border/40">
          <ChatWindow projectId={chatProjectId} />
        </div>
      </div>
    );
  }
  
  if (!selectedProject) {
    return <PortfolioDashboard />;
  }

  switch (activeView) {
    case 'dashboard':
      return <Dashboard projectId={selectedProject} />;
    case 'action-items':
      return <ActionItemsPage />;
    case 'model':
      return <ModelViewer projectId={selectedProject} />;
    default:
      return <Dashboard projectId={selectedProject} />;
  }
};

export default MainContent;
