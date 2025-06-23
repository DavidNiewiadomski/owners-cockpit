import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { RiskAdvisorySchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Enhanced cache with LRU-like behavior
const riskCache = new Map<string, { data: any; timestamp: number; accessCount: number }>();
const MAX_CACHE_SIZE = 100;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes for risk data

function cleanupCache() {
  if (riskCache.size <= MAX_CACHE_SIZE) return;
  
  // Remove oldest and least accessed entries
  const entries = Array.from(riskCache.entries());
  entries.sort((a, b) => {
    const aScore = a[1].accessCount * 0.7 + (Date.now() - a[1].timestamp) * 0.3;
    const bScore = b[1].accessCount * 0.7 + (Date.now() - b[1].timestamp) * 0.3;
    return aScore - bScore;
  });
  
  // Keep only the most recent/accessed entries
  const toKeep = entries.slice(-Math.floor(MAX_CACHE_SIZE * 0.8));
  riskCache.clear();
  toKeep.forEach(([key, value]) => riskCache.set(key, value));
}

export async function getRiskAdvisory(args: unknown) {
  const params = RiskAdvisorySchema.parse(args);
  const cacheKey = `risk_${params.project_id}`;
  
  // Check cache with access tracking
  const cached = riskCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    cached.accessCount++;
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            ...cached.data,
            metadata: {
              ...cached.data.metadata,
              cached: true,
              cache_age: Math.floor((Date.now() - cached.timestamp) / 1000),
              access_count: cached.accessCount
            }
          }, null, 2),
        },
      ],
    };
  }

  try {
    // Optimized query with better performance
    const { data: riskData, error } = await supabase
      .from('risks')
      .select('*')
      .eq('project_id', params.project_id)
      .order('created_at', { ascending: false })
      .limit(500); // Reasonable limit

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Database error: ${error.message}`
      );
    }

    // Enhanced risk analysis
    const riskAnalysis = analyzeRisks(riskData || []);
    
    const result = {
      success: true,
      risk_data: riskData || [],
      risk_analysis: riskAnalysis,
      metadata: {
        count: riskData?.length || 0,
        timestamp: new Date().toISOString(),
        cached: false,
        project_id: params.project_id
      }
    };

    // Cache with access tracking
    riskCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
      accessCount: 1
    });

    cleanupCache();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error('Risk advisory fetch error:', error);
    
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

function analyzeRisks(risks: any[]): {
  total_risks: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  recommendations: string[];
} {
  const analysis = {
    total_risks: risks.length,
    high_priority: 0,
    medium_priority: 0,
    low_priority: 0,
    recommendations: [] as string[]
  };

  risks.forEach(risk => {
    switch (risk.severity?.toLowerCase()) {
      case 'high':
        analysis.high_priority++;
        break;
      case 'medium':
        analysis.medium_priority++;
        break;
      case 'low':
        analysis.low_priority++;
        break;
    }
  });

  // Generate smart recommendations
  if (analysis.high_priority > 5) {
    analysis.recommendations.push("Critical: High number of high-priority risks detected. Immediate action required.");
  }
  
  if (analysis.total_risks > 20) {
    analysis.recommendations.push("Consider risk consolidation and prioritization strategies.");
  }
  
  if (analysis.high_priority === 0 && analysis.medium_priority < 3) {
    analysis.recommendations.push("Risk profile looks healthy. Continue monitoring.");
  }

  return analysis;
}
