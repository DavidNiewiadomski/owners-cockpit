-- Migration for AI Construction Assistant tables
-- Following the patterns from the original repository

-- Create data_store table for key-value storage (used by memory manager and LLM router)
CREATE TABLE IF NOT EXISTS data_store (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversation_memory table for conversation history
CREATE TABLE IF NOT EXISTS conversation_memory (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversation_cache table for faster access
CREATE TABLE IF NOT EXISTS conversation_cache (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  conversation_history JSONB,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  total_tokens INTEGER DEFAULT 0
);

-- Create ai_usage_tracking table for budget management
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id BIGSERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  total_cost_cents INTEGER DEFAULT 0,
  model_usage JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create construction_tool_logs table for tool execution audit
CREATE TABLE IF NOT EXISTS construction_tool_logs (
  id BIGSERIAL PRIMARY KEY,
  execution_id TEXT UNIQUE NOT NULL,
  tool_name TEXT NOT NULL,
  parameters JSONB,
  result JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  cost_cents INTEGER DEFAULT 0,
  user_id TEXT,
  project_id TEXT,
  requires_approval BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_data_store_key ON data_store(key);
CREATE INDEX IF NOT EXISTS idx_conversation_memory_key ON conversation_memory(key);
CREATE INDEX IF NOT EXISTS idx_conversation_cache_key ON conversation_cache(key);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_date ON ai_usage_tracking(date);
CREATE INDEX IF NOT EXISTS idx_construction_tool_logs_execution_id ON construction_tool_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_construction_tool_logs_project_id ON construction_tool_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_construction_tool_logs_status ON construction_tool_logs(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_data_store_updated_at BEFORE UPDATE ON data_store FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_conversation_memory_updated_at BEFORE UPDATE ON conversation_memory FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_usage_tracking_updated_at BEFORE UPDATE ON ai_usage_tracking FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert initial budget tracking record
INSERT INTO ai_usage_tracking (date, total_cost_cents) 
VALUES (CURRENT_DATE, 0) 
ON CONFLICT (date) DO NOTHING;

-- Add RLS policies (if needed)
ALTER TABLE data_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_tool_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can manage data_store" ON data_store FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage conversation_memory" ON conversation_memory FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage conversation_cache" ON conversation_cache FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage ai_usage_tracking" ON ai_usage_tracking FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage construction_tool_logs" ON construction_tool_logs FOR ALL TO service_role USING (true);
