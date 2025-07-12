import type { TimelineEvent } from '@/types/rfp';
import { format, addDays, differenceInDays, isBefore, isAfter } from 'date-fns';

export class TimelineService {
  /**
   * Validates a timeline for consistency and compliance with RFP rules
   */
  static async validateTimeline(events: TimelineEvent[]): Promise<{
    valid: boolean;
    warnings: string[];
    errors: string[];
  }> {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Check for basic timeline structure
    if (events.length === 0) {
      errors.push('Timeline must contain at least one event');
    }

    // Validate event dependencies
    events.forEach(event => {
      if (event.dependencies?.length) {
        event.dependencies.forEach(depId => {
          const dep = events.find(e => e.id === depId);
          if (!dep) {
            errors.push(`Invalid dependency: ${depId} for event ${event.title}`);
          } else if (isBefore(new Date(event.date), new Date(dep.date))) {
            errors.push(
              `Dependency violation: ${event.title} cannot occur before ${dep.title}`
            );
          }
        });
      }
    });

    // Check for critical path completeness
    const criticalPathEvents = events.filter(e => e.criticalPath);
    if (criticalPathEvents.length === 0) {
      warnings.push('No critical path events defined');
    } else {
      // Ensure critical path is connected
      let lastCriticalEvent = criticalPathEvents[0];
      for (let i = 1; i < criticalPathEvents.length; i++) {
        const currentEvent = criticalPathEvents[i];
        if (!currentEvent.dependencies?.includes(lastCriticalEvent.id)) {
          warnings.push(
            `Critical path may be broken between ${lastCriticalEvent.title} and ${currentEvent.title}`
          );
        }
        lastCriticalEvent = currentEvent;
      }
    }

    // Check for minimum durations
    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    const totalDuration = differenceInDays(
      new Date(lastEvent.date),
      new Date(firstEvent.date)
    );

    if (totalDuration < 30) {
      warnings.push('Timeline duration is less than recommended 30 days');
    }

    // Check for proper milestone distribution
    const milestones = events.filter(e => e.type === 'milestone');
    if (milestones.length < 2) {
      warnings.push('Recommended to have at least start and end milestones');
    }

    return {
      valid: errors.length === 0,
      warnings,
      errors,
    };
  }

  /**
   * Optimizes a timeline based on best practices and constraints
   */
  static optimizeTimeline(events: TimelineEvent[]): TimelineEvent[] {
    const optimizedEvents = [...events];

    // Sort events by date
    optimizedEvents.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Adjust durations based on event type and dependencies
    optimizedEvents.forEach(event => {
      switch (event.type) {
        case 'milestone':
          event.duration = 0; // Milestones have no duration
          break;
        case 'task':
          // Ensure minimum task duration
          if (event.duration && event.duration < 1) {
            event.duration = 1;
          }
          break;
        case 'deadline':
          event.duration = 0; // Deadlines are point-in-time
          break;
      }
    });

    // Optimize critical path
    const criticalPathEvents = optimizedEvents.filter(e => e.criticalPath);
    if (criticalPathEvents.length > 0) {
      let currentDate = new Date(criticalPathEvents[0].date);
      criticalPathEvents.forEach((event, index) => {
        if (index > 0) {
          // Set the date based on the previous event's completion
          event.date = format(currentDate, 'yyyy-MM-dd');
        }
        if (event.duration) {
          currentDate = addDays(new Date(event.date), event.duration);
        }
      });
    }

    return optimizedEvents;
  }

