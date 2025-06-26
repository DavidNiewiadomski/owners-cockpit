-- Seed comprehensive construction data for all projects
-- This provides 100% backend data coverage for the Construction Dashboard

-- Construction Daily Progress Data
INSERT INTO construction_daily_progress (project_id, date, planned_progress, actual_progress, workforce_count) VALUES
-- Downtown Office Building (project 1)
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-15', 65.0, 67.0, 142),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-16', 65.5, 67.2, 145),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-17', 66.0, 67.8, 148),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-18', 66.5, 68.1, 144),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-19', 67.0, 68.5, 149),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-20', 67.5, 68.8, 145),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-21', 68.0, 69.2, 152),

-- Residential Complex Phase 1 (project 2)
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-15', 42.0, 41.8, 95),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-16', 42.5, 42.1, 98),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-17', 43.0, 42.6, 102),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-18', 43.5, 43.2, 99),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-19', 44.0, 43.8, 105),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-20', 44.5, 44.3, 101),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-21', 45.0, 44.9, 108),

-- Highway Bridge Renovation (project 3)
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-15', 78.0, 79.2, 67),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-16', 78.5, 79.6, 69),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-17', 79.0, 80.1, 71),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-18', 79.5, 80.5, 68),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-19', 80.0, 81.0, 73),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-20', 80.5, 81.4, 70),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-21', 81.0, 81.8, 75)
ON CONFLICT (project_id, date) DO UPDATE SET
planned_progress = EXCLUDED.planned_progress,
actual_progress = EXCLUDED.actual_progress,
workforce_count = EXCLUDED.workforce_count;

-- Construction Trade Progress Data
INSERT INTO construction_trade_progress (project_id, floor_level, structural_progress, mechanical_progress, electrical_progress, plumbing_progress, finishes_progress) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Foundation', 100.0, 95.0, 90.0, 85.0, 0.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Floor 1', 100.0, 88.0, 85.0, 80.0, 25.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Floor 2', 95.0, 82.0, 78.0, 75.0, 15.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Floor 3', 90.0, 75.0, 70.0, 65.0, 5.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Floor 4', 85.0, 60.0, 55.0, 50.0, 0.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Floor 5', 70.0, 40.0, 35.0, 30.0, 0.0),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Foundation', 100.0, 90.0, 85.0, 82.0, 0.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Building A - Floor 1', 95.0, 75.0, 70.0, 68.0, 35.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Building A - Floor 2', 88.0, 65.0, 60.0, 58.0, 20.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Building B - Floor 1', 82.0, 55.0, 50.0, 48.0, 10.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Building B - Floor 2', 70.0, 40.0, 35.0, 32.0, 0.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Common Areas', 60.0, 30.0, 25.0, 20.0, 0.0),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Deck Section A', 100.0, 95.0, 92.0, 88.0, 75.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Deck Section B', 95.0, 90.0, 85.0, 80.0, 65.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Support Structure', 100.0, 85.0, 80.0, 75.0, 55.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Approach Ramps', 85.0, 70.0, 65.0, 60.0, 40.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Safety Systems', 75.0, 85.0, 90.0, 70.0, 60.0)
ON CONFLICT (project_id, floor_level) DO UPDATE SET
structural_progress = EXCLUDED.structural_progress,
mechanical_progress = EXCLUDED.mechanical_progress,
electrical_progress = EXCLUDED.electrical_progress,
plumbing_progress = EXCLUDED.plumbing_progress,
finishes_progress = EXCLUDED.finishes_progress;

-- Construction Activities Data
INSERT INTO construction_activities (project_id, activity_name, trade, status, activity_date, crew_name, duration_hours, notes) VALUES
-- Downtown Office Building Activities
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Concrete Pour - Floor 4 Slab', 'Structural', 'completed', '2024-06-20', 'Team Alpha', 8, 'Quality inspection passed'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'HVAC Duct Installation - Floor 3', 'Mechanical', 'in-progress', '2024-06-19', 'HVAC Specialists', 12, 'On schedule'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Electrical Rough-in - Floor 2', 'Electrical', 'completed', '2024-06-18', 'Electrical Crew B', 10, 'Minor cable routing adjustment'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Plumbing Installation - Floor 3', 'Plumbing', 'scheduled', '2024-06-22', 'Plumbing Team 1', 14, 'Materials confirmed delivered'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Curtain Wall Installation - Floor 5', 'Exterior', 'in-progress', '2024-06-21', 'Glazing Specialists', 16, 'Weather dependent'),

