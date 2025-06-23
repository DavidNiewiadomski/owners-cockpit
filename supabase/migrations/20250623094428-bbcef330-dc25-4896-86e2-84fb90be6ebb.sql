
-- Insert sample projects for testing and demo
INSERT INTO public.projects (id, name, description, status, start_date, end_date) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Downtown Office Complex',
  'A 12-story mixed-use office building with retail space on the ground floor. Features modern sustainable design and LEED certification goals.',
  'active',
  '2024-01-15',
  '2024-12-20'
),
(
  '22222222-2222-2222-2222-222222222222',
  'Residential Townhomes',
  'Development of 24 luxury townhomes with modern amenities, private garages, and landscaped common areas.',
  'planning',
  '2024-03-01',
  '2024-11-30'
),
(
  '33333333-3333-3333-3333-333333333333',
  'Hospital Renovation',
  'Complete renovation of the west wing including new patient rooms, updated HVAC systems, and modern medical equipment installation.',
  'on_hold',
  '2024-02-01',
  '2024-08-15'
),
(
  '44444444-4444-4444-4444-444444444444',
  'Shopping Center Expansion',
  'Adding 50,000 sq ft retail space and updating existing facilities with new parking and improved accessibility.',
  'completed',
  '2023-06-01',
  '2024-01-30'
);

-- Insert sample tasks for the active project
INSERT INTO public.tasks (id, project_id, name, description, status, priority, assigned_to, due_date) VALUES
(
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'Foundation and Excavation',
  'Complete site excavation and pour concrete foundation for the building structure.',
  'completed',
  3,
  'Mike Construction Crew',
  '2024-02-28'
),
(
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  'Steel Frame Installation',
  'Install structural steel framework for floors 1-6. Coordinate with crane operations.',
  'in_progress',
  3,
  'Steel Works Inc',
  '2024-04-15'
),
(
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  'Electrical Rough-in',
  'Install electrical conduits, wiring, and panel boxes for floors 1-3.',
  'not_started',
  2,
  'ABC Electrical',
  '2024-05-20'
),
(
  '88888888-8888-8888-8888-888888888888',
  '11111111-1111-1111-1111-111111111111',
  'HVAC System Installation',
  'Install heating, ventilation, and air conditioning systems for the entire building.',
  'not_started',
  2,
  'Climate Solutions LLC',
  '2024-06-10'
),
(
  '99999999-9999-9999-9999-999999999999',
  '11111111-1111-1111-1111-111111111111',
  'Interior Finishing',
  'Complete drywall, painting, flooring, and final interior work for all floors.',
  'not_started',
  1,
  'Interior Design Pro',
  '2024-09-30'
);

-- Insert some sample documents (using correct enum values: 'drawing', 'specification', 'report', 'photo', 'contract', 'other')
INSERT INTO public.documents (id, project_id, title, doc_type, file_path, processed) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'Architectural Plans - Floor 1-6',
  'drawing',
  '/demo/architectural-plans-1-6.pdf',
  true
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'Structural Engineering Report',
  'report',
  '/demo/structural-report.pdf',
  true
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'Building Permit Documentation',
  'contract',
  '/demo/building-permit.pdf',
  true
);

-- Insert sample RFIs (Request for Information)
INSERT INTO public.rfi (id, project_id, title, description, status, submitted_by, assigned_to, due_date) VALUES
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '11111111-1111-1111-1111-111111111111',
  'Steel Beam Specifications',
  'Need clarification on steel beam specifications for floors 4-6. Current plans show conflicting dimensions.',
  'open',
  'Steel Works Inc',
  'Design Team',
  '2024-04-10'
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '11111111-1111-1111-1111-111111111111',
  'Electrical Panel Location',
  'Electrical panel location conflicts with HVAC ductwork. Need revised placement options.',
  'pending_response',
  'ABC Electrical',
  'Project Manager',
  '2024-04-20'
);