  /**
   * Analyzes the critical path and calculates key metrics
   */
  static analyzeTimeline(events: TimelineEvent[]): {
    criticalPathLength: number;
    slackDays: number;
    riskScore: number;
    completionPercentage: number;
  } {
    const criticalPathEvents = events.filter(e => e.criticalPath);
    const criticalPathLength = criticalPathEvents.reduce(
      (acc, event) => acc + (event.duration || 0),
      0
    );

    // Calculate slack days (flexibility in non-critical tasks)
    const nonCriticalTasks = events.filter(e => !e.criticalPath && e.type === 'task');
    const slackDays = nonCriticalTasks.reduce((acc, event) => {
      const dependencies = events.filter(e => event.dependencies?.includes(e.id));
      const earliestStart = dependencies.length
        ? Math.max(...dependencies.map(d => new Date(d.date).getTime()))
        : new Date(event.date).getTime();
      const latestFinish = new Date(event.date).getTime() + (event.duration || 0) * 86400000;
      return acc + (latestFinish - earliestStart) / 86400000;
    }, 0);

    // Calculate risk score (0-100)
    const riskFactors = {
      noBuffer: criticalPathEvents.length > 1 && criticalPathLength === differenceInDays(
        new Date(criticalPathEvents[criticalPathEvents.length - 1].date),
        new Date(criticalPathEvents[0].date)
      ),
      tightDependencies: events.some(e => (e.dependencies?.length ?? 0) > 2),
      shortDuration: events.some(e => e.duration === 1),
    };
    const riskScore = Object.values(riskFactors).filter(Boolean).length * 33.33;

    // Calculate completion percentage
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const completionPercentage = (completedEvents / events.length) * 100;

    return {
      criticalPathLength,
      slackDays,
      riskScore,
      completionPercentage,
    };
  }

  /**
   * Generates a recommended timeline based on RFP requirements
   */
  static async generateRecommendedTimeline(
    startDate: string,
    requirements: {
      requirePreBidConference?: boolean;
      requireTechnicalReview?: boolean;
      requireLegalReview?: boolean;
      complexityLevel?: 'low' | 'medium' | 'high';
    } = {}
  ): Promise<TimelineEvent[]> {
    const timeline: TimelineEvent[] = [];
    let currentDate = new Date(startDate);
    let currentId = 1;

    // Helper function to add events
    const addEvent = (
      title: string,
      type: 'milestone' | 'task' | 'deadline',
      durationDays: number = 0,
      dependencies: string[] = [],
      criticalPath: boolean = false
    ): string => {
      const id = String(currentId++);
      timeline.push({
        id,
        title,
        type,
        date: format(currentDate, 'yyyy-MM-dd'),
        duration: durationDays,
        dependencies,
        status: 'pending',
        criticalPath,
      });
      if (durationDays > 0) {
        currentDate = addDays(currentDate, durationDays);
      }
      return id;
    };

    // Add initial milestone
    const publishId = addEvent('RFP Publication', 'milestone', 0, [], true);

    // Add pre-bid conference if required
    let lastMainId = publishId;
    if (requirements.requirePreBidConference) {
      const confId = addEvent(
        'Pre-Bid Conference',
        'task',
        1,
        [publishId],
        false
      );
      currentDate = addDays(currentDate, 2); // Buffer after conference
      lastMainId = confId;
    }

    // Q&A Period
    const qaPeriodId = addEvent(
      'Q&A Period',
      'task',
      requirements.complexityLevel === 'high' ? 14 : 7,
      [lastMainId],
      true
    );

    // Response compilation
    const responseId = addEvent(
      'Response to Questions',
      'task',
      5,
      [qaPeriodId],
      true
    );

    // Technical and legal reviews if required
    const reviewIds: string[] = [];
    if (requirements.requireTechnicalReview) {
      reviewIds.push(
        addEvent(
          'Technical Review Period',
          'task',
          requirements.complexityLevel === 'high' ? 10 : 5,
          [responseId]
        )
      );
    }
    if (requirements.requireLegalReview) {
      reviewIds.push(
        addEvent(
          'Legal Review Period',
          'task',
          requirements.complexityLevel === 'high' ? 7 : 3,
          [responseId]
        )
      );
    }

    // Final submission deadline
    addEvent(
      'Bid Submission Deadline',
      'deadline',
      0,
      [...reviewIds, responseId],
      true
    );

    return timeline;
  }
}
