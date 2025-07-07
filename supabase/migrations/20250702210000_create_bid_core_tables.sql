-- Create bid-core service database schema
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for bid-core
CREATE TYPE bid_status AS ENUM ('draft', 'open', 'evaluation', 'leveling_complete', 'bafo_requested', 'awarded', 'cancelled');
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'under_review', 'scored', 'shortlisted', 'rejected');
CREATE TYPE evaluation_phase AS ENUM ('technical', 'commercial', 'combined');
CREATE TYPE award_status AS ENUM ('pending', 'awarded', 'declined', 'cancelled');

-- Table 1: bids - Main bid process table
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id),
    rfp_number TEXT UNIQUE NOT NULL,
    bid_type TEXT DEFAULT 'construction', -- construction, design, services, etc.
    estimated_value NUMERIC(15,2),
    currency TEXT DEFAULT 'USD',
    status bid_status DEFAULT 'draft',
    
    -- Timeline
    published_at TIMESTAMP WITH TIME ZONE,
    submission_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    evaluation_start TIMESTAMP WITH TIME ZONE,
    evaluation_end TIMESTAMP WITH TIME ZONE,
    award_date TIMESTAMP WITH TIME ZONE,
    
    -- Bid requirements
    bond_required BOOLEAN DEFAULT false,
    bond_percentage NUMERIC(5,2),
    insurance_required BOOLEAN DEFAULT false,
    prequalification_required BOOLEAN DEFAULT false,
    
    -- Technical evaluation criteria (weights sum to 100)
    technical_weight NUMERIC(5,2) DEFAULT 60.00,
    commercial_weight NUMERIC(5,2) DEFAULT 40.00,
    
    -- Internal tracking
    created_by UUID NOT NULL,
    assigned_evaluator UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: submissions - Vendor bid submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL,
    vendor_name TEXT NOT NULL,
    vendor_contact_email TEXT,
    vendor_contact_phone TEXT,
    
    -- Submission details
    status submission_status DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    technical_proposal_url TEXT,
    commercial_proposal_url TEXT,
    
    -- Pricing information (encrypted/hashed until bid opening)
    base_price NUMERIC(15,2),
    contingency_amount NUMERIC(15,2),
    total_price NUMERIC(15,2),
    price_sealed BOOLEAN DEFAULT true,
    
    -- Compliance & requirements
    bond_submitted BOOLEAN DEFAULT false,
    insurance_submitted BOOLEAN DEFAULT false,
    prequalification_passed BOOLEAN,
    
    -- Internal tracking
    received_by UUID,
    opened_by UUID,
    opened_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(bid_id, vendor_id)
);

-- Table 3: leveling - Bid leveling/normalization data
CREATE TABLE leveling (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    
    -- Leveling adjustments
    scope_clarifications JSONB DEFAULT '[]',
    price_adjustments JSONB DEFAULT '[]',
    technical_adjustments JSONB DEFAULT '[]',
    
    -- Adjusted totals
    leveled_base_price NUMERIC(15,2),
    leveled_total_price NUMERIC(15,2),
    adjustment_rationale TEXT,
    
    -- Leveling status
    is_complete BOOLEAN DEFAULT false,
    leveled_by UUID NOT NULL,
    leveled_at TIMESTAMP WITH TIME ZONE,
    
    -- Recommendations
    recommended_for_shortlist BOOLEAN DEFAULT false,
    recommendation_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(bid_id, submission_id)
);

-- Table 4: scorecards - Evaluation scoring matrix
CREATE TABLE scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL,
    evaluation_phase evaluation_phase NOT NULL,
    
    -- Technical scoring
    technical_scores JSONB DEFAULT '{}', -- { "criterion_1": score, "criterion_2": score }
    technical_total NUMERIC(6,2) DEFAULT 0.00,
    technical_max_possible NUMERIC(6,2) DEFAULT 100.00,
    technical_percentage NUMERIC(5,2) DEFAULT 0.00,
    
    -- Commercial scoring
    commercial_scores JSONB DEFAULT '{}',
    commercial_total NUMERIC(6,2) DEFAULT 0.00,
    commercial_max_possible NUMERIC(6,2) DEFAULT 100.00,
    commercial_percentage NUMERIC(5,2) DEFAULT 0.00,
    
    -- Combined scoring
    weighted_technical_score NUMERIC(6,2) DEFAULT 0.00,
    weighted_commercial_score NUMERIC(6,2) DEFAULT 0.00,
    composite_score NUMERIC(6,2) DEFAULT 0.00,
    
    -- Evaluator notes
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    
    -- Status tracking
    is_complete BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(bid_id, submission_id, evaluator_id, evaluation_phase)
);

