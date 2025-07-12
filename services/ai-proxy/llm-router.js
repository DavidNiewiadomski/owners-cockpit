import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

export class LLMRouter {
  constructor() {
    this.dailySpend = 0;
    this.lastSpendReset = new Date().toDateString();
  }

  estimateTokenCount(text) {
    return Math.ceil(text.length / 4);
  }

  getCurrentDailySpend() {
    const today = new Date().toDateString();
    if (today !== this.lastSpendReset) {
      this.dailySpend = 0;
      this.lastSpendReset = today;
    }
    return this.dailySpend;
  }

  updateDailySpend(cost) {
    this.dailySpend += cost;
  }

  getModelCostPer1kTokens(model) {
    const costs = {
      'azure-gpt-4': 1.5,
      'azure-gpt-4-32k': 3.0,
      'gpt-4o': 1.5,
      'gpt-4o-mini': 0.15,
      'gpt-4-turbo': 1.0,
      'gpt-3.5-turbo': 0.05,
      'claude-3-5-sonnet-20241022': 1.5,
      'claude-3-haiku-20240307': 0.25,
      'claude-3-opus-20240229': 7.5,
      'gemini-1.5-pro': 1.25,
      'gemini-1.5-flash': 0.075
    };
    return costs[model] || 1.0;
  }

  isApiKeyAvailable(provider) {
    switch (provider) {
      case 'azure':
        return !!process.env.AZURE_OPENAI_KEY && 
               !!process.env.AZURE_OPENAI_ENDPOINT && 
               !!process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
      case 'anthropic':
        return !!process.env.ANTHROPIC_API_KEY && 
               !process.env.ANTHROPIC_API_KEY.includes('your') &&
               process.env.ANTHROPIC_API_KEY.length > 20;
      case 'google':
        return (!!process.env.GEMINI_API_KEY || !!process.env.GOOGLE_GEMINI_API_KEY) &&
               !process.env.GEMINI_API_KEY?.includes('your') &&
               process.env.GEMINI_API_KEY?.length > 20;
      case 'openai':
        return !!process.env.OPENAI_API_KEY && 
               !process.env.OPENAI_API_KEY.includes('your') &&
               process.env.OPENAI_API_KEY.length > 20;
      default:
        return false;
    }
  }

  getAvailableModels() {
    const models = [];
    
    if (this.isApiKeyAvailable('azure')) {
      models.push('azure-gpt-4', 'azure-gpt-4-32k');
    }
    
    if (this.isApiKeyAvailable('openai')) {
      models.push('gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo');
    }
    
    if (this.isApiKeyAvailable('anthropic')) {
      models.push('claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229');
    }
    
    if (this.isApiKeyAvailable('google')) {
      models.push('gemini-1.5-pro', 'gemini-1.5-flash');
    }
    
    console.log('🔍 Available models:', models);
    return models;
  }

