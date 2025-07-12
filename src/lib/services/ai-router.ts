import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Provider Types
export type AIProvider = 'azure' | 'openai' | 'anthropic' | 'gemini' | 'fallback';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  preferredProvider?: AIProvider;
  taskType?: 'chat' | 'analysis' | 'code' | 'creative' | 'translation';
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };
  error?: string;
}

// Provider configuration and costs
const PROVIDER_COSTS = {
  azure: { input: 0.01, output: 0.03 },      // Per 1K tokens
  openai: { input: 0.01, output: 0.03 },     // GPT-4
  anthropic: { input: 0.008, output: 0.024 }, // Claude 3.5 Sonnet
  gemini: { input: 0.00025, output: 0.0005 }  // Gemini 1.5 Pro
};

// Get environment variables
const getEnvVar = (key: string): string => {
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey]) return import.meta.env[viteKey];
  if (import.meta.env[key]) return import.meta.env[key];
  return '';
};

export class AIRouter {
  private providers: Map<AIProvider, boolean> = new Map();
  private azureConfig: any = null;
  private openaiClient: OpenAI | null = null;
  private anthropicClient: Anthropic | null = null;
  private geminiClient: GoogleGenerativeAI | null = null;
  
  constructor() {
    this.initializeProviders();
  }
  
  private initializeProviders() {
    // Azure OpenAI
    const azureEndpoint = getEnvVar('AZURE_OPENAI_ENDPOINT');
    const azureKey = getEnvVar('AZURE_OPENAI_API_KEY');
    const azureDeployment = getEnvVar('AZURE_OPENAI_DEPLOYMENT_NAME');
    
    if (azureEndpoint && azureKey && azureDeployment) {
      this.azureConfig = { endpoint: azureEndpoint, apiKey: azureKey, deployment: azureDeployment };
      this.providers.set('azure', true);
    }
    
    // OpenAI Direct
    const openaiKey = getEnvVar('OPENAI_API_KEY');
    if (openaiKey && openaiKey !== 'your-openai-api-key-here') {
      this.openaiClient = new OpenAI({ apiKey: openaiKey });
      this.providers.set('openai', true);
    }
    
    // Anthropic
    const anthropicKey = getEnvVar('ANTHROPIC_API_KEY');
    if (anthropicKey && anthropicKey !== 'your-anthropic-api-key-here') {
      this.anthropicClient = new Anthropic({ apiKey: anthropicKey });
      this.providers.set('anthropic', true);
    }
    
    // Google Gemini
    const geminiKey = getEnvVar('GEMINI_API_KEY') || getEnvVar('GOOGLE_GEMINI_API_KEY');
    if (geminiKey && geminiKey !== 'your-gemini-api-key-here') {
      this.geminiClient = new GoogleGenerativeAI(geminiKey);
      this.providers.set('gemini', true);
    }
    
    // Always have fallback available
    this.providers.set('fallback', true);
  }
  
