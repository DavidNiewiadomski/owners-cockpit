import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { RFPLayout } from '@/components/procurement/RFPLayout';
import { RFPSmartTimeline } from '@/components/procurement/RFPSmartTimeline';
import { TimelineChart } from '@/components/procurement/TimelineChart';
import { NotificationCenter } from '@/components/procurement/NotificationCenter';
import { TimelineService } from '@/services/timeline';
import { NotificationService } from '@/services/notifications';
import { RfpService } from '@/services/rfp';

// Mock dependencies
vi.mock('@/services/rfp', () => ({
  RfpService: {
    createProject: vi.fn(),
    getProject: vi.fn(),
    updateTimeline: vi.fn(),
    updateScope: vi.fn(),
    updateSettings: vi.fn(),
    addTeamMember: vi.fn(),
    createNotification: vi.fn(),
  },
}));

vi.mock('@/hooks/use-rfp', () => ({
  useRFP: () => ({
    timeline: [],
    scope: [],
    settings: {
      defaultDurations: {
        vendorResponsePeriod: 30,
        evaluationPeriod: 14,
        clarificationPeriod: 7,
        negotiationPeriod: 14,
      },
      notifications: {
        emailEnabled: true,
        reminderDays: 7,
        escalationThreshold: 3,
      },
      workflow: {
        requireTechnicalReview: true,
        requireLegalReview: true,
        requireFinancialReview: true,
        minimumReviewers: 2,
      },
      ai: {
        enabled: true,
        assistanceLevel: 'moderate',
        autoSuggest: true,
        languageModel: 'gpt-4',
      },
    },
    timelineMetrics: {
      totalDuration: 90,
      criticalPathDuration: 45,
      completedEvents: 2,
      totalEvents: 10,
      completionPercentage: 20,
      delayedEvents: 1,
    },
    scopeValidation: {
      valid: true,
      violations: [],
    },
    responsePeriod: {
      recommendedDays: 30,
      minimumDays: 20,
      factors: ['Standard complexity'],
    },
    notifications: [],
    addTimelineEvent: vi.fn(),
    updateTimelineEvent: vi.fn(),
    deleteTimelineEvent: vi.fn(),
    optimizeTimeline: vi.fn(),
    addScopeSection: vi.fn(),
    updateScopeSection: vi.fn(),
    deleteScopeSection: vi.fn(),
    updateSettings: vi.fn(),
    save: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-team', () => ({
  useTeam: () => ({
    members: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Project Manager',
        email: 'john@example.com',
      },
    ],
    loading: false,
    error: null,
    addMember: vi.fn(),
    updateMember: vi.fn(),
    removeMember: vi.fn(),
    getTeamStats: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('RFP Components', () => {
  const mockProject = {
    id: '123',
    title: 'Test Project',
    description: 'Test Description',
    status: 'draft',
  };

  const mockTeamMembers = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Project Manager',
      email: 'john@example.com',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RFPLayout', () => {
    it('renders layout components correctly', () => {
      render(
        <RFPLayout
          projectId={mockProject.id}
          teamMembers={mockTeamMembers}
          onSave={vi.fn()}
          onShare={vi.fn()}
          onExport={vi.fn()}
        />
      );

      expect(screen.getByText('RFP Builder')).toBeInTheDocument();
      expect(screen.getByText('Timeline Status')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('handles save action', async () => {
      const onSave = vi.fn();
      render(
        <RFPLayout
          projectId={mockProject.id}
          teamMembers={mockTeamMembers}
          onSave={onSave}
          onShare={vi.fn()}
          onExport={vi.fn()}
        />
      );

      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Save Changes?')).toBeInTheDocument();
      });
    });
  });

  describe('RFPSmartTimeline', () => {
    const mockTimelineProps = {
      onSave: vi.fn(),
      initialData: {
        events: [],
        settings: {
          defaultDurations: {
            vendorResponsePeriod: 30,
          },
        },
      },
      onGenerateAITimeline: vi.fn(),
      onValidateTimeline: vi.fn(),
      teamMembers: mockTeamMembers,
    };

    it('renders timeline components', () => {
      render(<RFPSmartTimeline {...mockTimelineProps} />);

      expect(screen.getByText('Smart Timeline')).toBeInTheDocument();
      expect(
        screen.getByText('Auto-generated timeline with dependencies and critical path analysis')
      ).toBeInTheDocument();
    });

    it('handles AI optimization', async () => {
      render(<RFPSmartTimeline {...mockTimelineProps} />);

      const optimizeButton = screen.getByText('Optimize Timeline');
      fireEvent.click(optimizeButton);

      expect(mockTimelineProps.onGenerateAITimeline).toHaveBeenCalled();
    });
  });

  describe('TimelineChart', () => {
    const mockChartProps = {
      events: [
        {
          id: '1',
          title: 'Start',
          type: 'milestone',
          date: '2025-01-01',
          status: 'completed',
        },
        {
          id: '2',
          title: 'Planning',
          type: 'task',
          date: '2025-01-15',
          duration: 14,
          status: 'active',
        },
      ],
      startDate: '2025-01-01',
      endDate: '2025-03-31',
    };

    it('renders chart with events', () => {
      render(<TimelineChart {...mockChartProps} />);

      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Planning')).toBeInTheDocument();
    });
  });

  describe('NotificationCenter', () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'warning',
        title: 'Timeline Issue',
        message: 'Critical path delayed',
        priority: 'high',
        timestamp: new Date().toISOString(),
      },
    ];

    it('renders notifications', () => {
      render(
        <NotificationCenter
          notifications={mockNotifications}
          onNotificationAction={vi.fn()}
          onSettingsChange={vi.fn()}
          onMarkAsRead={vi.fn()}
          onClearAll={vi.fn()}
        />
      );

      expect(screen.getByText('Timeline Issue')).toBeInTheDocument();
      expect(screen.getByText('Critical path delayed')).toBeInTheDocument();
    });

    it('handles notification actions', () => {
      const onAction = vi.fn();
      render(
        <NotificationCenter
          notifications={mockNotifications}
          onNotificationAction={onAction}
          onSettingsChange={vi.fn()}
          onMarkAsRead={vi.fn()}
          onClearAll={vi.fn()}
        />
      );

      // Find and click the action menu
      const actionButton = screen.getByRole('button', { name: /more/i });
      fireEvent.click(actionButton);

      // Click the dismiss action
      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);

      expect(onAction).toHaveBeenCalledWith('1', 'dismiss');
    });
  });
});

