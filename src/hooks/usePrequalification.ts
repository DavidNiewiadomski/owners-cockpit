import { useState, useEffect } from 'react';
import { prequalificationAPI } from '@/lib/api/prequalification';
import type { 
  PrequalSummary, 
  PrequalDashboardData, 
  VendorPortalData, 
  Prequalification,
  PrequalFilters,
  PrequalSort 
} from '@/types/prequalification';

export const usePrequalifications = (
  filters?: PrequalFilters,
  sort?: PrequalSort,
  page = 1,
  limit = 20
) => {
  const [prequalifications, setPrequalifications] = useState<PrequalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page,
    per_page: limit,
    total: 0,
    total_pages: 0
  });

  const loadPrequalifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prequalificationAPI.getPrequalifications(
        filters,
        sort,
        page,
        limit
      );
      setPrequalifications(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prequalifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrequalifications();
  }, [filters, sort, page, limit]);

  return {
    prequalifications,
    loading,
    error,
    pagination,
    refetch: loadPrequalifications
  };
};

export const usePrequalification = (id: string) => {
  const [prequalification, setPrequalification] = useState<Prequalification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrequalification = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prequalificationAPI.getPrequalification(id);
      setPrequalification(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prequalification');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPrequalification();
    }
  }, [id]);

  return {
    prequalification,
    loading,
    error,
    refetch: loadPrequalification
  };
};

export const usePrequalDashboard = () => {
  const [dashboardData, setDashboardData] = useState<PrequalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prequalificationAPI.getDashboardData();
      setDashboardData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refetch: loadDashboardData
  };
};

export const useVendorPortal = (companyId: string) => {
  const [vendorData, setVendorData] = useState<VendorPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prequalificationAPI.getVendorPortalData(companyId);
      setVendorData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadVendorData();
    }
  }, [companyId]);

  return {
    vendorData,
    loading,
    error,
    refetch: loadVendorData
  };
};
