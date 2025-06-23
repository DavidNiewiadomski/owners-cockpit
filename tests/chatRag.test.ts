
import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";

// Mock OpenAI API responses
const mockEmbeddingResponse = {
  data: [{
    embedding: new Array(1536).fill(0.1)
  }]
};

const mockChatResponse = {
  choices: [{
    message: {
      content: "Based on the project documents, your construction project appears to be on track."
    }
  }],
  usage: {
    prompt_tokens: 150,
    completion_tokens: 25,
    total_tokens: 175
  }
};

// Mock fetch for testing
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
  const urlString = url.toString();
  
  if (urlString.includes('embeddings')) {
    return new Response(JSON.stringify(mockEmbeddingResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (urlString.includes('chat/completions')) {
    return new Response(JSON.stringify(mockChatResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return originalFetch(url, init);
};

Deno.test("Chat RAG endpoint handles valid request", async () => {
  // Set required environment variables
  Deno.env.set('OPENAI_KEY', 'test-key');
  Deno.env.set('SUPABASE_URL', 'https://test.supabase.co');
  Deno.env.set('SUPABASE_ANON_KEY', 'test-anon-key');

  // Import the function after setting env vars
  const { default: handler } = await import('../supabase/functions/chatRag/index.ts');

  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      question: 'What is the status of my project?',
      conversation_id: '987fcdeb-51a2-43d1-b123-456789abcdef'
    })
  });

  const response = await handler(request);
  
  assertEquals(response.status, 200);
  
  const data = await response.json();
  assertExists(data.answer);
  assertExists(data.citations);
  assertExists(data.usage);
});

Deno.test("Chat RAG endpoint rejects missing OPENAI_KEY", async () => {
  // Clear the environment variable
  Deno.env.delete('OPENAI_KEY');

  const { default: handler } = await import('../supabase/functions/chatRag/index.ts');

  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      question: 'Test question'
    })
  });

  const response = await handler(request);
  assertEquals(response.status, 400);
});

Deno.test("Chat RAG endpoint validates required fields", async () => {
  Deno.env.set('OPENAI_KEY', 'test-key');
  
  const { default: handler } = await import('../supabase/functions/chatRag/index.ts');

  const request = new Request('http://localhost:8000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_id: '', // Invalid empty project_id
      question: 'Test question'
    })
  });

  const response = await handler(request);
  assertEquals(response.status, 400);
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
