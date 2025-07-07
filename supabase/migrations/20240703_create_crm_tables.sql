-- Create CRM Core Database Schema
-- Migration: 20240703_create_crm_tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE company_type AS ENUM ('sub', 'gc', 'supplier', 'a/e');
CREATE TYPE company_status AS ENUM ('active', 'inactive');
CREATE TYPE interaction_type AS ENUM ('call', 'email', 'meeting');
CREATE TYPE opportunity_stage AS ENUM ('prospect', 'shortlisted', 'invited', 'negotiation', 'closed');

-- Company table
CREATE TABLE company (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trade_codes TEXT[] DEFAULT '{}',
    type company_type,
    status company_status DEFAULT 'active',
    risk_score NUMERIC CHECK (risk_score >= 0 AND risk_score <= 100),
    diversity_flags JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact table
CREATE TABLE contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    email TEXT,
    phone TEXT,
    linkedin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interaction table
CREATE TABLE interaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contact(id) ON DELETE SET NULL,
    user_id UUID NOT NULL,
    type interaction_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    medium TEXT,
    notes TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunity table
CREATE TABLE opportunity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    rfp_id UUID,
    stage opportunity_stage DEFAULT 'prospect',
    est_value NUMERIC CHECK (est_value >= 0),
    next_action_date DATE,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_company_status ON company(status);
CREATE INDEX idx_company_type ON company(type);
CREATE INDEX idx_contact_company_id ON contact(company_id);
CREATE INDEX idx_contact_email ON contact(email);
CREATE INDEX idx_interaction_company_id ON interaction(company_id);
CREATE INDEX idx_interaction_date ON interaction(date);
CREATE INDEX idx_opportunity_company_id ON opportunity(company_id);
CREATE INDEX idx_opportunity_stage ON opportunity(stage);
CREATE INDEX idx_opportunity_owner_id ON opportunity(owner_id);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_company_updated_at BEFORE UPDATE ON company
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON contact
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interaction_updated_at BEFORE UPDATE ON interaction
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunity_updated_at BEFORE UPDATE ON opportunity
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE company ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity ENABLE ROW LEVEL SECURITY;

-- CRM_ADMIN policies (full access)
CREATE POLICY "CRM_ADMIN can do everything on company" ON company
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN can do everything on contact" ON contact
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN can do everything on interaction" ON interaction
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

CREATE POLICY "CRM_ADMIN can do everything on opportunity" ON opportunity
    FOR ALL USING (auth.jwt() ->> 'role' = 'CRM_ADMIN');

-- CRM_USER policies (read + create interaction/opportunity)
CREATE POLICY "CRM_USER can read company" ON company
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can read contact" ON contact
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can read interaction" ON interaction
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can create interaction" ON interaction
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can read opportunity" ON opportunity
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));

CREATE POLICY "CRM_USER can create opportunity" ON opportunity
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('CRM_USER', 'CRM_ADMIN'));
