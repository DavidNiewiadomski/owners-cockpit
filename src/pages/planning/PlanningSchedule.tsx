import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target,
  Users,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Milestone,
  Flag,
  TrendingUp
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

interface PlanningTask {
  id: string;
  task: string;
  phase: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  owner: string;
  dependencies?: string[];
  deliverables?: string[];
}

interface PlanningMilestone {
  id: string;
  name: string;
  date: string;
  status: 'achieved' | 'on-track' | 'at-risk' | 'missed';
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
}

const PlanningSchedule: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('list');

  // Mock planning tasks
  const planningTasks: PlanningTask[] = [
    // Pre-Development Phase
    {
      id: '1',
      task: 'Market Research & Analysis',
      phase: 'Pre-Development',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      duration: 30,
      progress: 100,
      status: 'completed',
      owner: 'Market Research Team',
      deliverables: ['Market Analysis Report', 'Competitor Assessment', 'Demand Forecast']
    },
    {
      id: '2',
      task: 'Site Selection & Due Diligence',
      phase: 'Pre-Development',
      startDate: '2024-02-01',
      endDate: '2024-03-15',
      duration: 45,
      progress: 100,
      status: 'completed',
      owner: 'Development Team',
      dependencies: ['1'],
      deliverables: ['Site Evaluation Matrix', 'Due Diligence Report']
    },
    {
      id: '3',
      task: 'Financial Feasibility Study',
      phase: 'Pre-Development',
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      duration: 30,
      progress: 100,
      status: 'completed',
      owner: 'Finance Team',
      dependencies: ['2'],
      deliverables: ['Financial Model', 'ROI Analysis', 'Funding Strategy']
    },
    // Design Phase
    {
      id: '4',
      task: 'Conceptual Design Development',
      phase: 'Design',
      startDate: '2024-04-01',
      endDate: '2024-05-15',
      duration: 45,
      progress: 100,
      status: 'completed',
      owner: 'Architecture Team',
      dependencies: ['3'],
      deliverables: ['Concept Drawings', 'Massing Studies', 'Program Layout']
    },
    {
      id: '5',
      task: 'Schematic Design',
      phase: 'Design',
      startDate: '2024-05-15',
      endDate: '2024-07-01',
      duration: 45,
      progress: 100,
      status: 'completed',
      owner: 'Design Team',
      dependencies: ['4'],
      deliverables: ['Schematic Drawings', 'Design Narrative', 'Preliminary Specs']
    },
    {
      id: '6',
      task: 'Design Development',
      phase: 'Design',
      startDate: '2024-07-01',
      endDate: '2024-09-15',
      duration: 75,
      progress: 85,
      status: 'in-progress',
      owner: 'Design Team',
      dependencies: ['5'],
      deliverables: ['DD Drawings', 'MEP Coordination', 'Material Selections']
    },
    // Approvals Phase
    {
      id: '7',
      task: 'Zoning & Land Use Approvals',
      phase: 'Approvals',
      startDate: '2024-08-01',
      endDate: '2024-10-30',
      duration: 90,
      progress: 70,
      status: 'in-progress',
      owner: 'Legal Team',
      dependencies: ['5'],
      deliverables: ['Zoning Approval', 'Special Permits', 'Variances']
    },
    {
      id: '8',
      task: 'Building Permit Application',
      phase: 'Approvals',
      startDate: '2024-10-01',
      endDate: '2024-12-30',
      duration: 90,
      progress: 35,
      status: 'in-progress',
      owner: 'Permit Expeditor',
      dependencies: ['6', '7'],
      deliverables: ['Building Permit', 'Trade Permits']
    },
    // Pre-Construction Phase
    {
      id: '9',
      task: 'Construction Documentation',
      phase: 'Pre-Construction',
      startDate: '2024-09-15',
      endDate: '2024-12-01',
      duration: 75,
      progress: 60,
      status: 'in-progress',
      owner: 'Architecture Team',
      dependencies: ['6'],
      deliverables: ['Construction Drawings', 'Specifications', 'Details']
    },
    {
      id: '10',
      task: 'Contractor Selection & Bidding',
      phase: 'Pre-Construction',
      startDate: '2024-11-01',
      endDate: '2025-01-15',
      duration: 75,
      progress: 25,
      status: 'in-progress',
      owner: 'Procurement Team',
      dependencies: ['9'],
      deliverables: ['Bid Packages', 'Contractor Proposals', 'GMP Contract']
    },
    {
      id: '11',
      task: 'Value Engineering',
      phase: 'Pre-Construction',
      startDate: '2025-01-15',
      endDate: '2025-02-15',
      duration: 30,
      progress: 0,
      status: 'upcoming',
      owner: 'Project Team',
      dependencies: ['10'],
      deliverables: ['VE Log', 'Cost Savings Report']
    },
    {
      id: '12',
      task: 'Construction Mobilization',
      phase: 'Pre-Construction',
      startDate: '2025-02-15',
      endDate: '2025-03-01',
      duration: 15,
      progress: 0,
      status: 'upcoming',
      owner: 'Construction Manager',
      dependencies: ['8', '11'],
      deliverables: ['Site Setup', 'Safety Plan', 'Schedule']
    }
  ];

  const milestones: PlanningMilestone[] = [
    {
      id: 'm1',
      name: 'Site Acquisition Complete',
      date: '2024-03-15',
      status: 'achieved',
      description: 'Successfully acquired prime downtown site',
      impact: 'critical'
    },
    {
      id: 'm2',
      name: 'Design Development 50%',
      date: '2024-08-15',
      status: 'achieved',
      description: 'Major design decisions finalized',
      impact: 'high'
    },
    {
      id: 'm3',
      name: 'Zoning Approval',
      date: '2024-10-30',
      status: 'on-track',
      description: 'Final zoning approval for mixed-use development',
      impact: 'critical'
    },
    {
      id: 'm4',
      name: 'Building Permit Issued',
      date: '2024-12-30',
      status: 'at-risk',
      description: 'All permits required for construction start',
      impact: 'critical'
    },
    {
      id: 'm5',
      name: 'Construction Start',
      date: '2025-03-01',
      status: 'on-track',
      description: 'Break ground and begin construction',
      impact: 'critical'
    }
  ];

  // Calculate statistics
  const totalTasks = planningTasks.length;
  const completedTasks = planningTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = planningTasks.filter(t => t.status === 'in-progress').length;
  const upcomingTasks = planningTasks.filter(t => t.status === 'upcoming').length;
  const overallProgress = Math.round(planningTasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks);

  // Filter tasks
  const filteredTasks = planningTasks.filter(task => {
    if (selectedPhase === 'all') return true;
    return task.phase === selectedPhase;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'achieved': return 'bg-green-100 text-green-700';
      case 'in-progress':
      case 'on-track': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      case 'delayed':
      case 'at-risk':
      case 'missed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Planning Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Pre-construction planning timeline and milestones
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Update Timeline
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Planning phase
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Of {totalTasks} tasks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{inProgressTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Active tasks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{upcomingTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Scheduled tasks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days to Start</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">75</div>
              <div className="text-xs text-muted-foreground mt-1">
                Construction start
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Filter */}
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
                  variant={selectedPhase === 'Pre-Development' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('Pre-Development')}
                  size="sm"
                >
                  Pre-Development
                </Button>
                <Button
                  variant={selectedPhase === 'Design' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('Design')}
                  size="sm"
                >
                  Design
                </Button>
                <Button
                  variant={selectedPhase === 'Approvals' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('Approvals')}
                  size="sm"
                >
                  Approvals
                </Button>
                <Button
                  variant={selectedPhase === 'Pre-Construction' ? 'default' : 'outline'}
                  onClick={() => setSelectedPhase('Pre-Construction')}
                  size="sm"
                >
                  Pre-Construction
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Current Month
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Milestones */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Milestone className="h-5 w-5 text-muted-foreground" />
              Key Planning Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">{milestone.name}</h4>
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{milestone.date}</span>
                    </div>
                    <Badge className={getImpactColor(milestone.impact)}>
                      {milestone.impact} impact
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Planning Tasks */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Planning Tasks & Activities
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
                          {task.status}
                        </Badge>
                        <Badge variant="outline">{task.phase}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
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
                          <span className="text-muted-foreground">Owner:</span>
                          <span className="ml-2 text-foreground">{task.owner}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium text-foreground">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                      {task.deliverables && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {task.deliverables.map((deliverable, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {task.dependencies && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Dependencies: Task {task.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phase Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Phase Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Pre-Development</span>
                    <span className="text-sm text-muted-foreground">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Design</span>
                    <span className="text-sm text-muted-foreground">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Approvals</span>
                    <span className="text-sm text-muted-foreground">52%</span>
                  </div>
                  <Progress value={52} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Pre-Construction</span>
                    <span className="text-sm text-muted-foreground">21%</span>
                  </div>
                  <Progress value={21} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                Critical Path Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Building Permit at Risk</div>
                      <div className="text-xs text-muted-foreground">35% complete - may impact construction start</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Design Development</div>
                      <div className="text-xs text-muted-foreground">85% complete - on critical path</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Contractor Selection</div>
                      <div className="text-xs text-muted-foreground">25% complete - proceeding on schedule</div>
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

export default PlanningSchedule;