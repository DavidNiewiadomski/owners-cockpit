import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Folder } from 'lucide-react';
import { useProjects, useCreateProject, Project } from '@/hooks/useProjects';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ProjectSwitcherProps {
  selectedProject: string | null;
  onProjectChange: (projectId: string | null) => void;
  variant?: 'compact' | 'expanded';
}

const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({
  selectedProject,
  onProjectChange,
  variant = 'compact'
}) => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const { data: projects = [], isLoading, error } = useProjects();
  const createProjectMutation = useCreateProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  console.log('ProjectSwitcher - Projects:', projects, 'Loading:', isLoading, 'Error:', error);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const newProject = await createProjectMutation.mutateAsync({
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined,
        status: 'planning' as const,
      });

      // Refresh the projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // Select the new project
      onProjectChange(newProject.id);
      
      // Reset form and close dialog
      setNewProjectName('');
      setNewProjectDescription('');
      setIsNewProjectOpen(false);
      
      toast({
        title: "Project created",
        description: `${newProject.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPlaceholderText = () => {
    if (isLoading) return "Loading projects...";
    if (error) return "Error loading projects";
    if (projects.length === 0) return "No projects found";
    return "Select project";
  };

  if (variant === 'expanded') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Select Project</h3>
        </div>

        {/* Portfolio Button */}
        <Button
          variant={selectedProject === null ? "default" : "outline"}
          className="justify-start text-left h-auto p-3 w-full mb-2"
          onClick={() => onProjectChange(null)}
        >
          <div>
            <div className="font-medium">Portfolio Dashboard</div>
            <div className="text-sm text-muted-foreground mt-1">
              View all projects and portfolio metrics
            </div>
          </div>
        </Button>
        
        {isLoading ? (
          <div className="text-muted-foreground">Loading projects...</div>
        ) : error ? (
          <div className="text-destructive">Error loading projects. Check your database connection.</div>
        ) : projects.length === 0 ? (
          <div className="text-muted-foreground">No projects found. Create your first project to get started.</div>
        ) : (
          <div className="grid gap-2">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant={selectedProject === project.id ? "default" : "outline"}
                className="justify-start text-left h-auto p-3"
                onClick={() => onProjectChange(project.id)}
              >
                <div>
                  <div className="font-medium">{project.name}</div>
                  {project.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1 capitalize">
                    Status: {project.status?.replace('_', ' ')}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}

        <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                />
              </div>
              <Button 
                onClick={handleCreateProject} 
                className="w-full"
                disabled={!newProjectName.trim()}
              >
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedProject === null ? "portfolio" : (selectedProject || "")} 
        onValueChange={(value) => onProjectChange(value === "portfolio" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={selectedProject === null ? "Portfolio" : getPlaceholderText()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="portfolio">Portfolio Dashboard</SelectItem>
          {!isLoading && !error && projects.length > 0 && (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Enter project description"
              />
            </div>
            <Button 
              onClick={handleCreateProject} 
              className="w-full"
              disabled={!newProjectName.trim()}
            >
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectSwitcher;
