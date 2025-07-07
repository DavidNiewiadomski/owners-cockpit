

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";






CREATE TYPE "public"."app_role" AS ENUM (
    'admin',
    'gc',
    'vendor',
    'viewer'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."document_type" AS ENUM (
    'drawing',
    'specification',
    'report',
    'photo',
    'contract',
    'other'
);


ALTER TYPE "public"."document_type" OWNER TO "postgres";


CREATE TYPE "public"."project_status" AS ENUM (
    'planning',
    'active',
    'on_hold',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."project_status" OWNER TO "postgres";


CREATE TYPE "public"."rfi_status" AS ENUM (
    'open',
    'pending_response',
    'responded',
    'closed'
);


ALTER TYPE "public"."rfi_status" OWNER TO "postgres";


CREATE TYPE "public"."task_status" AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'blocked'
);


ALTER TYPE "public"."task_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    default_org_id UUID;
BEGIN
    -- Get or create default organization
    SELECT id INTO default_org_id FROM organizations WHERE name = 'Default Organization' LIMIT 1;
    
    IF default_org_id IS NULL THEN
        INSERT INTO organizations (name) VALUES ('Default Organization') RETURNING id INTO default_org_id;
    END IF;
    
    -- Add user to default organization
    INSERT INTO org_members (user_id, org_id, role)
    VALUES (NEW.id, default_org_id, 'member')
    ON CONFLICT (user_id, org_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_admin_access"("_user_id" "uuid", "_project_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND project_id = _project_id
      AND role IN ('admin', 'gc')
  )
$$;


ALTER FUNCTION "public"."has_admin_access"("_user_id" "uuid", "_project_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_project_access"("project_uuid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_projects up
    WHERE up.user_id = auth.uid() AND up.project_id = project_uuid
  );
$$;


ALTER FUNCTION "public"."has_project_access"("project_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_role"("_user_id" "uuid", "_project_id" "uuid", "_role" "public"."app_role") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND project_id = _project_id
      AND role = _role
  )
$$;


ALTER FUNCTION "public"."has_role"("_user_id" "uuid", "_project_id" "uuid", "_role" "public"."app_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_org_member"("org_uuid" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_members om
    WHERE om.user_id = auth.uid() AND om.org_id = org_uuid
  );
$$;


ALTER FUNCTION "public"."is_org_member"("org_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer DEFAULT 5, "filter_project_id" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("chunk_id" "uuid", "project_id" "uuid", "content" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    vector_index.chunk_id,
    vector_index.project_id,
    vector_index.content,
    (vector_index.embedding <=> query_embedding) * -1 + 1 AS similarity
  FROM vector_index
  WHERE (filter_project_id IS NULL OR vector_index.project_id = filter_project_id)
  ORDER BY vector_index.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."portfolio_metrics"("user_uuid" "uuid") RETURNS TABLE("total_portfolio_value" numeric, "avg_budget_utilization" numeric, "avg_schedule_slip" numeric, "total_projects" integer, "active_projects" integer, "top_risks" "jsonb", "project_metrics" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  accessible_projects uuid[];
BEGIN
  -- Get projects accessible to the user
  SELECT ARRAY_AGG(up.project_id) INTO accessible_projects
  FROM user_projects up
  WHERE up.user_id = user_uuid;
  
  -- If no accessible projects, return empty metrics
  IF accessible_projects IS NULL THEN
    RETURN QUERY SELECT 
      0::numeric, 0::numeric, 0::numeric, 0::integer, 0::integer, 
      '[]'::jsonb, '[]'::jsonb;
    RETURN;
  END IF;

  RETURN QUERY
  WITH portfolio_summary AS (
    SELECT 
      SUM(ph.total_budget) as total_value,
      AVG(ph.budget_utilization_pct) as avg_budget_util,
      AVG(ph.schedule_slip_pct) as avg_schedule_slip,
      COUNT(*) as total_proj,
      COUNT(CASE WHEN ph.status IN ('active', 'in_progress') THEN 1 END) as active_proj
    FROM portfolio_health ph
    WHERE ph.project_id = ANY(accessible_projects)
  ),
  risk_summary AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'project_name', p.name,
        'risk_type', 'Safety Incident',
        'severity', si.severity,
        'description', si.title,
        'date', si.incident_date
      )
    ) as risks
    FROM safety_incidents si
    JOIN projects p ON si.project_id = p.id
    WHERE si.project_id = ANY(accessible_projects)
      AND si.severity IN ('high', 'critical')
    ORDER BY si.incident_date DESC
    LIMIT 5
  ),
  project_summary AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'project_id', ph.project_id,
        'project_name', ph.project_name,
        'total_budget', ph.total_budget,
        'budget_utilization', ph.budget_utilization_pct,
        'schedule_progress', ph.schedule_progress_pct,
        'schedule_slip', ph.schedule_slip_pct,
        'status', ph.status
      )
    ) as projects
    FROM portfolio_health ph
    WHERE ph.project_id = ANY(accessible_projects)
  )
  SELECT 
    COALESCE(ps.total_value, 0),
    COALESCE(ps.avg_budget_util, 0),
    COALESCE(ps.avg_schedule_slip, 0),
    COALESCE(ps.total_proj, 0),
    COALESCE(ps.active_proj, 0),
    COALESCE(rs.risks, '[]'::jsonb),
    COALESCE(proj.projects, '[]'::jsonb)
  FROM portfolio_summary ps
  CROSS JOIN risk_summary rs
  CROSS JOIN project_summary proj;
END;
$$;


ALTER FUNCTION "public"."portfolio_metrics"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_communications"("query_embedding" "public"."vector", "project_uuid" "uuid", "match_count" integer DEFAULT 10, "similarity_threshold" double precision DEFAULT 0.7) RETURNS TABLE("id" "uuid", "project_id" "uuid", "provider" "text", "comm_type" "text", "subject" "text", "body" "text", "speaker" "jsonb", "message_ts" timestamp with time zone, "url" "text", "similarity" double precision)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.project_id,
        c.provider,
        c.comm_type,
        c.subject,
        c.body,
        c.speaker,
        c.message_ts,
        c.url,
        (1 - (c.embedding <=> query_embedding)) AS similarity
    FROM public.communications c
    WHERE c.project_id = project_uuid
        AND c.embedding IS NOT NULL
        AND (1 - (c.embedding <=> query_embedding)) > similarity_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."search_communications"("query_embedding" "public"."vector", "project_uuid" "uuid", "match_count" integer, "similarity_threshold" double precision) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_communications_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_communications_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_insights_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_insights_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_integration_tokens_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_integration_tokens_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."action_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'Open'::"text" NOT NULL,
    "priority" "text" DEFAULT 'Medium'::"text",
    "due_date" "date",
    "assignee" "uuid",
    "source_type" "text",
    "source_id" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."action_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."alerts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "alert_type" character varying(100) NOT NULL,
    "severity" character varying(50) DEFAULT 'medium'::character varying NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "resolved" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "resolved_at" timestamp with time zone
);


ALTER TABLE "public"."alerts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."alerts_sent" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "alert_id" "uuid" NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"(),
    "channel" character varying(100) NOT NULL,
    "status" character varying(50) DEFAULT 'sent'::character varying NOT NULL
);


