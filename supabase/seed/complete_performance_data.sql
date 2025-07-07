-- Complete Performance Scorecard Sample Data
-- This creates a full dataset for testing all UI functionality

-- First, ensure we have companies if they don't exist
INSERT INTO companies (id, name, type, industry, procore_company_id, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Metropolitan Steel Works', 'subcontractor', 'Construction', 'pc_12345', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Premier Concrete Co.', 'subcontractor', 'Construction', 'pc_23456', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Advanced MEP Solutions', 'subcontractor', 'Construction', 'pc_34567', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Glass Tech Systems', 'subcontractor', 'Construction', 'pc_45678', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Elite Electrical Corp', 'subcontractor', 'Construction', 'pc_56789', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
type = EXCLUDED.type,
industry = EXCLUDED.industry,
procore_company_id = EXCLUDED.procore_company_id,
updated_at = NOW();

-- Ensure we have projects if they don't exist
INSERT INTO projects (id, name, status, procore_project_id, created_at, updated_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Downtown Tower Project', 'active', 'proj_12345', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Corporate Campus Phase 2', 'active', 'proj_23456', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
status = EXCLUDED.status,
procore_project_id = EXCLUDED.procore_project_id,
updated_at = NOW();

-- Clear existing performance data for clean slate
DELETE FROM performance_kpi WHERE company_id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555'
);

-- Metropolitan Steel Works - Q4-2024 (Excellent Performance)
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 95.8, 'Q4-2024', 'Quality Inspections', 'Consistently high quality deliverables'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'on_time_delivery', 98.2, 'Q4-2024', 'Project Management', 'Excellent schedule adherence'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'budget_adherence', 99.1, 'Q4-2024', 'Financial Reports', 'Under budget performance'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'safety_incidents', 0, 'Q4-2024', 'Safety Reports', 'Zero incidents this quarter'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer_satisfaction', 4.9, 'Q4-2024', 'Customer Survey', 'Outstanding satisfaction rating'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'response_time', 1.5, 'Q4-2024', 'Issue Tracking', 'Very responsive to issues'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'change_order_rate', 3.2, 'Q4-2024', 'Contract Management', 'Minimal change orders'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'defect_rate', 0.8, 'Q4-2024', 'Quality Control', 'Very low defect rate'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cost_variance', -1.2, 'Q4-2024', 'Cost Analysis', 'Under budget by 1.2%'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'schedule_variance', -2.1, 'Q4-2024', 'Schedule Analysis', 'Ahead of schedule');

-- Metropolitan Steel Works - Q3-2024 (Good Performance)
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 92.5, 'Q3-2024', 'Quality Inspections', 'Good quality with minor improvements'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'on_time_delivery', 94.1, 'Q3-2024', 'Project Management', 'Generally on schedule'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'budget_adherence', 96.8, 'Q3-2024', 'Financial Reports', 'Within acceptable variance'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'safety_incidents', 1, 'Q3-2024', 'Safety Reports', 'One minor incident'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer_satisfaction', 4.6, 'Q3-2024', 'Customer Survey', 'Good satisfaction level');

-- Premier Concrete Co. - Q4-2024 (Excellent Performance)
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 97.2, 'Q4-2024', 'Quality Inspections', 'Superior concrete quality and finish'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'on_time_delivery', 99.5, 'Q4-2024', 'Project Management', 'Exceptional schedule performance'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'budget_adherence', 98.7, 'Q4-2024', 'Financial Reports', 'Excellent cost control'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'safety_incidents', 0, 'Q4-2024', 'Safety Reports', 'Perfect safety record'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer_satisfaction', 4.8, 'Q4-2024', 'Customer Survey', 'High satisfaction rating'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'response_time', 2.1, 'Q4-2024', 'Issue Tracking', 'Quick response to issues'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'change_order_rate', 2.8, 'Q4-2024', 'Contract Management', 'Very low change orders'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'defect_rate', 0.5, 'Q4-2024', 'Quality Control', 'Exceptional quality control'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cost_variance', 0.3, 'Q4-2024', 'Cost Analysis', 'Minimal cost variance'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'schedule_variance', -1.5, 'Q4-2024', 'Schedule Analysis', 'Slightly ahead of schedule');

