// AI Agent Framework - The brain of our AI-native platform
import { supabase } from '@/integrations/supabase/client';
import { FrontendAIService } from './frontend-ai-service';

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'paused' | 'error';
  capabilities: string[];
  lastAction?: Date;
  metrics?: {
    actionsPerformed: number;
    issuesPrevented: number;
    costSaved: number;
    timeOptimized: number;
  };
}

export interface AgentAction {
  agentId: string;
  type: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
  data?: any;
}

export interface AgentCollaboration {
  fromAgent: string;
  toAgent: string;
  task: string;
  status: 'pending' | 'completed';
}

export class AIAgentFramework {
  private agents: Map<string, AIAgent> = new Map();
  private aiService: FrontendAIService;
  private isRunning: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;
  private actionQueue: AgentAction[] = [];
  private subscribers: ((action: AgentAction) => void)[] = [];
  private collaborations: AgentCollaboration[] = [];
  private failedActions: Map<string, number> = new Map(); // actionId -> retryCount

  constructor() {
    this.aiService = new FrontendAIService();
    this.initializeAgents();
  }

  private initializeAgents() {
    // Core AI Agents that run 24/7
    const agents: AIAgent[] = [
      {
        id: 'project-guardian',
        name: 'Project Guardian',
        role: 'Monitors all project metrics and prevents issues',
        status: 'active',
        capabilities: [
          'budget_monitoring',
          'schedule_tracking',
          'risk_detection',
          'anomaly_detection',
          'predictive_alerts'
        ],
        metrics: {
          actionsPerformed: 0,
          issuesPrevented: 0,
          costSaved: 0,
          timeOptimized: 0
        }
      },
      {
        id: 'risk-prevention',
        name: 'Risk Prevention Agent',
        role: 'Identifies and mitigates risks before they occur',
        status: 'active',
        capabilities: [
          'risk_analysis',
          'mitigation_planning',
          'compliance_checking',
          'safety_monitoring',
          'weather_impact_analysis'
        ],
        metrics: {
          actionsPerformed: 0,
          issuesPrevented: 0,
          costSaved: 0,
          timeOptimized: 0
        }
      },
      {
        id: 'communication-agent',
        name: 'Communication Agent',
        role: 'Handles all project communications automatically',
        status: 'active',
        capabilities: [
          'email_drafting',
          'meeting_scheduling',
          'follow_up_reminders',
          'stakeholder_updates',
          'report_generation'
        ],
        metrics: {
          actionsPerformed: 0,
          issuesPrevented: 0,
          costSaved: 0,
          timeOptimized: 0
        }
      },
      {
        id: 'compliance-agent',
        name: 'Compliance Agent',
        role: 'Ensures all regulations and standards are met',
        status: 'active',
        capabilities: [
          'regulation_tracking',
          'permit_monitoring',
          'inspection_scheduling',
          'documentation_verification',
          'audit_preparation'
        ],
        metrics: {
          actionsPerformed: 0,
          issuesPrevented: 0,
          costSaved: 0,
          timeOptimized: 0
        }
      },
      {
        id: 'budget-optimizer',
        name: 'Budget Optimizer',
        role: 'Continuously finds cost savings and optimizations',
        status: 'active',
        capabilities: [
          'cost_analysis',
          'vendor_negotiation',
          'resource_optimization',
          'waste_reduction',
          'procurement_timing'
        ],
        metrics: {
          actionsPerformed: 0,
          issuesPrevented: 0,
          costSaved: 0,
          timeOptimized: 0
        }
      }
    ];

    agents.forEach(agent => this.agents.set(agent.id, agent));
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    await this.aiService.initialize();
    
    // Start continuous monitoring
    this.monitoringInterval = setInterval(() => {
      this.runAgentCycle();
    }, 30000); // Run every 30 seconds
    
    // Run immediately
    this.runAgentCycle();
    
    console.log('🤖 AI Agent Framework started with', this.agents.size, 'agents');
  }

  stop() {
    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    console.log('🛑 AI Agent Framework stopped');
  }

