
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleKPIProps {
  projectId?: string;
}

const ScheduleKPI: React.FC<ScheduleKPIProps> = ({ projectId }) => {
  // Mock data
  const scheduleData = {
    totalTasks: 156,
    completedTasks: 89,
    daysAhead: 3,
    upcomingMilestones: 4
  };

  const completionPercentage = (scheduleData.completedTasks / scheduleData.totalTasks) * 100;

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Schedule Progress</h3>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <Clock className="w-3 h-3" />
          {scheduleData.daysAhead} days ahead
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tasks Completed</span>
            <span>{scheduleData.completedTasks}/{scheduleData.totalTasks}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Completion</span>
            <div className="font-medium">{completionPercentage.toFixed(1)}%</div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Milestones</span>
              <div className="font-medium">{scheduleData.upcomingMilestones}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleKPI;
