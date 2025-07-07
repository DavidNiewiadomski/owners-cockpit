-- Seed data for bid analysis system
-- This creates realistic sample data for testing and demonstration

-- Insert CSI Divisions
INSERT INTO csi_divisions (division_number, division_name, description) VALUES
('01', 'General Requirements', 'Administrative and procedural requirements for construction'),
('02', 'Existing Conditions', 'Assessment of existing conditions, selective demolition'),
('03', 'Concrete', 'Cast-in-place concrete, precast concrete, concrete specialties'),
('04', 'Masonry', 'Unit masonry, stone, masonry restoration and cleaning'),
('05', 'Metals', 'Structural metal framing, metal fabrications, expansion joints'),
('06', 'Wood, Plastics, and Composites', 'Rough carpentry, finish carpentry, architectural woodwork'),
('07', 'Thermal and Moisture Protection', 'Waterproofing, insulation, roofing, siding'),
('08', 'Openings', 'Doors, windows, skylights, hardware'),
('09', 'Finishes', 'Plaster, gypsum board, tiling, flooring, painting'),
('10', 'Specialties', 'Visual display boards, compartments, louvers and vents'),
('11', 'Equipment', 'Vehicle and pedestrian equipment, residential equipment'),
('12', 'Furnishings', 'Artwork, fabrics, furniture, rugs and mats'),
('13', 'Special Construction', 'Special purpose rooms, integrated assemblies'),
('14', 'Conveying Equipment', 'Elevators, escalators, moving walkways'),
('15', 'Reserved', 'Currently reserved for future expansion'),
('16', 'Reserved', 'Currently reserved for future expansion'),
('21', 'Fire Suppression', 'Fire suppression systems, fire pumps'),
('22', 'Plumbing', 'Plumbing fixtures, domestic water distribution'),
('23', 'Heating, Ventilating, and Air Conditioning (HVAC)', 'HVAC systems, air distribution, controls'),
('26', 'Electrical', 'Electrical service and distribution, lighting, communications'),
('27', 'Communications', 'Communications systems, audio-video systems'),
('28', 'Electronic Safety and Security', 'Fire detection and alarm, access control');

-- Insert sample CSI Codes
INSERT INTO csi_codes (division_id, code, title, description) VALUES
-- Division 01 - General Requirements
((SELECT id FROM csi_divisions WHERE division_number = '01'), '01 00 00', 'General Requirements', 'General project requirements and procedures'),
((SELECT id FROM csi_divisions WHERE division_number = '01'), '01 10 00', 'Summary', 'Work covered by contract documents'),
((SELECT id FROM csi_divisions WHERE division_number = '01'), '01 20 00', 'Price and Payment Procedures', 'Requirements for contract price and payment'),
((SELECT id FROM csi_divisions WHERE division_number = '01'), '01 30 00', 'Administrative Requirements', 'Project meetings, submittals, closeout'),
((SELECT id FROM csi_divisions WHERE division_number = '01'), '01 40 00', 'Quality Requirements', 'Quality assurance and quality control'),

-- Division 03 - Concrete
((SELECT id FROM csi_divisions WHERE division_number = '03'), '03 00 00', 'Concrete', 'Cast-in-place and precast concrete'),
((SELECT id FROM csi_divisions WHERE division_number = '03'), '03 10 00', 'Concrete Forming and Accessories', 'Concrete forms, form accessories'),
((SELECT id FROM csi_divisions WHERE division_number = '03'), '03 20 00', 'Concrete Reinforcing', 'Reinforcing steel, post-tensioning'),
((SELECT id FROM csi_divisions WHERE division_number = '03'), '03 30 00', 'Cast-in-Place Concrete', 'Structural and architectural concrete'),
((SELECT id FROM csi_divisions WHERE division_number = '03'), '03 40 00', 'Precast Concrete', 'Precast structural and architectural concrete'),

-- Division 05 - Metals
((SELECT id FROM csi_divisions WHERE division_number = '05'), '05 00 00', 'Metals', 'Structural metal framing and fabrications'),
((SELECT id FROM csi_divisions WHERE division_number = '05'), '05 10 00', 'Structural Metal Framing', 'Structural steel framing'),
((SELECT id FROM csi_divisions WHERE division_number = '05'), '05 20 00', 'Metal Joists', 'Steel joists and joist girders'),
((SELECT id FROM csi_divisions WHERE division_number = '05'), '05 30 00', 'Metal Decking', 'Floor and roof decking'),
((SELECT id FROM csi_divisions WHERE division_number = '05'), '05 40 00', 'Cold-Formed Metal Framing', 'Light gauge metal framing'),

-- Division 07 - Thermal and Moisture Protection
((SELECT id FROM csi_divisions WHERE division_number = '07'), '07 00 00', 'Thermal and Moisture Protection', 'Waterproofing, insulation, roofing'),
((SELECT id FROM csi_divisions WHERE division_number = '07'), '07 10 00', 'Dampproofing and Waterproofing', 'Below and above grade waterproofing'),
((SELECT id FROM csi_divisions WHERE division_number = '07'), '07 20 00', 'Thermal Protection', 'Insulation and vapor retarders'),
((SELECT id FROM csi_divisions WHERE division_number = '07'), '07 30 00', 'Steep Slope Roofing', 'Shingles and roofing tiles'),
((SELECT id FROM csi_divisions WHERE division_number = '07'), '07 40 00', 'Roofing and Siding Panels', 'Metal and composite panels'),

