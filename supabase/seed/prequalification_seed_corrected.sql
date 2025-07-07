-- Corrected Prequalification Seed Data
-- This script populates the prequalification tables with realistic test data

-- Insert Companies (using correct column names)
INSERT INTO companies (id, name, company_type, address_line1, city, state, zip_code, phone, email, website, primary_contact_name, primary_contact_title, primary_contact_email, primary_contact_phone, years_in_business, annual_revenue, employee_count, duns_number, tax_id, bonding_capacity, specialty_codes, created_at, updated_at) VALUES
('comp_001', 'Metropolitan Steel Works', 'contractor', '1234 Industrial Blvd', 'Chicago', 'IL', '60601', '(555) 123-4567', 'info@metrosteel.com', 'www.metropolitansteel.com', 'John Smith', 'Project Manager', 'j.smith@metrosteel.com', '(555) 123-4567', 28, 45000000, 145, '123456789', '12-3456789', 25000000, ARRAY['05 31 00', '05 21 00'], NOW(), NOW()),
('comp_002', 'Advanced MEP Solutions', 'subcontractor', '5678 Technology Dr', 'Denver', 'CO', '80202', '(555) 987-6543', 'contact@advancedmep.com', 'www.advancedmep.com', 'Sarah Johnson', 'Business Development Manager', 's.johnson@advancedmep.com', '(555) 987-6543', 15, 62000000, 89, '987654321', '98-7654321', 20000000, ARRAY['23 00 00', '26 00 00', '21 00 00'], NOW(), NOW()),
('comp_003', 'Premier Concrete Co.', 'supplier', '9101 Concrete Way', 'Phoenix', 'AZ', '85001', '(555) 456-7890', 'orders@premierconcrete.com', 'www.premierconcrete.com', 'Mike Rodriguez', 'Operations Manager', 'm.rodriguez@premierconcrete.com', '(555) 456-7890', 32, 38000000, 67, '456789123', '45-6789123', 10000000, ARRAY['03 30 00'], NOW(), NOW()),
('comp_004', 'Glass Tech Systems', 'subcontractor', '2468 Glass Ave', 'Seattle', 'WA', '98101', '(555) 234-5678', 'info@glasstech.com', 'www.glasstechsystems.com', 'Lisa Chen', 'Project Director', 'l.chen@glasstech.com', '(555) 234-5678', 19, 24000000, 42, '789123456', '78-9123456', 8000000, ARRAY['08 40 00', '08 41 00'], NOW(), NOW()),
('comp_005', 'Apex Construction Services', 'contractor', '7890 Builder Rd', 'Austin', 'TX', '78701', '(555) 345-6789', 'contact@apexconstruction.com', 'www.apexconstruction.com', 'Robert Davis', 'Vice President', 'r.davis@apexconstruction.com', '(555) 345-6789', 22, 87000000, 234, '321654987', '32-1654987', 50000000, ARRAY['01 00 00'], NOW(), NOW()),
('comp_006', 'Elite Roofing Systems', 'subcontractor', '3456 Roof Lane', 'Miami', 'FL', '33101', '(555) 567-8901', 'info@eliteroofing.com', 'www.eliteroofing.com', 'Maria Garcia', 'Operations Director', 'm.garcia@eliteroofing.com', '(555) 567-8901', 18, 19000000, 45, '654987321', '65-4987321', 5000000, ARRAY['07 60 00', '07 70 00'], NOW(), NOW()),
('comp_007', 'Precision Electrical Contractors', 'subcontractor', '5432 Electric Blvd', 'Atlanta', 'GA', '30301', '(555) 678-9012', 'jobs@precisionelec.com', 'www.precisionelectrical.com', 'James Wilson', 'Chief Estimator', 'j.wilson@precisionelec.com', '(555) 678-9012', 25, 31000000, 78, '147258369', '14-7258369', 12000000, ARRAY['26 00 00'], NOW(), NOW()),
('comp_008', 'Coastal Plumbing Solutions', 'subcontractor', '6789 Water St', 'San Diego', 'CA', '92101', '(555) 789-0123', 'service@coastalplumbing.com', 'www.coastalplumbing.com', 'Jennifer Lee', 'Project Manager', 'j.lee@coastalplumbing.com', '(555) 789-0123', 14, 16000000, 35, '258369147', '25-8369147', 3000000, ARRAY['22 00 00'], NOW(), NOW()),
('comp_009', 'Titan Excavation & Earthwork', 'subcontractor', '8901 Dirt Road', 'Las Vegas', 'NV', '89101', '(555) 890-1234', 'info@titanexcavation.com', 'www.titanexcavation.com', 'Michael Brown', 'Operations Manager', 'm.brown@titanexcavation.com', '(555) 890-1234', 20, 28000000, 56, '369147258', '36-9147258', 15000000, ARRAY['31 00 00'], NOW(), NOW()),
('comp_010', 'Superior HVAC Technologies', 'subcontractor', '1357 Climate Ave', 'Portland', 'OR', '97201', '(555) 901-2345', 'info@superiorhvac.com', 'www.superiorhvac.com', 'David Kim', 'Technical Director', 'd.kim@superiorhvac.com', '(555) 901-2345', 16, 22000000, 48, '741852963', '74-1852963', 8000000, ARRAY['23 00 00'], NOW(), NOW());

