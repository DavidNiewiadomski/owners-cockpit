import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  MoreVertical,
  Settings,
  Star,
  Filter,
  Mail,
  BellRing,
  ShieldAlert,
} from 'lucide-react';
import { type Notification, type NotificationPriority } from '@/services/notifications';

interface NotificationCenterProps {
  notifications: Notification[];
  onNotificationAction?: (notificationId: string, action: string) => void;
  onSettingsChange?: (settings: any) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onClearAll?: () => void;
}

export function NotificationCenter({
  notifications,
  onNotificationAction,
  onSettingsChange,
  onMarkAsRead,
  onClearAll,
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<{
    priorities: NotificationPriority[];
    types: string[];
    unreadOnly: boolean;
  }>({
    priorities: ['high', 'medium', 'low'],
    types: ['reminder', 'warning', 'alert', 'update'],
    unreadOnly: false,
  });

  // Filter notifications based on current settings
  const filteredNotifications = notifications.filter(notification => {
    if (filters.unreadOnly && notification.read) return false;
    if (!filters.priorities.includes(notification.priority)) return false;
    if (!filters.types.includes(notification.type)) return false;
    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
    const date = format(new Date(notification.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'alert':
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'update':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Notifications</CardTitle>
          <CardDescription>
            {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? 's' : ''}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {['high', 'medium', 'low'].map(priority => (
                        <Badge
                          key={priority}
                          variant="outline"
                          className={cn(
                            'cursor-pointer',
                            filters.priorities.includes(priority as NotificationPriority)
                              ? getPriorityColor(priority as NotificationPriority)
                              : ''
                          )}
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              priorities: prev.priorities.includes(
                                priority as NotificationPriority
                              )
                                ? prev.priorities.filter(p => p !== priority)
                                : [...prev.priorities, priority as NotificationPriority],
                            }));
                          }}
                        >
                          {priority}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Show Only</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Switch
                        checked={filters.unreadOnly}
                        onCheckedChange={checked =>
                          setFilters(prev => ({ ...prev, unreadOnly: checked }))
                        }
                      />
                      <span className="text-sm">Unread</span>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClearAll}>
                Clear All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onSettingsChange?.({ emailNotifications: true })
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Notifications
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onSettingsChange?.({ pushNotifications: true })
                }
              >
                <BellRing className="mr-2 h-4 w-4" />
                Push Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[400px] mt-2">
            {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <div key={date} className="mb-4">
                <div className="sticky top-0 bg-background z-10 py-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {format(new Date(date), 'MMMM d, yyyy')}
                  </h3>
                </div>
                <div className="space-y-2">
                  {dateNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={cn(
                        'rounded-lg border p-3 transition-colors',
                        notification.read
                          ? 'bg-background'
                          : 'bg-primary/5 border-primary/10'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          {getNotificationIcon(notification.type)}
                          <div>
                            <div className="font-medium">{notification.title}</div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={getPriorityColor(notification.priority)}
                              >
                                {notification.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(
                                  new Date(notification.timestamp),
                                  'h:mm a'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                onMarkAsRead?.(notification.id)
                              }
                            >
                              Mark as read
                            </DropdownMenuItem>
                            {notification.actionUrl && (
                              <DropdownMenuItem
                                onClick={() =>
                                  onNotificationAction?.(
                                    notification.id,
                                    'view'
                                  )
                                }
                              >
                                View details
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                onNotificationAction?.(
                                  notification.id,
                                  'dismiss'
                                )
                              }
                            >
                              Dismiss
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
