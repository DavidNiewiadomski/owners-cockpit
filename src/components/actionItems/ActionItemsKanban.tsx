
import React from 'react';
import type {
  DragEndEvent,
  DragStartEvent} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { ActionItem } from '@/types/actionItems';
import { ActionItemCard } from './ActionItemCard';
import { ActionItemColumn } from './ActionItemColumn';
import { useUpdateActionItem } from '@/hooks/useActionItems';
import { useState } from 'react';

interface ActionItemsKanbanProps {
  openItems: ActionItem[];
  inProgressItems: ActionItem[];
  doneItems: ActionItem[];
  projectId: string;
}

export const ActionItemsKanban: React.FC<ActionItemsKanbanProps> = ({
  openItems,
  inProgressItems,
  doneItems,
  projectId
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateActionItem = useUpdateActionItem();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allItems = [...openItems, ...inProgressItems, ...doneItems];
  const activeItem = activeId ? allItems.find(item => item.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine the new status based on the drop zone
    let newStatus: ActionItem['status'];
    if (overId === 'open' || overId.startsWith('open-')) {
      newStatus = 'Open';
    } else if (overId === 'in-progress' || overId.startsWith('in-progress-')) {
      newStatus = 'In Progress';
    } else if (overId === 'done' || overId.startsWith('done-')) {
      newStatus = 'Done';
    } else {
      return; // Invalid drop zone
    }

    const activeItem = allItems.find(item => item.id === activeId);
    if (activeItem && activeItem.status !== newStatus) {
      updateActionItem.mutate({
        id: activeId,
        data: { status: newStatus }
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionItemColumn
          title="Open"
          status="Open"
          items={openItems}
          droppableId="open"
          className="border-l-4 border-l-red-500"
        />
        
        <ActionItemColumn
          title="In Progress"
          status="In Progress"
          items={inProgressItems}
          droppableId="in-progress"
          className="border-l-4 border-l-yellow-500"
        />
        
        <ActionItemColumn
          title="Done"
          status="Done"
          items={doneItems}
          droppableId="done"
          className="border-l-4 border-l-green-500"
        />
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="opacity-80">
            <ActionItemCard item={activeItem} projectId={projectId} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
