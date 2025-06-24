
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/AppHeader';
import Dashboard from '@/components/Dashboard';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import SettingsModal from '@/components/SettingsModal';
import ChatWindow from '@/components/ChatWindow';
import SourceModal from '@/components/SourceModal';
import DocumentViewer from '@/components/DocumentViewer';
import VoiceControl from '@/components/VoiceControl';
import CommunicationsIntegration from '@/components/communications/CommunicationsIntegration';
import ViewToggle from '@/components/ViewToggle';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from '@/hooks/useRouter';

const Index = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'portfolio' | 'communications'>('portfolio');
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { currentRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    console.log(`Current role: ${currentRole}`);
  }, [currentRole]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'c':
            if (selectedProject && activeView !== 'communications') {
              event.preventDefault();
              setActiveView('communications');
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, activeView]);

  const handleProjectChange = (projectId: string | null) => {
    if (projectId === 'portfolio') {
      setActiveView('portfolio');
      setSelectedProject(null);
    } else {
      setSelectedProject(projectId);
      if (activeView === 'portfolio') {
        setActiveView('dashboard');
      }
    }
  };

  const handleViewChange = (view: 'dashboard' | 'chat' | 'portfolio' | 'communications') => {
    setActiveView(view);
    if (view === 'portfolio') {
      setSelectedProject(null);
    }
  };

  const handleDocumentSelect = (document: any) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleExecutiveDashboard = () => {
    router.push('/executive-dashboard');
  };

  const handleHeroExit = () => {
    console.log('Hero exit called');
  };

  const renderMainContent = () => {
    if (activeView === 'portfolio') {
      return <PortfolioDashboard />;
    }
    
    if (!selectedProject) {
      return <PortfolioDashboard />;
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard projectId={selectedProject} />;
      case 'chat':
        return (
          <div className="flex h-full">
            <div className="flex-1">
              <Dashboard projectId={selectedProject} />
            </div>
            <div className="w-96 border-l border-border/40">
              <ChatWindow projectId={selectedProject} />
            </div>
          </div>
        );
      case 'communications':
        return <CommunicationsIntegration projectId={selectedProject} />;
      default:
        return <Dashboard projectId={selectedProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        selectedProject={activeView === 'portfolio' ? 'portfolio' : selectedProject}
        onProjectChange={handleProjectChange}
        onUploadToggle={() => setShowUpload(!showUpload)}
        onSettingsToggle={() => setShowSettings(!showSettings)}
        onHeroExit={handleHeroExit}
      />

      <ViewToggle
        activeView={activeView}
        onViewChange={handleViewChange}
        selectedProject={selectedProject}
      />

      <main className="flex-1">
        {renderMainContent()}
      </main>

      {/* Modals */}
      <SettingsModal 
        open={showSettings}
        onOpenChange={setShowSettings}
      />

      <SourceModal 
        citation={null}
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
      />

      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Document Viewer</h3>
              <Button variant="ghost" onClick={() => setShowDocumentViewer(false)}>
                ×
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[80vh]">
              <DocumentViewer
                fileUrl={selectedDocument.url}
                mimeType={selectedDocument.mimeType}
                title={selectedDocument.title}
              />
            </div>
          </div>
        </div>
      )}

      <VoiceControl />
    </div>
  );
};

export default Index;
