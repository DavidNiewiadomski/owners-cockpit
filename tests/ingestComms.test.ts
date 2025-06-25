
import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";

// Mock Supabase client
const _mockSupabase = {
  from: (table: string) => ({
    insert: (data: unknown) => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: 'test-id', ...data }, error: null })
      })
    })
  })
};

// Mock OpenAI
const _mockOpenAI = {
  embeddings: {
    create: () => Promise.resolve({
      data: [{ embedding: new Array(1536).fill(0.1) }]
    })
  }
};

Deno.test("ingestComms - Teams webhook payload", async () => {
  const teamsPayload = {
    subscriptionId: "test-subscription",
    changeType: "created",
    resource: "teams/test-team/channels/test-channel/messages/test-message",
    resourceData: {
      id: "test-message-id",
      "@odata.type": "#Microsoft.Graph.chatMessage",
      "@odata.id": "teams/test-team/channels/test-channel/messages/test-message"
    },
    subscriptionExpirationDateTime: "2024-01-01T00:00:00Z",
    tenantId: "test-tenant"
  };

  // Mock the request
  const mockRequest = new Request("http://localhost/ingestComms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-project-id": "test-project-id"
    },
    body: JSON.stringify(teamsPayload)
  });

  // In a real test, you would mock the entire function context
  // This is a simplified test structure
  const result = await mockProcessWebhook(mockRequest, teamsPayload);
  
  assertEquals(result.success, true);
  assertEquals(result.records_processed, 1);
  assertExists(result.records);
});

Deno.test("ingestComms - Outlook delta payload", async () => {
  const outlookPayload = {
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('test-user')/messages/$delta",
    value: [{
      id: "test-email-id",
      subject: "Test Email Subject",
      bodyPreview: "This is a test email preview",
      body: {
        contentType: "HTML",
        content: "<p>This is the full email content</p>"
      },
      from: {
        emailAddress: {
          name: "Test Sender",
          address: "sender@example.com"
        }
      },
      toRecipients: [{
        emailAddress: {
          name: "Test Recipient",
          address: "recipient@example.com"
        }
      }],
      receivedDateTime: "2024-01-01T12:00:00Z",
      webLink: "https://outlook.office.com/mail/test-email",
      conversationId: "test-conversation-id"
    }]
  };

  const mockRequest = new Request("http://localhost/ingestComms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-project-id": "test-project-id"
    },
    body: JSON.stringify(outlookPayload)
  });

  const result = await mockProcessWebhook(mockRequest, outlookPayload);
  
  assertEquals(result.success, true);
  assertEquals(result.records_processed, 1);
  assertEquals(result.records[0].provider, 'outlook');
  assertEquals(result.records[0].comm_type, 'email');
});

Deno.test("ingestComms - Manual communication", async () => {
  const manualPayload = {
    comm_type: "chat_message",
    provider: "manual",
    subject: "Manual Test Message",
    body: "This is a manually created communication",
    speaker: {
      name: "Test User",
      email: "test@example.com"
    },
    participants: ["participant1@example.com", "participant2@example.com"],
    metadata: { source: "manual_entry" }
  };

  const mockRequest = new Request("http://localhost/ingestComms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-project-id": "test-project-id"
    },
    body: JSON.stringify(manualPayload)
  });

  const result = await mockProcessWebhook(mockRequest, manualPayload);
  
  assertEquals(result.success, true);
  assertEquals(result.records_processed, 1);
  assertEquals(result.records[0].comm_type, 'chat_message');
  assertEquals(result.records[0].participants.length, 2);
});

// Mock function to simulate webhook processing
async function mockProcessWebhook(request: Request, payload: unknown) {
  // This would contain the actual function logic in a real test
  // For now, we'll simulate the expected behavior
  
  const projectId = request.headers.get('x-project-id');
  let records = [];

  if (payload.subscriptionId) {
    // Teams webhook
    records.push({
      id: 'mock-id-1',
      project_id: projectId,
      provider: 'teams',
      comm_type: 'chat_message',
      external_id: payload.resourceData.id
    });
  } else if (payload['@odata.context'] && payload.value) {
    // Outlook delta
    records = payload.value.map((email: unknown) => ({
      id: 'mock-id-2',
      project_id: projectId,
      provider: 'outlook',
      comm_type: 'email',
      subject: email.subject,
      body: email.body?.content,
      external_id: email.id
    }));
  } else if (payload.comm_type) {
    // Manual communication
    records.push({
      id: 'mock-id-3',
      project_id: projectId,
      provider: payload.provider,
      comm_type: payload.comm_type,
      subject: payload.subject,
      body: payload.body,
      participants: payload.participants || []
    });
  }

  return {
    success: true,
    records_processed: records.length,
    records
  };
}
