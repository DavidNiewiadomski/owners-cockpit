
export interface ChatRequest {
  project_id: string;
  question: string;
  conversation_id?: string;
}

export interface Citation {
  id: string;
  snippet: string;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ProjectContext {
  name?: string;
  status?: string;
  description?: string;
  taskSummary: Record<string, number>;
  budgetSummary: {
    budgeted: number;
    actual: number;
  };
}