-- Insert Prequalification Records (using prequal table)
INSERT INTO prequal (id, company_id, status, expiry_date, submitted_at, reviewed_at, reviewed_by, review_notes, score, renewal_required_at, requested_trades, project_size_limit, contact_name, contact_title, contact_email, contact_phone, created_at, updated_at) VALUES
('preq_001', 'comp_001', 'approved', '2025-01-22', '2024-01-15 10:00:00+00', '2024-01-22 14:30:00+00', 'admin', 'Excellent track record in structural steel projects. Strong financial position and safety record.', 92, '2024-12-22', ARRAY['Structural Steel', 'Steel Fabrication', 'Heavy Steel'], 50000000, 'John Smith', 'Project Manager', 'j.smith@metrosteel.com', '(555) 123-4567', NOW(), NOW()),
('preq_002', 'comp_002', 'approved', '2025-02-18', '2024-02-10 09:30:00+00', '2024-02-18 16:15:00+00', 'admin', 'Proven MEP capabilities with good project history. Some minor schedule concerns in past projects.', 88, '2024-01-18', ARRAY['HVAC', 'Electrical', 'Plumbing', 'Fire Protection'], 35000000, 'Sarah Johnson', 'Business Development Manager', 's.johnson@advancedmep.com', '(555) 987-6543', NOW(), NOW()),
('preq_003', 'comp_003', 'approved', '2025-02-05', '2024-01-30 11:00:00+00', '2024-02-05 13:45:00+00', 'admin', 'Outstanding concrete supplier with excellent quality control and on-time delivery record.', 95, '2025-01-05', ARRAY['Concrete Supply', 'Ready-Mix', 'Concrete Placement'], 15000000, 'Mike Rodriguez', 'Operations Manager', 'm.rodriguez@premierconcrete.com', '(555) 456-7890', NOW(), NOW()),
('preq_004', 'comp_004', 'pending', NULL, '2024-08-15 14:20:00+00', NULL, NULL, NULL, NULL, NULL, ARRAY['Curtain Wall', 'Glazing', 'Window Systems'], 12000000, 'Lisa Chen', 'Project Director', 'l.chen@glasstech.com', '(555) 234-5678', NOW(), NOW()),
('preq_005', 'comp_005', 'approved', '2024-12-10', '2023-12-01 08:45:00+00', '2023-12-10 17:00:00+00', 'admin', 'Large general contractor with diverse project portfolio. Strong management team and resources.', 90, '2024-11-10', ARRAY['General Construction', 'Design-Build', 'Construction Management'], 100000000, 'Robert Davis', 'Vice President', 'r.davis@apexconstruction.com', '(555) 345-6789', NOW(), NOW()),
('preq_006', 'comp_006', 'pending', NULL, '2024-08-28 15:30:00+00', NULL, NULL, NULL, NULL, NULL, ARRAY['Roofing', 'Waterproofing', 'Sheet Metal'], 8000000, 'Maria Garcia', 'Operations Director', 'm.garcia@eliteroofing.com', '(555) 567-8901', NOW(), NOW()),
('preq_007', 'comp_007', 'approved', '2025-03-22', '2024-03-15 12:15:00+00', '2024-03-22 15:30:00+00', 'admin', 'Solid electrical contractor with good safety record. Some minor financial concerns noted.', 87, '2025-02-22', ARRAY['Electrical', 'Power Distribution', 'Lighting'], 15000000, 'James Wilson', 'Chief Estimator', 'j.wilson@precisionelec.com', '(555) 678-9012', NOW(), NOW()),
('preq_008', 'comp_008', 'rejected', NULL, '2024-07-20 13:45:00+00', '2024-07-30 16:20:00+00', 'admin', 'Insufficient bonding capacity and concerning project delays in recent history.', 65, NULL, ARRAY['Plumbing', 'Fire Protection'], 5000000, 'Jennifer Lee', 'Project Manager', 'j.lee@coastalplumbing.com', '(555) 789-0123', NOW(), NOW()),
('preq_009', 'comp_009', 'approved', '2025-04-18', '2024-04-10 10:30:00+00', '2024-04-18 14:45:00+00', 'admin', 'Good excavation and earthwork capabilities. Safety record needs improvement.', 85, '2025-03-18', ARRAY['Excavation', 'Earthwork', 'Site Utilities'], 18000000, 'Michael Brown', 'Operations Manager', 'm.brown@titanexcavation.com', '(555) 890-1234', NOW(), NOW()),
('preq_010', 'comp_010', 'pending', NULL, '2024-08-25 16:00:00+00', NULL, NULL, NULL, NULL, NULL, ARRAY['HVAC', 'Mechanical Systems', 'Controls'], 10000000, 'David Kim', 'Technical Director', 'd.kim@superiorhvac.com', '(555) 901-2345', NOW(), NOW());

