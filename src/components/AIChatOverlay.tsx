
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, MessageSquare, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BasicAIChat from '@/components/BasicAIChat';
import { useAppState } from '@/hooks/useAppState';

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
  
  const [isMinimized, setIsMinimized] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Rendering overlay UI

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      >
        <motion.div
          ref={overlayRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-background border border-border/50 shadow-xl rounded-lg overflow-hidden transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-[900px] h-[700px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/30">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsMinimized(!isMinimized);
                }}
                className="w-8 h-8 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClose();
                }}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex-1 overflow-hidden"
              >
                <div className="h-[536px]">
                  <BasicAIChat 
                    projectId={projectId}
                    activeView={activeView}
                    contextData={contextData}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIChatOverlay;
