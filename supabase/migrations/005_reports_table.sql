
-- Reports table for storing generated summaries and insights
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- 'weekly_summary', 'monthly_report', etc.
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_reports_project ON reports(project_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_created ON reports(created_at);

-- Updated_at trigger
CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project reports" ON reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = reports.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can modify project reports" ON reports FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = reports.project_id AND projects.owner_id = auth.uid())
);