-- Insert Project References (using project_reference table)
INSERT INTO project_reference (id, company_id, project_name, project_description, client_name, client_contact_name, client_contact_phone, client_contact_email, project_value, contract_start_date, contract_end_date, actual_completion_date, project_location, project_type, trade_categories, completed_on_time, completed_on_budget, final_change_order_percentage, quality_rating, safety_incidents, reference_checked, reference_checked_at, reference_checked_by, reference_response, reference_rating, created_at, updated_at) VALUES
-- Metropolitan Steel Works references
('ref_001', 'comp_001', 'Downtown Tower Phase 1', 'Structural steel fabrication and erection for 40-story office tower', 'City Development Corp', 'Tom Johnson', '(555) 111-1111', 't.johnson@citydev.com', 12500000, '2023-06-01', '2023-11-01', '2023-11-15', 'Chicago, IL', 'High-rise Office Building', ARRAY['Structural Steel'], true, true, 2.5, 5, 0, true, '2024-01-20 09:00:00+00', 'admin', 'Excellent performance, delivered on time and budget with superior quality.', 5, NOW(), NOW()),
('ref_002', 'comp_001', 'Medical Center Expansion', 'Steel framework for hospital expansion project', 'Regional Healthcare', 'Dr. Sarah Williams', '(555) 222-2222', 's.williams@regional.health', 8200000, '2023-03-15', '2023-08-15', '2023-08-30', 'Chicago, IL', 'Healthcare Facility', ARRAY['Structural Steel'], false, true, 1.8, 4, 1, true, '2024-01-20 10:30:00+00', 'admin', 'Good quality work, minor delay due to material delivery issues.', 4, NOW(), NOW()),
('ref_003', 'comp_001', 'Industrial Warehouse Complex', 'Pre-engineered steel building systems for logistics facility', 'LogiCorp Industries', 'Mark Anderson', '(555) 333-3333', 'm.anderson@logicorp.com', 6800000, '2023-10-01', '2024-02-01', '2024-02-20', 'Joliet, IL', 'Industrial/Warehouse', ARRAY['Structural Steel'], false, true, 3.2, 5, 0, true, '2024-03-01 14:15:00+00', 'admin', 'Outstanding work quality, slight delay due to weather conditions.', 5, NOW(), NOW()),

