-- Vendor Prequalification System Database Schema
-- This migration creates the complete database schema for vendor prequalification

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
  CREATE TYPE prequal_status AS ENUM ('pending', 'approved', 'expired', 'denied');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE insurance_type AS ENUM ('general_liability', 'professional_liability', 'workers_comp', 'auto_liability', 'umbrella', 'cyber_liability');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE litigation_status AS ENUM ('active', 'settled', 'dismissed', 'pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Companies table (if not exists)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    duns_number VARCHAR(13),
    tax_id VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    primary_contact_name VARCHAR(255),
    primary_contact_title VARCHAR(100),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(20),
    company_type VARCHAR(50), -- 'general_contractor', 'subcontractor', 'supplier', 'consultant'
    specialty_codes TEXT[], -- Array of CSI codes or specialty areas
    years_in_business INTEGER,
    employee_count INTEGER,
    annual_revenue NUMERIC(15,2),
    bonding_capacity NUMERIC(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main prequalification records
CREATE TABLE prequal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    status prequal_status NOT NULL DEFAULT 'pending',
    expiry_date DATE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID, -- References user who reviewed
    review_notes TEXT,
    score INTEGER, -- Overall prequalification score 0-100
    renewal_required_at DATE,
    
    -- Application metadata
    application_version VARCHAR(10) DEFAULT '1.0',
    requested_trades TEXT[], -- Array of trade categories requested
    project_size_limit NUMERIC(15,2), -- Maximum project size qualified for
    geographic_limits TEXT[], -- States/regions where qualified
    
    -- Contact information during application
    contact_name VARCHAR(255),
    contact_title VARCHAR(100), 
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_expiry_date CHECK (expiry_date > CURRENT_DATE OR expiry_date IS NULL),
    CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100)
);

-- Insurance certificates
CREATE TABLE insurance_certificate (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prequal_id UUID NOT NULL REFERENCES prequal(id) ON DELETE CASCADE,
    insurance_type insurance_type NOT NULL,
    carrier VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100),
    coverage_limit NUMERIC(15,2) NOT NULL,
    deductible NUMERIC(12,2),
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    file_url TEXT, -- URL to uploaded certificate document
    file_name VARCHAR(255),
    file_size INTEGER,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    
    -- Additional details
    additional_insured BOOLEAN DEFAULT FALSE,
    waiver_of_subrogation BOOLEAN DEFAULT FALSE,
    primary_and_noncontributory BOOLEAN DEFAULT FALSE,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_coverage_limit CHECK (coverage_limit > 0),
    CONSTRAINT valid_date_range CHECK (expiry_date > effective_date)
);

