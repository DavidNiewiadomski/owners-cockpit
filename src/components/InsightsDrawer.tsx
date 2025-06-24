
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Eye, AlertTriangle, Info, AlertCircle, XCircle } from 'lucide-react';
import { useInsights, useUnreadInsights, useMarkInsightRead, type Insight } from '@/hooks/useInsights';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from '@/hooks/useRouter';

interface InsightsDrawerProps {
  projectId?: string;
}

const InsightsDrawer: React.FC<InsightsDrawerProps> = ({ projectId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: insights = [] } = useInsights(projectId);
  const { data: unreadInsights = [] } = useUnreadInsights(projectId);
  const markAsRead = useMarkInsightRead();
  const router = useRouter();

  const getSeverityIcon = (severity: Insight['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: Insight['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleInsightClick = (insight: Insight) => {
    // Mark as read
    if (!insight.read_at) {
      markAsRead.mutate(insight.id);
    }

    // Navigate based on context
    if (insight.context_data?.type) {
      switch (insight.context_data.type) {
        case 'overdue_tasks':
          router.push(`/projects/${insight.project_id}?view=dashboard&highlight=tasks`);
          break;
        case 'budget_overrun':
          router.push(`/projects/${insight.project_id}?view=dashboard&highlight=budget`);
          break;
        case 'safety_incidents':
          router.push(`/projects/${insight.project_id}?view=dashboard&highlight=safety`);
          break;
        case 'overdue_rfis':
          router.push(`/projects/${insight.project_id}?view=dashboard&highlight=rfi`);
          break;
        default:
          router.push(`/projects/${insight.project_id}`);
      }
    }

    setIsOpen(false);
  };

  // Listen for custom event to open drawer
  React.useEffect(() => {
    const handleOpenDrawer = (event: CustomEvent) => {
      setIsOpen(true);
      // Optionally scroll to specific insight
      if (event.detail?.insightId) {
        setTimeout(() => {
          const element = document.getElementById(`insight-${event.detail.insightId}`);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('openInsightsDrawer', handleOpenDrawer as EventListener);
    return () => {
      window.removeEventListener('openInsightsDrawer', handleOpenDrawer as EventListener);
    };
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadInsights.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadInsights.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            AI Insights
            {unreadInsights.length > 0 && (
              <Badge variant="secondary">{unreadInsights.length} unread</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Proactive insights and alerts from your project data
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No insights available yet</p>
                <p className="text-sm">AI-generated insights will appear here</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  id={`insight-${insight.id}`}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                    !insight.read_at ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => handleInsightClick(insight)}
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(insight.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {insight.title}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(insight.severity)}`}
                        >
                          {insight.severity}
                        </Badge>
                        {!insight.read_at && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(insight.created_at), { addSuffix: true })}
                        </span>
                        {!insight.read_at && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead.mutate(insight.id);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default InsightsDrawer;
