export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          query?: string
          operationName?: string
          extensions?: Json
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addendum: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          issued_at: string | null
          number: number
          rfp_id: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          issued_at?: string | null
          number: number
          rfp_id: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          issued_at?: string | null
          number?: number
          rfp_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addendum_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addendum_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["rfp_id"]
          },
        ]
      }
      ai_usage_tracking: {
        Row: {
          created_at: string | null
          date: string
          id: number
          model_usage: Json | null
          total_cost_cents: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          model_usage?: Json | null
          total_cost_cents?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          model_usage?: Json | null
          total_cost_cents?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          project_id: string
          resolved: boolean | null
          severity: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          project_id: string
          resolved?: boolean | null
          severity?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          project_id?: string
          resolved?: boolean | null
          severity?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
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
          alert_key: string
          alert_type: string
          id: string
          project_id: string
          sent_at: string | null
        }
        Insert: {
          alert_key: string
          alert_type: string
          id?: string
          project_id: string
          sent_at?: string | null
        }
        Update: {
          alert_key?: string
          alert_type?: string
          id?: string
          project_id?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_sent_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      award_memo_templates: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_used_at: string | null
          name: string
          optional_variables: Json | null
          required_variables: Json | null
          template_content: string
          template_type: string
          updated_at: string | null
          usage_count: number | null
          version: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          name: string
          optional_variables?: Json | null
          required_variables?: Json | null
          template_content: string
          template_type: string
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          name?: string
          optional_variables?: Json | null
          required_variables?: Json | null
          template_content?: string
          template_type?: string
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Relationships: []
      }
      award_packages: {
        Row: {
          award_approved_at: string | null
          award_approved_by: string
          award_memo_content: string | null
          award_memo_generated_at: string | null
          award_memo_url: string | null
          award_notification_sent: boolean | null
          award_notification_sent_at: string | null
          bid_id: string
          compliance_summary: Json | null
          contract_duration_months: number | null
          contract_end_date: string | null
          contract_number: string | null
          contract_start_date: string | null
          contract_value: number
          created_at: string | null
          created_by: string
          docusign_completed_at: string | null
          docusign_envelope_id: string | null
          docusign_sent_at: string | null
          docusign_status: string | null
          final_snapshot_id: string | null
          funding_source: Json
          id: string
          legal_review_notes: string | null
          legal_review_required: boolean | null
          legal_reviewed_at: string | null
          legal_reviewed_by: string | null
          notes: string | null
          payment_bond_percentage: number | null
          payment_bond_required: boolean | null
          performance_bond_percentage: number | null
          performance_bond_required: boolean | null
          price_basis: Json
          rejection_notifications_sent: boolean | null
          scorecard_summary: Json | null
          selection_rationale: Json
          tags: Json | null
          updated_at: string | null
          vendor_acceptance_status: string | null
          vendor_decline_reason: string | null
          vendor_executed_contract_url: string | null
          vendor_response_date: string | null
          winning_submission_id: string
        }
        Insert: {
          award_approved_at?: string | null
          award_approved_by: string
          award_memo_content?: string | null
          award_memo_generated_at?: string | null
          award_memo_url?: string | null
          award_notification_sent?: boolean | null
          award_notification_sent_at?: string | null
          bid_id: string
          compliance_summary?: Json | null
          contract_duration_months?: number | null
          contract_end_date?: string | null
          contract_number?: string | null
          contract_start_date?: string | null
          contract_value: number
          created_at?: string | null
          created_by: string
          docusign_completed_at?: string | null
          docusign_envelope_id?: string | null
          docusign_sent_at?: string | null
          docusign_status?: string | null
          final_snapshot_id?: string | null
          funding_source?: Json
          id?: string
          legal_review_notes?: string | null
          legal_review_required?: boolean | null
          legal_reviewed_at?: string | null
          legal_reviewed_by?: string | null
          notes?: string | null
          payment_bond_percentage?: number | null
          payment_bond_required?: boolean | null
          performance_bond_percentage?: number | null
          performance_bond_required?: boolean | null
          price_basis?: Json
          rejection_notifications_sent?: boolean | null
          scorecard_summary?: Json | null
          selection_rationale?: Json
          tags?: Json | null
          updated_at?: string | null
          vendor_acceptance_status?: string | null
          vendor_decline_reason?: string | null
          vendor_executed_contract_url?: string | null
          vendor_response_date?: string | null
          winning_submission_id: string
        }
        Update: {
          award_approved_at?: string | null
          award_approved_by?: string
          award_memo_content?: string | null
          award_memo_generated_at?: string | null
          award_memo_url?: string | null
          award_notification_sent?: boolean | null
          award_notification_sent_at?: string | null
          bid_id?: string
          compliance_summary?: Json | null
          contract_duration_months?: number | null
          contract_end_date?: string | null
          contract_number?: string | null
          contract_start_date?: string | null
          contract_value?: number
          created_at?: string | null
          created_by?: string
          docusign_completed_at?: string | null
          docusign_envelope_id?: string | null
          docusign_sent_at?: string | null
          docusign_status?: string | null
          final_snapshot_id?: string | null
          funding_source?: Json
          id?: string
          legal_review_notes?: string | null
          legal_review_required?: boolean | null
          legal_reviewed_at?: string | null
          legal_reviewed_by?: string | null
          notes?: string | null
          payment_bond_percentage?: number | null
          payment_bond_required?: boolean | null
          performance_bond_percentage?: number | null
          performance_bond_required?: boolean | null
          price_basis?: Json
          rejection_notifications_sent?: boolean | null
          scorecard_summary?: Json | null
          selection_rationale?: Json
          tags?: Json | null
          updated_at?: string | null
          vendor_acceptance_status?: string | null
          vendor_decline_reason?: string | null
          vendor_executed_contract_url?: string | null
          vendor_response_date?: string | null
          winning_submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "award_packages_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: true
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "award_packages_final_snapshot_id_fkey"
            columns: ["final_snapshot_id"]
            isOneToOne: false
            referencedRelation: "leveling_snapshot"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "award_packages_winning_submission_id_fkey"
            columns: ["winning_submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      award_recommendations: {
        Row: {
          approval_date: string | null
          approval_notes: string | null
          approval_status: string | null
          approved_by: string | null
          bid_project_id: string | null
          commercial_justification: string | null
          created_at: string | null
          id: string
          prepared_by: string | null
          recommendation_date: string | null
          recommended_amount: number
          recommended_vendor_id: string | null
          reviewed_by: string | null
          risk_assessment: string | null
          second_choice_amount: number | null
          second_choice_vendor_id: string | null
          technical_justification: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approval_notes?: string | null
          approval_status?: string | null
          approved_by?: string | null
          bid_project_id?: string | null
          commercial_justification?: string | null
          created_at?: string | null
          id?: string
          prepared_by?: string | null
          recommendation_date?: string | null
          recommended_amount: number
          recommended_vendor_id?: string | null
          reviewed_by?: string | null
          risk_assessment?: string | null
          second_choice_amount?: number | null
          second_choice_vendor_id?: string | null
          technical_justification?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approval_notes?: string | null
          approval_status?: string | null
          approved_by?: string | null
          bid_project_id?: string | null
          commercial_justification?: string | null
          created_at?: string | null
          id?: string
          prepared_by?: string | null
          recommendation_date?: string | null
          recommended_amount?: number
          recommended_vendor_id?: string | null
          reviewed_by?: string | null
          risk_assessment?: string | null
          second_choice_amount?: number | null
          second_choice_vendor_id?: string | null
          technical_justification?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "award_recommendations_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "bid_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "award_recommendations_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "project_bid_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "award_recommendations_recommended_vendor_id_fkey"
            columns: ["recommended_vendor_id"]
            isOneToOne: false
            referencedRelation: "bid_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "award_recommendations_recommended_vendor_id_fkey"
            columns: ["recommended_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "award_recommendations_second_choice_vendor_id_fkey"
            columns: ["second_choice_vendor_id"]
            isOneToOne: false
            referencedRelation: "bid_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "award_recommendations_second_choice_vendor_id_fkey"
            columns: ["second_choice_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          approved_by: string | null
          award_amount: number
          award_justification: string
          awarded_at: string | null
          bid_id: string
          contract_duration_months: number | null
          contract_end_date: string | null
          contract_number: string | null
          contract_start_date: string | null
          created_at: string | null
          id: string
          performance_bond_required: boolean | null
          recommended_by: string
          status: Database["public"]["Enums"]["award_status"] | null
          updated_at: string | null
          vendor_acceptance_date: string | null
          vendor_accepted: boolean | null
          vendor_decline_reason: string | null
          winning_submission_id: string
        }
        Insert: {
          approved_by?: string | null
          award_amount: number
          award_justification: string
          awarded_at?: string | null
          bid_id: string
          contract_duration_months?: number | null
          contract_end_date?: string | null
          contract_number?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          performance_bond_required?: boolean | null
          recommended_by: string
          status?: Database["public"]["Enums"]["award_status"] | null
          updated_at?: string | null
          vendor_acceptance_date?: string | null
          vendor_accepted?: boolean | null
          vendor_decline_reason?: string | null
          winning_submission_id: string
        }
        Update: {
          approved_by?: string | null
          award_amount?: number
          award_justification?: string
          awarded_at?: string | null
          bid_id?: string
          contract_duration_months?: number | null
          contract_end_date?: string | null
          contract_number?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          performance_bond_required?: boolean | null
          recommended_by?: string
          status?: Database["public"]["Enums"]["award_status"] | null
          updated_at?: string | null
          vendor_acceptance_date?: string | null
          vendor_accepted?: boolean | null
          vendor_decline_reason?: string | null
          winning_submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "awards_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: true
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_winning_submission_id_fkey"
            columns: ["winning_submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      bafo_requests: {
        Row: {
          bid_project_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          price_adjustments_allowed: boolean | null
          request_date: string | null
          response_due_date: string
          scope_clarifications: string | null
          specific_items: string[] | null
          status: string | null
          vendor_ids: string[] | null
        }
        Insert: {
          bid_project_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          price_adjustments_allowed?: boolean | null
          request_date?: string | null
          response_due_date: string
          scope_clarifications?: string | null
          specific_items?: string[] | null
          status?: string | null
          vendor_ids?: string[] | null
        }
        Update: {
          bid_project_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          price_adjustments_allowed?: boolean | null
          request_date?: string | null
          response_due_date?: string
          scope_clarifications?: string | null
          specific_items?: string[] | null
          status?: string | null
          vendor_ids?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "bafo_requests_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "bid_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bafo_requests_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "project_bid_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      bafo_responses: {
        Row: {
          acceptance_status: string | null
          additional_clarifications: string | null
          bafo_request_id: string | null
          created_at: string | null
          id: string
          line_item_adjustments: Json | null
          response_date: string | null
          revised_total_bid: number
          vendor_id: string | null
        }
        Insert: {
          acceptance_status?: string | null
          additional_clarifications?: string | null
          bafo_request_id?: string | null
          created_at?: string | null
          id?: string
          line_item_adjustments?: Json | null
          response_date?: string | null
          revised_total_bid: number
          vendor_id?: string | null
        }
        Update: {
          acceptance_status?: string | null
          additional_clarifications?: string | null
          bafo_request_id?: string | null
          created_at?: string | null
          id?: string
          line_item_adjustments?: Json | null
          response_date?: string | null
          revised_total_bid?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bafo_responses_bafo_request_id_fkey"
            columns: ["bafo_request_id"]
            isOneToOne: false
            referencedRelation: "bafo_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bafo_responses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "bid_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bafo_responses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_alt: {
        Row: {
          alternate_number: number
          confidence_score: number | null
          created_at: string | null
          description: string
          extracted_at: string | null
          file_id: string
          id: string
          price: number
          raw_text: string | null
          submission_id: string
          updated_at: string | null
        }
        Insert: {
          alternate_number: number
          confidence_score?: number | null
          created_at?: string | null
          description: string
          extracted_at?: string | null
          file_id: string
          id?: string
          price: number
          raw_text?: string | null
          submission_id: string
          updated_at?: string | null
        }
        Update: {
          alternate_number?: number
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          extracted_at?: string | null
          file_id?: string
          id?: string
          price?: number
          raw_text?: string | null
          submission_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_alt_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_analysis_settings: {
        Row: {
          approval_threshold_amount: number | null
          commercial_weight: number | null
          compliance_weight: number | null
          created_at: string | null
          dual_approval_threshold: number | null
          id: string
          minimum_bids_for_analysis: number | null
          notification_preferences: Json | null
          organization_id: string | null
          outlier_detection_method: string | null
          outlier_threshold: number | null
          technical_weight: number | null
          updated_at: string | null
        }
        Insert: {
          approval_threshold_amount?: number | null
          commercial_weight?: number | null
          compliance_weight?: number | null
          created_at?: string | null
          dual_approval_threshold?: number | null
          id?: string
          minimum_bids_for_analysis?: number | null
          notification_preferences?: Json | null
          organization_id?: string | null
          outlier_detection_method?: string | null
          outlier_threshold?: number | null
          technical_weight?: number | null
          updated_at?: string | null
        }
        Update: {
          approval_threshold_amount?: number | null
          commercial_weight?: number | null
          compliance_weight?: number | null
          created_at?: string | null
          dual_approval_threshold?: number | null
          id?: string
          minimum_bids_for_analysis?: number | null
          notification_preferences?: Json | null
          organization_id?: string | null
          outlier_detection_method?: string | null
          outlier_threshold?: number | null
          technical_weight?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bid_analytics_reports: {
        Row: {
          created_at: string | null
          file_path: string | null
          generated_by: string | null
          generated_date: string | null
          id: string
          parameters: Json | null
          report_period_end: string | null
          report_period_start: string | null
          report_type: string | null
          summary_data: Json | null
        }
        Insert: {
          created_at?: string | null
          file_path?: string | null
          generated_by?: string | null
          generated_date?: string | null
          id?: string
          parameters?: Json | null
          report_period_end?: string | null
          report_period_start?: string | null
          report_type?: string | null
          summary_data?: Json | null
        }
        Update: {
          created_at?: string | null
          file_path?: string | null
          generated_by?: string | null
          generated_date?: string | null
          id?: string
          parameters?: Json | null
          report_period_end?: string | null
          report_period_start?: string | null
          report_type?: string | null
          summary_data?: Json | null
        }
        Relationships: []
      }
      bid_documents: {
        Row: {
          access_level: string | null
          bid_project_id: string | null
          created_at: string | null
          document_type: string | null
          file_name: string
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          retention_period: number | null
          upload_date: string | null
          uploaded_by: string | null
          vendor_id: string | null
          version: string | null
        }
        Insert: {
          access_level?: string | null
          bid_project_id?: string | null
          created_at?: string | null
          document_type?: string | null
          file_name: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          retention_period?: number | null
          upload_date?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
          version?: string | null
        }
        Update: {
          access_level?: string | null
          bid_project_id?: string | null
          created_at?: string | null
          document_type?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          retention_period?: number | null
          upload_date?: string | null
          uploaded_by?: string | null
          vendor_id?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_documents_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "bid_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_documents_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "project_bid_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "bid_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_events: {
        Row: {
          actor_role: string | null
          bid_id: string
          created_at: string | null
          description: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          occurred_at: string | null
          submission_id: string | null
          triggered_by: string | null
          user_agent: string | null
        }
        Insert: {
          actor_role?: string | null
          bid_id: string
          created_at?: string | null
          description: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          occurred_at?: string | null
          submission_id?: string | null
          triggered_by?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_role?: string | null
          bid_id?: string
          created_at?: string | null
          description?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          occurred_at?: string | null
          submission_id?: string | null
          triggered_by?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_events_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_leveling_adjustments: {
        Row: {
          adjusted_amount: number
          adjustment_reason: string
          adjustment_type: string | null
          approval_date: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          line_item_analysis_id: string | null
          original_amount: number
          vendor_line_item_bid_id: string | null
        }
        Insert: {
          adjusted_amount: number
          adjustment_reason: string
          adjustment_type?: string | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          line_item_analysis_id?: string | null
          original_amount: number
          vendor_line_item_bid_id?: string | null
        }
        Update: {
          adjusted_amount?: number
          adjustment_reason?: string
          adjustment_type?: string | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          line_item_analysis_id?: string | null
          original_amount?: number
          vendor_line_item_bid_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_leveling_adjustments_line_item_analysis_id_fkey"
            columns: ["line_item_analysis_id"]
            isOneToOne: false
            referencedRelation: "line_item_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_leveling_adjustments_vendor_line_item_bid_id_fkey"
            columns: ["vendor_line_item_bid_id"]
            isOneToOne: false
            referencedRelation: "vendor_line_item_bids"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_line_item: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          csi_code: string | null
          description: string
          extended: number
          extracted_at: string | null
          file_id: string
          id: string
          qty: number | null
          raw_text: string | null
          submission_id: string
          unit_price: number | null
          uom: string | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          csi_code?: string | null
          description: string
          extended: number
          extracted_at?: string | null
          file_id: string
          id?: string
          qty?: number | null
          raw_text?: string | null
          submission_id: string
          unit_price?: number | null
          uom?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          csi_code?: string | null
          description?: string
          extended?: number
          extracted_at?: string | null
          file_id?: string
          id?: string
          qty?: number | null
          raw_text?: string | null
          submission_id?: string
          unit_price?: number | null
          uom?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_line_item_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_line_items: {
        Row: {
          bid_project_id: string | null
          category: string | null
          created_at: string | null
          csi_code: string | null
          csi_code_id: string | null
          description: string
          engineer_estimate: number | null
          id: string
          is_allowance: boolean | null
          is_alternate: boolean | null
          is_unit_price: boolean | null
          item_number: string | null
          notes: string | null
          quantity: number
          specification_section: string | null
          subcategory: string | null
          unit_of_measure: string
          unit_price_estimate: number | null
          updated_at: string | null
        }
        Insert: {
          bid_project_id?: string | null
          category?: string | null
          created_at?: string | null
          csi_code?: string | null
          csi_code_id?: string | null
          description: string
          engineer_estimate?: number | null
          id?: string
          is_allowance?: boolean | null
          is_alternate?: boolean | null
          is_unit_price?: boolean | null
          item_number?: string | null
          notes?: string | null
          quantity: number
          specification_section?: string | null
          subcategory?: string | null
          unit_of_measure: string
          unit_price_estimate?: number | null
          updated_at?: string | null
        }
        Update: {
          bid_project_id?: string | null
          category?: string | null
          created_at?: string | null
          csi_code?: string | null
          csi_code_id?: string | null
          description?: string
          engineer_estimate?: number | null
          id?: string
          is_allowance?: boolean | null
          is_alternate?: boolean | null
          is_unit_price?: boolean | null
          item_number?: string | null
          notes?: string | null
          quantity?: number
          specification_section?: string | null
          subcategory?: string | null
          unit_of_measure?: string
          unit_price_estimate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_line_items_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "bid_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_line_items_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "project_bid_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_line_items_csi_code_id_fkey"
            columns: ["csi_code_id"]
            isOneToOne: false
            referencedRelation: "csi_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_projects: {
        Row: {
          bid_due_date: string | null
          created_at: string | null
          estimated_duration: number | null
          facility_id: string | null
          id: string
          project_location: string | null
          project_name: string
          project_type: string | null
          rfp_id: string
          status: string | null
          total_budget: number | null
          updated_at: string | null
        }
        Insert: {
          bid_due_date?: string | null
          created_at?: string | null
          estimated_duration?: number | null
          facility_id?: string | null
          id?: string
          project_location?: string | null
          project_name: string
          project_type?: string | null
          rfp_id: string
          status?: string | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Update: {
          bid_due_date?: string | null
          created_at?: string | null
          estimated_duration?: number | null
          facility_id?: string | null
          id?: string
          project_location?: string | null
          project_name?: string
          project_type?: string | null
          rfp_id?: string
          status?: string | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bid_protests: {
        Row: {
          bid_project_id: string | null
          created_at: string | null
          description: string
          id: string
          impact_on_award: boolean | null
          protest_date: string | null
          protest_grounds: string[] | null
          protesting_vendor_id: string | null
          requested_remedy: string | null
          resolution_date: string | null
          resolution_summary: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bid_project_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          impact_on_award?: boolean | null
          protest_date?: string | null
          protest_grounds?: string[] | null
          protesting_vendor_id?: string | null
          requested_remedy?: string | null
          resolution_date?: string | null
          resolution_summary?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bid_project_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          impact_on_award?: boolean | null
          protest_date?: string | null
          protest_grounds?: string[] | null
          protesting_vendor_id?: string | null
          requested_remedy?: string | null
          resolution_date?: string | null
          resolution_summary?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_protests_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "bid_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_protests_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "project_bid_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_protests_protesting_vendor_id_fkey"
            columns: ["protesting_vendor_id"]
            isOneToOne: false
            referencedRelation: "bid_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_protests_protesting_vendor_id_fkey"
            columns: ["protesting_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_submissions: {
        Row: {
          access_log: Json | null
          content_type: string | null
          created_at: string | null
          encryption_key_id: string | null
          file_name: string
          file_size: number | null
          id: string
          opened_at: string | null
          opened_by: string | null
          rfp_id: string
          s3_bucket: string
          s3_etag: string | null
          s3_key: string
          sealed: boolean | null
          sealed_at: string | null
          submission_type: string
          updated_at: string | null
          upload_completed_at: string | null
          upload_initiated_at: string | null
          upload_metadata: Json | null
          vendor_submission_id: string
        }
        Insert: {
          access_log?: Json | null
          content_type?: string | null
          created_at?: string | null
          encryption_key_id?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          opened_at?: string | null
          opened_by?: string | null
          rfp_id: string
          s3_bucket?: string
          s3_etag?: string | null
          s3_key: string
          sealed?: boolean | null
          sealed_at?: string | null
          submission_type: string
          updated_at?: string | null
          upload_completed_at?: string | null
          upload_initiated_at?: string | null
          upload_metadata?: Json | null
          vendor_submission_id: string
        }
        Update: {
          access_log?: Json | null
          content_type?: string | null
          created_at?: string | null
          encryption_key_id?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          opened_at?: string | null
          opened_by?: string | null
          rfp_id?: string
          s3_bucket?: string
          s3_etag?: string | null
          s3_key?: string
          sealed?: boolean | null
          sealed_at?: string | null
          submission_type?: string
          updated_at?: string | null
          upload_completed_at?: string | null
          upload_initiated_at?: string | null
          upload_metadata?: Json | null
          vendor_submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bid_submissions_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_submissions_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["rfp_id"]
          },
          {
            foreignKeyName: "bid_submissions_vendor_submission_id_fkey"
            columns: ["vendor_submission_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["vendor_submission_id"]
          },
          {
            foreignKeyName: "bid_submissions_vendor_submission_id_fkey"
            columns: ["vendor_submission_id"]
            isOneToOne: false
            referencedRelation: "vendor_submission"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_unit_price: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          description: string
          estimated_qty: number | null
          extended_price: number | null
          extracted_at: string | null
          file_id: string
          id: string
          item_number: string | null
          raw_text: string | null
          submission_id: string
          unit: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          description: string
          estimated_qty?: number | null
          extended_price?: number | null
          extracted_at?: string | null
          file_id: string
          id?: string
          item_number?: string | null
          raw_text?: string | null
          submission_id: string
          unit: string
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          estimated_qty?: number | null
          extended_price?: number | null
          extracted_at?: string | null
          file_id?: string
          id?: string
          item_number?: string | null
          raw_text?: string | null
          submission_id?: string
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bid_unit_price_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_vendors: {
        Row: {
          bonding_capacity: number | null
          certifications: string[] | null
          company_type: string | null
          contact_info: Json | null
          created_at: string | null
          id: string
          insurance_limits: Json | null
          license_number: string | null
          minority_owned: boolean | null
          name: string
          performance_history: Json | null
          prequalification_expiry: string | null
          prequalification_status: string | null
          small_business: boolean | null
          updated_at: string | null
          veteran_owned: boolean | null
          woman_owned: boolean | null
        }
        Insert: {
          bonding_capacity?: number | null
          certifications?: string[] | null
          company_type?: string | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          insurance_limits?: Json | null
          license_number?: string | null
          minority_owned?: boolean | null
          name: string
          performance_history?: Json | null
          prequalification_expiry?: string | null
          prequalification_status?: string | null
          small_business?: boolean | null
          updated_at?: string | null
          veteran_owned?: boolean | null
          woman_owned?: boolean | null
        }
        Update: {
          bonding_capacity?: number | null
          certifications?: string[] | null
          company_type?: string | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          insurance_limits?: Json | null
          license_number?: string | null
          minority_owned?: boolean | null
          name?: string
          performance_history?: Json | null
          prequalification_expiry?: string | null
          prequalification_status?: string | null
          small_business?: boolean | null
          updated_at?: string | null
          veteran_owned?: boolean | null
          woman_owned?: boolean | null
        }
        Relationships: []
      }
      bids: {
        Row: {
          assigned_evaluator: string | null
          award_date: string | null
          bid_type: string | null
          bond_percentage: number | null
          bond_required: boolean | null
          commercial_weight: number | null
          created_at: string | null
          created_by: string
          currency: string | null
          description: string | null
          estimated_value: number | null
          evaluation_end: string | null
          evaluation_start: string | null
          id: string
          insurance_required: boolean | null
          prequalification_required: boolean | null
          project_id: string | null
          published_at: string | null
          rfp_number: string
          status: Database["public"]["Enums"]["bid_status"] | null
          submission_deadline: string
          technical_weight: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_evaluator?: string | null
          award_date?: string | null
          bid_type?: string | null
          bond_percentage?: number | null
          bond_required?: boolean | null
          commercial_weight?: number | null
          created_at?: string | null
          created_by: string
          currency?: string | null
          description?: string | null
          estimated_value?: number | null
          evaluation_end?: string | null
          evaluation_start?: string | null
          id?: string
          insurance_required?: boolean | null
          prequalification_required?: boolean | null
          project_id?: string | null
          published_at?: string | null
          rfp_number: string
          status?: Database["public"]["Enums"]["bid_status"] | null
          submission_deadline: string
          technical_weight?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_evaluator?: string | null
          award_date?: string | null
          bid_type?: string | null
          bond_percentage?: number | null
          bond_required?: boolean | null
          commercial_weight?: number | null
          created_at?: string | null
          created_by?: string
          currency?: string | null
          description?: string | null
          estimated_value?: number | null
          evaluation_end?: string | null
          evaluation_start?: string | null
          id?: string
          insurance_required?: boolean | null
          prequalification_required?: boolean | null
          project_id?: string | null
          published_at?: string | null
          rfp_number?: string
          status?: Database["public"]["Enums"]["bid_status"] | null
          submission_deadline?: string
          technical_weight?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      bonding_capacity: {
        Row: {
          agent_email: string | null
          agent_name: string | null
          agent_phone: string | null
          aggregate_limit: number
          available_capacity: number | null
          bid_bonds: boolean | null
          bonded_backlog: number | null
          company_id: string
          created_at: string | null
          current_backlog: number | null
          effective_date: string
          expiry_date: string
          id: string
          letter_date: string | null
          letter_url: string | null
          maintenance_bonds: boolean | null
          payment_bonds: boolean | null
          performance_bonds: boolean | null
          single_project_limit: number
          supply_bonds: boolean | null
          surety_company: string
          surety_rating: string | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          agent_email?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          aggregate_limit: number
          available_capacity?: number | null
          bid_bonds?: boolean | null
          bonded_backlog?: number | null
          company_id: string
          created_at?: string | null
          current_backlog?: number | null
          effective_date: string
          expiry_date: string
          id?: string
          letter_date?: string | null
          letter_url?: string | null
          maintenance_bonds?: boolean | null
          payment_bonds?: boolean | null
          performance_bonds?: boolean | null
          single_project_limit: number
          supply_bonds?: boolean | null
          surety_company: string
          surety_rating?: string | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          agent_email?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          aggregate_limit?: number
          available_capacity?: number | null
          bid_bonds?: boolean | null
          bonded_backlog?: number | null
          company_id?: string
          created_at?: string | null
          current_backlog?: number | null
          effective_date?: string
          expiry_date?: string
          id?: string
          letter_date?: string | null
          letter_url?: string | null
          maintenance_bonds?: boolean | null
          payment_bonds?: boolean | null
          performance_bonds?: boolean | null
          single_project_limit?: number
          supply_bonds?: boolean | null
          surety_company?: string
          surety_rating?: string | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bonding_capacity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_breakdown: {
        Row: {
          allocated_amount: number | null
          category: string
          created_at: string
          id: string
          project_id: string | null
          spent_amount: number | null
          updated_at: string
        }
        Insert: {
          allocated_amount?: number | null
          category: string
          created_at?: string
          id?: string
          project_id?: string | null
          spent_amount?: number | null
          updated_at?: string
        }
        Update: {
          allocated_amount?: number | null
          category?: string
          created_at?: string
          id?: string
          project_id?: string | null
          spent_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_breakdown_project_id_fkey"
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          provider: string
          refresh_token: string | null
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          provider: string
          refresh_token?: string | null
          scope?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          provider?: string
          refresh_token?: string | null
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          annual_revenue: number | null
          bonding_capacity: number | null
          city: string | null
          company_type: string | null
          country: string | null
          created_at: string | null
          duns_number: string | null
          email: string | null
          employee_count: number | null
          id: string
          name: string
          phone: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          primary_contact_title: string | null
          specialty_codes: string[] | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
          website: string | null
          years_in_business: number | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue?: number | null
          bonding_capacity?: number | null
          city?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          duns_number?: string | null
          email?: string | null
          employee_count?: number | null
          id?: string
          name: string
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          specialty_codes?: string[] | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
          years_in_business?: number | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue?: number | null
          bonding_capacity?: number | null
          city?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          duns_number?: string | null
          email?: string | null
          employee_count?: number | null
          id?: string
          name?: string
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          specialty_codes?: string[] | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
          years_in_business?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      company: {
        Row: {
          address: string | null
          annual_revenue: number | null
          bonding_capacity: number | null
          certifications: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          custom_fields: Json | null
          diversity_flags: Json | null
          duns_number: string | null
          employees: number | null
          id: string
          industry: string | null
          insurance_expiry: string | null
          is_preferred: boolean | null
          license_expiry: string | null
          license_number: string | null
          naics_code: string | null
          name: string
          parent_company_id: string | null
          payment_terms: string | null
          performance_score: number | null
          phone: string | null
          procore_company_id: string | null
          risk_score: number | null
          sic_code: string | null
          source: string | null
          state: string | null
          status: Database["public"]["Enums"]["company_status"] | null
          tags: string[] | null
          tax_id: string | null
          trade_codes: string[] | null
          type: Database["public"]["Enums"]["company_type"] | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          annual_revenue?: number | null
          bonding_capacity?: number | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          custom_fields?: Json | null
          diversity_flags?: Json | null
          duns_number?: string | null
          employees?: number | null
          id?: string
          industry?: string | null
          insurance_expiry?: string | null
          is_preferred?: boolean | null
          license_expiry?: string | null
          license_number?: string | null
          naics_code?: string | null
          name: string
          parent_company_id?: string | null
          payment_terms?: string | null
          performance_score?: number | null
          phone?: string | null
          procore_company_id?: string | null
          risk_score?: number | null
          sic_code?: string | null
          source?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["company_status"] | null
          tags?: string[] | null
          tax_id?: string | null
          trade_codes?: string[] | null
          type?: Database["public"]["Enums"]["company_type"] | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          annual_revenue?: number | null
          bonding_capacity?: number | null
          certifications?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          custom_fields?: Json | null
          diversity_flags?: Json | null
          duns_number?: string | null
          employees?: number | null
          id?: string
          industry?: string | null
          insurance_expiry?: string | null
          is_preferred?: boolean | null
          license_expiry?: string | null
          license_number?: string | null
          naics_code?: string | null
          name?: string
          parent_company_id?: string | null
          payment_terms?: string | null
          performance_score?: number | null
          phone?: string | null
          procore_company_id?: string | null
          risk_score?: number | null
          sic_code?: string | null
          source?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["company_status"] | null
          tags?: string[] | null
          tax_id?: string | null
          trade_codes?: string[] | null
          type?: Database["public"]["Enums"]["company_type"] | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      construction_activities: {
        Row: {
          activity_date: string
          activity_name: string
          created_at: string
          crew_name: string
          duration_hours: number
          id: string
          notes: string | null
          project_id: string
          status: string
          trade: string
          updated_at: string
        }
        Insert: {
          activity_date: string
          activity_name: string
          created_at?: string
          crew_name: string
          duration_hours: number
          id?: string
          notes?: string | null
          project_id: string
          status: string
          trade: string
          updated_at?: string
        }
        Update: {
          activity_date?: string
          activity_name?: string
          created_at?: string
          crew_name?: string
          duration_hours?: number
          id?: string
          notes?: string | null
          project_id?: string
          status?: string
          trade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      construction_daily_progress: {
        Row: {
          actual_progress: number
          created_at: string
          date: string
          id: string
          planned_progress: number
          project_id: string
          updated_at: string
          workforce_count: number
        }
        Insert: {
          actual_progress: number
          created_at?: string
          date: string
          id?: string
          planned_progress: number
          project_id: string
          updated_at?: string
          workforce_count: number
        }
        Update: {
          actual_progress?: number
          created_at?: string
          date?: string
          id?: string
          planned_progress?: number
          project_id?: string
          updated_at?: string
          workforce_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "construction_daily_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      construction_quality_metrics: {
        Row: {
          created_at: string
          id: string
          inspection_pass_rate: number
          project_id: string
          quality_score: number
          rework_items: number
          updated_at: string
          week_ending: string
        }
        Insert: {
          created_at?: string
          id?: string
          inspection_pass_rate: number
          project_id: string
          quality_score: number
          rework_items: number
          updated_at?: string
          week_ending: string
        }
        Update: {
          created_at?: string
          id?: string
          inspection_pass_rate?: number
          project_id?: string
          quality_score?: number
          rework_items?: number
          updated_at?: string
          week_ending?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_quality_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      construction_tool_logs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cost_cents: number | null
          created_at: string | null
          execution_id: string
          id: number
          parameters: Json | null
          project_id: string | null
          requires_approval: boolean | null
          result: Json | null
          status: string
          tool_name: string
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cost_cents?: number | null
          created_at?: string | null
          execution_id: string
          id?: number
          parameters?: Json | null
          project_id?: string | null
          requires_approval?: boolean | null
          result?: Json | null
          status?: string
          tool_name: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cost_cents?: number | null
          created_at?: string | null
          execution_id?: string
          id?: number
          parameters?: Json | null
          project_id?: string | null
          requires_approval?: boolean | null
          result?: Json | null
          status?: string
          tool_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      construction_trade_progress: {
        Row: {
          created_at: string
          electrical_progress: number
          finishes_progress: number
          floor_level: string
          id: string
          mechanical_progress: number
          plumbing_progress: number
          project_id: string
          structural_progress: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          electrical_progress: number
          finishes_progress: number
          floor_level: string
          id?: string
          mechanical_progress: number
          plumbing_progress: number
          project_id: string
          structural_progress: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          electrical_progress?: number
          finishes_progress?: number
          floor_level?: string
          id?: string
          mechanical_progress?: number
          plumbing_progress?: number
          project_id?: string
          structural_progress?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_trade_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contact: {
        Row: {
          assistant_name: string | null
          assistant_phone: string | null
          avatar_url: string | null
          best_time_to_contact: string | null
          birthdate: string | null
          children: number | null
          company_id: string
          created_at: string | null
          custom_fields: Json | null
          department: string | null
          do_not_call: boolean | null
          do_not_email: boolean | null
          email: string | null
          fax: string | null
          gender: string | null
          hobbies: string[] | null
          id: string
          lead_source: string | null
          linkedin: string | null
          marital_status: string | null
          mobile_phone: string | null
          name: string
          office_phone: string | null
          opted_out: boolean | null
          phone: string | null
          preferred_contact_method: string | null
          reports_to: string | null
          social_media: Json | null
          spouse_name: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          assistant_name?: string | null
          assistant_phone?: string | null
          avatar_url?: string | null
          best_time_to_contact?: string | null
          birthdate?: string | null
          children?: number | null
          company_id: string
          created_at?: string | null
          custom_fields?: Json | null
          department?: string | null
          do_not_call?: boolean | null
          do_not_email?: boolean | null
          email?: string | null
          fax?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string
          lead_source?: string | null
          linkedin?: string | null
          marital_status?: string | null
          mobile_phone?: string | null
          name: string
          office_phone?: string | null
          opted_out?: boolean | null
          phone?: string | null
          preferred_contact_method?: string | null
          reports_to?: string | null
          social_media?: Json | null
          spouse_name?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          assistant_name?: string | null
          assistant_phone?: string | null
          avatar_url?: string | null
          best_time_to_contact?: string | null
          birthdate?: string | null
          children?: number | null
          company_id?: string
          created_at?: string | null
          custom_fields?: Json | null
          department?: string | null
          do_not_call?: boolean | null
          do_not_email?: boolean | null
          email?: string | null
          fax?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string
          lead_source?: string | null
          linkedin?: string | null
          marital_status?: string | null
          mobile_phone?: string | null
          name?: string
          office_phone?: string | null
          opted_out?: boolean | null
          phone?: string | null
          preferred_contact_method?: string | null
          reports_to?: string | null
          social_media?: Json | null
          spouse_name?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_amendments: {
        Row: {
          amended_contract_value: number | null
          amended_end_date: string | null
          amendment_document_url: string | null
          amendment_number: number
          amendment_type: string
          approved_at: string | null
          approved_by: string | null
          award_package_id: string
          created_at: string | null
          description: string
          executed_amendment_url: string | null
          id: string
          justification: string
          original_contract_value: number | null
          original_end_date: string | null
          requested_at: string | null
          requested_by: string
          supporting_documents: Json | null
          time_extension_days: number | null
          updated_at: string | null
          value_change: number | null
          value_change_percentage: number | null
          vendor_agreed: boolean | null
          vendor_objection_notes: string | null
          vendor_signature_date: string | null
        }
        Insert: {
          amended_contract_value?: number | null
          amended_end_date?: string | null
          amendment_document_url?: string | null
          amendment_number: number
          amendment_type: string
          approved_at?: string | null
          approved_by?: string | null
          award_package_id: string
          created_at?: string | null
          description: string
          executed_amendment_url?: string | null
          id?: string
          justification: string
          original_contract_value?: number | null
          original_end_date?: string | null
          requested_at?: string | null
          requested_by: string
          supporting_documents?: Json | null
          time_extension_days?: number | null
          updated_at?: string | null
          value_change?: number | null
          value_change_percentage?: number | null
          vendor_agreed?: boolean | null
          vendor_objection_notes?: string | null
          vendor_signature_date?: string | null
        }
        Update: {
          amended_contract_value?: number | null
          amended_end_date?: string | null
          amendment_document_url?: string | null
          amendment_number?: number
          amendment_type?: string
          approved_at?: string | null
          approved_by?: string | null
          award_package_id?: string
          created_at?: string | null
          description?: string
          executed_amendment_url?: string | null
          id?: string
          justification?: string
          original_contract_value?: number | null
          original_end_date?: string | null
          requested_at?: string | null
          requested_by?: string
          supporting_documents?: Json | null
          time_extension_days?: number | null
          updated_at?: string | null
          value_change?: number | null
          value_change_percentage?: number | null
          vendor_agreed?: boolean | null
          vendor_objection_notes?: string | null
          vendor_signature_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_amendments_award_package_id_fkey"
            columns: ["award_package_id"]
            isOneToOne: false
            referencedRelation: "award_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_bids: {
        Row: {
          bid_amount: number | null
          contractor_name: string
          created_at: string
          evaluation_score: number | null
          experience_years: number | null
          id: string
          project_id: string | null
          proposed_timeline: string | null
          recommended: boolean | null
          status: string | null
          updated_at: string
        }
        Insert: {
          bid_amount?: number | null
          contractor_name: string
          created_at?: string
          evaluation_score?: number | null
          experience_years?: number | null
          id?: string
          project_id?: string | null
          proposed_timeline?: string | null
          recommended?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          bid_amount?: number | null
          contractor_name?: string
          created_at?: string
          evaluation_score?: number | null
          experience_years?: number | null
          id?: string
          project_id?: string | null
          proposed_timeline?: string | null
          recommended?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_bids_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_cache: {
        Row: {
          conversation_history: Json | null
          id: number
          key: string
          last_updated: string | null
          total_tokens: number | null
        }
        Insert: {
          conversation_history?: Json | null
          id?: number
          key: string
          last_updated?: string | null
          total_tokens?: number | null
        }
        Update: {
          conversation_history?: Json | null
          id?: number
          key?: string
          last_updated?: string | null
          total_tokens?: number | null
        }
        Relationships: []
      }
      conversation_memory: {
        Row: {
          created_at: string | null
          id: number
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          project_id: string | null
          role: string
          timestamp: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          project_id?: string | null
          role: string
          timestamp?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          project_id?: string | null
          role?: string
          timestamp?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crm_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          changes: Json | null
          company_id: string | null
          created_at: string | null
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          changes?: Json | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          changes?: Json | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_analytics: {
        Row: {
          active_companies: number | null
          activities_count: number | null
          avg_deal_size: number | null
          communications_sent: number | null
          conversion_rate: number | null
          created_at: string | null
          diversity_metrics: Json | null
          id: string
          metric_date: string
          metric_type: string
          opportunities_by_stage: Json | null
          performance_metrics: Json | null
          risk_metrics: Json | null
          tasks_completed: number | null
          total_companies: number | null
          total_contacts: number | null
          total_opportunities: number | null
          total_pipeline_value: number | null
          weighted_pipeline_value: number | null
          win_rate: number | null
        }
        Insert: {
          active_companies?: number | null
          activities_count?: number | null
          avg_deal_size?: number | null
          communications_sent?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          diversity_metrics?: Json | null
          id?: string
          metric_date: string
          metric_type: string
          opportunities_by_stage?: Json | null
          performance_metrics?: Json | null
          risk_metrics?: Json | null
          tasks_completed?: number | null
          total_companies?: number | null
          total_contacts?: number | null
          total_opportunities?: number | null
          total_pipeline_value?: number | null
          weighted_pipeline_value?: number | null
          win_rate?: number | null
        }
        Update: {
          active_companies?: number | null
          activities_count?: number | null
          avg_deal_size?: number | null
          communications_sent?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          diversity_metrics?: Json | null
          id?: string
          metric_date?: string
          metric_type?: string
          opportunities_by_stage?: Json | null
          performance_metrics?: Json | null
          risk_metrics?: Json | null
          tasks_completed?: number | null
          total_companies?: number | null
          total_contacts?: number | null
          total_opportunities?: number | null
          total_pipeline_value?: number | null
          weighted_pipeline_value?: number | null
          win_rate?: number | null
        }
        Relationships: []
      }
      crm_campaign_members: {
        Row: {
          campaign_id: string
          company_id: string | null
          contact_id: string | null
          created_at: string | null
          engagement_score: number | null
          id: string
          interactions: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interactions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interactions?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_campaign_members_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "crm_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_campaign_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_campaign_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_campaign_members_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_campaigns: {
        Row: {
          actual_cost: number | null
          budget: number | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          metrics: Json | null
          name: string
          start_date: string | null
          status: string | null
          target_audience: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          budget?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name: string
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          budget?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          start_date?: string | null
          status?: string | null
          target_audience?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_communications: {
        Row: {
          attachments: Json | null
          attendee_count: number | null
          bcc_contact_ids: string[] | null
          cc_contact_ids: string[] | null
          company_id: string | null
          contact_id: string | null
          content: string | null
          created_at: string | null
          delivered_at: string | null
          duration_minutes: number | null
          from_user_id: string
          id: string
          in_reply_to: string | null
          metadata: Json | null
          opportunity_id: string | null
          preview: string | null
          read_at: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["communication_status"] | null
          subject: string | null
          thread_id: string | null
          to_contact_ids: string[] | null
          type: Database["public"]["Enums"]["communication_type"]
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          attendee_count?: number | null
          bcc_contact_ids?: string[] | null
          cc_contact_ids?: string[] | null
          company_id?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          duration_minutes?: number | null
          from_user_id: string
          id?: string
          in_reply_to?: string | null
          metadata?: Json | null
          opportunity_id?: string | null
          preview?: string | null
          read_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
          subject?: string | null
          thread_id?: string | null
          to_contact_ids?: string[] | null
          type: Database["public"]["Enums"]["communication_type"]
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          attendee_count?: number | null
          bcc_contact_ids?: string[] | null
          cc_contact_ids?: string[] | null
          company_id?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          duration_minutes?: number | null
          from_user_id?: string
          id?: string
          in_reply_to?: string | null
          metadata?: Json | null
          opportunity_id?: string | null
          preview?: string | null
          read_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["communication_status"] | null
          subject?: string | null
          thread_id?: string | null
          to_contact_ids?: string[] | null
          type?: Database["public"]["Enums"]["communication_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_communications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_communications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_communications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_communications_in_reply_to_fkey"
            columns: ["in_reply_to"]
            isOneToOne: false
            referencedRelation: "crm_communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_communications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunity_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_communications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_documents: {
        Row: {
          company_id: string | null
          contact_id: string | null
          created_at: string | null
          description: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          mime_type: string | null
          name: string
          opportunity_id: string | null
          shared_with: string[] | null
          tags: string[] | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string | null
          uploaded_by: string
          version: number | null
        }
        Insert: {
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name: string
          opportunity_id?: string | null
          shared_with?: string[] | null
          tags?: string[] | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          uploaded_by: string
          version?: number | null
        }
        Update: {
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          opportunity_id?: string | null
          shared_with?: string[] | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          uploaded_by?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunity_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_tags: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          actual_hours: number | null
          assignee_id: string
          assignee_name: string | null
          attachments: Json | null
          company_id: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          metadata: Json | null
          opportunity_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          reminder_date: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assignee_id: string
          assignee_name?: string | null
          attachments?: Json | null
          company_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          metadata?: Json | null
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          reminder_date?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assignee_id?: string
          assignee_name?: string | null
          attachments?: Json | null
          company_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          metadata?: Json | null
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          reminder_date?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "crm_opportunity_pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          tags: string[] | null
          type: string
          updated_at: string | null
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          tags?: string[] | null
          type: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
      csi_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          division_id: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          division_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          division_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "csi_codes_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "csi_divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      csi_divisions: {
        Row: {
          created_at: string | null
          description: string | null
          division_name: string
          division_number: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          division_name: string
          division_number: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          division_name?: string
          division_number?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      data_store: {
        Row: {
          created_at: string | null
          id: number
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      division1_attachments: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          section_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          section_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          section_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "division1_attachments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "division1_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      division1_audit_results: {
        Row: {
          audit_date: string
          auditor: string | null
          created_at: string
          critical_issues: number | null
          id: string
          low_issues: number | null
          medium_issues: number | null
          overall_compliance_score: number
          project_id: string
          recommendations: string[] | null
          sections_compliant: number
          summary: string | null
          total_sections: number
        }
        Insert: {
          audit_date: string
          auditor?: string | null
          created_at?: string
          critical_issues?: number | null
          id?: string
          low_issues?: number | null
          medium_issues?: number | null
          overall_compliance_score: number
          project_id: string
          recommendations?: string[] | null
          sections_compliant: number
          summary?: string | null
          total_sections: number
        }
        Update: {
          audit_date?: string
          auditor?: string | null
          created_at?: string
          critical_issues?: number | null
          id?: string
          low_issues?: number | null
          medium_issues?: number | null
          overall_compliance_score?: number
          project_id?: string
          recommendations?: string[] | null
          sections_compliant?: number
          summary?: string | null
          total_sections?: number
        }
        Relationships: [
          {
            foreignKeyName: "division1_audit_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      division1_compliance_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          notes: string | null
          performed_by: string | null
          project_id: string
          section_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_by?: string | null
          project_id: string
          section_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_by?: string | null
          project_id?: string
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "division1_compliance_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "division1_compliance_logs_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "division1_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      division1_issues: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          notes: string | null
          resolved_date: string | null
          section_id: string
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          resolved_date?: string | null
          section_id: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          resolved_date?: string | null
          section_id?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "division1_issues_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "division1_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      division1_sections: {
        Row: {
          completion_percentage: number | null
          created_at: string
          docs_on_file: number | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string
          required_docs: number | null
          section_number: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          docs_on_file?: number | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id: string
          required_docs?: number | null
          section_number: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          docs_on_file?: number | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          required_docs?: number | null
          section_number?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "division1_sections_project_id_fkey"
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          company_id: string | null
          context: Json | null
          created_at: string | null
          error_message: string | null
          error_stack: string | null
          id: string
          metadata: Json | null
          period: string | null
          project_id: string | null
          timestamp: string | null
          type: string
        }
        Insert: {
          company_id?: string | null
          context?: Json | null
          created_at?: string | null
          error_message?: string | null
          error_stack?: string | null
          id?: string
          metadata?: Json | null
          period?: string | null
          project_id?: string | null
          timestamp?: string | null
          type: string
        }
        Update: {
          company_id?: string | null
          context?: Json | null
          created_at?: string | null
          error_message?: string | null
          error_stack?: string | null
          id?: string
          metadata?: Json | null
          period?: string | null
          project_id?: string | null
          timestamp?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_statement: {
        Row: {
          accountant_firm: string | null
          accountant_name: string | null
          accounts_payable: number | null
          accounts_receivable: number | null
          cash_and_equivalents: number | null
          company_id: string
          created_at: string | null
          current_assets: number | null
          current_liabilities: number | null
          current_ratio: number | null
          debt_to_equity_ratio: number | null
          ebitda: number | null
          file_name: string | null
          file_url: string | null
          gross_profit: number | null
          id: string
          inventory: number | null
          long_term_debt: number | null
          net_income: number | null
          operating_income: number | null
          profit_margin: number | null
          short_term_debt: number | null
          statement_type: string
          statement_year: number
          stockholders_equity: number | null
          total_assets: number | null
          total_liabilities: number | null
          total_revenue: number | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          accountant_firm?: string | null
          accountant_name?: string | null
          accounts_payable?: number | null
          accounts_receivable?: number | null
          cash_and_equivalents?: number | null
          company_id: string
          created_at?: string | null
          current_assets?: number | null
          current_liabilities?: number | null
          current_ratio?: number | null
          debt_to_equity_ratio?: number | null
          ebitda?: number | null
          file_name?: string | null
          file_url?: string | null
          gross_profit?: number | null
          id?: string
          inventory?: number | null
          long_term_debt?: number | null
          net_income?: number | null
          operating_income?: number | null
          profit_margin?: number | null
          short_term_debt?: number | null
          statement_type: string
          statement_year: number
          stockholders_equity?: number | null
          total_assets?: number | null
          total_liabilities?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          accountant_firm?: string | null
          accountant_name?: string | null
          accounts_payable?: number | null
          accounts_receivable?: number | null
          cash_and_equivalents?: number | null
          company_id?: string
          created_at?: string | null
          current_assets?: number | null
          current_liabilities?: number | null
          current_ratio?: number | null
          debt_to_equity_ratio?: number | null
          ebitda?: number | null
          file_name?: string | null
          file_url?: string | null
          gross_profit?: number | null
          id?: string
          inventory?: number | null
          long_term_debt?: number | null
          net_income?: number | null
          operating_income?: number | null
          profit_margin?: number | null
          short_term_debt?: number | null
          statement_type?: string
          statement_year?: number
          stockholders_equity?: number | null
          total_assets?: number | null
          total_liabilities?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_statement_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_certificate: {
        Row: {
          additional_insured: boolean | null
          carrier: string
          coverage_limit: number
          created_at: string | null
          deductible: number | null
          effective_date: string
          expiry_date: string
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          insurance_type: Database["public"]["Enums"]["insurance_type"]
          notes: string | null
          policy_number: string | null
          prequal_id: string
          primary_and_noncontributory: boolean | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
          waiver_of_subrogation: boolean | null
        }
        Insert: {
          additional_insured?: boolean | null
          carrier: string
          coverage_limit: number
          created_at?: string | null
          deductible?: number | null
          effective_date: string
          expiry_date: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          insurance_type: Database["public"]["Enums"]["insurance_type"]
          notes?: string | null
          policy_number?: string | null
          prequal_id: string
          primary_and_noncontributory?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          waiver_of_subrogation?: boolean | null
        }
        Update: {
          additional_insured?: boolean | null
          carrier?: string
          coverage_limit?: number
          created_at?: string | null
          deductible?: number | null
          effective_date?: string
          expiry_date?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          insurance_type?: Database["public"]["Enums"]["insurance_type"]
          notes?: string | null
          policy_number?: string | null
          prequal_id?: string
          primary_and_noncontributory?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          waiver_of_subrogation?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_certificate_prequal_id_fkey"
            columns: ["prequal_id"]
            isOneToOne: false
            referencedRelation: "prequal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_certificate_prequal_id_fkey"
            columns: ["prequal_id"]
            isOneToOne: false
            referencedRelation: "prequal_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string | null
          external_id: string | null
          id: string
          integration_type: string
          metadata: Json | null
          status: string
        }
        Insert: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          integration_type: string
          metadata?: Json | null
          status: string
        }
        Update: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          integration_type?: string
          metadata?: Json | null
          status?: string
        }
        Relationships: []
      }
      interaction: {
        Row: {
          ai_summary: string | null
          company_id: string
          contact_id: string | null
          created_at: string | null
          date: string
          id: string
          medium: string | null
          notes: string | null
          type: Database["public"]["Enums"]["interaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          company_id: string
          contact_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          medium?: string | null
          notes?: string | null
          type: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          company_id?: string
          contact_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          medium?: string | null
          notes?: string | null
          type?: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interaction_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interaction_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_template: {
        Row: {
          created_at: string | null
          description: string | null
          metric: string
          target_direction: string
          unit: string | null
          updated_at: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          metric: string
          target_direction: string
          unit?: string | null
          updated_at?: string | null
          weight?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          metric?: string
          target_direction?: string
          unit?: string | null
          updated_at?: string | null
          weight?: number
        }
        Relationships: []
      }
      lead_time: {
        Row: {
          actual_delivery_date: string | null
          award_due: string
          contract_value: number | null
          created_at: string | null
          delay_reason: string | null
          delivery_est: string
          fab_lead_days: number
          id: string
          notes: string | null
          priority: string | null
          rfp_id: string | null
          rfq_issue_date: string
          scope_csi: string[]
          status: string | null
          updated_at: string | null
          vendor_id: string | null
          work_pkg: string
        }
        Insert: {
          actual_delivery_date?: string | null
          award_due: string
          contract_value?: number | null
          created_at?: string | null
          delay_reason?: string | null
          delivery_est: string
          fab_lead_days?: number
          id?: string
          notes?: string | null
          priority?: string | null
          rfp_id?: string | null
          rfq_issue_date: string
          scope_csi?: string[]
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          work_pkg: string
        }
        Update: {
          actual_delivery_date?: string | null
          award_due?: string
          contract_value?: number | null
          created_at?: string | null
          delay_reason?: string | null
          delivery_est?: string
          fab_lead_days?: number
          id?: string
          notes?: string | null
          priority?: string | null
          rfp_id?: string | null
          rfq_issue_date?: string
          scope_csi?: string[]
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          work_pkg?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_time_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "bid_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_time_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "project_bid_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_time_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_time_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      leveling: {
        Row: {
          adjustment_rationale: string | null
          bid_id: string
          created_at: string | null
          id: string
          is_complete: boolean | null
          leveled_at: string | null
          leveled_base_price: number | null
          leveled_by: string
          leveled_total_price: number | null
          price_adjustments: Json | null
          recommendation_notes: string | null
          recommended_for_shortlist: boolean | null
          scope_clarifications: Json | null
          submission_id: string
          technical_adjustments: Json | null
          updated_at: string | null
        }
        Insert: {
          adjustment_rationale?: string | null
          bid_id: string
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          leveled_at?: string | null
          leveled_base_price?: number | null
          leveled_by: string
          leveled_total_price?: number | null
          price_adjustments?: Json | null
          recommendation_notes?: string | null
          recommended_for_shortlist?: boolean | null
          scope_clarifications?: Json | null
          submission_id: string
          technical_adjustments?: Json | null
          updated_at?: string | null
        }
        Update: {
          adjustment_rationale?: string | null
          bid_id?: string
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          leveled_at?: string | null
          leveled_base_price?: number | null
          leveled_by?: string
          leveled_total_price?: number | null
          price_adjustments?: Json | null
          recommendation_notes?: string | null
          recommended_for_shortlist?: boolean | null
          scope_clarifications?: Json | null
          submission_id?: string
          technical_adjustments?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leveling_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leveling_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      leveling_snapshot: {
        Row: {
          algorithm_version: string | null
          analysis_date: string | null
          bid_id: string
          created_at: string | null
          error_message: string | null
          id: string
          matrix_data: Json
          outlier_summary: Json | null
          processing_time_ms: number | null
          status: string | null
          summary_stats: Json | null
          total_line_items: number
          total_submissions: number
          updated_at: string | null
        }
        Insert: {
          algorithm_version?: string | null
          analysis_date?: string | null
          bid_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          matrix_data?: Json
          outlier_summary?: Json | null
          processing_time_ms?: number | null
          status?: string | null
          summary_stats?: Json | null
          total_line_items?: number
          total_submissions?: number
          updated_at?: string | null
        }
        Update: {
          algorithm_version?: string | null
          analysis_date?: string | null
          bid_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          matrix_data?: Json
          outlier_summary?: Json | null
          processing_time_ms?: number | null
          status?: string | null
          summary_stats?: Json | null
          total_line_items?: number
          total_submissions?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leveling_snapshot_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      line_item_analyses: {
        Row: {
          analysis_date: string | null
          average_bid: number | null
          avg_vs_estimate_variance: number | null
          coefficient_variation: number | null
          created_at: string | null
          engineer_estimate: number | null
          high_bid: number | null
          id: string
          line_item_id: string | null
          low_bid: number | null
          market_competitiveness: string | null
          median_bid: number | null
          median_vs_estimate_variance: number | null
          no_bid_count: number | null
          outlier_count: number | null
          outlier_threshold: number | null
          outlier_vendor_ids: string[] | null
          participating_vendors: number
          price_volatility: string | null
          recommendation: string | null
          responding_vendors: number
          standard_deviation: number | null
          updated_at: string | null
        }
        Insert: {
          analysis_date?: string | null
          average_bid?: number | null
          avg_vs_estimate_variance?: number | null
          coefficient_variation?: number | null
          created_at?: string | null
          engineer_estimate?: number | null
          high_bid?: number | null
          id?: string
          line_item_id?: string | null
          low_bid?: number | null
          market_competitiveness?: string | null
          median_bid?: number | null
          median_vs_estimate_variance?: number | null
          no_bid_count?: number | null
          outlier_count?: number | null
          outlier_threshold?: number | null
          outlier_vendor_ids?: string[] | null
          participating_vendors: number
          price_volatility?: string | null
          recommendation?: string | null
          responding_vendors: number
          standard_deviation?: number | null
          updated_at?: string | null
        }
        Update: {
          analysis_date?: string | null
          average_bid?: number | null
          avg_vs_estimate_variance?: number | null
          coefficient_variation?: number | null
          created_at?: string | null
          engineer_estimate?: number | null
          high_bid?: number | null
          id?: string
          line_item_id?: string | null
          low_bid?: number | null
          market_competitiveness?: string | null
          median_bid?: number | null
          median_vs_estimate_variance?: number | null
          no_bid_count?: number | null
          outlier_count?: number | null
          outlier_threshold?: number | null
          outlier_vendor_ids?: string[] | null
          participating_vendors?: number
          price_volatility?: string | null
          recommendation?: string | null
          responding_vendors?: number
          standard_deviation?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "line_item_analyses_line_item_id_fkey"
            columns: ["line_item_id"]
            isOneToOne: false
            referencedRelation: "bid_line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      litigation: {
        Row: {
          case_number: string | null
          case_title: string | null
          case_type: string | null
          claim_amount: number | null
          company_id: string
          court_jurisdiction: string | null
          created_at: string | null
          defendant: string | null
          description: string | null
          filed_date: string | null
          id: string
          impact_on_operations: string | null
          insurance_covered: boolean | null
          lessons_learned: string | null
          notes: string | null
          plaintiff: string | null
          related_project_name: string | null
          related_project_value: number | null
          resolution_date: string | null
          resolution_type: string | null
          settled: boolean | null
          settlement_amount: number | null
          status: Database["public"]["Enums"]["litigation_status"]
          updated_at: string | null
        }
        Insert: {
          case_number?: string | null
          case_title?: string | null
          case_type?: string | null
          claim_amount?: number | null
          company_id: string
          court_jurisdiction?: string | null
          created_at?: string | null
          defendant?: string | null
          description?: string | null
          filed_date?: string | null
          id?: string
          impact_on_operations?: string | null
          insurance_covered?: boolean | null
          lessons_learned?: string | null
          notes?: string | null
          plaintiff?: string | null
          related_project_name?: string | null
          related_project_value?: number | null
          resolution_date?: string | null
          resolution_type?: string | null
          settled?: boolean | null
          settlement_amount?: number | null
          status: Database["public"]["Enums"]["litigation_status"]
          updated_at?: string | null
        }
        Update: {
          case_number?: string | null
          case_title?: string | null
          case_type?: string | null
          claim_amount?: number | null
          company_id?: string
          court_jurisdiction?: string | null
          created_at?: string | null
          defendant?: string | null
          description?: string | null
          filed_date?: string | null
          id?: string
          impact_on_operations?: string | null
          insurance_covered?: boolean | null
          lessons_learned?: string | null
          notes?: string | null
          plaintiff?: string | null
          related_project_name?: string | null
          related_project_value?: number | null
          resolution_date?: string | null
          resolution_type?: string | null
          settled?: boolean | null
          settlement_amount?: number | null
          status?: Database["public"]["Enums"]["litigation_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "litigation_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      market_analyses: {
        Row: {
          analysis_period_end: string
          analysis_period_start: string
          created_at: string | null
          csi_division_id: string | null
          economic_indicators: Json | null
          historical_price_variance: number | null
          id: string
          labor_availability: string | null
          market_activity_level: string | null
          material_cost_index: number | null
          price_trend: string | null
          regional_price_index: number | null
          seasonal_adjustments: number[] | null
          updated_at: string | null
        }
        Insert: {
          analysis_period_end: string
          analysis_period_start: string
          created_at?: string | null
          csi_division_id?: string | null
          economic_indicators?: Json | null
          historical_price_variance?: number | null
          id?: string
          labor_availability?: string | null
          market_activity_level?: string | null
          material_cost_index?: number | null
          price_trend?: string | null
          regional_price_index?: number | null
          seasonal_adjustments?: number[] | null
          updated_at?: string | null
        }
        Update: {
          analysis_period_end?: string
          analysis_period_start?: string
          created_at?: string | null
          csi_division_id?: string | null
          economic_indicators?: Json | null
          historical_price_variance?: number | null
          id?: string
          labor_availability?: string | null
          market_activity_level?: string | null
          material_cost_index?: number | null
          price_trend?: string | null
          regional_price_index?: number | null
          seasonal_adjustments?: number[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_analyses_csi_division_id_fkey"
            columns: ["csi_division_id"]
            isOneToOne: false
            referencedRelation: "csi_divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      material_deliveries: {
        Row: {
          cost: number
          created_at: string
          id: string
          material_name: string
          project_id: string
          quantity: string
          scheduled_date: string
          status: string
          supplier: string
          updated_at: string
        }
        Insert: {
          cost: number
          created_at?: string
          id?: string
          material_name: string
          project_id: string
          quantity: string
          scheduled_date: string
          status: string
          supplier: string
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          material_name?: string
          project_id?: string
          quantity?: string
          scheduled_date?: string
          status?: string
          supplier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_deliveries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity: {
        Row: {
          actual_close_date: string | null
          budget_confirmed: boolean | null
          campaign_id: string | null
          company_id: string
          competitors: string[] | null
          created_at: string | null
          custom_fields: Json | null
          decision_criteria: string[] | null
          decision_makers: Json | null
          description: string | null
          est_value: number | null
          expected_close_date: string | null
          id: string
          is_won: boolean | null
          last_activity_date: string | null
          lead_source: string | null
          lost_reason: string | null
          name: string | null
          next_action_date: string | null
          next_steps: string | null
          notes: string | null
          owner_id: string
          probability: number | null
          project_type: string | null
          proposal_sent_date: string | null
          rfp_id: string | null
          stage: Database["public"]["Enums"]["opportunity_stage"] | null
          strengths: string | null
          tags: string[] | null
          updated_at: string | null
          weaknesses: string | null
          won_amount: number | null
        }
        Insert: {
          actual_close_date?: string | null
          budget_confirmed?: boolean | null
          campaign_id?: string | null
          company_id: string
          competitors?: string[] | null
          created_at?: string | null
          custom_fields?: Json | null
          decision_criteria?: string[] | null
          decision_makers?: Json | null
          description?: string | null
          est_value?: number | null
          expected_close_date?: string | null
          id?: string
          is_won?: boolean | null
          last_activity_date?: string | null
          lead_source?: string | null
          lost_reason?: string | null
          name?: string | null
          next_action_date?: string | null
          next_steps?: string | null
          notes?: string | null
          owner_id: string
          probability?: number | null
          project_type?: string | null
          proposal_sent_date?: string | null
          rfp_id?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          strengths?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weaknesses?: string | null
          won_amount?: number | null
        }
        Update: {
          actual_close_date?: string | null
          budget_confirmed?: boolean | null
          campaign_id?: string | null
          company_id?: string
          competitors?: string[] | null
          created_at?: string | null
          custom_fields?: Json | null
          decision_criteria?: string[] | null
          decision_makers?: Json | null
          description?: string | null
          est_value?: number | null
          expected_close_date?: string | null
          id?: string
          is_won?: boolean | null
          last_activity_date?: string | null
          lead_source?: string | null
          lost_reason?: string | null
          name?: string | null
          next_action_date?: string | null
          next_steps?: string | null
          notes?: string | null
          owner_id?: string
          probability?: number | null
          project_type?: string | null
          proposal_sent_date?: string | null
          rfp_id?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          strengths?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weaknesses?: string | null
          won_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "crm_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      overlay_history: {
        Row: {
          created_at: string | null
          id: string
          prompt: string
          response: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt: string
          response?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt?: string
          response?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      performance_kpi: {
        Row: {
          captured_at: string | null
          company_id: string
          created_at: string | null
          id: string
          metric: string
          notes: string | null
          period: string
          project_id: string | null
          source: string | null
          updated_at: string | null
          value: number
        }
        Insert: {
          captured_at?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          metric: string
          notes?: string | null
          period: string
          project_id?: string | null
          source?: string | null
          updated_at?: string | null
          value: number
        }
        Update: {
          captured_at?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          metric?: string
          notes?: string | null
          period?: string
          project_id?: string | null
          source?: string | null
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "performance_kpi_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_kpi_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_kpi_metric_fkey"
            columns: ["metric"]
            isOneToOne: false
            referencedRelation: "kpi_template"
            referencedColumns: ["metric"]
          },
          {
            foreignKeyName: "performance_kpi_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_summaries: {
        Row: {
          company_id: string
          created_at: string | null
          generated_at: string | null
          id: string
          overall_score: number | null
          period: string
          summary: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          overall_score?: number | null
          period: string
          summary: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          overall_score?: number | null
          period?: string
          summary?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_summaries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_summaries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      permit_status: {
        Row: {
          approved_date: string | null
          cost: number | null
          created_at: string
          expected_approval: string | null
          id: string
          permit_type: string
          priority: string | null
          project_id: string | null
          status: string
          submitted_date: string | null
          updated_at: string
        }
        Insert: {
          approved_date?: string | null
          cost?: number | null
          created_at?: string
          expected_approval?: string | null
          id?: string
          permit_type: string
          priority?: string | null
          project_id?: string | null
          status: string
          submitted_date?: string | null
          updated_at?: string
        }
        Update: {
          approved_date?: string | null
          cost?: number | null
          created_at?: string
          expected_approval?: string | null
          id?: string
          permit_type?: string
          priority?: string | null
          project_id?: string | null
          status?: string
          submitted_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permit_status_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      preconstruction_metrics: {
        Row: {
          budget_approval: number | null
          contractor_selection: number | null
          created_at: string
          design_completion: number | null
          feasibility_score: number | null
          id: string
          permit_progress: number | null
          project_id: string | null
          timeline_status: string | null
          updated_at: string
        }
        Insert: {
          budget_approval?: number | null
          contractor_selection?: number | null
          created_at?: string
          design_completion?: number | null
          feasibility_score?: number | null
          id?: string
          permit_progress?: number | null
          project_id?: string | null
          timeline_status?: string | null
          updated_at?: string
        }
        Update: {
          budget_approval?: number | null
          contractor_selection?: number | null
          created_at?: string
          design_completion?: number | null
          feasibility_score?: number | null
          id?: string
          permit_progress?: number | null
          project_id?: string | null
          timeline_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preconstruction_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      prequal: {
        Row: {
          application_version: string | null
          company_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          created_at: string | null
          expiry_date: string | null
          geographic_limits: string[] | null
          id: string
          project_size_limit: number | null
          renewal_required_at: string | null
          requested_trades: string[] | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          score: number | null
          status: Database["public"]["Enums"]["prequal_status"]
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          application_version?: string | null
          company_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string | null
          expiry_date?: string | null
          geographic_limits?: string[] | null
          id?: string
          project_size_limit?: number | null
          renewal_required_at?: string | null
          requested_trades?: string[] | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["prequal_status"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          application_version?: string | null
          company_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string | null
          expiry_date?: string | null
          geographic_limits?: string[] | null
          id?: string
          project_size_limit?: number | null
          renewal_required_at?: string | null
          requested_trades?: string[] | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["prequal_status"]
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prequal_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      prequal_document_requirement: {
        Row: {
          accepted_formats: string[] | null
          active: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          max_file_size: number | null
          name: string
          required: boolean | null
        }
        Insert: {
          accepted_formats?: string[] | null
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_file_size?: number | null
          name: string
          required?: boolean | null
        }
        Update: {
          accepted_formats?: string[] | null
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_file_size?: number | null
          name?: string
          required?: boolean | null
        }
        Relationships: []
      }
      prequal_document_upload: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          original_file_name: string | null
          prequal_id: string
          requirement_id: string | null
          review_notes: string | null
          review_status: string | null
          reviewed: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          original_file_name?: string | null
          prequal_id: string
          requirement_id?: string | null
          review_notes?: string | null
          review_status?: string | null
          reviewed?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          original_file_name?: string | null
          prequal_id?: string
          requirement_id?: string | null
          review_notes?: string | null
          review_status?: string | null
          reviewed?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prequal_document_upload_prequal_id_fkey"
            columns: ["prequal_id"]
            isOneToOne: false
            referencedRelation: "prequal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prequal_document_upload_prequal_id_fkey"
            columns: ["prequal_id"]
            isOneToOne: false
            referencedRelation: "prequal_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prequal_document_upload_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "prequal_document_requirement"
            referencedColumns: ["id"]
          },
        ]
      }
      prequal_score: {
        Row: {
          created_at: string | null
          criteria_id: string
          id: string
          notes: string | null
          prequal_id: string
          score: number
          scored_at: string | null
          scored_by: string | null
        }
        Insert: {
          created_at?: string | null
          criteria_id: string
          id?: string
          notes?: string | null
          prequal_id: string
          score: number
          scored_at?: string | null
          scored_by?: string | null
        }
        Update: {
          created_at?: string | null
          criteria_id?: string
          id?: string
          notes?: string | null
          prequal_id?: string
          score?: number
          scored_at?: string | null
          scored_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prequal_score_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "prequal_scoring_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prequal_score_prequal_id_fkey"
            columns: ["prequal_id"]
            isOneToOne: false
            referencedRelation: "prequal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prequal_score_prequal_id_fkey"
            columns: ["prequal_id"]
            isOneToOne: false
            referencedRelation: "prequal_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      prequal_scoring_criteria: {
        Row: {
          acceptable_threshold: number | null
          active: boolean | null
          category: string
          created_at: string | null
          criterion: string
          description: string | null
          excellent_threshold: number | null
          good_threshold: number | null
          id: string
          max_score: number | null
          min_score: number | null
          updated_at: string | null
          weight: number
        }
        Insert: {
          acceptable_threshold?: number | null
          active?: boolean | null
          category: string
          created_at?: string | null
          criterion: string
          description?: string | null
          excellent_threshold?: number | null
          good_threshold?: number | null
          id?: string
          max_score?: number | null
          min_score?: number | null
          updated_at?: string | null
          weight: number
        }
        Update: {
          acceptable_threshold?: number | null
          active?: boolean | null
          category?: string
          created_at?: string | null
          criterion?: string
          description?: string | null
          excellent_threshold?: number | null
          good_threshold?: number | null
          id?: string
          max_score?: number | null
          min_score?: number | null
          updated_at?: string | null
          weight?: number
        }
        Relationships: []
      }
      presigned_upload_tokens: {
        Row: {
          created_at: string | null
          created_by: string
          expires_at: string
          id: string
          ip_address: unknown | null
          presigned_url: string
          rfp_id: string
          s3_key: string
          submission_type: string
          used: boolean | null
          used_at: string | null
          user_agent: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          presigned_url: string
          rfp_id: string
          s3_key: string
          submission_type: string
          used?: boolean | null
          used_at?: string | null
          user_agent?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          presigned_url?: string
          rfp_id?: string
          s3_key?: string
          submission_type?: string
          used?: boolean | null
          used_at?: string | null
          user_agent?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presigned_upload_tokens_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presigned_upload_tokens_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["rfp_id"]
          },
        ]
      }
      project_cash_flow: {
        Row: {
          created_at: string | null
          cumulative: number | null
          id: string
          inflow: number | null
          month: string
          outflow: number | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cumulative?: number | null
          id?: string
          inflow?: number | null
          month: string
          outflow?: number | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cumulative?: number | null
          id?: string
          inflow?: number | null
          month?: string
          outflow?: number | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_cash_flow_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_construction_activities: {
        Row: {
          activity: string | null
          activity_date: string | null
          created_at: string | null
          crew: string | null
          duration: string | null
          id: string
          notes: string | null
          project_id: string
          status: string | null
          trade: string | null
          updated_at: string | null
        }
        Insert: {
          activity?: string | null
          activity_date?: string | null
          created_at?: string | null
          crew?: string | null
          duration?: string | null
          id?: string
          notes?: string | null
          project_id: string
          status?: string | null
          trade?: string | null
          updated_at?: string | null
        }
        Update: {
          activity?: string | null
          activity_date?: string | null
          created_at?: string | null
          crew?: string | null
          duration?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          status?: string | null
          trade?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_construction_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_construction_metrics: {
        Row: {
          active_subcontractors: number | null
          completed_milestones: number | null
          created_at: string | null
          days_ahead_behind: number | null
          id: string
          open_rfis: number | null
          overall_progress: number | null
          pending_submittals: number | null
          project_id: string
          quality_score: number | null
          safety_score: number | null
          total_milestones: number | null
          total_workforce: number | null
          updated_at: string | null
        }
        Insert: {
          active_subcontractors?: number | null
          completed_milestones?: number | null
          created_at?: string | null
          days_ahead_behind?: number | null
          id?: string
          open_rfis?: number | null
          overall_progress?: number | null
          pending_submittals?: number | null
          project_id: string
          quality_score?: number | null
          safety_score?: number | null
          total_milestones?: number | null
          total_workforce?: number | null
          updated_at?: string | null
        }
        Update: {
          active_subcontractors?: number | null
          completed_milestones?: number | null
          created_at?: string | null
          days_ahead_behind?: number | null
          id?: string
          open_rfis?: number | null
          overall_progress?: number | null
          pending_submittals?: number | null
          project_id?: string
          quality_score?: number | null
          safety_score?: number | null
          total_milestones?: number | null
          total_workforce?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_construction_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_cost_breakdown: {
        Row: {
          amount: number | null
          category: string
          created_at: string | null
          id: string
          percentage: number | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          category: string
          created_at?: string | null
          id?: string
          percentage?: number | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          category?: string
          created_at?: string | null
          id?: string
          percentage?: number | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_cost_breakdown_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_daily_progress: {
        Row: {
          actual: number | null
          created_at: string | null
          id: string
          planned: number | null
          progress_date: string
          project_id: string
          updated_at: string | null
          workforce: number | null
        }
        Insert: {
          actual?: number | null
          created_at?: string | null
          id?: string
          planned?: number | null
          progress_date: string
          project_id: string
          updated_at?: string | null
          workforce?: number | null
        }
        Update: {
          actual?: number | null
          created_at?: string | null
          id?: string
          planned?: number | null
          progress_date?: string
          project_id?: string
          updated_at?: string | null
          workforce?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_daily_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_design_metrics: {
        Row: {
          approved_drawings: number | null
          created_at: string | null
          design_changes: number | null
          design_progress: number | null
          id: string
          project_id: string
          revision_cycles: number | null
          stakeholder_approvals: number | null
          total_drawings: number | null
          updated_at: string | null
        }
        Insert: {
          approved_drawings?: number | null
          created_at?: string | null
          design_changes?: number | null
          design_progress?: number | null
          id?: string
          project_id: string
          revision_cycles?: number | null
          stakeholder_approvals?: number | null
          total_drawings?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_drawings?: number | null
          created_at?: string | null
          design_changes?: number | null
          design_progress?: number | null
          id?: string
          project_id?: string
          revision_cycles?: number | null
          stakeholder_approvals?: number | null
          total_drawings?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_design_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_executive_metrics: {
        Row: {
          created_at: string | null
          id: string
          market_position: number | null
          portfolio_value: number | null
          project_id: string
          risk_score: number | null
          stakeholders: number | null
          strategic_alignment: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          market_position?: number | null
          portfolio_value?: number | null
          project_id: string
          risk_score?: number | null
          stakeholders?: number | null
          strategic_alignment?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          market_position?: number | null
          portfolio_value?: number | null
          project_id?: string
          risk_score?: number | null
          stakeholders?: number | null
          strategic_alignment?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_executive_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_facilities_metrics: {
        Row: {
          created_at: string | null
          energy_performance: number | null
          id: string
          maintenance_planned: number | null
          occupancy_readiness: number | null
          operational_readiness: number | null
          project_id: string
          systems_commissioned: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          energy_performance?: number | null
          id?: string
          maintenance_planned?: number | null
          occupancy_readiness?: number | null
          operational_readiness?: number | null
          project_id: string
          systems_commissioned?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          energy_performance?: number | null
          id?: string
          maintenance_planned?: number | null
          occupancy_readiness?: number | null
          operational_readiness?: number | null
          project_id?: string
          systems_commissioned?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_facilities_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_financial_metrics: {
        Row: {
          contingency_remaining: number | null
          contingency_used: number | null
          cost_per_sqft: number | null
          created_at: string | null
          forecasted_cost: number | null
          id: string
          irr: number | null
          leasing_projections: number | null
          market_value: number | null
          npv: number | null
          project_id: string
          roi: number | null
          spent_to_date: number | null
          total_budget: number | null
          updated_at: string | null
        }
        Insert: {
          contingency_remaining?: number | null
          contingency_used?: number | null
          cost_per_sqft?: number | null
          created_at?: string | null
          forecasted_cost?: number | null
          id?: string
          irr?: number | null
          leasing_projections?: number | null
          market_value?: number | null
          npv?: number | null
          project_id: string
          roi?: number | null
          spent_to_date?: number | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Update: {
          contingency_remaining?: number | null
          contingency_used?: number | null
          cost_per_sqft?: number | null
          created_at?: string | null
          forecasted_cost?: number | null
          id?: string
          irr?: number | null
          leasing_projections?: number | null
          market_value?: number | null
          npv?: number | null
          project_id?: string
          roi?: number | null
          spent_to_date?: number | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_financial_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_insights: {
        Row: {
          alerts: string[] | null
          created_at: string | null
          id: string
          key_points: string[] | null
          project_id: string
          recommendations: string[] | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          alerts?: string[] | null
          created_at?: string | null
          id?: string
          key_points?: string[] | null
          project_id: string
          recommendations?: string[] | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          alerts?: string[] | null
          created_at?: string | null
          id?: string
          key_points?: string[] | null
          project_id?: string
          recommendations?: string[] | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_insights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_kpi_trends: {
        Row: {
          created_at: string | null
          efficiency: number | null
          id: string
          project_id: string
          quality: number | null
          safety: number | null
          updated_at: string | null
          week: string | null
        }
        Insert: {
          created_at?: string | null
          efficiency?: number | null
          id?: string
          project_id: string
          quality?: number | null
          safety?: number | null
          updated_at?: string | null
          week?: string | null
        }
        Update: {
          created_at?: string | null
          efficiency?: number | null
          id?: string
          project_id?: string
          quality?: number | null
          safety?: number | null
          updated_at?: string | null
          week?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_kpi_trends_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_kpis: {
        Row: {
          created_at: string
          efficiency_score: number | null
          id: string
          project_id: string | null
          quality_score: number | null
          safety_score: number | null
          updated_at: string
          week: string
        }
        Insert: {
          created_at?: string
          efficiency_score?: number | null
          id?: string
          project_id?: string | null
          quality_score?: number | null
          safety_score?: number | null
          updated_at?: string
          week: string
        }
        Update: {
          created_at?: string
          efficiency_score?: number | null
          id?: string
          project_id?: string | null
          quality_score?: number | null
          safety_score?: number | null
          updated_at?: string
          week?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_kpis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_legal_metrics: {
        Row: {
          compliance_score: number | null
          contracts_active: number | null
          contracts_pending: number | null
          created_at: string | null
          documentation_complete: number | null
          id: string
          legal_risks: number | null
          permit_status: string | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          compliance_score?: number | null
          contracts_active?: number | null
          contracts_pending?: number | null
          created_at?: string | null
          documentation_complete?: number | null
          id?: string
          legal_risks?: number | null
          permit_status?: string | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          compliance_score?: number | null
          contracts_active?: number | null
          contracts_pending?: number | null
          created_at?: string | null
          documentation_complete?: number | null
          id?: string
          legal_risks?: number | null
          permit_status?: string | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_legal_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_material_deliveries: {
        Row: {
          cost: number | null
          created_at: string | null
          delivery_date: string | null
          id: string
          material: string | null
          project_id: string
          quantity: string | null
          status: string | null
          supplier: string | null
          updated_at: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          material?: string | null
          project_id: string
          quantity?: string | null
          status?: string | null
          supplier?: string | null
          updated_at?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          material?: string | null
          project_id?: string
          quantity?: string | null
          status?: string | null
          supplier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_material_deliveries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_monthly_spend: {
        Row: {
          actual: number | null
          budget: number | null
          created_at: string | null
          forecast: number | null
          id: string
          month: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          actual?: number | null
          budget?: number | null
          created_at?: string | null
          forecast?: number | null
          id?: string
          month: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          actual?: number | null
          budget?: number | null
          created_at?: string | null
          forecast?: number | null
          id?: string
          month?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_monthly_spend_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_planning_metrics: {
        Row: {
          community_engagement: number | null
          created_at: string | null
          feasibility_complete: number | null
          id: string
          master_plan_approval: number | null
          project_id: string
          regulatory_approvals: number | null
          updated_at: string | null
          zoning_compliance: number | null
        }
        Insert: {
          community_engagement?: number | null
          created_at?: string | null
          feasibility_complete?: number | null
          id?: string
          master_plan_approval?: number | null
          project_id: string
          regulatory_approvals?: number | null
          updated_at?: string | null
          zoning_compliance?: number | null
        }
        Update: {
          community_engagement?: number | null
          created_at?: string | null
          feasibility_complete?: number | null
          id?: string
          master_plan_approval?: number | null
          project_id?: string
          regulatory_approvals?: number | null
          updated_at?: string | null
          zoning_compliance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_planning_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_preconstruction_metrics: {
        Row: {
          bidding_progress: number | null
          contractor_selection: number | null
          created_at: string | null
          design_development: number | null
          id: string
          permit_submissions: number | null
          project_id: string
          updated_at: string | null
          value_engineering: number | null
        }
        Insert: {
          bidding_progress?: number | null
          contractor_selection?: number | null
          created_at?: string | null
          design_development?: number | null
          id?: string
          permit_submissions?: number | null
          project_id: string
          updated_at?: string | null
          value_engineering?: number | null
        }
        Update: {
          bidding_progress?: number | null
          contractor_selection?: number | null
          created_at?: string | null
          design_development?: number | null
          id?: string
          permit_submissions?: number | null
          project_id?: string
          updated_at?: string | null
          value_engineering?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_preconstruction_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reference: {
        Row: {
          actual_completion_date: string | null
          client_contact_email: string | null
          client_contact_name: string | null
          client_contact_phone: string | null
          client_contact_title: string | null
          client_name: string
          company_id: string
          completed_on_budget: boolean | null
          completed_on_time: boolean | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          final_change_order_percentage: number | null
          id: string
          innovative_solutions: string | null
          lessons_learned: string | null
          notable_challenges: string | null
          project_description: string | null
          project_location: string | null
          project_name: string
          project_type: string | null
          project_value: number | null
          quality_rating: number | null
          reference_checked: boolean | null
          reference_checked_at: string | null
          reference_checked_by: string | null
          reference_rating: number | null
          reference_response: string | null
          safety_incidents: number | null
          trade_categories: string[] | null
          updated_at: string | null
        }
        Insert: {
          actual_completion_date?: string | null
          client_contact_email?: string | null
          client_contact_name?: string | null
          client_contact_phone?: string | null
          client_contact_title?: string | null
          client_name: string
          company_id: string
          completed_on_budget?: boolean | null
          completed_on_time?: boolean | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          final_change_order_percentage?: number | null
          id?: string
          innovative_solutions?: string | null
          lessons_learned?: string | null
          notable_challenges?: string | null
          project_description?: string | null
          project_location?: string | null
          project_name: string
          project_type?: string | null
          project_value?: number | null
          quality_rating?: number | null
          reference_checked?: boolean | null
          reference_checked_at?: string | null
          reference_checked_by?: string | null
          reference_rating?: number | null
          reference_response?: string | null
          safety_incidents?: number | null
          trade_categories?: string[] | null
          updated_at?: string | null
        }
        Update: {
          actual_completion_date?: string | null
          client_contact_email?: string | null
          client_contact_name?: string | null
          client_contact_phone?: string | null
          client_contact_title?: string | null
          client_name?: string
          company_id?: string
          completed_on_budget?: boolean | null
          completed_on_time?: boolean | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          final_change_order_percentage?: number | null
          id?: string
          innovative_solutions?: string | null
          lessons_learned?: string | null
          notable_challenges?: string | null
          project_description?: string | null
          project_location?: string | null
          project_name?: string
          project_type?: string | null
          project_value?: number | null
          quality_rating?: number | null
          reference_checked?: boolean | null
          reference_checked_at?: string | null
          reference_checked_by?: string | null
          reference_rating?: number | null
          reference_response?: string | null
          safety_incidents?: number | null
          trade_categories?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reference_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sustainability_metrics: {
        Row: {
          carbon_reduction: number | null
          certifications: string[] | null
          created_at: string | null
          current_score: number | null
          energy_efficiency: number | null
          id: string
          leed_target: string | null
          project_id: string
          sustainable_materials: number | null
          updated_at: string | null
        }
        Insert: {
          carbon_reduction?: number | null
          certifications?: string[] | null
          created_at?: string | null
          current_score?: number | null
          energy_efficiency?: number | null
          id?: string
          leed_target?: string | null
          project_id: string
          sustainable_materials?: number | null
          updated_at?: string | null
        }
        Update: {
          carbon_reduction?: number | null
          certifications?: string[] | null
          created_at?: string | null
          current_score?: number | null
          energy_efficiency?: number | null
          id?: string
          leed_target?: string | null
          project_id?: string
          sustainable_materials?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_sustainability_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team: {
        Row: {
          architect: string | null
          contractor: string | null
          created_at: string | null
          id: string
          owner: string | null
          project_id: string
          project_manager: string | null
          updated_at: string | null
        }
        Insert: {
          architect?: string | null
          contractor?: string | null
          created_at?: string | null
          id?: string
          owner?: string | null
          project_id: string
          project_manager?: string | null
          updated_at?: string | null
        }
        Update: {
          architect?: string | null
          contractor?: string | null
          created_at?: string | null
          id?: string
          owner?: string | null
          project_id?: string
          project_manager?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_timeline: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          phase: string | null
          progress: number | null
          project_id: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          phase?: string | null
          progress?: number | null
          project_id: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          phase?: string | null
          progress?: number | null
          project_id?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_timeline_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_transactions: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          project_id: string
          status: string | null
          transaction_date: string
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          project_id: string
          status?: string | null
          transaction_date: string
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          project_id?: string
          status?: string | null
          transaction_date?: string
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_transactions_project_id_fkey"
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
          estimated_completion: string | null
          external_id: string | null
          id: string
          market_position: number | null
          name: string
          owner_id: string | null
          procore_project_id: string | null
          risk_score: number | null
          source: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          strategic_alignment: number | null
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_completion?: string | null
          external_id?: string | null
          id?: string
          market_position?: number | null
          name: string
          owner_id?: string | null
          procore_project_id?: string | null
          risk_score?: number | null
          source?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          strategic_alignment?: number | null
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          estimated_completion?: string | null
          external_id?: string | null
          id?: string
          market_position?: number | null
          name?: string
          owner_id?: string | null
          procore_project_id?: string | null
          risk_score?: number | null
          source?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          strategic_alignment?: number | null
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      question: {
        Row: {
          answer: string | null
          answered_at: string | null
          body: string
          created_at: string | null
          id: string
          rfp_id: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          body: string
          created_at?: string | null
          id?: string
          rfp_id: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          body?: string
          created_at?: string | null
          id?: string
          rfp_id?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["rfp_id"]
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
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
          report_type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
          report_type?: string
          updated_at?: string | null
        }
        Relationships: [
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfp: {
        Row: {
          budget_cap: number | null
          compliance: Json | null
          contract_start: string | null
          created_at: string | null
          created_by: string
          facility_id: string | null
          id: string
          proposal_due: string | null
          release_date: string | null
          status: Database["public"]["Enums"]["rfp_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_cap?: number | null
          compliance?: Json | null
          contract_start?: string | null
          created_at?: string | null
          created_by: string
          facility_id?: string | null
          id?: string
          proposal_due?: string | null
          release_date?: string | null
          status?: Database["public"]["Enums"]["rfp_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_cap?: number | null
          compliance?: Json | null
          contract_start?: string | null
          created_at?: string | null
          created_by?: string
          facility_id?: string | null
          id?: string
          proposal_due?: string | null
          release_date?: string | null
          status?: Database["public"]["Enums"]["rfp_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfp_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfp_clause_library: {
        Row: {
          category: string
          compliance_flags: string[] | null
          content: string
          created_at: string | null
          csi_division: string | null
          embedding: string | null
          id: string
          last_updated: string | null
          subcategory: string | null
          template_source: string | null
          title: string
          usage_frequency: number | null
        }
        Insert: {
          category: string
          compliance_flags?: string[] | null
          content: string
          created_at?: string | null
          csi_division?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          subcategory?: string | null
          template_source?: string | null
          title: string
          usage_frequency?: number | null
        }
        Update: {
          category?: string
          compliance_flags?: string[] | null
          content?: string
          created_at?: string | null
          csi_division?: string | null
          embedding?: string | null
          id?: string
          last_updated?: string | null
          subcategory?: string | null
          template_source?: string | null
          title?: string
          usage_frequency?: number | null
        }
        Relationships: []
      }
      rfp_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          event_id: string | null
          id: string
          message: string
          priority: string
          project_id: string | null
          read: boolean | null
          recipient_id: string | null
          timestamp: string | null
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          message: string
          priority: string
          project_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
          timestamp?: string | null
          title: string
          type: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          message?: string
          priority?: string
          project_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
          timestamp?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfp_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "rfp_timeline_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfp_notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "rfp_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfp_projects: {
        Row: {
          bid_type: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          estimated_value: number | null
          id: string
          org_id: string | null
          owner_id: string | null
          settings: Json | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          bid_type?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          estimated_value?: number | null
          id?: string
          org_id?: string | null
          owner_id?: string | null
          settings?: Json | null
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          bid_type?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          estimated_value?: number | null
          id?: string
          org_id?: string | null
          owner_id?: string | null
          settings?: Json | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfp_projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rfp_scopes: {
        Row: {
          ai_assisted: boolean | null
          attachments: Json | null
          comments: Json | null
          created_at: string | null
          csi_code: string | null
          description: string | null
          id: string
          project_id: string | null
          requirements: Json | null
          reviewers: string[] | null
          specifications: Json | null
          status: string
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          ai_assisted?: boolean | null
          attachments?: Json | null
          comments?: Json | null
          created_at?: string | null
          csi_code?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          requirements?: Json | null
          reviewers?: string[] | null
          specifications?: Json | null
          status: string
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          ai_assisted?: boolean | null
          attachments?: Json | null
          comments?: Json | null
          created_at?: string | null
          csi_code?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          requirements?: Json | null
          reviewers?: string[] | null
          specifications?: Json | null
          status?: string
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rfp_scopes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "rfp_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfp_team_members: {
        Row: {
          created_at: string | null
          id: string
          last_active: string | null
          permissions: string[] | null
          project_id: string | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_active?: string | null
          permissions?: string[] | null
          project_id?: string | null
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_active?: string | null
          permissions?: string[] | null
          project_id?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfp_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "rfp_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfp_timeline_events: {
        Row: {
          assignee_id: string | null
          completion_percentage: number | null
          created_at: string | null
          critical_path: boolean | null
          date: string
          dependencies: string[] | null
          description: string | null
          duration: number | null
          id: string
          notifications: Json | null
          project_id: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          critical_path?: boolean | null
          date: string
          dependencies?: string[] | null
          description?: string | null
          duration?: number | null
          id?: string
          notifications?: Json | null
          project_id?: string | null
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          critical_path?: boolean | null
          date?: string
          dependencies?: string[] | null
          description?: string | null
          duration?: number | null
          id?: string
          notifications?: Json | null
          project_id?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfp_timeline_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "rfp_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_analysis: {
        Row: {
          attachments: Json | null
          bid_id: string
          created_at: string | null
          id: string
          identified_at: string
          identified_by: string
          impact: number
          likelihood: number
          mitigation_deadline: string | null
          mitigation_owner: string | null
          mitigation_status:
            | Database["public"]["Enums"]["mitigation_status"]
            | null
          mitigation_strategy: string
          notes: string | null
          related_risks: string[] | null
          review_date: string | null
          reviewed_by: string | null
          risk_category: Database["public"]["Enums"]["risk_category"]
          risk_description: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score: number | null
          submission_id: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          bid_id: string
          created_at?: string | null
          id?: string
          identified_at: string
          identified_by: string
          impact: number
          likelihood: number
          mitigation_deadline?: string | null
          mitigation_owner?: string | null
          mitigation_status?:
            | Database["public"]["Enums"]["mitigation_status"]
            | null
          mitigation_strategy: string
          notes?: string | null
          related_risks?: string[] | null
          review_date?: string | null
          reviewed_by?: string | null
          risk_category: Database["public"]["Enums"]["risk_category"]
          risk_description: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score?: number | null
          submission_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          bid_id?: string
          created_at?: string | null
          id?: string
          identified_at?: string
          identified_by?: string
          impact?: number
          likelihood?: number
          mitigation_deadline?: string | null
          mitigation_owner?: string | null
          mitigation_status?:
            | Database["public"]["Enums"]["mitigation_status"]
            | null
          mitigation_strategy?: string
          notes?: string | null
          related_risks?: string[] | null
          review_date?: string | null
          reviewed_by?: string | null
          risk_category?: Database["public"]["Enums"]["risk_category"]
          risk_description?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_score?: number | null
          submission_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_analysis_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_analysis_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_incidents: {
        Row: {
          corrective_action: string
          created_at: string
          description: string
          id: string
          incident_date: string
          incident_type: string
          project_id: string
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          corrective_action: string
          created_at?: string
          description: string
          id?: string
          incident_date: string
          incident_type: string
          project_id: string
          severity: string
          status: string
          updated_at?: string
        }
        Update: {
          corrective_action?: string
          created_at?: string
          description?: string
          id?: string
          incident_date?: string
          incident_type?: string
          project_id?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_metric: {
        Row: {
          certified_safety_personnel: number | null
          company_id: string
          created_at: string | null
          dart_rate: number | null
          emr: number | null
          first_aid_cases: number | null
          id: string
          ltir: number | null
          near_misses: number | null
          number_of_employees: number | null
          number_of_projects: number | null
          osha_incidents: number | null
          period_quarter: number | null
          period_year: number
          safety_certifications: string[] | null
          safety_training_hours: number | null
          source: string | null
          total_work_hours: number | null
          trir: number | null
          updated_at: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          certified_safety_personnel?: number | null
          company_id: string
          created_at?: string | null
          dart_rate?: number | null
          emr?: number | null
          first_aid_cases?: number | null
          id?: string
          ltir?: number | null
          near_misses?: number | null
          number_of_employees?: number | null
          number_of_projects?: number | null
          osha_incidents?: number | null
          period_quarter?: number | null
          period_year: number
          safety_certifications?: string[] | null
          safety_training_hours?: number | null
          source?: string | null
          total_work_hours?: number | null
          trir?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          certified_safety_personnel?: number | null
          company_id?: string
          created_at?: string | null
          dart_rate?: number | null
          emr?: number | null
          first_aid_cases?: number | null
          id?: string
          ltir?: number | null
          near_misses?: number | null
          number_of_employees?: number | null
          number_of_projects?: number | null
          osha_incidents?: number | null
          period_quarter?: number | null
          period_year?: number
          safety_certifications?: string[] | null
          safety_training_hours?: number | null
          source?: string | null
          total_work_hours?: number | null
          trir?: number | null
          updated_at?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_metric_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_metrics: {
        Row: {
          active_safety_programs: number
          compliance_score: number
          corrective_actions: number
          created_at: string
          id: string
          last_incident_date: string | null
          monthly_inspections: number
          near_misses: number
          osha_rating: string
          project_id: string
          recordable_days: number
          safety_training_hours: number
          total_incidents: number
          updated_at: string
        }
        Insert: {
          active_safety_programs: number
          compliance_score: number
          corrective_actions: number
          created_at?: string
          id?: string
          last_incident_date?: string | null
          monthly_inspections: number
          near_misses: number
          osha_rating: string
          project_id: string
          recordable_days: number
          safety_training_hours: number
          total_incidents: number
          updated_at?: string
        }
        Update: {
          active_safety_programs?: number
          compliance_score?: number
          corrective_actions?: number
          created_at?: string
          id?: string
          last_incident_date?: string | null
          monthly_inspections?: number
          near_misses?: number
          osha_rating?: string
          project_id?: string
          recordable_days?: number
          safety_training_hours?: number
          total_incidents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_training: {
        Row: {
          completed_count: number
          created_at: string
          deadline: string
          id: string
          program_name: string
          project_id: string
          required_count: number
          updated_at: string
        }
        Insert: {
          completed_count: number
          created_at?: string
          deadline: string
          id?: string
          program_name: string
          project_id: string
          required_count: number
          updated_at?: string
        }
        Update: {
          completed_count?: number
          created_at?: string
          deadline?: string
          id?: string
          program_name?: string
          project_id?: string
          required_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_training_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      scope_item: {
        Row: {
          created_at: string | null
          csi_code: string | null
          description: string
          id: string
          rfp_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          csi_code?: string | null
          description: string
          id?: string
          rfp_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          csi_code?: string | null
          description?: string
          id?: string
          rfp_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scope_item_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scope_item_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["rfp_id"]
          },
        ]
      }
      scorecards: {
        Row: {
          bid_id: string
          commercial_max_possible: number | null
          commercial_percentage: number | null
          commercial_scores: Json | null
          commercial_total: number | null
          composite_score: number | null
          created_at: string | null
          evaluation_phase: Database["public"]["Enums"]["evaluation_phase"]
          evaluator_id: string
          id: string
          is_complete: boolean | null
          recommendations: string | null
          strengths: string | null
          submission_id: string
          submitted_at: string | null
          technical_max_possible: number | null
          technical_percentage: number | null
          technical_scores: Json | null
          technical_total: number | null
          updated_at: string | null
          weaknesses: string | null
          weighted_commercial_score: number | null
          weighted_technical_score: number | null
        }
        Insert: {
          bid_id: string
          commercial_max_possible?: number | null
          commercial_percentage?: number | null
          commercial_scores?: Json | null
          commercial_total?: number | null
          composite_score?: number | null
          created_at?: string | null
          evaluation_phase: Database["public"]["Enums"]["evaluation_phase"]
          evaluator_id: string
          id?: string
          is_complete?: boolean | null
          recommendations?: string | null
          strengths?: string | null
          submission_id: string
          submitted_at?: string | null
          technical_max_possible?: number | null
          technical_percentage?: number | null
          technical_scores?: Json | null
          technical_total?: number | null
          updated_at?: string | null
          weaknesses?: string | null
          weighted_commercial_score?: number | null
          weighted_technical_score?: number | null
        }
        Update: {
          bid_id?: string
          commercial_max_possible?: number | null
          commercial_percentage?: number | null
          commercial_scores?: Json | null
          commercial_total?: number | null
          composite_score?: number | null
          created_at?: string | null
          evaluation_phase?: Database["public"]["Enums"]["evaluation_phase"]
          evaluator_id?: string
          id?: string
          is_complete?: boolean | null
          recommendations?: string | null
          strengths?: string | null
          submission_id?: string
          submitted_at?: string | null
          technical_max_possible?: number | null
          technical_percentage?: number | null
          technical_scores?: Json | null
          technical_total?: number | null
          updated_at?: string | null
          weaknesses?: string | null
          weighted_commercial_score?: number | null
          weighted_technical_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scorecards_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorecards_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          base_price: number | null
          bid_id: string
          bond_submitted: boolean | null
          commercial_proposal_url: string | null
          contingency_amount: number | null
          created_at: string | null
          id: string
          insurance_submitted: boolean | null
          opened_at: string | null
          opened_by: string | null
          prequalification_passed: boolean | null
          price_sealed: boolean | null
          received_by: string | null
          status: Database["public"]["Enums"]["submission_status"] | null
          submitted_at: string | null
          technical_proposal_url: string | null
          total_price: number | null
          updated_at: string | null
          vendor_contact_email: string | null
          vendor_contact_phone: string | null
          vendor_id: string
          vendor_name: string
        }
        Insert: {
          base_price?: number | null
          bid_id: string
          bond_submitted?: boolean | null
          commercial_proposal_url?: string | null
          contingency_amount?: number | null
          created_at?: string | null
          id?: string
          insurance_submitted?: boolean | null
          opened_at?: string | null
          opened_by?: string | null
          prequalification_passed?: boolean | null
          price_sealed?: boolean | null
          received_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_at?: string | null
          technical_proposal_url?: string | null
          total_price?: number | null
          updated_at?: string | null
          vendor_contact_email?: string | null
          vendor_contact_phone?: string | null
          vendor_id: string
          vendor_name: string
        }
        Update: {
          base_price?: number | null
          bid_id?: string
          bond_submitted?: boolean | null
          commercial_proposal_url?: string | null
          contingency_amount?: number | null
          created_at?: string | null
          id?: string
          insurance_submitted?: boolean | null
          opened_at?: string | null
          opened_by?: string | null
          prequalification_passed?: boolean | null
          price_sealed?: boolean | null
          received_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_at?: string | null
          technical_proposal_url?: string | null
          total_price?: number | null
          updated_at?: string | null
          vendor_contact_email?: string | null
          vendor_contact_phone?: string | null
          vendor_id?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_event: {
        Row: {
          created_at: string | null
          deadline: string
          id: string
          mandatory: boolean | null
          name: string
          rfp_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline: string
          id?: string
          mandatory?: boolean | null
          name: string
          rfp_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string
          id?: string
          mandatory?: boolean | null
          name?: string
          rfp_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_event_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_event_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["rfp_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
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
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_bid_submissions: {
        Row: {
          bid_bond_amount: number | null
          bid_project_id: string | null
          clarifications_requested: number | null
          compliance_notes: string | null
          compliance_status: string | null
          created_at: string | null
          exceptions_taken: number | null
          id: string
          performance_bond_rate: number | null
          submission_date: string
          submitted_documents: Json | null
          total_alternates: number | null
          total_base_bid: number
          total_bid_amount: number
          unit_price_schedule: boolean | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          bid_bond_amount?: number | null
          bid_project_id?: string | null
          clarifications_requested?: number | null
          compliance_notes?: string | null
          compliance_status?: string | null
          created_at?: string | null
          exceptions_taken?: number | null
          id?: string
          performance_bond_rate?: number | null
          submission_date: string
          submitted_documents?: Json | null
          total_alternates?: number | null
          total_base_bid: number
          total_bid_amount: number
          unit_price_schedule?: boolean | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          bid_bond_amount?: number | null
          bid_project_id?: string | null
          clarifications_requested?: number | null
          compliance_notes?: string | null
          compliance_status?: string | null
          created_at?: string | null
          exceptions_taken?: number | null
          id?: string
          performance_bond_rate?: number | null
          submission_date?: string
          submitted_documents?: Json | null
          total_alternates?: number | null
          total_base_bid?: number
          total_bid_amount?: number
          unit_price_schedule?: boolean | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bid_submissions_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "bid_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_bid_submissions_bid_project_id_fkey"
            columns: ["bid_project_id"]
            isOneToOne: false
            referencedRelation: "project_bid_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_bid_submissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "bid_vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_bid_submissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_evaluations: {
        Row: {
          commercial_criteria: Json | null
          commercial_score: number | null
          compliance_items: Json | null
          compliance_score: number | null
          composite_score: number | null
          created_at: string | null
          evaluation_date: string | null
          evaluator_id: string | null
          evaluator_notes: string | null
          id: string
          ranking: number | null
          recommendation: string | null
          technical_criteria: Json | null
          technical_score: number | null
          updated_at: string | null
          vendor_submission_id: string | null
        }
        Insert: {
          commercial_criteria?: Json | null
          commercial_score?: number | null
          compliance_items?: Json | null
          compliance_score?: number | null
          composite_score?: number | null
          created_at?: string | null
          evaluation_date?: string | null
          evaluator_id?: string | null
          evaluator_notes?: string | null
          id?: string
          ranking?: number | null
          recommendation?: string | null
          technical_criteria?: Json | null
          technical_score?: number | null
          updated_at?: string | null
          vendor_submission_id?: string | null
        }
        Update: {
          commercial_criteria?: Json | null
          commercial_score?: number | null
          compliance_items?: Json | null
          compliance_score?: number | null
          composite_score?: number | null
          created_at?: string | null
          evaluation_date?: string | null
          evaluator_id?: string | null
          evaluator_notes?: string | null
          id?: string
          ranking?: number | null
          recommendation?: string | null
          technical_criteria?: Json | null
          technical_score?: number | null
          updated_at?: string | null
          vendor_submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_evaluations_vendor_submission_id_fkey"
            columns: ["vendor_submission_id"]
            isOneToOne: false
            referencedRelation: "vendor_bid_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_line_item_bids: {
        Row: {
          clarification_requested: string | null
          created_at: string | null
          id: string
          is_allowance: boolean | null
          is_alternate: boolean | null
          is_no_bid: boolean | null
          line_item_id: string | null
          total_price: number
          unit_price: number
          vendor_notes: string | null
          vendor_submission_id: string | null
        }
        Insert: {
          clarification_requested?: string | null
          created_at?: string | null
          id?: string
          is_allowance?: boolean | null
          is_alternate?: boolean | null
          is_no_bid?: boolean | null
          line_item_id?: string | null
          total_price: number
          unit_price: number
          vendor_notes?: string | null
          vendor_submission_id?: string | null
        }
        Update: {
          clarification_requested?: string | null
          created_at?: string | null
          id?: string
          is_allowance?: boolean | null
          is_alternate?: boolean | null
          is_no_bid?: boolean | null
          line_item_id?: string | null
          total_price?: number
          unit_price?: number
          vendor_notes?: string | null
          vendor_submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_line_item_bids_line_item_id_fkey"
            columns: ["line_item_id"]
            isOneToOne: false
            referencedRelation: "bid_line_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_line_item_bids_vendor_submission_id_fkey"
            columns: ["vendor_submission_id"]
            isOneToOne: false
            referencedRelation: "vendor_bid_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_submission: {
        Row: {
          commercial_document_key: string | null
          commercial_document_sealed: boolean | null
          commercial_opened_at: string | null
          commercial_uploaded_at: string | null
          composite_score: number | null
          cost_score: number | null
          created_at: string | null
          id: string
          received_at: string | null
          rfp_id: string
          sealed: boolean | null
          status: Database["public"]["Enums"]["vendor_submission_status"] | null
          tech_score: number | null
          technical_document_key: string | null
          technical_document_sealed: boolean | null
          technical_opened_at: string | null
          technical_uploaded_at: string | null
          updated_at: string | null
          upload_metadata: Json | null
          vendor_id: string
        }
        Insert: {
          commercial_document_key?: string | null
          commercial_document_sealed?: boolean | null
          commercial_opened_at?: string | null
          commercial_uploaded_at?: string | null
          composite_score?: number | null
          cost_score?: number | null
          created_at?: string | null
          id?: string
          received_at?: string | null
          rfp_id: string
          sealed?: boolean | null
          status?:
            | Database["public"]["Enums"]["vendor_submission_status"]
            | null
          tech_score?: number | null
          technical_document_key?: string | null
          technical_document_sealed?: boolean | null
          technical_opened_at?: string | null
          technical_uploaded_at?: string | null
          updated_at?: string | null
          upload_metadata?: Json | null
          vendor_id: string
        }
        Update: {
          commercial_document_key?: string | null
          commercial_document_sealed?: boolean | null
          commercial_opened_at?: string | null
          commercial_uploaded_at?: string | null
          composite_score?: number | null
          cost_score?: number | null
          created_at?: string | null
          id?: string
          received_at?: string | null
          rfp_id?: string
          sealed?: boolean | null
          status?:
            | Database["public"]["Enums"]["vendor_submission_status"]
            | null
          tech_score?: number | null
          technical_document_key?: string | null
          technical_document_sealed?: boolean | null
          technical_opened_at?: string | null
          technical_uploaded_at?: string | null
          updated_at?: string | null
          upload_metadata?: Json | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_submission_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_submission_rfp_id_fkey"
            columns: ["rfp_id"]
            isOneToOne: false
            referencedRelation: "rfp_submission_status"
            referencedColumns: ["rfp_id"]
          },
        ]
      }
    }
    Views: {
      crm_company_overview: {
        Row: {
          address: string | null
          annual_revenue: number | null
          bonding_capacity: number | null
          certifications: string[] | null
          city: string | null
          completed_tasks: number | null
          contact_count: number | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          custom_fields: Json | null
          diversity_flags: Json | null
          duns_number: string | null
          employees: number | null
          id: string | null
          industry: string | null
          insurance_expiry: string | null
          is_preferred: boolean | null
          last_interaction_date: string | null
          license_expiry: string | null
          license_number: string | null
          naics_code: string | null
          name: string | null
          opportunity_count: number | null
          parent_company_id: string | null
          payment_terms: string | null
          phone: string | null
          procore_company_id: string | null
          risk_score: number | null
          sic_code: string | null
          source: string | null
          state: string | null
          status: Database["public"]["Enums"]["company_status"] | null
          tags: string[] | null
          task_count: number | null
          tax_id: string | null
          total_opportunity_value: number | null
          trade_codes: string[] | null
          type: Database["public"]["Enums"]["company_type"] | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_opportunity_pipeline: {
        Row: {
          actual_close_date: string | null
          budget_confirmed: boolean | null
          campaign_id: string | null
          communication_count: number | null
          company_id: string | null
          company_name: string | null
          company_type: Database["public"]["Enums"]["company_type"] | null
          competitors: string[] | null
          created_at: string | null
          custom_fields: Json | null
          decision_criteria: string[] | null
          decision_makers: Json | null
          description: string | null
          est_value: number | null
          expected_close_date: string | null
          id: string | null
          is_won: boolean | null
          last_activity_date: string | null
          last_communication_date: string | null
          lead_source: string | null
          lost_reason: string | null
          name: string | null
          next_action_date: string | null
          next_steps: string | null
          notes: string | null
          owner_id: string | null
          probability: number | null
          project_type: string | null
          proposal_sent_date: string | null
          rfp_id: string | null
          risk_score: number | null
          stage: Database["public"]["Enums"]["opportunity_stage"] | null
          strengths: string | null
          tags: string[] | null
          task_count: number | null
          updated_at: string | null
          weaknesses: string | null
          won_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "crm_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_company_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      prequal_summary: {
        Row: {
          company_id: string | null
          company_name: string | null
          documents_uploaded: number | null
          expiry_date: string | null
          expiry_status: string | null
          id: string | null
          insurance_certificates_count: number | null
          litigation_cases_count: number | null
          project_references_count: number | null
          reviewed_at: string | null
          safety_metrics_count: number | null
          score: number | null
          status: Database["public"]["Enums"]["prequal_status"] | null
          submitted_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prequal_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_bid_summary: {
        Row: {
          average_bid: number | null
          highest_bid: number | null
          id: string | null
          line_item_count: number | null
          lowest_bid: number | null
          project_name: string | null
          rfp_id: string | null
          status: string | null
          total_bid_value: number | null
          total_budget: number | null
          vendor_count: number | null
        }
        Relationships: []
      }
      rfp_submission_status: {
        Row: {
          commercial_file_name: string | null
          commercial_opened_at: string | null
          commercial_sealed: boolean | null
          commercial_submission_id: string | null
          commercial_uploaded_at: string | null
          deadline_passed: boolean | null
          overall_status: string | null
          proposal_due: string | null
          rfp_id: string | null
          rfp_title: string | null
          technical_file_name: string | null
          technical_opened_at: string | null
          technical_sealed: boolean | null
          technical_submission_id: string | null
          technical_uploaded_at: string | null
          vendor_id: string | null
          vendor_submission_id: string | null
        }
        Relationships: []
      }
      vendor_summary: {
        Row: {
          avg_composite_score: number | null
          company_type: string | null
          id: string | null
          name: string | null
          prequalification_status: string | null
          projects_bid: number | null
          total_bid_value: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_base_bid_total: {
        Args: { p_submission_id: string; p_file_id: string }
        Returns: number
      }
      calculate_lead_time_status: {
        Args: {
          p_actual_delivery_date?: string
          p_delivery_est: string
          p_award_due: string
        }
        Returns: string
      }
      calculate_opportunity_score: {
        Args: { opp_id: string }
        Returns: number
      }
      calculate_performance_score: {
        Args: { p_company_id: string; p_period?: string }
        Returns: number
      }
      calculate_prequal_score: {
        Args: { prequal_id_param: string }
        Returns: number
      }
      cleanup_old_events: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_leveling_snapshots: {
        Args: { p_bid_id: string }
        Returns: number
      }
      create_award_package: {
        Args: {
          p_bid_id: string
          p_winning_submission_id: string
          p_contract_value: number
          p_selection_rationale?: Json
          p_price_basis?: Json
          p_funding_source?: Json
        }
        Returns: string
      }
      generate_bid_s3_key: {
        Args: {
          p_rfp_id: string
          p_vendor_id: string
          p_submission_type: string
          p_file_name: string
        }
        Returns: string
      }
      generate_crm_analytics: {
        Args: { p_date: string; p_type: string }
        Returns: undefined
      }
      get_award_memo_data: {
        Args: { p_bid_id: string }
        Returns: Json
      }
      get_company_events: {
        Args: { p_company_id: string; p_limit?: number }
        Returns: {
          id: string
          type: string
          period: string
          metadata: Json
          event_timestamp: string
        }[]
      }
      get_extraction_summary: {
        Args: { p_submission_id: string; p_file_id: string }
        Returns: Json
      }
      get_latest_leveling_snapshot: {
        Args: { p_bid_id: string }
        Returns: {
          snapshot_id: string
          analysis_date: string
          matrix_data: Json
          summary_stats: Json
          outlier_summary: Json
          total_submissions: number
          total_line_items: number
        }[]
      }
      get_latest_performance_summary: {
        Args: { p_company_id: string }
        Returns: {
          period: string
          summary: string
          overall_score: number
          generated_at: string
        }[]
      }
      get_lead_time_summary: {
        Args: { p_rfp_id?: string }
        Returns: {
          total_items: number
          pending_items: number
          ontrack_items: number
          late_items: number
          delivered_items: number
          avg_lead_days: number
          critical_items: number
          total_value: number
        }[]
      }
      get_risk_matrix_summary: {
        Args: { p_bid_id: string }
        Returns: {
          total_risks: number
          critical_risks: number
          high_risks: number
          medium_risks: number
          low_risks: number
          avg_risk_score: number
          mitigation_coverage: number
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
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
      increment_clause_usage: {
        Args: { clause_id: string }
        Returns: undefined
      }
      is_proposal_deadline_passed: {
        Args: { p_rfp_id: string }
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
        Returns: string
      }
      log_bid_event: {
        Args: {
          p_bid_id: string
          p_event_type: string
          p_description: string
          p_submission_id?: string
          p_event_data?: Json
        }
        Returns: string
      }
      log_submission_access: {
        Args: {
          p_submission_id: string
          p_action: string
          p_user_id?: string
          p_metadata?: Json
        }
        Returns: undefined
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
          doc_id: string
          image_id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      publish_leveling_completed_event: {
        Args: { p_bid_id: string; p_snapshot_id: string }
        Returns: undefined
      }
      search_rfp_clauses: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          content: string
          id: string
          title: string
          category: string
          subcategory: string
          template_source: string
          csi_division: string
          compliance_flags: string[]
          similarity: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
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
      update_award_memo: {
        Args: {
          p_award_package_id: string
          p_memo_content: string
          p_memo_url: string
        }
        Returns: boolean
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
      activity_type:
        | "created"
        | "updated"
        | "deleted"
        | "viewed"
        | "shared"
        | "commented"
        | "status_changed"
      award_status: "pending" | "awarded" | "declined" | "cancelled"
      bid_status:
        | "draft"
        | "open"
        | "evaluation"
        | "leveling_complete"
        | "bafo_requested"
        | "awarded"
        | "cancelled"
      communication_status:
        | "draft"
        | "sent"
        | "delivered"
        | "read"
        | "completed"
        | "failed"
      communication_type:
        | "email"
        | "phone"
        | "meeting"
        | "note"
        | "sms"
        | "chat"
      company_status: "active" | "inactive"
      company_type: "sub" | "gc" | "supplier" | "a/e"
      document_type:
        | "drawing"
        | "specification"
        | "report"
        | "photo"
        | "contract"
        | "other"
        | "proposal"
        | "invoice"
        | "presentation"
      evaluation_phase: "technical" | "commercial" | "combined"
      insurance_type:
        | "general_liability"
        | "professional_liability"
        | "workers_comp"
        | "auto_liability"
        | "umbrella"
        | "cyber_liability"
      interaction_type: "call" | "email" | "meeting"
      litigation_status: "active" | "settled" | "dismissed" | "pending"
      mitigation_status:
        | "not_started"
        | "in_progress"
        | "implemented"
        | "monitoring"
      opportunity_stage:
        | "prospect"
        | "shortlisted"
        | "invited"
        | "negotiation"
        | "closed"
      prequal_status: "pending" | "approved" | "expired" | "denied"
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled"
      rfi_status: "open" | "pending_response" | "responded" | "closed"
      rfp_status: "draft" | "published" | "closed" | "awarded"
      risk_category:
        | "financial"
        | "technical"
        | "legal"
        | "operational"
        | "reputational"
      risk_level: "low" | "medium" | "high" | "critical"
      submission_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "scored"
        | "shortlisted"
        | "rejected"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "blocked"
        | "todo"
        | "review"
        | "done"
        | "cancelled"
      vendor_submission_status: "pending" | "opened" | "scored" | "bafo"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_type: [
        "created",
        "updated",
        "deleted",
        "viewed",
        "shared",
        "commented",
        "status_changed",
      ],
      award_status: ["pending", "awarded", "declined", "cancelled"],
      bid_status: [
        "draft",
        "open",
        "evaluation",
        "leveling_complete",
        "bafo_requested",
        "awarded",
        "cancelled",
      ],
      communication_status: [
        "draft",
        "sent",
        "delivered",
        "read",
        "completed",
        "failed",
      ],
      communication_type: ["email", "phone", "meeting", "note", "sms", "chat"],
      company_status: ["active", "inactive"],
      company_type: ["sub", "gc", "supplier", "a/e"],
      document_type: [
        "drawing",
        "specification",
        "report",
        "photo",
        "contract",
        "other",
        "proposal",
        "invoice",
        "presentation",
      ],
      evaluation_phase: ["technical", "commercial", "combined"],
      insurance_type: [
        "general_liability",
        "professional_liability",
        "workers_comp",
        "auto_liability",
        "umbrella",
        "cyber_liability",
      ],
      interaction_type: ["call", "email", "meeting"],
      litigation_status: ["active", "settled", "dismissed", "pending"],
      mitigation_status: [
        "not_started",
        "in_progress",
        "implemented",
        "monitoring",
      ],
      opportunity_stage: [
        "prospect",
        "shortlisted",
        "invited",
        "negotiation",
        "closed",
      ],
      prequal_status: ["pending", "approved", "expired", "denied"],
      project_status: [
        "planning",
        "active",
        "on_hold",
        "completed",
        "cancelled",
      ],
      rfi_status: ["open", "pending_response", "responded", "closed"],
      rfp_status: ["draft", "published", "closed", "awarded"],
      risk_category: [
        "financial",
        "technical",
        "legal",
        "operational",
        "reputational",
      ],
      risk_level: ["low", "medium", "high", "critical"],
      submission_status: [
        "draft",
        "submitted",
        "under_review",
        "scored",
        "shortlisted",
        "rejected",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: [
        "not_started",
        "in_progress",
        "completed",
        "blocked",
        "todo",
        "review",
        "done",
        "cancelled",
      ],
      vendor_submission_status: ["pending", "opened", "scored", "bafo"],
    },
  },
} as const

