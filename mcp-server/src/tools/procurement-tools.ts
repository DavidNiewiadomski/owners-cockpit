
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { ProcurementSummarySchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getProcurementSummary(args: unknown) {
  const params = ProcurementSummarySchema.parse(args);

  // Get procurement data
  const { data: procurementData, error } = await supabase
    .from('procurement')
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
          procurement_data: procurementData,
        }, null, 2),
      },
    ],
  };
}
