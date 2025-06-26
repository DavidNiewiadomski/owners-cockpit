
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import OverviewDashboard from '@/components/dashboards/OverviewDashboard';
import DesignDashboard from '@/components/dashboards/DesignDashboard';
import PreconstructionDashboard from '@/components/dashboards/PreconstructionDashboard';
import ConstructionDashboard from '@/components/dashboards/ConstructionDashboard';
import SustainabilityDashboard from '@/components/dashboards/SustainabilityDashboard';
import SafetyDashboard from '@/components/dashboards/SafetyDashboard';
import LegalDashboard from '@/components/dashboards/LegalDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import FacilitiesDashboard from '@/components/dashboards/FacilitiesDashboard';

interface DashboardProps {
  projectId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ projectId }) => {
  const { currentRole } = useRole();

  // Route to appropriate dashboard based on current role/category
  switch (currentRole) {
    case 'Overview':
    case 'Executive':
      return <OverviewDashboard projectId={projectId} />;
    case 'Design':
      return <DesignDashboard projectId={projectId} />;
    case 'Preconstruction':
      return <PreconstructionDashboard projectId={projectId} />;
    case 'Construction':
      return <ConstructionDashboard projectId={projectId} />;
    case 'Sustainability':
      return <SustainabilityDashboard projectId={projectId} />;
    case 'Safety':
      return <SafetyDashboard projectId={projectId} />;
    case 'Legal':
      return <LegalDashboard projectId={projectId} />;
    case 'Finance':
      return <FinanceDashboard projectId={projectId} />;
    case 'Facilities':
      return <FacilitiesDashboard projectId={projectId} />;
    default:
      return <OverviewDashboard projectId={projectId} />;
  }
};

export default Dashboard;
