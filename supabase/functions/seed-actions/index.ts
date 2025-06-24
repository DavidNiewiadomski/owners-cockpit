
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const SUPABASE_URL = "https://aqdwxbxofiadcvaeexjp.supabase.co";

interface ActionItemSeed {
  project_id: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  due_date?: string;
  assignee?: string;
  source_type?: string;
  source_id?: string;
  created_by?: string;
}

// Sample action items templates
const actionItemTemplates = [
  {
    title: 'Review architectural drawings',
    description: 'Complete review of updated architectural plans and provide feedback',
    priority: 'High' as const,
    source_type: 'meeting'
  },
  {
    title: 'Update material specifications',
    description: 'Revise material specs based on latest supplier information',
    priority: 'Medium' as const,
    source_type: 'insight'
  },
  {
    title: 'Schedule safety inspection',
    description: 'Coordinate with safety team for quarterly inspection',
    priority: 'Critical' as const
  },
  {
    title: 'Finalize budget allocation',
    description: 'Complete final review and approval of Q4 budget allocation',
    priority: 'High' as const,
    source_type: 'meeting'
  },
  {
    title: 'Equipment maintenance check',
    description: 'Perform routine maintenance on heavy equipment',
    priority: 'Low' as const
  }
];

const statuses: Array<'Open' | 'In Progress' | 'Done'> = ['Open', 'In Progress', 'Done'];

function getRandomDate(daysFromNow: number, variation: number = 7): string {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + daysFromNow);
  
  // Add random variation
  const randomDays = Math.floor(Math.random() * variation * 2) - variation;
  baseDate.setDate(baseDate.getDate() + randomDays);
  
  return baseDate.toISOString().split('T')[0];
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');
    
    if (!serviceRoleKey) {
      console.error('❌ SERVICE_ROLE_KEY environment variable is required');
      return new Response(
        JSON.stringify({ error: 'SERVICE_ROLE_KEY not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, serviceRoleKey);

    console.log('🚀 Starting action items seeding...');

    // Get all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, owner_id');

    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch projects', details: projectsError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!projects || projects.length === 0) {
      console.log('⚠️ No projects found. Please create some projects first.');
      return new Response(
        JSON.stringify({ message: 'No projects found to seed action items for' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get some sample users for assignee field
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const userIds = users?.map(user => user.id) || [];

    // Clear existing action items to avoid duplicates
    console.log('🧹 Clearing existing action items...');
    const { error: deleteError } = await supabase
      .from('action_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️ Warning: Could not clear existing action items:', deleteError);
    }

    const allActionItems: ActionItemSeed[] = [];

    // Create action items for each project
    for (const project of projects) {
      console.log(`📋 Creating action items for project: ${project.name}`);
      
      actionItemTemplates.forEach((template, index) => {
        const actionItem: ActionItemSeed = {
          project_id: project.id,
          title: template.title,
          description: template.description,
          status: statuses[index % 3], // Cycle through statuses
          priority: template.priority,
          due_date: Math.random() > 0.3 ? getRandomDate(index * 5 - 10, 5) : undefined, // 70% chance of having due date
          assignee: userIds.length > 0 && Math.random() > 0.4 ? userIds[Math.floor(Math.random() * userIds.length)] : undefined, // 60% chance of being assigned
          source_type: template.source_type,
          source_id: template.source_type ? crypto.randomUUID() : undefined, // Generate fake source IDs
          created_by: project.owner_id || (userIds.length > 0 ? userIds[0] : undefined)
        };

        allActionItems.push(actionItem);
      });
    }

    // Insert all action items
    console.log(`💾 Inserting ${allActionItems.length} action items...`);
    const { data: insertedItems, error: insertError } = await supabase
      .from('action_items')
      .insert(allActionItems)
      .select();

    if (insertError) {
      console.error('❌ Error inserting action items:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert action items', details: insertError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`✅ Successfully seeded ${insertedItems?.length} action items`);
    
    // Summary by project
    const summary = projects.map(project => ({
      project: project.name,
      action_items: actionItemTemplates.length
    }));
    
    // Status breakdown
    const statusBreakdown = allActionItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('🎉 Action items seeding completed!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Action items seeded successfully',
        summary: {
          total_items: insertedItems?.length || 0,
          projects: summary,
          status_breakdown: statusBreakdown
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error occurred', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
