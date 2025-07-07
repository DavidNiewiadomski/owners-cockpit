-- Prequalification Seed Data
-- This script populates the prequalification tables with realistic test data

-- Insert Companies
INSERT INTO companies (id, company_name, company_type, address, city, state, zip_code, phone, email, website, primary_contact_name, primary_contact_title, primary_contact_email, primary_contact_phone, years_in_business, annual_revenue, employee_count, duns_number, tax_id, business_structure, created_at, updated_at) VALUES
('comp_001', 'Metropolitan Steel Works', 'contractor', '1234 Industrial Blvd', 'Chicago', 'IL', '60601', '(555) 123-4567', 'info@metrosteel.com', 'www.metropolitansteel.com', 'John Smith', 'Project Manager', 'j.smith@metrosteel.com', '(555) 123-4567', 28, 45000000, 145, '123456789', '12-3456789', 'Corporation', NOW(), NOW()),
('comp_002', 'Advanced MEP Solutions', 'subcontractor', '5678 Technology Dr', 'Denver', 'CO', '80202', '(555) 987-6543', 'contact@advancedmep.com', 'www.advancedmep.com', 'Sarah Johnson', 'Business Development Manager', 's.johnson@advancedmep.com', '(555) 987-6543', 15, 62000000, 89, '987654321', '98-7654321', 'LLC', NOW(), NOW()),
('comp_003', 'Premier Concrete Co.', 'supplier', '9101 Concrete Way', 'Phoenix', 'AZ', '85001', '(555) 456-7890', 'orders@premierconcrete.com', 'www.premierconcrete.com', 'Mike Rodriguez', 'Operations Manager', 'm.rodriguez@premierconcrete.com', '(555) 456-7890', 32, 38000000, 67, '456789123', '45-6789123', 'Partnership', NOW(), NOW()),
('comp_004', 'Glass Tech Systems', 'subcontractor', '2468 Glass Ave', 'Seattle', 'WA', '98101', '(555) 234-5678', 'info@glasstech.com', 'www.glasstechsystems.com', 'Lisa Chen', 'Project Director', 'l.chen@glasstech.com', '(555) 234-5678', 19, 24000000, 42, '789123456', '78-9123456', 'Corporation', NOW(), NOW()),
('comp_005', 'Apex Construction Services', 'contractor', '7890 Builder Rd', 'Austin', 'TX', '78701', '(555) 345-6789', 'contact@apexconstruction.com', 'www.apexconstruction.com', 'Robert Davis', 'Vice President', 'r.davis@apexconstruction.com', '(555) 345-6789', 22, 87000000, 234, '321654987', '32-1654987', 'Corporation', NOW(), NOW()),
('comp_006', 'Elite Roofing Systems', 'subcontractor', '3456 Roof Lane', 'Miami', 'FL', '33101', '(555) 567-8901', 'info@eliteroofing.com', 'www.eliteroofing.com', 'Maria Garcia', 'Operations Director', 'm.garcia@eliteroofing.com', '(555) 567-8901', 18, 19000000, 45, '654987321', '65-4987321', 'LLC', NOW(), NOW()),
('comp_007', 'Precision Electrical Contractors', 'subcontractor', '5432 Electric Blvd', 'Atlanta', 'GA', '30301', '(555) 678-9012', 'jobs@precisionelec.com', 'www.precisionelectrical.com', 'James Wilson', 'Chief Estimator', 'j.wilson@precisionelec.com', '(555) 678-9012', 25, 31000000, 78, '147258369', '14-7258369', 'Corporation', NOW(), NOW()),
('comp_008', 'Coastal Plumbing Solutions', 'subcontractor', '6789 Water St', 'San Diego', 'CA', '92101', '(555) 789-0123', 'service@coastalplumbing.com', 'www.coastalplumbing.com', 'Jennifer Lee', 'Project Manager', 'j.lee@coastalplumbing.com', '(555) 789-0123', 14, 16000000, 35, '258369147', '25-8369147', 'LLC', NOW(), NOW()),
('comp_009', 'Titan Excavation & Earthwork', 'subcontractor', '8901 Dirt Road', 'Las Vegas', 'NV', '89101', '(555) 890-1234', 'info@titanexcavation.com', 'www.titanexcavation.com', 'Michael Brown', 'Operations Manager', 'm.brown@titanexcavation.com', '(555) 890-1234', 20, 28000000, 56, '369147258', '36-9147258', 'Corporation', NOW(), NOW()),
('comp_010', 'Superior HVAC Technologies', 'subcontractor', '1357 Climate Ave', 'Portland', 'OR', '97201', '(555) 901-2345', 'info@superiorhvac.com', 'www.superiorhvac.com', 'David Kim', 'Technical Director', 'd.kim@superiorhvac.com', '(555) 901-2345', 16, 22000000, 48, '741852963', '74-1852963', 'LLC', NOW(), NOW());

