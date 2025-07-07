import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to generate UUIDs
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper to get random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Realistic company and project data
const PROJECTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Downtown Office Tower',
    description: 'A 45-story mixed-use commercial office building with retail space on the first three floors',
    status: 'active',
    total_value: 285000000,
    location: 'Downtown Financial District',
    type: 'Commercial',
    size: '1.2M sq ft',
    completion: '2025-12-31'
  },
  {
    id: '22222222-2222-2222-2222-222222222222', 
    name: 'Regional Medical Center Expansion',
    description: 'New 300-bed patient tower with advanced surgical suites and emergency department',
    status: 'active',
    total_value: 450000000,
    location: 'Medical District',
    type: 'Healthcare',
    size: '850K sq ft',
    completion: '2026-06-30'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Tech Campus Phase 2',
    description: 'Three interconnected office buildings with underground parking and central plaza',
    status: 'planning',
    total_value: 325000000,
    location: 'Innovation District',
    type: 'Technology',
    size: '950K sq ft',
    completion: '2026-09-30'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Waterfront Residential Complex',
    description: 'Luxury high-rise residential towers with amenities and marina access',
    status: 'active',
    total_value: 275000000,
    location: 'Waterfront District',
    type: 'Residential',
    size: '780K sq ft',
    completion: '2025-09-30'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'International Airport Terminal C',
    description: 'New international terminal with 30 gates and modern passenger facilities',
    status: 'active',
    total_value: 850000000,
    location: 'Airport',
    type: 'Infrastructure',
    size: '2.5M sq ft',
    completion: '2027-03-31'
  }
];

// Comprehensive vendor list
const VENDORS = [
  // Tier 1 General Contractors
  { name: "Turner Construction Company", tier: "tier1", type: "GC", specialties: ["Commercial", "Healthcare", "Aviation"], revenue: 14500000000, employees: 12000, bondingCapacity: 2500000000, safetyRating: 0.52 },
  { name: "Skanska USA Building", tier: "tier1", type: "GC", specialties: ["Commercial", "Infrastructure", "Residential"], revenue: 7800000000, employees: 9500, bondingCapacity: 1800000000, safetyRating: 0.48 },
  { name: "Suffolk Construction", tier: "tier1", type: "GC", specialties: ["Healthcare", "Life Sciences", "Education"], revenue: 4800000000, employees: 3500, bondingCapacity: 1200000000, safetyRating: 0.61 },
  
  // Tier 2 General Contractors
  { name: "McCarthy Building Companies", tier: "tier2", type: "GC", specialties: ["Healthcare", "Education", "Commercial"], revenue: 4200000000, employees: 3200, bondingCapacity: 950000000, safetyRating: 0.55 },
  { name: "DPR Construction", tier: "tier2", type: "GC", specialties: ["Life Sciences", "Healthcare", "Technology"], revenue: 4100000000, employees: 4200, bondingCapacity: 900000000, safetyRating: 0.64 },
  
  // Specialty Contractors
  { name: "Advanced MEP Solutions", tier: "tier1", type: "MEP", specialties: ["HVAC", "Plumbing", "Electrical"], revenue: 285000000, employees: 850, bondingCapacity: 125000000, safetyRating: 0.68 },
  { name: "Metropolitan Steel Works", tier: "tier1", type: "Structural", specialties: ["Structural Steel", "Fabrication", "Erection"], revenue: 195000000, employees: 450, bondingCapacity: 85000000, safetyRating: 0.73 },
  { name: "Premier Concrete Company", tier: "tier2", type: "Concrete", specialties: ["Cast-in-Place", "Precast", "Foundations"], revenue: 165000000, employees: 380, bondingCapacity: 65000000, safetyRating: 0.70 },
  { name: "Glass Tech Systems", tier: "tier2", type: "Envelope", specialties: ["Curtain Wall", "Glazing", "Facades"], revenue: 125000000, employees: 285, bondingCapacity: 45000000, safetyRating: 0.76 },
  { name: "Elite Electrical Systems", tier: "tier1", type: "Electrical", specialties: ["Power Distribution", "Low Voltage", "Life Safety"], revenue: 145000000, employees: 425, bondingCapacity: 55000000, safetyRating: 0.65 },
  
  // Diverse Suppliers
  { name: "Diverse Construction Solutions", tier: "tier3", type: "GC", specialties: ["Site Work", "Demolition", "Excavation"], revenue: 45000000, employees: 125, bondingCapacity: 15000000, safetyRating: 0.82, diversity: ["MBE", "DBE"] },
  { name: "Women's Building Enterprise", tier: "tier3", type: "Various", specialties: ["Interiors", "Finishes", "Specialties"], revenue: 38000000, employees: 95, bondingCapacity: 12000000, safetyRating: 0.78, diversity: ["WBE", "DBE"] },
  { name: "Veteran Construction Group", tier: "tier3", type: "Various", specialties: ["Mechanical", "Controls", "Service"], revenue: 42000000, employees: 110, bondingCapacity: 18000000, safetyRating: 0.75, diversity: ["VBE", "SDVOSB"] }
];

