-- Extend RFP core with secure bid submission vault
-- Add bid submission tracking to existing RFP tables

-- Add submission tracking columns to vendor_submission table
ALTER TABLE vendor_submission 
ADD COLUMN IF NOT EXISTS technical_document_key TEXT,
ADD COLUMN IF NOT EXISTS commercial_document_key TEXT,
ADD COLUMN IF NOT EXISTS technical_document_sealed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS commercial_document_sealed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS technical_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS commercial_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS technical_opened_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS commercial_opened_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS upload_metadata JSONB DEFAULT '{}';

-- Create bid_submissions table for detailed tracking
CREATE TABLE IF NOT EXISTS bid_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfp(id) ON DELETE CASCADE,
    vendor_submission_id UUID NOT NULL REFERENCES vendor_submission(id) ON DELETE CASCADE,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('technical', 'commercial')),
    
    -- S3 Storage details
    s3_bucket TEXT NOT NULL DEFAULT 'oc-bids',
    s3_key TEXT NOT NULL,
    s3_etag TEXT,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    content_type TEXT,
    
    -- Security & Status
    sealed BOOLEAN DEFAULT false,
    sealed_at TIMESTAMP WITH TIME ZONE,
    encryption_key_id TEXT,
    
    -- Access control
    upload_initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    upload_completed_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    opened_by UUID,
    
    -- Metadata
    upload_metadata JSONB DEFAULT '{}',
    access_log JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vendor_submission_id, submission_type)
);

-- Create presigned_upload_tokens table for tracking upload URLs
CREATE TABLE presigned_upload_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfp(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('technical', 'commercial')),
    
    -- Token details
    s3_key TEXT NOT NULL,
    presigned_url TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status tracking
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    created_by UUID NOT NULL,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one active token per vendor/rfp/type
    UNIQUE(rfp_id, vendor_id, submission_type, used) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for performance
CREATE INDEX idx_bid_submissions_rfp_id ON bid_submissions(rfp_id);
CREATE INDEX idx_bid_submissions_vendor_submission_id ON bid_submissions(vendor_submission_id);
CREATE INDEX idx_bid_submissions_s3_key ON bid_submissions(s3_key);
CREATE INDEX idx_bid_submissions_sealed ON bid_submissions(sealed);
CREATE INDEX idx_bid_submissions_submission_type ON bid_submissions(submission_type);

CREATE INDEX idx_presigned_tokens_rfp_vendor ON presigned_upload_tokens(rfp_id, vendor_id);
CREATE INDEX idx_presigned_tokens_expires ON presigned_upload_tokens(expires_at);
CREATE INDEX idx_presigned_tokens_used ON presigned_upload_tokens(used);

-- Add updated_at trigger for bid_submissions
CREATE TRIGGER update_bid_submissions_updated_at 
    BEFORE UPDATE ON bid_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE bid_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE presigned_upload_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bid_submissions

-- RFP_ADMIN can see everything
CREATE POLICY "RFP_ADMIN_full_access_bid_submissions" ON bid_submissions
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_ADMIN'
        )
    );

-- RFP_VENDOR can see their own submissions
CREATE POLICY "RFP_VENDOR_own_bid_submissions" ON bid_submissions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM vendor_submission vs
            WHERE vs.id = bid_submissions.vendor_submission_id
            AND vs.vendor_id = auth.uid()
        ) AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_VENDOR'
        )
    );

-- RLS Policies for presigned_upload_tokens

-- RFP_ADMIN full access
CREATE POLICY "RFP_ADMIN_full_access_tokens" ON presigned_upload_tokens
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_ADMIN'
        )
    );

-- RFP_VENDOR can manage their own tokens
CREATE POLICY "RFP_VENDOR_own_tokens" ON presigned_upload_tokens
    FOR ALL TO authenticated
    USING (
        vendor_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_VENDOR'
        )
    )
    WITH CHECK (
        vendor_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_VENDOR'
        )
    );

