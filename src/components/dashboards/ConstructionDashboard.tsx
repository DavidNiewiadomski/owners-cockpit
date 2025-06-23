
import React from 'react';
import { Task } from '@/types/tasks';
import { ProjectMetrics, SafetyIncident } from '@/types/construction';
import ConstructionKPIs from '@/components/construction/ConstructionKPIs';
import SafetyDashboard from '@/components/construction/SafetyDashboard';
import RFISubmittals from '@/components/construction/RFISubmittals';
import ProjectSchedule from '@/components/construction/ProjectSchedule';
import DailyOperations from '@/components/construction/DailyOperations';

interface ConstructionDashboardProps {
  projectId: string;
}

const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({ projectId }) => {
  // Mock construction data
  const projectMetrics: ProjectMetrics = {
    overallProgress: 68,
    budgetUtilization: 72,
    workforceCount: 45,
    safetyDays: 127,
    activeRFIs: 12,
    pendingSubmittals: 8
  };

  const tasks: Task[] = [
    {
      id: '1',
      name: 'Foundation Work',
      progress: 95,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-28'),
      priority: 'high',
      assignee: 'Foundation Crew',
      projectId: projectId,
      isLate: false
    },
    {
      id: '2',
      name: 'Structural Steel',
      progress: 75,
      startDate: new Date('2024-02-20'),
      endDate: new Date('2024-04-15'),
      priority: 'high',
      assignee: 'Steel Crew',
      projectId: projectId,
      isLate: false
    },
    {
      id: '3',
      name: 'MEP Rough-in',
      progress: 45,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-30'),
      priority: 'medium',
      assignee: 'MEP Contractors',
      projectId: projectId,
      isLate: true
    },
    {
      id: '4',
      name: 'Drywall & Finishes',
      progress: 15,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-15'),
      priority: 'medium',
      assignee: 'Finish Crew',
      projectId: projectId,
      isLate: false
    }
  ];

  const safetyIncidents: SafetyIncident[] = [
    { date: '2024-06-20', type: 'Near Miss', severity: 'Low', description: 'Unsecured ladder' },
    { date: '2024-06-15', type: 'First Aid', severity: 'Low', description: 'Minor cut' }
  ];

  return (
    <div className="space-y-6">
      {/* Construction KPIs */}
      <ConstructionKPIs metrics={projectMetrics} />

      {/* Safety & Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SafetyDashboard 
          safetyDays={projectMetrics.safetyDays} 
          incidents={safetyIncidents} 
        />
        <RFISubmittals 
          activeRFIs={projectMetrics.activeRFIs} 
          pendingSubmittals={projectMetrics.pendingSubmittals} 
        />
      </div>

      {/* Project Schedule */}
      <ProjectSchedule tasks={tasks} />

      {/* Daily Operations */}
      <DailyOperations />
    </div>
  );
};

export default ConstructionDashboard;
