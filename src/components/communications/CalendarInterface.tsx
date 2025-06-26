import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Video, 
  Users, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'inspection' | 'delivery' | 'milestone' | 'deadline';
  time: string;
  duration: string;
  location?: string;
  attendees?: string[];
  description?: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  hasVideoCall?: boolean;
}

const CalendarInterface: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Sample calendar events for construction project
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Weekly Project Review',
      type: 'meeting',
      time: 'Today 2:00 PM',
      duration: '1 hour',
      location: 'Conference Room A / Zoom',
      attendees: ['Mike Rodriguez', 'Sarah Chen', 'James Wright', 'You'],
      description: 'Review weekly progress, discuss upcoming milestones, approve change orders',
      status: 'upcoming',
      priority: 'high',
      hasVideoCall: true
    },
    {
      id: '2',
      title: 'City Building Inspection',
      type: 'inspection',
      time: 'Tomorrow 10:00 AM',
      duration: '2 hours',
      location: 'Construction Site - Floors 1-3',
      attendees: ['Lisa Martinez (Inspector)', 'Mike Rodriguez', 'Tom Wilson'],
      description: 'Electrical rough-in inspection for floors 1-3',
      status: 'upcoming',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Steel Delivery',
      type: 'delivery',
      time: 'Monday 6:00 AM',
      duration: '3 hours',
      location: 'Construction Site - North Gate',
      attendees: ['Tony Sanchez (Driver)', 'Site Foreman'],
      description: 'Structural steel beams for floors 7-9 (47,500 lbs)',
      status: 'upcoming',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Lobby Design Presentation',
      type: 'meeting',
      time: 'Tuesday 10:00 AM',
      duration: '45 minutes',
      location: 'Design Studio / Teams',
      attendees: ['Sarah Chen', 'Lisa Wang', 'David Kim', 'You'],
      description: 'Present revised lobby designs, review material selections, get final approval',
      status: 'upcoming',
      priority: 'high',
      hasVideoCall: true
    },
    {
      id: '5',
      title: 'Q2 Milestone Completion',
      type: 'milestone',
      time: 'Friday',
      duration: 'All day',
      description: 'Structural steel installation for floors 1-6 complete',
      status: 'completed',
      priority: 'high'
    },
    {
      id: '6',
      title: 'HVAC Installation Start',
      type: 'milestone',
      time: 'Next Monday',
      duration: '2 weeks',
      location: 'Floors 4-6',
      description: 'Begin HVAC system installation with upgraded energy-efficient units',
      status: 'upcoming',
      priority: 'medium'
    },
    {
      id: '7',
      title: 'Insurance Policy Review',
      type: 'deadline',
      time: 'Wednesday',
      duration: '30 minutes',
      description: 'Review and approve updated building value insurance coverage',
      status: 'upcoming',
      priority: 'medium'
    }
  ];

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'inspection': return 'bg-red-500';
      case 'delivery': return 'bg-orange-500';
      case 'milestone': return 'bg-green-500';
      case 'deadline': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return Users;
      case 'inspection': return AlertCircle;
      case 'delivery': return MapPin;
      case 'milestone': return CheckCircle2;
      case 'deadline': return Clock;
      default: return Calendar;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 5);
  const todayEvents = events.filter(e => e.time.includes('Today'));

  return (
    <div className="h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-[#0078d4] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-semibold">Project Calendar</h2>
              <p className="text-blue-100">Construction schedule and meetings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white text-[#0078d4] hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
            <div className="flex items-center gap-1 bg-blue-600 rounded-lg">
              <Button 
                variant="ghost" 
                size="sm"
                className={`text-white hover:bg-blue-500 ${viewMode === 'month' ? 'bg-blue-500' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`text-white hover:bg-blue-500 ${viewMode === 'week' ? 'bg-blue-500' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`text-white hover:bg-blue-500 ${viewMode === 'day' ? 'bg-blue-500' : ''}`}
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(600px-100px)]">
        {/* Calendar Navigation & Today's Events */}
        <div className="w-80 border-r border-border bg-muted/30">
          {/* Month Navigation */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{formatDate(currentDate)}</h3>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Mini Calendar */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="p-2 font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {/* Calendar days would be rendered here */}
              {Array.from({ length: 35 }, (_, i) => (
                <div 
                  key={i} 
                  className={`p-2 cursor-pointer hover:bg-muted rounded ${
                    i === 15 ? 'bg-[#0078d4] text-white' : ''
                  }`}
                >
                  {i + 1 <= 31 ? i + 1 : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Events */}
          <div className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today's Schedule
            </h4>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {todayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events today</p>
                ) : (
                  todayEvents.map((event) => {
                    const Icon = getEventTypeIcon(event.type);
                    return (
                      <div 
                        key={event.id}
                        className="p-2 bg-background border rounded-lg hover:shadow-sm cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getEventTypeColor(event.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Calendar View */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const Icon = getEventTypeIcon(event.type);
                return (
                  <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{event.title}</h4>
                              {event.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs">High Priority</Badge>
                              )}
                              {event.hasVideoCall && (
                                <Video className="h-3 w-3 text-[#0078d4]" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{event.time}</span>
                              </div>
                              {event.duration && (
                                <span>• {event.duration}</span>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                            </div>

                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {event.description}
                              </p>
                            )}

                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {event.attendees.slice(0, 3).join(', ')}
                                  {event.attendees.length > 3 && ` +${event.attendees.length - 3} more`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${
                              event.type === 'inspection' ? 'border-red-200 text-red-700' :
                              event.type === 'meeting' ? 'border-blue-200 text-blue-700' :
                              event.type === 'delivery' ? 'border-orange-200 text-orange-700' :
                              event.type === 'milestone' ? 'border-green-200 text-green-700' :
                              'border-purple-200 text-purple-700'
                            }`}
                          >
                            {event.type}
                          </Badge>
                          {event.hasVideoCall && (
                            <Button size="sm" className="bg-[#0078d4] hover:bg-[#106ebe]">
                              Join Meeting
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CalendarInterface;
