
# Communications Platform Setup

This guide provides instructions for setting up the unified communications platform that ingests meetings, chat threads, and emails from Teams, Outlook, Zoom, and Google Meet.

## Webhook Registration

### Microsoft Teams Channel Webhook

Use the following PowerShell script to register a webhook for Teams channel messages:

```powershell
# Install Microsoft Graph PowerShell module if not already installed
Install-Module Microsoft.Graph -Force -AllowClobber

# Connect to Microsoft Graph
Connect-MgGraph -Scopes "ChannelMessage.Read.All", "Team.ReadBasic.All"

# Variables - Update these for your environment
$TeamId = "YOUR_TEAM_ID"
$ChannelId = "YOUR_CHANNEL_ID"  
$WebhookUrl = "https://your-project.supabase.co/functions/v1/ingestComms"
$ProjectId = "YOUR_PROJECT_UUID"

# Create subscription for channel messages
$subscription = @{
    changeType = "created,updated"
    notificationUrl = "$WebhookUrl"
    resource = "teams/$TeamId/channels/$ChannelId/messages"
    expirationDateTime = (Get-Date).AddDays(3).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    clientState = $ProjectId
}

$result = New-MgSubscription -BodyParameter $subscription
Write-Host "Teams webhook registered with ID: $($result.Id)"
```

### Outlook Mailbox Webhook

Register webhook for Outlook mailbox messages:

```powershell
# Connect to Microsoft Graph (if not already connected)
Connect-MgGraph -Scopes "Mail.Read", "Mail.ReadWrite"

# Variables
$WebhookUrl = "https://your-project.supabase.co/functions/v1/ingestComms"
$ProjectId = "YOUR_PROJECT_UUID"
$UserPrincipalName = "user@yourdomain.com"

# Create subscription for mailbox messages
$subscription = @{
    changeType = "created,updated"
    notificationUrl = "$WebhookUrl"
    resource = "users/$UserPrincipalName/messages"
    expirationDateTime = (Get-Date).AddDays(3).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    clientState = $ProjectId
}

$result = New-MgSubscription -BodyParameter $subscription
Write-Host "Outlook webhook registered with ID: $($result.Id)"
```

### Zoom Webhook

Register webhook for Zoom meetings:

```bash
# Use Zoom's Webhook API
curl -X POST "https://api.zoom.us/v2/webhooks" \
  -H "Authorization: Bearer YOUR_ZOOM_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-project.supabase.co/functions/v1/ingestComms",
    "events": [
      "meeting.ended",
      "recording.completed"
    ]
  }'
```

### Google Meet Webhook

For Google Meet, use Google Calendar API to monitor meeting events:

```javascript
// Node.js example for Google Calendar webhook
const { google } = require('googleapis');

async function registerCalendarWebhook() {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const watchRequest = {
    calendarId: 'primary',
    requestBody: {
      id: crypto.randomUUID(),
      type: 'web_hook',
      address: 'https://your-project.supabase.co/functions/v1/ingestComms'
    }
  };
  
  const response = await calendar.events.watch(watchRequest);
  console.log('Google Calendar webhook registered:', response.data);
}
```

## OAuth Token Storage

Store OAuth tokens securely using the integration_tokens table:

```typescript
// Example: Store Teams OAuth token
const { data, error } = await supabase
  .from('integration_tokens')
  .insert({
    user_id: user.id,
    project_id: projectId,
    provider: 'teams',
    access_token: encryptedAccessToken,
    refresh_token: encryptedRefreshToken,
    expires_at: tokenExpiryDate,
    token_data: {
      scope: 'ChannelMessage.Read.All Team.ReadBasic.All',
      tenant_id: tenantId
    }
  });
```

## Edge Function Deployment

The `ingestComms` Edge function is automatically deployed. Monitor logs:

```bash
# View function logs
supabase functions logs ingestComms --follow
```

## Testing Webhooks

Test webhook ingestion with a manual payload:

```bash
curl -X POST "https://your-project.supabase.co/functions/v1/ingestComms" \
  -H "Content-Type: application/json" \
  -H "x-project-id: YOUR_PROJECT_ID" \
  -d '{
    "comm_type": "email",
    "provider": "manual",
    "subject": "Test Communication",
    "body": "This is a test message",
    "speaker": {
      "name": "Test User",
      "email": "test@example.com"
    },
    "participants": ["participant1@example.com"],
    "metadata": {}
  }'
```

## Security Considerations

1. **Webhook Validation**: Always validate webhook signatures in production
2. **Token Encryption**: Encrypt OAuth tokens before storing in database
3. **Rate Limiting**: Implement rate limiting on webhook endpoints
4. **RBAC**: Ensure proper row-level security on communications table
5. **Audit Logging**: Log all webhook ingestion attempts

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Data**
   - Check webhook URL is publicly accessible
   - Verify webhook registration is active
   - Check function logs for errors

2. **Permission Errors**
   - Ensure user has project access in user_projects table
   - Verify RLS policies allow communication access
   - Check OAuth scopes are sufficient

3. **Embedding Generation Fails**
   - Verify OPENAI_KEY is set in function secrets
   - Check if text content is not empty
   - Monitor OpenAI API quotas

### Function Monitoring

Monitor the communications ingestion:

```sql
-- Check recent ingestion logs
SELECT * FROM integration_logs 
WHERE operation = 'ingest_communications' 
ORDER BY created_at DESC 
LIMIT 10;

-- Monitor communications by provider
SELECT provider, comm_type, COUNT(*) 
FROM communications 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY provider, comm_type;
```
