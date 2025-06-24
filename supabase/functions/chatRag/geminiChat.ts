
export async function generateResponse(prompt: string, geminiKey: string): Promise<string> {
  console.log('Calling Gemini chat completion...');
  
  const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
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

  return answer;
}
