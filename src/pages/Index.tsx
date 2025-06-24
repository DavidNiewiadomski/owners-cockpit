
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useRole } from '@/contexts/RoleContext';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import ViewToggle from '@/components/ViewToggle';
import MainContent from '@/components/MainContent';
import RoleToggle from '@/components/RoleToggle';
import RoleContextBanner from '@/components/RoleContextBanner';
import VoiceControl from '@/components/VoiceControl';
import SettingsModal from '@/components/SettingsModal';

type ViewType = 'dashboard' | 'chat' | 'portfolio';

const Index: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(projectId || null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { currentRole } = useRole();

  usePerformanceMonitor();

  // Update selected project when URL changes
  useEffect(() => {
    if (projectId && projectId !== selectedProject) {
      setSelectedProject(projectId);
    } else if (!projectId && selectedProject) {
      setSelectedProject(null);
      setActiveView('portfolio');
    }
  }, [projectId, selectedProject]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle 'g c' shortcut for Communications
      if (event.key === 'c' && event.ctrlKey && event.shiftKey && selectedProject) {
        event.preventDefault();
        navigate(`/projects/${selectedProject}/communications`);
        return;
      }

      // Handle 'g' followed by 'c' sequence
      if (event.key === 'g') {
        const handleSecondKey = (secondEvent: KeyboardEvent) => {
          if (secondEvent.key === 'c' && selectedProject) {
            secondEvent.preventDefault();
            navigate(`/projects/${selectedProject}/communications`);
          }
          document.removeEventListener('keydown', handleSecondKey);
        };
        
        // Listen for the next keypress within 1 second
        document.addEventListener('keydown', handleSecondKey);
        setTimeout(() => {
          document.removeEventListener('keydown', handleSecondKey);
        }, 1000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, navigate]);

  const handleProjectChange = (projectId: string | null) => {
    setSelectedProject(projectId);
    if (projectId) {
      navigate(`/projects/${projectId}`);
      setActiveView('dashboard');
    } else {
      navigate('/projects');
      setActiveView('portfolio');
    }
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    if (view === 'portfolio') {
      setSelectedProject(null);
      navigate('/projects');
    } else if (selectedProject) {
      navigate(`/projects/${selectedProject}`);
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="index-page">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <div className="flex items-center gap-4">
            <ProjectSwitcher
              selectedProject={selectedProject}
              onProjectChange={handleProjectChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <VoiceControl />
            <RoleToggle />
            <SettingsModal />
          </div>
        </div>

        {/* Role Context Banner */}
        <RoleContextBanner />

        {/* View Toggle */}
        <ViewToggle
          activeView={activeView}
          onViewChange={handleViewChange}
          selectedProject={selectedProject}
        />

        {/* Main Content */}
        <MainContent
          selectedProject={selectedProject}
          activeView={activeView}
          onProjectChange={handleProjectChange}
        />
      </div>
    </div>
  );
};

export default Index;