  selectOptimalModel(tokenCount, taskType, latencyReq, currentSpend, budget) {
    const budgetUsedPercent = (currentSpend / budget) * 100;
    const availableModels = this.getAvailableModels();
    
    if (availableModels.length === 0) {
      throw new Error('No AI models available. Please configure API keys.');
    }
    
    // Budget conservation mode
    if (budgetUsedPercent >= 80) {
      if (availableModels.includes('claude-3-haiku-20240307')) return 'claude-3-haiku-20240307';
      if (availableModels.includes('gemini-1.5-flash')) return 'gemini-1.5-flash';
      if (availableModels.includes('gpt-3.5-turbo')) return 'gpt-3.5-turbo';
      if (availableModels.includes('gpt-4o-mini')) return 'gpt-4o-mini';
    }
    
    // Low latency requirements
    if (latencyReq === 'low') {
      if (tokenCount < 1000) {
        if (availableModels.includes('claude-3-haiku-20240307')) return 'claude-3-haiku-20240307';
        if (availableModels.includes('gpt-3.5-turbo')) return 'gpt-3.5-turbo';
        if (availableModels.includes('gpt-4o-mini')) return 'gpt-4o-mini';
      }
      if (availableModels.includes('gpt-4o')) return 'gpt-4o';
    }
    
    // Task-specific model selection
    const taskModelMap = {
      'vision': availableModels.includes('gpt-4o') ? 'gpt-4o' : 'gpt-4o-mini',
      'policy_doc': availableModels.includes('claude-3-5-sonnet-20241022') ? 'claude-3-5-sonnet-20241022' : 'gpt-4o',
      'email_draft': availableModels.includes('claude-3-haiku-20240307') ? 'claude-3-haiku-20240307' : 'gpt-3.5-turbo',
      'code_review': availableModels.includes('gpt-4o') ? 'gpt-4o' : 'claude-3-5-sonnet-20241022',
      'creative_writing': availableModels.includes('claude-3-5-sonnet-20241022') ? 'claude-3-5-sonnet-20241022' : 'gpt-4o',
      'translation': availableModels.includes('gemini-1.5-pro') ? 'gemini-1.5-pro' : 'gpt-4o',
      'summarization': tokenCount > 5000 
        ? (availableModels.includes('claude-3-5-sonnet-20241022') ? 'claude-3-5-sonnet-20241022' : 'gpt-4o')
        : (availableModels.includes('claude-3-haiku-20240307') ? 'claude-3-haiku-20240307' : 'gpt-3.5-turbo'),
      'analysis': tokenCount > 180000
        ? (availableModels.includes('gemini-1.5-pro') ? 'gemini-1.5-pro' : 'claude-3-5-sonnet-20241022')
        : tokenCount > 3000
        ? (availableModels.includes('claude-3-5-sonnet-20241022') ? 'claude-3-5-sonnet-20241022' : 'gpt-4o')
        : (availableModels.includes('gpt-4o') ? 'gpt-4o' : 'gpt-4o-mini')
    };
    
    const suggestedModel = taskModelMap[taskType] || availableModels[0];
    
    // Final budget check
    const estimatedCost = (tokenCount / 1000) * this.getModelCostPer1kTokens(suggestedModel);
    const remainingBudget = budget - currentSpend;
    
    if (estimatedCost > remainingBudget * 0.5) {
      if (availableModels.includes('gpt-3.5-turbo')) return 'gpt-3.5-turbo';
      if (availableModels.includes('claude-3-haiku-20240307')) return 'claude-3-haiku-20240307';
      if (availableModels.includes('gemini-1.5-flash')) return 'gemini-1.5-flash';
    }
    
    return suggestedModel;
  }

  async callOpenAI(content, model = 'gpt-4o') {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('🔑 OpenAI API Key check:', {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyPrefix: apiKey?.substring(0, 7) || 'none',
      startsWithSk: apiKey?.startsWith('sk-') || false
    });
    
    if (!apiKey || apiKey.includes('your') || apiKey.length < 20) {
      throw new Error('OpenAI API key not configured properly');
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: 'You are Atlas, an expert construction management AI assistant.' },
        { role: 'user', content: content }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    return {
      content: completion.choices[0].message.content,
      usage: completion.usage,
      model: model,
      provider: 'openai'
    };
  }

