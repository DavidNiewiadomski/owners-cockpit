-- Complete CRM System Migration
-- This migration adds all missing tables and features for a fully functional CRM system
-- Note: Enum types should be created by running 20250104000001_crm_enum_types.sql first

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- CRM Tasks table
CREATE TABLE IF NOT EXISTS crm_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contact(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES opportunity(id) ON DELETE SET NULL,
    assignee_id UUID NOT NULL,
    assignee_name TEXT,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'todo',
    due_date TIMESTAMP WITH TIME ZONE,
    reminder_date TIMESTAMP WITH TIME ZONE,
    estimated_hours NUMERIC(5,2),
    actual_hours NUMERIC(5,2),
    tags TEXT[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- CRM Documents table
CREATE TABLE IF NOT EXISTS crm_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type document_type NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    mime_type TEXT,
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contact(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES opportunity(id) ON DELETE SET NULL,
    version INTEGER DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    description TEXT,
    shared_with UUID[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- CRM Communications table
CREATE TABLE IF NOT EXISTS crm_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type communication_type NOT NULL,
    subject TEXT,
    content TEXT,
    preview TEXT,
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contact(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES opportunity(id) ON DELETE SET NULL,
    from_user_id UUID NOT NULL,
    to_contact_ids UUID[] DEFAULT '{}',
    cc_contact_ids UUID[] DEFAULT '{}',
    bcc_contact_ids UUID[] DEFAULT '{}',
    status communication_status DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER, -- For calls/meetings
    attendee_count INTEGER, -- For meetings
    attachments JSONB DEFAULT '[]',
    thread_id UUID,
    in_reply_to UUID REFERENCES crm_communications(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- CRM Activities table (audit log)
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'company', 'contact', 'opportunity', etc.
    entity_id UUID NOT NULL,
    activity_type activity_type NOT NULL,
    description TEXT,
    user_id UUID NOT NULL,
    user_name TEXT,
    changes JSONB DEFAULT '{}', -- Store field changes
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- CRM Analytics table (pre-computed metrics)
CREATE TABLE IF NOT EXISTS crm_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    metric_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
    total_companies INTEGER DEFAULT 0,
    active_companies INTEGER DEFAULT 0,
    total_contacts INTEGER DEFAULT 0,
    total_opportunities INTEGER DEFAULT 0,
    opportunities_by_stage JSONB DEFAULT '{}',
    total_pipeline_value NUMERIC DEFAULT 0,
    weighted_pipeline_value NUMERIC DEFAULT 0,
    conversion_rate NUMERIC(5,2) DEFAULT 0,
    avg_deal_size NUMERIC DEFAULT 0,
    win_rate NUMERIC(5,2) DEFAULT 0,
    activities_count INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    communications_sent INTEGER DEFAULT 0,
    diversity_metrics JSONB DEFAULT '{}',
    risk_metrics JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_date, metric_type)
);

-- CRM Tags table (for flexible categorization)
CREATE TABLE IF NOT EXISTS crm_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    category TEXT,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM Templates table (for email/document templates)
CREATE TABLE IF NOT EXISTS crm_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'email', 'document', 'proposal', etc.
    subject TEXT,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- List of template variables
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM Campaigns table (for marketing campaigns)
CREATE TABLE IF NOT EXISTS crm_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT, -- 'email', 'event', 'webinar', etc.
    status TEXT DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    start_date DATE,
    end_date DATE,
    target_audience JSONB DEFAULT '{}', -- Criteria for targeting
    budget NUMERIC,
    actual_cost NUMERIC DEFAULT 0,
    metrics JSONB DEFAULT '{}', -- Campaign performance metrics
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM Campaign Members table
CREATE TABLE IF NOT EXISTS crm_campaign_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES crm_campaigns(id) ON DELETE CASCADE,
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contact(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'targeted', -- 'targeted', 'engaged', 'converted', 'opted_out'
    engagement_score NUMERIC DEFAULT 0,
    interactions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add additional columns to existing tables
-- Note: PostgreSQL doesn't support multiple ADD COLUMN IF NOT EXISTS in one statement
-- We need to add each column separately
DO $$ BEGIN
    ALTER TABLE company ADD COLUMN IF NOT EXISTS website TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS city TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS state TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS zip_code TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA';
    ALTER TABLE company ADD COLUMN IF NOT EXISTS employees INTEGER;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS annual_revenue NUMERIC;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS bonding_capacity NUMERIC;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS duns_number TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS tax_id TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
    ALTER TABLE company ADD COLUMN IF NOT EXISTS insurance_expiry DATE;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS license_number TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS license_expiry DATE;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS payment_terms TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS credit_limit NUMERIC;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
    ALTER TABLE company ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
    ALTER TABLE company ADD COLUMN IF NOT EXISTS is_preferred BOOLEAN DEFAULT FALSE;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS parent_company_id UUID REFERENCES company(id);
    ALTER TABLE company ADD COLUMN IF NOT EXISTS source TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS industry TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS sic_code TEXT;
    ALTER TABLE company ADD COLUMN IF NOT EXISTS naics_code TEXT;
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS mobile_phone TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS office_phone TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS fax TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS department TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS reports_to UUID REFERENCES contact(id);
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS assistant_name TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS assistant_phone TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS birthdate DATE;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS gender TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS marital_status TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS spouse_name TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS children INTEGER;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS hobbies TEXT[];
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS best_time_to_contact TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS do_not_call BOOLEAN DEFAULT FALSE;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS do_not_email BOOLEAN DEFAULT FALSE;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS opted_out BOOLEAN DEFAULT FALSE;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS lead_source TEXT;
    ALTER TABLE contact ADD COLUMN IF NOT EXISTS avatar_url TEXT;
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS project_type TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS probability NUMERIC(5,2) DEFAULT 0;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS expected_close_date DATE;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS actual_close_date DATE;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS lead_source TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES crm_campaigns(id);
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS competitors TEXT[] DEFAULT '{}';
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS strengths TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS weaknesses TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS notes TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS is_won BOOLEAN;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS won_amount NUMERIC;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS lost_reason TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS next_steps TEXT;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS decision_criteria TEXT[];
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS decision_makers JSONB DEFAULT '[]';
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS budget_confirmed BOOLEAN DEFAULT FALSE;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS proposal_sent_date DATE;
    ALTER TABLE opportunity ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE;
EXCEPTION WHEN others THEN null;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assignee ON crm_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_company ON crm_tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_priority ON crm_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_crm_documents_company ON crm_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_documents_type ON crm_documents(type);
CREATE INDEX IF NOT EXISTS idx_crm_documents_uploaded_by ON crm_documents(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_crm_communications_company ON crm_communications(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_communications_type ON crm_communications(type);
CREATE INDEX IF NOT EXISTS idx_crm_communications_status ON crm_communications(status);
CREATE INDEX IF NOT EXISTS idx_crm_communications_from_user ON crm_communications(from_user_id);

CREATE INDEX IF NOT EXISTS idx_crm_activities_entity ON crm_activities(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_company ON crm_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_user ON crm_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created ON crm_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_crm_analytics_date ON crm_analytics(metric_date, metric_type);

-- Create full-text search indexes with proper handling
DO $$ BEGIN
    CREATE INDEX idx_company_search ON company USING gin(
        to_tsvector('english', COALESCE(name, ''))
    );
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_contact_search ON contact USING gin(
        to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(email, ''))
    );
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_crm_tasks_search ON crm_tasks USING gin(
        to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
    );
EXCEPTION WHEN others THEN null;
END $$;

-- Create views for common queries
CREATE OR REPLACE VIEW crm_company_overview AS
SELECT 
    c.*,
    COUNT(DISTINCT con.id) as contact_count,
    COUNT(DISTINCT o.id) as opportunity_count,
    SUM(o.est_value) as total_opportunity_value,
    COUNT(DISTINCT t.id) as task_count,
    COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'done') as completed_tasks,
    MAX(i.date) as last_interaction_date
FROM company c
LEFT JOIN contact con ON con.company_id = c.id
LEFT JOIN opportunity o ON o.company_id = c.id
LEFT JOIN crm_tasks t ON t.company_id = c.id
LEFT JOIN interaction i ON i.company_id = c.id
GROUP BY c.id;

CREATE OR REPLACE VIEW crm_opportunity_pipeline AS
SELECT 
    o.*,
    c.name as company_name,
    c.type as company_type,
    c.risk_score,
    COUNT(DISTINCT t.id) as task_count,
    COUNT(DISTINCT comm.id) as communication_count,
    MAX(comm.created_at) as last_communication_date
FROM opportunity o
LEFT JOIN company c ON o.company_id = c.id
LEFT JOIN crm_tasks t ON t.opportunity_id = o.id
LEFT JOIN crm_communications comm ON comm.opportunity_id = o.id
GROUP BY o.id, c.id;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION calculate_opportunity_score(opp_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    score NUMERIC := 0;
    opp RECORD;
BEGIN
    SELECT * INTO opp FROM opportunity WHERE id = opp_id;
    
    -- Base score from probability
    score := COALESCE(opp.probability, 0);
    
    -- Adjust based on stage
    CASE opp.stage
        WHEN 'negotiation' THEN score := score + 20;
        WHEN 'invited' THEN score := score + 15;
        WHEN 'shortlisted' THEN score := score + 10;
        WHEN 'prospect' THEN score := score + 5;
    END CASE;
    
    -- Adjust based on value
    IF opp.est_value > 1000000 THEN
        score := score + 10;
    ELSIF opp.est_value > 500000 THEN
        score := score + 5;
    END IF;
    
    -- Cap at 100
    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates
CREATE TRIGGER update_crm_tasks_updated_at BEFORE UPDATE ON crm_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_documents_updated_at BEFORE UPDATE ON crm_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_communications_updated_at BEFORE UPDATE ON crm_communications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_tags_updated_at BEFORE UPDATE ON crm_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_templates_updated_at BEFORE UPDATE ON crm_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_campaigns_updated_at BEFORE UPDATE ON crm_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for activity logging
CREATE OR REPLACE FUNCTION log_crm_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Log creates
    IF TG_OP = 'INSERT' THEN
        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type, 
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'created',
            COALESCE(NEW.created_by, NEW.user_id, auth.uid()),
            NEW.company_id,
            to_jsonb(NEW)
        );
    
    -- Log updates
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type,
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'updated',
            auth.uid(),
            NEW.company_id,
            jsonb_build_object(
                'old', to_jsonb(OLD),
                'new', to_jsonb(NEW)
            )
        );
    
    -- Log deletes
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type,
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, OLD.id, 'deleted',
            auth.uid(),
            OLD.company_id,
            to_jsonb(OLD)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging to main tables
CREATE TRIGGER log_company_activity
    AFTER INSERT OR UPDATE OR DELETE ON company
    FOR EACH ROW EXECUTE FUNCTION log_crm_activity();

CREATE TRIGGER log_contact_activity
    AFTER INSERT OR UPDATE OR DELETE ON contact
    FOR EACH ROW EXECUTE FUNCTION log_crm_activity();

CREATE TRIGGER log_opportunity_activity
    AFTER INSERT OR UPDATE OR DELETE ON opportunity
    FOR EACH ROW EXECUTE FUNCTION log_crm_activity();

-- Row Level Security
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_campaign_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CRM_ADMIN (full access)
CREATE POLICY "CRM_ADMIN full access on crm_tasks" ON crm_tasks
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_documents" ON crm_documents
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_communications" ON crm_communications
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_activities" ON crm_activities
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_analytics" ON crm_analytics
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_tags" ON crm_tags
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_templates" ON crm_templates
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_campaigns" ON crm_campaigns
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN full access on crm_campaign_members" ON crm_campaign_members
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

-- RLS Policies for CRM_USER (restricted access)
CREATE POLICY "CRM_USER can view assigned tasks" ON crm_tasks
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'CRM_USER' AND 
        (assignee_id = auth.uid() OR created_by = auth.uid())
    );

CREATE POLICY "CRM_USER can create tasks" ON crm_tasks
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'CRM_USER');

CREATE POLICY "CRM_USER can update own tasks" ON crm_tasks
    FOR UPDATE USING (
        auth.jwt() ->> 'role' = 'CRM_USER' AND 
        (assignee_id = auth.uid() OR created_by = auth.uid())
    );

CREATE POLICY "CRM_USER can view documents" ON crm_documents
    FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN') AND
        (is_public = TRUE OR uploaded_by = auth.uid() OR auth.uid() = ANY(shared_with))
    );

CREATE POLICY "CRM_USER can upload documents" ON crm_documents
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can view communications" ON crm_communications
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can create communications" ON crm_communications
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can view activities" ON crm_activities
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "Users can view analytics" ON crm_analytics
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "Users can view tags" ON crm_tags
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "Users can view templates" ON crm_templates
    FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN') AND
        is_active = TRUE
    );

CREATE POLICY "Users can view campaigns" ON crm_campaigns
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

-- Create function to generate analytics
CREATE OR REPLACE FUNCTION generate_crm_analytics(p_date DATE, p_type TEXT)
RETURNS VOID AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    -- Determine date range based on type
    CASE p_type
        WHEN 'daily' THEN
            v_start_date := p_date;
            v_end_date := p_date + INTERVAL '1 day';
        WHEN 'weekly' THEN
            v_start_date := date_trunc('week', p_date);
            v_end_date := v_start_date + INTERVAL '1 week';
        WHEN 'monthly' THEN
            v_start_date := date_trunc('month', p_date);
            v_end_date := v_start_date + INTERVAL '1 month';
    END CASE;
    
    -- Insert or update analytics
    INSERT INTO crm_analytics (
        metric_date, metric_type,
        total_companies, active_companies,
        total_contacts, total_opportunities,
        opportunities_by_stage, total_pipeline_value,
        weighted_pipeline_value, conversion_rate,
        avg_deal_size, win_rate,
        activities_count, tasks_completed,
        communications_sent, diversity_metrics,
        risk_metrics, performance_metrics
    )
    SELECT
        p_date, p_type,
        COUNT(DISTINCT c.id),
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active'),
        COUNT(DISTINCT con.id),
        COUNT(DISTINCT o.id),
        COALESCE((
            SELECT jsonb_object_agg(stage, stage_count) 
            FROM (
                SELECT stage, COUNT(*) as stage_count 
                FROM opportunity 
                WHERE created_at >= v_start_date AND created_at < v_end_date
                GROUP BY stage
            ) s
        ), '{}'),
        SUM(o.est_value),
        SUM(o.est_value * o.probability / 100),
        AVG(o.probability),
        AVG(o.est_value),
        COUNT(o.id) FILTER (WHERE o.is_won = TRUE) * 100.0 / NULLIF(COUNT(o.id), 0),
        COUNT(DISTINCT a.id),
        COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'done'),
        COUNT(DISTINCT comm.id) FILTER (WHERE comm.status IN ('sent', 'delivered')),
        jsonb_build_object(
            'mbe_count', COUNT(DISTINCT c.id) FILTER (WHERE c.diversity_flags->>'minority_owned' = 'true'),
            'wbe_count', COUNT(DISTINCT c.id) FILTER (WHERE c.diversity_flags->>'woman_owned' = 'true'),
            'vbe_count', COUNT(DISTINCT c.id) FILTER (WHERE c.diversity_flags->>'veteran_owned' = 'true')
        ),
        jsonb_build_object(
            'low_risk', COUNT(DISTINCT c.id) FILTER (WHERE c.risk_score <= 20),
            'medium_risk', COUNT(DISTINCT c.id) FILTER (WHERE c.risk_score > 20 AND c.risk_score <= 60),
            'high_risk', COUNT(DISTINCT c.id) FILTER (WHERE c.risk_score > 60)
        ),
        jsonb_build_object(
            'avg_performance', AVG(c.performance_score),
            'top_performers', COUNT(DISTINCT c.id) FILTER (WHERE c.performance_score >= 90)
        )
    FROM company c
    LEFT JOIN contact con ON con.company_id = c.id
    LEFT JOIN opportunity o ON o.company_id = c.id AND o.created_at >= v_start_date AND o.created_at < v_end_date
    LEFT JOIN crm_activities a ON a.created_at >= v_start_date AND a.created_at < v_end_date
    LEFT JOIN crm_tasks t ON t.created_at >= v_start_date AND t.created_at < v_end_date
    LEFT JOIN crm_communications comm ON comm.created_at >= v_start_date AND comm.created_at < v_end_date
    ON CONFLICT (metric_date, metric_type) DO UPDATE SET
        total_companies = EXCLUDED.total_companies,
        active_companies = EXCLUDED.active_companies,
        total_contacts = EXCLUDED.total_contacts,
        total_opportunities = EXCLUDED.total_opportunities,
        opportunities_by_stage = EXCLUDED.opportunities_by_stage,
        total_pipeline_value = EXCLUDED.total_pipeline_value,
        weighted_pipeline_value = EXCLUDED.weighted_pipeline_value,
        conversion_rate = EXCLUDED.conversion_rate,
        avg_deal_size = EXCLUDED.avg_deal_size,
        win_rate = EXCLUDED.win_rate,
        activities_count = EXCLUDED.activities_count,
        tasks_completed = EXCLUDED.tasks_completed,
        communications_sent = EXCLUDED.communications_sent,
        diversity_metrics = EXCLUDED.diversity_metrics,
        risk_metrics = EXCLUDED.risk_metrics,
        performance_metrics = EXCLUDED.performance_metrics,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Add performance_score column to company if it doesn't exist
ALTER TABLE company ADD COLUMN IF NOT EXISTS performance_score NUMERIC(5,2) DEFAULT 0;

-- Create a scheduled job to generate analytics (requires pg_cron extension)
-- This would be set up separately in production
-- SELECT cron.schedule('generate-daily-crm-analytics', '0 1 * * *', 
--     $$SELECT generate_crm_analytics(CURRENT_DATE - INTERVAL '1 day', 'daily')$$);
