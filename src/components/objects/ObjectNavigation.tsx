/**
 * Object-Centric Navigation Component
 * 
 * Replaces role-based navigation with object-focused structure.
 * Features:
 * - Primary navigation by object type
 * - Secondary filtering by user permissions/role
 * - Context-aware breadcrumbs
 * - Object relationship navigation
 * - Quick object creation
 */

import React, { useState, useMemo } from 'react';
// import { useRouter } from 'next/router'; // Not available in this project
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2,
  MessageSquare,
  FileText,
  CheckCircle2,
  Users,
  Search,
  Plus,
  ChevronRight,
  Home,
  Star,
  Clock,
  Filter,
  MoreHorizontal,
  Folder,
  Tag,
  Calendar,
  Map,
  Settings,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/contexts/RoleContext';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import {
  AnyObject,
  ObjectSearchParams,
  ProjectObject,
  CommunicationObject,
  DocumentObject,
  ActionItemObject,
  UserObject
} from '@/types/objects';

interface ObjectNavigationProps {
  currentProject?: ProjectObject;
  currentObject?: AnyObject;
  onNavigate?: (path: string, objectType?: string) => void;
  onObjectCreate?: (objectType: string) => void;
  onObjectSearch?: (params: ObjectSearchParams) => void;
  className?: string;
}

interface NavigationItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  count?: number;
  createAction?: string;
  permission?: string;
  children?: NavigationItem[];
}

