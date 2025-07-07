const express = require('express');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const ProcoreService = require('./procore-service');
const KPIAggregator = require('./kpi-aggregator');
const EventPublisher = require('./event-publisher');

// Initialize environment variables
require('dotenv').config();

const app = express();
const port = process.env.KPI_COLLECTOR_PORT || 3001;

// Initialize services
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const procoreService = new ProcoreService({
  clientId: process.env.PROCORE_CLIENT_ID,
  clientSecret: process.env.PROCORE_CLIENT_SECRET,
  baseUrl: process.env.PROCORE_BASE_URL || 'https://sandbox.procore.com'
});

const kpiAggregator = new KPIAggregator(supabase);
const eventPublisher = new EventPublisher(supabase);

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'kpi-collector',
    timestamp: new Date().toISOString()
  });
});

// Manual trigger endpoint for testing
app.post('/collect-kpis', async (req, res) => {
  try {
    console.log('Manual KPI collection triggered');
    const result = await collectKPIs();
    res.json({ 
      success: true, 
      message: 'KPI collection completed', 
      result 
    });
  } catch (error) {
    console.error('Error in manual KPI collection:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generate KPI summary endpoint
app.post('/generate-summary/:companyId/:period', async (req, res) => {
  try {
    const { companyId, period } = req.params;
    const summary = await generateKPISummary(companyId, period);
    res.json({ 
      success: true, 
      summary 
    });
  } catch (error) {
    console.error('Error generating KPI summary:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Main KPI collection function
async function collectKPIs() {
  console.log('Starting KPI collection process...');
  
  try {
    // Get all active projects from Supabase
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, procore_project_id')
      .eq('status', 'active')
      .not('procore_project_id', 'is', null);

    if (projectsError) {
      throw new Error(`Failed to fetch projects: ${projectsError.message}`);
    }

    console.log(`Found ${projects.length} active projects with Procore integration`);

    // Get all companies that have Procore integration
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, procore_company_id')
      .not('procore_company_id', 'is', null);

    if (companiesError) {
      throw new Error(`Failed to fetch companies: ${companiesError.message}`);
    }

    console.log(`Found ${companies.length} companies with Procore integration`);

    const results = [];
    const currentPeriod = getCurrentQuarter();

    // Process each project
    for (const project of projects) {
      try {
        console.log(`Processing project: ${project.name} (${project.id})`);
        
        // Find the company for this project
        const { data: projectCompany, error: projectCompanyError } = await supabase
          .from('project_companies')
          .select('company_id, companies(id, name, procore_company_id)')
          .eq('project_id', project.id)
          .single();

        if (projectCompanyError || !projectCompany) {
          console.warn(`No company found for project ${project.id}, skipping...`);
          continue;
        }

        const company = projectCompany.companies;
        
        // Collect KPIs from Procore
        const procoreData = await procoreService.getProjectKPIs(
          company.procore_company_id,
          project.procore_project_id
        );

        // Map and aggregate KPIs
        const kpis = await kpiAggregator.processKPIs(
          company.id,
          project.id,
          procoreData,
          currentPeriod
        );

        results.push({
          project: project.name,
          company: company.name,
          kpisProcessed: kpis.length
        });

        // Publish event for each company
        await eventPublisher.publishKPIUpdate(company.id, currentPeriod);

      } catch (error) {
        console.error(`Error processing project ${project.id}:`, error);
        results.push({
          project: project.name,
          error: error.message
        });
      }
    }

    console.log('KPI collection completed successfully');
    return results;

  } catch (error) {
    console.error('Error in KPI collection:', error);
    throw error;
  }
}

// OpenAI function for generating KPI summaries
async function generateKPISummary(companyId, period) {
  try {
    console.log(`Generating KPI summary for company ${companyId}, period ${period}`);

    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('name, industry')
      .eq('id', companyId)
      .single();

    if (companyError) {
      throw new Error(`Failed to fetch company: ${companyError.message}`);
    }

    // Get KPI data for the period
    const { data: kpis, error: kpisError } = await supabase
      .from('performance_kpi')
      .select(`
        metric,
        value,
        source,
        notes,
        kpi_template (
          target_direction,
          weight,
          description,
          unit
        )
      `)
      .eq('company_id', companyId)
      .eq('period', period)
      .order('metric');

    if (kpisError) {
      throw new Error(`Failed to fetch KPIs: ${kpisError.message}`);
    }

    // Calculate overall score
    const { data: overallScore } = await supabase
      .rpc('calculate_performance_score', {
        p_company_id: companyId,
        p_period: period
      });

    // Get previous period for comparison
    const prevPeriod = getPreviousPeriod(period);
    const { data: prevScore } = await supabase
      .rpc('calculate_performance_score', {
        p_company_id: companyId,
        p_period: prevPeriod
      });

    // Prepare data for OpenAI
    const kpiData = kpis.map(kpi => ({
      metric: kpi.metric,
      value: kpi.value,
      direction: kpi.kpi_template.target_direction,
      weight: kpi.kpi_template.weight,
      description: kpi.kpi_template.description,
      unit: kpi.kpi_template.unit,
      notes: kpi.notes
    }));

    const prompt = `
Generate a comprehensive performance summary for ${company.name} for ${period}.

Company: ${company.name}
Industry: ${company.industry || 'Construction'}
Period: ${period}
Overall Performance Score: ${overallScore || 'N/A'}/100
Previous Period Score: ${prevScore || 'N/A'}/100

KPI Data:
${kpiData.map(kpi => `
- ${kpi.metric}: ${kpi.value}${kpi.unit ? ` ${kpi.unit}` : ''} (Target: ${kpi.direction}, Weight: ${kpi.weight})
  Description: ${kpi.description}
  Notes: ${kpi.notes || 'None'}
`).join('')}

Please provide a markdown-formatted summary that includes:

1. **Executive Summary** - Overall performance assessment and key highlights
2. **Key Performance Indicators** - Analysis of each KPI with context
3. **Trends and Changes** - Comparison with previous period if available
4. **Strengths** - Areas where the company is performing well
5. **Areas for Improvement** - Specific recommendations for underperforming metrics
6. **Risk Assessment** - Potential risks based on current performance
7. **Action Items** - Specific, actionable recommendations

Use a professional tone appropriate for executive stakeholders. Include specific numbers and percentages where relevant.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a construction industry performance analyst specializing in supplier and contractor evaluation. Provide detailed, actionable insights based on KPI data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const summary = completion.choices[0].message.content;

    // Store the summary in the database
    await supabase
      .from('performance_summaries')
      .upsert({
        company_id: companyId,
        period: period,
        summary: summary,
        overall_score: overallScore,
        generated_at: new Date().toISOString()
      });

    return summary;

  } catch (error) {
    console.error('Error generating KPI summary:', error);
    throw error;
  }
}

// Utility functions
function getCurrentQuarter() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 0-based to 1-based
  const quarter = Math.ceil(month / 3);
  return `Q${quarter}-${year}`;
}

function getPreviousPeriod(period) {
  const [quarter, year] = period.split('-');
  const quarterNum = parseInt(quarter.substring(1));
  
  if (quarterNum === 1) {
    return `Q4-${parseInt(year) - 1}`;
  } else {
    return `Q${quarterNum - 1}-${year}`;
  }
}

// Schedule daily KPI collection at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Scheduled KPI collection starting...');
  try {
    await collectKPIs();
    console.log('Scheduled KPI collection completed successfully');
  } catch (error) {
    console.error('Scheduled KPI collection failed:', error);
  }
}, {
  timezone: "America/New_York"
});

// Start the server
app.listen(port, () => {
  console.log(`KPI Collector service running on port ${port}`);
  console.log('Scheduled daily collection at 2:00 AM EST');
});

module.exports = app;
