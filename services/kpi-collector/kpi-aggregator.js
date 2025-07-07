const { performanceAPI } = require('../../src/lib/api/performance');

class KPIAggregator {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Process and aggregate KPI data
  async processKPIs(companyId, projectId, kpiData, period) {
    const mappedKPIs = [
      { metric: 'cost_variance', value: kpiData.cost_variance },
      { metric: 'schedule_variance', value: kpiData.schedule_variance },
      { metric: 'safety_incidents', value: kpiData.safety_incidents }
    ];

    try {
      for (const kpi of mappedKPIs) {
        const { data, error } = await this.supabase
          .from('performance_kpi')
          .upsert({
            company_id: companyId,
            project_id: projectId,
            metric: kpi.metric,
            value: kpi.value,
            period,
            source: 'Procore',
            captured_at: new Date().toISOString()
          });

        if (error) {
          console.error(`Error upserting KPI ${kpi.metric}:`, error);
        }
      }

      console.log(`Successfully upserted ${mappedKPIs.length} KPIs for company ${companyId}, project ${projectId}`);
      return mappedKPIs;

    } catch (error) {
      console.error('Error processing KPIs:', error);
      throw error;
    }
  }
}

module.exports = KPIAggregator;
