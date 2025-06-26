
import React, { useEffect, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import ViewToggle from '@/components/ViewToggle';
import MainContent from '@/components/MainContent';
import AIFloatingButton from '@/components/AIFloatingButton';
import AIChatOverlay from '@/components/AIChatOverlay';
import AppModals from '@/components/AppModals';
import VoiceControl from '@/components/VoiceControl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ToggleLeft, ToggleRight } from 'lucide-react';
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
    <div className="min-h-screen bg-background relative">
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

      {/* AI Chat Overlay */}
      <AIChatOverlay 
        isOpen={appState.showChatOverlay}
        onClose={appState.handleCloseChatOverlay}
        projectId={appState.selectedProject || 'portfolio'}
        activeView={appState.activeView}
        contextData={{
          selectedProject: appState.selectedProject,
          timestamp: new Date().toISOString()
        }}
      />

      {/* Modals */}
      <AppModals
        showSettings={appState.showSettings}
        setShowSettings={appState.setShowSettings}
        showSourceModal={appState.showSourceModal}
        setShowSourceModal={appState.setShowSourceModal}
        showDocumentViewer={appState.showDocumentViewer}
        setShowDocumentViewer={appState.setShowDocumentViewer}
        selectedDocument={appState.selectedDocument}
        setSelectedDocument={appState.setSelectedDocument}
      />

      <VoiceControl />
    </div>
  );
};

export default MainLayout;
