import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';

const Finance = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'portfolio';
  const view = searchParams.get('view');

  useEffect(() => {
    if (view) {
      // Handle specific views like 'roi', 'budget-vs-actual', 'budget-variance', 'budget-update', 'model', 'operating-costs'
      console.log('Finance view:', view);
    }
  }, [view]);

  return (
    <MainLayout activeCategory="finance">
      <FinanceDashboard projectId={projectId} activeCategory="finance" />
    </MainLayout>
  );
};

export default Finance;