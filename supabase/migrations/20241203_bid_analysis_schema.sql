-- Create tables for comprehensive bid analysis system
-- This migration sets up the complete database schema for the bid leveling functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CSI Code structure
CREATE TABLE csi_divisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    division_number VARCHAR(2) NOT NULL UNIQUE,
    division_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE csi_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    division_id UUID REFERENCES csi_divisions(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects and RFPs
CREATE TABLE bid_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id VARCHAR(50) NOT NULL UNIQUE,
    project_name VARCHAR(255) NOT NULL,
    project_location VARCHAR(255),
    facility_id VARCHAR(50),
    total_budget DECIMAL(15,2),
    project_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'bidding', 'evaluation', 'awarded', 'cancelled')),
    bid_due_date TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER, -- days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Line items for bidding
CREATE TABLE bid_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_project_id UUID REFERENCES bid_projects(id) ON DELETE CASCADE,
    csi_code_id UUID REFERENCES csi_codes(id),
    csi_code VARCHAR(10),
    item_number VARCHAR(50),
    description TEXT NOT NULL,
    specification_section VARCHAR(100),
    quantity DECIMAL(12,4) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    engineer_estimate DECIMAL(12,2),
    unit_price_estimate DECIMAL(12,2),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    notes TEXT,
    is_allowance BOOLEAN DEFAULT FALSE,
    is_alternate BOOLEAN DEFAULT FALSE,
    is_unit_price BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor information
CREATE TABLE bid_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company_type VARCHAR(20) CHECK (company_type IN ('gc', 'subcontractor', 'supplier', 'manufacturer')),
    license_number VARCHAR(100),
    bonding_capacity DECIMAL(15,2),
    insurance_limits JSONB, -- Store insurance limits as JSON
    certifications TEXT[],
    minority_owned BOOLEAN DEFAULT FALSE,
    woman_owned BOOLEAN DEFAULT FALSE,
    veteran_owned BOOLEAN DEFAULT FALSE,
    small_business BOOLEAN DEFAULT FALSE,
    contact_info JSONB, -- Store contact information as JSON
    performance_history JSONB, -- Store performance metrics as JSON
    prequalification_status VARCHAR(20) DEFAULT 'pending' CHECK (prequalification_status IN ('approved', 'pending', 'rejected', 'expired')),
    prequalification_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor bid submissions
CREATE TABLE vendor_bid_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_project_id UUID REFERENCES bid_projects(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES bid_vendors(id) ON DELETE CASCADE,
    submission_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_base_bid DECIMAL(15,2) NOT NULL,
    total_alternates DECIMAL(15,2) DEFAULT 0,
    total_bid_amount DECIMAL(15,2) NOT NULL,
    bid_bond_amount DECIMAL(15,2),
    performance_bond_rate DECIMAL(5,2),
    unit_price_schedule BOOLEAN DEFAULT FALSE,
    exceptions_taken INTEGER DEFAULT 0,
    clarifications_requested INTEGER DEFAULT 0,
    compliance_status VARCHAR(20) DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'non_compliant', 'conditional')),
    compliance_notes TEXT,
    submitted_documents JSONB, -- Store document checklist as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bid_project_id, vendor_id)
);

-- Line item pricing from vendors
CREATE TABLE vendor_line_item_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_submission_id UUID REFERENCES vendor_bid_submissions(id) ON DELETE CASCADE,
    line_item_id UUID REFERENCES bid_line_items(id) ON DELETE CASCADE,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    is_alternate BOOLEAN DEFAULT FALSE,
    is_no_bid BOOLEAN DEFAULT FALSE,
    is_allowance BOOLEAN DEFAULT FALSE,
    vendor_notes TEXT,
    clarification_requested TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vendor_submission_id, line_item_id)
);

