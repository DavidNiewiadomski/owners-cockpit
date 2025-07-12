import { UnifiedAIService } from './unified-ai-service';
import { ConstructionOntology } from './construction-ontology';
import { createClient } from '@supabase/supabase-js';

export interface AIPGatewayConfig {
  enableGuardrails: boolean;
  enableMonitoring: boolean;
  enableCaching: boolean;
  maxRequestsPerMinute?: number;
  maxTokensPerRequest?: number;
  allowedProviders?: string[];
  blockedContent?: string[];
  sensitiveDataPatterns?: RegExp[];
}

export interface Guardrail {
  id: string;
  name: string;
  type: 'input' | 'output' | 'both';
  enabled: boolean;
  priority: number;
  check: (content: any, context?: any) => Promise<GuardrailResult>;
}

export interface GuardrailResult {
  passed: boolean;
  reason?: string;
  modifiedContent?: any;
  metadata?: any;
}

export interface AIRequest {
  id: string;
  timestamp: Date;
  userId: string;
  projectId?: string;
  type: string;
  provider: string;
  input: any;
  output?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'blocked';
  guardrailResults?: GuardrailResult[];
  metrics?: RequestMetrics;
}

export interface RequestMetrics {
  latency: number;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
  cacheHit?: boolean;
}

export class AIPGateway {
  private aiService: UnifiedAIService;
  private ontology: ConstructionOntology;
  private config: AIPGatewayConfig;
  private supabase: any;
  private guardrails: Map<string, Guardrail> = new Map();
  private requestCache: Map<string, any> = new Map();
  private rateLimiter: Map<string, number[]> = new Map();

  constructor(
    aiService: UnifiedAIService,
    ontology: ConstructionOntology,
    config: AIPGatewayConfig
  ) {
    this.aiService = aiService;
    this.ontology = ontology;
    this.config = config;
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );
    