-- Insert Prequalification Records
INSERT INTO prequalification_records (id, company_id, status, submission_date, review_date, expiry_date, prequalification_score, reviewer_id, reviewer_notes, specialty_trades, project_size_limit, bonding_capacity, is_mbe, is_wbe, is_vbe, is_sbe, created_at, updated_at) VALUES
('preq_001', 'comp_001', 'approved', '2024-01-15', '2024-01-22', '2025-01-22', 92, 'admin', 'Excellent track record in structural steel projects. Strong financial position and safety record.', ARRAY['Structural Steel', 'Steel Fabrication', 'Heavy Steel'], 50000000, 25000000, false, false, true, false, NOW(), NOW()),
('preq_002', 'comp_002', 'approved', '2024-02-10', '2024-02-18', '2025-02-18', 88, 'admin', 'Proven MEP capabilities with good project history. Some minor schedule concerns in past projects.', ARRAY['HVAC', 'Electrical', 'Plumbing', 'Fire Protection'], 35000000, 20000000, true, false, false, false, NOW(), NOW()),
('preq_003', 'comp_003', 'approved', '2024-01-30', '2024-02-05', '2025-02-05', 95, 'admin', 'Outstanding concrete supplier with excellent quality control and on-time delivery record.', ARRAY['Concrete Supply', 'Ready-Mix', 'Concrete Placement'], 15000000, 10000000, false, true, false, true, NOW(), NOW()),
('preq_004', 'comp_004', 'under_review', '2024-08-15', NULL, NULL, NULL, NULL, NULL, ARRAY['Curtain Wall', 'Glazing', 'Window Systems'], 12000000, 8000000, true, true, false, true, NOW(), NOW()),
('preq_005', 'comp_005', 'approved', '2023-12-01', '2023-12-10', '2024-12-10', 90, 'admin', 'Large general contractor with diverse project portfolio. Strong management team and resources.', ARRAY['General Construction', 'Design-Build', 'Construction Management'], 100000000, 50000000, false, false, false, false, NOW(), NOW()),
('preq_006', 'comp_006', 'pending', '2024-08-28', NULL, NULL, NULL, NULL, NULL, ARRAY['Roofing', 'Waterproofing', 'Sheet Metal'], 8000000, 5000000, false, false, false, true, NOW(), NOW()),
('preq_007', 'comp_007', 'approved', '2024-03-15', '2024-03-22', '2025-03-22', 87, 'admin', 'Solid electrical contractor with good safety record. Some minor financial concerns noted.', ARRAY['Electrical', 'Power Distribution', 'Lighting'], 15000000, 12000000, false, false, true, false, NOW(), NOW()),
('preq_008', 'comp_008', 'rejected', '2024-07-20', '2024-07-30', NULL, 65, 'admin', 'Insufficient bonding capacity and concerning project delays in recent history.', ARRAY['Plumbing', 'Fire Protection'], 5000000, 3000000, false, false, false, true, NOW(), NOW()),
('preq_009', 'comp_009', 'approved', '2024-04-10', '2024-04-18', '2025-04-18', 85, 'admin', 'Good excavation and earthwork capabilities. Safety record needs improvement.', ARRAY['Excavation', 'Earthwork', 'Site Utilities'], 18000000, 15000000, false, false, false, false, NOW(), NOW()),
('preq_010', 'comp_010', 'under_review', '2024-08-25', NULL, NULL, NULL, NULL, NULL, ARRAY['HVAC', 'Mechanical Systems', 'Controls'], 10000000, 8000000, false, false, false, true, NOW(), NOW());

-- Insert Insurance Certificates
INSERT INTO insurance_certificates (id, company_id, insurance_type, provider, policy_number, coverage_amount, effective_date, expiry_date, status, certificate_url, created_at, updated_at) VALUES
-- Metropolitan Steel Works
('ins_001', 'comp_001', 'general_liability', 'Travelers Insurance', 'GL-123456789', 5000000, '2024-01-01', '2025-01-01', 'active', 'https://example.com/cert1.pdf', NOW(), NOW()),
('ins_002', 'comp_001', 'professional_liability', 'Travelers Insurance', 'PL-123456789', 2000000, '2024-01-01', '2025-01-01', 'active', 'https://example.com/cert2.pdf', NOW(), NOW()),
('ins_003', 'comp_001', 'workers_compensation', 'Travelers Insurance', 'WC-123456789', 1000000, '2024-01-01', '2025-01-01', 'active', 'https://example.com/cert3.pdf', NOW(), NOW()),
('ins_004', 'comp_001', 'umbrella', 'Travelers Insurance', 'UM-123456789', 10000000, '2024-01-01', '2025-01-01', 'active', 'https://example.com/cert4.pdf', NOW(), NOW()),

-- Advanced MEP Solutions
('ins_005', 'comp_002', 'general_liability', 'Hartford Insurance', 'GL-987654321', 8000000, '2024-02-01', '2025-02-01', 'active', 'https://example.com/cert5.pdf', NOW(), NOW()),
('ins_006', 'comp_002', 'professional_liability', 'Hartford Insurance', 'PL-987654321', 5000000, '2024-02-01', '2025-02-01', 'active', 'https://example.com/cert6.pdf', NOW(), NOW()),
('ins_007', 'comp_002', 'workers_compensation', 'Hartford Insurance', 'WC-987654321', 1000000, '2024-02-01', '2025-02-01', 'active', 'https://example.com/cert7.pdf', NOW(), NOW()),

