-- Create leveling_snapshot table for storing bid leveling analysis results
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for storing leveling analysis snapshots
CREATE TABLE leveling_snapshot (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    
    -- Snapshot metadata
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_submissions INTEGER NOT NULL DEFAULT 0,
    total_line_items INTEGER NOT NULL DEFAULT 0,
    
    -- Leveling matrix data (JSON)
    matrix_data JSONB NOT NULL DEFAULT '{}',
    
    -- Summary statistics
    summary_stats JSONB DEFAULT '{}', -- Overall statistics across all line items
    outlier_summary JSONB DEFAULT '{}', -- Summary of outliers found
    
    -- Processing metadata
    processing_time_ms INTEGER,
    algorithm_version TEXT DEFAULT '1.0',
    
    -- Status and tracking
    status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'error')),
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_leveling_snapshot_bid_id ON leveling_snapshot(bid_id);
CREATE INDEX idx_leveling_snapshot_analysis_date ON leveling_snapshot(analysis_date);
CREATE INDEX idx_leveling_snapshot_status ON leveling_snapshot(status);

-- Add updated_at trigger
CREATE TRIGGER update_leveling_snapshot_updated_at 
    BEFORE UPDATE ON leveling_snapshot 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE leveling_snapshot ENABLE ROW LEVEL SECURITY;

-- RLS Policies for BID_ADMIN (full access)
CREATE POLICY "BID_ADMIN_full_access_leveling_snapshot" ON leveling_snapshot
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_ADMIN'
        )
    );

-- RLS Policies for BID_REVIEWER (read access)
CREATE POLICY "BID_REVIEWER_read_leveling_snapshot" ON leveling_snapshot
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

-- Function to get the latest leveling snapshot for a bid
CREATE OR REPLACE FUNCTION get_latest_leveling_snapshot(p_bid_id UUID)
RETURNS TABLE (
    snapshot_id UUID,
    analysis_date TIMESTAMP WITH TIME ZONE,
    matrix_data JSONB,
    summary_stats JSONB,
    outlier_summary JSONB,
    total_submissions INTEGER,
    total_line_items INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ls.id,
        ls.analysis_date,
        ls.matrix_data,
        ls.summary_stats,
        ls.outlier_summary,
        ls.total_submissions,
        ls.total_line_items
    FROM leveling_snapshot ls
    WHERE ls.bid_id = p_bid_id
      AND ls.status = 'completed'
    ORDER BY ls.analysis_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old snapshots (keep last 10 per bid)
CREATE OR REPLACE FUNCTION cleanup_old_leveling_snapshots(p_bid_id UUID)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH snapshots_to_keep AS (
        SELECT id
        FROM leveling_snapshot
        WHERE bid_id = p_bid_id
        ORDER BY analysis_date DESC
        LIMIT 10
    )
    DELETE FROM leveling_snapshot
    WHERE bid_id = p_bid_id
      AND id NOT IN (SELECT id FROM snapshots_to_keep);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create event publishing function for bid.leveling.completed
CREATE OR REPLACE FUNCTION publish_leveling_completed_event(
    p_bid_id UUID,
    p_snapshot_id UUID
)
RETURNS VOID AS $$
BEGIN
    -- Log the leveling completion event
    PERFORM log_bid_event(
        p_bid_id,
        'bid.leveling.completed',
        'Bid leveling analysis completed with outlier detection',
        NULL, -- No specific submission
        jsonb_build_object(
            'snapshot_id', p_snapshot_id,
            'analysis_date', NOW()
        )
    );
    
    -- You could also publish to external systems here
    -- e.g., message queues, webhooks, etc.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE leveling_snapshot IS 'Stores bid leveling analysis results including statistical outliers and normalized data';
COMMENT ON COLUMN leveling_snapshot.matrix_data IS 'JSON matrix containing all bid line items with outlier flags and statistics';
COMMENT ON COLUMN leveling_snapshot.summary_stats IS 'Overall statistics including averages, medians, and variance across all line items';
COMMENT ON COLUMN leveling_snapshot.outlier_summary IS 'Summary of outliers found including counts and severity levels';
