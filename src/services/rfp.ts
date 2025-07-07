import { supabase } from '@/lib/supabase';
import type { TimelineEvent} from '@/types/rfp';
import { ValidationRule } from '@/types/rfp';
import type { Database } from '@/types/supabase';
import { TimelineService } from './timeline';
import { NotificationService } from './notifications';

type RfpProject = Database['public']['Tables']['rfp_projects']['Row'];
type TimelineEventRow = Database['public']['Tables']['rfp_timeline_events']['Row'];
type ScopeSectionRow = Database['public']['Tables']['rfp_scope_sections']['Row'];
type TeamMemberRow = Database['public']['Tables']['rfp_team_members']['Row'];
type NotificationRow = Database['public']['Tables']['rfp_notifications']['Row'];

export class RfpService {
  /**
   * Creates a new RFP project
   */
  static async createProject(data: {
    title: string;
    description?: string;
    estimated_value?: number;
    currency?: string;
    owner_id: string;
  }): Promise<RfpProject> {
    const { data: project, error } = await supabase
      .from('rfp_projects')
      .insert({
        ...data,
        status: 'draft',
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
      })
      .select()
      .single();

    if (error) throw error;
    return project;
  }

  /**
   * Retrieves a project and all its related data
   */
  static async getProject(
    projectId: string
  ): Promise<{
    project: RfpProject;
    timeline: TimelineEventRow[];
    scope: ScopeSectionRow[];
    team: TeamMemberRow[];
    notifications: NotificationRow[];
  }> {
    // Fetch all data in parallel
    const [
      { data: project, error: projectError },
      { data: timeline, error: timelineError },
      { data: scope, error: scopeError },
      { data: team, error: teamError },
      { data: notifications, error: notificationError },
    ] = await Promise.all([
      supabase
        .from('rfp_projects')
        .select('*')
        .eq('id', projectId)
        .single(),
      supabase
        .from('rfp_timeline_events')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: true }),
      supabase
        .from('rfp_scope_sections')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true }),
      supabase
        .from('rfp_team_members')
        .select('*')
        .eq('project_id', projectId),
      supabase
        .from('rfp_notifications')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false }),
    ]);

    if (projectError) throw projectError;
    if (timelineError) throw timelineError;
    if (scopeError) throw scopeError;
    if (teamError) throw teamError;
    if (notificationError) throw notificationError;

    return {
      project,
      timeline: timeline || [],
      scope: scope || [],
      team: team || [],
      notifications: notifications || [],
    };
  }

  /**
   * Updates project timeline events
   */
  static async updateTimeline(
    projectId: string,
    events: TimelineEvent[]
  ): Promise<TimelineEventRow[]> {
    // Validate timeline first
    const validation = TimelineService.validateTimeline(events);
    if (!validation.valid) {
      throw new Error(`Invalid timeline: ${validation.errors.join(', ')}`);
    }

    // Get existing events
    const { data: existingEvents } = await supabase
      .from('rfp_timeline_events')
      .select('id')
      .eq('project_id', projectId);

    const existingIds = new Set((existingEvents || []).map(e => e.id));
    const updatedIds = new Set(events.map(e => e.id));

    // Delete events that no longer exist
    const idsToDelete = [...existingIds].filter(id => !updatedIds.has(id));
    if (idsToDelete.length > 0) {
      await supabase
        .from('rfp_timeline_events')
        .delete()
        .in('id', idsToDelete);
    }

    // Upsert events
    const { data: updatedEvents, error } = await supabase
      .from('rfp_timeline_events')
      .upsert(
        events.map(event => ({
          ...event,
          project_id: projectId,
          updated_at: new Date().toISOString(),
        }))
      )
      .select();

    if (error) throw error;
    return updatedEvents || [];
  }

  /**
   * Updates project scope sections
   */
  static async updateScope(
    projectId: string,
    sections: ScopeSectionRow[]
  ): Promise<ScopeSectionRow[]> {
    const { data: existingSections } = await supabase
      .from('rfp_scope_sections')
      .select('id')
      .eq('project_id', projectId);

    const existingIds = new Set((existingSections || []).map(s => s.id));
    const updatedIds = new Set(sections.map(s => s.id));

    // Delete sections that no longer exist
    const idsToDelete = [...existingIds].filter(id => !updatedIds.has(id));
    if (idsToDelete.length > 0) {
      await supabase
        .from('rfp_scope_sections')
        .delete()
        .in('id', idsToDelete);
    }

    // Upsert sections
    const { data: updatedSections, error } = await supabase
      .from('rfp_scope_sections')
      .upsert(
        sections.map(section => ({
          ...section,
          project_id: projectId,
          updated_at: new Date().toISOString(),
          version: (section.version || 0) + 1,
        }))
      )
      .select();

    if (error) throw error;
    return updatedSections || [];
  }

  /**
   * Updates project settings
   */
  static async updateSettings(
    projectId: string,
    settings: any
  ): Promise<RfpProject> {
    const { data: project, error } = await supabase
      .from('rfp_projects')
      .update({
        settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return project;
  }

  /**
   * Updates project status
   */
  static async updateStatus(
    projectId: string,
    status: RfpProject['status']
  ): Promise<RfpProject> {
    const { data: project, error } = await supabase
      .from('rfp_projects')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return project;
  }

  /**
   * Adds a team member to the project
   */
  static async addTeamMember(
    projectId: string,
    userId: string,
    role: string,
    permissions: string[] = []
  ): Promise<TeamMemberRow> {
    const { data: member, error } = await supabase
      .from('rfp_team_members')
      .insert({
        project_id: projectId,
        user_id: userId,
        role,
        permissions,
        last_active: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return member;
  }

  /**
   * Removes a team member from the project
   */
  static async removeTeamMember(
    projectId: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('rfp_team_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  /**
   * Creates a notification for project members
   */
  static async createNotification(
    projectId: string,
    notification: Omit<NotificationRow, 'id' | 'project_id' | 'timestamp'>
  ): Promise<NotificationRow> {
    const { data: newNotification, error } = await supabase
      .from('rfp_notifications')
      .insert({
        ...notification,
        project_id: projectId,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return newNotification;
  }

  /**
   * Marks a notification as read
   */
  static async markNotificationAsRead(
    notificationId: string
  ): Promise<NotificationRow> {
    const { data: notification, error } = await supabase
      .from('rfp_notifications')
      .update({
        read: true,
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return notification;
  }

  /**
   * Exports project data in the specified format
   */
  static async exportProject(
    projectId: string,
    format: 'pdf' | 'docx'
  ): Promise<string> {
    // TODO: Implement export functionality
    throw new Error('Not implemented');
  }

  /**
   * Shares project with additional team members
   */
  static async shareProject(
    projectId: string,
    userIds: string[],
    role: string
  ): Promise<TeamMemberRow[]> {
    const { data: members, error } = await supabase
      .from('rfp_team_members')
      .insert(
        userIds.map(userId => ({
          project_id: projectId,
          user_id: userId,
          role,
          permissions: [],
          last_active: new Date().toISOString(),
        }))
      )
      .select();

    if (error) throw error;
    return members || [];
  }
}
