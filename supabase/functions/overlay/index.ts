
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt }: OverlayRequest = await req.json();

    if (!prompt?.trim()) {
      throw new Error('Prompt is required');
    }

    const response = await processOverlayCommand(prompt.trim());

    // Save to overlay history
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        await supabase
          .from('overlay_history')
          .insert({
            user_id: user.id,
            prompt: prompt.trim(),
            response: response,
            created_at: new Date().toISOString()
          });
      }
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Overlay API error:', error);
    return new Response(
      JSON.stringify({ 
        action: 'chat',
        message: 'Sorry, I encountered an error processing your request.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

const processOverlayCommand = async (prompt: string): Promise<OverlayResponse> => {
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

  // Summary patterns
  if (lowerPrompt.includes('summarize') || lowerPrompt.includes('summary')) {
    return handleSummaryRequest(prompt);
  }

  // Default to chat response
  return {
    action: 'chat',
    message: `I understand you want to: "${prompt}". I can help you navigate, query data, create items, or provide summaries. Try starting with "Go to", "Show", "Create", or "Summarize".`
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

  // Extract project names
  const projectMatch = lowerPrompt.match(/project\s+(\w+)/);
  if (projectMatch) {
    return {
      action: 'navigate',
      path: `/projects/project-1?view=dashboard`,
      message: `Opening ${projectMatch[1]} project`
    };
  }

  return {
    action: 'chat',
    message: "I can help you navigate. Try: 'Go to Portfolio', 'Go to Dashboard', 'Go to Communications', or 'Go to Project [name]'."
  };
};

const handleDataQuery = (prompt: string): OverlayResponse => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('budget') && (lowerPrompt.includes('chart') || lowerPrompt.includes('overrun'))) {
    return {
      action: 'navigate',
      path: '/projects?view=dashboard&highlight=budget',
      message: 'Displaying budget analysis'
    };
  }

  if (lowerPrompt.includes('risk') && lowerPrompt.includes('pie')) {
    return {
      action: 'navigate',
      path: '/projects?view=dashboard&highlight=risk',
      message: 'Showing risk distribution chart'
    };
  }

  if (lowerPrompt.includes('schedule')) {
    return {
      action: 'navigate',
      path: '/projects?view=dashboard&highlight=schedule',
      message: 'Opening schedule view'
    };
  }

  return {
    action: 'query',
    message: `Searching for: ${prompt}`
  };
};

const handleToolInvocation = (prompt: string): OverlayResponse => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('rfi')) {
    const title = extractRFITitle(prompt);
    return {
      action: 'tool',
      toolName: 'create_rfi',
      toolArgs: { title },
      message: `Creating RFI: ${title}`
    };
  }

  if (lowerPrompt.includes('task') || lowerPrompt.includes('todo')) {
    return {
      action: 'tool',
      toolName: 'create_task',
      message: 'Creating new task...'
    };
  }

  return {
    action: 'chat',
    message: 'I can help you create RFIs, tasks, and other items. What would you like to create?'
  };
};

const handleSummaryRequest = (prompt: string): OverlayResponse => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('meeting')) {
    return {
      action: 'tool',
      toolName: 'summarize_meetings',
      message: 'Summarizing recent meetings...'
    };
  }

  if (lowerPrompt.includes('project')) {
    return {
      action: 'tool',
      toolName: 'project_summary',
      message: 'Generating project summary...'
    };
  }

  return {
    action: 'chat',
    message: 'I can summarize meetings, projects, or communications. What would you like me to summarize?'
  };
};

const extractRFITitle = (prompt: string): string => {
  const match = prompt.match(/rfi about (.+)/i) || prompt.match(/rfi for (.+)/i);
  return match ? match[1].trim() : 'New RFI Request';
};