interface ObjectBreadcrumb {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const ObjectNavigation: React.FC<ObjectNavigationProps> = ({
  currentProject,
  currentObject,
  onNavigate,
  onObjectCreate,
  onObjectSearch,
  className
}) => {
  // const router = useRouter(); // Not available in this project
  const { currentRole } = useRole();
  const { access } = useRoleBasedAccess();
  const [activeSection, setActiveSection] = useState('overview');
  
  // Define object-centric navigation structure
  const navigationItems: NavigationItem[] = useMemo(() => [
    {
      type: 'overview',
      label: 'Overview',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard',
      permission: 'canViewDashboard'
    },
    {
      type: 'projects',
      label: 'Projects',
      icon: <Building2 className="h-5 w-5" />,
      path: '/projects',
      count: 12, // Would come from API
      createAction: 'project',
      permission: 'canViewProjects',
      children: [
        {
          type: 'active',
          label: 'Active',
          icon: <div className="w-2 h-2 bg-green-500 rounded-full" />,
          path: '/projects?status=active',
          count: 8
        },
        {
          type: 'planning',
          label: 'Planning',
          icon: <div className="w-2 h-2 bg-blue-500 rounded-full" />,
          path: '/projects?status=planning',
          count: 3
        },
        {
          type: 'completed',
          label: 'Completed',
          icon: <div className="w-2 h-2 bg-gray-500 rounded-full" />,
          path: '/projects?status=completed',
          count: 1
        }
      ]
    },
    {
      type: 'communications',
      label: 'Communications',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/communications',
      count: 45,
      createAction: 'communication',
      permission: 'canViewCommunications',
      children: [
        {
          type: 'recent',
          label: 'Recent',
          icon: <Clock className="h-4 w-4" />,
          path: '/communications?filter=recent',
          count: 12
        },
        {
          type: 'meetings',
          label: 'Meetings',
          icon: <Calendar className="h-4 w-4" />,
          path: '/communications?type=meeting',
          count: 8
        },
        {
          type: 'emails',
          label: 'Emails',
          icon: <MessageSquare className="h-4 w-4" />,
          path: '/communications?type=email',
          count: 25
        }
      ]
    },
    {
      type: 'documents',
      label: 'Documents',
      icon: <FileText className="h-5 w-5" />,
      path: '/documents',
      count: 156,
      createAction: 'document',
      permission: 'canViewDocuments',
      children: [
        {
          type: 'drawings',
          label: 'Drawings',
          icon: <FileText className="h-4 w-4" />,
          path: '/documents?type=drawing',
          count: 45
        },
        {
          type: 'specifications',
          label: 'Specifications',
          icon: <FileText className="h-4 w-4" />,
          path: '/documents?type=specification',
          count: 23
        },
        {
          type: 'contracts',
          label: 'Contracts',
          icon: <FileText className="h-4 w-4" />,
          path: '/documents?type=contract',
          count: 12
        },
        {
          type: 'reports',
          label: 'Reports',
          icon: <FileText className="h-4 w-4" />,
          path: '/documents?type=report',
          count: 76
        }
      ]
    },
    {
      type: 'tasks',
      label: 'Tasks',
      icon: <CheckCircle2 className="h-5 w-5" />,
      path: '/tasks',
      count: 23,
      createAction: 'action_item',
      permission: 'canViewTasks',
      children: [
        {
          type: 'assigned',
          label: 'Assigned to Me',
          icon: <Users className="h-4 w-4" />,
          path: '/tasks?assigned=me',
          count: 8
        },
        {
          type: 'overdue',
          label: 'Overdue',
          icon: <div className="w-2 h-2 bg-red-500 rounded-full" />,
          path: '/tasks?status=overdue',
          count: 3
        },
        {
          type: 'upcoming',
          label: 'Due Soon',
          icon: <div className="w-2 h-2 bg-yellow-500 rounded-full" />,
          path: '/tasks?status=upcoming',
          count: 12
        }
      ]
    },
    {
      type: 'people',
      label: 'People',
      icon: <Users className="h-5 w-5" />,
      path: '/people',
      count: 34,
      permission: 'canViewUsers',
      children: [
        {
          type: 'team',
          label: 'Project Team',
          icon: <Building2 className="h-4 w-4" />,
          path: '/people?filter=project',
          count: 12
        },
        {
          type: 'contractors',
          label: 'Contractors',
          icon: <Users className="h-4 w-4" />,
          path: '/people?filter=contractors',
          count: 18
        },
        {
          type: 'consultants',
          label: 'Consultants',
          icon: <Users className="h-4 w-4" />,
          path: '/people?filter=consultants',
          count: 4
        }
      ]
    }
  ], []);

  // Filter navigation items by user permissions
  const visibleNavItems = navigationItems.filter(item => 
    !item.permission || access[item.permission as keyof typeof access]
  );

  // Generate breadcrumbs based on current context
  const breadcrumbs = useMemo((): ObjectBreadcrumb[] => {
    const crumbs: ObjectBreadcrumb[] = [];
    
    if (currentProject) {
      crumbs.push({
        label: currentProject.name,
        path: `/projects/${currentProject.id}`,
        icon: <Building2 className="h-4 w-4" />
      });
    }
    
    if (currentObject && currentObject.id !== currentProject?.id) {
      const objectType = currentObject.id.split('_')[0];
      const navItem = navigationItems.find(item => item.type === objectType);
      
      crumbs.push({
        label: getObjectTitle(currentObject),
        path: `/${objectType}/${currentObject.id}`,
        icon: navItem?.icon
      });
    }
    
    return crumbs;
  }, [currentProject, currentObject, navigationItems]);

  const handleNavigationClick = (item: NavigationItem) => {
    setActiveSection(item.type);
    onNavigate?.(item.path, item.type);
  };

  const handleCreateClick = (objectType: string) => {
    onObjectCreate?.(objectType);
  };

  const isItemActive = (item: NavigationItem): boolean => {
    return activeSection === item.type; // || router.pathname.startsWith(item.path);
  };

  return (
    <TooltipProvider>
      <div className={cn('flex flex-col h-full bg-background border-r border-border/40', className)}>
        {/* Header with Project Context */}
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">
              {currentProject ? currentProject.name : 'Portfolio'}
            </h2>
            
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onObjectSearch?.({})}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Global Search</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="h-3 w-3" />}
                  <button 
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => onNavigate?.(crumb.path)}
                  >
                    {crumb.icon}
                    <span className="truncate max-w-32">{crumb.label}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <nav className="space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = isItemActive(item);
                const hasChildren = item.children && item.children.length > 0;
                
                return (
                  <div key={item.type}>
                    <div className="flex items-center gap-1">
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          'w-full justify-start flex-1 h-9',
                          isActive && 'bg-primary/10 text-primary font-medium'
                        )}
                        onClick={() => handleNavigationClick(item)}
                      >
                        {item.icon}
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {item.count}
                          </Badge>
                        )}
                      </Button>
                      
                      {item.createAction && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 shrink-0"
                              onClick={() => handleCreateClick(item.createAction!)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Create {item.label.slice(0, -1)}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {/* Sub-navigation */}
                    {hasChildren && isActive && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children!.map((child) => (
                          <Button
                            key={child.type}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 text-muted-foreground hover:text-foreground"
                            onClick={() => onNavigate?.(child.path, child.type)}
                          >
                            {child.icon}
                            <span className="flex-1 text-left">{child.label}</span>
                            {child.count !== undefined && (
                              <span className="text-xs">{child.count}</span>
                            )}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/40">
          <div className="space-y-2">
            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Create New</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {visibleNavItems
                  .filter(item => item.createAction)
                  .map((item) => (
                    <DropdownMenuItem
                      key={item.type}
                      onClick={() => handleCreateClick(item.createAction!)}
                    >
                      {item.icon}
                      {item.label.slice(0, -1)}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Role Context */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>View as:</span>
              <Badge variant="outline" className="text-xs">
                {currentRole}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Helper function to get object title
function getObjectTitle(object: AnyObject): string {
  if ('name' in object) return object.name;
  if ('title' in object) return object.title;
  if ('subject' in object) return object.subject || 'Untitled';
  return 'Untitled';
}

export default ObjectNavigation;
