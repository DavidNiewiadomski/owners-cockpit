
import React from 'react';
import AIInsightsPanel from './construction/AIInsightsPanel';
import ConstructionKPICards from './construction/ConstructionKPICards';
import ConstructionCharts from './construction/ConstructionCharts';
import QualityMetrics from './construction/QualityMetrics';
import CriticalDocuments from './construction/CriticalDocuments';

interface ConstructionDashboardProps {
  projectId: string;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId }) => {
  // Project-specific construction data
  const getProjectData = (id: string) => {
    const projectsData = {
      'lotus': {
        name: 'Project Lotus',
        progressPercent: 68,
        dueDate: 'Dec 1, 2025',
        status: 'on_track' as const,
        daysAheadBehind: 0,
        budgetTotal: 25000000,
        budgetSpent: 20000000,
        changeOrders: 3,
        changeOrderValue: 800000,
        safetyIncidents: 1,
        openRFIs: 8,
        overdueRFIs: 1,
        pendingSubmittals: 4,
        openQAIssues: 2,
        workforce: 45,
        productivity: 94,
        weatherDelays: 2,
        materialDeliveries: [
          { week: 'W1', planned: 85, actual: 88, delayed: 3 },
          { week: 'W2', planned: 92, actual: 90, delayed: 2 },
          { week: 'W3', planned: 78, actual: 82, delayed: 1 },
          { week: 'W4', planned: 95, actual: 91, delayed: 4 }
        ],
        constructionProgress: [
          { phase: 'Foundation', planned: 100, actual: 100, variance: 0 },
          { phase: 'Structure', planned: 85, actual: 88, variance: 3 },
          { phase: 'MEP Rough', planned: 60, actual: 55, variance: -5 },
          { phase: 'Exterior', planned: 40, actual: 45, variance: 5 },
          { phase: 'Interior', planned: 20, actual: 18, variance: -2 },
          { phase: 'Finishes', planned: 5, actual: 3, variance: -2 }
        ],
        qualityMetrics: {
          defectRate: 2.1,
          reworkHours: 45,
          inspectionPass: 94,
          punchListItems: 23
        },
        safetyTrends: [
          { month: 'Jan', incidents: 0, nearMiss: 2, training: 12 },
          { month: 'Feb', incidents: 1, nearMiss: 1, training: 8 },
          { month: 'Mar', incidents: 0, nearMiss: 3, training: 15 },
          { month: 'Apr', incidents: 0, nearMiss: 1, training: 10 },
          { month: 'May', incidents: 0, nearMiss: 2, training: 14 },
          { month: 'Jun', incidents: 1, nearMiss: 1, training: 9 }
        ]
      },
      'portfolio': {
        name: 'Portfolio Construction',
        progressPercent: 65,
        dueDate: 'Q4 2025',
        status: 'mixed' as const,
        daysAheadBehind: -5,
        budgetTotal: 75000000,
        budgetSpent: 58500000,
        changeOrders: 12,
        changeOrderValue: 2800000,
        safetyIncidents: 4,
        openRFIs: 28,
        overdueRFIs: 7,
        pendingSubmittals: 15,
        openQAIssues: 8,
        workforce: 156,
        productivity: 87,
        weatherDelays: 8,
        materialDeliveries: [
          { week: 'W1', planned: 245, actual: 238, delayed: 7 },
          { week: 'W2', planned: 268, actual: 255, delayed: 13 },
          { week: 'W3', planned: 223, actual: 231, delayed: 5 },
          { week: 'W4', planned: 287, actual: 275, delayed: 12 }
        ],
        constructionProgress: [
          { phase: 'Foundation', planned: 100, actual: 98, variance: -2 },
          { phase: 'Structure', planned: 78, actual: 75, variance: -3 },
          { phase: 'MEP Rough', planned: 52, actual: 48, variance: -4 },
          { phase: 'Exterior', planned: 35, actual: 38, variance: 3 },
          { phase: 'Interior', planned: 18, actual: 15, variance: -3 },
          { phase: 'Finishes', planned: 8, actual: 6, variance: -2 }
        ],
        qualityMetrics: {
          defectRate: 3.2,
          reworkHours: 128,
          inspectionPass: 89,
          punchListItems: 67
        },
        safetyTrends: [
          { month: 'Jan', incidents: 1, nearMiss: 5, training: 35 },
          { month: 'Feb', incidents: 2, nearMiss: 3, training: 28 },
          { month: 'Mar', incidents: 0, nearMiss: 7, training: 42 },
          { month: 'Apr', incidents: 1, nearMiss: 4, training: 31 },
          { month: 'May', incidents: 0, nearMiss: 6, training: 38 },
          { month: 'Jun', incidents: 2, nearMiss: 2, training: 25 }
        ]
      }
    };
    return projectsData[id as keyof typeof projectsData] || projectsData.lotus;
  };

  const projectData = getProjectData(projectId);

  return (
    <div className="space-y-6">
      <AIInsightsPanel projectData={projectData} />
      <ConstructionKPICards projectData={projectData} />
      <ConstructionCharts projectData={projectData} />
      <QualityMetrics qualityMetrics={projectData.qualityMetrics} />
      <CriticalDocuments projectName={projectData.name} />
    </div>
  );
};

export default ConstructionDashboard;
