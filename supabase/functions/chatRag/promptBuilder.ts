
interface PromptBuilderParams {
  question: string;
  documentChunks: any[];
  communicationResults?: any[];
  projectData: any;
  conversationId?: string;
}

export function buildPrompt({ 
  question, 
  documentChunks, 
  communicationResults = [],
  projectData,
  conversationId 
}: PromptBuilderParams): string {
  
  let contextSections = [];

  // Document context
  if (documentChunks.length > 0) {
    const documentContext = documentChunks
      .map((chunk, index) => `[Doc ${index + 1}] ${chunk.content}`)
      .join('\n\n');
    contextSections.push(`**Document Context:**\n${documentContext}`);
  }

  // Communication context
  if (communicationResults.length > 0) {
    const communicationContext = communicationResults
      .map((comm, index) => {
        const speaker = comm.speaker?.name || 'Unknown';
        const timestamp = new Date(comm.message_ts).toLocaleDateString();
        const subject = comm.subject ? `Subject: ${comm.subject}` : '';
        const body = comm.body || 'No content';
        const commType = comm.comm_type.replace('_', ' ');
        
        return `[Comm ${index + 1}] ${commType} from ${speaker} (${timestamp})
${subject}
${body.substring(0, 300)}${body.length > 300 ? '...' : ''}`;
      })
      .join('\n\n');
    contextSections.push(`**Communication Context:**\n${communicationContext}`);
  }

  // Project data context
  if (projectData) {
    const projectContext = `**Project Information:**
- Name: ${projectData.name}
- Status: ${projectData.status}
- Budget Items: ${projectData.budget_items?.length || 0}
- Tasks: ${projectData.tasks?.length || 0}
- RFIs: ${projectData.rfis?.length || 0}`;
    contextSections.push(projectContext);
  }

  // Build the complete prompt
  const context = contextSections.join('\n\n');

  return `You are an AI assistant for construction project management. Use the following context to answer the user's question about their project.

${context}

**Instructions:**
- Provide accurate, helpful answers based on the context provided
- When referencing information from communications, mention the speaker and approximate date
- When referencing documents, cite them appropriately
- If the context doesn't contain enough information to answer the question, say so clearly
- Focus on construction project management topics
- Be concise but comprehensive

**Question:** ${question}

**Answer:**`;
}
