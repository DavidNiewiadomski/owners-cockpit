-- Comprehensive Legal & Insurance Seed Data
-- This script populates all legal and insurance tables with realistic data

-- Get project IDs for reference
-- Using the known project IDs from previous sessions

-- Insurance Policies Data
INSERT INTO insurance_policies (project_id, policy_type, policy_number, insurance_company, policy_holder, coverage_amount, deductible, premium_amount, effective_date, expiration_date, status, certificate_provided, auto_renewal, notes) VALUES
-- Downtown Commercial Tower
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'general_liability', 'GL-2024-0001', 'Zurich North America', 'Downtown Development LLC', 2000000.00, 10000.00, 45000.00, '2024-01-01', '2024-12-31', 'active', true, true, 'Standard commercial general liability coverage'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'workers_comp', 'WC-2024-0001', 'Travelers Insurance', 'Downtown Development LLC', 1000000.00, 0.00, 85000.00, '2024-01-01', '2024-12-31', 'active', true, true, 'Workers compensation for construction crew'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'builders_risk', 'BR-2024-0001', 'Liberty Mutual', 'Downtown Development LLC', 50000000.00, 25000.00, 125000.00, '2024-01-01', '2024-12-31', 'active', true, false, 'Builders risk for construction phase'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'professional', 'PI-2024-0001', 'AIG', 'Downtown Development LLC', 5000000.00, 50000.00, 35000.00, '2024-01-01', '2024-12-31', 'active', true, true, 'Professional indemnity coverage'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'umbrella', 'UM-2024-0001', 'Chubb', 'Downtown Development LLC', 10000000.00, 0.00, 65000.00, '2024-01-01', '2024-12-31', 'active', true, true, 'Umbrella policy for excess coverage'),

-- Luxury Residential Complex
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'general_liability', 'GL-2024-0002', 'Hartford Insurance', 'Luxury Living Corp', 3000000.00, 15000.00, 52000.00, '2024-02-01', '2025-01-31', 'active', true, true, 'Enhanced GL coverage for luxury development'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'workers_comp', 'WC-2024-0002', 'State Fund Insurance', 'Luxury Living Corp', 1500000.00, 0.00, 95000.00, '2024-02-01', '2025-01-31', 'active', true, true, 'Comprehensive workers compensation'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'property', 'PR-2024-0002', 'Firemans Fund', 'Luxury Living Corp', 75000000.00, 100000.00, 185000.00, '2024-02-01', '2025-01-31', 'active', true, false, 'Property insurance for completed units'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'builders_risk', 'BR-2024-0002', 'Zurich North America', 'Luxury Living Corp', 80000000.00, 50000.00, 145000.00, '2024-02-01', '2025-01-31', 'active', true, false, 'Builders risk for luxury construction'),

-- Mixed-Use Development
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'general_liability', 'GL-2024-0003', 'Cincinnati Insurance', 'Urban Mixed LLC', 2500000.00, 12500.00, 48000.00, '2024-03-01', '2025-02-28', 'active', true, true, 'Mixed-use development coverage'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'workers_comp', 'WC-2024-0003', 'Travelers Insurance', 'Urban Mixed LLC', 1200000.00, 0.00, 78000.00, '2024-03-01', '2025-02-28', 'active', true, true, 'Standard workers compensation'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'environmental', 'EN-2024-0003', 'AIG Environmental', 'Urban Mixed LLC', 10000000.00, 25000.00, 42000.00, '2024-03-01', '2025-02-28', 'active', true, false, 'Environmental liability coverage');

-- Insurance Claims Data
INSERT INTO insurance_claims (project_id, claim_number, claim_type, incident_date, reported_date, claim_amount, settled_amount, status, description, adjuster_name, adjuster_contact) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'CLM-2024-001', 'property_damage', '2024-03-15', '2024-03-16', 75000.00, 65000.00, 'settled', 'Water damage to electrical systems due to pipe burst', 'John Anderson', 'j.anderson@zurich.com'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CLM-2024-002', 'workers_comp', '2024-04-22', '2024-04-22', 25000.00, null, 'investigating', 'Construction worker injury - slip and fall', 'Sarah Mitchell', 's.mitchell@statefund.com'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'CLM-2024-003', 'liability', '2024-05-10', '2024-05-11', 150000.00, null, 'open', 'Third party property damage from construction debris', 'Michael Chen', 'm.chen@cincinnati.com');

