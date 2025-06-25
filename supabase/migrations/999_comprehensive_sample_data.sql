-- ================================================
-- COMPREHENSIVE SAMPLE DATA FOR OWNERS COCKPIT
-- Creates realistic construction project data for demo
-- ================================================

-- First, create some sample users (simulate auth users)
-- Note: In production, these would be created via auth.users

-- Sample Projects with realistic construction data
INSERT INTO public.projects (
    id,
    name,
    description,
    status,
    source,
    start_date,
    end_date,
    owner_id,
    created_at,
    updated_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Downtown Medical Center Expansion',
    'State-of-the-art 250,000 sq ft medical facility with emergency department, surgical suites, and patient towers. LEED Gold certified with advanced building systems.',
    'construction'::project_status,
    'procore',
    '2024-03-01',
    '2025-12-15',
    auth.uid(),
    '2024-03-01T10:00:00Z',
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222',
    'Riverside Corporate Campus Phase II',
    'Modern 180,000 sq ft office complex with retail spaces, underground parking, and smart building technology. Sustainable design with on-site renewable energy.',
    'design'::project_status,
    'smartsheet',
    '2024-08-15',
    '2026-06-30',
    auth.uid(),
    '2024-08-15T09:00:00Z',
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333',
    'Tech Innovation Hub Renovation',
    'Adaptive reuse of historic warehouse into modern tech campus. 95,000 sq ft including labs, collaboration spaces, and innovation centers.',
    'planning'::project_status,
    'track3d',
    '2025-01-10',
    '2025-11-20',
    auth.uid(),
    '2025-01-10T08:00:00Z',
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444',
    'University Research Facility',
    'Advanced research facility with specialized labs, clean rooms, and high-performance computing infrastructure. 75,000 sq ft with stringent environmental controls.',
    'closeout'::project_status,
    'manual',
    '2023-05-01',
    '2024-10-31',
    auth.uid(),
    '2023-05-01T07:00:00Z',
    NOW()
),
(
    '55555555-5555-5555-5555-555555555555',
    'Green Residential Complex',
    'Sustainable multi-family housing with 120 units, solar panels, rainwater harvesting, and community spaces. Net-zero energy target.',
    'construction'::project_status,
    'green_badger',
    '2024-06-01',
    '2025-08-15',
    auth.uid(),
    '2024-06-01T06:00:00Z',
    NOW()
);

-- Sample user_projects relationships
INSERT INTO public.user_projects (user_id, project_id, role, created_at) VALUES
(auth.uid(), '11111111-1111-1111-1111-111111111111', 'owner', NOW()),
(auth.uid(), '22222222-2222-2222-2222-222222222222', 'owner', NOW()),
(auth.uid(), '33333333-3333-3333-3333-333333333333', 'owner', NOW()),
(auth.uid(), '44444444-4444-4444-4444-444444444444', 'owner', NOW()),
(auth.uid(), '55555555-5555-5555-5555-555555555555', 'owner', NOW());

-- Sample Tasks with realistic construction activities
INSERT INTO public.tasks (
    project_id,
    name,
    description,
    status,
    priority,
    assigned_to,
    due_date,
    source,
    external_id,
    created_at,
    updated_at
) VALUES
-- Medical Center Tasks
('11111111-1111-1111-1111-111111111111', 'Foundation Pour - Building A', 'Complete concrete foundation pour for main hospital building. Includes footings, basement walls, and grade beams.', 'completed'::task_status, 1, 'Sarah Chen - Concrete Foreman', '2024-04-15', 'procore', 'PC-12345', '2024-03-15T08:00:00Z', '2024-04-16T17:30:00Z'),
('11111111-1111-1111-1111-111111111111', 'MEP Rough-In - Emergency Dept', 'Install electrical, plumbing, and HVAC rough-in for emergency department. Critical path item.', 'in_progress'::task_status, 1, 'Mike Rodriguez - MEP Coordinator', '2024-12-30', 'procore', 'PC-12346', '2024-11-01T07:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Operating Room Equipment Install', 'Install specialized medical equipment in surgical suites. Requires coordination with medical equipment vendors.', 'not_started'::task_status, 2, 'Jessica Wu - Medical Equipment Specialist', '2025-02-15', 'procore', 'PC-12347', '2024-12-01T09:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Fire Safety System Testing', 'Complete testing of fire alarm, sprinkler, and smoke evacuation systems. Critical for occupancy permit.', 'not_started'::task_status, 1, 'David Thompson - Fire Safety', '2025-03-01', 'procore', 'PC-12348', '2024-12-01T10:00:00Z', NOW()),

