
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { WidgetMedia } from '@/types/dashboard';

interface MediaGalleryProps {
  media: WidgetMedia[];
  title?: string;
  className?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  media, 
  title = "Media Gallery",
  className = "" 
}) => {
  const [selectedMedia, setSelectedMedia] = useState<WidgetMedia | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleMediaClick = (mediaItem: WidgetMedia) => {
    setSelectedMedia(mediaItem);
    setIsDialogOpen(true);
  };

  if (!media || media.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {media.slice(0, 6).map((item, index) => (
          <div
            key={index}
            className="relative group cursor-pointer aspect-square rounded-lg overflow-hidden bg-muted"
            onClick={() => handleMediaClick(item)}
          >
            {item.type === 'image' ? (
              <img
                src={item.thumbnail || item.url}
                alt={item.title || `Media ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                {getMediaIcon(item.type)}
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <Badge 
              variant="secondary" 
              className="absolute top-1 right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {item.type}
            </Badge>
          </div>
        ))}
        
        {media.length > 6 && (
          <div className="aspect-square rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">+{media.length - 6} more</span>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMedia && getMediaIcon(selectedMedia.type)}
              {selectedMedia?.title || title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMedia && (
            <div className="space-y-4">
              {selectedMedia.type === 'image' ? (
                <div className="relative max-h-96 overflow-hidden rounded-lg">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title || 'Media'}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full max-h-96 rounded-lg"
                />
              ) : (
                <div className="p-8 bg-muted rounded-lg text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Document preview not available</p>
                  <Button asChild>
                    <a href={selectedMedia.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              )}
              
              {selectedMedia.caption && (
                <p className="text-sm text-muted-foreground">{selectedMedia.caption}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
