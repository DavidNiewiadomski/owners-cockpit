import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import RiskManagementDashboard from '@/components/dashboards/RiskManagementDashboard';

const RiskManagement = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'portfolio';
  const view = searchParams.get('view');

  useEffect(() => {
    if (view) {
      // Handle specific views like 'critical-risks', 'assessment-tool', 'trend-analysis'
      // This could trigger specific tab selection or modal opening in the dashboard
      console.log('Risk Management view:', view);
    }
  }, [view]);

  return (
    <MainLayout activeCategory="risk-management">
      <RiskManagementDashboard projectId={projectId} activeCategory="risk-management" />
    </MainLayout>
  );
};

export default RiskManagement;