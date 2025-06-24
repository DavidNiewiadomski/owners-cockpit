
import React from 'react';
import { Button } from '@/components/ui/button';
import SettingsModal from '@/components/SettingsModal';
import SourceModal from '@/components/SourceModal';
import DocumentViewer from '@/components/DocumentViewer';

interface AppModalsProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showSourceModal: boolean;
  setShowSourceModal: (show: boolean) => void;
  showDocumentViewer: boolean;
  setShowDocumentViewer: (show: boolean) => void;
  selectedDocument: any;
  setSelectedDocument: (doc: any) => void;
}

const AppModals: React.FC<AppModalsProps> = ({
  showSettings,
  setShowSettings,
  showSourceModal,
  setShowSourceModal,
  showDocumentViewer,
  setShowDocumentViewer,
  selectedDocument,
  setSelectedDocument,
}) => {
  return (
    <>
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
    </>
  );
};

export default AppModals;