-- Division 08 - Openings
((SELECT id FROM csi_divisions WHERE division_number = '08'), '08 00 00', 'Openings', 'Doors, windows, and glazing'),
((SELECT id FROM csi_divisions WHERE division_number = '08'), '08 10 00', 'Doors and Frames', 'Wood, metal, and special doors'),
((SELECT id FROM csi_divisions WHERE division_number = '08'), '08 30 00', 'Specialty Doors and Frames', 'Access doors, coiling doors'),
((SELECT id FROM csi_divisions WHERE division_number = '08'), '08 40 00', 'Entrances, Storefronts, and Curtain Walls', 'Commercial glazing systems'),
((SELECT id FROM csi_divisions WHERE division_number = '08'), '08 50 00', 'Windows', 'Wood, metal, and composite windows'),

-- Division 09 - Finishes
((SELECT id FROM csi_divisions WHERE division_number = '09'), '09 00 00', 'Finishes', 'Interior finishes and surfaces'),
((SELECT id FROM csi_divisions WHERE division_number = '09'), '09 20 00', 'Plaster and Gypsum Board', 'Gypsum board assemblies'),
((SELECT id FROM csi_divisions WHERE division_number = '09'), '09 30 00', 'Tiling', 'Ceramic and stone tiling'),
((SELECT id FROM csi_divisions WHERE division_number = '09'), '09 60 00', 'Flooring', 'Resilient, wood, and carpet flooring'),
((SELECT id FROM csi_divisions WHERE division_number = '09'), '09 90 00', 'Painting and Coating', 'Paints and protective coatings'),

-- Division 22 - Plumbing
((SELECT id FROM csi_divisions WHERE division_number = '22'), '22 00 00', 'Plumbing', 'Plumbing systems and fixtures'),
((SELECT id FROM csi_divisions WHERE division_number = '22'), '22 10 00', 'Plumbing Piping', 'Water supply and drainage piping'),
((SELECT id FROM csi_divisions WHERE division_number = '22'), '22 30 00', 'Plumbing Equipment', 'Domestic water heating equipment'),
((SELECT id FROM csi_divisions WHERE division_number = '22'), '22 40 00', 'Plumbing Fixtures', 'Water closets, lavatories, sinks'),

-- Division 23 - HVAC
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 00 00', 'Heating, Ventilating, and Air Conditioning (HVAC)', 'HVAC systems and equipment'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 05 00', 'Common Work Results for HVAC', 'HVAC materials and methods'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 07 00', 'HVAC Insulation', 'Ductwork and piping insulation'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 20 00', 'HVAC Piping and Pumps', 'Hydronic distribution systems'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 30 00', 'HVAC Air Distribution', 'Ductwork and air handling'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 40 00', 'HVAC Air Cleaning Devices', 'Filters and air cleaning equipment'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 50 00', 'Central Heating Equipment', 'Boilers and heating equipment'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 60 00', 'Central Cooling Equipment', 'Chillers and cooling equipment'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 70 00', 'Central HVAC Equipment', 'Air handling units and packaged units'),
((SELECT id FROM csi_divisions WHERE division_number = '23'), '23 80 00', 'Decentralized HVAC Equipment', 'Unit heaters and terminal units'),

-- Division 26 - Electrical
((SELECT id FROM csi_divisions WHERE division_number = '26'), '26 00 00', 'Electrical', 'Electrical systems and equipment'),
((SELECT id FROM csi_divisions WHERE division_number = '26'), '26 05 00', 'Common Work Results for Electrical', 'Basic electrical materials and methods'),
((SELECT id FROM csi_divisions WHERE division_number = '26'), '26 10 00', 'Medium-Voltage Electrical Distribution', 'Medium voltage systems'),
((SELECT id FROM csi_divisions WHERE division_number = '26'), '26 20 00', 'Low-Voltage Electrical Transmission', 'Low voltage distribution'),
((SELECT id FROM csi_divisions WHERE division_number = '26'), '26 30 00', 'Facility Electrical Power Generating and Storing Equipment', 'Generators and UPS systems'),
((SELECT id FROM csi_divisions WHERE division_number = '26'), '26 40 00', 'Electrical and Cathodic Protection', 'Grounding and protection systems'),
((SELECT id FROM csi_divisions WHERE division_number = '26'), '26 50 00', 'Lighting', 'Interior and exterior lighting');

