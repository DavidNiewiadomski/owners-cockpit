-- Enhanced Legal & Insurance Database Schema
-- This script creates comprehensive tables for legal and insurance management

-- Insurance Policies Table
CREATE TABLE IF NOT EXISTS insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    policy_type VARCHAR(100) NOT NULL, -- 'general_liability', 'workers_comp', 'property', 'professional', 'umbrella', 'builders_risk'
    policy_number VARCHAR(100) NOT NULL,
    insurance_company VARCHAR(255) NOT NULL,
    policy_holder VARCHAR(255) NOT NULL,
    coverage_amount DECIMAL(15,2) NOT NULL,
    deductible DECIMAL(15,2) DEFAULT 0,
    premium_amount DECIMAL(15,2) NOT NULL,
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'cancelled', 'pending'
    certificate_provided BOOLEAN DEFAULT false,
    auto_renewal BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Claims Table
CREATE TABLE IF NOT EXISTS insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES insurance_policies(id) ON DELETE SET NULL,
    claim_number VARCHAR(100) NOT NULL,
    claim_type VARCHAR(100) NOT NULL, -- 'property_damage', 'liability', 'workers_comp', 'delay', 'professional'
    incident_date DATE NOT NULL,
    reported_date DATE NOT NULL,
    claim_amount DECIMAL(15,2),
    settled_amount DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'settled', 'denied', 'closed'
    description TEXT NOT NULL,
    adjuster_name VARCHAR(255),
    adjuster_contact VARCHAR(255),
    estimated_resolution_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal Contracts Table (Enhanced)
CREATE TABLE IF NOT EXISTS legal_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_type VARCHAR(100) NOT NULL, -- 'construction', 'design', 'supply', 'service', 'lease', 'purchase'
    contract_number VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    counterparty VARCHAR(255) NOT NULL,
    contract_value DECIMAL(15,2),
    start_date DATE NOT NULL,
    end_date DATE,
    execution_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'draft', 'under_review', 'active', 'completed', 'terminated', 'expired'
    renewal_terms TEXT,
    key_obligations TEXT,
    termination_clauses TEXT,
    change_order_count INTEGER DEFAULT 0,
    total_change_orders DECIMAL(15,2) DEFAULT 0,
    performance_bond_required BOOLEAN DEFAULT false,
    performance_bond_amount DECIMAL(15,2),
    retention_percentage DECIMAL(5,2) DEFAULT 0,
    payment_terms VARCHAR(255),
    governing_law VARCHAR(100),
    dispute_resolution VARCHAR(100), -- 'litigation', 'arbitration', 'mediation'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal Disputes Table
CREATE TABLE IF NOT EXISTS legal_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES legal_contracts(id) ON DELETE SET NULL,
    dispute_type VARCHAR(100) NOT NULL, -- 'payment', 'delay', 'quality', 'scope', 'termination', 'warranty'
    dispute_number VARCHAR(100),
    counterparty VARCHAR(255) NOT NULL,
    amount_in_dispute DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'mediation', 'arbitration', 'litigation', 'settled', 'dismissed'
    filed_date DATE NOT NULL,
    description TEXT NOT NULL,
    legal_counsel VARCHAR(255),
    estimated_resolution_date DATE,
    resolution_method VARCHAR(100), -- 'settlement', 'mediation', 'arbitration', 'court_decision'
    resolution_amount DECIMAL(15,2),
    resolution_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permit and Compliance Table
CREATE TABLE IF NOT EXISTS permit_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    permit_type VARCHAR(100) NOT NULL, -- 'building', 'zoning', 'environmental', 'fire', 'electrical', 'plumbing'
    permit_number VARCHAR(100),
    issuing_authority VARCHAR(255) NOT NULL,
    application_date DATE,
    issued_date DATE,
    expiration_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'under_review', 'issued', 'expired', 'denied', 'renewed'
    cost DECIMAL(10,2),
    requirements TEXT,
    conditions TEXT,
    inspection_required BOOLEAN DEFAULT false,
    inspection_date DATE,
    inspection_status VARCHAR(50), -- 'scheduled', 'passed', 'failed', 'conditional'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Assessment Table
CREATE TABLE IF NOT EXISTS legal_risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    risk_category VARCHAR(100) NOT NULL, -- 'contractual', 'regulatory', 'environmental', 'safety', 'financial', 'operational'
    risk_description TEXT NOT NULL,
    probability VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    impact VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    risk_score INTEGER NOT NULL, -- 1-25 (probability * impact)
    mitigation_strategy TEXT,
    responsible_party VARCHAR(255),
    target_date DATE,
    status VARCHAR(50) DEFAULT 'identified', -- 'identified', 'mitigating', 'monitoring', 'closed'
    last_review_date DATE,
    next_review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_insurance_policies_project_id ON insurance_policies(project_id);
CREATE INDEX IF NOT EXISTS idx_insurance_policies_expiration ON insurance_policies(expiration_date);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_project_id ON insurance_claims(project_id);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_project_id ON legal_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_end_date ON legal_contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_legal_disputes_project_id ON legal_disputes(project_id);
CREATE INDEX IF NOT EXISTS idx_permit_compliance_project_id ON permit_compliance(project_id);
CREATE INDEX IF NOT EXISTS idx_permit_compliance_expiration ON permit_compliance(expiration_date);
CREATE INDEX IF NOT EXISTS idx_legal_risk_assessments_project_id ON legal_risk_assessments(project_id);

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON insurance_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_contracts_updated_at BEFORE UPDATE ON legal_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_disputes_updated_at BEFORE UPDATE ON legal_disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permit_compliance_updated_at BEFORE UPDATE ON permit_compliance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_risk_assessments_updated_at BEFORE UPDATE ON legal_risk_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