// CSI Division line items for bid leveling
const CSI_DIVISIONS = [
  { code: "03300", description: "Cast-in-Place Concrete", category: "Concrete", basePrice: 185, unit: "CY", riskLevel: "Medium" },
  { code: "04200", description: "Unit Masonry", category: "Masonry", basePrice: 425, unit: "SF", riskLevel: "Low" },
  { code: "05100", description: "Structural Steel Framing", category: "Metals", basePrice: 3250, unit: "TON", riskLevel: "High" },
  { code: "06100", description: "Rough Carpentry", category: "Wood", basePrice: 65, unit: "SF", riskLevel: "Low" },
  { code: "07200", description: "Thermal Insulation", category: "Thermal", basePrice: 12, unit: "SF", riskLevel: "Low" },
  { code: "07500", description: "Roofing and Waterproofing", category: "Roofing", basePrice: 28, unit: "SF", riskLevel: "Medium" },
  { code: "08400", description: "Entrances and Curtain Walls", category: "Openings", basePrice: 185, unit: "SF", riskLevel: "High" },
  { code: "09200", description: "Gypsum Board Systems", category: "Finishes", basePrice: 8.50, unit: "SF", riskLevel: "Low" },
  { code: "09600", description: "Flooring Systems", category: "Finishes", basePrice: 15, unit: "SF", riskLevel: "Low" },
  { code: "23100", description: "HVAC Systems", category: "Mechanical", basePrice: 42, unit: "SF", riskLevel: "High" },
  { code: "22100", description: "Plumbing Systems", category: "Plumbing", basePrice: 28, unit: "SF", riskLevel: "Medium" },
  { code: "26100", description: "Electrical Distribution", category: "Electrical", basePrice: 35, unit: "SF", riskLevel: "Medium" },
  { code: "27100", description: "Structured Cabling", category: "Communications", basePrice: 12, unit: "SF", riskLevel: "Low" },
  { code: "28100", description: "Fire Protection Systems", category: "Fire Safety", basePrice: 8, unit: "SF", riskLevel: "High" }
];

