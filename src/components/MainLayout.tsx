
import React, { useEffect, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import ViewToggle from '@/components/ViewToggle';
import MainContent from '@/components/MainContent';
import AIFloatingButton from '@/components/AIFloatingButton';
import AIChatOverlay from '@/components/AIChatOverlay';
import AppModals from '@/components/AppModals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ToggleLeft, ToggleRight, Brain, Activity } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from '@/hooks/useRouter';
import { ServiceHealthWidget } from '@/components/ServiceHealthWidget';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentRole } = useRole();
  const router = useRouter();
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
        selectedProject={appState.selectedProject}
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

      {/* Quick Actions Bar */}
      <div className="px-6 py-2 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/ai-command')}
            className="gap-2"
          >
            <Brain className="w-4 h-4" />
            AI Command Center
            <Badge variant="secondary" className="ml-2">Live</Badge>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/system-status')}
            className="gap-2"
          >
            <Activity className="w-4 h-4" />
            System Status
          </Button>
        </div>
        
        <ServiceHealthWidget compact />
      </div>

      <main className="flex-1">
        {children}
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
    </div>
  );
};

export default MainLayout;
