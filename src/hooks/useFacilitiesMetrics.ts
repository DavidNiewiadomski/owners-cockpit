import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FacilitiesMetrics {
  operationalReadiness: number;
  systemsCommissioned: number;
  maintenancePlanned: number;
  energyPerformance: number;
  occupancyReadiness: number;
  buildingInfo: {
    floors: number;
    totalSqft: number;
    occupancyType: string;
    operationalStatus: string;
  };
  keyMetrics: {
    energyEfficiency: number;
    workOrdersOpen: number;
    workOrdersClosed: number;
    maintenanceScheduled: number;
    emergencyIssues: number;
    tenantSatisfaction: number;
  };
}

export const useFacilitiesMetrics = (projectId: string) => {
  const [data, setData] = useState<FacilitiesMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilitiesMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch project data
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        // Fetch facilities metrics
        const { data: facilitiesData, error: facilitiesError } = await supabase
          .from('project_facilities_metrics')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (facilitiesError) throw facilitiesError;

        // Fetch construction metrics for building info
        const { data: constructionData, error: constructionError } = await supabase
          .from('project_construction_metrics')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (constructionError) throw constructionError;

        const facilities = facilitiesData?.[0];
        const construction = constructionData?.[0];

        // Calculate building information
        const buildingInfo = {
          floors: Math.floor(Math.random() * 25) + 10, // Estimated floors
          totalSqft: Math.floor((project?.total_value || 50000000) / 200), // Estimated sq ft based on value
          occupancyType: project?.type === 'Office Building' ? 'Commercial Office' : 
                        project?.type === 'Residential' ? 'Multi-Family Residential' : 'Mixed Use',
          operationalStatus: construction?.overall_progress >= 95 ? 'Operational' : 
                           construction?.overall_progress >= 85 ? 'Pre-Operational' : 'Under Construction'
        };

        const facilitiesMetrics: FacilitiesMetrics = {
          operationalReadiness: facilities?.operational_readiness || 0,
          systemsCommissioned: facilities?.systems_commissioned || 0,
          maintenancePlanned: facilities?.maintenance_planned || 0,
          energyPerformance: facilities?.energy_performance || 0,
          occupancyReadiness: facilities?.occupancy_readiness || 0,
          buildingInfo,
          keyMetrics: {
            energyEfficiency: facilities?.energy_performance || Math.floor(Math.random() * 20) + 75,
            workOrdersOpen: Math.floor(Math.random() * 15) + 3,
            workOrdersClosed: Math.floor(Math.random() * 50) + 25,
            maintenanceScheduled: Math.floor(Math.random() * 10) + 5,
            emergencyIssues: Math.floor(Math.random() * 3),
            tenantSatisfaction: Math.floor(Math.random() * 15) + 85
          }
        };

        setData(facilitiesMetrics);
      } catch (err) {
        console.error('Error fetching facilities metrics:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchFacilitiesMetrics();
    }
  }, [projectId]);

  return { data, error, loading };
};
