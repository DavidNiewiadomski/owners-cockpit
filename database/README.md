
# Owners Cockpit Database Schema

## Applying Migrations

### Using Supabase CLI
```bash
# Apply all migrations
supabase db push

# Or apply individual files in order
supabase db push --file supabase/migrations/000_init.sql
supabase db push --file supabase/migrations/001_pgvector.sql  
supabase db push --file supabase/migrations/002_tables.sql
supabase db push --file supabase/migrations/003_integration_logs.sql
supabase db push --file supabase/migrations/004_vector_search.sql
supabase db push --file supabase/migrations/005_reports_table.sql
supabase db push --file supabase/migrations/006_alerts_table.sql
```

### Manual Application
```bash
# Connect to your Postgres instance
psql "postgresql://user:pass@host:5432/dbname"

# Run migrations in order
\i supabase/migrations/000_init.sql
\i supabase/migrations/001_pgvector.sql
\i supabase/migrations/002_tables.sql
\i supabase/migrations/003_integration_logs.sql
\i supabase/migrations/004_vector_search.sql
\i supabase/migrations/005_reports_table.sql
\i supabase/migrations/006_alerts_table.sql
```

## Schema Overview

- **Projects**: Root entity for construction projects
- **Tasks**: Work items linked to projects  
- **Budget Items**: Financial tracking per project
- **RFI**: Request for Information documents
- **Documents**: File storage with processing status
- **Images**: Separate image handling with OCR support
- **Vector Index**: Embeddings for RAG with 1536-dim vectors
- **Integration Logs**: ETL operation tracking and audit trail
- **Reports**: AI-generated summaries and insights
- **Alerts**: Risk alerts and notifications with deduplication tracking

## Edge Functions

### Procore Sync (`/functions/v1/procoreSync`)
Synchronizes project and task data from Procore API.

**Usage:**
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/procoreSync' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "procore_project_id": 123,
    "access_token": "procore_access_token",
    "refresh_token": "procore_refresh_token"
  }'
```

**Response:**
```json
{
  "inserted": 5,
  "updated": 3,
  "errors": []
}
```

**CRON Schedule**: Runs daily at 02:00 UTC for automatic sync.

### Document Ingestion (`/functions/v1/ingestUpload`)
Processes uploaded documents, extracts text, generates embeddings, and stores in vector index.

**Usage:**
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/ingestUpload' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'file=@/path/to/document.pdf' \
  -F 'project_id=your-project-uuid' \
  -F 'doc_type=drawing'
```

**Response:**
```json
{
  "chunks_saved": 15,
  "doc_id": "doc-uuid",
  "file_path": "docs/project-id/file-uuid.pdf"
}
```

**Supported File Types:**
- PDFs: Text extraction + OCR for scanned pages
- Images (JPEG/PNG): OpenAI Vision + Tesseract OCR
- Document types: `drawing`, `specification`, `report`, `photo`, `contract`, `other`

### Chat RAG (`/functions/v1/chatRag`)
AI-powered question answering using Retrieval-Augmented Generation.

**Usage:**
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/chatRag' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "project_id": "your-project-uuid",
    "question": "What is the current budget status?",
    "conversation_id": "optional-conversation-uuid"
  }'
```

**Response:**
```json
{
  "answer": "Based on the project data, your current budget status shows...",
  "citations": [
    {
      "id": "chunk-uuid",
      "snippet": "Budget document excerpt..."
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 25,
    "total_tokens": 175
  }
}
```

### Weekly Summary (`/functions/v1/weeklySummary`)
Generates AI-powered weekly project summaries with key metrics and insights.

**Usage:**
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/weeklySummary' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "project_id": "your-project-uuid"
  }'
```

**Response:**
```json
{
  "success": true,
  "report_id": "report-uuid",
  "summary": "**Weekly Project Summary**\n\nThis week showed solid progress...",
  "project_name": "Construction Project Alpha",
  "posted_to_slack": true
}
```

**Features:**
- Analyzes last 7 days of project activity
- Generates ≤300-word AI summary with GPT-4
- Tracks tasks, budget, RFIs, and document metrics
- Automatically posts to Slack if webhook configured
- Stores reports in database for historical tracking

**CRON Schedule**: Runs every Friday at 17:00 UTC for automatic weekly reports.

### Risk Alert (`/functions/v1/riskAlert`)
Monitors project risks and sends Slack notifications for critical issues.

**Usage:**
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/riskAlert' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "project_id": "your-project-uuid"
  }'
```

**Response:**
```json
{
  "success": true,
  "alerts_found": 3,
  "alerts_saved": 3,
  "alerts": [
    {
      "id": "alert-uuid",
      "type": "overdue_tasks",
      "severity": "high",
      "title": "Overdue Task: Install Plumbing"
    }
  ]
}
```

**Risk Detection Rules:**
- **Overdue Tasks**: Tasks past their due date (severity based on days overdue)
- **Budget Variance**: >5% variance from budgeted amounts (severity based on percentage)
- **Overdue RFIs**: RFIs open >7 days or past due date (severity based on age)

**Features:**
- Automatic deduplication via `alerts_sent` table
- Configurable severity levels (low, medium, high, critical)
- Slack notifications with rich formatting
- Stores all alerts in database for tracking
- Metadata capture for detailed analysis

**CRON Schedule**: Runs every hour for continuous monitoring.

**Environment Variables Required:**
- `OPENAI_KEY`: OpenAI API key for embeddings and chat completions
- `SLACK_WEBHOOK_URL`: Optional Slack webhook for automatic posting

## Security

All tables have Row Level Security (RLS) enabled with project-based access control. Users can only access data from projects they own.

## Performance

- Optimized indexes on foreign keys and status fields
- HNSW index on vector embeddings for fast similarity search
- Automatic `updated_at` timestamp triggers
- Vector similarity search function for efficient RAG queries

## Testing

Run Edge Function tests:
```bash
deno test tests/procoreSync.test.ts
deno test tests/ingestUpload.test.ts
deno test tests/chatRag.test.ts
deno test tests/weeklySummary.test.ts
deno test tests/riskAlert.test.ts
```
