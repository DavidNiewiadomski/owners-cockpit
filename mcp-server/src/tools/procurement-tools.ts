
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { ProcurementSummarySchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Cache for procurement data to improve performance
const procurementCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProcurementSummary(args: unknown) {
  const params = ProcurementSummarySchema.parse(args);
  const cacheKey = `procurement_${params.project_id || 'all'}`;
  
  // Check cache first
  const cached = procurementCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            ...cached.data,
            metadata: {
              ...cached.data.metadata,
              cached: true,
              cache_age: Math.floor((Date.now() - cached.timestamp) / 1000)
            }
          }, null, 2),
        },
      ],
    };
  }

  try {
    let query = supabase
      .from('procurement')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000); // Reasonable limit for performance

    if (params.project_id) {
      query = query.eq('project_id', params.project_id);
    }

    const { data: procurementData, error } = await query;

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Database error: ${error.message}`
      );
    }

    const result = {
      success: true,
      procurement_data: procurementData || [],
      metadata: {
        count: procurementData?.length || 0,
        timestamp: new Date().toISOString(),
        cached: false,
        project_id: params.project_id
      }
    };

    // Cache the result
    procurementCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('Procurement summary fetch error:', error);
    
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Clear cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of procurementCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      procurementCache.delete(key);
    }
  }
}, CACHE_DURATION);
