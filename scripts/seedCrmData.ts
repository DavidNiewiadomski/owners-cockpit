import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Realistic construction company data
const COMPANIES = [
  {
    name: "Turner Construction Company",
    trade_codes: ["GC", "CM", "Design-Build"],
    type: "gc",
    status: "active",
    risk_score: 15,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    website: "https://turnerconstruction.com",
    address: "375 Hudson Street, New York, NY 10014",
    phone: "(212) 229-6000",
    employees: 12000,
    annual_revenue: 14500000000,
    bonding_capacity: 5000000000,
    certifications: ["LEED", "OSHA 30", "ISO 9001"]
  },
  {
    name: "Skanska USA",
    trade_codes: ["GC", "Infrastructure", "Commercial"],
    type: "gc",
    status: "active",
    risk_score: 12,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    website: "https://usa.skanska.com",
    address: "1550 Utica Avenue South, Minneapolis, MN 55416",
    phone: "(952) 928-4500",
    employees: 9500,
    annual_revenue: 7800000000,
    bonding_capacity: 3500000000,
    certifications: ["LEED", "ISO 14001", "OHSAS 18001"]
  },
  {
    name: "Metropolitan Steel Works",
    trade_codes: ["05-1000", "05-2000", "Structural Steel"],
    type: "sub",
    status: "active",
    risk_score: 25,
    diversity_flags: { minority_owned: true, woman_owned: false, veteran_owned: false },
    website: "https://metrosteel.com",
    address: "2845 Industrial Blvd, Chicago, IL 60616",
    phone: "(312) 555-0123",
    employees: 450,
    annual_revenue: 85000000,
    bonding_capacity: 50000000,
    certifications: ["AISC", "AWS D1.1", "OSHA 10"]
  },
  {
    name: "Advanced MEP Solutions",
    trade_codes: ["15-0000", "16-0000", "HVAC", "Electrical"],
    type: "sub",
    status: "active",
    risk_score: 18,
    diversity_flags: { minority_owned: false, woman_owned: true, veteran_owned: false },
    website: "https://advancedmep.com",
    address: "1247 Technology Drive, San Jose, CA 95110",
    phone: "(408) 555-0187",
    employees: 320,
    annual_revenue: 62000000,
    bonding_capacity: 35000000,
    certifications: ["NECA", "SMACNA", "LEED AP"]
  },
  {
    name: "Premier Concrete Company",
    trade_codes: ["03-3000", "03-4000", "Ready-Mix", "Placement"],
    type: "sub",
    status: "active",
    risk_score: 8,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: true },
    website: "https://premierconcrete.com",
    address: "5890 Commerce Street, Denver, CO 80239",
    phone: "(303) 555-0234",
    employees: 180,
    annual_revenue: 42000000,
    bonding_capacity: 25000000,
    certifications: ["ACI", "NRMCA", "OSHA 30"]
  },
  {
    name: "Glass Tech Systems",
    trade_codes: ["08-4000", "08-8000", "Curtain Wall", "Glazing"],
    type: "sub",
    status: "active",
    risk_score: 22,
    diversity_flags: { minority_owned: false, woman_owned: true, veteran_owned: false },
    website: "https://glasstech.com",
    address: "3421 Innovation Way, Seattle, WA 98101",
    phone: "(206) 555-0156",
    employees: 95,
    annual_revenue: 28000000,
    bonding_capacity: 15000000,
    certifications: ["GANA", "AAMA", "IGMA"]
  },
  {
    name: "Hilti Corporation",
    trade_codes: ["Fasteners", "Tools", "Software"],
    type: "supplier",
    status: "active",
    risk_score: 5,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    website: "https://hilti.com",
    address: "7250 Dallas Parkway, Plano, TX 75024",
    phone: "(918) 252-6000",
    employees: 32000,
    annual_revenue: 6200000000,
    bonding_capacity: 0,
    certifications: ["ISO 9001", "ISO 14001"]
  },
  {
    name: "Caterpillar Inc.",
    trade_codes: ["Heavy Equipment", "Construction Machinery"],
    type: "supplier",
    status: "active",
    risk_score: 10,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    website: "https://caterpillar.com",
    address: "300 SW Adams Street, Peoria, IL 61602",
    phone: "(309) 675-1000",
    employees: 109000,
    annual_revenue: 59400000000,
    bonding_capacity: 0,
    certifications: ["ISO 9001", "ISO 14001", "OHSAS 18001"]
  },
  {
    name: "Gensler",
    trade_codes: ["Architecture", "Interior Design", "Planning"],
    type: "a/e",
    status: "active",
    risk_score: 12,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    website: "https://gensler.com",
    address: "One Rockefeller Plaza, New York, NY 10020",
    phone: "(212) 492-1400",
    employees: 6000,
    annual_revenue: 1500000000,
    bonding_capacity: 0,
    certifications: ["AIA", "LEED", "WELL AP"]
  },
  {
    name: "AECOM",
    trade_codes: ["Engineering", "Architecture", "Program Management"],
    type: "a/e",
    status: "active",
    risk_score: 15,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    website: "https://aecom.com",
    address: "300 S Grand Ave, Los Angeles, CA 90071",
    phone: "(213) 593-8000",
    employees: 50000,
    annual_revenue: 13200000000,
    bonding_capacity: 0,
    certifications: ["PE", "LEED", "PMP"]
  },
  {
    name: "Diverse Construction Solutions",
    trade_codes: ["Site Work", "Demolition", "Excavation"],
    type: "sub",
    status: "active",
    risk_score: 35,
    diversity_flags: { minority_owned: true, woman_owned: true, veteran_owned: false },
    website: "https://diverseconstruction.com",
    address: "1892 Industrial Park Road, Atlanta, GA 30318",
    phone: "(404) 555-0289",
    employees: 85,
    annual_revenue: 18500000,
    bonding_capacity: 10000000,
    certifications: ["MBE", "WBE", "OSHA 30"]
  },
  {
    name: "Veteran Trades LLC",
    trade_codes: ["Plumbing", "HVAC Service", "Fire Protection"],
    type: "sub",
    status: "active",
    risk_score: 28,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: true },
    website: "https://veterantrades.com",
    address: "4567 Veterans Boulevard, Phoenix, AZ 85043",
    phone: "(602) 555-0345",
    employees: 62,
    annual_revenue: 12800000,
    bonding_capacity: 8000000,
    certifications: ["VBE", "SDVOSB", "UA Local 469"]
  }
];

