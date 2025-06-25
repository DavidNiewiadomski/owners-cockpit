/**
 * Universal Object Detail Component
 * 
 * Provides consistent detail view for all object types across the platform.
 * Features:
 * - Standardized layout with header, content tabs, and actions
 * - Object relationship visualization
 * - Activity timeline
 * - Consistent action patterns
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft,
  MoreHorizontal,
  Calendar,
  User,
  MapPin,
  Clock,
  Edit,
  Share,
  Archive,
  ExternalLink,
  MessageSquare,
  FileText,
  Users,
  Building2,
  Activity,
  Link as LinkIcon,
  History,
  Tag,
  AlertCircle,
  CheckCircle2,
  Eye,
  Download,
  Upload
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
  ObjectReference
} from '@/types/objects';
import ObjectCard from './ObjectCard';

interface ObjectDetailProps {
  object: AnyObject;
  isLoading?: boolean;
  onBack?: () => void;
  onActionClick?: (action: ObjectAction) => void;
  onRelatedObjectClick?: (relatedObject: AnyObject) => void;
  className?: string;
}

interface ActivityItem {
  id: string;
  type: 'created' | 'updated' | 'commented' | 'status_changed' | 'assigned' | 'completed';
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  metadata?: Record<string, any>;
}

const ObjectDetail: React.FC<ObjectDetailProps> = ({
  object,
  isLoading = false,
  onBack,
  onActionClick,
  onRelatedObjectClick,
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedObjects, setRelatedObjects] = useState<AnyObject[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);

  // Load related objects and activity
  useEffect(() => {
    loadRelatedObjects();
    loadActivityHistory();
  }, [object.id]);

  const loadRelatedObjects = async () => {
    // This would load related objects from the ObjectService
    // For now, we'll use mock data
    setRelatedObjects([]);
  };

  const loadActivityHistory = async () => {
    // This would load activity history from the ObjectService
    // For now, we'll use mock data
    const mockActivity: ActivityItem[] = [
      {
        id: '1',
        type: 'created',
        description: 'Object created',
        user: { name: 'John Doe' },
        timestamp: new Date(object.created_at)
      },
      {
        id: '2',
        type: 'updated',
        description: 'Object updated',
        user: { name: 'Jane Smith' },
        timestamp: new Date(object.updated_at)
      }
    ];
    setActivityItems(mockActivity);
  };

  const objectMetadata = getObjectDetailMetadata(object);
  const primaryActions = getPrimaryActions(object, onActionClick);
  const secondaryActions = getSecondaryActions(object, onActionClick);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="border-b border-border/40 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                getObjectIconBackground(object)
              )}>
                {getObjectIcon(object)}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {getObjectTitle(object)}
                </h1>
                <p className="text-muted-foreground">
                  {getObjectSubtitle(object)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <Badge variant={getStatusVariant(getObjectStatus(object))}>
              {getObjectStatus(object)}
            </Badge>

            {/* Primary Actions */}
            {primaryActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}

            {/* Secondary Actions Menu */}
            {secondaryActions.length > 0 && (
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {objectMetadata.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              {item.icon}
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border/40 px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <TabsContent value="overview" className="mt-0">
                  <OverviewTab object={object} />
                </TabsContent>

                <TabsContent value="relationships" className="mt-0">
                  <RelationshipsTab 
                    object={object} 
                    relatedObjects={relatedObjects}
                    onRelatedObjectClick={onRelatedObjectClick}
                  />
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  <ActivityTab activityItems={activityItems} />
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <DetailsTab object={object} metadata={objectMetadata} />
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// ========================================
// TAB COMPONENTS
// ========================================

const OverviewTab: React.FC<{ object: AnyObject }> = ({ object }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      {getObjectDescription(object) && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {getObjectDescription(object)}
          </p>
        </Card>
      )}

      {/* Key Metrics */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Key Information</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {getObjectKeyMetrics(object).map((metric, index) => (
            <div key={index} className="text-center p-3 border border-border/40 rounded-lg">
              <div className="text-2xl font-bold text-primary">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress or Status */}
      {getObjectProgress(object) !== undefined && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Progress</h3>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getObjectProgress(object)}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getObjectProgress(object)}% complete
          </p>
        </Card>
      )}
    </div>
  );
};

const RelationshipsTab: React.FC<{ 
  object: AnyObject; 
  relatedObjects: AnyObject[];
  onRelatedObjectClick?: (obj: AnyObject) => void;
}> = ({ object, relatedObjects, onRelatedObjectClick }) => {
  const relationshipGroups = groupRelatedObjects(relatedObjects);

  return (
    <div className="space-y-6">
      {Object.entries(relationshipGroups).map(([type, objects]) => (
        <div key={type}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            {getRelationshipIcon(type)}
            {type} ({objects.length})
          </h3>
          
          <div className="grid gap-3">
            {objects.map((relatedObject) => (
              <ObjectCard
                key={relatedObject.id}
                object={relatedObject}
                variant="compact"
                showActions={false}
                onClick={() => onRelatedObjectClick?.(relatedObject)}
              />
            ))}
          </div>
        </div>
      ))}

      {relatedObjects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No related objects found</p>
        </div>
      )}
    </div>
  );
};

