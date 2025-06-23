
import { useState } from 'react';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, Calendar } from 'lucide-react';
import ChatWindow from '@/components/ChatWindow';
import GanttChart from '@/components/GanttChart';
import { useTasks } from '@/hooks/useTasks';
import { format } from 'date-fns';

export function ProjectDashboard() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    start_date: '',
    end_date: '',
  });

  const { data: tasksData } = useTasks({ 
    projectId: selectedProject || '', 
    limit: 10 
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject.mutateAsync(newProject);
    setShowCreateDialog(false);
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      start_date: '',
      end_date: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  const currentProject = projects?.find(p => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Owners Cockpit</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedProject ? (
          /* Project Selection View */
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Your Projects</h2>
                <p className="text-gray-600 mt-1">Select a project to view details and manage tasks</p>
              </div>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new construction project to your dashboard
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <Input
                      placeholder="Project Name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      required
                    />
                    <Textarea
                      placeholder="Project Description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                    <Select 
                      value={newProject.status} 
                      onValueChange={(value) => setNewProject({ ...newProject, status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Project Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        placeholder="Start Date"
                        value={newProject.start_date}
                        onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                      />
                      <Input
                        type="date"
                        placeholder="End Date"
                        value={newProject.end_date}
                        onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={createProject.isPending}>
                      {createProject.isPending ? 'Creating...' : 'Create Project'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {projects?.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-6">Create your first construction project to get started</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                  <Card 
                    key={project.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {project.description && (
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {project.start_date 
                              ? format(new Date(project.start_date), 'MMM d, yyyy')
                              : 'No start date'
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Project Detail View */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProject(null)}
                >
                  ← Back to Projects
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentProject?.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(currentProject?.status || '')}>
                      {currentProject?.status?.replace('_', ' ')}
                    </Badge>
                    {currentProject?.start_date && (
                      <span className="text-gray-600 text-sm">
                        Started {format(new Date(currentProject.start_date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Gantt chart view of project tasks and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <GanttChart tasks={tasksData?.tasks || []} />
              </CardContent>
            </Card>

            {/* AI Chat Assistant */}
            <Card>
              <CardHeader>
                <CardTitle>AI Project Assistant</CardTitle>
                <CardDescription>
                  Ask questions about your project data, get insights, and receive recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatWindow projectId={selectedProject} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