-- Statistical analysis results
CREATE TABLE line_item_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_item_id UUID REFERENCES bid_line_items(id) ON DELETE CASCADE,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    participating_vendors INTEGER NOT NULL,
    responding_vendors INTEGER NOT NULL,
    no_bid_count INTEGER DEFAULT 0,
    
    -- Price statistics
    low_bid DECIMAL(12,2),
    high_bid DECIMAL(12,2),
    average_bid DECIMAL(12,2),
    median_bid DECIMAL(12,2),
    standard_deviation DECIMAL(12,2),
    coefficient_variation DECIMAL(8,4),
    
    -- Engineer's estimate comparison
    engineer_estimate DECIMAL(12,2),
    avg_vs_estimate_variance DECIMAL(8,4),
    median_vs_estimate_variance DECIMAL(8,4),
    
    -- Outlier detection
    outlier_threshold DECIMAL(12,2),
    outlier_vendor_ids UUID[],
    outlier_count INTEGER DEFAULT 0,
    
    -- Risk assessment
    price_volatility VARCHAR(10) CHECK (price_volatility IN ('low', 'medium', 'high')),
    market_competitiveness VARCHAR(10) CHECK (market_competitiveness IN ('poor', 'fair', 'good', 'excellent')),
    recommendation TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor evaluation scores
CREATE TABLE vendor_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_submission_id UUID REFERENCES vendor_bid_submissions(id) ON DELETE CASCADE,
    evaluator_id UUID, -- Reference to user who performed evaluation
    evaluation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Technical scoring (0-100)
    technical_score DECIMAL(5,2),
    technical_criteria JSONB, -- Store detailed technical criteria scores
    
    -- Commercial scoring (0-100)
    commercial_score DECIMAL(5,2),
    commercial_criteria JSONB, -- Store detailed commercial criteria scores
    
    -- Compliance scoring
    compliance_score DECIMAL(5,2),
    compliance_items JSONB, -- Store compliance checklist
    
    -- Overall evaluation
    composite_score DECIMAL(5,2),
    ranking INTEGER,
    recommendation VARCHAR(20) CHECK (recommendation IN ('award', 'consider', 'reject')),
    evaluator_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vendor_submission_id, evaluator_id)
);

-- Bid leveling adjustments
CREATE TABLE bid_leveling_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_item_analysis_id UUID REFERENCES line_item_analyses(id) ON DELETE CASCADE,
    vendor_line_item_bid_id UUID REFERENCES vendor_line_item_bids(id) ON DELETE CASCADE,
    adjustment_type VARCHAR(30) CHECK (adjustment_type IN ('scope_clarification', 'unit_price_correction', 'quantity_adjustment', 'alternate_inclusion', 'other')),
    original_amount DECIMAL(12,2) NOT NULL,
    adjusted_amount DECIMAL(12,2) NOT NULL,
    adjustment_reason TEXT NOT NULL,
    approved_by UUID, -- Reference to user who approved
    approval_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BAFO (Best and Final Offer) management
CREATE TABLE bafo_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_project_id UUID REFERENCES bid_projects(id) ON DELETE CASCADE,
    vendor_ids UUID[],
    request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    scope_clarifications TEXT,
    price_adjustments_allowed BOOLEAN DEFAULT TRUE,
    specific_items TEXT[],
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'responses_pending', 'completed', 'cancelled')),
    created_by UUID, -- Reference to user who created request
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bafo_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bafo_request_id UUID REFERENCES bafo_requests(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES bid_vendors(id) ON DELETE CASCADE,
    response_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revised_total_bid DECIMAL(15,2) NOT NULL,
    line_item_adjustments JSONB, -- Store line item adjustments as JSON
    additional_clarifications TEXT,
    acceptance_status VARCHAR(20) DEFAULT 'accepted' CHECK (acceptance_status IN ('accepted', 'declined', 'conditional')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bafo_request_id, vendor_id)
);

-- Award recommendations
CREATE TABLE award_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_project_id UUID REFERENCES bid_projects(id) ON DELETE CASCADE,
    recommended_vendor_id UUID REFERENCES bid_vendors(id) ON DELETE CASCADE,
    recommendation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recommended_amount DECIMAL(15,2) NOT NULL,
    
    -- Justification
    technical_justification TEXT,
    commercial_justification TEXT,
    risk_assessment TEXT,
    
    -- Alternative considerations
    second_choice_vendor_id UUID REFERENCES bid_vendors(id),
    second_choice_amount DECIMAL(15,2),
    
    -- Approval workflow
    prepared_by UUID, -- Reference to user who prepared
    reviewed_by UUID, -- Reference to user who reviewed
    approved_by UUID, -- Reference to user who approved
    approval_status VARCHAR(20) DEFAULT 'draft' CHECK (approval_status IN ('draft', 'under_review', 'approved', 'rejected')),
    approval_date TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bid protests and disputes
