import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SummariseNotesParams {
  notes_markdown: string;
}

export interface SuggestNextActionParams {
  last_contact_date: string;
  stage: string;
  company_name?: string;
  contact_name?: string;
  interaction_history?: string[];
}

export interface NextActionSuggestion {
  action: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

class CRMAssistant {
  private assistantId: string | null = null;

  async initialize(): Promise<void> {
    try {
      // Check if assistant already exists
      const assistants = await openai.beta.assistants.list();
      const existingAssistant = assistants.data.find(
        assistant => assistant.name === 'crm-bot'
      );

      if (existingAssistant) {
        this.assistantId = existingAssistant.id;
        console.log('Using existing CRM bot assistant:', this.assistantId);
        return;
      }

      // Create new assistant
      const assistant = await openai.beta.assistants.create({
        name: 'crm-bot',
        instructions: `You are a relationship-manager assistant for construction owners. Your primary responsibilities are:

1. **Summarize call notes and interactions** - Transform raw meeting notes into concise, actionable summaries that highlight:
   - Key discussion points
   - Decisions made
   - Action items identified
   - Relationship insights
   - Project status updates

2. **Suggest next follow-up actions** - Based on interaction history and opportunity stage, recommend:
   - Specific follow-up actions
   - Optimal timing for next contact
   - Priority level based on opportunity value and stage
   - Relationship maintenance strategies

**Context**: You work with construction project owners who manage relationships with:
- Subcontractors (sub)
- General contractors (gc) 
- Suppliers
- Architects & Engineers (a/e)

**Opportunity Stages**: prospect → shortlisted → invited → negotiation → closed

**Tone**: Professional, concise, action-oriented. Focus on maintaining strong business relationships and advancing opportunities through the pipeline.`,
        model: 'gpt-4o',
        tools: [
          {
            type: 'function',
            function: {
              name: 'summarise_notes',
              description: 'Summarize interaction notes into actionable markdown format',
              parameters: {
                type: 'object',
                properties: {
                  notes_markdown: {
                    type: 'string',
                    description: 'Raw notes from the interaction in markdown format'
                  }
                },
                required: ['notes_markdown']
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'suggest_next_action',
              description: 'Suggest next follow-up action based on last contact date and opportunity stage',
              parameters: {
                type: 'object',
                properties: {
                  last_contact_date: {
                    type: 'string',
                    format: 'date',
                    description: 'Date of last contact (YYYY-MM-DD)'
                  },
                  stage: {
                    type: 'string',
                    enum: ['prospect', 'shortlisted', 'invited', 'negotiation', 'closed'],
                    description: 'Current opportunity stage'
                  },
                  company_name: {
                    type: 'string',
                    description: 'Name of the company'
                  },
                  contact_name: {
                    type: 'string',
                    description: 'Name of the primary contact'
                  },
                  interaction_history: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    description: 'Recent interaction summaries for context'
                  }
                },
                required: ['last_contact_date', 'stage']
              }
            }
          }
        ]
      });

      this.assistantId = assistant.id;
      console.log('Created new CRM bot assistant:', this.assistantId);
    } catch (error) {
      console.error('Failed to initialize CRM assistant:', error);
      throw error;
    }
  }

  async summariseNotes(params: SummariseNotesParams): Promise<string> {
    if (!this.assistantId) {
      await this.initialize();
    }

    try {
      // Create a thread
      const thread = await openai.beta.threads.create();

      // Add message to thread
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: `Please summarize these interaction notes into a clear, actionable format:

${params.notes_markdown}

Focus on:
- Key discussion points
- Decisions made
- Action items
- Next steps
- Relationship insights

Format as clean markdown with clear sections.`
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: this.assistantId!,
        tools: [
          {
            type: 'function',
            function: {
              name: 'summarise_notes',
              description: 'Summarize interaction notes into actionable markdown format',
              parameters: {
                type: 'object',
                properties: {
                  notes_markdown: {
                    type: 'string',
                    description: 'Raw notes from the interaction in markdown format'
                  }
                },
                required: ['notes_markdown']
              }
            }
          }
        ]
      });

