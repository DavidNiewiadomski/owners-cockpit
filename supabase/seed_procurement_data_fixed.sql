-- Comprehensive Procurement Data Seed Script (Fixed UUIDs)
-- This script seeds all procurement-related tables with realistic sample data

-- First, let's check if we have any existing projects to reference
DO $$
DECLARE
    project_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO project_count FROM projects;
    IF project_count = 0 THEN
        RAISE EXCEPTION 'No projects found. Please create projects first.';
    END IF;
END $$;

-- Create some user roles for testing
INSERT INTO user_roles (user_id, role) VALUES
('00000000-0000-0000-0000-000000000001', 'RFP_ADMIN'),
('00000000-0000-0000-0000-000000000001', 'BID_ADMIN'),
('00000000-0000-0000-0000-000000000002', 'BID_REVIEWER'),
('11111111-1111-1111-1111-111111111111', 'VENDOR'),
('22222222-2222-2222-2222-222222222222', 'VENDOR'),
('33333333-3333-3333-3333-333333333333', 'VENDOR'),
('44444444-4444-4444-4444-444444444444', 'VENDOR'),
('55555555-5555-5555-5555-555555555555', 'VENDOR')
ON CONFLICT DO NOTHING;

-- Seed Companies (Vendors)
INSERT INTO companies (
    id, name, duns_number, tax_id, address_line1, city, state, zip_code, 
    phone, email, website, primary_contact_name, primary_contact_title, 
    primary_contact_email, primary_contact_phone, company_type, 
    specialty_codes, years_in_business, employee_count, annual_revenue, bonding_capacity
) VALUES
('11111111-1111-1111-1111-111111111111', 'Advanced MEP Solutions LLC', '123456789', '12-3456789', 
 '1234 Industrial Blvd', 'Metro City', 'CA', '90210', '(555) 987-6543', 
 'info@advancedmep.com', 'https://advancedmep.com', 'Sarah Johnson', 'President', 
 'sarah.johnson@advancedmep.com', '(555) 987-6543', 'subcontractor', 
 ARRAY['23 05 00', '23 07 00', '26 05 00'], 15, 125, 12500000, 5000000),

('22222222-2222-2222-2222-222222222222', 'Premier HVAC Corporation', '234567890', '23-4567890', 
 '5678 Commerce Way', 'Metro City', 'CA', '90211', '(555) 234-5678', 
 'contact@premierhvac.com', 'https://premierhvac.com', 'Michael Rodriguez', 'CEO', 
 'm.rodriguez@premierhvac.com', '(555) 234-5678', 'subcontractor', 
 ARRAY['23 05 00', '23 07 00'], 12, 95, 8900000, 4000000),

('33333333-3333-3333-3333-333333333333', 'Integrated Building Systems Inc', '345678901', '34-5678901', 
 '9012 Tech Drive', 'Metro City', 'CA', '90212', '(555) 345-6789', 
 'info@integratedbuilding.com', 'https://integratedbuilding.com', 'Lisa Chen', 'VP Operations', 
 'l.chen@integratedbuilding.com', '(555) 345-6789', 'subcontractor', 
 ARRAY['23 05 00', '26 05 00', '22 10 00'], 8, 75, 6700000, 3500000),

('44444444-4444-4444-4444-444444444444', 'Metro Mechanical Contractors', '456789012', '45-6789012', 
 '3456 Industrial Park Rd', 'Metro City', 'CA', '90213', '(555) 456-7890', 
 'info@metromechanical.com', 'https://metromechanical.com', 'David Kim', 'Project Manager', 
 'd.kim@metromechanical.com', '(555) 456-7890', 'subcontractor', 
 ARRAY['23 05 00', '22 10 00'], 6, 45, 5400000, 2500000),

('55555555-5555-5555-5555-555555555555', 'Metropolitan Steel Works', '567890123', '56-7890123', 
 '7890 Steel Avenue', 'Metro City', 'CA', '90214', '(555) 123-4567', 
 'sales@metrosteel.com', 'https://metrosteel.com', 'John Smith', 'Sales Director', 
 'j.smith@metrosteel.com', '(555) 123-4567', 'subcontractor', 
 ARRAY['05 12 00', '05 21 00'], 25, 230, 23400000, 12000000),

('66666666-6666-6666-6666-666666666666', 'Premier Concrete Co.', '678901234', '67-8901234', 
 '2468 Concrete Way', 'Metro City', 'CA', '90215', '(555) 987-1234', 
 'info@premierconcrete.com', 'https://premierconcrete.com', 'Mike Rodriguez', 'Operations Manager', 
 'm.rodriguez@premierconcrete.com', '(555) 987-1234', 'subcontractor', 
 ARRAY['03 30 00', '03 35 00'], 18, 150, 18700000, 8500000),

('77777777-7777-7777-7777-777777777777', 'Glass Tech Systems', '789012345', '78-9012345', 
 '1357 Curtain Wall Dr', 'Metro City', 'CA', '90216', '(555) 234-5678', 
 'contact@glasstech.com', 'https://glasstech.com', 'Lisa Chen', 'Technical Director', 
 'l.chen@glasstech.com', '(555) 234-5678', 'subcontractor', 
 ARRAY['08 40 00', '08 41 00'], 10, 85, 14200000, 6000000);

-- Seed Prequalification Records
INSERT INTO prequal (
    id, company_id, status, expiry_date, submitted_at, reviewed_at, 
    reviewed_by, review_notes, score, application_version, 
    requested_trades, project_size_limit, geographic_limits,
    contact_name, contact_title, contact_email, contact_phone
) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
 'approved', '2025-12-31', '2024-06-15 10:30:00+00', '2024-06-20 14:45:00+00',
 '00000000-0000-0000-0000-000000000001', 'Excellent financial standing and safety record', 92,
 '1.0', ARRAY['HVAC', 'Electrical', 'Plumbing'], 10000000, ARRAY['CA', 'NV'],
 'Sarah Johnson', 'President', 'sarah.johnson@advancedmep.com', '(555) 987-6543'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 
 'approved', '2025-11-30', '2024-05-20 09:15:00+00', '2024-05-25 16:20:00+00',
 '00000000-0000-0000-0000-000000000001', 'Good track record, some minor safety concerns addressed', 85,
 '1.0', ARRAY['HVAC'], 8000000, ARRAY['CA'],
 'Michael Rodriguez', 'CEO', 'm.rodriguez@premierhvac.com', '(555) 234-5678'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 
 'pending', NULL, '2024-08-10 11:20:00+00', NULL,
 NULL, NULL, NULL,
 '1.0', ARRAY['HVAC', 'Electrical', 'Plumbing'], 7000000, ARRAY['CA'],
 'Lisa Chen', 'VP Operations', 'l.chen@integratedbuilding.com', '(555) 345-6789'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 
 'approved', '2025-10-15', '2024-04-01 08:45:00+00', '2024-04-08 13:30:00+00',
 '00000000-0000-0000-0000-000000000001', 'Adequate performance, limited bonding capacity', 78,
 '1.0', ARRAY['HVAC', 'Plumbing'], 5000000, ARRAY['CA'],
 'David Kim', 'Project Manager', 'd.kim@metromechanical.com', '(555) 456-7890'),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 
 'approved', '2026-03-31', '2024-01-15 12:00:00+00', '2024-01-22 15:45:00+00',
 '00000000-0000-0000-0000-000000000001', 'Outstanding structural contractor with excellent safety record', 96,
 '1.0', ARRAY['Structural Steel'], 25000000, ARRAY['CA', 'NV', 'AZ'],
 'John Smith', 'Sales Director', 'j.smith@metrosteel.com', '(555) 123-4567'),

('ffffffff-ffff-ffff-ffff-ffffffffffff', '66666666-6666-6666-6666-666666666666', 
 'approved', '2026-01-31', '2024-02-10 09:30:00+00', '2024-02-15 11:15:00+00',
 '00000000-0000-0000-0000-000000000001', 'Excellent concrete contractor with proven track record', 94,
 '1.0', ARRAY['Concrete'], 20000000, ARRAY['CA', 'NV'],
 'Mike Rodriguez', 'Operations Manager', 'm.rodriguez@premierconcrete.com', '(555) 987-1234'),

('10101010-1010-1010-1010-101010101010', '77777777-7777-7777-7777-777777777777', 
 'approved', '2025-09-30', '2024-03-05 14:20:00+00', '2024-03-12 10:10:00+00',
 '00000000-0000-0000-0000-000000000001', 'Specialized glazing contractor with good technical capabilities', 88,
 '1.0', ARRAY['Glazing', 'Curtain Wall'], 15000000, ARRAY['CA'],
 'Lisa Chen', 'Technical Director', 'l.chen@glasstech.com', '(555) 234-5678');

-- Get a project ID to use for RFPs and Bids
DO $$
DECLARE
    sample_project_id UUID;
BEGIN
    SELECT id INTO sample_project_id FROM projects LIMIT 1;
    
    -- Seed RFP table with realistic RFPs
    INSERT INTO rfp (
        id, title, facility_id, budget_cap, release_date, proposal_due, 
        contract_start, status, created_by
    ) VALUES
    ('12345678-1234-1234-1234-123456789001', 'Structural Steel Supply and Installation', 
     sample_project_id, 3200000, '2024-08-01', '2024-09-15', '2024-10-01', 'published', 
     '00000000-0000-0000-0000-000000000001'),
    
    ('12345678-1234-1234-1234-123456789002', 'MEP Systems Installation', 
     sample_project_id, 5800000, '2024-07-15', '2024-08-30', '2024-09-15', 'closed', 
     '00000000-0000-0000-0000-000000000001'),
    
    ('12345678-1234-1234-1234-123456789003', 'Concrete Supply and Placement', 
     sample_project_id, 1850000, '2024-07-01', '2024-08-15', '2024-09-01', 'awarded', 
     '00000000-0000-0000-0000-000000000001'),
    
    ('12345678-1234-1234-1234-123456789004', 'Glass Curtain Wall System', 
     sample_project_id, 4200000, '2024-09-01', '2024-10-15', '2024-11-01', 'draft', 
     '00000000-0000-0000-0000-000000000001');
     
    -- Seed Bids table
    INSERT INTO bids (
        id, title, description, project_id, rfp_number, bid_type, estimated_value,
        status, published_at, submission_deadline, evaluation_start, evaluation_end,
        bond_required, bond_percentage, insurance_required, prequalification_required,
        technical_weight, commercial_weight, created_by
    ) VALUES
    ('87654321-4321-4321-4321-876543210001', 'Structural Steel Supply and Installation',
     'Complete structural steel package including fabrication, delivery, and erection',
     sample_project_id, 'RFP-2024-001', 'construction', 3200000,
     'evaluation', '2024-08-01 08:00:00+00', '2024-09-15 17:00:00+00', 
     '2024-09-16 09:00:00+00', '2024-09-30 17:00:00+00',
     true, 10.0, true, true, 60.0, 40.0, '00000000-0000-0000-0000-000000000001'),
    
    ('87654321-4321-4321-4321-876543210002', 'MEP Systems Installation',
     'Complete mechanical, electrical, and plumbing systems installation',
     sample_project_id, 'RFP-2024-002', 'construction', 5800000,
     'leveling_complete', '2024-07-15 08:00:00+00', '2024-08-30 17:00:00+00',
     '2024-08-31 09:00:00+00', '2024-09-15 17:00:00+00',
     true, 10.0, true, true, 70.0, 30.0, '00000000-0000-0000-0000-000000000001'),
    
    ('87654321-4321-4321-4321-876543210003', 'Concrete Supply and Placement',
     'Ready-mix concrete supply and placement for foundation and structure',
     sample_project_id, 'RFP-2024-003', 'construction', 1850000,
     'awarded', '2024-07-01 08:00:00+00', '2024-08-15 17:00:00+00',
     '2024-08-16 09:00:00+00', '2024-08-30 17:00:00+00',
     true, 10.0, true, true, 50.0, 50.0, '00000000-0000-0000-0000-000000000001'),
    
    ('87654321-4321-4321-4321-876543210004', 'Glass Curtain Wall System',
     'High-performance curtain wall system with energy-efficient glazing',
     sample_project_id, 'RFP-2024-004', 'construction', 4200000,
     'draft', NULL, '2024-10-15 17:00:00+00',
     NULL, NULL,
     true, 10.0, true, true, 65.0, 35.0, '00000000-0000-0000-0000-000000000001');
     
    RAISE NOTICE 'Created RFPs and Bids successfully!';
END $$;

-- Seed Vendor Submissions for MEP Systems (RFP-2024-002)
INSERT INTO submissions (
    id, bid_id, vendor_id, vendor_name, vendor_contact_email, vendor_contact_phone,
    status, submitted_at, base_price, total_price, price_sealed,
    bond_submitted, insurance_submitted, prequalification_passed, received_by, opened_by, opened_at
) VALUES
('abcd1234-abcd-abcd-abcd-abcd12345001', '87654321-4321-4321-4321-876543210002', 
 '11111111-1111-1111-1111-111111111111', 'Advanced MEP Solutions LLC', 
 'sarah.johnson@advancedmep.com', '(555) 987-6543',
 'scored', '2024-08-29 16:30:00+00', 5500000, 5750000, false,
 true, true, true, '00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000001', '2024-08-31 09:15:00+00'),

('abcd1234-abcd-abcd-abcd-abcd12345002', '87654321-4321-4321-4321-876543210002', 
 '22222222-2222-2222-2222-222222222222', 'Premier HVAC Corporation', 
 'm.rodriguez@premierhvac.com', '(555) 234-5678',
 'scored', '2024-08-30 14:15:00+00', 5650000, 5920000, false,
 true, true, true, '00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000001', '2024-08-31 09:20:00+00'),

('abcd1234-abcd-abcd-abcd-abcd12345003', '87654321-4321-4321-4321-876543210002', 
 '33333333-3333-3333-3333-333333333333', 'Integrated Building Systems Inc', 
 'l.chen@integratedbuilding.com', '(555) 345-6789',
 'scored', '2024-08-30 11:45:00+00', 5850000, 6100000, false,
 true, false, false, '00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000001', '2024-08-31 09:25:00+00'),

('abcd1234-abcd-abcd-abcd-abcd12345004', '87654321-4321-4321-4321-876543210002', 
 '44444444-4444-4444-4444-444444444444', 'Metro Mechanical Contractors', 
 'd.kim@metromechanical.com', '(555) 456-7890',
 'scored', '2024-08-29 13:20:00+00', 5200000, 5450000, false,
 true, true, true, '00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000001', '2024-08-31 09:30:00+00');

-- Seed Vendor Submissions for Concrete (RFP-2024-003) - Already awarded
INSERT INTO submissions (
    id, bid_id, vendor_id, vendor_name, vendor_contact_email, vendor_contact_phone,
    status, submitted_at, base_price, total_price, price_sealed,
    bond_submitted, insurance_submitted, prequalification_passed, received_by, opened_by, opened_at
) VALUES
('abcd1234-abcd-abcd-abcd-abcd12345005', '87654321-4321-4321-4321-876543210003', 
 '66666666-6666-6666-6666-666666666666', 'Premier Concrete Co.', 
 'm.rodriguez@premierconcrete.com', '(555) 987-1234',
 'shortlisted', '2024-08-14 15:30:00+00', 1750000, 1850000, false,
 true, true, true, '00000000-0000-0000-0000-000000000001', 
 '00000000-0000-0000-0000-000000000001', '2024-08-16 09:00:00+00');

-- Seed Leveling data for MEP submissions
INSERT INTO leveling (
    id, bid_id, submission_id, leveled_base_price, leveled_total_price, 
    adjustment_rationale, is_complete, leveled_by, leveled_at,
    recommended_for_shortlist, recommendation_notes
) VALUES
('efgh5678-efgh-efgh-efgh-efgh56781001', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345001', 5500000, 5750000,
 'No adjustments needed - proposal meets all requirements', true,
 '00000000-0000-0000-0000-000000000002', '2024-09-05 14:30:00+00',
 true, 'Excellent technical proposal with competitive pricing'),

('efgh5678-efgh-efgh-efgh-efgh56781002', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345002', 5650000, 5920000,
 'Minor scope clarifications for equipment specifications', true,
 '00000000-0000-0000-0000-000000000002', '2024-09-05 15:15:00+00',
 true, 'Good proposal but slightly higher cost'),

('efgh5678-efgh-efgh-efgh-efgh56781003', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345003', 5750000, 6000000,
 'Adjusted for missing insurance requirements and clarified scope', true,
 '00000000-0000-0000-0000-000000000002', '2024-09-06 11:20:00+00',
 false, 'Insurance concerns and higher cost after adjustments'),

('efgh5678-efgh-efgh-efgh-efgh56781004', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345004', 5300000, 5550000,
 'Adjusted for experience factor and added supervision costs', true,
 '00000000-0000-0000-0000-000000000002', '2024-09-06 16:45:00+00',
 true, 'Lowest cost but limited experience concerns addressed');

-- Seed Scorecards for MEP submissions
INSERT INTO scorecards (
    id, bid_id, submission_id, evaluator_id, evaluation_phase,
    technical_scores, technical_total, technical_percentage,
    commercial_scores, commercial_total, commercial_percentage,
    weighted_technical_score, weighted_commercial_score, composite_score,
    strengths, weaknesses, recommendations, is_complete, submitted_at
) VALUES
('ijkl9012-ijkl-ijkl-ijkl-ijkl90121001', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345001', '00000000-0000-0000-0000-000000000002', 'combined',
 '{"experience": 95, "technical_approach": 90, "quality_plan": 92, "schedule": 88}', 
 365, 91.25, '{"cost_competitiveness": 85, "value_engineering": 80}', 165, 82.5,
 63.88, 24.75, 88.63,
 'Excellent technical capabilities, proven track record, good schedule approach',
 'Limited value engineering proposals',
 'Recommend for award - best overall value proposition', true, '2024-09-10 16:30:00+00'),

('ijkl9012-ijkl-ijkl-ijkl-ijkl90121002', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345002', '00000000-0000-0000-0000-000000000002', 'combined',
 '{"experience": 88, "technical_approach": 85, "quality_plan": 87, "schedule": 90}', 
 350, 87.5, '{"cost_competitiveness": 78, "value_engineering": 75}', 153, 76.5,
 61.25, 22.95, 84.20,
 'Good technical approach, strong schedule performance',
 'Higher cost, limited innovation',
 'Solid proposal but not best value', true, '2024-09-10 17:15:00+00'),

('ijkl9012-ijkl-ijkl-ijkl-ijkl90121003', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345003', '00000000-0000-0000-0000-000000000002', 'combined',
 '{"experience": 80, "technical_approach": 85, "quality_plan": 82, "schedule": 78}', 
 325, 81.25, '{"cost_competitiveness": 70, "value_engineering": 85}', 155, 77.5,
 56.88, 23.25, 80.13,
 'Innovative technical solutions, good value engineering',
 'Limited experience, insurance compliance issues, higher cost',
 'Not recommended due to compliance and cost concerns', true, '2024-09-11 10:20:00+00'),

('ijkl9012-ijkl-ijkl-ijkl-ijkl90121004', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345004', '00000000-0000-0000-0000-000000000002', 'combined',
 '{"experience": 75, "technical_approach": 78, "quality_plan": 80, "schedule": 85}', 
 318, 79.5, '{"cost_competitiveness": 92, "value_engineering": 70}', 162, 81.0,
 55.65, 24.30, 79.95,
 'Very competitive pricing, adequate technical approach',
 'Limited experience on similar projects, basic quality plan',
 'Consider for backup due to cost advantage', true, '2024-09-11 14:45:00+00');

-- Seed Awards
INSERT INTO awards (
    id, bid_id, winning_submission_id, award_amount, award_justification,
    contract_duration_months, status, recommended_by, approved_by, awarded_at,
    contract_number, contract_start_date, contract_end_date, 
    performance_bond_required, vendor_accepted, vendor_acceptance_date
) VALUES
('mnop3456-mnop-mnop-mnop-mnop34560001', '87654321-4321-4321-4321-876543210003', 
 'abcd1234-abcd-abcd-abcd-abcd12345005', 1850000,
 'Premier Concrete Co. selected based on excellent past performance, competitive pricing, and proven capability on similar projects.',
 6, 'awarded', '00000000-0000-0000-0000-000000000002', 
 '00000000-0000-0000-0000-000000000001', '2024-09-01 10:00:00+00',
 'CON-2024-003', '2024-09-15', '2025-03-15', true, true, '2024-09-02 14:30:00+00');

