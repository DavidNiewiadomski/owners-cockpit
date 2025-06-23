
import { createClient } from '@supabase/supabase-js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { GetOverdueRfisSchema, CreateRfiSchema } from '../schemas/validation.js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function getOverdueRfis(args: unknown) {
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

export async function createRfi(args: unknown) {
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