async function cleanExistingData() {
  console.log('🧹 Cleaning existing data...');
  
  const tables = [
    'project_integrations',
    'communication_logs', 
    'action_items',
    'performance_scorecards',
    'scorecard_metrics',
    'division1_sections',
    'division1_documents',
    'vendor_compliance_documents',
    'vendor_prequalifications',
    'vendor_references',
    'vendor_insurance_certificates',
    'vendor_financial_statements',
    'prequalification_requirements',
    'prequalification_evaluations',
    'rfp_management',
    'rfp_clause_library',
    'vendor_directory',
    'bid_leveling_analysis',
    'awards',
    'bafo_requests',
    'scorecards',
    'leveling_snapshot',
    'bid_line_items', 
    'submissions',
    'bids',
    'lead_time_packages',
    'lead_time_milestones',
    'lead_time_activities',
    'lead_time_predictions',
    'compliance_items',
    'notifications'
  ];

  for (const table of tables) {
    try {
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (error) {
      console.log(`Table ${table} might not exist, skipping...`);
    }
  }
}

async function seedProjects() {
  console.log('📋 Seeding projects...');
  
  // Check if projects already exist
  const { data: existingProjects } = await supabase.from('projects').select('id');
  
  if (!existingProjects || existingProjects.length === 0) {
    const { error } = await supabase.from('projects').insert(
      PROJECTS.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        total_value: p.total_value,
        start_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: p.completion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    );
    
    if (error) {
      console.error('Error inserting projects:', error);
      throw error;
    }
  }
  
  console.log('✅ Projects seeded');
}

async function seedVendorDirectory() {
  console.log('🏢 Seeding vendor directory...');
  
  const vendorData = VENDORS.map(v => ({
    id: generateUUID(),
    name: v.name,
    category: v.type,
    tier: v.tier,
    specialties: v.specialties,
    contact_email: `info@${v.name.toLowerCase().replace(/\s+/g, '')}.com`,
    contact_phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    address: `${Math.floor(Math.random() * 9000) + 1000} Business Blvd, Suite ${Math.floor(Math.random() * 900) + 100}`,
    city: ['New York', 'Chicago', 'Los Angeles', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
    state: ['NY', 'IL', 'CA', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
    annual_revenue: v.revenue,
    employee_count: v.employees,
    bonding_capacity: v.bondingCapacity,
    safety_rating: v.safetyRating,
    diversity_certifications: v.diversity || [],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase.from('vendor_directory').insert(vendorData);
  if (error) {
    console.error('Error inserting vendor directory:', error);
    throw error;
  }

  console.log('✅ Vendor directory seeded');
  return vendorData;
}

async function seedRFPManagement(projects: any[]) {
  console.log('📄 Seeding RFP management...');
  
  const rfps = [];
  const currentDate = new Date();

  for (const project of projects) {
    // Create 2-3 RFPs per project
    const numRFPs = 2 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numRFPs; i++) {
      const publishDate = new Date(currentDate.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
      const submissionDeadline = new Date(publishDate.getTime() + (14 + Math.random() * 14) * 24 * 60 * 60 * 1000);
      
      let status = 'draft';
      if (submissionDeadline < currentDate) {
        status = ['evaluation', 'awarded', 'completed'][Math.floor(Math.random() * 3)];
      } else if (publishDate < currentDate) {
        status = 'published';
      }

      const packageTypes = ['Site Work', 'Structure', 'Envelope', 'MEP Systems', 'Interiors', 'Specialty Systems'];
      const packageType = packageTypes[i % packageTypes.length];

      rfps.push({
        id: generateUUID(),
        project_id: project.id,
        rfp_number: `RFP-${project.name.substring(0, 3).toUpperCase()}-${currentDate.getFullYear()}-${String(i + 1).padStart(3, '0')}`,
        title: `${project.name} - ${packageType}`,
        description: `Request for Proposals for ${packageType} work on the ${project.name} project`,
        package_type: packageType,
        estimated_value: Math.round(project.total_value * (0.15 + Math.random() * 0.25)),
        status,
        publish_date: publishDate.toISOString(),
        submission_deadline: submissionDeadline.toISOString(),
        pre_bid_meeting: new Date(publishDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        site_visit_required: Math.random() > 0.3,
        bond_required: Math.random() > 0.2,
        insurance_required: true,
        created_at: publishDate.toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  const { error } = await supabase.from('rfp_management').insert(rfps);
  if (error) {
    console.error('Error inserting RFPs:', error);
    throw error;
  }

  console.log('✅ RFP management seeded');
  return rfps;
}

async function seedBidLeveling(rfps: any[], vendors: any[]) {
  console.log('📊 Seeding bid leveling data...');
  
  const bids = [];
  const bidLineItems = [];
  const levelingAnalysis = [];

  for (const rfp of rfps) {
    if (rfp.status === 'draft') continue;

    // Select 4-7 vendors to bid
    const bidderCount = 4 + Math.floor(Math.random() * 4);
    const selectedVendors = [...vendors].sort(() => Math.random() - 0.5).slice(0, bidderCount);

    const rfpBids = [];
    
    for (const vendor of selectedVendors) {
      const bidId = generateUUID();
      const submissionDate = new Date(new Date(rfp.submission_deadline).getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      // Calculate bid amount based on vendor tier
      let priceMultiplier = 1.0;
      if (vendor.tier === 'tier1') {
        priceMultiplier = 1.05 + Math.random() * 0.1; // Premium pricing
      } else if (vendor.tier === 'tier2') {
        priceMultiplier = 0.95 + Math.random() * 0.15; // Competitive
      } else {
        priceMultiplier = 0.85 + Math.random() * 0.2; // Aggressive
      }

      const basePrice = rfp.estimated_value * priceMultiplier;
      const overhead = basePrice * (0.08 + Math.random() * 0.04);
      const profit = basePrice * (0.03 + Math.random() * 0.05);
      const totalBid = Math.round(basePrice + overhead + profit);

      const bid = {
        id: bidId,
        rfp_id: rfp.id,
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        submission_date: submissionDate.toISOString(),
        base_bid: Math.round(basePrice),
        alternates: Math.round(basePrice * (Math.random() * 0.05)),
        total_bid: totalBid,
        bid_bond_submitted: rfp.bond_required,
        technical_score: 70 + Math.random() * 25,
        commercial_score: 70 + Math.random() * 25,
        safety_score: 85 + Math.random() * 15,
        schedule_days: 180 + Math.floor(Math.random() * 60),
        status: rfp.status === 'evaluation' ? 'under_review' : 'submitted',
        created_at: submissionDate.toISOString(),
        updated_at: new Date().toISOString()
      };

      bids.push(bid);
      rfpBids.push(bid);

      // Create line items for each bid
      const selectedItems = CSI_DIVISIONS.slice(0, 8 + Math.floor(Math.random() * 7));
      
      for (const item of selectedItems) {
        const quantity = Math.round(1000 + Math.random() * 9000);
        const unitPriceVariation = 0.85 + Math.random() * 0.3;
        const unitPrice = item.basePrice * priceMultiplier * unitPriceVariation;
        
        bidLineItems.push({
          id: generateUUID(),
          bid_id: bidId,
          vendor_id: vendor.id,
          csi_code: item.code,
          description: item.description,
          quantity,
          unit: item.unit,
          unit_price: Math.round(unitPrice * 100) / 100,
          total_price: Math.round(quantity * unitPrice),
          category: item.category,
          risk_level: item.riskLevel,
          variance_flag: Math.abs(unitPriceVariation - 1) > 0.2,
          created_at: submissionDate.toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }

    // Create leveling analysis for RFPs in evaluation
    if (rfp.status === 'evaluation' && rfpBids.length > 0) {
      // Sort bids by total price
      const sortedBids = rfpBids.sort((a, b) => a.total_bid - b.total_bid);
      const lowestBid = sortedBids[0].total_bid;
      const averageBid = rfpBids.reduce((sum, bid) => sum + bid.total_bid, 0) / rfpBids.length;

      levelingAnalysis.push({
        id: generateUUID(),
        rfp_id: rfp.id,
        analysis_date: new Date().toISOString(),
        lowest_bid: lowestBid,
        highest_bid: sortedBids[sortedBids.length - 1].total_bid,
        average_bid: Math.round(averageBid),
        standard_deviation: Math.round(Math.sqrt(rfpBids.reduce((sum, bid) => sum + Math.pow(bid.total_bid - averageBid, 2), 0) / rfpBids.length)),
        outlier_count: rfpBids.filter(bid => Math.abs(bid.total_bid - averageBid) > averageBid * 0.15).length,
        recommendation: sortedBids[0].vendor_name,
        notes: `Analysis complete. ${sortedBids[0].vendor_name} offers the best value with strong technical scores.`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  // Insert all bid data
  if (bids.length > 0) {
    const { error: bidError } = await supabase.from('bids').insert(bids);
    if (bidError) {
      console.error('Error inserting bids:', bidError);
      throw bidError;
    }
  }

  if (bidLineItems.length > 0) {
    const { error: lineItemError } = await supabase.from('bid_line_items').insert(bidLineItems);
    if (lineItemError) {
      console.error('Error inserting bid line items:', lineItemError);
      throw lineItemError;
    }
  }

  if (levelingAnalysis.length > 0) {
    const { error: analysisError } = await supabase.from('bid_leveling_analysis').insert(levelingAnalysis);
    if (analysisError) {
      console.error('Error inserting leveling analysis:', analysisError);
      throw analysisError;
    }
  }

  console.log('✅ Bid leveling data seeded');
  return { bids, levelingAnalysis };
}

async function seedAwardCenter(rfps: any[], bids: any[]) {
  console.log('🏆 Seeding award center...');
  
  const awards = [];
  const awardedRFPs = rfps.filter(r => r.status === 'awarded');

  for (const rfp of awardedRFPs) {
    const rfpBids = bids.filter(b => b.rfp_id === rfp.id);
    if (rfpBids.length === 0) continue;

    // Select winning bid (usually lowest, but consider scores)
    const scoredBids = rfpBids.map(bid => ({
      ...bid,
      composite_score: (bid.technical_score * 0.3 + bid.commercial_score * 0.5 + bid.safety_score * 0.2)
    })).sort((a, b) => b.composite_score - a.composite_score);

    const winner = scoredBids[0];
    const awardDate = new Date(new Date(rfp.submission_deadline).getTime() + 21 * 24 * 60 * 60 * 1000);

    awards.push({
      id: generateUUID(),
      rfp_id: rfp.id,
      winning_bid_id: winner.id,
      vendor_id: winner.vendor_id,
      award_date: awardDate.toISOString(),
      contract_value: winner.total_bid,
      contract_number: `CON-${rfp.rfp_number.replace('RFP-', '')}`,
      notice_to_proceed: new Date(awardDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      completion_date: new Date(awardDate.getTime() + winner.schedule_days * 24 * 60 * 60 * 1000).toISOString(),
      performance_bond_received: true,
      insurance_verified: true,
      contract_executed: true,
      status: 'active',
      created_at: awardDate.toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  if (awards.length > 0) {
    const { error } = await supabase.from('awards').insert(awards);
    if (error) {
      console.error('Error inserting awards:', error);
      throw error;
    }
  }

  console.log('✅ Award center seeded');
  return awards;
}

async function seedVendorPrequalification(vendors: any[]) {
  console.log('📋 Seeding vendor prequalification...');
  
  const prequalifications = [];
  const requirements = [];
  const evaluations = [];

  // Create standard prequalification requirements
  const standardRequirements = [
    { category: 'Financial', name: 'Audited Financial Statements', description: 'Last 3 years audited financials', weight: 20 },
    { category: 'Safety', name: 'EMR Rating', description: 'Experience Modification Rate for last 3 years', weight: 15 },
    { category: 'Safety', name: 'OSHA Records', description: 'OSHA 300 logs for last 3 years', weight: 10 },
    { category: 'Insurance', name: 'General Liability', description: 'Minimum $2M per occurrence', weight: 15 },
    { category: 'Insurance', name: 'Workers Compensation', description: 'Current certificate required', weight: 10 },
    { category: 'Experience', name: 'Similar Projects', description: 'List of similar projects in last 5 years', weight: 15 },
    { category: 'References', name: 'Client References', description: 'Minimum 3 client references', weight: 10 },
    { category: 'Certifications', name: 'Business Licenses', description: 'Current business licenses and certifications', weight: 5 }
  ];

  // Insert requirements
  for (const req of standardRequirements) {
    const reqId = generateUUID();
    requirements.push({
      id: reqId,
      ...req,
      required: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Create prequalification records for vendors
  for (const vendor of vendors) {
    const prequalId = generateUUID();
    const submissionDate = randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), new Date());
    
    const prequalification = {
      id: prequalId,
      vendor_id: vendor.id,
      submission_date: submissionDate.toISOString(),
      expiry_date: new Date(submissionDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.1 ? 'approved' : 'pending',
      overall_score: 75 + Math.random() * 20,
      financial_capacity: vendor.bonding_capacity,
      safety_rating: vendor.safety_rating,
      created_at: submissionDate.toISOString(),
      updated_at: new Date().toISOString()
    };

    prequalifications.push(prequalification);

    // Create evaluations for each requirement
    for (const req of requirements) {
      const score = 70 + Math.random() * 25;
      evaluations.push({
        id: generateUUID(),
        prequalification_id: prequalId,
        requirement_id: req.id,
        score: Math.round(score),
        status: score >= 75 ? 'pass' : 'conditional',
        notes: score >= 75 ? 'Meets requirements' : 'Requires additional review',
        evaluated_by: 'system',
        evaluated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  // Insert all prequalification data
  const { error: reqError } = await supabase.from('prequalification_requirements').insert(requirements);
  if (reqError) {
    console.error('Error inserting requirements:', reqError);
    throw reqError;
  }

  const { error: prequalError } = await supabase.from('vendor_prequalifications').insert(prequalifications);
  if (prequalError) {
    console.error('Error inserting prequalifications:', prequalError);
    throw prequalError;
  }

  const { error: evalError } = await supabase.from('prequalification_evaluations').insert(evaluations);
  if (evalError) {
    console.error('Error inserting evaluations:', evalError);
    throw evalError;
  }

  console.log('✅ Vendor prequalification seeded');
}

async function seedLeadTimeTracker(projects: any[], awards: any[]) {
  console.log('📅 Seeding lead time tracker...');
  
  const packages = [];
  const milestones = [];
  const activities = [];

  for (const project of projects) {
    const projectAwards = awards.filter(a => a.rfp_id.includes(project.id));
    if (projectAwards.length === 0) continue;

    // Create packages based on awards
    for (const award of projectAwards) {
      const packageId = generateUUID();
      const startDate = new Date(award.notice_to_proceed);
      const endDate = new Date(award.completion_date);

      packages.push({
        id: packageId,
        project_id: project.id,
        name: award.contract_number.replace('CON-', 'Package '),
        description: `Construction package for contract ${award.contract_number}`,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        duration_days: Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)),
        status: 'in_progress',
        progress: Math.round(Math.random() * 75),
        vendor_id: award.vendor_id,
        contract_value: award.contract_value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Create milestones
      const milestoneNames = [
        'Mobilization Complete',
        'Foundations Complete',
        'Structure Topped Out',
        'Envelope Closed',
        'MEP Rough-In Complete',
        'Finishes 50% Complete',
        'Substantial Completion',
        'Final Completion'
      ];

      const duration = endDate.getTime() - startDate.getTime();
      milestoneNames.forEach((name, index) => {
        const milestoneDate = new Date(startDate.getTime() + (duration * (index + 1) / milestoneNames.length));
        const milestoneId = generateUUID();

        milestones.push({
          id: milestoneId,
          package_id: packageId,
          name,
          target_date: milestoneDate.toISOString(),
          actual_date: milestoneDate < new Date() ? milestoneDate.toISOString() : null,
          status: milestoneDate < new Date() ? 'completed' : 'pending',
          critical_path: index < 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Create activities for each milestone
        const activityCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < activityCount; i++) {
          const activityStart = new Date(milestoneDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          const activityDuration = 7 + Math.floor(Math.random() * 23);

          activities.push({
            id: generateUUID(),
            milestone_id: milestoneId,
            name: `${name} - Activity ${i + 1}`,
            start_date: activityStart.toISOString(),
            end_date: new Date(activityStart.getTime() + activityDuration * 24 * 60 * 60 * 1000).toISOString(),
            duration_days: activityDuration,
            progress: milestoneDate < new Date() ? 100 : Math.round(Math.random() * 80),
            dependencies: i > 0 ? [activities[activities.length - 1].id] : [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });
    }
  }

  // Insert lead time data
  if (packages.length > 0) {
    const { error: pkgError } = await supabase.from('lead_time_packages').insert(packages);
    if (pkgError) {
      console.error('Error inserting packages:', pkgError);
      throw pkgError;
    }
  }

  if (milestones.length > 0) {
    const { error: msError } = await supabase.from('lead_time_milestones').insert(milestones);
    if (msError) {
      console.error('Error inserting milestones:', msError);
      throw msError;
    }
  }

  if (activities.length > 0) {
    const { error: actError } = await supabase.from('lead_time_activities').insert(activities);
    if (actError) {
      console.error('Error inserting activities:', actError);
      throw actError;
    }
  }

  console.log('✅ Lead time tracker seeded');
}

async function seedComplianceCenter(projects: any[]) {
  console.log('⚖️ Seeding compliance center...');
  
  const complianceItems = [];
  const complianceCategories = [
    { name: 'Safety Requirements', items: ['Safety Program', 'OSHA Compliance', 'Site Safety Plan', 'Emergency Response Plan'] },
    { name: 'Environmental', items: ['SWPPP Plan', 'Air Quality Permits', 'Noise Control Plan', 'Waste Management Plan'] },
    { name: 'Labor Compliance', items: ['Certified Payroll', 'Prevailing Wage', 'EEO Requirements', 'Local Hiring'] },
    { name: 'Quality Control', items: ['QC Program', 'Testing Requirements', 'Inspection Schedule', 'Material Certifications'] },
    { name: 'Insurance & Bonds', items: ['Payment Bond', 'Performance Bond', 'GL Insurance', 'Builders Risk'] }
  ];

  for (const project of projects) {
    for (const category of complianceCategories) {
      for (const item of category.items) {
        const dueDate = randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
        const isOverdue = dueDate < new Date();
        
        complianceItems.push({
          id: generateUUID(),
          project_id: project.id,
          category: category.name,
          requirement: item,
          description: `${item} requirements for ${project.name}`,
          due_date: dueDate.toISOString(),
          status: isOverdue ? 'overdue' : (Math.random() > 0.3 ? 'compliant' : 'pending'),
          responsible_party: ['Contractor', 'Owner', 'Architect', 'Engineer'][Math.floor(Math.random() * 4)],
          priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
          documents_required: Math.ceil(Math.random() * 5),
          documents_received: Math.floor(Math.random() * 5),
          notes: Math.random() > 0.5 ? 'Documentation under review' : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
  }

  const { error } = await supabase.from('compliance_items').insert(complianceItems);
  if (error) {
    console.error('Error inserting compliance items:', error);
    throw error;
  }

  console.log('✅ Compliance center seeded');
}

async function seedPerformanceScorecards(vendors: any[], awards: any[]) {
  console.log('📊 Seeding performance scorecards...');
  
  const scorecards = [];
  const metrics = [];

  const metricCategories = [
    { category: 'Schedule', metrics: ['On-Time Start', 'Milestone Achievement', 'Final Completion'] },
    { category: 'Quality', metrics: ['Defect Rate', 'Rework Percentage', 'First-Time Quality'] },
    { category: 'Safety', metrics: ['Incident Rate', 'Near Miss Reports', 'Safety Compliance'] },
    { category: 'Cost', metrics: ['Budget Adherence', 'Change Order Management', 'Cost Predictability'] },
    { category: 'Communication', metrics: ['Response Time', 'Documentation Quality', 'Meeting Attendance'] }
  ];

  for (const award of awards) {
    const vendor = vendors.find(v => v.id === award.vendor_id);
    if (!vendor) continue;

    const scorecardId = generateUUID();
    const evaluationDate = new Date();

    // Calculate overall scores
    const categoryScores = {};
    let totalScore = 0;

    for (const cat of metricCategories) {
      const catScore = 75 + Math.random() * 20;
      categoryScores[cat.category.toLowerCase()] = catScore;
      totalScore += catScore;
    }

    const scorecard = {
      id: scorecardId,
      vendor_id: vendor.id,
      project_id: award.rfp_id.substring(0, 36), // Extract project ID
      contract_id: award.id,
      evaluation_period: 'Q4 2024',
      evaluation_date: evaluationDate.toISOString(),
      overall_score: Math.round(totalScore / metricCategories.length),
      schedule_score: Math.round(categoryScores['schedule']),
      quality_score: Math.round(categoryScores['quality']),
      safety_score: Math.round(categoryScores['safety']),
      cost_score: Math.round(categoryScores['cost']),
      communication_score: Math.round(categoryScores['communication']),
      recommendation: totalScore / metricCategories.length > 85 ? 'highly_recommended' : 'recommended',
      evaluator: 'Project Manager',
      status: 'final',
      created_at: evaluationDate.toISOString(),
      updated_at: evaluationDate.toISOString()
    };

    scorecards.push(scorecard);

    // Create detailed metrics
    for (const cat of metricCategories) {
      for (const metricName of cat.metrics) {
        const score = 70 + Math.random() * 25;
        metrics.push({
          id: generateUUID(),
          scorecard_id: scorecardId,
          category: cat.category,
          metric_name: metricName,
          score: Math.round(score),
          weight: Math.round(100 / cat.metrics.length),
          target: 85,
          actual: Math.round(score * (0.9 + Math.random() * 0.2)),
          notes: score > 85 ? 'Exceeds expectations' : 'Meets expectations',
          created_at: evaluationDate.toISOString(),
          updated_at: evaluationDate.toISOString()
        });
      }
    }
  }

  if (scorecards.length > 0) {
    const { error: scError } = await supabase.from('performance_scorecards').insert(scorecards);
    if (scError) {
      console.error('Error inserting scorecards:', scError);
      throw scError;
    }
  }

  if (metrics.length > 0) {
    const { error: metError } = await supabase.from('scorecard_metrics').insert(metrics);
    if (metError) {
      console.error('Error inserting metrics:', metError);
      throw metError;
    }
  }

  console.log('✅ Performance scorecards seeded');
}

async function seedNotifications(projects: any[]) {
  console.log('🔔 Seeding notifications...');
  
  const notifications = [];
  const notificationTemplates = [
    { type: 'rfp_published', title: 'New RFP Published', priority: 'high', category: 'rfp' },
    { type: 'bid_received', title: 'New Bid Submission', priority: 'medium', category: 'bidding' },
    { type: 'award_issued', title: 'Contract Awarded', priority: 'high', category: 'awards' },
    { type: 'compliance_due', title: 'Compliance Item Due Soon', priority: 'high', category: 'compliance' },
    { type: 'milestone_approaching', title: 'Milestone Deadline Approaching', priority: 'medium', category: 'schedule' },
    { type: 'document_uploaded', title: 'New Document Available', priority: 'low', category: 'documents' },
    { type: 'scorecard_complete', title: 'Performance Evaluation Complete', priority: 'medium', category: 'performance' }
  ];

  for (const project of projects) {
    // Create 3-8 notifications per project
    const notificationCount = 3 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < notificationCount; i++) {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const createdDate = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
      
      notifications.push({
        id: generateUUID(),
        project_id: project.id,
        type: template.type,
        title: template.title,
        message: `${template.title} for ${project.name}`,
        priority: template.priority,
        category: template.category,
        read: Math.random() > 0.3,
        action_url: `/projects/${project.id}/${template.category}`,
        created_at: createdDate.toISOString(),
        updated_at: createdDate.toISOString()
      });
    }
  }

  const { error } = await supabase.from('notifications').insert(notifications);
  if (error) {
    console.error('Error inserting notifications:', error);
    throw error;
  }

  console.log('✅ Notifications seeded');
}

async function seedCommunicationLogs(projects: any[], vendors: any[]) {
  console.log('💬 Seeding communication logs...');
  
  const logs = [];
  const logTypes = ['email', 'phone', 'meeting', 'site_visit', 'document'];
  const subjects = [
    'Schedule Update',
    'RFI Response',
    'Change Order Discussion',
    'Safety Incident Review',
    'Progress Meeting',
    'Budget Review',
    'Quality Control Issue',
    'Contract Clarification'
  ];

  for (const project of projects) {
    // Create 10-20 communication logs per project
    const logCount = 10 + Math.floor(Math.random() * 11);
    
    for (let i = 0; i < logCount; i++) {
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const logDate = randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date());
      
      logs.push({
        id: generateUUID(),
        project_id: project.id,
        type: logTypes[Math.floor(Math.random() * logTypes.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        participants: [
          'Project Manager',
          vendor.name,
          Math.random() > 0.5 ? 'Architect' : 'Engineer'
        ],
        summary: 'Discussed project progress and upcoming milestones. Action items assigned.',
        action_items: Math.random() > 0.5 ? ['Follow up on RFI', 'Update schedule', 'Submit documentation'] : [],
        attachments: Math.random() > 0.5 ? ['meeting_minutes.pdf', 'updated_schedule.xlsx'] : [],
        created_by: 'Project Manager',
        created_at: logDate.toISOString(),
        updated_at: logDate.toISOString()
      });
    }
  }

  const { error } = await supabase.from('communication_logs').insert(logs);
  if (error) {
    console.error('Error inserting communication logs:', error);
    throw error;
  }

  console.log('✅ Communication logs seeded');
}

async function generateSummaryReport() {
  console.log('\n📊 Generating summary report...');
  
  // Fetch counts from all tables
  const tables = [
    'projects',
    'vendor_directory',
    'rfp_management',
    'bids',
    'bid_line_items',
    'awards',
    'vendor_prequalifications',
    'lead_time_packages',
    'compliance_items',
    'performance_scorecards',
    'notifications',
    'communication_logs'
  ];

  console.log('\n✅ Database Seeding Complete!\n');
  console.log('Summary of seeded data:');
  console.log('=' .repeat(50));

  for (const table of tables) {
    try {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      console.log(`${table.padEnd(30, '.')}: ${count || 0} records`);
    } catch (error) {
      console.log(`${table.padEnd(30, '.')}: No data`);
    }
  }

  console.log('=' .repeat(50));
  console.log('\nThe procurement system is now fully populated with realistic data!');
  console.log('You can now test all modules with comprehensive sample data.\n');
}

// Main seeding function
async function seedFullProcurementData() {
  try {
    console.log('🚀 Starting comprehensive procurement data seeding...\n');
    
    // Clean existing data
    await cleanExistingData();
    
    // Seed in proper order
    await seedProjects();
    const vendors = await seedVendorDirectory();
    const rfps = await seedRFPManagement(PROJECTS);
    const { bids } = await seedBidLeveling(rfps, vendors);
    const awards = await seedAwardCenter(rfps, bids);
    
    // Seed additional modules
    await seedVendorPrequalification(vendors);
    await seedLeadTimeTracker(PROJECTS, awards);
    await seedComplianceCenter(PROJECTS);
    await seedPerformanceScorecards(vendors, awards);
    await seedNotifications(PROJECTS);
    await seedCommunicationLogs(PROJECTS, vendors);
    
    // Generate summary report
    await generateSummaryReport();
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedFullProcurementData();
