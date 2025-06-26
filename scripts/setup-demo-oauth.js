#!/usr/bin/env node

/**
 * Demo OAuth Setup Script
 * This script sets up demo OAuth credentials for testing the communication integrations.
 * In production, you would register apps with each provider and set real credentials.
 */

console.log('🚀 Setting up demo OAuth credentials for testing...\n');

const demoCredentials = {
  outlook: {
    provider: 'Microsoft Outlook',
    note: 'Register at: https://portal.azure.com (Azure AD App Registration)',
    demoClientId: 'demo-outlook-client-id',
    scopes: ['Mail.Read', 'Mail.Send', 'User.Read', 'Calendars.Read']
  },
  teams: {
    provider: 'Microsoft Teams',
    note: 'Uses same Azure AD app as Outlook',
    demoClientId: 'demo-teams-client-id',
    scopes: ['User.Read', 'Chat.Read', 'Team.ReadBasic.All', 'Channel.ReadBasic.All']
  },
  zoom: {
    provider: 'Zoom',
    note: 'Register at: https://marketplace.zoom.us/develop/create',
    demoClientId: 'demo-zoom-client-id',
    scopes: ['user:read', 'meeting:read', 'webinar:read', 'recording:read']
  },
  slack: {
    provider: 'Slack',
    note: 'Register at: https://api.slack.com/apps',
    demoClientId: 'demo-slack-client-id',
    scopes: ['channels:read', 'chat:write', 'users:read', 'team:read']
  },
  whatsapp: {
    provider: 'WhatsApp Business',
    note: 'Register at: https://developers.facebook.com/apps',
    demoClientId: 'demo-whatsapp-client-id',
    scopes: ['whatsapp_business_management', 'whatsapp_business_messaging']
  }
};

console.log('📋 Demo OAuth Provider Setup:');
console.log('='.repeat(60));

for (const [key, config] of Object.entries(demoCredentials)) {
  console.log(`\n🔐 ${config.provider}`);
  console.log(`   Client ID: ${config.demoClientId}`);
  console.log(`   Scopes: ${config.scopes.join(', ')}`);
  console.log(`   Note: ${config.note}`);
}

console.log('\n' + '='.repeat(60));
console.log('⚠️  IMPORTANT SETUP INSTRUCTIONS:');
console.log('='.repeat(60));
console.log(`
📝 To set up real OAuth integrations, you need to:

1. 🔹 MICROSOFT (Outlook & Teams):
   - Go to https://portal.azure.com
   - Create new "App Registration"
   - Add redirect URI: ${process.env.VITE_SITE_URL || 'http://localhost:5173'}/auth/callback/outlook
   - Add redirect URI: ${process.env.VITE_SITE_URL || 'http://localhost:5173'}/auth/callback/teams
   - Copy Client ID and create Client Secret
   - Set environment variables in Supabase Edge Functions

2. 🔹 ZOOM:
   - Go to https://marketplace.zoom.us/develop/create
   - Create OAuth app
   - Add redirect URI: ${process.env.VITE_SITE_URL || 'http://localhost:5173'}/auth/callback/zoom
   - Copy Client ID and Client Secret

3. 🔹 SLACK:
   - Go to https://api.slack.com/apps
   - Create new Slack app
   - Add redirect URI: ${process.env.VITE_SITE_URL || 'http://localhost:5173'}/auth/callback/slack
   - Copy Client ID and Client Secret

4. 🔹 WHATSAPP BUSINESS:
   - Go to https://developers.facebook.com/apps
   - Create new app, select WhatsApp Business
   - Add redirect URI: ${process.env.VITE_SITE_URL || 'http://localhost:5173'}/auth/callback/whatsapp
   - Copy App ID and App Secret

5. 🔹 SET SUPABASE SECRETS:
   Run these commands in your Supabase CLI:
   
   supabase secrets set MICROSOFT_CLIENT_ID=your_azure_client_id
   supabase secrets set MICROSOFT_CLIENT_SECRET=your_azure_client_secret
   supabase secrets set ZOOM_CLIENT_ID=your_zoom_client_id
   supabase secrets set ZOOM_CLIENT_SECRET=your_zoom_client_secret
   supabase secrets set SLACK_CLIENT_ID=your_slack_client_id
   supabase secrets set SLACK_CLIENT_SECRET=your_slack_client_secret
   supabase secrets set WHATSAPP_CLIENT_ID=your_whatsapp_app_id
   supabase secrets set WHATSAPP_CLIENT_SECRET=your_whatsapp_app_secret

6. 🔹 DEPLOY EDGE FUNCTIONS:
   supabase functions deploy get-oauth-credentials
   supabase functions deploy oauth-exchange
   supabase functions deploy oauth-refresh

7. 🔹 RUN DATABASE MIGRATION:
   supabase db push
`);

console.log('\n✅ Demo setup complete! You can now test the OAuth integration buttons.');
console.log('💡 Click any communication provider icon in the header to test the flow.');
console.log('⚠️  Remember to set up real credentials for production use!\n');
