
-- Create equipment table for tracking building assets
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  name VARCHAR NOT NULL,
  equipment_type VARCHAR NOT NULL, -- 'hvac', 'electrical', 'plumbing', 'security', 'elevator', 'lighting'
  manufacturer VARCHAR,
  model VARCHAR,
  serial_number VARCHAR,
  location VARCHAR NOT NULL,
  installation_date DATE,
  warranty_expiration DATE,
  status VARCHAR NOT NULL DEFAULT 'operational', -- 'operational', 'maintenance', 'offline', 'error'
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sensors table for IoT sensor data
CREATE TABLE public.sensors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  sensor_type VARCHAR NOT NULL, -- 'temperature', 'humidity', 'pressure', 'vibration', 'energy', 'occupancy'
  name VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  unit VARCHAR, -- 'celsius', 'fahrenheit', 'percent', 'psi', 'kwh', 'count'
  min_threshold NUMERIC,
  max_threshold NUMERIC,
  status VARCHAR NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sensor_readings table for time-series data
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sensor_id UUID NOT NULL REFERENCES sensors(id),
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR DEFAULT 'normal', -- 'normal', 'warning', 'critical'
  metadata JSONB DEFAULT '{}'
);

-- Create work_orders table for maintenance management
CREATE TABLE public.work_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  equipment_id UUID REFERENCES equipment(id),
  title VARCHAR NOT NULL,
  description TEXT,
  priority VARCHAR NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status VARCHAR NOT NULL DEFAULT 'open', -- 'open', 'assigned', 'in_progress', 'completed', 'cancelled'
  work_type VARCHAR NOT NULL, -- 'preventive', 'corrective', 'emergency', 'inspection'
  assigned_to VARCHAR,
  requested_by VARCHAR,
  due_date DATE,
  completed_date DATE,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  cost NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create building_systems table for system-level monitoring
CREATE TABLE public.building_systems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  system_name VARCHAR NOT NULL,
  system_type VARCHAR NOT NULL, -- 'hvac', 'electrical', 'plumbing', 'security', 'fire_safety'
  status VARCHAR NOT NULL DEFAULT 'operational',
  uptime_percentage NUMERIC DEFAULT 100,
  last_maintenance DATE,
  next_maintenance DATE,
  energy_consumption NUMERIC DEFAULT 0, -- current consumption
  efficiency_rating NUMERIC, -- 0-100 scale
  alerts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create maintenance_schedules table for preventive maintenance
CREATE TABLE public.maintenance_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES equipment(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  schedule_name VARCHAR NOT NULL,
  frequency_type VARCHAR NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'annually'
  frequency_interval INTEGER DEFAULT 1,
  last_performed DATE,
  next_due DATE NOT NULL,
  estimated_duration NUMERIC, -- hours
  description TEXT,
  checklist JSONB DEFAULT '[]',
  auto_generate_wo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create energy_consumption table for tracking usage
CREATE TABLE public.energy_consumption (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  meter_type VARCHAR NOT NULL, -- 'electricity', 'gas', 'water'
  reading_date DATE NOT NULL,
  consumption NUMERIC NOT NULL,
  unit VARCHAR NOT NULL, -- 'kwh', 'therms', 'gallons'
  cost NUMERIC,
  baseline NUMERIC, -- expected consumption
  efficiency_score NUMERIC, -- 0-100 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_sensor_readings_sensor_timestamp ON sensor_readings(sensor_id, timestamp DESC);
CREATE INDEX idx_work_orders_project_status ON work_orders(project_id, status);
CREATE INDEX idx_equipment_project_type ON equipment(project_id, equipment_type);
CREATE INDEX idx_sensors_project_type ON sensors(project_id, sensor_type);
CREATE INDEX idx_energy_consumption_project_date ON energy_consumption(project_id, reading_date DESC);

-- Add RLS policies
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_consumption ENABLE ROW LEVEL SECURITY;

-- Equipment policies
CREATE POLICY "Users can view equipment for their projects" ON equipment
  FOR SELECT USING (has_project_access(project_id));
CREATE POLICY "Users can manage equipment for their projects" ON equipment
  FOR ALL USING (has_project_access(project_id));

-- Sensors policies
CREATE POLICY "Users can view sensors for their projects" ON sensors
  FOR SELECT USING (has_project_access(project_id));
CREATE POLICY "Users can manage sensors for their projects" ON sensors
  FOR ALL USING (has_project_access(project_id));

-- Sensor readings policies
CREATE POLICY "Users can view sensor readings for their projects" ON sensor_readings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sensors s 
      WHERE s.id = sensor_readings.sensor_id 
      AND has_project_access(s.project_id)
    )
  );
CREATE POLICY "Users can insert sensor readings for their projects" ON sensor_readings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM sensors s 
      WHERE s.id = sensor_readings.sensor_id 
      AND has_project_access(s.project_id)
    )
  );

-- Work orders policies
CREATE POLICY "Users can view work orders for their projects" ON work_orders
  FOR SELECT USING (has_project_access(project_id));
CREATE POLICY "Users can manage work orders for their projects" ON work_orders
  FOR ALL USING (has_project_access(project_id));

-- Building systems policies
CREATE POLICY "Users can view building systems for their projects" ON building_systems
  FOR SELECT USING (has_project_access(project_id));
CREATE POLICY "Users can manage building systems for their projects" ON building_systems
  FOR ALL USING (has_project_access(project_id));

-- Maintenance schedules policies
CREATE POLICY "Users can view maintenance schedules for their projects" ON maintenance_schedules
  FOR SELECT USING (has_project_access(project_id));
CREATE POLICY "Users can manage maintenance schedules for their projects" ON maintenance_schedules
  FOR ALL USING (has_project_access(project_id));

-- Energy consumption policies
CREATE POLICY "Users can view energy consumption for their projects" ON energy_consumption
  FOR SELECT USING (has_project_access(project_id));
CREATE POLICY "Users can manage energy consumption for their projects" ON energy_consumption
  FOR ALL USING (has_project_access(project_id));

-- Add triggers for updated_at columns
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sensors_updated_at BEFORE UPDATE ON sensors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_building_systems_updated_at BEFORE UPDATE ON building_systems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_schedules_updated_at BEFORE UPDATE ON maintenance_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
