
export async function searchDocuments(
  supabase: any,
  questionEmbedding: number[],
  projectId: string
): Promise<any[]> {
  console.log('Searching for relevant documents...');
  
  const { data: vectorResults, error: vectorError } = await supabase.rpc('match_documents', {
    query_embedding: questionEmbedding,
    match_count: 12,
    filter_project_id: projectId
  });

  if (vectorError) {
    console.error('Vector search error:', vectorError);
  }

  const chunks = vectorResults || [];
  console.log(`Found ${chunks.length} relevant chunks`);
  
  return chunks;
}