-- Insert sample bid projects
INSERT INTO bid_projects (rfp_id, project_name, project_location, facility_id, total_budget, project_type, status, bid_due_date, estimated_duration) VALUES
('RFP-2024-001', 'Metro Office Complex - Phase 1', 'Downtown Metro City', 'FAC-001', 25000000.00, 'Office Building', 'evaluation', '2024-09-15 17:00:00-07', 420),
('RFP-2024-002', 'University Science Building Renovation', 'Metro University Campus', 'FAC-002', 18500000.00, 'Educational', 'bidding', '2024-10-01 17:00:00-07', 365),
('RFP-2024-003', 'Regional Medical Center Expansion', 'Metro Medical District', 'FAC-003', 45000000.00, 'Healthcare', 'awarded', '2024-08-15 17:00:00-07', 720),
('RFP-2024-004', 'Transit Hub Development', 'Metro Transit Center', 'FAC-004', 35000000.00, 'Transportation', 'draft', '2024-11-15 17:00:00-08', 540),
('RFP-2024-005', 'Green Energy Research Facility', 'Metro Tech Park', 'FAC-005', 28000000.00, 'Industrial', 'bidding', '2024-10-30 17:00:00-07', 480);

-- Insert sample vendors
INSERT INTO bid_vendors (name, company_type, license_number, bonding_capacity, insurance_limits, certifications, minority_owned, woman_owned, veteran_owned, small_business, contact_info, performance_history, prequalification_status, prequalification_expiry) VALUES
('Advanced MEP Solutions LLC', 'subcontractor', 'MEP-2024-001', 15000000.00, 
 '{"general_liability": 2000000, "professional_liability": 1000000, "workers_comp": 1000000, "auto_liability": 1000000}',
 ARRAY['NECA Certified', 'SMACNA Member', 'LEED AP'], 
 false, false, true, false,
 '{"primary_contact": "Sarah Johnson", "email": "sarah.johnson@advancedmep.com", "phone": "(555) 987-6543", "address": "1234 Industrial Blvd, Metro City, ST 12345"}',
 '{"projects_completed": 87, "avg_performance_rating": 4.7, "on_time_delivery_rate": 94, "budget_compliance_rate": 91, "safety_rating": 98}',
 'approved', '2025-12-31 23:59:59-08'),

('Premier HVAC Corporation', 'subcontractor', 'HVAC-2024-002', 12000000.00,
 '{"general_liability": 2000000, "professional_liability": 1000000, "workers_comp": 1000000, "auto_liability": 1000000}',
 ARRAY['SMACNA Certified', 'NATE Certified', 'EPA Section 608'],
 false, false, false, false,
 '{"primary_contact": "Michael Rodriguez", "email": "m.rodriguez@premierhvac.com", "phone": "(555) 234-5678", "address": "5678 Commerce Way, Metro City, ST 12345"}',
 '{"projects_completed": 65, "avg_performance_rating": 4.5, "on_time_delivery_rate": 89, "budget_compliance_rate": 87, "safety_rating": 96}',
 'approved', '2025-06-30 23:59:59-07'),

('Integrated Building Systems Inc', 'subcontractor', 'IBS-2024-003', 8000000.00,
 '{"general_liability": 1500000, "professional_liability": 750000, "workers_comp": 1000000, "auto_liability": 750000}',
 ARRAY['BAS Certified', 'Johnson Controls Partner'],
 true, false, false, true,
 '{"primary_contact": "Lisa Chen", "email": "l.chen@integratedbuilding.com", "phone": "(555) 345-6789", "address": "9012 Tech Drive, Metro City, ST 12345"}',
 '{"projects_completed": 42, "avg_performance_rating": 4.3, "on_time_delivery_rate": 85, "budget_compliance_rate": 83, "safety_rating": 94}',
 'approved', '2025-03-31 23:59:59-07'),

('Metro Mechanical Contractors', 'subcontractor', 'MMC-2024-004', 6000000.00,
 '{"general_liability": 1000000, "professional_liability": 500000, "workers_comp": 1000000, "auto_liability": 500000}',
 ARRAY['Local Union 123', 'OSHA 30 Hour'],
 false, false, false, true,
 '{"primary_contact": "David Kim", "email": "d.kim@metromechanical.com", "phone": "(555) 456-7890", "address": "3456 Industrial Park Rd, Metro City, ST 12345"}',
 '{"projects_completed": 28, "avg_performance_rating": 4.1, "on_time_delivery_rate": 81, "budget_compliance_rate": 79, "safety_rating": 91}',
 'approved', '2025-09-30 23:59:59-07'),

('Elite Electrical Systems', 'subcontractor', 'EES-2024-005', 20000000.00,
 '{"general_liability": 3000000, "professional_liability": 2000000, "workers_comp": 1500000, "auto_liability": 1500000}',
 ARRAY['NECA Member', 'IBEW Local 456', 'IES Certified'],
 false, true, false, false,
 '{"primary_contact": "Jennifer Williams", "email": "j.williams@eliteelectrical.com", "phone": "(555) 567-8901", "address": "7890 Power Street, Metro City, ST 12345"}',
 '{"projects_completed": 112, "avg_performance_rating": 4.8, "on_time_delivery_rate": 96, "budget_compliance_rate": 93, "safety_rating": 99}',
 'approved', '2025-11-30 23:59:59-08'),

