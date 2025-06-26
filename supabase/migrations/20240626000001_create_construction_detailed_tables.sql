-- Construction Daily Progress Table
CREATE TABLE IF NOT EXISTS construction_daily_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    planned_progress DECIMAL(5,2) NOT NULL,
    actual_progress DECIMAL(5,2) NOT NULL,
    workforce_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, date)
);

-- Construction Trade Progress Table
CREATE TABLE IF NOT EXISTS construction_trade_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    floor_level VARCHAR(50) NOT NULL,
    structural_progress DECIMAL(5,2) NOT NULL,
    mechanical_progress DECIMAL(5,2) NOT NULL,
    electrical_progress DECIMAL(5,2) NOT NULL,
    plumbing_progress DECIMAL(5,2) NOT NULL,
    finishes_progress DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, floor_level)
);

-- Construction Activities Table
CREATE TABLE IF NOT EXISTS construction_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    trade VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    activity_date DATE NOT NULL,
    crew_name VARCHAR(100) NOT NULL,
    duration_hours INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Construction Quality Metrics Table
CREATE TABLE IF NOT EXISTS construction_quality_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    week_ending DATE NOT NULL,
    quality_score DECIMAL(5,2) NOT NULL,
    rework_items INTEGER NOT NULL,
    inspection_pass_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, week_ending)
);

-- Material Deliveries Table
CREATE TABLE IF NOT EXISTS material_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    material_name VARCHAR(255) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    cost DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Safety Metrics Table
CREATE TABLE IF NOT EXISTS safety_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    recordable_days INTEGER NOT NULL,
    total_incidents INTEGER NOT NULL,
    near_misses INTEGER NOT NULL,
    safety_training_hours INTEGER NOT NULL,
    compliance_score DECIMAL(5,2) NOT NULL,
    osha_rating VARCHAR(50) NOT NULL,
    last_incident_date DATE,
    active_safety_programs INTEGER NOT NULL,
    monthly_inspections INTEGER NOT NULL,
    corrective_actions INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id)
);

-- Safety Incidents Table
CREATE TABLE IF NOT EXISTS safety_incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    corrective_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Safety Training Table
CREATE TABLE IF NOT EXISTS safety_training (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    program_name VARCHAR(255) NOT NULL,
    completed_count INTEGER NOT NULL,
    required_count INTEGER NOT NULL,
    deadline DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, program_name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_construction_daily_progress_project_date ON construction_daily_progress(project_id, date);
CREATE INDEX IF NOT EXISTS idx_construction_trade_progress_project ON construction_trade_progress(project_id);
CREATE INDEX IF NOT EXISTS idx_construction_activities_project_date ON construction_activities(project_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_construction_quality_metrics_project_week ON construction_quality_metrics(project_id, week_ending);
CREATE INDEX IF NOT EXISTS idx_material_deliveries_project_date ON material_deliveries(project_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_safety_metrics_project ON safety_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_safety_incidents_project_date ON safety_incidents(project_id, incident_date);
CREATE INDEX IF NOT EXISTS idx_safety_training_project ON safety_training(project_id);

-- Row Level Security Policies
ALTER TABLE construction_daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_trade_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_training ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view construction_daily_progress for their projects" ON construction_daily_progress FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view construction_trade_progress for their projects" ON construction_trade_progress FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view construction_activities for their projects" ON construction_activities FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view construction_quality_metrics for their projects" ON construction_quality_metrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view material_deliveries for their projects" ON material_deliveries FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view safety_metrics for their projects" ON safety_metrics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view safety_incidents for their projects" ON safety_incidents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view safety_training for their projects" ON safety_training FOR SELECT USING (auth.uid() IS NOT NULL);