  private async runAgentCycle() {
    for (const [agentId, agent] of this.agents) {
      if (agent.status !== 'active') continue;
      
      try {
        await this.executeAgent(agent);
      } catch (error) {
        console.error(`Error in agent ${agentId}:`, error);
        agent.status = 'error';
      }
    }
  }

  private async executeAgent(agent: AIAgent) {
    // Get relevant data based on agent capabilities
    const context = await this.gatherAgentContext(agent);
    
    // Ask AI what actions this agent should take
    const prompt = this.buildAgentPrompt(agent, context);
    
    const response = await this.aiService.processMessage({
      message: prompt,
      projectId: context.projectId || 'system',
      taskType: 'agent_decision',
      priority: 'high'
    });

    if (response.success) {
      // Parse and execute recommended actions
      const actions = this.parseAgentActions(response.message, agent);
      for (const action of actions) {
        await this.executeAction(action);
      }
    }
  }

  private async gatherAgentContext(agent: AIAgent): Promise<any> {
    const context: any = {
      timestamp: new Date().toISOString(),
      agentId: agent.id,
      capabilities: agent.capabilities
    };

    // Gather data based on agent role
    switch (agent.id) {
      case 'project-guardian':
        // Get project metrics
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'active');
        
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .in('status', ['overdue', 'at_risk']);
        
        context.projects = projects;
        context.riskyTasks = tasks;
        break;
        
      case 'risk-prevention':
        // Get risk data
        const { data: risks } = await supabase
          .from('risks')
          .select('*')
          .gte('severity', 7);
        
        context.highRisks = risks;
        break;
        
      case 'budget-optimizer':
        // Get budget data
        const { data: budgets } = await supabase
          .from('budgets')
          .select('*')
          .gt('variance', 0.1);
        
        context.budgetVariances = budgets;
        break;
    }