('Apex Construction Services', 'gc', 'GC-2024-001', 50000000.00,
 '{"general_liability": 5000000, "professional_liability": 2000000, "workers_comp": 2000000, "auto_liability": 2000000}',
 ARRAY['AGC Member', 'LEED AP BD+C', 'OSHA VPP Star'],
 false, false, true, false,
 '{"primary_contact": "Robert Thompson", "email": "r.thompson@apexconstruction.com", "phone": "(555) 678-9012", "address": "1111 Builder Avenue, Metro City, ST 12345"}',
 '{"projects_completed": 156, "avg_performance_rating": 4.6, "on_time_delivery_rate": 92, "budget_compliance_rate": 89, "safety_rating": 97}',
 'approved', '2026-01-31 23:59:59-08');

-- Insert line items for RFP-2024-001 (Metro Office Complex)
INSERT INTO bid_line_items (bid_project_id, csi_code_id, csi_code, item_number, description, specification_section, quantity, unit_of_measure, engineer_estimate, unit_price_estimate, category, subcategory, is_allowance, is_alternate, is_unit_price) VALUES
-- General Requirements
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '01 10 00'), '01 10 00', '01-001', 'Project Management and General Conditions', '01100', 1.00, 'LS', 750000.00, 750000.00, 'General Requirements', 'Project Management', false, false, false),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '01 40 00'), '01 40 00', '01-002', 'Quality Control Testing and Inspection', '01400', 1.00, 'LS', 185000.00, 185000.00, 'General Requirements', 'Testing', false, false, false),

-- Concrete
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '03 30 00'), '03 30 00', '03-001', 'Cast-in-Place Concrete Foundations', '03300', 2500.00, 'CY', 875000.00, 350.00, 'Concrete', 'Foundations', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '03 30 00'), '03 30 00', '03-002', 'Cast-in-Place Concrete Slabs on Grade', '03300', 45000.00, 'SF', 540000.00, 12.00, 'Concrete', 'Slabs', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '03 30 00'), '03 30 00', '03-003', 'Cast-in-Place Concrete Elevated Slabs', '03300', 180000.00, 'SF', 2880000.00, 16.00, 'Concrete', 'Elevated Slabs', false, false, true),

-- Structural Steel
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '05 10 00'), '05 10 00', '05-001', 'Structural Steel Framing', '05100', 850.00, 'TON', 1360000.00, 1600.00, 'Structural Steel', 'Framing', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '05 30 00'), '05 30 00', '05-002', 'Metal Floor and Roof Decking', '05300', 185000.00, 'SF', 462500.00, 2.50, 'Structural Steel', 'Decking', false, false, true),

-- Curtain Wall System
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '08 40 00'), '08 40 00', '08-001', 'Unitized Curtain Wall System', '08400', 35000.00, 'SF', 3500000.00, 100.00, 'Envelope', 'Curtain Wall', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '08 50 00'), '08 50 00', '08-002', 'Operable Windows', '08500', 150.00, 'EA', 225000.00, 1500.00, 'Envelope', 'Windows', false, false, true),

-- Interior Finishes
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '09 20 00'), '09 20 00', '09-001', 'Gypsum Board Assemblies', '09200', 285000.00, 'SF', 855000.00, 3.00, 'Finishes', 'Drywall', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '09 60 00'), '09 60 00', '09-002', 'Carpet Flooring', '09600', 125000.00, 'SF', 375000.00, 3.00, 'Finishes', 'Flooring', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '09 60 00'), '09 60 00', '09-003', 'Luxury Vinyl Tile Flooring', '09600', 85000.00, 'SF', 425000.00, 5.00, 'Finishes', 'Flooring', false, false, true),

-- HVAC Systems
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '23 70 00'), '23 70 00', '23-001', 'Central Air Handling Units', '23700', 12.00, 'EA', 1800000.00, 150000.00, 'HVAC', 'Air Handling', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '23 30 00'), '23 30 00', '23-002', 'Supply and Return Ductwork', '23300', 25000.00, 'LB', 1250000.00, 50.00, 'HVAC', 'Ductwork', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '23 60 00'), '23 60 00', '23-003', 'Water-Cooled Chillers', '23600', 3.00, 'EA', 900000.00, 300000.00, 'HVAC', 'Cooling Equipment', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '23 80 00'), '23 80 00', '23-004', 'Variable Air Volume Terminal Units', '23800', 450.00, 'EA', 675000.00, 1500.00, 'HVAC', 'Terminal Units', false, false, true),

-- Electrical Systems  
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '26 20 00'), '26 20 00', '26-001', 'Main Electrical Service and Distribution', '26200', 1.00, 'LS', 1200000.00, 1200000.00, 'Electrical', 'Service', false, false, false),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '26 20 00'), '26 20 00', '26-002', 'Branch Circuit Wiring and Devices', '26200', 1.00, 'LS', 2400000.00, 2400000.00, 'Electrical', 'Power Distribution', false, false, false),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '26 50 00'), '26 50 00', '26-003', 'LED Lighting Systems', '26500', 1.00, 'LS', 850000.00, 850000.00, 'Electrical', 'Lighting', false, false, false),

