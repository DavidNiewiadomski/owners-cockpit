
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Plus, FolderOpen } from 'lucide-react';
import ChatWindow from '@/components/ChatWindow';
import UploadDropzone from '@/components/UploadDropzone';
import InsightSidebar from '@/components/InsightSidebar';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ParticleHero from '@/components/ParticleHero';
import ThemeToggle from '@/components/ThemeToggle';
import MotionWrapper from '@/components/MotionWrapper';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showHero, setShowHero] = useState(true);

  if (showHero) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ParticleHero />
        <div className="fixed top-6 right-6 z-50">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={() => setShowHero(false)}
              className="glass border-primary/20"
            >
              Enter App
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
                <h1 className="text-2xl font-bold gradient-text cursor-pointer" onClick={() => setShowHero(true)}>
                  Owners Cockpit
                </h1>
              </MotionWrapper>
              <MotionWrapper animation="fadeIn" delay={0.2}>
                <ProjectSwitcher 
                  selectedProject={selectedProject}
                  onProjectChange={setSelectedProject}
                />
              </MotionWrapper>
            </div>
            <MotionWrapper animation="fadeIn" delay={0.3}>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUpload(!showUpload)}
                  className="neumorphic-button hover:scale-105 transition-transform"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="neumorphic-button hover:scale-105 transition-transform">
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="neumorphic-button hover:scale-105 transition-transform">
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
              <ChatWindow projectId={selectedProject} />
            </MotionWrapper>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <MotionWrapper animation="scaleIn" delay={0.2}>
                <Card className="neumorphic-card p-8 text-center max-w-md glass">
                  <h2 className="text-xl font-semibold mb-4">Welcome to Owners Cockpit</h2>
                  <p className="text-muted-foreground mb-6">
                    Select a project to start chatting with your AI construction assistant.
                  </p>
                  <ProjectSwitcher 
                    selectedProject={selectedProject}
                    onProjectChange={setSelectedProject}
                    variant="expanded"
                  />
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
              <UploadDropzone 
                projectId={selectedProject}
                onClose={() => setShowUpload(false)}
              />
            </div>
          </MotionWrapper>
        )}

        {/* Insights Sidebar */}
        {selectedProject && (
          <MotionWrapper animation="slideUp" delay={0.1}>
            <InsightSidebar projectId={selectedProject} />
          </MotionWrapper>
        )}
      </div>
    </div>
  );
};

export default Index;
