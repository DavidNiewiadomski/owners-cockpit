import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, Sparkles, Copy } from 'lucide-react';
import { useDraftTimeline } from '@/hooks/useRfpDrafter';
import { Textarea } from '@/components/ui/textarea';
import { format, addDays, subDays, parseISO } from 'date-fns';

interface TimelineEvent {
  name: string;
  deadline: string;
  mandatory: boolean;
}

interface TimelineAutoProps {
  data: {
    proposal_due?: string;
    timeline_events: TimelineEvent[];
  };
  onDataChange: (data: Partial<typeof data>) => void;
  rfpId?: string;
}

// Timeline rules - days relative to proposal due date
const TIMELINE_RULES = [
  { name: 'Pre-proposal Conference', offset: -32, mandatory: true },
  { name: 'Question Submission Deadline', offset: -27, mandatory: true },
  { name: 'Site Visit Window Opens', offset: -21, mandatory: false },
  { name: 'Addendum Release Deadline', offset: -14, mandatory: true },
  { name: 'Final Questions Deadline', offset: -10, mandatory: true },
  { name: 'Site Visit Window Closes', offset: -7, mandatory: false },
  { name: 'Proposal Submission Deadline', offset: 0, mandatory: true },
  { name: 'Proposal Opening', offset: 1, mandatory: true },
  { name: 'Initial Review Period', offset: 7, mandatory: false },
  { name: 'Vendor Presentations (if required)', offset: 14, mandatory: false },
  { name: 'Reference Check Period', offset: 21, mandatory: false },
  { name: 'Award Notification', offset: 28, mandatory: true },
];

export function TimelineAuto({ data, onDataChange }: TimelineAutoProps) {
  const [proposalDue, setProposalDue] = useState(data.proposal_due || '');
  const [generatedEvents, setGeneratedEvents] = useState<TimelineEvent[]>(data.timeline_events || []);
  const [customEvents, setCustomEvents] = useState<TimelineEvent[]>([]);
  const [generatedTimelineText, setGeneratedTimelineText] = useState<string>('');

  const { draftTimeline, loading: draftLoading, error: draftError } = useDraftTimeline();

  const generateTimeline = () => {
    if (!proposalDue) return;

    const dueDate = parseISO(proposalDue);
    const events = TIMELINE_RULES.map(rule => ({
      name: rule.name,
      deadline: format(addDays(dueDate, rule.offset), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      mandatory: rule.mandatory,
    }));

    setGeneratedEvents(events);
    onDataChange({
      proposal_due: proposalDue,
      timeline_events: [...events, ...customEvents],
    });
  };

  const addCustomEvent = () => {
    const newEvent: TimelineEvent = {
      name: 'Custom Event',
      deadline: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      mandatory: false,
    };
    
    const updatedCustomEvents = [...customEvents, newEvent];
    setCustomEvents(updatedCustomEvents);
    onDataChange({
      timeline_events: [...generatedEvents, ...updatedCustomEvents],
    });
  };

  const updateCustomEvent = (index: number, field: keyof TimelineEvent, value: string | boolean) => {
    const updatedCustomEvents = [...customEvents];
    updatedCustomEvents[index] = {
      ...updatedCustomEvents[index],
      [field]: value,
    };
    
    setCustomEvents(updatedCustomEvents);
    onDataChange({
      timeline_events: [...generatedEvents, ...updatedCustomEvents],
    });
  };

  const removeCustomEvent = (index: number) => {
    const updatedCustomEvents = customEvents.filter((_, i) => i !== index);
    setCustomEvents(updatedCustomEvents);
    onDataChange({
      timeline_events: [...generatedEvents, ...updatedCustomEvents],
    });
  };

  useEffect(() => {
    if (proposalDue) {
      generateTimeline();
    }
  }, [proposalDue]);

  const formatDisplayDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getDaysFromNow = (dateString: string) => {
    try {
      const eventDate = parseISO(dateString);
      const today = new Date();
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 0) return `${diffDays} days away`;
      return `${Math.abs(diffDays)} days ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Proposal Due Date Input */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Proposal Due Date</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="proposal_due" className="block text-sm font-medium text-gray-300 mb-2">
                Set the proposal submission deadline to auto-generate timeline
              </label>
              <Input
                id="proposal_due"
                type="datetime-local"
                value={proposalDue}
                onChange={(e) => setProposalDue(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {proposalDue && (
              <div className="text-sm text-gray-400">
                Proposal due: {formatDisplayDate(proposalDue)} ({getDaysFromNow(proposalDue)})
              </div>
            )}
            
            <Button onClick={generateTimeline} disabled={!proposalDue}>
              Generate Timeline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Timeline Events */}
      {generatedEvents.length > 0 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Generated Timeline Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{event.name}</span>
                      {event.mandatory && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Mandatory
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {formatDisplayDate(event.deadline)} • {getDaysFromNow(event.deadline)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Events */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Custom Events</span>
            <Button onClick={addCustomEvent} size="sm">
              Add Custom Event
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customEvents.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No custom events added</p>
          ) : (
            <div className="space-y-3">
              {customEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-700 rounded-lg space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <Input
                      value={event.name}
                      onChange={(e) => updateCustomEvent(index, 'name', e.target.value)}
                      placeholder="Event name"
                      className="flex-1"
                    />
                    <Input
                      type="datetime-local"
                      value={event.deadline}
                      onChange={(e) => updateCustomEvent(index, 'deadline', e.target.value)}
                      className="flex-1"
                    />
                    <label className="flex items-center space-x-2 text-white">
                      <input
                        type="checkbox"
                        checked={event.mandatory}
                        onChange={(e) => updateCustomEvent(index, 'mandatory', e.target.checked)}
                      />
                      <span>Mandatory</span>
                    </label>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCustomEvent(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDisplayDate(event.deadline)} • {getDaysFromNow(event.deadline)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Summary */}
      {(generatedEvents.length > 0 || customEvents.length > 0) && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Timeline Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {generatedEvents.length + customEvents.length}
                </div>
                <div className="text-sm text-gray-400">Total Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {[...generatedEvents, ...customEvents].filter(e => e.mandatory).length}
                </div>
                <div className="text-sm text-gray-400">Mandatory Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {customEvents.length}
                </div>
                <div className="text-sm text-gray-400">Custom Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Generated Timeline Documentation */}
      {(generatedEvents.length > 0 || customEvents.length > 0) && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>AI Generated Timeline Documentation</span>
              </CardTitle>
              {generatedTimelineText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(generatedTimelineText)}
                  className="flex items-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button
                onClick={async () => {
                  try {
                    const allEvents = [...generatedEvents, ...customEvents];
                    const result = await draftTimeline(allEvents);
                    setGeneratedTimelineText(result.markdown);
                  } catch (error) {
                    console.error('Failed to generate timeline documentation:', error);
                  }
                }}
                disabled={draftLoading}
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{draftLoading ? 'Generating...' : 'Generate Timeline Documentation'}</span>
              </Button>
            </div>
            
            {generatedTimelineText ? (
              <div className="space-y-4">
                <Textarea
                  value={generatedTimelineText}
                  onChange={(e) => setGeneratedTimelineText(e.target.value)}
                  className="min-h-64 font-mono text-sm"
                  placeholder="Generated timeline documentation will appear here..."
                />
                <div className="text-sm text-gray-400">
                  This timeline documentation was generated based on your project events and deadlines.
                  You can edit it directly to customize the content for your RFP.
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No timeline documentation generated yet. Click "Generate Timeline Documentation" to create professional timeline content for your RFP.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