CREATE TABLE bid_protests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_project_id UUID REFERENCES bid_projects(id) ON DELETE CASCADE,
    protesting_vendor_id UUID REFERENCES bid_vendors(id) ON DELETE CASCADE,
    protest_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    protest_grounds TEXT[],
    description TEXT NOT NULL,
    requested_remedy TEXT,
    status VARCHAR(20) DEFAULT 'filed' CHECK (status IN ('filed', 'under_review', 'upheld', 'denied', 'withdrawn')),
    resolution_date TIMESTAMP WITH TIME ZONE,
    resolution_summary TEXT,
    impact_on_award BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market analysis and benchmarking
CREATE TABLE market_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    csi_division_id UUID REFERENCES csi_divisions(id),
    analysis_period_start DATE NOT NULL,
    analysis_period_end DATE NOT NULL,
    
    -- Market conditions
    market_activity_level VARCHAR(10) CHECK (market_activity_level IN ('low', 'moderate', 'high', 'very_high')),
    price_trend VARCHAR(10) CHECK (price_trend IN ('declining', 'stable', 'increasing', 'volatile')),
    material_cost_index DECIMAL(8,4),
    labor_availability VARCHAR(10) CHECK (labor_availability IN ('abundant', 'adequate', 'tight', 'critical')),
    
    -- Benchmarking data
    regional_price_index DECIMAL(8,4),
    historical_price_variance DECIMAL(8,4),
    seasonal_adjustments DECIMAL[],
    economic_indicators JSONB, -- Store economic data as JSON
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document management
CREATE TABLE bid_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_project_id UUID REFERENCES bid_projects(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES bid_vendors(id) ON DELETE SET NULL,
    document_type VARCHAR(20) CHECK (document_type IN ('rfp', 'addendum', 'bid_submission', 'clarification', 'evaluation', 'award_letter', 'contract')),
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_path VARCHAR(500),
    mime_type VARCHAR(100),
    version VARCHAR(20) DEFAULT '1.0',
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID, -- Reference to user who uploaded
    access_level VARCHAR(15) DEFAULT 'restricted' CHECK (access_level IN ('public', 'restricted', 'confidential')),
    retention_period INTEGER DEFAULT 2555, -- days (7 years default)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and reporting
CREATE TABLE bid_analytics_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(30) CHECK (report_type IN ('project_summary', 'vendor_performance', 'market_analysis', 'cost_comparison')),
    report_period_start DATE,
    report_period_end DATE,
    parameters JSONB, -- Store report parameters as JSON
    generated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by UUID, -- Reference to user who generated
    file_path VARCHAR(500),
    
    -- Summary metrics
    summary_data JSONB, -- Store summary metrics as JSON
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuration and settings
CREATE TABLE bid_analysis_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID, -- Reference to organization
    
    -- Outlier detection settings
    outlier_detection_method VARCHAR(20) DEFAULT 'iqr' CHECK (outlier_detection_method IN ('iqr', 'standard_deviation', 'modified_z_score')),
    outlier_threshold DECIMAL(8,4) DEFAULT 1.5,
    minimum_bids_for_analysis INTEGER DEFAULT 3,
    
    -- Evaluation weights
    technical_weight DECIMAL(5,2) DEFAULT 40.0,
    commercial_weight DECIMAL(5,2) DEFAULT 40.0,
    compliance_weight DECIMAL(5,2) DEFAULT 20.0,
    
    -- Approval thresholds
    approval_threshold_amount DECIMAL(15,2) DEFAULT 100000.0,
    dual_approval_threshold DECIMAL(15,2) DEFAULT 500000.0,
    
    -- Notification settings
    notification_preferences JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bid_projects_rfp_id ON bid_projects(rfp_id);
CREATE INDEX idx_bid_projects_status ON bid_projects(status);
CREATE INDEX idx_bid_line_items_project_id ON bid_line_items(bid_project_id);
CREATE INDEX idx_bid_line_items_csi_code ON bid_line_items(csi_code);
CREATE INDEX idx_bid_line_items_category ON bid_line_items(category);
CREATE INDEX idx_vendor_submissions_project_id ON vendor_bid_submissions(bid_project_id);
CREATE INDEX idx_vendor_submissions_vendor_id ON vendor_bid_submissions(vendor_id);
CREATE INDEX idx_vendor_line_bids_submission_id ON vendor_line_item_bids(vendor_submission_id);
CREATE INDEX idx_vendor_line_bids_line_item_id ON vendor_line_item_bids(line_item_id);
CREATE INDEX idx_line_item_analyses_line_item_id ON line_item_analyses(line_item_id);
CREATE INDEX idx_vendor_evaluations_submission_id ON vendor_evaluations(vendor_submission_id);
CREATE INDEX idx_award_recommendations_project_id ON award_recommendations(bid_project_id);
CREATE INDEX idx_bid_documents_project_id ON bid_documents(bid_project_id);
CREATE INDEX idx_bid_documents_vendor_id ON bid_documents(vendor_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bid_projects_updated_at BEFORE UPDATE ON bid_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bid_line_items_updated_at BEFORE UPDATE ON bid_line_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bid_vendors_updated_at BEFORE UPDATE ON bid_vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_bid_submissions_updated_at BEFORE UPDATE ON vendor_bid_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_line_item_analyses_updated_at BEFORE UPDATE ON line_item_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_evaluations_updated_at BEFORE UPDATE ON vendor_evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_award_recommendations_updated_at BEFORE UPDATE ON award_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bid_protests_updated_at BEFORE UPDATE ON bid_protests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_market_analyses_updated_at BEFORE UPDATE ON market_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bid_analysis_settings_updated_at BEFORE UPDATE ON bid_analysis_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE bid_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bid_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_line_item_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_item_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_leveling_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_documents ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize based on your authentication system)
-- CREATE POLICY "Users can view projects they have access to" ON bid_projects FOR SELECT USING (auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can insert projects they own" ON bid_projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Users can update projects they own" ON bid_projects FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create views for common queries
CREATE VIEW vendor_summary AS
SELECT 
    v.id,
    v.name,
    v.company_type,
    v.prequalification_status,
    COUNT(DISTINCT vbs.bid_project_id) as projects_bid,
    AVG(ve.composite_score) as avg_composite_score,
    SUM(vbs.total_bid_amount) as total_bid_value
FROM bid_vendors v
LEFT JOIN vendor_bid_submissions vbs ON v.id = vbs.vendor_id
LEFT JOIN vendor_evaluations ve ON vbs.id = ve.vendor_submission_id
GROUP BY v.id, v.name, v.company_type, v.prequalification_status;

CREATE VIEW project_bid_summary AS
SELECT 
    bp.id,
    bp.rfp_id,
    bp.project_name,
    bp.status,
    bp.total_budget,
    COUNT(DISTINCT vbs.vendor_id) as vendor_count,
    COUNT(DISTINCT bli.id) as line_item_count,
    SUM(vbs.total_bid_amount) as total_bid_value,
    MIN(vbs.total_bid_amount) as lowest_bid,
    MAX(vbs.total_bid_amount) as highest_bid,
    AVG(vbs.total_bid_amount) as average_bid
FROM bid_projects bp
LEFT JOIN vendor_bid_submissions vbs ON bp.id = vbs.bid_project_id
LEFT JOIN bid_line_items bli ON bp.id = bli.bid_project_id
GROUP BY bp.id, bp.rfp_id, bp.project_name, bp.status, bp.total_budget;

-- Add comments for documentation
COMMENT ON TABLE bid_projects IS 'Main projects/RFPs table containing project details and timeline';
COMMENT ON TABLE bid_line_items IS 'Individual line items within each RFP with quantities and estimates';
COMMENT ON TABLE bid_vendors IS 'Vendor master data including qualifications and performance history';
COMMENT ON TABLE vendor_bid_submissions IS 'Vendor bid submissions at the project level';
COMMENT ON TABLE vendor_line_item_bids IS 'Detailed line item pricing from each vendor';
COMMENT ON TABLE line_item_analyses IS 'Statistical analysis results for each line item';
COMMENT ON TABLE vendor_evaluations IS 'Technical and commercial evaluation scores for vendors';
COMMENT ON TABLE award_recommendations IS 'Final award recommendations with approval workflow';
