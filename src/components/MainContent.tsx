
import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import MotionWrapper from '@/components/MotionWrapper';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import Dashboard from '@/components/Dashboard';
import WelcomeScreen from '@/components/WelcomeScreen';

const ChatWindow = lazy(() => import('@/components/ChatWindow'));

const ChatWindowSkeleton = () => (
  <div className="flex-1 p-4 space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-24 w-full" />
  </div>
);

interface MainContentProps {
  selectedProject: string | null;
  activeView: 'dashboard' | 'chat';
  onProjectChange: (projectId: string | null) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedProject,
  activeView,
  onProjectChange
}) => {
  if (!selectedProject) {
    return (
      <WelcomeScreen 
        selectedProject={selectedProject}
        onProjectChange={onProjectChange}
      />
    );
  }

  return (
    <MotionWrapper animation="fadeIn" className="flex-1">
      <EnhancedErrorBoundary>
        {activeView === 'dashboard' ? (
          <Dashboard projectId={selectedProject} />
        ) : (
          <Suspense fallback={<ChatWindowSkeleton />}>
            <ChatWindow projectId={selectedProject} />
          </Suspense>
        )}
      </EnhancedErrorBoundary>
    </MotionWrapper>
  );
};

export default MainContent;
