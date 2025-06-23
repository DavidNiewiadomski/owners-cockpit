
import React, { useMemo } from 'react';
import { Task } from '@/types/tasks';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { motion } from 'framer-motion';

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

  const getPriorityColor = (priority: string, isLate: boolean) => {
    if (isLate) return '#ef4444'; // red for late tasks
    
    switch (priority) {
      case 'high':
        return '#f59e0b'; // amber
      case 'medium':
        return '#06b6d4'; // cyan - more futuristic
      case 'low':
        return '#10b981'; // emerald
      default:
        return '#6366f1'; // indigo - futuristic default
    }
  };

  if (tasks.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 text-cyan-400/60 font-mono ${className}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          No tasks to display
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full ${className}`}
    >
      <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm rounded-lg border border-cyan-500/20 p-4 shadow-xl shadow-cyan-500/5">
        <svg width="100%" height={height} viewBox={`0 0 300 ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
            <filter id="barGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.4"/>
            </filter>
            <filter id="progressGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodOpacity="0.6"/>
            </filter>
          </defs>

          {/* Futuristic background grid */}
          <rect width="300" height={height} fill="url(#timelineGradient)" opacity="0.3" />
          
          {/* Timeline grid lines with glow */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <motion.line
              key={fraction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: fraction * 0.2 }}
              x1={fraction * 300}
              y1={10}
              x2={fraction * 300}
              y2={height - 10}
              stroke="#06b6d4"
              strokeWidth="1"
              opacity="0.3"
              filter="url(#barGlow)"
            />
          ))}

          {/* Task bars with enhanced futuristic styling */}
          {chartData.bars.map(({ task, x, y, width, progressWidth, barHeight }, index) => (
            <motion.g
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Background bar with gradient */}
              <rect
                x={x}
                y={y}
                width={width}
                height={barHeight}
                fill={getPriorityColor(task.priority, task.isLate || false)}
                opacity="0.2"
                rx="4"
                filter="url(#barGlow)"
              />
              
              {/* Progress bar with enhanced glow */}
              <rect
                x={x}
                y={y}
                width={progressWidth}
                height={barHeight}
                fill={getPriorityColor(task.priority, task.isLate || false)}
                rx="4"
                filter="url(#progressGlow)"
              />

              {/* Animated progress shine effect */}
              <motion.rect
                x={x}
                y={y}
                width={progressWidth}
                height={barHeight}
                fill="url(#progressShine)"
                rx="4"
                opacity="0.3"
                initial={{ x: x - 20 }}
                animate={{ x: x + progressWidth + 20 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "linear"
                }}
              />

              {/* Task name with futuristic font */}
              {width > 60 && (
                <text
                  x={x + 6}
                  y={y + barHeight / 2 + 3}
                  fontSize="9"
                  fill="#e2e8f0"
                  className="font-mono font-medium"
                  filter="url(#progressGlow)"
                >
                  {task.name.length > 12 ? `${task.name.slice(0, 12)}...` : task.name}
                </text>
              )}

              {/* Enhanced late indicator with pulsing effect */}
              {task.isLate && (
                <motion.circle
                  cx={x + width - 6}
                  cy={y + 6}
                  r="4"
                  fill="#ef4444"
                  filter="url(#progressGlow)"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.g>
          ))}

          {/* Enhanced date labels */}
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            x="4"
            y="12"
            fontSize="8"
            fill="#06b6d4"
            className="font-mono font-medium"
            filter="url(#progressGlow)"
          >
            {format(chartData.dateRange.start, 'MMM dd')}
          </motion.text>
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            x="260"
            y="12"
            fontSize="8"
            fill="#06b6d4"
            className="font-mono font-medium"
            textAnchor="end"
            filter="url(#progressGlow)"
          >
            {format(chartData.dateRange.end, 'MMM dd')}
          </motion.text>

          {/* Additional gradient definitions */}
          <defs>
            <linearGradient id="progressShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
};

export default GanttChart;
