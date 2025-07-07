#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for local development
// Using service role key to bypass RLS for seeding
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample company data
const sampleCompanies = [
  {
    name: 'Turner Construction Company',
    trade_codes: ['GC-001', 'CM-001', 'Design-Build'],
    type: 'gc',
    status: 'active',
    risk_score: 8,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false, small_business: false }
  },
  {
    name: 'Metropolitan Steel Works',
    trade_codes: ['05-1000', '05-2000', 'Structural Steel'],
    type: 'sub',
    status: 'active',
    risk_score: 22,
    diversity_flags: { minority_owned: true, woman_owned: false, veteran_owned: false, small_business: true }
  },
  {
    name: 'Advanced MEP Solutions',
    trade_codes: ['15-0000', '16-0000', 'HVAC', 'Electrical'],
    type: 'sub',
    status: 'active',
    risk_score: 15,
    diversity_flags: { minority_owned: false, woman_owned: true, veteran_owned: false, small_business: false }
  },
  {
    name: 'Premier Concrete Company',
    trade_codes: ['03-3000', '03-4000', 'Ready-Mix', 'Placement'],
    type: 'sub',
    status: 'active',
    risk_score: 12,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: true, small_business: false }
  },
  {
    name: 'Glass Tech Systems',
    trade_codes: ['08-4000', '08-8000', 'Curtain Wall', 'Glazing'],
    type: 'sub',
    status: 'active',
    risk_score: 18,
    diversity_flags: { minority_owned: false, woman_owned: true, veteran_owned: false, small_business: true }
  }
];

// Sample contact data
const sampleContacts = [
  {
    name: 'Sarah Johnson',
    title: 'VP Operations',
    email: 'sarah.johnson@turnerconstruction.com',
    phone: '(212) 555-0156'
  },
  {
    name: 'John Smith',
    title: 'President',
    email: 'john.smith@metrosteel.com',
    phone: '(312) 555-0123'
  },
  {
    name: 'Lisa Wang',
    title: 'CEO',
    email: 'lisa.wang@advancedmep.com',
    phone: '(408) 555-0187'
  },
  {
    name: 'Robert Martinez',
    title: 'Operations Manager',
    email: 'robert.martinez@premierconcrete.com',
    phone: '(303) 555-0245'
  },
  {
    name: 'Jennifer Chen',
    title: 'Business Development',
    email: 'jennifer.chen@glasstech.com',
    phone: '(206) 555-0167'
  }
];

// Sample opportunity data templates
const opportunityTemplates = [
  {
    name: 'Downtown Medical Center - Phase 2 Construction',
    description: 'Major healthcare facility expansion project requiring experienced GC',
    project_type: 'Healthcare',
    stage: 'negotiation',
    est_value: 125000000,
    probability: 85,
    notes: 'Strong relationship from Phase 1 success. Client prefers our team.',
    tags: ['Healthcare', 'LEED', 'Fast-Track']
  },
  {
    name: 'Tech Campus Structural Steel Package',
    description: 'Structural steel fabrication and erection for new tech campus',
    project_type: 'Commercial',
    stage: 'shortlisted',
    est_value: 3200000,
    probability: 65,
    notes: 'MBE status provides advantage in selection criteria',
    tags: ['Structural', 'Tech', 'MBE']
  },
  {
    name: 'Corporate HQ MEP Systems',
    description: 'Complete MEP package for 40-story corporate headquarters',
    project_type: 'Commercial',
    stage: 'invited',
    est_value: 8500000,
    probability: 75,
    notes: 'WBE certification aligns with client diversity goals',
    tags: ['MEP', 'High-Rise', 'WBE', 'Sustainable']
  },
  {
    name: 'Airport Terminal Foundations',
    description: 'Concrete foundations for airport terminal expansion',
    project_type: 'Infrastructure',
    stage: 'prospect',
    est_value: 4200000,
    probability: 45,
    notes: 'VBE status preferred for federal project',
    tags: ['Infrastructure', 'Concrete', 'VBE', 'Federal']
  },
  {
    name: 'Mixed-Use Tower Curtain Wall',
    description: 'High-performance curtain wall system for 50-story tower',
    project_type: 'Commercial',
    stage: 'qualified',
    est_value: 2800000,
    probability: 55,
    notes: 'Technical expertise in complex facades is key differentiator',
    tags: ['Curtain Wall', 'High-Rise', 'WBE', 'Energy-Efficient']
  }
];

