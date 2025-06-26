
import React from 'react';
import Dashboard from '@/components/Dashboard';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import ActionItemsPage from '@/pages/ActionItemsPage';
import ModelViewer from '@/components/ModelViewer';
import type { ActiveView } from '@/hooks/useAppState';

interface MainContentProps {
  activeView: ActiveView;
  selectedProject: string | null;
}

const MainContent: React.FC<MainContentProps> = ({ activeView, selectedProject }) => {
  // Default to portfolio view when no project is selected
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
