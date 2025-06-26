-- Create communication_connections table
CREATE TABLE IF NOT EXISTS communication_connections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz NOT NULL,
  scope text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Ensure one connection per user per provider
  UNIQUE(user_id, provider)
);

-- Add RLS policies
ALTER TABLE communication_connections ENABLE ROW LEVEL SECURITY;

-- Users can only access their own connections
CREATE POLICY "Users can manage their own communication connections" ON communication_connections
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_communication_connections_user_id ON communication_connections(user_id);
CREATE INDEX idx_communication_connections_provider ON communication_connections(provider);
CREATE INDEX idx_communication_connections_expires_at ON communication_connections(expires_at);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_communication_connections_updated_at 
  BEFORE UPDATE ON communication_connections 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
