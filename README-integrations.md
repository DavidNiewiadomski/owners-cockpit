
# Integrations Demo Seeder

This document explains how to set up and run the integrations demo seeder for the Owners Cockpit construction dashboard.

## Overview

The integrations seeder populates the database with realistic integration data to make the Integrations page look live even without real API keys. It supports live status toggling (Connected → Error → Syncing) for demonstration purposes.

## Components

### 1. Seed Script (`scripts/seedIntegrations.ts`)

Seeds the database with integration data for demo projects:
- **Office Tower** - Downtown commercial office building
- **Data Center** - High-tech data center facility  
- **Hospital Wing** - Medical facility expansion project

For each project, creates integrations for 5 providers:
- **Procore** (Connected, last sync 3 hours ago)
- **Primavera** (Error, last sync 2 days ago)
- **Box** (Connected, last sync 30 minutes ago)  
- **IoT Sensors** (Not Connected)
- **Smartsheet** (Connected, last sync 1 hour ago)

### 2. Mock Sync Edge Function (`supabase/functions/mockSync`)

Simulates real integration sync operations:
- Accepts `{project_id, provider}` in request body
- Updates status to "syncing" 
- Waits 2 seconds to simulate API call
- Updates status to "connected" with current timestamp
- Handles errors and updates status accordingly

### 3. Realtime Updates

The IntegrationsPage component subscribes to realtime changes:
- Listens to `project_integrations` table changes
- Shows optimistic UI with "Syncing..." status
- Automatically refreshes data when changes occur

## Setup Instructions

### Prerequisites
- Node.js and npm/pnpm installed
- Supabase project configured
- Deno installed for running scripts

### Running the Seeder

1. **Run the seed script:**
   ```bash
   deno run --allow-net scripts/seedIntegrations.ts
   ```

2. **Start the development server:**
   ```bash
   pnpm dev
   ```

3. **Navigate to Integrations page:**
   - Go to any project dashboard
   - Click on "Integrations" in the sidebar
   - You should see 5 integration cards with various statuses

### Testing the Demo

1. **View Integration Status:**
   - Connected integrations show green "Connected" badge
   - Error integrations show red "Error" badge with error message
   - Not connected integrations show gray "Not Connected" badge

2. **Test Sync Functionality:**
   - Click "Sync Now" on any connected integration
   - Status changes to blue "Syncing" badge with spinner
   - After 2 seconds, updates to "Connected" with new timestamp
   - Last sync time updates to "a few seconds ago"

3. **Realtime Updates:**
   - Open integration page in multiple browser tabs
   - Trigger sync in one tab
   - Other tabs automatically update in real-time

## Database Schema

The seeder populates the `project_integrations` table:

```sql
CREATE TABLE project_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    provider TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_connected',
    api_key TEXT,
    refresh_token TEXT,
    oauth_data JSONB DEFAULT '{}',
    last_sync TIMESTAMPTZ,
    sync_error TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Provider Configuration

Each provider has specific configuration in `PROVIDER_CONFIG`:

```typescript
{
  procore: { name: 'Procore', logo: '🏗️', description: 'Construction management platform' },
  primavera: { name: 'Primavera P6', logo: '📊', description: 'Project portfolio management' },
  box: { name: 'Box', logo: '📁', description: 'Cloud file storage' },
  iot_sensors: { name: 'IoT Sensors', logo: '📡', description: 'Building sensors and monitoring' },
  smartsheet: { name: 'Smartsheet', logo: '📋', description: 'Work management platform' }
}
```

## Troubleshooting

### Common Issues

1. **No projects found:**
   - The seeder automatically creates demo projects if none exist
   - Check Supabase database for projects table

2. **Permission errors:**
   - Ensure proper RLS policies are set on project_integrations table
   - Check user authentication and project access

3. **Realtime not working:**
   - Verify Supabase realtime is enabled for project_integrations table
   - Check browser console for subscription errors

### Debug Mode

Add console logging to track operations:
```typescript
console.log('🔄 Setting up realtime subscription for integrations');
console.log('📡 Integration realtime update:', payload);
```

## Performance Notes

- Seed script uses batch inserts for efficiency
- Realtime subscriptions are project-specific to reduce noise
- Mock sync function includes proper error handling and timeouts

---

For additional support, check the Supabase logs and browser developer console for detailed error messages.
