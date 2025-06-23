
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcoreProject {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

interface ProcoreTask {
  id: number;
  name: string;
  description?: string;
  status?: string;
  priority?: number;
  assigned_to?: string;
  due_date?: string;
}

interface SyncRequest {
  procore_project_id: number;
  access_token: string;
  refresh_token: string;
}

interface SyncResponse {
  inserted: number;
  updated: number;
  errors: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify JWT and get user
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: user, error: authError } = await supabaseClient.auth.getUser(authHeader)
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Parse request body
    const body: SyncRequest = await req.json()
    const { procore_project_id, access_token, refresh_token } = body

    if (!procore_project_id || !access_token) {
      throw new Error('Missing required fields: procore_project_id, access_token')
    }

    console.log(`Starting Procore sync for project ${procore_project_id}`)

    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    // Log integration start
    await supabaseClient
      .from('integration_logs')
      .insert({
        integration_type: 'procore',
        status: 'started',
        external_id: procore_project_id.toString(),
        metadata: { user_id: user.user.id }
      })

    try {
      // Fetch project data from Procore
      const projectResponse = await fetch(
        `https://api.procore.com/vapid/projects/${procore_project_id}`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          }
        }
      )

      if (!projectResponse.ok) {
        throw new Error(`Procore API error: ${projectResponse.status} ${projectResponse.statusText}`)
      }

      const procoreProject: ProcoreProject = await projectResponse.json()

      // Map Procore project to our schema
      const projectData = {
        name: procoreProject.name,
        description: procoreProject.description,
        status: mapProcoreProjectStatus(procoreProject.status),
        start_date: procoreProject.start_date ? new Date(procoreProject.start_date).toISOString().split('T')[0] : null,
        end_date: procoreProject.end_date ? new Date(procoreProject.end_date).toISOString().split('T')[0] : null,
        source: 'procore',
        external_id: procore_project_id.toString(),
        owner_id: user.user.id,
        updated_at: new Date().toISOString()
      }

      // Upsert project
      const { data: existingProject } = await supabaseClient
        .from('projects')
        .select('id')
        .eq('external_id', procore_project_id.toString())
        .eq('source', 'procore')
        .single()

      let projectId: string;
      
      if (existingProject) {
        // Update existing project
        const { error: updateError } = await supabaseClient
          .from('projects')
          .update(projectData)
          .eq('id', existingProject.id)

        if (updateError) throw updateError
        projectId = existingProject.id
        updated++
        console.log(`Updated project ${existingProject.id}`)
      } else {
        // Insert new project
        const { data: newProject, error: insertError } = await supabaseClient
          .from('projects')
          .insert(projectData)
          .select('id')
          .single()

        if (insertError) throw insertError
        projectId = newProject.id
        inserted++
        console.log(`Inserted new project ${newProject.id}`)
      }

      // Fetch tasks/schedule data from Procore
      const scheduleResponse = await fetch(
        `https://api.procore.com/vapid/projects/${procore_project_id}/schedule`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          }
        }
      )

      if (scheduleResponse.ok) {
        const procoreTasks: ProcoreTask[] = await scheduleResponse.json()

        // Process tasks
        for (const procoreTask of procoreTasks) {
          try {
            const taskData = {
              project_id: projectId,
              name: procoreTask.name,
              description: procoreTask.description,
              status: mapProcoreTaskStatus(procoreTask.status),
              priority: procoreTask.priority || 1,
              assigned_to: procoreTask.assigned_to,
              due_date: procoreTask.due_date ? new Date(procoreTask.due_date).toISOString().split('T')[0] : null,
              source: 'procore',
              external_id: procoreTask.id.toString(),
              updated_at: new Date().toISOString()
            }

            // Upsert task
            const { data: existingTask } = await supabaseClient
              .from('tasks')
              .select('id')
              .eq('external_id', procoreTask.id.toString())
              .eq('source', 'procore')
              .single()

            if (existingTask) {
              const { error: updateError } = await supabaseClient
                .from('tasks')
                .update(taskData)
                .eq('id', existingTask.id)

              if (updateError) throw updateError
              updated++
            } else {
              const { error: insertError } = await supabaseClient
                .from('tasks')
                .insert(taskData)

              if (insertError) throw insertError
              inserted++
            }
          } catch (taskError) {
            console.error(`Error processing task ${procoreTask.id}:`, taskError)
            errors.push(`Task ${procoreTask.id}: ${taskError.message}`)
          }
        }
      } else {
        console.warn(`Could not fetch schedule data: ${scheduleResponse.status}`)
        errors.push(`Schedule fetch failed: ${scheduleResponse.statusText}`)
      }

      // Log success
      await supabaseClient
        .from('integration_logs')
        .insert({
          integration_type: 'procore',
          status: 'completed',
          external_id: procore_project_id.toString(),
          metadata: { 
            user_id: user.user.id,
            inserted,
            updated,
            errors: errors.length
          }
        })

      const response: SyncResponse = { inserted, updated, errors }
      console.log('Sync completed:', response)

      return new Response(
        JSON.stringify(response),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )

    } catch (syncError) {
      console.error('Sync error:', syncError)
      
      // Log failure
      await supabaseClient
        .from('integration_logs')
        .insert({
          integration_type: 'procore',
          status: 'failed',
          external_id: procore_project_id.toString(),
          metadata: { 
            user_id: user.user.id,
            error: syncError.message
          }
        })

      throw syncError
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        inserted: 0,
        updated: 0,
        errors: [error.message]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Helper functions to map Procore statuses to our enum values
function mapProcoreProjectStatus(procoreStatus?: string): 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' {
  if (!procoreStatus) return 'planning'
  
  const status = procoreStatus.toLowerCase()
  if (status.includes('active') || status.includes('in progress')) return 'active'
  if (status.includes('complete') || status.includes('finished')) return 'completed'
  if (status.includes('hold') || status.includes('pause')) return 'on_hold'
  if (status.includes('cancel') || status.includes('terminated')) return 'cancelled'
  return 'planning'
}

function mapProcoreTaskStatus(procoreStatus?: string): 'not_started' | 'in_progress' | 'completed' | 'blocked' {
  if (!procoreStatus) return 'not_started'
  
  const status = procoreStatus.toLowerCase()
  if (status.includes('progress') || status.includes('active')) return 'in_progress'
  if (status.includes('complete') || status.includes('finished') || status.includes('done')) return 'completed'
  if (status.includes('block') || status.includes('hold')) return 'blocked'
  return 'not_started'
}