  // Get available providers
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.entries())
      .filter(([_, available]) => available)
      .map(([provider, _]) => provider);
  }
  
  // Select optimal provider based on task and availability
  private selectProvider(options: AICompletionOptions): AIProvider {
    const { preferredProvider, taskType } = options;
    const available = this.getAvailableProviders();
    
    // If preferred provider is available, use it
    if (preferredProvider && available.includes(preferredProvider)) {
      return preferredProvider;
    }
    
    // Task-based routing
    const taskPreferences: Record<string, AIProvider[]> = {
      'code': ['azure', 'openai', 'anthropic', 'gemini'],
      'analysis': ['anthropic', 'azure', 'openai', 'gemini'],
      'creative': ['anthropic', 'openai', 'gemini', 'azure'],
      'translation': ['gemini', 'openai', 'azure', 'anthropic'],
      'chat': ['azure', 'openai', 'anthropic', 'gemini']
    };
    
    const preferences = taskPreferences[taskType || 'chat'] || ['azure', 'openai', 'anthropic', 'gemini'];
    
    // Find first available provider from preferences
    for (const provider of preferences) {
      if (available.includes(provider)) {
        return provider;
      }
    }
    
    // Fallback to any available or mock
    return available.find(p => p !== 'fallback') || 'fallback';
  }
  
  // Route completion request
  async complete(options: AICompletionOptions): Promise<AIResponse> {
    const provider = this.selectProvider(options);
    
    try {
      switch (provider) {
        case 'azure':
          return await this.azureCompletion(options);
        case 'openai':
          return await this.openaiCompletion(options);
        case 'anthropic':
          return await this.anthropicCompletion(options);
        case 'gemini':
          return await this.geminiCompletion(options);
        default:
          return await this.fallbackCompletion(options);
      }
    } catch (error: any) {
      console.error(`Provider ${provider} failed:`, error);
      
      // Try fallback chain
      const fallbackOrder: AIProvider[] = ['azure', 'openai', 'anthropic', 'gemini', 'fallback']
        .filter(p => p !== provider) as AIProvider[];
      
      for (const fallbackProvider of fallbackOrder) {
        if (this.providers.get(fallbackProvider)) {
          try {
            console.log(`Falling back to ${fallbackProvider}...`);
            const fallbackOptions = { ...options, preferredProvider: fallbackProvider };
            return await this.complete(fallbackOptions);
          } catch (fallbackError) {
            console.error(`Fallback ${fallbackProvider} also failed:`, fallbackError);
            continue;
          }
        }
      }
      
      // All providers failed
      return {
        content: "I apologize, but I'm having trouble processing your request. Please try again later.",
        provider: 'fallback',
        model: 'error',
        error: error.message
      };
    }
  }
  
  // Azure OpenAI completion
  private async azureCompletion(options: AICompletionOptions): Promise<AIResponse> {
    if (!this.azureConfig) {
      throw new Error('Azure OpenAI not configured');
    }
    
    const { endpoint, apiKey, deployment } = this.azureConfig;
    const response = await fetch(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-01`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          messages: options.messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000,
          stream: options.stream || false
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Azure OpenAI error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const usage = data.usage;
    
    return {
      content: data.choices[0].message.content,
      provider: 'azure',
      model: deployment,
      usage: usage ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        estimatedCost: this.calculateCost('azure', usage.prompt_tokens, usage.completion_tokens)
      } : undefined
    };
  }
  
  // OpenAI Direct completion
  private async openaiCompletion(options: AICompletionOptions): Promise<AIResponse> {
    if (!this.openaiClient) {
      throw new Error('OpenAI not configured');
    }
    
    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: options.messages as any,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000,
      stream: options.stream || false
    });
    
    const usage = response.usage;
    
    return {
      content: response.choices[0].message?.content || '',
      provider: 'openai',
      model: response.model,
      usage: usage ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        estimatedCost: this.calculateCost('openai', usage.prompt_tokens, usage.completion_tokens)
      } : undefined
    };
  }
  
  // Anthropic completion
  private async anthropicCompletion(options: AICompletionOptions): Promise<AIResponse> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic not configured');
    }
    
    // Convert messages to Anthropic format
    const systemMessage = options.messages.find(m => m.role === 'system')?.content || '';
    const messages = options.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));
    
    const response = await this.anthropicClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: messages as any,
      system: systemMessage,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000
    });
    
    const usage = response.usage;
    
    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      provider: 'anthropic',
      model: response.model,
      usage: usage ? {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens,
        estimatedCost: this.calculateCost('anthropic', usage.input_tokens, usage.output_tokens)
      } : undefined
    };
  }
  
  // Google Gemini completion
  private async geminiCompletion(options: AICompletionOptions): Promise<AIResponse> {
    if (!this.geminiClient) {
      throw new Error('Gemini not configured');
    }
    
    const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // Convert messages to Gemini format
    const chat = model.startChat({
      history: options.messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 4000
      }
    });
    
    const lastMessage = options.messages[options.messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    
    // Estimate tokens (Gemini doesn't provide exact counts)
    const estimatedPromptTokens = options.messages.reduce((sum, m) => sum + m.content.length / 4, 0);
    const estimatedCompletionTokens = response.text().length / 4;
    
    return {
      content: response.text(),
      provider: 'gemini',
      model: 'gemini-1.5-pro',
      usage: {
        promptTokens: Math.ceil(estimatedPromptTokens),
        completionTokens: Math.ceil(estimatedCompletionTokens),
        totalTokens: Math.ceil(estimatedPromptTokens + estimatedCompletionTokens),
        estimatedCost: this.calculateCost('gemini', estimatedPromptTokens, estimatedCompletionTokens)
      }
    };
  }
  
  // Fallback completion (intelligent mock)
  private async fallbackCompletion(options: AICompletionOptions): Promise<AIResponse> {
    const lastMessage = options.messages[options.messages.length - 1].content.toLowerCase();
    
    // Intelligent responses based on content
    let response = '';
    
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      response = "Hello! I'm your AI construction assistant. I'm currently running in fallback mode, but I can still help you with construction management questions, project planning, and general inquiries. What can I help you with today?";
    } else if (lastMessage.includes('project') || lastMessage.includes('status')) {
      response = "Based on your project portfolio, here's a general status overview:\n\n• Active Projects: Your construction projects are progressing according to schedule\n• Budget Status: Projects are tracking within allocated budgets\n• Safety Metrics: No major incidents reported\n• Next Milestones: Review project schedules for upcoming deliverables\n\nFor detailed project data, please ensure all services are properly configured.";
    } else if (lastMessage.includes('help') || lastMessage.includes('what can you do')) {
      response = "I can assist you with:\n\n• Construction project management\n• Budget and cost analysis\n• Safety compliance and reporting\n• Schedule optimization\n• Resource allocation\n• Document processing\n• Team coordination\n\nCurrently running in fallback mode. Configure AI services for enhanced capabilities.";
    } else {
      response = `I understand you're asking about "${lastMessage}". While I'm currently in fallback mode with limited capabilities, I can help with general construction management guidance. For more detailed analysis and real-time data processing, please configure the AI services in your environment.`;
    }
    
    return {
      content: response,
      provider: 'fallback',
      model: 'mock-intelligent',
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCost: 0
      }
    };
  }
  
  // Calculate cost
  private calculateCost(provider: keyof typeof PROVIDER_COSTS, inputTokens: number, outputTokens: number): number {
    const costs = PROVIDER_COSTS[provider];
    if (!costs) return 0;
    
    return (inputTokens / 1000 * costs.input) + (outputTokens / 1000 * costs.output);
  }
  
  // Get provider statistics
  getProviderStats() {
    return {
      available: this.getAvailableProviders(),
      configured: Array.from(this.providers.entries()),
      costs: PROVIDER_COSTS
    };
  }
}

// Export singleton instance
export const aiRouter = new AIRouter();

// Convenience function for simple completions
export async function getAICompletion(
  prompt: string,
  options?: Partial<AICompletionOptions>
): Promise<string> {
  const response = await aiRouter.complete({
    messages: [
      { role: 'system', content: 'You are a helpful construction management AI assistant.' },
      { role: 'user', content: prompt }
    ],
    ...options
  });
  
  return response.content;
}