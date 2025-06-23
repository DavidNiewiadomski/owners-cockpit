
import { Citation, ChatResponse } from './types.ts';

export async function generateChatResponse(
  systemPrompt: string,
  question: string,
  geminiKey: string
): Promise<{ answer: string; usage: any }> {
  console.log('Calling Gemini chat completion...');
  
  const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: systemPrompt + '\n\nUser question: ' + question }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      },
    }),
  });

  if (!chatResponse.ok) {
    const errorText = await chatResponse.text();
    console.error('Gemini chat API error:', errorText);
    throw new Error(`Chat API error: ${chatResponse.statusText}`);
  }

  const chatData = await chatResponse.json();
  const answer = chatData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

  const usage = {
    prompt_tokens: chatData.usageMetadata?.promptTokenCount || 0,
    completion_tokens: chatData.usageMetadata?.candidatesTokenCount || 0,
    total_tokens: chatData.usageMetadata?.totalTokenCount || 0,
  };

  return { answer, usage };
}

export function prepareCitations(chunks: any[]): Citation[] {
  return chunks.slice(0, 5).map((chunk) => ({
    id: chunk.chunk_id,
    snippet: chunk.content.substring(0, 150) + '...'
  }));
}
