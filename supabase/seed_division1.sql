-- Seed script for Division 1 Dashboard with Billing and Payments

DO $$
DECLARE
    division1_project_id UUID := 'a9133200-b56f-47cf-be42-a501637b49f5';
BEGIN
    -- Disable RLS for seeding Division 1 data
    ALTER TABLE division1_sections DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow DISABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend DISABLE ROW LEVEL SECURITY;
    
    -- Clear existing data for Division 1 sections
    DELETE FROM division1_sections;
    DELETE FROM project_transactions;
    DELETE FROM project_cash_flow;
    DELETE FROM project_monthly_spend;
    
    -- Division 1 Sections
    INSERT INTO division1_sections (project_id, section_number, title, status, due_date, docs_on_file, required_docs, priority, completion_percentage) VALUES
    (division1_project_id, '01 10 00', 'Summary', 'completed', '2025-05-15', 8, 8, 'high', 100.0),
    (division1_project_id, '01 20 00', 'Price and Payment Procedures', 'in_progress', '2025-07-30', 12, 15, 'high', 80.0),
    (division1_project_id, '01 30 00', 'Administrative Requirements', 'in_progress', '2025-07-15', 18, 22, 'medium', 81.8),
    (division1_project_id, '01 40 00', 'Quality Requirements', 'pending', '2025-08-15', 5, 12, 'high', 41.7),
    (division1_project_id, '01 50 00', 'Temporary Facilities and Controls', 'completed', '2025-06-01', 14, 14, 'medium', 100.0),
    (division1_project_id, '01 60 00', 'Product Requirements', 'in_progress', '2025-07-20', 9, 16, 'medium', 56.3),
    (division1_project_id, '01 70 00', 'Execution and Closeout Requirements', 'pending', '2025-09-01', 3, 18, 'high', 16.7),
    (division1_project_id, '01 80 00', 'Performance Requirements', 'pending', '2025-08-30', 2, 10, 'medium', 20.0);
    
    -- Project Transactions (Billing & Payments)
    INSERT INTO project_transactions (project_id, transaction_date, description, vendor, amount, category, status) VALUES
    (division1_project_id, '2025-06-15', 'Initial Contract Payment', 'Turner Construction', 500000, 'Payment', 'Completed'),
    (division1_project_id, '2025-06-20', 'Progress Billing #1', 'General Contractor', 750000, 'Billing', 'Completed'),
    (division1_project_id, '2025-06-25', 'Steel Supplier Payment', 'ABC Steel Corp', -250000, 'Payment', 'Pending'),
    (division1_project_id, '2025-06-28', 'Progress Billing #2', 'General Contractor', 500000, 'Billing', 'Completed'),
    (division1_project_id, '2025-06-30', 'Consultant Fee', 'XYZ Engineering', -150000, 'Payment', 'Completed'),
    (division1_project_id, '2025-07-01', 'Division 1 Admin Fee', 'Project Management', 75000, 'Fee', 'Pending');

    -- Project Cash Flow
    INSERT INTO project_cash_flow (project_id, month, inflow, outflow, cumulative) VALUES
    (division1_project_id, '2025-06', 3000000, 2750000, 250000),
    (division1_project_id, '2025-05', 3200000, 3100000, 350000);

    -- Project Monthly Spend
    INSERT INTO project_monthly_spend (project_id, month, budget, actual, forecast) VALUES
    (division1_project_id, '2025-06', 3000000, 2750000, 2850000),
    (division1_project_id, '2025-05', 3200000, 3100000, 3150000);
    
    -- Re-enable RLS for Division 1 tables
    ALTER TABLE division1_sections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_cash_flow ENABLE ROW LEVEL SECURITY;
    ALTER TABLE project_monthly_spend ENABLE ROW LEVEL SECURITY;

END $$;
