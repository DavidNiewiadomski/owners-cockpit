
import React from 'react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  activeView: 'dashboard' | 'chat' | 'portfolio' | 'communications';
  onViewChange: (view: 'dashboard' | 'chat' | 'portfolio' | 'communications') => void;
  selectedProject: string | null;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  activeView,
  onViewChange,
  selectedProject
}) => {
  return (
    <div className="border-b border-border/40 px-6 py-2">
      <div className="flex items-center gap-2">
        <Button
          variant={activeView === 'portfolio' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('portfolio')}
        >
          Portfolio
        </Button>
        {selectedProject && (
          <>
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={activeView === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('chat')}
            >
              AI Chat
            </Button>
            <Button
              variant={activeView === 'communications' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('communications')}
            >
              Communications
            </Button>
          </>
        )}
      </div>
      {selectedProject && (
        <div className="text-xs text-muted-foreground mt-1">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+C</kbd> for Communications
        </div>
      )}
    </div>
  );
};

export default ViewToggle;
