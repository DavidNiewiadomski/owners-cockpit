import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import FacilitiesDashboard from '@/components/dashboards/FacilitiesDashboard';

const Facilities = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'portfolio';
  const view = searchParams.get('view');

  useEffect(() => {
    if (view) {
      // Handle specific views like 'create-work-order', 'maintenance-schedule', 'energy-reports', 'system-inspection'
      console.log('Facilities view:', view);
    }
  }, [view]);

  return (
    <MainLayout activeCategory="facilities">
      <FacilitiesDashboard projectId={projectId} activeCategory="facilities" />
    </MainLayout>
  );
};

export default Facilities;