import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Helper function to generate UUIDs
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🚀 Starting comprehensive procurement data seeding...');

    // Construction company data with realistic details
    const CONSTRUCTION_COMPANIES = [
      { 
        name: "Turner Construction Company", 
        tier: "tier1", 
        reputation: "excellent",
        headquarters: "New York, NY",
        revenue: 14800000000,
        founded: 1902,
        specialties: ["Commercial", "Healthcare", "Education"],
        bondingCapacity: 2000000000,
        safetyRating: "EMR 0.52"
      },
      { 
        name: "Skanska USA Building", 
        tier: "tier1", 
        reputation: "excellent",
        headquarters: "Parsippany, NJ", 
        revenue: 6700000000,
        founded: 1971,
        specialties: ["Infrastructure", "Commercial", "Residential"],
        bondingCapacity: 1500000000,
        safetyRating: "EMR 0.48"
      },
      { 
        name: "Suffolk Construction", 
        tier: "tier1", 
        reputation: "excellent",
        headquarters: "Boston, MA",
        revenue: 4200000000,
        founded: 1982,
        specialties: ["Healthcare", "Life Sciences", "Education"],
        bondingCapacity: 1000000000,
        safetyRating: "EMR 0.61"
      },
      { 
        name: "McCarthy Building Companies", 
        tier: "tier1", 
        reputation: "excellent",
        headquarters: "St. Louis, MO",
        revenue: 4800000000,
        founded: 1864,
        specialties: ["Healthcare", "Education", "Commercial"],
        bondingCapacity: 1200000000,
        safetyRating: "EMR 0.55"
      },
      { 
        name: "Clark Construction Group", 
        tier: "tier1", 
        reputation: "excellent",
        headquarters: "Bethesda, MD",
        revenue: 5100000000,
        founded: 1906,
        specialties: ["Government", "Commercial", "Sports"],
        bondingCapacity: 1300000000,
        safetyRating: "EMR 0.58"
      },
      { 
        name: "Hensel Phelps Construction", 
        tier: "tier2", 
        reputation: "good",
        headquarters: "Greeley, CO",
        revenue: 4600000000,
        founded: 1937,
        specialties: ["Government", "Aviation", "Healthcare"],
        bondingCapacity: 900000000,
        safetyRating: "EMR 0.72"
      },
      { 
        name: "DPR Construction", 
        tier: "tier2", 
        reputation: "good",
        headquarters: "Redwood City, CA",
        revenue: 4100000000,
        founded: 1990,
        specialties: ["Life Sciences", "Healthcare", "Higher Education"],
        bondingCapacity: 800000000,
        safetyRating: "EMR 0.64"
      },
      { 
        name: "Mortenson Construction", 
        tier: "tier2", 
        reputation: "good",
        headquarters: "Minneapolis, MN",
        revenue: 3800000000,
        founded: 1954,
        specialties: ["Sports", "Healthcare", "Renewable Energy"],
        bondingCapacity: 750000000,
        safetyRating: "EMR 0.69"
      },
      { 
        name: "Brasfield & Gorrie", 
        tier: "tier2", 
        reputation: "good",
        headquarters: "Birmingham, AL",
        revenue: 3200000000,
        founded: 1964,
        specialties: ["Healthcare", "Education", "Commercial"],
        bondingCapacity: 650000000,
        safetyRating: "EMR 0.75"
      },
      { 
        name: "JE Dunn Construction", 
        tier: "tier2", 
        reputation: "good",
        headquarters: "Kansas City, MO",
        revenue: 3500000000,
        founded: 1924,
        specialties: ["Healthcare", "Education", "Sports"],
        bondingCapacity: 700000000,
        safetyRating: "EMR 0.71"
      }
    ];

    // Enhanced CSI line items with more detail
    const CSI_LINE_ITEMS = [
      { 
        csi: "03300", 
        description: "Cast-in-Place Concrete", 
        basePrice: 2850000, 
        variability: 0.22, 
        unit: "CY",
        category: "Structural",
        criticalPath: true,
        riskLevel: "Medium",
        specification: "4000 PSI concrete with specified admixtures"
      },
      { 
        csi: "05100", 
        description: "Structural Metal Framing", 
        basePrice: 3250000, 
        variability: 0.22, 
        unit: "LB",
        category: "Structural", 
        criticalPath: true,
        riskLevel: "High",
        specification: "ASTM A992 Grade 50 steel with shop applied primer"
      },
      { 
        csi: "08400", 
        description: "Entrances, Storefronts, and Curtain Walls", 
        basePrice: 1850000, 
        variability: 0.25, 
        unit: "SF",
        category: "Envelope",
        criticalPath: false,
        riskLevel: "Medium",
        specification: "Thermally broken aluminum with high-performance glazing"
      },
      { 
        csi: "09200", 
        description: "Plaster and Gypsum Board", 
        basePrice: 1450000, 
        variability: 0.18, 
        unit: "SF",
        category: "Interior",
        criticalPath: false,
        riskLevel: "Low",
        specification: "Level 4 finish on 5/8\" Type X gypsum board"
      },
      { 
        csi: "23100", 
        description: "HVAC Ducts and Casings", 
        basePrice: 1650000, 
        variability: 0.22, 
        unit: "LB",
        category: "Mechanical",
        criticalPath: true,
        riskLevel: "Medium",
        specification: "Galvanized steel ductwork with thermal insulation"
      },
      { 
        csi: "26400", 
        description: "Low-Voltage Distribution", 
        basePrice: 1850000, 
        variability: 0.22, 
        unit: "LF",
        category: "Electrical",
        criticalPath: false,
        riskLevel: "Medium",
        specification: "600V copper conductors in EMT conduit systems"
      },
      { 
        csi: "33100", 
        description: "Water Utilities", 
        basePrice: 1450000, 
        variability: 0.28, 
        unit: "LF",
        category: "Utilities",
        criticalPath: true,
        riskLevel: "High",
        specification: "Ductile iron water mains with restrained joints"
      },
      { 
        csi: "A1000", 
        description: "General Conditions Allowance", 
        basePrice: 450000, 
        variability: 0.10, 
        unit: "LS", 
        isAllowance: true,
        category: "Allowance",
        criticalPath: false,
        riskLevel: "Low",
        specification: "Project management and supervision costs"
      },
      { 
        csi: "A7000", 
        description: "Owner Contingency", 
        basePrice: 750000, 
        variability: 0.05, 
        unit: "LS", 
        isAllowance: true,
        category: "Allowance",
        criticalPath: false,
        riskLevel: "Low",
        specification: "Owner-controlled contingency for design changes"
      },
      {
        csi: "07200",
        description: "Thermal Protection",
        basePrice: 985000,
        variability: 0.15,
        unit: "SF",
        category: "Envelope",
        criticalPath: false,
        riskLevel: "Low",
        specification: "Rigid foam insulation with vapor barrier"
      },
      {
        csi: "09900",
        description: "Paints and Coatings",
        basePrice: 425000,
        variability: 0.20,
        unit: "SF",
        category: "Finishes",
        criticalPath: false,
        riskLevel: "Low",
        specification: "Low-VOC architectural paint systems"
      },
      {
        csi: "11000",
        description: "Equipment",
        basePrice: 2200000,
        variability: 0.30,
        unit: "LS",
        category: "Equipment",
        criticalPath: false,
        riskLevel: "High",
        specification: "Specialized equipment per owner requirements"
      }
    ];

    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    const tables = ['awards', 'bafo_requests', 'scorecards', 'leveling', 'leveling_snapshot', 'bid_line_items', 'submissions', 'bids', 'bid_events'];
    
    for (const table of tables) {
      try {
        await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (error) {
        console.log(`Table ${table} might not exist or already clean`);
      }
    }

    // Generate realistic project data
    console.log('📋 Generating comprehensive project data...');
    const currentDate = new Date();
    const projects = [];

    const projectTypes = [
      { type: "Healthcare Facility", size: "Large", complexity: "High", budget: [80000000, 150000000] },
      { type: "Office Tower", size: "Medium", complexity: "Medium", budget: [60000000, 120000000] },
      { type: "Educational Complex", size: "Large", complexity: "High", budget: [90000000, 160000000] },
      { type: "Mixed-Use Development", size: "Large", complexity: "High", budget: [100000000, 200000000] },
      { type: "Government Building", size: "Medium", complexity: "Medium", budget: [70000000, 130000000] },
      { type: "Sports & Recreation Center", size: "Medium", complexity: "Medium", budget: [50000000, 100000000] },
      { type: "Residential High-Rise", size: "Large", complexity: "High", budget: [80000000, 140000000] },
      { type: "Industrial Warehouse", size: "Medium", complexity: "Low", budget: [30000000, 80000000] }
    ];

    const locations = ["Downtown", "Midtown", "Uptown", "Waterfront", "Suburban", "Airport District"];

    // Create 8 comprehensive projects in different stages
    for (let i = 0; i < 8; i++) {
      const projectType = projectTypes[i];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      const publishedDate = new Date(currentDate.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
      const submissionDeadline = new Date(publishedDate.getTime() + (21 + Math.random() * 14) * 24 * 60 * 60 * 1000);
      const evaluationStart = new Date(submissionDeadline.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      // Determine project status based on timeline
      let status;
      if (currentDate < submissionDeadline) {
        status = 'open';
      } else if (currentDate < evaluationStart) {
        status = Math.random() > 0.3 ? 'evaluation' : 'open';
      } else {
        const statusOptions = ['evaluation', 'leveling_complete', 'bafo_requested', 'awarded'];
        status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      }

      const budgetRange = projectType.budget;
      const estimatedValue = Math.round((budgetRange[0] + Math.random() * (budgetRange[1] - budgetRange[0])) / 1000000) * 1000000;

      projects.push({
        id: generateUUID(),
        title: `${projectType.size} ${location} ${projectType.type}`,
        description: `Construction of a state-of-the-art ${projectType.type.toLowerCase()} in the ${location.toLowerCase()} area featuring advanced building systems and sustainable design.`,
        rfp_number: `RFP-${currentDate.getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        bid_type: 'lump_sum',
        estimated_value: estimatedValue,
        currency: 'USD',
        status: status,
        published_at: publishedDate.toISOString(),
        submission_deadline: submissionDeadline.toISOString(),
        evaluation_start: status !== 'open' ? evaluationStart.toISOString() : null,
        bond_required: Math.random() > 0.2,
        bond_percentage: Math.random() > 0.2 ? 10 : null,
        insurance_required: true,
        prequalification_required: projectType.complexity === 'High',
        technical_weight: 30 + Math.floor(Math.random() * 20),
        commercial_weight: 50 + Math.floor(Math.random() * 20),
        created_by: '00000000-0000-0000-0000-000000000000',
        created_at: publishedDate.toISOString(),
        updated_at: new Date().toISOString(),
        complexity: projectType.complexity,
        projectType: projectType.type
      });
    }

    // Insert projects
    const { error: projectError } = await supabase.from('bids').insert(projects);
    if (projectError) {
      console.error('Error inserting projects:', projectError);
      throw projectError;
    }

    console.log('🏢 Generating vendor submissions...');
    const submissions = [];
    const allLineItems = [];
    const levelingRecords = [];
    const scorecards = [];
    const bafoRequests = [];
    const awards = [];
    const bidEvents = [];

    // Generate comprehensive submissions for each project
    for (const project of projects) {
      const numSubmissions = 4 + Math.floor(Math.random() * 4); // 4-7 vendors per project
      const selectedVendors = CONSTRUCTION_COMPANIES
        .sort(() => Math.random() - 0.5)
        .slice(0, numSubmissions);

      const projectSubmissions = [];

      selectedVendors.forEach((vendor, vendorIndex) => {
        const submissionDate = new Date(
          new Date(project.submission_deadline).getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000
        );

        // Price multiplier based on vendor tier and project complexity
        let priceMultiplier = 1.0;
        if (vendor.tier === 'tier1') {
          priceMultiplier = 1.05 + Math.random() * 0.1; // Premium pricing
        } else if (vendor.tier === 'tier2') {
          priceMultiplier = 0.95 + Math.random() * 0.15; // Competitive pricing
        }

        // Adjust for project complexity
        if (project.complexity === 'High') {
          priceMultiplier *= 1.02 + Math.random() * 0.08;
        } else if (project.complexity === 'Low') {
          priceMultiplier *= 0.95 + Math.random() * 0.05;
        }

        const basePrice = Math.round(project.estimated_value * priceMultiplier);
        const contingency = Math.round(basePrice * (0.03 + Math.random() * 0.07));
        const totalPrice = basePrice + contingency;

        // Submission status based on project status
        let submissionStatus = 'submitted';
        if (project.status === 'evaluation' || project.status === 'leveling_complete') {
          submissionStatus = Math.random() > 0.2 ? 'under_review' : 'submitted';
        } else if (project.status === 'bafo_requested') {
          submissionStatus = Math.random() > 0.5 ? 'shortlisted' : 'under_review';
        } else if (project.status === 'awarded') {
          submissionStatus = vendorIndex === 0 ? 'shortlisted' : 'rejected'; // First vendor wins
        }

        const submission = {
          id: generateUUID(),
          bid_id: project.id,
          vendor_id: generateUUID(),
          vendor_name: vendor.name,
          vendor_contact_email: `estimating@${vendor.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
          vendor_contact_phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          status: submissionStatus,
          submitted_at: submissionDate.toISOString(),
          technical_proposal_url: `https://storage.example.com/proposals/${project.rfp_number}/${vendor.name.replace(/\s+/g, '-')}-technical.pdf`,
          commercial_proposal_url: `https://storage.example.com/proposals/${project.rfp_number}/${vendor.name.replace(/\s+/g, '-')}-commercial.pdf`,
          base_price: basePrice,
          contingency_amount: contingency,
          total_price: totalPrice,
          price_sealed: project.status === 'open',
          bond_submitted: project.bond_required,
          insurance_submitted: project.insurance_required,
          prequalification_passed: project.prequalification_required ? Math.random() > 0.15 : null,
          received_by: '00000000-0000-0000-0000-000000000000',
          opened_by: project.status !== 'open' ? '00000000-0000-0000-0000-000000000000' : null,
          opened_at: project.status !== 'open' ? project.evaluation_start : null,
          created_at: submissionDate.toISOString(),
          updated_at: submissionDate.toISOString(),
          vendor_tier: vendor.tier,
          vendor_revenue: vendor.revenue,
          vendor_specialties: vendor.specialties,
          vendor_safety_rating: vendor.safetyRating
        };

        submissions.push(submission);
        projectSubmissions.push(submission);

        // Generate detailed line items for each submission
        CSI_LINE_ITEMS.forEach((item, itemIndex) => {
          let priceVariation = 1.0;

          // Vendor-specific pricing strategies
          if (vendor.name.includes('Turner') || vendor.name.includes('Skanska')) {
            priceVariation = 0.95 + Math.random() * 0.1; // Conservative estimates
          } else if (vendor.name.includes('Suffolk') || vendor.name.includes('DPR')) {
            priceVariation = 0.90 + Math.random() * 0.15; // Competitive pricing
          } else {
            priceVariation = 0.85 + Math.random() * 0.25; // More variation
          }

          // Item-specific variation
          priceVariation *= (1 + (Math.random() - 0.5) * item.variability);

          // Create outliers (8% chance)
          if (Math.random() < 0.08) {
            priceVariation *= Math.random() < 0.5 ? 0.6 : 1.7;
          }

          const quantity = Math.round(100 + Math.random() * 1400);
          const unitPrice = Math.round(item.basePrice * priceVariation / quantity * 100) / 100;
          const extended = Math.round(unitPrice * quantity);

          allLineItems.push({
            id: generateUUID(),
            submission_id: submission.id,
            vendor_name: vendor.name,
            csi_code: item.csi,
            description: item.description,
            qty: quantity,
            uom: item.unit,
            unit_price: unitPrice,
            extended: extended,
            is_allowance: item.isAllowance || false,
            is_alternate: Math.random() < 0.05,
            confidence_score: 0.85 + Math.random() * 0.15,
            extracted_at: submissionDate.toISOString(),
            extraction_method: Math.random() > 0.7 ? 'ai' : 'manual',
            notes: Math.random() > 0.8 ? 'Vendor provided detailed breakdown' : null,
            created_at: submissionDate.toISOString(),
            updated_at: submissionDate.toISOString(),
            category: item.category,
            critical_path: item.criticalPath,
            risk_level: item.riskLevel,
            specification: item.specification
          });
        });

        // Generate leveling data for projects in evaluation or later
        if (project.status === 'evaluation' || project.status === 'leveling_complete' || project.status === 'bafo_requested' || project.status === 'awarded') {
          const levelingDate = new Date(project.evaluation_start || project.submission_deadline);
          levelingDate.setDate(levelingDate.getDate() + Math.floor(Math.random() * 7));

          // Leveling adjustments based on vendor and project
          const scopeClarifications = [];
          const priceAdjustments = [];
          const technicalAdjustments = [];

          // Generate realistic adjustments
          if (Math.random() > 0.6) {
            scopeClarifications.push({
              item: "Site preparation requirements",
              clarification: "Vendor included additional excavation not specified",
              impact: "cost_decrease"
            });
          }

          if (Math.random() > 0.7) {
            priceAdjustments.push({
              category: "Labor escalation",
              original_amount: Math.round(basePrice * 0.15),
              adjusted_amount: Math.round(basePrice * 0.12),
              reason: "Updated wage rates per local agreement"
            });
          }

          const leveledBasePrice = basePrice - Math.round(basePrice * (Math.random() * 0.05));
          const leveledTotalPrice = leveledBasePrice + contingency;

          levelingRecords.push({
            id: generateUUID(),
            bid_id: project.id,
            submission_id: submission.id,
            scope_clarifications: scopeClarifications,
            price_adjustments: priceAdjustments,
            technical_adjustments: technicalAdjustments,
            leveled_base_price: leveledBasePrice,
            leveled_total_price: leveledTotalPrice,
            adjustment_rationale: "Normalized for scope clarifications and current market conditions",
            is_complete: project.status !== 'evaluation',
            leveled_by: '00000000-0000-0000-0000-000000000000',
            leveled_at: project.status !== 'evaluation' ? levelingDate.toISOString() : null,
            recommended_for_shortlist: vendorIndex < 3, // Top 3 vendors recommended
            recommendation_notes: vendorIndex < 3 ? "Strong technical capability and competitive pricing" : "Higher pricing, limited local experience",
            created_at: levelingDate.toISOString(),
            updated_at: levelingDate.toISOString()
          });
        }

        // Generate scorecards for reviewed submissions
        if (project.status === 'leveling_complete' || project.status === 'bafo_requested' || project.status === 'awarded') {
          const evaluationDate = new Date(project.evaluation_start || project.submission_deadline);
          evaluationDate.setDate(evaluationDate.getDate() + Math.floor(Math.random() * 10) + 3);

          // Technical scoring based on vendor tier
          const baseTechnicalScore = vendor.tier === 'tier1' ? 85 : vendor.tier === 'tier2' ? 75 : 65;
          const technicalVariance = 5 + Math.random() * 10;
          const technicalScore = Math.min(100, baseTechnicalScore + (Math.random() - 0.5) * technicalVariance);

          // Commercial scoring (price-based)
          const submissions_for_project = projectSubmissions;
          const lowestPrice = Math.min(...submissions_for_project.map(s => s.total_price));
          const commercialScore = Math.max(60, Math.min(100, (lowestPrice / totalPrice) * 100));

          const weightedTechnical = (technicalScore * project.technical_weight) / 100;
          const weightedCommercial = (commercialScore * project.commercial_weight) / 100;
          const compositeScore = weightedTechnical + weightedCommercial;

          scorecards.push({
            id: generateUUID(),
            bid_id: project.id,
            submission_id: submission.id,
            evaluator_id: '00000000-0000-0000-0000-000000000000',
            evaluation_phase: 'combined',
            technical_scores: {
              "team_qualifications": Math.round(technicalScore * 0.25),
              "project_approach": Math.round(technicalScore * 0.25),
              "past_performance": Math.round(technicalScore * 0.20),
              "schedule_feasibility": Math.round(technicalScore * 0.15),
              "innovation": Math.round(technicalScore * 0.15)
            },
            technical_total: Math.round(technicalScore),
            technical_max_possible: 100,
            technical_percentage: Math.round(technicalScore),
            commercial_scores: {
              "base_price": Math.round(commercialScore * 0.60),
              "value_engineering": Math.round(commercialScore * 0.25),
              "payment_terms": Math.round(commercialScore * 0.15)
            },
            commercial_total: Math.round(commercialScore),
            commercial_max_possible: 100,
            commercial_percentage: Math.round(commercialScore),
            weighted_technical_score: Math.round(weightedTechnical * 100) / 100,
            weighted_commercial_score: Math.round(weightedCommercial * 100) / 100,
            composite_score: Math.round(compositeScore * 100) / 100,
            strengths: vendor.tier === 'tier1' ? 
              ["Extensive relevant experience", "Strong safety record", "Proven delivery capability"] :
              ["Competitive pricing", "Local presence", "Specialized expertise"],
            weaknesses: vendor.tier === 'tier1' ? 
              ["Premium pricing", "Limited availability"] :
              ["Limited large project experience", "Resource constraints"],
            recommendations: vendorIndex < 2 ? "Recommend for shortlist" : "Consider as alternate",
            is_complete: true,
            submitted_at: evaluationDate.toISOString(),
            created_at: evaluationDate.toISOString(),
            updated_at: evaluationDate.toISOString()
          });
        }

        // Generate BAFO requests for shortlisted vendors
        if (project.status === 'bafo_requested' && vendorIndex < 2) {
          const bafoDate = new Date(project.evaluation_start || project.submission_deadline);
          bafoDate.setDate(bafoDate.getDate() + 14);
          
          const responseDeadline = new Date(bafoDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          const targetReduction = Math.round(totalPrice * (0.02 + Math.random() * 0.05));

          bafoRequests.push({
            id: generateUUID(),
            bid_id: project.id,
            submission_id: submission.id,
            request_letter: `Dear ${vendor.name},\n\nBased on our evaluation of your proposal for ${project.title}, we invite you to submit a Best and Final Offer (BAFO). Please review the attached scope clarifications and provide your final pricing.\n\nTarget Value: $${(totalPrice - targetReduction).toLocaleString()}\n\nThank you for your continued interest in this project.`,
            specific_requirements: "Address scope clarifications in Addendum #3, provide value engineering options, confirm final pricing and schedule",
            price_reduction_target: targetReduction,
            requested_at: bafoDate.toISOString(),
            response_deadline: responseDeadline.toISOString(),
            vendor_response: Math.random() > 0.3 ? 
              `Thank you for the opportunity to submit our BAFO. We have reviewed the clarifications and can provide the requested value while maintaining our quality standards.` : null,
            revised_price: Math.random() > 0.3 ? totalPrice - Math.round(targetReduction * (0.7 + Math.random() * 0.3)) : null,
            responded_at: Math.random() > 0.3 ? new Date(responseDeadline.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : null,
            requested_by: '00000000-0000-0000-0000-000000000000',
            reviewed_by: '00000000-0000-0000-0000-000000000000',
            approved: Math.random() > 0.2,
            created_at: bafoDate.toISOString(),
            updated_at: bafoDate.toISOString()
          });
        }
      });

      // Generate award for awarded projects
      if (project.status === 'awarded') {
        const winningSubmission = projectSubmissions[0]; // First vendor wins
        const awardDate = new Date(project.evaluation_start || project.submission_deadline);
        awardDate.setDate(awardDate.getDate() + 21);

        const contractNumber = `CNT-${project.rfp_number.split('-')[1]}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
        const contractStart = new Date(awardDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const contractEnd = new Date(contractStart.getTime() + (12 + Math.random() * 24) * 30 * 24 * 60 * 60 * 1000);

        awards.push({
          id: generateUUID(),
          bid_id: project.id,
          winning_submission_id: winningSubmission.id,
          award_amount: winningSubmission.total_price,
          award_justification: `${winningSubmission.vendor_name} selected based on superior technical proposal, competitive pricing, and proven track record on similar projects. Final score: ${Math.round(85 + Math.random() * 10)}/100.`,
          contract_duration_months: Math.round((contractEnd.getTime() - contractStart.getTime()) / (30 * 24 * 60 * 60 * 1000)),
          status: 'awarded',
          recommended_by: '00000000-0000-0000-0000-000000000000',
          approved_by: '00000000-0000-0000-0000-000000000000',
          awarded_at: awardDate.toISOString(),
          contract_number: contractNumber,
          contract_start_date: contractStart.toISOString().split('T')[0],
          contract_end_date: contractEnd.toISOString().split('T')[0],
          performance_bond_required: project.estimated_value > 50000000,
          vendor_accepted: Math.random() > 0.1,
          vendor_acceptance_date: Math.random() > 0.1 ? 
            new Date(awardDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
          vendor_decline_reason: Math.random() < 0.1 ? "Unable to meet required schedule due to resource conflicts" : null,
          created_at: awardDate.toISOString(),
          updated_at: awardDate.toISOString()
        });
      }

      // Generate comprehensive bid events for audit trail
      const events = [
        {
          event_type: 'bid.created',
          description: 'RFP created and configured',
          occurred_at: project.created_at
        },
        {
          event_type: 'bid.published',
          description: 'RFP published and opened for submissions',
          occurred_at: project.published_at
        }
      ];

      // Add submission events
      projectSubmissions.forEach(sub => {
        events.push({
          event_type: 'submission.received',
          description: `Bid submission received from ${sub.vendor_name}`,
          submission_id: sub.id,
          occurred_at: sub.submitted_at,
          event_data: {
            vendor_name: sub.vendor_name,
            total_price: sub.total_price
          }
        });
      });

      // Add evaluation events
      if (project.status !== 'open') {
        events.push({
          event_type: 'bid.evaluation.started',
          description: 'Bid evaluation phase initiated',
          occurred_at: project.evaluation_start || project.submission_deadline
        });
      }

      if (project.status === 'leveling_complete' || project.status === 'bafo_requested' || project.status === 'awarded') {
        events.push({
          event_type: 'bid.leveling.completed',
          description: 'Bid leveling and analysis completed',
          occurred_at: new Date(new Date(project.evaluation_start || project.submission_deadline).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      if (project.status === 'awarded') {
        events.push({
          event_type: 'bid.award.issued',
          description: `Contract awarded to ${projectSubmissions[0].vendor_name}`,
          submission_id: projectSubmissions[0].id,
          occurred_at: awards[awards.length - 1]?.awarded_at || new Date().toISOString(),
          event_data: {
            vendor_name: projectSubmissions[0].vendor_name,
            award_amount: projectSubmissions[0].total_price,
            contract_number: awards[awards.length - 1]?.contract_number
          }
        });
      }

      // Add all events for this project
      events.forEach(event => {
        bidEvents.push({
          id: generateUUID(),
          bid_id: project.id,
          submission_id: event.submission_id || null,
          event_type: event.event_type,
          event_data: event.event_data || {},
          description: event.description,
          triggered_by: '00000000-0000-0000-0000-000000000000',
          actor_role: 'BID_ADMIN',
          occurred_at: event.occurred_at,
          ip_address: '127.0.0.1',
          user_agent: 'Owners Cockpit Platform',
          created_at: event.occurred_at
        });
      });
    }

    // Insert all data
    console.log('💾 Inserting comprehensive data...');
    
    console.log(`Inserting ${submissions.length} submissions...`);
    const { error: submissionError } = await supabase.from('submissions').insert(submissions);
    if (submissionError) {
      console.error('Error inserting submissions:', submissionError);
      throw submissionError;
    }

    console.log(`Inserting ${allLineItems.length} line items...`);
    const { error: lineItemError } = await supabase.from('bid_line_items').insert(allLineItems);
    if (lineItemError) {
      console.error('Error inserting line items:', lineItemError);
      throw lineItemError;
    }

    if (levelingRecords.length > 0) {
      console.log(`Inserting ${levelingRecords.length} leveling records...`);
      const { error: levelingError } = await supabase.from('leveling').insert(levelingRecords);
      if (levelingError) {
        console.error('Error inserting leveling records:', levelingError);
        throw levelingError;
      }
    }

    if (scorecards.length > 0) {
      console.log(`Inserting ${scorecards.length} scorecards...`);
      const { error: scorecardError } = await supabase.from('scorecards').insert(scorecards);
      if (scorecardError) {
        console.error('Error inserting scorecards:', scorecardError);
        throw scorecardError;
      }
    }

    if (bafoRequests.length > 0) {
      console.log(`Inserting ${bafoRequests.length} BAFO requests...`);
      const { error: bafoError } = await supabase.from('bafo_requests').insert(bafoRequests);
      if (bafoError) {
        console.error('Error inserting BAFO requests:', bafoError);
        throw bafoError;
      }
    }

    if (awards.length > 0) {
      console.log(`Inserting ${awards.length} awards...`);
      const { error: awardError } = await supabase.from('awards').insert(awards);
      if (awardError) {
        console.error('Error inserting awards:', awardError);
        throw awardError;
      }
    }

    console.log(`Inserting ${bidEvents.length} bid events...`);
    const { error: eventError } = await supabase.from('bid_events').insert(bidEvents);
    if (eventError) {
      console.error('Error inserting bid events:', eventError);
      throw eventError;
    }

    // Generate comprehensive leveling snapshots
    console.log('🔍 Generating comprehensive leveling snapshots...');
    const levelingSnapshots = [];

    for (const project of projects.filter(p => p.status === 'evaluation' || p.status === 'leveling_complete' || p.status === 'bafo_requested' || p.status === 'awarded')) {
      const projectSubmissions = submissions.filter(s => s.bid_id === project.id);
      const projectLineItems = allLineItems.filter(item => 
        projectSubmissions.some(sub => sub.id === item.submission_id)
      );

      // Group line items by CSI code for matrix analysis
      const groupedItems = new Map();
      projectLineItems.forEach(item => {
        const key = `${item.csi_code}-${item.description}`;
        if (!groupedItems.has(key)) {
          groupedItems.set(key, []);
        }
        groupedItems.get(key).push(item);
      });

      const matrixData = [];
      let totalOutliers = 0;
      const outliersByGroup = {};
      const severityLevels = { mild: 0, moderate: 0, severe: 0 };

      groupedItems.forEach((items, groupKey) => {
        const [csiCode, description] = groupKey.split('-', 2);
        const extendedPrices = items.map(item => item.extended).filter(price => price > 0);

        if (extendedPrices.length < 2) return;

        // Statistical analysis
        const sorted = extendedPrices.sort((a, b) => a - b);
        const mean = sorted.reduce((sum, val) => sum + val, 0) / sorted.length;
        const median = sorted[Math.floor(sorted.length / 2)];
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const std = Math.sqrt(sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sorted.length);

        // Outlier detection
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const severeLowerBound = q1 - 3.0 * iqr;
        const severeUpperBound = q3 + 3.0 * iqr;

        const vendors = items.map(item => {
          let isOutlier = false;
          let outlierType = null;
          let outlierSeverity = null;

          if (item.extended < lowerBound || item.extended > upperBound) {
            isOutlier = true;
            outlierType = item.extended < lowerBound ? 'low' : 'high';

            if (item.extended < severeLowerBound || item.extended > severeUpperBound) {
              outlierSeverity = 'severe';
            } else {
              const zScore = Math.abs((item.extended - mean) / std);
              outlierSeverity = zScore > 2.5 ? 'moderate' : 'mild';
            }

            totalOutliers++;
            severityLevels[outlierSeverity]++;
          }

          const deviationFromMedian = ((item.extended - median) / median) * 100;
          const percentileRank = (sorted.filter(price => price <= item.extended).length / sorted.length) * 100;

          return {
            submissionId: item.submission_id,
            vendorName: item.vendor_name,
            quantity: item.qty,
            unitOfMeasure: item.uom,
            unitPrice: item.unit_price,
            extended: item.extended,
            isAllowance: item.is_allowance,
            isOutlier,
            outlierType,
            outlierSeverity,
            deviationFromMedian: Math.round(deviationFromMedian * 100) / 100,
            percentileRank: Math.round(percentileRank),
            category: item.category,
            criticalPath: item.critical_path,
            riskLevel: item.risk_level,
            specification: item.specification
          };
        });

        const outlierCount = vendors.filter(v => v.isOutlier).length;
        if (outlierCount > 0) {
          outliersByGroup[groupKey] = outlierCount;
        }

        matrixData.push({
          groupKey,
          description,
          csiCode,
          itemCount: items.length,
          category: items[0].category,
          criticalPath: items[0].critical_path,
          riskLevel: items[0].risk_level,
          statistics: {
            mean: Math.round(mean),
            median: Math.round(median),
            min: Math.min(...extendedPrices),
            max: Math.max(...extendedPrices),
            std: Math.round(std),
            q1: Math.round(q1),
            q3: Math.round(q3),
            iqr: Math.round(iqr),
            coefficientOfVariation: Math.round((std / mean) * 100 * 100) / 100
          },
          vendors,
          hasOutliers: outlierCount > 0,
          outlierCount
        });
      });

      // Calculate vendor summary statistics
      const vendorTotals = {};
      projectSubmissions.forEach(submission => {
        vendorTotals[submission.id] = {
          vendorName: submission.vendor_name,
          vendorTier: submission.vendor_tier,
          baseTotal: 0,
          allowanceTotal: 0,
          adjustedTotal: 0,
          totalPrice: submission.total_price,
          rank: 0
        };
      });

      projectLineItems.forEach(item => {
        if (vendorTotals[item.submission_id]) {
          if (item.is_allowance) {
            vendorTotals[item.submission_id].allowanceTotal += item.extended;
          } else {
            vendorTotals[item.submission_id].baseTotal += item.extended;
          }
        }
      });

      Object.values(vendorTotals).forEach((vendor: any) => {
        vendor.adjustedTotal = vendor.baseTotal + vendor.allowanceTotal;
      });

      // Rank vendors by adjusted total
      const sortedVendors = Object.values(vendorTotals).sort((a: any, b: any) => a.adjustedTotal - b.adjustedTotal);
      sortedVendors.forEach((vendor: any, index) => {
        vendor.rank = index + 1;
      });

      const baseBids = Object.values(vendorTotals).map((v: any) => v.adjustedTotal);
      const baseBidsSorted = baseBids.sort((a, b) => a - b);
      const baseBidMean = baseBids.reduce((sum, val) => sum + val, 0) / baseBids.length;
      const baseBidStd = Math.sqrt(baseBids.reduce((sum, val) => sum + Math.pow(val - baseBidMean, 2), 0) / baseBids.length);

      const analysisDate = new Date(new Date(project.evaluation_start || project.submission_deadline).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);

      levelingSnapshots.push({
        id: generateUUID(),
        bid_id: project.id,
        analysis_date: analysisDate.toISOString(),
        total_submissions: projectSubmissions.length,
        total_line_items: matrixData.length,
        matrix_data: matrixData,
        summary_stats: {
          projectTitle: project.title,
          rfpNumber: project.rfp_number,
          estimatedValue: project.estimated_value,
          totalLineItems: matrixData.length,
          totalOutlierGroups: Object.keys(outliersByGroup).length,
          totalOutliers,
          outlierPercentage: Math.round((totalOutliers / (matrixData.length * projectSubmissions.length)) * 100 * 100) / 100,
          vendorCount: projectSubmissions.length,
          categorySummary: {
            structural: matrixData.filter(item => item.category === 'Structural').length,
            mechanical: matrixData.filter(item => item.category === 'Mechanical').length,
            electrical: matrixData.filter(item => item.category === 'Electrical').length,
            envelope: matrixData.filter(item => item.category === 'Envelope').length,
            finishes: matrixData.filter(item => item.category === 'Finishes').length
          },
          riskAnalysis: {
            highRiskItems: matrixData.filter(item => item.riskLevel === 'High').length,
            criticalPathItems: matrixData.filter(item => item.criticalPath).length
          },
          baseBidStatistics: {
            mean: Math.round(baseBidMean),
            median: Math.round(baseBidsSorted[Math.floor(baseBidsSorted.length / 2)]),
            min: Math.min(...baseBids),
            max: Math.max(...baseBids),
            std: Math.round(baseBidStd),
            spread: Math.round(((Math.max(...baseBids) - Math.min(...baseBids)) / Math.min(...baseBids)) * 100 * 100) / 100
          },
          vendorRankings: sortedVendors,
          averageItemsPerGroup: projectSubmissions.length
        },
        outlier_summary: {
          totalOutliers,
          outliersByGroup,
          severityLevels,
          outliersByCategory: {
            structural: matrixData.filter(item => item.category === 'Structural').reduce((sum, item) => sum + item.outlierCount, 0),
            mechanical: matrixData.filter(item => item.category === 'Mechanical').reduce((sum, item) => sum + item.outlierCount, 0),
            electrical: matrixData.filter(item => item.category === 'Electrical').reduce((sum, item) => sum + item.outlierCount, 0)
          }
        },
        processing_time_ms: Math.round(1200 + Math.random() * 2800),
        algorithm_version: '2.1',
        status: 'completed',
        created_at: analysisDate.toISOString(),
        updated_at: analysisDate.toISOString()
      });
    }

    if (levelingSnapshots.length > 0) {
      console.log(`Inserting ${levelingSnapshots.length} leveling snapshots...`);
      const { error: snapshotError } = await supabase.from('leveling_snapshot').insert(levelingSnapshots);
      if (snapshotError) {
        console.error('Error inserting leveling snapshots:', snapshotError);
        throw snapshotError;
      }
    }

    const summary = {
      success: true,
      message: 'Comprehensive procurement data seeded successfully',
      data: {
        projects: projects.length,
        submissions: submissions.length,
        lineItems: allLineItems.length,
        levelingRecords: levelingRecords.length,
        scorecards: scorecards.length,
        bafoRequests: bafoRequests.length,
        awards: awards.length,
        bidEvents: bidEvents.length,
        levelingSnapshots: levelingSnapshots.length,
        totalOutliers: levelingSnapshots.reduce((sum, s) => sum + s.outlier_summary.totalOutliers, 0)
      }
    };

    console.log('✅ Comprehensive seeding completed:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Comprehensive seeding error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
