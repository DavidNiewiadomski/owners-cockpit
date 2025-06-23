
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HardHat, Clock, Users, AlertTriangle, FileText, Wrench } from 'lucide-react';
import GanttChart from '@/components/GanttChart';
import { Task } from '@/types/tasks';

interface ConstructionDashboardProps {
  projectId: string;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId }) => {
  // Mock construction data
  const projectMetrics = {
    overallProgress: 68,
    budgetUtilization: 72,
    workforceCount: 45,
    safetyDays: 127,
    activeRFIs: 12,
    pendingSubmittals: 8
  };

  const tasks: Task[] = [
    {
      id: '1',
      name: 'Foundation Work',
      progress: 95,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-28'),
      priority: 'high',
      assignee: 'Foundation Crew',
      isLate: false
    },
    {
      id: '2',
      name: 'Structural Steel',
      progress: 75,
      startDate: new Date('2024-02-20'),
      endDate: new Date('2024-04-15'),
      priority: 'high',
      assignee: 'Steel Crew',
      isLate: false
    },
    {
      id: '3',
      name: 'MEP Rough-in',
      progress: 45,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-30'),
      priority: 'medium',
      assignee: 'MEP Contractors',
      isLate: true
    },
    {
      id: '4',
      name: 'Drywall & Finishes',
      progress: 15,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-15'),
      priority: 'medium',
      assignee: 'Finish Crew',
      isLate: false
    }
  ];

  const safetyIncidents = [
    { date: '2024-06-20', type: 'Near Miss', severity: 'Low', description: 'Unsecured ladder' },
    { date: '2024-06-15', type: 'First Aid', severity: 'Low', description: 'Minor cut' }
  ];

  return (
    <div className="space-y-6">
      {/* Construction KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics.overallProgress}%</div>
            <Progress value={projectMetrics.overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              On track for Q3 completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics.budgetUtilization}%</div>
            <Progress value={projectMetrics.budgetUtilization} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              $1.8M spent of $2.5M budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workforce</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics.workforceCount}</div>
            <p className="text-xs text-muted-foreground">
              Personnel on site today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Safety & Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardHat className="h-5 w-5 text-green-600" />
              Safety Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Days Without Incident</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {projectMetrics.safetyDays} days
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Safety Reports</h4>
                {safetyIncidents.map((incident, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{incident.date}: {incident.type}</span>
                    <Badge variant={incident.severity === 'Low' ? 'secondary' : 'destructive'}>
                      {incident.severity}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Safety Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              RFIs & Submittals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active RFIs</span>
                <Badge variant="outline">{projectMetrics.activeRFIs}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending Submittals</span>
                <Badge variant="outline">{projectMetrics.pendingSubmittals}</Badge>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Review RFIs
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Process Submittals
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Project Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <GanttChart tasks={tasks} height={250} />
        </CardContent>
      </Card>

      {/* Daily Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Daily Operations Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-medium">Weather Alert</h4>
              <p className="text-sm text-muted-foreground">Rain expected tomorrow. Consider adjusting concrete pour schedule.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Material Delivery</h4>
              <p className="text-sm text-muted-foreground">Steel delivery scheduled for 7 AM. Crane crew on standby.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Milestone Achievement</h4>
              <p className="text-sm text-muted-foreground">Foundation work completed ahead of schedule. Team recognized for quality work.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionDashboard;