-- Residential Complex Activities
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Foundation Waterproofing - Building B', 'Structural', 'completed', '2024-06-19', 'Waterproofing Crew', 6, 'Quality control passed'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Framing - Building A Floor 2', 'Structural', 'in-progress', '2024-06-20', 'Framing Team 1', 10, 'Ahead of schedule'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Kitchen Rough-in - Building A', 'Plumbing', 'scheduled', '2024-06-23', 'Residential Plumbing', 8, 'Pending material delivery'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Electrical Panel Installation', 'Electrical', 'completed', '2024-06-17', 'Power Systems', 12, 'Inspection approved'),

-- Highway Bridge Activities
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Traffic Control Setup - Section B', 'Traffic Management', 'completed', '2024-06-18', 'Traffic Control Inc', 4, 'DOT approved setup'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Deck Resurfacing - Section A', 'Structural', 'in-progress', '2024-06-20', 'Bridge Specialists', 20, 'Weather conditions optimal'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'LED Lighting Installation', 'Electrical', 'scheduled', '2024-06-24', 'Highway Electric', 8, 'Energy efficiency upgrade'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Joint Sealing - Expansion Joints', 'Structural', 'completed', '2024-06-16', 'Sealant Specialists', 6, 'Temperature controlled application');

-- Construction Quality Metrics Data
INSERT INTO construction_quality_metrics (project_id, week_ending, quality_score, rework_items, inspection_pass_rate) VALUES
-- Downtown Office Building Quality Metrics
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-05-19', 92.0, 5, 94.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-05-26', 94.0, 3, 96.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-02', 91.0, 7, 93.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-09', 95.0, 2, 98.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-16', 93.0, 4, 95.0),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), '2024-06-23', 96.0, 1, 99.0),

-- Residential Complex Quality Metrics
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-05-19', 89.0, 8, 91.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-05-26', 91.0, 6, 93.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-02', 88.0, 9, 90.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-09', 92.0, 5, 94.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-16', 90.0, 7, 92.0),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), '2024-06-23', 93.0, 4, 95.0),

-- Highway Bridge Quality Metrics
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-05-19', 95.0, 2, 97.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-05-26', 97.0, 1, 98.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-02', 94.0, 3, 96.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-09', 98.0, 1, 99.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-16', 96.0, 2, 98.0),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), '2024-06-23', 99.0, 0, 100.0)
ON CONFLICT (project_id, week_ending) DO UPDATE SET
quality_score = EXCLUDED.quality_score,
rework_items = EXCLUDED.rework_items,
inspection_pass_rate = EXCLUDED.inspection_pass_rate;

-- Material Deliveries Data
INSERT INTO material_deliveries (project_id, material_name, supplier, scheduled_date, status, quantity, cost) VALUES
-- Downtown Office Building Materials
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Steel Beams - Floor 5', 'Metropolitan Steel', '2024-06-24', 'confirmed', '45 tons', 89500.00),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Concrete - Floor 4 Pour', 'Ready Mix Corp', '2024-06-22', 'delivered', '120 cubic yards', 18400.00),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'HVAC Units - Floors 2-3', 'Climate Solutions', '2024-06-26', 'in-transit', '8 units', 125000.00),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Electrical Panels', 'Power Systems Inc', '2024-06-23', 'pending', '12 panels', 45200.00),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Curtain Wall Glass', 'Glazing Specialists', '2024-06-28', 'confirmed', '850 sq ft', 78500.00),

-- Residential Complex Materials
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Lumber Package - Building B', 'Forest Products', '2024-06-25', 'confirmed', '2400 board feet', 15600.00),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Kitchen Cabinets - Building A', 'Custom Millwork', '2024-06-27', 'in-transit', '24 units', 48000.00),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Roofing Materials', 'Roofing Supply Co', '2024-06-24', 'delivered', '55 squares', 22500.00),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Electrical Fixtures', 'Lighting Solutions', '2024-06-26', 'pending', '180 fixtures', 12800.00),

