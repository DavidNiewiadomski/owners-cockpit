-- Migrations to add detailed project-specific metrics for dashboards

-- Add financial metrics table
CREATE TABLE project_financial_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_budget DECIMAL(15, 2),
    spent_to_date DECIMAL(15, 2),
    forecasted_cost DECIMAL(15, 2),
    contingency_used DECIMAL(15, 2),
    contingency_remaining DECIMAL(15, 2),
    roi NUMERIC,
    npv DECIMAL(15, 2),
    irr NUMERIC,
    cost_per_sqft DECIMAL(15, 2),
    market_value DECIMAL(15, 2),
    leasing_projections DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add construction metrics table
CREATE TABLE project_construction_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    overall_progress NUMERIC,
    days_ahead_behind INTEGER,
    total_workforce INTEGER,
    active_subcontractors INTEGER,
    completed_milestones INTEGER,
    total_milestones INTEGER,
    quality_score NUMERIC,
    safety_score NUMERIC,
    open_rfis INTEGER,
    pending_submittals INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add executive insights metrics table
CREATE TABLE project_executive_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    portfolio_value DECIMAL(15, 2),
    stakeholders INTEGER,
    risk_score NUMERIC,
    strategic_alignment NUMERIC,
    market_position NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add legal metrics table
CREATE TABLE project_legal_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contracts_active INTEGER,
    contracts_pending INTEGER,
    compliance_score NUMERIC,
    permit_status VARCHAR(255),
    legal_risks INTEGER,
    documentation_complete INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add design metrics table
CREATE TABLE project_design_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_progress NUMERIC,
    approved_drawings INTEGER,
    total_drawings INTEGER,
    revision_cycles INTEGER,
    stakeholder_approvals INTEGER,
    design_changes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sustainability metrics table
CREATE TABLE project_sustainability_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    leed_target VARCHAR(50),
    current_score NUMERIC,
    energy_efficiency NUMERIC,
    carbon_reduction NUMERIC,
    sustainable_materials NUMERIC,
    certifications TEXT[], -- Array of certification strings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add facilities metrics table
CREATE TABLE project_facilities_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    operational_readiness NUMERIC,
    systems_commissioned INTEGER,
    maintenance_planned NUMERIC,
    energy_performance NUMERIC,
    occupancy_readiness NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add planning metrics table
CREATE TABLE project_planning_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    master_plan_approval NUMERIC,
    zoning_compliance NUMERIC,
    community_engagement NUMERIC,
    regulatory_approvals NUMERIC,
    feasibility_complete NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add preconstruction metrics table
CREATE TABLE project_preconstruction_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    design_development NUMERIC,
    bidding_progress NUMERIC,
    contractor_selection NUMERIC,
    permit_submissions NUMERIC,
    value_engineering NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

