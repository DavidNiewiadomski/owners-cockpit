import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { companyId } = await req.json();

    if (!companyId) {
      return new Response(
        JSON.stringify({ error: 'Company ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch company data and related interactions
    const { data: company, error: companyError } = await supabase
      .from('company')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError || !company) {
      throw new Error('Company not found');
    }

    // Fetch recent interactions for this company
    const { data: interactions, error: interactionsError } = await supabase
      .from('interaction')
      .select('*')
      .eq('company_id', companyId)
      .order('date', { ascending: false })
      .limit(10);

    if (interactionsError) {
      console.error('Error fetching interactions:', interactionsError);
    }

    // Fetch opportunities for this company
    const { data: opportunities, error: opportunitiesError } = await supabase
      .from('opportunity')
      .select('*')
      .eq('company_id', companyId);

    if (opportunitiesError) {
      console.error('Error fetching opportunities:', opportunitiesError);
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare data summary for AI analysis
    const dataContext = {
      company: {
        name: company.name,
        type: company.type,
        status: company.status,
        trade_codes: company.trade_codes,
        diversity_flags: company.diversity_flags
      },
      interaction_count: interactions?.length || 0,
      recent_interactions: interactions?.slice(0, 5).map(i => ({
        type: i.type,
        date: i.date,
        notes_length: i.notes?.length || 0
      })) || [],
      opportunity_count: opportunities?.length || 0,
      opportunity_stages: opportunities?.map(o => o.stage) || [],
      total_opportunity_value: opportunities?.reduce((sum, o) => sum + (o.est_value || 0), 0) || 0
    };

    // Call OpenAI API to generate risk score
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI risk assessment specialist for a construction/procurement CRM system.
            Analyze the provided company data and return a risk score from 0-100 where:
            - 0-20: Very Low Risk (reliable, established relationships)
            - 21-40: Low Risk (good track record, minor concerns)
            - 41-60: Medium Risk (mixed signals, requires monitoring)
            - 61-80: High Risk (concerning patterns, significant issues)
            - 81-100: Very High Risk (major red flags, avoid if possible)
            
            Consider factors like:
            - Company type and trade codes
            - Interaction frequency and quality
            - Opportunity progression and values
            - Status and diversity flags
            
            Respond with only a JSON object containing:
            {
              "risk_score": <number>,
              "risk_factors": ["factor1", "factor2"],
              "positive_indicators": ["indicator1", "indicator2"],
              "recommendations": ["rec1", "rec2"]
            }`
          },
          {
            role: 'user',
            content: `Analyze this company data and provide a risk score:\n\n${JSON.stringify(dataContext, null, 2)}`
          }
        ],
        max_tokens: 500,
        temperature: 0.2,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponseContent = openaiData.choices[0]?.message?.content || '{}';
    
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponseContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponseContent);
      analysisResult = {
        risk_score: 50,
        risk_factors: ['Unable to analyze'],
        positive_indicators: [],
        recommendations: ['Manual review required']
      };
    }

    const riskScore = Math.max(0, Math.min(100, analysisResult.risk_score || 50));

    // Update the company with the new risk score
    await supabase
      .from('company')
      .update({ 
        risk_score: riskScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', companyId);

    return new Response(
      JSON.stringify({ 
        riskScore,
        analysis: analysisResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error generating risk score:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate risk score',
        details: error.message,
        riskScore: 50 // Default fallback
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
