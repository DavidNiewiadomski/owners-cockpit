
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Play, Pause, FileText, Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Communication } from '@/hooks/useCommunications';

interface MeetingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Communication | null;
  projectId: string;
}

const MeetingSummaryModal: React.FC<MeetingSummaryModalProps> = ({
  isOpen,
  onClose,
  meeting,
  projectId: _projectId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const generateSummary = useCallback(async () => {
    if (!meeting) return;
    
    setIsLoadingSummary(true);
    try {
      // Simulate API call to generate summary
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSummary(`
**Meeting Summary**

**Key Discussion Points:**
• Project timeline and upcoming milestones
• Budget allocation for Q4 deliverables  
• Resource requirements and team assignments
• Risk mitigation strategies

**Decisions Made:**
• Approved additional budget for Phase 2
• Extended delivery deadline by 2 weeks
• Assigned new project manager for coordination

**Action Items:**
• Review vendor contracts by next Friday
• Schedule follow-up meeting with stakeholders
• Update project documentation and timelines

**Next Steps:**
The team will reconvene next week to finalize the implementation plan and address any remaining concerns.
      `);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setIsLoadingSummary(false);
    }
  }, [meeting]);

  useEffect(() => {
    if (meeting && isOpen) {
      // Check if we have a summary in metadata
      if (meeting.metadata?.summary) {
        setSummary(meeting.metadata.summary);
      } else {
        // Generate summary
        generateSummary();
      }
    }
  }, [meeting, isOpen, generateSummary]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
  };

  if (!meeting) return null;

  const duration = meeting.metadata?.duration || '45:32';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {meeting.subject || 'Meeting Recording'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meeting Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {duration}
                </div>
                {meeting.speaker?.name && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {meeting.speaker.name}
                    {meeting.participants.length > 1 && (
                      <span>+ {meeting.participants.length - 1} others</span>
                    )}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(meeting.message_ts), { addSuffix: true })}
                </div>
              </div>
              
              {meeting.comm_type === 'meeting_recording' && (
                <Button
                  variant="outline"
                  onClick={togglePlayback}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
              )}
            </div>

            {/* Audio Player Placeholder */}
            {meeting.comm_type === 'meeting_recording' && (
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-current opacity-20 rounded"></div>
                  <div className="w-2 h-12 bg-current opacity-40 rounded"></div>
                  <div className="w-2 h-6 bg-current opacity-60 rounded"></div>
                  <div className="w-2 h-10 bg-current opacity-80 rounded"></div>
                  <div className="w-2 h-8 bg-current opacity-60 rounded"></div>
                  <div className="w-2 h-14 bg-current rounded"></div>
                  <div className="w-2 h-4 bg-current opacity-40 rounded"></div>
                </div>
              </div>
            )}
          </Card>

          {/* Meeting Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Meeting Summary
            </h3>
            
            {isLoadingSummary ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Generating summary...
              </div>
            ) : summary ? (
              <div className="prose prose-sm max-w-none">
                {summary.split('\n').map((line, index) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={index} className="font-semibold mt-4 mb-2">{line.slice(2, -2)}</h4>;
                  }
                  if (line.startsWith('•')) {
                    return <li key={index} className="ml-4">{line.slice(2)}</li>;
                  }
                  if (line.trim()) {
                    return <p key={index} className="mb-2">{line}</p>;
                  }
                  return <br key={index} />;
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No summary available</p>
                <Button variant="outline" onClick={generateSummary} className="mt-2">
                  Generate Summary
                </Button>
              </div>
            )}
          </Card>

          {/* Transcript */}
          {meeting.body && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Transcript</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-64 overflow-y-auto">
                {meeting.body}
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingSummaryModal;
