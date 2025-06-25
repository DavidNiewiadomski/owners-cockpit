
import type { UserRole } from './roles';

export interface WidgetSize {
  w: number;
  h: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetMedia {
  url: string;
  type: 'image' | 'document' | 'video';
  title?: string;
  thumbnail?: string;
  caption?: string;
}

export interface LayoutItem extends WidgetPosition, WidgetSize {
  widgetId: string;
  id: string;
  media_url?: string;
  media_gallery?: WidgetMedia[];
}

export interface WidgetDefinition {
  id: string;
  name: string;
  description?: string;
  component: React.ComponentType<{ projectId: string; item?: LayoutItem }>;
  category: 'construction' | 'facilities' | 'other' | 'sustainability';
  roles: readonly UserRole[];
  defaultSize: WidgetSize;
  supportsMedia?: boolean;
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
