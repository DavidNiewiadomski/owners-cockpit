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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        selectedProject={selectedProject}
        onProjectChange={handleProjectChange}
        onSettingsToggle={() => setShowSettings(!showSettings)}
        onChatToggle={() => setShowChat(!showChat)}
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
                <MotionWrapper animation="slideInUp" delay={0.3}>
                  <div className="max-w-4xl mx-auto px-8">
                    <Card className="p-6 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Executive Portfolio Dashboard
                            </h3>
                            <p className="text-gray-600">
                              Get a comprehensive overview of your entire construction portfolio
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Building2 className="w-3 h-3 mr-1" />
                            Portfolio View
                          </Badge>
                          <Button onClick={handleExecutiveDashboard} className="bg-blue-600 hover:bg-blue-700">
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
        {showChat && (
          <ChatWindow 
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            onSourceClick={(source) => {
              setShowSourceModal(true);
            }}
            onDocumentSelect={handleDocumentSelect}
            selectedProject={selectedProject}
          />
        )}
      </div>

      {/* Modals */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedProject={selectedProject}
      />

      <SourceModal 
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
      />

      <DocumentViewer
        isOpen={showDocumentViewer}
        onClose={() => setShowDocumentViewer(false)}
        document={selectedDocument}
      />

      <VoiceControl />
    </div>
  );
};

export default Index;
