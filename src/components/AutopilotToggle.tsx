
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Calendar, FileText, Target, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutopilotToggleProps {
  projectId: string;
  projectName: string;
  isEnabled?: boolean;
}

const AutopilotToggle: React.FC<AutopilotToggleProps> = ({ 
  projectId, 
  projectName,
  isEnabled = false 
}) => {
  const [autopilotEnabled, setAutopilotEnabled] = useState(isEnabled);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('project_integrations')
        .upsert({
          project_id: projectId,
          provider: 'ai_autopilot',
          status: enabled ? 'connected' : 'disconnected',
          config: {
            weekly_summary: enabled,
            daily_reports: enabled,
            next_actions: enabled,
            daily_limit: 10,
            last_action_count: 0,
            last_reset_date: new Date().toISOString().split('T')[0]
          }
        });

      if (error) throw error;

      setAutopilotEnabled(enabled);
      
      if (enabled) {
        // Trigger initial setup
        await supabase.functions.invoke('setupAutopilot', {
          body: { project_id: projectId }
        });
        
        toast.success(`AI Autopilot activated for ${projectName}`, {
          description: 'Weekly summaries, daily reports, and smart tasks will be generated automatically.',
          action: {
            label: 'View Schedule',
            onClick: () => console.log('View autopilot schedule')
          }
        });
      } else {
        toast.info(`AI Autopilot deactivated for ${projectName}`, {
          description: 'Automated tasks have been disabled.'
        });
      }
    } catch (error) {
      console.error('Error toggling autopilot:', error);
      toast.error('Failed to update Autopilot settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">AI Autopilot</CardTitle>
            {autopilotEnabled && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            )}
          </div>
          <Switch
            checked={autopilotEnabled}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>
        <CardDescription>
          Automated AI-driven project management for {projectName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div className="flex-1">
              <Label className="text-sm font-medium">Weekly Executive Summary</Label>
              <p className="text-xs text-muted-foreground">
                Auto-drafted email to Outlook (manual send required)
              </p>
            </div>
            <Badge variant={autopilotEnabled ? "default" : "secondary"} className="text-xs">
              {autopilotEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <FileText className="w-4 h-4 text-green-500" />
            <div className="flex-1">
              <Label className="text-sm font-medium">Daily Site Reports</Label>
              <p className="text-xs text-muted-foreground">
                Generated from Track3D + RFI data, filed under Documents
              </p>
            </div>
            <Badge variant={autopilotEnabled ? "default" : "secondary"} className="text-xs">
              {autopilotEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <Target className="w-4 h-4 text-purple-500" />
            <div className="flex-1">
              <Label className="text-sm font-medium">Next-Best-Action Tasks</Label>
              <p className="text-xs text-muted-foreground">
                Smart task generation and role-based assignment
              </p>
            </div>
            <Badge variant={autopilotEnabled ? "default" : "secondary"} className="text-xs">
              {autopilotEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>

        {autopilotEnabled && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-800">
              Limited to 10 automated actions per day
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutopilotToggle;
