// Adaptation from premium-ai-construction-assistant-p_OKC6bz3/tool_execution/entry.js
export class ToolExecutor {
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getToolConfig(toolName: string): any {
    const toolConfigs: Record<string, any> = {
      send_email: {
        side_effect: true,
        cost_per_execution: 0.01,
        required_params: ['to', 'subject', 'body']
      },
      send_sms: {
        side_effect: true,
        cost_per_execution: 0.05,
        required_params: ['to', 'message']
      },
      schedule_meeting: {
        side_effect: true,
        cost_per_execution: 0.02,
        required_params: ['attendees', 'subject', 'start_time', 'duration']
      },
      create_change_order: {
        side_effect: true,
        cost_per_execution: 0.10,
        required_params: ['project_id', 'description', 'cost_impact']
      },
      update_schedule: {
        side_effect: true,
        cost_per_execution: 0.05,
        required_params: ['project_id', 'task_id', 'new_date']
      },
      get_project_status: {
        side_effect: false,
        cost_per_execution: 0.001,
        required_params: ['project_id']
      },
      list_contractors: {
        side_effect: false,
        cost_per_execution: 0.001,
        required_params: []
      },
      get_communications: {
        side_effect: false,
        cost_per_execution: 0.001,
        required_params: ['project_id']
      },
      get_emails: {
        side_effect: false,
        cost_per_execution: 0.001,
        required_params: []
      },
      get_teams_messages: {
        side_effect: false,
        cost_per_execution: 0.001,
        required_params: []
      },
      get_calendar_events: {
        side_effect: false,
        cost_per_execution: 0.001,
        required_params: []
      },
      send_teams_message: {
        side_effect: true,
        cost_per_execution: 0.02,
        required_params: ['channel', 'message']
      },
      open_communication_app: {
        side_effect: false,
        cost_per_execution: 0.001,
        required_params: ['app_name']
      }
    }
    return toolConfigs[toolName]
  }

  private async logExecution(executionId: string, toolName: string, parameters: any, status: string, result: any, cost: number, userId: string, projectId: string): Promise<void> {
    const logEntry = {
      execution_id: executionId,
      tool_name: toolName,
      parameters,
      result: status === 'success' ? result : { error: result },
      status,
      cost_cents: cost,
      user_id: userId,
      project_id: projectId,
      created_at: new Date().toISOString()
    }

    try {
      await this.supabase
        .from('construction_tool_logs')
        .insert(logEntry)
    } catch (error) {
      console.error('Error logging tool execution:', error)
    }
  }

