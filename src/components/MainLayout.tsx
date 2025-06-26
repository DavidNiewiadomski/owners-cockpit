
import React, { useEffect, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import ViewToggle from '@/components/ViewToggle';
import MainContent from '@/components/MainContent';
import AIFloatingButton from '@/components/AIFloatingButton';
import AIChatOverlay from '@/components/AIChatOverlay';
import AppModals from '@/components/AppModals';
import VoiceControl from '@/components/VoiceControl';
import OOUXLayout from '@/components/OOUXLayout';
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
  const [showOOUXDemo, setShowOOUXDemo] = useState(false);

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

  // If OOUX demo is enabled, render the enhanced layout
  if (showOOUXDemo) {
    return <OOUXLayout showOOUXDemo={true} />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* OOUX Demo Toggle - Prominently positioned */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[9999]">
        <Button
          variant={showOOUXDemo ? "default" : "outline"}
          size="lg"
          onClick={() => setShowOOUXDemo(!showOOUXDemo)}
          className="flex items-center gap-2 shadow-2xl border-2 font-semibold bg-white dark:bg-gray-900 hover:scale-105 transition-all duration-200"
        >
          <Eye className="h-5 w-5" />
          <span className="text-sm font-bold">{showOOUXDemo ? "Exit OOUX Demo" : "Try OOUX Demo"}</span>
          {showOOUXDemo ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5" />}
        </Button>
      </div>
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
