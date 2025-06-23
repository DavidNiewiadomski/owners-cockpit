
import { WidgetDefinition } from '@/types/dashboard';
import BudgetKPI from './components/BudgetKPI';
import ScheduleKPI from './components/ScheduleKPI';
import RiskPie from './components/RiskPie';
import AIInsights from './components/AIInsights';
import TimelineChart from './components/TimelineChart';
import EnergyUsage from './components/EnergyUsage';
import WorkOrders from './components/WorkOrders';
import ContractRenewals from './components/ContractRenewals';

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  {
    id: 'budget-kpi',
    title: 'Budget KPI',
    description: 'Budget status and variance tracking',
    defaultSize: { w: 1, h: 1 },
    component: BudgetKPI,
    category: 'kpi',
    roles: ['Executive', 'Finance', 'Preconstruction', 'Construction']
  },
  {
    id: 'schedule-kpi',
    title: 'Schedule KPI',
    description: 'Project timeline and task completion',
    defaultSize: { w: 1, h: 1 },
    component: ScheduleKPI,
    category: 'kpi',
    roles: ['Executive', 'Construction', 'Preconstruction']
  },
  {
    id: 'risk-pie',
    title: 'Risk Distribution',
    description: 'Risk levels across project areas',
    defaultSize: { w: 1, h: 1 },
    component: RiskPie,
    category: 'chart',
    roles: ['Executive', 'Legal', 'Construction']
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description: 'AI-powered recommendations and alerts',
    defaultSize: { w: 2, h: 1 },
    component: AIInsights,
    category: 'insights',
    roles: ['Executive', 'Construction', 'Preconstruction']
  },
  {
    id: 'timeline-chart',
    title: 'Timeline Chart',
    description: 'Project phases and completion status',
    defaultSize: { w: 2, h: 1 },
    component: TimelineChart,
    category: 'chart',
    roles: ['Executive', 'Construction', 'Preconstruction']
  },
  {
    id: 'energy-usage',
    title: 'Energy Usage',
    description: 'Energy consumption and efficiency trends',
    defaultSize: { w: 1, h: 1 },
    component: EnergyUsage,
    category: 'chart',
    roles: ['Facilities', 'Sustainability', 'Executive']
  },
  {
    id: 'work-orders',
    title: 'Work Orders',
    description: 'Active maintenance and repair tasks',
    defaultSize: { w: 1, h: 1 },
    component: WorkOrders,
    category: 'table',
    roles: ['Facilities', 'Construction']
  },
  {
    id: 'contract-renewals',
    title: 'Contract Renewals',
    description: 'Upcoming contract expirations',
    defaultSize: { w: 1, h: 1 },
    component: ContractRenewals,
    category: 'table',
    roles: ['Legal', 'Executive', 'Finance']
  }
];

export { default as BudgetKPI } from './components/BudgetKPI';
export { default as ScheduleKPI } from './components/ScheduleKPI';
export { default as RiskPie } from './components/RiskPie';
export { default as AIInsights } from './components/AIInsights';
export { default as TimelineChart } from './components/TimelineChart';
export { default as EnergyUsage } from './components/EnergyUsage';
export { default as WorkOrders } from './components/WorkOrders';
export { default as ContractRenewals } from './components/ContractRenewals';
