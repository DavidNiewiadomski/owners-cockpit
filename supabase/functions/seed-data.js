import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Local development configuration
const supabaseUrl = 'http://localhost:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper function to generate UUIDs
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Sample construction companies with realistic data
const CONSTRUCTION_COMPANIES = [
  { 
    name: "Turner Construction Company", 
    tier: "tier1", 
    specialties: ["Commercial", "Healthcare", "Education"],
    safetyRating: "EMR 0.52"
  },
  { 
    name: "Skanska USA Building", 
    tier: "tier1", 
    specialties: ["Infrastructure", "Commercial", "Residential"],
    safetyRating: "EMR 0.48"
  },
  { 
    name: "Suffolk Construction", 
    tier: "tier1", 
    specialties: ["Healthcare", "Life Sciences", "Education"],
    safetyRating: "EMR 0.61"
  },
  { 
    name: "McCarthy Building Companies", 
    tier: "tier2", 
    specialties: ["Healthcare", "Education", "Commercial"],
    safetyRating: "EMR 0.55"
  },
  { 
    name: "DPR Construction", 
    tier: "tier2", 
    specialties: ["Life Sciences", "Healthcare", "Higher Education"],
    safetyRating: "EMR 0.64"
  }
]

// Sample CSI line items
const CSI_LINE_ITEMS = [
  { csi: "03300", description: "Cast-in-Place Concrete", basePrice: 2850000, category: "Structural" },
  { csi: "05100", description: "Structural Metal Framing", basePrice: 3250000, category: "Structural" },
  { csi: "08400", description: "Entrances, Storefronts, and Curtain Walls", basePrice: 1850000, category: "Envelope" },
  { csi: "09200", description: "Plaster and Gypsum Board", basePrice: 1450000, category: "Interior" },
  { csi: "23100", description: "HVAC Ducts and Casings", basePrice: 1650000, category: "Mechanical" },
  { csi: "26400", description: "Low-Voltage Distribution", basePrice: 1850000, category: "Electrical" },
  { csi: "A1000", description: "General Conditions Allowance", basePrice: 450000, category: "Allowance", isAllowance: true },
  { csi: "A7000", description: "Owner Contingency", basePrice: 750000, category: "Allowance", isAllowance: true }
]

