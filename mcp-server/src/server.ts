#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const IS_DEV = process.env.NODE_ENV === 'development';

// Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Validation schemas
const GetOverdueRfisSchema = z.object({
  project_id: z.string().uuid().optional(),
  days_overdue: z.number().min(0).default(0),
});

const CreateRfiSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  submitted_by: z.string().max(255).optional(),
  assigned_to: z.string().max(255).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
});

const ProcurementSummarySchema = z.object({
  project_id: z.string().uuid().optional(),
});

const PortfolioHealthSchema = z.object({});

const RiskAdvisorySchema = z.object({
  project_id: z.string().uuid(),
});

const NextActionSchema = z.object({
  project_id: z.string().uuid(),
});

class OwnersCockpitMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'owners-cockpit-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_overdue_rfis',
            description: 'Retrieve RFIs that are overdue based on due date or creation date',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Optional project ID to filter RFIs',
                },
                days_overdue: {
                  type: 'number',
                  minimum: 0,
                  default: 0,
                  description: 'Minimum days overdue (0 = any overdue)',
                },
              },
            },
          },
          {
            name: 'create_rfi',
            description: 'Create a new RFI (Request for Information)',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Project ID for the RFI',
                },
                title: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 255,
                  description: 'RFI title',
                },
                description: {
                  type: 'string',
                  description: 'Optional RFI description',
                },
                submitted_by: {
                  type: 'string',
                  maxLength: 255,
                  description: 'Person submitting the RFI',
                },
                assigned_to: {
                  type: 'string',
                  maxLength: 255,
                  description: 'Person assigned to handle the RFI',
                },
                due_date: {
                  type: 'string',
                  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                  description: 'Due date in YYYY-MM-DD format',
                },
              },
              required: ['project_id', 'title'],
            },
          },
          {
            name: 'procurement_summary',
            description: 'Get a comprehensive procurement summary with budget analysis and vendor performance',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Optional project ID to filter procurement data',
                },
              },
            },
          },
          {
            name: 'portfolio_health',
            description: 'Get portfolio health metrics aggregating budget variance, schedule slip and risk count across projects',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'risk_advisory',
            description: 'Analyze project risks and provide mitigation suggestions based on alerts, schedule, and budget',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Project ID to analyze risks for',
                },
              },
              required: ['project_id'],
            },
          },
          {
            name: 'next_action',
            description: 'Get the highest impact next action for a project with title, description, and assignee',
            inputSchema: {
              type: 'object',
              properties: {
                project_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Project ID to get next action for',
                },
              },
              required: ['project_id'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_overdue_rfis':
            return await this.getOverdueRfis(args);
          case 'create_rfi':
            return await this.createRfi(args);
          case 'procurement_summary':
            return await this.getProcurementSummary(args);
          case 'portfolio_health':
            return await this.getPortfolioHealth(args);
          case 'risk_advisory':
            return await this.getRiskAdvisory(args);
          case 'next_action':
            return await this.getNextAction(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Tool not found: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async getOverdueRfis(args: unknown) {
    const params = GetOverdueRfisSchema.parse(args);
    
    const today = new Date().toISOString().split('T')[0];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - params.days_overdue);
    const cutoffDateISO = cutoffDate.toISOString().split('T')[0];

    let query = supabase
      .from('rfi')
      .select(`
        id, title, description, status, submitted_by, assigned_to, 
        due_date, created_at, updated_at,
        projects!inner(id, name)
      `)
      .eq('status', 'open')
      .or(`due_date.lt.${today},created_at.lt.${cutoffDateISO}`);

    if (params.project_id) {
      query = query.eq('project_id', params.project_id);
    }

    const { data: rfis, error } = await query;

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Database error: ${error.message}`
      );
    }

    // Calculate days overdue for each RFI
    const enrichedRfis = rfis?.map(rfi => {
      const createdDate = new Date(rfi.created_at);
      const dueDate = rfi.due_date ? new Date(rfi.due_date) : null;
      const now = new Date();

      let daysOverdue = 0;
      if (dueDate && dueDate < now) {
        daysOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        daysOverdue = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      return {
        ...rfi,
        days_overdue: daysOverdue,
        project_name: rfi.projects.name,
      };
    }) || [];

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: enrichedRfis.length,
            rfis: enrichedRfis,
          }, null, 2),
        },
      ],
    };
  }

  private async createRfi(args: unknown) {
    const params = CreateRfiSchema.parse(args);

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', params.project_id)
      .single();

    if (projectError || !project) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Project not found: ${params.project_id}`
      );
    }

    // Create the RFI
    const { data: rfi, error } = await supabase
      .from('rfi')
      .insert({
        project_id: params.project_id,
        title: params.title,
        description: params.description,
        submitted_by: params.submitted_by,
        assigned_to: params.assigned_to,
        due_date: params.due_date,
        status: 'open',
      })
      .select(`
        id, title, description, status, submitted_by, assigned_to,
        due_date, created_at, updated_at
      `)
      .single();

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to create RFI: ${error.message}`
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'RFI created successfully',
            rfi: {
              ...rfi,
              project_name: project.name,
            },
          }, null, 2),
        },
      ],
    };
  }

  private async getProcurementSummary(args: unknown) {
    const params = ProcurementSummarySchema.parse(args);

    // Get procurement data
    const { data: procurementData, error } = await supabase
      .from('procurement')
      .select('*')
      .eq('project_id', params.project_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Database error: ${error.message}`
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            procurement_data: procurementData,
          }, null, 2),
        },
      ],
    };
  }

  private async getPortfolioHealth(args: unknown) {
    const params = PortfolioHealthSchema.parse(args);

    // Get portfolio health metrics
    const { data: portfolioHealth, error } = await supabase
      .from('portfolio_health')
      .select('*')
      .eq('project_id', params.project_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Database error: ${error.message}`
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            portfolio_health: portfolioHealth,
          }, null, 2),
        },
      ],
    };
  }

  private async getRiskAdvisory(args: unknown) {
    const params = RiskAdvisorySchema.parse(args);

    // Get risk data
    const { data: riskData, error } = await supabase
      .from('risks')
      .select('*')
      .eq('project_id', params.project_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Database error: ${error.message}`
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            risk_data: riskData,
          }, null, 2),
        },
      ],
    };
  }

  private async getNextAction(args: unknown) {
    const params = NextActionSchema.parse(args);

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

    // Get project data for analysis
    const [tasksResult, rfisResult, alertsResult, budgetResult] = await Promise.all([
      // Get overdue and high priority tasks
      supabase
        .from('tasks')
        .select('*')
        .eq('project_id', params.project_id)
        .in('status', ['not_started', 'in_progress'])
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true }),
      
      // Get open RFIs, especially overdue ones
      supabase
        .from('rfi')
        .select('*')
        .eq('project_id', params.project_id)
        .eq('status', 'open')
        .order('due_date', { ascending: true }),
      
      // Get unresolved alerts
      supabase
        .from('alerts')
        .select('*')
        .eq('project_id', params.project_id)
        .eq('resolved', false)
        .order('severity', { ascending: false })
        .order('created_at', { ascending: true }),
      
      // Get budget items with variance
      supabase
        .from('budget_items')
        .select('*')
        .eq('project_id', params.project_id)
    ]);

    const tasks = tasksResult.data || [];
    const rfis = rfisResult.data || [];
    const alerts = alertsResult.data || [];
    const budgetItems = budgetResult.data || [];

    // Analyze and prioritize actions
    const today = new Date();
    let highestImpactAction = null;
    let maxScore = 0;

    // Score overdue RFIs (highest priority)
    for (const rfi of rfis) {
      if (rfi.due_date && new Date(rfi.due_date) < today) {
        const daysOverdue = Math.ceil((today.getTime() - new Date(rfi.due_date).getTime()) / (1000 * 60 * 60 * 24));
        const score = 100 + daysOverdue * 5; // Base score 100 + overdue penalty
        
        if (score > maxScore) {
          maxScore = score;
          highestImpactAction = {
            title: `Resolve Overdue RFI: ${rfi.title}`,
            description: `This RFI is ${daysOverdue} days overdue and blocking project progress. ${rfi.description || 'Immediate attention required to prevent further delays.'}`,
            assignee: rfi.assigned_to || 'Project Manager'
          };
        }
      }
    }

    // Score critical alerts
    for (const alert of alerts) {
      let score = 80; // Base score for unresolved alerts
      if (alert.severity === 'critical') score += 30;
      else if (alert.severity === 'high') score += 20;
      else if (alert.severity === 'medium') score += 10;
      
      const daysSinceAlert = Math.ceil((today.getTime() - new Date(alert.created_at).getTime()) / (1000 * 60 * 60 * 24));
      score += daysSinceAlert * 2; // Urgency increases with time
      
      if (score > maxScore) {
        maxScore = score;
        highestImpactAction = {
          title: `Address Critical Alert: ${alert.title}`,
          description: `${alert.description} This ${alert.severity} severity alert has been open for ${daysSinceAlert} days and requires immediate action.`,
          assignee: 'Project Manager'
        };
      }
    }

    // Score overdue high-priority tasks
    for (const task of tasks) {
      let score = 50 + (task.priority || 1) * 15; // Base score + priority bonus
      
      if (task.due_date && new Date(task.due_date) < today) {
        const daysOverdue = Math.ceil((today.getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24));
        score += daysOverdue * 3; // Overdue penalty
      }
      
      if (score > maxScore) {
        maxScore = score;
        const overdueText = task.due_date && new Date(task.due_date) < today 
          ? ` This task is ${Math.ceil((today.getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue.`
          : '';
        
        highestImpactAction = {
          title: `Complete High-Priority Task: ${task.name}`,
          description: `${task.description || 'Critical task requiring immediate attention.'}${overdueText}`,
          assignee: task.assigned_to || 'Project Team'
        };
      }
    }

    // Score budget variance issues
    for (const budgetItem of budgetItems) {
      if (budgetItem.budgeted_amount && budgetItem.actual_amount) {
        const variance = (budgetItem.actual_amount - budgetItem.budgeted_amount) / budgetItem.budgeted_amount;
        if (variance > 0.1) { // More than 10% over budget
          const score = 60 + variance * 100; // Score based on variance percentage
          
          if (score > maxScore) {
            maxScore = score;
            highestImpactAction = {
              title: `Address Budget Overrun: ${budgetItem.category}`,
              description: `Budget item "${budgetItem.category}" is ${(variance * 100).toFixed(1)}% over budget (${budgetItem.actual_amount} vs ${budgetItem.budgeted_amount} budgeted). Immediate cost control measures needed.`,
              assignee: 'Project Manager'
            };
          }
        }
      }
    }

    // Default action if no specific issues found
    if (!highestImpactAction) {
      // Look for the next upcoming task
      const nextTask = tasks.find(task => task.status === 'not_started');
      if (nextTask) {
        highestImpactAction = {
          title: `Start Next Planned Task: ${nextTask.name}`,
          description: nextTask.description || 'Begin work on the next scheduled task to maintain project momentum.',
          assignee: nextTask.assigned_to || 'Project Team'
        };
      } else {
        highestImpactAction = {
          title: 'Review Project Status',
          description: 'Conduct a comprehensive review of project progress, update schedules, and identify any emerging issues or opportunities.',
          assignee: 'Project Manager'
        };
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            project_name: project.name,
            next_action: highestImpactAction,
            analysis_summary: {
              tasks_analyzed: tasks.length,
              open_rfis: rfis.length,
              unresolved_alerts: alerts.length,
              budget_items: budgetItems.length,
              impact_score: maxScore
            }
          }, null, 2),
        },
      ],
    };
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    if (IS_DEV) {
      console.error('Owners Cockpit MCP Server running in development mode');
      console.error('Auto-consent enabled for tool calls');
    }
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new OwnersCockpitMCPServer();
  server.start().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}

export { OwnersCockpitMCPServer };