ALTER TABLE "public"."alerts_sent" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "project_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "table_name" "text" NOT NULL,
    "record_id" "uuid",
    "old_values" "jsonb",
    "new_values" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bim_files" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "filename" "text" NOT NULL,
    "file_path" "text" NOT NULL,
    "file_type" "text" DEFAULT 'ifc'::"text" NOT NULL,
    "version" integer DEFAULT 1 NOT NULL,
    "file_size" bigint,
    "is_active" boolean DEFAULT true NOT NULL,
    "uploaded_by" "uuid",
    "upload_ts" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bim_files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_breakdown" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "category" "text" NOT NULL,
    "allocated_amount" numeric DEFAULT 0,
    "spent_amount" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."budget_breakdown" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."budget_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "category" character varying(255) NOT NULL,
    "description" "text",
    "budgeted_amount" numeric(15,2),
    "actual_amount" numeric(15,2) DEFAULT 0,
    "source" "text",
    "external_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."budget_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."building_systems" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "system_name" character varying NOT NULL,
    "system_type" character varying NOT NULL,
    "status" character varying DEFAULT 'operational'::character varying NOT NULL,
    "uptime_percentage" numeric DEFAULT 100,
    "last_maintenance" "date",
    "next_maintenance" "date",
    "energy_consumption" numeric DEFAULT 0,
    "efficiency_rating" numeric,
    "alerts_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."building_systems" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."capture_sets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "provider" "text" NOT NULL,
    "capture_date" timestamp with time zone NOT NULL,
    "thumbnail_url" "text",
    "pano_url" "text",
    "pointcloud_url" "text",
    "progress_data" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."capture_sets" REPLICA IDENTITY FULL;


ALTER TABLE "public"."capture_sets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."change_orders" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "amount" numeric(15,2) DEFAULT 0,
    "status" character varying(50) DEFAULT 'pending'::character varying,
    "submitted_by" character varying(255),
    "submitted_date" "date" DEFAULT CURRENT_DATE,
    "approved_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."change_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."communications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "provider" "text" NOT NULL,
    "comm_type" "text" NOT NULL,
    "subject" "text",
    "body" "text",
    "speaker" "jsonb" DEFAULT '{}'::"jsonb",
    "message_ts" timestamp with time zone NOT NULL,
    "url" "text",
    "embedding" "public"."vector"(1536),
    "participants" "jsonb" DEFAULT '[]'::"jsonb",
    "thread_id" "text",
    "external_id" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "communications_comm_type_check" CHECK (("comm_type" = ANY (ARRAY['email'::"text", 'chat_message'::"text", 'meeting_recording'::"text", 'meeting_transcript'::"text", 'channel_message'::"text"]))),
    CONSTRAINT "communications_provider_check" CHECK (("provider" = ANY (ARRAY['teams'::"text", 'outlook'::"text", 'zoom'::"text", 'google_meet'::"text", 'manual'::"text"])))
);


ALTER TABLE "public"."communications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."construction_activities" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "activity_name" character varying(255) NOT NULL,
    "trade" character varying(100),
    "status" character varying(50),
    "activity_date" "date",
    "crew_name" character varying(255),
    "duration_hours" integer,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."construction_activities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contractor_bids" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "contractor_name" "text" NOT NULL,
    "bid_amount" numeric DEFAULT 0,
    "evaluation_score" numeric DEFAULT 0,
    "proposed_timeline" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "recommended" boolean DEFAULT false,
    "experience_years" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."contractor_bids" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "file_path" "text",
    "file_size" integer,
    "mime_type" character varying(100),
    "doc_type" "public"."document_type" DEFAULT 'other'::"public"."document_type",
    "processed" boolean DEFAULT false,
    "source" "text",
    "external_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."energy_consumption" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "meter_type" character varying NOT NULL,
    "reading_date" "date" NOT NULL,
    "consumption" numeric NOT NULL,
    "unit" character varying NOT NULL,
    "cost" numeric,
    "baseline" numeric,
    "efficiency_score" numeric,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."energy_consumption" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" character varying NOT NULL,
    "equipment_type" character varying NOT NULL,
    "manufacturer" character varying,
    "model" character varying,
    "serial_number" character varying,
    "location" character varying NOT NULL,
    "installation_date" "date",
    "warranty_expiration" "date",
    "status" character varying DEFAULT 'operational'::character varying NOT NULL,
    "specifications" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."external_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "role" "public"."app_role" DEFAULT 'viewer'::"public"."app_role" NOT NULL,
    "invited_by" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "expires_at" timestamp with time zone DEFAULT ("now"() + '7 days'::interval),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."external_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."images" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "document_id" "uuid",
    "title" character varying(255),
    "file_path" "text" NOT NULL,
    "file_size" integer,
    "width" integer,
    "height" integer,
    "ocr_text" "text",
    "processed" boolean DEFAULT false,
    "source" "text",
    "external_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."insights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "severity" "text" NOT NULL,
    "title" "text" NOT NULL,
    "summary" "text" NOT NULL,
    "context_data" "jsonb" DEFAULT '{}'::"jsonb",
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "insights_severity_check" CHECK (("severity" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text", 'critical'::"text"])))
);

ALTER TABLE ONLY "public"."insights" REPLICA IDENTITY FULL;


ALTER TABLE "public"."insights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integration_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "source" character varying(100) NOT NULL,
    "operation" character varying(100) NOT NULL,
    "status" character varying(50) NOT NULL,
    "records_processed" integer DEFAULT 0,
    "error_message" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."integration_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integration_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "provider" "text" NOT NULL,
    "access_token" "text" NOT NULL,
    "refresh_token" "text",
    "token_data" "jsonb" DEFAULT '{}'::"jsonb",
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "integration_tokens_provider_check" CHECK (("provider" = ANY (ARRAY['teams'::"text", 'outlook'::"text", 'zoom'::"text", 'google_meet'::"text"])))
);


ALTER TABLE "public"."integration_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."maintenance_schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "schedule_name" character varying NOT NULL,
    "frequency_type" character varying NOT NULL,
    "frequency_interval" integer DEFAULT 1,
    "last_performed" "date",
    "next_due" "date" NOT NULL,
    "estimated_duration" numeric,
    "description" "text",
    "checklist" "jsonb" DEFAULT '[]'::"jsonb",
    "auto_generate_wo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."maintenance_schedules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."model_bindings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "bim_file_id" "uuid" NOT NULL,
    "element_id" "text" NOT NULL,
    "element_type" "text",
    "binding_type" "text" NOT NULL,
    "binding_id" "uuid" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."model_bindings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."org_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "org_id" "uuid" NOT NULL,
    "role" character varying(50) DEFAULT 'member'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."org_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."permit_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "permit_type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "submitted_date" "date",
    "expected_approval" "date",
    "approved_date" "date",
    "priority" "text" DEFAULT 'medium'::"text",
    "cost" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."permit_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "status" "public"."project_status" DEFAULT 'planning'::"public"."project_status",
    "source" "text",
    "external_id" "text",
    "start_date" "date",
    "end_date" "date",
    "owner_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "org_id" "uuid",
    "total_value" numeric DEFAULT 0,
    "risk_score" numeric DEFAULT 0,
    "strategic_alignment" numeric DEFAULT 0,
    "market_position" numeric DEFAULT 0,
    "estimated_completion" "date"
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."safety_incidents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "severity" character varying(50) DEFAULT 'low'::character varying,
    "incident_date" "date" DEFAULT CURRENT_DATE,
    "reported_by" character varying(255),
    "status" character varying(50) DEFAULT 'reported'::character varying,
    "location" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."safety_incidents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "status" "public"."task_status" DEFAULT 'not_started'::"public"."task_status",
    "priority" integer DEFAULT 1,
    "assigned_to" character varying(255),
    "due_date" "date",
    "source" "text",
    "external_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tasks" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."portfolio_health" AS
 SELECT "p"."id" AS "project_id",
    "p"."name" AS "project_name",
    "p"."status",
    COALESCE("sum"("bi"."budgeted_amount"), (0)::numeric) AS "total_budget",
    COALESCE("sum"("bi"."actual_amount"), (0)::numeric) AS "actual_spent",
        CASE
            WHEN ("sum"("bi"."budgeted_amount") > (0)::numeric) THEN (("sum"("bi"."actual_amount") / "sum"("bi"."budgeted_amount")) * (100)::numeric)
            ELSE (0)::numeric
        END AS "budget_utilization_pct",
        CASE
            WHEN ("count"("t"."id") > 0) THEN ((("count"(
            CASE
                WHEN ("t"."status" = 'completed'::"public"."task_status") THEN 1
                ELSE NULL::integer
            END))::numeric / ("count"("t"."id"))::numeric) * (100)::numeric)
            ELSE (0)::numeric
        END AS "schedule_progress_pct",
        CASE
            WHEN ("count"("t"."id") > 0) THEN ((("count"(
            CASE
                WHEN (("t"."due_date" < CURRENT_DATE) AND ("t"."status" <> 'completed'::"public"."task_status")) THEN 1
                ELSE NULL::integer
            END))::numeric / ("count"("t"."id"))::numeric) * (100)::numeric)
            ELSE (0)::numeric
        END AS "schedule_slip_pct",
    "count"(DISTINCT "si"."id") AS "safety_incidents_count",
    "count"(DISTINCT "co"."id") AS "change_orders_count"
   FROM (((("public"."projects" "p"
     LEFT JOIN "public"."budget_items" "bi" ON (("p"."id" = "bi"."project_id")))
     LEFT JOIN "public"."tasks" "t" ON (("p"."id" = "t"."project_id")))
     LEFT JOIN "public"."safety_incidents" "si" ON (("p"."id" = "si"."project_id")))
     LEFT JOIN "public"."change_orders" "co" ON (("p"."id" = "co"."project_id")))
  GROUP BY "p"."id", "p"."name", "p"."status";


