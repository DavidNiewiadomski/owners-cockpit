
import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";

// Mock data for testing
const mockProjectData = {
  project: { name: "Test Construction Project" },
  tasks: [
    { name: "Foundation Work", status: "completed", updated_at: "2024-01-15T10:00:00Z" },
    { name: "Framing", status: "completed", updated_at: "2024-01-16T14:30:00Z" },
    { name: "Electrical", status: "in_progress", updated_at: "2024-01-10T09:00:00Z" },
    { name: "Plumbing", status: "overdue", updated_at: "2024-01-08T08:00:00Z" }
  ],
  budgetItems: [
    { category: "Materials", budgeted_amount: 50000, actual_amount: 45000, updated_at: "2024-01-15T12:00:00Z" },
    { category: "Labor", budgeted_amount: 30000, actual_amount: 28000, updated_at: "2024-01-16T16:00:00Z" },
    { category: "Equipment", budgeted_amount: 20000, actual_amount: 22000, updated_at: "2024-01-14T11:00:00Z" }
  ],
  rfis: [
    { status: "open", due_date: "2024-01-20" },
    { status: "open", due_date: "2024-01-12" }, // overdue
    { status: "closed", due_date: "2024-01-15" }
  ],
  documents: [
    { processed: true, created_at: "2024-01-15T10:00:00Z" },
    { processed: true, created_at: "2024-01-16T14:00:00Z" },
    { processed: false, created_at: "2024-01-17T09:00:00Z" }
  ]
};

const mockOpenAIResponse = {
  choices: [{
    message: {
      content: `**Weekly Project Summary - Test Construction Project**

This week showed solid progress with 2 tasks completed, including Foundation Work and Framing. However, 1 task remains overdue (Plumbing), requiring immediate attention.

**Budget Performance**: $95,000 spent against $100,000 budgeted (5% under budget). Recent expenses include Materials ($45K) and Labor ($28K), with Equipment slightly over budget at $22K vs $20K planned.

**Issues & Actions**:
- 1 overdue RFI needs resolution
- 1 unprocessed document requires review
- Plumbing work is behind schedule

**Metrics**: 2/4 tasks complete (50%), 2 open RFIs (1 overdue), 3 documents uploaded with 2 processed.

Overall project health is good with minor schedule concerns that need addressing next week.`
    }
  }],
  usage: {
    prompt_tokens: 180,
    completion_tokens: 150,
    total_tokens: 330
  }
};

// Mock fetch for API calls
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
  const urlString = url.toString();
  
  if (urlString.includes('openai.com')) {
    return new Response(JSON.stringify(mockOpenAIResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (urlString.includes('hooks.slack.com')) {
    return new Response('ok', { status: 200 });
  }
  
  return originalFetch(url, init);
};

// Mock Supabase client
const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: string) => ({
        single: () => ({
          data: table === 'projects' ? mockProjectData.project : null
        }),
        gte: (column: string, date: string) => ({
          data: table === 'documents' ? mockProjectData.documents : null
        }),
        data: table === 'tasks' ? mockProjectData.tasks :
              table === 'budget_items' ? mockProjectData.budgetItems :
              table === 'rfi' ? mockProjectData.rfis : null
      })
    })
  }),
  insert: (data: any) => ({
    select: () => ({
      single: () => ({
        data: { id: 'test-report-id', ...data },
        error: null
      })
    })
  })
};

Deno.test("Weekly summary generates valid report", async () => {
  // Set required environment variables
  Deno.env.set('OPENAI_KEY', 'test-key');
  Deno.env.set('SUPABASE_URL', 'https://test.supabase.co');
  Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test-service-key');

  // Mock the createClient function
  const originalCreateClient = globalThis.createClient;
  globalThis.createClient = () => mockSupabase;

  try {
    const { default: handler } = await import('../supabase/functions/weeklySummary/index.ts');

    const request = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: '123e4567-e89b-12d3-a456-426614174000'
      })
    });

    const response = await handler(request);
    assertEquals(response.status, 200);
    
    const data = await response.json();
    assertExists(data.success);
    assertExists(data.report_id);
    assertExists(data.summary);
    assertEquals(data.project_name, 'Test Construction Project');
  } finally {
    globalThis.createClient = originalCreateClient;
  }
});

Deno.test("Weekly summary requires OPENAI_KEY", async () => {
  Deno.env.delete('OPENAI_KEY');

  const { default: handler } = await import('../supabase/functions/weeklySummary/index.ts');

  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_id: '123e4567-e89b-12d3-a456-426614174000'
    })
  });

  const response = await handler(request);
  assertEquals(response.status, 400);
  
  const data = await response.json();
  assertEquals(data.error, 'OPENAI_KEY environment variable is required');
});

Deno.test("Weekly summary validates project_id", async () => {
  Deno.env.set('OPENAI_KEY', 'test-key');
  
  const { default: handler } = await import('../supabase/functions/weeklySummary/index.ts');

  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  const response = await handler(request);
  assertEquals(response.status, 400);
  
  const data = await response.json();
  assertEquals(data.error, 'project_id is required');
});

Deno.test("Weekly summary posts to Slack when configured", async () => {
  Deno.env.set('OPENAI_KEY', 'test-key');
  Deno.env.set('SLACK_WEBHOOK_URL', 'https://hooks.slack.com/test');
  
  globalThis.createClient = () => mockSupabase;

  try {
    const { default: handler } = await import('../supabase/functions/weeklySummary/index.ts');

    const request = new Request('http://localhost:8000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: '123e4567-e89b-12d3-a456-426614174000'
      })
    });

    const response = await handler(request);
    assertEquals(response.status, 200);
    
    const data = await response.json();
    assertEquals(data.posted_to_slack, true);
  } finally {
    Deno.env.delete('SLACK_WEBHOOK_URL');
  }
});

// Restore original fetch
Deno.test({
  name: "Cleanup",
  fn: () => {
    globalThis.fetch = originalFetch;
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
