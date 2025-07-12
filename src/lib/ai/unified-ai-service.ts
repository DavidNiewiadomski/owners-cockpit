import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

export interface AIProvider {
  name: string;
  model: string;
  apiKey: string;
  endpoint?: string;
  capabilities: string[];
}

export interface AIServiceConfig {
  providers: {
    azureOpenAI?: AIProvider;
    openAI?: AIProvider;
    anthropic?: AIProvider;
    gemini?: AIProvider;
    elevenLabs?: AIProvider;
    googleVision?: AIProvider;
    adobePDF?: AIProvider;
  };
  defaultProvider: string;
  fallbackProviders: string[];
}

export interface AIRequest {
  type: 'completion' | 'embedding' | 'vision' | 'voice' | 'document';
  prompt?: string;
  messages?: Array<{ role: string; content: string }>;
  data?: any;
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    voice?: string;
    language?: string;
  };
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class UnifiedAIService {
  private config: AIServiceConfig;
  private supabase: any;
  private providerClients: Map<string, any> = new Map();

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.supabase = createClient(
      config.supabaseUrl || process.env.VITE_SUPABASE_URL!,
      config.supabaseKey || process.env.VITE_SUPABASE_ANON_KEY!
    );
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize each provider client based on configuration
    Object.entries(this.config.providers).forEach(([key, provider]) => {
      if (provider && provider.apiKey) {
        this.providerClients.set(key, this.createProviderClient(key, provider));
      }
    });
  }

  private createProviderClient(type: string, provider: AIProvider) {
    switch (type) {
      case 'openAI':
        return {
          type: 'openai',
          apiKey: provider.apiKey,
          endpoint: provider.endpoint || 'https://api.openai.com/v1'
        };
      case 'azureOpenAI':
        return {
          type: 'azure-openai',
          apiKey: provider.apiKey,
          endpoint: provider.endpoint,
          deploymentName: provider.model
        };
      case 'anthropic':
        return {
          type: 'anthropic',
          apiKey: provider.apiKey,
          endpoint: provider.endpoint || 'https://api.anthropic.com/v1'
        };
      case 'gemini':
        return {
          type: 'gemini',
          apiKey: provider.apiKey,
          endpoint: provider.endpoint || 'https://generativelanguage.googleapis.com/v1beta'
        };
      case 'elevenLabs':
        return {
          type: 'elevenlabs',
          apiKey: provider.apiKey,
          endpoint: provider.endpoint || 'https://api.elevenlabs.io/v1'
        };
      case 'googleVision':
        return {
          type: 'google-vision',
          apiKey: provider.apiKey,
          endpoint: provider.endpoint || 'https://vision.googleapis.com/v1'
        };
      case 'adobePDF':
        return {
          type: 'adobe-pdf',
          clientId: provider.apiKey,
          clientSecret: provider.clientSecret,
          endpoint: provider.endpoint || 'https://pdf-services.adobe.io'
        };
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const provider = this.selectProvider(request);
    
    try {
      const response = await this.executeRequest(provider, request);
      
      // Log usage to Supabase
      await this.logUsage(provider, request, response);
      
      return response;
    } catch (error) {
      // Try fallback providers
      for (const fallbackProvider of this.config.fallbackProviders) {
        if (fallbackProvider !== provider && this.providerClients.has(fallbackProvider)) {
          try {
            const response = await this.executeRequest(fallbackProvider, request);
            await this.logUsage(fallbackProvider, request, response);
            return response;
          } catch (fallbackError) {
            console.error(`Fallback provider ${fallbackProvider} failed:`, fallbackError);
          }
        }
      }
      
      return {
        success: false,
        error: error.message,
        provider
      };
    }
  }

  private selectProvider(request: AIRequest): string {
    // Select provider based on request type and capabilities
    switch (request.type) {
      case 'voice':
        return 'elevenLabs';
      case 'vision':
        return 'googleVision';
      case 'document':
        return 'adobePDF';
      case 'embedding':
        return request.options?.model?.includes('text-embedding') ? 'openAI' : 'gemini';
      default:
        return this.config.defaultProvider;
    }
  }

  private async executeRequest(provider: string, request: AIRequest): Promise<AIResponse> {
    const client = this.providerClients.get(provider);
    if (!client) {
      throw new Error(`Provider ${provider} not initialized`);
    }

    switch (client.type) {
      case 'openai':
      case 'azure-openai':
        return this.executeOpenAIRequest(client, request);
      case 'anthropic':
        return this.executeAnthropicRequest(client, request);
      case 'gemini':
        return this.executeGeminiRequest(client, request);
      case 'elevenlabs':
        return this.executeElevenLabsRequest(client, request);
      case 'google-vision':
        return this.executeGoogleVisionRequest(client, request);
      case 'adobe-pdf':
        return this.executeAdobePDFRequest(client, request);
      default:
        throw new Error(`Unknown client type: ${client.type}`);
    }
  }

  private async executeOpenAIRequest(client: any, request: AIRequest): Promise<AIResponse> {
    const endpoint = request.type === 'embedding' 
      ? `${client.endpoint}/embeddings`
      : `${client.endpoint}/chat/completions`;

    const body = request.type === 'embedding'
      ? {
          model: request.options?.model || 'text-embedding-ada-002',
          input: request.prompt
        }
      : {
          model: request.options?.model || 'gpt-4',
          messages: request.messages || [{ role: 'user', content: request.prompt }],
          temperature: request.options?.temperature || 0.7,
          max_tokens: request.options?.maxTokens || 1000
        };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${client.apiKey}`,
        ...(client.type === 'azure-openai' && { 'api-key': client.apiKey })
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI request failed');
    }

    return {
      success: true,
      data: request.type === 'embedding' ? data.data[0].embedding : data.choices[0].message.content,
      provider: client.type,
      usage: data.usage
    };
  }

  private async executeAnthropicRequest(client: any, request: AIRequest): Promise<AIResponse> {
    const response = await fetch(`${client.endpoint}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': client.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: request.options?.model || 'claude-3-opus-20240229',
        messages: request.messages || [{ role: 'user', content: request.prompt }],
        max_tokens: request.options?.maxTokens || 1000,
        temperature: request.options?.temperature || 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic request failed');
    }

    return {
      success: true,
      data: data.content[0].text,
      provider: 'anthropic',
      usage: {
        promptTokens: data.usage?.input_tokens,
        completionTokens: data.usage?.output_tokens,
        totalTokens: data.usage?.input_tokens + data.usage?.output_tokens
      }
    };
  }

  private async executeGeminiRequest(client: any, request: AIRequest): Promise<AIResponse> {
    const model = request.options?.model || 'gemini-pro';
    const endpoint = request.type === 'embedding'
      ? `${client.endpoint}/models/embedding-001:embedContent`
      : `${client.endpoint}/models/${model}:generateContent`;

    const body = request.type === 'embedding'
      ? {
          model: 'models/embedding-001',
          content: { parts: [{ text: request.prompt }] }
        }
      : {
          contents: [{
            parts: [{ text: request.prompt }]
          }],
          generationConfig: {
            temperature: request.options?.temperature || 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: request.options?.maxTokens || 1024
          }
        };

    const response = await fetch(`${endpoint}?key=${client.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      data: request.type === 'embedding' 
        ? data.embedding.values 
        : data.candidates?.[0]?.content?.parts?.[0]?.text,
      provider: 'gemini'
    };
  }

  private async executeElevenLabsRequest(client: any, request: AIRequest): Promise<AIResponse> {
    const voiceId = request.options?.voice || 'EXAVITQu4vr4xnSDxMaL'; // Default voice
    const response = await fetch(`${client.endpoint}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': client.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: request.prompt,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs request failed: ${error}`);
    }

    const audioData = await response.arrayBuffer();
    return {
      success: true,
      data: audioData,
      provider: 'elevenlabs'
    };
  }

  private async executeGoogleVisionRequest(client: any, request: AIRequest): Promise<AIResponse> {
    const response = await fetch(`${client.endpoint}/images:annotate?key=${client.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: request.data.image,
          features: request.data.features || [
            { type: 'TEXT_DETECTION' },
            { type: 'DOCUMENT_TEXT_DETECTION' },
            { type: 'LABEL_DETECTION' }
          ]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      success: true,
      data: data.responses[0],
      provider: 'google-vision'
    };
  }

  private async executeAdobePDFRequest(client: any, request: AIRequest): Promise<AIResponse> {
    // First, get access token
    const tokenResponse = await fetch('https://ims-na1.adobelogin.com/ims/exchange/jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: client.clientId,
        client_secret: client.clientSecret,
        jwt_token: request.data.jwt // JWT should be pre-generated
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get Adobe access token');
    }

    // Execute PDF operation
    const operationResponse = await fetch(`${client.endpoint}/operation/${request.data.operation}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'x-api-key': client.clientId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.data.params)
    });

    const operationData = await operationResponse.json();

    return {
      success: true,
      data: operationData,
      provider: 'adobe-pdf'
    };
  }

  private async logUsage(provider: string, request: AIRequest, response: AIResponse) {
    try {
      await this.supabase.from('ai_usage_logs').insert({
        provider,
        request_type: request.type,
        prompt_tokens: response.usage?.promptTokens,
        completion_tokens: response.usage?.completionTokens,
        total_tokens: response.usage?.totalTokens,
        success: response.success,
        error: response.error,
        metadata: {
          model: request.options?.model,
          temperature: request.options?.temperature
        }
      });
    } catch (error) {
      console.error('Failed to log AI usage:', error);
    }
  }

  // Helper method to create embeddings
  async createEmbedding(text: string, provider?: string): Promise<number[]> {
    const response = await this.processRequest({
      type: 'embedding',
      prompt: text,
      options: {
        model: provider === 'openAI' ? 'text-embedding-ada-002' : undefined
      }
    });

    if (!response.success) {
      throw new Error(`Failed to create embedding: ${response.error}`);
    }

    return response.data;
  }

  // Helper method for text generation
  async generateText(prompt: string, options?: any): Promise<string> {
    const response = await this.processRequest({
      type: 'completion',
      prompt,
      options
    });

    if (!response.success) {
      throw new Error(`Failed to generate text: ${response.error}`);
    }

    return response.data;
  }

  // Helper method for voice synthesis
  async synthesizeVoice(text: string, voice?: string): Promise<ArrayBuffer> {
    const response = await this.processRequest({
      type: 'voice',
      prompt: text,
      options: { voice }
    });

    if (!response.success) {
      throw new Error(`Failed to synthesize voice: ${response.error}`);
    }

    return response.data;
  }
}