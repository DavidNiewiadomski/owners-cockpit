
-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT 12,
  filter_project_id text DEFAULT NULL
)
RETURNS TABLE (
  chunk_id uuid,
  project_id uuid,
  doc_id uuid,
  image_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
DECLARE
  project_uuid uuid;
BEGIN
  -- Try to convert project_id to UUID, if it fails, try to find by external_id
  IF filter_project_id IS NOT NULL THEN
    BEGIN
      project_uuid := filter_project_id::uuid;
    EXCEPTION WHEN invalid_text_representation THEN
      -- If conversion fails, look up by external_id in projects table
      SELECT id INTO project_uuid FROM projects WHERE external_id = filter_project_id LIMIT 1;
      IF project_uuid IS NULL THEN
        -- If still not found, return empty result
        RETURN;
      END IF;
    END;
  END IF;

  RETURN QUERY
  SELECT
    vector_index.chunk_id,
    vector_index.project_id,
    vector_index.doc_id,
    vector_index.image_id,
    vector_index.content,
    vector_index.metadata,
    1 - (vector_index.embedding <=> query_embedding) AS similarity
  FROM vector_index
  WHERE 
    (project_uuid IS NULL OR vector_index.project_id = project_uuid)
    AND vector_index.embedding IS NOT NULL
  ORDER BY vector_index.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
