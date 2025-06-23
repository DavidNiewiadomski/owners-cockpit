
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
```

### Manual Application
```bash
# Connect to your Postgres instance
psql "postgresql://user:pass@host:5432/dbname"

# Run migrations in order
\i supabase/migrations/000_init.sql
\i supabase/migrations/001_pgvector.sql
\i supabase/migrations/002_tables.sql
```

## Schema Overview

- **Projects**: Root entity for construction projects
- **Tasks**: Work items linked to projects  
- **Budget Items**: Financial tracking per project
- **RFI**: Request for Information documents
- **Documents**: File storage with processing status
- **Images**: Separate image handling with OCR support
- **Vector Index**: Embeddings for RAG with 1536-dim vectors

## Security

All tables have Row Level Security (RLS) enabled with project-based access control. Users can only access data from projects they own.

## Performance

- Optimized indexes on foreign keys and status fields
- HNSW index on vector embeddings for fast similarity search
- Automatic `updated_at` timestamp triggers
