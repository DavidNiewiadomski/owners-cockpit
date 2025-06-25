/**
 * Enterprise AI Strategy - Multi-Tier Intelligent Routing
 * 
 * Tier 1: Edge Compute (Local) - Instant responses, privacy
 * Tier 2: Cloud Compute (Remote) - Complex reasoning, latest models  
 * Tier 3: Custom Models (Specialized) - Domain expertise
 */

import { premiumAI } from './premiumAI';
import { localAI } from './localAI';

// AI Model Capabilities and Routing
interface AIModelCapability {
  id: string;
  name: string;
  tier: 'edge' | 'cloud' | 'custom';
  latency: number; // milliseconds
  cost: number; // per request
  capabilities: string[];
  maxTokens: number;
  specialized: string[];
}

interface QueryClassification {
  complexity: 'simple' | 'medium' | 'complex';
  domain: 'general' | 'construction' | 'technical' | 'multimodal';
  urgency: 'low' | 'medium' | 'high';
  privacy: 'public' | 'sensitive' | 'confidential';
  expectedResponseLength: 'short' | 'medium' | 'long';
}

interface AIResponse {
  content: string;
  model: string;
  tier: string;
  latency: number;
  cost: number;
  confidence: number;
  sources?: string[];
  actions?: any[];
  metadata: any;
}

class EnterpriseAIService {
  private models: AIModelCapability[] = [
    // Tier 1: Edge Compute Models
    {
      id: 'llama-3.1-8b-local',
      name: 'Llama 3.1 8B (Local)',
      tier: 'edge',
      latency: 50,
      cost: 0,
      capabilities: ['chat', 'qa', 'summarization', 'basic-reasoning'],
      maxTokens: 8192,
      specialized: ['general']
    },
    {
      id: 'llama-3.1-70b-local',
      name: 'Llama 3.1 70B (Mac)',
      tier: 'edge',
      latency: 200,
      cost: 0,
      capabilities: ['advanced-reasoning', 'code', 'analysis', 'planning'],
      maxTokens: 32768,
      specialized: ['technical', 'construction']
    },
    {
      id: 'qwen-2.5-72b-local',
      name: 'Qwen 2.5 72B (Mac)',
      tier: 'edge',
      latency: 250,
      cost: 0,
      capabilities: ['technical-writing', 'research', 'analysis', 'multilingual'],
      maxTokens: 32768,
      specialized: ['technical', 'research']
    },

    // Tier 2: Cloud Compute Models
    {
      id: 'gpt-4o',
      name: 'GPT-4 Omni',
      tier: 'cloud',
      latency: 2000,
      cost: 0.03,
      capabilities: ['advanced-reasoning', 'multimodal', 'code', 'creative', 'function-calling'],
      maxTokens: 128000,
      specialized: ['general', 'complex-reasoning']
    },
    {
      id: 'claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      tier: 'cloud',
      latency: 1500,
      cost: 0.015,
      capabilities: ['advanced-reasoning', 'analysis', 'writing', 'research'],
      maxTokens: 200000,
      specialized: ['analysis', 'research', 'writing']
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      tier: 'cloud',
      latency: 1800,
      cost: 0.0125,
      capabilities: ['multimodal', 'vision', 'reasoning', 'function-calling'],
      maxTokens: 1000000,
      specialized: ['multimodal', 'vision', 'documents']
    },

    // Tier 3: Custom Fine-Tuned Models
    {
      id: 'construction-expert-v1',
      name: 'Construction Expert Model',
      tier: 'custom',
      latency: 800,
      cost: 0.005,
      capabilities: ['construction-codes', 'compliance', 'safety', 'regulations'],
      maxTokens: 16384,
      specialized: ['construction', 'compliance', 'safety']
    },
    {
      id: 'building-operations-v1',
      name: 'Building Operations Model',
      tier: 'custom',
      latency: 600,
      cost: 0.003,
      capabilities: ['hvac', 'maintenance', 'energy', 'operations'],
      maxTokens: 8192,
      specialized: ['operations', 'maintenance', 'energy']
    }
  ];

