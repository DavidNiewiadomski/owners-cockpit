
import React, { useEffect, useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, BarChart3 } from 'lucide-react';
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard';
import PreconstructionDashboard from '@/components/dashboards/PreconstructionDashboard';
import ConstructionDashboard from '@/components/dashboards/ConstructionDashboard';
import FacilitiesDashboard from '@/components/dashboards/FacilitiesDashboard';
import SustainabilityDashboard from '@/components/dashboards/SustainabilityDashboard';
import LegalDashboard from '@/components/dashboards/LegalDashboard';
import FinanceDashboard from '@/components/dashboards/FinanceDashboard';
import ProjectPortfolioGrid from '@/components/ProjectPortfolioGrid';
import { useAppState } from '@/hooks/useAppState';

const PortfolioDashboard: React.FC = () => {
  const { currentRole } = useRole();
  const { handleProjectChange } = useAppState();
  const [activeTab, setActiveTab] = useState('grid');
  
  console.log('PortfolioDashboard rendering with role:', currentRole);

  useEffect(() => {
    console.log('PortfolioDashboard: Role changed to:', currentRole);
  }, [currentRole]);

  const handleProjectSelect = (projectId: string) => {
    handleProjectChange(projectId);
  };

  const renderRoleDashboard = () => {
    console.log('PortfolioDashboard: Rendering dashboard for role:', currentRole);
    
    // Use a portfolio project ID for portfolio-level views
    const portfolioProjectId = 'portfolio';
    
    switch (currentRole) {
      case 'Executive':
        return <ExecutiveDashboard projectId={portfolioProjectId} />;
      case 'Preconstruction':
        return <PreconstructionDashboard projectId={portfolioProjectId} />;
      case 'Construction':
        return <ConstructionDashboard projectId={portfolioProjectId} />;
      case 'Facilities':
        return <FacilitiesDashboard projectId={portfolioProjectId} />;
      case 'Sustainability':
        return <SustainabilityDashboard projectId={portfolioProjectId} />;
      case 'Legal':
        return <LegalDashboard projectId={portfolioProjectId} />;
      case 'Finance':
        return <FinanceDashboard projectId={portfolioProjectId} />;
      default:
        console.warn('Unknown role:', currentRole, 'falling back to Executive');
        return <ExecutiveDashboard projectId={portfolioProjectId} />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Portfolio Overview
        </h1>
        <p className="text-muted-foreground">
          {currentRole} perspective across all projects
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid" className="gap-2">
            <LayoutGrid className="w-4 h-4" />
            Project Grid
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            {currentRole} Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-0">
          <ProjectPortfolioGrid onProjectSelect={handleProjectSelect} />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-0">
          {renderRoleDashboard()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioDashboard;
