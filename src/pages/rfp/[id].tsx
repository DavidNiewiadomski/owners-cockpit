import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RFPLayout } from '@/components/procurement/RFPLayout';
import { useRFP } from '@/hooks/use-rfp';
import { useTeam } from '@/hooks/use-team';
import { RfpService } from '@/services/rfp';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function RFPPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [projectData, setProjectData] = useState<any>(null);

  const team = useTeam({
    projectId: id!,
    onMemberUpdate: async (member) => {
      toast({
        title: 'Team Member Updated',
        description: `${member.name}'s information has been updated.`,
      });
    },
    onMemberRemove: async (memberId) => {
      toast({
        title: 'Team Member Removed',
        description: 'The team member has been removed from the project.',
      });
    },
  });

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await RfpService.getProject(id);
        setProjectData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load project'));
        toast({
          title: 'Error',
          description: 'Failed to load project data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, toast]);

  const handleSave = async (data: any) => {
    if (!id) return;

    try {
      // Update timeline
      if (data.timeline) {
        await RfpService.updateTimeline(id, data.timeline);
      }

      // Update scope
      if (data.scope) {
        await RfpService.updateScope(id, data.scope);
      }

      // Update settings
      if (data.settings) {
        await RfpService.updateSettings(id, data.settings);
      }

      toast({
        title: 'Changes Saved',
        description: 'All changes have been saved successfully.',
      });
    } catch (err) {
      console.error('Failed to save changes:', err);
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (data: any) => {
    if (!id) return;

    try {
      const userIds = data.userIds || [];
      const role = data.role || 'viewer';

      await RfpService.shareProject(id, userIds, role);

      toast({
        title: 'Project Shared',
        description: 'The project has been shared with the selected users.',
      });
    } catch (err) {
      console.error('Failed to share project:', err);
      toast({
        title: 'Error',
        description: 'Failed to share project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async (format: string) => {
    if (!id) return;

    try {
      const url = await RfpService.exportProject(id, format as 'pdf' | 'docx');

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `rfp-${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Complete',
        description: `Project has been exported as ${format.toUpperCase()}.`,
      });
    } catch (err) {
      console.error('Failed to export project:', err);
      toast({
        title: 'Error',
        description: 'Failed to export project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive p-4">
          <h2 className="text-lg font-semibold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="p-8">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground">
            The requested RFP project could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <RFPLayout
      projectId={id!}
      teamMembers={team.members}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
    />
  );
}
