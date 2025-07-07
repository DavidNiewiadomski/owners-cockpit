-- Supplier Performance Scorecards Migration
-- Create tables for tracking supplier KPIs and performance metrics

-- KPI Template table for defining metric standards
CREATE TABLE IF NOT EXISTS kpi_template (
    metric TEXT PRIMARY KEY,
    target_direction TEXT NOT NULL CHECK (target_direction IN ('up', 'down')),
    weight NUMERIC NOT NULL DEFAULT 1.0,
    description TEXT,
    unit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance KPI tracking table
CREATE TABLE IF NOT EXISTS performance_kpi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    metric TEXT NOT NULL REFERENCES kpi_template(metric) ON DELETE RESTRICT,
    value NUMERIC NOT NULL,
    period TEXT NOT NULL, -- Format: Q1-2024, Q2-2024, etc.
    source TEXT,
    notes TEXT,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per company/project/metric/period combination
    UNIQUE(company_id, project_id, metric, period)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_kpi_company_period ON performance_kpi(company_id, period);
CREATE INDEX IF NOT EXISTS idx_performance_kpi_project_period ON performance_kpi(project_id, period);
CREATE INDEX IF NOT EXISTS idx_performance_kpi_metric ON performance_kpi(metric);
CREATE INDEX IF NOT EXISTS idx_performance_kpi_captured_at ON performance_kpi(captured_at);

-- RLS Policies
ALTER TABLE kpi_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_kpi ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read KPI templates
CREATE POLICY "Users can read KPI templates" ON kpi_template
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to manage KPI templates
CREATE POLICY "Users can manage KPI templates" ON kpi_template
    FOR ALL TO authenticated USING (true);

-- Allow authenticated users to read performance KPIs
CREATE POLICY "Users can read performance KPIs" ON performance_kpi
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to manage performance KPIs
CREATE POLICY "Users can manage performance KPIs" ON performance_kpi
    FOR ALL TO authenticated USING (true);

-- Insert default KPI templates
INSERT INTO kpi_template (metric, target_direction, weight, description, unit) VALUES
    ('quality_score', 'up', 1.5, 'Overall quality rating of deliverables', 'score'),
    ('on_time_delivery', 'up', 1.3, 'Percentage of deliverables completed on time', 'percentage'),
    ('budget_adherence', 'up', 1.2, 'Percentage of projects completed within budget', 'percentage'),
    ('safety_incidents', 'down', 2.0, 'Number of safety incidents per quarter', 'count'),
    ('customer_satisfaction', 'up', 1.4, 'Customer satisfaction rating', 'score'),
    ('response_time', 'down', 1.0, 'Average response time to issues (hours)', 'hours'),
    ('change_order_rate', 'down', 1.1, 'Percentage of projects with change orders', 'percentage'),
    ('defect_rate', 'down', 1.3, 'Percentage of deliverables with defects', 'percentage'),
    ('cost_variance', 'down', 1.2, 'Average cost variance from original estimate', 'percentage'),
    ('schedule_variance', 'down', 1.2, 'Average schedule variance from original timeline', 'percentage')
ON CONFLICT (metric) DO UPDATE SET
    target_direction = EXCLUDED.target_direction,
    weight = EXCLUDED.weight,
    description = EXCLUDED.description,
    unit = EXCLUDED.unit,
    updated_at = NOW();

-- Function to calculate overall performance score
CREATE OR REPLACE FUNCTION calculate_performance_score(
    p_company_id UUID,
    p_period TEXT DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    total_score NUMERIC := 0;
    total_weight NUMERIC := 0;
    kpi_record RECORD;
BEGIN
    -- Calculate weighted average of all KPIs for the company
    FOR kpi_record IN
        SELECT 
            pk.value,
            kt.weight,
            kt.target_direction,
            kt.metric
        FROM performance_kpi pk
        JOIN kpi_template kt ON pk.metric = kt.metric
        WHERE pk.company_id = p_company_id
        AND (p_period IS NULL OR pk.period = p_period)
    LOOP
        -- Normalize score based on target direction
        -- For 'up' metrics, higher is better (score = value)
        -- For 'down' metrics, lower is better (score = 100 - value for percentages, or inverse for counts)
        IF kpi_record.target_direction = 'up' THEN
            total_score := total_score + (kpi_record.value * kpi_record.weight);
        ELSE
            -- For 'down' metrics, invert the score
            IF kpi_record.metric IN ('safety_incidents', 'response_time') THEN
                -- For count/time metrics, use inverse relationship
                total_score := total_score + ((100 - LEAST(kpi_record.value, 100)) * kpi_record.weight);
            ELSE
                -- For percentage metrics, subtract from 100
                total_score := total_score + ((100 - kpi_record.value) * kpi_record.weight);
            END IF;
        END IF;
        
        total_weight := total_weight + kpi_record.weight;
    END LOOP;
    
    -- Return weighted average, default to 0 if no data
    IF total_weight > 0 THEN
        RETURN ROUND(total_score / total_weight, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
