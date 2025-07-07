-- Bid Leveling Database Schema
-- This schema supports the comprehensive bid leveling and analysis system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Drop existing tables if they exist (in dependency order)
DROP TABLE IF EXISTS leveling_snapshots CASCADE;
DROP TABLE IF EXISTS bid_line_items CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS bids CASCADE;

-- Create bids table (RFPs)
CREATE TABLE bids (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    project_id VARCHAR(50),
    rfp_number VARCHAR(100) UNIQUE NOT NULL,
    bid_type VARCHAR(50) DEFAULT 'lump_sum',
    estimated_value BIGINT,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'draft',
    
    -- Timeline
    published_at TIMESTAMPTZ,
    submission_deadline TIMESTAMPTZ NOT NULL,
    evaluation_start TIMESTAMPTZ,
    evaluation_end TIMESTAMPTZ,
    award_date TIMESTAMPTZ,
    
    -- Requirements
    bond_required BOOLEAN DEFAULT false,
    bond_percentage DECIMAL(5,2),
    insurance_required BOOLEAN DEFAULT false,
    prequalification_required BOOLEAN DEFAULT false,
    
    -- Evaluation criteria
    technical_weight INTEGER DEFAULT 30,
    commercial_weight INTEGER DEFAULT 70,
    
    -- Internal tracking
    created_by VARCHAR(50),
    assigned_evaluator VARCHAR(50),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
    id VARCHAR(50) PRIMARY KEY,
    bid_id VARCHAR(50) NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    vendor_id VARCHAR(100),
    vendor_name VARCHAR(200) NOT NULL,
    vendor_contact_email VARCHAR(100),
    vendor_contact_phone VARCHAR(20),
    
    -- Submission details
    status VARCHAR(50) DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    technical_proposal_url TEXT,
    commercial_proposal_url TEXT,
    
    -- Pricing (hidden from vendors until bid opening)
    base_price BIGINT,
    contingency_amount BIGINT,
    total_price BIGINT,
    price_sealed BOOLEAN DEFAULT true,
    
    -- Compliance
    bond_submitted BOOLEAN DEFAULT false,
    insurance_submitted BOOLEAN DEFAULT false,
    prequalification_passed BOOLEAN,
    
    -- Internal tracking
    received_by VARCHAR(50),
    opened_by VARCHAR(50),
    opened_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bid_line_items table for detailed pricing
CREATE TABLE bid_line_items (
    id VARCHAR(50) PRIMARY KEY,
    submission_id VARCHAR(50) NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    vendor_name VARCHAR(200) NOT NULL,
    csi_code VARCHAR(20),
    description TEXT NOT NULL,
    qty DECIMAL(15,2),
    uom VARCHAR(20),
    unit_price DECIMAL(15,2),
    extended BIGINT,
    is_allowance BOOLEAN DEFAULT false,
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    extracted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leveling_snapshots table for analysis results
CREATE TABLE leveling_snapshots (
    id VARCHAR(50) PRIMARY KEY,
    rfp_id VARCHAR(50) NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    analysis_date TIMESTAMPTZ NOT NULL,
    total_submissions INTEGER NOT NULL,
    total_line_items INTEGER NOT NULL,
    
    -- JSON columns for complex data structures
    matrix_data JSONB NOT NULL DEFAULT '[]',
    summary_stats JSONB NOT NULL DEFAULT '{}',
    outlier_summary JSONB NOT NULL DEFAULT '{}',
    
    processing_time_ms INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_submission_deadline ON bids(submission_deadline);
CREATE INDEX idx_bids_rfp_number ON bids(rfp_number);

CREATE INDEX idx_submissions_bid_id ON submissions(bid_id);
CREATE INDEX idx_submissions_vendor_name ON submissions(vendor_name);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);

CREATE INDEX idx_bid_line_items_submission_id ON bid_line_items(submission_id);
CREATE INDEX idx_bid_line_items_csi_code ON bid_line_items(csi_code);
CREATE INDEX idx_bid_line_items_vendor_name ON bid_line_items(vendor_name);
CREATE INDEX idx_bid_line_items_extended ON bid_line_items(extended);

CREATE INDEX idx_leveling_snapshots_rfp_id ON leveling_snapshots(rfp_id);
CREATE INDEX idx_leveling_snapshots_analysis_date ON leveling_snapshots(analysis_date);

-- Create GIN indexes for JSONB columns
CREATE INDEX idx_leveling_snapshots_matrix_data ON leveling_snapshots USING GIN (matrix_data);
CREATE INDEX idx_leveling_snapshots_summary_stats ON leveling_snapshots USING GIN (summary_stats);
CREATE INDEX idx_leveling_snapshots_outlier_summary ON leveling_snapshots USING GIN (outlier_summary);

-- Create function to get latest leveling snapshot
CREATE OR REPLACE FUNCTION get_latest_leveling_snapshot(p_rfp_id VARCHAR)
RETURNS TABLE (
    snapshot_id VARCHAR,
    analysis_date TIMESTAMPTZ,
    total_submissions INTEGER,
    total_line_items INTEGER,
    matrix_data JSONB,
    summary_stats JSONB,
    outlier_summary JSONB,
    processing_time_ms INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ls.id,
        ls.analysis_date,
        ls.total_submissions,
        ls.total_line_items,
        ls.matrix_data,
        ls.summary_stats,
        ls.outlier_summary,
        ls.processing_time_ms
    FROM leveling_snapshots ls
    WHERE ls.rfp_id = p_rfp_id
    ORDER BY ls.analysis_date DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to get vendor base bids
CREATE OR REPLACE FUNCTION get_vendor_base_bids(p_rfp_id VARCHAR)
RETURNS TABLE (
    vendor_name VARCHAR,
    submission_id VARCHAR,
    base_total BIGINT,
    allowance_total BIGINT,
    adjusted_total BIGINT,
    line_item_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH vendor_totals AS (
        SELECT 
            s.vendor_name,
            s.id as submission_id,
            COALESCE(SUM(CASE WHEN bli.is_allowance = false THEN bli.extended ELSE 0 END), 0) as base_total,
            COALESCE(SUM(CASE WHEN bli.is_allowance = true THEN bli.extended ELSE 0 END), 0) as allowance_total,
            COUNT(bli.id) as line_item_count
        FROM submissions s
        LEFT JOIN bid_line_items bli ON s.id = bli.submission_id
        WHERE s.bid_id = p_rfp_id
        GROUP BY s.vendor_name, s.id
    )
    SELECT 
        vt.vendor_name,
        vt.submission_id,
        vt.base_total,
        vt.allowance_total,
        (vt.base_total - vt.allowance_total) as adjusted_total,
        vt.line_item_count
    FROM vendor_totals vt
    ORDER BY adjusted_total ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get RFPs needing leveling
CREATE OR REPLACE FUNCTION get_rfps_needing_leveling()
RETURNS TABLE (
    rfp_id VARCHAR,
    title VARCHAR,
    status VARCHAR,
    submission_deadline TIMESTAMPTZ,
    submission_count INTEGER,
    has_recent_snapshot BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH rfp_data AS (
        SELECT 
            b.id,
            b.title,
            b.status,
            b.submission_deadline,
            COUNT(s.id) as submission_count,
            CASE 
                WHEN MAX(ls.analysis_date) > NOW() - INTERVAL '24 hours' THEN true 
                ELSE false 
            END as has_recent_snapshot
        FROM bids b
        LEFT JOIN submissions s ON b.id = s.bid_id AND s.status = 'submitted'
        LEFT JOIN leveling_snapshots ls ON b.id = ls.rfp_id
        WHERE b.status IN ('evaluation', 'open') 
            AND b.submission_deadline < NOW()
        GROUP BY b.id, b.title, b.status, b.submission_deadline
    )
    SELECT 
        rd.id,
        rd.title,
        rd.status,
        rd.submission_deadline,
        rd.submission_count,
        rd.has_recent_snapshot
    FROM rfp_data rd
    WHERE rd.submission_count > 0
    ORDER BY rd.submission_deadline ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate outlier statistics
CREATE OR REPLACE FUNCTION calculate_outlier_statistics(prices DECIMAL[])
RETURNS JSONB AS $$
DECLARE
    sorted_prices DECIMAL[];
    q1 DECIMAL;
    q3 DECIMAL;
    iqr DECIMAL;
    lower_bound DECIMAL;
    upper_bound DECIMAL;
    mean_val DECIMAL;
    std_dev DECIMAL;
BEGIN
    -- Sort the prices
    SELECT ARRAY(SELECT unnest(prices) ORDER BY 1) INTO sorted_prices;
    
    -- Calculate quartiles
    q1 := percentile_cont(0.25) WITHIN GROUP (ORDER BY unnest(prices));
    q3 := percentile_cont(0.75) WITHIN GROUP (ORDER BY unnest(prices));
    iqr := q3 - q1;
    
    -- Calculate outlier bounds
    lower_bound := q1 - 1.5 * iqr;
    upper_bound := q3 + 1.5 * iqr;
    
    -- Calculate mean and standard deviation
    mean_val := (SELECT AVG(unnest) FROM unnest(prices));
    std_dev := (SELECT STDDEV(unnest) FROM unnest(prices));
    
    RETURN jsonb_build_object(
        'q1', q1,
        'q3', q3,
        'iqr', iqr,
        'lower_bound', lower_bound,
        'upper_bound', upper_bound,
        'mean', mean_val,
        'median', percentile_cont(0.5) WITHIN GROUP (ORDER BY unnest(prices)),
        'std_dev', std_dev,
        'min', (SELECT MIN(unnest) FROM unnest(prices)),
        'max', (SELECT MAX(unnest) FROM unnest(prices))
    );
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_bids_updated_at 
    BEFORE UPDATE ON bids 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bid_line_items_updated_at 
    BEFORE UPDATE ON bid_line_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leveling_snapshots_updated_at 
    BEFORE UPDATE ON leveling_snapshots 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Create sample view for dashboard reporting
CREATE OR REPLACE VIEW bid_leveling_dashboard AS
SELECT 
    b.id as rfp_id,
    b.title,
    b.rfp_number,
    b.status as rfp_status,
    b.estimated_value,
    b.submission_deadline,
    COUNT(DISTINCT s.id) as submission_count,
    ls.analysis_date as last_analysis,
    ls.total_submissions,
    ls.total_line_items,
    (ls.outlier_summary->>'totalOutliers')::INTEGER as total_outliers,
    (ls.summary_stats->'outlierPercentage')::DECIMAL as outlier_percentage,
    (ls.summary_stats->'baseBidStatistics'->>'median')::BIGINT as median_bid,
    (ls.summary_stats->'baseBidStatistics'->>'min')::BIGINT as lowest_bid,
    (ls.summary_stats->'baseBidStatistics'->>'max')::BIGINT as highest_bid
FROM bids b
LEFT JOIN submissions s ON b.id = s.bid_id AND s.status = 'submitted'
LEFT JOIN leveling_snapshots ls ON b.id = ls.rfp_id 
    AND ls.analysis_date = (
        SELECT MAX(analysis_date) 
        FROM leveling_snapshots ls2 
        WHERE ls2.rfp_id = b.id
    )
WHERE b.status IN ('evaluation', 'open')
GROUP BY b.id, b.title, b.rfp_number, b.status, b.estimated_value, 
         b.submission_deadline, ls.analysis_date, ls.total_submissions, 
         ls.total_line_items, ls.outlier_summary, ls.summary_stats
ORDER BY b.submission_deadline DESC;

COMMENT ON TABLE bids IS 'RFP/Bid opportunities with requirements and timeline';
COMMENT ON TABLE submissions IS 'Vendor submissions/proposals for each RFP';
COMMENT ON TABLE bid_line_items IS 'Detailed line item pricing from vendor submissions';
COMMENT ON TABLE leveling_snapshots IS 'Analysis snapshots with outlier detection and statistics';
COMMENT ON VIEW bid_leveling_dashboard IS 'Dashboard view for bid leveling overview and metrics';
