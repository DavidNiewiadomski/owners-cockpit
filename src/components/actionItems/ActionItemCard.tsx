
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, User, MoreVertical, ExternalLink, Trash2, Edit } from 'lucide-react';
import { ActionItem } from '@/types/actionItems';
import { useDeleteActionItem } from '@/hooks/useActionItems';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActionItemCardProps {
  item: ActionItem;
  projectId: string;
}

export const ActionItemCard: React.FC<ActionItemCardProps> = ({ item, projectId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const deleteActionItem = useDeleteActionItem();

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this action item?')) {
      deleteActionItem.mutate({ id: item.id, projectId });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500 text-white';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const isOverdue = item.due_date && new Date(item.due_date) < new Date() && item.status !== 'Done';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'p-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md',
        isDragging && 'opacity-50',
        isOverdue && 'border-red-300 bg-red-50'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm leading-tight mb-2 line-clamp-2">
            {item.title}
          </h4>
          
          {item.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge size="sm" className={getPriorityColor(item.priority)}>
              {item.priority}
            </Badge>

            {item.due_date && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-red-600" : "text-muted-foreground"
              )}>
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(item.due_date), 'MMM d')}</span>
              </div>
            )}

            {item.assignee && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Assigned</span>
              </div>
            )}
          </div>

          {item.source_type && (
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="outline" size="sm" className="text-xs">
                {item.source_type}
              </Badge>
              {item.source_id && (
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};
