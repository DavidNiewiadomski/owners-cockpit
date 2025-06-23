
import React from 'react';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { useDashboardStore } from '@/stores/useDashboardStore';

const PortfolioDashboard: React.FC = () => {
  const { layouts, widgets, loadLayout, updateLayout } = useDashboardStore();

  React.useEffect(() => {
    // Load portfolio layout (using 'portfolio' as the project ID)
    loadLayout('portfolio');
  }, [loadLayout]);

  const handleLayoutChange = React.useCallback((newLayout: any) => {
    updateLayout('portfolio', newLayout);
  }, [updateLayout]);

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of all projects and portfolio-wide metrics
        </p>
      </div>
      
      <DashboardGrid
        projectId="portfolio"
        layout={layouts['portfolio'] || []}
        widgets={widgets}
        onLayoutChange={handleLayoutChange}
      />
    </div>
  );
};

export default PortfolioDashboard;
