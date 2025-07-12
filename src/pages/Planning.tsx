import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import PlanningDashboard from '@/components/dashboards/PlanningDashboard';

const Planning = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'portfolio';
  const view = searchParams.get('view');

  useEffect(() => {
    if (view) {
      // Handle specific views like 'tenant-applications', 'permit-submission', 'submissions'
      console.log('Planning view:', view);
    }
  }, [view]);

  return (
    <MainLayout activeCategory="planning">
      <PlanningDashboard projectId={projectId} activeCategory="planning" />
    </MainLayout>
  );
};

export default Planning;