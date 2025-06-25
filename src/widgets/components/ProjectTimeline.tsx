
import React from 'react';
import { Calendar } from 'lucide-react';
import { MediaCard } from '@/components/ui/media-card';
import type { WidgetMedia } from '@/types/dashboard';

interface ProjectTimelineProps {
  projectId: string;
}

export function ProjectTimeline({ projectId: _projectId }: ProjectTimelineProps) {
  const milestones = [
    { name: 'Foundation Complete', date: '2024-05-15', status: 'completed' },
    { name: 'Frame Structure', date: '2024-07-01', status: 'in-progress' },
    { name: 'Electrical Rough-in', date: '2024-08-15', status: 'upcoming' },
    { name: 'Final Inspection', date: '2024-12-01', status: 'upcoming' }
  ];

  // Mock Track3D gallery data
  const mockGallery: WidgetMedia[] = [
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Foundation Progress',
      caption: 'Latest foundation work captured via Track3D'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Frame Assembly',
      caption: 'Steel frame progress - 68% complete'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Site Overview',
      caption: 'Aerial view from drone capture'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Quality Check',
      caption: 'QA inspection documentation'
    }
  ];

  return (
    <MediaCard
      title="Project Timeline"
      media_gallery={mockGallery}
      className="h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Project Timeline</h3>
      </div>
      
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              milestone.status === 'completed' ? 'bg-green-500' :
              milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{milestone.name}</div>
              <div className="text-xs text-muted-foreground">{milestone.date}</div>
            </div>
          </div>
        ))}
      </div>
    </MediaCard>
  );
};