-- Premier Concrete Co.
('ins_008', 'comp_003', 'general_liability', 'Liberty Mutual', 'GL-456789123', 3000000, '2024-01-15', '2025-01-15', 'active', 'https://example.com/cert8.pdf', NOW(), NOW()),
('ins_009', 'comp_003', 'professional_liability', 'Liberty Mutual', 'PL-456789123', 1000000, '2024-01-15', '2025-01-15', 'active', 'https://example.com/cert9.pdf', NOW(), NOW()),
('ins_010', 'comp_003', 'workers_compensation', 'Liberty Mutual', 'WC-456789123', 1000000, '2024-01-15', '2025-01-15', 'active', 'https://example.com/cert10.pdf', NOW(), NOW()),

-- Glass Tech Systems
('ins_011', 'comp_004', 'general_liability', 'Zurich Insurance', 'GL-789123456', 4000000, '2024-08-01', '2025-08-01', 'active', 'https://example.com/cert11.pdf', NOW(), NOW()),
('ins_012', 'comp_004', 'professional_liability', 'Zurich Insurance', 'PL-789123456', 2000000, '2024-08-01', '2025-08-01', 'active', 'https://example.com/cert12.pdf', NOW(), NOW()),

-- Apex Construction Services
('ins_013', 'comp_005', 'general_liability', 'AIG Insurance', 'GL-321654987', 10000000, '2023-12-01', '2024-12-01', 'expiring', 'https://example.com/cert13.pdf', NOW(), NOW()),
('ins_014', 'comp_005', 'professional_liability', 'AIG Insurance', 'PL-321654987', 5000000, '2023-12-01', '2024-12-01', 'expiring', 'https://example.com/cert14.pdf', NOW(), NOW()),
('ins_015', 'comp_005', 'workers_compensation', 'AIG Insurance', 'WC-321654987', 2000000, '2023-12-01', '2024-12-01', 'expiring', 'https://example.com/cert15.pdf', NOW(), NOW()),

-- Elite Roofing Systems
('ins_016', 'comp_006', 'general_liability', 'State Farm', 'GL-654987321', 2000000, '2024-06-01', '2025-06-01', 'active', 'https://example.com/cert16.pdf', NOW(), NOW()),
('ins_017', 'comp_006', 'workers_compensation', 'State Farm', 'WC-654987321', 1000000, '2024-06-01', '2025-06-01', 'active', 'https://example.com/cert17.pdf', NOW(), NOW()),

-- Precision Electrical Contractors
('ins_018', 'comp_007', 'general_liability', 'Nationwide', 'GL-147258369', 4000000, '2024-03-01', '2025-03-01', 'active', 'https://example.com/cert18.pdf', NOW(), NOW()),
('ins_019', 'comp_007', 'professional_liability', 'Nationwide', 'PL-147258369', 2000000, '2024-03-01', '2025-03-01', 'active', 'https://example.com/cert19.pdf', NOW(), NOW()),
('ins_020', 'comp_007', 'workers_compensation', 'Nationwide', 'WC-147258369', 1000000, '2024-03-01', '2025-03-01', 'active', 'https://example.com/cert20.pdf', NOW(), NOW()),

-- Coastal Plumbing Solutions (rejected company - expired insurance)
('ins_021', 'comp_008', 'general_liability', 'Farmers Insurance', 'GL-258369147', 1000000, '2023-07-01', '2024-07-01', 'expired', 'https://example.com/cert21.pdf', NOW(), NOW()),

-- Titan Excavation & Earthwork
('ins_022', 'comp_009', 'general_liability', 'Progressive', 'GL-369147258', 3000000, '2024-04-01', '2025-04-01', 'active', 'https://example.com/cert22.pdf', NOW(), NOW()),
('ins_023', 'comp_009', 'workers_compensation', 'Progressive', 'WC-369147258', 1000000, '2024-04-01', '2025-04-01', 'active', 'https://example.com/cert23.pdf', NOW(), NOW()),

-- Superior HVAC Technologies
('ins_024', 'comp_010', 'general_liability', 'Allstate', 'GL-741852963', 2500000, '2024-08-01', '2025-08-01', 'active', 'https://example.com/cert24.pdf', NOW(), NOW()),
('ins_025', 'comp_010', 'workers_compensation', 'Allstate', 'WC-741852963', 1000000, '2024-08-01', '2025-08-01', 'active', 'https://example.com/cert25.pdf', NOW(), NOW());

