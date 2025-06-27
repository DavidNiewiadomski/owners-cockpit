-- Create tables for all missing metrics

-- Project Table (if not exists)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL
);

-- Construction Daily Progress
CREATE TABLE IF NOT EXISTS construction_daily_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    planned_progress DECIMAL(5,2) NOT NULL,
    actual_progress DECIMAL(5,2) NOT NULL,
    workforce_count INTEGER NOT NULL
);

-- Construction Trade Progress
CREATE TABLE IF NOT EXISTS construction_trade_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    floor_level VARCHAR(50) NOT NULL,
    structural_progress DECIMAL(5,2) NOT NULL,
    mechanical_progress DECIMAL(5,2) NOT NULL,
    electrical_progress DECIMAL(5,2) NOT NULL,
    plumbing_progress DECIMAL(5,2) NOT NULL,
    finishes_progress DECIMAL(5,2) NOT NULL
);

-- Material Deliveries
CREATE TABLE IF NOT EXISTS material_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    material_name VARCHAR(255) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    cost DECIMAL(12,2) NOT NULL
);

-- Safety Metrics
CREATE TABLE IF NOT EXISTS safety_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    recordable_days INTEGER NOT NULL,
    total_incidents INTEGER NOT NULL,
    near_misses INTEGER NOT NULL,
    safety_training_hours INTEGER NOT NULL,
    compliance_score DECIMAL(5,2) NOT NULL,
    osha_rating VARCHAR(50) NOT NULL
);

-- Safety Incidents
CREATE TABLE IF NOT EXISTS safety_incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Projects Seed Data
INSERT INTO projects (name, owner_id) VALUES
    ('Downtown Office Building', gen_random_uuid()),
    ('Residential Complex Phase 1', gen_random_uuid()),
    ('Highway Bridge Renovation', gen_random_uuid());

-- Construction Daily Progress Seed Data
INSERT INTO construction_daily_progress (project_id, date, planned_progress, actual_progress, workforce_count) VALUES
    ((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2025-06-20', 75.5, 73.2, 150),
    ((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2025-06-20', 50.0, 48.9, 120),
    ((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2025-06-20', 85.0, 85.5, 95);

-- Construction Trade Progress Seed Data
INSERT INTO construction_trade_progress (project_id, floor_level, structural_progress, mechanical_progress, electrical_progress, plumbing_progress, finishes_progress) VALUES
    ((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Floor 1', 90.0, 80.5, 85.0, 88.5, 80.0),
    ((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Floor 2', 70.0, 72.5, 68.0, 70.0, 66.5),
    ((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Level 1', 93.0, 94.0, 92.5, 95.0, 91.0);

-- Material Deliveries Seed Data
INSERT INTO material_deliveries (project_id, material_name, supplier, scheduled_date, status, quantity, cost) VALUES
    ((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Steel Beams', 'Steel Co', '2025-06-28', 'scheduled', '20 tons', 150000.00),
    ((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Concrete Mix', 'Concrete Supplies Ltd', '2025-06-29', 'scheduled', '500 bags', 25000.00),
    ((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Bridge Cables', 'Bridge Parts Inc', '2025-07-02', 'scheduled', '100 units', 200000.00);

-- Safety Metrics Seed Data
INSERT INTO safety_metrics (project_id, recordable_days, total_incidents, near_misses, safety_training_hours, compliance_score, osha_rating) VALUES
    ((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 45, 2, 8, 1240, 98.5, 'A'),
    ((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 62, 1, 5, 896, 97.2, 'A'),
    ((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 180, 0, 3, 1680, 99.1, 'A+');

-- Safety Incidents Seed Data
INSERT INTO safety_incidents (project_id, incident_type, description, incident_date, severity, status) VALUES
    ((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Fall', 'Worker slipped on wet surface', '2025-06-15', 'medium', 'resolved'),
    ((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Equipment Damage', 'Crane arm malfunctioned', '2025-06-10', 'low', 'resolved');

