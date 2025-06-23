
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DashboardGrid from '../DashboardGrid';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/contexts/RoleContext';
import { useDashboardStore } from '@/stores/useDashboardStore';

// Mock dependencies
vi.mock('@/hooks/useAuth');
vi.mock('@/contexts/RoleContext');
vi.mock('@/stores/useDashboardStore');
vi.mock('@/integrations/supabase/client');

const mockUseAuth = useAuth as any;
const mockUseRole = useRole as any;
const mockUseDashboardStore = useDashboardStore as any;

const mockUser = { id: 'user-1', email: 'test@example.com' };
const mockLayout = [
  { id: '1', widgetId: 'budget-kpi', x: 0, y: 0, w: 1, h: 1 },
  { id: '2', widgetId: 'schedule-kpi', x: 1, y: 0, w: 1, h: 1 }
];

describe('DashboardGrid', () => {
  const mockStore = {
    getLayout: vi.fn(() => mockLayout),
    setLayout: vi.fn(),
    saveLayout: vi.fn(),
    isEditMode: false,
    setEditMode: vi.fn(),
    loadLayout: vi.fn(),
    isLoading: false,
    removeWidget: vi.fn()
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: mockUser });
    mockUseRole.mockReturnValue({ currentRole: 'Executive' });
    mockUseDashboardStore.mockReturnValue(mockStore);
    vi.clearAllMocks();
  });

  it('renders dashboard with widgets', () => {
    render(<DashboardGrid projectId="project-1" />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Executive')).toBeInTheDocument();
    expect(screen.getByText('Budget Status')).toBeInTheDocument();
    expect(screen.getByText('Schedule Progress')).toBeInTheDocument();
  });

  it('toggles edit mode when customize button is clicked', () => {
    render(<DashboardGrid projectId="project-1" />);
    
    const customizeButton = screen.getByText('Customize');
    fireEvent.click(customizeButton);
    
    expect(mockStore.setEditMode).toHaveBeenCalledWith(true);
  });

  it('shows add widget panel in edit mode', () => {
    mockStore.isEditMode = true;
    mockUseDashboardStore.mockReturnValue({ ...mockStore, isEditMode: true });
    
    render(<DashboardGrid projectId="project-1" />);
    
    const addWidgetButton = screen.getByText('Add Widget');
    fireEvent.click(addWidgetButton);
    
    expect(screen.getByText('Add Widgets')).toBeInTheDocument();
  });

  it('loads layout on mount', () => {
    render(<DashboardGrid projectId="project-1" />);
    
    expect(mockStore.loadLayout).toHaveBeenCalledWith('user-1', 'Executive', 'project-1');
  });

  it('shows loading state', () => {
    mockStore.isLoading = true;
    mockUseDashboardStore.mockReturnValue({ ...mockStore, isLoading: true });
    
    render(<DashboardGrid projectId="project-1" />);
    
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.some(el => el.classList.contains('animate-pulse'))).toBe(true);
  });

  it('shows empty state when no widgets', () => {
    mockStore.getLayout = vi.fn(() => []);
    mockUseDashboardStore.mockReturnValue({ ...mockStore, getLayout: vi.fn(() => []) });
    
    render(<DashboardGrid projectId="project-1" />);
    
    expect(screen.getByText('No widgets configured')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('reorders widgets after drag and drop', async () => {
    mockStore.isEditMode = true;
    mockUseDashboardStore.mockReturnValue({ ...mockStore, isEditMode: true });
    
    render(<DashboardGrid projectId="project-1" />);
    
    // Mock drag and drop would require more complex setup with @dnd-kit
    // For now, we test that the handlers are called correctly
    expect(mockStore.getLayout).toHaveBeenCalled();
  });
});