-- Insert Financial Statements
INSERT INTO financial_statements (id, company_id, statement_year, revenue, assets, liabilities, equity, working_capital, debt_to_equity_ratio, current_ratio, statement_url, auditor_name, created_at, updated_at) VALUES
('fin_001', 'comp_001', 2023, 45000000, 35000000, 12000000, 23000000, 8500000, 0.52, 2.1, 'https://example.com/financial1.pdf', 'PwC', NOW(), NOW()),
('fin_002', 'comp_002', 2023, 62000000, 28000000, 15000000, 13000000, 6200000, 1.15, 1.8, 'https://example.com/financial2.pdf', 'Deloitte', NOW(), NOW()),
('fin_003', 'comp_003', 2023, 38000000, 22000000, 8000000, 14000000, 7500000, 0.57, 2.4, 'https://example.com/financial3.pdf', 'EY', NOW(), NOW()),
('fin_004', 'comp_004', 2023, 24000000, 18000000, 9000000, 9000000, 4200000, 1.0, 1.9, 'https://example.com/financial4.pdf', 'KPMG', NOW(), NOW()),
('fin_005', 'comp_005', 2023, 87000000, 65000000, 28000000, 37000000, 18500000, 0.76, 2.2, 'https://example.com/financial5.pdf', 'PwC', NOW(), NOW()),
('fin_006', 'comp_006', 2023, 19000000, 14000000, 7000000, 7000000, 3200000, 1.0, 1.7, 'https://example.com/financial6.pdf', 'BDO', NOW(), NOW()),
('fin_007', 'comp_007', 2023, 31000000, 20000000, 12000000, 8000000, 4500000, 1.5, 1.6, 'https://example.com/financial7.pdf', 'Grant Thornton', NOW(), NOW()),
('fin_008', 'comp_008', 2023, 16000000, 8000000, 6000000, 2000000, 1200000, 3.0, 1.2, 'https://example.com/financial8.pdf', 'Local CPA', NOW(), NOW()),
('fin_009', 'comp_009', 2023, 28000000, 25000000, 10000000, 15000000, 7800000, 0.67, 2.0, 'https://example.com/financial9.pdf', 'RSM', NOW(), NOW()),
('fin_010', 'comp_010', 2023, 22000000, 16000000, 8000000, 8000000, 4400000, 1.0, 1.8, 'https://example.com/financial10.pdf', 'CliftonLarsonAllen', NOW(), NOW());

-- Insert Project References (3 references per company)
INSERT INTO project_references (id, company_id, project_name, client_name, project_value, completion_date, project_type, reference_contact_name, reference_contact_phone, reference_contact_email, performance_rating, created_at, updated_at) VALUES
-- Metropolitan Steel Works references
('ref_001', 'comp_001', 'Downtown Tower Phase 1', 'City Development Corp', 12500000, '2023-11-15', 'High-rise Office Building', 'Tom Johnson', '(555) 111-1111', 't.johnson@citydev.com', 5, NOW(), NOW()),
('ref_002', 'comp_001', 'Medical Center Expansion', 'Regional Healthcare', 8200000, '2023-08-30', 'Healthcare Facility', 'Dr. Sarah Williams', '(555) 222-2222', 's.williams@regional.health', 4, NOW(), NOW()),
('ref_003', 'comp_001', 'Industrial Warehouse Complex', 'LogiCorp Industries', 6800000, '2024-02-20', 'Industrial/Warehouse', 'Mark Anderson', '(555) 333-3333', 'm.anderson@logicorp.com', 5, NOW(), NOW()),

-- Advanced MEP Solutions references
('ref_004', 'comp_002', 'University Science Building', 'State University', 15600000, '2023-12-10', 'Educational Facility', 'Prof. Lisa Chang', '(555) 444-4444', 'l.chang@stateuni.edu', 4, NOW(), NOW()),
('ref_005', 'comp_002', 'Luxury Hotel Project', 'Hospitality Group', 11200000, '2024-01-25', 'Hospitality', 'James Foster', '(555) 555-5555', 'j.foster@luxuryhotels.com', 4, NOW(), NOW()),
('ref_006', 'comp_002', 'Corporate Headquarters', 'TechCorp Inc', 18900000, '2024-03-15', 'Office Building', 'Amanda Rodriguez', '(555) 666-6666', 'a.rodriguez@techcorp.com', 3, NOW(), NOW()),

-- Premier Concrete Co. references
('ref_007', 'comp_003', 'Residential Complex Phase 2', 'Urban Living LLC', 4500000, '2024-01-30', 'Residential', 'Kevin Park', '(555) 777-7777', 'k.park@urbanliving.com', 5, NOW(), NOW()),
('ref_008', 'comp_003', 'Shopping Center Foundation', 'Retail Properties Inc', 3200000, '2023-10-15', 'Retail/Commercial', 'Diana Chen', '(555) 888-8888', 'd.chen@retailprop.com', 5, NOW(), NOW()),
('ref_009', 'comp_003', 'Bridge Infrastructure', 'Department of Transportation', 7800000, '2023-09-20', 'Infrastructure', 'Michael Davis', '(555) 999-9999', 'm.davis@dot.state.gov', 4, NOW(), NOW()),