-- Plumbing
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '22 10 00'), '22 10 00', '22-001', 'Domestic Water Distribution', '22100', 1.00, 'LS', 485000.00, 485000.00, 'Plumbing', 'Water Distribution', false, false, false),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM csi_codes WHERE code = '22 40 00'), '22 40 00', '22-002', 'Plumbing Fixtures', '22400', 1.00, 'LS', 325000.00, 325000.00, 'Plumbing', 'Fixtures', false, false, false);

-- Insert vendor bid submissions for RFP-2024-001
INSERT INTO vendor_bid_submissions (bid_project_id, vendor_id, submission_date, total_base_bid, total_alternates, total_bid_amount, bid_bond_amount, performance_bond_rate, unit_price_schedule, exceptions_taken, clarifications_requested, compliance_status, compliance_notes, submitted_documents) VALUES
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Advanced MEP Solutions LLC'), '2024-09-12 16:30:00-07', 23850000.00, 125000.00, 23975000.00, 239750.00, 1.00, true, 2, 3, 'compliant', 'All requirements met with minor clarifications on HVAC sequences', 
 '{"bid_form": true, "bond": true, "insurance_cert": true, "references": true, "financial_statements": true, "project_schedule": true}'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Premier HVAC Corporation'), '2024-09-13 14:15:00-07', 24200000.00, 85000.00, 24285000.00, 242850.00, 1.00, true, 1, 2, 'compliant', 'Fully compliant submission with alternative HVAC control system proposed',
 '{"bid_form": true, "bond": true, "insurance_cert": true, "references": true, "financial_statements": true, "project_schedule": true}'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Integrated Building Systems Inc'), '2024-09-14 11:45:00-07', 24750000.00, 195000.00, 24945000.00, 249450.00, 1.25, true, 4, 5, 'conditional', 'Insurance certificate pending renewal, estimated completion 9/20/2024',
 '{"bid_form": true, "bond": true, "insurance_cert": false, "references": true, "financial_statements": true, "project_schedule": true}'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Metro Mechanical Contractors'), '2024-09-11 13:20:00-07', 23450000.00, 65000.00, 23515000.00, 235150.00, 1.50, true, 6, 8, 'non_compliant', 'Missing required experience documentation for similar scale projects',
 '{"bid_form": true, "bond": true, "insurance_cert": true, "references": false, "financial_statements": true, "project_schedule": true}'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Elite Electrical Systems'), '2024-09-13 15:30:00-07', 24100000.00, 155000.00, 24255000.00, 242550.00, 0.75, true, 1, 1, 'compliant', 'Exemplary submission with value engineering alternatives',
 '{"bid_form": true, "bond": true, "insurance_cert": true, "references": true, "financial_statements": true, "project_schedule": true}'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Apex Construction Services'), '2024-09-14 16:45:00-07', 23980000.00, 225000.00, 24205000.00, 242050.00, 1.00, true, 0, 1, 'compliant', 'Complete and comprehensive submission with detailed project schedule',
 '{"bid_form": true, "bond": true, "insurance_cert": true, "references": true, "financial_statements": true, "project_schedule": true}');

-- Insert detailed line item bids from vendors (sample for key line items)
-- HVAC Line Items for Advanced MEP Solutions
INSERT INTO vendor_line_item_bids (vendor_submission_id, line_item_id, unit_price, total_price, is_alternate, is_no_bid, is_allowance, vendor_notes) VALUES
((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Advanced MEP Solutions LLC'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-001'), 148000.00, 1776000.00, false, false, false, 'Premium efficiency units with advanced controls'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Advanced MEP Solutions LLC'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-002'), 52.50, 1312500.00, false, false, false, 'Includes all fittings and supports'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Advanced MEP Solutions LLC'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-003'), 295000.00, 885000.00, false, false, false, 'High efficiency magnetic bearing chillers'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Advanced MEP Solutions LLC'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-004'), 1485.00, 668250.00, false, false, false, 'Variable speed drive equipped');

-- HVAC Line Items for Premier HVAC Corporation  
INSERT INTO vendor_line_item_bids (vendor_submission_id, line_item_id, unit_price, total_price, is_alternate, is_no_bid, is_allowance, vendor_notes) VALUES
((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Premier HVAC Corporation'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-001'), 152000.00, 1824000.00, false, false, false, 'Standard efficiency with 5-year warranty'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Premier HVAC Corporation'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-002'), 54.25, 1356250.00, false, false, false, 'Galvanized steel with acoustic lining'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Premier HVAC Corporation'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-003'), 308000.00, 924000.00, false, false, false, 'Screw-type chillers with standard efficiency'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Premier HVAC Corporation'), 
 (SELECT id FROM bid_line_items WHERE item_number = '23-004'), 1520.00, 684000.00, false, false, false, 'Pneumatic controls included');

