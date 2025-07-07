import React, { useMemo } from 'react';
import { format, differenceInDays, addDays } from 'date-fns';
import type { TimelineEvent } from '@/types/rfp';

interface TimelineChartProps {
  events: TimelineEvent[];
  startDate: string;
  endDate: string;
}

export function TimelineChart({ events, startDate, endDate }: TimelineChartProps) {
  const totalDays = differenceInDays(new Date(endDate), new Date(startDate));

  const chartData = useMemo(() => {
    // Sort events by date
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate positions and dimensions
    return sortedEvents.map(event => {
      const eventStart = new Date(event.date);
      const daysFromStart = differenceInDays(eventStart, new Date(startDate));
      const durationDays = event.duration || 0;
      
      const left = (daysFromStart / totalDays) * 100;
      const width = (durationDays / totalDays) * 100;

      return {
        ...event,
        left: `${left}%`,
        width: `${width}%`,
      };
    });
  }, [events, startDate, endDate, totalDays]);

  // Calculate month markers
  const monthMarkers = useMemo(() => {
    const markers = [];
    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate).getTime();

    while (currentDate.getTime() <= endDateTime) {
      const daysFromStart = differenceInDays(currentDate, new Date(startDate));
      markers.push({
        date: format(currentDate, 'MMM yyyy'),
        position: `${(daysFromStart / totalDays) * 100}%`,
      });
      currentDate = addDays(currentDate, 30); // Approximate month
    }

    return markers;
  }, [startDate, endDate, totalDays]);

  return (
    <div className="w-full">
      {/* Month markers */}
      <div className="relative h-6 mb-2">
        {monthMarkers.map((marker, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2"
            style={{ left: marker.position }}
          >
            <div className="h-2 w-px bg-border" />
            <div className="text-xs text-muted-foreground mt-1">
              {marker.date}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline grid */}
      <div className="relative border rounded-lg p-4">
        <div className="absolute inset-4">
          {/* Vertical grid lines */}
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-l border-border/30 h-full first:border-l-0"
              />
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="relative space-y-4">
          {chartData.map((event) => (
            <div
              key={event.id}
              className="relative h-8"
              style={{ marginLeft: event.left }}
            >
              <div
                className={cn(
                  'absolute h-full rounded-md border flex items-center px-2 text-sm transition-colors',
                  event.type === 'milestone'
                    ? 'w-8 -ml-4 justify-center bg-primary/10 border-primary'
                    : event.type === 'deadline'
                    ? 'w-8 -ml-4 justify-center bg-destructive/10 border-destructive'
                    : 'bg-card border-border hover:border-primary',
                  event.criticalPath && 'border-orange-500 bg-orange-50',
                  event.status === 'completed' && 'bg-green-50 border-green-500'
                )}
                style={{
                  width: event.type === 'task' ? event.width : undefined,
                }}
              >
                {event.type === 'milestone' ? (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                ) : event.type === 'deadline' ? (
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                ) : (
                  <span className="truncate">{event.title}</span>
                )}
              </div>
              {event.type !== 'task' && (
                <div
                  className="absolute whitespace-nowrap text-sm"
                  style={{
                    top: '100%',
                    marginTop: '0.5rem',
                    left: event.type === 'milestone' ? '-4rem' : undefined,
                    right: event.type === 'deadline' ? '-4rem' : undefined,
                    textAlign: event.type === 'milestone' ? 'right' : 'left',
                  }}
                >
                  {event.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          Milestone
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-card border border-border" />
          Task
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          Deadline
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-50 border border-orange-500" />
          Critical Path
        </div>
      </div>
    </div>
  );
}
