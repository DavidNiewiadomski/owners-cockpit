import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SearchCombobox } from '@/components/ui/search-combobox';
import {
  CalendarIcon,
  Clock,
  Calendar,
  ArrowRight,
  AlertTriangle,
  Zap,
  CalendarDays,
  ArrowDownUp,
  Settings2,
  Users,
  FileText,
  Bell,
  Trash2,
  Plus,
  ChevronRight,
  Activity,
  CheckCircle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import type { TimelineEvent, RFPSettings } from '@/types/rfp';


interface SmartTimelineProps {
  onSave: (timelineData: { events: TimelineEvent[]; settings: RFPSettings }) => void;
  initialData?: {
    events: TimelineEvent[];
    settings: RFPSettings;
  };
  onGenerateAITimeline?: () => Promise<TimelineEvent[]>;
  onValidateTimeline?: (events: TimelineEvent[]) => Promise<{
    valid: boolean;
    warnings: string[];
    errors: string[];
  }>;
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
}

export function RFPSmartTimeline({
  onSave,
  initialData,
  onGenerateAITimeline,
  onValidateTimeline,
  teamMembers = [],
}: SmartTimelineProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(
    initialData?.events || []
  );
  const [settings, setSettings] = useState<RFPSettings>(initialData?.settings || {
    defaultDurations: {
      vendorResponsePeriod: 30,
      evaluationPeriod: 14,
      clarificationPeriod: 7,
      negotiationPeriod: 14,
    },
    notifications: {
      emailEnabled: true,
      reminderDays: 7,
      escalationThreshold: 3,
    },
    workflow: {
      requireTechnicalReview: true,
      requireLegalReview: true,
      requireFinancialReview: true,
      minimumReviewers: 2,
    },
    ai: {
      enabled: true,
      assistanceLevel: 'moderate',
      autoSuggest: true,
      languageModel: 'gpt-4',
    },
  });
  const [validation, setValidation] = useState<{
    valid: boolean;
    warnings: string[];
    errors: string[];
  }>({ valid: true, warnings: [], errors: [] });
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(addDays(new Date(), 90), 'yyyy-MM-dd')
  );

  // Mock timeline data
  const initialTimelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'RFP Publication',
      type: 'milestone',
      date: '2024-09-01',
      status: 'pending',
      description: 'Official release of RFP documents',
      criticalPath: true
    },
    {
      id: '2',
      title: 'Pre-Bid Conference',
      type: 'task',
      date: '2024-09-15',
      duration: 1,
      dependencies: ['1'],
      status: 'pending',
      description: 'Mandatory pre-bid meeting with potential vendors'
    },
    {
      id: '3',
      title: 'Q&A Period',
      type: 'task',
      date: '2024-09-15',
      duration: 14,
      dependencies: ['2'],
      status: 'pending',
      description: 'Period for vendors to submit questions',
      criticalPath: true
    },
    {
      id: '4',
      title: 'Response to Questions',
      type: 'task',
      date: '2024-10-01',
      duration: 7,
      dependencies: ['3'],
      status: 'pending',
      description: 'Official responses to vendor questions'
    },
    {
      id: '5',
      title: 'Bid Submission Deadline',
      type: 'deadline',
      date: '2024-10-15',
      dependencies: ['3', '4'],
      status: 'pending',
      description: 'Final deadline for bid submissions',
      criticalPath: true
    }
  ];

  // Calculate timeline metrics
  const metrics = useMemo(() => {
    const totalDuration = differenceInDays(
      new Date(endDate),
      new Date(startDate)
    );
    const criticalPathEvents = timelineEvents.filter((e) => e.criticalPath);
    const criticalPathDuration = criticalPathEvents.reduce(
      (acc, event) => acc + (event.duration || 0),
      0
    );
    const completedEvents = timelineEvents.filter(
      (e) => e.status === 'completed'
    ).length;
    const progressPercentage = Math.round(
      (completedEvents / timelineEvents.length) * 100
    );

    return {
      totalDuration,
      criticalPathDuration,
      completedEvents,
      progressPercentage,
      totalEvents: timelineEvents.length,
      atRiskEvents: timelineEvents.filter((e) => e.status === 'at-risk').length,
    };
  }, [timelineEvents, startDate, endDate]);

  // Validate timeline whenever events change
  useEffect(() => {
    if (onValidateTimeline) {
      onValidateTimeline(timelineEvents).then(setValidation);
    }
  }, [timelineEvents, onValidateTimeline]);

  const handleOptimizeTimeline = async () => {
    if (!onGenerateAITimeline) return;
    
    setIsOptimizing(true);
    try {
      const optimizedEvents = await onGenerateAITimeline();
      setTimelineEvents(optimizedEvents);
    } catch (error) {
      console.error('Failed to optimize timeline:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: String(Date.now()),
      title: 'New Event',
      type: 'task',
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending',
      duration: 1,
    };
    setTimelineEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (eventId: string, updates: Partial<TimelineEvent>) => {
    setTimelineEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setTimelineEvents((prev) =>
      prev.filter((event) => event.id !== eventId)
    );
  };

  const handleSaveTimeline = () => {
    onSave({
      events: timelineEvents,
      settings,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-2">Smart Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Auto-generated timeline with dependencies and critical path analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSaveTimeline}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Save Timeline
          </Button>
          <Button
            variant="default"
            onClick={handleOptimizeTimeline}
            disabled={isOptimizing}
            className="gap-2"
          >
            {isOptimizing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Optimize Timeline'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Total Duration</Label>
              <div className="text-2xl font-semibold">
                {metrics.totalDuration} days
              </div>
              <p className="text-sm text-muted-foreground">
                Critical path: {metrics.criticalPathDuration} days
              </p>
            </div>
            <div className="space-y-2">
              <Label>Progress</Label>
              <div className="text-2xl font-semibold">
                {metrics.progressPercentage}%
              </div>
              <p className="text-sm text-muted-foreground">
                {metrics.completedEvents} of {metrics.totalEvents} events completed
              </p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="text-2xl font-semibold flex items-center gap-2">
                {metrics.atRiskEvents > 0 ? (
                  <>
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    At Risk
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    On Track
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {metrics.atRiskEvents} events need attention
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Timeline Configuration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
            <Label>Key Dates</Label>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleOptimizeTimeline}
              disabled={isOptimizing}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Timeline'}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RFP Release Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Submission Deadline</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Response Period</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="30" className="w-24" />
                  <span className="text-sm text-muted-foreground">days</span>
                  <Badge variant="outline" className="ml-2">
                    <Clock className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timeline Constraints</Label>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    Minimum 30 days required for complex bids
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Calendar className="w-4 h-4" />
                    Pre-bid conference recommended
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <CalendarDays className="w-4 h-4 mr-2" />
              Load Template
            </Button>
            <Button variant="outline" size="sm">
              <ArrowDownUp className="w-4 h-4 mr-2" />
              Dependencies
            </Button>
            <Button variant="outline" size="sm">
              <Settings2 className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Timeline View */}
        <div className="space-y-4">
          <Label>Timeline Preview</Label>
          <div className="border rounded-lg divide-y">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={event.criticalPath ? 'border-orange-500 text-orange-700' : ''}
                    >
                      {event.type}
                    </Badge>
                    <span className="font-medium">{event.title}</span>
                    {event.criticalPath && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        Critical Path
                      </Badge>
                    )}
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {event.date}
                  {event.duration && (
                    <>
                      <ArrowRight className="w-4 h-4 mx-1" />
                      {event.duration} days
                    </>
                  )}
                </div>

                {event.dependencies && event.dependencies.length > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">Depends on:</span>
                    {event.dependencies.map(dep => (
                      <Badge key={dep} variant="outline" className="text-xs">
                        Task {dep}
                      </Badge>
                    ))}
                  </div>
                )}

                {event.description && (
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>Default Durations (Days)</Label>
                    <div className="space-y-4 mt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Vendor Response Period</span>
                          <span className="text-sm font-medium">
                            {settings.defaultDurations.vendorResponsePeriod}
                          </span>
                        </div>
                        <Slider
                          value={[settings.defaultDurations.vendorResponsePeriod]}
                          min={7}
                          max={90}
                          step={1}
                          onValueChange={([value]) =>
                            setSettings(prev => ({
                              ...prev,
                              defaultDurations: {
                                ...prev.defaultDurations,
                                vendorResponsePeriod: value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Evaluation Period</span>
                          <span className="text-sm font-medium">
                            {settings.defaultDurations.evaluationPeriod}
                          </span>
                        </div>
                        <Slider
                          value={[settings.defaultDurations.evaluationPeriod]}
                          min={7}
                          max={60}
                          step={1}
                          onValueChange={([value]) =>
                            setSettings(prev => ({
                              ...prev,
                              defaultDurations: {
                                ...prev.defaultDurations,
                                evaluationPeriod: value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Workflow Requirements</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="cursor-pointer">Technical Review</Label>
                        <Switch
                          checked={settings.workflow.requireTechnicalReview}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({
                              ...prev,
                              workflow: {
                                ...prev.workflow,
                                requireTechnicalReview: checked,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="cursor-pointer">Legal Review</Label>
                        <Switch
                          checked={settings.workflow.requireLegalReview}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({
                              ...prev,
                              workflow: {
                                ...prev.workflow,
                                requireLegalReview: checked,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>AI Assistance</Label>
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center justify-between">
                        <Label className="cursor-pointer">Enable AI</Label>
                        <Switch
                          checked={settings.ai.enabled}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({
                              ...prev,
                              ai: {
                                ...prev.ai,
                                enabled: checked,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Assistance Level</Label>
                        <SearchCombobox
                          options={[
                            { value: 'minimal', label: 'Minimal' },
                            { value: 'moderate', label: 'Moderate' },
                            { value: 'comprehensive', label: 'Comprehensive' },
                          ]}
                          value={settings.ai.assistanceLevel}
                          onChange={(value) =>
                            setSettings(prev => ({
                              ...prev,
                              ai: {
                                ...prev.ai,
                                assistanceLevel: value as any,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Notifications</Label>
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center justify-between">
                        <Label className="cursor-pointer">Email Notifications</Label>
                        <Switch
                          checked={settings.notifications.emailEnabled}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                emailEnabled: checked,
                              },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Reminder Days Before</span>
                          <span className="text-sm font-medium">
                            {settings.notifications.reminderDays}
                          </span>
                        </div>
                        <Slider
                          value={[settings.notifications.reminderDays]}
                          min={1}
                          max={14}
                          step={1}
                          onValueChange={([value]) =>
                            setSettings(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                reminderDays: value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Activity
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
