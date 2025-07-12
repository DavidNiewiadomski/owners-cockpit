import { createClient } from '@supabase/supabase-js';

export class ToolExecutor {
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
  }

  async execute(message, projectId) {
    console.log('🔧 Executing tools for project:', projectId);
    
    try {
      // Simple project data fetch
      if (projectId === 'portfolio') {
        return await this.getPortfolioData();
      } else {
        return await this.getProjectData(projectId);
      }
    } catch (error) {
      console.error('Tool execution error:', error);
      return [];
    }
  }

  async getProjectData(projectId) {
    try {
      // Get project info
      const { data: project, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error || !project) {
        return [{
          error: 'Project not found',
          project_id: projectId
        }];
      }

      // Get financial metrics
      const { data: financials } = await this.supabase
        .from('project_financial_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      // Get construction metrics
      const { data: construction } = await this.supabase
        .from('project_construction_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single();

      return [{
        project_id: projectId,
        project_name: project.name,
        description: project.description,
        status: project.status,
        budget_total: financials?.total_budget || 0,
        budget_used: financials?.budget_used || 0,
        completion_percentage: construction?.completion_percentage || 0,
        current_phase: construction?.current_phase || 'Planning',
        safety_score: construction?.safety_score || 0,
        quality_score: construction?.quality_score || 0,
        timeline: {
          start_date: project.start_date,
          expected_completion: project.end_date,
          current_phase: construction?.current_phase || 'Planning'
        },
        tool_name: 'get_project_status',
        timestamp: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error fetching project data:', error);
      return [{
        error: error.message,
        project_id: projectId
      }];
    }
  }

  async getPortfolioData() {
    try {
      const { data: projects } = await this.supabase
        .from('projects')
        .select('*')
        .eq('status', 'active');

      if (!projects || projects.length === 0) {
        return [{
          portfolio_id: 'portfolio',
          message: 'No active projects found',
          total_projects: 0
        }];
      }

      const portfolioSummary = {
        portfolio_id: 'portfolio',
        portfolio_name: 'Portfolio Overview',
        description: 'Aggregate data for all active projects',
        total_projects: projects.length,
        projects: projects.map(p => ({
          project_id: p.id,
          name: p.name,
          status: p.status,
          current_phase: p.current_phase || 'Planning'
        })),
        tool_name: 'get_portfolio_status',
        timestamp: new Date().toISOString()
      };

      return [portfolioSummary];
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      return [{
        error: error.message,
        portfolio_id: 'portfolio'
      }];
    }
  }
}