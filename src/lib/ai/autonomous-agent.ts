import { FrontendAIService } from './frontend-ai-service';
import { supabase } from '@/integrations/supabase/client';

export interface AgentCapability {
  name: string;
  description: string;
  category: 'analysis' | 'action' | 'communication' | 'navigation' | 'workflow';
  requiredPermissions?: string[];
  parameters?: any;
}

export interface AgentAction {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  requiresApproval?: boolean;
  approvedBy?: string;
  executedAt?: Date;
}

export interface AgentPlan {
  goal: string;
  steps: AgentAction[];
  estimatedDuration: number;
  confidence: number;
  risks: string[];
}

export interface AgentMemory {
  shortTerm: any[];
  longTerm: any[];
  patterns: any[];
  preferences: any;
}

export class AutonomousAgent {
  private aiService: FrontendAIService;
  private capabilities: Map<string, AgentCapability> = new Map();
  private activeActions: Map<string, AgentAction> = new Map();
  private memory: AgentMemory = {
    shortTerm: [],
    longTerm: [],
    patterns: [],
    preferences: {}
  };
  private isAutonomousMode: boolean = false;
  private userId: string;
  private projectId: string;

  constructor(userId: string, projectId: string) {
    this.userId = userId;
    this.projectId = projectId;
    this.aiService = new FrontendAIService();
    this.initializeCapabilities();
  }

  private initializeCapabilities() {
    // Analysis Capabilities
    this.registerCapability({
      name: 'analyzeProjectHealth',
      description: 'Analyze overall project health and identify issues',
      category: 'analysis'
    });

    this.registerCapability({
      name: 'predictScheduleRisks',
      description: 'Predict potential schedule delays using ML',
      category: 'analysis'
    });

    this.registerCapability({
      name: 'analyzeBudgetTrends',
      description: 'Analyze budget trends and forecast overruns',
      category: 'analysis'
    });

    // Action Capabilities
    this.registerCapability({
      name: 'createTask',
      description: 'Create and assign tasks to team members',
      category: 'action',
      parameters: {
        title: 'string',
        assignee: 'string',
        dueDate: 'date',
        priority: 'string'
      }
    });

    this.registerCapability({
      name: 'updateSchedule',
      description: 'Update project schedule based on analysis',
      category: 'action',
      requiredPermissions: ['schedule.write']
    });

    this.registerCapability({
      name: 'approveChangeOrder',
      description: 'Review and approve change orders',
      category: 'action',
      requiredPermissions: ['changeorder.approve']
    });

    // Communication Capabilities
    this.registerCapability({
      name: 'sendTeamUpdate',
      description: 'Send project updates to team members',
      category: 'communication'
    });

    this.registerCapability({
      name: 'scheduleMetingting',
      description: 'Schedule meetings with stakeholders',
      category: 'communication'
    });

    this.registerCapability({
      name: 'escalateIssue',
      description: 'Escalate critical issues to management',
      category: 'communication'
    });

    // Navigation Capabilities
    this.registerCapability({
      name: 'navigateToDashboard',
      description: 'Navigate to specific dashboard views',
      category: 'navigation'
    });

    this.registerCapability({
      name: 'openDocument',
      description: 'Open project documents',
      category: 'navigation'
    });

    // Workflow Capabilities
    this.registerCapability({
      name: 'startApprovalWorkflow',
      description: 'Initiate approval workflows',
      category: 'workflow'
    });

    this.registerCapability({
      name: 'executeMultiStepProcess',
      description: 'Execute complex multi-step processes',
      category: 'workflow'
    });
  }

  private registerCapability(capability: AgentCapability) {
    this.capabilities.set(capability.name, capability);
  }

  // Main autonomous operation method
  async operate(goal: string, mode: 'assisted' | 'autonomous' = 'assisted'): Promise<AgentPlan> {
    this.isAutonomousMode = mode === 'autonomous';
    
    console.log(`🤖 Agent operating in ${mode} mode with goal: ${goal}`);

    // Step 1: Understand the goal
    const understanding = await this.understandGoal(goal);
    
    // Step 2: Create a plan
    const plan = await this.createPlan(understanding);
    
    // Step 3: Validate the plan
    const validatedPlan = await this.validatePlan(plan);
    
    // Step 4: Execute the plan
    if (mode === 'autonomous' || await this.requestApproval(validatedPlan)) {
      await this.executePlan(validatedPlan);
    }

    return validatedPlan;
  }

  private async understandGoal(goal: string): Promise<any> {
    const response = await this.aiService.processMessage({
      message: `Analyze this goal and break it down into specific objectives: "${goal}". 
        Consider the current project context and available capabilities. 
        Respond with a structured analysis including objectives, constraints, and success criteria.`,
      projectId: this.projectId,
      userId: this.userId,
      context: {
        capabilities: Array.from(this.capabilities.values()),
        projectContext: await this.getProjectContext()
      }
    });

    return JSON.parse(response.message);
  }

