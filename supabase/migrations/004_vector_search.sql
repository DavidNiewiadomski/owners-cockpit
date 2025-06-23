
-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT 12,
  filter_project_id uuid DEFAULT NULL
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
BEGIN
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
    (filter_project_id IS NULL OR vector_index.project_id = filter_project_id)
    AND vector_index.embedding IS NOT NULL
  ORDER BY vector_index.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