-- Glass Tech Systems references
('ref_010', 'comp_004', 'Corporate Headquarters Facade', 'Global Finance Corp', 5400000, '2023-07-15', 'Office Building', 'Robert Kim', '(555) 101-0101', 'r.kim@globalfinance.com', 4, NOW(), NOW()),
('ref_011', 'comp_004', 'Hotel Curtain Wall', 'Premier Hotels', 3800000, '2023-12-20', 'Hospitality', 'Maria Santos', '(555) 202-0202', 'm.santos@premierhotels.com', 4, NOW(), NOW()),
('ref_012', 'comp_004', 'Retail Plaza Glazing', 'Shopping Centers LLC', 2900000, '2024-02-10', 'Retail/Commercial', 'Alex Petrov', '(555) 303-0303', 'a.petrov@shoppingcenters.com', 3, NOW(), NOW()),

-- Apex Construction Services references
('ref_013', 'comp_005', 'Mixed-Use Development', 'Urban Development Partners', 35000000, '2023-11-30', 'Mixed-Use', 'Jennifer Liu', '(555) 404-0404', 'j.liu@urbandev.com', 5, NOW(), NOW()),
('ref_014', 'comp_005', 'Government Office Building', 'Federal Services Administration', 28500000, '2023-08-15', 'Government', 'Thomas Wilson', '(555) 505-0505', 't.wilson@fsa.gov', 4, NOW(), NOW()),
('ref_015', 'comp_005', 'Research Facility', 'Biotech Research Institute', 42000000, '2024-01-20', 'Research/Laboratory', 'Dr. Elena Volkov', '(555) 606-0606', 'e.volkov@biotechri.org', 5, NOW(), NOW()),

-- Elite Roofing Systems references
('ref_016', 'comp_006', 'Warehouse Roofing Project', 'Distribution Centers Inc', 2200000, '2023-09-30', 'Industrial/Warehouse', 'Brian Thompson', '(555) 707-0707', 'b.thompson@distcenters.com', 4, NOW(), NOW()),
('ref_017', 'comp_006', 'School District Reroofing', 'Metropolitan School District', 1800000, '2023-06-15', 'Educational Facility', 'Carol Martinez', '(555) 808-0808', 'c.martinez@metroschools.edu', 5, NOW(), NOW()),
('ref_018', 'comp_006', 'Shopping Mall Roof Renovation', 'Retail Management Group', 3100000, '2024-03-25', 'Retail/Commercial', 'Daniel Lee', '(555) 909-0909', 'd.lee@retailmgmt.com', 4, NOW(), NOW()),

-- Precision Electrical Contractors references
('ref_019', 'comp_007', 'Data Center Electrical', 'Cloud Computing Corp', 8500000, '2023-10-20', 'Data Center', 'Susan Taylor', '(555) 010-1010', 's.taylor@cloudcomputing.com', 4, NOW(), NOW()),
('ref_020', 'comp_007', 'Manufacturing Plant Power', 'Industrial Manufacturing LLC', 6200000, '2023-12-05', 'Manufacturing', 'Paul Anderson', '(555) 121-2121', 'p.anderson@indmfg.com', 4, NOW(), NOW()),
('ref_021', 'comp_007', 'Hospital Electrical Systems', 'Metro Health Network', 9800000, '2024-02-28', 'Healthcare Facility', 'Dr. Rachel Green', '(555) 232-3232', 'r.green@metrohealth.org', 3, NOW(), NOW()),

-- Coastal Plumbing Solutions references (poor performance)
('ref_022', 'comp_008', 'Office Building Plumbing', 'Commercial Properties Inc', 1200000, '2023-05-15', 'Office Building', 'Gary Wilson', '(555) 343-4343', 'g.wilson@commercialprop.com', 2, NOW(), NOW()),
('ref_023', 'comp_008', 'Apartment Complex', 'Residential Developers', 900000, '2023-08-10', 'Residential', 'Linda Davis', '(555) 454-5454', 'l.davis@resdev.com', 2, NOW(), NOW()),
('ref_024', 'comp_008', 'Retail Store Plumbing', 'Chain Store Corp', 750000, '2024-01-05', 'Retail/Commercial', 'Steve Johnson', '(555) 565-6565', 's.johnson@chainstore.com', 1, NOW(), NOW()),

-- Titan Excavation & Earthwork references
('ref_025', 'comp_009', 'Highway Extension Project', 'State Highway Department', 12000000, '2023-11-10', 'Infrastructure', 'Margaret Brown', '(555) 676-7676', 'm.brown@highway.state.gov', 4, NOW(), NOW()),
('ref_026', 'comp_009', 'Subdivision Development', 'Residential Communities Inc', 5400000, '2023-09-25', 'Residential', 'John White', '(555) 787-8787', 'j.white@rescommunities.com', 4, NOW(), NOW()),
('ref_027', 'comp_009', 'Commercial Site Prep', 'Business Park Developers', 3800000, '2024-01-15', 'Commercial Site Work', 'Nancy Clark', '(555) 898-9898', 'n.clark@bizpark.com', 3, NOW(), NOW()),

