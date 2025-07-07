-- Create RFP clause library table
CREATE TABLE rfp_clause_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'scope', 'timeline', 'evaluation', 'compliance', 'general'
    subcategory TEXT, -- e.g., 'mwbe', 'ada', 'safety', 'deliverables'
    template_source TEXT DEFAULT 'NYC Health+Hospitals', -- Source template/organization
    csi_division TEXT, -- Related CSI division if applicable
    compliance_flags TEXT[], -- Array of compliance requirements this clause addresses
    usage_frequency INTEGER DEFAULT 0, -- Track how often this clause is used
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    embedding vector(1536) -- OpenAI ada-002 embeddings
);

-- Create indexes for performance
CREATE INDEX idx_rfp_clause_category ON rfp_clause_library(category);
CREATE INDEX idx_rfp_clause_subcategory ON rfp_clause_library(subcategory);
CREATE INDEX idx_rfp_clause_template_source ON rfp_clause_library(template_source);
CREATE INDEX idx_rfp_clause_csi_division ON rfp_clause_library(csi_division);
CREATE INDEX idx_rfp_clause_compliance_flags ON rfp_clause_library USING GIN(compliance_flags);

-- HNSW index for vector similarity search
CREATE INDEX idx_rfp_clause_embedding ON rfp_clause_library USING hnsw (embedding vector_cosine_ops);

-- Full text search index
CREATE INDEX idx_rfp_clause_content_fts ON rfp_clause_library USING gin(to_tsvector('english', content));
CREATE INDEX idx_rfp_clause_title_fts ON rfp_clause_library USING gin(to_tsvector('english', title));

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION search_rfp_clauses(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    category text,
    subcategory text,
    template_source text,
    csi_division text,
    compliance_flags text[],
    similarity float
)
LANGUAGE sql STABLE
AS $$
    SELECT 
        id,
        title,
        content,
        category,
        subcategory,
        template_source,
        csi_division,
        compliance_flags,
        1 - (embedding <=> query_embedding) AS similarity
    FROM rfp_clause_library
    WHERE 1 - (embedding <=> query_embedding) > match_threshold
    ORDER BY embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Function to update usage frequency
CREATE OR REPLACE FUNCTION increment_clause_usage(clause_id uuid)
RETURNS void
LANGUAGE sql
AS $$
    UPDATE rfp_clause_library 
    SET usage_frequency = usage_frequency + 1,
        last_updated = NOW()
    WHERE id = clause_id;
$$;

-- Seed some standard RFP clauses
INSERT INTO rfp_clause_library (title, content, category, subcategory, template_source, compliance_flags) VALUES
('Project Overview and Objectives', 
'## 1. PROJECT OVERVIEW

This Request for Proposals (RFP) is issued by NYC Health + Hospitals for professional Architect/Engineer services for [PROJECT_NAME]. The selected firm will provide comprehensive architectural and engineering design services including but not limited to programming, schematic design, design development, construction documents, bidding assistance, and construction administration.

### 1.1 Project Objectives
- Deliver a functional, sustainable, and code-compliant facility
- Ensure compliance with all applicable NYC building codes and regulations
- Integrate advanced building systems and technologies
- Achieve LEED Gold certification minimum
- Provide comprehensive documentation and training for facility operations

### 1.2 Project Scope
The project encompasses approximately [SQUARE_FOOTAGE] square feet of [FACILITY_TYPE] including but not limited to:
- Architectural design and space planning
- Mechanical, electrical, and plumbing engineering
- Fire protection and life safety systems
- Technology and telecommunications infrastructure
- Sustainable design and energy efficiency measures', 
'scope', 'overview', 'NYC Health+Hospitals', ARRAY['general']);

INSERT INTO rfp_clause_library (title, content, category, subcategory, template_source, compliance_flags) VALUES
('MWBE Participation Requirements', 
'## MINORITY AND WOMEN-OWNED BUSINESS ENTERPRISE (MWBE) REQUIREMENTS

### 1. MWBE Participation Goal
This project has been assigned an MWBE participation goal of twenty percent (20%) of the total contract value. Proposers must demonstrate good faith efforts to achieve this goal.

### 2. Required Documentation
Proposers must submit the following with their proposal:
- MWBE Utilization Plan (Form MWBE-1)
- Letters of intent from proposed MWBE subcontractors
- Evidence of MWBE certification status
- Detailed breakdown of work to be performed by each MWBE firm

### 3. Good Faith Efforts
If the 20% goal cannot be achieved, proposers must demonstrate good faith efforts including:
- Solicitation of at least three (3) MWBE firms for each trade/service
- Documentation of outreach efforts and responses received
- Explanation of why MWBE participation goal was not achieved
- Alternative measures proposed to support MWBE participation

### 4. Compliance Monitoring
The selected proposer will be required to:
- Submit monthly MWBE compliance reports
- Maintain records of all MWBE payments
- Notify NYC H+H of any changes to MWBE participation
- Achieve MWBE participation within 5% of the established goal', 
'compliance', 'mwbe', 'NYC Health+Hospitals', ARRAY['mwbe']);

