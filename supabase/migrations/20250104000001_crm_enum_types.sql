-- CRM Enum Types Migration
-- This migration creates or updates enum types needed for the CRM system

-- Create ENUM types for new tables (if they don't exist)
DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN 
        -- Add missing values to existing enum in separate statements
        null;
END $$;

-- Add missing values if the type already exists
DO $$ BEGIN
    ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'todo';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'in_progress';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'review';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'done';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'cancelled';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_priority ADD VALUE IF NOT EXISTS 'low';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_priority ADD VALUE IF NOT EXISTS 'medium';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_priority ADD VALUE IF NOT EXISTS 'high';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE task_priority ADD VALUE IF NOT EXISTS 'urgent';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('contract', 'proposal', 'invoice', 'report', 'presentation', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'contract';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'proposal';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'invoice';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'report';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'presentation';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'other';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE communication_type AS ENUM ('email', 'phone', 'meeting', 'note', 'sms', 'chat');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_type ADD VALUE IF NOT EXISTS 'email';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_type ADD VALUE IF NOT EXISTS 'phone';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_type ADD VALUE IF NOT EXISTS 'meeting';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_type ADD VALUE IF NOT EXISTS 'note';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_type ADD VALUE IF NOT EXISTS 'sms';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_type ADD VALUE IF NOT EXISTS 'chat';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE communication_status AS ENUM ('draft', 'sent', 'delivered', 'read', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_status ADD VALUE IF NOT EXISTS 'draft';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_status ADD VALUE IF NOT EXISTS 'sent';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_status ADD VALUE IF NOT EXISTS 'delivered';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_status ADD VALUE IF NOT EXISTS 'read';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_status ADD VALUE IF NOT EXISTS 'completed';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE communication_status ADD VALUE IF NOT EXISTS 'failed';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_type AS ENUM ('created', 'updated', 'deleted', 'viewed', 'shared', 'commented', 'status_changed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'created';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'updated';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'deleted';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'viewed';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'shared';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'commented';
EXCEPTION WHEN others THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'status_changed';
EXCEPTION WHEN others THEN null;
END $$;
