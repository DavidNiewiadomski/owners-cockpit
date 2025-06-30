
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
  const { data: projects = [], isLoading } = useProjects();
  const { access } = useRoleBasedAccess();

  console.log('🚨 ProjectSwitcher - projects loaded:', projects);
  console.log('🚨 ProjectSwitcher - isLoading:', isLoading);
  console.log('🚨 ProjectSwitcher - selectedProject:', selectedProject);

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
            className="w-[300px] justify-between text-high-contrast border-2 border-charter-navy/20 dark:border-white/20 hover:border-charter-navy/40 dark:hover:border-white/40 bg-white dark:bg-card font-medium"
          >
            <span className="text-charter-navy dark:text-white font-medium">
              {currentProject ? currentProject.name : "Select project..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-white dark:bg-card border-2 border-charter-navy/20 dark:border-white/20">
          <Command className="bg-white dark:bg-card">
            <CommandInput 
              placeholder="Search projects..." 
              className="text-charter-navy dark:text-white placeholder:text-charter-navy/60 dark:placeholder:text-white/60"
            />
            <CommandList>
              <CommandEmpty className="text-charter-navy dark:text-white py-4 text-center">
                {isLoading ? "Loading projects..." : "No projects found."}
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => handleProjectSelect(null)}
                  className="cursor-pointer text-charter-navy dark:text-white hover:bg-charter-navy/10 dark:hover:bg-white/10 data-[selected]:bg-charter-navy/10 dark:data-[selected]:bg-white/10"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-charter-navy dark:text-white",
                      !selectedProject ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-medium">Portfolio View</span>
                </CommandItem>
                <CommandSeparator className="bg-charter-navy/20 dark:bg-white/20" />
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.name}
                    onSelect={() => handleProjectSelect(project.id)}
                    className="cursor-pointer text-charter-navy dark:text-white hover:bg-charter-navy/10 dark:hover:bg-white/10 data-[selected]:bg-charter-navy/10 dark:data-[selected]:bg-white/10"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-charter-navy dark:text-white",
                        selectedProject === project.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-medium">{project.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {access.canCreateProjects && (
                <>
                  <CommandSeparator className="bg-charter-navy/20 dark:bg-white/20" />
                  <CommandGroup>
                    <CommandItem className="cursor-pointer text-charter-navy dark:text-white hover:bg-charter-navy/10 dark:hover:bg-white/10 data-[selected]:bg-charter-navy/10 dark:data-[selected]:bg-white/10">
                      <Plus className="mr-2 h-4 w-4 text-charter-navy dark:text-white" />
                      <span className="font-medium">Create Project</span>
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
    </div>
  );
};

export default ProjectSwitcher;
