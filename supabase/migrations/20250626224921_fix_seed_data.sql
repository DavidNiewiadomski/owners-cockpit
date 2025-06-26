-- Create metrics tables if they don't exist
CREATE TABLE IF NOT EXISTS project_design_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    design_progress NUMERIC,
    approved_drawings INTEGER,
    total_drawings INTEGER,
    revision_cycles INTEGER,
    stakeholder_approvals INTEGER,
    design_changes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_facilities_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    operational_readiness NUMERIC,
    systems_commissioned INTEGER,
    maintenance_planned NUMERIC,
    energy_performance NUMERIC,
    occupancy_readiness NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_legal_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    contracts_active INTEGER,
    contracts_pending INTEGER,
    compliance_score NUMERIC,
    permit_status VARCHAR(255),
    legal_risks INTEGER,
    documentation_complete INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS construction_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    trade VARCHAR(100),
    status VARCHAR(50),
    activity_date DATE,
    crew_name VARCHAR(255),
    duration_hours INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix seed data for project_design_metrics and related tables
INSERT INTO project_design_metrics (project_id, design_progress, approved_drawings, total_drawings, revision_cycles, stakeholder_approvals, design_changes)
SELECT 
    id,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 85
        WHEN name = 'Residential Complex Phase 1' THEN 72
        WHEN name = 'Highway Bridge Renovation' THEN 95
        ELSE 80
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 143
        WHEN name = 'Residential Complex Phase 1' THEN 89
        WHEN name = 'Highway Bridge Renovation' THEN 76
        ELSE 100
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 178
        WHEN name = 'Residential Complex Phase 1' THEN 125
        WHEN name = 'Highway Bridge Renovation' THEN 92
        ELSE 120
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 3
        WHEN name = 'Residential Complex Phase 1' THEN 2
        WHEN name = 'Highway Bridge Renovation' THEN 1
        ELSE 2
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 15
        WHEN name = 'Residential Complex Phase 1' THEN 12
        WHEN name = 'Highway Bridge Renovation' THEN 8
        ELSE 10
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 8
        WHEN name = 'Residential Complex Phase 1' THEN 5
        WHEN name = 'Highway Bridge Renovation' THEN 3
        ELSE 5
    END
FROM projects
ON CONFLICT (project_id) DO UPDATE SET 
    design_progress = EXCLUDED.design_progress,
    approved_drawings = EXCLUDED.approved_drawings,
    total_drawings = EXCLUDED.total_drawings,
    revision_cycles = EXCLUDED.revision_cycles,
    stakeholder_approvals = EXCLUDED.stakeholder_approvals,
    design_changes = EXCLUDED.design_changes;

INSERT INTO project_facilities_metrics (project_id, operational_readiness, systems_commissioned, maintenance_planned, energy_performance, occupancy_readiness)
SELECT 
    id,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 65
        WHEN name = 'Residential Complex Phase 1' THEN 45
        WHEN name = 'Highway Bridge Renovation' THEN 85
        ELSE 60
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 12
        WHEN name = 'Residential Complex Phase 1' THEN 8
        WHEN name = 'Highway Bridge Renovation' THEN 15
        ELSE 10
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 92
        WHEN name = 'Residential Complex Phase 1' THEN 88
        WHEN name = 'Highway Bridge Renovation' THEN 96
        ELSE 90
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 87
        WHEN name = 'Residential Complex Phase 1' THEN 82
        WHEN name = 'Highway Bridge Renovation' THEN 91
        ELSE 85
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 78
        WHEN name = 'Residential Complex Phase 1' THEN 65
        WHEN name = 'Highway Bridge Renovation' THEN 95
        ELSE 75
    END
FROM projects
ON CONFLICT (project_id) DO UPDATE SET 
    operational_readiness = EXCLUDED.operational_readiness,
    systems_commissioned = EXCLUDED.systems_commissioned,
    maintenance_planned = EXCLUDED.maintenance_planned,
    energy_performance = EXCLUDED.energy_performance,
    occupancy_readiness = EXCLUDED.occupancy_readiness;

INSERT INTO project_legal_metrics (project_id, contracts_active, contracts_pending, compliance_score, permit_status, legal_risks, documentation_complete)
SELECT 
    id,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 15
        WHEN name = 'Residential Complex Phase 1' THEN 12
        WHEN name = 'Highway Bridge Renovation' THEN 8
        ELSE 10
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 2
        WHEN name = 'Residential Complex Phase 1' THEN 3
        WHEN name = 'Highway Bridge Renovation' THEN 0
        ELSE 1
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 96
        WHEN name = 'Residential Complex Phase 1' THEN 94
        WHEN name = 'Highway Bridge Renovation' THEN 98
        ELSE 95
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 'In Progress'
        WHEN name = 'Residential Complex Phase 1' THEN 'In Progress'
        WHEN name = 'Highway Bridge Renovation' THEN 'All Approved'
        ELSE 'In Progress'
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 2
        WHEN name = 'Residential Complex Phase 1' THEN 3
        WHEN name = 'Highway Bridge Renovation' THEN 0
        ELSE 1
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 94
        WHEN name = 'Residential Complex Phase 1' THEN 91
        WHEN name = 'Highway Bridge Renovation' THEN 98
        ELSE 92
    END
FROM projects
ON CONFLICT (project_id) DO UPDATE SET 
    contracts_active = EXCLUDED.contracts_active,
    contracts_pending = EXCLUDED.contracts_pending,
    compliance_score = EXCLUDED.compliance_score,
    permit_status = EXCLUDED.permit_status,
    legal_risks = EXCLUDED.legal_risks,
    documentation_complete = EXCLUDED.documentation_complete;

INSERT INTO construction_activities (project_id, activity_name, trade, status, activity_date, crew_name, duration_hours, notes)
SELECT 
    id,
    'Design Review - ' || 
    CASE floor(random() * 4)
        WHEN 0 THEN 'Lobby Finishes'
        WHEN 1 THEN 'Facade Elements'
        WHEN 2 THEN 'MEP Systems'
        ELSE 'Structural Details'
    END,
    'Design',
    CASE floor(random() * 3)
        WHEN 0 THEN 'completed'
        WHEN 1 THEN 'in-progress'
        ELSE 'pending'
    END,
    CURRENT_DATE - (floor(random() * 30))::int,
    'Design Team',
    8,
    'Design review and approval process'
FROM projects, generate_series(1, 5)
ON CONFLICT DO NOTHING;
