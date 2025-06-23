
import React from 'react';
import DashboardGrid from '@/components/dashboard/DashboardGrid';

const PortfolioDashboard: React.FC = () => {
  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of all projects and portfolio-wide metrics
        </p>
      </div>
      
      {/* Pass null instead of "portfolio" to avoid UUID errors */}
      <DashboardGrid projectId={null} />
    </div>
  );
};

export default PortfolioDashboard;
