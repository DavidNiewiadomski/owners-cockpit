
-- Insert sample BIM file record for testing
INSERT INTO public.bim_files (
  project_id,
  filename,
  file_path,
  file_type,
  file_size,
  is_active
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'sample_office_building.ifc',
  '11111111-1111-1111-1111-111111111111/sample_office_building.ifc',
  'ifc',
  2048576,
  true
) ON CONFLICT DO NOTHING;

-- Insert sample capture sets for reality capture testing
INSERT INTO public.capture_sets (
  project_id,
  provider,
  capture_date,
  thumbnail_url,
  pano_url,
  pointcloud_url,
  progress_data
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Track3D',
  NOW() - INTERVAL '2 days',
  'https://picsum.photos/400/300?random=1',
  'https://pannellum.org/images/alma.jpg',
  'https://example.com/pointcloud1.ply',
  '{"completion": 85, "quality": "high", "scan_points": 2500000}'
),
(
  '11111111-1111-1111-1111-111111111111',
  'OpenSpace',
  NOW() - INTERVAL '5 days',
  'https://picsum.photos/400/300?random=2',
  'https://pannellum.org/images/cerro-toco-0.jpg',
  'https://example.com/pointcloud2.ply',
  '{"completion": 92, "quality": "high", "scan_points": 3200000}'
);
