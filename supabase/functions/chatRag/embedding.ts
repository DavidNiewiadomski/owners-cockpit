
export async function createEmbedding(question: string, geminiKey: string): Promise<number[]> {
  console.log('Creating embedding for question...');
  
  const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'models/text-embedding-004',
      content: {
        parts: [{ text: question }]
      }
    }),
  });

  if (!embeddingResponse.ok) {
    const errorText = await embeddingResponse.text();
    console.error('Gemini embedding API error:', errorText);
    throw new Error(`Embedding API error: ${embeddingResponse.statusText}`);
  }

  const embeddingData = await embeddingResponse.json();
  return embeddingData.embedding.values;
}
