-- Lead Time Tracker Migration
-- Creates tables and functions for tracking procurement schedules and lead times

-- Create lead_time table
CREATE TABLE IF NOT EXISTS lead_time (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfp_id UUID REFERENCES bid_projects(id) ON DELETE CASCADE,
    work_pkg TEXT NOT NULL,
    scope_csi TEXT[] NOT NULL DEFAULT '{}',
    rfq_issue_date DATE NOT NULL,
    award_due DATE NOT NULL,
    fab_lead_days INTEGER NOT NULL DEFAULT 0,
    delivery_est DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'ontrack', 'late', 'delivered', 'cancelled')) DEFAULT 'pending',
    notes TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    vendor_id UUID REFERENCES company(id) ON DELETE SET NULL,
    contract_value DECIMAL(15,2),
    actual_delivery_date DATE,
    delay_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_time_rfp_id ON lead_time(rfp_id);
CREATE INDEX IF NOT EXISTS idx_lead_time_status ON lead_time(status);
CREATE INDEX IF NOT EXISTS idx_lead_time_delivery_est ON lead_time(delivery_est);
CREATE INDEX IF NOT EXISTS idx_lead_time_vendor_id ON lead_time(vendor_id);
CREATE INDEX IF NOT EXISTS idx_lead_time_scope_csi ON lead_time USING GIN(scope_csi);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_lead_time_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lead_time_updated_at
    BEFORE UPDATE ON lead_time
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_time_updated_at();

-- Create function to calculate delivery status
CREATE OR REPLACE FUNCTION calculate_lead_time_status(
    p_delivery_est DATE,
    p_award_due DATE,
    p_actual_delivery_date DATE DEFAULT NULL
)
RETURNS TEXT AS $$
BEGIN
    -- If actually delivered
    IF p_actual_delivery_date IS NOT NULL THEN
        IF p_actual_delivery_date <= p_delivery_est THEN
            RETURN 'delivered';
        ELSE
            RETURN 'late';
        END IF;
    END IF;
    
    -- If not delivered yet, check schedule
    IF CURRENT_DATE > p_delivery_est THEN
        RETURN 'late';
    ELSIF CURRENT_DATE > p_award_due AND p_delivery_est - CURRENT_DATE <= 7 THEN
        RETURN 'ontrack';
    ELSE
        RETURN 'pending';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get lead time summary
CREATE OR REPLACE FUNCTION get_lead_time_summary(p_rfp_id UUID DEFAULT NULL)
RETURNS TABLE (
    total_items INTEGER,
    pending_items INTEGER,
    ontrack_items INTEGER,
    late_items INTEGER,
    delivered_items INTEGER,
    avg_lead_days NUMERIC,
    critical_items INTEGER,
    total_value NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_items,
        COUNT(*) FILTER (WHERE status = 'pending')::INTEGER as pending_items,
        COUNT(*) FILTER (WHERE status = 'ontrack')::INTEGER as ontrack_items,
        COUNT(*) FILTER (WHERE status = 'late')::INTEGER as late_items,
        COUNT(*) FILTER (WHERE status = 'delivered')::INTEGER as delivered_items,
        AVG(fab_lead_days)::NUMERIC as avg_lead_days,
        COUNT(*) FILTER (WHERE priority = 'critical')::INTEGER as critical_items,
        COALESCE(SUM(contract_value), 0)::NUMERIC as total_value
    FROM lead_time
    WHERE (p_rfp_id IS NULL OR rfp_id = p_rfp_id);
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE lead_time ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all lead time data
CREATE POLICY "Authenticated users can read lead time data" 
ON lead_time FOR SELECT 
TO authenticated 
USING (true);

-- Policy for authenticated users to insert lead time data
CREATE POLICY "Authenticated users can insert lead time data" 
ON lead_time FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy for authenticated users to update lead time data
CREATE POLICY "Authenticated users can update lead time data" 
ON lead_time FOR UPDATE 
TO authenticated 
USING (true);

-- Policy for authenticated users to delete lead time data
CREATE POLICY "Authenticated users can delete lead time data" 
ON lead_time FOR DELETE 
TO authenticated 
USING (true);

-- Insert sample lead time data
INSERT INTO lead_time (
    rfp_id, work_pkg, scope_csi, rfq_issue_date, award_due, fab_lead_days, 
    delivery_est, status, priority, contract_value, notes
) VALUES
    -- Metro Office Complex lead times
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'),
        'Structural Steel Package',
        ARRAY['05 10 00', '05 20 00', '05 30 00'],
        '2024-09-01',
        '2024-09-20',
        45,
        '2024-11-15',
        'ontrack',
        'critical',
        3200000.00,
        'Critical path item - structure must be in place for MEP rough-in'
    ),
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'),
        'HVAC Equipment',
        ARRAY['23 70 00', '23 60 00'],
        '2024-09-15',
        '2024-10-05',
        60,
        '2024-12-10',
        'pending',
        'high',
        1800000.00,
        'Custom air handling units require extended lead time'
    ),
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'),
        'Electrical Switchgear',
        ARRAY['26 20 00'],
        '2024-09-10',
        '2024-09-30',
        75,
        '2024-12-20',
        'pending',
        'high',
        850000.00,
        'Utility coordination required for final specifications'
    ),
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'),
        'Curtain Wall System',
        ARRAY['08 40 00'],
        '2024-08-20',
        '2024-09-10',
        90,
        '2024-12-15',
        'ontrack',
        'medium',
        3500000.00,
        'Performance mockup testing in progress'
    ),
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'),
        'Elevators',
        ARRAY['14 20 00'],
        '2024-08-15',
        '2024-09-05',
        120,
        '2025-01-15',
        'late',
        'critical',
        1250000.00,
        'Delayed due to custom cab finishes approval'
    ),
    -- University Science Building lead times
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'),
        'Laboratory Casework',
        ARRAY['12 30 00'],
        '2024-09-05',
        '2024-09-25',
        85,
        '2024-12-25',
        'pending',
        'high',
        650000.00,
        'Specialized laboratory furniture with chemical resistance'
    ),
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'),
        'Fume Hood Systems',
        ARRAY['23 80 00'],
        '2024-09-01',
        '2024-09-20',
        70,
        '2024-12-01',
        'ontrack',
        'critical',
        450000.00,
        'Laboratory safety critical - no delays acceptable'
    ),
    (
        (SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'),
        'Clean Room HVAC',
        ARRAY['23 70 00'],
        '2024-08-25',
        '2024-09-15',
        95,
        '2024-12-30',
        'ontrack',
        'high',
        1200000.00,
        'Precision environmental controls required'
    );

-- Create event trigger function for lead time updates
CREATE OR REPLACE FUNCTION notify_lead_time_updated()
RETURNS TRIGGER AS $$
BEGIN
    -- Emit event when lead time is updated
    PERFORM pg_notify(
        'leadtime_updated',
        json_build_object(
            'id', NEW.id,
            'work_pkg', NEW.work_pkg,
            'status', NEW.status,
            'delivery_est', NEW.delivery_est,
            'rfp_id', NEW.rfp_id,
            'updated_at', NEW.updated_at
        )::text
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead time updates
CREATE TRIGGER trigger_notify_lead_time_updated
    AFTER INSERT OR UPDATE ON lead_time
    FOR EACH ROW
    EXECUTE FUNCTION notify_lead_time_updated();

-- Grant permissions
GRANT ALL ON lead_time TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_lead_time_status(DATE, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_lead_time_summary(UUID) TO authenticated;

-- Update table statistics
ANALYZE lead_time;
