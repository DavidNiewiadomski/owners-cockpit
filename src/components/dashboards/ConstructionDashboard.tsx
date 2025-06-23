
import React from 'react';
import AIInsightsPanel from './construction/AIInsightsPanel';
import ConstructionKPICards from './construction/ConstructionKPICards';
import ConstructionCharts from './construction/ConstructionCharts';
import QualityMetrics from './construction/QualityMetrics';
import CriticalDocuments from './construction/CriticalDocuments';
import { generateConstructionDemoData, getConstructionProjectData } from '@/utils/constructionDemoData';

interface ConstructionDashboardProps {
  projectId: string;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId }) => {
  // Generate dynamic construction data
  const dashboardData = generateConstructionDemoData();
  const projectData = getConstructionProjectData(projectId);

  // Transform project data to match existing component interfaces
  const transformedProjectData = {
    name: projectData.name,
    progressPercent: projectData.percentComplete,
    dueDate: new Date(projectData.plannedCompletionDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    status: projectData.status,
    daysAheadBehind: projectData.daysDelayed,
    budgetTotal: projectData.budgetTotal,
    budgetSpent: projectData.costToDate,
    changeOrders: projectData.changeOrdersCount,
    changeOrderValue: projectData.changeOrderValue,
    safetyIncidents: projectData.incidentsMajor + projectData.incidentsMinor,
    openRFIs: projectData.openRFIs,
    overdueRFIs: projectData.overdueRFIs,
    pendingSubmittals: projectData.openSubmittals,
    openQAIssues: projectData.openQAIssues,
    workforce: projectData.workforce,
    productivity: projectData.productivity,
    weatherDelays: projectData.weatherDelays,
    materialDeliveries: dashboardData.materialDeliveries,
    constructionProgress: dashboardData.constructionProgress,
    qualityMetrics: projectData.qualityMetrics,
    safetyTrends: dashboardData.safetyTrends
  };

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={transformedProjectData} />
      <ConstructionKPICards projectData={transformedProjectData} />
      <ConstructionCharts projectData={transformedProjectData} />
      <QualityMetrics qualityMetrics={transformedProjectData.qualityMetrics} />
      <CriticalDocuments projectName={transformedProjectData.name} />
    </div>
  );
};

export default ConstructionDashboard;