-- Electrical Line Items for Elite Electrical Systems
INSERT INTO vendor_line_item_bids (vendor_submission_id, line_item_id, unit_price, total_price, is_alternate, is_no_bid, is_allowance, vendor_notes) VALUES
((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Elite Electrical Systems'), 
 (SELECT id FROM bid_line_items WHERE item_number = '26-001'), 1180000.00, 1180000.00, false, false, false, 'Includes 2000A main service with monitoring'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Elite Electrical Systems'), 
 (SELECT id FROM bid_line_items WHERE item_number = '26-002'), 2350000.00, 2350000.00, false, false, false, 'Complete power distribution with smart devices'),

((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Elite Electrical Systems'), 
 (SELECT id FROM bid_line_items WHERE item_number = '26-003'), 825000.00, 825000.00, false, false, false, 'LED fixtures with daylight harvesting controls');

-- Insert line item analyses for key HVAC items
INSERT INTO line_item_analyses (line_item_id, analysis_date, participating_vendors, responding_vendors, no_bid_count, low_bid, high_bid, average_bid, median_bid, standard_deviation, coefficient_variation, engineer_estimate, avg_vs_estimate_variance, median_vs_estimate_variance, outlier_threshold, outlier_vendor_ids, outlier_count, price_volatility, market_competitiveness, recommendation) VALUES
-- Air Handling Units Analysis
((SELECT id FROM bid_line_items WHERE item_number = '23-001'), NOW(), 6, 2, 0, 1776000.00, 1824000.00, 1800000.00, 1800000.00, 33941.12, 0.0188, 1800000.00, 0.0000, 0.0000, 
 ARRAY[]::UUID[], ARRAY[]::UUID[], 0, 'low', 'good', 'Competitive pricing from both vendors with good technical solutions'),

-- Ductwork Analysis  
((SELECT id FROM bid_line_items WHERE item_number = '23-002'), NOW(), 6, 2, 0, 1312500.00, 1356250.00, 1334375.00, 1334375.00, 30901.70, 0.0232, 1250000.00, 0.0675, 0.0675,
 ARRAY[]::UUID[], ARRAY[]::UUID[], 0, 'low', 'fair', 'Pricing slightly above estimate but within acceptable range'),

-- Chillers Analysis
((SELECT id FROM bid_line_items WHERE item_number = '23-003'), NOW(), 6, 2, 0, 885000.00, 924000.00, 904500.00, 904500.00, 27577.16, 0.0305, 900000.00, 0.0050, 0.0050,
 ARRAY[]::UUID[], ARRAY[]::UUID[], 0, 'low', 'excellent', 'Well-priced competitive solutions meeting specifications');

-- Insert vendor evaluations
INSERT INTO vendor_evaluations (vendor_submission_id, evaluator_id, evaluation_date, technical_score, technical_criteria, commercial_score, commercial_criteria, compliance_score, compliance_items, composite_score, ranking, recommendation, evaluator_notes) VALUES
-- Advanced MEP Solutions Evaluation
((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Advanced MEP Solutions LLC'),
 '11111111-1111-1111-1111-111111111111', NOW(), 92.5,
 '{"experience": 95, "personnel_qualifications": 90, "project_approach": 92, "schedule_feasibility": 94, "quality_plan": 90, "safety_plan": 94}',
 88.0,
 '{"price_competitiveness": 90, "financial_stability": 88, "bonding_capacity": 85, "insurance_adequacy": 90, "contract_terms": 87}',
 95.0,
 '{"bid_form_complete": true, "bonds_adequate": true, "insurance_compliant": true, "references_satisfactory": true, "licensing_current": true, "minority_certification": false}',
 90.3, 1, 'award', 'Excellent technical approach with competitive pricing and strong track record'),

-- Premier HVAC Corporation Evaluation  
((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Premier HVAC Corporation'),
 '11111111-1111-1111-1111-111111111111', NOW(), 89.0,
 '{"experience": 88, "personnel_qualifications": 87, "project_approach": 89, "schedule_feasibility": 91, "quality_plan": 88, "safety_plan": 91}',
 85.5,
 '{"price_competitiveness": 85, "financial_stability": 86, "bonding_capacity": 84, "insurance_adequacy": 87, "contract_terms": 85}',
 93.0,
 '{"bid_form_complete": true, "bonds_adequate": true, "insurance_compliant": true, "references_satisfactory": true, "licensing_current": true, "minority_certification": false}',
 87.3, 2, 'consider', 'Good technical solution with adequate pricing, solid alternative choice'),

-- Elite Electrical Systems Evaluation
((SELECT vbs.id FROM vendor_bid_submissions vbs JOIN bid_vendors bv ON vbs.vendor_id = bv.id WHERE bv.name = 'Elite Electrical Systems'),
 '11111111-1111-1111-1111-111111111111', NOW(), 94.0,
 '{"experience": 96, "personnel_qualifications": 93, "project_approach": 95, "schedule_feasibility": 92, "quality_plan": 94, "safety_plan": 96}',
 91.0,
 '{"price_competitiveness": 88, "financial_stability": 94, "bonding_capacity": 92, "insurance_adequacy": 95, "contract_terms": 90}',
 97.0,
 '{"bid_form_complete": true, "bonds_adequate": true, "insurance_compliant": true, "references_satisfactory": true, "licensing_current": true, "minority_certification": true}',
 92.8, 1, 'award', 'Outstanding electrical contractor with excellent safety record and technical expertise');

-- Insert award recommendation
INSERT INTO award_recommendations (bid_project_id, recommended_vendor_id, recommendation_date, recommended_amount, technical_justification, commercial_justification, risk_assessment, second_choice_vendor_id, second_choice_amount, prepared_by, approval_status) VALUES
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), 
 (SELECT id FROM bid_vendors WHERE name = 'Advanced MEP Solutions LLC'), 
 NOW(), 23975000.00,
 'Advanced MEP Solutions demonstrated superior technical expertise with high-efficiency equipment specifications, comprehensive project approach, and experienced project team. Their solution includes premium efficiency units with advanced controls that will provide long-term operational savings.',
 'Competitive pricing at $23.975M represents good value for the technical solution provided. While not the lowest bid, the premium equipment and comprehensive approach justify the cost differential. Strong financial position and adequate bonding capacity.',
 'Low overall risk. Vendor has excellent track record with similar projects, strong safety record (98% rating), and proven ability to deliver on schedule (94% on-time rate). Insurance and bonding adequate for project scope.',
 (SELECT id FROM bid_vendors WHERE name = 'Premier HVAC Corporation'),
 24285000.00,
 '11111111-1111-1111-1111-111111111111',
 'draft');

-- Insert sample bid analysis settings
INSERT INTO bid_analysis_settings (organization_id, outlier_detection_method, outlier_threshold, minimum_bids_for_analysis, technical_weight, commercial_weight, compliance_weight, approval_threshold_amount, dual_approval_threshold, notification_preferences) VALUES
('22222222-2222-2222-2222-222222222222', 'iqr', 1.5, 3, 40.0, 40.0, 20.0, 100000.0, 500000.0,
 '{"bid_submission": true, "evaluation_complete": true, "award_recommendation": true, "protest_filed": true}');

-- Insert sample market analysis
INSERT INTO market_analyses (csi_division_id, analysis_period_start, analysis_period_end, market_activity_level, price_trend, material_cost_index, labor_availability, regional_price_index, historical_price_variance, seasonal_adjustments, economic_indicators) VALUES
((SELECT id FROM csi_divisions WHERE division_number = '23'), '2024-01-01', '2024-06-30', 'high', 'increasing', 108.5, 'tight', 102.3, 0.0875,
 ARRAY[0.95, 0.98, 1.02, 1.05, 1.03, 1.01, 0.99, 0.97, 1.01, 1.04, 1.02, 0.98],
 '{"inflation_rate": 3.2, "unemployment_rate": 4.1, "construction_index": 112.4}'),

((SELECT id FROM csi_divisions WHERE division_number = '26'), '2024-01-01', '2024-06-30', 'very_high', 'stable', 104.2, 'adequate', 101.8, 0.0654,
 ARRAY[1.01, 1.02, 1.00, 0.99, 1.01, 1.02, 1.00, 0.98, 1.01, 1.03, 1.01, 0.99],
 '{"inflation_rate": 3.2, "unemployment_rate": 4.1, "construction_index": 112.4}');

-- Insert sample document records
INSERT INTO bid_documents (bid_project_id, vendor_id, document_type, file_name, file_size, file_path, mime_type, version, uploaded_by, access_level) VALUES
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), NULL, 'rfp', 'RFP-2024-001_MetroOfficeComplex.pdf', 5842688, '/documents/rfp/RFP-2024-001_MetroOfficeComplex.pdf', 'application/pdf', '1.0', '11111111-1111-1111-1111-111111111111', 'public'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), NULL, 'addendum', 'RFP-2024-001_Addendum_01.pdf', 452834, '/documents/addenda/RFP-2024-001_Addendum_01.pdf', 'application/pdf', '1.0', '11111111-1111-1111-1111-111111111111', 'public'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Advanced MEP Solutions LLC'), 'bid_submission', 'AdvancedMEP_Bid_Submission.pdf', 12847392, '/documents/bids/RFP-2024-001/AdvancedMEP_Bid_Submission.pdf', 'application/pdf', '1.0', '11111111-1111-1111-1111-111111111111', 'restricted'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), (SELECT id FROM bid_vendors WHERE name = 'Elite Electrical Systems'), 'bid_submission', 'EliteElectrical_Bid_Package.pdf', 9573664, '/documents/bids/RFP-2024-001/EliteElectrical_Bid_Package.pdf', 'application/pdf', '1.0', '11111111-1111-1111-1111-111111111111', 'restricted');