-- Advanced MEP Solutions references
('ref_004', 'comp_002', 'University Science Building', 'Complete MEP systems for new research facility', 'State University', 'Prof. Lisa Chang', '(555) 444-4444', 'l.chang@stateuni.edu', 15600000, '2023-04-01', '2023-12-01', '2023-12-10', 'Denver, CO', 'Educational Facility', ARRAY['HVAC', 'Electrical', 'Plumbing'], true, false, 4.5, 4, 2, true, '2024-02-15 11:00:00+00', 'admin', 'Good technical execution, some cost overruns in electrical scope.', 4, NOW(), NOW()),
('ref_005', 'comp_002', 'Luxury Hotel Project', 'High-end HVAC and electrical systems for boutique hotel', 'Hospitality Group', 'James Foster', '(555) 555-5555', 'j.foster@luxuryhotels.com', 11200000, '2023-08-01', '2024-01-15', '2024-01-25', 'Aspen, CO', 'Hospitality', ARRAY['HVAC', 'Electrical'], true, true, 2.1, 4, 0, true, '2024-02-28 13:30:00+00', 'admin', 'Professional execution with attention to detail and quality.', 4, NOW(), NOW()),
('ref_006', 'comp_002', 'Corporate Headquarters', 'Advanced building automation and MEP systems', 'TechCorp Inc', 'Amanda Rodriguez', '(555) 666-6666', 'a.rodriguez@techcorp.com', 18900000, '2023-09-01', '2024-03-01', '2024-03-15', 'Boulder, CO', 'Office Building', ARRAY['HVAC', 'Electrical', 'Controls'], false, false, 6.8, 3, 1, true, '2024-04-10 15:45:00+00', 'admin', 'Technical challenges led to delays and cost increases.', 3, NOW(), NOW()),

-- Premier Concrete Co. references
('ref_007', 'comp_003', 'Residential Complex Phase 2', 'Concrete supply and placement for 200-unit apartment complex', 'Urban Living LLC', 'Kevin Park', '(555) 777-7777', 'k.park@urbanliving.com', 4500000, '2023-10-01', '2024-01-15', '2024-01-30', 'Phoenix, AZ', 'Residential', ARRAY['Concrete'], true, true, 1.2, 5, 0, true, '2024-02-15 09:30:00+00', 'admin', 'Exceptional quality and reliability, delivered ahead of schedule.', 5, NOW(), NOW()),
('ref_008', 'comp_003', 'Shopping Center Foundation', 'Foundation and structural concrete work for retail development', 'Retail Properties Inc', 'Diana Chen', '(555) 888-8888', 'd.chen@retailprop.com', 3200000, '2023-07-01', '2023-10-01', '2023-10-15', 'Scottsdale, AZ', 'Retail/Commercial', ARRAY['Concrete'], true, true, 0.8, 5, 0, true, '2024-01-20 16:00:00+00', 'admin', 'Perfect execution with zero defects and early completion.', 5, NOW(), NOW()),
('ref_009', 'comp_003', 'Bridge Infrastructure', 'Specialized concrete work for highway bridge construction', 'Department of Transportation', 'Michael Davis', '(555) 999-9999', 'm.davis@dot.state.gov', 7800000, '2023-04-01', '2023-09-01', '2023-09-20', 'Flagstaff, AZ', 'Infrastructure', ARRAY['Concrete'], false, true, 2.3, 4, 0, true, '2024-01-25 12:20:00+00', 'admin', 'Good quality work with minor weather-related delays.', 4, NOW(), NOW());

-- Insert Sample Financial Statements
INSERT INTO financial_statement (id, company_id, statement_year, revenue, net_income, total_assets, total_liabilities, working_capital, debt_to_equity_ratio, current_ratio, auditor_name, auditor_opinion, statement_date, created_at, updated_at) VALUES
('fin_001', 'comp_001', 2023, 45000000, 3600000, 35000000, 12000000, 8500000, 0.52, 2.1, 'PwC', 'unqualified', '2024-03-31', NOW(), NOW()),
('fin_002', 'comp_002', 2023, 62000000, 4340000, 28000000, 15000000, 6200000, 1.15, 1.8, 'Deloitte', 'unqualified', '2024-03-31', NOW(), NOW()),
('fin_003', 'comp_003', 2023, 38000000, 4560000, 22000000, 8000000, 7500000, 0.57, 2.4, 'EY', 'unqualified', '2024-03-31', NOW(), NOW()),
('fin_004', 'comp_004', 2023, 24000000, 1440000, 18000000, 9000000, 4200000, 1.0, 1.9, 'KPMG', 'unqualified', '2024-03-31', NOW(), NOW()),
('fin_005', 'comp_005', 2023, 87000000, 6090000, 65000000, 28000000, 18500000, 0.76, 2.2, 'PwC', 'unqualified', '2024-03-31', NOW(), NOW()),
('fin_006', 'comp_006', 2023, 19000000, 1330000, 14000000, 7000000, 3200000, 1.0, 1.7, 'BDO', 'unqualified', '2024-03-31', NOW(), NOW()),
('fin_007', 'comp_007', 2023, 31000000, 1550000, 20000000, 12000000, 4500000, 1.5, 1.6, 'Grant Thornton', 'qualified', '2024-03-31', NOW(), NOW()),
('fin_008', 'comp_008', 2023, 16000000, 320000, 8000000, 6000000, 1200000, 3.0, 1.2, 'Local CPA', 'qualified', '2024-03-31', NOW(), NOW()),
('fin_009', 'comp_009', 2023, 28000000, 2240000, 25000000, 10000000, 7800000, 0.67, 2.0, 'RSM', 'unqualified', '2024-03-31', NOW(), NOW()),
('fin_010', 'comp_010', 2023, 22000000, 1540000, 16000000, 8000000, 4400000, 1.0, 1.8, 'CliftonLarsonAllen', 'unqualified', '2024-03-31', NOW(), NOW());

