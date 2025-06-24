
import React, { useEffect, useState } from 'react';
import AutopilotToggle from './AutopilotToggle';
import { supabase } from '@/integrations/supabase/client';

interface ProjectAutopilotSectionProps {
  projectId: string;
  projectName: string;
}

const ProjectAutopilotSection: React.FC<ProjectAutopilotSectionProps> = ({
  projectId,
  projectName
}) => {
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAutopilotStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('project_integrations')
          .select('status, config')
          .eq('project_id', projectId)
          .eq('provider', 'ai_autopilot')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking autopilot status:', error);
        } else if (data) {
          setAutopilotEnabled(data.status === 'connected');
        }
      } catch (error) {
        console.error('Error checking autopilot status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAutopilotStatus();
  }, [projectId]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />;
  }

  return (
    <AutopilotToggle
      projectId={projectId}
      projectName={projectName}
      isEnabled={autopilotEnabled}
    />
  );
};

export default ProjectAutopilotSection;