  private async createPlan(understanding: any): Promise<AgentPlan> {
    const response = await this.aiService.processMessage({
      message: `Create a detailed execution plan for these objectives: ${JSON.stringify(understanding)}. 
        Use only the available capabilities and ensure each step is actionable.`,
      projectId: this.projectId,
      userId: this.userId,
      context: {
        capabilities: Array.from(this.capabilities.values()),
        memory: this.memory
      }
    });

    const planData = JSON.parse(response.message);
    
    const plan: AgentPlan = {
      goal: understanding.goal,
      steps: planData.steps.map((step: any) => ({
        id: this.generateActionId(),
        type: step.capability,
        description: step.description,
        status: 'pending',
        requiresApproval: this.requiresApproval(step.capability)
      })),
      estimatedDuration: planData.estimatedDuration,
      confidence: planData.confidence,
      risks: planData.risks || []
    };

    return plan;
  }

  private async validatePlan(plan: AgentPlan): Promise<AgentPlan> {
    // Validate each step
    for (const step of plan.steps) {
      const capability = this.capabilities.get(step.type);
      
      if (!capability) {
        step.status = 'failed';
        step.error = `Unknown capability: ${step.type}`;
        continue;
      }

      // Check permissions
      if (capability.requiredPermissions) {
        const hasPermissions = await this.checkPermissions(capability.requiredPermissions);
        if (!hasPermissions) {
          step.status = 'failed';
          step.error = 'Insufficient permissions';
        }
      }
    }

    // Recalculate confidence based on validation
    const validSteps = plan.steps.filter(s => s.status !== 'failed').length;
    plan.confidence = validSteps / plan.steps.length;

    return plan;
  }

  private async executePlan(plan: AgentPlan): Promise<void> {
    for (const step of plan.steps) {
      if (step.status === 'failed') continue;

      try {
        step.status = 'executing';
        this.activeActions.set(step.id, step);

        // Execute based on capability type
        const capability = this.capabilities.get(step.type)!;
        
        switch (capability.category) {
          case 'analysis':
            step.result = await this.executeAnalysis(step);
            break;
          case 'action':
            step.result = await this.executeAction(step);
            break;
          case 'communication':
            step.result = await this.executeCommunication(step);
            break;
          case 'navigation':
            step.result = await this.executeNavigation(step);
            break;
          case 'workflow':
            step.result = await this.executeWorkflow(step);
            break;
        }

        step.status = 'completed';
        step.executedAt = new Date();

        // Learn from execution
        await this.learnFromExecution(step);

      } catch (error) {
        step.status = 'failed';
        step.error = error.message;
        console.error(`Step ${step.id} failed:`, error);
      } finally {
        this.activeActions.delete(step.id);
      }

      // Add delay between actions for safety
      if (this.isAutonomousMode) {
        await this.delay(1000);
      }
    }
    // After execution
    await this.selfImprove();
  }

  private async executeAnalysis(action: AgentAction): Promise<any> {
    const { data, error } = await supabase.functions.invoke('construction-assistant', {
      body: {
        message: `Execute analysis: ${action.description}`,
        user_id: this.userId,
        project_id: this.projectId,
        tools_enabled: true,
        task_type: 'analysis'
      }
    });

    if (error) throw error;
    return data;
  }

  private async executeAction(action: AgentAction): Promise<any> {
    const { data, error } = await supabase.functions.invoke('platform-actions', {
      body: {
        action: 'execute',
        resource: action.type,
        data: action.data || {},
        user_id: this.userId,
        project_id: this.projectId,
        ai_request_id: action.id
      }
    });

    if (error) throw error;
    return data;
  }

  private async executeCommunication(action: AgentAction): Promise<any> {
    // Parse communication details from action
    const details = await this.parseActionDetails(action);

    const { data, error } = await supabase.functions.invoke('platform-actions', {
      body: {
        action: 'execute',
        resource: 'send_' + details.type,
        data: details,
        user_id: this.userId,
        project_id: this.projectId
      }
    });

    if (error) throw error;
    return data;
  }

  private async executeNavigation(action: AgentAction): Promise<any> {
    // Extract navigation target
    const target = await this.parseNavigationTarget(action);
    
    // Execute navigation
    window.location.hash = target;
    
    return { navigated_to: target };
  }

  private async executeWorkflow(action: AgentAction): Promise<any> {
    const { data, error } = await supabase.functions.invoke('workflow-engine', {
      body: {
        workflow_type: action.type,
        parameters: action.data || {},
        user_id: this.userId,
        project_id: this.projectId
      }
    });

    if (error) throw error;
    return data;
  }

  // Learning and improvement
  private async learnFromExecution(action: AgentAction): Promise<void> {
    // Store execution result in memory
    this.memory.shortTerm.push({
      action: action.type,
      result: action.result,
      success: action.status === 'completed',
      timestamp: new Date()
    });

    // Identify patterns
    if (this.memory.shortTerm.length > 10) {
      await this.identifyPatterns();
    }

    // Update preferences based on success/failure
    if (action.status === 'completed') {
      this.memory.preferences[action.type] = 
        (this.memory.preferences[action.type] || 0) + 1;
    }
  }

