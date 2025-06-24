
import React from 'react';
import AIInsightsPanel from './sustainability/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSustainabilityDemoData } from '@/utils/sustainabilityDemoData';
import SustainabilityMetrics from '@/widgets/components/SustainabilityMetrics';

interface SustainabilityDashboardProps {
  projectId: string;
}

const SustainabilityDashboard: React.FC<SustainabilityDashboardProps> = ({ projectId }) => {
  const projectData = generateSustainabilityDemoData();

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SustainabilityMetrics />
        
        <Card>
          <CardHeader>
            <CardTitle>ESG Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Environmental Score</span>
                <span className="font-semibold text-green-600">{projectData.kpis.averageEnergyStarScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Carbon Footprint</span>
                <span className="font-semibold">{projectData.kpis.currentEmissions}T CO2</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Waste Reduction</span>
                <span className="font-semibold text-green-600">{projectData.kpis.totalRecyclingRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sustainability Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Track environmental impact, ESG compliance, and sustainability metrics across 
            your portfolio to meet environmental goals and regulatory requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityDashboard;
