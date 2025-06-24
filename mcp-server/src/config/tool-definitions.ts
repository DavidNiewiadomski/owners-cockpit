export const TOOL_DEFINITIONS = [
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
  {
    name: 'sustainability_overview',
    description: 'Get comprehensive sustainability metrics including energy usage, waste management, and LEED certification status',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          format: 'uuid',
          description: 'Project ID to get sustainability overview for',
        },
      },
      required: ['project_id'],
    },
  },
  {
    name: 'create_action_item',
    description: 'Create a new action item for a project that can be assigned and tracked',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: {
          type: 'string',
          format: 'uuid',
          description: 'UUID of the project to create the action item for'
        },
        title: {
          type: 'string',
          description: 'Title/summary of the action item'
        },
        description: {
          type: 'string',
          description: 'Detailed description of what needs to be done'
        },
        priority: {
          type: 'string',
          enum: ['Low', 'Medium', 'High', 'Critical'],
          description: 'Priority level of the action item'
        },
        due_date: {
          type: 'string',
          format: 'date',
          description: 'Due date in YYYY-MM-DD format'
        },
        assignee: {
          type: 'string',
          format: 'uuid',
          description: 'UUID of the user assigned to this action item'
        },
        source_type: {
          type: 'string',
          description: 'Type of source that generated this action item (meeting, insight, manual, etc.)'
        },
        source_id: {
          type: 'string',
          format: 'uuid',
          description: 'UUID of the source record (meeting ID, insight ID, etc.)'
        },
        created_by: {
          type: 'string',
          format: 'uuid',
          description: 'UUID of the user creating this action item'
        }
      },
      required: ['project_id', 'title']
    }
  },
  {
    name: 'complete_action_item',
    description: 'Mark an action item as complete/done',
    inputSchema: {
      type: 'object',
      properties: {
        item_id: {
          type: 'string',
          format: 'uuid',
          description: 'UUID of the action item to mark as complete'
        }
      },
      required: ['item_id']
    }
  }
];
