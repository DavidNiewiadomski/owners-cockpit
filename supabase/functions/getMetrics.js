import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProjectMetrics(projectId) {
  const { data: projectFinancialMetrics, error: financialError } = await supabase
    .from('project_financial_metrics')
    .select('*')
    .eq('project_id', projectId)
    .single();

  const { data: projectConstructionMetrics, error: constructionError } = await supabase
    .from('project_construction_metrics')
    .select('*')
    .eq('project_id', projectId)
    .single();

  // Similarly fetch other metrics: executive, legal, design, etc.

  if (financialError || constructionError) {
    console.error('Error fetching project metrics:', { financialError, constructionError });
    return null;
  }

  return {
    financial: projectFinancialMetrics,
    construction: projectConstructionMetrics,
    // Add other metrics here
  };
}