const ActivityTab: React.FC<{ activityItems: ActivityItem[] }> = ({ activityItems }) => {
  return (
    <div className="space-y-4">
      {activityItems.map((item) => (
        <div key={item.id} className="flex items-start gap-3 p-3 border border-border/40 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.user.avatar} />
            <AvatarFallback>{item.user.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getActivityIcon(item.type)}
              <span className="font-medium">{item.user.name}</span>
              <span className="text-muted-foreground">{item.description}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}

      {activityItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No activity found</p>
        </div>
      )}
    </div>
  );
};

const DetailsTab: React.FC<{ object: AnyObject; metadata: any[] }> = ({ object, metadata }) => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Properties</h3>
        <div className="space-y-3">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-border/20 last:border-0">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Raw JSON for debugging */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Raw Data</h3>
        <pre className="text-xs bg-muted p-3 rounded overflow-auto">
          {JSON.stringify(object, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

// ========================================
// HELPER FUNCTIONS
// ========================================

// Reuse helper functions from ObjectCard
function getObjectIcon(object: AnyObject) {
  // Same implementation as ObjectCard
  if (object.id.startsWith('proj_')) return <Building2 className="h-6 w-6 text-blue-600" />;
  if (object.id.startsWith('comm_')) return <MessageSquare className="h-6 w-6 text-green-600" />;
  if (object.id.startsWith('doc_')) return <FileText className="h-6 w-6 text-purple-600" />;
  if (object.id.startsWith('task_')) return <CheckCircle2 className="h-6 w-6 text-orange-600" />;
  return <Building2 className="h-6 w-6 text-gray-600" />;
}

function getObjectIconBackground(object: AnyObject) {
  // Same implementation as ObjectCard
  if (object.id.startsWith('proj_')) return 'bg-blue-50 dark:bg-blue-950';
  if (object.id.startsWith('comm_')) return 'bg-green-50 dark:bg-green-950';
  if (object.id.startsWith('doc_')) return 'bg-purple-50 dark:bg-purple-950';
  if (object.id.startsWith('task_')) return 'bg-orange-50 dark:bg-orange-950';
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
  return `${object.id.split('_')[0]} • Updated ${formatDistanceToNow(new Date(object.updated_at), { addSuffix: true })}`;
}

function getObjectStatus(object: AnyObject): string {
  if ('status' in object) return object.status;
  if ('phase' in object) return object.phase;
  return 'active';
}

function getObjectDescription(object: AnyObject): string | undefined {
  if ('description' in object) return object.description;
  if ('body' in object) return object.body;
  return undefined;
}

function getObjectProgress(object: AnyObject): number | undefined {
  if ('progress' in object) return object.progress;
  return undefined;
}

function getObjectDetailMetadata(object: AnyObject) {
  const metadata = [];

  metadata.push({
    icon: <Calendar className="h-4 w-4" />,
    label: 'Created',
    value: format(new Date(object.created_at), 'PPp')
  });

  metadata.push({
    icon: <Clock className="h-4 w-4" />,
    label: 'Last Updated',
    value: format(new Date(object.updated_at), 'PPp')
  });

  if ('project_id' in object) {
    metadata.push({
      icon: <Building2 className="h-4 w-4" />,
      label: 'Project',
      value: object.project_id
    });
  }

  if ('assigned_to' in object) {
    metadata.push({
      icon: <User className="h-4 w-4" />,
      label: 'Assigned To',
      value: object.assigned_to
    });
  }

  return metadata;
}

function getObjectKeyMetrics(object: AnyObject) {
  const metrics = [];

  if ('budget' in object && object.budget) {
    metrics.push({
      label: 'Budget',
      value: `$${(object.budget.total / 1000000).toFixed(1)}M`
    });
    metrics.push({
      label: 'Spent',
      value: `$${(object.budget.spent / 1000000).toFixed(1)}M`
    });
  }

  if ('team_members' in object && object.team_members) {
    metrics.push({
      label: 'Team Size',
      value: object.team_members.length
    });
  }

  if ('communications' in object && object.communications) {
    metrics.push({
      label: 'Messages',
      value: object.communications.length
    });
  }

  if ('documents' in object && object.documents) {
    metrics.push({
      label: 'Documents',
      value: object.documents.length
    });
  }

  return metrics;
}

function getPrimaryActions(object: AnyObject, onActionClick?: (action: ObjectAction) => void): ObjectAction[] {
  return [
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="h-4 w-4 mr-2" />,
      onClick: () => onActionClick?.({
        id: 'edit',
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        onClick: () => {}
      })
    }
  ];
}

function getSecondaryActions(object: AnyObject, onActionClick?: (action: ObjectAction) => void): ObjectAction[] {
  return [
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
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive className="h-4 w-4" />,
      onClick: () => onActionClick?.({
        id: 'archive',
        label: 'Archive',
        icon: <Archive className="h-4 w-4" />,
        onClick: () => {}
      })
    }
  ];
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

function groupRelatedObjects(objects: AnyObject[]): Record<string, AnyObject[]> {
  return objects.reduce((groups, obj) => {
    const type = obj.id.split('_')[0];
    if (!groups[type]) groups[type] = [];
    groups[type].push(obj);
    return groups;
  }, {} as Record<string, AnyObject[]>);
}

function getRelationshipIcon(type: string) {
  switch (type) {
    case 'comm': return <MessageSquare className="h-4 w-4" />;
    case 'doc': return <FileText className="h-4 w-4" />;
    case 'task': return <CheckCircle2 className="h-4 w-4" />;
    case 'user': return <Users className="h-4 w-4" />;
    default: return <LinkIcon className="h-4 w-4" />;
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'created': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'updated': return <Edit className="h-4 w-4 text-blue-600" />;
    case 'commented': return <MessageSquare className="h-4 w-4 text-purple-600" />;
    case 'status_changed': return <AlertCircle className="h-4 w-4 text-orange-600" />;
    case 'assigned': return <User className="h-4 w-4 text-indigo-600" />;
    case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    default: return <Activity className="h-4 w-4 text-gray-600" />;
  }
}

export default ObjectDetail;
