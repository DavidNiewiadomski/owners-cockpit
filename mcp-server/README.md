
# Owners Cockpit MCP Server

A Model Context Protocol (MCP) server that exposes RFI (Request for Information) management tools for the Owners Cockpit construction management platform.

## Overview

This MCP server provides two main tools:
- `get_overdue_rfis`: Retrieve RFIs that are overdue based on due date or creation date
- `create_rfi`: Create new RFIs in the system

The server integrates with Supabase for data persistence and follows MCP protocol standards for tool exposure and communication.

## Features

- ✅ Streaming responses with real-time data
- ✅ Auto-consent in development mode
- ✅ Comprehensive input validation with Zod schemas
- ✅ TypeScript support with full type safety
- ✅ Jest test coverage
- ✅ Error handling and logging
- ✅ Environment-based configuration

## Prerequisites

- Node.js 18+ 
- Supabase project with RFI and Projects tables
- TypeScript knowledge for customization

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export NODE_ENV="development" # for auto-consent
```

3. Build the project:
```bash
npm run build
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running Tests
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Available Tools

### `get_overdue_rfis`

Retrieves RFIs that are overdue based on their due date or creation date.

**Parameters:**
- `project_id` (optional): UUID of the project to filter RFIs
- `days_overdue` (optional): Minimum days overdue (default: 0)

**Example:**
```json
{
  "name": "get_overdue_rfis",
  "arguments": {
    "project_id": "123e4567-e89b-12d3-a456-426614174000",
    "days_overdue": 7
  }
}
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "rfis": [
    {
      "id": "rfi-123",
      "title": "Electrical Specifications",
      "description": "Need clarification on electrical requirements",
      "status": "open",
      "submitted_by": "John Contractor",
      "assigned_to": "Jane Engineer",
      "due_date": "2024-01-15",
      "created_at": "2024-01-01T00:00:00Z",
      "days_overdue": 10,
      "project_name": "Office Building"
    }
  ]
}
```

### `create_rfi`

Creates a new RFI in the system.

**Parameters:**
- `project_id` (required): UUID of the project
- `title` (required): RFI title (1-255 characters)
- `description` (optional): Detailed description
- `submitted_by` (optional): Person submitting the RFI
- `assigned_to` (optional): Person assigned to handle the RFI  
- `due_date` (optional): Due date in YYYY-MM-DD format

**Example:**
```json
{
  "name": "create_rfi",
  "arguments": {
    "project_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Plumbing Layout Questions",
    "description": "Need clarification on bathroom fixture placement",
    "submitted_by": "Mike Contractor",
    "assigned_to": "Sarah Architect",
    "due_date": "2024-02-15"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "RFI created successfully",
  "rfi": {
    "id": "rfi-456",
    "title": "Plumbing Layout Questions",
    "description": "Need clarification on bathroom fixture placement",
    "status": "open",
    "submitted_by": "Mike Contractor",
    "assigned_to": "Sarah Architect",
    "due_date": "2024-02-15",
    "created_at": "2024-01-20T10:30:00Z",
    "project_name": "Office Building"
  }
}
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Database Schema

The server expects the following Supabase tables:

**rfi table:**
```sql
CREATE TABLE rfi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status rfi_status DEFAULT 'open',
    submitted_by VARCHAR(255),
    assigned_to VARCHAR(255),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**projects table:**
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    -- other project fields...
);
```

## Development

### Project Structure
```
mcp-server/
├── src/
│   ├── server.ts          # Main MCP server implementation
│   └── server.test.ts     # Jest tests
├── dist/                  # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

### Adding New Tools

1. Add tool definition to `ListToolsRequestSchema` handler
2. Add tool implementation method
3. Add validation schema using Zod
4. Add test coverage
5. Update this README

### Error Handling

The server includes comprehensive error handling:
- Input validation errors (400-level)
- Database connection errors (500-level)
- Tool not found errors (404-level)
- Internal server errors (500-level)

All errors are properly formatted according to MCP protocol standards.

## Testing

The test suite covers:
- Server initialization
- Environment variable validation  
- Tool input validation
- Database operation mocking
- Error condition handling

Run tests with coverage:
```bash
npm test -- --coverage
```

## Integration with MCP Clients

This server can be used with any MCP-compatible client. Common integration patterns:

### Claude Desktop
Add to your Claude Desktop configuration:
```json
{
  "mcpServers": {
    "owners-cockpit": {
      "command": "node",
      "args": ["path/to/mcp-server/dist/server.js"],
      "env": {
        "SUPABASE_URL": "your-url",
        "SUPABASE_SERVICE_ROLE_KEY": "your-key"
      }
    }
  }
}
```

### Custom MCP Client
```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client({
  name: 'owners-cockpit-client',
  version: '1.0.0'
});

// Connect to server and use tools
const result = await client.callTool({
  name: 'get_overdue_rfis',
  arguments: { days_overdue: 5 }
});
```

## Security Considerations

- Use service role key only in secure server environments
- Validate all inputs using Zod schemas
- Implement proper row-level security (RLS) in Supabase
- Log tool usage for audit trails
- Consider rate limiting for production deployments

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with reproduction steps
3. Include environment details and error logs
