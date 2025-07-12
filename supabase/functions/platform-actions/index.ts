import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface PlatformActionRequest {
  action: string
  resource: string
  data?: any
  filters?: any
  options?: any
  user_id: string
  project_id?: string
  require_confirmation?: boolean
  ai_request_id?: string
}

interface PlatformActionResponse {
  success: boolean
  action: string
  resource: string
  result?: any
  error?: string
  changes?: any[]
  rollback_available?: boolean
  execution_time_ms?: number
}

// Available actions the AI can perform
const ALLOWED_ACTIONS = {
  // Data operations
  create: ['projects', 'tasks', 'documents', 'reports', 'meetings', 'reminders', 'change_orders', 'rfis', 'submittals'],
  read: ['*'], // Can read anything
  update: ['projects', 'tasks', 'documents', 'meetings', 'project_settings', 'schedules', 'budgets'],
  delete: ['tasks', 'documents', 'meetings', 'reminders'], // Limited delete permissions
  
  // Specialized actions
  execute: [
    'send_email',
    'send_sms', 
    'send_teams_message',
    'schedule_meeting',
    'generate_report',
    'analyze_data',
    'create_dashboard',
    'update_schedule',
    'approve_change_order',
    'assign_task',
    'update_progress',
    'flag_risk',
    'request_inspection',
    'update_budget'
  ],
  
  // Navigation
  navigate: ['*'], // Can navigate anywhere
  
  // Workflow
  workflow: ['start_approval', 'submit_rfi', 'close_issue', 'escalate_risk']
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const request: PlatformActionRequest = await req.json()
    
    // Validate request
    if (!request.action || !request.resource) {
      throw new Error('Action and resource are required')
    }

    if (!request.user_id) {
      throw new Error('User ID is required for audit trail')
    }

    // Check if action is allowed
    if (!isActionAllowed(request.action, request.resource)) {
      throw new Error(`Action '${request.action}' on resource '${request.resource}' is not allowed`)
    }

    // Log the AI action attempt
    await logAIAction(supabase, request, 'pending')

    // Execute the action
    let result: any
    let changes: any[] = []

    switch (request.action) {
      case 'create':
        result = await handleCreate(supabase, request)
        changes.push({ type: 'created', resource: request.resource, id: result.id })
        break
        
      case 'read':
        result = await handleRead(supabase, request)
        break
        
      case 'update':
        const updateResult = await handleUpdate(supabase, request)
        result = updateResult.data
        changes = updateResult.changes
        break
        
      case 'delete':
        result = await handleDelete(supabase, request)
        changes.push({ type: 'deleted', resource: request.resource, id: request.data.id })
        break
        
      case 'execute':
        result = await handleExecute(supabase, request)
        changes.push({ type: 'executed', action: request.resource, result })
        break
        
      case 'navigate':
        result = { navigated_to: request.resource }
        break
        
      case 'workflow':
        result = await handleWorkflow(supabase, request)
        changes.push({ type: 'workflow', action: request.resource, result })
        break
        
      default:
        throw new Error(`Unknown action: ${request.action}`)
    }

    // Log successful action
    await logAIAction(supabase, request, 'completed', result)

    const response: PlatformActionResponse = {
      success: true,
      action: request.action,
      resource: request.resource,
      result,
      changes,
      rollback_available: ['create', 'update', 'delete'].includes(request.action),
      execution_time_ms: Date.now() - startTime
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Platform action error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      action: req.body?.action,
      resource: req.body?.resource
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function isActionAllowed(action: string, resource: string): boolean {
  const allowedResources = ALLOWED_ACTIONS[action]
  if (!allowedResources) return false
  
  return allowedResources.includes('*') || allowedResources.includes(resource)
}

async function logAIAction(supabase: any, request: PlatformActionRequest, status: string, result?: any) {
  await supabase.from('ai_action_logs').insert({
    user_id: request.user_id,
    project_id: request.project_id,
    action: request.action,
    resource: request.resource,
    status,
    request_data: request.data,
    result_data: result,
    ai_request_id: request.ai_request_id,
    created_at: new Date().toISOString()
  })
}

// CREATE Operations
async function handleCreate(supabase: any, request: PlatformActionRequest) {
  switch (request.resource) {
    case 'tasks':
      return createTask(supabase, request)
    case 'meetings':
      return createMeeting(supabase, request)
    case 'change_orders':
      return createChangeOrder(supabase, request)
    case 'rfis':
      return createRFI(supabase, request)
    case 'documents':
      return createDocument(supabase, request)
    case 'reports':
      return generateReport(supabase, request)
    default:
      // Generic create
      const { data, error } = await supabase
        .from(request.resource)
        .insert(request.data)
        .select()
        .single()
      
      if (error) throw error
      return data
  }
}

async function createTask(supabase: any, request: PlatformActionRequest) {
  const taskData = {
    project_id: request.project_id,
    title: request.data.title,
    description: request.data.description,
    assigned_to: request.data.assigned_to,
    due_date: request.data.due_date,
    priority: request.data.priority || 'medium',
    status: 'pending',
    created_by: request.user_id,
    created_by_ai: true,
    ai_context: request.data.context
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single()

  if (error) throw error

  // Send notification to assignee
  if (task.assigned_to) {
    await sendNotification(supabase, {
      user_id: task.assigned_to,
      type: 'task_assigned',
      title: 'New Task Assigned by AI',
      message: `AI has assigned you a new task: ${task.title}`,
      data: { task_id: task.id }
    })
  }

  return task
}

async function createMeeting(supabase: any, request: PlatformActionRequest) {
  const meetingData = {
    project_id: request.project_id,
    title: request.data.title,
    description: request.data.description,
    start_time: request.data.start_time,
    end_time: request.data.end_time,
    location: request.data.location,
    attendees: request.data.attendees || [],
    created_by: request.user_id,
    created_by_ai: true,
    meeting_type: request.data.type || 'general',
    agenda: request.data.agenda
  }

  const { data: meeting, error } = await supabase
    .from('meetings')
    .insert(meetingData)
    .select()
    .single()

  if (error) throw error

  // Send calendar invites
  for (const attendee of meeting.attendees) {
    await sendCalendarInvite(supabase, {
      user_id: attendee,
      meeting,
      organizer_id: request.user_id
    })
  }

  return meeting
}

async function createChangeOrder(supabase: any, request: PlatformActionRequest) {
  const changeOrderData = {
    project_id: request.project_id,
    title: request.data.title,
    description: request.data.description,
    reason: request.data.reason,
    cost_impact: request.data.cost_impact || 0,
    schedule_impact_days: request.data.schedule_impact_days || 0,
    status: 'draft',
    created_by: request.user_id,
    created_by_ai: true,
    justification: request.data.justification,
    affected_areas: request.data.affected_areas || []
  }

  const { data: changeOrder, error } = await supabase
    .from('change_orders')
    .insert(changeOrderData)
    .select()
    .single()

  if (error) throw error

  // Start approval workflow
  await startApprovalWorkflow(supabase, {
    type: 'change_order',
    item_id: changeOrder.id,
    project_id: request.project_id,
    requested_by: request.user_id
  })

  return changeOrder
}

async function createRFI(supabase: any, request: PlatformActionRequest) {
  const rfiData = {
    project_id: request.project_id,
    question: request.data.question,
    subject: request.data.subject,
    discipline: request.data.discipline || 'general',
    priority: request.data.priority || 'normal',
    due_date: request.data.due_date,
    assigned_to: request.data.assigned_to,
    created_by: request.user_id,
    created_by_ai: true,
    status: 'open',
    attachments: request.data.attachments || []
  }

  const { data: rfi, error } = await supabase
    .from('rfis')
    .insert(rfiData)
    .select()
    .single()

  if (error) throw error

  // Notify responsible party
  if (rfi.assigned_to) {
    await sendNotification(supabase, {
      user_id: rfi.assigned_to,
      type: 'rfi_assigned',
      title: 'New RFI Requires Response',
      message: `AI has created an RFI that needs your response: ${rfi.subject}`,
      data: { rfi_id: rfi.id }
    })
  }

  return rfi
}

async function createDocument(supabase: any, request: PlatformActionRequest) {
  const docData = {
    project_id: request.project_id,
    name: request.data.name,
    type: request.data.type || 'general',
    content: request.data.content,
    metadata: request.data.metadata || {},
    created_by: request.user_id,
    created_by_ai: true,
    version: '1.0',
    status: 'draft'
  }

  const { data: doc, error } = await supabase
    .from('documents')
    .insert(docData)
    .select()
    .single()

  if (error) throw error

  return doc
}

async function generateReport(supabase: any, request: PlatformActionRequest) {
  // This would integrate with a report generation service
  const reportData = {
    project_id: request.project_id,
    type: request.data.type,
    parameters: request.data.parameters,
    format: request.data.format || 'pdf',
    requested_by: request.user_id,
    requested_by_ai: true,
    status: 'generating'
  }

  const { data: report, error } = await supabase
    .from('reports')
    .insert(reportData)
    .select()
    .single()

  if (error) throw error

  // Trigger report generation
  await supabase.functions.invoke('generate-report', {
    body: { report_id: report.id }
  })

  return report
}

// READ Operations
async function handleRead(supabase: any, request: PlatformActionRequest) {
  let query = supabase.from(request.resource).select(request.options?.select || '*')

  // Apply filters
  if (request.filters) {
    Object.entries(request.filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value)
      } else if (typeof value === 'object' && value !== null) {
        // Handle range queries
        if (value.gte) query = query.gte(key, value.gte)
        if (value.lte) query = query.lte(key, value.lte)
        if (value.gt) query = query.gt(key, value.gt)
        if (value.lt) query = query.lt(key, value.lt)
      } else {
        query = query.eq(key, value)
      }
    })
  }

  // Apply project filter if provided
  if (request.project_id) {
    query = query.eq('project_id', request.project_id)
  }

  // Apply ordering
  if (request.options?.order) {
    query = query.order(request.options.order.column, {
      ascending: request.options.order.ascending ?? true
    })
  }

  // Apply limit
  if (request.options?.limit) {
    query = query.limit(request.options.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// UPDATE Operations  
async function handleUpdate(supabase: any, request: PlatformActionRequest) {
  // Store original for rollback
  const { data: original } = await supabase
    .from(request.resource)
    .select()
    .eq('id', request.data.id)
    .single()

  const updateData = { ...request.data, updated_by_ai: true, updated_at: new Date().toISOString() }
  delete updateData.id // Remove ID from update data

  const { data, error } = await supabase
    .from(request.resource)
    .update(updateData)
    .eq('id', request.data.id)
    .select()
    .single()

  if (error) throw error

  const changes = []
  if (original) {
    Object.keys(updateData).forEach(key => {
      if (original[key] !== updateData[key]) {
        changes.push({
          field: key,
          old_value: original[key],
          new_value: updateData[key]
        })
      }
    })
  }

  return { data, changes }
}

// DELETE Operations
async function handleDelete(supabase: any, request: PlatformActionRequest) {
  // Soft delete by default
  const { data, error } = await supabase
    .from(request.resource)
    .update({ 
      deleted: true, 
      deleted_by_ai: true,
      deleted_at: new Date().toISOString() 
    })
    .eq('id', request.data.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// EXECUTE Operations
async function handleExecute(supabase: any, request: PlatformActionRequest) {
  switch (request.resource) {
    case 'send_email':
      return await sendEmail(supabase, request.data)
    case 'send_sms':
      return await sendSMS(supabase, request.data)
    case 'send_teams_message':
      return await sendTeamsMessage(supabase, request.data)
    case 'schedule_meeting':
      return await createMeeting(supabase, request)
    case 'update_progress':
      return await updateProjectProgress(supabase, request)
    case 'flag_risk':
      return await flagRisk(supabase, request)
    case 'assign_task':
      return await assignTask(supabase, request)
    default:
      throw new Error(`Unknown execute action: ${request.resource}`)
  }
}

// Communication helpers
async function sendEmail(supabase: any, data: any) {
  const { data: result, error } = await supabase.functions.invoke('send-email', {
    body: {
      to: data.to,
      subject: data.subject,
      html: data.body,
      from: data.from || 'ai@ownerscockpit.com',
      attachments: data.attachments
    }
  })

  if (error) throw error
  return result
}

async function sendSMS(supabase: any, data: any) {
  const { data: result, error } = await supabase.functions.invoke('send-sms', {
    body: {
      to: data.to,
      message: data.message,
      from: data.from || 'OwnersCockpit'
    }
  })

  if (error) throw error
  return result
}

async function sendTeamsMessage(supabase: any, data: any) {
  const { data: result, error } = await supabase.functions.invoke('send-teams-message', {
    body: {
      channel: data.channel,
      message: data.message,
      mentions: data.mentions,
      attachments: data.attachments
    }
  })

  if (error) throw error
  return result
}

async function sendNotification(supabase: any, data: any) {
  return await supabase.from('notifications').insert(data)
}

async function sendCalendarInvite(supabase: any, data: any) {
  return await supabase.functions.invoke('send-calendar-invite', { body: data })
}

// Project operations
async function updateProjectProgress(supabase: any, request: PlatformActionRequest) {
  const { project_id, phase, progress, notes } = request.data

  // Update project
  const { data: project, error } = await supabase
    .from('projects')
    .update({
      current_phase: phase,
      progress_percentage: progress,
      last_ai_update: new Date().toISOString()
    })
    .eq('id', project_id)
    .select()
    .single()

  if (error) throw error

  // Log progress update
  await supabase.from('project_progress_logs').insert({
    project_id,
    phase,
    progress,
    notes,
    updated_by: request.user_id,
    updated_by_ai: true
  })

  return project
}

async function flagRisk(supabase: any, request: PlatformActionRequest) {
  const riskData = {
    project_id: request.project_id,
    title: request.data.title,
    description: request.data.description,
    category: request.data.category,
    severity: request.data.severity || 'medium',
    likelihood: request.data.likelihood || 'medium',
    impact: request.data.impact,
    mitigation: request.data.mitigation,
    flagged_by: request.user_id,
    flagged_by_ai: true,
    status: 'open'
  }

  const { data: risk, error } = await supabase
    .from('project_risks')
    .insert(riskData)
    .select()
    .single()

  if (error) throw error

  // Notify project manager
  const { data: project } = await supabase
    .from('projects')
    .select('project_manager_id')
    .eq('id', request.project_id)
    .single()

  if (project?.project_manager_id) {
    await sendNotification(supabase, {
      user_id: project.project_manager_id,
      type: 'risk_flagged',
      title: 'AI Flagged New Risk',
      message: `AI has identified a ${risk.severity} risk: ${risk.title}`,
      data: { risk_id: risk.id }
    })
  }

  return risk
}

async function assignTask(supabase: any, request: PlatformActionRequest) {
  const { task_id, assignee_id, notes } = request.data

  const { data: task, error } = await supabase
    .from('tasks')
    .update({
      assigned_to: assignee_id,
      assignment_notes: notes,
      assigned_by_ai: true,
      assigned_at: new Date().toISOString()
    })
    .eq('id', task_id)
    .select()
    .single()

  if (error) throw error

  // Notify assignee
  await sendNotification(supabase, {
    user_id: assignee_id,
    type: 'task_assigned',
    title: 'Task Assigned by AI',
    message: `AI has assigned you: ${task.title}`,
    data: { task_id }
  })

  return task
}

// WORKFLOW Operations
async function handleWorkflow(supabase: any, request: PlatformActionRequest) {
  switch (request.resource) {
    case 'start_approval':
      return await startApprovalWorkflow(supabase, request.data)
    case 'submit_rfi':
      return await submitRFI(supabase, request.data)
    case 'close_issue':
      return await closeIssue(supabase, request.data)
    case 'escalate_risk':
      return await escalateRisk(supabase, request.data)
    default:
      throw new Error(`Unknown workflow: ${request.resource}`)
  }
}

async function startApprovalWorkflow(supabase: any, data: any) {
  const workflowData = {
    type: data.type,
    item_id: data.item_id,
    project_id: data.project_id,
    requested_by: data.requested_by,
    requested_by_ai: true,
    status: 'pending',
    current_step: 1,
    total_steps: data.steps || 3,
    approvers: data.approvers || [],
    created_at: new Date().toISOString()
  }

  const { data: workflow, error } = await supabase
    .from('approval_workflows')
    .insert(workflowData)
    .select()
    .single()

  if (error) throw error

  // Notify first approver
  if (workflow.approvers[0]) {
    await sendNotification(supabase, {
      user_id: workflow.approvers[0],
      type: 'approval_required',
      title: 'AI Requested Approval',
      message: `AI has submitted ${workflow.type} for your approval`,
      data: { workflow_id: workflow.id }
    })
  }

  return workflow
}

async function submitRFI(supabase: any, data: any) {
  // Implementation for RFI submission workflow
  return { submitted: true, rfi_id: data.rfi_id }
}

async function closeIssue(supabase: any, data: any) {
  const { data: issue, error } = await supabase
    .from('project_issues')
    .update({
      status: 'closed',
      closed_by_ai: true,
      closed_at: new Date().toISOString(),
      resolution: data.resolution
    })
    .eq('id', data.issue_id)
    .select()
    .single()

  if (error) throw error
  return issue
}

async function escalateRisk(supabase: any, data: any) {
  const { data: risk, error } = await supabase
    .from('project_risks')
    .update({
      severity: 'critical',
      escalated: true,
      escalated_by_ai: true,
      escalated_at: new Date().toISOString(),
      escalation_reason: data.reason
    })
    .eq('id', data.risk_id)
    .select()
    .single()

  if (error) throw error

  // Notify executives
  await supabase.functions.invoke('notify-executives', {
    body: {
      type: 'risk_escalation',
      risk,
      project_id: risk.project_id
    }
  })

  return risk
}