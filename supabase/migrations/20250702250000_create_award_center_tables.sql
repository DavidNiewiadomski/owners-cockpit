-- Create award package and contract merge tables
-- This extends the existing bid core tables with award/contract functionality

-- Table: award_packages - Comprehensive award documentation
CREATE TABLE award_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    winning_submission_id UUID NOT NULL REFERENCES submissions(id),
    
    -- Award details
    award_memo_generated_at TIMESTAMP WITH TIME ZONE,
    award_memo_url TEXT, -- PDF download URL
    award_memo_content TEXT, -- Raw memo content for regeneration
    
    -- Selection rationale (for award-bot)
    selection_rationale JSONB NOT NULL DEFAULT '{}', -- structured rationale data
    price_basis JSONB NOT NULL DEFAULT '{}', -- pricing analysis details
    funding_source JSONB NOT NULL DEFAULT '{}', -- funding information
    
    -- Supporting documentation
    final_snapshot_id UUID REFERENCES leveling_snapshot(id),
    scorecard_summary JSONB DEFAULT '{}', -- aggregated scorecard data
    compliance_summary JSONB DEFAULT '{}', -- compliance verification
    
    -- Contract information
    contract_number TEXT UNIQUE,
    contract_value NUMERIC(15,2) NOT NULL,
    contract_start_date DATE,
    contract_end_date DATE,
    contract_duration_months INTEGER,
    
    -- Performance requirements
    performance_bond_required BOOLEAN DEFAULT FALSE,
    performance_bond_percentage NUMERIC(5,2),
    payment_bond_required BOOLEAN DEFAULT FALSE,
    payment_bond_percentage NUMERIC(5,2),
    
    -- DocuSign integration
    docusign_envelope_id TEXT, -- DocuSign envelope ID
    docusign_status TEXT DEFAULT 'pending', -- pending, sent, completed, declined
    docusign_sent_at TIMESTAMP WITH TIME ZONE,
    docusign_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Vendor response
    vendor_acceptance_status TEXT DEFAULT 'pending', -- pending, accepted, declined
    vendor_response_date TIMESTAMP WITH TIME ZONE,
    vendor_decline_reason TEXT,
    vendor_executed_contract_url TEXT,
    
    -- Internal workflow
    award_approved_by UUID NOT NULL,
    award_approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    legal_review_required BOOLEAN DEFAULT TRUE,
    legal_reviewed_by UUID,
    legal_reviewed_at TIMESTAMP WITH TIME ZONE,
    legal_review_notes TEXT,
    
    -- Notifications and events
    award_notification_sent BOOLEAN DEFAULT FALSE,
    award_notification_sent_at TIMESTAMP WITH TIME ZONE,
    rejection_notifications_sent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_by UUID NOT NULL,
    notes TEXT,
    tags JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(bid_id) -- One award package per bid
);

-- Table: award_memo_templates - Templates for award-bot
CREATE TABLE award_memo_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Template details
    name TEXT NOT NULL,
    template_type TEXT NOT NULL, -- 'standard', 'design-build', 'services', etc.
    template_content TEXT NOT NULL, -- HTML template with variables
    
    -- Template metadata
    description TEXT,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- Template variables schema
    required_variables JSONB DEFAULT '[]', -- List of required template variables
    optional_variables JSONB DEFAULT '[]', -- List of optional template variables
    
    -- Approval workflow
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: contract_amendments - Track contract changes post-award
CREATE TABLE contract_amendments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    award_package_id UUID NOT NULL REFERENCES award_packages(id) ON DELETE CASCADE,
    
    -- Amendment details
    amendment_number INTEGER NOT NULL, -- Sequential numbering
    amendment_type TEXT NOT NULL, -- 'price_change', 'time_extension', 'scope_change', etc.
    description TEXT NOT NULL,
    
    -- Financial impact
    original_contract_value NUMERIC(15,2),
    amended_contract_value NUMERIC(15,2),
    value_change NUMERIC(15,2), -- Calculated: amended - original
    value_change_percentage NUMERIC(5,2),
    
    -- Time impact
    original_end_date DATE,
    amended_end_date DATE,
    time_extension_days INTEGER,
    
    -- Justification and approval
    justification TEXT NOT NULL,
    supporting_documents JSONB DEFAULT '[]',
    
    -- Approval workflow
    requested_by UUID NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Vendor agreement
    vendor_agreed BOOLEAN DEFAULT FALSE,
    vendor_signature_date TIMESTAMP WITH TIME ZONE,
    vendor_objection_notes TEXT,
    
    -- Document management
    amendment_document_url TEXT,
    executed_amendment_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(award_package_id, amendment_number)
);

