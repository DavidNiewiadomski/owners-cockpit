import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import ParticleHero from '@/components/ParticleHero';
import AppHeader from '@/components/AppHeader';
import RoleContextBanner from '@/components/RoleContextBanner';
import ViewToggle from '@/components/ViewToggle';
import MainContent from '@/components/MainContent';
import MotionWrapper from '@/components/MotionWrapper';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useTranslation } from 'react-i18next';

// Lazy load heavy components
const UploadDropzone = lazy(() => import('@/components/UploadDropzone'));
const InsightSidebar = lazy(() => import('@/components/InsightSidebar'));
const SettingsModal = lazy(() => import('@/components/SettingsModal'));

const SidebarSkeleton = () => (
  <div className="w-80 border-l border-border/40 p-4 space-y-4">
    <Skeleton className="h-6 w-24" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-16 w-full" />
  </div>
);

const Index = React.memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'portfolio'>('dashboard');

  const handleProjectChange = React.useCallback((projectId: string | null) => {
    setSelectedProject(projectId);
    // Set portfolio view if no project selected
    if (projectId === null) {
      setActiveView('portfolio');
    } else {
      setActiveView('dashboard');
    }
  }, []);

  const handleUploadToggle = React.useCallback(() => {
    setShowUpload(prev => !prev);
  }, []);

  const handleSettingsToggle = React.useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleUploadClose = React.useCallback(() => {
    setShowUpload(false);
  }, []);

  const handleSettingsClose = React.useCallback((open: boolean) => {
    setShowSettings(open);
  }, []);

  const handleViewChange = React.useCallback((view: 'dashboard' | 'chat' | 'portfolio') => {
    setActiveView(view);
  }, []);

  // Add keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check for 'g p' sequence
      if (e.key === 'g') {
        const handleSecondKey = (e2: KeyboardEvent) => {
          if (e2.key === 'p') {
            setSelectedProject(null);
            setActiveView('portfolio');
          }
          document.removeEventListener('keydown', handleSecondKey);
        };
        document.addEventListener('keydown', handleSecondKey);
        setTimeout(() => document.removeEventListener('keydown', handleSecondKey), 1000);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Show hero page on root route - check for exact path
  if (location.pathname === '/' || location.pathname === '') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ParticleHero />
        <div className="fixed top-6 right-6 z-50">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={() => window.location.href = '/app'}
              className="glass border-primary/20"
            >
              {t('app.enterApp')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show main app interface for all other routes
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        selectedProject={selectedProject}
        onProjectChange={handleProjectChange}
        onUploadToggle={handleUploadToggle}
        onSettingsToggle={handleSettingsToggle}
        onHeroExit={() => window.location.href = '/'}
      />

      <RoleContextBanner />

      <ViewToggle
        activeView={activeView}
        onViewChange={handleViewChange}
        selectedProject={selectedProject}
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-154px)]">
        <MainContent
          selectedProject={selectedProject}
          activeView={activeView}
          onProjectChange={handleProjectChange}
        />

        {/* Upload Dropzone Overlay */}
        {showUpload && (
          <MotionWrapper
            animation="fadeIn"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg">
              <EnhancedErrorBoundary>
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <UploadDropzone 
                    projectId={selectedProject}
                    onClose={handleUploadClose}
                  />
                </Suspense>
              </EnhancedErrorBoundary>
            </div>
          </MotionWrapper>
        )}

        {/* Insights Sidebar - only show in chat view */}
        {selectedProject && activeView === 'chat' && (
          <MotionWrapper animation="slideUp" delay={0.1}>
            <EnhancedErrorBoundary>
              <Suspense fallback={<SidebarSkeleton />}>
                <InsightSidebar projectId={selectedProject} />
              </Suspense>
            </EnhancedErrorBoundary>
          </MotionWrapper>
        )}
      </div>

      {/* Settings Modal */}
      <EnhancedErrorBoundary>
        <Suspense fallback={null}>
          <SettingsModal 
            open={showSettings} 
            onOpenChange={handleSettingsClose} 
          />
        </Suspense>
      </EnhancedErrorBoundary>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