  async callAzureOpenAI(content, model = 'azure-gpt-4') {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_GPT_DEPLOYMENT || 'gpt-4-prod';
    
    if (!endpoint || !apiKey || apiKey.includes('your') || endpoint.includes('your')) {
      throw new Error('Azure OpenAI configuration not available');
    }
    
    console.log('🔷 Calling Azure OpenAI:', {
      endpoint: endpoint.substring(0, 30) + '...',
      deployment: deploymentName
    });
    
    const response = await axios.post(
      `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-01`,
      {
        messages: [
          { role: 'system', content: 'You are Atlas, an expert construction management AI assistant.' },
          { role: 'user', content: content }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        }
      }
    );
    
    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
      model: deploymentName,
      provider: 'azure'
    };
  }

  async callClaude(content, model = 'claude-3-5-sonnet-20241022') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.includes('your') || apiKey.length < 20) {
      throw new Error('Anthropic API key not configured properly');
    }

    const anthropic = new Anthropic({ apiKey });

    const completion = await anthropic.messages.create({
      model: model,
      max_tokens: 4000,
      messages: [
        { role: 'user', content: content }
      ],
      system: 'You are Atlas, an expert construction management AI assistant.'
    });

    return {
      content: completion.content[0].text,
      usage: {
        total_tokens: completion.usage?.input_tokens + completion.usage?.output_tokens
      },
      model: model,
      provider: 'anthropic'
    };
  }

  async callGemini(content) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('your') || apiKey.length < 20) {
      throw new Error('Gemini API key not configured properly');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent(`You are Atlas, an expert construction management AI assistant.\n\n${content}`);
    const response = await result.response;
    
    return {
      content: response.text(),
      usage: {
        total_tokens: this.estimateTokenCount(content) + this.estimateTokenCount(response.text())
      },
      model: 'gemini-1.5-pro',
      provider: 'google'
    };
  }

  async callModel(content, model) {
    console.log(`🚀 Attempting to call model: ${model}`);
    
    try {
      if (model.startsWith('azure-')) {
        return await this.callAzureOpenAI(content, model);
      } else if (model.startsWith('gpt-')) {
        return await this.callOpenAI(content, model);
      } else if (model.startsWith('claude-')) {
        return await this.callClaude(content, model);
      } else if (model.startsWith('gemini-')) {
        return await this.callGemini(content);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error) {
      console.log(`❌ Failed to call ${model}: ${error.message}`);
      throw error;
    }
  }

  async route(params) {
    const { content, task_type, latency_requirement, ai_budget } = params;
    const tokenCount = this.estimateTokenCount(content);
    const currentSpend = this.getCurrentDailySpend();
    
    if (currentSpend >= ai_budget) {
      throw new Error(`Daily AI budget of ${ai_budget} cents exceeded. Current spend: ${currentSpend} cents`);
    }
    
    const selectedModel = this.selectOptimalModel(
      tokenCount,
      task_type,
      latency_requirement,
      currentSpend,
      ai_budget
    );
    
    const availableModels = this.getAvailableModels();
    const modelInfo = {
      selected: selectedModel,
      available: availableModels,
      token_count: tokenCount,
      current_spend: currentSpend,
      budget: ai_budget,
      budget_used_percent: Math.round((currentSpend / ai_budget) * 100)
    };
    
    let result;
    let finalModel = selectedModel;
    
    try {
      console.log(`📊 Model routing decision: ${selectedModel} (Available: ${availableModels.join(', ')})`);
      result = await this.callModel(content, selectedModel);
      console.log(`✅ Successfully called ${selectedModel}`);
    } catch (error) {
      console.log(`⚠️ Failed to call ${selectedModel}: ${error.message}`);
      
      // Try fallback models in order
      const fallbackModels = ['gpt-4o-mini', 'gpt-3.5-turbo', 'claude-3-haiku-20240307', 'gemini-1.5-flash'];
      let fallbackSuccess = false;
      
      for (const fallbackModel of fallbackModels) {
        if (availableModels.includes(fallbackModel)) {
          try {
            console.log(`🔄 Trying fallback model: ${fallbackModel}`);
            finalModel = fallbackModel;
            result = await this.callModel(content, fallbackModel);
            fallbackSuccess = true;
            console.log(`✅ Fallback successful with ${fallbackModel}`);
            break;
          } catch (fallbackError) {
            console.log(`❌ Fallback ${fallbackModel} also failed: ${fallbackError.message}`);
          }
        }
      }
      
      if (!fallbackSuccess) {
        throw new Error('All AI models failed. Please check your API keys.');
      }
    }
    
    const estimatedCost = Math.round((tokenCount / 1000) * this.getModelCostPer1kTokens(finalModel));
    this.updateDailySpend(estimatedCost);
    
    return {
      response: result.content,
      model_info: {
        ...modelInfo,
        final_model_used: finalModel,
        provider: result.provider,
        estimated_cost_cents: estimatedCost
      },
      usage: result.usage,
      routing_decision: {
        task_type: task_type,
        latency_requirement: latency_requirement,
        token_count: tokenCount,
        budget_constraints: currentSpend >= ai_budget * 0.8
      }
    };
  }
}