ALTER VIEW "public"."portfolio_health" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."preconstruction_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "budget_approval" numeric DEFAULT 0,
    "permit_progress" numeric DEFAULT 0,
    "design_completion" numeric DEFAULT 0,
    "contractor_selection" numeric DEFAULT 0,
    "feasibility_score" numeric DEFAULT 0,
    "timeline_status" "text" DEFAULT 'Unknown'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."preconstruction_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_design_metrics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "design_progress" numeric,
    "approved_drawings" integer,
    "total_drawings" integer,
    "revision_cycles" integer,
    "stakeholder_approvals" integer,
    "design_changes" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_design_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_facilities_metrics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "operational_readiness" numeric,
    "systems_commissioned" integer,
    "maintenance_planned" numeric,
    "energy_performance" numeric,
    "occupancy_readiness" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_facilities_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_financial_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "total_budget" numeric(15,2),
    "spent_to_date" numeric(15,2),
    "forecasted_cost" numeric(15,2),
    "contingency_used" numeric(15,2),
    "contingency_remaining" numeric(15,2),
    "roi" numeric,
    "npv" numeric(15,2),
    "irr" numeric,
    "cost_per_sqft" numeric(15,2),
    "market_value" numeric(15,2),
    "leasing_projections" numeric(15,2),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_financial_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_insights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "summary" "text",
    "key_points" "text"[] DEFAULT '{}'::"text"[],
    "recommendations" "text"[] DEFAULT '{}'::"text"[],
    "alerts" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."project_insights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_integrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "provider" "text" NOT NULL,
    "status" "text" DEFAULT 'not_connected'::"text" NOT NULL,
    "api_key" "text",
    "refresh_token" "text",
    "oauth_data" "jsonb" DEFAULT '{}'::"jsonb",
    "last_sync" timestamp with time zone,
    "sync_error" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "project_integrations_provider_check" CHECK (("provider" = ANY (ARRAY['procore'::"text", 'primavera'::"text", 'onedrive'::"text", 'iot_sensors'::"text", 'smartsheet'::"text", 'green_badger'::"text", 'billy'::"text", 'clearstory'::"text", 'track3d'::"text", 'bim360'::"text", 'microsoft_teams'::"text", 'zoom'::"text", 'outlook'::"text"]))),
    CONSTRAINT "project_integrations_status_check" CHECK (("status" = ANY (ARRAY['connected'::"text", 'error'::"text", 'not_connected'::"text", 'syncing'::"text"])))
);

ALTER TABLE ONLY "public"."project_integrations" REPLICA IDENTITY FULL;


ALTER TABLE "public"."project_integrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_kpis" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "week" "text" NOT NULL,
    "efficiency_score" numeric DEFAULT 0,
    "quality_score" numeric DEFAULT 0,
    "safety_score" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."project_kpis" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_legal_metrics" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "contracts_active" integer,
    "contracts_pending" integer,
    "compliance_score" numeric,
    "permit_status" character varying(255),
    "legal_risks" integer,
    "documentation_complete" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."project_legal_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_team" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "name" "text" NOT NULL,
    "role" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."project_team" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchase_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "po_number" "text" NOT NULL,
    "vendor_name" "text" NOT NULL,
    "vendor_contact" "text",
    "description" "text",
    "total_amount" numeric DEFAULT 0,
    "status" "text" DEFAULT 'draft'::"text",
    "issue_date" "date",
    "delivery_date" "date",
    "external_id" "text",
    "source" "text" DEFAULT 'manual'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "purchase_orders_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'sent'::"text", 'approved'::"text", 'received'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."purchase_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "report_type" character varying(100) DEFAULT 'weekly_summary'::character varying NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rfi" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "status" "public"."rfi_status" DEFAULT 'open'::"public"."rfi_status",
    "submitted_by" character varying(255),
    "assigned_to" character varying(255),
    "due_date" "date",
    "source" "text",
    "external_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."rfi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rfps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "rfp_number" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text" DEFAULT 'general'::"text",
    "status" "text" DEFAULT 'draft'::"text",
    "issue_date" "date",
    "response_deadline" "date",
    "awarded_vendor" "text",
    "awarded_amount" numeric,
    "external_id" "text",
    "source" "text" DEFAULT 'manual'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "rfps_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'responses_received'::"text", 'awarded'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."rfps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sensor_readings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sensor_id" "uuid" NOT NULL,
    "value" numeric NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" character varying DEFAULT 'normal'::character varying,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."sensor_readings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sensors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "equipment_id" "uuid",
    "project_id" "uuid" NOT NULL,
    "sensor_type" character varying NOT NULL,
    "name" character varying NOT NULL,
    "location" character varying NOT NULL,
    "unit" character varying,
    "min_threshold" numeric,
    "max_threshold" numeric,
    "status" character varying DEFAULT 'active'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sensors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_dashboard_layouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "layout" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_dashboard_layouts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_notification_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "insight_frequency" "text" DEFAULT 'realtime'::"text" NOT NULL,
    "email_notifications" boolean DEFAULT true,
    "push_notifications" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_notification_preferences_insight_frequency_check" CHECK (("insight_frequency" = ANY (ARRAY['realtime'::"text", 'daily'::"text", 'weekly'::"text"])))
);


ALTER TABLE "public"."user_notification_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "role" character varying(50) DEFAULT 'member'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "role" "public"."app_role" DEFAULT 'viewer'::"public"."app_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vector_index" (
    "chunk_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "doc_id" "uuid",
    "image_id" "uuid",
    "content" "text" NOT NULL,
    "embedding" "public"."vector"(1536),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "vector_index_source_check" CHECK ((("doc_id" IS NOT NULL) OR ("image_id" IS NOT NULL)))
);


