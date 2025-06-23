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

**Environment Variables Required:**
- `OPENAI_KEY`: OpenAI API key for embeddings and vision processing

## Security

All tables have Row Level Security (RLS) enabled with project-based access control. Users can only access data from projects they own.

## Performance

- Optimized indexes on foreign keys and status fields
- HNSW index on vector embeddings for fast similarity search
- Automatic `updated_at` timestamp triggers

## Testing

Run Edge Function tests:
```bash
deno test tests/procoreSync.test.ts
```
