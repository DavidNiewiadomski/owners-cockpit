
import React from 'react';
// import NaturalAIChat from '@/components/NaturalAIChat';

interface AIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  activeView?: string;
  contextData?: any;
}

const AIChatOverlay: React.FC<AIChatOverlayProps> = ({ 
  isOpen, 
  onClose, 
  projectId, 
  activeView = 'dashboard',
  contextData 
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="w-96 h-96 bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>
        <div className="text-center text-muted-foreground">
          <p>AI Assistant is temporarily disabled for demo stability.</p>
          <p className="text-sm mt-2">This will be restored in the next update.</p>
        </div>
      </div>
    </div>
  );
};

export default AIChatOverlay;