-- Safety metrics and performance data
CREATE TABLE safety_metric (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    period_year INTEGER NOT NULL,
    period_quarter INTEGER, -- 1-4, NULL for annual data
    
    -- EMR and safety rates
    emr NUMERIC(5,2), -- Experience Modification Rate
    dart_rate NUMERIC(5,2), -- Days Away, Restricted, or Transfer rate
    trir NUMERIC(5,2), -- Total Recordable Incident Rate
    ltir NUMERIC(5,2), -- Lost Time Incident Rate
    
    -- Incident counts
    osha_incidents INTEGER DEFAULT 0,
    near_misses INTEGER DEFAULT 0,
    first_aid_cases INTEGER DEFAULT 0,
    
    -- Training and certifications
    safety_training_hours INTEGER,
    certified_safety_personnel INTEGER,
    safety_certifications TEXT[], -- Array of safety certifications
    
    -- Exposure data
    total_work_hours INTEGER,
    number_of_employees INTEGER,
    number_of_projects INTEGER,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    source VARCHAR(100), -- 'company_reported', 'insurance_carrier', 'osha_log'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_year CHECK (period_year >= 2000 AND period_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    CONSTRAINT valid_quarter CHECK (period_quarter IS NULL OR (period_quarter >= 1 AND period_quarter <= 4)),
    CONSTRAINT valid_emr CHECK (emr IS NULL OR emr >= 0),
    CONSTRAINT valid_rates CHECK (
        (dart_rate IS NULL OR dart_rate >= 0) AND
        (trir IS NULL OR trir >= 0) AND
        (ltir IS NULL OR ltir >= 0)
    )
);

-- Litigation and legal issues
CREATE TABLE litigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    case_number VARCHAR(100),
    court_jurisdiction VARCHAR(255),
    case_title VARCHAR(255),
    plaintiff VARCHAR(255),
    defendant VARCHAR(255),
    
    status litigation_status NOT NULL,
    case_type VARCHAR(100), -- 'contract_dispute', 'construction_defect', 'personal_injury', 'employment', 'other'
    filed_date DATE,
    resolution_date DATE,
    
    -- Financial details
    claim_amount NUMERIC(15,2),
    settlement_amount NUMERIC(15,2),
    settled BOOLEAN DEFAULT FALSE,
    
    -- Case details
    description TEXT,
    impact_on_operations TEXT,
    lessons_learned TEXT,
    notes TEXT,
    
    -- Project relation
    related_project_name VARCHAR(255),
    related_project_value NUMERIC(15,2),
    
    -- Resolution details
    resolution_type VARCHAR(100), -- 'settlement', 'judgment', 'dismissal', 'withdrawal'
    insurance_covered BOOLEAN,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_amounts CHECK (
        (claim_amount IS NULL OR claim_amount >= 0) AND
        (settlement_amount IS NULL OR settlement_amount >= 0)
    ),
    CONSTRAINT valid_resolution_date CHECK (
        resolution_date IS NULL OR resolution_date >= filed_date
    )
);

-- Financial information
CREATE TABLE financial_statement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    statement_year INTEGER NOT NULL,
    statement_type VARCHAR(50) NOT NULL, -- 'audited', 'reviewed', 'compiled', 'tax_return'
    
    -- Balance sheet items
    total_assets NUMERIC(15,2),
    current_assets NUMERIC(15,2),
    cash_and_equivalents NUMERIC(15,2),
    accounts_receivable NUMERIC(15,2),
    inventory NUMERIC(15,2),
    
    total_liabilities NUMERIC(15,2),
    current_liabilities NUMERIC(15,2),
    accounts_payable NUMERIC(15,2),
    short_term_debt NUMERIC(15,2),
    long_term_debt NUMERIC(15,2),
    
    stockholders_equity NUMERIC(15,2),
    
    -- Income statement items
    total_revenue NUMERIC(15,2),
    gross_profit NUMERIC(15,2),
    operating_income NUMERIC(15,2),
    net_income NUMERIC(15,2),
    ebitda NUMERIC(15,2),
    
    -- Key ratios (calculated)
    current_ratio NUMERIC(5,2),
    debt_to_equity_ratio NUMERIC(5,2),
    profit_margin NUMERIC(5,2),
    
    -- File information
    file_url TEXT,
    file_name VARCHAR(255),
    accountant_name VARCHAR(255),
    accountant_firm VARCHAR(255),
    
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_statement_year CHECK (statement_year >= 2000 AND statement_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    CONSTRAINT valid_financial_amounts CHECK (
        (total_assets IS NULL OR total_assets >= 0) AND
        (total_liabilities IS NULL OR total_liabilities >= 0) AND
        (total_revenue IS NULL OR total_revenue >= 0)
    )
);