-- Table 5: awards - Contract award tracking
CREATE TABLE awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    winning_submission_id UUID NOT NULL REFERENCES submissions(id),
    
    -- Award details
    award_amount NUMERIC(15,2) NOT NULL,
    award_justification TEXT NOT NULL,
    contract_duration_months INTEGER,
    
    -- Status and dates
    status award_status DEFAULT 'pending',
    recommended_by UUID NOT NULL,
    approved_by UUID,
    awarded_at TIMESTAMP WITH TIME ZONE,
    
    -- Contract details
    contract_number TEXT,
    contract_start_date DATE,
    contract_end_date DATE,
    performance_bond_required BOOLEAN DEFAULT false,
    
    -- Vendor acceptance
    vendor_accepted BOOLEAN,
    vendor_acceptance_date TIMESTAMP WITH TIME ZONE,
    vendor_decline_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(bid_id)
);

-- Table 7: bid_events - Audit trail and event log
CREATE TABLE bid_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    
    -- Event details
    event_type TEXT NOT NULL, -- 'bid_opened', 'submission_received', 'leveling_complete', 'bafo_requested', 'award_issued', etc.
    event_data JSONB DEFAULT '{}',
    description TEXT NOT NULL,
    
    -- Actor information
    triggered_by UUID,
    actor_role TEXT,
    
    -- Timestamps
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_bids_project_id ON bids(project_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_rfp_number ON bids(rfp_number);
CREATE INDEX idx_bids_submission_deadline ON bids(submission_deadline);
CREATE INDEX idx_bids_created_by ON bids(created_by);

CREATE INDEX idx_submissions_bid_id ON submissions(bid_id);
CREATE INDEX idx_submissions_vendor_id ON submissions(vendor_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);

CREATE INDEX idx_leveling_bid_id ON leveling(bid_id);
CREATE INDEX idx_leveling_submission_id ON leveling(submission_id);
CREATE INDEX idx_leveling_is_complete ON leveling(is_complete);
CREATE INDEX idx_leveling_leveled_by ON leveling(leveled_by);

CREATE INDEX idx_scorecards_bid_id ON scorecards(bid_id);
CREATE INDEX idx_scorecards_submission_id ON scorecards(submission_id);
CREATE INDEX idx_scorecards_evaluator_id ON scorecards(evaluator_id);
CREATE INDEX idx_scorecards_evaluation_phase ON scorecards(evaluation_phase);
CREATE INDEX idx_scorecards_is_complete ON scorecards(is_complete);


CREATE INDEX idx_awards_bid_id ON awards(bid_id);
CREATE INDEX idx_awards_winning_submission_id ON awards(winning_submission_id);
CREATE INDEX idx_awards_status ON awards(status);

CREATE INDEX idx_bid_events_bid_id ON bid_events(bid_id);
CREATE INDEX idx_bid_events_submission_id ON bid_events(submission_id);
CREATE INDEX idx_bid_events_event_type ON bid_events(event_type);
CREATE INDEX idx_bid_events_occurred_at ON bid_events(occurred_at);
CREATE INDEX idx_bid_events_triggered_by ON bid_events(triggered_by);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leveling_updated_at BEFORE UPDATE ON leveling FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scorecards_updated_at BEFORE UPDATE ON scorecards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON awards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leveling ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for BID_ADMIN (full access)
CREATE POLICY "BID_ADMIN_full_access_bids" ON bids
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

CREATE POLICY "BID_ADMIN_full_access_submissions" ON submissions
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

CREATE POLICY "BID_ADMIN_full_access_leveling" ON leveling
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

CREATE POLICY "BID_ADMIN_full_access_scorecards" ON scorecards
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


CREATE POLICY "BID_ADMIN_full_access_awards" ON awards
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

CREATE POLICY "BID_ADMIN_full_access_bid_events" ON bid_events
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

-- RLS Policies for BID_REVIEWER (read + patch on leveling, scorecard)
CREATE POLICY "BID_REVIEWER_read_bids" ON bids
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

CREATE POLICY "BID_REVIEWER_read_submissions" ON submissions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

CREATE POLICY "BID_REVIEWER_manage_leveling" ON leveling
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

CREATE POLICY "BID_REVIEWER_manage_scorecards" ON scorecards
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );


CREATE POLICY "BID_REVIEWER_read_awards" ON awards
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

CREATE POLICY "BID_REVIEWER_read_bid_events" ON bid_events
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

-- RLS Policies for VENDOR (create/read own submission, no internal cost fields)
CREATE POLICY "VENDOR_read_open_bids" ON bids
    FOR SELECT TO authenticated
    USING (
        status IN ('open', 'evaluation') AND
        published_at IS NOT NULL AND
        submission_deadline > NOW() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'VENDOR'
        )
    );

CREATE POLICY "VENDOR_manage_own_submissions" ON submissions
    FOR ALL TO authenticated
    USING (
        vendor_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'VENDOR'
        )
    )
    WITH CHECK (
        vendor_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'VENDOR'
        )
    );

-- VENDOR cannot see leveling, scorecards, bafo_requests, awards, or bid_events
-- (No policies = no access for VENDOR role)

-- Function to create bid event entries automatically
CREATE OR REPLACE FUNCTION log_bid_event(
    p_bid_id UUID,
    p_event_type TEXT,
    p_description TEXT,
    p_submission_id UUID DEFAULT NULL,
    p_event_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO bid_events (
        bid_id,
        submission_id,
        event_type,
        description,
        event_data,
        triggered_by,
        actor_role
    ) VALUES (
        p_bid_id,
        p_submission_id,
        p_event_type,
        p_description,
        p_event_data,
        auth.uid(),
        (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1)
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to automatically log bid events
CREATE OR REPLACE FUNCTION trigger_log_bid_opened()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'open' AND NEW.status = 'open' THEN
        PERFORM log_bid_event(
            NEW.id,
            'bid.opened',
            'Bid was opened for submissions',
            NULL,
            jsonb_build_object('published_at', NEW.published_at)
        );
    END IF;
    
    IF OLD.status = 'evaluation' AND NEW.status != 'evaluation' THEN
        -- Check if leveling is complete for all submissions
        IF NOT EXISTS (
            SELECT 1 FROM submissions s 
            JOIN leveling l ON s.id = l.submission_id 
            WHERE s.bid_id = NEW.id AND l.is_complete = false
        ) THEN
            PERFORM log_bid_event(
                NEW.id,
                'bid.leveling.completed',
                'Bid leveling phase completed for all submissions',
                NULL,
                '{}'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bids_log_events
    AFTER UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION trigger_log_bid_opened();

CREATE OR REPLACE FUNCTION trigger_log_bafo_requested()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM log_bid_event(
        NEW.bid_id,
        'bid.bafo.requested',
        'Best and Final Offer requested from vendor',
        NEW.submission_id,
        jsonb_build_object(
            'response_deadline', NEW.response_deadline,
            'price_reduction_target', NEW.price_reduction_target
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION trigger_log_award_issued()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'awarded' AND NEW.status = 'awarded' THEN
        PERFORM log_bid_event(
            NEW.bid_id,
            'bid.award.issued',
            'Contract award issued to winning vendor',
            NEW.winning_submission_id,
            jsonb_build_object(
                'award_amount', NEW.award_amount,
                'contract_number', NEW.contract_number
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_awards_log_events
    AFTER UPDATE ON awards
    FOR EACH ROW
    EXECUTE FUNCTION trigger_log_award_issued();
