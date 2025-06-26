-- Comprehensive seed data for all dashboard tables

-- Update projects with enhanced data
UPDATE projects SET 
    total_value = CASE 
        WHEN name = 'Downtown Office Building' THEN 75000000
        WHEN name = 'Residential Complex Phase 1' THEN 45000000
        WHEN name = 'Highway Bridge Renovation' THEN 25000000
        ELSE 50000000
    END,
    risk_score = CASE 
        WHEN name = 'Downtown Office Building' THEN 25
        WHEN name = 'Residential Complex Phase 1' THEN 35
        WHEN name = 'Highway Bridge Renovation' THEN 15
        ELSE 20
    END,
    strategic_alignment = CASE 
        WHEN name = 'Downtown Office Building' THEN 92
        WHEN name = 'Residential Complex Phase 1' THEN 88
        WHEN name = 'Highway Bridge Renovation' THEN 95
        ELSE 85
    END,
    market_position = CASE 
        WHEN name = 'Downtown Office Building' THEN 94
        WHEN name = 'Residential Complex Phase 1' THEN 87
        WHEN name = 'Highway Bridge Renovation' THEN 91
        ELSE 85
    END,
    estimated_completion = CASE 
        WHEN name = 'Downtown Office Building' THEN '2024-12-31'::DATE
        WHEN name = 'Residential Complex Phase 1' THEN '2025-06-30'::DATE
        WHEN name = 'Highway Bridge Renovation' THEN '2024-09-15'::DATE
        ELSE '2024-12-31'::DATE
    END;

-- Insert preconstruction metrics
INSERT INTO preconstruction_metrics (project_id, budget_approval, permit_progress, design_completion, contractor_selection, feasibility_score, timeline_status)
SELECT 
    id,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 95
        WHEN name = 'Residential Complex Phase 1' THEN 88
        WHEN name = 'Highway Bridge Renovation' THEN 100
        ELSE 90
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 80
        WHEN name = 'Residential Complex Phase 1' THEN 75
        WHEN name = 'Highway Bridge Renovation' THEN 100
        ELSE 85
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 85
        WHEN name = 'Residential Complex Phase 1' THEN 70
        WHEN name = 'Highway Bridge Renovation' THEN 95
        ELSE 80
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 85
        WHEN name = 'Residential Complex Phase 1' THEN 60
        WHEN name = 'Highway Bridge Renovation' THEN 100
        ELSE 75
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 88
        WHEN name = 'Residential Complex Phase 1' THEN 82
        WHEN name = 'Highway Bridge Renovation' THEN 95
        ELSE 85
    END,
    CASE 
        WHEN name = 'Downtown Office Building' THEN 'On Track'
        WHEN name = 'Residential Complex Phase 1' THEN 'Slight Delay'
        WHEN name = 'Highway Bridge Renovation' THEN 'Ahead of Schedule'
        ELSE 'On Track'
    END
FROM projects
ON CONFLICT DO NOTHING;

-- Insert budget breakdown
INSERT INTO budget_breakdown (project_id, category, allocated_amount, spent_amount) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Site Work', 8500000, 8200000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Structure', 25000000, 24800000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'MEP Systems', 15000000, 14200000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Finishes', 12000000, 9800000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Equipment', 8000000, 6500000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Soft Costs', 4500000, 4200000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Hard Costs', 68500000, 63500000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Contingency', 6000000, 2800000),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Site Work', 4200000, 4100000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Structure', 15000000, 14200000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'MEP Systems', 8500000, 7800000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Finishes', 7800000, 5200000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Equipment', 4500000, 2800000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Soft Costs', 3000000, 2900000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Hard Costs', 40000000, 34100000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Contingency', 2000000, 800000),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Site Work', 2800000, 2750000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Structure', 12000000, 11800000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'MEP Systems', 3200000, 3100000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Equipment', 4000000, 3900000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Soft Costs', 1500000, 1450000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Hard Costs', 22000000, 21550000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Contingency', 1500000, 400000);

-- Insert permit status
INSERT INTO permit_status (project_id, permit_type, status, submitted_date, expected_approval, approved_date, priority, cost) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Building Permit', 'approved', '2023-10-15', '2024-01-10', '2024-01-08', 'high', 45000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Zoning Variance', 'approved', '2023-09-20', '2023-11-15', '2023-11-12', 'high', 12000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Environmental Impact', 'approved', '2023-08-30', '2023-10-20', '2023-10-18', 'medium', 8500),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Fire Department', 'pending', '2024-02-15', '2024-06-15', NULL, 'medium', 3500),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Utility Connections', 'pending', '2024-03-01', '2024-07-01', NULL, 'high', 15000),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Traffic Impact', 'in-review', '2024-02-20', '2024-05-20', NULL, 'low', 7500),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Building Permit', 'approved', '2024-01-10', '2024-04-10', '2024-04-08', 'high', 35000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Zoning Variance', 'approved', '2023-12-15', '2024-02-15', '2024-02-12', 'high', 8000),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Environmental Impact', 'in-review', '2024-02-01', '2024-06-01', NULL, 'medium', 6500),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Utility Connections', 'pending', '2024-03-15', '2024-07-15', NULL, 'high', 12000),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Building Permit', 'approved', '2023-08-01', '2023-11-01', '2023-10-28', 'high', 25000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Environmental Impact', 'approved', '2023-07-15', '2023-09-15', '2023-09-12', 'high', 15000),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Traffic Management', 'approved', '2023-09-01', '2023-11-01', '2023-10-30', 'high', 8500),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Utility Coordination', 'approved', '2023-10-01', '2023-12-01', '2023-11-28', 'medium', 5000);