-- Project references and past performance
CREATE TABLE project_reference (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    client_name VARCHAR(255) NOT NULL,
    client_contact_name VARCHAR(255),
    client_contact_title VARCHAR(100),
    client_contact_email VARCHAR(255),
    client_contact_phone VARCHAR(20),
    
    -- Project details
    project_value NUMERIC(15,2),
    contract_start_date DATE,
    contract_end_date DATE,
    actual_completion_date DATE,
    project_location VARCHAR(255),
    project_type VARCHAR(100),
    trade_categories TEXT[],
    
    -- Performance metrics
    completed_on_time BOOLEAN,
    completed_on_budget BOOLEAN,
    final_change_order_percentage NUMERIC(5,2),
    quality_rating INTEGER, -- 1-5 scale
    safety_incidents INTEGER DEFAULT 0,
    
    -- Reference check
    reference_checked BOOLEAN DEFAULT FALSE,
    reference_checked_at TIMESTAMP WITH TIME ZONE,
    reference_checked_by UUID,
    reference_response TEXT,
    reference_rating INTEGER, -- 1-5 scale from reference
    
    -- Additional details
    notable_challenges TEXT,
    innovative_solutions TEXT,
    lessons_learned TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_project_value CHECK (project_value IS NULL OR project_value > 0),
    CONSTRAINT valid_quality_rating CHECK (quality_rating IS NULL OR (quality_rating >= 1 AND quality_rating <= 5)),
    CONSTRAINT valid_reference_rating CHECK (reference_rating IS NULL OR (reference_rating >= 1 AND reference_rating <= 5)),
    CONSTRAINT valid_date_range CHECK (
        contract_end_date IS NULL OR contract_start_date IS NULL OR contract_end_date >= contract_start_date
    )
);

-- Bonding information
CREATE TABLE bonding_capacity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    surety_company VARCHAR(255) NOT NULL,
    surety_rating VARCHAR(10), -- A.M. Best rating (A++, A+, A, etc.)
    
    -- Capacity limits
    single_project_limit NUMERIC(15,2) NOT NULL,
    aggregate_limit NUMERIC(15,2) NOT NULL,
    available_capacity NUMERIC(15,2),
    
    -- Bond types available
    bid_bonds BOOLEAN DEFAULT TRUE,
    performance_bonds BOOLEAN DEFAULT TRUE,
    payment_bonds BOOLEAN DEFAULT TRUE,
    maintenance_bonds BOOLEAN DEFAULT FALSE,
    supply_bonds BOOLEAN DEFAULT FALSE,
    
    -- Current utilization
    current_backlog NUMERIC(15,2),
    bonded_backlog NUMERIC(15,2),
    
    -- Contact information
    agent_name VARCHAR(255),
    agent_email VARCHAR(255),
    agent_phone VARCHAR(20),
    
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    
    -- Documentation
    letter_url TEXT, -- URL to capacity letter
    letter_date DATE,
    
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_capacity_limits CHECK (
        single_project_limit > 0 AND 
        aggregate_limit > 0 AND
        aggregate_limit >= single_project_limit
    ),
    CONSTRAINT valid_bonding_dates CHECK (expiry_date > effective_date)
);

-- Prequalification scoring criteria and weights
CREATE TABLE prequal_scoring_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    criterion VARCHAR(255) NOT NULL,
    description TEXT,
    weight NUMERIC(5,2) NOT NULL, -- Percentage weight in scoring
    min_score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    
    -- Scoring thresholds
    excellent_threshold INTEGER, -- Score for excellent rating
    good_threshold INTEGER, -- Score for good rating
    acceptable_threshold INTEGER, -- Score for acceptable rating
    
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_weight CHECK (weight >= 0 AND weight <= 100),
    CONSTRAINT valid_score_range CHECK (min_score <= max_score),
    CONSTRAINT valid_thresholds CHECK (
        (excellent_threshold IS NULL OR excellent_threshold <= max_score) AND
        (good_threshold IS NULL OR good_threshold <= max_score) AND
        (acceptable_threshold IS NULL OR acceptable_threshold <= max_score)
    )
);

-- Individual scores for each criterion
CREATE TABLE prequal_score (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prequal_id UUID NOT NULL REFERENCES prequal(id) ON DELETE CASCADE,
    criteria_id UUID NOT NULL REFERENCES prequal_scoring_criteria(id),
    score INTEGER NOT NULL,
    notes TEXT,
    scored_by UUID,
    scored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_individual_score CHECK (score >= 0 AND score <= 100),
    UNIQUE(prequal_id, criteria_id)
);