-- Superior HVAC Technologies references
('ref_028', 'comp_010', 'Hospital HVAC System', 'Regional Medical Center', 4200000, '2023-10-30', 'Healthcare Facility', 'Dr. Frank Miller', '(555) 909-1010', 'f.miller@regionalmed.org', 4, NOW(), NOW()),
('ref_029', 'comp_010', 'Office Building Climate Control', 'Professional Tower LLC', 2800000, '2023-12-15', 'Office Building', 'Helen Garcia', '(555) 010-2020', 'h.garcia@proftower.com', 4, NOW(), NOW()),
('ref_030', 'comp_010', 'School HVAC Upgrade', 'City School District', 3600000, '2024-02-20', 'Educational Facility', 'Robert Jones', '(555) 121-3030', 'r.jones@cityschools.edu', 5, NOW(), NOW());

-- Insert Prequalification Scores
INSERT INTO prequalification_scores (id, prequalification_id, category, score, max_score, weight, comments, created_at, updated_at) VALUES
-- Metropolitan Steel Works scores (preq_001)
('score_001', 'preq_001', 'financial_strength', 45, 50, 0.25, 'Strong financial position with excellent liquidity ratios', NOW(), NOW()),
('score_002', 'preq_001', 'technical_capability', 38, 40, 0.20, 'Proven expertise in structural steel fabrication and installation', NOW(), NOW()),
('score_003', 'preq_001', 'project_experience', 28, 30, 0.20, 'Extensive experience with similar scale projects', NOW(), NOW()),
('score_004', 'preq_001', 'safety_record', 19, 20, 0.15, 'Excellent safety record with EMR below 1.0', NOW(), NOW()),
('score_005', 'preq_001', 'quality_performance', 18, 20, 0.10, 'High quality work with minimal punch list items', NOW(), NOW()),
('score_006', 'preq_001', 'schedule_performance', 9, 10, 0.10, 'Consistent on-time project delivery', NOW(), NOW()),

-- Advanced MEP Solutions scores (preq_002)
('score_007', 'preq_002', 'financial_strength', 40, 50, 0.25, 'Good financial health but some leverage concerns', NOW(), NOW()),
('score_008', 'preq_002', 'technical_capability', 36, 40, 0.20, 'Strong MEP capabilities across all disciplines', NOW(), NOW()),
('score_009', 'preq_002', 'project_experience', 26, 30, 0.20, 'Good project portfolio but limited large project experience', NOW(), NOW()),
('score_010', 'preq_002', 'safety_record', 17, 20, 0.15, 'Good safety record with room for improvement', NOW(), NOW()),
('score_011', 'preq_002', 'quality_performance', 17, 20, 0.10, 'Generally good quality with occasional issues', NOW(), NOW()),
('score_012', 'preq_002', 'schedule_performance', 8, 10, 0.10, 'Some minor schedule delays in recent projects', NOW(), NOW()),

-- Premier Concrete Co. scores (preq_003)
('score_013', 'preq_003', 'financial_strength', 47, 50, 0.25, 'Outstanding financial strength and stability', NOW(), NOW()),
('score_014', 'preq_003', 'technical_capability', 39, 40, 0.20, 'Excellent concrete expertise and quality control', NOW(), NOW()),
('score_015', 'preq_003', 'project_experience', 29, 30, 0.20, 'Extensive concrete supply and placement experience', NOW(), NOW()),
('score_016', 'preq_003', 'safety_record', 20, 20, 0.15, 'Perfect safety record with no incidents', NOW(), NOW()),
('score_017', 'preq_003', 'quality_performance', 19, 20, 0.10, 'Consistently high quality concrete work', NOW(), NOW()),
('score_018', 'preq_003', 'schedule_performance', 10, 10, 0.10, 'Always delivers on time', NOW(), NOW()),

-- Apex Construction Services scores (preq_005)
('score_019', 'preq_005', 'financial_strength', 43, 50, 0.25, 'Strong financial position for large contractor', NOW(), NOW()),
('score_020', 'preq_005', 'technical_capability', 37, 40, 0.20, 'Broad construction capabilities and expertise', NOW(), NOW()),
('score_021', 'preq_005', 'project_experience', 28, 30, 0.20, 'Extensive large project experience', NOW(), NOW()),
('score_022', 'preq_005', 'safety_record', 18, 20, 0.15, 'Good safety record for size of operations', NOW(), NOW()),
('score_023', 'preq_005', 'quality_performance', 18, 20, 0.10, 'Good quality standards maintained', NOW(), NOW()),
('score_024', 'preq_005', 'schedule_performance', 9, 10, 0.10, 'Generally meets schedule commitments', NOW(), NOW()),

-- Precision Electrical Contractors scores (preq_007)
('score_025', 'preq_007', 'financial_strength', 38, 50, 0.25, 'Adequate financial strength with some concerns', NOW(), NOW()),
('score_026', 'preq_007', 'technical_capability', 35, 40, 0.20, 'Good electrical expertise and capabilities', NOW(), NOW()),
('score_027', 'preq_007', 'project_experience', 25, 30, 0.20, 'Solid electrical project experience', NOW(), NOW()),
('score_028', 'preq_007', 'safety_record', 16, 20, 0.15, 'Average safety record needs improvement', NOW(), NOW()),
('score_029', 'preq_007', 'quality_performance', 16, 20, 0.10, 'Good quality work generally delivered', NOW(), NOW()),
('score_030', 'preq_007', 'schedule_performance', 8, 10, 0.10, 'Some schedule challenges on recent projects', NOW(), NOW()),

