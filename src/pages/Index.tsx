
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/AppHeader';
import WelcomeScreen from '@/components/WelcomeScreen';
import Dashboard from '@/components/Dashboard';
import PortfolioDashboard from '@/components/PortfolioDashboard';
import SettingsModal from '@/components/SettingsModal';
import ChatWindow from '@/components/ChatWindow';
import SourceModal from '@/components/SourceModal';
import DocumentViewer from '@/components/DocumentViewer';
import VoiceControl from '@/components/VoiceControl';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from '@/hooks/useRouter';
import { BarChart3, Building2, Settings } from 'lucide-react';
import MotionWrapper from '@/components/MotionWrapper';

const Index = () => {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { currentRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    console.log(`Current role: ${currentRole}`);
  }, [currentRole]);

  const handleProjectChange = (projectId: string | null) => {
    setSelectedProject(projectId);
  };

  const handleDocumentSelect = (document: any) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleExecutiveDashboard = () => {
    router.push('/executive-dashboard');
  };

  const handleHeroExit = () => {
    // Reset to welcome screen
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        selectedProject={selectedProject}
        onProjectChange={handleProjectChange}
        onSettingsToggle={() => setShowSettings(!showSettings)}
        onHeroExit={handleHeroExit}
      />

      <div className="flex flex-1">
        <main className="flex-1 relative">
          {!selectedProject ? (
            <div className="space-y-6">
              <WelcomeScreen 
                selectedProject={selectedProject}
                onProjectChange={handleProjectChange}
              />
              
              {/* Executive Dashboard Access */}
              {currentRole === 'Executive' && (
                <MotionWrapper animation="slideUp" delay={0.3}>
                  <div className="max-w-4xl mx-auto px-8">
                    <Card className="p-6 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-400/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              Executive Portfolio Dashboard
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Get a comprehensive overview of your entire construction portfolio
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                            <Building2 className="w-3 h-3 mr-1" />
                            Portfolio View
                          </Badge>
                          <Button onClick={handleExecutiveDashboard} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Open Dashboard
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </MotionWrapper>
              )}
            </div>
          ) : selectedProject === 'portfolio' ? (
            <PortfolioDashboard />
          ) : (
            <Dashboard projectId={selectedProject} />
          )}
        </main>

        {/* Chat Window */}
        {showChat && selectedProject && (
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
