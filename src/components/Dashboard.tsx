
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import ExecutiveDashboard from './dashboards/ExecutiveDashboard';
import PreconstructionDashboard from './dashboards/PreconstructionDashboard';
import ConstructionDashboard from './dashboards/ConstructionDashboard';
import FacilitiesDashboard from './dashboards/FacilitiesDashboard';
import SustainabilityDashboard from './dashboards/SustainabilityDashboard';
import LegalDashboard from './dashboards/LegalDashboard';
import FinanceDashboard from './dashboards/FinanceDashboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  projectId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ projectId }) => {
  const { currentRole, getRoleConfig } = useRole();
  const { access } = useRoleBasedAccess();
  const roleConfig = getRoleConfig(currentRole);

  const renderRoleDashboard = () => {
    switch (currentRole) {
      case 'Executive':
        return <ExecutiveDashboard projectId={projectId} />;
      case 'Preconstruction':
        return <PreconstructionDashboard projectId={projectId} />;
      case 'Construction':
        return <ConstructionDashboard projectId={projectId} />;
      case 'Facilities':
        return <FacilitiesDashboard projectId={projectId} />;
      case 'Sustainability':
        return <SustainabilityDashboard projectId={projectId} />;
      case 'Legal':
        return <LegalDashboard projectId={projectId} />;
      case 'Finance':
        return <FinanceDashboard projectId={projectId} />;
      default:
        return <ExecutiveDashboard projectId={projectId} />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{roleConfig.displayName} Dashboard</h1>
          <p className="text-muted-foreground mt-1">{roleConfig.description}</p>
        </div>
        <Badge variant="outline" className={`bg-${roleConfig.primaryColor}-100 text-${roleConfig.primaryColor}-800`}>
          {currentRole} View
        </Badge>
      </div>

      {/* Role-Specific Dashboard Content */}
      {renderRoleDashboard()}
    </div>
  );
};

export default Dashboard;
