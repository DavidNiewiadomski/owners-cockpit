import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { RFPSmartTimeline } from './RFPSmartTimeline';
import { NotificationCenter } from './NotificationCenter';
import { useRFP } from '@/hooks/use-rfp';
import { TimelineService } from '@/services/timeline';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Save,
  Share2,
  Users,
  Zap,
} from 'lucide-react';

interface RFPLayoutProps {
  projectId?: string;
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  onSave?: (data: any) => void;
  onShare?: (data: any) => void;
  onExport?: (format: string) => void;
}

export function RFPLayout({
  projectId,
  teamMembers = [],
  onSave,
  onShare,
  onExport,
}: RFPLayoutProps) {
  const { toast } = useToast();
  const rfp = useRFP({
    initialData: {
      // TODO: Load initial data based on projectId
    },
    validationRules: [
      // Add your validation rules here
    ],
    onSave: (data) => {
      onSave?.(data);
      toast({
        title: 'RFP Saved',
        description: 'All changes have been saved successfully.',
      });
    },
    onValidate: (result) => {
      if (!result.timeline.valid) {
        toast({
          title: 'Timeline Validation Issues',
          description: `${result.timeline.errors.length} errors found.`,
          variant: 'destructive',
        });
      }
    },
  });

  const handleAIOptimize = async () => {
    try {
      rfp.optimizeTimeline();
      toast({
        title: 'Timeline Optimized',
        description: 'Timeline has been optimized using AI suggestions.',
      });
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        title: 'Optimization Failed',
        description: 'Could not optimize timeline. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
    onShare?.({
      timeline: rfp.timeline,
      scope: rfp.scope,
      settings: rfp.settings,
    });
  };

  const handleExport = (format: string) => {
    onExport?.(format);
    toast({
      title: 'Export Started',
      description: `Exporting RFP as ${format.toUpperCase()}...`,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">RFP Builder</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                Draft
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 border-green-200"
              >
                {rfp.timelineMetrics.completionPercentage.toFixed(0)}% Complete
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAIOptimize}
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Optimize with AI
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share RFP</DialogTitle>
                  <DialogDescription>
                    Choose how you want to share this RFP
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => handleShare()}
                  >
                    <Users className="h-8 w-8" />
                    <span>Share with Team</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => handleExport('pdf')}
                  >
                    <FileText className="h-8 w-8" />
                    <span>Export as PDF</span>
                  </Button>
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => handleExport('docx')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as DOCX
                  </Button>
                  <Button onClick={handleShare}>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Share Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will save all changes to the RFP. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => rfp.save()}>
                    Save Changes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container py-6">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <div className="h-full">
              <Card className="h-full">
                <RFPSmartTimeline
                  onSave={rfp.save}
                  initialData={{
                    events: rfp.timeline,
                    settings: rfp.settings,
                  }}
                  onGenerateAITimeline={TimelineService.generateRecommendedTimeline}
                  onValidateTimeline={TimelineService.validateTimeline}
                  teamMembers={teamMembers}
                />
              </Card>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25}>
            <div className="h-full space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Timeline Status</h3>
                    <Badge
                      variant="outline"
                      className={
                        rfp.timelineMetrics.delayedEvents > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }
                    >
                      {rfp.timelineMetrics.delayedEvents > 0
                        ? 'At Risk'
                        : 'On Track'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Duration</span>
                      <span className="font-medium">
                        {rfp.timelineMetrics.totalDuration} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Critical Path</span>
                      <span className="font-medium">
                        {rfp.timelineMetrics.criticalPathDuration} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Delayed Tasks</span>
                      <span className="font-medium">
                        {rfp.timelineMetrics.delayedEvents}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <NotificationCenter
                notifications={rfp.notifications}
                onNotificationAction={(id, action) => {
                  // Handle notification actions
                }}
                onSettingsChange={(settings) => {
                  rfp.updateSettings({
                    notifications: {
                      ...rfp.settings.notifications,
                      ...settings,
                    },
                  });
                }}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer */}
      <div className="border-t bg-card">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                Last saved {format(new Date(), 'h:mm a')}
              </span>
            </div>
            {rfp.scopeValidation.violations.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">
                  {rfp.scopeValidation.violations.length} validation issues
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Auto-saving enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
