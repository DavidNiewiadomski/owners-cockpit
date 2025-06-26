
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
  
  console.log('DEBUG Dashboard - projectId:', projectId);
  console.log('DEBUG Dashboard - currentRole:', currentRole);
  console.log('DEBUG Dashboard - activeCategory:', activeCategory);

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

  console.log('DEBUG: About to render dashboard for activeCategory:', activeCategory);

  // ALWAYS use activeCategory to render the correct dashboard
  switch (activeCategory) {
    case 'Overview': 
      console.log('DEBUG: Rendering OverviewDashboard');
      return <OverviewDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Planning': 
      console.log('DEBUG: Rendering PlanningDashboard');
      return <PlanningDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Design': 
      console.log('DEBUG: Rendering DesignDashboard');
      return <DesignDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Preconstruction': 
      console.log('DEBUG: Rendering PreconstructionDashboard');
      return <PreconstructionDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Construction': 
      console.log('DEBUG: Rendering ConstructionDashboard');
      return <ConstructionDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Sustainability': 
      console.log('DEBUG: Rendering SustainabilityDashboard');
      return <SustainabilityDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Legal': 
      console.log('DEBUG: Rendering LegalDashboard');
      return <LegalDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Finance': 
      console.log('DEBUG: Rendering FinanceDashboard');
      return <FinanceDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    case 'Facilities': 
      console.log('DEBUG: Rendering FacilitiesDashboard');
      return <FacilitiesDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
    default: 
      console.log('DEBUG: Rendering DEFAULT OverviewDashboard for activeCategory:', activeCategory);
      return <OverviewDashboard projectId={effectiveProjectId} activeCategory={activeCategory} />;
  }
};

export default Dashboard;
