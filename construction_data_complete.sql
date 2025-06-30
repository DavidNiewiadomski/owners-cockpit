-- Complete construction-specific data with correct column names

-- Construction Trade Progress (corrected columns)
INSERT INTO construction_trade_progress (project_id, floor_level, structural_progress, mechanical_progress, electrical_progress, plumbing_progress, finishes_progress) VALUES
-- Downtown Office Building trade progress
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 10', 100.0, 68.9, 75.5, 45.2, 25.8),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 9', 100.0, 75.8, 82.3, 68.9, 35.2),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 8', 100.0, 68.9, 78.5, 82.1, 45.8),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 7', 100.0, 85.2, 91.2, 89.5, 55.8),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 6', 100.0, 92.1, 95.8, 92.8, 65.2),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 5', 100.0, 98.5, 100.0, 98.2, 85.6),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 4', 100.0, 100.0, 100.0, 100.0, 95.2),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 3', 100.0, 100.0, 100.0, 100.0, 100.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 2', 100.0, 100.0, 100.0, 100.0, 100.0),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Floor 1', 100.0, 100.0, 100.0, 100.0, 100.0),
-- Downtown Office Complex trade progress
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 15', 100.0, 78.6, 85.2, 65.8, 35.2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 14', 100.0, 82.1, 92.1, 78.5, 45.8),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 13', 100.0, 78.6, 88.9, 85.2, 55.6),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 12', 100.0, 85.8, 95.2, 92.1, 65.8),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 11', 100.0, 92.5, 98.5, 95.8, 75.2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 10', 100.0, 98.2, 100.0, 98.5, 85.6),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 9', 100.0, 100.0, 100.0, 100.0, 95.2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Floor 8', 100.0, 100.0, 100.0, 100.0, 100.0),
-- Riverside Residential Complex trade progress
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Work', 45.2, 0.0, 0.0, 0.0, 0.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Foundation', 15.8, 0.0, 0.0, 0.0, 0.0);

-- Construction Activities (corrected columns)
INSERT INTO construction_activities (project_id, activity_name, trade, status, activity_date, crew_name, duration_hours, notes) VALUES
-- Downtown Office Building activities
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'MEP Rough-in Coordination', 'Multiple Trades', 'Completed', '2024-12-15', 'MEP Coordination Team', 8, 'Cross-trade coordination successful'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Electrical Conduit Installation', 'Electrical', 'Completed', '2024-12-14', 'Metro Electric Crew A', 10, 'Floor 9 conduit work completed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'HVAC Equipment Lifting', 'Mechanical', 'Completed', '2024-12-13', 'Crane Operations Team', 6, 'Equipment successfully placed floors 8-10'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Safety Training Session', 'Safety', 'Completed', '2024-12-12', 'Safety Team', 4, 'Monthly safety briefing all trades'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Plumbing Rough-in', 'Plumbing', 'In Progress', '2024-12-11', 'ProPlumb Crew B', 12, 'Floors 7-8 rough-in ongoing'),
-- Downtown Office Complex activities
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Curtain Wall Installation', 'Glazing', 'In Progress', '2024-12-15', 'Glass Facade Team', 10, 'Floors 12-14 installation ongoing'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fire Protection Testing', 'Fire Safety', 'Completed', '2024-12-14', 'SafeGuard Testing Team', 8, 'System commissioning passed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Elevator Installation', 'Vertical Transport', 'In Progress', '2024-12-13', 'Elevator Tech Team', 12, 'Car installation Tower 2'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MEP Coordination Review', 'Multiple Trades', 'Completed', '2024-12-12', 'MEP Coordination Team', 6, 'Floors 8-10 review completed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Interior Finishes', 'Finishes', 'In Progress', '2024-12-11', 'Interior Crew A', 10, 'Floors 8-10 finishes installation'),
-- Riverside Residential Complex activities
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Preparation', 'Site Work', 'In Progress', '2024-12-13', 'EarthWorks Team', 8, 'Site clearing and grading phase 1'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Environmental Study', 'Environmental', 'Completed', '2024-12-04', 'Green Consulting Team', 6, 'Environmental impact assessment completed'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Permit Application Review', 'Permits', 'In Progress', '2024-11-28', 'Permit Team', 4, 'Zoning and building permits under review');

