
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { WIDGET_REGISTRY } from '@/widgets/index';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStore } from '@/stores/useDashboardStore';
import type { LayoutItem } from '@/types/dashboard';
// import { UserRole } from '@/types/roles';

interface AddWidgetPanelProps {
  projectId: string;
  currentLayout: LayoutItem[];
  onClose: () => void;
}

const AddWidgetPanel: React.FC<AddWidgetPanelProps> = ({
  projectId,
  currentLayout,
  onClose
}) => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { addWidget } = useDashboardStore();

  // Filter widgets that are available for current role and not already added
  const availableWidgets = WIDGET_REGISTRY.filter(widget => {
    const isRoleAllowed = !widget.roles || widget.roles.some(role => role === currentRole);
    const isNotAdded = !currentLayout.some(item => item.widgetId === widget.id);
    return isRoleAllowed && isNotAdded;
  });

  const handleAddWidget = (widgetId: string) => {
    if (user) {
      addWidget(user.id, currentRole, projectId, widgetId);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'construction': return 'bg-blue-100 text-blue-800';
      case 'facilities': return 'bg-green-100 text-green-800';
      case 'other': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4 border-2 border-dashed">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add Widgets</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {availableWidgets.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          All available widgets have been added to your dashboard.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableWidgets.map((widget) => (
            <Card key={widget.id} className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{widget.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {widget.description}
                  </p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ml-2 ${getCategoryColor(widget.category)}`}
                >
                  {widget.category}
                </Badge>
              </div>
              
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={() => handleAddWidget(widget.id)}
              >
                <Plus className="w-3 h-3" />
                Add Widget
              </Button>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AddWidgetPanel;
