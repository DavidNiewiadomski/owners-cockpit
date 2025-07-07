// Comprehensive test script for all RFP AI functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testProjectMeta = {
  title: 'Emergency Department Renovation',
  facility_id: 'NYC-HOSP-001',
  budget_cap: 15000000,
  project_type: 'renovation',
  release_date: '2025-08-01',
  proposal_due: '2025-09-15',
  contract_start: '2025-10-01',
  compliance: {
    mwbe: true,
    ada: true,
    leed_required: true,
    prevailing_wage: true
  }
};

const testScopeItems = [
  { csi_code: '03 30 00', description: 'Cast-in-Place Concrete for foundation work' },
  { csi_code: '08 11 00', description: 'Metal Doors and Frames for patient rooms' },
  { csi_code: '09 91 00', description: 'Painting and protective coatings' },
  { csi_code: '26 50 00', description: 'LED lighting systems' }
];

const testTimelineEvents = [
  { name: 'RFP Release', deadline: '2025-08-01', mandatory: true },
  { name: 'Pre-Proposal Meeting', deadline: '2025-08-15', mandatory: false },
  { name: 'Questions Due', deadline: '2025-08-30', mandatory: true },
  { name: 'Proposals Due', deadline: '2025-09-15', mandatory: true },
  { name: 'Award Notification', deadline: '2025-09-30', mandatory: true }
];

async function testAIFunction(functionName, action, params) {
  console.log(`\n🧪 Testing ${functionName}...`);
  console.log('─'.repeat(50));
  
  try {
    const { data, error } = await supabase.functions.invoke('rfp-drafter', {
      body: { action, ...params }
    });

    if (error) {
      console.error(`❌ ${functionName} Error:`, error);
      return false;
    }

    console.log(`✅ ${functionName} Response:`, data);
    
    // Show preview of generated content
    if (data && data.markdown) {
      console.log(`📄 Generated Content Preview (${functionName}):`);
      console.log(data.markdown.substring(0, 300) + '...');
    } else if (data && data.criteria) {
      console.log(`📋 Generated Criteria (${functionName}):`);
      console.log(`- ${data.criteria.length} criteria items`);
      console.log(`- ${data.weights.length} weight categories`);
    } else if (data && data.clauses) {
      console.log(`🔍 Found Clauses (${functionName}):`);
      console.log(`- ${data.clauses.length} matching clauses`);
    }
    
    return true;
  } catch (err) {
    console.error(`❌ ${functionName} Test Error:`, err.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive AI Functionality Tests');
  console.log('='.repeat(60));
  
  const results = [];
  
  // Test 1: Draft Scope of Work
  const scopeTest = await testAIFunction(
    'Draft Scope of Work',
    'draft_scope_of_work',
    {
      project_meta: testProjectMeta,
      scope_items: testScopeItems
    }
  );
  results.push({ name: 'Scope of Work Generation', passed: scopeTest });
  
  // Test 2: Draft Timeline
  const timelineTest = await testAIFunction(
    'Draft Timeline',
    'draft_timeline',
    {
      timeline_events: testTimelineEvents
    }
  );
  results.push({ name: 'Timeline Generation', passed: timelineTest });
  
  // Test 3: Suggest Evaluation Criteria
  const criteriaTest = await testAIFunction(
    'Suggest Evaluation Criteria',
    'suggest_evaluation_criteria',
    {
      project_size_sqft: 50000,
      project_meta: testProjectMeta
    }
  );
  results.push({ name: 'Evaluation Criteria Generation', passed: criteriaTest });
  
  // Test 4: Search Clauses
  const clauseTest = await testAIFunction(
    'Search Clauses',
    'search_clause',
    {
      query: 'MWBE participation requirements'
    }
  );
  results.push({ name: 'Clause Search', passed: clauseTest });
  
  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL AI FUNCTIONALITY IS WORKING PERFECTLY! 🎉');
    return true;
  } else {
    console.log('⚠️  Some AI functions need attention');
    return false;
  }
}

// Run the comprehensive test
runAllTests();
