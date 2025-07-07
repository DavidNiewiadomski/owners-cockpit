
import React from 'react';
import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';

interface ViewToggleProps {
  activeView: 'dashboard' | 'chat' | 'action-items' | 'model';
  onViewChange: (view: 'dashboard' | 'chat' | 'action-items' | 'model') => void;
  selectedProject: string | null;
  onAIChat?: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  activeView,
  onViewChange,
  selectedProject,
  onAIChat
}) => {
  return (
    <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-1">
          {selectedProject && (
            <>
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('dashboard')}
                className="h-8 px-3 text-sm font-medium transition-all duration-200"
              >
                Dashboard
              </Button>
              <Button
                variant={activeView === 'action-items' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('action-items')}
                className="h-8 px-3 text-sm font-medium transition-all duration-200"
              >
                Action Items
              </Button>
              <Button
                variant={activeView === 'model' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('model')}
                className="h-8 px-3 text-sm font-medium transition-all duration-200 gap-2"
              >
                <Box className="w-4 h-4" />
                Model
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewToggle;
