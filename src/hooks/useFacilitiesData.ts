
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Equipment {
  id: string;
  project_id: string;
  name: string;
  equipment_type: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  location: string;
  installation_date?: string;
  warranty_expiration?: string;
  status: string;
  specifications?: unknown;
  created_at?: string;
  updated_at?: string;
}

export interface WorkOrder {
  id: string;
  project_id: string;
  equipment_id?: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  work_type: string;
  assigned_to?: string;
  requested_by?: string;
  due_date?: string;
  completed_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  cost?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BuildingSystem {
  id: string;
  project_id: string;
  system_name: string;
  system_type: string;
  status: string;
  uptime_percentage?: number;
  last_maintenance?: string;
  next_maintenance?: string;
  energy_consumption?: number;
  efficiency_rating?: number;
  alerts_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Sensor {
  id: string;
  equipment_id?: string;
  project_id: string;
  sensor_type: string;
  name: string;
  location: string;
  unit?: string;
  min_threshold?: number;
  max_threshold?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  value: number;
  timestamp: string;
  status?: string;
  metadata?: unknown;
}

export function useEquipment(projectId: string) {
  return useQuery({
    queryKey: ['equipment', projectId],
    queryFn: async (): Promise<Equipment[]> => {
      console.log('Fetching equipment for project:', projectId);
      
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('project_id', projectId)
        .order('name');

      if (error) {
        console.error('Error fetching equipment:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useWorkOrders(projectId: string) {
  return useQuery({
    queryKey: ['work_orders', projectId],
    queryFn: async (): Promise<WorkOrder[]> => {
      console.log('Fetching work orders for project:', projectId);
      
      const { data, error } = await supabase
        .from('work_orders')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching work orders:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useBuildingSystems(projectId: string) {
  return useQuery({
    queryKey: ['building_systems', projectId],
    queryFn: async (): Promise<BuildingSystem[]> => {
      console.log('Fetching building systems for project:', projectId);
      
      const { data, error } = await supabase
        .from('building_systems')
        .select('*')
        .eq('project_id', projectId)
        .order('system_name');

      if (error) {
        console.error('Error fetching building systems:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useSensors(projectId: string) {
  return useQuery({
    queryKey: ['sensors', projectId],
    queryFn: async (): Promise<Sensor[]> => {
      console.log('Fetching sensors for project:', projectId);
      
      const { data, error } = await supabase
        .from('sensors')
        .select('*')
        .eq('project_id', projectId)
        .order('name');

      if (error) {
        console.error('Error fetching sensors:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!projectId,
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workOrderData: Omit<WorkOrder, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating work order:', workOrderData);
      
      const { data, error } = await supabase
        .from('work_orders')
        .insert([workOrderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating work order:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['work_orders', data.project_id] });
    },
  });
}

export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WorkOrder> }) => {
      console.log('Updating work order:', id, updates);
      
      const { data, error } = await supabase
        .from('work_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating work order:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['work_orders', data.project_id] });
    },
  });
}
