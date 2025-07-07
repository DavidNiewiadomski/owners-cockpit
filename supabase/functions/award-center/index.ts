import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from 'https://esm.sh/openai@4.28.0'

// Award-bot system prompt
const AWARD_BOT_SYSTEM_PROMPT = `You are an owner-side procurement officer. Using the JSON payload of {snapshot, scorecards, compliance}, draft a 1-page award memorandum summarizing selection rationale, price basis, and funding source.

Your memorandum should be professional, concise, and include:

1. **Executive Summary** - Recommended vendor and contract amount
2. **Selection Rationale** - Why this vendor was selected based on technical and commercial evaluation
3. **Bid Summary** - Table comparing all vendors' scores and pricing
4. **Price Basis** - Analysis of pricing competitiveness and basis for award
5. **Compliance Verification** - Confirmation that selected vendor meets all requirements
6. **Funding Source** - Available funding and budget alignment
7. **Recommendation** - Clear recommendation for award

Format your response as structured HTML that can be inserted into the template. Use professional procurement language and ensure all analysis is data-driven and defensible.

Be specific about scores, rankings, and financial details. Include any risk factors or special considerations.`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AwardRequest {
  bid_id: string
  winning_submission_id: string
  contract_value: number
  selection_rationale?: any
  price_basis?: any
  funding_source?: any
  template_id?: string
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

    // Initialize OpenAI client for award-bot
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
    })

    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)

    // Routes:
    // POST /award-center/rfp/{id}/award - Create award package
    // GET /award-center/rfp/{id}/memo - Download award memo
    // POST /award-center/rfp/{id}/regenerate-memo - Regenerate award memo

    if (req.method === 'POST' && pathSegments[1] === 'rfp' && pathSegments[3] === 'award') {
      return await createAwardPackage(req, supabaseClient, openai, pathSegments[2])
    }

    if (req.method === 'GET' && pathSegments[1] === 'rfp' && pathSegments[3] === 'memo') {
      return await downloadAwardMemo(supabaseClient, pathSegments[2])
    }

    if (req.method === 'POST' && pathSegments[1] === 'rfp' && pathSegments[3] === 'regenerate-memo') {
      return await regenerateAwardMemo(req, supabaseClient, openai, pathSegments[2])
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Award center error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function createAwardPackage(
  req: Request, 
  supabase: any, 
  openai: OpenAI, 
  bidId: string
): Promise<Response> {
  const awardRequest: AwardRequest = await req.json()

  try {
    // 1. Create the award package in database
    const { data: awardPackage, error: createError } = await supabase
      .rpc('create_award_package', {
        p_bid_id: bidId,
        p_winning_submission_id: awardRequest.winning_submission_id,
        p_contract_value: awardRequest.contract_value,
        p_selection_rationale: awardRequest.selection_rationale || {},
        p_price_basis: awardRequest.price_basis || {},
        p_funding_source: awardRequest.funding_source || {}
      })

    if (createError) {
      throw new Error(`Failed to create award package: ${createError.message}`)
    }

    // 2. Get award memo data for the bot
    const { data: memoData, error: memoError } = await supabase
      .rpc('get_award_memo_data', { p_bid_id: bidId })

    if (memoError) {
      throw new Error(`Failed to get memo data: ${memoError.message}`)
    }

    // 3. Generate award memo using award-bot
    const memoContent = await generateAwardMemo(openai, memoData, awardRequest)

    // 4. Convert HTML to PDF (you would integrate with a service like Puppeteer or Playwright)
    const pdfUrl = await convertToPDF(memoContent, awardPackage)

    // 5. Update award package with generated memo
    const { error: updateError } = await supabase
      .rpc('update_award_memo', {
        p_award_package_id: awardPackage,
        p_memo_content: memoContent,
        p_memo_url: pdfUrl
      })

    if (updateError) {
      throw new Error(`Failed to update award memo: ${updateError.message}`)
    }

    // 6. Trigger DocuSign envelope creation (if configured)
    await triggerDocuSignEnvelope(supabase, awardPackage, memoData)

    // 7. Publish bid.award.issued event
    await publishAwardEvent(supabase, bidId, awardPackage, awardRequest)

    return new Response(
      JSON.stringify({
        award_package_id: awardPackage,
        memo_url: pdfUrl,
        message: 'Award package created successfully'
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Create award package error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function generateAwardMemo(
  openai: OpenAI, 
  memoData: any, 
  awardRequest: AwardRequest
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: AWARD_BOT_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Please generate an award memorandum based on this evaluation data:

**Bid Information:**
${JSON.stringify(memoData.bid_info, null, 2)}

**Leveling Snapshot:**
${JSON.stringify(memoData.snapshot, null, 2)}

**Scorecard Summary:**
${JSON.stringify(memoData.scorecards, null, 2)}

**Compliance Summary:**
${JSON.stringify(memoData.compliance, null, 2)}

**Award Request Details:**
- Contract Value: $${awardRequest.contract_value}
- Selection Rationale: ${JSON.stringify(awardRequest.selection_rationale)}
- Price Basis: ${JSON.stringify(awardRequest.price_basis)}
- Funding Source: ${JSON.stringify(awardRequest.funding_source)}

Generate a comprehensive award memorandum in HTML format suitable for PDF conversion.`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })

    return completion.choices[0]?.message?.content || "Error generating memo content"

  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error(`Award-bot generation failed: ${error.message}`)
  }
}

async function convertToPDF(htmlContent: string, awardPackageId: string): Promise<string> {
  // This would integrate with a PDF generation service
  // For now, return a placeholder URL
  // In production, use Puppeteer, Playwright, or a service like DocRaptor
  
  // Example integration:
  // const response = await fetch('https://api.docraptor.com/docs', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Basic ${btoa(Deno.env.get('DOCRAPTOR_API_KEY') + ':')}`
  //   },
  //   body: JSON.stringify({
  //     user_credentials: Deno.env.get('DOCRAPTOR_API_KEY'),
  //     doc: {
  //       document_content: htmlContent,
  //       document_type: 'pdf',
  //       name: `award-memo-${awardPackageId}.pdf`
  //     }
  //   })
  // })
  
  return `https://example.com/award-memos/${awardPackageId}.pdf`
}

async function triggerDocuSignEnvelope(
  supabase: any, 
  awardPackageId: string, 
  memoData: any
): Promise<void> {
  // Integration with DocuSign API would go here
  // This would create an envelope with the award memo and contract documents
  
  try {
    // Placeholder for DocuSign integration
    console.log(`DocuSign envelope creation triggered for award package: ${awardPackageId}`)
    
    // Update award package with DocuSign info
    await supabase
      .from('award_packages')
      .update({
        docusign_status: 'pending',
        docusign_sent_at: new Date().toISOString()
      })
      .eq('id', awardPackageId)
      
  } catch (error) {
    console.error('DocuSign integration error:', error)
  }
}

async function publishAwardEvent(
  supabase: any, 
  bidId: string, 
  awardPackageId: string, 
  awardRequest: AwardRequest
): Promise<void> {
  try {
    // Insert into bid_events table
    await supabase
      .from('bid_events')
      .insert({
        bid_id: bidId,
        submission_id: awardRequest.winning_submission_id,
        event_type: 'bid.award.issued',
        description: 'Contract award issued',
        event_data: {
          award_package_id: awardPackageId,
          contract_value: awardRequest.contract_value,
          timestamp: new Date().toISOString()
        }
      })

    // Trigger any additional notification systems here
    console.log(`Published bid.award.issued event for bid ${bidId}`)
    
  } catch (error) {
    console.error('Event publishing error:', error)
  }
}

async function downloadAwardMemo(
  supabase: any, 
  bidId: string
): Promise<Response> {
  try {
    // Get award package for this bid
    const { data: awardPackage, error } = await supabase
      .from('award_packages')
      .select('award_memo_url, award_memo_content')
      .eq('bid_id', bidId)
      .single()

    if (error || !awardPackage) {
      return new Response(
        JSON.stringify({ error: 'Award memo not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!awardPackage.award_memo_url) {
      return new Response(
        JSON.stringify({ error: 'Award memo not yet generated' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return the PDF URL for download
    return new Response(
      JSON.stringify({ 
        memo_url: awardPackage.award_memo_url,
        generated_at: awardPackage.award_memo_generated_at
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Download memo error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function regenerateAwardMemo(
  req: Request,
  supabase: any, 
  openai: OpenAI, 
  bidId: string
): Promise<Response> {
  try {
    const { template_updates } = await req.json()

    // Get existing award package
    const { data: awardPackage, error: packageError } = await supabase
      .from('award_packages')
      .select('*')
      .eq('bid_id', bidId)
      .single()

    if (packageError || !awardPackage) {
      return new Response(
        JSON.stringify({ error: 'Award package not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get fresh memo data
    const { data: memoData, error: memoError } = await supabase
      .rpc('get_award_memo_data', { p_bid_id: bidId })

    if (memoError) {
      throw new Error(`Failed to get memo data: ${memoError.message}`)
    }

    // Regenerate memo with any updates
    const awardRequest = {
      winning_submission_id: awardPackage.winning_submission_id,
      contract_value: awardPackage.contract_value,
      selection_rationale: template_updates?.selection_rationale || awardPackage.selection_rationale,
      price_basis: template_updates?.price_basis || awardPackage.price_basis,
      funding_source: template_updates?.funding_source || awardPackage.funding_source
    }

    const memoContent = await generateAwardMemo(openai, memoData, awardRequest)
    const pdfUrl = await convertToPDF(memoContent, awardPackage.id)

    // Update award package
    const { error: updateError } = await supabase
      .rpc('update_award_memo', {
        p_award_package_id: awardPackage.id,
        p_memo_content: memoContent,
        p_memo_url: pdfUrl
      })

    if (updateError) {
      throw new Error(`Failed to update award memo: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({
        memo_url: pdfUrl,
        message: 'Award memo regenerated successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Regenerate memo error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
