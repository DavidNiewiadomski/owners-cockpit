import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Users,
  Hammer,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

interface ScheduleTask {
  id: string;
  task: string;
  phase: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: 'on-track' | 'ahead' | 'behind' | 'completed';
  crew: string;
  dependencies?: string[];
  criticalPath: boolean;
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'upcoming' | 'at-risk';
  linkedTasks: string[];
}

const ConstructionSchedule: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [viewMode, setViewMode] = useState<'gantt' | 'list'>('list');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  // Mock schedule data
  const tasks: ScheduleTask[] = [
    {
      id: '1',
      task: 'Floor 10 - MEP Rough-in',
      phase: 'MEP Installation',
      startDate: '2024-12-10',
      endDate: '2024-12-20',
      duration: 10,
      progress: 65,
      status: 'on-track',
      crew: 'MEP Team A',
      criticalPath: true
    },
    {
      id: '2',
      task: 'Floor 9 - Electrical Conduit',
      phase: 'Electrical',
      startDate: '2024-12-12',
      endDate: '2024-12-18',
      duration: 6,
      progress: 80,
      status: 'ahead',
      crew: 'Electrical Team B',
      dependencies: ['1'],
      criticalPath: false
    },
    {
      id: '3',
      task: 'Floor 8 - HVAC Installation',
      phase: 'Mechanical',
      startDate: '2024-12-14',
      endDate: '2024-12-22',
      duration: 8,
      progress: 40,
      status: 'on-track',
      crew: 'HVAC Team C',
      criticalPath: true
    },
    {
      id: '4',
      task: 'Floor 7 - Plumbing Rough-in',
      phase: 'Plumbing',
      startDate: '2024-12-08',
      endDate: '2024-12-16',
      duration: 8,
      progress: 95,
      status: 'on-track',
      crew: 'Plumbing Team D',
      criticalPath: false
    },
    {
      id: '5',
      task: 'Exterior Facade - North Side',
      phase: 'Exterior',
      startDate: '2024-12-05',
      endDate: '2024-12-25',
      duration: 20,
      progress: 30,
      status: 'behind',
      crew: 'Facade Team E',
      criticalPath: true
    }
  ];

  const milestones: Milestone[] = [
    {
      id: 'm1',
      name: 'MEP Systems 50% Complete',
      date: '2024-12-20',
      status: 'upcoming',
      linkedTasks: ['1', '2', '3']
    },
    {
      id: 'm2',
      name: 'Floor 7-10 Rough-in Complete',
      date: '2024-12-25',
      status: 'at-risk',
      linkedTasks: ['1', '2', '3', '4']
    },
    {
      id: 'm3',
      name: 'Exterior Weatherproofing',
      date: '2025-01-10',
      status: 'upcoming',
      linkedTasks: ['5']
    }
  ];

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const criticalPathTasks = tasks.filter(t => t.criticalPath).length;
  const behindSchedule = tasks.filter(t => t.status === 'behind').length;
  const overallProgress = Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedPhase === 'all') return true;
    if (selectedPhase === 'critical') return task.criticalPath;
    return task.phase === selectedPhase;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on-track': return 'bg-blue-100 text-blue-700';
      case 'ahead': return 'bg-purple-100 text-purple-700';
      case 'behind': return 'bg-red-100 text-red-700';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      case 'at-risk': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead': return <TrendingUp className="h-4 w-4" />;
      case 'behind': return <TrendingDown className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Construction Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Track progress, manage dependencies, and monitor critical path activities
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Update Schedule
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
              <Hammer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Across all active tasks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Path</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{criticalPathTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Tasks affecting completion
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Schedule Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {behindSchedule > 0 ? (
                  <span className="text-red-400">-2 days</span>
                ) : (
                  <span className="text-green-400">On Time</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {behindSchedule} tasks behind schedule
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Crews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5</div>
              <div className="text-xs text-muted-foreground mt-1">
                Teams working today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Toggle */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button
                  variant={selectedPhase === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('all')}
                  size="sm"
                >
                  All Phases
                </Button>
                <Button
                  variant={selectedPhase === 'critical' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('critical')}
                  size="sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Critical Path
                </Button>
                <Button
                  variant={selectedPhase === 'MEP Installation' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('MEP Installation')}
                  size="sm"
                >
                  MEP
                </Button>
                <Button
                  variant={selectedPhase === 'Exterior' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('Exterior')}
                  size="sm"
                >
                  Exterior
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  This Week
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">{milestone.name}</h4>
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {milestone.date}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Linked to {milestone.linkedTasks.length} tasks
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Schedule */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Active Tasks Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{task.task}</h3>
                        <Badge className={getStatusColor(task.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </Badge>
                        {task.criticalPath && (
                          <Badge variant="destructive">
                            Critical Path
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Phase:</span>
                          <span className="ml-2 text-foreground">{task.phase}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Start:</span>
                          <span className="ml-2 text-foreground">{task.startDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End:</span>
                          <span className="ml-2 text-foreground">{task.endDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 text-foreground">{task.duration} days</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Crew:</span>
                          <span className="ml-2 text-foreground">{task.crew}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium text-foreground">{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                        {task.dependencies && (
                          <div className="text-sm text-muted-foreground">
                            Dependencies: {task.dependencies.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Schedule Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Tasks Ahead of Schedule</span>
                  <div className="flex items-center gap-2">
                    <Progress value={20} className="w-20" />
                    <span className="text-sm font-medium text-purple-400">1</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Tasks On Track</span>
                  <div className="flex items-center gap-2">
                    <Progress value={60} className="w-20" />
                    <span className="text-sm font-medium text-blue-400">3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Tasks Behind Schedule</span>
                  <div className="flex items-center gap-2">
                    <Progress value={20} className="w-20" />
                    <span className="text-sm font-medium text-red-400">1</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Schedule Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Weather Delay Risk</div>
                      <div className="text-xs text-muted-foreground">Exterior facade work may be impacted by forecasted rain</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Resource Conflict</div>
                      <div className="text-xs text-muted-foreground">MEP teams needed on multiple floors simultaneously</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConstructionSchedule;