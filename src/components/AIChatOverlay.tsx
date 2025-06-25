
import React from 'react';
import NaturalAIChat from '@/components/NaturalAIChat';

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
    <NaturalAIChat 
      projectId={projectId}
      activeView={activeView}
      contextData={contextData}
      onClose={onClose}
    />
  );
};

export default AIChatOverlay;