ALTER TABLE "public"."vector_index" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "equipment_id" "uuid",
    "title" character varying NOT NULL,
    "description" "text",
    "priority" character varying DEFAULT 'medium'::character varying NOT NULL,
    "status" character varying DEFAULT 'open'::character varying NOT NULL,
    "work_type" character varying NOT NULL,
    "assigned_to" character varying,
    "requested_by" character varying,
    "due_date" "date",
    "completed_date" "date",
    "estimated_hours" numeric,
    "actual_hours" numeric,
    "cost" numeric DEFAULT 0,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."work_orders" OWNER TO "postgres";


ALTER TABLE ONLY "public"."action_items"
    ADD CONSTRAINT "action_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."alerts"
    ADD CONSTRAINT "alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."alerts_sent"
    ADD CONSTRAINT "alerts_sent_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bim_files"
    ADD CONSTRAINT "bim_files_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_breakdown"
    ADD CONSTRAINT "budget_breakdown_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."building_systems"
    ADD CONSTRAINT "building_systems_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."capture_sets"
    ADD CONSTRAINT "capture_sets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."construction_activities"
    ADD CONSTRAINT "construction_activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contractor_bids"
    ADD CONSTRAINT "contractor_bids_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."energy_consumption"
    ADD CONSTRAINT "energy_consumption_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."external_invites"
    ADD CONSTRAINT "external_invites_email_project_id_key" UNIQUE ("email", "project_id");



ALTER TABLE ONLY "public"."external_invites"
    ADD CONSTRAINT "external_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."insights"
    ADD CONSTRAINT "insights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integration_logs"
    ADD CONSTRAINT "integration_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integration_tokens"
    ADD CONSTRAINT "integration_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integration_tokens"
    ADD CONSTRAINT "integration_tokens_user_id_project_id_provider_key" UNIQUE ("user_id", "project_id", "provider");



