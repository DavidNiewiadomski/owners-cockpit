
import { create } from 'zustand';
import type { LayoutItem } from '@/types/dashboard';
import type { UserRole } from '@/types/roles';
import { supabase } from '@/integrations/supabase/client';

interface DashboardState {
  layouts: Record<string, LayoutItem[]>; // key: `${userId}-${role}-${projectId}`
  isEditMode: boolean;
  isLoading: boolean;
  
  // Actions
  setEditMode: (editMode: boolean) => void;
  setLayout: (userId: string, role: UserRole, projectId: string, layout: LayoutItem[]) => void;
  getLayout: (userId: string, role: UserRole, projectId: string) => LayoutItem[];
  loadLayout: (userId: string, role: UserRole, projectId: string) => Promise<void>;
  saveLayout: (userId: string, role: UserRole, projectId: string, layout: LayoutItem[]) => Promise<void>;
  addWidget: (userId: string, role: UserRole, projectId: string, widgetId: string) => void;
  removeWidget: (userId: string, role: UserRole, projectId: string, widgetId: string) => void;
  updateWidgetPosition: (userId: string, role: UserRole, projectId: string, widgetId: string, position: { x: number; y: number }) => void;
}

const generateLayoutKey = (userId: string, role: UserRole, projectId: string): string => 
  `${userId}-${role}-${projectId}`;

