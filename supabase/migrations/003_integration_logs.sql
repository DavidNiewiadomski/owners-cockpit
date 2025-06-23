
-- Integration logs table for tracking ETL operations
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    external_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_integration_logs_type_status ON integration_logs(integration_type, status);
CREATE INDEX idx_integration_logs_created_at ON integration_logs(created_at);

-- RLS for integration logs
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their integration logs" ON integration_logs FOR SELECT USING (
    (metadata->>'user_id')::uuid = auth.uid()
);
CREATE POLICY "Users can insert their integration logs" ON integration_logs FOR INSERT WITH CHECK (
    (metadata->>'user_id')::uuid = auth.uid()
);
