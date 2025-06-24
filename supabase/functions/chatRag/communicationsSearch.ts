
export async function searchCommunications(
  supabase: any,
  questionEmbedding: number[],
  projectId: string,
  matchCount: number = 10
): Promise<any[]> {
  console.log('🔍 Searching communications for relevant context...');
  
  const { data: commResults, error: commError } = await supabase.rpc('search_communications', {
    query_embedding: questionEmbedding,
    project_uuid: projectId,
    match_count: matchCount,
    similarity_threshold: 0.7
  });

  if (commError) {
    console.error('Communication search error:', commError);
    return [];
  }

  const communications = commResults || [];
  console.log(`Found ${communications.length} relevant communications`);
  
  return communications;
}
