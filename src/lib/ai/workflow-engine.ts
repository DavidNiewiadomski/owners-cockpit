import { supabase } from '@/integrations/supabase/client';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'decision' | 'approval' | 'notification' | 'wait' | 'parallel';
  config: any;
  dependencies?: string[];
  conditions?: WorkflowCondition[];
  outputs?: any;
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
  error?: string;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  variables?: Record<string, any>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

export interface WorkflowTrigger {
  type: 'manual' | 'event' | 'schedule' | 'condition';
  config: any;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  currentStep?: string;
  variables: Record<string, any>;
  history: WorkflowEvent[];
  error?: string;
}

export interface WorkflowEvent {
  timestamp: Date;
  type: 'started' | 'step_completed' | 'step_failed' | 'decision_made' | 'approved' | 'rejected' | 'completed' | 'failed';
  stepId?: string;
  data?: any;
}

export class WorkflowEngine {
  private definitions: Map<string, WorkflowDefinition> = new Map();
  private instances: Map<string, WorkflowInstance> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeStandardWorkflows();
  }

  private initializeStandardWorkflows() {
    // Change Order Approval Workflow
    this.registerWorkflow({
      id: 'change-order-approval',
      name: 'Change Order Approval',
      description: 'Multi-level approval process for change orders',
      trigger: { type: 'manual', config: {} },
      steps: [
        {
          id: 'validate',
          name: 'Validate Change Order',
          type: 'action',
          config: {
            action: 'validateChangeOrder',
            validations: ['budget_impact', 'schedule_impact', 'scope_alignment']
          }
        },
        {
          id: 'assess-impact',
          name: 'Assess Project Impact',
          type: 'action',
          config: {
            action: 'assessImpact',
            analyses: ['cost_analysis', 'schedule_analysis', 'risk_assessment']
          }
        },
        {
          id: 'route-decision',
          name: 'Route for Approval',
          type: 'decision',
          config: {
            rules: [
              { condition: { field: 'cost_impact', operator: 'less_than', value: 10000 }, output: 'pm-approval' },
              { condition: { field: 'cost_impact', operator: 'less_than', value: 50000 }, output: 'director-approval' },
              { default: true, output: 'executive-approval' }
            ]
          },
          dependencies: ['assess-impact']
        },
        {
          id: 'pm-approval',
          name: 'Project Manager Approval',
          type: 'approval',
          config: {
            approver: 'project_manager',
            timeout: 48,
            escalation: 'director-approval'
          },
          conditions: [{ field: 'route-decision.output', operator: 'equals', value: 'pm-approval' }]
        },
        {
          id: 'director-approval',
          name: 'Director Approval',
          type: 'approval',
          config: {
            approver: 'construction_director',
            timeout: 72,
            escalation: 'executive-approval'
          },
          conditions: [{ field: 'route-decision.output', operator: 'equals', value: 'director-approval' }]
        },
        {
          id: 'executive-approval',
          name: 'Executive Approval',
          type: 'approval',
          config: {
            approver: 'executive_team',
            timeout: 96
          },
          conditions: [{ field: 'route-decision.output', operator: 'equals', value: 'executive-approval' }]
        },
        {
          id: 'update-budget',
          name: 'Update Project Budget',
          type: 'action',
          config: {
            action: 'updateBudget',
            source: 'change_order'
          },
          dependencies: ['pm-approval', 'director-approval', 'executive-approval']
        },
        {
          id: 'notify-stakeholders',
          name: 'Notify Stakeholders',
          type: 'notification',
          config: {
            template: 'change_order_approved',
            recipients: ['project_team', 'stakeholders']
          },
          dependencies: ['update-budget']
        }
      ]
    });

    // Safety Incident Response Workflow
    this.registerWorkflow({
      id: 'safety-incident-response',
      name: 'Safety Incident Response',
      description: 'Immediate response workflow for safety incidents',
      trigger: { 
        type: 'event', 
        config: { event: 'safety_incident_reported' }
      },
      steps: [
        {
          id: 'assess-severity',
          name: 'Assess Incident Severity',
          type: 'action',
          config: {
            action: 'assessIncidentSeverity',
            factors: ['injury_type', 'people_affected', 'operation_impact']
          }
        },
        {
          id: 'immediate-response',
          name: 'Immediate Response Actions',
          type: 'parallel',
          config: {
            steps: [
              {
                id: 'secure-area',
                action: 'secureIncidentArea'
              },
              {
                id: 'medical-response',
                action: 'coordinateMedicalResponse'
              },
              {
                id: 'notify-safety',
                action: 'notifySafetyTeam'
              }
            ]
          },
          dependencies: ['assess-severity']
        },
        {
          id: 'regulatory-check',
          name: 'Check Regulatory Requirements',
          type: 'decision',
          config: {
            rules: [
              { condition: { field: 'severity', operator: 'equals', value: 'critical' }, output: 'osha-report' },
              { condition: { field: 'severity', operator: 'equals', value: 'high' }, output: 'internal-investigation' },
              { default: true, output: 'standard-report' }
            ]
          },
          dependencies: ['immediate-response']
        },
        {
          id: 'osha-report',
          name: 'File OSHA Report',
          type: 'action',
          config: {
            action: 'fileRegulatoryReport',
            agency: 'OSHA',
            timeline: '8_hours'
          },
          conditions: [{ field: 'regulatory-check.output', operator: 'equals', value: 'osha-report' }]
        },
        {
          id: 'investigation',
          name: 'Conduct Investigation',
          type: 'action',
          config: {
            action: 'conductInvestigation',
            scope: 'comprehensive'
          },
          dependencies: ['regulatory-check']
        },
        {
          id: 'corrective-actions',
          name: 'Implement Corrective Actions',
          type: 'action',
          config: {
            action: 'implementCorrectiveActions',
            tracking: true
          },
          dependencies: ['investigation']
        },
        {
          id: 'lessons-learned',
          name: 'Document Lessons Learned',
          type: 'action',
          config: {
            action: 'documentLessonsLearned',
            distribution: 'all_projects'
          },
          dependencies: ['corrective-actions']
        }
      ]
    });

    // Daily Construction Report Workflow
    this.registerWorkflow({
      id: 'daily-construction-report',
      name: 'Daily Construction Report',
      description: 'Automated daily report generation and distribution',
      trigger: {
        type: 'schedule',
        config: { cron: '0 17 * * 1-5', timezone: 'America/New_York' }
      },
      steps: [
        {
          id: 'collect-data',
          name: 'Collect Daily Data',
          type: 'parallel',
          config: {
            steps: [
              { id: 'weather-data', action: 'collectWeatherData' },
              { id: 'progress-data', action: 'collectProgressData' },
              { id: 'safety-data', action: 'collectSafetyData' },
              { id: 'resource-data', action: 'collectResourceData' },
              { id: 'issue-data', action: 'collectIssueData' }
            ]
          }
        },
        {
          id: 'analyze-variances',
          name: 'Analyze Variances',
          type: 'action',
          config: {
            action: 'analyzeVariances',
            thresholds: {
              schedule: 0.05,
              budget: 0.03,
              productivity: 0.1
            }
          },
          dependencies: ['collect-data']
        },
        {
          id: 'generate-report',
          name: 'Generate Report',
          type: 'action',
          config: {
            action: 'generateReport',
            template: 'daily_construction_report',
            format: ['pdf', 'html']
          },
          dependencies: ['analyze-variances']
        },
        {
          id: 'review-required',
          name: 'Check if Review Required',
          type: 'decision',
          config: {
            rules: [
              { condition: { field: 'variances.critical', operator: 'exists', value: true }, output: 'pm-review' },
              { default: true, output: 'auto-send' }
            ]
          },
          dependencies: ['generate-report']
        },
        {
          id: 'pm-review',
          name: 'PM Review',
          type: 'approval',
          config: {
            approver: 'project_manager',
            timeout: 2,
            action: 'review_and_annotate'
          },
          conditions: [{ field: 'review-required.output', operator: 'equals', value: 'pm-review' }]
        },
        {
          id: 'distribute-report',
          name: 'Distribute Report',
          type: 'notification',
          config: {
            channels: ['email', 'teams', 'dashboard'],
            recipients: {
              email: ['stakeholders', 'project_team'],
              teams: ['project_channel'],
              dashboard: ['project_dashboard']
            }
          },
          dependencies: ['pm-review', 'generate-report']
        }
      ]
    });

    // RFI Response Workflow
    this.registerWorkflow({
      id: 'rfi-response',
      name: 'RFI Response Workflow',
      description: 'Manage RFI routing and response',
      trigger: { type: 'manual', config: {} },
      steps: [
        {
          id: 'classify-rfi',
          name: 'Classify RFI',
          type: 'action',
          config: {
            action: 'classifyRFI',
            categories: ['design', 'specification', 'coordination', 'material', 'method']
          }
        },
        {
          id: 'assign-responder',
          name: 'Assign Responder',
          type: 'action',
          config: {
            action: 'assignResponder',
            rules: {
              design: 'architect',
              specification: 'engineer',
              coordination: 'project_manager',
              material: 'procurement_manager',
              method: 'construction_manager'
            }
          },
          dependencies: ['classify-rfi']
        },
        {
          id: 'notify-responder',
          name: 'Notify Assigned Responder',
          type: 'notification',
          config: {
            template: 'rfi_assignment',
            urgency: 'high'
          },
          dependencies: ['assign-responder']
        },
        {
          id: 'wait-response',
          name: 'Wait for Response',
          type: 'wait',
          config: {
            timeout: 72,
            checkInterval: 24
          },
          dependencies: ['notify-responder']
        },
        {
          id: 'review-response',
          name: 'Review Response',
          type: 'approval',
          config: {
            approver: 'requesting_party',
            options: ['accept', 'clarification_needed', 'reject']
          },
          dependencies: ['wait-response']
        },
        {
          id: 'close-rfi',
          name: 'Close RFI',
          type: 'action',
          config: {
            action: 'closeRFI',
            updateDocuments: true
          },
          conditions: [{ field: 'review-response.result', operator: 'equals', value: 'accept' }]
        }
      ]
    });
  }

  registerWorkflow(definition: WorkflowDefinition): void {
    this.definitions.set(definition.id, definition);
  }

  async startWorkflow(
    definitionId: string, 
    variables: Record<string, any> = {},
    userId: string
  ): Promise<WorkflowInstance> {
    const definition = this.definitions.get(definitionId);
    if (!definition) {
      throw new Error(`Workflow definition ${definitionId} not found`);
    }

    const instance: WorkflowInstance = {
      id: this.generateInstanceId(),
      definitionId,
      status: 'pending',
      startTime: new Date(),
      variables: { ...definition.variables, ...variables, userId },
      history: []
    };

    this.instances.set(instance.id, instance);
    
    // Start execution
    this.executeWorkflow(instance);

    return instance;
  }

  private async executeWorkflow(instance: WorkflowInstance): Promise<void> {
    const definition = this.definitions.get(instance.definitionId)!;
    
    try {
      instance.status = 'running';
      this.addEvent(instance, 'started');

      // Execute steps in order, respecting dependencies
      const completedSteps = new Set<string>();
      
      while (completedSteps.size < definition.steps.length) {
        const executableSteps = this.getExecutableSteps(
          definition.steps, 
          completedSteps,
          instance
        );

        if (executableSteps.length === 0) {
          // Check for deadlock
          const pendingSteps = definition.steps.filter(s => !completedSteps.has(s.id));
          if (pendingSteps.length > 0) {
            throw new Error('Workflow deadlock detected');
          }
          break;
        }

        // Execute steps
        await Promise.all(
          executableSteps.map(step => this.executeStep(step, instance))
        );

        executableSteps.forEach(step => completedSteps.add(step.id));
      }

      instance.status = 'completed';
      instance.endTime = new Date();
      this.addEvent(instance, 'completed');

    } catch (error) {
      instance.status = 'failed';
      instance.error = error.message;
      instance.endTime = new Date();
      this.addEvent(instance, 'failed', { error: error.message });
    }

    // Persist final state
    await this.saveWorkflowState(instance);
  }

  private getExecutableSteps(
    steps: WorkflowStep[], 
    completedSteps: Set<string>,
    instance: WorkflowInstance
  ): WorkflowStep[] {
    return steps.filter(step => {
      // Already completed
      if (completedSteps.has(step.id)) return false;

      // Check dependencies
      if (step.dependencies) {
        const allDepsCompleted = step.dependencies.every(dep => completedSteps.has(dep));
        if (!allDepsCompleted) return false;
      }

      // Check conditions
      if (step.conditions) {
        const allConditionsMet = step.conditions.every(condition => 
          this.evaluateCondition(condition, instance)
        );
        if (!allConditionsMet) return false;
      }

      return true;
    });
  }

  private async executeStep(step: WorkflowStep, instance: WorkflowInstance): Promise<void> {
    console.log(`Executing step: ${step.name}`);
    instance.currentStep = step.id;
    step.status = 'running';

    try {
      switch (step.type) {
        case 'action':
          step.result = await this.executeAction(step, instance);
          break;
        case 'decision':
          step.result = await this.executeDecision(step, instance);
          break;
        case 'approval':
          step.result = await this.executeApproval(step, instance);
          break;
        case 'notification':
          step.result = await this.executeNotification(step, instance);
          break;
        case 'wait':
          step.result = await this.executeWait(step, instance);
          break;
        case 'parallel':
          step.result = await this.executeParallel(step, instance);
          break;
      }

      step.status = 'completed';
      this.addEvent(instance, 'step_completed', { stepId: step.id, result: step.result });

      // Store step output in variables
      if (step.outputs) {
        Object.assign(instance.variables, step.outputs);
      }

    } catch (error) {
      step.status = 'failed';
      step.error = error.message;
      this.addEvent(instance, 'step_failed', { stepId: step.id, error: error.message });
      throw error;
    }
  }

  private async executeAction(step: WorkflowStep, instance: WorkflowInstance): Promise<any> {
    const { data, error } = await supabase.functions.invoke('platform-actions', {
      body: {
        action: 'execute',
        resource: step.config.action,
        data: this.resolveVariables(step.config, instance.variables),
        user_id: instance.variables.userId,
        project_id: instance.variables.projectId
      }
    });

    if (error) throw error;
    return data;
  }

  private async executeDecision(step: WorkflowStep, instance: WorkflowInstance): Promise<any> {
    for (const rule of step.config.rules) {
      if (rule.default || this.evaluateCondition(rule.condition, instance)) {
        this.addEvent(instance, 'decision_made', { 
          stepId: step.id, 
          decision: rule.output 
        });
        return { output: rule.output };
      }
    }
    throw new Error('No decision rule matched');
  }

  private async executeApproval(step: WorkflowStep, instance: WorkflowInstance): Promise<any> {
    // Create approval request
    const { data: approval } = await supabase
      .from('workflow_approvals')
      .insert({
        workflow_instance_id: instance.id,
        step_id: step.id,
        approver: step.config.approver,
        status: 'pending',
        timeout_hours: step.config.timeout
      })
      .select()
      .single();

    // Wait for approval
    const timeoutMs = (step.config.timeout || 48) * 60 * 60 * 1000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const { data } = await supabase
        .from('workflow_approvals')
        .select('status, notes')
        .eq('id', approval.id)
        .single();

      if (data.status !== 'pending') {
        this.addEvent(instance, data.status === 'approved' ? 'approved' : 'rejected', {
          stepId: step.id,
          notes: data.notes
        });
        return { status: data.status, notes: data.notes };
      }

      // Check every minute
      await new Promise(resolve => setTimeout(resolve, 60000));
    }

    // Timeout - escalate if configured
    if (step.config.escalation) {
      return { status: 'escalated', escalatedTo: step.config.escalation };
    }

    throw new Error('Approval timeout');
  }

  private async executeNotification(step: WorkflowStep, instance: WorkflowInstance): Promise<any> {
    const recipients = this.resolveRecipients(step.config.recipients, instance);
    
    const notifications = [];
    for (const channel of step.config.channels || ['email']) {
      const { data } = await supabase.functions.invoke('send-notification', {
        body: {
          channel,
          recipients,
          template: step.config.template,
          data: instance.variables
        }
      });
      notifications.push(data);
    }

    return { notifications };
  }

  private async executeWait(step: WorkflowStep, instance: WorkflowInstance): Promise<any> {
    const timeoutMs = step.config.timeout * 60 * 60 * 1000;
    await new Promise(resolve => setTimeout(resolve, timeoutMs));
    return { waited: step.config.timeout };
  }

  private async executeParallel(step: WorkflowStep, instance: WorkflowInstance): Promise<any> {
    const results = await Promise.all(
      step.config.steps.map(async (subStep: any) => {
        const { data } = await supabase.functions.invoke('platform-actions', {
          body: {
            action: 'execute',
            resource: subStep.action,
            data: this.resolveVariables(subStep.data || {}, instance.variables),
            user_id: instance.variables.userId
          }
        });
        return { [subStep.id]: data };
      })
    );

    return Object.assign({}, ...results);
  }

  private evaluateCondition(condition: WorkflowCondition, instance: WorkflowInstance): boolean {
    const value = this.getNestedValue(instance.variables, condition.field);

    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'greater_than':
        return value > condition.value;
      case 'less_than':
        return value < condition.value;
      case 'contains':
        return value?.includes?.(condition.value);
      case 'exists':
        return value !== undefined && value !== null;
      default:
        return false;
    }
  }

  private resolveVariables(config: any, variables: Record<string, any>): any {
    const resolved = {};
    
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const varPath = value.slice(2, -2).trim();
        resolved[key] = this.getNestedValue(variables, varPath);
      } else if (typeof value === 'object' && value !== null) {
        resolved[key] = this.resolveVariables(value, variables);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  private resolveRecipients(recipients: any, instance: WorkflowInstance): string[] {
    if (Array.isArray(recipients)) {
      return recipients.flatMap(r => {
        if (typeof r === 'string' && r.startsWith('{{')) {
          return this.getNestedValue(instance.variables, r.slice(2, -2)) || [];
        }
        return r;
      });
    }
    return [];
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private addEvent(instance: WorkflowInstance, type: WorkflowEvent['type'], data?: any): void {
    instance.history.push({
      timestamp: new Date(),
      type,
      data
    });
  }

  private async saveWorkflowState(instance: WorkflowInstance): Promise<void> {
    await supabase
      .from('workflow_instances')
      .upsert({
        id: instance.id,
        definition_id: instance.definitionId,
        status: instance.status,
        start_time: instance.startTime,
        end_time: instance.endTime,
        variables: instance.variables,
        history: instance.history,
        error: instance.error
      });
  }

  private generateInstanceId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for workflow management
  getWorkflowInstance(instanceId: string): WorkflowInstance | undefined {
    return this.instances.get(instanceId);
  }

  async cancelWorkflow(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance && instance.status === 'running') {
      instance.status = 'cancelled';
      instance.endTime = new Date();
      this.addEvent(instance, 'cancelled');
      await this.saveWorkflowState(instance);
    }
  }

  getAvailableWorkflows(): WorkflowDefinition[] {
    return Array.from(this.definitions.values());
  }

  async getWorkflowHistory(filters?: any): Promise<WorkflowInstance[]> {
    const { data } = await supabase
      .from('workflow_instances')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(100);

    return data || [];
  }
}