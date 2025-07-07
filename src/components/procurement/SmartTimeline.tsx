import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import {
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Link,
  Unlink,
  Save,
  Download,
  Upload
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: number;
  type: string;
  dependencies: string[];
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  assignee?: string;
  description?: string;
}

interface SmartTimelineProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export function SmartTimeline({ onSave, initialData }: SmartTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      title: 'RFP Preparation',
      startDate: '2025-07-01',
      endDate: '2025-07-15',
      duration: 14,
      type: 'preparation',
      dependencies: [],
      status: 'pending',
      progress: 0
    },
    {
      id: '2',
      title: 'Vendor Response Period',
      startDate: '2025-07-16',
      endDate: '2025-08-15',
      duration: 30,
      type: 'bidding',
      dependencies: ['1'],
      status: 'pending',
      progress: 0
    },
    {
      id: '3',
      title: 'Technical Evaluation',
      startDate: '2025-08-16',
      endDate: '2025-08-30',
      duration: 14,
      type: 'evaluation',
      dependencies: ['2'],
      status: 'pending',
      progress: 0
    }
  ]);

  const eventTypes = [
    { value: 'preparation', label: 'RFP Preparation' },
    { value: 'bidding', label: 'Bidding Period' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'award', label: 'Award' },
    { value: 'implementation', label: 'Implementation' }
  ];

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: String(events.length + 1),
      title: '',
      startDate: '',
      endDate: '',
      duration: 0,
      type: 'preparation',
      dependencies: [],
      status: 'pending',
      progress: 0
    };

    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, field: keyof TimelineEvent, value: any) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    // Also remove this event from other events' dependencies
    setEvents(events.map(event => ({
      ...event,
      dependencies: event.dependencies.filter(dep => dep !== id)
    })));
  };

  const toggleDependency = (eventId: string, dependencyId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const hasDependency = event.dependencies.includes(dependencyId);
    const newDependencies = hasDependency
      ? event.dependencies.filter(id => id !== dependencyId)
      : [...event.dependencies, dependencyId];

    updateEvent(eventId, 'dependencies', newDependencies);
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDateChange = (id: string, field: 'startDate' | 'endDate', value: string) => {
    updateEvent(id, field, value);
    const event = events.find(e => e.id === id);
    if (event && event.startDate && event.endDate) {
      const duration = calculateDuration(event.startDate, event.endDate);
      updateEvent(id, 'duration', duration);
    }
  };

  const handleSave = () => {
    onSave(events);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Smart Timeline</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create and manage the RFP timeline with dependencies and milestones
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="font-medium">Timeline Events</h4>
              <p className="text-sm text-muted-foreground">
                {events.length} events planned
              </p>
            </div>
            <Button onClick={addEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {events.map(event => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Event Title</Label>
                    <Input
                      value={event.title}
                      onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="w-[200px]">
                    <Label>Type</Label>
                    <Select
                      value={event.type}
                      onValueChange={(value) => updateEvent(event.id, 'type', value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-[150px]">
                    <Label>Status</Label>
                    <Select
                      value={event.status}
                      onValueChange={(value: 'pending' | 'in-progress' | 'completed') =>
                        updateEvent(event.id, 'status', value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={event.startDate}
                      onChange={(e) => handleDateChange(event.id, 'startDate', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={event.endDate}
                      onChange={(e) => handleDateChange(event.id, 'endDate', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Duration (days)</Label>
                    <Input
                      type="number"
                      value={event.duration}
                      readOnly
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label>Dependencies</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {events
                      .filter(e => e.id !== event.id)
                      .map(e => (
                        <Badge
                          key={e.id}
                          variant="outline"
                          className={`cursor-pointer ${
                            event.dependencies.includes(e.id)
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : ''
                          }`}
                          onClick={() => toggleDependency(event.id, e.id)}
                        >
                          {event.dependencies.includes(e.id) ? (
                            <Link className="w-3 h-3 mr-1" />
                          ) : (
                            <Unlink className="w-3 h-3 mr-1" />
                          )}
                          {e.title || `Event ${e.id}`}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div>
                  <Label>Progress</Label>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex-1">
                      <Progress value={event.progress} className="h-2" />
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={event.progress}
                      onChange={(e) =>
                        updateEvent(event.id, 'progress', Number(e.target.value))
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEvent(event.id)}
                  >
                    Remove Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Timeline
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Timeline
        </Button>
      </div>
    </div>
  );
}
