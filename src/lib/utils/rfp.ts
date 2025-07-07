import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addDays, differenceInDays, format, isBefore, isAfter } from 'date-fns';
import type { TimelineEvent, ScopeSection, ValidationRule } from '@/types/rfp';

/**
 * Utility function for merging Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency values for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Generates a unique ID for new elements
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Calculates timeline metrics
 */
export function calculateTimelineMetrics(events: TimelineEvent[]) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstEvent = sortedEvents[0];
  const lastEvent = sortedEvents[sortedEvents.length - 1];
  const totalDuration = differenceInDays(
    new Date(lastEvent.date),
    new Date(firstEvent.date)
  );

  const criticalPathEvents = events.filter(e => e.criticalPath);
  const criticalPathDuration = criticalPathEvents.reduce(
    (acc, event) => acc + (event.duration || 0),
    0
  );

  const completedEvents = events.filter(e => e.status === 'completed').length;
  const completionPercentage = (completedEvents / events.length) * 100;

  const delayedEvents = events.filter(e => {
    const today = new Date();
    const eventDate = new Date(e.date);
    return (
      e.status !== 'completed' &&
      isBefore(eventDate, today) &&
      e.type !== 'milestone'
    );
  });

  return {
    totalDuration,
    criticalPathDuration,
    completedEvents,
    totalEvents: events.length,
    completionPercentage,
    delayedEvents: delayedEvents.length,
    startDate: firstEvent.date,
    endDate: lastEvent.date,
  };
}

/**
 * Validates scope sections against rules
 */
export function validateScope(
  sections: ScopeSection[],
  rules: ValidationRule[]
): {
  valid: boolean;
  violations: Array<{
    ruleId: string;
    sectionId: string;
    message: string;
    type: 'warning' | 'error';
  }>;
} {
  const violations = [];

  for (const section of sections) {
    for (const rule of rules) {
      try {
        // Convert rule condition to function
        const conditionFn = new Function('section', `return ${rule.condition}`);
        if (!conditionFn(section)) {
          violations.push({
            ruleId: rule.id,
            sectionId: section.id,
            message: rule.message.replace(
              '${section.title}',
              section.title || 'Untitled Section'
            ),
            type: rule.type,
          });
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    }
  }

  return {
    valid: violations.filter(v => v.type === 'error').length === 0,
    violations,
  };
}

/**
 * Calculates complexity score for a scope section
 */
export function calculateSectionComplexity(section: ScopeSection): {
  score: number;
  factors: string[];
} {
  const factors = [];
  let score = 0;

  // Requirements complexity
  const reqScore = section.requirements.length * 2;
  if (reqScore > 10) factors.push('High number of requirements');
  score += reqScore;

  // Technical complexity
  const technicalReqs = section.requirements.filter(
    r => r.category === 'technical'
  ).length;
  if (technicalReqs > 5) factors.push('High technical complexity');
  score += technicalReqs * 3;

  // Specification complexity
  const specScore = section.specifications.length * 2;
  if (specScore > 10) factors.push('Detailed specifications');
  score += specScore;

  // Dependencies (references)
  const refScore = section.specifications.reduce(
    (acc, spec) => acc + spec.references.length,
    0
  );
  if (refScore > 5) factors.push('Multiple external references');
  score += refScore;

  // Review requirements
  if (section.reviewers && section.reviewers.length > 2) {
    factors.push('Multiple reviewers required');
    score += section.reviewers.length * 2;
  }

  return {
    score: Math.min(100, score), // Cap at 100
    factors,
  };
}

/**
 * Generates a summary of changes between two versions
 */
export function generateChangeSummary<T extends { version: number }>(
  current: T,
  previous: T
): string[] {
  const changes = [];
  const ignoredKeys = ['version', 'lastModified'];

  // Helper function to check if a value has changed
  const hasChanged = (key: string, a: any, b: any): boolean => {
    if (ignoredKeys.includes(key)) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify(a) !== JSON.stringify(b);
    }
    if (typeof a === 'object' && typeof b === 'object') {
      return JSON.stringify(a) !== JSON.stringify(b);
    }
    return a !== b;
  };

  // Compare each property
  Object.keys(current).forEach(key => {
    if (hasChanged(key, current[key as keyof T], previous[key as keyof T])) {
      changes.push(
        `Updated ${key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`
      );
    }
  });

  if (changes.length === 0) {
    changes.push('No significant changes');
  }

  return changes;
}

/**
 * Calculates the optimal response period based on RFP complexity
 */
export function calculateOptimalResponsePeriod(
  sections: ScopeSection[],
  options: {
    requirePreBidConference?: boolean;
    requireSiteVisit?: boolean;
    isInternational?: boolean;
  } = {}
): {
  recommendedDays: number;
  minimumDays: number;
  factors: string[];
} {
  const factors = [];
  let baseDays = 30; // Standard base period

  // Calculate average complexity
  const complexityScores = sections.map(s => calculateSectionComplexity(s).score);
  const avgComplexity =
    complexityScores.reduce((a, b) => a + b, 0) / complexityScores.length;

  // Adjust for complexity
  if (avgComplexity > 70) {
    baseDays += 15;
    factors.push('High technical complexity');
  } else if (avgComplexity > 40) {
    baseDays += 7;
    factors.push('Moderate technical complexity');
  }

  // Adjust for additional requirements
  if (options.requirePreBidConference) {
    baseDays += 7;
    factors.push('Pre-bid conference required');
  }
  if (options.requireSiteVisit) {
    baseDays += 5;
    factors.push('Site visit required');
  }
  if (options.isInternational) {
    baseDays += 14;
    factors.push('International procurement');
  }

  // Calculate minimum days (2/3 of recommended)
  const minimumDays = Math.ceil((baseDays * 2) / 3);

  return {
    recommendedDays: baseDays,
    minimumDays,
    factors,
  };
}
