# Owners Cockpit - AI-First Construction Dashboard

An intelligent dashboard system for building owners with role-based customization, drag-and-drop widgets, and AI-powered insights.

## 🚀 Features

### ✦ UI Dashboard Builder

- **Widget Registry**: Extensible system with 8+ pre-built widgets (Budget KPI, Schedule KPI, Risk Distribution, AI Insights, etc.)
- **Drag & Drop**: Smooth reordering with @dnd-kit, grid-based snapping, and visual feedback
- **Role-Based Layouts**: Separate customizable layouts per user role (Executive, Finance, Construction, etc.)
- **Persistent Storage**: Layout state saved to Supabase with 800ms debounced auto-save
- **Accessibility**: Full keyboard navigation support and touch-friendly controls (48px+ touch targets)
- **Responsive Design**: Auto-fitting grid with minimum 300px widget widths

### 🎯 Dashboard Widgets

1. **Budget KPI** - Budget status, variance tracking, spending progress
2. **Schedule KPI** - Task completion, timeline progress, milestone tracking
3. **Risk Distribution** - Risk level pie chart with severity categorization
4. **AI Insights** - AI-powered recommendations and alerts
5. **Timeline Chart** - Project phases with planned vs actual progress
6. **Energy Usage** - Energy consumption trends and efficiency metrics
7. **Work Orders** - Active maintenance tasks and priorities
8. **Contract Renewals** - Upcoming contract expirations and values

### 🔐 Role-Based Access

- **Executive**: High-level KPIs, budget overview, strategic insights
- **Finance**: Budget details, contract renewals, financial metrics
- **Construction**: Schedule progress, work orders, timeline charts
- **Facilities**: Work orders, energy usage, building operations
- **Legal**: Contract renewals, risk distribution, compliance
- **Sustainability**: Energy usage, environmental metrics
- **Preconstruction**: Budget planning, timeline charts, feasibility

## 🛠 Technical Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS
- **Drag & Drop**: @dnd-kit/core + @dnd-kit/sortable
- **State Management**: Zustand for local state
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Charts**: Recharts for data visualization
- **Testing**: Vitest + React Testing Library
- **Build**: Vite

## 📦 Installation

```bash
# Install dependencies
npm install

# Required packages (auto-installed)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities zustand
```

## 🗄 Database Setup

Run this SQL migration to create the dashboard layouts table:

```sql
-- Create user_dashboard_layouts table
CREATE TABLE public.user_dashboard_layouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    project_id UUID NOT NULL,
    layout JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role, project_id)
);

-- Enable RLS
ALTER TABLE public.user_dashboard_layouts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own layouts
CREATE POLICY "Users can manage their own dashboard layouts"
    ON public.user_dashboard_layouts
    FOR ALL USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_user_dashboard_layouts_user_role_project 
    ON public.user_dashboard_layouts(user_id, role, project_id);
```

## 🎨 Usage

### Basic Dashboard Implementation

```tsx
import DashboardGrid from '@/components/dashboard/DashboardGrid';

function ProjectDashboard({ projectId }: { projectId: string }) {
  return (
    <div className="p-6">
      <DashboardGrid projectId={projectId} />
    </div>
  );
}
```

### Role-Based Layout Loading

The dashboard automatically:
- Loads saved layouts on mount
- Switches layouts when user changes roles
- Falls back to role-specific defaults for new users

### Creating Custom Widgets

1. **Create Widget Component**:
```tsx
// src/widgets/components/MyWidget.tsx
import React from 'react';
import { Card } from '@/components/ui/card';

interface MyWidgetProps {
  projectId?: string;
}

const MyWidget: React.FC<MyWidgetProps> = ({ projectId }) => {
  return (
    <Card className="p-4 h-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        My Custom Widget
      </h3>
      {/* Widget content */}
    </Card>
  );
};

export default MyWidget;
```

2. **Register Widget**:
```tsx
// src/widgets/index.ts
import MyWidget from './components/MyWidget';

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  // ... existing widgets
  {
    id: 'my-widget',
    title: 'My Widget',
    description: 'Custom widget description',
    defaultSize: { w: 1, h: 1 },
    component: MyWidget,
    category: 'kpi',
    roles: ['Executive', 'Finance'] // Optional: restrict to specific roles
  }
];
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run widget tests
npm test -- widgets

# Run dashboard tests  
npm test -- dashboard
```

### E2E Tests (Cypress)

```bash
# Run E2E tests
npm run cypress:open

# Test widget persistence
npm test -- --grep "dashboard persistence"
```

Key test scenarios:
- Widget reordering updates layout state
- Layout persistence across page reloads
- Role switching loads correct layouts
- Add/remove widgets updates storage
- Keyboard navigation works correctly

## 📱 Accessibility Features

- **Keyboard Navigation**: Arrow keys for widget reordering
- **Touch Support**: 48px+ touch targets for mobile
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators during drag operations
- **High Contrast**: Works with system accessibility settings

## 🔧 Configuration

### Default Layouts

Edit `src/stores/useDashboardStore.ts` to customize default layouts per role:

```tsx
const generateDefaultLayout = (role: UserRole): LayoutItem[] => {
  const defaults: Record<UserRole, LayoutItem[]> = {
    Executive: [
      { id: '1', widgetId: 'budget-kpi', x: 0, y: 0, w: 1, h: 1 },
      // ... more widgets
    ],
    // ... other roles
  };
  return defaults[role] || [];
};
```

### Widget Categories

Widgets are organized by category for better UX:
- `kpi`: Key Performance Indicators
- `chart`: Data visualizations  
- `table`: Tabular data displays
- `insights`: AI-powered recommendations

## 🚀 Performance Optimizations

- **Debounced Saving**: 800ms delay prevents excessive API calls
- **Lazy Loading**: Widgets loaded on-demand
- **Memoized Components**: Prevent unnecessary re-renders
- **Optimistic Updates**: Immediate UI feedback before server sync
- **Grid Virtualization**: Efficient rendering for large layouts

## 📊 Analytics & Monitoring

Track dashboard usage patterns:
- Widget popularity by role
- Layout modification frequency  
- Drag/drop interaction metrics
- Load time performance

## 🔄 State Management

### Zustand Store Structure

```tsx
interface DashboardState {
  layouts: Record<string, LayoutItem[]>; // keyed by user-role-project
  isEditMode: boolean;
  isLoading: boolean;
  
  // Actions
  setEditMode: (editMode: boolean) => void;
  setLayout: (userId: string, role: UserRole, projectId: string, layout: LayoutItem[]) => void;
  // ... more actions
}
```

### Layout Persistence

- **Local State**: Zustand for immediate UI updates
- **Remote Sync**: Supabase for persistence across sessions
- **Conflict Resolution**: Last-write-wins with timestamp tracking
- **Offline Support**: Changes queued and synced when online

## 🛡 Security Considerations

- **RLS Policies**: Users can only access their own layouts
- **Input Validation**: Layout data validated before storage
- **XSS Prevention**: All user content properly escaped
- **Role Verification**: Server-side role validation for widget access

This implementation provides a production-ready, accessible, and extensible dashboard system with comprehensive testing and documentation.
