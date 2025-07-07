import type { TimelineEvent } from '@/types/rfp';
import { differenceInDays, addDays, isBefore, isAfter } from 'date-fns';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  type: 'reminder' | 'warning' | 'alert' | 'update';
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string;
  eventId?: string;
  actionUrl?: string;
  read?: boolean;
}

export class NotificationService {
  /**
   * Generates notifications based on timeline events and settings
   */
  static generateTimelineNotifications(
    events: TimelineEvent[],
    settings: {
      reminderDays: number;
      emailEnabled: boolean;
      escalationThreshold: number;
    }
  ): Notification[] {
    const notifications: Notification[] = [];
    const now = new Date();

    events.forEach(event => {
      const eventDate = new Date(event.date);
      const daysUntil = differenceInDays(eventDate, now);

      // Upcoming deadline reminders
      if (daysUntil > 0 && daysUntil <= settings.reminderDays) {
        notifications.push({
          id: `reminder-${event.id}-${daysUntil}`,
          type: 'reminder',
          title: `Upcoming: ${event.title}`,
          message: `${event.title} is scheduled in ${daysUntil} days`,
          priority: daysUntil <= 2 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          eventId: event.id,
        });
      }

      // Overdue tasks
      if (daysUntil < 0 && event.status !== 'completed') {
        const overdueDays = Math.abs(daysUntil);
        const priority: NotificationPriority =
          overdueDays > settings.escalationThreshold ? 'high' : 'medium';

        notifications.push({
          id: `overdue-${event.id}`,
          type: 'alert',
          title: `Overdue: ${event.title}`,
          message: `${event.title} is overdue by ${overdueDays} days`,
          priority,
          timestamp: new Date().toISOString(),
          eventId: event.id,
        });
      }

      // Critical path warnings
      if (
        event.criticalPath &&
        event.status !== 'completed' &&
        event.dependencies?.length
      ) {
        const dependencies = events.filter(e =>
          event.dependencies?.includes(e.id)
        );
        const incompleteDependencies = dependencies.filter(
          d => d.status !== 'completed'
        );

        if (
          incompleteDependencies.length > 0 &&
          daysUntil <= settings.reminderDays
        ) {
          notifications.push({
            id: `critical-${event.id}`,
            type: 'warning',
            title: 'Critical Path at Risk',
            message: `${event.title} has ${incompleteDependencies.length} incomplete dependencies`,
            priority: 'high',
            timestamp: new Date().toISOString(),
            eventId: event.id,
          });
        }
      }
    });

    return notifications.sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  /**
   * Filters notifications based on user preferences
   */
  static filterNotifications(
    notifications: Notification[],
    filters: {
      types?: string[];
      priorities?: NotificationPriority[];
      unreadOnly?: boolean;
      eventId?: string;
    }
  ): Notification[] {
    return notifications.filter(notification => {
      if (filters.types && !filters.types.includes(notification.type)) {
        return false;
      }
      if (
        filters.priorities &&
        !filters.priorities.includes(notification.priority)
      ) {
        return false;
      }
      if (filters.unreadOnly && notification.read) {
        return false;
      }
      if (filters.eventId && notification.eventId !== filters.eventId) {
        return false;
      }
      return true;
    });
  }

  /**
   * Groups notifications by type and priority for summary view
   */
  static summarizeNotifications(
    notifications: Notification[]
  ): {
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<NotificationPriority, number>;
    criticalAlerts: number;
  } {
    const unread = notifications.filter(n => !n.read).length;
    const byType = notifications.reduce(
      (acc, n) => ({
        ...acc,
        [n.type]: (acc[n.type] || 0) + 1,
      }),
      {} as Record<string, number>
    );
    const byPriority = notifications.reduce(
      (acc, n) => ({
        ...acc,
        [n.priority]: (acc[n.priority] || 0) + 1,
      }),
      {} as Record<NotificationPriority, number>
    );
    const criticalAlerts = notifications.filter(
      n => n.priority === 'high' && !n.read
    ).length;

    return {
      total: notifications.length,
      unread,
      byType,
      byPriority,
      criticalAlerts,
    };
  }
}
