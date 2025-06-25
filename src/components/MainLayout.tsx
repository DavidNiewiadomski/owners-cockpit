
import React, { useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import ViewToggle from '@/components/ViewToggle';
import MainContent from '@/components/MainContent';
import AIFloatingButton from '@/components/AIFloatingButton';
import { PremiumAIChat } from '@/components/ai/PremiumAIChat';
import AppModals from '@/components/AppModals';
// import VoiceControl from '@/components/VoiceControl';
import { useAppState } from '@/hooks/useAppState';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from '@/hooks/useRouter';

const MainLayout: React.FC = () => {
  const { currentRole } = useRole();
  const _router = useRouter();
  const appState = useAppState();

  useEffect(() => {
    console.log(`Current role: ${currentRole}`);
    console.log('MainLayout state:', { 
      showChatOverlay: appState.showChatOverlay,
      selectedProject: appState.selectedProject,
      activeView: appState.activeView 
    });
  }, [currentRole, appState.showChatOverlay, appState.selectedProject, appState.activeView]);

  useKeyboardShortcuts({
    activeView: appState.activeView,
    setActiveView: appState.setActiveView,
  });

  const handleHeroExit = () => {
    console.log('Hero exit called');
  };

  // Ready to render components

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        selectedProject={appState.activeView === 'portfolio' ? 'portfolio' : appState.selectedProject}
        onProjectChange={appState.handleProjectChange}
        onUploadToggle={() => appState.setShowUpload(!appState.showUpload)}
        onSettingsToggle={() => appState.setShowSettings(!appState.showSettings)}
        onHeroExit={handleHeroExit}
      />

      <ViewToggle
        activeView={appState.activeView}
        onViewChange={appState.handleViewChange}
        selectedProject={appState.selectedProject}
        onAIChat={appState.handleAIChat}
      />

      <main className="flex-1">
        <MainContent 
          activeView={appState.activeView}
          selectedProject={appState.selectedProject}
        />
      </main>

      {/* AI Floating Button */}
      <AIFloatingButton onClick={appState.handleAIChat} />

      {/* Premium AI Chat with Advanced Features */}
      <PremiumAIChat 
        isOpen={appState.showChatOverlay}
        onClose={appState.handleCloseChatOverlay}
        currentProjectId={appState.selectedProject || 'portfolio'}
        availableProjects={[
          { id: 'portfolio', name: 'Portfolio Overview', status: 'active' },
          { id: 'pacific-heights-tower', name: 'Pacific Heights Tower', status: 'in-progress' },
          { id: 'downtown-office-complex', name: 'Downtown Office Complex', status: 'planning' },
          { id: 'marina-residential', name: 'Marina Residential', status: 'completed' },
          { id: 'tech-campus-expansion', name: 'Tech Campus Expansion', status: 'in-progress' }
        ]}
      />

      {/* Modals */}
      <AppModals
        showSettings={appState.showSettings}
        setShowSettings={appState.setShowSettings}
        showSourceModal={appState.showSourceModal}
        setShowSourceModal={appState.setShowSourceModal}
        showDocumentViewer={appState.showDocumentViewer}
        setShowDocumentViewer={appState.setShowDocumentViewer}
        showUpload={appState.showUpload}
        setShowUpload={appState.setShowUpload}
        selectedProject={appState.selectedProject}
        selectedDocument={appState.selectedDocument}
        setSelectedDocument={appState.setSelectedDocument}
      />

      {/* <VoiceControl /> */}
    </div>
  );
};

export default MainLayout;