async function seedCRM() {
  console.log('🌱 Starting CRM data seeding...');

  try {
    // Insert companies
    console.log('📦 Inserting companies...');
    const { data: companies, error: companyError } = await supabase
      .from('company')
      .insert(sampleCompanies)
      .select();

    if (companyError) {
      console.error('Error inserting companies:', companyError);
      return;
    }
    console.log(`✅ Inserted ${companies.length} companies`);

    // Insert contacts (one per company)
    console.log('👥 Inserting contacts...');
    const contactsToInsert = companies.map((company, index) => ({
      company_id: company.id,
      ...sampleContacts[index]
    }));

    const { data: contacts, error: contactError } = await supabase
      .from('contact')
      .insert(contactsToInsert)
      .select();

    if (contactError) {
      console.error('Error inserting contacts:', contactError);
      return;
    }
    console.log(`✅ Inserted ${contacts.length} contacts`);

    // Insert opportunities (one per company)
    console.log('💼 Inserting opportunities...');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const opportunitiesToInsert = companies.map((company, index) => ({
      company_id: company.id,
      ...opportunityTemplates[index],
      owner_id: '00000000-0000-0000-0000-000000000000', // System user UUID
      next_action_date: nextWeek.toISOString()
    }));

    const { data: opportunities, error: opportunityError } = await supabase
      .from('opportunity')
      .insert(opportunitiesToInsert)
      .select();

    if (opportunityError) {
      console.error('Error inserting opportunities:', opportunityError);
      return;
    }
    console.log(`✅ Inserted ${opportunities.length} opportunities`);

    // Insert some sample interactions
    console.log('📞 Inserting interactions...');
    const interactionsToInsert = companies.flatMap((company, index) => [
      {
        company_id: company.id,
        type: 'email',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        outcome: 'positive',
        notes: 'Initial project discussion email sent',
        next_steps: ['Schedule follow-up meeting', 'Send project portfolio']
      },
      {
        company_id: company.id,
        type: 'meeting',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        outcome: 'positive',
        notes: 'Productive meeting discussing project requirements',
        next_steps: ['Prepare detailed proposal', 'Site visit scheduled']
      }
    ]);

    const { data: interactions, error: interactionError } = await supabase
      .from('interaction')
      .insert(interactionsToInsert)
      .select();

    if (interactionError) {
      console.error('Error inserting interactions:', interactionError);
      return;
    }
    console.log(`✅ Inserted ${interactions.length} interactions`);

    // Insert sample tasks
    console.log('✅ Inserting tasks...');
    const tasksToInsert = opportunities.map((opp, index) => ({
      title: `Follow up on ${opp.name}`,
      description: `Contact client regarding ${opp.name} opportunity`,
      company_id: opp.company_id,
      opportunity_id: opp.id,
      assignee_id: '00000000-0000-0000-0000-000000000000',
      assignee_name: 'System User',
      priority: index % 2 === 0 ? 'high' : 'medium',
      status: 'todo',
      due_date: nextWeek.toISOString(),
      created_by: '00000000-0000-0000-0000-000000000000',
      tags: ['follow-up', 'sales']
    }));

    const { data: tasks, error: taskError } = await supabase
      .from('crm_tasks')
      .insert(tasksToInsert)
      .select();

    if (taskError) {
      console.error('Error inserting tasks:', taskError);
      return;
    }
    console.log(`✅ Inserted ${tasks.length} tasks`);

    console.log('\n🎉 CRM data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Contacts: ${contacts.length}`);
    console.log(`   - Opportunities: ${opportunities.length}`);
    console.log(`   - Interactions: ${interactions.length}`);
    console.log(`   - Tasks: ${tasks.length}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// Run the seeder
seedCRM().then(() => {
  console.log('\n✨ Done!');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
