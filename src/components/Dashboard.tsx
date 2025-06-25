
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useProjects } from '@/hooks/useProjects';
import DashboardGrid from '@/components/dashboard/DashboardGrid';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  projectId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ projectId }) => {
  const { currentRole, getRoleConfig } = useRole();
  const { access: _access } = useRoleBasedAccess();
  const { data: projects = [] } = useProjects();
  const roleConfig = getRoleConfig(currentRole);
  
  // Get the actual project name
  const currentProject = projects.find(p => p.id === projectId);
  const projectName = currentProject?.name || `Project ${projectId}`;

  return (
    <div className="space-y-6 p-6" data-testid="dashboard-main">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{projectId === 'portfolio' ? 'Portfolio' : projectName}</h1>
          <p className="text-muted-foreground mt-1">{roleConfig.description}</p>
        </div>
        <Badge variant="outline" className={`bg-${roleConfig.primaryColor}-100 text-${roleConfig.primaryColor}-800`}>
          {currentRole} View
        </Badge>
      </div>

      {/* Dashboard Grid */}
      <DashboardGrid projectId={projectId} />
    </div>
  );
};

export default Dashboard;
