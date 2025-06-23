
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import ProjectSwitcher from '@/components/ProjectSwitcher';
import GanttChart from '@/components/GanttChart';
import ChatWindow from '@/components/ChatWindow';
import InsightSidebar from '@/components/InsightSidebar';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ 
    projectId: selectedProject || '', 
    limit: 20 
  });

  // Auto-select first project for demo
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const tasks = tasksData?.tasks || [];
  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    notStarted: tasks.filter(t => t.status === 'not_started').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  const completionPercentage = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'not_started': return 'bg-gray-400';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'not_started': return 'outline';
      case 'blocked': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Owners Cockpit</h1>
              <p className="text-muted-foreground">Construction Project Management</p>
            </div>
            <ProjectSwitcher 
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              variant="compact"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {selectedProjectData ? (
          <div className="space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {selectedProjectData.name}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {selectedProjectData.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant={selectedProjectData.status === 'active' ? 'default' : 'secondary'}>
                      {selectedProjectData.status?.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {selectedProjectData.start_date && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedProjectData.start_date).toLocaleDateString()} - 
                        {selectedProjectData.end_date ? new Date(selectedProjectData.end_date).toLocaleDateString() : 'Ongoing'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">{completionPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                  <Progress value={completionPercentage} className="w-32 mt-2" />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blocked</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{taskStats.blocked}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="chat">AI Assistant</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Tasks</CardTitle>
                      <CardDescription>Latest project activities and milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tasksLoading ? (
                          <div>Loading tasks...</div>
                        ) : tasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                              <div>
                                <p className="font-medium">{task.name}</p>
                                <p className="text-sm text-muted-foreground">{task.assigned_to}</p>
                              </div>
                            </div>
                            <Badge variant={getStatusBadgeVariant(task.status) as any}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Health</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Schedule Adherence</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} />
                        
                        <div className="flex items-center justify-between">
                          <span>Budget Utilization</span>
                          <span className="font-medium">72%</span>
                        </div>
                        <Progress value={72} />
                        
                        <div className="flex items-center justify-between">
                          <span>Quality Score</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>Gantt chart view of project tasks and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GanttChart tasks={tasks} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      AI Construction Assistant
                    </CardTitle>
                    <CardDescription>
                      Ask questions about your project, get insights, and receive construction guidance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChatWindow selectedProject={selectedProject} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Project Insights
                    </CardTitle>
                    <CardDescription>AI-generated insights and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InsightSidebar selectedProject={selectedProject} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              {projectsLoading ? 'Loading projects...' : 'No project selected'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {projectsLoading ? 'Please wait while we load your projects.' : 'Select a project from the dropdown above to get started.'}
            </p>
            {!projectsLoading && projects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No projects found. The demo data should be available shortly.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
