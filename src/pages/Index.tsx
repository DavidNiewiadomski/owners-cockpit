
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
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from '@/hooks/useRouter';

const Index = () => {
  const { t } = useTranslation();
  // Start with null - portfolio will be handled separately
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'portfolio' | 'project'>('portfolio');
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

  const handleProjectChange = (projectId: string | null) => {
    if (projectId === 'portfolio') {
      setViewMode('portfolio');
      setSelectedProject(null);
    } else {
      setViewMode('project');
      setSelectedProject(projectId);
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
    // This can be a no-op since we're already in the main app
    console.log('Hero exit called');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        selectedProject={viewMode === 'portfolio' ? 'portfolio' : selectedProject}
        onProjectChange={handleProjectChange}
        onUploadToggle={() => setShowUpload(!showUpload)}
        onSettingsToggle={() => setShowSettings(!showSettings)}
        onHeroExit={handleHeroExit}
      />

      <div className="flex flex-1">
        <main className="flex-1 relative">
          {viewMode === 'portfolio' ? (
            <PortfolioDashboard />
          ) : selectedProject ? (
            <Dashboard projectId={selectedProject} />
          ) : (
            // Fallback to portfolio if somehow no project is selected
            <PortfolioDashboard />
          )}
        </main>

        {/* Chat Window */}
        {showChat && selectedProject && viewMode === 'project' && (
          <div className="w-96 border-l border-border/40">
            <ChatWindow projectId={selectedProject} />
          </div>
        )}
      </div>

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