-- Create indexes for performance
CREATE INDEX idx_award_packages_bid_id ON award_packages(bid_id);
CREATE INDEX idx_award_packages_winning_submission_id ON award_packages(winning_submission_id);
CREATE INDEX idx_award_packages_contract_number ON award_packages(contract_number);
CREATE INDEX idx_award_packages_docusign_status ON award_packages(docusign_status);
CREATE INDEX idx_award_packages_vendor_acceptance_status ON award_packages(vendor_acceptance_status);
CREATE INDEX idx_award_packages_created_by ON award_packages(created_by);

CREATE INDEX idx_award_memo_templates_template_type ON award_memo_templates(template_type);
CREATE INDEX idx_award_memo_templates_is_active ON award_memo_templates(is_active);
CREATE INDEX idx_award_memo_templates_is_default ON award_memo_templates(is_default);

CREATE INDEX idx_contract_amendments_award_package_id ON contract_amendments(award_package_id);
CREATE INDEX idx_contract_amendments_amendment_type ON contract_amendments(amendment_type);
CREATE INDEX idx_contract_amendments_requested_by ON contract_amendments(requested_by);

-- Add updated_at triggers
CREATE TRIGGER update_award_packages_updated_at 
    BEFORE UPDATE ON award_packages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_award_memo_templates_updated_at 
    BEFORE UPDATE ON award_memo_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_amendments_updated_at 
    BEFORE UPDATE ON contract_amendments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE award_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_memo_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_amendments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for BID_ADMIN (full access)
CREATE POLICY "BID_ADMIN_full_access_award_packages" ON award_packages
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

CREATE POLICY "BID_ADMIN_full_access_award_memo_templates" ON award_memo_templates
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

CREATE POLICY "BID_ADMIN_full_access_contract_amendments" ON contract_amendments
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

-- RLS Policies for BID_REVIEWER (read access + create awards)
CREATE POLICY "BID_REVIEWER_manage_award_packages" ON award_packages
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

CREATE POLICY "BID_REVIEWER_read_award_memo_templates" ON award_memo_templates
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

CREATE POLICY "BID_REVIEWER_read_contract_amendments" ON contract_amendments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'BID_REVIEWER'
        )
    );

-- Helper Functions