ALTER TABLE ONLY "public"."maintenance_schedules"
    ADD CONSTRAINT "maintenance_schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."model_bindings"
    ADD CONSTRAINT "model_bindings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_user_id_org_id_key" UNIQUE ("user_id", "org_id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permit_status"
    ADD CONSTRAINT "permit_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."preconstruction_metrics"
    ADD CONSTRAINT "preconstruction_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_design_metrics"
    ADD CONSTRAINT "project_design_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_design_metrics"
    ADD CONSTRAINT "project_design_metrics_project_id_key" UNIQUE ("project_id");



ALTER TABLE ONLY "public"."project_facilities_metrics"
    ADD CONSTRAINT "project_facilities_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_facilities_metrics"
    ADD CONSTRAINT "project_facilities_metrics_project_id_key" UNIQUE ("project_id");



ALTER TABLE ONLY "public"."project_financial_metrics"
    ADD CONSTRAINT "project_financial_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_financial_metrics"
    ADD CONSTRAINT "project_financial_metrics_project_id_key" UNIQUE ("project_id");



ALTER TABLE ONLY "public"."project_insights"
    ADD CONSTRAINT "project_insights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_integrations"
    ADD CONSTRAINT "project_integrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_integrations"
    ADD CONSTRAINT "project_integrations_project_id_provider_key" UNIQUE ("project_id", "provider");



ALTER TABLE ONLY "public"."project_kpis"
    ADD CONSTRAINT "project_kpis_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_legal_metrics"
    ADD CONSTRAINT "project_legal_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_legal_metrics"
    ADD CONSTRAINT "project_legal_metrics_project_id_key" UNIQUE ("project_id");



ALTER TABLE ONLY "public"."project_team"
    ADD CONSTRAINT "project_team_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_project_id_po_number_key" UNIQUE ("project_id", "po_number");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rfi"
    ADD CONSTRAINT "rfi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rfps"
    ADD CONSTRAINT "rfps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rfps"
    ADD CONSTRAINT "rfps_project_id_rfp_number_key" UNIQUE ("project_id", "rfp_number");



ALTER TABLE ONLY "public"."safety_incidents"
    ADD CONSTRAINT "safety_incidents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sensor_readings"
    ADD CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sensors"
    ADD CONSTRAINT "sensors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_dashboard_layouts"
    ADD CONSTRAINT "user_dashboard_layouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_dashboard_layouts"
    ADD CONSTRAINT "user_dashboard_layouts_user_id_role_project_id_key" UNIQUE ("user_id", "role", "project_id");



ALTER TABLE ONLY "public"."user_notification_preferences"
    ADD CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notification_preferences"
    ADD CONSTRAINT "user_notification_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_user_id_project_id_key" UNIQUE ("user_id", "project_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_project_id_key" UNIQUE ("user_id", "project_id");



ALTER TABLE ONLY "public"."vector_index"
    ADD CONSTRAINT "vector_index_pkey" PRIMARY KEY ("chunk_id");



ALTER TABLE ONLY "public"."work_orders"
    ADD CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id");



CREATE INDEX "communications_embedding_idx" ON "public"."communications" USING "hnsw" ("embedding" "public"."vector_cosine_ops") WHERE ("embedding" IS NOT NULL);



CREATE INDEX "idx_action_items_assignee" ON "public"."action_items" USING "btree" ("assignee");



CREATE INDEX "idx_action_items_due_date" ON "public"."action_items" USING "btree" ("due_date");



CREATE INDEX "idx_action_items_project_id" ON "public"."action_items" USING "btree" ("project_id");



CREATE INDEX "idx_action_items_status" ON "public"."action_items" USING "btree" ("status");



CREATE INDEX "idx_alerts_project" ON "public"."alerts" USING "btree" ("project_id");



CREATE INDEX "idx_audit_logs_project_created" ON "public"."audit_logs" USING "btree" ("project_id", "created_at" DESC);



CREATE INDEX "idx_audit_logs_table_record" ON "public"."audit_logs" USING "btree" ("table_name", "record_id");



CREATE INDEX "idx_audit_logs_user_created" ON "public"."audit_logs" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_bim_files_active" ON "public"."bim_files" USING "btree" ("project_id", "is_active") WHERE ("is_active" = true);



CREATE INDEX "idx_bim_files_project_id" ON "public"."bim_files" USING "btree" ("project_id");



CREATE INDEX "idx_budget_project" ON "public"."budget_items" USING "btree" ("project_id");



CREATE INDEX "idx_change_orders_project" ON "public"."change_orders" USING "btree" ("project_id");



CREATE INDEX "idx_communications_comm_type" ON "public"."communications" USING "btree" ("comm_type");



CREATE INDEX "idx_communications_external_id" ON "public"."communications" USING "btree" ("external_id") WHERE ("external_id" IS NOT NULL);



CREATE INDEX "idx_communications_message_ts" ON "public"."communications" USING "btree" ("message_ts" DESC);



CREATE INDEX "idx_communications_project_id" ON "public"."communications" USING "btree" ("project_id");



CREATE INDEX "idx_communications_provider" ON "public"."communications" USING "btree" ("provider");



CREATE INDEX "idx_communications_thread_id" ON "public"."communications" USING "btree" ("thread_id") WHERE ("thread_id" IS NOT NULL);



CREATE INDEX "idx_documents_project" ON "public"."documents" USING "btree" ("project_id");



CREATE INDEX "idx_energy_consumption_project_date" ON "public"."energy_consumption" USING "btree" ("project_id", "reading_date" DESC);



CREATE INDEX "idx_equipment_project_type" ON "public"."equipment" USING "btree" ("project_id", "equipment_type");



CREATE INDEX "idx_images_document" ON "public"."images" USING "btree" ("document_id");



CREATE INDEX "idx_images_project" ON "public"."images" USING "btree" ("project_id");



CREATE INDEX "idx_insights_project_created" ON "public"."insights" USING "btree" ("project_id", "created_at" DESC);



CREATE INDEX "idx_insights_unread" ON "public"."insights" USING "btree" ("project_id", "read_at") WHERE ("read_at" IS NULL);



CREATE INDEX "idx_integration_logs_project" ON "public"."integration_logs" USING "btree" ("project_id");



CREATE INDEX "idx_integration_tokens_user_project" ON "public"."integration_tokens" USING "btree" ("user_id", "project_id");



CREATE INDEX "idx_model_bindings_binding" ON "public"."model_bindings" USING "btree" ("binding_type", "binding_id");



CREATE INDEX "idx_model_bindings_project_element" ON "public"."model_bindings" USING "btree" ("project_id", "element_id");



CREATE INDEX "idx_org_members_org_id" ON "public"."org_members" USING "btree" ("org_id");



CREATE INDEX "idx_org_members_user_id" ON "public"."org_members" USING "btree" ("user_id");



CREATE INDEX "idx_projects_org_id" ON "public"."projects" USING "btree" ("org_id");



CREATE INDEX "idx_projects_owner" ON "public"."projects" USING "btree" ("owner_id");



CREATE INDEX "idx_projects_status" ON "public"."projects" USING "btree" ("status");



CREATE INDEX "idx_reports_project" ON "public"."reports" USING "btree" ("project_id");



CREATE INDEX "idx_rfi_project" ON "public"."rfi" USING "btree" ("project_id");



CREATE INDEX "idx_rfi_status" ON "public"."rfi" USING "btree" ("status");



CREATE INDEX "idx_safety_incidents_project" ON "public"."safety_incidents" USING "btree" ("project_id");



CREATE INDEX "idx_sensor_readings_sensor_timestamp" ON "public"."sensor_readings" USING "btree" ("sensor_id", "timestamp" DESC);



CREATE INDEX "idx_sensors_project_type" ON "public"."sensors" USING "btree" ("project_id", "sensor_type");



CREATE INDEX "idx_tasks_project" ON "public"."tasks" USING "btree" ("project_id");



CREATE INDEX "idx_tasks_status" ON "public"."tasks" USING "btree" ("status");



CREATE INDEX "idx_user_projects_project_id" ON "public"."user_projects" USING "btree" ("project_id");



CREATE INDEX "idx_user_projects_user_id" ON "public"."user_projects" USING "btree" ("user_id");



CREATE INDEX "idx_vector_doc" ON "public"."vector_index" USING "btree" ("doc_id");



CREATE INDEX "idx_vector_embedding" ON "public"."vector_index" USING "hnsw" ("embedding" "public"."vector_cosine_ops");



CREATE INDEX "idx_vector_image" ON "public"."vector_index" USING "btree" ("image_id");



CREATE INDEX "idx_vector_project" ON "public"."vector_index" USING "btree" ("project_id");



CREATE INDEX "idx_work_orders_project_status" ON "public"."work_orders" USING "btree" ("project_id", "status");



CREATE OR REPLACE TRIGGER "insights_updated_at_trigger" BEFORE UPDATE ON "public"."insights" FOR EACH ROW EXECUTE FUNCTION "public"."update_insights_updated_at"();



CREATE OR REPLACE TRIGGER "update_action_items_updated_at" BEFORE UPDATE ON "public"."action_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bim_files_updated_at" BEFORE UPDATE ON "public"."bim_files" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_budget_items_updated_at" BEFORE UPDATE ON "public"."budget_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_building_systems_updated_at" BEFORE UPDATE ON "public"."building_systems" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_change_orders_updated_at" BEFORE UPDATE ON "public"."change_orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_communications_updated_at" BEFORE UPDATE ON "public"."communications" FOR EACH ROW EXECUTE FUNCTION "public"."update_communications_updated_at"();



CREATE OR REPLACE TRIGGER "update_documents_updated_at" BEFORE UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_equipment_updated_at" BEFORE UPDATE ON "public"."equipment" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_images_updated_at" BEFORE UPDATE ON "public"."images" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_integration_tokens_updated_at" BEFORE UPDATE ON "public"."integration_tokens" FOR EACH ROW EXECUTE FUNCTION "public"."update_integration_tokens_updated_at"();



CREATE OR REPLACE TRIGGER "update_maintenance_schedules_updated_at" BEFORE UPDATE ON "public"."maintenance_schedules" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_model_bindings_updated_at" BEFORE UPDATE ON "public"."model_bindings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_project_integrations_updated_at" BEFORE UPDATE ON "public"."project_integrations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_purchase_orders_updated_at" BEFORE UPDATE ON "public"."purchase_orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_rfi_updated_at" BEFORE UPDATE ON "public"."rfi" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_rfps_updated_at" BEFORE UPDATE ON "public"."rfps" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_safety_incidents_updated_at" BEFORE UPDATE ON "public"."safety_incidents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_sensors_updated_at" BEFORE UPDATE ON "public"."sensors" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tasks_updated_at" BEFORE UPDATE ON "public"."tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_dashboard_layouts_updated_at" BEFORE UPDATE ON "public"."user_dashboard_layouts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_roles_updated_at" BEFORE UPDATE ON "public"."user_roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_vector_index_updated_at" BEFORE UPDATE ON "public"."vector_index" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_work_orders_updated_at" BEFORE UPDATE ON "public"."work_orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "user_notification_preferences_updated_at_trigger" BEFORE UPDATE ON "public"."user_notification_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_insights_updated_at"();



ALTER TABLE ONLY "public"."action_items"
    ADD CONSTRAINT "action_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alerts"
    ADD CONSTRAINT "alerts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."alerts_sent"
    ADD CONSTRAINT "alerts_sent_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "public"."alerts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."bim_files"
    ADD CONSTRAINT "bim_files_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bim_files"
    ADD CONSTRAINT "bim_files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."budget_breakdown"
    ADD CONSTRAINT "budget_breakdown_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."budget_items"
    ADD CONSTRAINT "budget_items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."building_systems"
    ADD CONSTRAINT "building_systems_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."capture_sets"
    ADD CONSTRAINT "capture_sets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."construction_activities"
    ADD CONSTRAINT "construction_activities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contractor_bids"
    ADD CONSTRAINT "contractor_bids_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."energy_consumption"
    ADD CONSTRAINT "energy_consumption_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."external_invites"
    ADD CONSTRAINT "external_invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."external_invites"
    ADD CONSTRAINT "external_invites_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."insights"
    ADD CONSTRAINT "insights_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."integration_logs"
    ADD CONSTRAINT "integration_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."integration_tokens"
    ADD CONSTRAINT "integration_tokens_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."maintenance_schedules"
    ADD CONSTRAINT "maintenance_schedules_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id");



ALTER TABLE ONLY "public"."maintenance_schedules"
    ADD CONSTRAINT "maintenance_schedules_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."model_bindings"
    ADD CONSTRAINT "model_bindings_bim_file_id_fkey" FOREIGN KEY ("bim_file_id") REFERENCES "public"."bim_files"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."model_bindings"
    ADD CONSTRAINT "model_bindings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."permit_status"
    ADD CONSTRAINT "permit_status_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."preconstruction_metrics"
    ADD CONSTRAINT "preconstruction_metrics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_design_metrics"
    ADD CONSTRAINT "project_design_metrics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_facilities_metrics"
    ADD CONSTRAINT "project_facilities_metrics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_financial_metrics"
    ADD CONSTRAINT "project_financial_metrics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_insights"
    ADD CONSTRAINT "project_insights_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_integrations"
    ADD CONSTRAINT "project_integrations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_kpis"
    ADD CONSTRAINT "project_kpis_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_legal_metrics"
    ADD CONSTRAINT "project_legal_metrics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_team"
    ADD CONSTRAINT "project_team_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id");



