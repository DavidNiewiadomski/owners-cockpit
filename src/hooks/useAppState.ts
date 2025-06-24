
import { useState } from 'react';

export type ActiveView = 'dashboard' | 'chat' | 'portfolio' | 'communications' | 'action-items' | 'model';

export interface AppState {
  selectedProject: string | null;
  activeView: ActiveView;
  showSettings: boolean;
  showChat: boolean;
  showChatOverlay: boolean;
  showUpload: boolean;
  showSourceModal: boolean;
  showDocumentViewer: boolean;
  selectedDocument: any;
}

export const useAppState = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('portfolio');
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

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

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'portfolio') {
      setSelectedProject(null);
    }
  };

  const handleDocumentSelect = (document: any) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const handleAIChat = () => {
    console.log('🟢 handleAIChat called - setting showChatOverlay to true');
    setShowChatOverlay(true);
  };

  const handleCloseChatOverlay = () => {
    console.log('🟢 handleCloseChatOverlay called - setting showChatOverlay to false');
    setShowChatOverlay(false);
  };

  return {
    // State
    selectedProject,
    activeView,
    showSettings,
    showChat,
    showChatOverlay,
    showUpload,
    showSourceModal,
    showDocumentViewer,
    selectedDocument,
    // Setters
    setSelectedProject,
    setActiveView,
    setShowSettings,
    setShowChat,
    setShowChatOverlay,
    setShowUpload,
    setShowSourceModal,
    setShowDocumentViewer,
    setSelectedDocument,
    // Handlers
    handleProjectChange,
    handleViewChange,
    handleDocumentSelect,
    handleAIChat,
    handleCloseChatOverlay,
  };
};
