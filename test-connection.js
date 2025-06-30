// Simple test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Testing Supabase connection...')

// Test projects
const { data: projects, error: projectsError } = await supabase
  .from('projects')
  .select('*')

console.log('Projects:', projects)
console.log('Projects error:', projectsError)

// Test financial metrics for the first project
if (projects && projects.length > 0) {
  const firstProjectId = projects[0].id
  console.log('Testing financial metrics for project:', firstProjectId)
  
  const { data: financial, error: financialError } = await supabase
    .from('project_financial_metrics')
    .select('*')
    .eq('project_id', firstProjectId)
    .single()
    
  console.log('Financial metrics:', financial)
  console.log('Financial error:', financialError)
}