const generateDefaultLayout = (role: UserRole): LayoutItem[] => {
  const defaults: Record<UserRole, LayoutItem[]> = {
    Executive: [
      { id: '1', widgetId: 'budget-kpi', x: 0, y: 0, w: 1, h: 1 },
      { id: '2', widgetId: 'schedule-kpi', x: 1, y: 0, w: 1, h: 1 },
      { id: '3', widgetId: 'risk-pie', x: 2, y: 0, w: 1, h: 1 },
      { id: '4', widgetId: 'ai-insights', x: 0, y: 1, w: 3, h: 1 },
      { id: '5', widgetId: 'timeline-chart', x: 0, y: 2, w: 2, h: 1 },
      { id: '6', widgetId: 'energy-usage', x: 2, y: 2, w: 1, h: 1 },
      { id: '7', widgetId: 'construction-progress', x: 0, y: 3, w: 1, h: 1 },
      { id: '8', widgetId: 'safety-incidents', x: 1, y: 3, w: 1, h: 1 },
      { id: '9', widgetId: 'contract-renewals', x: 2, y: 3, w: 1, h: 1 },
    ],
    Finance: [
      { id: '1', widgetId: 'budget-kpi', x: 0, y: 0, w: 1, h: 1 },
      { id: '2', widgetId: 'contract-renewals', x: 1, y: 0, w: 1, h: 1 },
      { id: '3', widgetId: 'timeline-chart', x: 2, y: 0, w: 1, h: 1 },
      { id: '4', widgetId: 'risk-pie', x: 0, y: 1, w: 1, h: 1 },
      { id: '5', widgetId: 'ai-insights', x: 1, y: 1, w: 2, h: 1 },
      { id: '6', widgetId: 'energy-usage', x: 0, y: 2, w: 1, h: 1 },
      { id: '7', widgetId: 'sustainability-metrics', x: 1, y: 2, w: 1, h: 1 },
      { id: '8', widgetId: 'schedule-kpi', x: 2, y: 2, w: 1, h: 1 },
    ],
    Construction: [
      { id: '1', widgetId: 'schedule-kpi', x: 0, y: 0, w: 1, h: 1 },
      { id: '2', widgetId: 'construction-progress', x: 1, y: 0, w: 1, h: 1 },
      { id: '3', widgetId: 'safety-incidents', x: 2, y: 0, w: 1, h: 1 },
      { id: '4', widgetId: 'timeline-chart', x: 0, y: 1, w: 3, h: 1 },
      { id: '5', widgetId: 'material-deliveries', x: 0, y: 2, w: 1, h: 1 },
      { id: '6', widgetId: 'open-issues', x: 1, y: 2, w: 1, h: 1 },
      { id: '7', widgetId: 'weather-conditions', x: 2, y: 2, w: 1, h: 1 },
      { id: '8', widgetId: 'work-orders', x: 0, y: 3, w: 2, h: 1 },
      { id: '9', widgetId: 'budget-kpi', x: 2, y: 3, w: 1, h: 1 },
    ],
    Facilities: [
      { id: '1', widgetId: 'work-orders', x: 0, y: 0, w: 1, h: 1 },
      { id: '2', widgetId: 'energy-usage', x: 1, y: 0, w: 1, h: 1 },
      { id: '3', widgetId: 'sustainability-metrics', x: 2, y: 0, w: 1, h: 1 },
      { id: '4', widgetId: 'safety-incidents', x: 0, y: 1, w: 1, h: 1 },
      { id: '5', widgetId: 'construction-progress', x: 1, y: 1, w: 1, h: 1 },
      { id: '6', widgetId: 'weather-conditions', x: 2, y: 1, w: 1, h: 1 },
      { id: '7', widgetId: 'ai-insights', x: 0, y: 2, w: 3, h: 1 },
      { id: '8', widgetId: 'budget-kpi', x: 0, y: 3, w: 1, h: 1 },
      { id: '9', widgetId: 'schedule-kpi', x: 1, y: 3, w: 1, h: 1 },
    ],
    Sustainability: [
      { id: '1', widgetId: 'energy-usage', x: 0, y: 0, w: 1, h: 1 },
      { id: '2', widgetId: 'sustainability-metrics', x: 1, y: 0, w: 1, h: 1 },
      { id: '3', widgetId: 'weather-conditions', x: 2, y: 0, w: 1, h: 1 },
      { id: '4', widgetId: 'ai-insights', x: 0, y: 1, w: 3, h: 1 },
      { id: '5', widgetId: 'construction-progress', x: 0, y: 2, w: 1, h: 1 },
      { id: '6', widgetId: 'work-orders', x: 1, y: 2, w: 1, h: 1 },
      { id: '7', widgetId: 'budget-kpi', x: 2, y: 2, w: 1, h: 1 },
      { id: '8', widgetId: 'timeline-chart', x: 0, y: 3, w: 2, h: 1 },
      { id: '9', widgetId: 'risk-pie', x: 2, y: 3, w: 1, h: 1 },
    ],
    Legal: [
      { id: '1', widgetId: 'contract-renewals', x: 0, y: 0, w: 1, h: 1 },
      { id: '2', widgetId: 'risk-pie', x: 1, y: 0, w: 1, h: 1 },
      { id: '3', widgetId: 'budget-kpi', x: 2, y: 0, w: 1, h: 1 },
      { id: '4', widgetId: 'ai-insights', x: 0, y: 1, w: 3, h: 1 },
      { id: '5', widgetId: 'safety-incidents', x: 0, y: 2, w: 1, h: 1 },
      { id: '6', widgetId: 'open-issues', x: 1, y: 2, w: 1, h: 1 },
      { id: '7', widgetId: 'schedule-kpi', x: 2, y: 2, w: 1, h: 1 },
      { id: '8', widgetId: 'timeline-chart', x: 0, y: 3, w: 2, h: 1 },
      { id: '9', widgetId: 'sustainability-metrics', x: 2, y: 3, w: 1, h: 1 },
    ],
    Preconstruction: [
      { id: '1', widgetId: 'budget-kpi', x: 0, y: 0, w: 1, h: 1 },
      { id: '2', widgetId: 'schedule-kpi', x: 1, y: 0, w: 1, h: 1 },
      { id: '3', widgetId: 'risk-pie', x: 2, y: 0, w: 1, h: 1 },
      { id: '4', widgetId: 'timeline-chart', x: 0, y: 1, w: 3, h: 1 },
      { id: '5', widgetId: 'ai-insights', x: 0, y: 2, w: 3, h: 1 },
      { id: '6', widgetId: 'material-deliveries', x: 0, y: 3, w: 1, h: 1 },
      { id: '7', widgetId: 'weather-conditions', x: 1, y: 3, w: 1, h: 1 },
      { id: '8', widgetId: 'sustainability-metrics', x: 2, y: 3, w: 1, h: 1 },
    ]
  };

  return defaults[role] || [];
};