INSERT INTO rfp_clause_library (title, content, category, subcategory, template_source, compliance_flags) VALUES
('ADA Compliance Requirements', 
'## AMERICANS WITH DISABILITIES ACT (ADA) COMPLIANCE

### 1. General Requirements
All design work shall comply with the Americans with Disabilities Act (ADA) of 1990, ADA Accessibility Guidelines (ADAAG), and the New York City Building Code accessibility requirements.

### 2. Design Standards
- Provide accessible routes to all areas of the facility
- Ensure doorway widths, turning spaces, and clearances meet ADA standards
- Design accessible restroom facilities with appropriate fixtures and clearances
- Provide accessible parking spaces with proper signage and access aisles
- Install appropriate visual and audible alarm systems

### 3. Documentation Requirements
- Submit ADA compliance checklist with design submissions
- Provide detailed accessibility plans and sections
- Include specifications for all accessibility-related equipment and fixtures
- Coordinate with assistive technology systems as required

### 4. Verification Process
- Conduct accessibility review at each design phase
- Obtain approval from NYC H+H Accessibility Coordinator
- Perform final accessibility audit prior to occupancy
- Provide training to facility staff on accessibility features', 
'compliance', 'ada', 'NYC Health+Hospitals', ARRAY['ada']);

INSERT INTO rfp_clause_library (title, content, category, subcategory, template_source, compliance_flags) VALUES
('Local Law 86 Environmental Compliance', 
'## LOCAL LAW 86 ENVIRONMENTAL COMPLIANCE

### 1. Environmental Requirements
This project is subject to New York City Local Law 86 of 2005 and subsequent amendments requiring high-performance building standards for projects over 10,000 square feet.

### 2. LEED Certification Requirements
- Achieve minimum LEED Gold certification
- Engage LEED Accredited Professional as part of design team
- Submit LEED scorecard with design submissions
- Coordinate LEED documentation and submissions
- Achieve energy performance 20% better than ASHRAE 90.1 baseline

### 3. Sustainable Design Elements
- Specify low-emitting materials and finishes
- Design high-efficiency building envelope
- Implement advanced lighting and HVAC controls
- Integrate renewable energy systems where feasible
- Design for water conservation and stormwater management

### 4. Environmental Monitoring
- Conduct indoor air quality testing during construction
- Monitor construction waste diversion
- Track energy and water performance post-occupancy
- Provide commissioning for all building systems
- Submit annual sustainability performance reports', 
'compliance', 'll86', 'NYC Health+Hospitals', ARRAY['ll86', 'environmental']);

INSERT INTO rfp_clause_library (title, content, category, subcategory, template_source, compliance_flags) VALUES
('Project Schedule and Milestones', 
'## PROJECT SCHEDULE AND MILESTONES

### 1. Project Duration
The anticipated project duration is [DURATION] months from Notice to Proceed through final completion and closeout.

### 2. Key Milestones
- **Programming Phase**: [X] weeks
- **Schematic Design**: [X] weeks  
- **Design Development**: [X] weeks
- **Construction Documents**: [X] weeks
- **Bidding and Award**: [X] weeks
- **Construction Administration**: [X] months

### 3. Submission Requirements
All submissions must be made according to the following schedule:
- Submit [NUMBER] copies of each deliverable
- Electronic submissions required in PDF format
- Submit progress schedules with each submission
- Coordinate review meetings within 5 days of submission

### 4. Performance Standards
- Adherence to approved project schedule
- Quality of deliverables at each milestone
- Responsiveness to review comments
- Coordination with NYC H+H staff and other consultants
- Compliance with all regulatory approval timelines

### 5. Schedule Updates
The Consultant shall:
- Update project schedule monthly
- Report any potential delays immediately
- Propose recovery measures for schedule delays
- Coordinate schedule changes with all stakeholders', 
'timeline', 'schedule', 'NYC Health+Hospitals', ARRAY['general']);

INSERT INTO rfp_clause_library (title, content, category, subcategory, template_source, compliance_flags) VALUES
('Technical Evaluation Criteria', 
'## TECHNICAL EVALUATION CRITERIA

Proposals will be evaluated based on the following technical criteria:

### 1. Team Qualifications and Experience (25 points)
- Professional qualifications and licensure of key personnel
- Relevant project experience in healthcare/institutional facilities
- Experience with NYC H+H projects and procurement processes
- Demonstrated expertise in A/E/MEP design for similar facilities
- LEED AP and other relevant certifications

### 2. Project Approach and Methodology (20 points)
- Understanding of project requirements and objectives
- Proposed design approach and methodology
- Innovation and value engineering opportunities
- Quality assurance and quality control procedures
- Risk identification and mitigation strategies

### 3. Past Performance and References (15 points)
- Quality of work on similar projects
- Adherence to schedules and budgets
- Client satisfaction and references
- Problem resolution and project management
- Post-occupancy support and follow-up

### 4. Technical Proposal Quality (15 points)
- Completeness and organization of proposal
- Clarity of communication and presentation
- Understanding of technical requirements
- Proposed solutions and alternatives
- Integration of sustainability and compliance requirements

### 5. Project Schedule (10 points)
- Realistic and achievable project timeline
- Critical path identification and management
- Resource allocation and availability
- Coordination with other project activities
- Contingency planning for potential delays

### 6. Cost Proposal (15 points)
- Competitiveness of proposed fees
- Value provided for proposed cost
- Cost breakdown and transparency
- Reimbursable expense estimates
- Fee structure and payment terms

**Total: 100 points**

Proposals scoring below 70 points will not be considered for award.', 
'evaluation', 'criteria', 'NYC Health+Hospitals', ARRAY['general']);

-- Update trigger for last_updated
CREATE TRIGGER update_rfp_clause_library_updated_at 
    BEFORE UPDATE ON rfp_clause_library 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE rfp_clause_library ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Authenticated users can read clause library" ON rfp_clause_library
    FOR SELECT TO authenticated
    USING (true);

-- Allow RFP_ADMIN to manage clause library
CREATE POLICY "RFP_ADMIN can manage clause library" ON rfp_clause_library
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
