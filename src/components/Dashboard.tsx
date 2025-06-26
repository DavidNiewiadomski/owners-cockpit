
import React, { useState, useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';
import OverviewDashboard from '@/components/dashboards/OverviewDashboard';
import PlanningDashboard from '@/components/dashboards/PlanningDashboard';
import DesignDashboard from '@/components/dashboards/DesignDashboard';
import PreconstructionDashboard from '@/components/dashboards/PreconstructionDashboard';
import ConstructionDashboard from '@/components/dashboards/ConstructionDashboard';
import SustainabilityDashboard from '@/components/dashboards/SustainabilityDashboard';
import LegalDashboard from '@/components/dashboards/LegalDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import FacilitiesDashboard from '@/components/dashboards/FacilitiesDashboard';
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard';

interface DashboardProps {
  projectId: string | null; // Allow null for portfolio view
}

const Dashboard: React.FC<DashboardProps> = ({ projectId }) => {
  const { currentRole } = useRole();
  const [activeCategory, setActiveCategory] = useState<string>('Overview');

  useEffect(() => {
    const getActiveCategory = () => {
      const storedCategory = sessionStorage.getItem('activeCategory');
      if (storedCategory) {
        return storedCategory;
      }
      switch (currentRole) {
        case 'Executive': return 'Overview';
        case 'Preconstruction': return 'Preconstruction';
        case 'Construction': return 'Construction';
        case 'Sustainability': return 'Sustainability';
        case 'Legal': return 'Legal';
        case 'Finance': return 'Finance';
        case 'Facilities': return 'Facilities';
        default: return 'Overview';
      }
    };
    
    setActiveCategory(getActiveCategory());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activeCategory' && e.newValue) {
        setActiveCategory(e.newValue);
      }
    };
    const handleCustomStorageChange = (e: CustomEvent) => {
      setActiveCategory(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('activeCategoryChange', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activeCategoryChange', handleCustomStorageChange as EventListener);
    };
  }, []);

  const effectiveProjectId = projectId || 'portfolio';

  // When no project is selected, render portfolio-level dashboards based on role
  if (!projectId) {
    switch (currentRole) {
      case 'Executive': return <ExecutiveDashboard projectId={effectiveProjectId} />;
      case 'Preconstruction': return <PreconstructionDashboard projectId={effectiveProjectId} />;
      case 'Construction': return <ConstructionDashboard projectId={effectiveProjectId} />;
      case 'Facilities': return <FacilitiesDashboard projectId={effectiveProjectId} />;
      case 'Sustainability': return <SustainabilityDashboard projectId={effectiveProjectId} />;
      case 'Legal': return <LegalDashboard projectId={effectiveProjectId} />;
      case 'Finance': return <FinanceDashboard projectId={effectiveProjectId} />;
      default: return <ExecutiveDashboard projectId={effectiveProjectId} />;
    }
  }

  // When a project is selected, use activeCategory to render the correct dashboard
  switch (activeCategory) {
    case 'Overview': return <OverviewDashboard projectId={effectiveProjectId} />;
    case 'Planning': return <PlanningDashboard projectId={effectiveProjectId} />;
    case 'Design': return <DesignDashboard projectId={effectiveProjectId} />;
    case 'Preconstruction': return <PreconstructionDashboard projectId={effectiveProjectId} />;
    case 'Construction': return <ConstructionDashboard projectId={effectiveProjectId} />;
    case 'Sustainability': return <SustainabilityDashboard projectId={effectiveProjectId} />;
    case 'Legal': return <LegalDashboard projectId={effectiveProjectId} />;
    case 'Finance': return <FinanceDashboard projectId={effectiveProjectId} />;
    case 'Facilities': return <FacilitiesDashboard projectId={effectiveProjectId} />;
    default: return <OverviewDashboard projectId={effectiveProjectId} />;
  }
};

export default Dashboard;
