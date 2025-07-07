-- Create risk analysis table for comprehensive procurement risk management
-- This table tracks identified risks, their likelihood, impact, and mitigation strategies

-- Create enum types for risk analysis
CREATE TYPE risk_category AS ENUM ('financial', 'technical', 'legal', 'operational', 'reputational');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE mitigation_status AS ENUM ('not_started', 'in_progress', 'implemented', 'monitoring');

-- Table: risk_analysis - Comprehensive risk tracking and mitigation
CREATE TABLE risk_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    
    -- Risk identification
    risk_category risk_category NOT NULL,
    risk_level risk_level NOT NULL,
    risk_description TEXT NOT NULL,
    
    -- Risk assessment
    likelihood INTEGER NOT NULL CHECK (likelihood BETWEEN 1 AND 5),
    impact INTEGER NOT NULL CHECK (impact BETWEEN 1 AND 5),
    risk_score INTEGER GENERATED ALWAYS AS (likelihood * impact) STORED,
    
    -- Mitigation planning
    mitigation_strategy TEXT NOT NULL,
    mitigation_status mitigation_status DEFAULT 'not_started',
    mitigation_owner UUID, -- References user responsible for mitigation
    mitigation_deadline DATE,
    
    -- Risk tracking
    identified_by UUID NOT NULL,
    identified_at TIMESTAMP WITH TIME ZONE NOT NULL,
    review_date DATE,
    reviewed_by UUID,
    
    -- Additional details
    notes TEXT,
    attachments JSONB DEFAULT '[]', -- Array of attachment URLs/metadata
    related_risks UUID[], -- Array of related risk IDs
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_risk_analysis_bid_id ON risk_analysis(bid_id);
CREATE INDEX idx_risk_analysis_submission_id ON risk_analysis(submission_id);
CREATE INDEX idx_risk_analysis_risk_category ON risk_analysis(risk_category);
CREATE INDEX idx_risk_analysis_risk_level ON risk_analysis(risk_level);
CREATE INDEX idx_risk_analysis_mitigation_status ON risk_analysis(mitigation_status);
CREATE INDEX idx_risk_analysis_identified_by ON risk_analysis(identified_by);
CREATE INDEX idx_risk_analysis_risk_score ON risk_analysis(risk_score);

-- Add updated_at trigger
CREATE TRIGGER update_risk_analysis_updated_at 
    BEFORE UPDATE ON risk_analysis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE risk_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for BID_ADMIN (full access)
CREATE POLICY "BID_ADMIN_full_access_risk_analysis" ON risk_analysis
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_ADMIN'
        )
    );

-- RLS Policies for BID_REVIEWER (full access)
CREATE POLICY "BID_REVIEWER_full_access_risk_analysis" ON risk_analysis
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

-- RLS Policies for BID_VIEWER (read only)
CREATE POLICY "BID_VIEWER_read_risk_analysis" ON risk_analysis
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_VIEWER'
        )
    );

-- Helper function to calculate risk matrix summary
CREATE OR REPLACE FUNCTION get_risk_matrix_summary(p_bid_id UUID)
RETURNS TABLE (
    total_risks INTEGER,
    critical_risks INTEGER,
    high_risks INTEGER,
    medium_risks INTEGER,
    low_risks INTEGER,
    avg_risk_score NUMERIC,
    mitigation_coverage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_risks,
        COUNT(*) FILTER (WHERE risk_level = 'critical')::INTEGER as critical_risks,
        COUNT(*) FILTER (WHERE risk_level = 'high')::INTEGER as high_risks,
        COUNT(*) FILTER (WHERE risk_level = 'medium')::INTEGER as medium_risks,
        COUNT(*) FILTER (WHERE risk_level = 'low')::INTEGER as low_risks,
        AVG(risk_score)::NUMERIC as avg_risk_score,
        (COUNT(*) FILTER (WHERE mitigation_strategy IS NOT NULL AND mitigation_strategy != '')::NUMERIC / 
         NULLIF(COUNT(*)::NUMERIC, 0) * 100) as mitigation_coverage
    FROM risk_analysis
    WHERE bid_id = p_bid_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to update risk level based on score
CREATE OR REPLACE FUNCTION update_risk_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Update risk level based on calculated risk score
    IF NEW.risk_score <= 6 THEN
        NEW.risk_level = 'low';
    ELSIF NEW.risk_score <= 12 THEN
        NEW.risk_level = 'medium';
    ELSIF NEW.risk_score <= 20 THEN
        NEW.risk_level = 'high';
    ELSE
        NEW.risk_level = 'critical';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update risk level
CREATE TRIGGER update_risk_level_trigger
    BEFORE INSERT OR UPDATE OF likelihood, impact ON risk_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_risk_level();

-- Add table comment
COMMENT ON TABLE risk_analysis IS 'Comprehensive risk tracking and mitigation for procurement bids';
COMMENT ON COLUMN risk_analysis.risk_score IS 'Calculated as likelihood * impact (1-25 scale)';
