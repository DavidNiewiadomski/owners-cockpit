
-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create custom types
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'completed', 'blocked');
CREATE TYPE rfi_status AS ENUM ('open', 'pending_response', 'responded', 'closed');
CREATE TYPE document_type AS ENUM ('drawing', 'specification', 'report', 'photo', 'contract', 'other');
