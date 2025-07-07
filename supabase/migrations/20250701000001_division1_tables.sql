-- Division 1 specific tables for General Requirements compliance tracking

-- Division 1 Sections table
CREATE TABLE IF NOT EXISTS division1_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    section_number VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    due_date DATE,
    docs_on_file INTEGER DEFAULT 0,
    required_docs INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium',
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, section_number)
);

-- Division 1 Issues table  
CREATE TABLE IF NOT EXISTS division1_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL REFERENCES division1_sections(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    assigned_to VARCHAR(255),
    resolved_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Division 1 Attachments table
CREATE TABLE IF NOT EXISTS division1_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL REFERENCES division1_sections(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Division 1 Compliance Logs table
CREATE TABLE IF NOT EXISTS division1_compliance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    section_id UUID REFERENCES division1_sections(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    performed_by VARCHAR(255),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Division 1 Audit Results table
CREATE TABLE IF NOT EXISTS division1_audit_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    audit_date DATE NOT NULL,
    overall_compliance_score DECIMAL(5,2) NOT NULL,
    sections_compliant INTEGER NOT NULL,
    total_sections INTEGER NOT NULL,
    critical_issues INTEGER DEFAULT 0,
    medium_issues INTEGER DEFAULT 0,
    low_issues INTEGER DEFAULT 0,
    auditor VARCHAR(255),
    summary TEXT,
    recommendations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_division1_sections_project_id ON division1_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_division1_sections_status ON division1_sections(status);
CREATE INDEX IF NOT EXISTS idx_division1_sections_due_date ON division1_sections(due_date);
CREATE INDEX IF NOT EXISTS idx_division1_issues_section_id ON division1_issues(section_id);
CREATE INDEX IF NOT EXISTS idx_division1_issues_severity ON division1_issues(severity);
CREATE INDEX IF NOT EXISTS idx_division1_issues_status ON division1_issues(status);
CREATE INDEX IF NOT EXISTS idx_division1_attachments_section_id ON division1_attachments(section_id);
CREATE INDEX IF NOT EXISTS idx_division1_compliance_logs_project_id ON division1_compliance_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_division1_audit_results_project_id ON division1_audit_results(project_id);

-- Row Level Security Policies
ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE division1_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE division1_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE division1_compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE division1_audit_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view division1_sections for their projects" ON division1_sections FOR SELECT 
    USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = division1_sections.project_id AND projects.owner_id = auth.uid()));
    
CREATE POLICY "Users can modify division1_sections for their projects" ON division1_sections FOR ALL 
    USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = division1_sections.project_id AND projects.owner_id = auth.uid()));

CREATE POLICY "Users can view division1_issues for their projects" ON division1_issues FOR SELECT 
    USING (EXISTS (SELECT 1 FROM division1_sections s JOIN projects p ON p.id = s.project_id WHERE s.id = division1_issues.section_id AND p.owner_id = auth.uid()));
    
CREATE POLICY "Users can modify division1_issues for their projects" ON division1_issues FOR ALL 
    USING (EXISTS (SELECT 1 FROM division1_sections s JOIN projects p ON p.id = s.project_id WHERE s.id = division1_issues.section_id AND p.owner_id = auth.uid()));

CREATE POLICY "Users can view division1_attachments for their projects" ON division1_attachments FOR SELECT 
    USING (EXISTS (SELECT 1 FROM division1_sections s JOIN projects p ON p.id = s.project_id WHERE s.id = division1_attachments.section_id AND p.owner_id = auth.uid()));
    
CREATE POLICY "Users can modify division1_attachments for their projects" ON division1_attachments FOR ALL 
    USING (EXISTS (SELECT 1 FROM division1_sections s JOIN projects p ON p.id = s.project_id WHERE s.id = division1_attachments.section_id AND p.owner_id = auth.uid()));

CREATE POLICY "Users can view division1_compliance_logs for their projects" ON division1_compliance_logs FOR SELECT 
    USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = division1_compliance_logs.project_id AND projects.owner_id = auth.uid()));
    
CREATE POLICY "Users can modify division1_compliance_logs for their projects" ON division1_compliance_logs FOR ALL 
    USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = division1_compliance_logs.project_id AND projects.owner_id = auth.uid()));

CREATE POLICY "Users can view division1_audit_results for their projects" ON division1_audit_results FOR SELECT 
    USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = division1_audit_results.project_id AND projects.owner_id = auth.uid()));
    
CREATE POLICY "Users can modify division1_audit_results for their projects" ON division1_audit_results FOR ALL 
    USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = division1_audit_results.project_id AND projects.owner_id = auth.uid()));

-- Update triggers
CREATE TRIGGER update_division1_sections_updated_at 
    BEFORE UPDATE ON division1_sections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_division1_issues_updated_at 
    BEFORE UPDATE ON division1_issues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
