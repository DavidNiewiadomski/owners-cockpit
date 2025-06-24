
export interface ChatRequest {
  question: string;
  project_id: string;
  conversation_id?: string;
  search_only?: boolean;
  include_communications?: boolean;
  match_count?: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateChatRequest(body: any): ValidationResult {
  if (!body) {
    return {
      isValid: false,
      error: 'Request body is required'
    };
  }

  if (!body.question || typeof body.question !== 'string') {
    return {
      isValid: false,
      error: 'Question is required and must be a string'
    };
  }

  if (!body.project_id || typeof body.project_id !== 'string') {
    return {
      isValid: false,
      error: 'Project ID is required and must be a string'
    };
  }

  if (body.match_count && (typeof body.match_count !== 'number' || body.match_count < 1)) {
    return {
      isValid: false,
      error: 'Match count must be a positive number'
    };
  }

  return {
    isValid: true
  };
}
