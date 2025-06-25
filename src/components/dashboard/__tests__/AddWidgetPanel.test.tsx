
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AddWidgetPanel from '../AddWidgetPanel';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/contexts/RoleContext';
import { useDashboardStore } from '@/stores/useDashboardStore';

vi.mock('@/hooks/useAuth');
vi.mock('@/contexts/RoleContext');
vi.mock('@/stores/useDashboardStore');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRole = useRole as jest.MockedFunction<typeof useRole>;
const mockUseDashboardStore = useDashboardStore as jest.MockedFunction<typeof useDashboardStore>;

describe('AddWidgetPanel', () => {
  const mockProps = {
    projectId: 'project-1',
    currentLayout: [
      { id: '1', widgetId: 'budget-kpi', x: 0, y: 0, w: 1, h: 1 }
    ],
    onClose: vi.fn()
  };

  const mockStore = {
    addWidget: vi.fn()
  };

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { id: 'user-1' } });
    mockUseRole.mockReturnValue({ currentRole: 'Executive' });
    mockUseDashboardStore.mockReturnValue(mockStore);
    vi.clearAllMocks();
  });

  it('renders available widgets for current role', () => {
    render(<AddWidgetPanel {...mockProps} />);
    
    expect(screen.getByText('Add Widgets')).toBeInTheDocument();
    expect(screen.getByText('Schedule KPI')).toBeInTheDocument();
    expect(screen.getByText('Risk Distribution')).toBeInTheDocument();
  });

  it('filters out already added widgets', () => {
    render(<AddWidgetPanel {...mockProps} />);
    
    // Budget KPI is already in currentLayout, so it shouldn't appear
    expect(screen.queryByText('Budget KPI')).not.toBeInTheDocument();
  });

  it('adds widget when button is clicked', () => {
    render(<AddWidgetPanel {...mockProps} />);
    
    const addButton = screen.getAllByText('Add Widget')[0];
    fireEvent.click(addButton);
    
    expect(mockStore.addWidget).toHaveBeenCalledWith('user-1', 'Executive', 'project-1', expect.any(String));
  });

  it('closes panel when close button is clicked', () => {
    render(<AddWidgetPanel {...mockProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('shows empty state when no widgets available', () => {
    const propsWithAllWidgets = {
      ...mockProps,
      currentLayout: [
        { id: '1', widgetId: 'budget-kpi', x: 0, y: 0, w: 1, h: 1 },
        { id: '2', widgetId: 'schedule-kpi', x: 1, y: 0, w: 1, h: 1 },
        { id: '3', widgetId: 'risk-pie', x: 2, y: 0, w: 1, h: 1 },
        { id: '4', widgetId: 'ai-insights', x: 0, y: 1, w: 2, h: 1 },
        { id: '5', widgetId: 'timeline-chart', x: 0, y: 2, w: 2, h: 1 }
      ]
    };
    
    render(<AddWidgetPanel {...propsWithAllWidgets} />);
    
    expect(screen.getByText('All available widgets have been added to your dashboard.')).toBeInTheDocument();
  });
});
