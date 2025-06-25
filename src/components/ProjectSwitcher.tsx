
import React, { useState } from 'react';
import { Check, ChevronsUpDown, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useProjects } from '@/hooks/useProjects';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import CreateProjectModal from '@/components/CreateProjectModal';

interface ProjectSwitcherProps {
  selectedProject: string | null;
  onProjectChange: (projectId: string | null) => void;
  onSettingsToggle?: () => void;
}

const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({
  selectedProject,
  onProjectChange,
  onSettingsToggle,
}) => {
  const [open, setOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: projects = [], isLoading } = useProjects();
  const { access } = useRoleBasedAccess();

  const currentProject = projects.find(p => p.id === selectedProject);

  const handleProjectSelect = (projectId: string | null) => {
    onProjectChange(projectId);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {currentProject ? currentProject.name : "Select project..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search projects..." />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading projects..." : "No projects found."}
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => handleProjectSelect(null)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !selectedProject ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Portfolio View
                </CommandItem>
                <CommandSeparator />
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.name}
                    onSelect={() => handleProjectSelect(project.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProject === project.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {access.canCreateProjects && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem 
                      className="cursor-pointer"
                      onSelect={() => {
                        setOpen(false);
                        setShowCreateModal(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Project-specific actions */}
      {selectedProject && onSettingsToggle && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsToggle}
            className="h-8 px-2"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      )}
      
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(projectId) => {
          onProjectChange(projectId);
        }}
      />
    </div>
  );
};

export default ProjectSwitcher;