-- Legal Contracts Data
INSERT INTO legal_contracts (project_id, contract_type, contract_number, title, counterparty, contract_value, start_date, end_date, execution_date, status, performance_bond_required, performance_bond_amount, retention_percentage, payment_terms, governing_law, dispute_resolution) VALUES
-- Downtown Commercial Tower Contracts
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'construction', 'CNT-2024-001', 'Main Construction Contract', 'Elite Construction Group', 45000000.00, '2024-01-15', '2025-12-15', '2024-01-10', 'active', true, 4500000.00, 10.00, 'Net 30 days', 'New York State', 'arbitration'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'design', 'DSN-2024-001', 'Architectural Design Services', 'Premier Architects LLC', 2500000.00, '2023-06-01', '2024-08-01', '2023-05-25', 'completed', false, null, 5.00, 'Progress payments', 'New York State', 'mediation'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'supply', 'SUP-2024-001', 'Steel Supply Agreement', 'Metro Steel Solutions', 8500000.00, '2024-03-01', '2024-11-01', '2024-02-28', 'active', true, 850000.00, 5.00, 'COD', 'New York State', 'litigation'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'service', 'SVC-2024-001', 'MEP Engineering Services', 'Advanced Engineering Group', 1800000.00, '2024-01-01', '2025-06-01', '2023-12-15', 'active', false, null, 10.00, 'Monthly progress', 'New York State', 'arbitration'),

-- Luxury Residential Complex Contracts
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'construction', 'CNT-2024-002', 'Luxury Residential Construction', 'Premium Builders Inc', 72000000.00, '2024-02-01', '2026-01-31', '2024-01-25', 'active', true, 7200000.00, 10.00, 'Bi-weekly progress', 'California State', 'arbitration'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'design', 'DSN-2024-002', 'Interior Design Services', 'Luxury Interiors Studio', 3200000.00, '2024-01-01', '2025-08-01', '2023-12-20', 'active', false, null, 5.00, 'Milestone payments', 'California State', 'mediation'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'supply', 'SUP-2024-002', 'High-End Fixtures Supply', 'Elite Fixtures Corp', 5500000.00, '2024-06-01', '2025-10-01', '2024-05-15', 'active', true, 275000.00, 5.00, 'Net 15 days', 'California State', 'arbitration'),

-- Mixed-Use Development Contracts
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'construction', 'CNT-2024-003', 'Mixed-Use Construction Contract', 'Urban Builders Alliance', 38000000.00, '2024-03-15', '2025-11-15', '2024-03-10', 'active', true, 3800000.00, 10.00, 'Monthly progress', 'Texas State', 'arbitration'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'design', 'DSN-2024-003', 'Mixed-Use Design Services', 'Modern Design Associates', 1900000.00, '2023-09-01', '2024-09-01', '2023-08-25', 'completed', false, null, 5.00, 'Progress payments', 'Texas State', 'mediation');

-- Legal Disputes Data
INSERT INTO legal_disputes (project_id, dispute_type, counterparty, amount_in_dispute, status, filed_date, description, legal_counsel, estimated_resolution_date) VALUES
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'delay', 'Elite Construction Group', 2500000.00, 'mediation', '2024-05-15', 'Delay claims due to weather and permit issues affecting completion schedule', 'Morrison & Associates LLP', '2024-08-15'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'quality', 'Premium Builders Inc', 850000.00, 'active', '2024-06-01', 'Quality defects in luxury finishes requiring remediation', 'Legal Partners Group', '2024-09-30'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'payment', 'Urban Builders Alliance', 450000.00, 'arbitration', '2024-04-20', 'Disputed change order payments for additional scope work', 'Construction Law Firm LLC', '2024-07-20');