-- Some Insurance Certificates
INSERT INTO insurance_certificate (
    id, prequal_id, insurance_type, carrier, policy_number, coverage_limit,
    deductible, effective_date, expiry_date, verified, verified_at, verified_by,
    additional_insured, waiver_of_subrogation, primary_and_noncontributory
) VALUES
('qrst7890-qrst-qrst-qrst-qrst78900001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
 'general_liability', 'Liberty Mutual', 'GL-2024-001234', 2000000,
 5000, '2024-01-01', '2024-12-31', true, '2024-06-20 10:00:00+00', 
 '00000000-0000-0000-0000-000000000001', true, true, true),

('qrst7890-qrst-qrst-qrst-qrst78900002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
 'workers_comp', 'Liberty Mutual', 'WC-2024-001234', 1000000,
 0, '2024-01-01', '2024-12-31', true, '2024-06-20 10:00:00+00', 
 '00000000-0000-0000-0000-000000000001', false, true, false);

-- Some Safety Metrics
INSERT INTO safety_metric (
    id, company_id, period_year, emr, dart_rate, trir, ltir,
    osha_incidents, near_misses, first_aid_cases, safety_training_hours,
    certified_safety_personnel, total_work_hours, number_of_employees,
    number_of_projects, verified, verified_at, verified_by, source
) VALUES
('uvwx1234-uvwx-uvwx-uvwx-uvwx12340001', '11111111-1111-1111-1111-111111111111', 
 2023, 0.85, 1.2, 2.1, 0.8, 2, 15, 8, 2400, 3, 245000, 125, 12,
 true, '2024-06-20 12:00:00+00', '00000000-0000-0000-0000-000000000001', 'company_reported'),

('uvwx1234-uvwx-uvwx-uvwx-uvwx12340002', '55555555-5555-5555-5555-555555555555', 
 2023, 0.65, 0.8, 1.5, 0.3, 1, 25, 5, 4800, 8, 460000, 230, 18,
 true, '2024-01-22 14:00:00+00', '00000000-0000-0000-0000-000000000001', 'insurance_carrier');

-- Add scope items for RFPs
INSERT INTO scope_item (rfp_id, csi_code, description) VALUES
('12345678-1234-1234-1234-123456789002', '23 05 00', 'HVAC System - Main Air Handling Units'),
('12345678-1234-1234-1234-123456789002', '23 07 00', 'Ductwork and Distribution System'),
('12345678-1234-1234-1234-123456789002', '26 05 00', 'Electrical Service and Distribution'),
('12345678-1234-1234-1234-123456789002', '22 10 00', 'Domestic Water Distribution System'),
('12345678-1234-1234-1234-123456789001', '05 12 00', 'Structural Steel Framing'),
('12345678-1234-1234-1234-123456789001', '05 21 00', 'Steel Joist Framing'),
('12345678-1234-1234-1234-123456789003', '03 30 00', 'Cast-in-Place Concrete'),
('12345678-1234-1234-1234-123456789003', '03 35 00', 'Concrete Finishing');

-- Add timeline events for RFPs
INSERT INTO timeline_event (rfp_id, name, deadline, mandatory) VALUES
('12345678-1234-1234-1234-123456789001', 'Pre-bid Conference', '2024-08-15 14:00:00+00', false),
('12345678-1234-1234-1234-123456789001', 'Questions Due', '2024-09-01 17:00:00+00', false),
('12345678-1234-1234-1234-123456789001', 'Proposals Due', '2024-09-15 17:00:00+00', true),
('12345678-1234-1234-1234-123456789002', 'Pre-bid Conference', '2024-07-25 10:00:00+00', false),
('12345678-1234-1234-1234-123456789002', 'Site Visit', '2024-08-05 09:00:00+00', false),
('12345678-1234-1234-1234-123456789002', 'Questions Due', '2024-08-20 17:00:00+00', false),
('12345678-1234-1234-1234-123456789002', 'Proposals Due', '2024-08-30 17:00:00+00', true);