  private async identifyPatterns(): Promise<void> {
    const recentActions = this.memory.shortTerm.slice(-20);
    
    // Look for repeated sequences
    const sequences = this.findSequences(recentActions);
    
    // Store useful patterns
    for (const sequence of sequences) {
      if (sequence.successRate > 0.8) {
        this.memory.patterns.push({
          sequence: sequence.actions,
          successRate: sequence.successRate,
          context: sequence.context
        });
      }
    }

    // Move old short-term memory to long-term
    if (this.memory.shortTerm.length > 100) {
      this.memory.longTerm.push(...this.memory.shortTerm.slice(0, 50));
      this.memory.shortTerm = this.memory.shortTerm.slice(50);
    }
  }

  private async selfImprove() {
    const history = this.memory.longTerm.slice(-50);
    const response = await this.aiService.processMessage({
      message: `Analyze this execution history and suggest improvements: ${JSON.stringify(history)}`,
      projectId: this.projectId,
      userId: this.userId
    });
    const improvements = JSON.parse(response.message);
    // Apply improvements, e.g., update preferences
    Object.assign(this.memory.preferences, improvements.preferences);
  }

  private async delegateToAgent(agentId: string, subGoal: string) {
    await aiAgentFramework.delegateTask(agentId, subGoal);
  }

  // Helper methods
  private async getProjectContext(): Promise<any> {
    const { data } = await supabase
      .from('projects')
      .select(`
        *,
        project_metrics(*),
        project_risks(count),
        tasks(count)
      `)
      .eq('id', this.projectId)
      .single();

    return data;
  }

  private requiresApproval(capability: string): boolean {
    const highRiskActions = [
      'approveChangeOrder',
      'updateBudget',
      'closeProject',
      'escalateIssue',
      'modifyContract'
    ];

    return highRiskActions.includes(capability) || !this.isAutonomousMode;
  }

  private async checkPermissions(permissions: string[]): Promise<boolean> {
    // Check user permissions
    const { data } = await supabase
      .from('user_permissions')
      .select('permission')
      .eq('user_id', this.userId)
      .in('permission', permissions);

    return data?.length === permissions.length;
  }

  private async requestApproval(plan: AgentPlan): Promise<boolean> {
    // In assisted mode, always request approval
    if (!this.isAutonomousMode) {
      const response = await this.aiService.processMessage({
        message: `I've created a plan to ${plan.goal}. The plan has ${plan.steps.length} steps with ${Math.round(plan.confidence * 100)}% confidence. Should I proceed?`,
        projectId: this.projectId,
        userId: this.userId,
        context: { plan }
      });

      return response.message.toLowerCase().includes('yes') || 
             response.message.toLowerCase().includes('proceed');
    }

    return true;
  }

  private async parseActionDetails(action: AgentAction): Promise<any> {
    const response = await this.aiService.processMessage({
      message: `Parse the following action into structured data: ${action.description}`,
      projectId: this.projectId,
      userId: this.userId
    });

    return JSON.parse(response.message);
  }

  private async parseNavigationTarget(action: AgentAction): Promise<string> {
    const targets = {
      'dashboard': '/dashboard',
      'construction': '/construction',
      'finance': '/finance',
      'procurement': '/procurement',
      'safety': '/safety',
      'documents': '/documents'
    };

    const description = action.description.toLowerCase();
    
    for (const [key, value] of Object.entries(targets)) {
      if (description.includes(key)) {
        return value;
      }
    }

    return '/dashboard';
  }

  private findSequences(actions: any[]): any[] {
    // Simple sequence detection
    const sequences = [];
    const windowSize = 3;

    for (let i = 0; i < actions.length - windowSize; i++) {
      const sequence = actions.slice(i, i + windowSize);
      const successRate = sequence.filter(a => a.success).length / windowSize;
      
      sequences.push({
        actions: sequence.map(a => a.action),
        successRate,
        context: sequence[0].context
      });
    }

    return sequences;
  }

  private generateActionId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods for external control
  async suggestNextActions(): Promise<string[]> {
    const context = await this.getProjectContext();
    const recentActions = this.memory.shortTerm.slice(-5);

    const response = await this.aiService.processMessage({
      message: `Based on the project context and recent actions, suggest the next 3 most valuable actions to take.`,
      projectId: this.projectId,
      userId: this.userId,
      context: {
        project: context,
        recentActions,
        patterns: this.memory.patterns
      }
    });

    return JSON.parse(response.message);
  }

  async explainReasoning(action: AgentAction): Promise<string> {
    const response = await this.aiService.processMessage({
      message: `Explain why this action is recommended: ${action.description}`,
      projectId: this.projectId,
      userId: this.userId,
      context: {
        action,
        projectContext: await this.getProjectContext(),
        memory: this.memory
      }
    });

    return response.message;
  }

  getActiveActions(): AgentAction[] {
    return Array.from(this.activeActions.values());
  }

  getMemoryInsights(): any {
    return {
      shortTermSize: this.memory.shortTerm.length,
      longTermSize: this.memory.longTerm.length,
      patterns: this.memory.patterns.length,
      topPreferences: Object.entries(this.memory.preferences)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  }
}