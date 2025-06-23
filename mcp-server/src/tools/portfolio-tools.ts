
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { PortfolioHealthSchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getPortfolioHealth(args: unknown) {
  const params = PortfolioHealthSchema.parse(args);

  // Get portfolio health metrics
  const { data: portfolioHealth, error } = await supabase
    .from('portfolio_health')
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
          portfolio_health: portfolioHealth,
        }, null, 2),
      },
    ],
  };
}