-- Coastal Plumbing Solutions scores (preq_008) - rejected
('score_031', 'preq_008', 'financial_strength', 25, 50, 0.25, 'Weak financial position with cash flow issues', NOW(), NOW()),
('score_032', 'preq_008', 'technical_capability', 28, 40, 0.20, 'Basic plumbing capabilities but limited scope', NOW(), NOW()),
('score_033', 'preq_008', 'project_experience', 18, 30, 0.20, 'Limited project experience on similar scale', NOW(), NOW()),
('score_034', 'preq_008', 'safety_record', 12, 20, 0.15, 'Poor safety record with multiple incidents', NOW(), NOW()),
('score_035', 'preq_008', 'quality_performance', 12, 20, 0.10, 'Quality issues and callbacks on recent work', NOW(), NOW()),
('score_036', 'preq_008', 'schedule_performance', 6, 10, 0.10, 'Consistent schedule delays and poor delivery', NOW(), NOW()),

-- Titan Excavation & Earthwork scores (preq_009)
('score_037', 'preq_009', 'financial_strength', 39, 50, 0.25, 'Good financial position for specialized contractor', NOW(), NOW()),
('score_038', 'preq_009', 'technical_capability', 34, 40, 0.20, 'Strong excavation and earthwork capabilities', NOW(), NOW()),
('score_039', 'preq_009', 'project_experience', 26, 30, 0.20, 'Good experience with similar excavation projects', NOW(), NOW()),
('score_040', 'preq_009', 'safety_record', 15, 20, 0.15, 'Safety record needs improvement for equipment operations', NOW(), NOW()),
('score_041', 'preq_009', 'quality_performance', 16, 20, 0.10, 'Generally good quality earthwork delivered', NOW(), NOW()),
('score_042', 'preq_009', 'schedule_performance', 8, 10, 0.10, 'Usually meets schedule commitments', NOW(), NOW());

-- Insert Document Uploads
INSERT INTO document_uploads (id, company_id, document_type, document_name, file_path, file_size, upload_date, status, uploaded_by, created_at, updated_at) VALUES
-- Metropolitan Steel Works documents
('doc_001', 'comp_001', 'business_license', 'IL_Business_License_2024.pdf', '/uploads/comp_001/business_license.pdf', 2456789, '2024-01-10', 'approved', 'admin', NOW(), NOW()),
('doc_002', 'comp_001', 'tax_clearance', 'IRS_Tax_Clearance_2024.pdf', '/uploads/comp_001/tax_clearance.pdf', 1234567, '2024-01-10', 'approved', 'admin', NOW(), NOW()),
('doc_003', 'comp_001', 'capability_statement', 'MetroSteel_Capabilities_2024.pdf', '/uploads/comp_001/capabilities.pdf', 5678901, '2024-01-12', 'approved', 'admin', NOW(), NOW()),
('doc_004', 'comp_001', 'safety_program', 'Safety_Program_Manual_2024.pdf', '/uploads/comp_001/safety_program.pdf', 8901234, '2024-01-12', 'approved', 'admin', NOW(), NOW()),

-- Advanced MEP Solutions documents
('doc_005', 'comp_002', 'business_license', 'CO_Business_License_2024.pdf', '/uploads/comp_002/business_license.pdf', 2345678, '2024-02-05', 'approved', 'admin', NOW(), NOW()),
('doc_006', 'comp_002', 'tax_clearance', 'CO_Tax_Clearance_2024.pdf', '/uploads/comp_002/tax_clearance.pdf', 1345679, '2024-02-05', 'approved', 'admin', NOW(), NOW()),
('doc_007', 'comp_002', 'capability_statement', 'AdvancedMEP_Capabilities_2024.pdf', '/uploads/comp_002/capabilities.pdf', 6789012, '2024-02-07', 'approved', 'admin', NOW(), NOW()),
('doc_008', 'comp_002', 'safety_program', 'MEP_Safety_Manual_2024.pdf', '/uploads/comp_002/safety_program.pdf', 7890123, '2024-02-07', 'approved', 'admin', NOW(), NOW()),

-- Premier Concrete Co. documents
('doc_009', 'comp_003', 'business_license', 'AZ_Business_License_2024.pdf', '/uploads/comp_003/business_license.pdf', 2567890, '2024-01-25', 'approved', 'admin', NOW(), NOW()),
('doc_010', 'comp_003', 'tax_clearance', 'AZ_Tax_Clearance_2024.pdf', '/uploads/comp_003/tax_clearance.pdf', 1456789, '2024-01-25', 'approved', 'admin', NOW(), NOW()),
('doc_011', 'comp_003', 'capability_statement', 'PremierConcrete_Capabilities_2024.pdf', '/uploads/comp_003/capabilities.pdf', 5890123, '2024-01-27', 'approved', 'admin', NOW(), NOW()),

