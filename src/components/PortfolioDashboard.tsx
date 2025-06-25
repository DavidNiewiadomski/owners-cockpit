
import React, { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard';
import PreconstructionDashboard from '@/components/dashboards/PreconstructionDashboard';
import ConstructionDashboard from '@/components/dashboards/ConstructionDashboard';
import FacilitiesDashboard from '@/components/dashboards/FacilitiesDashboard';
import SustainabilityDashboard from '@/components/dashboards/SustainabilityDashboard';
import LegalDashboard from '@/components/dashboards/LegalDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import ProjectPortfolioGrid from '@/components/ProjectPortfolioGrid';
import { useAppState } from '@/hooks/useAppState';

const PortfolioDashboard: React.FC = () => {
  const { handleProjectChange } = useAppState();
  
  const handleProjectSelect = (projectId: string) => {
    handleProjectChange(projectId);
  };

  return (
    <div className="p-6">
      <ProjectPortfolioGrid onProjectSelect={handleProjectSelect} />
    </div>
  );
};

export default PortfolioDashboard;