-- Advanced MEP Solutions - Q4-2024 (Average Performance with Issues)
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 78.5, 'Q4-2024', 'Quality Inspections', 'Quality issues requiring attention'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'on_time_delivery', 82.3, 'Q4-2024', 'Project Management', 'Schedule delays on multiple items'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'budget_adherence', 85.2, 'Q4-2024', 'Financial Reports', 'Significant cost overruns'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'safety_incidents', 3, 'Q4-2024', 'Safety Reports', 'Three safety incidents this quarter'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer_satisfaction', 3.8, 'Q4-2024', 'Customer Survey', 'Below average satisfaction'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'response_time', 8.5, 'Q4-2024', 'Issue Tracking', 'Slow response to issues'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'change_order_rate', 18.7, 'Q4-2024', 'Contract Management', 'High change order rate'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'defect_rate', 7.2, 'Q4-2024', 'Quality Control', 'Higher than acceptable defect rate'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cost_variance', 12.8, 'Q4-2024', 'Cost Analysis', 'Significant cost overrun'),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'schedule_variance', 15.2, 'Q4-2024', 'Schedule Analysis', 'Behind schedule');

-- Glass Tech Systems - Q4-2024 (Good Performance)
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 89.7, 'Q4-2024', 'Quality Inspections', 'Good quality glazing work'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'on_time_delivery', 91.8, 'Q4-2024', 'Project Management', 'Generally meeting deadlines'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'budget_adherence', 93.4, 'Q4-2024', 'Financial Reports', 'Reasonable cost control'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'safety_incidents', 1, 'Q4-2024', 'Safety Reports', 'One minor glazing incident'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer_satisfaction', 4.3, 'Q4-2024', 'Customer Survey', 'Good satisfaction level'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'response_time', 4.2, 'Q4-2024', 'Issue Tracking', 'Acceptable response time'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'change_order_rate', 8.1, 'Q4-2024', 'Contract Management', 'Moderate change orders'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'defect_rate', 3.5, 'Q4-2024', 'Quality Control', 'Acceptable defect rate'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cost_variance', 6.2, 'Q4-2024', 'Cost Analysis', 'Moderate cost variance'),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'schedule_variance', 3.8, 'Q4-2024', 'Schedule Analysis', 'Minor schedule delays');

-- Elite Electrical Corp - Q4-2024 (Excellent Performance)
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 94.3, 'Q4-2024', 'Quality Inspections', 'High-quality electrical installations'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'on_time_delivery', 96.7, 'Q4-2024', 'Project Management', 'Excellent schedule performance'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'budget_adherence', 97.9, 'Q4-2024', 'Financial Reports', 'Strong cost control'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'safety_incidents', 0, 'Q4-2024', 'Safety Reports', 'Perfect safety record'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer_satisfaction', 4.7, 'Q4-2024', 'Customer Survey', 'High satisfaction rating'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'response_time', 1.8, 'Q4-2024', 'Issue Tracking', 'Very responsive service'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'change_order_rate', 4.1, 'Q4-2024', 'Contract Management', 'Low change order rate'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'defect_rate', 1.2, 'Q4-2024', 'Quality Control', 'Low defect rate'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cost_variance', 1.1, 'Q4-2024', 'Cost Analysis', 'Minimal cost variance'),
('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'schedule_variance', -0.8, 'Q4-2024', 'Schedule Analysis', 'Slightly ahead of schedule');

-- Historical trend data for Q1-Q3 2024 for trend analysis
-- Metropolitan Steel Works trends
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 88.2, 'Q1-2024', 'Quality Inspections', 'Improving quality trend'),
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 90.5, 'Q2-2024', 'Quality Inspections', 'Continued improvement');

-- Premier Concrete Co. trends
INSERT INTO performance_kpi (company_id, project_id, metric, value, period, source, notes) VALUES
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 95.1, 'Q1-2024', 'Quality Inspections', 'Consistently high quality'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 96.3, 'Q2-2024', 'Quality Inspections', 'Maintaining excellence'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'quality_score', 96.8, 'Q3-2024', 'Quality Inspections', 'Peak performance');

