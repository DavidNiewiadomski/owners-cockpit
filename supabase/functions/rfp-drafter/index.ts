import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProjectMeta {
  title: string;
  facility_id: string;
  budget_cap?: number;
  release_date?: string;
  proposal_due?: string;
  contract_start?: string;
  compliance: Record<string, any>;
}

interface ScopeItem {
  csi_code: string;
  description: string;
}

interface TimelineEvent {
  name: string;
  deadline: string;
  mandatory: boolean;
}

interface EvaluationCriteria {
  criteria: Array<{
    name: string;
    description: string;
    points: number;
  }>;
  weights: Array<{
    category: string;
    percentage: number;
  }>;
}

const RFP_DRAFTER_SYSTEM_PROMPT = `You are a construction-procurement specialist with deep expertise in NYC Health+Hospitals A/E-MEP (Architect/Engineer - Mechanical, Electrical, Plumbing) template requirements. Your role is to generate clear, enforceable, and legally compliant RFP sections that follow industry best practices and NYC municipal procurement standards.

CORE EXPERTISE:
- NYC Health+Hospitals procurement procedures and requirements
- Construction industry standards (CSI MasterFormat, AIA contracts)
- A/E-MEP project specifications and deliverables
- Compliance requirements (MWBE, Local Law 86, ADA, OSHA)
- Risk mitigation and contract enforceability
- Performance evaluation criteria and scoring methodologies

WRITING STYLE:
- Clear, unambiguous language that minimizes interpretation disputes
- Structured sections with numbered requirements for easy reference
- Specific measurable criteria and deliverables
- Professional tone appropriate for legal documents
- Comprehensive yet concise coverage of essential elements

TEMPLATE ADHERENCE:
- Follow NYC Health+Hospitals standard RFP structure
- Include required legal disclaimers and procurement notices
- Ensure compliance with municipal procurement regulations
- Incorporate standard evaluation methodologies
- Reference appropriate industry codes and standards

When generating content, always consider:
1. Legal enforceability and clarity
2. Industry standard practices and codes
3. Risk allocation between owner and contractor
4. Performance measurement and accountability
5. Compliance with applicable regulations`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { action, ...params } = await req.json();

    switch (action) {
      case 'draft_scope_of_work':
        return await draftScopeOfWork(openai, params.project_meta, params.scope_items);
      
      case 'draft_timeline':
        return await draftTimeline(openai, params.timeline_events);
      
      case 'suggest_evaluation_criteria':
        return await suggestEvaluationCriteria(openai, params.project_size_sqft, params.project_meta);
      
      case 'search_clause':
        return await searchClause(supabaseClient, openai, params.query);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('RFP Drafter error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function draftScopeOfWork(
  openai: OpenAI, 
  projectMeta: ProjectMeta, 
  scopeItems: ScopeItem[]
): Promise<Response> {
  const prompt = `Draft a comprehensive Scope of Work section for an RFP based on the following project details:

PROJECT DETAILS:
${JSON.stringify(projectMeta, null, 2)}

SCOPE ITEMS:
${scopeItems.map(item => `- ${item.csi_code}: ${item.description}`).join('\n')}

Generate a professional Scope of Work section that includes:
1. Project Overview and Objectives
2. Detailed Work Requirements by CSI Division
3. Deliverables and Milestones
4. Performance Standards and Quality Requirements
5. Coordination Requirements
6. Compliance and Regulatory Requirements

Format as markdown with clear headings and numbered requirements.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: RFP_DRAFTER_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 3000,
  });

  const markdown = response.choices[0]?.message?.content || '';

  return new Response(
    JSON.stringify({ markdown }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function draftTimeline(
  openai: OpenAI, 
  timelineEvents: TimelineEvent[]
): Promise<Response> {
  const prompt = `Draft a professional Project Timeline and Milestones section for an RFP based on these timeline events:

TIMELINE EVENTS:
${timelineEvents.map(event => 
  `- ${event.name}: ${event.deadline} ${event.mandatory ? '(MANDATORY)' : '(Optional)'}`
).join('\n')}

Generate a comprehensive timeline section that includes:
1. Project Schedule Overview
2. Key Milestones and Deadlines
3. Submission Requirements and Deadlines
4. Review and Evaluation Timeline
5. Award and Contract Execution Timeline
6. Performance Period and Completion Requirements

Include specific dates, responsibilities, and consequences for missed deadlines.
Format as markdown with clear structure.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: RFP_DRAFTER_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 2500,
  });

  const markdown = response.choices[0]?.message?.content || '';

  return new Response(
    JSON.stringify({ markdown }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function suggestEvaluationCriteria(
  openai: OpenAI, 
  projectSizeSqft: number,
  projectMeta: ProjectMeta
): Promise<Response> {
  const prompt = `Suggest comprehensive evaluation criteria for an A/E-MEP RFP with the following parameters:

PROJECT SIZE: ${projectSizeSqft} square feet
PROJECT TYPE: ${projectMeta.title}
BUDGET: ${projectMeta.budget_cap ? `$${projectMeta.budget_cap.toLocaleString()}` : 'Not specified'}
COMPLIANCE REQUIREMENTS: ${JSON.stringify(projectMeta.compliance)}

Generate appropriate evaluation criteria including:
1. Technical qualifications and experience (team, similar projects)
2. Project approach and methodology
3. Schedule and timeline feasibility
4. Cost proposal evaluation
5. MWBE participation (if required)
6. Past performance and references
7. Innovation and value engineering opportunities

Provide both detailed criteria descriptions and appropriate point allocations/weights.

Please format your response as valid JSON with the following structure:
{
  "criteria": [
    {
      "name": "string",
      "description": "string",
      "points": number
    }
  ],
  "weights": [
    {
      "category": "string",
      "percentage": number
    }
  ]
}

Return ONLY the JSON, no additional text or formatting.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: RFP_DRAFTER_SYSTEM_PROMPT + '\n\nIMPORTANT: Always respond with valid JSON only, no markdown formatting or additional text.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  const content = response.choices[0]?.message?.content || '{}';
  
  try {
    // Clean the response in case there's any markdown formatting
    const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    const evaluationCriteria = JSON.parse(cleanContent) as EvaluationCriteria;
    
    return new Response(
      JSON.stringify(evaluationCriteria),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (parseError) {
    console.error('JSON parsing error:', parseError);
    console.error('Raw content:', content);
    
    // Fallback with a basic structure
    const fallbackCriteria: EvaluationCriteria = {
      criteria: [
        {
          name: "Technical Qualifications",
          description: "Team experience and qualifications for similar projects",
          points: 25
        },
        {
          name: "Project Approach",
          description: "Methodology and approach to project execution",
          points: 20
        },
        {
          name: "Schedule Feasibility",
          description: "Realistic timeline and milestone planning",
          points: 15
        },
        {
          name: "Cost Proposal",
          description: "Competitive and realistic pricing",
          points: 25
        },
        {
          name: "Past Performance",
          description: "References and previous project success",
          points: 15
        }
      ],
      weights: [
        { category: "Technical", percentage: 45 },
        { category: "Financial", percentage: 25 },
        { category: "Schedule", percentage: 15 },
        { category: "Experience", percentage: 15 }
      ]
    };
    
    return new Response(
      JSON.stringify(fallbackCriteria),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function searchClause(
  supabaseClient: any,
  openai: OpenAI,
  query: string
): Promise<Response> {
  try {
    // Generate embedding for the search query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Search for similar clauses in the vector database
    const { data: clauses, error } = await supabaseClient.rpc('search_rfp_clauses', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5
    });

    if (error) {
      console.error('Vector search error:', error);
      // Fallback to basic text search if vector search fails
      const { data: fallbackClauses } = await supabaseClient
        .from('rfp_clause_library')
        .select('*')
        .textSearch('content', query.replace(/\s+/g, ' & '))
        .limit(5);
      
      return new Response(
        JSON.stringify({ clauses: fallbackClauses || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ clauses: clauses || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Clause search error:', error);
    return new Response(
      JSON.stringify({ clauses: [], error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
