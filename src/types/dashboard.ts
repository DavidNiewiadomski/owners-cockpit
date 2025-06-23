
import { UserRole } from './roles';

export interface WidgetSize {
  w: number;
  h: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface LayoutItem extends WidgetPosition, WidgetSize {
  widgetId: string;
  id: string;
}

export interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  defaultSize: WidgetSize;
  component: React.ComponentType<any>;
  category: 'kpi' | 'chart' | 'table' | 'insights';
  roles?: UserRole[];
}

export interface DashboardLayout {
  id: string;
  userId: string;
  role: UserRole;
  projectId: string;
  layout: LayoutItem[];
  createdAt: Date;
  updatedAt: Date;
}
