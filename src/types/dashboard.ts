
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
  name: string;
  description?: string;
  component: React.ComponentType<any>;
  category: 'construction' | 'facilities' | 'other';
  roles: readonly UserRole[];
  defaultSize: WidgetSize;
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
