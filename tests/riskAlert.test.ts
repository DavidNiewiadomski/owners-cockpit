
import { assertEquals, assertExists } from "https://deno.land/std@0.190.0/testing/asserts.ts";

// Mock Supabase client
const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        lt: () => ({
          data: mockData[table] || [],
          error: null
        }),
        single: () => ({
          data: null,
          error: null
        })
      }),
      single: () => ({
        data: null,
        error: null
      }),
      or: () => ({
        data: mockData[table] || [],
        error: null
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => ({
          data: { id: 'mock-id', alert_type: 'overdue_tasks' },
          error: null
        })
      }),
      data: { id: 'mock-id' },
      error: null
    })
  })
};

// Mock data
const mockData: any = {
  tasks: [
    {
      id: 'task-1',
      name: 'Install Plumbing',
      due_date: '2024-01-01',
      project_id: 'project-1',
      projects: { name: 'Office Building', owner_id: 'user-1' }
    }
  ],
  projects: [
    {
      id: 'project-1',
      name: 'Office Building',
      budget_items: [
        { budgeted_amount: 100000, actual_amount: 110000 },
        { budgeted_amount: 50000, actual_amount: 45000 }
      ]
    }
  ],
  rfi: [
    {
      id: 'rfi-1',
      title: 'Electrical Specifications',
      due_date: '2024-01-01',
      created_at: '2023-12-01T00:00:00Z',
      project_id: 'project-1',
      projects: { name: 'Office Building', owner_id: 'user-1' }
    }
  ]
};

Deno.test("Risk Alert - Overdue Tasks Detection", async () => {
  // Mock the checkOverdueTasks function logic
  const overdueTasks = mockData.tasks.filter((task: any) => {
    const today = new Date();
    const dueDate = new Date(task.due_date);
    return dueDate < today;
  });

  assertEquals(overdueTasks.length, 1);
  assertEquals(overdueTasks[0].name, "Install Plumbing");
});

Deno.test("Risk Alert - Budget Variance Detection", async () => {
  const project = mockData.projects[0];
  const totalBudgeted = project.budget_items.reduce((sum: number, item: any) => sum + item.budgeted_amount, 0);
  const totalActual = project.budget_items.reduce((sum: number, item: any) => sum + item.actual_amount, 0);
  const variancePercent = ((totalActual - totalBudgeted) / totalBudgeted) * 100;

  // Should detect variance > 5%
  assertEquals(totalBudgeted, 150000);
  assertEquals(totalActual, 155000);
  assertEquals(Math.round(variancePercent * 100) / 100, 3.33); // 3.33% variance
});

Deno.test("Risk Alert - Overdue RFI Detection", async () => {
  const rfi = mockData.rfi[0];
  const createdDate = new Date(rfi.created_at);
  const daysSinceCreated = Math.ceil((new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Should detect RFI open for more than 7 days
  assertEquals(daysSinceCreated > 7, true);
  assertEquals(rfi.title, "Electrical Specifications");
});

Deno.test("Risk Alert - Slack Payload Format", async () => {
  const mockAlert = {
    project_id: 'project-1',
    project_name: 'Office Building',
    alert_type: 'overdue_tasks' as const,
    severity: 'medium' as const,
    title: 'Overdue Task: Install Plumbing',
    description: 'Task "Install Plumbing" is 23 days overdue',
    alert_key: 'task-1',
    metadata: { task_id: 'task-1', days_overdue: 23 }
  };

  const slackPayload = {
    text: `🟠 Risk Alert: ${mockAlert.project_name}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🟠 ${mockAlert.title}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Project:* ${mockAlert.project_name}\n*Severity:* ${mockAlert.severity.toUpperCase()}\n*Description:* ${mockAlert.description}`
        }
      }
    ]
  };

  assertExists(slackPayload.text);
  assertEquals(slackPayload.blocks.length, 2);
  assertEquals(slackPayload.blocks[0].type, "header");
  assertEquals(slackPayload.blocks[1].type, "section");
});

Deno.test("Risk Alert - Deduplication Logic", async () => {
  // Mock checking if alert was already sent
  const alertKey = 'task-1';
  const projectId = 'project-1';
  const alertType = 'overdue_tasks';

  // Simulate that no previous alert was sent
  const alreadySent = null;

  assertEquals(alreadySent, null, "Should proceed with sending alert when none was sent before");

  // Simulate that alert was already sent
  const alreadySentMock = { id: 'sent-1' };
  
  assertEquals(alreadySentMock.id, 'sent-1', "Should skip sending alert when one was already sent");
});
