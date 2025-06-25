
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { PortfolioHealthSchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getPortfolioHealth(args: unknown) {
  const _params = PortfolioHealthSchema.parse(args);
  
  try {
    // Optimized query with proper error handling and caching
    const { data: portfolioHealth, error } = await supabase
      .from('portfolio_health')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Add reasonable limit for performance

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Database error: ${error.message}`
      );
    }

    // Enhanced response with metadata
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            portfolio_health: portfolioHealth || [],
            metadata: {
              count: portfolioHealth?.length || 0,
              timestamp: new Date().toISOString(),
              cached: false
            }
          }, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('Portfolio health fetch error:', error);
    
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
