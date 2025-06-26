# Production OAuth Setup Guide

This guide outlines how to implement OAuth authentication for communication providers in a production environment.

## 🚀 Production Requirements

### 1. Register OAuth Applications

For each communication provider, you need to register your application:

#### **Microsoft (Outlook & Teams)**
```bash
# Go to: https://portal.azure.com
# Navigate to: Azure Active Directory > App registrations > New registration

Application Details:
- Name: "Owners Cockpit"
- Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
- Redirect URI: https://yourdomain.com/auth/callback/outlook
- Redirect URI: https://yourdomain.com/auth/callback/teams

Required API Permissions:
- Microsoft Graph: Mail.Read, Mail.Send, User.Read, Calendars.Read
- Microsoft Graph: Chat.Read, Team.ReadBasic.All, Channel.ReadBasic.All

After registration:
- Copy Application (client) ID
- Create client secret under "Certificates & secrets"
```

#### **Zoom**
```bash
# Go to: https://marketplace.zoom.us/develop/create
# Create: OAuth app

Application Details:
- App name: "Owners Cockpit"
- App type: "OAuth"
- Redirect URL: https://yourdomain.com/auth/callback/zoom

Required Scopes:
- user:read, meeting:read, webinar:read, recording:read

After creation:
- Copy Client ID and Client Secret
```

#### **Slack**
```bash
# Go to: https://api.slack.com/apps
# Create: New App > From scratch

Application Details:
- App Name: "Owners Cockpit"
- Workspace: Your development workspace
- Redirect URLs: https://yourdomain.com/auth/callback/slack

Required OAuth Scopes:
- channels:read, chat:write, users:read, team:read

After creation:
- Copy Client ID and Client Secret from "OAuth & Permissions"
```

#### **WhatsApp Business**
```bash
# Go to: https://developers.facebook.com/apps
# Create: New App > Business

Application Details:
- App Name: "Owners Cockpit"
- App Purpose: Business
- Add WhatsApp Business product
- Redirect URI: https://yourdomain.com/auth/callback/whatsapp

Required Permissions:
- whatsapp_business_management
- whatsapp_business_messaging

After setup:
- Copy App ID and App Secret
```

### 2. Environment Configuration

Set up environment variables in your production environment:

```bash
# Supabase Edge Functions Secrets
supabase secrets set MICROSOFT_CLIENT_ID=your_azure_client_id
supabase secrets set MICROSOFT_CLIENT_SECRET=your_azure_client_secret
supabase secrets set ZOOM_CLIENT_ID=your_zoom_client_id
supabase secrets set ZOOM_CLIENT_SECRET=your_zoom_client_secret
supabase secrets set SLACK_CLIENT_ID=your_slack_client_id
supabase secrets set SLACK_CLIENT_SECRET=your_slack_client_secret
supabase secrets set WHATSAPP_CLIENT_ID=your_whatsapp_app_id
supabase secrets set WHATSAPP_CLIENT_SECRET=your_whatsapp_app_secret

# Frontend Environment Variables
VITE_SITE_URL=https://yourdomain.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Deploy the database schema:

```bash
# Run database migrations
supabase db push

# Verify tables exist
supabase db ls
```

### 4. Edge Functions Deployment

Deploy the OAuth handling functions:

```bash
# Deploy all OAuth functions
supabase functions deploy get-oauth-credentials
supabase functions deploy oauth-exchange
supabase functions deploy oauth-refresh

# Verify deployment
supabase functions list
```

### 5. Production OAuth Flow

The production OAuth flow works as follows:

1. **User clicks Connect button** → Triggers `initiateOAuth(provider)`
2. **Get credentials** → Edge function retrieves client credentials securely
3. **Generate OAuth URL** → With PKCE for security
4. **Open popup** → User authenticates with provider
5. **Handle callback** → Exchange code for tokens
6. **Store tokens** → Securely in database with RLS
7. **Update UI** → Show connected status

## 🔒 Security Considerations

### Client-Side Security
- Use PKCE (Proof Key for Code Exchange) for all OAuth flows
- Validate state parameters to prevent CSRF attacks
- Store sensitive data only server-side
- Implement proper CORS policies

### Server-Side Security
- Store client secrets only in Supabase Edge Functions
- Use Row Level Security (RLS) for user data isolation
- Implement token refresh logic for expired credentials
- Log security events for monitoring

### Data Protection
- Encrypt tokens at rest
- Use HTTPS for all communications
- Implement proper session management
- Regular security audits

## 🏗️ Production Architecture

```
Frontend (React)
├── OAuth Service (client-side)
├── Connection Management
└── UI Components

Backend (Supabase)
├── Edge Functions (OAuth handling)
├── Database (encrypted token storage)
├── RLS Policies (data isolation)
└── Real-time subscriptions

External APIs
├── Microsoft Graph API
├── Zoom API
├── Slack API
└── WhatsApp Business API
```

## 📋 Production Checklist

### Pre-Launch
- [ ] Register all OAuth applications
- [ ] Configure environment variables
- [ ] Deploy database migrations
- [ ] Deploy Edge Functions
- [ ] Test OAuth flows in staging
- [ ] Security audit
- [ ] Performance testing
- [ ] Error handling validation

### Post-Launch
- [ ] Monitor OAuth success rates
- [ ] Track API rate limits
- [ ] Monitor token refresh rates
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Security monitoring

### Compliance
- [ ] Privacy policy updates
- [ ] Terms of service updates
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policies
- [ ] User consent management

## 🚨 Rate Limits & Quotas

### Microsoft Graph API
- 10,000 requests per 10 minutes per application
- Throttling and retry logic required

### Zoom API
- 100 requests per second per account
- Daily limits vary by plan

### Slack API
- Tier-based rate limiting
- Different limits per method

### WhatsApp Business API
- 250 messages per second
- Quality rating affects limits

## 🔧 Monitoring & Maintenance

### Metrics to Track
- OAuth success/failure rates
- Token refresh frequency
- API response times
- Error rates by provider
- User connection status

### Alerting
- Failed OAuth flows
- API rate limit hits
- Token refresh failures
- Security anomalies

### Maintenance Tasks
- Regular credential rotation
- API version updates
- Security patches
- Performance optimization

## 📞 Support & Troubleshooting

### Common Issues
1. **OAuth popup blocked** → User education about popup blockers
2. **Expired tokens** → Automatic refresh implementation
3. **Rate limits hit** → Exponential backoff and queuing
4. **Invalid scopes** → Proper permission requests

### Debug Tools
- Browser developer tools
- Supabase dashboard logs
- Edge function logs
- Provider-specific debugging tools

## 🔄 Future Enhancements

### Planned Features
- Multi-account support per provider
- Advanced permission management
- Bulk operations
- Webhook integrations
- Advanced analytics

### Scalability
- Connection pooling
- Caching strategies
- Load balancing
- Geographic distribution

This production setup ensures secure, scalable, and compliant OAuth integration for public release.
