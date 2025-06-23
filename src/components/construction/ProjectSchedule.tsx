
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GanttChart from '@/components/GanttChart';
import { Task } from '@/types/tasks';

interface ProjectScheduleProps {
  tasks: Task[];
}

const ProjectSchedule: React.FC<ProjectScheduleProps> = ({ tasks }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <GanttChart tasks={tasks} height={250} />
      </CardContent>
    </Card>
  );
};

export default ProjectSchedule;
