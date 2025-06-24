export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_items: {
        Row: {
          assignee: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string
          source_id: string | null
          source_type: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id: string
          source_id?: string | null
          source_type?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          source_id?: string | null
          source_type?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "action_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          project_id: string
          resolved: boolean | null
          resolved_at: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "alerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts_sent: {
        Row: {
          alert_id: string
          channel: string
          id: string
          sent_at: string | null
          status: string
        }
        Insert: {
          alert_id: string
          channel: string
          id?: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          alert_id?: string
          channel?: string
          id?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_sent_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          project_id: string
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          project_id: string
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          project_id?: string
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "audit_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      bim_files: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          file_type: string
          filename: string
          id: string
          is_active: boolean
          project_id: string
          updated_at: string
          upload_ts: string
          uploaded_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          file_type?: string
          filename: string
          id?: string
          is_active?: boolean
          project_id: string
          updated_at?: string
          upload_ts?: string
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          filename?: string
          id?: string
          is_active?: boolean
          project_id?: string
          updated_at?: string
          upload_ts?: string
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "bim_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "bim_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_items: {
        Row: {
          actual_amount: number | null
          budgeted_amount: number | null
          category: string
          created_at: string | null
          description: string | null
          external_id: string | null
          id: string
          project_id: string
          source: string | null
          updated_at: string | null
        }
        Insert: {
          actual_amount?: number | null
          budgeted_amount?: number | null
          category: string
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          project_id: string
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_amount?: number | null
          budgeted_amount?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          project_id?: string
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "budget_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      building_systems: {
        Row: {
          alerts_count: number | null
          created_at: string | null
          efficiency_rating: number | null
          energy_consumption: number | null
          id: string
          last_maintenance: string | null
          next_maintenance: string | null
          project_id: string
          status: string
          system_name: string
          system_type: string
          updated_at: string | null
          uptime_percentage: number | null
        }
        Insert: {
          alerts_count?: number | null
          created_at?: string | null
          efficiency_rating?: number | null
          energy_consumption?: number | null
          id?: string
          last_maintenance?: string | null
          next_maintenance?: string | null
          project_id: string
          status?: string
          system_name: string
          system_type: string
          updated_at?: string | null
          uptime_percentage?: number | null
        }
        Update: {
          alerts_count?: number | null
          created_at?: string | null
          efficiency_rating?: number | null
          energy_consumption?: number | null
          id?: string
          last_maintenance?: string | null
          next_maintenance?: string | null
          project_id?: string
          status?: string
          system_name?: string
          system_type?: string
          updated_at?: string | null
          uptime_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "building_systems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "building_systems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      change_orders: {
        Row: {
          amount: number | null
          approved_date: string | null
          created_at: string | null
          description: string | null
          id: string
          project_id: string
          status: string | null
          submitted_by: string | null
          submitted_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          approved_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_id: string
          status?: string | null
          submitted_by?: string | null
          submitted_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          approved_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string
          status?: string | null
          submitted_by?: string | null
          submitted_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          body: string | null
          comm_type: string
          created_at: string | null
          embedding: string | null
          external_id: string | null
          id: string
          message_ts: string
          metadata: Json | null
          participants: Json | null
          project_id: string
          provider: string
          speaker: Json | null
          subject: string | null
          thread_id: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          body?: string | null
          comm_type: string
          created_at?: string | null
          embedding?: string | null
          external_id?: string | null
          id?: string
          message_ts: string
          metadata?: Json | null
          participants?: Json | null
          project_id: string
          provider: string
          speaker?: Json | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          body?: string | null
          comm_type?: string
          created_at?: string | null
          embedding?: string | null
          external_id?: string | null
          id?: string
          message_ts?: string
          metadata?: Json | null
          participants?: Json | null
          project_id?: string
          provider?: string
          speaker?: Json | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          doc_type: Database["public"]["Enums"]["document_type"] | null
          external_id: string | null
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          processed: boolean | null
          project_id: string
          source: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type?: Database["public"]["Enums"]["document_type"] | null
          external_id?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          processed?: boolean | null
          project_id: string
          source?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: Database["public"]["Enums"]["document_type"] | null
          external_id?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          processed?: boolean | null
          project_id?: string
          source?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_consumption: {
        Row: {
          baseline: number | null
          consumption: number
          cost: number | null
          created_at: string | null
          efficiency_score: number | null
          id: string
          meter_type: string
          project_id: string
          reading_date: string
          unit: string
        }
        Insert: {
          baseline?: number | null
          consumption: number
          cost?: number | null
          created_at?: string | null
          efficiency_score?: number | null
          id?: string
          meter_type: string
          project_id: string
          reading_date: string
          unit: string
        }
        Update: {
          baseline?: number | null
          consumption?: number
          cost?: number | null
          created_at?: string | null
          efficiency_score?: number | null
          id?: string
          meter_type?: string
          project_id?: string
          reading_date?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "energy_consumption_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "energy_consumption_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          created_at: string | null
          equipment_type: string
          id: string
          installation_date: string | null
          location: string
          manufacturer: string | null
          model: string | null
          name: string
          project_id: string
          serial_number: string | null
          specifications: Json | null
          status: string
          updated_at: string | null
          warranty_expiration: string | null
        }
        Insert: {
          created_at?: string | null
          equipment_type: string
          id?: string
          installation_date?: string | null
          location: string
          manufacturer?: string | null
          model?: string | null
          name: string
          project_id: string
          serial_number?: string | null
          specifications?: Json | null
          status?: string
          updated_at?: string | null
          warranty_expiration?: string | null
        }
        Update: {
          created_at?: string | null
          equipment_type?: string
          id?: string
          installation_date?: string | null
          location?: string
          manufacturer?: string | null
          model?: string | null
          name?: string
          project_id?: string
          serial_number?: string | null
          specifications?: Json | null
          status?: string
          updated_at?: string | null
          warranty_expiration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "equipment_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      external_invites: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          project_id: string
          role: Database["public"]["Enums"]["app_role"]
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          project_id: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          project_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_invites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "external_invites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          created_at: string | null
          document_id: string | null
          external_id: string | null
          file_path: string
          file_size: number | null
          height: number | null
          id: string
          ocr_text: string | null
          processed: boolean | null
          project_id: string
          source: string | null
          title: string | null
          updated_at: string | null
          width: number | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          external_id?: string | null
          file_path: string
          file_size?: number | null
          height?: number | null
          id?: string
          ocr_text?: string | null
          processed?: boolean | null
          project_id: string
          source?: string | null
          title?: string | null
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          external_id?: string | null
          file_path?: string
          file_size?: number | null
          height?: number | null
          id?: string
          ocr_text?: string | null
          processed?: boolean | null
          project_id?: string
          source?: string | null
          title?: string | null
          updated_at?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          context_data: Json | null
          created_at: string | null
          id: string
          project_id: string | null
          read_at: string | null
          severity: string
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          read_at?: string | null
          severity: string
          summary: string
          title: string
          updated_at?: string | null
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          read_at?: string | null
          severity?: string
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "insights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          operation: string
          project_id: string
          records_processed: number | null
          source: string
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation: string
          project_id: string
          records_processed?: number | null
          source: string
          started_at?: string | null
          status: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation?: string
          project_id?: string
          records_processed?: number | null
          source?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "integration_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string | null
          id: string
          project_id: string
          provider: string
          refresh_token: string | null
          token_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          project_id: string
          provider: string
          refresh_token?: string | null
          token_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          project_id?: string
          provider?: string
          refresh_token?: string | null
          token_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_tokens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "integration_tokens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_schedules: {
        Row: {
          auto_generate_wo: boolean | null
          checklist: Json | null
          created_at: string | null
          description: string | null
          equipment_id: string
          estimated_duration: number | null
          frequency_interval: number | null
          frequency_type: string
          id: string
          last_performed: string | null
          next_due: string
          project_id: string
          schedule_name: string
          updated_at: string | null
        }
        Insert: {
          auto_generate_wo?: boolean | null
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          equipment_id: string
          estimated_duration?: number | null
          frequency_interval?: number | null
          frequency_type: string
          id?: string
          last_performed?: string | null
          next_due: string
          project_id: string
          schedule_name: string
          updated_at?: string | null
        }
        Update: {
          auto_generate_wo?: boolean | null
          checklist?: Json | null
          created_at?: string | null
          description?: string | null
          equipment_id?: string
          estimated_duration?: number | null
          frequency_interval?: number | null
          frequency_type?: string
          id?: string
          last_performed?: string | null
          next_due?: string
          project_id?: string
          schedule_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "maintenance_schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      model_bindings: {
        Row: {
          bim_file_id: string
          binding_id: string
          binding_type: string
          created_at: string
          element_id: string
          element_type: string | null
          id: string
          metadata: Json | null
          project_id: string
          updated_at: string
        }
        Insert: {
          bim_file_id: string
          binding_id: string
          binding_type: string
          created_at?: string
          element_id: string
          element_type?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
          updated_at?: string
        }
        Update: {
          bim_file_id?: string
          binding_id?: string
          binding_type?: string
          created_at?: string
          element_id?: string
          element_type?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_bindings_bim_file_id_fkey"
            columns: ["bim_file_id"]
            isOneToOne: false
            referencedRelation: "bim_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_bindings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "model_bindings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string | null
          id: string
          org_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_integrations: {
        Row: {
          api_key: string | null
          config: Json | null
          created_at: string | null
          id: string
          last_sync: string | null
          oauth_data: Json | null
          project_id: string
          provider: string
          refresh_token: string | null
          status: string
          sync_error: string | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          oauth_data?: Json | null
          project_id: string
          provider: string
          refresh_token?: string | null
          status?: string
          sync_error?: string | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          oauth_data?: Json | null
          project_id?: string
          provider?: string
          refresh_token?: string | null
          status?: string
          sync_error?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_integrations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_integrations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          external_id: string | null
          id: string
          name: string
          org_id: string | null
          owner_id: string | null
          source: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          external_id?: string | null
          id?: string
          name: string
          org_id?: string | null
          owner_id?: string | null
          source?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          external_id?: string | null
          id?: string
          name?: string
          org_id?: string | null
          owner_id?: string | null
          source?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          delivery_date: string | null
          description: string | null
          external_id: string | null
          id: string
          issue_date: string | null
          po_number: string
          project_id: string
          source: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          vendor_contact: string | null
          vendor_name: string
        }
        Insert: {
          created_at?: string | null
          delivery_date?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          issue_date?: string | null
          po_number: string
          project_id: string
          source?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_contact?: string | null
          vendor_name: string
        }
        Update: {
          created_at?: string | null
          delivery_date?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          issue_date?: string | null
          po_number?: string
          project_id?: string
          source?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_contact?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          project_id: string
          report_type: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
          report_type?: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
          report_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfi: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          external_id: string | null
          id: string
          project_id: string
          source: string | null
          status: Database["public"]["Enums"]["rfi_status"] | null
          submitted_by: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          external_id?: string | null
          id?: string
          project_id: string
          source?: string | null
          status?: Database["public"]["Enums"]["rfi_status"] | null
          submitted_by?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          external_id?: string | null
          id?: string
          project_id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["rfi_status"] | null
          submitted_by?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfi_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "rfi_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfps: {
        Row: {
          awarded_amount: number | null
          awarded_vendor: string | null
          category: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          id: string
          issue_date: string | null
          project_id: string
          response_deadline: string | null
          rfp_number: string
          source: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          awarded_amount?: number | null
          awarded_vendor?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          issue_date?: string | null
          project_id: string
          response_deadline?: string | null
          rfp_number: string
          source?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          awarded_amount?: number | null
          awarded_vendor?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          issue_date?: string | null
          project_id?: string
          response_deadline?: string | null
          rfp_number?: string
          source?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "rfps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_incidents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          incident_date: string | null
          location: string | null
          project_id: string
          reported_by: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          incident_date?: string | null
          location?: string | null
          project_id: string
          reported_by?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          incident_date?: string | null
          location?: string | null
          project_id?: string
          reported_by?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "safety_incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_readings: {
        Row: {
          id: string
          metadata: Json | null
          sensor_id: string
          status: string | null
          timestamp: string
          value: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          sensor_id: string
          status?: string | null
          timestamp?: string
          value: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          sensor_id?: string
          status?: string | null
          timestamp?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      sensors: {
        Row: {
          created_at: string | null
          equipment_id: string | null
          id: string
          location: string
          max_threshold: number | null
          min_threshold: number | null
          name: string
          project_id: string
          sensor_type: string
          status: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          location: string
          max_threshold?: number | null
          min_threshold?: number | null
          name: string
          project_id: string
          sensor_type: string
          status?: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          location?: string
          max_threshold?: number | null
          min_threshold?: number | null
          name?: string
          project_id?: string
          sensor_type?: string
          status?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sensors_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sensors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "sensors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          external_id: string | null
          id: string
          name: string
          priority: number | null
          project_id: string
          source: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          external_id?: string | null
          id?: string
          name: string
          priority?: number | null
          project_id: string
          source?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          external_id?: string | null
          id?: string
          name?: string
          priority?: number | null
          project_id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dashboard_layouts: {
        Row: {
          created_at: string | null
          id: string
          layout: Json
          project_id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          layout?: Json
          project_id: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          layout?: Json
          project_id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          insight_frequency: string
          push_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          insight_frequency?: string
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          insight_frequency?: string
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_projects: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "user_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_index: {
        Row: {
          chunk_id: string
          content: string
          created_at: string | null
          doc_id: string | null
          embedding: string | null
          image_id: string | null
          metadata: Json | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          chunk_id?: string
          content: string
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          image_id?: string | null
          metadata?: Json | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          chunk_id?: string
          content?: string
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          image_id?: string | null
          metadata?: Json | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vector_index_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vector_index_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vector_index_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "vector_index_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          completed_date: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          equipment_id: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          priority: string
          project_id: string
          requested_by: string | null
          status: string
          title: string
          updated_at: string | null
          work_type: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string
          project_id: string
          requested_by?: string | null
          status?: string
          title: string
          updated_at?: string | null
          work_type: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: string
          project_id?: string
          requested_by?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_health"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "work_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      portfolio_health: {
        Row: {
          actual_spent: number | null
          budget_utilization_pct: number | null
          change_orders_count: number | null
          project_id: string | null
          project_name: string | null
          safety_incidents_count: number | null
          schedule_progress_pct: number | null
          schedule_slip_pct: number | null
          status: Database["public"]["Enums"]["project_status"] | null
          total_budget: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_admin_access: {
        Args: { _user_id: string; _project_id: string }
        Returns: boolean
      }
      has_project_access: {
        Args: { project_uuid: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _project_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_org_member: {
        Args: { org_uuid: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter_project_id?: string
        }
        Returns: {
          chunk_id: string
          project_id: string
          content: string
          similarity: number
        }[]
      }
      portfolio_metrics: {
        Args: { user_uuid: string }
        Returns: {
          total_portfolio_value: number
          avg_budget_utilization: number
          avg_schedule_slip: number
          total_projects: number
          active_projects: number
          top_risks: Json
          project_metrics: Json
        }[]
      }
      search_communications: {
        Args: {
          query_embedding: string
          project_uuid: string
          match_count?: number
          similarity_threshold?: number
        }
        Returns: {
          id: string
          project_id: string
          provider: string
          comm_type: string
          subject: string
          body: string
          speaker: Json
          message_ts: string
          url: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "gc" | "vendor" | "viewer"
      document_type:
        | "drawing"
        | "specification"
        | "report"
        | "photo"
        | "contract"
        | "other"
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled"
      rfi_status: "open" | "pending_response" | "responded" | "closed"
      task_status: "not_started" | "in_progress" | "completed" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "gc", "vendor", "viewer"],
      document_type: [
        "drawing",
        "specification",
        "report",
        "photo",
        "contract",
        "other",
      ],
      project_status: [
        "planning",
        "active",
        "on_hold",
        "completed",
        "cancelled",
      ],
      rfi_status: ["open", "pending_response", "responded", "closed"],
      task_status: ["not_started", "in_progress", "completed", "blocked"],
    },
  },
} as const