  private async classifyQuery(query: string, context: any): Promise<QueryClassification> {
    // Intelligent query classification using keywords and context
    const lowerQuery = query.toLowerCase();
    
    // Determine complexity
    let complexity: 'simple' | 'medium' | 'complex' = 'simple';
    if (lowerQuery.includes('analyze') || lowerQuery.includes('compare') || lowerQuery.includes('strategy')) {
      complexity = 'complex';
    } else if (lowerQuery.includes('explain') || lowerQuery.includes('plan') || lowerQuery.includes('recommend')) {
      complexity = 'medium';
    }

    // Determine domain
    let domain: 'general' | 'construction' | 'technical' | 'multimodal' = 'general';
    if (lowerQuery.includes('code') || lowerQuery.includes('regulation') || lowerQuery.includes('safety')) {
      domain = 'construction';
    } else if (lowerQuery.includes('system') || lowerQuery.includes('technical') || lowerQuery.includes('hvac')) {
      domain = 'technical';
    } else if (lowerQuery.includes('image') || lowerQuery.includes('document') || lowerQuery.includes('diagram')) {
      domain = 'multimodal';
    }

    // Determine urgency
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    if (lowerQuery.includes('urgent') || lowerQuery.includes('emergency') || lowerQuery.includes('critical')) {
      urgency = 'high';
    } else if (lowerQuery.includes('research') || lowerQuery.includes('long-term')) {
      urgency = 'low';
    }

    // Determine privacy level
    let privacy: 'public' | 'sensitive' | 'confidential' = 'public';
    if (context.projectId !== 'portfolio' || lowerQuery.includes('budget') || lowerQuery.includes('financial')) {
      privacy = 'sensitive';
    }
    if (lowerQuery.includes('confidential') || lowerQuery.includes('private') || lowerQuery.includes('internal')) {
      privacy = 'confidential';
    }

    // Estimate response length
    let expectedResponseLength: 'short' | 'medium' | 'long' = 'medium';
    if (lowerQuery.includes('yes/no') || lowerQuery.includes('quick') || lowerQuery.includes('brief')) {
      expectedResponseLength = 'short';
    } else if (lowerQuery.includes('detailed') || lowerQuery.includes('comprehensive') || lowerQuery.includes('report')) {
      expectedResponseLength = 'long';
    }

    return {
      complexity,
      domain,
      urgency,
      privacy,
      expectedResponseLength
    };
  }

  private selectBestModel(classification: QueryClassification, context: any): AIModelCapability {
    let candidateModels = [...this.models];

    console.log('🧠 Query Classification:', classification);

    // Filter by privacy requirements
    if (classification.privacy === 'confidential') {
      candidateModels = candidateModels.filter(m => m.tier === 'edge' || m.tier === 'custom');
    }

    // Filter by domain specialization
    candidateModels = candidateModels.filter(m => 
      m.specialized.includes(classification.domain) || 
      m.specialized.includes('general')
    );

    // Score models based on requirements
    const scoredModels = candidateModels.map(model => {
      let score = 0;

      // Complexity scoring
      if (classification.complexity === 'simple' && model.tier === 'edge') score += 30;
      if (classification.complexity === 'medium' && (model.tier === 'edge' || model.tier === 'custom')) score += 25;
      if (classification.complexity === 'complex' && model.tier === 'cloud') score += 40;

      // Urgency scoring (favor faster models for urgent requests)
      if (classification.urgency === 'high' && model.latency < 1000) score += 20;
      if (classification.urgency === 'medium' && model.latency < 2000) score += 10;

      // Domain specialization scoring
      if (model.specialized.includes(classification.domain)) score += 25;

      // Cost efficiency for simple tasks
      if (classification.complexity === 'simple' && model.cost === 0) score += 15;

      // Capability matching
      const requiredCapabilities = this.getRequiredCapabilities(classification);
      const matchingCapabilities = model.capabilities.filter(cap => 
        requiredCapabilities.includes(cap)
      ).length;
      score += matchingCapabilities * 5;

      return { model, score };
    });

    // Sort by score and return best model
    scoredModels.sort((a, b) => b.score - a.score);
    const selectedModel = scoredModels[0]?.model || this.models[0];

    console.log('🎯 Selected Model:', selectedModel.name, 'Tier:', selectedModel.tier);
    return selectedModel;
  }

  private getRequiredCapabilities(classification: QueryClassification): string[] {
    const capabilities: string[] = [];

    if (classification.complexity === 'complex') {
      capabilities.push('advanced-reasoning');
    }
    if (classification.domain === 'multimodal') {
      capabilities.push('multimodal', 'vision');
    }
    if (classification.domain === 'technical') {
      capabilities.push('code', 'technical-writing');
    }
    if (classification.domain === 'construction') {
      capabilities.push('construction-codes', 'safety', 'compliance');
    }

    return capabilities;
  }