    this.initializeGuardrails();
  }

  private initializeGuardrails() {
    // Content Safety Guardrail
    this.addGuardrail({
      id: 'content-safety',
      name: 'Content Safety Check',
      type: 'both',
      enabled: true,
      priority: 1,
      check: async (content) => {
        const text = typeof content === 'string' ? content : JSON.stringify(content);
        
        // Check for blocked content
        if (this.config.blockedContent?.some(blocked => 
          text.toLowerCase().includes(blocked.toLowerCase())
        )) {
          return {
            passed: false,
            reason: 'Content contains blocked terms'
          };
        }

        // Check for inappropriate content using AI
        const safetyCheck = await this.performSafetyCheck(text);
        return safetyCheck;
      }
    });

    // PII Detection Guardrail
    this.addGuardrail({
      id: 'pii-detection',
      name: 'PII Detection',
      type: 'both',
      enabled: true,
      priority: 2,
      check: async (content) => {
        const text = typeof content === 'string' ? content : JSON.stringify(content);
        const piiFound = await this.detectPII(text);
        
        if (piiFound.length > 0) {
          return {
            passed: false,
            reason: 'PII detected in content',
            modifiedContent: this.redactPII(text, piiFound),
            metadata: { piiTypes: piiFound }
          };
        }

        return { passed: true };
      }
    });

    // Construction Domain Validation
    this.addGuardrail({
      id: 'domain-validation',
      name: 'Construction Domain Validation',
      type: 'input',
      enabled: true,
      priority: 3,
      check: async (content, context) => {
        if (context?.skipDomainValidation) {
          return { passed: true };
        }

        const validation = await this.validateConstructionDomain(content);
        return validation;
      }
    });

    // Output Quality Check
    this.addGuardrail({
      id: 'output-quality',
      name: 'Output Quality Check',
      type: 'output',
      enabled: true,
      priority: 4,
      check: async (content) => {
        const quality = await this.assessOutputQuality(content);
        
        if (quality.score < 0.7) {
          return {
            passed: false,
            reason: 'Output quality below threshold',
            metadata: quality
          };
        }

        return { passed: true, metadata: quality };
      }
    });

    // Token Limit Guardrail
    this.addGuardrail({
      id: 'token-limit',
      name: 'Token Limit Check',
      type: 'input',
      enabled: true,
      priority: 5,
      check: async (content) => {
        const tokenCount = this.estimateTokens(content);
        
        if (tokenCount > (this.config.maxTokensPerRequest || 4000)) {
          return {
            passed: false,
            reason: `Token count (${tokenCount}) exceeds limit`,
            modifiedContent: this.truncateContent(content, this.config.maxTokensPerRequest || 4000)
          };
        }

        return { passed: true, metadata: { tokenCount } };
      }
    });

    // Cost Control Guardrail
    this.addGuardrail({
      id: 'cost-control',
      name: 'Cost Control',
      type: 'input',
      enabled: true,
      priority: 6,
      check: async (content, context) => {
        const estimatedCost = await this.estimateCost(content, context);
        
        if (estimatedCost > (context?.maxCost || 10)) {
          return {
            passed: false,
            reason: `Estimated cost ($${estimatedCost}) exceeds limit`,
            metadata: { estimatedCost }
          };
        }

        return { passed: true, metadata: { estimatedCost } };
      }
    });

    // Hallucination Detection
    this.addGuardrail({
      id: 'hallucination-detection',
      name: 'Hallucination Detection',
      type: 'output',
      enabled: true,
      priority: 7,
      check: async (content, context) => {
        if (!context?.groundTruth) {
          return { passed: true };
        }

        const hallucinations = await this.detectHallucinations(content, context.groundTruth);
        
        if (hallucinations.length > 0) {
          return {
            passed: false,
            reason: 'Potential hallucinations detected',
            metadata: { hallucinations }
          };
        }

        return { passed: true };
      }
    });
  }

  addGuardrail(guardrail: Guardrail): void {
    this.guardrails.set(guardrail.id, guardrail);
  }

  async processRequest(
    request: Omit<AIRequest, 'id' | 'timestamp' | 'status' | 'guardrailResults' | 'metrics'>,
    context?: any
  ): Promise<AIRequest> {
    const startTime = Date.now();
    
    const aiRequest: AIRequest = {
      ...request,
      id: this.generateRequestId(),
      timestamp: new Date(),
      status: 'pending',
      guardrailResults: [],
      metrics: {} as RequestMetrics
    };

    try {
      // Check rate limits
      if (!await this.checkRateLimit(request.userId)) {
        throw new Error('Rate limit exceeded');
      }

      // Check cache
      if (this.config.enableCaching) {
        const cacheKey = this.generateCacheKey(request);
        const cachedResult = this.requestCache.get(cacheKey);
        
        if (cachedResult) {
          aiRequest.output = cachedResult;
          aiRequest.status = 'completed';
          aiRequest.metrics!.cacheHit = true;
          aiRequest.metrics!.latency = Date.now() - startTime;
          return aiRequest;
        }
      }

      // Apply input guardrails
      const inputGuardrailResults = await this.applyGuardrails(
        request.input,
        'input',
        context
      );
      
      aiRequest.guardrailResults = inputGuardrailResults;

      // Check if any input guardrails failed
      const failedInputGuardrail = inputGuardrailResults.find(r => !r.passed);
      if (failedInputGuardrail) {
        aiRequest.status = 'blocked';
        throw new Error(`Blocked by guardrail: ${failedInputGuardrail.reason}`);
      }

      // Process through AI service
      aiRequest.status = 'processing';
      const modifiedInput = this.getModifiedContent(inputGuardrailResults) || request.input;
      
      const response = await this.aiService.processRequest({
        type: request.type as any,
        prompt: modifiedInput.prompt,
        messages: modifiedInput.messages,
        data: modifiedInput.data,
        options: modifiedInput.options
      });

      aiRequest.output = response.data;

      // Apply output guardrails
      const outputGuardrailResults = await this.applyGuardrails(
        response.data,
        'output',
        { ...context, input: request.input }
      );
      
      aiRequest.guardrailResults = [
        ...aiRequest.guardrailResults!,
        ...outputGuardrailResults
      ];

      // Check if any output guardrails failed
      const failedOutputGuardrail = outputGuardrailResults.find(r => !r.passed);
      if (failedOutputGuardrail) {
        aiRequest.status = 'blocked';
        throw new Error(`Output blocked by guardrail: ${failedOutputGuardrail.reason}`);
      }

      // Apply any output modifications
      const modifiedOutput = this.getModifiedContent(outputGuardrailResults);
      if (modifiedOutput) {
        aiRequest.output = modifiedOutput;
      }

      aiRequest.status = 'completed';

      // Update metrics
      aiRequest.metrics = {
        latency: Date.now() - startTime,
        inputTokens: response.usage?.promptTokens,
        outputTokens: response.usage?.completionTokens,
        cost: await this.calculateActualCost(response),
        cacheHit: false
      };

      // Cache successful response
      if (this.config.enableCaching) {
        const cacheKey = this.generateCacheKey(request);
        this.requestCache.set(cacheKey, aiRequest.output);
        
        // Expire cache after 1 hour
        setTimeout(() => this.requestCache.delete(cacheKey), 3600000);
      }

      // Log request
      if (this.config.enableMonitoring) {
        await this.logRequest(aiRequest);
      }

    } catch (error) {
      aiRequest.status = 'failed';
      aiRequest.metrics!.latency = Date.now() - startTime;
      
      if (this.config.enableMonitoring) {
        await this.logRequest(aiRequest, error);
      }
      
      throw error;
    }

    return aiRequest;
  }

  private async applyGuardrails(
    content: any,
    type: 'input' | 'output' | 'both',
    context?: any
  ): Promise<GuardrailResult[]> {
    const results: GuardrailResult[] = [];
    
    // Sort guardrails by priority
    const applicableGuardrails = Array.from(this.guardrails.values())
      .filter(g => g.enabled && (g.type === type || g.type === 'both'))
      .sort((a, b) => a.priority - b.priority);

    for (const guardrail of applicableGuardrails) {
      const result = await guardrail.check(content, context);
      results.push({ ...result, guardrailId: guardrail.id });
      
      // Stop if guardrail failed and modified content
      if (!result.passed && result.modifiedContent) {
        content = result.modifiedContent;
      }
    }

    return results;
  }

  private async performSafetyCheck(text: string): Promise<GuardrailResult> {
    // Use AI to check for unsafe content
    const response = await this.aiService.processRequest({
      type: 'completion',
      prompt: `Analyze this text for safety issues (violence, hate speech, illegal activities, etc.): "${text.substring(0, 500)}..."
      Respond with JSON: { safe: boolean, reason?: string }`,
      options: {
        temperature: 0.1,
        model: 'gpt-4',
        maxTokens: 100
      }
    });

    try {
      const safety = JSON.parse(response.data);
      return {
        passed: safety.safe,
        reason: safety.reason
      };
    } catch {
      return { passed: true };
    }
  }

  private async detectPII(text: string): Promise<string[]> {
    const piiTypes: string[] = [];
    
    // Use regex patterns for common PII
    const patterns = this.config.sensitiveDataPatterns || [
      { type: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/ },
      { type: 'email', pattern: /\b[\w.-]+@[\w.-]+\.\w+\b/ },
      { type: 'phone', pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/ },
      { type: 'creditCard', pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/ }
    ];

    patterns.forEach(({ type, pattern }) => {
      if (pattern.test(text)) {
        piiTypes.push(type);
      }
    });

    return piiTypes;
  }

  private redactPII(text: string, piiTypes: string[]): string {
    let redacted = text;
    
    const patterns = {
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      email: /\b[\w.-]+@[\w.-]+\.\w+\b/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
    };

    piiTypes.forEach(type => {
      if (patterns[type]) {
        redacted = redacted.replace(patterns[type], '[REDACTED]');
      }
    });

    return redacted;
  }

  private async validateConstructionDomain(content: any): Promise<GuardrailResult> {
    const text = typeof content === 'string' ? content : content.prompt || JSON.stringify(content);
    
    // Query ontology for relevant concepts
    const query = await this.ontology.query({
      text,
      includeRelated: true,
      depth: 1
    });

    if (query.concepts.length === 0) {
      // No construction concepts found
      return {
        passed: true,
        metadata: { warning: 'No construction domain concepts detected' }
      };
    }

    // Validate against ontology rules
    const validationErrors = [];
    
    for (const concept of query.concepts) {
      if (concept.type === 'class' && content.data) {
        const validation = this.ontology.validateData(content.data, concept.id);
        if (!validation.valid) {
          validationErrors.push(...validation.errors);
        }
      }
    }

    return {
      passed: validationErrors.length === 0,
      reason: validationErrors.join('; '),
      metadata: { concepts: query.concepts.map(c => c.name) }
    };
  }

  private async assessOutputQuality(content: any): Promise<{ score: number; issues: string[] }> {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    const issues: string[] = [];
    
    // Check length
    if (text.length < 50) {
      issues.push('Response too short');
    }

    // Check for incomplete sentences
    if (text.endsWith('...') || text.endsWith('..')) {
      issues.push('Response appears incomplete');
    }

    // Check for repetition
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);
    const repetitionRatio = uniqueWords.size / words.length;
    if (repetitionRatio < 0.5) {
      issues.push('High repetition detected');
    }

    // Check for construction terminology accuracy
    const constructionTerms = ['project', 'schedule', 'budget', 'contractor', 'specification'];
    const hasRelevantTerms = constructionTerms.some(term => 
      text.toLowerCase().includes(term)
    );

    if (!hasRelevantTerms && text.length > 200) {
      issues.push('Missing construction domain terminology');
    }

    const score = 1 - (issues.length * 0.2);
    return { score: Math.max(0, score), issues };
  }

  private async detectHallucinations(
    output: string,
    groundTruth: any[]
  ): Promise<string[]> {
    const hallucinations: string[] = [];
    
    // Extract claims from output
    const claims = this.extractClaims(output);
    
    // Verify each claim against ground truth
    for (const claim of claims) {
      const verified = groundTruth.some(truth => 
        this.verifyClaim(claim, truth)
      );
      
      if (!verified) {
        hallucinations.push(claim);
      }
    }

    return hallucinations;
  }

  private extractClaims(text: string): string[] {
    // Simple sentence extraction - in production, use NLP
    return text.split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 20);
  }

  private verifyClaim(claim: string, truth: any): boolean {
    // Simple similarity check - in production, use semantic similarity
    const truthText = typeof truth === 'string' ? truth : JSON.stringify(truth);
    return truthText.toLowerCase().includes(claim.toLowerCase().substring(0, 50));
  }

  private estimateTokens(content: any): number {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  private truncateContent(content: any, maxTokens: number): any {
    if (typeof content === 'string') {
      const maxChars = maxTokens * 4;
      return content.substring(0, maxChars) + '...';
    }
    
    // For structured content, truncate the largest fields
    const truncated = { ...content };
    if (truncated.prompt) {
      truncated.prompt = this.truncateContent(truncated.prompt, maxTokens);
    }
    
    return truncated;
  }

  private async estimateCost(content: any, context: any): Promise<number> {
    const tokens = this.estimateTokens(content);
    const provider = context?.provider || 'openai';
    
    // Cost per 1K tokens (approximate)
    const costs = {
      'openai': { input: 0.03, output: 0.06 },
      'anthropic': { input: 0.025, output: 0.125 },
      'gemini': { input: 0.001, output: 0.002 }
    };

    const providerCost = costs[provider] || costs.openai;
    return (tokens / 1000) * providerCost.input;
  }

  private async calculateActualCost(response: any): Promise<number> {
    const usage = response.usage;
    if (!usage) return 0;

    const provider = response.provider;
    const costs = {
      'openai': { input: 0.03, output: 0.06 },
      'anthropic': { input: 0.025, output: 0.125 },
      'gemini': { input: 0.001, output: 0.002 }
    };

    const providerCost = costs[provider] || costs.openai;
    
    return (
      (usage.promptTokens / 1000) * providerCost.input +
      (usage.completionTokens / 1000) * providerCost.output
    );
  }

  private async checkRateLimit(userId: string): Promise<boolean> {
    if (!this.config.maxRequestsPerMinute) return true;

    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    if (!this.rateLimiter.has(userId)) {
      this.rateLimiter.set(userId, []);
    }

    const requests = this.rateLimiter.get(userId)!;
    
    // Remove old requests
    const recentRequests = requests.filter(time => time > windowStart);
    this.rateLimiter.set(userId, recentRequests);

    if (recentRequests.length >= this.config.maxRequestsPerMinute) {
      return false;
    }

    recentRequests.push(now);
    return true;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(request: any): string {
    const key = `${request.type}_${request.provider}_${JSON.stringify(request.input)}`;
    return Buffer.from(key).toString('base64');
  }

  private getModifiedContent(guardrailResults: GuardrailResult[]): any {
    const lastModification = guardrailResults
      .filter(r => r.modifiedContent)
      .pop();
    
    return lastModification?.modifiedContent;
  }

  private async logRequest(request: AIRequest, error?: Error): Promise<void> {
    await this.supabase.from('aip_gateway_logs').insert({
      request_id: request.id,
      timestamp: request.timestamp,
      user_id: request.userId,
      project_id: request.projectId,
      type: request.type,
      provider: request.provider,
      status: request.status,
      guardrail_results: request.guardrailResults,
      metrics: request.metrics,
      error: error?.message,
      error_stack: error?.stack
    });
  }

  // Analytics methods
  async getUsageAnalytics(
    userId?: string,
    projectId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    let query = this.supabase
      .from('aip_gateway_logs')
      .select('*');

    if (userId) query = query.eq('user_id', userId);
    if (projectId) query = query.eq('project_id', projectId);
    if (startDate) query = query.gte('timestamp', startDate.toISOString());
    if (endDate) query = query.lte('timestamp', endDate.toISOString());

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }

    return this.aggregateAnalytics(data);
  }

  private aggregateAnalytics(logs: any[]): any {
    return {
      totalRequests: logs.length,
      successRate: logs.filter(l => l.status === 'completed').length / logs.length,
      averageLatency: logs.reduce((sum, l) => sum + (l.metrics?.latency || 0), 0) / logs.length,
      totalCost: logs.reduce((sum, l) => sum + (l.metrics?.cost || 0), 0),
      byProvider: this.groupBy(logs, 'provider'),
      byType: this.groupBy(logs, 'type'),
      guardrailViolations: logs.filter(l => 
        l.guardrail_results?.some(r => !r.passed)
      ).length,
      cacheHitRate: logs.filter(l => l.metrics?.cacheHit).length / logs.length
    };
  }

  private groupBy(array: any[], key: string): any {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    }, {});
  }
}