      // Wait for completion
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      if (runStatus.status === 'completed') {
        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];
        
        if (lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text') {
          return lastMessage.content[0].text.value;
        }
      }

      throw new Error(`Assistant run failed with status: ${runStatus.status}`);
    } catch (error) {
      console.error('Failed to summarize notes:', error);
      throw error;
    }
  }

  async suggestNextAction(params: SuggestNextActionParams): Promise<NextActionSuggestion> {
    if (!this.assistantId) {
      await this.initialize();
    }

    try {
      // Create a thread
      const thread = await openai.beta.threads.create();

      // Prepare context
      const contextInfo = [
        `Company: ${params.company_name || 'Unknown'}`,
        `Contact: ${params.contact_name || 'Unknown'}`,
        `Last Contact Date: ${params.last_contact_date}`,
        `Current Stage: ${params.stage}`,
        `Days Since Last Contact: ${Math.floor((new Date().getTime() - new Date(params.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))}`
      ];

      if (params.interaction_history && params.interaction_history.length > 0) {
        contextInfo.push('\nRecent Interaction History:');
        params.interaction_history.forEach((interaction, index) => {
          contextInfo.push(`${index + 1}. ${interaction}`);
        });
      }

      // Add message to thread
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: `Based on the following relationship context, suggest the next best action to take:

${contextInfo.join('\n')}

Please provide:
1. Specific action to take
2. Recommended due date
3. Priority level (high/medium/low)
4. Brief reasoning

Consider the opportunity stage, time since last contact, and relationship momentum.`
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: this.assistantId!
      });

      // Wait for completion
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      if (runStatus.status === 'completed') {
        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];
        
        if (lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text') {
          const response = lastMessage.content[0].text.value;
          
          // Parse the response to extract structured data
          return this.parseActionSuggestion(response, params.last_contact_date);
        }
      }

      throw new Error(`Assistant run failed with status: ${runStatus.status}`);
    } catch (error) {
      console.error('Failed to suggest next action:', error);
      throw error;
    }
  }

  private parseActionSuggestion(response: string, lastContactDate: string): NextActionSuggestion {
    // Simple parsing logic - in production, this could be more sophisticated
    const lines = response.split('\n').filter(line => line.trim());
    
    let action = '';
    let priority: 'high' | 'medium' | 'low' = 'medium';
    let reasoning = '';
    
    // Extract action (look for lines that seem like actions)
    for (const line of lines) {
      if (line.toLowerCase().includes('action:') || 
          line.toLowerCase().includes('recommend') || 
          line.toLowerCase().includes('suggest')) {
        action = line.replace(/^.*?:/, '').trim();
        break;
      }
    }
    
    // Extract priority
    if (response.toLowerCase().includes('high priority')) {
      priority = 'high';
    } else if (response.toLowerCase().includes('low priority')) {
      priority = 'low';
    }
    
    // Use the full response as reasoning if no specific action found
    if (!action) {
      action = lines[0] || 'Follow up with contact';
      reasoning = response;
    } else {
      reasoning = response;
    }
    
    // Calculate due date based on priority and last contact
    const lastContact = new Date(lastContactDate);
    const today = new Date();
    const daysSinceContact = Math.floor((today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
    
    let daysToAdd = 7; // Default: 1 week
    if (priority === 'high') {
      daysToAdd = Math.max(1, 3 - daysSinceContact);
    } else if (priority === 'low') {
      daysToAdd = Math.max(7, 14 - daysSinceContact);
    }
    
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + daysToAdd);
    
    return {
      action: action.substring(0, 200), // Limit action length
      due_date: dueDate.toISOString().split('T')[0],
      priority,
      reasoning: reasoning.substring(0, 500) // Limit reasoning length
    };
  }
}

export const crmAssistant = new CRMAssistant();
