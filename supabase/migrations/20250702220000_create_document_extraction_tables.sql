-- Create document extraction tables for bid data parsing
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: bid_line_item - Individual cost line items from bid documents
CREATE TABLE bid_line_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    file_id TEXT NOT NULL,
    
    -- Cost breakdown fields extracted from documents
    csi_code TEXT, -- Construction Specification Institute code
    description TEXT NOT NULL,
    qty NUMERIC(15,3), -- Quantity
    uom TEXT, -- Unit of measure (sf, lf, ea, etc.)
    unit_price NUMERIC(15,2), -- Price per unit
    extended NUMERIC(15,2) NOT NULL, -- Extended total price
    
    -- Extraction metadata
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confidence_score NUMERIC(3,2), -- AI extraction confidence (0.00-1.00)
    raw_text TEXT, -- Original text that was parsed
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: bid_alt - Bid alternates (alternative scope items)
CREATE TABLE bid_alt (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    file_id TEXT NOT NULL,
    
    -- Alternate details
    alternate_number INTEGER NOT NULL, -- Alt #1, Alt #2, etc.
    description TEXT NOT NULL,
    price NUMERIC(15,2) NOT NULL, -- Can be positive (additive) or negative (deductive)
    
    -- Extraction metadata
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confidence_score NUMERIC(3,2),
    raw_text TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(submission_id, file_id, alternate_number)
);

-- Table 3: bid_unit_price - Unit price schedule items
CREATE TABLE bid_unit_price (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    file_id TEXT NOT NULL,
    
    -- Unit price details
    item_number TEXT,
    description TEXT NOT NULL,
    unit TEXT NOT NULL, -- Unit of measure
    estimated_qty NUMERIC(15,3), -- Owner's estimated quantity
    unit_price NUMERIC(15,2) NOT NULL, -- Vendor's unit price
    extended_price NUMERIC(15,2), -- unit_price * estimated_qty
    
    -- Extraction metadata
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confidence_score NUMERIC(3,2),
    raw_text TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_bid_line_item_submission_id ON bid_line_item(submission_id);
CREATE INDEX idx_bid_line_item_file_id ON bid_line_item(file_id);
CREATE INDEX idx_bid_line_item_csi_code ON bid_line_item(csi_code);
CREATE INDEX idx_bid_line_item_extracted_at ON bid_line_item(extracted_at);

CREATE INDEX idx_bid_alt_submission_id ON bid_alt(submission_id);
CREATE INDEX idx_bid_alt_file_id ON bid_alt(file_id);
CREATE INDEX idx_bid_alt_alternate_number ON bid_alt(alternate_number);

CREATE INDEX idx_bid_unit_price_submission_id ON bid_unit_price(submission_id);
CREATE INDEX idx_bid_unit_price_file_id ON bid_unit_price(file_id);
CREATE INDEX idx_bid_unit_price_item_number ON bid_unit_price(item_number);

-- Add updated_at triggers
CREATE TRIGGER update_bid_line_item_updated_at 
    BEFORE UPDATE ON bid_line_item 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bid_alt_updated_at 
    BEFORE UPDATE ON bid_alt 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bid_unit_price_updated_at 
    BEFORE UPDATE ON bid_unit_price 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE bid_line_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_alt ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_unit_price ENABLE ROW LEVEL SECURITY;

-- RLS Policies for BID_ADMIN (full access)
CREATE POLICY "BID_ADMIN_full_access_bid_line_item" ON bid_line_item
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

CREATE POLICY "BID_ADMIN_full_access_bid_alt" ON bid_alt
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

CREATE POLICY "BID_ADMIN_full_access_bid_unit_price" ON bid_unit_price
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
CREATE POLICY "BID_REVIEWER_read_bid_line_item" ON bid_line_item
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

CREATE POLICY "BID_REVIEWER_read_bid_alt" ON bid_alt
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

CREATE POLICY "BID_REVIEWER_read_bid_unit_price" ON bid_unit_price
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

-- Function to calculate base bid total from line items
CREATE OR REPLACE FUNCTION calculate_base_bid_total(p_submission_id UUID, p_file_id TEXT)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    total NUMERIC(15,2);
BEGIN
    SELECT COALESCE(SUM(extended), 0)
    INTO total
    FROM bid_line_item
    WHERE submission_id = p_submission_id AND file_id = p_file_id;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to get extraction summary for a file
CREATE OR REPLACE FUNCTION get_extraction_summary(p_submission_id UUID, p_file_id TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    line_items_count INTEGER;
    alternates_count INTEGER;
    unit_prices_count INTEGER;
    base_total NUMERIC(15,2);
BEGIN
    -- Count extracted items
    SELECT COUNT(*) INTO line_items_count 
    FROM bid_line_item 
    WHERE submission_id = p_submission_id AND file_id = p_file_id;
    
    SELECT COUNT(*) INTO alternates_count 
    FROM bid_alt 
    WHERE submission_id = p_submission_id AND file_id = p_file_id;
    
    SELECT COUNT(*) INTO unit_prices_count 
    FROM bid_unit_price 
    WHERE submission_id = p_submission_id AND file_id = p_file_id;
    
    -- Calculate base total
    SELECT calculate_base_bid_total(p_submission_id, p_file_id) INTO base_total;
    
    -- Build result JSON
    result := jsonb_build_object(
        'submission_id', p_submission_id,
        'file_id', p_file_id,
        'line_items_count', line_items_count,
        'alternates_count', alternates_count,
        'unit_prices_count', unit_prices_count,
        'base_bid_total', base_total,
        'extracted_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
