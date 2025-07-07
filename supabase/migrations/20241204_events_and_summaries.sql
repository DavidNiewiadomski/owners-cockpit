-- Events and Performance Summaries Migration
-- Support for KPI collector service events and AI-generated summaries

-- Events table for tracking system events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    company_id UUID REFERENCES company(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    period TEXT,
    error_message TEXT,
    error_stack TEXT,
    context JSONB,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance summaries table for AI-generated reports
CREATE TABLE IF NOT EXISTS performance_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    summary TEXT NOT NULL,
    overall_score NUMERIC,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one summary per company/period combination
    UNIQUE(company_id, period)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_company_id ON events(company_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_type_timestamp ON events(type, timestamp);

CREATE INDEX IF NOT EXISTS idx_performance_summaries_company_period ON performance_summaries(company_id, period);
CREATE INDEX IF NOT EXISTS idx_performance_summaries_generated_at ON performance_summaries(generated_at);

-- RLS Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_summaries ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read events
CREATE POLICY "Users can read events" ON events
    FOR SELECT TO authenticated USING (true);

-- Allow service role to manage events
CREATE POLICY "Service can manage events" ON events
    FOR ALL TO service_role USING (true);

-- Allow authenticated users to read performance summaries
CREATE POLICY "Users can read performance summaries" ON performance_summaries
    FOR SELECT TO authenticated USING (true);

-- Allow service role to manage performance summaries
CREATE POLICY "Service can manage performance summaries" ON performance_summaries
    FOR ALL TO service_role USING (true);

-- Allow authenticated users to manage their own company summaries
-- NOTE: Commented out due to missing user_companies table
-- CREATE POLICY "Users can manage company summaries" ON performance_summaries
--     FOR ALL TO authenticated 
--     USING (
--         company_id IN (
--             SELECT company_id FROM user_companies WHERE user_id = auth.uid()
--         )
--     );

-- Function to clean up old events (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_events()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent events for a company
CREATE OR REPLACE FUNCTION get_company_events(
    p_company_id UUID,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    type TEXT,
    period TEXT,
    metadata JSONB,
    event_timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.type,
        e.period,
        e.metadata,
        e.timestamp AS event_timestamp
    FROM events e
    WHERE e.company_id = p_company_id
    ORDER BY e.timestamp DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get latest performance summary
CREATE OR REPLACE FUNCTION get_latest_performance_summary(
    p_company_id UUID
)
RETURNS TABLE (
    period TEXT,
    summary TEXT,
    overall_score NUMERIC,
    generated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.period,
        ps.summary,
        ps.overall_score,
        ps.generated_at
    FROM performance_summaries ps
    WHERE ps.company_id = p_company_id
    ORDER BY ps.generated_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add missing columns to existing tables if they don't exist
DO $$
BEGIN
    -- Add procore_project_id to projects if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'procore_project_id'
    ) THEN
        ALTER TABLE projects ADD COLUMN procore_project_id TEXT;
        CREATE INDEX IF NOT EXISTS idx_projects_procore_id ON projects(procore_project_id);
    END IF;

    -- Add procore_company_id to company if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'company' AND column_name = 'procore_company_id'
    ) THEN
        ALTER TABLE company ADD COLUMN procore_company_id TEXT;
        CREATE INDEX IF NOT EXISTS idx_company_procore_id ON company(procore_company_id);
    END IF;

    -- Add industry column to company if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'company' AND column_name = 'industry'
    ) THEN
        ALTER TABLE company ADD COLUMN industry TEXT;
    END IF;
END $$;