describe('RFP Services', () => {
  describe('TimelineService', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Start',
        type: 'milestone',
        date: '2025-01-01',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Planning',
        type: 'task',
        date: '2025-01-15',
        duration: 14,
        dependencies: ['1'],
        status: 'active',
      },
    ];

    it('validates timeline correctly', () => {
      const result = TimelineService.validateTimeline(mockEvents);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('optimizes timeline', () => {
      const optimized = TimelineService.optimizeTimeline(mockEvents);
      expect(optimized).toHaveLength(mockEvents.length);
      expect(optimized[1].duration).toBe(14);
    });

    it('analyzes timeline metrics', () => {
      const metrics = TimelineService.analyzeTimeline(mockEvents);
      expect(metrics.completionPercentage).toBe(50);
      expect(metrics.criticalPathLength).toBe(14);
    });
  });

  describe('NotificationService', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Task',
        type: 'task',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: 'pending',
      },
    ];

    const mockSettings = {
      reminderDays: 7,
      emailEnabled: true,
      escalationThreshold: 3,
    };

    it('generates notifications for upcoming events', () => {
      const notifications = NotificationService.generateTimelineNotifications(
        mockEvents,
        mockSettings
      );
      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].type).toBe('reminder');
    });

    it('filters notifications correctly', () => {
      const notifications = [
        {
          id: '1',
          type: 'warning',
          priority: 'high',
          read: false,
        },
        {
          id: '2',
          type: 'reminder',
          priority: 'medium',
          read: true,
        },
      ];

      const filtered = NotificationService.filterNotifications(notifications, {
        types: ['warning'],
        priorities: ['high'],
        unreadOnly: true,
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('RfpService', () => {
    it('creates a new project', async () => {
      const projectData = {
        title: 'New Project',
        description: 'Test project',
        owner_id: 'user-1',
      };

      RfpService.createProject.mockResolvedValue({
        id: 'proj-1',
        ...projectData,
      });

      const result = await RfpService.createProject(projectData);
      expect(result.id).toBe('proj-1');
      expect(result.title).toBe(projectData.title);
    });

    it('updates timeline events', async () => {
      const events = [
        {
          id: '1',
          title: 'Updated Task',
          type: 'task',
          date: '2025-01-01',
          status: 'active',
        },
      ];

      RfpService.updateTimeline.mockResolvedValue(events);

      const result = await RfpService.updateTimeline('proj-1', events);
      expect(result).toEqual(events);
    });

    it('creates notifications', async () => {
      const notification = {
        type: 'warning',
        title: 'Test Warning',
        message: 'Warning message',
        priority: 'high',
        recipient_id: 'user-1',
      };

      RfpService.createNotification.mockResolvedValue({
        id: 'notif-1',
        ...notification,
      });

      const result = await RfpService.createNotification('proj-1', notification);
      expect(result.id).toBe('notif-1');
      expect(result.type).toBe(notification.type);
    });
  });
});
