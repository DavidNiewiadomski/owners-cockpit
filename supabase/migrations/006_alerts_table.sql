
-- Alerts table for storing risk alerts and tracking sent notifications
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'overdue_tasks', 'budget_variance', 'overdue_rfi'
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts sent tracking table for deduplication
CREATE TABLE alerts_sent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    alert_key VARCHAR(255) NOT NULL, -- unique identifier for the specific alert (e.g., task_id, rfi_id)
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, alert_type, alert_key)
);

-- Indexes for performance
CREATE INDEX idx_alerts_project ON alerts(project_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_resolved ON alerts(resolved);
CREATE INDEX idx_alerts_created ON alerts(created_at);
CREATE INDEX idx_alerts_sent_project ON alerts_sent(project_id);
CREATE INDEX idx_alerts_sent_type ON alerts_sent(alert_type);
CREATE INDEX idx_alerts_sent_key ON alerts_sent(alert_key);

-- Updated_at trigger
CREATE TRIGGER update_alerts_updated_at 
    BEFORE UPDATE ON alerts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts_sent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project alerts" ON alerts FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = alerts.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can modify project alerts" ON alerts FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = alerts.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project alerts_sent" ON alerts_sent FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = alerts_sent.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can modify project alerts_sent" ON alerts_sent FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = alerts_sent.project_id AND projects.owner_id = auth.uid())
);
