
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import GanttChart from '@/components/GanttChart';
import { cn } from '@/lib/utils';

interface TimelineCardProps {
  projectId: string;
  className?: string;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ projectId, className }) => {
  const { data: tasksData, isLoading, error } = useTasks({ projectId, limit: 8 });

  if (isLoading) {
    return (
      <Card className={cn("neumorphic-card", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <div className="animate-pulse">Loading timeline...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !tasksData) {
    return (
      <Card className={cn("neumorphic-card", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Failed to load timeline
          </div>
        </CardContent>
      </Card>
    );
  }

  const { tasks } = tasksData;
  const lateTasks = tasks.filter(task => task.isLate);
  const avgProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0;

  return (
    <Card className={cn("neumorphic-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Project Timeline
          </div>
          <div className="flex items-center gap-2">
            {lateTasks.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {lateTasks.length} Late
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              {avgProgress}% Complete
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mini Gantt Chart */}
        <div className="bg-muted/20 rounded-lg p-3">
          <GanttChart tasks={tasks} height={Math.max(160, tasks.length * 28 + 40)} />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Tasks</div>
            <div className="text-lg font-semibold">{tasks.length}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">On Track</div>
            <div className="text-lg font-semibold text-green-600">
              {tasks.length - lateTasks.length}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Overdue</div>
            <div className="text-lg font-semibold text-red-600">
              {lateTasks.length}
            </div>
          </div>
        </div>

        {/* Late Tasks List */}
        {lateTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-red-600">
              <Clock className="w-4 h-4" />
              Overdue Tasks
            </div>
            <div className="space-y-1">
              {lateTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-2 border-red-500"
                >
                  <div className="text-sm font-medium">{task.name}</div>
                  <Badge variant="outline" className="text-xs text-red-600">
                    {task.progress}%
                  </Badge>
                </div>
              ))}
              {lateTasks.length > 3 && (
                <div className="text-xs text-muted-foreground text-center py-1">
                  +{lateTasks.length - 3} more overdue tasks
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimelineCard;