-- Document requirements and uploads
CREATE TABLE prequal_document_requirement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required BOOLEAN DEFAULT TRUE,
    category VARCHAR(100), -- 'insurance', 'financial', 'safety', 'legal', 'references', 'bonding'
    accepted_formats TEXT[], -- ['pdf', 'doc', 'docx', 'jpg', 'png']
    max_file_size INTEGER, -- in bytes
    
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE prequal_document_upload (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prequal_id UUID NOT NULL REFERENCES prequal(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES prequal_document_requirement(id),
    
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(100),
    file_url TEXT NOT NULL,
    
    description TEXT,
    uploaded_by UUID,
    
    -- Review status
    reviewed BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    review_status VARCHAR(50), -- 'approved', 'rejected', 'needs_revision'
    review_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_prequal_company_id ON prequal(company_id);
CREATE INDEX idx_prequal_status ON prequal(status);
CREATE INDEX idx_prequal_expiry_date ON prequal(expiry_date);
CREATE INDEX idx_insurance_certificate_prequal_id ON insurance_certificate(prequal_id);
CREATE INDEX idx_insurance_certificate_expiry ON insurance_certificate(expiry_date);
CREATE INDEX idx_safety_metric_company_id ON safety_metric(company_id);
CREATE INDEX idx_safety_metric_year ON safety_metric(period_year);
CREATE INDEX idx_litigation_company_id ON litigation(company_id);
CREATE INDEX idx_litigation_status ON litigation(status);
CREATE INDEX idx_financial_statement_company_id ON financial_statement(company_id);
CREATE INDEX idx_project_reference_company_id ON project_reference(company_id);
CREATE INDEX idx_bonding_capacity_company_id ON bonding_capacity(company_id);
CREATE INDEX idx_prequal_score_prequal_id ON prequal_score(prequal_id);
CREATE INDEX idx_document_upload_prequal_id ON prequal_document_upload(prequal_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prequal_updated_at BEFORE UPDATE ON prequal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_certificate_updated_at BEFORE UPDATE ON insurance_certificate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_metric_updated_at BEFORE UPDATE ON safety_metric FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_litigation_updated_at BEFORE UPDATE ON litigation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_statement_updated_at BEFORE UPDATE ON financial_statement FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_reference_updated_at BEFORE UPDATE ON project_reference FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bonding_capacity_updated_at BEFORE UPDATE ON bonding_capacity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prequal_document_upload_updated_at BEFORE UPDATE ON prequal_document_upload FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE prequal ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_certificate ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_metric ENABLE ROW LEVEL SECURITY;
ALTER TABLE litigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_statement ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonding_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE prequal_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE prequal_document_upload ENABLE ROW LEVEL SECURITY;

-- Create views for common queries
CREATE VIEW prequal_summary AS
SELECT 
    p.id,
    p.company_id,
    c.name as company_name,
    p.status,
    p.score,
    p.expiry_date,
    p.submitted_at,
    p.reviewed_at,
    COUNT(DISTINCT ic.id) as insurance_certificates_count,
    COUNT(DISTINCT sm.id) as safety_metrics_count,
    COUNT(DISTINCT l.id) as litigation_cases_count,
    COUNT(DISTINCT pr.id) as project_references_count,
    COUNT(DISTINCT du.id) as documents_uploaded,
    CASE 
        WHEN p.expiry_date < CURRENT_DATE THEN 'expired'
        WHEN p.expiry_date < CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
        ELSE 'current'
    END as expiry_status
FROM prequal p
LEFT JOIN companies c ON p.company_id = c.id
LEFT JOIN insurance_certificate ic ON p.id = ic.prequal_id
LEFT JOIN safety_metric sm ON p.company_id = sm.company_id
LEFT JOIN litigation l ON p.company_id = l.company_id
LEFT JOIN project_reference pr ON p.company_id = pr.company_id
LEFT JOIN prequal_document_upload du ON p.id = du.prequal_id
GROUP BY p.id, p.company_id, c.name, p.status, p.score, p.expiry_date, p.submitted_at, p.reviewed_at;

-- Create function to calculate prequalification score
CREATE OR REPLACE FUNCTION calculate_prequal_score(prequal_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    total_score INTEGER := 0;
    weighted_score NUMERIC := 0;
    total_weight NUMERIC := 0;
    criterion_record RECORD;
BEGIN
    -- Calculate weighted average of all scored criteria
    FOR criterion_record IN 
        SELECT 
            ps.score,
            psc.weight
        FROM prequal_score ps
        JOIN prequal_scoring_criteria psc ON ps.criteria_id = psc.id
        WHERE ps.prequal_id = prequal_id_param
        AND psc.active = TRUE
    LOOP
        weighted_score := weighted_score + (criterion_record.score * criterion_record.weight / 100);
        total_weight := total_weight + criterion_record.weight;
    END LOOP;
    
    IF total_weight > 0 THEN
        total_score := ROUND(weighted_score / total_weight * 100);
    END IF;
    
    -- Update the prequalification record with calculated score
    UPDATE prequal 
    SET score = total_score, updated_at = NOW()
    WHERE id = prequal_id_param;
    
    RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Add some sample document requirements
INSERT INTO prequal_document_requirement (name, description, required, category, accepted_formats, max_file_size) VALUES
('General Liability Insurance', 'Current general liability insurance certificate with minimum $1M coverage', true, 'insurance', ARRAY['pdf'], 5242880),
('Workers Compensation', 'Current workers compensation insurance certificate', true, 'insurance', ARRAY['pdf'], 5242880),
('Financial Statements', 'Audited financial statements for the last 3 years', true, 'financial', ARRAY['pdf'], 10485760),
('Bonding Capacity Letter', 'Current bonding capacity letter from surety', true, 'bonding', ARRAY['pdf'], 5242880),
('Safety Manual', 'Company safety manual and procedures', true, 'safety', ARRAY['pdf'], 10485760),
('OSHA 300 Logs', 'OSHA 300 logs for the last 3 years', true, 'safety', ARRAY['pdf'], 5242880),
('Project References', 'List of 5 recent similar projects with client contacts', true, 'references', ARRAY['pdf', 'doc', 'docx'], 5242880),
('License and Certifications', 'Current business license and trade certifications', true, 'legal', ARRAY['pdf'], 5242880);

-- Add sample scoring criteria
INSERT INTO prequal_scoring_criteria (category, criterion, description, weight, min_score, max_score, excellent_threshold, good_threshold, acceptable_threshold) VALUES
('financial', 'Financial Stability', 'Overall financial health and stability', 25.0, 0, 100, 90, 75, 60),
('experience', 'Relevant Experience', 'Experience in similar project types and sizes', 20.0, 0, 100, 90, 75, 60),
('safety', 'Safety Record', 'EMR, OSHA incidents, and safety programs', 20.0, 0, 100, 90, 75, 60),
('capacity', 'Bonding Capacity', 'Available bonding capacity for project size', 15.0, 0, 100, 90, 75, 60),
('references', 'Client References', 'Quality of past performance references', 10.0, 0, 100, 90, 75, 60),
('legal', 'Legal Standing', 'Litigation history and legal compliance', 10.0, 0, 100, 90, 75, 60);

COMMENT ON TABLE prequal IS 'Main prequalification applications and their current status';
COMMENT ON TABLE insurance_certificate IS 'Insurance certificates uploaded for prequalification';
COMMENT ON TABLE safety_metric IS 'Safety performance metrics and incident data';
COMMENT ON TABLE litigation IS 'Legal cases and litigation history';
COMMENT ON TABLE financial_statement IS 'Financial statements and key financial metrics';
COMMENT ON TABLE project_reference IS 'Past project references and performance data';
COMMENT ON TABLE bonding_capacity IS 'Surety bonding capacity and limits';
