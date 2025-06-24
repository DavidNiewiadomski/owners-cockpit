
export async function searchCommunications(supabase: any, queryEmbedding: number[], projectId: string, matchCount: number = 10) {
  console.log('🔍 Searching communications for relevant context...');
  
  try {
    if (projectId === 'portfolio') {
      // For portfolio queries, search across all communications
      const { data: communications, error } = await supabase
        .from('communications')
        .select('*')
        .not('embedding', 'is', null)
        .order('message_ts', { ascending: false })
        .limit(matchCount);

      if (error) {
        console.error('Communication search error:', error);
        return [];
      }

      return communications || [];
    } else {
      // Use the existing search function for specific projects
      const { data: communications, error } = await supabase
        .rpc('search_communications', {
          query_embedding: queryEmbedding,
          project_uuid: projectId,
          match_count: matchCount
        });

      if (error) {
        console.error('Communication search error:', error);
        return [];
      }

      return communications || [];
    }
  } catch (error) {
    console.error('Communication search error:', error);
    return [];
  }
}
