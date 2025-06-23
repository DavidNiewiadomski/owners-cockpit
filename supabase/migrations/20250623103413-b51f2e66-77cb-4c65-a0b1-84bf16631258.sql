
-- Insert sample project data (without ON CONFLICT since there's no unique constraint)
INSERT INTO projects (id, external_id, name, description, status, start_date, end_date, created_at, updated_at) VALUES 
(
  gen_random_uuid(),
  'sample-1', 
  'Downtown Office Building',
  'A 12-story modern office building project in downtown area with sustainable design features.',
  'active',
  '2024-01-15',
  '2024-12-31',
  now(),
  now()
);

-- Get the project ID for sample data insertion
DO $$
DECLARE
    project_uuid uuid;
BEGIN
    SELECT id INTO project_uuid FROM projects WHERE external_id = 'sample-1' LIMIT 1;
    
    -- Only insert if we found the project
    IF project_uuid IS NOT NULL THEN
        -- Insert sample tasks with correct enum values
        INSERT INTO tasks (project_id, name, description, status, due_date, priority, created_at, updated_at) VALUES
        (project_uuid, 'Foundation Pour', 'Complete concrete foundation pour for building basement', 'completed', '2024-02-15', 1, now(), now()),
        (project_uuid, 'Steel Frame Installation', 'Install structural steel framework for floors 1-6', 'in_progress', '2024-03-30', 1, now(), now()),
        (project_uuid, 'Electrical Rough-in', 'Install electrical conduits and wiring for floors 1-3', 'not_started', '2024-04-15', 2, now(), now()),
        (project_uuid, 'HVAC Installation', 'Install heating, ventilation, and air conditioning systems', 'not_started', '2024-05-01', 2, now(), now());
        
        -- Insert sample budget items
        INSERT INTO budget_items (project_id, category, description, budgeted_amount, actual_amount, created_at, updated_at) VALUES
        (project_uuid, 'materials', 'Concrete and rebar for foundation', 150000.00, 145000.00, now(), now()),
        (project_uuid, 'labor', 'Construction crew wages Q1', 200000.00, 185000.00, now(), now()),
        (project_uuid, 'materials', 'Structural steel beams and columns', 300000.00, 310000.00, now(), now()),
        (project_uuid, 'equipment', 'Crane rental for steel installation', 45000.00, 42000.00, now(), now());
        
        -- Insert sample documents
        INSERT INTO documents (project_id, title, file_path, file_size, mime_type, doc_type, source, created_at, updated_at) VALUES
        (project_uuid, 'Project Specifications', 'docs/sample-1/project-specs.pdf', 2048000, 'application/pdf', 'specification', 'upload', now(), now()),
        (project_uuid, 'Foundation Drawings', 'docs/sample-1/foundation-plans.pdf', 1536000, 'application/pdf', 'drawing', 'upload', now(), now()),
        (project_uuid, 'Weekly Progress Report', 'docs/sample-1/progress-week-8.pdf', 512000, 'application/pdf', 'report', 'upload', now(), now());
        
        -- Insert sample vector chunks for RAG functionality
        INSERT INTO vector_index (project_id, doc_id, content, embedding, metadata, created_at) VALUES
        (
            project_uuid,
            (SELECT id FROM documents WHERE project_id = project_uuid AND title = 'Project Specifications' LIMIT 1),
            'The Downtown Office Building project specifications include sustainable design features such as LEED Gold certification requirements, energy-efficient HVAC systems, and green roof installation. The building will feature 12 stories with a total floor area of 240,000 square feet.',
            array_fill(0.1, ARRAY[1536])::vector,
            '{"page": 1, "doc_type": "specification", "chunk_index": 0}'::jsonb,
            now()
        ),
        (
            project_uuid,
            (SELECT id FROM documents WHERE project_id = project_uuid AND title = 'Foundation Drawings' LIMIT 1),
            'Foundation specifications call for reinforced concrete with 4000 PSI strength. The foundation depth extends 8 feet below grade with waterproofing membrane. Steel rebar grid spacing is 12 inches on center both directions.',
            array_fill(0.2, ARRAY[1536])::vector,
            '{"page": 2, "doc_type": "drawing", "chunk_index": 1}'::jsonb,
            now()
        ),
        (
            project_uuid,
            (SELECT id FROM documents WHERE project_id = project_uuid AND title = 'Weekly Progress Report' LIMIT 1),
            'Week 8 Progress Summary: Foundation work completed on schedule. Steel frame installation is 60% complete. Current budget status shows materials costs 3% over budget due to steel price increases. Weather delays minimal this week.',
            array_fill(0.3, ARRAY[1536])::vector,
            '{"page": 1, "doc_type": "report", "chunk_index": 2}'::jsonb,
            now()
        ),
        (
            project_uuid,
            (SELECT id FROM documents WHERE project_id = project_uuid AND title = 'Project Specifications' LIMIT 1),
            'Safety requirements include mandatory hard hats, safety vests, and steel-toed boots for all personnel on site. Fall protection systems required for work above 6 feet. Daily safety briefings mandatory at 7:00 AM.',
            array_fill(0.4, ARRAY[1536])::vector,
            '{"page": 5, "doc_type": "specification", "chunk_index": 3}'::jsonb,
            now()
        );
    END IF;
END $$;
