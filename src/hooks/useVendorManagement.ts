import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Vendor {
  id: string;
  name: string;
  company_type: 'gc' | 'subcontractor' | 'supplier' | 'manufacturer';
  license_number?: string;
  bonding_capacity?: number;
  insurance_limits?: Record<string, any>;
  certifications?: string[];
  minority_owned: boolean;
  woman_owned: boolean;
  veteran_owned: boolean;
  small_business: boolean;
  contact_info?: Record<string, any>;
  performance_history?: Record<string, any>;
  prequalification_status: 'approved' | 'pending' | 'rejected' | 'expired';
  prequalification_expiry?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorRequest {
  name: string;
  company_type: 'gc' | 'subcontractor' | 'supplier' | 'manufacturer';
  license_number?: string;
  bonding_capacity?: number;
  insurance_limits?: Record<string, any>;
  certifications?: string[];
  minority_owned?: boolean;
  woman_owned?: boolean;
  veteran_owned?: boolean;
  small_business?: boolean;
  contact_info?: Record<string, any>;
  performance_history?: Record<string, any>;
  prequalification_status?: 'approved' | 'pending' | 'rejected' | 'expired';
  prequalification_expiry?: string;
}

export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {}

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('bid_vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setVendors(data || []);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return { vendors, loading, error, refetch: fetchVendors };
}

export function useVendor(vendorId: string) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVendor() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('bid_vendors')
          .select('*')
          .eq('id', vendorId)
          .single();

        if (error) throw error;
        setVendor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  return { vendor, loading, error };
}

export function useVendorMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVendor = async (request: CreateVendorRequest): Promise<Vendor | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('bid_vendors')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVendor = async (vendorId: string, request: UpdateVendorRequest): Promise<Vendor | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('bid_vendors')
        .update(request)
        .eq('id', vendorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (vendorId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('bid_vendors')
        .delete()
        .eq('id', vendorId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createVendor, updateVendor, deleteVendor, loading, error };
}

export function useVendorPrequalification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePrequalificationStatus = async (
    vendorId: string, 
    status: 'approved' | 'pending' | 'rejected' | 'expired',
    expiryDate?: string
  ): Promise<Vendor | null> => {
    try {
      setLoading(true);
      setError(null);

      const updateData: UpdateVendorRequest = {
        prequalification_status: status,
        ...(expiryDate && { prequalification_expiry: expiryDate })
      };

      const { data, error } = await supabase
        .from('bid_vendors')
        .update(updateData)
        .eq('id', vendorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPrequalifiedVendors = async (): Promise<Vendor[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('bid_vendors')
        .select('*')
        .eq('prequalification_status', 'approved')
        .gt('prequalification_expiry', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { updatePrequalificationStatus, getPrequalifiedVendors, loading, error };
}
