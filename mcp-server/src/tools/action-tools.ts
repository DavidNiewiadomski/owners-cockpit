
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CreateActionItemSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  due_date: z.string().optional(), // ISO date string
  assignee: z.string().uuid().optional(),
  source_type: z.string().optional(),
  source_id: z.string().uuid().optional(),
  created_by: z.string().uuid().optional()
});

const CompleteActionItemSchema = z.object({
  item_id: z.string().uuid()
});

export async function createActionItem(args: unknown) {
  const params = CreateActionItemSchema.parse(args);

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

  // Create the action item
  const { data: actionItem, error } = await supabase
    .from('action_items')
    .insert({
      project_id: params.project_id,
      title: params.title,
      description: params.description,
      priority: params.priority,
      due_date: params.due_date ? params.due_date : null,
      assignee: params.assignee,
      source_type: params.source_type,
      source_id: params.source_id,
      created_by: params.created_by
    })
    .select()
    .single();

  if (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to create action item: ${error.message}`
    );
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          action_item: {
            id: actionItem.id,
            title: actionItem.title,
            description: actionItem.description,
            priority: actionItem.priority,
            status: actionItem.status,
            due_date: actionItem.due_date,
            project_name: project.name
          },
          message: `Action item "${actionItem.title}" created successfully`
        }, null, 2),
      },
    ],
  };
}

export async function completeActionItem(args: unknown) {
  const params = CompleteActionItemSchema.parse(args);

  // Update the action item status
  const { data: actionItem, error } = await supabase
    .from('action_items')
    .update({ 
      status: 'Done',
      updated_at: new Date().toISOString()
    })
    .eq('id', params.item_id)
    .select()
    .single();

  if (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to complete action item: ${error.message}`
    );
  }

  if (!actionItem) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Action item not found: ${params.item_id}`
    );
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          action_item: {
            id: actionItem.id,
            title: actionItem.title,
            status: actionItem.status
          },
          message: `Action item "${actionItem.title}" marked as complete`
        }, null, 2),
      },
    ],
  };
}