-- Add vendor submission data for vendor_submission table (RFP system)
INSERT INTO vendor_submission (
    id, rfp_id, vendor_id, sealed, received_at, tech_score, cost_score,
    composite_score, status
) VALUES
('yxab5678-yxab-yxab-yxab-yxab56780001', '12345678-1234-1234-1234-123456789002', 
 '11111111-1111-1111-1111-111111111111', false, '2024-08-29 16:30:00+00',
 91.25, 82.5, 88.63, 'scored'),
('yxab5678-yxab-yxab-yxab-yxab56780002', '12345678-1234-1234-1234-123456789002', 
 '22222222-2222-2222-2222-222222222222', false, '2024-08-30 14:15:00+00',
 87.5, 76.5, 84.20, 'scored'),
('yxab5678-yxab-yxab-yxab-yxab56780003', '12345678-1234-1234-1234-123456789002', 
 '33333333-3333-3333-3333-333333333333', false, '2024-08-30 11:45:00+00',
 81.25, 77.5, 80.13, 'scored'),
('yxab5678-yxab-yxab-yxab-yxab56780004', '12345678-1234-1234-1234-123456789002', 
 '44444444-4444-4444-4444-444444444444', false, '2024-08-29 13:20:00+00',
 79.5, 81.0, 79.95, 'scored');

-- Seed Bid Events for audit trail
INSERT INTO bid_events (
    id, bid_id, submission_id, event_type, description, triggered_by,
    actor_role, occurred_at, event_data
) VALUES
('zdef9012-zdef-zdef-zdef-zdef90120001', '87654321-4321-4321-4321-876543210002', 
 NULL, 'bid.opened', 'Bid was opened for submissions', 
 '00000000-0000-0000-0000-000000000001', 'BID_ADMIN', '2024-07-15 08:00:00+00',
 '{"published_at": "2024-07-15T08:00:00Z"}'),

('zdef9012-zdef-zdef-zdef-zdef90120002', '87654321-4321-4321-4321-876543210002', 
 'abcd1234-abcd-abcd-abcd-abcd12345001', 'submission.received', 'Vendor submission received',
 '00000000-0000-0000-0000-000000000001', 'BID_ADMIN', '2024-08-29 16:30:00+00',
 '{"vendor_name": "Advanced MEP Solutions LLC", "total_price": 5750000}'),

('zdef9012-zdef-zdef-zdef-zdef90120003', '87654321-4321-4321-4321-876543210002', 
 NULL, 'bid.leveling.completed', 'Bid leveling phase completed for all submissions',
 '00000000-0000-0000-0000-000000000002', 'BID_REVIEWER', '2024-09-06 17:00:00+00', '{}'),

('zdef9012-zdef-zdef-zdef-zdef90120004', '87654321-4321-4321-4321-876543210003', 
 'abcd1234-abcd-abcd-abcd-abcd12345005', 'bid.award.issued', 'Contract award issued to winning vendor',
 '00000000-0000-0000-0000-000000000001', 'BID_ADMIN', '2024-09-01 10:00:00+00',
 '{"award_amount": 1850000, "contract_number": "CON-2024-003"}');

-- Final status message
DO $$
BEGIN
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'Procurement data seeding completed successfully!';
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'Created:';
    RAISE NOTICE '✓ 7 Companies (vendors)';
    RAISE NOTICE '✓ 7 Prequalification records';
    RAISE NOTICE '✓ 4 RFPs and 4 Bids';
    RAISE NOTICE '✓ 5 Vendor submissions';
    RAISE NOTICE '✓ 4 Leveling records';
    RAISE NOTICE '✓ 4 Scorecards';
    RAISE NOTICE '✓ 1 Award';
    RAISE NOTICE '✓ Supporting data: Insurance, Safety';
    RAISE NOTICE '✓ Audit trail with bid events';
    RAISE NOTICE '✓ RFP scope items and timeline events';
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'Your procurement components should now display live data!';
    RAISE NOTICE '===============================================';
END $$;
