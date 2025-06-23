
interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
  };
  elements?: Array<{
    type: string;
    text: string;
  }>;
}

interface SlackPayload {
  text: string;
  blocks: SlackBlock[];
}

export async function sendSlackNotification(
  webhookUrl: string,
  payload: SlackPayload
): Promise<void> {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook error: ${response.status}`);
  }
}

export function createWeeklySummarySlackPayload(
  projectName: string,
  summary: string
): SlackPayload {
  return {
    text: `📊 Weekly Project Summary: ${projectName}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📊 ${projectName} - Weekly Summary`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: summary
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Generated on ${new Date().toLocaleDateString()} by Owners Cockpit`
          }
        ]
      }
    ]
  };
}

export function createRiskAlertSlackPayload(
  projectName: string,
  title: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  description: string
): SlackPayload {
  const severityEmoji = {
    low: '🟡',
    medium: '🟠', 
    high: '🔴',
    critical: '🚨'
  };

  return {
    text: `${severityEmoji[severity]} Risk Alert: ${projectName}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${severityEmoji[severity]} ${title}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Project:* ${projectName}\n*Severity:* ${severity.toUpperCase()}\n*Description:* ${description}`
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Alert generated on ${new Date().toLocaleString()} by Owners Cockpit`
          }
        ]
      }
    ]
  };
}
