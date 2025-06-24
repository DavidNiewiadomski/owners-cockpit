
import React from 'react';
import DashboardGrid from './DashboardGrid';
import { AIThemeAssistant } from '@/components/ai/AIThemeAssistant';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/contexts/RoleContext';

interface DashboardWithAIProps {
  projectId: string;
}

export const DashboardWithAI: React.FC<DashboardWithAIProps> = ({
  projectId
}) => {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { getLayout } = useDashboardStore();
  
  // Get layout for current user, role, and project
  const layout = user ? getLayout(user.id, currentRole, projectId) : [];
  
  // Extract active widget IDs for AI context
  const activeWidgets = layout.map(item => item.widgetId);
  
  // Determine context based on current time and dashboard state
  const getContext = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    
    // Detect specific activities based on active widgets
    let activity = 'dashboard_viewing';
    if (activeWidgets.includes('budget-kpi')) {
      activity = 'budget_review';
    } else if (activeWidgets.includes('construction-progress')) {
      activity = 'progress_tracking';
    }
    
    return { timeOfDay, activity };
  };

  return (
    <div className="relative">
      <DashboardGrid projectId={projectId} />
      
      {/* AI Theme Assistant */}
      <AIThemeAssistant
        activeWidgets={activeWidgets}
        context={getContext()}
      />
    </div>
  );
};
