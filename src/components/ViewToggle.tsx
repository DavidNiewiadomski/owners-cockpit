
import React from 'react';
import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';
import { useRouter } from '@/hooks/useRouter';

interface ViewToggleProps {
  activeView: 'dashboard' | 'chat' | 'portfolio' | 'communications' | 'action-items';
  onViewChange: (view: 'dashboard' | 'chat' | 'portfolio' | 'communications' | 'action-items') => void;
  selectedProject: string | null;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  activeView,
  onViewChange,
  selectedProject
}) => {
  const router = useRouter();

  const handleModelView = () => {
    if (selectedProject) {
      router.push(`/projects/${selectedProject}/model`);
    }
  };

  return (
    <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant={activeView === 'portfolio' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('portfolio')}
            className="h-8 px-3 text-sm font-medium transition-all duration-200"
          >
            Portfolio
          </Button>
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
                variant="ghost"
                size="sm"
                onClick={handleModelView}
                className="h-8 px-3 text-sm font-medium transition-all duration-200 gap-2"
              >
                <Box className="w-4 h-4" />
                Model
              </Button>
              <Button
                variant={activeView === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('chat')}
                className="h-8 px-3 text-sm font-medium transition-all duration-200"
              >
                AI Chat
              </Button>
            </>
          )}
          <Button
            variant={activeView === 'communications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('communications')}
            className="h-8 px-3 text-sm font-medium transition-all duration-200"
          >
            Communications
          </Button>
        </div>
        {(selectedProject || activeView === 'communications') && (
          <div className="text-xs text-muted-foreground">
            Press <kbd className="inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-mono text-[10px] font-medium text-muted-foreground opacity-100">Ctrl+C</kbd> for Communications
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewToggle;