ALTER TABLE ONLY "public"."purchase_orders"
    ADD CONSTRAINT "purchase_orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rfi"
    ADD CONSTRAINT "rfi_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rfps"
    ADD CONSTRAINT "rfps_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."safety_incidents"
    ADD CONSTRAINT "safety_incidents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sensor_readings"
    ADD CONSTRAINT "sensor_readings_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id");



ALTER TABLE ONLY "public"."sensors"
    ADD CONSTRAINT "sensors_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id");



ALTER TABLE ONLY "public"."sensors"
    ADD CONSTRAINT "sensors_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_projects"
    ADD CONSTRAINT "user_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vector_index"
    ADD CONSTRAINT "vector_index_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vector_index"
    ADD CONSTRAINT "vector_index_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."vector_index"
    ADD CONSTRAINT "vector_index_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."work_orders"
    ADD CONSTRAINT "work_orders_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id");



ALTER TABLE ONLY "public"."work_orders"
    ADD CONSTRAINT "work_orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id");



CREATE POLICY "Admins and GCs can manage audit logs" ON "public"."audit_logs" USING ("public"."has_admin_access"("auth"."uid"(), "project_id")) WITH CHECK ("public"."has_admin_access"("auth"."uid"(), "project_id"));



CREATE POLICY "Admins and GCs can manage invites" ON "public"."external_invites" USING ("public"."has_admin_access"("auth"."uid"(), "project_id")) WITH CHECK ("public"."has_admin_access"("auth"."uid"(), "project_id"));



CREATE POLICY "Admins and GCs can manage user roles" ON "public"."user_roles" USING ("public"."has_admin_access"("auth"."uid"(), "project_id")) WITH CHECK ("public"."has_admin_access"("auth"."uid"(), "project_id"));



CREATE POLICY "Project managers can manage BIM files" ON "public"."bim_files" USING ("public"."has_admin_access"("auth"."uid"(), "project_id"));



CREATE POLICY "Project managers can manage model bindings" ON "public"."model_bindings" USING ("public"."has_admin_access"("auth"."uid"(), "project_id"));



CREATE POLICY "Users can create action items for their projects" ON "public"."action_items" FOR INSERT WITH CHECK ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can create purchase orders for their projects" ON "public"."purchase_orders" FOR INSERT WITH CHECK ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can create rfps for their projects" ON "public"."rfps" FOR INSERT WITH CHECK ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can delete action items for their projects" ON "public"."action_items" FOR DELETE USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can delete purchase orders for their projects" ON "public"."purchase_orders" FOR DELETE USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can delete rfps for their projects" ON "public"."rfps" FOR DELETE USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can delete their own dashboard layouts" ON "public"."user_dashboard_layouts" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert communications for accessible projects" ON "public"."communications" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_projects" "up"
  WHERE (("up"."user_id" = "auth"."uid"()) AND ("up"."project_id" = "communications"."project_id")))));



CREATE POLICY "Users can insert sensor readings for their projects" ON "public"."sensor_readings" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."sensors" "s"
  WHERE (("s"."id" = "sensor_readings"."sensor_id") AND "public"."has_project_access"("s"."project_id")))));



CREATE POLICY "Users can insert their own dashboard layouts" ON "public"."user_dashboard_layouts" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage building systems for their projects" ON "public"."building_systems" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can manage energy consumption for their projects" ON "public"."energy_consumption" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can manage equipment for their projects" ON "public"."equipment" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can manage maintenance schedules for their projects" ON "public"."maintenance_schedules" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can manage own notification preferences" ON "public"."user_notification_preferences" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage sensors for their projects" ON "public"."sensors" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can manage their own integration tokens" ON "public"."integration_tokens" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage work orders for their projects" ON "public"."work_orders" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can modify alerts sent" ON "public"."alerts_sent" USING ((EXISTS ( SELECT 1
   FROM ("public"."alerts"
     JOIN "public"."projects" ON (("projects"."id" = "alerts"."project_id")))
  WHERE (("alerts"."id" = "alerts_sent"."alert_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can modify project alerts" ON "public"."alerts" USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "alerts"."project_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can modify project integration logs" ON "public"."integration_logs" USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "integration_logs"."project_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can modify project reports" ON "public"."reports" USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "reports"."project_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can update action items for their projects" ON "public"."action_items" FOR UPDATE USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can update communications with proper access" ON "public"."communications" FOR UPDATE USING (((EXISTS ( SELECT 1
   FROM "public"."user_projects" "up"
  WHERE (("up"."user_id" = "auth"."uid"()) AND ("up"."project_id" = "communications"."project_id")))) AND ((("speaker" ->> 'id'::"text") = ("auth"."uid"())::"text") OR (EXISTS ( SELECT 1
   FROM "public"."user_roles" "ur"
  WHERE (("ur"."user_id" = "auth"."uid"()) AND ("ur"."project_id" = "communications"."project_id") AND ("ur"."role" = ANY (ARRAY['admin'::"public"."app_role", 'gc'::"public"."app_role"]))))))));



