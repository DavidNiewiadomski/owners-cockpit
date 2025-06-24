
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActionItem } from '@/types/actionItems';
import { ActionItemCard } from './ActionItemCard';
import { cn } from '@/lib/utils';

interface ActionItemColumnProps {
  title: string;
  status: ActionItem['status'];
  items: ActionItem[];
  droppableId: string;
  className?: string;
}

export const ActionItemColumn: React.FC<ActionItemColumnProps> = ({
  title,
  items,
  droppableId,
  className
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'p-4 min-h-[400px] transition-colors',
        isOver && 'bg-muted/50',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge variant="outline" className="text-xs">
          {items.length}
        </Badge>
      </div>

      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item) => (
            <ActionItemCard
              key={item.id}
              item={item}
              projectId={item.project_id}
            />
          ))}
        </div>
      </SortableContext>

      {items.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No items in {title.toLowerCase()}
        </div>
      )}
    </Card>
  );
};
