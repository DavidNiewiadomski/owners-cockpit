/**
 * Universal Object Card Component
 * 
 * Provides consistent card-based display for all object types across the platform.
 * This component follows OOUX principles by:
 * - Standardizing object representation
 * - Providing consistent action patterns
 * - Showing object relationships clearly
 * - Enabling predictable user interactions
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Pause,
  Archive,
  ExternalLink,
  MessageSquare,
  FileText,
  Users,
  Building2,
  Briefcase,
  Home,
  Factory,
  Truck,
  TreePine,
  Scale,
  DollarSign,
  Wrench,
  Eye,
  Edit,
  Share,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AnyObject,
  ObjectAction,
  ProjectObject,
  CommunicationObject,
  DocumentObject,
  ActionItemObject,
  UserObject,
  ObjectPriority,
  ObjectStatus
} from '@/types/objects';

interface ObjectCardProps {
  object: AnyObject;
  variant?: 'default' | 'compact' | 'detailed' | 'list';
  showActions?: boolean;
  showRelationships?: boolean;
  showMetadata?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onActionClick?: (action: ObjectAction) => void;
  className?: string;
}

const ObjectCard: React.FC<ObjectCardProps> = ({
  object,
  variant = 'default',
  showActions = true,
  showRelationships = false,
  showMetadata = true,
  isSelected = false,
  onClick,
  onActionClick,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get object-specific metadata
  const metadata = getObjectMetadata(object);
  const relationships = getObjectRelationships(object);
  const actions = getObjectActions(object, onActionClick);

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          'relative transition-all duration-200 cursor-pointer group',
          'hover:shadow-md hover:shadow-primary/10',
          'border border-border/50 hover:border-border',
          isSelected && 'ring-2 ring-primary ring-offset-2',
          variant === 'compact' && 'p-3',
          variant === 'list' && 'rounded-none border-x-0 border-t-0 shadow-none',
          className
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cn(
          'p-4',
          variant === 'compact' && 'p-3',
          variant === 'list' && 'py-3 px-4'
        )}>
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Object Icon */}
              <div className="flex-shrink-0">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  getObjectIconBackground(object),
                  variant === 'compact' && 'w-8 h-8'
                )}>
                  {getObjectIcon(object)}
                </div>
              </div>

              {/* Object Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn(
                    'font-semibold text-foreground truncate',
                    variant === 'compact' ? 'text-sm' : 'text-base'
                  )}>
                    {getObjectTitle(object)}
                  </h3>
                  
                  {/* Status Badge */}
                  <Badge 
                    variant={getStatusVariant(getObjectStatus(object))}
                    className="text-xs"
                  >
                    {getObjectStatus(object)}
                  </Badge>

                  {/* Priority Indicator */}
                  {getObjectPriority(object) && getObjectPriority(object) !== 'normal' && (
                    <Badge 
                      variant={getPriorityVariant(getObjectPriority(object)!)}
                      className="text-xs"
                    >
                      {getObjectPriority(object)}
                    </Badge>
                  )}
                </div>

                {/* Subtitle/Description */}
                {getObjectSubtitle(object) && (
                  <p className={cn(
                    'text-muted-foreground line-clamp-2',
                    variant === 'compact' ? 'text-xs' : 'text-sm'
                  )}>
                    {getObjectSubtitle(object)}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            {showActions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      'h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
                      isHovered && 'opacity-100'
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {actions.map((action, index) => (
                    <React.Fragment key={action.id}>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick();
                        }}
                        disabled={action.disabled}
                        className="flex items-center gap-2"
                      >
                        {action.icon}
                        {action.label}
                      </DropdownMenuItem>
                      {index === 1 && <DropdownMenuSeparator />}
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Metadata Section */}
          {showMetadata && metadata.length > 0 && variant !== 'compact' && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {metadata.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                  {item.icon}
                  <span className="truncate">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Relationships Section */}
          {showRelationships && relationships.length > 0 && variant === 'detailed' && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Related Items</h4>
              <div className="flex flex-wrap gap-1">
                {relationships.slice(0, 3).map((rel, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {rel.icon}
                    {rel.count}
                  </Badge>
                ))}
                {relationships.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{relationships.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Footer Section */}
          {variant !== 'compact' && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                {/* Last Updated */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(object.updated_at), { addSuffix: true })}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Last updated: {format(new Date(object.updated_at), 'PPp')}
                  </TooltipContent>
                </Tooltip>

                {/* Creator/Owner */}
                {getObjectOwner(object) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-20">{getObjectOwner(object)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {getObjectOwnerRole(object)}: {getObjectOwner(object)}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1">
                {actions.slice(0, 2).map((action) => (
                  <Tooltip key={action.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick();
                        }}
                        disabled={action.disabled}
                      >
                        {action.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{action.label}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
        )}
      </Card>
    </TooltipProvider>
  );
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function getObjectMetadata(object: AnyObject) {
  const metadata = [];

  if ('project_id' in object && object.project_id) {
    metadata.push({
      icon: <Building2 className="h-3 w-3" />,
      value: 'Project',
      detail: object.project_id
    });
  }

  if ('start_date' in object && object.start_date) {
    metadata.push({
      icon: <Calendar className="h-3 w-3" />,
      value: format(new Date(object.start_date), 'MMM d, yyyy'),
      detail: 'Start Date'
    });
  }

  if ('due_date' in object && object.due_date) {
    metadata.push({
      icon: <AlertCircle className="h-3 w-3" />,
      value: format(new Date(object.due_date), 'MMM d'),
      detail: 'Due Date'
    });
  }

  if ('location' in object && object.location?.city) {
    metadata.push({
      icon: <MapPin className="h-3 w-3" />,
      value: `${object.location.city}, ${object.location.state}`,
      detail: 'Location'
    });
  }

  if ('assigned_to' in object && object.assigned_to) {
    metadata.push({
      icon: <User className="h-3 w-3" />,
      value: 'Assigned',
      detail: object.assigned_to
    });
  }

  return metadata;
}

function getObjectRelationships(object: AnyObject) {
  const relationships = [];

  if ('communications' in object && object.communications?.length) {
    relationships.push({
      icon: <MessageSquare className="h-3 w-3 mr-1" />,
      count: `${object.communications.length} messages`,
      type: 'communications'
    });
  }

  if ('documents' in object && object.documents?.length) {
    relationships.push({
      icon: <FileText className="h-3 w-3 mr-1" />,
      count: `${object.documents.length} docs`,
      type: 'documents'
    });
  }

  if ('action_items' in object && object.action_items?.length) {
    relationships.push({
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
      count: `${object.action_items.length} tasks`,
      type: 'action_items'
    });
  }

  if ('team_members' in object && object.team_members?.length) {
    relationships.push({
      icon: <Users className="h-3 w-3 mr-1" />,
      count: `${object.team_members.length} members`,
      type: 'team_members'
    });
  }

  return relationships;
}

function getObjectActions(object: AnyObject, onActionClick?: (action: ObjectAction) => void): ObjectAction[] {
  const actions: ObjectAction[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onActionClick?.({
        id: 'view',
        label: 'View Details',
        icon: <Eye className="h-4 w-4" />,
        onClick: () => {}
      })
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onActionClick?.({
        id: 'edit',
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        onClick: () => {}
      })
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share className="h-4 w-4" />,
      onClick: () => onActionClick?.({
        id: 'share',
        label: 'Share',
        icon: <Share className="h-4 w-4" />,
        onClick: () => {}
      })
    }
  ];

  // Add object-specific actions
  if (object.id.startsWith('comm_')) {
    actions.push({
      id: 'reply',
      label: 'Reply',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => onActionClick?.({
        id: 'reply',
        label: 'Reply',
        icon: <MessageSquare className="h-4 w-4" />,
        onClick: () => {}
      })
    });
  }

  if (object.id.startsWith('doc_')) {
    actions.push({
      id: 'download',
      label: 'Download',
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => onActionClick?.({
        id: 'download',
        label: 'Download',
        icon: <ExternalLink className="h-4 w-4" />,
        onClick: () => {}
      })
    });
  }

  actions.push({
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="h-4 w-4" />,
    onClick: () => onActionClick?.({
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      onClick: () => {}
    }),
    variant: 'destructive'
  });

  return actions;
}

function getObjectIcon(object: AnyObject) {
  if ('type' in object) {
    // Project icons
    if (object.type === 'residential_single_family' || object.type === 'residential_multi_family') {
      return <Home className="h-5 w-5 text-blue-600" />;
    }
    if (object.type === 'commercial_office' || object.type === 'commercial_retail') {
      return <Building2 className="h-5 w-5 text-purple-600" />;
    }
    if (object.type === 'industrial_warehouse' || object.type === 'industrial_manufacturing') {
      return <Factory className="h-5 w-5 text-orange-600" />;
    }

    // Communication icons
    if (object.type === 'email') {
      return <MessageSquare className="h-5 w-5 text-blue-600" />;
    }
    if (object.type === 'meeting') {
      return <Users className="h-5 w-5 text-green-600" />;
    }

    // Document icons
    if (object.type === 'drawing' || object.type === 'cad') {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    if (object.type === 'contract') {
      return <Scale className="h-5 w-5 text-red-600" />;
    }
  }

  // Default icons by object ID prefix
  if (object.id.startsWith('proj_')) return <Building2 className="h-5 w-5 text-blue-600" />;
  if (object.id.startsWith('comm_')) return <MessageSquare className="h-5 w-5 text-green-600" />;
  if (object.id.startsWith('doc_')) return <FileText className="h-5 w-5 text-purple-600" />;
  if (object.id.startsWith('task_')) return <CheckCircle2 className="h-5 w-5 text-orange-600" />;
  if (object.id.startsWith('user_')) return <User className="h-5 w-5 text-gray-600" />;

  return <Briefcase className="h-5 w-5 text-gray-600" />;
}

function getObjectIconBackground(object: AnyObject) {
  if (object.id.startsWith('proj_')) return 'bg-blue-50 dark:bg-blue-950';
  if (object.id.startsWith('comm_')) return 'bg-green-50 dark:bg-green-950';
  if (object.id.startsWith('doc_')) return 'bg-purple-50 dark:bg-purple-950';
  if (object.id.startsWith('task_')) return 'bg-orange-50 dark:bg-orange-950';
  if (object.id.startsWith('user_')) return 'bg-gray-50 dark:bg-gray-950';
  
  return 'bg-gray-50 dark:bg-gray-950';
}

function getObjectTitle(object: AnyObject): string {
  if ('name' in object) return object.name;
  if ('title' in object) return object.title;
  if ('subject' in object) return object.subject || 'Untitled';
  return 'Untitled';
}

function getObjectSubtitle(object: AnyObject): string | undefined {
  if ('description' in object) return object.description;
  if ('body' in object) return object.body;
  return undefined;
}

function getObjectStatus(object: AnyObject): string {
  if ('status' in object) return object.status;
  if ('phase' in object) return object.phase;
  return 'active';
}

function getObjectPriority(object: AnyObject): ObjectPriority | undefined {
  if ('priority' in object) return object.priority;
  return undefined;
}

function getObjectOwner(object: AnyObject): string | undefined {
  if ('owner_id' in object) return 'Owner'; // Would need to resolve actual name
  if ('assigned_to' in object) return 'Assignee'; // Would need to resolve actual name
  if ('created_by' in object) return 'Creator'; // Would need to resolve actual name
  return undefined;
}

function getObjectOwnerRole(object: AnyObject): string {
  if ('owner_id' in object) return 'Owner';
  if ('assigned_to' in object) return 'Assignee';
  if ('created_by' in object) return 'Creator';
  return 'User';
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in_progress':
    case 'completed':
      return 'default';
    case 'pending':
    case 'on_hold':
      return 'secondary';
    case 'cancelled':
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getPriorityVariant(priority: ObjectPriority): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (priority) {
    case 'critical':
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default ObjectCard;
