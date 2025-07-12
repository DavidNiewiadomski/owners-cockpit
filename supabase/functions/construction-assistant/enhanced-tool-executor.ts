import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface Tool {
  name: string
  description: string
  parameters: any
  execute: (params: any, context: ToolContext) => Promise<any>
}

export interface ToolContext {
  supabase: any
  user_id: string
  project_id: string
  conversation_id: string
}

export class EnhancedToolExecutor {
  private tools: Map<string, Tool> = new Map()
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
    this.registerAllTools()
  }

  private registerAllTools() {
    // Project Management Tools
    this.registerTool({
      name: 'getProjectStatus',
      description: 'Get comprehensive project status including progress, budget, schedule',
      parameters: {
        project_id: { type: 'string', required: true },
        include_details: { type: 'boolean', default: true }
      },
      execute: async (params, context) => {
        const { data: project } = await context.supabase
          .from('projects')
          .select(`
            *,
            tasks(count),
            change_orders(count),
            rfis(count),
            project_risks(count)
          `)
          .eq('id', params.project_id)
          .single()

        const { data: metrics } = await context.supabase
          .from('project_metrics')
          .select('*')
          .eq('project_id', params.project_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          project,
          metrics,
          summary: {
            overall_health: this.calculateProjectHealth(project, metrics),
            key_risks: await this.getKeyRisks(context, params.project_id),
            upcoming_milestones: await this.getUpcomingMilestones(context, params.project_id)
          }
        }
      }
    })

    this.registerTool({
      name: 'updateProjectProgress',
      description: 'Update project progress percentage and phase',
      parameters: {
        project_id: { type: 'string', required: true },
        progress: { type: 'number', required: true },
        phase: { type: 'string' },
        notes: { type: 'string' }
      },
      execute: async (params, context) => {
        const updateData: any = {
          progress_percentage: params.progress,
          last_updated: new Date().toISOString()
        }
        
        if (params.phase) updateData.current_phase = params.phase

        const { data, error } = await context.supabase
          .from('projects')
          .update(updateData)
          .eq('id', params.project_id)
          .select()
          .single()

        if (error) throw error

        // Log progress update
        await context.supabase.from('project_progress_logs').insert({
          project_id: params.project_id,
          progress: params.progress,
          phase: params.phase,
          notes: params.notes,
          updated_by: context.user_id,
          updated_by_ai: true
        })

        return data
      }
    })

    // Schedule Management Tools
    this.registerTool({
      name: 'getScheduleStatus',
      description: 'Get project schedule status and critical path',
      parameters: {
        project_id: { type: 'string', required: true }
      },
      execute: async (params, context) => {
        const { data: schedule } = await context.supabase
          .from('project_schedules')
          .select(`
            *,
            schedule_tasks(*)
          `)
          .eq('project_id', params.project_id)
          .single()

        const criticalPath = await this.calculateCriticalPath(context, params.project_id)
        const delays = await this.identifyDelays(context, params.project_id)

        return {
          schedule,
          critical_path: criticalPath,
          delays,
          float_analysis: await this.analyzeFloat(context, params.project_id),
          weather_impact: await this.getWeatherImpact(context, params.project_id)
        }
      }
    })

    this.registerTool({
      name: 'updateSchedule',
      description: 'Update project schedule with new dates or dependencies',
      parameters: {
        project_id: { type: 'string', required: true },
        task_id: { type: 'string' },
        start_date: { type: 'string' },
        end_date: { type: 'string' },
        dependencies: { type: 'array' }
      },
      execute: async (params, context) => {
        // Update schedule task
        const updates: any = {}
        if (params.start_date) updates.start_date = params.start_date
        if (params.end_date) updates.end_date = params.end_date
        
        const { data } = await context.supabase
          .from('schedule_tasks')
          .update(updates)
          .eq('id', params.task_id)
          .select()

        // Update dependencies if provided
        if (params.dependencies) {
          await this.updateDependencies(context, params.task_id, params.dependencies)
        }

        // Recalculate critical path
        await this.recalculateCriticalPath(context, params.project_id)

        return data
      }
    })

    // Budget & Financial Tools
    this.registerTool({
      name: 'getBudgetStatus',
      description: 'Get comprehensive budget status and variance analysis',
      parameters: {
        project_id: { type: 'string', required: true },
        include_forecast: { type: 'boolean', default: true }
      },
      execute: async (params, context) => {
        const { data: budget } = await context.supabase
          .from('project_budgets')
          .select(`
            *,
            budget_items(*),
            change_orders(cost_impact)
          `)
          .eq('project_id', params.project_id)
          .single()

        const spending = await this.calculateSpending(context, params.project_id)
        const forecast = params.include_forecast ? 
          await this.forecastBudget(context, params.project_id) : null

        return {
          budget,
          actual_spending: spending,
          variance: this.calculateVariance(budget, spending),
          forecast,
          cost_trends: await this.getCostTrends(context, params.project_id),
          recommendations: this.generateBudgetRecommendations(budget, spending)
        }
      }
    })

    this.registerTool({
      name: 'approveChangeOrder',
      description: 'Approve or reject a change order',
      parameters: {
        change_order_id: { type: 'string', required: true },
        decision: { type: 'string', enum: ['approve', 'reject'], required: true },
        notes: { type: 'string' }
      },
      execute: async (params, context) => {
        const { data } = await context.supabase
          .from('change_orders')
          .update({
            status: params.decision === 'approve' ? 'approved' : 'rejected',
            reviewed_by: context.user_id,
            reviewed_by_ai: true,
            review_notes: params.notes,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', params.change_order_id)
          .select()
          .single()

        // Update budget if approved
        if (params.decision === 'approve' && data.cost_impact) {
          await this.updateBudgetWithChangeOrder(context, data)
        }

        return data
      }
    })

    // Safety & Compliance Tools
    this.registerTool({
      name: 'getSafetyMetrics',
      description: 'Get safety performance metrics and incidents',
      parameters: {
        project_id: { type: 'string', required: true },
        timeframe: { type: 'string', default: '30days' }
      },
      execute: async (params, context) => {
        const startDate = this.getTimeframeStartDate(params.timeframe)
        
        const { data: incidents } = await context.supabase
          .from('safety_incidents')
          .select('*')
          .eq('project_id', params.project_id)
          .gte('occurred_at', startDate)

        const { data: inspections } = await context.supabase
          .from('safety_inspections')
          .select('*')
          .eq('project_id', params.project_id)
          .gte('conducted_at', startDate)

        const { data: training } = await context.supabase
          .from('safety_training')
          .select('*')
          .eq('project_id', params.project_id)

        return {
          incident_rate: this.calculateIncidentRate(incidents),
          days_without_incident: await this.getDaysWithoutIncident(context, params.project_id),
          compliance_score: this.calculateComplianceScore(inspections),
          training_completion: this.calculateTrainingCompletion(training),
          high_risk_areas: await this.identifyHighRiskAreas(context, params.project_id),
          recommendations: this.generateSafetyRecommendations(incidents, inspections)
        }
      }
    })

    this.registerTool({
      name: 'reportSafetyIssue',
      description: 'Report a safety issue or near-miss',
      parameters: {
        project_id: { type: 'string', required: true },
        type: { type: 'string', enum: ['incident', 'near_miss', 'hazard'], required: true },
        description: { type: 'string', required: true },
        location: { type: 'string' },
        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
      },
      execute: async (params, context) => {
        const { data } = await context.supabase
          .from('safety_incidents')
          .insert({
            project_id: params.project_id,
            type: params.type,
            description: params.description,
            location: params.location,
            severity: params.severity || 'medium',
            reported_by: context.user_id,
            reported_by_ai: true,
            status: 'open',
            occurred_at: new Date().toISOString()
          })
          .select()
          .single()

        // Notify safety manager
        await this.notifySafetyManager(context, data)

        return data
      }
    })

    // Quality Control Tools
    this.registerTool({
      name: 'performQualityCheck',
      description: 'Perform or schedule a quality inspection',
      parameters: {
        project_id: { type: 'string', required: true },
        area: { type: 'string', required: true },
        type: { type: 'string', required: true },
        checklist_id: { type: 'string' }
      },
      execute: async (params, context) => {
        const { data: inspection } = await context.supabase
          .from('quality_inspections')
          .insert({
            project_id: params.project_id,
            area: params.area,
            type: params.type,
            checklist_id: params.checklist_id,
            scheduled_by: context.user_id,
            scheduled_by_ai: true,
            status: 'scheduled',
            scheduled_date: new Date().toISOString()
          })
          .select()
          .single()

        return inspection
      }
    })

    // Communication Tools
    this.registerTool({
      name: 'sendProjectUpdate',
      description: 'Send project update to stakeholders',
      parameters: {
        project_id: { type: 'string', required: true },
        recipients: { type: 'array', required: true },
        subject: { type: 'string', required: true },
        message: { type: 'string', required: true },
        include_metrics: { type: 'boolean', default: true }
      },
      execute: async (params, context) => {
        let messageBody = params.message

        if (params.include_metrics) {
          const metrics = await this.getProjectMetricsSummary(context, params.project_id)
          messageBody += `\n\n${metrics}`
        }

        const { data } = await context.supabase.functions.invoke('send-email', {
          body: {
            to: params.recipients,
            subject: params.subject,
            html: messageBody,
            from: 'ai-assistant@ownerscockpit.com'
          }
        })

        // Log communication
        await context.supabase.from('project_communications').insert({
          project_id: params.project_id,
          type: 'email',
          subject: params.subject,
          recipients: params.recipients,
          sent_by: context.user_id,
          sent_by_ai: true
        })

        return data
      }
    })

    // Document Management Tools
    this.registerTool({
      name: 'findDocuments',
      description: 'Search for project documents',
      parameters: {
        project_id: { type: 'string', required: true },
        query: { type: 'string' },
        type: { type: 'string' },
        date_range: { type: 'object' }
      },
      execute: async (params, context) => {
        let query = context.supabase
          .from('documents')
          .select('*')
          .eq('project_id', params.project_id)

        if (params.type) {
          query = query.eq('type', params.type)
        }

        if (params.query) {
          query = query.or(`name.ilike.%${params.query}%,content.ilike.%${params.query}%`)
        }

        if (params.date_range) {
          if (params.date_range.start) {
            query = query.gte('created_at', params.date_range.start)
          }
          if (params.date_range.end) {
            query = query.lte('created_at', params.date_range.end)
          }
        }

        const { data } = await query
        return data
      }
    })

    // RFI Management Tools
    this.registerTool({
      name: 'createRFI',
      description: 'Create a Request for Information',
      parameters: {
        project_id: { type: 'string', required: true },
        subject: { type: 'string', required: true },
        question: { type: 'string', required: true },
        discipline: { type: 'string' },
        assigned_to: { type: 'string' },
        due_date: { type: 'string' }
      },
      execute: async (params, context) => {
        const { data } = await context.supabase
          .from('rfis')
          .insert({
            project_id: params.project_id,
            subject: params.subject,
            question: params.question,
            discipline: params.discipline || 'general',
            assigned_to: params.assigned_to,
            due_date: params.due_date,
            created_by: context.user_id,
            created_by_ai: true,
            status: 'open'
          })
          .select()
          .single()

        return data
      }
    })

    // Weather Integration
    this.registerTool({
      name: 'getWeatherImpact',
      description: 'Get weather forecast and impact on construction',
      parameters: {
        project_id: { type: 'string', required: true },
        days_ahead: { type: 'number', default: 7 }
      },
      execute: async (params, context) => {
        const { data: project } = await context.supabase
          .from('projects')
          .select('location')
          .eq('id', params.project_id)
          .single()

        // This would integrate with a weather API
        const weatherData = await this.fetchWeatherForecast(project.location, params.days_ahead)
        const impact = this.analyzeWeatherImpact(weatherData)

        return {
          forecast: weatherData,
          impact_analysis: impact,
          recommended_actions: this.generateWeatherRecommendations(impact)
        }
      }
    })

    // Resource Management
    this.registerTool({
      name: 'checkResourceAvailability',
      description: 'Check availability of workers, equipment, or materials',
      parameters: {
        project_id: { type: 'string', required: true },
        resource_type: { type: 'string', enum: ['labor', 'equipment', 'material'], required: true },
        resource_id: { type: 'string' },
        date_range: { type: 'object' }
      },
      execute: async (params, context) => {
        const table = params.resource_type === 'labor' ? 'workers' :
                     params.resource_type === 'equipment' ? 'equipment' : 'materials'

        const { data } = await context.supabase
          .from(`${table}_availability`)
          .select('*')
          .eq('project_id', params.project_id)

        return {
          available: data,
          conflicts: await this.checkResourceConflicts(context, params),
          suggestions: await this.suggestAlternativeResources(context, params)
        }
      }
    })

    // Procurement Tools
    this.registerTool({
      name: 'createPurchaseOrder',
      description: 'Create a purchase order for materials or services',
      parameters: {
        project_id: { type: 'string', required: true },
        vendor_id: { type: 'string', required: true },
        items: { type: 'array', required: true },
        delivery_date: { type: 'string' }
      },
      execute: async (params, context) => {
        const total = params.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

        const { data } = await context.supabase
          .from('purchase_orders')
          .insert({
            project_id: params.project_id,
            vendor_id: params.vendor_id,
            items: params.items,
            total_amount: total,
            delivery_date: params.delivery_date,
            created_by: context.user_id,
            created_by_ai: true,
            status: 'draft'
          })
          .select()
          .single()

        return data
      }
    })

    // Analytics Tools
    this.registerTool({
      name: 'generateProjectReport',
      description: 'Generate comprehensive project report',
      parameters: {
        project_id: { type: 'string', required: true },
        report_type: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'executive'], required: true },
        sections: { type: 'array', default: ['progress', 'budget', 'safety', 'quality', 'risks'] }
      },
      execute: async (params, context) => {
        const reportData = {}

        for (const section of params.sections) {
          switch (section) {
            case 'progress':
              reportData['progress'] = await this.getProjectProgress(context, params.project_id)
              break
            case 'budget':
              reportData['budget'] = await this.getBudgetSummary(context, params.project_id)
              break
            case 'safety':
              reportData['safety'] = await this.getSafetySummary(context, params.project_id)
              break
            case 'quality':
              reportData['quality'] = await this.getQualitySummary(context, params.project_id)
              break
            case 'risks':
              reportData['risks'] = await this.getRiskSummary(context, params.project_id)
              break
          }
        }

        // Generate report
        const { data: report } = await context.supabase.functions.invoke('generate-report', {
          body: {
            project_id: params.project_id,
            type: params.report_type,
            data: reportData,
            generated_by_ai: true
          }
        })

        return report
      }
    })
  }

  private registerTool(tool: Tool) {
    this.tools.set(tool.name, tool)
  }

  async executeTool(toolName: string, params: any, context: ToolContext): Promise<any> {
    const tool = this.tools.get(toolName)
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`)
    }

    console.log(`Executing tool: ${toolName}`, params)
    
    try {
      const result = await tool.execute(params, context)
      console.log(`Tool ${toolName} completed successfully`)
      return {
        name: toolName,
        params,
        result,
        success: true
      }
    } catch (error) {
      console.error(`Tool ${toolName} failed:`, error)
      return {
        name: toolName,
        params,
        error: error.message,
        success: false
      }
    }
  }

  getAvailableTools(): Tool[] {
    return Array.from(this.tools.values())
  }

  // Helper methods
  private calculateProjectHealth(project: any, metrics: any): string {
    // Complex health calculation based on multiple factors
    const factors = {
      schedule: metrics?.schedule_performance_index || 1,
      budget: metrics?.cost_performance_index || 1,
      quality: metrics?.quality_score || 100,
      safety: metrics?.safety_score || 100
    }

    const healthScore = (factors.schedule + factors.budget + (factors.quality / 100) + (factors.safety / 100)) / 4

    if (healthScore >= 0.9) return 'excellent'
    if (healthScore >= 0.8) return 'good'
    if (healthScore >= 0.7) return 'fair'
    return 'at-risk'
  }

  private async getKeyRisks(context: ToolContext, projectId: string): Promise<any[]> {
    const { data } = await context.supabase
      .from('project_risks')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'open')
      .order('severity', { ascending: false })
      .limit(5)

    return data || []
  }

  private async getUpcomingMilestones(context: ToolContext, projectId: string): Promise<any[]> {
    const { data } = await context.supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .gte('due_date', new Date().toISOString())
      .order('due_date')
      .limit(5)

    return data || []
  }

  private getTimeframeStartDate(timeframe: string): string {
    const now = new Date()
    switch (timeframe) {
      case '7days':
        now.setDate(now.getDate() - 7)
        break
      case '30days':
        now.setDate(now.getDate() - 30)
        break
      case '90days':
        now.setDate(now.getDate() - 90)
        break
      default:
        now.setDate(now.getDate() - 30)
    }
    return now.toISOString()
  }

  private calculateIncidentRate(incidents: any[]): number {
    // OSHA incident rate calculation
    // (Number of incidents × 200,000) / Employee hours worked
    return incidents.length // Simplified for now
  }

  private async getDaysWithoutIncident(context: ToolContext, projectId: string): Promise<number> {
    const { data } = await context.supabase
      .from('safety_incidents')
      .select('occurred_at')
      .eq('project_id', projectId)
      .order('occurred_at', { ascending: false })
      .limit(1)
      .single()

    if (!data) return 999 // No incidents

    const lastIncident = new Date(data.occurred_at)
    const today = new Date()
    return Math.floor((today.getTime() - lastIncident.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Additional helper methods would continue...
  private calculateComplianceScore(inspections: any[]): number {
    if (!inspections.length) return 0
    const passed = inspections.filter(i => i.result === 'pass').length
    return Math.round((passed / inspections.length) * 100)
  }

  private calculateTrainingCompletion(training: any[]): number {
    if (!training.length) return 0
    const completed = training.filter(t => t.status === 'completed').length
    return Math.round((completed / training.length) * 100)
  }

  private async identifyHighRiskAreas(context: ToolContext, projectId: string): Promise<any[]> {
    // Analyze incidents and inspections to identify patterns
    return []
  }

  private generateSafetyRecommendations(incidents: any[], inspections: any[]): string[] {
    const recommendations = []
    
    if (incidents.length > 5) {
      recommendations.push('Increase safety training frequency')
    }
    
    if (inspections.some(i => i.result === 'fail')) {
      recommendations.push('Address failed inspection items immediately')
    }

    return recommendations
  }

  private async calculateCriticalPath(context: ToolContext, projectId: string): Promise<any> {
    // Critical path calculation logic
    return { tasks: [], duration: 0 }
  }

  private async identifyDelays(context: ToolContext, projectId: string): Promise<any[]> {
    return []
  }

  private async analyzeFloat(context: ToolContext, projectId: string): Promise<any> {
    return { total_float: 0, free_float: 0 }
  }

  private async getWeatherImpact(context: ToolContext, projectId: string): Promise<any> {
    return { impact_days: 0, activities_affected: [] }
  }

  private async fetchWeatherForecast(location: string, days: number): Promise<any> {
    // Weather API integration
    return { forecast: [] }
  }

  private analyzeWeatherImpact(weatherData: any): any {
    return { severity: 'low', affected_activities: [] }
  }

  private generateWeatherRecommendations(impact: any): string[] {
    return []
  }

  private async calculateSpending(context: ToolContext, projectId: string): Promise<any> {
    return { total: 0, by_category: {} }
  }

  private calculateVariance(budget: any, spending: any): any {
    return { amount: 0, percentage: 0 }
  }

  private async forecastBudget(context: ToolContext, projectId: string): Promise<any> {
    return { projected_total: 0, completion_cost: 0 }
  }

  private async getCostTrends(context: ToolContext, projectId: string): Promise<any> {
    return { trend: 'stable', projection: [] }
  }

  private generateBudgetRecommendations(budget: any, spending: any): string[] {
    return []
  }

  private async updateDependencies(context: ToolContext, taskId: string, dependencies: any[]): Promise<void> {
    // Update task dependencies
  }

  private async recalculateCriticalPath(context: ToolContext, projectId: string): Promise<void> {
    // Recalculate critical path
  }

  private async updateBudgetWithChangeOrder(context: ToolContext, changeOrder: any): Promise<void> {
    // Update budget
  }

  private async notifySafetyManager(context: ToolContext, incident: any): Promise<void> {
    // Send notification
  }

  private async getProjectMetricsSummary(context: ToolContext, projectId: string): Promise<string> {
    return 'Project metrics summary'
  }

  private async checkResourceConflicts(context: ToolContext, params: any): Promise<any[]> {
    return []
  }

  private async suggestAlternativeResources(context: ToolContext, params: any): Promise<any[]> {
    return []
  }

  private async getProjectProgress(context: ToolContext, projectId: string): Promise<any> {
    return {}
  }

  private async getBudgetSummary(context: ToolContext, projectId: string): Promise<any> {
    return {}
  }

  private async getSafetySummary(context: ToolContext, projectId: string): Promise<any> {
    return {}
  }

  private async getQualitySummary(context: ToolContext, projectId: string): Promise<any> {
    return {}
  }

  private async getRiskSummary(context: ToolContext, projectId: string): Promise<any> {
    return {}
  }
}