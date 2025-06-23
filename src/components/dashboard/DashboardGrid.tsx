
import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Plus, X } from 'lucide-react';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { WIDGET_REGISTRY } from '@/widgets/index';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/hooks/useAuth';
import DashboardWidget from './DashboardWidget';
import AddWidgetPanel from './AddWidgetPanel';
import { LayoutItem } from '@/types/dashboard';

interface DashboardGridProps {
  projectId: string;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ projectId }) => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const {
    getLayout,
    setLayout,
    saveLayout,
    isEditMode,
    setEditMode,
    loadLayout,
    isLoading,
    removeWidget
  } = useDashboardStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);

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

  const layout = user ? getLayout(user.id, currentRole, projectId) : [];

  useEffect(() => {
    if (user) {
      loadLayout(user.id, currentRole, projectId);
    }
  }, [user, currentRole, projectId, loadLayout]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !user) return;

    const activeIndex = layout.findIndex(item => item.id === active.id);
    const overIndex = layout.findIndex(item => item.id === over.id);

    if (activeIndex !== overIndex) {
      const newLayout = [...layout];
      const [removed] = newLayout.splice(activeIndex, 1);
      newLayout.splice(overIndex, 0, removed);

      // Recalculate positions based on new order
      const reorderedLayout = newLayout.map((item, index) => ({
        ...item,
        x: index % 3, // 3 columns
        y: Math.floor(index / 3)
      }));

      setLayout(user.id, currentRole, projectId, reorderedLayout);
      saveLayout(user.id, currentRole, projectId, reorderedLayout);
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (user) {
      removeWidget(user.id, currentRole, projectId, widgetId);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!isEditMode);
    setShowAddPanel(false);
  };

  const activeWidget = activeId ? layout.find(item => item.id === activeId) : null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-48 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <Badge variant="outline">{currentRole}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddPanel(!showAddPanel)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Widget
            </Button>
          )}
          
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
            className="gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {isEditMode ? 'Done' : 'Customize'}
          </Button>
        </div>
      </div>

      {/* Add Widget Panel */}
      {showAddPanel && isEditMode && (
        <AddWidgetPanel
          projectId={projectId}
          currentLayout={layout}
          onClose={() => setShowAddPanel(false)}
        />
      )}

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={layout.map(item => item.id)} 
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {layout.map((item) => (
              <DashboardWidget
                key={item.id}
                item={item}
                projectId={projectId}
                isEditMode={isEditMode}
                onRemove={() => handleRemoveWidget(item.widgetId)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeWidget && (
            <div className="opacity-50">
              <DashboardWidget
                item={activeWidget}
                projectId={projectId}
                isEditMode={false}
                onRemove={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {layout.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No widgets configured</h3>
          <p className="text-muted-foreground mb-4">
            Click "Customize" to add widgets to your dashboard
          </p>
          <Button onClick={toggleEditMode}>
            Get Started
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DashboardGrid;
