import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface Division1SectionSeed {
  project_id: string;
  section_number: string;
  title: string;
  status: 'compliant' | 'overdue' | 'pending';
  due_date: string;
  docs_on_file: number;
  required_docs: number;
}

function getRandomDate(baseDate: Date, variation: number = 15): string {
  const newDate = new Date(baseDate);
  // Add random variation
  const randomDays = Math.floor(Math.random() * variation * 2) - variation;
  newDate.setDate(baseDate.getDate() + randomDays);
  return newDate.toISOString().split('T')[0];
}

async function seedDivision1() {
  console.log('🚀 Starting Division 1 data seeding...');

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SERVICE_ROLE_KEY environment variable is required');
    return;
  }

  try {
    // Get all projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, owner_id');

    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError);
      return;
    }

    if (!projects || projects.length === 0) {
      console.log('⚠️ No projects found. Please create some projects first.');
      return;
    }

    console.log(`📋 Found ${projects.length} projects. Seeding sections...`);

    const baseDate = new Date();
    const division1Sections: Division1SectionSeed[] = projects.flatMap(project => [
      {
        project_id: project.id,
        section_number: '01010',
        title: 'Summary of Work',
        status: 'compliant',
        due_date: getRandomDate(baseDate),
        docs_on_file: 5,
        required_docs: 5
      },
      {
        project_id: project.id,
        section_number: '01230',
        title: 'Alternative Prices',
        status: 'overdue',
        due_date: getRandomDate(baseDate),
        docs_on_file: 3,
        required_docs: 5
      },
      { 
        project_id: project.id,
        section_number: '01310',
        title: 'Administrative Requirements',
        status: 'pending',
        due_date: getRandomDate(baseDate),
        docs_on_file: 1,
        required_docs: 3
      }
    ]);

    console.log(`💾 Inserting Division 1 sections...`);
    const { error: insertError } = await supabase
      .from('division1_sections')
      .insert(division1Sections);

    if (insertError) {
      console.error('❌ Error inserting Division 1 sections:', insertError);
      return;
    }

    console.log('✅ Successfully seeded Division 1 sections for all projects.');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the seeder
if (import.meta.main) {
  seedDivision1();
}
