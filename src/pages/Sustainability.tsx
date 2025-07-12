import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import SustainabilityDashboard from '@/components/dashboards/SustainabilityDashboard';

const Sustainability = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'portfolio';
  const view = searchParams.get('view');

  useEffect(() => {
    if (view) {
      // Handle specific views like 'leed-scorecard', 'energy-audit', 'water-usage', 'waste-analysis', 'carbon-calculator'
      console.log('Sustainability view:', view);
    }
  }, [view]);

  return (
    <MainLayout activeCategory="sustainability">
      <SustainabilityDashboard projectId={projectId} activeCategory="sustainability" />
    </MainLayout>
  );
};

export default Sustainability;