-- Glass Tech Systems documents (under review)
('doc_012', 'comp_004', 'business_license', 'WA_Business_License_2024.pdf', '/uploads/comp_004/business_license.pdf', 2456780, '2024-08-10', 'under_review', 'admin', NOW(), NOW()),
('doc_013', 'comp_004', 'tax_clearance', 'WA_Tax_Clearance_2024.pdf', '/uploads/comp_004/tax_clearance.pdf', 1345670, '2024-08-10', 'under_review', 'admin', NOW(), NOW()),
('doc_014', 'comp_004', 'capability_statement', 'GlassTech_Capabilities_2024.pdf', '/uploads/comp_004/capabilities.pdf', 6789023, '2024-08-12', 'pending', 'admin', NOW(), NOW()),

-- Apex Construction Services documents
('doc_015', 'comp_005', 'business_license', 'TX_Business_License_2023.pdf', '/uploads/comp_005/business_license.pdf', 2678901, '2023-11-25', 'approved', 'admin', NOW(), NOW()),
('doc_016', 'comp_005', 'tax_clearance', 'TX_Tax_Clearance_2023.pdf', '/uploads/comp_005/tax_clearance.pdf', 1567890, '2023-11-25', 'approved', 'admin', NOW(), NOW()),
('doc_017', 'comp_005', 'capability_statement', 'Apex_Capabilities_2023.pdf', '/uploads/comp_005/capabilities.pdf', 7890134, '2023-11-27', 'approved', 'admin', NOW(), NOW()),
('doc_018', 'comp_005', 'safety_program', 'Apex_Safety_Program_2023.pdf', '/uploads/comp_005/safety_program.pdf', 9012345, '2023-11-27', 'approved', 'admin', NOW(), NOW()),

-- Elite Roofing Systems documents (pending)
('doc_019', 'comp_006', 'business_license', 'FL_Business_License_2024.pdf', '/uploads/comp_006/business_license.pdf', 2345671, '2024-08-25', 'pending', 'admin', NOW(), NOW()),
('doc_020', 'comp_006', 'capability_statement', 'EliteRoofing_Capabilities_2024.pdf', '/uploads/comp_006/capabilities.pdf', 5678912, '2024-08-25', 'pending', 'admin', NOW(), NOW()),

-- Precision Electrical Contractors documents
('doc_021', 'comp_007', 'business_license', 'GA_Business_License_2024.pdf', '/uploads/comp_007/business_license.pdf', 2456781, '2024-03-10', 'approved', 'admin', NOW(), NOW()),
('doc_022', 'comp_007', 'tax_clearance', 'GA_Tax_Clearance_2024.pdf', '/uploads/comp_007/tax_clearance.pdf', 1345681, '2024-03-10', 'approved', 'admin', NOW(), NOW()),
('doc_023', 'comp_007', 'capability_statement', 'Precision_Capabilities_2024.pdf', '/uploads/comp_007/capabilities.pdf', 6789034, '2024-03-12', 'approved', 'admin', NOW(), NOW()),

-- Coastal Plumbing Solutions documents (rejected)
('doc_024', 'comp_008', 'business_license', 'CA_Business_License_2024.pdf', '/uploads/comp_008/business_license.pdf', 2345682, '2024-07-15', 'rejected', 'admin', NOW(), NOW()),
('doc_025', 'comp_008', 'capability_statement', 'Coastal_Capabilities_2024.pdf', '/uploads/comp_008/capabilities.pdf', 4567823, '2024-07-15', 'rejected', 'admin', NOW(), NOW()),

-- Titan Excavation & Earthwork documents
('doc_026', 'comp_009', 'business_license', 'NV_Business_License_2024.pdf', '/uploads/comp_009/business_license.pdf', 2567891, '2024-04-05', 'approved', 'admin', NOW(), NOW()),
('doc_027', 'comp_009', 'tax_clearance', 'NV_Tax_Clearance_2024.pdf', '/uploads/comp_009/tax_clearance.pdf', 1456791, '2024-04-05', 'approved', 'admin', NOW(), NOW()),
('doc_028', 'comp_009', 'capability_statement', 'Titan_Capabilities_2024.pdf', '/uploads/comp_009/capabilities.pdf', 5890134, '2024-04-07', 'approved', 'admin', NOW(), NOW()),

-- Superior HVAC Technologies documents (under review)
('doc_029', 'comp_010', 'business_license', 'OR_Business_License_2024.pdf', '/uploads/comp_010/business_license.pdf', 2456792, '2024-08-20', 'under_review', 'admin', NOW(), NOW()),
('doc_030', 'comp_010', 'capability_statement', 'Superior_Capabilities_2024.pdf', '/uploads/comp_010/capabilities.pdf', 6789045, '2024-08-20', 'under_review', 'admin', NOW(), NOW());