-- Sample performance summaries (AI-generated content)
INSERT INTO performance_summaries (company_id, period, summary, overall_score, generated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Q4-2024', 
'# Metropolitan Steel Works - Q4 2024 Performance Brief

## Executive Summary
Metropolitan Steel Works has demonstrated exceptional performance in Q4 2024, achieving an overall score of 95.2/100. This represents a significant improvement from the previous quarter and establishes them as a top-tier performer in structural steel fabrication and installation.

## Key Performance Indicators
- **Quality Score**: 95.8% - Consistently delivering high-quality structural elements
- **On-Time Delivery**: 98.2% - Exceptional schedule adherence with minimal delays
- **Budget Adherence**: 99.1% - Outstanding cost control, finishing under budget
- **Safety Record**: Zero incidents - Perfect safety performance this quarter
- **Customer Satisfaction**: 4.9/5 - Highest satisfaction rating achieved

## Strengths
1. **Safety Excellence**: Zero safety incidents demonstrates strong safety culture
2. **Cost Management**: Consistent under-budget performance shows excellent project control
3. **Quality Delivery**: High-quality work with minimal defects or rework
4. **Schedule Reliability**: Exceptional on-time delivery builds client confidence

## Areas for Improvement
1. **Response Time**: While good at 1.5 hours, could aim for sub-hour response
2. **Change Order Management**: Continue to minimize change orders through better planning

## Risk Assessment
**Low Risk** - All indicators show strong performance with positive trends. No significant risks identified.

## Action Items
1. Continue current quality management practices
2. Share safety best practices with other contractors
3. Maintain current project management methodologies
4. Consider expanding capacity for additional projects', 95.2, NOW()),

('33333333-3333-3333-3333-333333333333', 'Q4-2024',
'# Advanced MEP Solutions - Q4 2024 Performance Brief

## Executive Summary
Advanced MEP Solutions has experienced performance challenges in Q4 2024, achieving an overall score of 71.8/100. This represents a decline from previous periods and requires immediate attention to address systemic issues.

## Key Performance Indicators
- **Quality Score**: 78.5% - Below acceptable standards, requiring improvement
- **On-Time Delivery**: 82.3% - Significant schedule delays impacting project timeline
- **Budget Adherence**: 85.2% - Cost overruns affecting project profitability
- **Safety Record**: 3 incidents - Safety performance requires immediate attention
- **Customer Satisfaction**: 3.8/5 - Below average satisfaction indicates service issues

## Strengths
1. **Technical Expertise**: Capable of handling complex MEP installations
2. **Equipment Resources**: Well-equipped for large-scale projects

## Areas for Improvement
1. **Quality Control**: Implement enhanced QA/QC procedures
2. **Project Management**: Strengthen schedule and cost management
3. **Safety Culture**: Immediate safety training and culture improvement needed
4. **Communication**: Improve response times and client communication

## Risk Assessment
**High Risk** - Multiple performance indicators below standards. Requires performance improvement plan.

## Action Items
1. **Immediate**: Conduct safety audit and implement corrective measures
2. **30 Days**: Develop and implement quality improvement plan
3. **60 Days**: Review and strengthen project management procedures
4. **90 Days**: Performance review and reassessment of contractor status', 71.8, NOW());

-- Create some sample events for the event system
INSERT INTO events (type, company_id, period, metadata, timestamp) VALUES
('kpi.updated', '11111111-1111-1111-1111-111111111111', 'Q4-2024', '{"source": "kpi-collector", "automated": true, "metrics_updated": 10}', NOW() - INTERVAL '1 hour'),
('kpi.updated', '22222222-2222-2222-2222-222222222222', 'Q4-2024', '{"source": "kpi-collector", "automated": true, "metrics_updated": 10}', NOW() - INTERVAL '2 hours'),
('kpi.updated', '33333333-3333-3333-3333-333333333333', 'Q4-2024', '{"source": "kpi-collector", "automated": true, "metrics_updated": 10}', NOW() - INTERVAL '3 hours'),
('kpi.batch_updated', NULL, 'Q4-2024', '{"source": "kpi-collector", "automated": true, "batch_size": 5, "companies": ["11111111-1111-1111-1111-111111111111", "22222222-2222-2222-2222-222222222222", "33333333-3333-3333-3333-333333333333", "44444444-4444-4444-4444-444444444444", "55555555-5555-5555-5555-555555555555"]}', NOW() - INTERVAL '4 hours');
