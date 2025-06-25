
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { MediaGallery } from './media-gallery';
import type { WidgetMedia } from '@/types/dashboard';
import { Eye } from 'lucide-react';

interface MediaCardProps {
  title: string;
  children: React.ReactNode;
  media_url?: string;
  media_gallery?: WidgetMedia[];
  className?: string;
  showMediaPreview?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  children,
  media_url,
  media_gallery,
  className = "",
  showMediaPreview = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hasMedia = media_url || (media_gallery && media_gallery.length > 0);
  const shouldShowHover = hasMedia && showMediaPreview;

  const cardContent = (
    <Card 
      className={`relative transition-all duration-200 ${
        shouldShowHover ? 'hover:shadow-md cursor-pointer' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media preview indicator */}
      {hasMedia && (
        <div className={`absolute top-2 right-2 z-10 transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}>
          <Eye className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Hero media display */}
      {media_url && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={media_url}
            alt={title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader className={media_url ? 'pb-2' : undefined}>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>

      <CardContent className={media_url ? 'pt-0' : undefined}>
        {children}
      </CardContent>
    </Card>
  );

  if (!shouldShowHover) {
    return cardContent;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {cardContent}
      </HoverCardTrigger>

      <HoverCardContent 
        side="right" 
        align="start" 
        className="w-80 p-4"
        sideOffset={10}
      >
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">{title} - Media Gallery</h4>
          
          {media_gallery && media_gallery.length > 0 ? (
            <MediaGallery 
              media={media_gallery} 
              title={`${title} Gallery`}
            />
          ) : media_url ? (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={media_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