-- Create additional sample data for other RFPs to provide more comprehensive testing data

-- Add line items for RFP-2024-002 (University Science Building)
INSERT INTO bid_line_items (bid_project_id, csi_code_id, csi_code, item_number, description, specification_section, quantity, unit_of_measure, engineer_estimate, unit_price_estimate, category, subcategory, is_allowance, is_alternate, is_unit_price) VALUES
-- University Science Building HVAC
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'), (SELECT id FROM csi_codes WHERE code = '23 70 00'), '23 70 00', '23-U001', 'Laboratory Air Handling Units with Energy Recovery', '23700', 8.00, 'EA', 1200000.00, 150000.00, 'HVAC', 'Lab Air Handling', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'), (SELECT id FROM csi_codes WHERE code = '23 30 00'), '23 30 00', '23-U002', 'Laboratory Exhaust Systems', '23300', 12000.00, 'LB', 720000.00, 60.00, 'HVAC', 'Exhaust Systems', false, false, true),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'), (SELECT id FROM csi_codes WHERE code = '23 80 00'), '23 80 00', '23-U003', 'Fume Hood Exhaust Controls', '23800', 45.00, 'EA', 337500.00, 7500.00, 'HVAC', 'Lab Controls', false, false, true),

-- University Science Building Electrical
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'), (SELECT id FROM csi_codes WHERE code = '26 20 00'), '26 20 00', '26-U001', 'Laboratory Power Distribution', '26200', 1.00, 'LS', 950000.00, 950000.00, 'Electrical', 'Lab Power', false, false, false),
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'), (SELECT id FROM csi_codes WHERE code = '26 50 00'), '26 50 00', '26-U002', 'Laboratory Lighting with Emergency Systems', '26500', 1.00, 'LS', 475000.00, 475000.00, 'Electrical', 'Lab Lighting', false, false, false);