CREATE POLICY "Users can update purchase orders for their projects" ON "public"."purchase_orders" FOR UPDATE USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can update rfps for their projects" ON "public"."rfps" FOR UPDATE USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can update their own dashboard layouts" ON "public"."user_dashboard_layouts" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view BIM files for accessible projects" ON "public"."bim_files" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view action items for their projects" ON "public"."action_items" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view alerts sent" ON "public"."alerts_sent" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."alerts"
     JOIN "public"."projects" ON (("projects"."id" = "alerts"."project_id")))
  WHERE (("alerts"."id" = "alerts_sent"."alert_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can view audit logs for accessible projects" ON "public"."audit_logs" FOR SELECT USING (("project_id" IN ( SELECT "user_projects"."project_id"
   FROM "public"."user_projects"
  WHERE ("user_projects"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view building systems for their projects" ON "public"."building_systems" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view capture sets for accessible projects" ON "public"."capture_sets" USING (("project_id" IN ( SELECT "user_projects"."project_id"
   FROM "public"."user_projects"
  WHERE ("user_projects"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view energy consumption for their projects" ON "public"."energy_consumption" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view equipment for their projects" ON "public"."equipment" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view insights for accessible projects" ON "public"."insights" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_projects" "up"
  WHERE (("up"."user_id" = "auth"."uid"()) AND ("up"."project_id" = "insights"."project_id")))));



CREATE POLICY "Users can view integrations for accessible projects" ON "public"."project_integrations" USING (("project_id" IN ( SELECT "user_projects"."project_id"
   FROM "public"."user_projects"
  WHERE ("user_projects"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view invites for projects they have access to" ON "public"."external_invites" FOR SELECT USING (("project_id" IN ( SELECT "user_projects"."project_id"
   FROM "public"."user_projects"
  WHERE ("user_projects"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view maintenance schedules for their projects" ON "public"."maintenance_schedules" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view model bindings for accessible projects" ON "public"."model_bindings" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view project alerts" ON "public"."alerts" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "alerts"."project_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can view project communications with proper access" ON "public"."communications" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."user_projects" "up"
  WHERE (("up"."user_id" = "auth"."uid"()) AND ("up"."project_id" = "communications"."project_id")))) AND (("participants" ? ("auth"."uid"())::"text") OR (EXISTS ( SELECT 1
   FROM "public"."user_roles" "ur"
  WHERE (("ur"."user_id" = "auth"."uid"()) AND ("ur"."project_id" = "communications"."project_id") AND ("ur"."role" = ANY (ARRAY['admin'::"public"."app_role", 'gc'::"public"."app_role"]))))))));



CREATE POLICY "Users can view project integration logs" ON "public"."integration_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "integration_logs"."project_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can view project reports" ON "public"."reports" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."projects"
  WHERE (("projects"."id" = "reports"."project_id") AND ("projects"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can view purchase orders for their projects" ON "public"."purchase_orders" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view rfps for their projects" ON "public"."rfps" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view roles for projects they have access to" ON "public"."user_roles" FOR SELECT USING (("project_id" IN ( SELECT "user_projects"."project_id"
   FROM "public"."user_projects"
  WHERE ("user_projects"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view sensor readings for their projects" ON "public"."sensor_readings" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."sensors" "s"
  WHERE (("s"."id" = "sensor_readings"."sensor_id") AND "public"."has_project_access"("s"."project_id")))));



CREATE POLICY "Users can view sensors for their projects" ON "public"."sensors" FOR SELECT USING ("public"."has_project_access"("project_id"));



CREATE POLICY "Users can view their own dashboard layouts" ON "public"."user_dashboard_layouts" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view work orders for their projects" ON "public"."work_orders" FOR SELECT USING ("public"."has_project_access"("project_id"));



ALTER TABLE "public"."action_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."alerts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."alerts_sent" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow_own_org" ON "public"."projects" USING ((("org_id" IS NOT NULL) AND "public"."is_org_member"("org_id")));



CREATE POLICY "allow_project_access" ON "public"."alerts" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."alerts_sent" USING ((EXISTS ( SELECT 1
   FROM "public"."alerts" "a"
  WHERE (("a"."id" = "alerts_sent"."alert_id") AND "public"."has_project_access"("a"."project_id")))));



CREATE POLICY "allow_project_access" ON "public"."budget_items" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."documents" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."images" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."integration_logs" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."projects" USING ("public"."has_project_access"("id"));



CREATE POLICY "allow_project_access" ON "public"."reports" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."rfi" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."tasks" USING ("public"."has_project_access"("project_id"));



CREATE POLICY "allow_project_access" ON "public"."vector_index" USING ("public"."has_project_access"("project_id"));



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bim_files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."building_systems" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."capture_sets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."communications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."energy_consumption" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."external_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."insights" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."integration_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."integration_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."maintenance_schedules" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "members_can_update_org" ON "public"."organizations" FOR UPDATE USING ("public"."is_org_member"("id"));



CREATE POLICY "members_can_view_membership" ON "public"."org_members" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR "public"."is_org_member"("org_id")));



CREATE POLICY "members_can_view_org" ON "public"."organizations" FOR SELECT USING ("public"."is_org_member"("id"));



ALTER TABLE "public"."model_bindings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."org_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."purchase_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rfi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rfps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sensor_readings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sensors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_dashboard_layouts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_notification_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_can_manage_own_membership" ON "public"."org_members" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "users_own_access" ON "public"."user_projects" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."work_orders" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."action_items";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."capture_sets";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."insights";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."project_integrations";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_out"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_send"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_out"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_send"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_in"("cstring", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_out"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_recv"("internal", "oid", integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_send"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_typmod_in"("cstring"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(real[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(real[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(real[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(double precision[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(double precision[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(double precision[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(integer[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(integer[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(integer[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_halfvec"(numeric[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_sparsevec"(numeric[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."array_to_vector"(numeric[], integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_to_float4"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_to_sparsevec"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_to_vector"("public"."halfvec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_to_halfvec"("public"."sparsevec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec"("public"."sparsevec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_to_vector"("public"."sparsevec", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_float4"("public"."vector", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_halfvec"("public"."vector", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_to_sparsevec"("public"."vector", integer, boolean) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector"("public"."vector", integer, boolean) TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."binary_quantize"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cosine_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_accum"(double precision[], "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_add"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_avg"(double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_cmp"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_combine"(double precision[], double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_concat"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_eq"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_ge"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_gt"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_l2_squared_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_le"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_lt"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_mul"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_ne"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_negative_inner_product"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_spherical_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."halfvec_sub"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "postgres";
GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "anon";
GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hamming_distance"(bit, bit) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_admin_access"("_user_id" "uuid", "_project_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."has_admin_access"("_user_id" "uuid", "_project_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_admin_access"("_user_id" "uuid", "_project_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."has_project_access"("project_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."has_project_access"("project_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_project_access"("project_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_project_id" "uuid", "_role" "public"."app_role") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_project_id" "uuid", "_role" "public"."app_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_project_id" "uuid", "_role" "public"."app_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnsw_bit_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnsw_halfvec_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnsw_sparsevec_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hnswhandler"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."inner_product"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_org_member"("org_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_org_member"("org_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_org_member"("org_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflat_bit_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflat_halfvec_support"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."ivfflathandler"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "postgres";
GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "anon";
GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "authenticated";
GRANT ALL ON FUNCTION "public"."jaccard_distance"(bit, bit) TO "service_role";



GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l1_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."halfvec", "public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_norm"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."l2_normalize"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_documents"("query_embedding" "public"."vector", "match_count" integer, "filter_project_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."portfolio_metrics"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."portfolio_metrics"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."portfolio_metrics"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_communications"("query_embedding" "public"."vector", "project_uuid" "uuid", "match_count" integer, "similarity_threshold" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."search_communications"("query_embedding" "public"."vector", "project_uuid" "uuid", "match_count" integer, "similarity_threshold" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_communications"("query_embedding" "public"."vector", "project_uuid" "uuid", "match_count" integer, "similarity_threshold" double precision) TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_cmp"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_eq"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_ge"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_gt"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_l2_squared_distance"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_le"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_lt"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_ne"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "anon";
GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sparsevec_negative_inner_product"("public"."sparsevec", "public"."sparsevec") TO "service_role";



GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."subvector"("public"."halfvec", integer, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "anon";
GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."subvector"("public"."vector", integer, integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_communications_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_communications_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_communications_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_insights_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_insights_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_insights_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_integration_tokens_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_integration_tokens_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_integration_tokens_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_accum"(double precision[], "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_add"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_avg"(double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_cmp"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "anon";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_combine"(double precision[], double precision[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_concat"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_dims"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_eq"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ge"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_gt"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_l2_squared_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_le"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_lt"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_mul"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_ne"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_negative_inner_product"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_norm"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_spherical_distance"("public"."vector", "public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."vector_sub"("public"."vector", "public"."vector") TO "service_role";












GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."avg"("public"."vector") TO "service_role";



GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "postgres";
GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "anon";
GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sum"("public"."halfvec") TO "service_role";



GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "postgres";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "anon";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sum"("public"."vector") TO "service_role";









GRANT ALL ON TABLE "public"."action_items" TO "anon";
GRANT ALL ON TABLE "public"."action_items" TO "authenticated";
GRANT ALL ON TABLE "public"."action_items" TO "service_role";



GRANT ALL ON TABLE "public"."alerts" TO "anon";
GRANT ALL ON TABLE "public"."alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."alerts" TO "service_role";



GRANT ALL ON TABLE "public"."alerts_sent" TO "anon";
GRANT ALL ON TABLE "public"."alerts_sent" TO "authenticated";
GRANT ALL ON TABLE "public"."alerts_sent" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."bim_files" TO "anon";
GRANT ALL ON TABLE "public"."bim_files" TO "authenticated";
GRANT ALL ON TABLE "public"."bim_files" TO "service_role";



GRANT ALL ON TABLE "public"."budget_breakdown" TO "anon";
GRANT ALL ON TABLE "public"."budget_breakdown" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_breakdown" TO "service_role";



GRANT ALL ON TABLE "public"."budget_items" TO "anon";
GRANT ALL ON TABLE "public"."budget_items" TO "authenticated";
GRANT ALL ON TABLE "public"."budget_items" TO "service_role";



GRANT ALL ON TABLE "public"."building_systems" TO "anon";
GRANT ALL ON TABLE "public"."building_systems" TO "authenticated";
GRANT ALL ON TABLE "public"."building_systems" TO "service_role";



GRANT ALL ON TABLE "public"."capture_sets" TO "anon";
GRANT ALL ON TABLE "public"."capture_sets" TO "authenticated";
GRANT ALL ON TABLE "public"."capture_sets" TO "service_role";



GRANT ALL ON TABLE "public"."change_orders" TO "anon";
GRANT ALL ON TABLE "public"."change_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."change_orders" TO "service_role";



GRANT ALL ON TABLE "public"."communications" TO "anon";
GRANT ALL ON TABLE "public"."communications" TO "authenticated";
GRANT ALL ON TABLE "public"."communications" TO "service_role";



GRANT ALL ON TABLE "public"."construction_activities" TO "anon";
GRANT ALL ON TABLE "public"."construction_activities" TO "authenticated";
GRANT ALL ON TABLE "public"."construction_activities" TO "service_role";



GRANT ALL ON TABLE "public"."contractor_bids" TO "anon";
GRANT ALL ON TABLE "public"."contractor_bids" TO "authenticated";
GRANT ALL ON TABLE "public"."contractor_bids" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."energy_consumption" TO "anon";
GRANT ALL ON TABLE "public"."energy_consumption" TO "authenticated";
GRANT ALL ON TABLE "public"."energy_consumption" TO "service_role";



GRANT ALL ON TABLE "public"."equipment" TO "anon";
GRANT ALL ON TABLE "public"."equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment" TO "service_role";



GRANT ALL ON TABLE "public"."external_invites" TO "anon";
GRANT ALL ON TABLE "public"."external_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."external_invites" TO "service_role";



GRANT ALL ON TABLE "public"."images" TO "anon";
GRANT ALL ON TABLE "public"."images" TO "authenticated";
GRANT ALL ON TABLE "public"."images" TO "service_role";



GRANT ALL ON TABLE "public"."insights" TO "anon";
GRANT ALL ON TABLE "public"."insights" TO "authenticated";
GRANT ALL ON TABLE "public"."insights" TO "service_role";



GRANT ALL ON TABLE "public"."integration_logs" TO "anon";
GRANT ALL ON TABLE "public"."integration_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."integration_logs" TO "service_role";



GRANT ALL ON TABLE "public"."integration_tokens" TO "anon";
GRANT ALL ON TABLE "public"."integration_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."integration_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."maintenance_schedules" TO "anon";
GRANT ALL ON TABLE "public"."maintenance_schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."maintenance_schedules" TO "service_role";



GRANT ALL ON TABLE "public"."model_bindings" TO "anon";
GRANT ALL ON TABLE "public"."model_bindings" TO "authenticated";
GRANT ALL ON TABLE "public"."model_bindings" TO "service_role";



GRANT ALL ON TABLE "public"."org_members" TO "anon";
GRANT ALL ON TABLE "public"."org_members" TO "authenticated";
GRANT ALL ON TABLE "public"."org_members" TO "service_role";



GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";



GRANT ALL ON TABLE "public"."permit_status" TO "anon";
GRANT ALL ON TABLE "public"."permit_status" TO "authenticated";
GRANT ALL ON TABLE "public"."permit_status" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."safety_incidents" TO "anon";
GRANT ALL ON TABLE "public"."safety_incidents" TO "authenticated";
GRANT ALL ON TABLE "public"."safety_incidents" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";



GRANT ALL ON TABLE "public"."portfolio_health" TO "anon";
GRANT ALL ON TABLE "public"."portfolio_health" TO "authenticated";
GRANT ALL ON TABLE "public"."portfolio_health" TO "service_role";



GRANT ALL ON TABLE "public"."preconstruction_metrics" TO "anon";
GRANT ALL ON TABLE "public"."preconstruction_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."preconstruction_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."project_design_metrics" TO "anon";
GRANT ALL ON TABLE "public"."project_design_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."project_design_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."project_facilities_metrics" TO "anon";
GRANT ALL ON TABLE "public"."project_facilities_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."project_facilities_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."project_financial_metrics" TO "anon";
GRANT ALL ON TABLE "public"."project_financial_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."project_financial_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."project_insights" TO "anon";
GRANT ALL ON TABLE "public"."project_insights" TO "authenticated";
GRANT ALL ON TABLE "public"."project_insights" TO "service_role";



GRANT ALL ON TABLE "public"."project_integrations" TO "anon";
GRANT ALL ON TABLE "public"."project_integrations" TO "authenticated";
GRANT ALL ON TABLE "public"."project_integrations" TO "service_role";



GRANT ALL ON TABLE "public"."project_kpis" TO "anon";
GRANT ALL ON TABLE "public"."project_kpis" TO "authenticated";
GRANT ALL ON TABLE "public"."project_kpis" TO "service_role";



GRANT ALL ON TABLE "public"."project_legal_metrics" TO "anon";
GRANT ALL ON TABLE "public"."project_legal_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."project_legal_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."project_team" TO "anon";
GRANT ALL ON TABLE "public"."project_team" TO "authenticated";
GRANT ALL ON TABLE "public"."project_team" TO "service_role";



GRANT ALL ON TABLE "public"."purchase_orders" TO "anon";
GRANT ALL ON TABLE "public"."purchase_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."purchase_orders" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."rfi" TO "anon";
GRANT ALL ON TABLE "public"."rfi" TO "authenticated";
GRANT ALL ON TABLE "public"."rfi" TO "service_role";



GRANT ALL ON TABLE "public"."rfps" TO "anon";
GRANT ALL ON TABLE "public"."rfps" TO "authenticated";
GRANT ALL ON TABLE "public"."rfps" TO "service_role";



GRANT ALL ON TABLE "public"."sensor_readings" TO "anon";
GRANT ALL ON TABLE "public"."sensor_readings" TO "authenticated";
GRANT ALL ON TABLE "public"."sensor_readings" TO "service_role";



GRANT ALL ON TABLE "public"."sensors" TO "anon";
GRANT ALL ON TABLE "public"."sensors" TO "authenticated";
GRANT ALL ON TABLE "public"."sensors" TO "service_role";



GRANT ALL ON TABLE "public"."user_dashboard_layouts" TO "anon";
GRANT ALL ON TABLE "public"."user_dashboard_layouts" TO "authenticated";
GRANT ALL ON TABLE "public"."user_dashboard_layouts" TO "service_role";



GRANT ALL ON TABLE "public"."user_notification_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_notification_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_notification_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_projects" TO "anon";
GRANT ALL ON TABLE "public"."user_projects" TO "authenticated";
GRANT ALL ON TABLE "public"."user_projects" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."vector_index" TO "anon";
GRANT ALL ON TABLE "public"."vector_index" TO "authenticated";
GRANT ALL ON TABLE "public"."vector_index" TO "service_role";



GRANT ALL ON TABLE "public"."work_orders" TO "anon";
GRANT ALL ON TABLE "public"."work_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."work_orders" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