-- Insert contractor bids
INSERT INTO contractor_bids (project_id, contractor_name, bid_amount, evaluation_score, proposed_timeline, status, recommended, experience_years) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Premium Builders Inc.', 68500000, 95, '18 months', 'selected', TRUE, 25),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Metro Construction Co.', 71200000, 88, '20 months', 'finalist', FALSE, 18),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Elite Building Corp.', 69950000, 92, '19 months', 'finalist', FALSE, 22),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Downtown Developers', 74100000, 82, '22 months', 'evaluated', FALSE, 15),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'City Construction LLC', 72750000, 85, '21 months', 'evaluated', FALSE, 20),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Modern Build Solutions', 78200000, 78, '24 months', 'rejected', FALSE, 12),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Residential Pros LLC', 42000000, 91, '14 months', 'selected', TRUE, 20),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Home Builders United', 44500000, 87, '16 months', 'finalist', FALSE, 15),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Quality Housing Corp.', 43200000, 89, '15 months', 'finalist', FALSE, 18),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Metro Residential', 46800000, 83, '17 months', 'evaluated', FALSE, 12),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Infrastructure Masters', 23500000, 96, '8 months', 'selected', TRUE, 30),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Bridge Specialists Inc.', 24200000, 93, '9 months', 'finalist', FALSE, 25),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Heavy Construction Co.', 25800000, 88, '10 months', 'evaluated', FALSE, 22);

-- Insert project insights
INSERT INTO project_insights (project_id, summary, key_points, recommendations, alerts) VALUES
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 
 'Project performing excellently with strong metrics across all areas. Design phase nearing completion with robust contractor engagement.',
 ARRAY['Strong ROI performance at 16.8%', 'Stakeholder alignment high at 92%', 'Risk levels manageable at 25%', 'Permit approval rate at 50%'],
 ARRAY['Finalize contractor selection to maintain schedule advantage', 'Expedite remaining permit applications', 'Lock in material pricing for inflation protection'],
 ARRAY['Quarterly stakeholder review due next week', 'Fire department permit pending approval']),

((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'),
 'Project progressing well with good financial performance. Some minor delays in permit processing but overall on track.',
 ARRAY['Solid ROI performance at 14.2%', 'Good stakeholder engagement', 'Moderate risk levels at 35%', 'Design completion at 70%'],
 ARRAY['Accelerate permit processing', 'Review contractor timeline commitments', 'Monitor supply chain for potential delays'],
 ARRAY['Environmental impact review in progress', 'Utility connection permits pending']),

((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'),
 'Exceptional project performance with all permits approved and construction ready to commence. Ahead of schedule.',
 ARRAY['Excellent ROI performance at 18.5%', 'All permits approved', 'Very low risk levels at 15%', 'Contractor selection complete'],
 ARRAY['Begin construction phase immediately', 'Maintain traffic management protocols', 'Monitor weather conditions for outdoor work'],
 ARRAY['Construction start scheduled for next month', 'Traffic impact coordination required']);

-- Insert project KPIs (4 weeks of data for each project)
INSERT INTO project_kpis (project_id, week, efficiency_score, quality_score, safety_score) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W1', 78, 92, 98),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W2', 82, 89, 97),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W3', 85, 94, 99),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'W4', 88, 96, 98),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W1', 75, 88, 96),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W2', 79, 85, 95),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W3', 82, 90, 97),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'W4', 85, 92, 98),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W1', 88, 95, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W2', 92, 97, 98),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W3', 90, 96, 99),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'W4', 94, 98, 99);

-- Insert project team
INSERT INTO project_team (project_id, name, role, email, phone) VALUES
-- Downtown Office Building
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Sarah Johnson', 'project_manager', 'sarah.johnson@premiumbuilders.com', '555-0101'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Michael Chen', 'architect', 'michael.chen@designstudio.com', '555-0102'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Premium Builders Inc.', 'contractor', 'contracts@premiumbuilders.com', '555-0103'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Metro Development Corp', 'owner', 'owner@metrodev.com', '555-0104'),
((SELECT id FROM projects WHERE name = 'Downtown Office Building'), 'Lisa Rodriguez', 'engineer', 'lisa.rodriguez@engineering.com', '555-0105'),

-- Residential Complex Phase 1
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'David Wilson', 'project_manager', 'david.wilson@residentialpros.com', '555-0201'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Emma Thompson', 'architect', 'emma.thompson@homearchitects.com', '555-0202'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Residential Pros LLC', 'contractor', 'info@residentialpros.com', '555-0203'),
((SELECT id FROM projects WHERE name = 'Residential Complex Phase 1'), 'Housing Development Inc', 'owner', 'projects@housingdev.com', '555-0204'),

-- Highway Bridge Renovation
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Robert Kim', 'project_manager', 'robert.kim@infrastructure.com', '555-0301'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Jennifer Lee', 'engineer', 'jennifer.lee@bridgetech.com', '555-0302'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'Infrastructure Masters', 'contractor', 'projects@infratech.com', '555-0303'),
((SELECT id FROM projects WHERE name = 'Highway Bridge Renovation'), 'State Transportation Dept', 'owner', 'projects@state.gov', '555-0304');
