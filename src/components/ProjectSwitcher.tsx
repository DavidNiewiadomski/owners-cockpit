
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Building, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'on-hold' | 'completed';
  progress: number;
}

interface ProjectSwitcherProps {
  selectedProject: string | null;
  onProjectChange: (projectId: string) => void;
  variant?: 'compact' | 'expanded';
}

const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({ 
  selectedProject, 
  onProjectChange,
  variant = 'compact'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock projects - in real implementation, this would come from your database
  const projects: Project[] = [
    { id: '1', name: 'Downtown Office Complex', status: 'active', progress: 68 },
    { id: '2', name: 'Riverside Residential', status: 'active', progress: 42 },
    { id: '3', name: 'Tech Campus Phase 2', status: 'on-hold', progress: 25 },
    { id: '4', name: 'Retail Plaza Renovation', status: 'completed', progress: 100 },
  ];

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'on-hold': return 'secondary';
      case 'completed': return 'outline';
      default: return 'default';
    }
  };

  if (variant === 'expanded') {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Select Project</h3>
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`p-4 cursor-pointer transition-colors neumorphic-card ${
                selectedProject === project.id
                  ? 'ring-2 ring-primary'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onProjectChange(project.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{project.name}</h4>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {project.progress}% complete
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="neumorphic-button min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span className="truncate">
              {selectedProjectData?.name || 'Select Project'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-2" align="start">
        <div className="space-y-1">
          <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
            Recent Projects
          </div>
          
          {projects.map((project) => (
            <Button
              key={project.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              onClick={() => {
                onProjectChange(project.id);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 text-left">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {project.progress}% complete
                  </div>
                </div>
                <Badge variant={getStatusColor(project.status)} className="ml-2">
                  {project.status}
                </Badge>
              </div>
            </Button>
          ))}
          
          <div className="border-t pt-2">
            <Button variant="ghost" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectSwitcher;
