
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
  
  // Listen for changes to sessionStorage activeCategory
  useEffect(() => {
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
    
    const newActiveCategory = getActiveCategory();
    setActiveCategory(newActiveCategory);
    
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
  }, [currentRole]);
  
  // Debug logging
  console.log('Dashboard: currentRole =', currentRole);
  console.log('Dashboard: activeCategory =', activeCategory);
  console.log('Dashboard: sessionStorage activeCategory =', sessionStorage.getItem('activeCategory'));

  // Route to appropriate dashboard based on active category (not just role)
  switch (activeCategory) {
    case 'Overview':
      return <OverviewDashboard projectId={projectId} />;
    case 'Planning':
      return <PlanningDashboard projectId={projectId} />;
    case 'Design':
      return <DesignDashboard projectId={projectId} />;
    case 'Preconstruction':
      return <PreconstructionDashboard projectId={projectId} />;
    case 'Construction':
      return <ConstructionDashboard projectId={projectId} />;
    case 'Sustainability':
      return <SustainabilityDashboard projectId={projectId} />;
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
