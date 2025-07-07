-- Create user_roles table if it does not exist
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL,
    role TEXT NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE rfp_status AS ENUM ('draft', 'published', 'closed', 'awarded');
CREATE TYPE vendor_submission_status AS ENUM ('pending', 'opened', 'scored', 'bafo');

-- Create RFP table
CREATE TABLE rfp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    facility_id UUID REFERENCES projects(id),
    budget_cap NUMERIC(15,2),
    release_date DATE,
    proposal_due DATE,
    contract_start DATE,
    compliance JSONB DEFAULT '{}',
    status rfp_status DEFAULT 'draft',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timeline_event table
CREATE TABLE timeline_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfp(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    mandatory BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scope_item table
CREATE TABLE scope_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfp(id) ON DELETE CASCADE,
    csi_code TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create addendum table
CREATE TABLE addendum (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfp(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    body TEXT, -- Using TEXT instead of markdown for PostgreSQL compatibility
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rfp_id, number)
);

-- Create vendor_submission table
CREATE TABLE vendor_submission (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfp(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL,
    sealed BOOLEAN DEFAULT true,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tech_score NUMERIC(5,2) CHECK (tech_score >= 0 AND tech_score <= 100),
    cost_score NUMERIC(5,2) CHECK (cost_score >= 0 AND cost_score <= 100),
    composite_score NUMERIC(5,2) CHECK (composite_score >= 0 AND composite_score <= 100),
    status vendor_submission_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rfp_id, vendor_id)
);

-- Create question table
CREATE TABLE question (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfp(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL,
    body TEXT NOT NULL,
    answer TEXT, -- Using TEXT instead of markdown for PostgreSQL compatibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answered_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_rfp_facility_id ON rfp(facility_id);
CREATE INDEX idx_rfp_status ON rfp(status);
CREATE INDEX idx_rfp_created_by ON rfp(created_by);
CREATE INDEX idx_timeline_event_rfp_id ON timeline_event(rfp_id);
CREATE INDEX idx_timeline_event_deadline ON timeline_event(deadline);
CREATE INDEX idx_scope_item_rfp_id ON scope_item(rfp_id);
CREATE INDEX idx_scope_item_csi_code ON scope_item(csi_code);
CREATE INDEX idx_addendum_rfp_id ON addendum(rfp_id);
CREATE INDEX idx_vendor_submission_rfp_id ON vendor_submission(rfp_id);
CREATE INDEX idx_vendor_submission_vendor_id ON vendor_submission(vendor_id);
CREATE INDEX idx_vendor_submission_status ON vendor_submission(status);
CREATE INDEX idx_question_rfp_id ON question(rfp_id);
CREATE INDEX idx_question_vendor_id ON question(vendor_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_rfp_updated_at BEFORE UPDATE ON rfp FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timeline_event_updated_at BEFORE UPDATE ON timeline_event FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scope_item_updated_at BEFORE UPDATE ON scope_item FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addendum_updated_at BEFORE UPDATE ON addendum FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_submission_updated_at BEFORE UPDATE ON vendor_submission FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_question_updated_at BEFORE UPDATE ON question FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE rfp ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE addendum ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_submission ENABLE ROW LEVEL SECURITY;
ALTER TABLE question ENABLE ROW LEVEL SECURITY;

-- RFP policies
CREATE POLICY "RFP_ADMIN can do everything on rfp" ON rfp
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

CREATE POLICY "RFP_VENDOR can read published rfp" ON rfp
    FOR SELECT TO authenticated
    USING (
        status IN ('published', 'closed', 'awarded') AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_VENDOR'
        )
    );

-- Timeline event policies
CREATE POLICY "RFP_ADMIN can do everything on timeline_event" ON timeline_event
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

CREATE POLICY "RFP_VENDOR can read timeline_event for published rfp" ON timeline_event
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM rfp 
            WHERE rfp.id = timeline_event.rfp_id 
            AND rfp.status IN ('published', 'closed', 'awarded')
        ) AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_VENDOR'
        )
    );

-- Scope item policies
CREATE POLICY "RFP_ADMIN can do everything on scope_item" ON scope_item
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

CREATE POLICY "RFP_VENDOR can read scope_item for published rfp" ON scope_item
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM rfp 
            WHERE rfp.id = scope_item.rfp_id 
            AND rfp.status IN ('published', 'closed', 'awarded')
        ) AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_VENDOR'
        )
    );

-- Addendum policies
CREATE POLICY "RFP_ADMIN can do everything on addendum" ON addendum
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

CREATE POLICY "RFP_VENDOR can read addendum for published rfp" ON addendum
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM rfp 
            WHERE rfp.id = addendum.rfp_id 
            AND rfp.status IN ('published', 'closed', 'awarded')
        ) AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'RFP_VENDOR'
        )
    );

-- Vendor submission policies
CREATE POLICY "RFP_ADMIN can do everything on vendor_submission" ON vendor_submission
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

CREATE POLICY "RFP_VENDOR can manage their own submissions" ON vendor_submission
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

-- Question policies
CREATE POLICY "RFP_ADMIN can do everything on question" ON question
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

CREATE POLICY "RFP_VENDOR can manage their own questions" ON question
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
