
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { RiskAdvisorySchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getRiskAdvisory(args: unknown) {
  const params = RiskAdvisorySchema.parse(args);

  // Get risk data
  const { data: riskData, error } = await supabase
    .from('risks')
    .select('*')
    .eq('project_id', params.project_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Database error: ${error.message}`
    );
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          risk_data: riskData,
        }, null, 2),
      },
    ],
  };
}
