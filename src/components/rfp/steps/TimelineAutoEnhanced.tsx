import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateInput from '@/components/DateInput';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit, 
  Clock,
  AlertCircle, 
  Zap, 
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Lightbulb,
  Loader2
} from 'lucide-react';
import type { RfpWizardData } from '../RfpWizardEnhanced';
import { useDraftTimeline } from '@/hooks/useRfpDrafter';

interface TimelineAutoEnhancedProps {
  data: RfpWizardData;
  onDataChange: (data: Partial<RfpWizardData>) => void;
  errors?: string[];
}

// Standard RFP timeline templates
const TIMELINE_TEMPLATES = {
  'standard': {
    name: 'Standard RFP Process',
    description: 'Typical 60-day RFP timeline',
    events: [
      { name: 'RFP Release', days: 0, mandatory: true, description: 'Official RFP document published' },
      { name: 'Pre-Proposal Meeting', days: 7, mandatory: false, description: 'Optional bidder conference' },
      { name: 'Questions Due', days: 21, mandatory: true, description: 'Deadline for vendor questions' },
      { name: 'Addendum Released', days: 28, mandatory: false, description: 'Responses to questions published' },
      { name: 'Proposals Due', days: 45, mandatory: true, description: 'Final proposal submission deadline' },
      { name: 'Evaluation Period', days: 60, mandatory: true, description: 'Internal proposal review and scoring' },
      { name: 'Award Notification', days: 75, mandatory: true, description: 'Successful vendor notification' },
      { name: 'Contract Execution', days: 90, mandatory: true, description: 'Contract signing and project start' }
    ]
  },
  'expedited': {
    name: 'Expedited Process',
    description: 'Fast-track 30-day timeline',
    events: [
      { name: 'RFP Release', days: 0, mandatory: true, description: 'Official RFP document published' },
      { name: 'Questions Due', days: 7, mandatory: true, description: 'Deadline for vendor questions' },
      { name: 'Addendum Released', days: 10, mandatory: false, description: 'Responses to questions published' },
      { name: 'Proposals Due', days: 21, mandatory: true, description: 'Final proposal submission deadline' },
      { name: 'Evaluation Period', days: 28, mandatory: true, description: 'Internal proposal review and scoring' },
      { name: 'Award Notification', days: 35, mandatory: true, description: 'Successful vendor notification' },
      { name: 'Contract Execution', days: 42, mandatory: true, description: 'Contract signing and project start' }
    ]
  },
  'complex': {
    name: 'Complex Project',
    description: 'Extended 120-day timeline for large projects',
    events: [
      { name: 'RFP Release', days: 0, mandatory: true, description: 'Official RFP document published' },
      { name: 'Site Visit', days: 14, mandatory: false, description: 'Mandatory site inspection for bidders' },
      { name: 'Pre-Proposal Meeting', days: 21, mandatory: false, description: 'Bidder conference and Q&A' },
      { name: 'First Questions Due', days: 35, mandatory: true, description: 'Initial vendor questions deadline' },
      { name: 'First Addendum', days: 42, mandatory: false, description: 'Initial Q&A responses published' },
      { name: 'Second Questions Due', days: 56, mandatory: false, description: 'Follow-up questions deadline' },
      { name: 'Final Addendum', days: 63, mandatory: false, description: 'Final clarifications published' },
      { name: 'Proposals Due', days: 90, mandatory: true, description: 'Final proposal submission deadline' },
      { name: 'Initial Evaluation', days: 105, mandatory: true, description: 'Technical and commercial review' },
      { name: 'Vendor Presentations', days: 112, mandatory: false, description: 'Shortlisted vendor presentations' },
      { name: 'Final Evaluation', days: 120, mandatory: true, description: 'Final scoring and selection' },
      { name: 'Award Notification', days: 135, mandatory: true, description: 'Successful vendor notification' },
      { name: 'Contract Negotiation', days: 150, mandatory: true, description: 'Contract terms negotiation' },
      { name: 'Contract Execution', days: 165, mandatory: true, description: 'Contract signing and project start' }
    ]
  }
};

const EVENT_TYPES = [
  { value: 'milestone', label: 'Milestone', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'deadline', label: 'Deadline', icon: Clock, color: 'bg-red-100 text-red-800' },
  { value: 'meeting', label: 'Meeting', icon: PlayCircle, color: 'bg-blue-100 text-blue-800' },
  { value: 'review', label: 'Review Period', icon: Edit, color: 'bg-orange-100 text-orange-800' }
];

