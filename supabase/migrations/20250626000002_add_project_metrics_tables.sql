-- Migrations to add detailed project-specific metrics for dashboards

-- Add financial metrics table
CREATE TABLE project_financial_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
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
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    design_development NUMERIC,
    bidding_progress NUMERIC,
    contractor_selection NUMERIC,
    permit_submissions NUMERIC,
    value_engineering NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add financial monthly spend data table
CREATE TABLE project_monthly_spend (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    budget DECIMAL(15, 2),
    actual DECIMAL(15, 2),
    forecast DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add financial cash flow data table
CREATE TABLE project_cash_flow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    inflow DECIMAL(15, 2),
    outflow DECIMAL(15, 2),
    cumulative DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add cost breakdown table
CREATE TABLE project_cost_breakdown (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2),
    percentage NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add financial transactions table
CREATE TABLE project_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    vendor VARCHAR(255),
    amount DECIMAL(15, 2),
    category VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add construction daily progress table
CREATE TABLE project_daily_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    progress_date DATE NOT NULL,
    planned NUMERIC,
    actual NUMERIC,
    workforce INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add construction material deliveries table
CREATE TABLE project_material_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    material VARCHAR(255),
    supplier VARCHAR(255),
    delivery_date DATE,
    status VARCHAR(50),
    quantity VARCHAR(100),
    cost DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add construction activities table
CREATE TABLE project_construction_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    activity TEXT,
    trade VARCHAR(100),
    status VARCHAR(50),
    activity_date DATE,
    crew VARCHAR(100),
    duration VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add executive KPI trends table
CREATE TABLE project_kpi_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    week VARCHAR(10),
    efficiency NUMERIC,
    quality NUMERIC,
    safety NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project insights table
CREATE TABLE project_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    summary TEXT,
    key_points TEXT[],
    recommendations TEXT[],
    alerts TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project timeline table
CREATE TABLE project_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    phase VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    progress NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project team table
CREATE TABLE project_team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    project_manager VARCHAR(255),
    architect VARCHAR(255),
    contractor VARCHAR(255),
    owner VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project insights unique constraint
ALTER TABLE project_insights ADD CONSTRAINT project_insights_project_id_unique UNIQUE (project_id);

-- Add composite unique constraints for multi-row tables
ALTER TABLE project_monthly_spend ADD CONSTRAINT project_monthly_spend_project_month_unique UNIQUE (project_id, month);
ALTER TABLE project_cash_flow ADD CONSTRAINT project_cash_flow_project_month_unique UNIQUE (project_id, month);
ALTER TABLE project_cost_breakdown ADD CONSTRAINT project_cost_breakdown_project_category_unique UNIQUE (project_id, category);
ALTER TABLE project_transactions ADD CONSTRAINT project_transactions_project_date_desc_unique UNIQUE (project_id, transaction_date, description);
ALTER TABLE project_daily_progress ADD CONSTRAINT project_daily_progress_project_date_unique UNIQUE (project_id, progress_date);
ALTER TABLE project_kpi_trends ADD CONSTRAINT project_kpi_trends_project_week_unique UNIQUE (project_id, week);
ALTER TABLE project_timeline ADD CONSTRAINT project_timeline_project_phase_unique UNIQUE (project_id, phase);

-- Create indexes for performance
CREATE INDEX idx_project_financial_metrics_project_id ON project_financial_metrics(project_id);
CREATE INDEX idx_project_construction_metrics_project_id ON project_construction_metrics(project_id);
CREATE INDEX idx_project_executive_metrics_project_id ON project_executive_metrics(project_id);
CREATE INDEX idx_project_legal_metrics_project_id ON project_legal_metrics(project_id);
CREATE INDEX idx_project_design_metrics_project_id ON project_design_metrics(project_id);
CREATE INDEX idx_project_sustainability_metrics_project_id ON project_sustainability_metrics(project_id);
CREATE INDEX idx_project_facilities_metrics_project_id ON project_facilities_metrics(project_id);
CREATE INDEX idx_project_planning_metrics_project_id ON project_planning_metrics(project_id);
CREATE INDEX idx_project_preconstruction_metrics_project_id ON project_preconstruction_metrics(project_id);
CREATE INDEX idx_project_monthly_spend_project_id ON project_monthly_spend(project_id);
CREATE INDEX idx_project_cash_flow_project_id ON project_cash_flow(project_id);
CREATE INDEX idx_project_cost_breakdown_project_id ON project_cost_breakdown(project_id);
CREATE INDEX idx_project_transactions_project_id ON project_transactions(project_id);
CREATE INDEX idx_project_daily_progress_project_id ON project_daily_progress(project_id);
CREATE INDEX idx_project_material_deliveries_project_id ON project_material_deliveries(project_id);
CREATE INDEX idx_project_construction_activities_project_id ON project_construction_activities(project_id);
CREATE INDEX idx_project_kpi_trends_project_id ON project_kpi_trends(project_id);
CREATE INDEX idx_project_insights_project_id ON project_insights(project_id);
CREATE INDEX idx_project_timeline_project_id ON project_timeline(project_id);
CREATE INDEX idx_project_team_project_id ON project_team(project_id);

-- Updated_at triggers for all new tables
CREATE TRIGGER update_project_financial_metrics_updated_at BEFORE UPDATE ON project_financial_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_construction_metrics_updated_at BEFORE UPDATE ON project_construction_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_executive_metrics_updated_at BEFORE UPDATE ON project_executive_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_legal_metrics_updated_at BEFORE UPDATE ON project_legal_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_design_metrics_updated_at BEFORE UPDATE ON project_design_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_sustainability_metrics_updated_at BEFORE UPDATE ON project_sustainability_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_facilities_metrics_updated_at BEFORE UPDATE ON project_facilities_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_planning_metrics_updated_at BEFORE UPDATE ON project_planning_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_preconstruction_metrics_updated_at BEFORE UPDATE ON project_preconstruction_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_monthly_spend_updated_at BEFORE UPDATE ON project_monthly_spend FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_cash_flow_updated_at BEFORE UPDATE ON project_cash_flow FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_cost_breakdown_updated_at BEFORE UPDATE ON project_cost_breakdown FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_transactions_updated_at BEFORE UPDATE ON project_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_daily_progress_updated_at BEFORE UPDATE ON project_daily_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_material_deliveries_updated_at BEFORE UPDATE ON project_material_deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_construction_activities_updated_at BEFORE UPDATE ON project_construction_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_kpi_trends_updated_at BEFORE UPDATE ON project_kpi_trends FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_insights_updated_at BEFORE UPDATE ON project_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_timeline_updated_at BEFORE UPDATE ON project_timeline FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_team_updated_at BEFORE UPDATE ON project_team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for all new tables
ALTER TABLE project_financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_construction_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_executive_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_legal_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_design_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sustainability_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_facilities_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_planning_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_preconstruction_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_monthly_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_cash_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_cost_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_material_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_construction_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_kpi_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all new tables
CREATE POLICY "Users can view project financial metrics" ON project_financial_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_financial_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project construction metrics" ON project_construction_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_construction_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project executive metrics" ON project_executive_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_executive_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project legal metrics" ON project_legal_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_legal_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project design metrics" ON project_design_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_design_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project sustainability metrics" ON project_sustainability_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_sustainability_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project facilities metrics" ON project_facilities_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_facilities_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project planning metrics" ON project_planning_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_planning_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project preconstruction metrics" ON project_preconstruction_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_preconstruction_metrics.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project monthly spend" ON project_monthly_spend FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_monthly_spend.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project cash flow" ON project_cash_flow FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_cash_flow.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project cost breakdown" ON project_cost_breakdown FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_cost_breakdown.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project transactions" ON project_transactions FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_transactions.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project daily progress" ON project_daily_progress FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_daily_progress.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project material deliveries" ON project_material_deliveries FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_material_deliveries.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project construction activities" ON project_construction_activities FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_construction_activities.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project kpi trends" ON project_kpi_trends FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_kpi_trends.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project insights" ON project_insights FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_insights.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project timeline" ON project_timeline FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_timeline.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project team" ON project_team FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_team.project_id AND projects.owner_id = auth.uid())
);

