/**
 * Natural AI Service - Human-like conversational AI
 * Focuses on providing helpful, natural responses without technical jargon
 */

import { premiumAI } from './premiumAI';

interface ConversationContext {
  projectId: string;
  activeView: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  userRole?: string;
  contextData?: any;
}

interface NaturalResponse {
  content: string;
  confidence: number;
  actions?: Array<{
    type: string;
    description: string;
    data?: any;
  }>;
}

class NaturalAIService {
  private getContextualPrompt(query: string, context: ConversationContext): string {
    const projectContext = context.projectId === 'portfolio' 
      ? 'managing their entire portfolio of buildings and properties'
      : `working on the ${context.projectId} project`;

    const viewContext = this.getViewDescription(context.activeView);
    
    return `You are a helpful AI assistant for a building owner/manager who is ${projectContext}. 
They are currently looking at their ${viewContext}.

IMPORTANT GUIDELINES:
- Respond naturally and conversationally like a knowledgeable colleague would
- NO technical AI jargon, model names, or processing details
- Focus on practical, actionable advice
- Be concise but thorough
- Use "I" statements and speak directly to them
- If you don't know something specific, say so honestly
- Suggest specific actions they can take when relevant

Current question: "${query}"

Respond as if you're their experienced construction/property management advisor having a normal conversation.`;
  }

  private getViewDescription(activeView: string): string {
    const viewDescriptions: Record<string, string> = {
      'executive': 'executive dashboard with high-level project overview',
      'construction': 'construction management dashboard with project details',
      'finance': 'financial dashboard with budgets and costs',
      'facilities': 'facilities management dashboard',
      'sustainability': 'sustainability and environmental dashboard',
      'legal': 'legal and compliance dashboard',
      'preconstruction': 'preconstruction planning dashboard',
      'documents': 'project documents and files',
      'communications': 'team communications hub',
      'reporting': 'reports and analytics section'
    };
    
    return viewDescriptions[activeView] || `${activeView} section`;
  }

  private extractProjectInsights(context: ConversationContext): string {
    // Extract relevant insights from context data
    if (!context.contextData) return '';

    let insights = [];
    
    if (context.contextData.budget) {
      insights.push(`Your project budget is $${context.contextData.budget.toLocaleString()}`);
    }
    
    if (context.contextData.timeline) {
      insights.push(`Timeline: ${context.contextData.timeline}`);
    }
    
    if (context.contextData.status) {
      insights.push(`Current status: ${context.contextData.status}`);
    }

    return insights.length > 0 ? `\n\nRelevant project context: ${insights.join(', ')}` : '';
  }

  private async generateResponse(query: string, context: ConversationContext): Promise<NaturalResponse> {
    try {
      const systemPrompt = this.getContextualPrompt(query, context);
      const projectInsights = this.extractProjectInsights(context);
      
      const fullPrompt = systemPrompt + projectInsights;

      // Use premium AI but strip out technical details
      const response = await premiumAI.sendMessage(query, {
        ...context,
        systemPrompt: fullPrompt
      });

      // Clean up the response to make it more natural
      let cleanContent = response.content;
      
      // Remove any model references or technical jargon
      cleanContent = cleanContent.replace(/\[.*?\]/g, ''); // Remove [Model Name] prefixes
      cleanContent = cleanContent.replace(/AI model|language model|GPT|Claude|assistant/gi, 'I');
      cleanContent = cleanContent.replace(/based on my training|as an AI/gi, '');
      cleanContent = cleanContent.trim();

      // Generate helpful actions based on the query type
      const actions = this.generateActions(query, context);

      return {
        content: cleanContent,
        confidence: response.confidence || 0.9,
        actions
      };

    } catch (error) {
      console.error('Natural AI error:', error);
      
      // Provide a helpful fallback response
      return {
        content: this.generateFallbackResponse(query, context),
        confidence: 0.7
      };
    }
  }

  private generateActions(query: string, context: ConversationContext): Array<{type: string, description: string, data?: any}> {
    const actions = [];
    const lowerQuery = query.toLowerCase();

    // Suggest relevant actions based on query content
    if (lowerQuery.includes('budget') || lowerQuery.includes('cost')) {
      actions.push({
        type: 'navigate',
        description: 'View detailed budget breakdown',
        data: { view: 'finance' }
      });
    }

    if (lowerQuery.includes('schedule') || lowerQuery.includes('timeline')) {
      actions.push({
        type: 'navigate',
        description: 'Check project timeline',
        data: { view: 'construction' }
      });
    }

    if (lowerQuery.includes('document') || lowerQuery.includes('report')) {
      actions.push({
        type: 'navigate',
        description: 'Browse project documents',
        data: { view: 'documents' }
      });
    }

    if (lowerQuery.includes('team') || lowerQuery.includes('communication')) {
      actions.push({
        type: 'navigate',
        description: 'Contact project team',
        data: { view: 'communications' }
      });
    }

    if (lowerQuery.includes('risk') || lowerQuery.includes('issue')) {
      actions.push({
        type: 'alert',
        description: 'Create risk assessment',
        data: { type: 'risk' }
      });
    }

    return actions;
  }

  private generateFallbackResponse(query: string, context: ConversationContext): string {
    const viewContext = this.getViewDescription(context.activeView);
    
    return `I understand you're asking about "${query}" while looking at your ${viewContext}. 

I'm here to help with your construction and property management questions. Could you provide a bit more detail about what specific information you're looking for? 

For example, are you looking for:
- Project status updates
- Budget or financial information  
- Timeline or scheduling details
- Team contacts or communications
- Documents or reports

I'm happy to help once I understand exactly what you need!`;
  }

  public async sendMessage(
    query: string, 
    context: ConversationContext,
    onStreamChunk?: (chunk: any) => void
  ): Promise<NaturalResponse> {
    console.log('🤖 Processing natural conversation:', query);
    
    if (onStreamChunk) {
      // For streaming, send chunks as we process
      onStreamChunk({
        content: '',
        isStreaming: true
      });
      
      const response = await this.generateResponse(query, context);
      
      // Simulate streaming for better UX
      const words = response.content.split(' ');
      let currentContent = '';
      
      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? ' ' : '') + words[i];
        
        onStreamChunk({
          content: currentContent,
          isStreaming: true,
          confidence: response.confidence,
          actions: i === words.length - 1 ? response.actions : undefined
        });
        
        // Small delay to make streaming feel natural
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Final chunk
      onStreamChunk({
        content: response.content,
        confidence: response.confidence,
        actions: response.actions,
        isComplete: true,
        isStreaming: false
      });
      
      return response;
    }

    return this.generateResponse(query, context);
  }

  public getSuggestedQuestions(context: ConversationContext): string[] {
    const suggestions = [
      "What are my biggest risks today?",
      "How is the project timeline looking?", 
      "What's my budget status?",
      "Any issues I should know about?",
      "Who should I contact about delays?",
      "What documents need my review?",
      "How can I improve efficiency?",
      "What's the latest progress update?"
    ];

    // Customize based on current view
    if (context.activeView === 'finance') {
      return [
        "What's my current budget variance?",
        "Are there any cost overruns?",
        "What expenses are coming up?",
        "How does this compare to last month?"
      ];
    }

    if (context.activeView === 'construction') {
      return [
        "What's behind schedule?",
        "Any safety concerns today?",
        "When is the next milestone?",
        "Who's working on site today?"
      ];
    }

    return suggestions.slice(0, 4); // Return 4 relevant suggestions
  }
}

export const naturalAI = new NaturalAIService();
export type { NaturalResponse, ConversationContext };
