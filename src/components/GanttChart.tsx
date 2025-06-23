
import React, { useMemo } from 'react';
import { Task } from '@/hooks/useTasks';
import { format, differenceInDays, startOfDay } from 'date-fns';

interface GanttChartProps {
  tasks: Task[];
  height?: number;
  className?: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ 
  tasks, 
  height = 200,
  className = ''
}) => {
  const chartData = useMemo(() => {
    if (tasks.length === 0) return { bars: [], dateRange: { start: new Date(), end: new Date() } };

    // Find date range
    const allDates = tasks.flatMap(task => [task.startDate, task.endDate]);
    const minDate = startOfDay(new Date(Math.min(...allDates.map(d => d.getTime()))));
    const maxDate = startOfDay(new Date(Math.max(...allDates.map(d => d.getTime()))));
    const totalDays = differenceInDays(maxDate, minDate) + 1;

    const barHeight = Math.max(20, (height - 40) / tasks.length);
    const chartWidth = 300;

    const bars = tasks.map((task, index) => {
      const startOffset = differenceInDays(startOfDay(task.startDate), minDate);
      const duration = differenceInDays(startOfDay(task.endDate), startOfDay(task.startDate)) + 1;
      
      const x = (startOffset / totalDays) * chartWidth;
      const width = (duration / totalDays) * chartWidth;
      const y = index * (barHeight + 8) + 20;

      const progressWidth = (width * task.progress) / 100;

      return {
        task,
        x,
        y,
        width,
        progressWidth,
        barHeight: barHeight - 4,
      };
    });

    return { bars, dateRange: { start: minDate, end: maxDate } };
  }, [tasks, height]);

  const getPriorityColor = (priority: number, isLate: boolean) => {
    if (isLate) return '#ef4444'; // red for late tasks
    
    if (priority >= 3) return '#f59e0b'; // amber for high priority
    if (priority === 2) return '#3b82f6'; // blue for medium priority
    return '#10b981'; // emerald for low priority
  };

  if (tasks.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 text-muted-foreground ${className}`}>
        No tasks to display
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`} className="overflow-visible">
        {/* Timeline grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1={fraction * 300}
            y1={10}
            x2={fraction * 300}
            y2={height - 10}
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* Task bars */}
        {chartData.bars.map(({ task, x, y, width, progressWidth, barHeight }) => (
          <g key={task.id}>
            {/* Background bar */}
            <rect
              x={x}
              y={y}
              width={width}
              height={barHeight}
              fill={getPriorityColor(task.priority, task.isLate || false)}
              opacity="0.2"
              rx="2"
            />
            
            {/* Progress bar */}
            <rect
              x={x}
              y={y}
              width={progressWidth}
              height={barHeight}
              fill={getPriorityColor(task.priority, task.isLate || false)}
              rx="2"
            />

            {/* Task name (if space allows) */}
            {width > 60 && (
              <text
                x={x + 4}
                y={y + barHeight / 2 + 3}
                fontSize="10"
                fill="hsl(var(--foreground))"
                className="font-medium"
              >
                {task.name.length > 12 ? `${task.name.slice(0, 12)}...` : task.name}
              </text>
            )}

            {/* Late indicator */}
            {task.isLate && (
              <circle
                cx={x + width - 6}
                cy={y + 6}
                r="3"
                fill="#ef4444"
                className="animate-pulse"
              />
            )}
          </g>
        ))}

        {/* Date labels */}
        <text
          x="2"
          y="12"
          fontSize="8"
          fill="hsl(var(--muted-foreground))"
          className="font-mono"
        >
          {format(chartData.dateRange.start, 'MMM dd')}
        </text>
        <text
          x="260"
          y="12"
          fontSize="8"
          fill="hsl(var(--muted-foreground))"
          className="font-mono"
          textAnchor="end"
        >
          {format(chartData.dateRange.end, 'MMM dd')}
        </text>
      </svg>
    </div>
  );
};

export default GanttChart;
