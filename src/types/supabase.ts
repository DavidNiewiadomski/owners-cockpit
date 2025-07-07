export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RfpStatus =
  | 'draft'
  | 'open'
  | 'evaluation'
  | 'leveling_complete'
  | 'bafo_requested'
  | 'awarded'
  | 'cancelled';

export type TimelineEventType = 'milestone' | 'task' | 'deadline';
export type TimelineEventStatus = 'pending' | 'active' | 'completed' | 'delayed' | 'at-risk';

export interface Database {
  public: {
    Tables: {
      rfp_projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: RfpStatus;
          created_at: string;
          updated_at: string;
          owner_id: string;
          estimated_value: number | null;
          currency: string | null;
          settings: Json | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: RfpStatus;
          created_at?: string;
          updated_at?: string;
          owner_id: string;
          estimated_value?: number | null;
          currency?: string | null;
          settings?: Json | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: RfpStatus;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
          estimated_value?: number | null;
          currency?: string | null;
          settings?: Json | null;
        };
      };
      rfp_team_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: string;
          permissions: string[];
          last_active: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role: string;
          permissions?: string[];
          last_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: string;
          permissions?: string[];
          last_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rfp_timeline_events: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          type: TimelineEventType;
          date: string;
          duration: number | null;
          dependencies: string[] | null;
          status: TimelineEventStatus;
          description: string | null;
          critical_path: boolean;
          created_at: string;
          updated_at: string;
          assignee_id: string | null;
          completion_percentage: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          type: TimelineEventType;
          date: string;
          duration?: number | null;
          dependencies?: string[] | null;
          status?: TimelineEventStatus;
          description?: string | null;
          critical_path?: boolean;
          created_at?: string;
          updated_at?: string;
          assignee_id?: string | null;
          completion_percentage?: number;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          type?: TimelineEventType;
          date?: string;
          duration?: number | null;
          dependencies?: string[] | null;
          status?: TimelineEventStatus;
          description?: string | null;
          critical_path?: boolean;
          created_at?: string;
          updated_at?: string;
          assignee_id?: string | null;
          completion_percentage?: number;
        };
      };
      rfp_scope_sections: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          csi_code: string | null;
          description: string | null;
          requirements: Json | null;
          specifications: Json | null;
          attachments: Json | null;
          ai_assisted: boolean;
          status: 'draft' | 'in-review' | 'approved';
          version: number;
          created_at: string;
          updated_at: string;
          reviewers: string[] | null;
          comments: Json | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          csi_code?: string | null;
          description?: string | null;
          requirements?: Json | null;
          specifications?: Json | null;
          attachments?: Json | null;
          ai_assisted?: boolean;
          status?: 'draft' | 'in-review' | 'approved';
          version?: number;
          created_at?: string;
          updated_at?: string;
          reviewers?: string[] | null;
          comments?: Json | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          csi_code?: string | null;
          description?: string | null;
          requirements?: Json | null;
          specifications?: Json | null;
          attachments?: Json | null;
          ai_assisted?: boolean;
          status?: 'draft' | 'in-review' | 'approved';
          version?: number;
          created_at?: string;
          updated_at?: string;
          reviewers?: string[] | null;
          comments?: Json | null;
        };
      };
      rfp_notifications: {
        Row: {
          id: string;
          project_id: string;
          type: 'reminder' | 'warning' | 'alert' | 'update';
          title: string;
          message: string;
          priority: 'low' | 'medium' | 'high';
          timestamp: string;
          event_id: string | null;
          action_url: string | null;
          read: boolean;
          recipient_id: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          type: 'reminder' | 'warning' | 'alert' | 'update';
          title: string;
          message: string;
          priority: 'low' | 'medium' | 'high';
          timestamp?: string;
          event_id?: string | null;
          action_url?: string | null;
          read?: boolean;
          recipient_id: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          type?: 'reminder' | 'warning' | 'alert' | 'update';
          title?: string;
          message?: string;
          priority?: 'low' | 'medium' | 'high';
          timestamp?: string;
          event_id?: string | null;
          action_url?: string | null;
          read?: boolean;
          recipient_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
