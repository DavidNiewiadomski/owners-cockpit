-- Create preconstruction-specific tables

-- Preconstruction metrics table
CREATE TABLE IF NOT EXISTS preconstruction_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    budget_approval NUMERIC DEFAULT 0,
    permit_progress NUMERIC DEFAULT 0,
    design_completion NUMERIC DEFAULT 0,
    contractor_selection NUMERIC DEFAULT 0,
    feasibility_score NUMERIC DEFAULT 0,
    timeline_status TEXT DEFAULT 'Unknown',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Budget breakdown table
CREATE TABLE IF NOT EXISTS budget_breakdown (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    allocated_amount NUMERIC DEFAULT 0,
    spent_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Permit status table
CREATE TABLE IF NOT EXISTS permit_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    permit_type TEXT NOT NULL,
    status TEXT NOT NULL,
    submitted_date DATE,
    expected_approval DATE,
    approved_date DATE,
    priority TEXT DEFAULT 'medium',
    cost NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Contractor bids table
CREATE TABLE IF NOT EXISTS contractor_bids (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contractor_name TEXT NOT NULL,
    bid_amount NUMERIC DEFAULT 0,
    evaluation_score NUMERIC DEFAULT 0,
    proposed_timeline TEXT,
    status TEXT DEFAULT 'pending',
    recommended BOOLEAN DEFAULT FALSE,
    experience_years INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Executive metrics tables
CREATE TABLE IF NOT EXISTS project_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    summary TEXT,
    key_points TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    alerts TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_kpis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    week TEXT NOT NULL,
    efficiency_score NUMERIC DEFAULT 0,
    quality_score NUMERIC DEFAULT 0,
    safety_score NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS project_team (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS total_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS risk_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS strategic_alignment NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS market_position NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_completion DATE;
