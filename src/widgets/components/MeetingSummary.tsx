
import React from 'react';
import { Calendar, Users, FileText } from 'lucide-react';
import { MediaCard } from '@/components/ui/media-card';
import { WidgetMedia } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';

interface MeetingSummaryProps {
  projectId?: string;
}

const MeetingSummary: React.FC<MeetingSummaryProps> = ({ projectId }) => {
  const mockKeySlide = '/placeholder.svg'; // Key slide screenshot
  
  const mockMeetingMedia: WidgetMedia[] = [
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Budget Review Slide',
      caption: 'Q4 budget allocation and spending overview'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Timeline Update',
      caption: 'Project milestones and critical path analysis'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Risk Assessment',
      caption: 'Top 5 project risks and mitigation strategies'
    },
    {
      url: '/placeholder.svg',
      type: 'document',
      title: 'Meeting Minutes',
      caption: 'Full meeting transcript and action items'
    }
  ];

  const meetingData = {
    title: 'Weekly Project Review',
    date: '2024-06-24',
    duration: '45 min',
    attendees: 8,
    keyPoints: [
      'Budget approved for Phase 2',
      'Timeline extended by 2 weeks',
      'New safety protocols implemented'
    ]
  };

  return (
    <MediaCard
      title="Latest Meeting Summary"
      media_url={mockKeySlide}
      media_gallery={mockMeetingMedia}
      className="h-full"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{meetingData.title}</h4>
          <Badge variant="outline" className="text-xs">
            {meetingData.duration}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {meetingData.date}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {meetingData.attendees} attendees
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Key Decisions</span>
          </div>
          <ul className="space-y-1">
            {meetingData.keyPoints.map((point, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MediaCard>
  );
};

export { MeetingSummary };
