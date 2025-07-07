import { supabase } from '@/lib/supabase';

// Types
export interface KPITemplate {
  metric: string;
  target_direction: 'up' | 'down';
  weight: number;
  description?: string;
  unit?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PerformanceKPI {
  id: string;
  company_id: string;
  project_id?: string;
  metric: string;
  value: number;
  period: string;
  source?: string;
  notes?: string;
  captured_at: string;
  created_at: string;
  updated_at: string;
  // Joined data
  kpi_template?: KPITemplate;
}

export interface PerformanceScorecard {
  company_id: string;
  company_name: string;
  period: string;
  overall_score: number;
  kpis: PerformanceKPI[];
  trend?: 'up' | 'down' | 'stable';
  previous_score?: number;
}

export interface CreateKPIData {
  company_id: string;
  project_id?: string;
  metric: string;
  value: number;
  period: string;
  source?: string;
  notes?: string;
}

export interface UpdateKPIData {
  value?: number;
  source?: string;
  notes?: string;
}

class PerformanceAPI {
  // KPI Templates
  async getKPITemplates(): Promise<{ data: KPITemplate[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('kpi_template')
        .select('*')
        .order('metric');

      return { data: data || [], error };
    } catch (error) {
      console.error('Error fetching KPI templates:', error);
      return { data: [], error };
    }
  }

  async createKPITemplate(template: Omit<KPITemplate, 'created_at' | 'updated_at'>): Promise<{ data: KPITemplate | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('kpi_template')
        .insert(template)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating KPI template:', error);
      return { data: null, error };
    }
  }

  async updateKPITemplate(metric: string, updates: Partial<KPITemplate>): Promise<{ data: KPITemplate | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('kpi_template')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('metric', metric)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating KPI template:', error);
      return { data: null, error };
    }
  }

  async deleteKPITemplate(metric: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('kpi_template')
        .delete()
        .eq('metric', metric);

      return { error };
    } catch (error) {
      console.error('Error deleting KPI template:', error);
      return { error };
    }
  }

  // Performance KPIs
  async getCompanyKPIs(companyId: string, period?: string): Promise<{ data: PerformanceKPI[]; error: any }> {
    try {
      let query = supabase
        .from('performance_kpi')
        .select(`
          *,
          kpi_template (*)
        `)
        .eq('company_id', companyId)
        .order('metric');

      if (period) {
        query = query.eq('period', period);
      }

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      console.error('Error fetching company KPIs:', error);
      return { data: [], error };
    }
  }

  async getProjectKPIs(projectId: string, period?: string): Promise<{ data: PerformanceKPI[]; error: any }> {
    try {
      let query = supabase
        .from('performance_kpi')
        .select(`
          *,
          kpi_template (*)
        `)
        .eq('project_id', projectId)
        .order('metric');

      if (period) {
        query = query.eq('period', period);
      }

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      console.error('Error fetching project KPIs:', error);
      return { data: [], error };
    }
  }

  async createKPI(kpiData: CreateKPIData): Promise<{ data: PerformanceKPI | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('performance_kpi')
        .insert(kpiData)
        .select(`
          *,
          kpi_template (*)
        `)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating KPI:', error);
      return { data: null, error };
    }
  }

  async updateKPI(id: string, updates: UpdateKPIData): Promise<{ data: PerformanceKPI | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('performance_kpi')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          kpi_template (*)
        `)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating KPI:', error);
      return { data: null, error };
    }
  }

  async deleteKPI(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('performance_kpi')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error('Error deleting KPI:', error);
      return { error };
    }
  }

  // Performance Scorecards
  async getCompanyScorecard(companyId: string, period?: string): Promise<{ data: PerformanceScorecard | null; error: any }> {
    try {
      // Get company info
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('name')
        .eq('id', companyId)
        .single();

      if (companyError) {
        return { data: null, error: companyError };
      }

      // Get KPIs for the period
      const { data: kpis, error: kpisError } = await this.getCompanyKPIs(companyId, period);

      if (kpisError) {
        return { data: null, error: kpisError };
      }

      // Calculate overall score using the database function
      const { data: scoreData, error: scoreError } = await supabase
        .rpc('calculate_performance_score', {
          p_company_id: companyId,
          p_period: period || null
        });

      if (scoreError) {
        console.warn('Error calculating performance score:', scoreError);
      }

      const overall_score = scoreData || 0;

      // Get previous period score for trend calculation
      let trend: 'up' | 'down' | 'stable' = 'stable';
      let previous_score: number | undefined;

      if (period) {
        // Calculate previous period (simplified - assumes quarterly periods)
        const [quarter, year] = period.split('-');
        const quarterNum = parseInt(quarter.substring(1));
        let prevQuarter: string;
        let prevYear: string;

        if (quarterNum === 1) {
          prevQuarter = 'Q4';
          prevYear = (parseInt(year) - 1).toString();
        } else {
          prevQuarter = `Q${quarterNum - 1}`;
          prevYear = year;
        }

        const prevPeriod = `${prevQuarter}-${prevYear}`;

        const { data: prevScoreData } = await supabase
          .rpc('calculate_performance_score', {
            p_company_id: companyId,
            p_period: prevPeriod
          });

        if (prevScoreData) {
          previous_score = prevScoreData;
          const scoreDiff = overall_score - previous_score;
          if (scoreDiff > 2) trend = 'up';
          else if (scoreDiff < -2) trend = 'down';
          else trend = 'stable';
        }
      }

      const scorecard: PerformanceScorecard = {
        company_id: companyId,
        company_name: company.name,
        period: period || 'All Time',
        overall_score,
        kpis,
        trend,
        previous_score
      };

      return { data: scorecard, error: null };
    } catch (error) {
      console.error('Error fetching company scorecard:', error);
      return { data: null, error };
    }
  }

  async getAllCompanyScorecards(period?: string): Promise<{ data: PerformanceScorecard[]; error: any }> {
    try {
      // Get all companies that have performance data
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id, name')
        .in('id', 
          supabase
            .from('performance_kpi')
            .select('company_id')
        );

      if (companiesError) {
        return { data: [], error: companiesError };
      }

      // Get scorecards for each company
      const scorecards: PerformanceScorecard[] = [];
      
      for (const company of companies || []) {
        const { data: scorecard } = await this.getCompanyScorecard(company.id, period);
        if (scorecard) {
          scorecards.push(scorecard);
        }
      }

      // Sort by overall score descending
      scorecards.sort((a, b) => b.overall_score - a.overall_score);

      return { data: scorecards, error: null };
    } catch (error) {
      console.error('Error fetching all company scorecards:', error);
      return { data: [], error };
    }
  }

  // Utility functions
  async getAvailablePeriods(): Promise<{ data: string[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('performance_kpi')
        .select('period')
        .order('period', { ascending: false });

      if (error) {
        return { data: [], error };
      }

      const uniquePeriods = Array.from(new Set(data?.map(item => item.period) || []));
      return { data: uniquePeriods, error: null };
    } catch (error) {
      console.error('Error fetching available periods:', error);
      return { data: [], error };
    }
  }

  async bulkCreateKPIs(kpis: CreateKPIData[]): Promise<{ data: PerformanceKPI[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('performance_kpi')
        .insert(kpis)
        .select(`
          *,
          kpi_template (*)
        `);

      return { data: data || [], error };
    } catch (error) {
      console.error('Error bulk creating KPIs:', error);
      return { data: [], error };
    }
  }
}

export const performanceAPI = new PerformanceAPI();