-- Construction Quality Metrics (corrected columns)
INSERT INTO construction_quality_metrics (project_id, week_ending, quality_score, rework_items, inspection_pass_rate) VALUES
-- Downtown Office Building quality metrics
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 94.2, 3, 96.2),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-08', 95.8, 2, 97.5),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-01', 93.1, 4, 94.8),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-11-24', 96.5, 1, 98.2),
-- Downtown Office Complex quality metrics
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-15', 91.5, 5, 93.8),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-08', 93.2, 3, 95.5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-01', 90.8, 6, 92.1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-11-24', 94.5, 2, 96.8),
-- Riverside Residential Complex quality metrics
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-15', 98.5, 0, 100.0),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-08', 97.8, 1, 98.5),
-- Tech Campus Expansion quality metrics (completed)
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-15', 95.8, 1, 98.0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', '2024-10-08', 96.2, 0, 100.0);

-- Material Deliveries (corrected columns)
INSERT INTO material_deliveries (project_id, material_name, supplier, scheduled_date, status, quantity, cost) VALUES
-- Downtown Office Building deliveries
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Electrical Conduit', 'Metro Electric Supply', '2024-12-16', 'Scheduled', '500 linear feet', 15000.00),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'HVAC Ductwork', 'Climate Control Systems', '2024-12-18', 'Scheduled', '25 sections', 85000.00),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Plumbing Fixtures', 'ProPlumb Wholesale', '2024-12-20', 'Scheduled', '45 units', 125000.00),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Drywall Sheets', 'BuildMart Supply', '2024-12-15', 'Delivered', '200 sheets', 8500.00),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Structural Steel', 'Ironworks Construction LLC', '2024-12-14', 'Delivered', '12 beams', 485000.00),
-- Downtown Office Complex deliveries
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Curtain Wall Panels', 'Glass Facade Specialists', '2024-12-17', 'Scheduled', '30 panels', 825000.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Elevator Components', 'Vertical Transportation Inc', '2024-12-19', 'Scheduled', '1 car', 650000.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fire Protection Sprinklers', 'SafeGuard Fire Protection', '2024-12-22', 'Scheduled', '150 heads', 45000.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LED Lighting Fixtures', 'Illumination Solutions', '2024-12-15', 'Delivered', '85 fixtures', 125000.00),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Luxury Vinyl Plank', 'Premium Flooring Co', '2024-12-14', 'Delivered', '2500 sq ft', 65000.00),
-- Riverside Residential Complex deliveries
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Excavation Equipment', 'Heavy Machinery Rental', '2024-12-16', 'Scheduled', '3 units', 25000.00),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Survey Equipment', 'Precision Survey Co', '2024-12-13', 'Delivered', '1 kit', 5500.00),
-- Tech Campus Expansion deliveries (completed)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Network Infrastructure', 'Network Solutions Pro', '2024-10-08', 'Delivered', '1 system', 185000.00);

-- Safety Metrics (corrected columns)
INSERT INTO safety_metrics (project_id, recordable_days, total_incidents, near_misses, safety_training_hours, compliance_score, osha_rating, last_incident_date, active_safety_programs, monthly_inspections, corrective_actions) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 45, 2, 8, 156, 98.5, 'Excellent', '2024-10-28', 5, 4, 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 32, 3, 12, 289, 97.2, 'Very Good', '2024-11-12', 6, 4, 3),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 128, 0, 2, 45, 99.5, 'Outstanding', NULL, 3, 2, 0),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 85, 1, 5, 198, 98.8, 'Excellent', '2024-06-18', 4, 5, 1);

-- Safety Training (corrected columns)
INSERT INTO safety_training (project_id, program_name, completed_count, required_count, deadline) VALUES
-- Downtown Office Building safety training
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'OSHA 10-Hour General', 135, 145, '2025-01-15'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Fall Protection Training', 142, 145, '2025-02-01'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Crane Safety Certification', 8, 10, '2025-01-30'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Electrical Safety Training', 38, 40, '2025-02-15'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'Confined Space Entry', 25, 30, '2025-03-01'),
-- Downtown Office Complex safety training
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'OSHA 30-Hour Supervisory', 15, 18, '2025-01-31'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Scaffold Safety Training', 210, 225, '2025-02-28'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'First Aid/CPR Certification', 205, 225, '2025-03-15'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fire Safety Training', 220, 225, '2025-02-01'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hazmat Handling Certification', 45, 50, '2025-04-01'),
-- Riverside Residential Complex safety training
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Site Safety Orientation', 25, 25, '2025-01-01'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Environmental Safety Training', 22, 25, '2025-02-15'),
-- Tech Campus Expansion safety training (completed)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Project Completion Safety Review', 15, 15, '2024-10-31');

COMMIT;
