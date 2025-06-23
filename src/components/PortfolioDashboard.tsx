
import React, { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard';
import PreconstructionDashboard from '@/components/dashboards/PreconstructionDashboard';
import ConstructionDashboard from '@/components/dashboards/ConstructionDashboard';
import FacilitiesDashboard from '@/components/dashboards/FacilitiesDashboard';
import SustainabilityDashboard from '@/components/dashboards/SustainabilityDashboard';
import LegalDashboard from '@/components/dashboards/LegalDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';

const PortfolioDashboard: React.FC = () => {
  const { currentRole } = useRole();
  
  console.log('PortfolioDashboard rendering with role:', currentRole);

  useEffect(() => {
    console.log('PortfolioDashboard: Role changed to:', currentRole);
  }, [currentRole]);

  const renderDashboard = () => {
    console.log('PortfolioDashboard: Rendering dashboard for role:', currentRole);
    
    switch (currentRole) {
      case 'Executive':
        return <ExecutiveDashboard />;
      case 'Preconstruction':
        return <PreconstructionDashboard />;
      case 'Construction':
        return <ConstructionDashboard />;
      case 'Facilities':
        return <FacilitiesDashboard />;
      case 'Sustainability':
        return <SustainabilityDashboard />;
      case 'Legal':
        return <LegalDashboard />;
      case 'Finance':
        return <FinanceDashboard />;
      default:
        console.warn('Unknown role:', currentRole, 'falling back to Executive');
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {currentRole} Dashboard
        </h1>
        <p className="text-muted-foreground">
          Current Role: {currentRole}
        </p>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default PortfolioDashboard;
