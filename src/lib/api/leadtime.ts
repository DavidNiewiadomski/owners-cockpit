import { supabase } from '@/lib/supabase';

export interface LeadTimeItem {
  id: string;
  rfp_id?: string;
  work_pkg: string;
  scope_csi: string[];
  rfq_issue_date: string;
  award_due: string;
  fab_lead_days: number;
  delivery_est: string;
  status: 'pending' | 'ontrack' | 'late' | 'delivered' | 'cancelled';
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  vendor_id?: string;
  contract_value?: number;
  actual_delivery_date?: string;
  delay_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadTimeSummary {
  total_items: number;
  pending_items: number;
  ontrack_items: number;
  late_items: number;
  delivered_items: number;
  avg_lead_days: number;
  critical_items: number;
  total_value: number;
}

export interface CreateLeadTimeData {
  rfp_id?: string;
  work_pkg: string;
  scope_csi: string[];
  rfq_issue_date: string;
  award_due: string;
  fab_lead_days: number;
  delivery_est: string;
  status?: 'pending' | 'ontrack' | 'late' | 'delivered' | 'cancelled';
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  vendor_id?: string;
  contract_value?: number;
  actual_delivery_date?: string;
  delay_reason?: string;
}

export interface UpdateLeadTimeData {
  work_pkg?: string;
  scope_csi?: string[];
  rfq_issue_date?: string;
  award_due?: string;
  fab_lead_days?: number;
  delivery_est?: string;
  status?: 'pending' | 'ontrack' | 'late' | 'delivered' | 'cancelled';
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  vendor_id?: string;
  contract_value?: number;
  actual_delivery_date?: string;
  delay_reason?: string;
}

export interface LeadTimeFilters {
  rfp_id?: string;
  status?: string[];
  priority?: string[];
  vendor_id?: string;
  overdue_only?: boolean;
  critical_only?: boolean;
}

class LeadTimeAPI {
  async getAllLeadTimes(filters?: LeadTimeFilters) {
    let query = supabase
      .from('lead_time')
      .select(`
        *,
        bid_projects!rfp_id (
          rfp_id,
          name,
          status
        ),
        company!vendor_id (
          id,
          company_name
        )
      `)
      .order('delivery_est', { ascending: true });

    // Apply filters
    if (filters?.rfp_id) {
      query = query.eq('rfp_id', filters.rfp_id);
    }

    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters?.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority);
    }

    if (filters?.vendor_id) {
      query = query.eq('vendor_id', filters.vendor_id);
    }

    if (filters?.overdue_only) {
      query = query.lt('delivery_est', new Date().toISOString().split('T')[0]);
    }

    if (filters?.critical_only) {
      query = query.eq('priority', 'critical');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching lead times:', error);
      throw error;
    }

    return { data, error: null };
  }

  async getLeadTimeById(id: string) {
    const { data, error } = await supabase
      .from('lead_time')
      .select(`
        *,
        bid_projects!rfp_id (
          rfp_id,
          name,
          status
        ),
        company!vendor_id (
          id,
          company_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lead time:', error);
      throw error;
    }

    return { data, error: null };
  }

  async getLeadTimeSummary(rfpId?: string) {
    const { data, error } = await supabase
      .rpc('get_lead_time_summary', { p_rfp_id: rfpId || null });

    if (error) {
      console.error('Error fetching lead time summary:', error);
      throw error;
    }

    return { data: data[0] as LeadTimeSummary, error: null };
  }

  async createLeadTime(leadTimeData: CreateLeadTimeData) {
    const { data, error } = await supabase
      .from('lead_time')
      .insert([leadTimeData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead time:', error);
      throw error;
    }

    return { data, error: null };
  }

  async updateLeadTime(id: string, updates: UpdateLeadTimeData) {
    const { data, error } = await supabase
      .from('lead_time')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead time:', error);
      throw error;
    }

    return { data, error: null };
  }

  async deleteLeadTime(id: string) {
    const { data, error } = await supabase
      .from('lead_time')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting lead time:', error);
      throw error;
    }

    return { data, error: null };
  }

  async bulkUpdateStatus(ids: string[], status: LeadTimeItem['status']) {
    const { data, error } = await supabase
      .from('lead_time')
      .update({ status })
      .in('id', ids)
      .select();

    if (error) {
      console.error('Error bulk updating lead time status:', error);
      throw error;
    }

    return { data, error: null };
  }

  async getUpcomingDeliveries(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const { data, error } = await supabase
      .from('lead_time')
      .select(`
        *,
        bid_projects!rfp_id (
          rfp_id,
          name,
          status
        ),
        company!vendor_id (
          id,
          company_name
        )
      `)
      .gte('delivery_est', new Date().toISOString().split('T')[0])
      .lte('delivery_est', futureDate.toISOString().split('T')[0])
      .in('status', ['pending', 'ontrack'])
      .order('delivery_est', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming deliveries:', error);
      throw error;
    }

    return { data, error: null };
  }

  async getCriticalPath(rfpId?: string) {
    let query = supabase
      .from('lead_time')
      .select(`
        *,
        bid_projects!rfp_id (
          rfp_id,
          name,
          status
        ),
        company!vendor_id (
          id,
          company_name
        )
      `)
      .eq('priority', 'critical')
      .order('delivery_est', { ascending: true });

    if (rfpId) {
      query = query.eq('rfp_id', rfpId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching critical path:', error);
      throw error;
    }

    return { data, error: null };
  }

  async getVendorLeadTimes(vendorId: string) {
    const { data, error } = await supabase
      .from('lead_time')
      .select(`
        *,
        bid_projects!rfp_id (
          rfp_id,
          name,
          status
        )
      `)
      .eq('vendor_id', vendorId)
      .order('delivery_est', { ascending: true });

    if (error) {
      console.error('Error fetching vendor lead times:', error);
      throw error;
    }

    return { data, error: null };
  }

  // Subscribe to lead time updates
  subscribeToLeadTimeUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('lead_time_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_time'
        },
        callback
      )
      .subscribe();
  }
}

export const leadTimeAPI = new LeadTimeAPI();