    return context;
  }

  private buildAgentPrompt(agent: AIAgent, context: any): string {
    return `You are ${agent.name}, an AI agent with the role: ${agent.role}.

Your capabilities include: ${agent.capabilities.join(', ')}.

Current context:
${JSON.stringify(context, null, 2)}

Based on this data, what specific actions should you take right now? Be proactive and preventive. 
If you see any issues or opportunities, describe the exact action to take.

Respond with a JSON array of actions in this format:
[
  {
    "type": "action_type",
    "description": "Clear description of what to do",
    "impact": "high|medium|low",
    "data": { ...relevant data for the action... }
  }
]

If no actions are needed, return an empty array [].`;
  }

  private parseAgentActions(response: string, agent: AIAgent): AgentAction[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];
      
      const actions = JSON.parse(jsonMatch[0]);
      
      return actions.map((action: any) => ({
        agentId: agent.id,
        type: action.type,
        description: action.description,
        impact: action.impact || 'medium',
        timestamp: new Date(),
        data: action.data
      }));
    } catch (error) {
      console.error('Failed to parse agent actions:', error);
      return [];
    }
  }

  private async executeAction(action: AgentAction) {
    const maxRetries = 3;
    let retryCount = this.failedActions.get(action.id) || 0;

    while (retryCount < maxRetries) {
      try {
        // Log the action
        this.actionQueue.push(action);
        
        // Notify subscribers
        this.subscribers.forEach(subscriber => subscriber(action));
        
        // Update agent metrics
        const agent = this.agents.get(action.agentId);
        if (agent && agent.metrics) {
          agent.metrics.actionsPerformed++;
          agent.lastAction = action.timestamp;
          
          // Update impact metrics based on action type
          if (action.type.includes('prevent') || action.type.includes('risk')) {
            agent.metrics.issuesPrevented++;
          }
          if (action.type.includes('save') || action.type.includes('optimize')) {
            agent.metrics.costSaved += action.data?.estimatedSavings || 0;
          }
        }
        
        // Execute specific action types
        switch (action.type) {
          case 'send_alert':
            await this.sendAlert(action);
            break;
          case 'create_task':
            await this.createTask(action);
            break;
          case 'schedule_meeting':
            await this.scheduleMeeting(action);
            break;
          case 'generate_report':
            await this.generateReport(action);
            break;
          // Add more action handlers as needed
        }
        this.failedActions.delete(action.id);
        break;
      } catch (error) {
        retryCount++;
        this.failedActions.set(action.id, retryCount);
        if (retryCount >= maxRetries) {
          throw error;
        }
        await this.delay(1000 * retryCount); // Exponential backoff
      }
    }
  }

  private async sendAlert(action: AgentAction) {
    // In a real implementation, this would send notifications
    console.log('�� AI Alert:', action.description);
  }

  private async createTask(action: AgentAction) {
    const { data } = await supabase
      .from('tasks')
      .insert({
        title: action.data.title,
        description: action.description,
        priority: action.impact,
        created_by: 'ai_agent',
        agent_id: action.agentId
      });
    
    console.log('✅ AI created task:', action.data.title);
  }

  private async scheduleMeeting(action: AgentAction) {
    // Integrate with calendar API
    console.log('📅 AI scheduled meeting:', action.description);
  }

  private async generateReport(action: AgentAction) {
    // Generate and send report
    console.log('📊 AI generated report:', action.description);
  }

  private async runProactiveMonitoring() {
    const thresholds = await this.getMonitoringThresholds();
    const currentMetrics = await this.getCurrentMetrics();
    for (const [metric, value] of Object.entries(currentMetrics)) {
      if (value > thresholds[metric]) {
        const action = await this.createProactiveAction(metric, value);
        await this.executeAction(action);
      }
    }
  }

  private async delegateTask(toAgentId: string, task: string) {
    const collaboration: AgentCollaboration = {
      fromAgent: this.id,
      toAgent: toAgentId,
      task,
      status: 'pending'
    };
    this.collaborations.push(collaboration);
    // Notify target agent or queue the task
    const targetAgent = this.agents.get(toAgentId);
    if (targetAgent) {
      await this.executeAgent(targetAgent); // Trigger the target agent's cycle
    }
  }

  private async getMonitoringThresholds(): Promise<Record<string, number>> {
    const { data } = await supabase.from('ai_thresholds').select('*').single();
    return data?.thresholds || {};
  }

  private async getCurrentMetrics(): Promise<Record<string, number>> {
    const { data } = await supabase.from('project_metrics').select('*').single();
    return data || {};
  }

  private async createProactiveAction(metric: string, value: number): Promise<AgentAction> {
    return {
      agentId: this.id,
      type: 'alert',
      description: `Metric ${metric} exceeded threshold: ${value}`,
      impact: 'high',
      timestamp: new Date()
    };
  }

  // Public methods for UI interaction
  
  getAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): AIAgent | undefined {
    return this.agents.get(id);
  }

  getRecentActions(limit: number = 10): AgentAction[] {
    return this.actionQueue.slice(-limit).reverse();
  }

  subscribeToActions(callback: (action: AgentAction) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  pauseAgent(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'paused';
    }
  }

  resumeAgent(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'active';
    }
  }

  getSystemMetrics() {
    let totalActions = 0;
    let totalIssuesPrevented = 0;
    let totalCostSaved = 0;
    let totalTimeOptimized = 0;

    this.agents.forEach(agent => {
      if (agent.metrics) {
        totalActions += agent.metrics.actionsPerformed;
        totalIssuesPrevented += agent.metrics.issuesPrevented;
        totalCostSaved += agent.metrics.costSaved;
        totalTimeOptimized += agent.metrics.timeOptimized;
      }
    });

    return {
      totalActions,
      totalIssuesPrevented,
      totalCostSaved,
      totalTimeOptimized,
      activeAgents: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
      totalAgents: this.agents.size
    };
  }

  async saveAgentState(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      await supabase.from('ai_agents').upsert({
        id: agentId,
        state: JSON.stringify(agent)
      });
    }
  }

  async loadAgentState(agentId: string) {
    const { data } = await supabase.from('ai_agents').select('state').eq('id', agentId).single();
    if (data) {
      const state = JSON.parse(data.state);
      this.agents.set(agentId, state);
    }
  }
}

// Global instance
export const aiAgentFramework = new AIAgentFramework();