-- Highway Bridge Materials
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Bridge Deck Overlay', 'Highway Materials', '2024-06-23', 'delivered', '240 cubic yards', 35200.00),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'LED Light Fixtures', 'Highway Electric', '2024-06-25', 'confirmed', '48 fixtures', 28600.00),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Expansion Joint Seals', 'Sealant Specialists', '2024-06-22', 'delivered', '320 linear feet', 18900.00),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Safety Barriers', 'Traffic Safety Inc', '2024-06-27', 'in-transit', '480 linear feet', 42300.00);

-- Safety Metrics Data
INSERT INTO safety_metrics (project_id, recordable_days, total_incidents, near_misses, safety_training_hours, compliance_score, osha_rating, last_incident_date, active_safety_programs, monthly_inspections, corrective_actions) VALUES
-- Downtown Office Building Safety
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 287, 2, 8, 1240, 97.0, 'Excellent', '2024-01-15', 6, 12, 3),

-- Residential Complex Safety
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 145, 1, 5, 856, 94.0, 'Very Good', '2024-03-22', 5, 8, 2),

-- Highway Bridge Safety
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 312, 0, 3, 1450, 99.0, 'Outstanding', NULL, 8, 16, 1)
ON CONFLICT (project_id) DO UPDATE SET
recordable_days = EXCLUDED.recordable_days,
total_incidents = EXCLUDED.total_incidents,
near_misses = EXCLUDED.near_misses,
safety_training_hours = EXCLUDED.safety_training_hours,
compliance_score = EXCLUDED.compliance_score,
osha_rating = EXCLUDED.osha_rating,
last_incident_date = EXCLUDED.last_incident_date,
active_safety_programs = EXCLUDED.active_safety_programs,
monthly_inspections = EXCLUDED.monthly_inspections,
corrective_actions = EXCLUDED.corrective_actions;

-- Safety Incidents Data
INSERT INTO safety_incidents (project_id, incident_type, description, incident_date, severity, status, corrective_action) VALUES
-- Downtown Office Building Incidents
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Near Miss', 'Tool dropped from height - caught by safety net', '2024-06-18', 'Low', 'Investigated', 'Reinforced tool tethering protocol'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Minor Injury', 'Cut finger on metal edge', '2024-06-10', 'Low', 'Closed', 'Enhanced PPE training, edge guards installed'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Near Miss', 'Crane load swing too close to workers', '2024-06-05', 'Medium', 'Closed', 'Revised crane operation procedures'),

-- Residential Complex Incidents
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Near Miss', 'Worker slipped on wet surface', '2024-06-12', 'Low', 'Investigated', 'Added slip-resistant mats and warning signs'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Equipment Issue', 'Saw blade guard malfunction', '2024-06-08', 'Medium', 'Closed', 'Equipment inspection and maintenance schedule updated'),

-- Highway Bridge Incidents
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Near Miss', 'Traffic cone displaced by wind', '2024-06-15', 'Low', 'Investigated', 'Enhanced traffic control anchoring system'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Near Miss', 'Material delivery truck backed too close to work zone', '2024-06-11', 'Medium', 'Closed', 'Revised delivery protocol and spotting procedures');

-- Safety Training Data
INSERT INTO safety_training (project_id, program_name, completed_count, required_count, deadline) VALUES
-- Downtown Office Building Training
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'OSHA 30-Hour', 95, 100, '2024-07-01'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Fall Protection', 142, 145, '2024-06-30'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Electrical Safety', 38, 45, '2024-07-15'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Confined Space', 25, 30, '2024-08-01'),

-- Residential Complex Training
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'OSHA 10-Hour', 85, 90, '2024-07-10'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Fall Protection', 78, 85, '2024-06-28'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Tool Safety', 82, 90, '2024-07-05'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'First Aid/CPR', 45, 50, '2024-08-15'),

-- Highway Bridge Training
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Highway Work Zone Safety', 65, 68, '2024-06-25'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Traffic Control Procedures', 68, 68, '2024-06-20'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Heavy Equipment Operation', 42, 45, '2024-07-20'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Environmental Compliance', 55, 60, '2024-08-10')
ON CONFLICT (project_id, program_name) DO UPDATE SET
completed_count = EXCLUDED.completed_count,
required_count = EXCLUDED.required_count,
deadline = EXCLUDED.deadline;
