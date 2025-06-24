
export function buildPrompt(params: {
  question: string;
  documentChunks: any[];
  communicationResults: any[];
  projectData?: any;
  conversationId?: string;
}) {
  const { question, documentChunks, communicationResults, projectData } = params;

  let contextInfo = '';
  
  // Add project/portfolio context
  if (projectData) {
    if (projectData.summary) {
      contextInfo += `Portfolio Context: ${projectData.summary}\n\n`;
    }
    
    if (projectData.risks && projectData.risks.length > 0) {
      contextInfo += `Current Portfolio Risks:\n`;
      projectData.risks.forEach((risk: any, index: number) => {
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
      projectData.projects.slice(0, 10).forEach((project: any) => {
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

  const prompt = `You are an AI assistant specializing in construction project management and portfolio analysis. You provide strategic insights and risk assessments for construction projects.

${contextInfo}

User Question: ${question}

Please provide a comprehensive response that:
1. Directly addresses the user's question about risks or project concerns
2. References specific data from the context provided above
3. Provides actionable insights and recommendations
4. Uses a professional but accessible tone

If asking about portfolio risks specifically, structure your response to cover:
- Current risk overview
- Specific risk categories (schedule, financial, operational)
- Affected projects or areas
- Recommended actions

Response:`;

  return prompt;
}
