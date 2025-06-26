
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

interface DashboardProps {
  projectId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ projectId }) => {
  const { currentRole } = useRole();
  const [activeCategory, setActiveCategory] = useState<string>('Overview');
  
  // Initialize activeCategory from sessionStorage and listen for changes
  useEffect(() => {
    // Only initialize from sessionStorage or use fallback on first load
    const getActiveCategory = () => {
      const storedCategory = sessionStorage.getItem('activeCategory');
      if (storedCategory) {
        return storedCategory;
      }
      
      // Fallback to role-based mapping ONLY on initial load
      switch (currentRole) {
        case 'Executive':
          return 'Overview';
        case 'Preconstruction':
          return 'Preconstruction';
        case 'Construction':
          return 'Construction';
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
    
    const initialCategory = getActiveCategory();
    setActiveCategory(initialCategory);
    
    // Listen for storage events to react to tab changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'activeCategory' && e.newValue) {
        console.log('Dashboard: Storage change detected, new activeCategory:', e.newValue);
        setActiveCategory(e.newValue);
      }
    };
    
    // Custom event listener for same-tab updates (storage event doesn't fire in same tab)
    const handleCustomStorageChange = (e: CustomEvent) => {
      console.log('Dashboard: Custom storage change detected, new activeCategory:', e.detail);
      setActiveCategory(e.detail);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('activeCategoryChange', handleCustomStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activeCategoryChange', handleCustomStorageChange as EventListener);
    };
  }, []); // Remove currentRole dependency to prevent reset on role changes
  
  // AGGRESSIVE DEBUG LOGGING
  console.log('===========================================');
  console.log('Dashboard RENDER - currentRole =', currentRole);
  console.log('Dashboard RENDER - activeCategory =', activeCategory);
  console.log('Dashboard RENDER - sessionStorage activeCategory =', sessionStorage.getItem('activeCategory'));
  console.log('Dashboard RENDER - activeCategory type =', typeof activeCategory);
  console.log('Dashboard RENDER - activeCategory length =', activeCategory?.length);
  console.log('Dashboard RENDER - Planning check =', activeCategory === 'Planning');
  console.log('Dashboard RENDER - Design check =', activeCategory === 'Design');
  console.log('===========================================');

  // Route to appropriate dashboard based on active category (not just role)
  if (activeCategory === 'Overview') {
    console.log('Dashboard: Rendering OverviewDashboard');
    return <OverviewDashboard projectId={projectId} />;
  } else if (activeCategory === 'Planning') {
    console.log('Dashboard: Rendering PlanningDashboard');
    return <PlanningDashboard projectId={projectId} />;
  } else if (activeCategory === 'Design') {
    console.log('Dashboard: Rendering DesignDashboard');
    return <DesignDashboard projectId={projectId} />;
  } else if (activeCategory === 'Preconstruction') {
    console.log('Dashboard: Rendering PreconstructionDashboard');
    return <PreconstructionDashboard projectId={projectId} />;
  } else if (activeCategory === 'Construction') {
    console.log('Dashboard: Rendering ConstructionDashboard');
    return <ConstructionDashboard projectId={projectId} />;
  } else if (activeCategory === 'Sustainability') {
    console.log('Dashboard: Rendering SustainabilityDashboard');
    return <SustainabilityDashboard projectId={projectId} />;
  } else if (activeCategory === 'Legal') {
    console.log('Dashboard: Rendering LegalDashboard');
    return <LegalDashboard projectId={projectId} />;
  } else if (activeCategory === 'Finance') {
    console.log('Dashboard: Rendering FinanceDashboard');
    return <FinanceDashboard projectId={projectId} />;
  } else if (activeCategory === 'Facilities') {
    console.log('Dashboard: Rendering FacilitiesDashboard');
    return <FacilitiesDashboard projectId={projectId} />;
  } else {
    console.log('Dashboard: Rendering DEFAULT OverviewDashboard, activeCategory was:', activeCategory);
    return <OverviewDashboard projectId={projectId} />;
  }
};

export default Dashboard;
