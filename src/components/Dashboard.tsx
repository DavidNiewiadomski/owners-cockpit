
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
  
  // Get the active category from localStorage to determine which dashboard to show
  // This handles the case where UI categories map to different backend roles
  const getActiveCategory = () => {
    // Check if there's a stored active category in sessionStorage
    const storedCategory = sessionStorage.getItem('activeCategory');
    if (storedCategory) {
      return storedCategory;
    }
    
    // Fallback to role-based mapping
    switch (currentRole) {
      case 'Executive':
        return 'Overview';
      case 'Preconstruction':
        return 'Preconstruction'; // Default to Preconstruction, but could be Design
      case 'Construction':
        return 'Construction'; // Default to Construction, but could be Safety
      case 'Sustainability':
        return 'Sustainability';
      case 'Legal':
        return 'Legal';
      case 'Finance':
        return 'Finance';
      case 'Facilities':
        return 'Facilities';
      default:
        return 'Overview';
    }
  };
  
  const activeCategory = getActiveCategory();

  // Route to appropriate dashboard based on active category (not just role)
  switch (activeCategory) {
    case 'Overview':
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
