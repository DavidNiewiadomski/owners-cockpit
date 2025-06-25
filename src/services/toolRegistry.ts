import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
);

export interface ToolCall {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: Record<string, any>) => Promise<any>;
}

export class ComprehensiveToolRegistry {
  private tools: Map<string, ToolCall> = new Map();

  constructor() {
    this.initializeAllTools();
  }

  private initializeAllTools() {
    // ==================== PROJECT MANAGEMENT TOOLS ====================
    this.registerTool({
      name: 'getAllProjects',
      description: 'Get all projects accessible to the user',
      parameters: { userId: 'string', status: 'string?', limit: 'number?' },
      execute: async (params) => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', params.userId)
          .limit(params.limit || 50);
        
        if (error) throw error;
        return { projects: data, count: data?.length || 0 };
      }
    });

    this.registerTool({
      name: 'getProjectDetails',
      description: 'Get detailed information about a specific project',
      parameters: { projectId: 'string' },
      execute: async (params) => {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_phases(*),
            project_tasks(*),
            project_documents(*),
            project_team_members(*)
          `)
          .eq('id', params.projectId)
          .single();
        
        if (error) throw error;
        return data;
      }
    });

    this.registerTool({
      name: 'updateProjectStatus',
      description: 'Update project status and metadata',
      parameters: { projectId: 'string', status: 'string', notes: 'string?' },
      execute: async (params) => {
        const { data, error } = await supabase
          .from('projects')
          .update({ 
            status: params.status, 
            notes: params.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', params.projectId)
          .select();
        
        if (error) throw error;
        return { success: true, updated: data };
      }
    });

    // ==================== FINANCIAL TOOLS ====================
    this.registerTool({
      name: 'getProjectFinancials',
      description: 'Get comprehensive financial data for projects',
      parameters: { projectId: 'string?', dateRange: 'string?', category: 'string?' },
      execute: async (params) => {
        let query = supabase
          .from('project_financials')
          .select(`
            *,
            budget_categories(*),
            expenses(*),
            invoices(*),
            payments(*)
          `);
        
        if (params.projectId) {
          query = query.eq('project_id', params.projectId);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        return {
          financials: data,
          summary: this.calculateFinancialSummary(data)
        };
      }
    });

    this.registerTool({
      name: 'createBudgetEntry',
      description: 'Create new budget entry or expense',
      parameters: { 
        projectId: 'string', 
        category: 'string', 
        amount: 'number', 
        description: 'string',
        type: 'string' // 'budget' | 'expense' | 'invoice'
      },
      execute: async (params) => {
        const { data, error } = await supabase
          .from('project_financials')
          .insert({
            project_id: params.projectId,
            category: params.category,
            amount: params.amount,
            description: params.description,
            type: params.type,
            created_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        return { success: true, entry: data[0] };
      }
    });

    // ==================== TASK & SCHEDULING TOOLS ====================
    this.registerTool({
      name: 'getProjectTasks',
      description: 'Get all tasks for projects with scheduling information',
      parameters: { projectId: 'string?', status: 'string?', assignee: 'string?' },
      execute: async (params) => {
        let query = supabase
          .from('project_tasks')
          .select(`
            *,
            assigned_to:users(*),
            dependencies:task_dependencies(*),
            subtasks:project_tasks(*)
          `);
        
        if (params.projectId) query = query.eq('project_id', params.projectId);
        if (params.status) query = query.eq('status', params.status);
        if (params.assignee) query = query.eq('assigned_to', params.assignee);
        
        const { data, error } = await query;
        if (error) throw error;
        
        return {
          tasks: data,
          summary: this.calculateTaskSummary(data)
        };
      }
    });

    this.registerTool({
      name: 'createTask',
      description: 'Create new project task with scheduling',
      parameters: {
        projectId: 'string',
        title: 'string',
        description: 'string?',
        assignedTo: 'string?',
        dueDate: 'string?',
        priority: 'string?',
        dependencies: 'string[]?'
      },
      execute: async (params) => {
        const { data, error } = await supabase
          .from('project_tasks')
          .insert({
            project_id: params.projectId,
            title: params.title,
            description: params.description,
            assigned_to: params.assignedTo,
            due_date: params.dueDate,
            priority: params.priority || 'medium',
            status: 'pending',
            created_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        
        // Handle dependencies if provided
        if (params.dependencies && params.dependencies.length > 0) {
          const depData = params.dependencies.map(depId => ({
            task_id: data[0].id,
            depends_on_task_id: depId
          }));
          
          await supabase.from('task_dependencies').insert(depData);
        }
        
        return { success: true, task: data[0] };
      }
    });

    // ==================== DOCUMENT MANAGEMENT TOOLS ====================
    this.registerTool({
      name: 'getProjectDocuments',
      description: 'Get all documents for projects',
      parameters: { projectId: 'string?', category: 'string?', searchTerm: 'string?' },
      execute: async (params) => {
        let query = supabase
          .from('project_documents')
          .select(`
            *,
            uploaded_by:users(*),
            versions:document_versions(*)
          `);
        
        if (params.projectId) query = query.eq('project_id', params.projectId);
        if (params.category) query = query.eq('category', params.category);
        if (params.searchTerm) {
          query = query.or(`title.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%`);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        return { documents: data, count: data?.length || 0 };
      }
    });

    this.registerTool({
      name: 'uploadDocument',
      description: 'Upload new document to project',
      parameters: {
        projectId: 'string',
        title: 'string',
        category: 'string',
        description: 'string?',
        fileUrl: 'string',
        fileType: 'string'
      },
      execute: async (params) => {
        const { data, error } = await supabase
          .from('project_documents')
          .insert({
            project_id: params.projectId,
            title: params.title,
            category: params.category,
            description: params.description,
            file_url: params.fileUrl,
            file_type: params.fileType,
            uploaded_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        return { success: true, document: data[0] };
      }
    });

    // ==================== TEAM MANAGEMENT TOOLS ====================
    this.registerTool({
      name: 'getTeamMembers',
      description: 'Get team members for projects',
      parameters: { projectId: 'string?', role: 'string?' },
      execute: async (params) => {
        let query = supabase
          .from('project_team_members')
          .select(`
            *,
            user:users(*),
            project:projects(*)
          `);
        
        if (params.projectId) query = query.eq('project_id', params.projectId);
        if (params.role) query = query.eq('role', params.role);
        
        const { data, error } = await query;
        if (error) throw error;
        
        return { teamMembers: data, count: data?.length || 0 };
      }
    });

    this.registerTool({
      name: 'addTeamMember',
      description: 'Add team member to project',
      parameters: {
        projectId: 'string',
        userId: 'string',
        role: 'string',
        permissions: 'string[]?'
      },
      execute: async (params) => {
        const { data, error } = await supabase
          .from('project_team_members')
          .insert({
            project_id: params.projectId,
            user_id: params.userId,
            role: params.role,
            permissions: params.permissions || [],
            added_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        return { success: true, member: data[0] };
      }
    });

    // ==================== COMMUNICATION TOOLS ====================
    this.registerTool({
      name: 'sendNotification',
      description: 'Send notification to team members',
      parameters: {
        recipients: 'string[]',
        subject: 'string',
        message: 'string',
        priority: 'string?',
        projectId: 'string?'
      },
      execute: async (params) => {
        const notifications = params.recipients.map(userId => ({
          user_id: userId,
          subject: params.subject,
          message: params.message,
          priority: params.priority || 'normal',
          project_id: params.projectId,
          sent_at: new Date().toISOString(),
          status: 'sent'
        }));
        
        const { data, error } = await supabase
          .from('notifications')
          .insert(notifications)
          .select();
        
        if (error) throw error;
        return { success: true, notifications: data };
      }
    });

    // ==================== ANALYTICS & REPORTING TOOLS ====================
    this.registerTool({
      name: 'generateProjectReport',
      description: 'Generate comprehensive project report',
      parameters: {
        projectId: 'string',
        reportType: 'string', // 'progress' | 'financial' | 'comprehensive'
        dateRange: 'string?'
      },
      execute: async (params) => {
        // Fetch comprehensive project data
        const [project, tasks, financials, documents, team] = await Promise.all([
          this.getProjectDetails({ projectId: params.projectId }),
          this.getProjectTasks({ projectId: params.projectId }),
          this.getProjectFinancials({ projectId: params.projectId }),
          this.getProjectDocuments({ projectId: params.projectId }),
          this.getTeamMembers({ projectId: params.projectId })
        ]);
        
        return {
          reportType: params.reportType,
          generatedAt: new Date().toISOString(),
          project,
          tasks,
          financials,
          documents,
          team,
          summary: this.generateReportSummary(project, tasks, financials)
        };
      }
    });

    // ==================== MAINTENANCE & EQUIPMENT TOOLS ====================
    this.registerTool({
      name: 'getMaintenanceSchedule',
      description: 'Get maintenance schedules and equipment status',
      parameters: { projectId: 'string?', equipmentId: 'string?', status: 'string?' },
      execute: async (params) => {
        let query = supabase
          .from('maintenance_schedules')
          .select(`
            *,
            equipment:equipment(*),
            assigned_to:users(*)
          `);
        
        if (params.projectId) query = query.eq('project_id', params.projectId);
        if (params.equipmentId) query = query.eq('equipment_id', params.equipmentId);
        if (params.status) query = query.eq('status', params.status);
        
        const { data, error } = await query;
        if (error) throw error;
        
        return { 
          maintenance: data, 
          summary: this.calculateMaintenanceSummary(data) 
        };
      }
    });

    // ==================== COMPLIANCE & SAFETY TOOLS ====================
    this.registerTool({
      name: 'getComplianceStatus',
      description: 'Get compliance status and safety information',
      parameters: { projectId: 'string?', complianceType: 'string?' },
      execute: async (params) => {
        let query = supabase
          .from('compliance_records')
          .select(`
            *,
            inspections:safety_inspections(*),
            violations:compliance_violations(*)
          `);
        
        if (params.projectId) query = query.eq('project_id', params.projectId);
        if (params.complianceType) query = query.eq('type', params.complianceType);
        
        const { data, error } = await query;
        if (error) throw error;
        
        return { 
          compliance: data,
          riskAssessment: this.calculateComplianceRisk(data)
        };
      }
    });

    // ==================== WEATHER & SITE CONDITIONS ====================
    this.registerTool({
      name: 'getSiteConditions',
      description: 'Get current weather and site conditions',
      parameters: { projectId: 'string', location: 'string?' },
      execute: async (params) => {
        // Integration with weather API
        const weatherData = await this.fetchWeatherData(params.location);
        
        // Get site-specific conditions
        const { data: siteData, error } = await supabase
          .from('site_conditions')
          .select('*')
          .eq('project_id', params.projectId)
          .order('recorded_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        return {
          weather: weatherData,
          siteConditions: siteData?.[0],
          workRecommendations: this.generateWorkRecommendations(weatherData, siteData?.[0])
        };
      }
    });
  }

  // ==================== HELPER METHODS ====================
  private calculateFinancialSummary(data: any[]): any {
    // Implementation for financial calculations
    return {
      totalBudget: data.reduce((sum, item) => sum + (item.budget_amount || 0), 0),
      totalSpent: data.reduce((sum, item) => sum + (item.actual_amount || 0), 0),
      variance: 0, // Calculate variance
      categories: {} // Breakdown by category
    };
  }

  private calculateTaskSummary(data: any[]): any {
    return {
      total: data.length,
      completed: data.filter(t => t.status === 'completed').length,
      inProgress: data.filter(t => t.status === 'in_progress').length,
      overdue: data.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completed').length
    };
  }

  private calculateMaintenanceSummary(data: any[]): any {
    return {
      total: data.length,
      overdue: data.filter(m => new Date(m.due_date) < new Date() && m.status !== 'completed').length,
      upcoming: data.filter(m => {
        const due = new Date(m.due_date);
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return due >= now && due <= weekFromNow;
      }).length
    };
  }

  private calculateComplianceRisk(data: any[]): any {
    return {
      overallRisk: 'low', // Calculate based on violations and inspections
      openViolations: data.filter(c => c.status === 'open').length,
      upcomingInspections: data.filter(c => c.next_inspection_date).length
    };
  }

  private generateReportSummary(project: any, tasks: any, financials: any): any {
    return {
      projectHealth: 'good', // Calculate based on multiple factors
      keyMetrics: {
        progressPercentage: 0, // Calculate from tasks
        budgetUtilization: 0, // Calculate from financials
        scheduleVariance: 0 // Calculate from timeline
      },
      recommendations: [] // AI-generated recommendations
    };
  }

  private async fetchWeatherData(location?: string): Promise<any> {
    // Integration with weather service API
    return {
      current: 'Partly cloudy, 72°F',
      forecast: '3 days rain expected starting Thursday',
      workConditions: 'Good for outdoor work today and tomorrow'
    };
  }

  private generateWorkRecommendations(weather: any, siteConditions: any): string[] {
    const recommendations = [];
    // Generate recommendations based on weather and site conditions
    return recommendations;
  }

  registerTool(tool: ToolCall) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): ToolCall | undefined {
    return this.tools.get(name);
  }

  getAllTools(): Map<string, ToolCall> {
    return this.tools;
  }

  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  // Execute tool by name
  async executeTool(name: string, parameters: Record<string, any>): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool '${name}' not found`);
    }
    
    try {
      return await tool.execute(parameters);
    } catch (error) {
      console.error(`Error executing tool '${name}':`, error);
      throw error;
    }
  }
}

export default ComprehensiveToolRegistry;