  private validateParameters(toolConfig: any, parameters: any): void {
    const missing: string[] = []
    for (const param of toolConfig.required_params) {
      if (!parameters[param]) {
        missing.push(param)
      }
    }
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`)
    }
  }

  private async executeGetProjectStatus(parameters: any): Promise<any> {
    try {
      console.log('📊 Fetching real project data for:', parameters.project_id)
      
      const projectId = parameters.project_id;
      
      // Handle portfolio mode - get all projects or use specified project
      if (projectId === 'portfolio' || !projectId) {
        console.log('🏢 Portfolio mode detected, getting all projects data...');
        
        // Get all projects with their basic info
        const { data: allProjects } = await this.supabase
          .from('projects')
          .select('id, name, description, status, total_value, start_date, end_date')
          .limit(10);
        
        if (!allProjects || allProjects.length === 0) {
          throw new Error('No projects available in the system');
        }
        
        // Return portfolio-level data instead of single project
        return await this.getPortfolioData(allProjects);
      }
      
      // Get project basic info
      const { data: project } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
      
      if (!project) {
        throw new Error(`Project ${projectId} not found`)
      }
      
      // Get financial metrics
      const { data: financials } = await this.supabase
        .from('project_financial_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single()
      
      // Get construction metrics
      const { data: construction } = await this.supabase
        .from('project_construction_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single()
      
      // Get executive summary metrics
      const { data: executive } = await this.supabase
        .from('project_executive_metrics')
        .select('*')
        .eq('project_id', projectId)
        .single()
      
      console.log('✅ Retrieved project data:', {
        projectName: project.name,
        hasFinancials: !!financials,
        hasConstruction: !!construction,
        hasExecutive: !!executive
      })
      
      // Build comprehensive project status from real data
      const projectStatus = {
        project_id: projectId,
        project_name: project.name,
        description: project.description,
        status: project.status || 'active',
        
        // Financial data (real or fallback)
        budget_total: financials?.total_budget || project.total_value || 0,
        budget_used: financials?.spent_to_date || 0,
        budget_remaining: (financials?.total_budget || project.total_value || 0) - (financials?.spent_to_date || 0),
        contingency_used: financials?.contingency_used || 0,
        contingency_remaining: financials?.contingency_remaining || 0,
        forecasted_cost: financials?.forecasted_cost || financials?.total_budget || project.total_value || 0,
        roi: financials?.roi || 0,
        
        // Construction progress (real or calculated)
        completion_percentage: construction?.overall_completion || executive?.completion_percentage || 0,
        current_phase: construction?.current_phase || project.phase || 'Planning',
        safety_score: construction?.safety_score || 0,
        quality_score: construction?.quality_score || 0,
        
        // Timeline data
        timeline: {
          start_date: project.start_date,
          expected_completion: project.end_date,
          current_phase: construction?.current_phase || project.phase || 'Planning',
          days_elapsed: project.start_date ? Math.floor((Date.now() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24)) : 0
        },
        
        // Performance metrics
        kpis: {
          schedule_variance: construction?.schedule_variance || 0,
          cost_variance: financials ? ((financials.spent_to_date / (financials.total_budget || 1)) * 100) - (construction?.overall_completion || 0) : 0,
          quality_score: construction?.quality_score || 0,
          safety_incidents: construction?.safety_incidents || 0
        },
        
        last_updated: new Date().toISOString(),
        data_source: 'real_database'
      }
      
      return projectStatus
      
    } catch (error) {
      console.error('❌ Error fetching project status:', error)
      
      // Fallback to basic project info if detailed metrics aren't available
      try {
        // Try to get the first available project if we're still in portfolio mode
        let fallbackProjectId = parameters.project_id;
        if (fallbackProjectId === 'portfolio' || !fallbackProjectId) {
          const { data: projects } = await this.supabase
            .from('projects')
            .select('id')
            .limit(1);
          fallbackProjectId = projects?.[0]?.id || parameters.project_id;
        }
        
        const { data: project } = await this.supabase
          .from('projects')
          .select('*')
          .eq('id', fallbackProjectId)
          .single()
        
        if (project) {
          return {
            project_id: fallbackProjectId,
            project_name: project.name,
            description: project.description,
            status: project.status || 'active',
            budget_total: project.total_value || 0,
            timeline: {
              start_date: project.start_date,
              expected_completion: project.end_date,
              current_phase: project.phase || 'Planning'
            },
            last_updated: new Date().toISOString(),
            data_source: 'basic_project_data',
            note: 'Detailed metrics not available - showing basic project information'
          }
        }
      } catch (fallbackError) {
        console.error('❌ Fallback query also failed:', fallbackError)
      }
      
      // If all else fails, return error status
      return {
        project_id: parameters.project_id,
        error: 'Could not retrieve project data',
        status: 'unknown',
        last_updated: new Date().toISOString(),
        data_source: 'error_fallback'
      }
    }
  }

  private async getPortfolioData(allProjects: any[]): Promise<any> {
    try {
      console.log(`📊 Aggregating portfolio data for ${allProjects.length} projects...`);
      
      // Get financial metrics for all projects
      const projectIds = allProjects.map(p => p.id);
      const { data: allFinancials } = await this.supabase
        .from('project_financial_metrics')
        .select('*')
        .in('project_id', projectIds);
      
      // Get construction metrics for all projects  
      const { data: allConstruction } = await this.supabase
        .from('project_construction_metrics')
        .select('*')
        .in('project_id', projectIds);
      
      // Calculate portfolio-level metrics
      const portfolioMetrics = {
        portfolio_id: 'portfolio',
        portfolio_name: 'Portfolio Overview',
        description: 'Aggregate data for all active projects',
        total_projects: allProjects.length,
        
        // Project summaries
        projects: allProjects.map(project => {
          const financials = allFinancials?.find(f => f.project_id === project.id);
          const construction = allConstruction?.find(c => c.project_id === project.id);
          
          return {
            project_id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            current_phase: construction?.current_phase || 'Planning',
            budget_total: financials?.total_budget || project.total_value || 0,
            budget_used: financials?.spent_to_date || 0,
            completion_percentage: construction?.overall_completion || 0,
            safety_score: construction?.safety_score || 0,
            quality_score: construction?.quality_score || 0,
            start_date: project.start_date,
            end_date: project.end_date
          };
        }),
        
        // Portfolio aggregates
        total_budget: allFinancials?.reduce((sum, f) => sum + (f.total_budget || 0), 0) || 0,
        total_spent: allFinancials?.reduce((sum, f) => sum + (f.spent_to_date || 0), 0) || 0,
        average_completion: allConstruction?.reduce((sum, c) => sum + (c.overall_completion || 0), 0) / Math.max(allConstruction?.length || 1, 1),
        average_safety_score: allConstruction?.reduce((sum, c) => sum + (c.safety_score || 0), 0) / Math.max(allConstruction?.length || 1, 1),
        average_quality_score: allConstruction?.reduce((sum, c) => sum + (c.quality_score || 0), 0) / Math.max(allConstruction?.length || 1, 1),
        
        // Project status breakdown
        status_breakdown: {
          active: allProjects.filter(p => p.status === 'active').length,
          completed: allProjects.filter(p => p.status === 'completed').length,
          planning: allProjects.filter(p => p.status === 'planning').length,
          on_hold: allProjects.filter(p => p.status === 'on_hold').length
        },
        
        last_updated: new Date().toISOString(),
        data_source: 'portfolio_aggregate'
      };
      
      console.log('✅ Portfolio data aggregated:', {
        total_projects: portfolioMetrics.total_projects,
        total_budget: portfolioMetrics.total_budget,
        avg_completion: Math.round(portfolioMetrics.average_completion),
        avg_safety: Math.round(portfolioMetrics.average_safety_score)
      });
      
      return portfolioMetrics;
      
    } catch (error) {
      console.error('❌ Error aggregating portfolio data:', error);
      
      // Fallback to basic project list
      return {
        portfolio_id: 'portfolio',
        portfolio_name: 'Portfolio Overview',
        description: 'Basic project listing (detailed metrics unavailable)',
        total_projects: allProjects.length,
        projects: allProjects.map(p => ({
          project_id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          total_value: p.total_value
        })),
        last_updated: new Date().toISOString(),
        data_source: 'basic_portfolio_data',
        note: 'Detailed portfolio metrics not available'
      };
    }
  }

  private async executeListContractors(parameters: any): Promise<any> {
    // Mock implementation - integrate with your contractor database
    const contractors = [
      {
        id: 'contractor_1',
        name: 'ABC Construction',
        specialties: ['framing', 'electrical'],
        rating: 4.8,
        active_projects: 3
      },
      {
        id: 'contractor_2',
        name: 'XYZ Plumbing',
        specialties: ['plumbing', 'hvac'],
        rating: 4.6,
        active_projects: 2
      }
    ]

    // Apply filters if provided
    if (parameters.specialty) {
      return contractors.filter(c =>
        c.specialties.includes(parameters.specialty.toLowerCase())
      )
    }

    return contractors
  }

  private async executeCreateChangeOrder(parameters: any): Promise<any> {
    // Mock implementation - integrate with your construction management system
    const changeOrder = {
      id: `CO_${Date.now()}`,
      project_id: parameters.project_id,
      description: parameters.description,
      cost_impact: parameters.cost_impact,
      status: 'pending_approval',
      created_at: new Date().toISOString(),
      created_by: 'system'
    }

    // Store change order in database
    try {
      await this.supabase
        .from('data_store')
        .insert({
          key: `change_order_${changeOrder.id}`,
          value: changeOrder,
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.warn('Could not store change order:', error)
    }

    return {
      success: true,
      change_order_id: changeOrder.id,
      status: 'created',
      cost_impact: parameters.cost_impact
    }
  }

  private async executeUpdateSchedule(parameters: any): Promise<any> {
    // Mock implementation - integrate with your project management system
    const update = {
      project_id: parameters.project_id,
      task_id: parameters.task_id,
      old_date: parameters.old_date,
      new_date: parameters.new_date,
      updated_at: new Date().toISOString(),
      reason: parameters.reason || 'Schedule adjustment'
    }

    // Store schedule update
    try {
      await this.supabase
        .from('data_store')
        .insert({
          key: `schedule_update_${Date.now()}`,
          value: update,
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.warn('Could not store schedule update:', error)
    }

    return {
      success: true,
      project_id: parameters.project_id,
      task_id: parameters.task_id,
      new_date: parameters.new_date
    }
  }

  private async executeTool(toolName: string, parameters: any): Promise<any> {
    // Check if it's a read operation
    const readOperations = ['get_project_status', 'list_contractors', 'get_communications', 'get_emails', 'get_teams_messages', 'get_calendar_events']
    
    if (readOperations.includes(toolName)) {
      switch (toolName) {
        case 'get_project_status':
          return await this.executeGetProjectStatus(parameters)
        case 'list_contractors':
          return await this.executeListContractors(parameters)
        default:
          // Handle other read operations
          return await this.executeReadOperation(toolName, parameters)
      }
    }
    
    // For all other operations, call the platform-actions edge function
    return await this.executePlatformAction(toolName, parameters)
  }
  
  private async executePlatformAction(action: string, parameters: any): Promise<any> {
    console.log(`🚀 Executing platform action: ${action}`, parameters)
    
    // Map tool names to platform action format
    const actionMapping: Record<string, { action: string, resource: string }> = {
      'create_task': { action: 'create', resource: 'tasks' },
      'create_meeting': { action: 'create', resource: 'meetings' },
      'create_change_order': { action: 'create', resource: 'change_orders' },
      'create_rfi': { action: 'create', resource: 'rfis' },
      'create_submittal': { action: 'create', resource: 'submittals' },
      'update_schedule': { action: 'update', resource: 'schedules' },
      'update_budget': { action: 'update', resource: 'budgets' },
      'send_email': { action: 'execute', resource: 'send_email' },
      'send_sms': { action: 'execute', resource: 'send_sms' },
      'send_teams_message': { action: 'execute', resource: 'send_teams_message' },
      'schedule_meeting': { action: 'execute', resource: 'schedule_meeting' },
      'approve_change_order': { action: 'execute', resource: 'approve_change_order' },
      'assign_task': { action: 'execute', resource: 'assign_task' },
      'flag_risk': { action: 'execute', resource: 'flag_risk' }
    }
    
    const mapping = actionMapping[action] || { action: 'execute', resource: action }
    
    // Call the platform-actions edge function
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const response = await fetch(`${supabaseUrl}/functions/v1/platform-actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({
        action: mapping.action,
        resource: mapping.resource,
        data: parameters,
        user_id: parameters.user_id || 'ai_system',
        project_id: parameters.project_id,
        ai_request_id: `ai_${Date.now()}`,
        require_confirmation: false // AI actions are pre-approved in this context
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Platform action failed: ${error}`)
    }
    
    const result = await response.json()
    console.log(`✅ Platform action completed:`, result)
    
    return result
  }
  
  private async executeReadOperation(operation: string, parameters: any): Promise<any> {
    // Handle various read operations
    switch (operation) {
      case 'get_communications':
        const { data: comms } = await this.supabase
          .from('communications')
          .select('*')
          .eq('project_id', parameters.project_id)
          .order('created_at', { ascending: false })
          .limit(10)
        return comms || []
        
      case 'get_emails':
        const { data: emails } = await this.supabase
          .from('communications')
          .select('*')
          .eq('type', 'email')
          .order('created_at', { ascending: false })
          .limit(10)
        return emails || []
        
      case 'get_teams_messages':
        const { data: messages } = await this.supabase
          .from('communications')
          .select('*')
          .eq('type', 'teams')
          .order('created_at', { ascending: false })
          .limit(10)
        return messages || []
        
      case 'get_calendar_events':
        const { data: events } = await this.supabase
          .from('meetings')
          .select('*')
          .gte('start_time', new Date().toISOString())
          .order('start_time', { ascending: true })
          .limit(10)
        return events || []
        
      default:
        return { message: `Read operation ${operation} not implemented` }
    }
  }

  async analyzeAndExecute(
    userMessage: string,
    aiResponse: string,
    projectId: string,
    userId: string,
    requireApproval: boolean
  ): Promise<any[]> {
    const toolCalls: any[] = []
    const lowerMessage = userMessage.toLowerCase()

    try {
      // More selective data fetching - only fetch data for specific requests
      const dataKeywords = [
        'status', 'budget', 'spent', 'cost', 'progress', 'completion', 'safety', 'quality',
        'how much', 'what is', 'show me', 'portfolio', 'overview', 'metrics', 'data'
      ]
      
      const needsProjectData = dataKeywords.some(keyword => lowerMessage.includes(keyword)) ||
                               projectId === 'portfolio' // Portfolio view gets data
      
      // Only fetch project data for specific data requests
      if (needsProjectData) {
        
        const toolName = 'get_project_status'
        
        // Check if user is asking about a specific project by name
        let targetProjectId = projectId;
        
        if (lowerMessage.includes('downtown') && lowerMessage.includes('office')) {
          // Query for Downtown Office Building specifically
          const { data: specificProject } = await this.supabase
            .from('projects')
            .select('id')
            .ilike('name', '%downtown%office%')
            .single();
          if (specificProject) targetProjectId = specificProject.id;
        } else if (lowerMessage.includes('mixed') && lowerMessage.includes('use')) {
          const { data: specificProject } = await this.supabase
            .from('projects')
            .select('id')
            .ilike('name', '%mixed-use%')
            .single();
          if (specificProject) targetProjectId = specificProject.id;
        } else if (lowerMessage.includes('green') && lowerMessage.includes('valley')) {
          const { data: specificProject } = await this.supabase
            .from('projects')
            .select('id')
            .ilike('name', '%green%valley%')
            .single();
          if (specificProject) targetProjectId = specificProject.id;
        } else if (lowerMessage.includes('riverside')) {
          const { data: specificProject } = await this.supabase
            .from('projects')
            .select('id')
            .ilike('name', '%riverside%')
            .single();
          if (specificProject) targetProjectId = specificProject.id;
        }
        
        const parameters = { project_id: targetProjectId }
        const result = await this.executeToolWithLogging(toolName, parameters, requireApproval, userId, projectId)
        toolCalls.push(result)
      }

      // Contractor Tool
      if (lowerMessage.includes('contractor') || lowerMessage.includes('vendor')) {
        const toolName = 'list_contractors'
        const parameters: any = {}
        
        // Extract specialty if mentioned
        if (lowerMessage.includes('electrical')) parameters.specialty = 'electrical'
        if (lowerMessage.includes('plumbing')) parameters.specialty = 'plumbing'
        if (lowerMessage.includes('hvac')) parameters.specialty = 'hvac'
        
        const result = await this.executeToolWithLogging(toolName, parameters, requireApproval, userId, projectId)
        toolCalls.push(result)
      }

      // Change Order Tool
      if (lowerMessage.includes('change order') || lowerMessage.includes('change request')) {
        const toolName = 'create_change_order'
        const parameters = {
          project_id: projectId,
          description: 'Change order requested via AI assistant',
          cost_impact: 5000 // Default amount, should be extracted from message
        }
        const result = await this.executeToolWithLogging(toolName, parameters, requireApproval, userId, projectId)
        toolCalls.push(result)
      }

      // Schedule Update Tool
      if (lowerMessage.includes('reschedule') || lowerMessage.includes('delay') || lowerMessage.includes('move date')) {
        const toolName = 'update_schedule'
        const parameters = {
          project_id: projectId,
          task_id: 'extracted_task_id', // Should extract from message
          new_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
        }
        const result = await this.executeToolWithLogging(toolName, parameters, requireApproval, userId, projectId)
        toolCalls.push(result)
      }

    } catch (error) {
      console.error('Tool execution error:', error)
      toolCalls.push({
        success: false,
        tool_name: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }

    return toolCalls
  }

  private async executeToolWithLogging(
    toolName: string,
    parameters: any,
    requireApproval: boolean,
    userId: string,
    projectId: string
  ): Promise<any> {
    const executionId = this.generateExecutionId()
    const toolConfig = this.getToolConfig(toolName)
    
    if (!toolConfig) {
      throw new Error(`Unknown tool: ${toolName}`)
    }

    // Validate parameters
    try {
      this.validateParameters(toolConfig, parameters)
    } catch (error) {
      await this.logExecution(executionId, toolName, parameters, 'failed', error.message, 0, userId, projectId)
      throw error
    }

    // Check if tool requires approval
    if (toolConfig.side_effect && requireApproval) {
      // Log pending approval request
      await this.logExecution(executionId, toolName, parameters, 'pending_approval', 'Awaiting user approval', 0, userId, projectId)
      
      return {
        requires_approval: true,
        execution_id: executionId,
        tool_name: toolName,
        tool_parameters: parameters,
        estimated_cost: toolConfig.cost_per_execution,
        side_effects: 'This tool will make changes to external systems',
        success: false
      }
    }

    // Execute the tool
    let result: any
    let status = 'success'
    
    try {
      result = await this.executeTool(toolName, parameters)
      result.tool_name = toolName
      result.execution_id = executionId
    } catch (error) {
      status = 'failed'
      result = {
        success: false,
        tool_name: toolName,
        execution_id: executionId,
        error: error.message
      }
    }

    // Log execution
    await this.logExecution(executionId, toolName, parameters, status, result, toolConfig.cost_per_execution, userId, projectId)

    return {
      ...result,
      cost: toolConfig.cost_per_execution,
      timestamp: new Date().toISOString(),
      requires_approval: false
    }
  }
}