async function seedComprehensiveData() {
  console.log('🚀 Starting comprehensive procurement data seeding...')

  try {
    // Clean existing data
    console.log('🧹 Cleaning existing data...')
    const tables = ['awards', 'bafo_requests', 'scorecards', 'leveling', 'leveling_snapshot', 'bid_line_items', 'submissions', 'bids', 'bid_events']
    
    for (const table of tables) {
      try {
        await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      } catch (error) {
        console.log(`Table ${table} might not exist or already clean`)
      }
    }

    // Generate projects
    console.log('📋 Generating projects...')
    const currentDate = new Date()
    const projects = []

    const projectTypes = [
      { type: "Healthcare Facility", complexity: "High", budget: [80000000, 150000000] },
      { type: "Office Tower", complexity: "Medium", budget: [60000000, 120000000] },
      { type: "Educational Complex", complexity: "High", budget: [90000000, 160000000] },
      { type: "Mixed-Use Development", complexity: "High", budget: [100000000, 200000000] },
      { type: "Government Building", complexity: "Medium", budget: [70000000, 130000000] }
    ]

    for (let i = 0; i < 5; i++) {
      const projectType = projectTypes[i]
      const publishedDate = new Date(currentDate.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      const submissionDeadline = new Date(publishedDate.getTime() + (21 + Math.random() * 14) * 24 * 60 * 60 * 1000)
      const evaluationStart = new Date(submissionDeadline.getTime() + 3 * 24 * 60 * 60 * 1000)
      
      // Determine project status based on timeline
      let status
      if (currentDate < submissionDeadline) {
        status = 'open'
      } else if (currentDate < evaluationStart) {
        status = Math.random() > 0.3 ? 'evaluation' : 'open'
      } else {
        const statusOptions = ['evaluation', 'leveling_complete', 'bafo_requested', 'awarded']
        status = statusOptions[Math.floor(Math.random() * statusOptions.length)]
      }

      const estimatedValue = Math.round((projectType.budget[0] + Math.random() * (projectType.budget[1] - projectType.budget[0])) / 1000000) * 1000000

      projects.push({
        id: generateUUID(),
        title: `${projectType.type} Construction`,
        description: `Construction of a state-of-the-art ${projectType.type.toLowerCase()} featuring advanced building systems and sustainable design.`,
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
        updated_at: new Date().toISOString()
      })
    }

    // Insert projects
    const { error: projectError } = await supabase.from('bids').insert(projects)
    if (projectError) {
      console.error('Error inserting projects:', projectError)
      throw projectError
    }

    console.log('🏢 Generating vendor submissions...')
    const submissions = []
    const allLineItems = []
    const levelingRecords = []
    const scorecards = []
    const bafoRequests = []
    const awards = []

    // Generate submissions for each project
    for (const project of projects) {
      const numSubmissions = 3 + Math.floor(Math.random() * 3) // 3-5 vendors per project
      const selectedVendors = CONSTRUCTION_COMPANIES
        .sort(() => Math.random() - 0.5)
        .slice(0, numSubmissions)

      const projectSubmissions = []

      selectedVendors.forEach((vendor, vendorIndex) => {
        const submissionDate = new Date(
          new Date(project.submission_deadline).getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000
        )

        // Price multiplier based on vendor tier
        let priceMultiplier = 1.0
        if (vendor.tier === 'tier1') {
          priceMultiplier = 1.05 + Math.random() * 0.1 // Premium pricing
        } else {
          priceMultiplier = 0.95 + Math.random() * 0.15 // Competitive pricing
        }

        const basePrice = Math.round(project.estimated_value * priceMultiplier)
        const contingency = Math.round(basePrice * (0.03 + Math.random() * 0.07))
        const totalPrice = basePrice + contingency

        // Submission status based on project status
        let submissionStatus = 'submitted'
        if (project.status === 'evaluation' || project.status === 'leveling_complete') {
          submissionStatus = Math.random() > 0.2 ? 'under_review' : 'submitted'
        } else if (project.status === 'bafo_requested') {
          submissionStatus = Math.random() > 0.5 ? 'shortlisted' : 'under_review'
        } else if (project.status === 'awarded') {
          submissionStatus = vendorIndex === 0 ? 'shortlisted' : 'rejected' // First vendor wins
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
          updated_at: submissionDate.toISOString()
        }

        submissions.push(submission)
        projectSubmissions.push(submission)

        // Generate line items for each submission
        CSI_LINE_ITEMS.forEach((item) => {
          let priceVariation = 0.9 + Math.random() * 0.2

          // Create outliers (8% chance)
          if (Math.random() < 0.08) {
            priceVariation *= Math.random() < 0.5 ? 0.6 : 1.7
          }

          const quantity = Math.round(100 + Math.random() * 1400)
          const unitPrice = Math.round(item.basePrice * priceVariation / quantity * 100) / 100
          const extended = Math.round(unitPrice * quantity)

          allLineItems.push({
            id: generateUUID(),
            submission_id: submission.id,
            vendor_name: vendor.name,
            csi_code: item.csi,
            description: item.description,
            qty: quantity,
            uom: 'SF',
            unit_price: unitPrice,
            extended: extended,
            is_allowance: item.isAllowance || false,
            is_alternate: Math.random() < 0.05,
            confidence_score: 0.85 + Math.random() * 0.15,
            extracted_at: submissionDate.toISOString(),
            extraction_method: Math.random() > 0.7 ? 'ai' : 'manual',
            notes: Math.random() > 0.8 ? 'Vendor provided detailed breakdown' : null,
            created_at: submissionDate.toISOString(),
            updated_at: submissionDate.toISOString()
          })
        })

        // Generate scorecards for reviewed submissions
        if (project.status === 'leveling_complete' || project.status === 'bafo_requested' || project.status === 'awarded') {
          const evaluationDate = new Date(project.evaluation_start || project.submission_deadline)
          evaluationDate.setDate(evaluationDate.getDate() + Math.floor(Math.random() * 10) + 3)

          // Technical scoring based on vendor tier
          const baseTechnicalScore = vendor.tier === 'tier1' ? 85 : 75
          const technicalScore = Math.min(100, baseTechnicalScore + (Math.random() - 0.5) * 10)

          // Commercial scoring (price-based)
          const lowestPrice = Math.min(...projectSubmissions.map(s => s.total_price))
          const commercialScore = Math.max(60, Math.min(100, (lowestPrice / totalPrice) * 100))

          const weightedTechnical = (technicalScore * project.technical_weight) / 100
          const weightedCommercial = (commercialScore * project.commercial_weight) / 100
          const compositeScore = weightedTechnical + weightedCommercial

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
          })
        }
      })

      // Generate award for awarded projects
      if (project.status === 'awarded') {
        const winningSubmission = projectSubmissions[0]
        const awardDate = new Date(project.evaluation_start || project.submission_deadline)
        awardDate.setDate(awardDate.getDate() + 21)

        const contractNumber = `CNT-${project.rfp_number.split('-')[1]}-${String(Math.floor(Math.random() * 9000) + 1000)}`
        const contractStart = new Date(awardDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        const contractEnd = new Date(contractStart.getTime() + (12 + Math.random() * 24) * 30 * 24 * 60 * 60 * 1000)

        awards.push({
          id: generateUUID(),
          bid_id: project.id,
          winning_submission_id: winningSubmission.id,
          award_amount: winningSubmission.total_price,
          award_justification: `${winningSubmission.vendor_name} selected based on superior technical proposal, competitive pricing, and proven track record on similar projects.`,
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
        })
      }
    }

    // Insert all data
    console.log(`💾 Inserting ${submissions.length} submissions...`)
    const { error: submissionError } = await supabase.from('submissions').insert(submissions)
    if (submissionError) {
      console.error('Error inserting submissions:', submissionError)
      throw submissionError
    }

    console.log(`💾 Inserting ${allLineItems.length} line items...`)
    const { error: lineItemError } = await supabase.from('bid_line_items').insert(allLineItems)
    if (lineItemError) {
      console.error('Error inserting line items:', lineItemError)
      throw lineItemError
    }

    if (scorecards.length > 0) {
      console.log(`💾 Inserting ${scorecards.length} scorecards...`)
      const { error: scorecardError } = await supabase.from('scorecards').insert(scorecards)
      if (scorecardError) {
        console.error('Error inserting scorecards:', scorecardError)
        throw scorecardError
      }
    }

    if (awards.length > 0) {
      console.log(`💾 Inserting ${awards.length} awards...`)
      const { error: awardError } = await supabase.from('awards').insert(awards)
      if (awardError) {
        console.error('Error inserting awards:', awardError)
        throw awardError
      }
    }

    const summary = {
      success: true,
      message: 'Comprehensive procurement data seeded successfully',
      data: {
        projects: projects.length,
        submissions: submissions.length,
        lineItems: allLineItems.length,
        scorecards: scorecards.length,
        awards: awards.length
      }
    }

    console.log('✅ Comprehensive seeding completed:', summary)
    return summary

  } catch (error) {
    console.error('❌ Comprehensive seeding error:', error)
    throw error
  }
}

// Run the seeding function
seedComprehensiveData()
  .then(result => {
    console.log('Final result:', result)
    console.log('🎉 Data seeding completed successfully!')
  })
  .catch(error => {
    console.error('💥 Data seeding failed:', error)
  })
