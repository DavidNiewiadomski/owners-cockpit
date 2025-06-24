
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = "https://aqdwxbxofiadcvaeexjp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHd4YnhvZmlhZGN2YWVleGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NTExNDksImV4cCI6MjA2NjIyNzE0OX0.yabfg_m0EeooU0OCkOra-HAWyHJQ7vcF9hJeCyE1s30";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ProjectIntegrationSeed {
  id: string;
  project_id: string;
  provider: string;
  status: string;
  last_sync: string | null;
  sync_error: string | null;
  config: Record<string, any>;
  api_key: string | null;
  refresh_token: string | null;
  oauth_data: Record<string, any>;
}

const providers = [
  {
    name: 'procore',
    status: 'connected',
    last_sync: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    sync_error: null
  },
  {
    name: 'primavera',
    status: 'error',
    last_sync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    sync_error: 'Authentication failed: Invalid API credentials (401)'
  },
  {
    name: 'box',
    status: 'connected',
    last_sync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    sync_error: null
  },
  {
    name: 'iot_sensors',
    status: 'not_connected',
    last_sync: null,
    sync_error: null
  },
  {
    name: 'smartsheet',
    status: 'connected',
    last_sync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    sync_error: null
  },
  {
    name: 'green_badger',
    status: 'connected',
    last_sync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    sync_error: null
  },
  {
    name: 'billy',
    status: 'not_connected',
    last_sync: null,
    sync_error: null
  },
  {
    name: 'clearstory',
    status: 'connected',
    last_sync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    sync_error: null
  },
  {
    name: 'track3d',
    status: 'error',
    last_sync: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    sync_error: 'Rate limit exceeded (429)'
  }
];

async function seedIntegrations() {
  console.log('🌱 Starting integrations seeding...');

  // First, get all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, name');

  if (projectsError) {
    console.error('❌ Error fetching projects:', projectsError);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('⚠️ No projects found. Creating demo projects first...');
    
    // Create demo projects
    const demoProjects = [
      { name: 'Office Tower', description: 'Downtown commercial office building', status: 'active' },
      { name: 'Data Center', description: 'High-tech data center facility', status: 'active' },
      { name: 'Hospital Wing', description: 'Medical facility expansion project', status: 'in_progress' }
    ];

    const { data: createdProjects, error: createError } = await supabase
      .from('projects')
      .insert(demoProjects)
      .select();

    if (createError) {
      console.error('❌ Error creating demo projects:', createError);
      return;
    }

    console.log(`✅ Created ${createdProjects?.length} demo projects`);
  }

  // Get updated projects list
  const { data: allProjects, error: allProjectsError } = await supabase
    .from('projects')
    .select('id, name');

  if (allProjectsError || !allProjects) {
    console.error('❌ Error fetching all projects:', allProjectsError);
    return;
  }

  // Clear existing integrations to avoid duplicates
  const { error: deleteError } = await supabase
    .from('project_integrations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    console.warn('⚠️ Warning: Could not clear existing integrations:', deleteError);
  }

  // Create integrations for each project
  const integrations: ProjectIntegrationSeed[] = [];

  for (const project of allProjects) {
    console.log(`📋 Creating integrations for project: ${project.name}`);
    
    for (const provider of providers) {
      const integration: ProjectIntegrationSeed = {
        id: crypto.randomUUID(),
        project_id: project.id,
        provider: provider.name,
        status: provider.status,
        last_sync: provider.last_sync,
        sync_error: provider.sync_error,
        config: {},
        api_key: provider.status === 'connected' ? 'demo-api-key-***' : null,
        refresh_token: null,
        oauth_data: {}
      };

      integrations.push(integration);
    }
  }

  // Insert all integrations
  const { data: insertedIntegrations, error: insertError } = await supabase
    .from('project_integrations')
    .insert(integrations)
    .select();

  if (insertError) {
    console.error('❌ Error inserting integrations:', insertError);
    return;
  }

  console.log(`✅ Successfully seeded ${insertedIntegrations?.length} integrations`);
  console.log(`📊 Created integrations for ${allProjects.length} projects with ${providers.length} providers each`);
  
  // Summary
  const summary = allProjects.map(project => ({
    project: project.name,
    integrations: providers.length
  }));
  
  console.table(summary);
  console.log('🎉 Integrations seeding completed!');
}

// Run the seeder
if (import.meta.main) {
  await seedIntegrations();
}
