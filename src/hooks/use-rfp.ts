import { useState, useEffect, useCallback, useMemo } from 'react';
import type { TimelineEvent, ScopeSection, RFPSettings, ValidationRule } from '@/types/rfp';
import { TimelineService } from '@/services/timeline';
import { NotificationService } from '@/services/notifications';
import { calculateTimelineMetrics, validateScope, calculateOptimalResponsePeriod } from '@/lib/utils/rfp';

interface UseRFPOptions {
  initialData?: {
    timeline?: TimelineEvent[];
    scope?: ScopeSection[];
    settings?: RFPSettings;
  };
  validationRules?: ValidationRule[];
  onSave?: (data: any) => void;
  onValidate?: (result: any) => void;
}

export function useRFP({
  initialData,
  validationRules = [],
  onSave,
  onValidate,
}: UseRFPOptions = {}) {
  // State
  const [timeline, setTimeline] = useState<TimelineEvent[]>(
    initialData?.timeline || []
  );
  const [scope, setScope] = useState<ScopeSection[]>(initialData?.scope || []);
  const [settings, setSettings] = useState<RFPSettings>(
    initialData?.settings || {
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
    }
  );

  // Computed values
  const timelineMetrics = useMemo(
    () => calculateTimelineMetrics(timeline),
    [timeline]
  );

  const scopeValidation = useMemo(
    () => validateScope(scope, validationRules),
    [scope, validationRules]
  );

  const responsePeriod = useMemo(
    () =>
      calculateOptimalResponsePeriod(scope, {
        requirePreBidConference: settings.workflow.requireTechnicalReview,
        isInternational: false, // TODO: Make configurable
      }),
    [scope, settings.workflow.requireTechnicalReview]
  );

  const notifications = useMemo(
    () =>
      NotificationService.generateTimelineNotifications(timeline, {
        reminderDays: settings.notifications.reminderDays,
        emailEnabled: settings.notifications.emailEnabled,
        escalationThreshold: settings.notifications.escalationThreshold,
      }),
    [timeline, settings.notifications]
  );

  // Timeline handlers
  const handleAddTimelineEvent = useCallback(
    (event: Omit<TimelineEvent, 'id'>) => {
      const newEvent: TimelineEvent = {
        ...event,
        id: String(Date.now()),
      };
      setTimeline(prev => [...prev, newEvent]);
    },
    []
  );

  const handleUpdateTimelineEvent = useCallback(
    (eventId: string, updates: Partial<TimelineEvent>) => {
      setTimeline(prev =>
        prev.map(event =>
          event.id === eventId ? { ...event, ...updates } : event
        )
      );
    },
    []
  );

  const handleDeleteTimelineEvent = useCallback((eventId: string) => {
    setTimeline(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const handleOptimizeTimeline = useCallback(() => {
    const optimizedTimeline = TimelineService.optimizeTimeline(timeline);
    setTimeline(optimizedTimeline);
  }, [timeline]);

  // Scope handlers
  const handleAddScopeSection = useCallback(
    (section: Omit<ScopeSection, 'id'>) => {
      const newSection: ScopeSection = {
        ...section,
        id: String(Date.now()),
      };
      setScope(prev => [...prev, newSection]);
    },
    []
  );

  const handleUpdateScopeSection = useCallback(
    (sectionId: string, updates: Partial<ScopeSection>) => {
      setScope(prev =>
        prev.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
        )
      );
    },
    []
  );

  const handleDeleteScopeSection = useCallback((sectionId: string) => {
    setScope(prev => prev.filter(section => section.id !== sectionId));
  }, []);

  // Settings handlers
  const handleUpdateSettings = useCallback(
    (updates: Partial<RFPSettings>) => {
      setSettings(prev => ({ ...prev, ...updates }));
    },
    []
  );

  // Save handler
  const handleSave = useCallback(() => {
    const data = {
      timeline,
      scope,
      settings,
      metrics: {
        timeline: timelineMetrics,
        scope: scopeValidation,
        responsePeriod,
      },
    };

    onSave?.(data);
  }, [
    timeline,
    scope,
    settings,
    timelineMetrics,
    scopeValidation,
    responsePeriod,
    onSave,
  ]);

  // Validation effect
  useEffect(() => {
    const validationResult = {
      timeline: TimelineService.validateTimeline(timeline),
      scope: scopeValidation,
      notifications: notifications.length > 0,
    };

    onValidate?.(validationResult);
  }, [timeline, scopeValidation, notifications, onValidate]);

  return {
    // State
    timeline,
    scope,
    settings,

    // Computed
    timelineMetrics,
    scopeValidation,
    responsePeriod,
    notifications,

    // Timeline handlers
    addTimelineEvent: handleAddTimelineEvent,
    updateTimelineEvent: handleUpdateTimelineEvent,
    deleteTimelineEvent: handleDeleteTimelineEvent,
    optimizeTimeline: handleOptimizeTimeline,

    // Scope handlers
    addScopeSection: handleAddScopeSection,
    updateScopeSection: handleUpdateScopeSection,
    deleteScopeSection: handleDeleteScopeSection,

    // Settings handlers
    updateSettings: handleUpdateSettings,

    // Save handler
    save: handleSave,
  };
}
