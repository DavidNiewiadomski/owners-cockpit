
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
import { MediaCard } from '@/components/ui/media-card';
import type { WidgetMedia } from '@/types/dashboard';

interface ConstructionProgressProps {
  projectId: string;
}

export function ConstructionProgress({ projectId: _projectId }: ConstructionProgressProps) {
  const progress = 68;
  const target = 70;

  // Mock construction site gallery
  const constructionGallery: WidgetMedia[] = [
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Current Progress',
      caption: 'Construction site as of today - 68% complete'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Foundation Work',
      caption: 'Foundation completed last week'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Frame Assembly',
      caption: 'Steel frame installation in progress'
    },
    {
      url: '/placeholder.svg',
      type: 'image',
      title: 'Quality Control',
      caption: 'Latest QC inspection results'
    }
  ];

  return (
    <MediaCard
      title="Construction Progress"
      media_url='/placeholder.svg'
      media_gallery={constructionGallery}
      className="h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-medium text-muted-foreground">Construction Progress</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="text-xs text-muted-foreground">
          Target: {target}% • {progress >= target ? 'On Track' : 'Behind Schedule'}
        </div>
      </div>
    </MediaCard>
  );
};

