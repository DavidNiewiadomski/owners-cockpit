-- Migration to create conversations table for AI chat history

-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    project_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX idx_conversations_project_id ON conversations(project_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own conversations
CREATE POLICY "Users can manage their own conversations" ON conversations
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column(); 