// Helper function to safely parse layout data from Supabase
const parseLayoutData = (data: unknown): LayoutItem[] => {
  try {
    if (Array.isArray(data)) {
      // Validate that each item has the required LayoutItem structure
      return data.filter((item): item is LayoutItem => {
        return (
          typeof item === 'object' &&
          item !== null &&
          'id' in item &&
          'widgetId' in item &&
          'x' in item &&
          'y' in item &&
          'w' in item &&
          'h' in item &&
          typeof item.id === 'string' &&
          typeof item.widgetId === 'string' &&
          typeof item.x === 'number' &&
          typeof item.y === 'number' &&
          typeof item.w === 'number' &&
          typeof item.h === 'number'
        );
      });
    }
    if (typeof data === 'string') {
      const parsed = JSON.parse(data);
      return parseLayoutData(parsed); // Recursive call for validation
    }
    return [];
  } catch (error) {
    console.warn('Failed to parse layout data:', error);
    return [];
  }
};

let saveTimeout: NodeJS.Timeout | null = null;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  layouts: {},
  isEditMode: false,
  isLoading: false,

  setEditMode: (editMode) => set({ isEditMode: editMode }),

  setLayout: (userId, role, projectId, layout) => {
    const key = generateLayoutKey(userId, role, projectId);
    set((state) => ({
      layouts: { ...state.layouts, [key]: layout }
    }));
  },

  getLayout: (userId, role, projectId) => {
    const key = generateLayoutKey(userId, role, projectId);
    const state = get();
    return state.layouts[key] || generateDefaultLayout(role);
  },

  loadLayout: async (userId, role, projectId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('user_dashboard_layouts')
        .select('layout')
        .eq('user_id', userId)
        .eq('role', role)
        .eq('project_id', projectId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading layout:', error);
        return;
      }

      const layout = data?.layout ? parseLayoutData(data.layout) : generateDefaultLayout(role);
      get().setLayout(userId, role, projectId, layout);
    } catch (error) {
      console.error('Error loading layout:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveLayout: async (userId, role, projectId, layout) => {
    // Debounce saves to prevent excessive API calls
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('user_dashboard_layouts')
          .upsert({
            user_id: userId,
            role,
            project_id: projectId,
            layout: JSON.stringify(layout),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,role,project_id'
          });

        if (error) {
          console.error('Error saving layout:', error);
        }
      } catch (error) {
        console.error('Error saving layout:', error);
      }
    }, 800);
  },

  addWidget: (userId, role, projectId, widgetId) => {
    const layout = get().getLayout(userId, role, projectId);
    const maxY = Math.max(...layout.map(item => item.y), -1);
    
    const newItem: LayoutItem = {
      id: `widget-${Date.now()}`,
      widgetId,
      x: 0,
      y: maxY + 1,
      w: 1,
      h: 1
    };

    const newLayout = [...layout, newItem];
    get().setLayout(userId, role, projectId, newLayout);
    get().saveLayout(userId, role, projectId, newLayout);
  },

  removeWidget: (userId, role, projectId, widgetId) => {
    const layout = get().getLayout(userId, role, projectId);
    const newLayout = layout.filter(item => item.widgetId !== widgetId);
    get().setLayout(userId, role, projectId, newLayout);
    get().saveLayout(userId, role, projectId, newLayout);
  },

  updateWidgetPosition: (userId, role, projectId, widgetId, position) => {
    const layout = get().getLayout(userId, role, projectId);
    const newLayout = layout.map(item => 
      item.widgetId === widgetId 
        ? { ...item, ...position }
        : item
    );
    get().setLayout(userId, role, projectId, newLayout);
    get().saveLayout(userId, role, projectId, newLayout);
  }
}));