const CONTACTS = [
  // Turner Construction
  { company_index: 0, name: "Sarah Johnson", title: "Senior Project Manager", email: "s.johnson@turner.com", phone: "(212) 229-6045", linkedin: "sarah-johnson-turner" },
  { company_index: 0, name: "Michael Chen", title: "Procurement Director", email: "m.chen@turner.com", phone: "(212) 229-6087", linkedin: "michael-chen-construction" },
  { company_index: 0, name: "David Rodriguez", title: "VP of Operations", email: "d.rodriguez@turner.com", phone: "(212) 229-6123" },
  
  // Skanska USA
  { company_index: 1, name: "Jennifer Liu", title: "Regional Manager", email: "jennifer.liu@skanska.com", phone: "(952) 928-4532", linkedin: "jennifer-liu-skanska" },
  { company_index: 1, name: "Robert Kim", title: "Chief Estimator", email: "robert.kim@skanska.com", phone: "(952) 928-4578" },
  
  // Metropolitan Steel Works
  { company_index: 2, name: "John Smith", title: "President", email: "j.smith@metrosteel.com", phone: "(312) 555-0124", linkedin: "john-smith-steel" },
  { company_index: 2, name: "Maria Santos", title: "Sales Manager", email: "m.santos@metrosteel.com", phone: "(312) 555-0156" },
  
  // Advanced MEP Solutions
  { company_index: 3, name: "Lisa Wang", title: "CEO", email: "l.wang@advancedmep.com", phone: "(408) 555-0188", linkedin: "lisa-wang-mep" },
  { company_index: 3, name: "Thomas Anderson", title: "Project Manager", email: "t.anderson@advancedmep.com", phone: "(408) 555-0201" },
  
  // Premier Concrete
  { company_index: 4, name: "Carlos Mendez", title: "Operations Manager", email: "c.mendez@premierconcrete.com", phone: "(303) 555-0235", linkedin: "carlos-mendez-concrete" },
  { company_index: 4, name: "Amanda Foster", title: "Quality Control Manager", email: "a.foster@premierconcrete.com", phone: "(303) 555-0267" },
  
  // Glass Tech Systems
  { company_index: 5, name: "Kevin Park", title: "Principal", email: "k.park@glasstech.com", phone: "(206) 555-0157", linkedin: "kevin-park-glass" },
  { company_index: 5, name: "Elena Volkov", title: "Design Manager", email: "e.volkov@glasstech.com", phone: "(206) 555-0189" },
  
  // Hilti
  { company_index: 6, name: "Brian Thompson", title: "Account Manager", email: "brian.thompson@hilti.com", phone: "(918) 252-6034", linkedin: "brian-thompson-hilti" },
  { company_index: 6, name: "Diana Chang", title: "Technical Specialist", email: "diana.chang@hilti.com", phone: "(918) 252-6078" },
  
  // Caterpillar
  { company_index: 7, name: "Alex Petrov", title: "Regional Sales Manager", email: "alex.petrov@cat.com", phone: "(309) 675-1045", linkedin: "alex-petrov-cat" },
  { company_index: 7, name: "Rachel Green", title: "Equipment Specialist", email: "rachel.green@cat.com", phone: "(309) 675-1089" },
  
  // Gensler
  { company_index: 8, name: "Matthew Davis", title: "Principal Architect", email: "m.davis@gensler.com", phone: "(212) 492-1434", linkedin: "matthew-davis-architect" },
  { company_index: 8, name: "Sophie Martinez", title: "Project Architect", email: "s.martinez@gensler.com", phone: "(212) 492-1456" },
  
  // AECOM
  { company_index: 9, name: "James Wilson", title: "Engineering Manager", email: "james.wilson@aecom.com", phone: "(213) 593-8045", linkedin: "james-wilson-aecom" },
  { company_index: 9, name: "Nicole Brown", title: "Senior Engineer", email: "nicole.brown@aecom.com", phone: "(213) 593-8067" },
  
  // Diverse Construction Solutions
  { company_index: 10, name: "Keisha Williams", title: "Owner/CEO", email: "k.williams@diverseconstruction.com", phone: "(404) 555-0290", linkedin: "keisha-williams-construction" },
  { company_index: 10, name: "Carlos Rodriguez", title: "Project Supervisor", email: "c.rodriguez@diverseconstruction.com", phone: "(404) 555-0312" },
  
  // Veteran Trades
  { company_index: 11, name: "Mark Thompson", title: "Owner", email: "m.thompson@veterantrades.com", phone: "(602) 555-0346", linkedin: "mark-thompson-veteran" },
  { company_index: 11, name: "Jessica Miller", title: "Operations Manager", email: "j.miller@veterantrades.com", phone: "(602) 555-0378" }
];

