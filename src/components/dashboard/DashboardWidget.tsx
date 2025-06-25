
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, X } from 'lucide-react';
import { WIDGET_REGISTRY } from '@/widgets/index';
import type { LayoutItem } from '@/types/dashboard';

interface DashboardWidgetProps {
  item: LayoutItem;
  projectId: string;
  isEditMode: boolean;
  onRemove: () => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = React.memo(({
  item,
  projectId,
  isEditMode,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const widgetDef = WIDGET_REGISTRY.find(w => w.id === item.widgetId);
  
  if (!widgetDef) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50 text-center text-red-600"
      >
        Widget "{item.widgetId}" not found
      </div>
    );
  }

  const WidgetComponent = widgetDef.component;

  // Prepare widget props including media data
  const widgetProps = {
    projectId,
    ...(item.media_url && { media_url: item.media_url }),
    ...(item.media_gallery && { media_gallery: item.media_gallery })
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'ring-2 ring-accent' : ''} ${
        isEditMode ? 'cursor-move' : ''
      }`}
      {...attributes}
      {...(isEditMode ? listeners : {})}
    >
      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="absolute -top-2 -right-2 z-10 flex gap-1">
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Drag Handle */}
      {isEditMode && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-1 bg-background/80 rounded border cursor-grab active:cursor-grabbing touch-manipulation md:min-h-[48px] md:min-w-[48px]">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className={isEditMode ? 'pointer-events-none' : ''}>
        <WidgetComponent {...widgetProps} />
      </div>
    </div>
  );
});

export default DashboardWidget;