-- Function to check if RFP proposal deadline has passed
CREATE OR REPLACE FUNCTION is_proposal_deadline_passed(p_rfp_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    proposal_due TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT proposal_due INTO proposal_due
    FROM rfp 
    WHERE id = p_rfp_id;
    
    RETURN (proposal_due IS NOT NULL AND NOW() > proposal_due);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate S3 key for bid submission
CREATE OR REPLACE FUNCTION generate_bid_s3_key(
    p_rfp_id UUID,
    p_vendor_id UUID,
    p_submission_type TEXT,
    p_file_name TEXT
)
RETURNS TEXT AS $$
DECLARE
    rfp_number TEXT;
    timestamp_str TEXT;
    safe_filename TEXT;
BEGIN
    -- Get RFP number for folder structure
    SELECT rfp.title INTO rfp_number
    FROM rfp 
    WHERE id = p_rfp_id;
    
    -- Create timestamp string
    timestamp_str := to_char(NOW(), 'YYYY-MM-DD');
    
    -- Sanitize filename (remove special characters, keep extension)
    safe_filename := regexp_replace(p_file_name, '[^a-zA-Z0-9._-]', '_', 'g');
    
    -- Generate hierarchical S3 key
    RETURN format('rfp/%s/%s/%s/%s/%s',
        p_rfp_id,
        timestamp_str,
        p_vendor_id,
        p_submission_type,
        safe_filename
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log submission access
CREATE OR REPLACE FUNCTION log_submission_access(
    p_submission_id UUID,
    p_action TEXT,
    p_user_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
DECLARE
    access_entry JSONB;
BEGIN
    access_entry := jsonb_build_object(
        'timestamp', NOW(),
        'action', p_action,
        'user_id', COALESCE(p_user_id, auth.uid()),
        'metadata', p_metadata
    );
    
    UPDATE bid_submissions 
    SET access_log = access_log || access_entry
    WHERE id = p_submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to automatically seal submissions when uploaded
CREATE OR REPLACE FUNCTION trigger_seal_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- This will be called by the Lambda function via API
    -- when S3 ObjectCreated event is triggered
    
    IF NEW.upload_completed_at IS NOT NULL AND OLD.upload_completed_at IS NULL THEN
        -- Log the sealing action
        PERFORM log_submission_access(
            NEW.id,
            'sealed',
            NULL,
            jsonb_build_object('s3_etag', NEW.s3_etag)
        );
        
        -- Update the corresponding vendor_submission record
        IF NEW.submission_type = 'technical' THEN
            UPDATE vendor_submission 
            SET 
                technical_document_key = NEW.s3_key,
                technical_document_sealed = NEW.sealed,
                technical_uploaded_at = NEW.upload_completed_at
            WHERE id = NEW.vendor_submission_id;
        ELSIF NEW.submission_type = 'commercial' THEN
            UPDATE vendor_submission 
            SET 
                commercial_document_key = NEW.s3_key,
                commercial_document_sealed = NEW.sealed,
                commercial_uploaded_at = NEW.upload_completed_at
            WHERE id = NEW.vendor_submission_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bid_submissions_seal
    AFTER UPDATE ON bid_submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_seal_submission();

-- Add RFP submission status view for easy querying
CREATE OR REPLACE VIEW rfp_submission_status AS
SELECT 
    r.id as rfp_id,
    r.title as rfp_title,
    vs.id as vendor_submission_id,
    vs.vendor_id,
    
    -- Technical submission status
    bs_tech.id as technical_submission_id,
    bs_tech.file_name as technical_file_name,
    bs_tech.sealed as technical_sealed,
    bs_tech.upload_completed_at as technical_uploaded_at,
    bs_tech.opened_at as technical_opened_at,
    
    -- Commercial submission status
    bs_comm.id as commercial_submission_id,
    bs_comm.file_name as commercial_file_name,
    bs_comm.sealed as commercial_sealed,
    bs_comm.upload_completed_at as commercial_uploaded_at,
    bs_comm.opened_at as commercial_opened_at,
    
    -- Overall status
    CASE 
        WHEN bs_tech.opened_at IS NOT NULL AND bs_comm.opened_at IS NOT NULL THEN 'opened'
        WHEN bs_tech.sealed = true AND bs_comm.sealed = true THEN 'sealed'
        WHEN bs_tech.upload_completed_at IS NOT NULL AND bs_comm.upload_completed_at IS NOT NULL THEN 'uploaded'
        WHEN bs_tech.upload_initiated_at IS NOT NULL OR bs_comm.upload_initiated_at IS NOT NULL THEN 'in_progress'
        ELSE 'pending'
    END as overall_status,
    
    -- Timeline info
    r.proposal_due,
    is_proposal_deadline_passed(r.id) as deadline_passed
    
FROM rfp r
JOIN vendor_submission vs ON r.id = vs.rfp_id
LEFT JOIN bid_submissions bs_tech ON vs.id = bs_tech.vendor_submission_id AND bs_tech.submission_type = 'technical'
LEFT JOIN bid_submissions bs_comm ON vs.id = bs_comm.vendor_submission_id AND bs_comm.submission_type = 'commercial';