-- Corporate Campus Tasks
('22222222-2222-2222-2222-222222222222', 'Site Preparation & Utilities', 'Clear site, install temporary utilities, and prepare for construction. Environmental impact mitigation included.', 'completed'::task_status, 1, 'Robert Kim - Site Supervisor', '2024-09-30', 'smartsheet', 'SS-56789', '2024-08-15T06:00:00Z', '2024-10-01T16:00:00Z'),
('22222222-2222-2222-2222-222222222222', 'Structural Steel Erection', 'Erect structural steel frame for office towers. Includes crane operations and fall protection measures.', 'in_progress'::task_status, 1, 'Carlos Martinez - Steel Erection', '2025-01-15', 'smartsheet', 'SS-56790', '2024-11-15T07:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Curtain Wall Installation', 'Install high-performance curtain wall system. Energy efficiency and weather sealing critical.', 'not_started'::task_status, 2, 'Anna Petrov - Glazing Specialist', '2025-04-30', 'smartsheet', 'SS-56791', '2024-12-01T08:00:00Z', NOW()),

-- Tech Hub Tasks
('33333333-3333-3333-3333-333333333333', 'Historic Preservation Assessment', 'Complete assessment of historic elements to preserve during renovation. State historic office coordination.', 'in_progress'::task_status, 1, 'Dr. Emily Johnson - Preservation Architect', '2025-02-15', 'track3d', 'T3D-99901', '2025-01-10T09:00:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'Hazardous Materials Abatement', 'Remove asbestos and lead paint from existing structure. EPA compliance required.', 'not_started'::task_status, 1, 'Tom Wilson - Abatement Specialist', '2025-03-30', 'track3d', 'T3D-99902', '2025-01-15T10:00:00Z', NOW()),

-- Research Facility Tasks
('44444444-4444-4444-4444-444444444444', 'Final Commissioning Report', 'Complete final commissioning of all building systems. Document performance baselines.', 'completed'::task_status, 1, 'Linda Chang - Commissioning Agent', '2024-10-15', 'manual', 'MAN-77701', '2024-09-01T11:00:00Z', '2024-10-16T15:30:00Z'),
('44444444-4444-4444-4444-444444444444', 'Project Documentation Archive', 'Compile and organize all project documentation for owner handover. Digital archive creation.', 'completed'::task_status, 2, 'Mark Stevens - Document Manager', '2024-10-30', 'manual', 'MAN-77702', '2024-10-01T12:00:00Z', '2024-10-31T14:00:00Z'),

-- Green Residential Tasks
('55555555-5555-5555-5555-555555555555', 'Solar Panel Array Installation', 'Install rooftop solar panel system across all buildings. Grid-tie and battery backup systems.', 'in_progress'::task_status, 1, 'Janet Foster - Solar Specialist', '2025-01-30', 'green_badger', 'GB-44401', '2024-12-01T13:00:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'Rainwater Harvesting System', 'Install underground cisterns and distribution system for landscape irrigation.', 'not_started'::task_status, 2, 'Chris Lee - Civil Engineer', '2025-03-15', 'green_badger', 'GB-44402', '2024-12-15T14:00:00Z', NOW());

-- Sample Budget Items with realistic construction costs
INSERT INTO public.budget_items (
    project_id,
    category,
    description,
    budgeted_amount,
    actual_amount,
    source,
    external_id,
    created_at,
    updated_at
) VALUES
-- Medical Center Budget
('11111111-1111-1111-1111-111111111111', 'Site Work', 'Excavation, utilities, site preparation', 2500000.00, 2385000.00, 'procore', 'PC-BUD-001', '2024-03-01T00:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Structural', 'Foundation, steel frame, concrete', 8750000.00, 8650000.00, 'procore', 'PC-BUD-002', '2024-03-01T00:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'MEP Systems', 'Electrical, plumbing, HVAC, medical gases', 12500000.00, 11200000.00, 'procore', 'PC-BUD-003', '2024-03-01T00:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Medical Equipment', 'Imaging, surgical equipment, specialized systems', 15000000.00, 8750000.00, 'procore', 'PC-BUD-004', '2024-03-01T00:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Interior Finishes', 'Flooring, walls, ceilings, millwork', 6200000.00, 4100000.00, 'procore', 'PC-BUD-005', '2024-03-01T00:00:00Z', NOW()),

-- Corporate Campus Budget
('22222222-2222-2222-2222-222222222222', 'Site Development', 'Grading, utilities, parking, landscaping', 1800000.00, 950000.00, 'smartsheet', 'SS-BUD-001', '2024-08-15T00:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Building Structure', 'Steel frame, concrete, envelope', 7200000.00, 3850000.00, 'smartsheet', 'SS-BUD-002', '2024-08-15T00:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Smart Building Systems', 'IoT, building automation, security', 2800000.00, 750000.00, 'smartsheet', 'SS-BUD-003', '2024-08-15T00:00:00Z', NOW()),

-- Tech Hub Budget
('33333333-3333-3333-3333-333333333333', 'Historic Preservation', 'Façade restoration, structural upgrades', 3200000.00, 150000.00, 'track3d', 'T3D-BUD-001', '2025-01-10T00:00:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'Technology Infrastructure', 'High-speed network, labs, collaboration tech', 2100000.00, 85000.00, 'track3d', 'T3D-BUD-002', '2025-01-10T00:00:00Z', NOW()),

-- Research Facility Budget
('44444444-4444-4444-4444-444444444444', 'Specialized Equipment', 'Research equipment, clean room systems', 5500000.00, 5485000.00, 'manual', 'MAN-BUD-001', '2023-05-01T00:00:00Z', NOW()),
('44444444-4444-4444-4444-444444444444', 'Environmental Controls', 'HVAC, air filtration, contamination control', 3800000.00, 3765000.00, 'manual', 'MAN-BUD-002', '2023-05-01T00:00:00Z', NOW()),

-- Green Residential Budget
('55555555-5555-5555-5555-555555555555', 'Renewable Energy', 'Solar panels, battery storage, grid-tie', 1200000.00, 850000.00, 'green_badger', 'GB-BUD-001', '2024-06-01T00:00:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'Sustainable Features', 'Green roof, rainwater harvesting, efficient systems', 900000.00, 675000.00, 'green_badger', 'GB-BUD-002', '2024-06-01T00:00:00Z', NOW());

-- Sample RFI (Request for Information) items
INSERT INTO public.rfi (
    project_id,
    title,
    description,
    status,
    submitted_by,
    assigned_to,
    due_date,
    source,
    external_id,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'Emergency Power Distribution Clarification', 'Need clarification on emergency power distribution to OR suites. Drawings show conflicting routing paths.', 'open'::rfi_status, 'Mike Rodriguez - MEP', 'Dr. Patricia Adams - Medical Planner', '2024-12-28', 'procore', 'PC-RFI-001', '2024-12-20T09:15:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Medical Gas Outlet Locations', 'Verify medical gas outlet locations in patient rooms. Current layout may conflict with furniture plan.', 'in_review'::rfi_status, 'Jessica Wu - Medical Equipment', 'Sarah Kim - Interior Designer', '2024-12-30', 'procore', 'PC-RFI-002', '2024-12-18T14:30:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Curtain Wall Thermal Performance', 'Require thermal break details for curtain wall system. Energy model needs specific U-values.', 'resolved'::rfi_status, 'Anna Petrov - Glazing', 'Bob Johnson - Energy Consultant', '2024-12-15', 'smartsheet', 'SS-RFI-001', '2024-12-10T11:00:00Z', '2024-12-16T16:45:00Z'),
('33333333-3333-3333-3333-333333333333', 'Historic Brick Preservation Method', 'What preservation method approved for historic brick façade? Chemical cleaning vs. gentle pressure washing.', 'open'::rfi_status, 'Tom Wilson - Restoration', 'Dr. Emily Johnson - Preservation', '2025-01-15', 'track3d', 'T3D-RFI-001', '2025-01-12T10:20:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'Solar Panel Mounting Details', 'Roof mounting details for solar panels. Need structural engineer approval for attachment method.', 'in_review'::rfi_status, 'Janet Foster - Solar', 'Steve Chang - Structural Engineer', '2024-12-27', 'green_badger', 'GB-RFI-001', '2024-12-22T13:45:00Z', NOW());

-- Sample Documents with realistic construction document types
INSERT INTO public.documents (
    project_id,
    title,
    file_path,
    file_size,
    mime_type,
    doc_type,
    processed,
    source,
    external_id,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'Architectural Plans - Medical Center', '/documents/medical-center-arch-plans.pdf', 15728640, 'application/pdf', 'drawing'::document_type, true, 'procore', 'PC-DOC-001', '2024-03-15T10:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'MEP Shop Drawings - Emergency Dept', '/documents/emergency-dept-mep-shop.pdf', 22347520, 'application/pdf', 'shop_drawing'::document_type, true, 'procore', 'PC-DOC-002', '2024-11-20T14:30:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Medical Equipment Specifications', '/documents/medical-equipment-specs.pdf', 8945280, 'application/pdf', 'specification'::document_type, true, 'procore', 'PC-DOC-003', '2024-12-01T09:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Structural Steel Details', '/documents/steel-connection-details.pdf', 12582912, 'application/pdf', 'shop_drawing'::document_type, false, 'smartsheet', 'SS-DOC-001', '2024-11-25T11:15:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Curtain Wall Performance Data', '/documents/curtain-wall-performance.pdf', 6291456, 'application/pdf', 'submittal'::document_type, true, 'smartsheet', 'SS-DOC-002', '2024-12-10T16:20:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'Historic Preservation Plan', '/documents/historic-preservation-plan.pdf', 18874368, 'application/pdf', 'specification'::document_type, true, 'track3d', 'T3D-DOC-001', '2025-01-10T08:30:00Z', NOW()),
('44444444-4444-4444-4444-444444444444', 'Final Commissioning Report', '/documents/final-commissioning-report.pdf', 25165824, 'application/pdf', 'report'::document_type, true, 'manual', 'MAN-DOC-001', '2024-10-15T15:45:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'Solar System Performance Analysis', '/documents/solar-performance-analysis.pdf', 4194304, 'application/pdf', 'report'::document_type, true, 'green_badger', 'GB-DOC-001', '2024-12-15T12:00:00Z', NOW());

-- Sample Action Items with realistic construction management tasks
INSERT INTO public.action_items (
    project_id,
    title,
    description,
    status,
    priority,
    due_date,
    assignee,
    source_type,
    source_id,
    created_by,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'Resolve MEP Coordination Conflicts', 'Address conflicts between HVAC ductwork and structural steel in patient tower mechanical rooms. Coordinate with structural and MEP teams.', 'Open', 'High', '2024-12-30', auth.uid(), 'meeting', null, auth.uid(), '2024-12-20T10:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Update Medical Equipment Schedule', 'Revise delivery schedule for MRI equipment to accommodate building readiness. Coordinate with medical equipment vendor.', 'In Progress', 'Medium', '2025-01-15', auth.uid(), 'insight', null, auth.uid(), '2024-12-18T14:30:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Fire Safety System Integration', 'Ensure fire alarm system integration with building management system. Test communication protocols.', 'Open', 'High', '2025-01-10', auth.uid(), 'manual', null, auth.uid(), '2024-12-22T09:15:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Curtain Wall Sample Approval', 'Review and approve curtain wall mockup samples. Schedule stakeholder review meeting.', 'Completed', 'Medium', '2024-12-20', auth.uid(), 'meeting', null, auth.uid(), '2024-12-10T11:00:00Z', '2024-12-21T16:30:00Z'),
('22222222-2222-2222-2222-222222222222', 'Smart Building System Programming', 'Complete programming of building automation system. Test all sensor integrations and control sequences.', 'In Progress', 'Low', '2025-02-28', auth.uid(), 'insight', null, auth.uid(), '2024-12-15T13:45:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'Historic Approval Documentation', 'Submit historic preservation plan to state historic office for final approval. Include detailed restoration methods.', 'Open', 'High', '2025-01-30', auth.uid(), 'manual', null, auth.uid(), '2025-01-12T10:20:00Z', NOW()),
('44444444-4444-4444-4444-444444444444', 'Archive Project Documentation', 'Complete digital archive of all project documentation. Organize for owner handover and future reference.', 'Completed', 'Low', '2024-11-15', auth.uid(), 'manual', null, auth.uid(), '2024-10-30T14:00:00Z', '2024-11-16T10:30:00Z'),
('55555555-5555-5555-5555-555555555555', 'Solar System Performance Testing', 'Conduct comprehensive performance testing of solar panel system. Document baseline performance metrics.', 'In Progress', 'Medium', '2025-02-15', auth.uid(), 'insight', null, auth.uid(), '2024-12-20T15:30:00Z', NOW());

-- Sample Insights (AI-generated project insights)
INSERT INTO public.insights (
    project_id,
    severity,
    title,
    summary,
    context_data,
    read_at,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'high', 'MEP Installation Behind Schedule', 'Analysis of recent progress data indicates MEP rough-in work in the emergency department is 12 days behind the critical path schedule. This delay could impact the overall project completion date.', '{"area": "emergency_department", "trade": "mep", "delay_days": 12, "impact": "critical_path"}', null, '2024-12-22T08:30:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'medium', 'Material Delivery Optimization Opportunity', 'Recent delivery patterns show potential for cost savings through consolidated shipments. Recommend coordinating medical equipment deliveries to reduce storage costs.', '{"cost_savings": 45000, "storage_optimization": true}', '2024-12-22T10:15:00Z', '2024-12-21T16:45:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'critical', 'Weather Impact on Steel Erection', 'Extended forecast shows adverse weather conditions that will significantly impact steel erection schedule. Recommend accelerating work schedule or implementing weather protection measures.', '{"weather_days": 8, "impact_area": "structural_steel", "mitigation_options": ["acceleration", "protection"]}', null, '2024-12-23T07:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'low', 'Energy Efficiency Performance Ahead of Target', 'Building envelope performance testing indicates the project will exceed energy efficiency targets by 15%. This could qualify for additional LEED points.', '{"efficiency_improvement": 15, "leed_impact": "additional_points"}', '2024-12-20T14:30:00Z', '2024-12-20T09:15:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'medium', 'Historic Preservation Compliance Review', 'Review of preservation work indicates full compliance with historic guidelines. Quality of brick restoration work is exemplary and ahead of schedule.', '{"compliance_status": "full", "quality_rating": "exemplary", "schedule_status": "ahead"}', null, '2025-01-13T11:20:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'high', 'Solar Installation Coordination Required', 'Solar panel installation requires coordination with roofing work to prevent conflicts. Recommend joint scheduling meeting to align activities.', '{"coordination_trades": ["solar", "roofing"], "action_required": "scheduling_meeting"}', null, '2024-12-23T13:45:00Z', NOW());

-- Sample Communications data
INSERT INTO public.communications (
    project_id,
    comm_type,
    subject,
    content,
    participants,
    timestamp,
    sender_name,
    sender_email,
    metadata,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'meeting_recording', 'Weekly Progress Meeting - Medical Center', 'Discussion of MEP coordination issues, medical equipment delivery schedules, and fire safety system integration requirements.', '["Sarah Chen", "Mike Rodriguez", "Jessica Wu", "Dr. Patricia Adams"]', '2024-12-20T14:00:00Z', 'Sarah Chen', 'sarah.chen@contractor.com', '{"duration": 3600, "recording_url": "/recordings/medical-center-weekly-20241220.mp4"}', '2024-12-20T14:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'email', 'RE: Emergency Power Distribution Questions', 'Providing clarification on emergency power routing. Attached updated drawings showing approved distribution paths for OR suites.', '["Mike Rodriguez", "Dr. Patricia Adams", "Tom Wilson"]', '2024-12-21T09:30:00Z', 'Dr. Patricia Adams', 'patricia.adams@medcenter.com', '{"thread_id": "email_thread_001", "attachments": ["emergency_power_routing_rev3.pdf"]}', '2024-12-21T09:30:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'meeting_transcript', 'Design Review - Curtain Wall Performance', 'Detailed review of curtain wall thermal performance specifications and installation sequence. Approved mockup samples and scheduling.', '["Anna Petrov", "Bob Johnson", "Carlos Martinez", "Lisa Wong"]', '2024-12-16T10:00:00Z', 'Bob Johnson', 'bob.johnson@architect.com', '{"meeting_type": "design_review", "decisions": ["approve_samples", "update_schedule"]}', '2024-12-16T10:00:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'chat_message', 'Historic Brick Cleaning Method Approved', 'State historic office has approved the gentle pressure washing method for brick cleaning. Can proceed with test area next week.', '["Tom Wilson", "Dr. Emily Johnson"]', '2025-01-13T15:20:00Z', 'Dr. Emily Johnson', 'emily.johnson@preservation.com', '{"platform": "slack", "channel": "#historic-preservation"}', '2025-01-13T15:20:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'meeting_recording', 'Solar System Coordination Meeting', 'Coordination between solar installation team and roofing contractor. Established joint work schedule to prevent conflicts.', '["Janet Foster", "Chris Lee", "Mark Stevens", "Diana Rodriguez"]', '2024-12-22T11:00:00Z', 'Janet Foster', 'janet.foster@solar.com', '{"duration": 2700, "recording_url": "/recordings/solar-coordination-20241222.mp4"}', '2024-12-22T11:00:00Z', NOW());

-- Sample Equipment for building systems
INSERT INTO public.equipment (
    project_id,
    name,
    equipment_type,
    manufacturer,
    model,
    serial_number,
    location,
    installation_date,
    warranty_expiration,
    status,
    specifications,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'Emergency Generator #1', 'electrical', 'Caterpillar', 'C32-1000kW', 'CAT2024MED001', 'Basement Mechanical Room', '2024-08-15', '2029-08-15', 'operational', '{"capacity_kw": 1000, "fuel_type": "diesel", "runtime_hours": 245}', '2024-08-15T10:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Central Chiller Plant', 'hvac', 'Carrier', '23XRV-2500', 'CARR2024CH001', 'Rooftop Mechanical', '2024-09-20', '2029-09-20', 'operational', '{"capacity_tons": 2500, "refrigerant": "R-134a", "efficiency_kw_ton": 0.55}', '2024-09-20T08:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Building Automation System', 'hvac', 'Johnson Controls', 'Metasys ADS', 'JCI2024BAS001', 'Main Electrical Room', '2024-10-30', '2029-10-30', 'operational', '{"points_capacity": 50000, "network_type": "BACnet", "redundancy": "full"}', '2024-10-30T14:00:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'Solar Inverter Array', 'electrical', 'SolarEdge', 'SE100K-RWS', 'SEDG2024INV001', 'Rooftop Equipment Area', '2024-11-15', '2034-11-15', 'operational', '{"capacity_kw": 100, "efficiency_percent": 97.5, "monitoring": "cloud_connected"}', '2024-11-15T12:00:00Z', NOW());

-- Sample Sensors for IoT monitoring
INSERT INTO public.sensors (
    equipment_id,
    project_id,
    sensor_type,
    name,
    location,
    unit,
    min_threshold,
    max_threshold,
    status,
    created_at,
    updated_at
) VALUES
((SELECT id FROM public.equipment WHERE serial_number = 'CAT2024MED001'), '11111111-1111-1111-1111-111111111111', 'temperature', 'Generator Coolant Temp', 'Emergency Generator #1', 'celsius', 60, 95, 'active', '2024-08-15T10:30:00Z', NOW()),
((SELECT id FROM public.equipment WHERE serial_number = 'CARR2024CH001'), '11111111-1111-1111-1111-111111111111', 'energy', 'Chiller Power Consumption', 'Central Chiller Plant', 'kwh', 0, 2000, 'active', '2024-09-20T08:30:00Z', NOW()),
((SELECT id FROM public.equipment WHERE serial_number = 'SEDG2024INV001'), '55555555-5555-5555-5555-555555555555', 'energy', 'Solar Production Monitor', 'Solar Inverter Array', 'kwh', 0, 120, 'active', '2024-11-15T12:30:00Z', NOW());

-- Sample sensor readings for the past 30 days
INSERT INTO public.sensor_readings (
    sensor_id,
    value,
    timestamp,
    status,
    metadata
)
SELECT 
    s.id,
    CASE 
        WHEN s.sensor_type = 'temperature' THEN 75 + (RANDOM() * 15)
        WHEN s.sensor_type = 'energy' THEN 800 + (RANDOM() * 400)
        ELSE RANDOM() * 100
    END,
    NOW() - (interval '1 hour' * generate_series(1, 720)), -- 30 days of hourly readings
    'normal',
    '{}'
FROM public.sensors s
CROSS JOIN generate_series(1, 720);

-- Sample Work Orders
INSERT INTO public.work_orders (
    project_id,
    equipment_id,
    title,
    description,
    priority,
    status,
    work_type,
    assigned_to,
    requested_by,
    due_date,
    completed_date,
    estimated_hours,
    actual_hours,
    cost,
    notes,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.equipment WHERE serial_number = 'CAT2024MED001'), 'Generator Monthly Inspection', 'Perform monthly inspection of emergency generator including fluid levels, battery test, and exercise run.', 'medium', 'completed', 'preventive', 'Mike Thompson', 'Sarah Chen', '2024-12-15', '2024-12-14', 4, 3.5, 450.00, 'All systems normal. Battery tested OK. Next service due 2025-01-15.', '2024-11-15T09:00:00Z', '2024-12-14T16:30:00Z'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.equipment WHERE serial_number = 'CARR2024CH001'), 'Chiller Refrigerant Check', 'Check refrigerant levels and system pressures. Report any leaks or performance issues.', 'high', 'in_progress', 'preventive', 'Carlos Rodriguez', 'Facility Manager', '2024-12-28', null, 2, null, 0, 'Started refrigerant check. Found minor leak in evaporator section.', '2024-12-20T08:00:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM public.equipment WHERE serial_number = 'SEDG2024INV001'), 'Solar Panel Cleaning', 'Clean solar panels and check inverter performance. Document any damaged panels.', 'low', 'open', 'preventive', 'Janet Foster', 'Building Operations', '2025-01-05', null, 6, null, 800.00, null, '2024-12-22T10:00:00Z', NOW());

-- Sample Building Systems
INSERT INTO public.building_systems (
    project_id,
    system_name,
    system_type,
    status,
    uptime_percentage,
    last_maintenance,
    next_maintenance,
    energy_consumption,
    efficiency_rating,
    alerts_count,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'Emergency Power Distribution', 'electrical', 'operational', 99.8, '2024-12-14', '2025-01-15', 1250.5, 94, 0, '2024-08-15T00:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'Central HVAC System', 'hvac', 'operational', 98.5, '2024-12-10', '2025-01-10', 18750.2, 87, 1, '2024-09-20T00:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'Smart Building Controls', 'hvac', 'operational', 99.9, '2024-11-30', '2025-02-28', 3240.8, 92, 0, '2024-10-30T00:00:00Z', NOW()),
('55555555-5555-5555-5555-555555555555', 'Solar Energy System', 'electrical', 'operational', 97.2, '2024-12-20', '2025-03-20', -2850.5, 96, 0, '2024-11-15T00:00:00Z', NOW());

-- Sample Energy Consumption data
INSERT INTO public.energy_consumption (
    project_id,
    meter_type,
    reading_date,
    consumption,
    unit,
    cost,
    baseline,
    efficiency_score,
    created_at
)
SELECT 
    '11111111-1111-1111-1111-111111111111',
    'electricity',
    CURRENT_DATE - (interval '1 day' * generate_series(1, 30)),
    15000 + (RANDOM() * 5000),
    'kwh',
    (15000 + (RANDOM() * 5000)) * 0.12,
    18000,
    85 + (RANDOM() * 10),
    NOW()
FROM generate_series(1, 30);

-- Add some gas and water consumption
INSERT INTO public.energy_consumption (
    project_id,
    meter_type,
    reading_date,
    consumption,
    unit,
    cost,
    baseline,
    efficiency_score,
    created_at
)
SELECT 
    '11111111-1111-1111-1111-111111111111',
    'gas',
    CURRENT_DATE - (interval '1 day' * generate_series(1, 30)),
    2500 + (RANDOM() * 800),
    'therms',
    (2500 + (RANDOM() * 800)) * 1.25,
    3200,
    78 + (RANDOM() * 15),
    NOW()
FROM generate_series(1, 30);

-- Sample Reports
INSERT INTO public.reports (
    project_id,
    report_type,
    content,
    metadata,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'weekly_summary', 'Week ending December 22, 2024: Medical Center construction progressing with MEP rough-in 75% complete. Emergency department systems installation on track. Medical equipment coordination meetings scheduled for early January. Overall project 68% complete, slight delay in MEP work being addressed.', '{"completion_percentage": 68, "key_milestones": ["mep_roughin", "medical_equipment"], "risk_level": "medium"}', '2024-12-22T17:00:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'monthly_report', 'November 2024 Progress: Corporate campus structural steel erection reached 45% completion. Curtain wall samples approved and installation to begin January 2025. Smart building systems programming initiated ahead of schedule. Weather delays minimal due to proactive planning.', '{"completion_percentage": 32, "weather_impact_days": 2, "ahead_behind_schedule": "on_track"}', '2024-11-30T16:00:00Z', NOW()),
('44444444-4444-4444-4444-444444444444', 'project_closeout', 'University Research Facility project completed successfully October 2024. All commissioning requirements met, building systems performing above specifications. Final documentation package delivered to owner. Project completed 2 weeks ahead of schedule and 3% under budget.', '{"final_completion": "2024-10-31", "schedule_variance": -14, "budget_variance": -3}', '2024-10-31T15:00:00Z', NOW());

-- Sample BIM Files
INSERT INTO public.bim_files (
    project_id,
    filename,
    file_path,
    file_size,
    file_type,
    version,
    is_active,
    uploaded_by,
    processing_status,
    metadata,
    created_at,
    updated_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'medical-center-architectural-v12.ifc', '/bim/medical-center-arch-v12.ifc', 157286400, 'ifc', '12.0', true, auth.uid(), 'completed', '{"discipline": "architectural", "level_count": 8, "room_count": 450}', '2024-12-15T10:00:00Z', NOW()),
('11111111-1111-1111-1111-111111111111', 'medical-center-mep-v8.ifc', '/bim/medical-center-mep-v8.ifc', 203423744, 'ifc', '8.0', false, auth.uid(), 'completed', '{"discipline": "mep", "system_count": 12, "equipment_count": 850}', '2024-12-10T14:30:00Z', NOW()),
('22222222-2222-2222-2222-222222222222', 'corporate-campus-structural-v5.ifc', '/bim/corporate-structural-v5.ifc', 89478656, 'ifc', '5.0', true, auth.uid(), 'completed', '{"discipline": "structural", "steel_tonnage": 1250, "connection_count": 2400}', '2024-11-25T09:00:00Z', NOW()),
('33333333-3333-3333-3333-333333333333', 'tech-hub-existing-conditions.rvt', '/bim/tech-hub-existing.rvt', 245760000, 'rvt', '1.0', true, auth.uid(), 'processing', '{"discipline": "survey", "capture_date": "2025-01-10", "point_count": 15000000}', '2025-01-12T11:00:00Z', NOW());

-- Sample Reality Capture data
INSERT INTO public.capture_sets (
    project_id,
    provider,
    capture_date,
    thumbnail_url,
    pano_url,
    pointcloud_url,
    progress_data,
    created_at
) VALUES
('11111111-1111-1111-1111-111111111111', 'matterport', '2024-12-20T10:00:00Z', '/captures/medical-center-thumb-20241220.jpg', '/captures/medical-center-pano-20241220.json', '/captures/medical-center-pointcloud-20241220.ply', '{"floors_captured": 6, "rooms_scanned": 234, "total_area_sqft": 125000}', '2024-12-20T15:00:00Z'),
('22222222-2222-2222-2222-222222222222', 'openspace', '2024-12-15T14:00:00Z', '/captures/corporate-campus-thumb-20241215.jpg', '/captures/corporate-campus-pano-20241215.json', '/captures/corporate-campus-pointcloud-20241215.ply', '{"floors_captured": 4, "rooms_scanned": 89, "total_area_sqft": 85000}', '2024-12-15T16:30:00Z'),
('33333333-3333-3333-3333-333333333333', 'leica', '2025-01-10T09:00:00Z', '/captures/tech-hub-existing-thumb-20250110.jpg', '/captures/tech-hub-existing-pano-20250110.json', '/captures/tech-hub-existing-pointcloud-20250110.las', '{"heritage_documentation": true, "accuracy_mm": 2, "total_area_sqft": 95000}', '2025-01-10T12:00:00Z');

-- Update project integrations to show various statuses for demo
UPDATE public.project_integrations 
SET 
  status = 'connected',
  last_sync = NOW() - INTERVAL '1 hour',
  sync_error = NULL,
  updated_at = NOW()
WHERE project_id IN ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555')
  AND provider IN ('procore', 'green_badger', 'iot_sensors');

UPDATE public.project_integrations 
SET 
  status = 'syncing',
  last_sync = NOW() - INTERVAL '10 minutes',
  sync_error = NULL,
  updated_at = NOW()
WHERE project_id = '22222222-2222-2222-2222-222222222222'
  AND provider = 'smartsheet';

UPDATE public.project_integrations 
SET 
  status = 'error',
  last_sync = NOW() - INTERVAL '2 days',
  sync_error = 'Authentication token expired. Please reconnect.',
  updated_at = NOW()
WHERE project_id = '33333333-3333-3333-3333-333333333333'
  AND provider = 'track3d';

-- Add some user notification preferences for the demo user
INSERT INTO public.user_notification_preferences (
    user_id,
    insight_frequency,
    email_notifications,
    push_notifications,
    created_at,
    updated_at
) VALUES (
    auth.uid(),
    'realtime',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    insight_frequency = EXCLUDED.insight_frequency,
    email_notifications = EXCLUDED.email_notifications,
    push_notifications = EXCLUDED.push_notifications,
    updated_at = NOW();

-- Sample audit logs for demo
INSERT INTO public.audit_logs (
    user_id,
    project_id,
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    ip_address,
    user_agent,
    created_at
) VALUES
(auth.uid(), '11111111-1111-1111-1111-111111111111', 'tasks', (SELECT id FROM public.tasks WHERE name LIKE 'MEP Rough-In%' LIMIT 1), 'UPDATE', '{"status": "not_started"}', '{"status": "in_progress"}', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '2 hours'),
(auth.uid(), '22222222-2222-2222-2222-222222222222', 'action_items', (SELECT id FROM public.action_items WHERE title LIKE 'Curtain Wall%' LIMIT 1), 'UPDATE', '{"status": "Open"}', '{"status": "Completed"}', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '1 day'),
(auth.uid(), '55555555-5555-5555-5555-555555555555', 'work_orders', (SELECT id FROM public.work_orders WHERE title LIKE 'Solar Panel%' LIMIT 1), 'INSERT', null, '{"title": "Solar Panel Cleaning", "status": "open"}', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '6 hours');

-- ================================================
-- SUMMARY: Sample data created for 5 realistic construction projects:
-- 1. Downtown Medical Center (In Construction) - Complex healthcare facility
-- 2. Riverside Corporate Campus (Design Phase) - Modern office complex  
-- 3. Tech Innovation Hub (Planning) - Historic renovation
-- 4. University Research Facility (Closeout) - Specialized research building
-- 5. Green Residential Complex (Construction) - Sustainable housing
--
-- Includes comprehensive data across all tables:
-- - Projects, tasks, budget items, RFIs, documents
-- - Action items, insights, communications
-- - Equipment, sensors, work orders, energy data
-- - BIM files, reality capture, integrations
-- - Reports, audit logs, user preferences
-- 
-- All data is realistic and represents typical construction scenarios
-- ================================================
