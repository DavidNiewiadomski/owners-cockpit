
export async function searchDocuments(supabase: any, queryEmbedding: number[], projectId: string, matchCount: number = 5) {
  console.log('Searching for relevant documents...');
  
  try {
    // If projectId is "portfolio", search across all projects the user has access to
    if (projectId === 'portfolio') {
      const { data: chunks, error } = await supabase
        .rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_count: matchCount,
          filter_project_id: null // Search across all projects
        });

      if (error) {
        console.error('Vector search error:', error);
        return [];
      }

      console.log(`Found ${chunks?.length || 0} relevant chunks`);
      return chunks || [];
    } else {
      // Search for specific project
      const { data: chunks, error } = await supabase
        .rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_count: matchCount,
          filter_project_id: projectId
        });

      if (error) {
        console.error('Vector search error:', error);
        return [];
      }

      console.log(`Found ${chunks?.length || 0} relevant chunks`);
      return chunks || [];
    }
  } catch (error) {
    console.error('Vector search error:', error);
    return [];
  }
}