const OPPORTUNITY_STAGES = ['prospect', 'shortlisted', 'invited', 'negotiation', 'closed'] as const;

async function seedCompanies() {
  console.log('🏢 Seeding companies...');
  
  // Clear existing data
  await supabase.from('company').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const companies = [];
  for (const companyData of COMPANIES) {
    const { data, error } = await supabase
      .from('company')
      .insert(companyData)
      .select()
      .single();
      
    if (error) {
      console.error('Error inserting company:', error);
      continue;
    }
    
    companies.push(data);
  }
  
  console.log(`✅ Inserted ${companies.length} companies`);
  return companies;
}

async function seedContacts(companies: any[]) {
  console.log('👥 Seeding contacts...');
  
  // Clear existing data
  await supabase.from('contact').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const contacts = [];
  for (const contactData of CONTACTS) {
    const company = companies[contactData.company_index];
    if (!company) continue;
    
    const { company_index, ...contactFields } = contactData;
    const { data, error } = await supabase
      .from('contact')
      .insert({
        ...contactFields,
        company_id: company.id
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error inserting contact:', error);
      continue;
    }
    
    contacts.push(data);
  }
  
  console.log(`✅ Inserted ${contacts.length} contacts`);
  return contacts;
}

async function seedOpportunities(companies: any[]) {
  console.log('🎯 Seeding opportunities...');
  
  // Clear existing data
  await supabase.from('opportunity').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const opportunities = [];
  const defaultUserId = '00000000-0000-0000-0000-000000000001'; // Mock user ID
  
  // Create opportunities for different stages
  const opportunityData = [
    // Prospects
    { company_index: 0, stage: 'prospect', est_value: 3200000, description: 'Downtown Office Tower - Structural Package' },
    { company_index: 1, stage: 'prospect', est_value: 5800000, description: 'Mixed-Use Development - General Contract' },
    { company_index: 8, stage: 'prospect', est_value: 850000, description: 'Corporate Headquarters - Architectural Services' },
    { company_index: 9, stage: 'prospect', est_value: 1200000, description: 'Infrastructure Upgrade - Engineering Services' },
    
    // Shortlisted
    { company_index: 2, stage: 'shortlisted', est_value: 1850000, description: 'High-Rise Steel Framework' },
    { company_index: 3, stage: 'shortlisted', est_value: 2100000, description: 'MEP Systems Installation' },
    { company_index: 4, stage: 'shortlisted', est_value: 950000, description: 'Foundation Concrete Work' },
    { company_index: 10, stage: 'shortlisted', est_value: 650000, description: 'Site Preparation & Excavation' },
    
    // Invited
    { company_index: 5, stage: 'invited', est_value: 1400000, description: 'Curtain Wall System' },
    { company_index: 11, stage: 'invited', est_value: 420000, description: 'Plumbing & Fire Protection' },
    { company_index: 6, stage: 'invited', est_value: 180000, description: 'Specialty Fasteners & Tools' },
    
    // Negotiation
    { company_index: 2, stage: 'negotiation', est_value: 2800000, description: 'Structural Steel - Phase 2' },
    { company_index: 3, stage: 'negotiation', est_value: 1650000, description: 'HVAC Controls Package' },
    
    // Closed/Won
    { company_index: 4, stage: 'closed', est_value: 1200000, description: 'Parking Garage Concrete' },
    { company_index: 7, stage: 'closed', est_value: 890000, description: 'Heavy Equipment Rental' }
  ];
  
  for (const oppData of opportunityData) {
    const company = companies[oppData.company_index];
    if (!company) continue;
    
    const nextActionDate = new Date();
    nextActionDate.setDate(nextActionDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    const { company_index, ...oppFields } = oppData;
    const { data, error } = await supabase
      .from('opportunity')
      .insert({
        ...oppFields,
        company_id: company.id,
        owner_id: defaultUserId,
        next_action_date: nextActionDate.toISOString().split('T')[0]
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error inserting opportunity:', error);
      continue;
    }
    
    opportunities.push(data);
  }
  
  console.log(`✅ Inserted ${opportunities.length} opportunities`);
  return opportunities;
}

async function seedInteractions(companies: any[], contacts: any[]) {
  console.log('💬 Seeding interactions...');
  
  // Clear existing data
  await supabase.from('interaction').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const interactions = [];
  const defaultUserId = '00000000-0000-0000-0000-000000000001';
  
  const interactionTemplates = [
    {
      type: 'call',
      medium: 'phone',
      notes: 'Initial qualification call. Discussed project requirements and timeline. Company shows strong interest and has relevant experience.',
      ai_summary: 'Positive initial contact. Company qualified for next stage.'
    },
    {
      type: 'email',
      medium: 'email',
      notes: 'Sent RFP documentation package. Requested prequalification forms and references. Response expected within 5 business days.',
      ai_summary: 'RFP package distributed. Awaiting prequalification documents.'
    },
    {
      type: 'meeting',
      medium: 'in-person',
      notes: 'Site visit conducted. Reviewed scope of work and project constraints. Discussed scheduling and resource allocation.',
      ai_summary: 'Successful site visit. Company demonstrated good understanding of project requirements.'
    },
    {
      type: 'call',
      medium: 'phone',
      notes: 'Follow-up on proposal submission. Clarified technical specifications and pricing methodology. Proposal due date confirmed.',
      ai_summary: 'Proposal clarifications provided. Submission on track.'
    },
    {
      type: 'email',
      medium: 'email',
      notes: 'Received proposal submission. Initial review shows competitive pricing. Technical evaluation scheduled for next week.',
      ai_summary: 'Proposal received and under review. Competitive positioning noted.'
    },
    {
      type: 'meeting',
      medium: 'video-call',
      notes: 'Presentation of proposal and Q&A session. Strong technical approach. Some concerns about timeline but manageable.',
      ai_summary: 'Good proposal presentation. Minor timeline concerns to address.'
    }
  ];
  
  // Create interactions for each company over the past 90 days
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const companyContacts = contacts.filter(c => c.company_id === company.id);
    
    // Create 2-5 interactions per company
    const numInteractions = Math.floor(Math.random() * 4) + 2;
    
    for (let j = 0; j < numInteractions; j++) {
      const template = interactionTemplates[Math.floor(Math.random() * interactionTemplates.length)];
      const contact = companyContacts[Math.floor(Math.random() * companyContacts.length)];
      
      const interactionDate = new Date();
      interactionDate.setDate(interactionDate.getDate() - Math.floor(Math.random() * 90));
      
      const { data, error } = await supabase
        .from('interaction')
        .insert({
          company_id: company.id,
          contact_id: contact?.id || null,
          user_id: defaultUserId,
          type: template.type,
          date: interactionDate.toISOString().split('T')[0],
          medium: template.medium,
          notes: template.notes,
          ai_summary: template.ai_summary
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting interaction:', error);
        continue;
      }
      
      interactions.push(data);
    }
  }
  
  console.log(`✅ Inserted ${interactions.length} interactions`);
  return interactions;
}

async function generateSummaryStats(companies: any[], contacts: any[], opportunities: any[], interactions: any[]) {
  console.log('\n📊 CRM Database Summary:');
  console.log('========================');
  console.log(`Companies: ${companies.length}`);
  console.log(`  - General Contractors: ${companies.filter(c => c.type === 'gc').length}`);
  console.log(`  - Subcontractors: ${companies.filter(c => c.type === 'sub').length}`);
  console.log(`  - Suppliers: ${companies.filter(c => c.type === 'supplier').length}`);
  console.log(`  - A&E Firms: ${companies.filter(c => c.type === 'a/e').length}`);
  console.log(`  - MBE Certified: ${companies.filter(c => c.diversity_flags.minority_owned).length}`);
  console.log(`  - WBE Certified: ${companies.filter(c => c.diversity_flags.woman_owned).length}`);
  console.log(`  - VBE Certified: ${companies.filter(c => c.diversity_flags.veteran_owned).length}`);
  
  console.log(`\nContacts: ${contacts.length}`);
  console.log(`  - With LinkedIn: ${contacts.filter(c => c.linkedin).length}`);
  console.log(`  - With Phone: ${contacts.filter(c => c.phone).length}`);
  console.log(`  - With Email: ${contacts.filter(c => c.email).length}`);
  
  console.log(`\nOpportunities: ${opportunities.length}`);
  for (const stage of OPPORTUNITY_STAGES) {
    const count = opportunities.filter(o => o.stage === stage).length;
    const value = opportunities.filter(o => o.stage === stage).reduce((sum, o) => sum + (o.est_value || 0), 0);
    console.log(`  - ${stage}: ${count} (${(value / 1000000).toFixed(1)}M)`);
  }
  
  const totalValue = opportunities.reduce((sum, o) => sum + (o.est_value || 0), 0);
  console.log(`  - Total Pipeline Value: $${(totalValue / 1000000).toFixed(1)}M`);
  
  console.log(`\nInteractions: ${interactions.length}`);
  console.log(`  - Calls: ${interactions.filter(i => i.type === 'call').length}`);
  console.log(`  - Emails: ${interactions.filter(i => i.type === 'email').length}`);
  console.log(`  - Meetings: ${interactions.filter(i => i.type === 'meeting').length}`);
  
  console.log('\n✅ CRM seeding completed successfully!');
}

async function main() {
  try {
    console.log('🚀 Starting CRM data seeding...\n');
    
    const companies = await seedCompanies();
    const contacts = await seedContacts(companies);
    const opportunities = await seedOpportunities(companies);
    const interactions = await seedInteractions(companies, contacts);
    
    await generateSummaryStats(companies, contacts, opportunities, interactions);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
