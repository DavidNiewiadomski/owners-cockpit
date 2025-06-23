
-- First, let's make sure we can access the data without authentication by temporarily disabling RLS
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE vector_index DISABLE ROW LEVEL SECURITY;

-- Insert sample projects (without user associations for now)
INSERT INTO projects (id, name, description, status, start_date, end_date, created_at, updated_at) VALUES 
('11111111-1111-1111-1111-111111111111', 'Downtown Office Building', 'A 12-story modern office building project in downtown area with sustainable design features.', 'active', '2024-01-15', '2024-12-31', now(), now()),
('22222222-2222-2222-2222-222222222222', 'Residential Complex Phase 1', 'Construction of 50-unit residential complex with modern amenities and green spaces.', 'planning', '2024-03-01', '2025-02-28', now(), now()),
('33333333-3333-3333-3333-333333333333', 'Highway Bridge Renovation', 'Major renovation and structural upgrades to the Main Street bridge infrastructure.', 'active', '2024-02-01', '2024-10-31', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks for the first project
INSERT INTO tasks (project_id, name, description, status, due_date, priority, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Foundation Pour', 'Complete concrete foundation pour for building basement', 'completed', '2024-02-15', 3, now(), now()),
('11111111-1111-1111-1111-111111111111', 'Steel Frame Installation', 'Install structural steel framework for floors 1-6', 'in_progress', '2024-03-30', 3, now(), now()),
('11111111-1111-1111-1111-111111111111', 'Electrical Rough-in', 'Install electrical conduits and wiring for floors 1-3', 'not_started', '2024-04-15', 2, now(), now())
ON CONFLICT (id) DO NOTHING;
