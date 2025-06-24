
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessagesSquare } from 'lucide-react';
import { useRouter } from '@/hooks/useRouter';

interface ViewToggleProps {
  activeView: 'dashboard' | 'chat' | 'portfolio';
  onViewChange: (view: 'dashboard' | 'chat' | 'portfolio') => void;
  selectedProject: string | null;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  activeView,
  onViewChange,
  selectedProject
}) => {
  const router = useRouter();

  const handleCommunicationsClick = () => {
    if (selectedProject) {
      router.push(`/projects/${selectedProject}/communications`);
    }
  };

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
              variant="ghost"
              size="sm"
              onClick={handleCommunicationsClick}
              className="flex items-center gap-2"
            >
              <MessagesSquare className="w-4 h-4" />
              Communications
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewToggle;
