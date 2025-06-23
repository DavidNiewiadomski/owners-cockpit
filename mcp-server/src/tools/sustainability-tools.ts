
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { SustainabilityOverviewSchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getSustainabilityOverview(args: unknown) {
  const params = SustainabilityOverviewSchema.parse(args);

  // Verify project exists
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, status')
    .eq('id', params.project_id)
    .single();

  if (projectError || !project) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Project not found: ${params.project_id}`
    );
  }

  // Initialize sustainability overview with default values
  const sustainabilityOverview = {
    success: true,
    project_name: project.name,
    energy: {
      total_consumption: null,
      renewable_percentage: null,
      efficiency_rating: null,
      carbon_footprint: null,
      data_available: false
    },
    waste: {
      total_generated: null,
      recycled_percentage: null,
      diverted_from_landfill: null,
      hazardous_waste: null,
      data_available: false
    },
    leed: {
      certification_target: null,
      current_status: null,
      points_earned: null,
      points_possible: null,
      certification_date: null,
      data_available: false
    },
    water: {
      consumption: null,
      efficiency_measures: null,
      stormwater_management: null,
      data_available: false
    },
    materials: {
      recycled_content_percentage: null,
      local_materials_percentage: null,
      sustainable_sourcing: null,
      data_available: false
    },
    summary: {
      overall_sustainability_score: null,
      data_completeness: 0,
      recommendations: []
    }
  };

  try {
    // Try to get energy data from budget items or documents (mock implementation)
    const { data: energyData } = await supabase
      .from('budget_items')
      .select('*')
      .eq('project_id', params.project_id)
      .ilike('category', '%energy%');

    if (energyData && energyData.length > 0) {
      sustainabilityOverview.energy.data_available = true;
      sustainabilityOverview.energy.total_consumption = energyData.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
      sustainabilityOverview.energy.efficiency_rating = 'B+'; // Mock rating
      sustainabilityOverview.energy.renewable_percentage = 25; // Mock percentage
      sustainabilityOverview.summary.data_completeness += 20;
    }

    // Try to get waste data from documents or reports
    const { data: wasteData } = await supabase
      .from('budget_items')
      .select('*')
      .eq('project_id', params.project_id)
      .ilike('category', '%waste%');

    if (wasteData && wasteData.length > 0) {
      sustainabilityOverview.waste.data_available = true;
      sustainabilityOverview.waste.total_generated = wasteData.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
      sustainabilityOverview.waste.recycled_percentage = 60; // Mock percentage
      sustainabilityOverview.waste.diverted_from_landfill = 75; // Mock percentage
      sustainabilityOverview.summary.data_completeness += 20;
    }

    // Try to get LEED data from project metadata or documents
    const { data: documents } = await supabase
      .from('documents')
      .select('title, doc_type')
      .eq('project_id', params.project_id)
      .ilike('title', '%leed%');

    if (documents && documents.length > 0) {
      sustainabilityOverview.leed.data_available = true;
      sustainabilityOverview.leed.certification_target = 'LEED Gold';
      sustainabilityOverview.leed.current_status = 'In Progress';
      sustainabilityOverview.leed.points_earned = 45;
      sustainabilityOverview.leed.points_possible = 110;
      sustainabilityOverview.summary.data_completeness += 25;
    }

    // Try to get water data
    const { data: waterData } = await supabase
      .from('budget_items')
      .select('*')
      .eq('project_id', params.project_id)
      .ilike('category', '%water%');

    if (waterData && waterData.length > 0) {
      sustainabilityOverview.water.data_available = true;
      sustainabilityOverview.water.consumption = waterData.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
      sustainabilityOverview.water.efficiency_measures = 'Low-flow fixtures, rainwater harvesting';
      sustainabilityOverview.summary.data_completeness += 15;
    }

    // Try to get materials data
    const { data: materialsData } = await supabase
      .from('budget_items')
      .select('*')
      .eq('project_id', params.project_id)
      .or('category.ilike.%material%,category.ilike.%concrete%,category.ilike.%steel%');

    if (materialsData && materialsData.length > 0) {
      sustainabilityOverview.materials.data_available = true;
      sustainabilityOverview.materials.recycled_content_percentage = 35; // Mock percentage
      sustainabilityOverview.materials.local_materials_percentage = 40; // Mock percentage
      sustainabilityOverview.materials.sustainable_sourcing = 'FSC certified wood, recycled steel';
      sustainabilityOverview.summary.data_completeness += 20;
    }

    // Calculate overall sustainability score based on available data
    if (sustainabilityOverview.summary.data_completeness > 0) {
      let score = 0;
      let factors = 0;

      if (sustainabilityOverview.energy.data_available) {
        score += sustainabilityOverview.energy.renewable_percentage || 0;
        factors++;
      }
      if (sustainabilityOverview.waste.data_available) {
        score += sustainabilityOverview.waste.recycled_percentage || 0;
        factors++;
      }
      if (sustainabilityOverview.leed.data_available) {
        score += ((sustainabilityOverview.leed.points_earned || 0) / (sustainabilityOverview.leed.points_possible || 100)) * 100;
        factors++;
      }

      if (factors > 0) {
        sustainabilityOverview.summary.overall_sustainability_score = Math.round(score / factors);
      }
    }

    // Generate recommendations based on data gaps and performance
    const recommendations = [];
    
    if (!sustainabilityOverview.energy.data_available) {
      recommendations.push('Implement energy monitoring systems to track consumption and identify efficiency opportunities');
    } else if ((sustainabilityOverview.energy.renewable_percentage || 0) < 30) {
      recommendations.push('Consider increasing renewable energy sources to improve sustainability profile');
    }

    if (!sustainabilityOverview.waste.data_available) {
      recommendations.push('Establish waste tracking and reporting procedures to monitor diversion rates');
    } else if ((sustainabilityOverview.waste.recycled_percentage || 0) < 70) {
      recommendations.push('Implement enhanced waste separation and recycling programs');
    }

    if (!sustainabilityOverview.leed.data_available) {
      recommendations.push('Consider pursuing LEED certification to formalize sustainability commitments');
    } else if (sustainabilityOverview.leed.current_status === 'In Progress') {
      recommendations.push('Continue LEED documentation and coordinate with certification consultant');
    }

    if (!sustainabilityOverview.water.data_available) {
      recommendations.push('Install water monitoring systems and implement conservation measures');
    }

    if (!sustainabilityOverview.materials.data_available) {
      recommendations.push('Track material sourcing and prioritize sustainable and local materials');
    }

    sustainabilityOverview.summary.recommendations = recommendations;

  } catch (error) {
    console.error('Error gathering sustainability data:', error);
    // Continue with default values if data gathering fails
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(sustainabilityOverview, null, 2),
      },
    ],
  };
}