-- Permit and Compliance Data
INSERT INTO permit_compliance (project_id, permit_type, permit_number, issuing_authority, application_date, issued_date, expiration_date, status, cost, inspection_required, inspection_status) VALUES
-- Downtown Commercial Tower Permits
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'building', 'BP-2024-001', 'NYC Department of Buildings', '2023-10-01', '2024-01-15', '2025-01-15', 'issued', 125000.00, true, 'passed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'environmental', 'EP-2024-001', 'NYC Department of Environmental Protection', '2023-09-15', '2023-12-01', '2025-12-01', 'issued', 45000.00, true, 'passed'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'fire', 'FP-2024-001', 'NYC Fire Department', '2024-02-01', '2024-03-15', '2025-03-15', 'issued', 15000.00, true, 'scheduled'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'electrical', 'EL-2024-001', 'NYC Department of Buildings', '2024-01-01', '2024-02-01', '2025-02-01', 'issued', 25000.00, true, 'passed'),

-- Luxury Residential Complex Permits
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'building', 'BP-2024-002', 'Los Angeles Building Department', '2023-11-01', '2024-02-01', '2026-02-01', 'issued', 185000.00, true, 'passed'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'zoning', 'ZP-2024-002', 'Los Angeles Planning Department', '2023-08-01', '2023-11-15', '2026-11-15', 'issued', 35000.00, false, null),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'environmental', 'EP-2024-002', 'CA Environmental Protection Agency', '2023-09-01', '2023-12-15', '2026-12-15', 'issued', 65000.00, true, 'passed'),

-- Mixed-Use Development Permits
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'building', 'BP-2024-003', 'Austin Building Department', '2023-12-01', '2024-03-15', '2025-03-15', 'issued', 95000.00, true, 'passed'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'zoning', 'ZP-2024-003', 'Austin Planning Commission', '2023-10-01', '2024-01-15', '2025-01-15', 'issued', 28000.00, false, null),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'plumbing', 'PL-2024-003', 'Austin Water Department', '2024-02-01', '2024-04-01', '2025-04-01', 'issued', 18000.00, true, 'conditional');

-- Legal Risk Assessments Data
INSERT INTO legal_risk_assessments (project_id, risk_category, risk_description, probability, impact, risk_score, mitigation_strategy, responsible_party, target_date, status, next_review_date) VALUES
-- Downtown Commercial Tower Risks
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'contractual', 'Potential delays due to change order disputes with main contractor', 'medium', 'high', 15, 'Establish clear change order procedures and regular contractor meetings', 'Project Manager', '2024-08-31', 'mitigating', '2024-07-15'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'regulatory', 'New zoning regulations may impact final occupancy', 'low', 'high', 10, 'Monitor regulatory changes and maintain compliance buffer', 'Legal Counsel', '2024-09-30', 'monitoring', '2024-08-01'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'environmental', 'Potential contamination discovery during excavation', 'medium', 'critical', 20, 'Conduct thorough environmental assessment and maintain remediation fund', 'Environmental Consultant', '2024-07-31', 'mitigating', '2024-07-01'),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', 'financial', 'Cost overruns due to material price increases', 'high', 'medium', 15, 'Lock in material prices and maintain contingency fund', 'Finance Director', '2024-12-31', 'mitigating', '2024-08-15'),

-- Luxury Residential Complex Risks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'contractual', 'Premium material supplier reliability concerns', 'medium', 'medium', 12, 'Diversify supplier base and maintain backup options', 'Procurement Manager', '2024-09-30', 'mitigating', '2024-07-30'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'safety', 'High-rise construction safety risks', 'medium', 'critical', 20, 'Enhanced safety protocols and regular training', 'Safety Manager', '2024-12-31', 'mitigating', '2024-07-31'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'regulatory', 'Luxury housing market regulations', 'low', 'medium', 8, 'Stay informed on housing regulations and maintain compliance', 'Legal Counsel', '2024-10-31', 'monitoring', '2024-08-31'),

-- Mixed-Use Development Risks
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'operational', 'Coordination challenges between residential and commercial phases', 'high', 'medium', 15, 'Detailed phasing plan and dedicated coordination team', 'Project Coordinator', '2024-08-31', 'mitigating', '2024-07-31'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'regulatory', 'Mixed-use zoning compliance requirements', 'medium', 'medium', 12, 'Regular compliance reviews and early authority engagement', 'Zoning Consultant', '2024-09-30', 'monitoring', '2024-07-30'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'contractual', 'Multi-contractor coordination and liability issues', 'medium', 'high', 15, 'Clear contractor coordination protocols and insurance requirements', 'Project Manager', '2024-10-31', 'mitigating', '2024-08-31');