-- Function to create award package and generate memo
CREATE OR REPLACE FUNCTION create_award_package(
    p_bid_id UUID,
    p_winning_submission_id UUID,
    p_contract_value NUMERIC(15,2),
    p_selection_rationale JSONB DEFAULT '{}',
    p_price_basis JSONB DEFAULT '{}',
    p_funding_source JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    award_package_id UUID;
    contract_num TEXT;
    bid_title TEXT;
    project_id UUID;
BEGIN
    -- Get bid information
    SELECT b.title, b.project_id
    INTO bid_title, project_id
    FROM bids b
    WHERE b.id = p_bid_id;
    
    IF bid_title IS NULL THEN
        RAISE EXCEPTION 'Bid not found: %', p_bid_id;
    END IF;
    
    -- Generate contract number
    contract_num := 'CNT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || UPPER(SUBSTRING(MD5(p_bid_id::TEXT), 1, 6));
    
    -- Create award package
    INSERT INTO award_packages (
        bid_id,
        winning_submission_id,
        contract_number,
        contract_value,
        selection_rationale,
        price_basis,
        funding_source,
        created_by,
        award_approved_by
    ) VALUES (
        p_bid_id,
        p_winning_submission_id,
        contract_num,
        p_contract_value,
        p_selection_rationale,
        p_price_basis,
        p_funding_source,
        auth.uid(),
        auth.uid()
    ) RETURNING id INTO award_package_id;
    
    -- Update bid status
    UPDATE bids
    SET status = 'awarded',
        award_date = NOW()
    WHERE id = p_bid_id;
    
    -- Update winning submission status
    UPDATE submissions
    SET status = 'shortlisted'
    WHERE id = p_winning_submission_id;
    
    -- Update losing submissions status
    UPDATE submissions
    SET status = 'rejected'
    WHERE bid_id = p_bid_id 
    AND id != p_winning_submission_id
    AND status != 'rejected';
    
    -- Log award event
    INSERT INTO bid_events (
        bid_id,
        submission_id,
        event_type,
        description,
        triggered_by,
        event_data
    ) VALUES (
        p_bid_id,
        p_winning_submission_id,
        'award_issued',
        'Contract awarded to winning bidder',
        auth.uid(),
        jsonb_build_object(
            'award_package_id', award_package_id,
            'contract_number', contract_num,
            'contract_value', p_contract_value
        )
    );
    
    RETURN award_package_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get award memo data for the bot
CREATE OR REPLACE FUNCTION get_award_memo_data(p_bid_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    snapshot_data JSONB;
    scorecard_data JSONB;
    compliance_data JSONB;
BEGIN
    -- Get the most recent leveling snapshot
    SELECT matrix_data
    INTO snapshot_data
    FROM leveling_snapshot
    WHERE bid_id = p_bid_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Get aggregated scorecard data
    SELECT jsonb_agg(
        jsonb_build_object(
            'submission_id', sc.submission_id,
            'vendor_name', s.vendor_name,
            'composite_score', sc.composite_score,
            'technical_percentage', sc.technical_percentage,
            'commercial_percentage', sc.commercial_percentage,
            'strengths', sc.strengths,
            'weaknesses', sc.weaknesses
        )
    )
    INTO scorecard_data
    FROM scorecards sc
    JOIN submissions s ON s.id = sc.submission_id
    WHERE sc.bid_id = p_bid_id
    AND sc.is_complete = TRUE;
    
    -- Get compliance summary
    SELECT jsonb_agg(
        jsonb_build_object(
            'submission_id', s.id,
            'vendor_name', s.vendor_name,
            'bond_submitted', s.bond_submitted,
            'insurance_submitted', s.insurance_submitted,
            'prequalification_passed', s.prequalification_passed
        )
    )
    INTO compliance_data
    FROM submissions s
    WHERE s.bid_id = p_bid_id
    AND s.status != 'draft';
    
    -- Build comprehensive result
    result := jsonb_build_object(
        'snapshot', COALESCE(snapshot_data, '{}'::jsonb),
        'scorecards', COALESCE(scorecard_data, '[]'::jsonb),
        'compliance', COALESCE(compliance_data, '[]'::jsonb),
        'bid_info', (
            SELECT jsonb_build_object(
                'title', b.title,
                'description', b.description,
                'rfp_number', b.rfp_number,
                'estimated_value', b.estimated_value,
                'submission_deadline', b.submission_deadline,
                'technical_weight', b.technical_weight,
                'commercial_weight', b.commercial_weight
            )
            FROM bids b
            WHERE b.id = p_bid_id
        )
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update award memo after bot generation
CREATE OR REPLACE FUNCTION update_award_memo(
    p_award_package_id UUID,
    p_memo_content TEXT,
    p_memo_url TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE award_packages
    SET 
        award_memo_content = p_memo_content,
        award_memo_url = p_memo_url,
        award_memo_generated_at = NOW()
    WHERE id = p_award_package_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default award memo template
INSERT INTO award_memo_templates (
    name,
    template_type,
    template_content,
    description,
    is_default,
    is_active,
    required_variables,
    created_by
) VALUES (
    'Standard Construction Award Memo',
    'construction',
    '<!DOCTYPE html>
<html>
<head>
    <title>Award Memorandum - {{rfp_number}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
        .vendor-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .vendor-table th, .vendor-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .vendor-table th { background-color: #f2f2f2; }
        .highlight { background-color: #e8f6f3; font-weight: bold; }
        .signature-block { margin-top: 50px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AWARD MEMORANDUM</h1>
        <h2>{{project_title}}</h2>
        <p><strong>RFP No:</strong> {{rfp_number}} | <strong>Date:</strong> {{award_date}}</p>
    </div>

    <div class="section">
        <h2>1. EXECUTIVE SUMMARY</h2>
        <p><strong>Recommended Award:</strong> {{winning_vendor_name}}</p>
        <p><strong>Contract Amount:</strong> ${{contract_amount}}</p>
        <p><strong>Award Basis:</strong> {{award_basis_summary}}</p>
    </div>

    <div class="section">
        <h2>2. SELECTION RATIONALE</h2>
        {{selection_rationale_content}}
    </div>

    <div class="section">
        <h2>3. BID SUMMARY</h2>
        <table class="vendor-table">
            <thead>
                <tr>
                    <th>Vendor</th>
                    <th>Bid Amount</th>
                    <th>Technical Score</th>
                    <th>Commercial Score</th>
                    <th>Composite Score</th>
                    <th>Rank</th>
                </tr>
            </thead>
            <tbody>
                {{vendor_comparison_table}}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>4. PRICE BASIS</h2>
        {{price_basis_analysis}}
    </div>

    <div class="section">
        <h2>5. COMPLIANCE VERIFICATION</h2>
        {{compliance_verification}}
    </div>

    <div class="section">
        <h2>6. FUNDING SOURCE</h2>
        {{funding_source_details}}
    </div>

    <div class="section">
        <h2>7. RECOMMENDATION</h2>
        <p>Based on the comprehensive evaluation of technical merit, commercial competitiveness, and compliance requirements, 
        it is recommended that the contract be awarded to {{winning_vendor_name}} for the amount of ${{contract_amount}}.</p>
    </div>

    <div class="signature-block">
        <p><strong>Prepared by:</strong> {{prepared_by_name}}<br>
        <strong>Title:</strong> {{prepared_by_title}}<br>
        <strong>Date:</strong> {{preparation_date}}</p>
        
        <br><br>
        
        <p><strong>Approved by:</strong> _________________________<br>
        <strong>Title:</strong> Project Manager<br>
        <strong>Date:</strong> _________________________</p>
    </div>
</body>
</html>',
    'Standard template for construction project awards',
    TRUE,
    TRUE,
    '["rfp_number", "project_title", "award_date", "winning_vendor_name", "contract_amount", "award_basis_summary", "selection_rationale_content", "vendor_comparison_table", "price_basis_analysis", "compliance_verification", "funding_source_details", "prepared_by_name", "prepared_by_title", "preparation_date"]',
    '00000000-0000-0000-0000-000000000000'::UUID
);

-- Add table comments
COMMENT ON TABLE award_packages IS 'Comprehensive award documentation and contract management';
COMMENT ON TABLE award_memo_templates IS 'Templates for generating award memoranda via award-bot';
COMMENT ON TABLE contract_amendments IS 'Track contract changes and amendments post-award';

COMMENT ON COLUMN award_packages.selection_rationale IS 'Structured data containing selection reasoning for award-bot';
COMMENT ON COLUMN award_packages.price_basis IS 'Pricing analysis and basis of award for award-bot';
COMMENT ON COLUMN award_packages.funding_source IS 'Funding source information for award-bot';