-- Add some vendor submissions for University project
INSERT INTO vendor_bid_submissions (bid_project_id, vendor_id, submission_date, total_base_bid, total_alternates, total_bid_amount, bid_bond_amount, performance_bond_rate, unit_price_schedule, exceptions_taken, clarifications_requested, compliance_status, compliance_notes, submitted_documents) VALUES
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'), (SELECT id FROM bid_vendors WHERE name = 'Advanced MEP Solutions LLC'), '2024-09-28 15:00:00-07', 17850000.00, 95000.00, 17945000.00, 179450.00, 1.00, true, 1, 2, 'compliant', 'Laboratory systems expertise demonstrated',
 '{"bid_form": true, "bond": true, "insurance_cert": true, "references": true, "financial_statements": true, "project_schedule": true}'),

((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-002'), (SELECT id FROM bid_vendors WHERE name = 'Elite Electrical Systems'), '2024-09-29 16:30:00-07', 18200000.00, 125000.00, 18325000.00, 183250.00, 1.00, true, 0, 1, 'compliant', 'Specialized laboratory electrical systems included',
 '{"bid_form": true, "bond": true, "insurance_cert": true, "references": true, "financial_statements": true, "project_schedule": true}');

-- Insert a sample BAFO request for added realism
INSERT INTO bafo_requests (bid_project_id, vendor_ids, request_date, response_due_date, scope_clarifications, price_adjustments_allowed, specific_items, status, created_by) VALUES
((SELECT id FROM bid_projects WHERE rfp_id = 'RFP-2024-001'), 
 ARRAY[(SELECT id FROM bid_vendors WHERE name = 'Advanced MEP Solutions LLC'), (SELECT id FROM bid_vendors WHERE name = 'Premier HVAC Corporation')],
 '2024-09-16 10:00:00-07', '2024-09-20 17:00:00-07',
 'Clarification needed on HVAC control sequences and energy monitoring systems. Please provide final pricing for base bid and alternates.',
 true,
 ARRAY['23-001', '23-002', '23-003'],
 'sent',
 '11111111-1111-1111-1111-111111111111');

-- Create summary view data by refreshing materialized views if they existed
-- This is sample analysis that would be computed by the application

-- Add some bid leveling adjustments for demonstration
INSERT INTO bid_leveling_adjustments (line_item_analysis_id, vendor_line_item_bid_id, adjustment_type, original_amount, adjusted_amount, adjustment_reason, approved_by, approval_date) VALUES
-- Sample adjustment for scope clarification
((SELECT lia.id FROM line_item_analyses lia 
  JOIN bid_line_items bli ON lia.line_item_id = bli.id 
  WHERE bli.item_number = '23-002'),
 (SELECT vlib.id FROM vendor_line_item_bids vlib 
  JOIN vendor_bid_submissions vbs ON vlib.vendor_submission_id = vbs.id
  JOIN bid_vendors bv ON vbs.vendor_id = bv.id
  JOIN bid_line_items bli ON vlib.line_item_id = bli.id
  WHERE bv.name = 'Premier HVAC Corporation' AND bli.item_number = '23-002'),
 'scope_clarification', 1356250.00, 1325000.00, 'Adjusted for clarification that acoustic lining not required in mechanical rooms', 
 '11111111-1111-1111-1111-111111111111', NOW());

-- Add sample analytics report
INSERT INTO bid_analytics_reports (report_type, report_period_start, report_period_end, parameters, generated_by, summary_data) VALUES
('project_summary', '2024-07-01', '2024-09-30', 
 '{"project_ids": ["RFP-2024-001"], "include_alternates": true, "detail_level": "full"}',
 '11111111-1111-1111-1111-111111111111',
 '{"total_projects": 1, "total_bids_received": 6, "average_bid_count": 6, "total_contract_value": 24205000, "average_savings_vs_estimate": 0.032, "vendor_participation_rate": 0.85, "compliance_rate": 0.83}');

-- Final summary statistics update
ANALYZE bid_projects;
ANALYZE bid_line_items;
ANALYZE bid_vendors;
ANALYZE vendor_bid_submissions;
ANALYZE vendor_line_item_bids;
ANALYZE line_item_analyses;
ANALYZE vendor_evaluations;
