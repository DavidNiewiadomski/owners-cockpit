
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Plus, FolderOpen } from 'lucide-react';
import ChatWindow from '@/components/ChatWindow';
import UploadDropzone from '@/components/UploadDropzone';
import InsightSidebar from '@/components/InsightSidebar';
import ProjectSwitcher from '@/components/ProjectSwitcher';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Owners Cockpit
            </h1>
            <ProjectSwitcher 
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUpload(!showUpload)}
              className="neumorphic-button"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="neumorphic-button">
              <FolderOpen className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="neumorphic-button">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedProject ? (
            <ChatWindow projectId={selectedProject} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="neumorphic-card p-8 text-center max-w-md">
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
            </div>
          )}
        </div>

        {/* Upload Dropzone Overlay */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
              <UploadDropzone 
                projectId={selectedProject}
                onClose={() => setShowUpload(false)}
              />
            </div>
          </div>
        )}

        {/* Insights Sidebar */}
        {selectedProject && (
          <InsightSidebar projectId={selectedProject} />
        )}
      </div>
    </div>
  );
};

export default Index;
