
import { ChatRequest } from './types.ts';

export function validateRequest(body: any): ChatRequest {
  const { project_id, question, conversation_id } = body;

  if (!project_id || !question) {
    throw new Error('project_id and question are required');
  }

  return { project_id, question, conversation_id };
}

export function validateEnvironment(): string {
  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return geminiKey;
}
