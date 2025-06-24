
export async function createEmbedding(text: string, geminiKey: string): Promise<number[]> {
  console.log('Creating embedding for question...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text }]
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini embedding API error:', errorText);
      throw new Error(`Embedding API error: ${response.statusText}`);
    }

    const data = await response.json();
    const embedding = data.embedding?.values || [];
    
    if (embedding.length === 0) {
      throw new Error('No embedding generated');
    }

    return embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}
