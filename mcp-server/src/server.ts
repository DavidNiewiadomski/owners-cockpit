
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
