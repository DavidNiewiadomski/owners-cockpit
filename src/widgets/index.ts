
import { ConstructionProgress } from './components/ConstructionProgress';
import { MaterialDeliveries } from './components/MaterialDeliveries';
import { OpenIssues } from './components/OpenIssues';
import { ProjectTimeline } from './components/ProjectTimeline';
import { SafetyIncidents } from './components/SafetyIncidents';
import { WeatherConditions } from './components/WeatherConditions';
import { MeetingSummary } from './components/MeetingSummary';
import WorkOrders from './components/WorkOrders';
import EnergyUsage from './components/EnergyUsage';
import SustainabilityMetrics from './components/SustainabilityMetrics';
import BudgetKPI from './components/BudgetKPI';
import TimelineChart from './components/TimelineChart';

export const WIDGET_REGISTRY = [
  {
    id: 'budget-kpi',
    name: 'Budget KPI',
    description: 'Key budget performance indicators and variance tracking',
    component: BudgetKPI,
    category: 'construction',
    roles: ['project_manager', 'executive', 'preconstruction'] as const,
    defaultSize: { w: 1, h: 1 }
  },
  {
    id: 'timeline-chart',
    name: 'Timeline Chart',
    description: 'Project timeline visualization with planned vs actual progress',
    component: TimelineChart,
    category: 'construction',
    roles: ['project_manager', 'executive', 'preconstruction'] as const,
    defaultSize: { w: 2, h: 1 }
  },
  {
    id: 'project-timeline',
    name: 'Project Timeline',
    description: 'Visual representation of project milestones and progress',
    component: ProjectTimeline,
    category: 'construction',
    roles: ['project_manager', 'executive'] as const,
    defaultSize: { w: 2, h: 1 },
    supportsMedia: true
  },
  {
    id: 'construction-progress',
    name: 'Construction Progress',
    description: 'Real-time tracking of construction phases and completion rates',
    component: ConstructionProgress,
    category: 'construction',
    roles: ['project_manager', 'site_foreman'] as const,
    defaultSize: { w: 1, h: 1 },
    supportsMedia: true
  },
  {
    id: 'meeting-summary',
    name: 'Meeting Summary',
    description: 'Latest meeting summary with key slide screenshots',
    component: MeetingSummary,
    category: 'construction',
    roles: ['project_manager', 'executive'] as const,
    defaultSize: { w: 1, h: 1 },
    supportsMedia: true
  },
  {
    id: 'material-deliveries',
    name: 'Material Deliveries',
    description: 'Overview of planned vs actual material deliveries',
    component: MaterialDeliveries,
    category: 'construction',
    roles: ['project_manager', 'logistics_coordinator'] as const,
    defaultSize: { w: 1, h: 1 }
  },
  {
    id: 'open-issues',
    name: 'Open Issues',
    description: 'List of open QA issues, RFIs, and submittals',
    component: OpenIssues,
    category: 'construction',
    roles: ['project_manager', 'qa_engineer'] as const,
    defaultSize: { w: 1, h: 1 }
  },
  {
    id: 'safety-incidents',
    name: 'Safety Incidents',
    description: 'Tracking of safety incidents and near-miss events',
    component: SafetyIncidents,
    category: 'construction',
    roles: ['safety_manager', 'site_foreman'] as const,
    defaultSize: { w: 1, h: 1 }
  },
  {
    id: 'weather-conditions',
    name: 'Weather Conditions',
    description: 'Current and forecasted weather conditions at the site',
    component: WeatherConditions,
    category: 'construction',
    roles: ['project_manager', 'site_foreman'] as const,
    defaultSize: { w: 1, h: 1 }
  },
  {
    id: 'work-orders',
    name: 'Work Orders',
    description: 'Active maintenance work orders and status',
    component: WorkOrders,
    category: 'facilities',
    roles: ['facilities_manager', 'project_manager', 'executive'] as const,
    defaultSize: { w: 1, h: 1 }
  },
  {
    id: 'energy-usage',
    name: 'Energy Usage',
    description: 'Building energy consumption and efficiency metrics',
    component: EnergyUsage,
    category: 'facilities',
    roles: ['facilities_manager', 'sustainability_manager', 'executive'] as const,
    defaultSize: { w: 1, h: 1 }
  },
  {
    id: 'sustainability-metrics',
    name: 'Sustainability Metrics',
    description: 'Environmental performance and ESG tracking',
    component: SustainabilityMetrics,
    category: 'sustainability',
    roles: ['sustainability_manager', 'facilities_manager', 'executive'] as const,
    defaultSize: { w: 1, h: 1 }
  }
];

export interface WidgetDefinition {
  id: string;
  name: string;
  description?: string;
  component: React.ComponentType<any>;
  category: 'construction' | 'other' | 'facilities' | 'sustainability';
  roles: readonly string[];
  defaultSize: { w: number; h: number };
  supportsMedia?: boolean;
}

export const WIDGET_CATEGORIES = [
  {
    id: 'construction',
    name: 'Construction',
  },
  {
    id: 'facilities',
    name: 'Facilities',
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
  },
  {
    id: 'other',
    name: 'Other',
  },
];
