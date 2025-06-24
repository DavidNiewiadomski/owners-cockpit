
// This would be implemented as a Supabase Edge Function
// For now, this shows the structure of the API endpoint

interface OverlayRequest {
  prompt: string;
}

interface OverlayResponse {
  action: 'navigate' | 'query' | 'tool' | 'chat';
  path?: string;
  data?: any;
  message?: string;
  toolName?: string;
  toolArgs?: any;
}

export const processOverlayCommand = async (prompt: string): Promise<OverlayResponse> => {
  const lowerPrompt = prompt.toLowerCase().trim();

  // Navigation patterns
  if (lowerPrompt.startsWith('go to')) {
    return handleNavigation(prompt);
  }

  // Data query patterns
  if (lowerPrompt.startsWith('show') || lowerPrompt.startsWith('display')) {
    return handleDataQuery(prompt);
  }

  // Tool invocation patterns
  if (lowerPrompt.startsWith('create') || lowerPrompt.startsWith('make')) {
    return handleToolInvocation(prompt);
  }

  // Default to chat response
  return {
    action: 'chat',
    message: "I understand you want to: " + prompt + ". Let me help you with that."
  };
};

const handleNavigation = (prompt: string): OverlayResponse => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('portfolio')) {
    return {
      action: 'navigate',
      path: '/projects',
      message: 'Going to Portfolio view'
    };
  }

  if (lowerPrompt.includes('dashboard')) {
    return {
      action: 'navigate',
      path: '/dashboard',
      message: 'Opening Dashboard'
    };
  }

  if (lowerPrompt.includes('communications')) {
    return {
      action: 'navigate',
      path: '/projects?view=communications',
      message: 'Opening Communications hub'
    };
  }

  if (lowerPrompt.includes('schedule')) {
    return {
      action: 'navigate',
      path: '/projects?view=dashboard',
      message: 'Opening Project Schedule'
    };
  }

  return {
    action: 'chat',
    message: "I'm not sure where you want to go. Can you be more specific?"
  };
};

const handleDataQuery = (prompt: string): OverlayResponse => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('budget') && lowerPrompt.includes('chart')) {
    return {
      action: 'query',
      data: { chartType: 'budget', view: 'overrun' },
      message: 'Displaying budget overrun chart'
    };
  }

  if (lowerPrompt.includes('risk') && lowerPrompt.includes('pie')) {
    return {
      action: 'query',
      data: { chartType: 'risk', view: 'distribution' },
      message: 'Showing risk distribution'
    };
  }

  return {
    action: 'query',
    message: 'Searching for: ' + prompt
  };
};

const handleToolInvocation = (prompt: string): OverlayResponse => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('rfi')) {
    return {
      action: 'tool',
      toolName: 'create_rfi',
      toolArgs: { title: extractRFITitle(prompt) },
      message: 'Creating RFI...'
    };
  }

  if (lowerPrompt.includes('meeting') && lowerPrompt.includes('summary')) {
    return {
      action: 'tool',
      toolName: 'summarize_meeting',
      message: 'Summarizing latest meeting...'
    };
  }

  return {
    action: 'chat',
    message: 'I can help you create that. What specific details do you need?'
  };
};

const extractRFITitle = (prompt: string): string => {
  // Extract RFI title from prompts like "Create RFI about steel delay"
  const match = prompt.match(/rfi about (.+)/i);
  return match ? match[1] : 'New RFI';
};