export function TimelineAutoEnhanced({ data, onDataChange, errors = [] }: TimelineAutoEnhancedProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [baseDate, setBaseDate] = useState(data.release_date || '');
  const [newEvent, setNewEvent] = useState({
    name: '',
    deadline: '',
    mandatory: true,
    description: '',
    type: 'milestone'
  });
  const [showAIGeneration, setShowAIGeneration] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

  const { draftTimeline, loading: aiLoading, error: aiError } = useDraftTimeline();

  // Calculate timeline dates based on base date
  const calculateEventDate = (days: number, base: string = baseDate) => {
    if (!base) return '';
    const baseDate = new Date(base);
    const eventDate = new Date(baseDate.getTime() + (days * 24 * 60 * 60 * 1000));
    return eventDate.toISOString().split('T')[0];
  };

  const applyTemplate = (templateKey: string) => {
    if (!baseDate) {
      alert('Please set a base release date first');
      return;
    }

    const template = TIMELINE_TEMPLATES[templateKey as keyof typeof TIMELINE_TEMPLATES];
    const timelineEvents = template.events.map((event, index) => ({
      id: Date.now().toString() + index,
      name: event.name,
      deadline: calculateEventDate(event.days),
      mandatory: event.mandatory,
      description: event.description,
      dependencies: index > 0 ? [template.events[index - 1].name] : [],
      ai_generated: false
    }));

    onDataChange({ timeline_events: timelineEvents });
    setSelectedTemplate('');
  };

  const addTimelineEvent = () => {
    if (!newEvent.name || !newEvent.deadline) return;

    const timelineEvent = {
      id: Date.now().toString(),
      name: newEvent.name,
      deadline: newEvent.deadline,
      mandatory: newEvent.mandatory,
      description: newEvent.description,
      dependencies: [],
      ai_generated: false
    };

    const updatedEvents = [...(data.timeline_events || []), timelineEvent];
    // Sort by deadline
    updatedEvents.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    
    onDataChange({ timeline_events: updatedEvents });

    // Reset form
    setNewEvent({
      name: '',
      deadline: '',
      mandatory: true,
      description: '',
      type: 'milestone'
    });
  };

  const updateTimelineEvent = (id: string, updates: Partial<typeof data.timeline_events[0]>) => {
    const updatedEvents = data.timeline_events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    );
    // Sort by deadline
    updatedEvents.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    onDataChange({ timeline_events: updatedEvents });
    setEditingEvent(null);
  };

  const deleteTimelineEvent = (id: string) => {
    const updatedEvents = data.timeline_events.filter(event => event.id !== id);
    onDataChange({ timeline_events: updatedEvents });
  };

  const generateAITimeline = async () => {
    if (!aiPrompt.trim()) return;

    try {
      const result = await draftTimeline(data.timeline_events);
      
      // Parse AI response and create timeline events
      // This would typically parse the AI markdown response into structured events
      const aiGeneratedEvents = [
        {
          id: Date.now().toString(),
          name: 'AI Generated Event',
          deadline: calculateEventDate(30),
          mandatory: true,
          description: aiPrompt,
          dependencies: [],
          ai_generated: true
        }
      ];

      const updatedEvents = [...data.timeline_events, ...aiGeneratedEvents];
      updatedEvents.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      
      onDataChange({ 
        timeline_events: updatedEvents,
        ai_generated_content: {
          ...data.ai_generated_content,
          timeline: result.markdown
        }
      });
      
      setAiPrompt('');
      setShowAIGeneration(false);
    } catch (error) {
      console.error('AI timeline generation failed:', error);
    }
  };

  const getDaysFromNow = (deadline: string) => {
    if (!baseDate || !deadline) return 0;
    const base = new Date(baseDate);
    const target = new Date(deadline);
    return Math.ceil((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getEventTypeInfo = (type: string) => {
    const eventType = EVENT_TYPES.find(t => t.value === type);
    return eventType || EVENT_TYPES[0];
  };

  const validateTimeline = () => {
    const issues = [];
    const sortedEvents = [...data.timeline_events].sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

    // Check for overlapping critical events
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      const daysBetween = (new Date(next.deadline).getTime() - new Date(current.deadline).getTime()) / (1000 * 60 * 60 * 24);
      
      if (current.mandatory && next.mandatory && daysBetween < 3) {
        issues.push(`${current.name} and ${next.name} may be too close together`);
      }
    }

    return issues;
  };

  const timelineIssues = validateTimeline();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Smart Timeline Builder</h2>
        <p className="text-muted-foreground">
          Auto-generate timeline with dependencies and critical path analysis
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Timeline Issues */}
      {timelineIssues.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-1">Timeline Issues Detected:</div>
            {timelineIssues.map((issue, index) => (
              <div key={index}>• {issue}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.timeline_events.length}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.timeline_events.filter(event => event.mandatory).length}
              </div>
              <div className="text-sm text-muted-foreground">Mandatory</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.timeline_events.filter(event => event.ai_generated).length}
              </div>
              <div className="text-sm text-muted-foreground">AI Generated</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.timeline_events.length > 0 ? Math.max(...data.timeline_events.map(e => getDaysFromNow(e.deadline))) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Days</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Base Date Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Base Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="base-date">RFP Release Date</Label>
              <DateInput
                value={baseDate}
                onChange={(date) => {
                  const dateStr = date?.toISOString().split('T')[0] || '';
                  setBaseDate(dateStr);
                  onDataChange({ release_date: dateStr });
                }}
                placeholder="Select RFP release date"
              />
            </div>
            <div className="flex items-end">
              <Alert className="flex-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All timeline events will be calculated relative to this date
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Timeline Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(TIMELINE_TEMPLATES).map(([key, template]) => (
              <div key={key} className="border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors">
                <h3 className="font-medium mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="text-xs text-muted-foreground mb-3">
                  {template.events.length} events • {Math.max(...template.events.map(e => e.days))} days
                </div>
                <Button 
                  size="sm" 
                  onClick={() => applyTemplate(key)}
                  disabled={!baseDate}
                  className="w-full"
                >
                  Apply Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Timeline Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Timeline Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showAIGeneration ? (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Let AI help you generate timeline events based on your project requirements
              </p>
              <Button onClick={() => setShowAIGeneration(true)}>
                <Zap className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-timeline-prompt">Describe your timeline requirements</Label>
                <Textarea
                  id="ai-timeline-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Need to accommodate vendor site visits, multiple review rounds, and stakeholder approvals..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={generateAITimeline} 
                  disabled={!aiPrompt.trim() || aiLoading}
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Generate Timeline
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAIGeneration(false)}
                >
                  Cancel
                </Button>
              </div>
              {aiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>AI generation failed: {aiError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Custom Event */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Timeline Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                placeholder="e.g., Vendor Presentations"
              />
            </div>
            
            <div>
              <Label htmlFor="event-deadline">Deadline</Label>
              <DateInput
                value={newEvent.deadline}
                onChange={(date) => {
                  const dateStr = date?.toISOString().split('T')[0] || '';
                  setNewEvent({ ...newEvent, deadline: dateStr });
                }}
                placeholder="Select event deadline"
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="mandatory"
                checked={newEvent.mandatory}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, mandatory: checked })}
              />
              <Label htmlFor="mandatory">Mandatory</Label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Detailed description of this timeline event..."
              rows={2}
            />
          </div>
          
          <Button onClick={addTimelineEvent} disabled={!newEvent.name || !newEvent.deadline}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </CardContent>
      </Card>

      {/* Current Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Current Timeline ({data.timeline_events.length} events)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.timeline_events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No timeline events added yet. Use a template or add custom events above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Timeline Visualization */}
              <div className="relative">
                {data.timeline_events
                  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                  .map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4 pb-6 relative">
                      {/* Timeline line */}
                      {index < data.timeline_events.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-border"></div>
                      )}
                      
                      {/* Event marker */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        event.mandatory ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {event.mandatory ? <Clock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>
                      
                      {/* Event details */}
                      <div className="flex-1 border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{event.name}</h3>
                              {event.mandatory && (
                                <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                              )}
                              {event.ai_generated && (
                                <Badge variant="secondary" className="text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {new Date(event.deadline).toLocaleDateString()} 
                              {baseDate && (
                                <span className="ml-2">
                                  (Day {getDaysFromNow(event.deadline)})
                                </span>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-sm mb-2">{event.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingEvent(event.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTimelineEvent(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