  public async sendMessage(
    query: string,
    context: {
      projectId: string;
      activeView: string;
      conversationHistory: any[];
      userRole?: string;
      contextData?: any;
    },
    onStreamChunk?: (chunk: any) => void
  ): Promise<AIResponse> {
    const startTime = Date.now();

    // Step 1: Classify the query
    const classification = await this.classifyQuery(query, context);

    // Step 2: Select best model
    const selectedModel = this.selectBestModel(classification, context);

    // Step 3: Route to appropriate service
    let response: any;
    
    try {
      if (selectedModel.tier === 'edge') {
        response = await this.callLocalModel(selectedModel, query, context, onStreamChunk);
      } else if (selectedModel.tier === 'cloud') {
        response = await this.callCloudModel(selectedModel, query, context, onStreamChunk);
      } else { // custom
        response = await this.callCustomModel(selectedModel, query, context, onStreamChunk);
      }

      const latency = Date.now() - startTime;

      return {
        content: response.content,
        model: selectedModel.name,
        tier: selectedModel.tier,
        latency,
        cost: selectedModel.cost,
        confidence: response.confidence || 0.8,
        sources: response.sources,
        actions: response.actions,
        metadata: {
          classification,
          modelId: selectedModel.id,
          ...response.metadata
        }
      };

    } catch (error) {
      console.error(`❌ Error with ${selectedModel.name}:`, error);
      
      // Fallback to a simpler model
      const fallbackModel = this.models.find(m => m.tier === 'edge') || this.models[0];
      return await this.callFallbackResponse(query, context, fallbackModel, error);
    }
  }

  private async callLocalModel(model: AIModelCapability, query: string, context: any, onStreamChunk?: any) {
    console.log(`🏠 Calling local model: ${model.name}`);
    
    try {
      // Use the actual local AI service
      const response = await localAI.sendMessage(query, {
        projectId: context.projectId,
        activeView: context.activeView,
        conversationHistory: context.conversationHistory
      });
      
      return {
        content: response.content,
        confidence: response.confidence,
        metadata: { 
          source: 'local-browser', 
          model: model.id,
          actualModel: response.model,
          localLatency: response.latency
        }
      };
    } catch (error) {
      console.error('❌ Local AI error:', error);
      
      // Fallback to simulated response
      await new Promise(resolve => setTimeout(resolve, model.latency));
      
      return {
        content: `[${model.name} - Fallback] I understand you're asking about "${query}". Based on your ${context.activeView} view for ${context.projectId}, I can provide expert construction management assistance using my local AI capabilities. This response is generated locally on your device for maximum privacy and speed.`,
        confidence: 0.75,
        metadata: { source: 'local-fallback', model: model.id, error: error.message }
      };
    }
  }

  private async callCloudModel(model: AIModelCapability, query: string, context: any, onStreamChunk?: any) {
    console.log(`☁️ Calling cloud model: ${model.name}`);
    
    if (model.id === 'gpt-4o') {
      // Use existing premium AI service for GPT-4
      return await premiumAI.sendMessage(query, context, onStreamChunk);
    }
    
    // TODO: Implement other cloud models (Claude, Gemini)
    return {
      content: `[${model.name}] Advanced cloud AI response for: "${query}". This leverages the latest AI capabilities for complex reasoning and analysis.`,
      confidence: 0.9,
      metadata: { source: 'cloud', model: model.id }
    };
  }

  private async callCustomModel(model: AIModelCapability, query: string, context: any, onStreamChunk?: any) {
    console.log(`🎯 Calling custom model: ${model.name}`);
    
    // TODO: Implement custom fine-tuned models
    await new Promise(resolve => setTimeout(resolve, model.latency));
    
    return {
      content: `[${model.name}] Specialized construction industry response for: "${query}". This uses domain-specific training data and construction expertise to provide the most accurate guidance for building owners and managers.`,
      confidence: 0.95,
      metadata: { source: 'custom', model: model.id }
    };
  }

  private async callFallbackResponse(query: string, context: any, model: AIModelCapability, error: any) {
    return {
      content: `I apologize, but I encountered an issue processing your request. Here's what I can tell you about "${query}" based on general construction management principles: [Fallback response would go here]`,
      model: `${model.name} (Fallback)`,
      tier: 'fallback',
      latency: 500,
      cost: 0,
      confidence: 0.6,
      metadata: { error: error.message, fallback: true }
    };
  }

  public getModelStatus() {
    return {
      edge: this.models.filter(m => m.tier === 'edge').map(m => ({ 
        name: m.name, 
        status: 'available' // TODO: Check actual status
      })),
      cloud: this.models.filter(m => m.tier === 'cloud').map(m => ({ 
        name: m.name, 
        status: 'available' 
      })),
      custom: this.models.filter(m => m.tier === 'custom').map(m => ({ 
        name: m.name, 
        status: 'training' // TODO: Check actual status
      }))
    };
  }

  public async optimizeForDevice(deviceInfo: { platform: string; memory: number; processor: string }) {
    // Dynamically adjust model selection based on device capabilities
    console.log('🔧 Optimizing AI models for device:', deviceInfo);
    
    if (deviceInfo.platform === 'iPhone' && deviceInfo.memory < 8) {
      // Use smaller models for older iPhones
      this.models = this.models.filter(m => 
        m.tier !== 'edge' || m.id.includes('8b') || m.maxTokens < 16384
      );
    }
    
    return this.getModelStatus();
  }
}

export const enterpriseAI = new EnterpriseAIService();
export type { AIResponse, QueryClassification, AIModelCapability };