-- Insert Sample Insurance Certificates
INSERT INTO insurance_certificate (id, prequal_id, insurance_type, provider_name, policy_number, coverage_amount, deductible, effective_date, expiry_date, certificate_url, is_verified, verified_at, verified_by, created_at, updated_at) VALUES
-- Metropolitan Steel Works
('ins_001', 'preq_001', 'general_liability', 'Travelers Insurance', 'GL-123456789', 5000000, 25000, '2024-01-01', '2025-01-01', 'https://example.com/cert1.pdf', true, '2024-01-15 10:00:00+00', 'admin', NOW(), NOW()),
('ins_002', 'preq_001', 'professional_liability', 'Travelers Insurance', 'PL-123456789', 2000000, 50000, '2024-01-01', '2025-01-01', 'https://example.com/cert2.pdf', true, '2024-01-15 10:00:00+00', 'admin', NOW(), NOW()),
('ins_003', 'preq_001', 'workers_compensation', 'Travelers Insurance', 'WC-123456789', 1000000, 0, '2024-01-01', '2025-01-01', 'https://example.com/cert3.pdf', true, '2024-01-15 10:00:00+00', 'admin', NOW(), NOW()),
('ins_004', 'preq_001', 'umbrella', 'Travelers Insurance', 'UM-123456789', 10000000, 0, '2024-01-01', '2025-01-01', 'https://example.com/cert4.pdf', true, '2024-01-15 10:00:00+00', 'admin', NOW(), NOW()),

-- Advanced MEP Solutions
('ins_005', 'preq_002', 'general_liability', 'Hartford Insurance', 'GL-987654321', 8000000, 25000, '2024-02-01', '2025-02-01', 'https://example.com/cert5.pdf', true, '2024-02-10 09:30:00+00', 'admin', NOW(), NOW()),
('ins_006', 'preq_002', 'professional_liability', 'Hartford Insurance', 'PL-987654321', 5000000, 50000, '2024-02-01', '2025-02-01', 'https://example.com/cert6.pdf', true, '2024-02-10 09:30:00+00', 'admin', NOW(), NOW()),
('ins_007', 'preq_002', 'workers_compensation', 'Hartford Insurance', 'WC-987654321', 1000000, 0, '2024-02-01', '2025-02-01', 'https://example.com/cert7.pdf', true, '2024-02-10 09:30:00+00', 'admin', NOW(), NOW()),

-- Premier Concrete Co.
('ins_008', 'preq_003', 'general_liability', 'Liberty Mutual', 'GL-456789123', 3000000, 25000, '2024-01-15', '2025-01-15', 'https://example.com/cert8.pdf', true, '2024-01-30 11:00:00+00', 'admin', NOW(), NOW()),
('ins_009', 'preq_003', 'professional_liability', 'Liberty Mutual', 'PL-456789123', 1000000, 50000, '2024-01-15', '2025-01-15', 'https://example.com/cert9.pdf', true, '2024-01-30 11:00:00+00', 'admin', NOW(), NOW()),
('ins_010', 'preq_003', 'workers_compensation', 'Liberty Mutual', 'WC-456789123', 1000000, 0, '2024-01-15', '2025-01-15', 'https://example.com/cert10.pdf', true, '2024-01-30 11:00:00+00', 'admin', NOW(), NOW());

