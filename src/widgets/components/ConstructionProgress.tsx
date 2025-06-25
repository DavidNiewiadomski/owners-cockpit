
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
import { MediaCard } from '@/components/ui/media-card';
import type { WidgetMedia } from '@/types/dashboard';

interface ConstructionProgressProps {
  projectId: string;
}

export function ConstructionProgress({ projectId }: ConstructionProgressProps) {
  // Get project-specific progress data
  const getProgressData = () => {
    const progressData: Record<string, any> = {
      '11111111-1111-1111-1111-111111111111': {
        progress: 68,
        target: 70,
        projectName: 'Medical Center',
        phases: [
          { name: 'Foundation', progress: 100, status: 'completed' },
          { name: 'MEP Rough-in', progress: 75, status: 'in-progress' },
          { name: 'Medical Equipment', progress: 25, status: 'in-progress' },
          { name: 'Final Inspection', progress: 0, status: 'pending' }
        ],
        gallery: [
          {
            url: '/placeholder.svg',
            type: 'image' as const,
            title: 'Medical Center Progress',
            caption: 'Emergency department construction - 68% complete'
          },
          {
            url: '/placeholder.svg',
            type: 'image' as const,
            title: 'MEP Installation',
            caption: 'Medical gas lines and electrical rough-in'
          },
          {
            url: '/placeholder.svg',
            type: 'image' as const,
            title: 'Operating Room',
            caption: 'Surgical suite preparation phase'
          }
        ]
      },
      '22222222-2222-2222-2222-222222222222': {
        progress: 32,
        target: 35,
        projectName: 'Corporate Campus',
        phases: [
          { name: 'Site Prep', progress: 100, status: 'completed' },
          { name: 'Foundation', progress: 85, status: 'in-progress' },
          { name: 'Steel Frame', progress: 45, status: 'in-progress' },
          { name: 'Envelope', progress: 0, status: 'pending' }
        ],
        gallery: [
          {
            url: '/placeholder.svg',
            type: 'image' as const,
            title: 'Campus Development',
            caption: 'Office towers foundation work - 32% complete'
          },
          {
            url: '/placeholder.svg',
            type: 'image' as const,
            title: 'Steel Erection',
            caption: 'Structural steel installation progress'
          }
        ]
      },
      'portfolio': {
        progress: 52,
        target: 55,
        projectName: 'Portfolio Overview',
        phases: [
          { name: 'Planning', progress: 85, status: 'in-progress' },
          { name: 'Construction', progress: 60, status: 'in-progress' },
          { name: 'Systems Install', progress: 35, status: 'in-progress' },
          { name: 'Commissioning', progress: 15, status: 'in-progress' }
        ],
        gallery: [
          {
            url: '/placeholder.svg',
            type: 'image' as const,
            title: 'Portfolio Progress',
            caption: 'Overall construction progress across all projects'
          }
        ]
      }
    };
    
    return progressData[projectId] || progressData.portfolio;
  };

  const data = getProgressData();
  const { progress, target, phases, gallery: constructionGallery } = data;

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

