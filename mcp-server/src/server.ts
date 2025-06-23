
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { getOverdueRfis, createRfi } from './tools/rfi-tools.js';
import { getProcurementSummary } from './tools/procurement-tools.js';
import { getPortfolioHealth } from './tools/portfolio-tools.js';
import { getRiskAdvisory } from './tools/risk-tools.js';
import { getNextAction } from './tools/action-tools.js';
import { getSustainabilityOverview } from './tools/sustainability-tools.js';
import { TOOL_DEFINITIONS } from './config/tool-definitions.js';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const IS_DEV = process.env.NODE_ENV === 'development';

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
        tools: TOOL_DEFINITIONS,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_overdue_rfis':
            return await getOverdueRfis(args);
          case 'create_rfi':
            return await createRfi(args);
          case 'procurement_summary':
            return await getProcurementSummary(args);
          case 'portfolio_health':
            return await getPortfolioHealth(args);
          case 'risk_advisory':
            return await getRiskAdvisory(args);
          case 'next_action':
            return await getNextAction(args);
          case 'sustainability_overview':
            return await getSustainabilityOverview(args);
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
