-- Fix construction-specific data with correct column names

-- Construction Daily Progress (corrected columns)
INSERT INTO construction_daily_progress (project_id, date, planned_progress, actual_progress, workforce_count) VALUES
-- Downtown Office Building construction progress
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-15', 53.5, 53.8, 148),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-14', 53.3, 53.5, 145),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-13', 53.1, 53.2, 150),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-12', 52.8, 53.1, 155),
('a4ca8398-53b0-4791-bef3-fa2d3ca18e79', '2024-12-11', 52.5, 52.8, 142),
-- Downtown Office Complex construction progress  
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-15', 70.0, 70.5, 228),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-14', 69.7, 70.2, 225),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-13', 69.4, 69.8, 230),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-12', 69.1, 69.6, 235),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2024-12-11', 68.8, 69.3, 222),
-- Riverside Residential Complex daily progress
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-15', 9.3, 9.7, 28),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-14', 9.1, 9.5, 25),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-13', 8.9, 9.3, 30),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-12', 8.7, 9.1, 35),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', '2024-12-11', 8.5, 8.9, 22);

-- Check what columns exist in construction_trade_progress
\d construction_trade_progress;

-- Check what columns exist in construction_activities  
\d construction_activities;

-- Check what columns exist in construction_quality_metrics
\d construction_quality_metrics;

-- Check what columns exist in material_deliveries
\d material_deliveries;

-- Check what columns exist in safety_metrics
\d safety_metrics;

-- Check what columns exist in safety_training
\d safety_training;
