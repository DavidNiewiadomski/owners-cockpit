
import React, { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Plus, FolderOpen, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ParticleHero from '@/components/ParticleHero';
import ThemeToggle from '@/components/ThemeToggle';
import MotionWrapper from '@/components/MotionWrapper';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

// Lazy load heavy components
const ChatWindow = lazy(() => import('@/components/ChatWindow'));
const UploadDropzone = lazy(() => import('@/components/UploadDropzone'));
const InsightSidebar = lazy(() => import('@/components/InsightSidebar'));
const SettingsModal = lazy(() => import('@/components/SettingsModal'));

// Loading components
const ChatWindowSkeleton = () => (
  <div className="flex-1 p-4 space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-24 w-full" />
  </div>
);

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
  const { endMeasurement } = usePerformanceMonitor('Index', { threshold: 20 });
  
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Performance monitoring
  React.useEffect(() => {
    endMeasurement({ selectedProject, showUpload, showHero, showSettings });
  });

  const handleProjectChange = React.useCallback((projectId: string | null) => {
    setSelectedProject(projectId);
  }, []);

  const handleUploadToggle = React.useCallback(() => {
    setShowUpload(prev => !prev);
  }, []);

  const handleSettingsToggle = React.useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleHeroExit = React.useCallback(() => {
    setShowHero(false);
  }, []);

  const handleUploadClose = React.useCallback(() => {
    setShowUpload(false);
  }, []);

  const handleSettingsClose = React.useCallback((open: boolean) => {
    setShowSettings(open);
  }, []);

  if (showHero) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ParticleHero />
        <div className="fixed top-6 right-6 z-50">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={handleHeroExit}
              className="glass border-primary/20"
            >
              {t('app.enterApp')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <MotionWrapper animation="slideUp" className="sticky top-0 z-50">
        <header className="border-b border-border/40 glass backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <MotionWrapper animation="scaleIn" delay={0.1}>
                <h1 className="text-2xl font-bold gradient-text cursor-pointer" onClick={handleHeroExit}>
                  {t('app.title')}
                </h1>
              </MotionWrapper>
              <MotionWrapper animation="fadeIn" delay={0.2}>
                <ProjectSwitcher 
                  selectedProject={selectedProject}
                  onProjectChange={handleProjectChange}
                />
              </MotionWrapper>
            </div>
            <MotionWrapper animation="fadeIn" delay={0.3}>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUploadToggle}
                  className="neumorphic-button hover:scale-105 transition-transform"
                  title={t('navigation.upload')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="neumorphic-button hover:scale-105 transition-transform"
                  title={t('navigation.projects')}
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
                {selectedProject && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="neumorphic-button hover:scale-105 transition-transform"
                    onClick={() => window.open(`/settings/access/${selectedProject}`, '_blank')}
                    title="Project Access Settings"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="neumorphic-button hover:scale-105 transition-transform"
                  onClick={handleSettingsToggle}
                  title={t('navigation.settings')}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <ThemeToggle />
              </div>
            </MotionWrapper>
          </div>
        </header>
      </MotionWrapper>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedProject ? (
            <MotionWrapper animation="fadeIn" className="flex-1">
              <EnhancedErrorBoundary>
                <Suspense fallback={<ChatWindowSkeleton />}>
                  <ChatWindow projectId={selectedProject} />
                </Suspense>
              </EnhancedErrorBoundary>
            </MotionWrapper>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <MotionWrapper animation="scaleIn" delay={0.2}>
                <Card className="neumorphic-card p-8 text-center max-w-2xl w-full glass">
                  <h2 className="text-xl font-semibold mb-4">{t('app.welcome')}</h2>
                  <p className="text-muted-foreground mb-6">
                    {t('app.selectProject')}
                  </p>
                  <div className="w-full">
                    <ProjectSwitcher 
                      selectedProject={selectedProject}
                      onProjectChange={handleProjectChange}
                      variant="expanded"
                    />
                  </div>
                </Card>
              </MotionWrapper>
            </div>
          )}
        </div>

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

        {/* Insights Sidebar */}
        {selectedProject && (
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