-- Insert Bonding Capacity records
INSERT INTO bonding_capacity (id, company_id, surety_company, aggregate_limit, single_project_limit, available_capacity, emr_rate, bond_rate_percentage, last_updated, verified_at, verified_by, created_at, updated_at) VALUES
('bond_001', 'comp_001', 'Travelers Surety', 50000000, 25000000, 22000000, 0.85, 1.2, '2024-01-15', '2024-01-15 10:00:00+00', 'admin', NOW(), NOW()),
('bond_002', 'comp_002', 'Hartford Surety', 30000000, 20000000, 18000000, 0.92, 1.5, '2024-02-10', '2024-02-10 09:30:00+00', 'admin', NOW(), NOW()),
('bond_003', 'comp_003', 'Liberty Mutual Surety', 15000000, 10000000, 12000000, 0.78, 1.0, '2024-01-30', '2024-01-30 11:00:00+00', 'admin', NOW(), NOW()),
('bond_004', 'comp_004', 'Zurich Surety', 12000000, 8000000, 8000000, 1.05, 1.8, '2024-08-15', NULL, NULL, NOW(), NOW()),
('bond_005', 'comp_005', 'Travelers Surety', 75000000, 50000000, 45000000, 0.88, 1.1, '2023-12-01', '2023-12-01 08:45:00+00', 'admin', NOW(), NOW()),
('bond_006', 'comp_006', 'State Farm Surety', 8000000, 5000000, 5000000, 1.15, 2.0, '2024-08-28', NULL, NULL, NOW(), NOW()),
('bond_007', 'comp_007', 'Nationwide Surety', 18000000, 12000000, 10000000, 0.95, 1.6, '2024-03-15', '2024-03-15 12:15:00+00', 'admin', NOW(), NOW()),
('bond_008', 'comp_008', 'Farmers Surety', 5000000, 3000000, 1000000, 1.45, 2.5, '2024-07-20', '2024-07-20 13:45:00+00', 'admin', NOW(), NOW()),
('bond_009', 'comp_009', 'Progressive Surety', 22000000, 15000000, 12000000, 1.08, 1.7, '2024-04-10', '2024-04-10 10:30:00+00', 'admin', NOW(), NOW()),
('bond_010', 'comp_010', 'Allstate Surety', 12000000, 8000000, 8000000, 1.02, 1.9, '2024-08-25', NULL, NULL, NOW(), NOW());

-- Insert Safety Metrics
INSERT INTO safety_metric (id, company_id, metric_year, total_work_hours, recordable_incidents, lost_time_incidents, fatalities, emr_rate, dart_rate, trir_rate, osha_citations, safety_program_score, last_updated, created_at, updated_at) VALUES
('safety_001', 'comp_001', 2023, 285000, 2, 0, 0, 0.85, 0.0, 1.4, 0, 95, '2024-01-15', NOW(), NOW()),
('safety_002', 'comp_002', 2023, 175000, 3, 1, 0, 0.92, 1.1, 3.4, 1, 88, '2024-02-10', NOW(), NOW()),
('safety_003', 'comp_003', 2023, 131000, 1, 0, 0, 0.78, 0.0, 1.5, 0, 98, '2024-01-30', NOW(), NOW()),
('safety_004', 'comp_004', 2023, 82000, 2, 1, 0, 1.05, 2.4, 4.9, 0, 85, '2024-08-15', NOW(), NOW()),
('safety_005', 'comp_005', 2023, 460000, 8, 2, 0, 0.88, 0.9, 3.5, 1, 92, '2023-12-01', NOW(), NOW()),
('safety_006', 'comp_006', 2023, 88000, 3, 1, 0, 1.15, 2.3, 6.8, 2, 78, '2024-08-28', NOW(), NOW()),
('safety_007', 'comp_007', 2023, 153000, 3, 0, 0, 0.95, 0.0, 3.9, 1, 89, '2024-03-15', NOW(), NOW()),
('safety_008', 'comp_008', 2023, 69000, 5, 2, 0, 1.45, 5.8, 14.5, 3, 65, '2024-07-20', NOW(), NOW()),
('safety_009', 'comp_009', 2023, 110000, 4, 1, 0, 1.08, 1.8, 7.3, 1, 82, '2024-04-10', NOW(), NOW()),
('safety_010', 'comp_010', 2023, 94000, 2, 0, 0, 1.02, 0.0, 4.3, 0, 87, '2024-08-25', NOW(), NOW());
