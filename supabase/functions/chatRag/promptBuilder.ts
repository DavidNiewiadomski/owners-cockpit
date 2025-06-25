
export function buildPrompt(params: {
  question: string;
  documentChunks: any[];
  communicationResults: any[];
  projectData?: unknown;
  conversationId?: string;
  context?: any;
  enableActions?: boolean;
}) {
  const { 
    question, 
    documentChunks, 
    communicationResults, 
    projectData,
    context = {},
    enableActions = false 
  } = params;

  let contextInfo = '';
  
  // Add project/portfolio context
  if (projectData) {
    if (projectData.summary) {
      contextInfo += `Portfolio Context: ${projectData.summary}\n\n`;
    }
    
    if (projectData.risks && projectData.risks.length > 0) {
      contextInfo += `Current Portfolio Risks:\n`;
      projectData.risks.forEach((risk: unknown, index: number) => {
        contextInfo += `${index + 1}. ${risk.type} (${risk.severity}): ${risk.description}\n`;
        contextInfo += `   Impact: ${risk.impact}\n`;
        if (risk.affectedProjects && risk.affectedProjects.length > 0) {
          contextInfo += `   Affected Projects: ${risk.affectedProjects.join(', ')}\n`;
        }
        contextInfo += '\n';
      });
    }

    if (projectData.projects && projectData.projects.length > 0) {
      contextInfo += `Portfolio Projects:\n`;
      projectData.projects.slice(0, 10).forEach((project: unknown) => {
        contextInfo += `- ${project.name} (${project.status})\n`;
      });
      contextInfo += '\n';
    }
  }

  // Add document context
  if (documentChunks && documentChunks.length > 0) {
    contextInfo += 'Relevant Document Information:\n';
    documentChunks.slice(0, 5).forEach((chunk, index) => {
      contextInfo += `${index + 1}. ${chunk.content.substring(0, 300)}...\n\n`;
    });
  }

  // Add communication context
  if (communicationResults && communicationResults.length > 0) {
    contextInfo += 'Recent Communications:\n';
    communicationResults.slice(0, 3).forEach((comm, index) => {
      const subject = comm.subject || 'No subject';
      const body = (comm.body || '').substring(0, 200);
      contextInfo += `${index + 1}. ${subject}: ${body}...\n\n`;
    });
  }

  const contextualInfo = context.systemPrompt || '';
  const currentPage = context.activeView || 'dashboard';
  const userRole = context.userRole || 'Building Owner/Manager';
  
  const prompt = `You are an advanced AI assistant for a construction management platform with full integration capabilities.

${contextualInfo}

Current Context:
- User Role: ${userRole}
- Current Page: ${currentPage}
- Project: ${projectData?.name || 'Portfolio View'}
- Timestamp: ${new Date().toISOString()}

You have access to:
- Project documents, specifications, and reports  
- Communication history (emails, Teams messages, Slack conversations)
- Real-time project status and metrics
- Safety records and compliance data
- Financial information and budgets
- Microsoft Teams integration (can send messages, create channels)
- Outlook integration (can send emails, create meetings)
- Platform actions (create tasks, update status, generate reports)

${contextInfo}

User Question: ${question}

When responding:
1. Use specific data from the provided context
2. Cite sources when referencing documents or communications  
3. Provide actionable recommendations
4. Focus on safety, compliance, efficiency, and cost-effectiveness
5. Be conversational and helpful like talking to a human colleague
6. ${enableActions ? 'When appropriate, offer to perform specific actions by including [ACTION:description] in your response' : 'Provide information and suggestions'}

If asked to perform actions, use this format: [ACTION:send Teams message to project manager about schedule delay]

Respond as if you\'re an expert construction professional with access to all project data and integration tools.

Response:`;

  return prompt;
}
