import { UnifiedAIService } from './unified-ai-service';
import { createClient } from '@supabase/supabase-js';

export interface RAGConfig {
  retrievalTopK?: number;
  hybridSearchWeight?: number; // Balance between vector and keyword search
  rerankingEnabled?: boolean;
  contextWindowSize?: number;
  enableCitations?: boolean;
  providers?: {
    embedding?: string;
    generation?: string;
    reranking?: string;
  };
}

export interface RAGQuery {
  question: string;
  projectId?: string;
  filters?: {
    documentTypes?: string[];
    dateRange?: { start: Date; end: Date };
    tags?: string[];
    sources?: string[];
  };
  includeImages?: boolean;
  includeTables?: boolean;
  conversationHistory?: Message[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface RAGResponse {
  answer: string;
  citations: Citation[];
  relevantDocuments: RelevantDocument[];
  confidence: number;
  suggestedActions?: Action[];
  relatedQuestions?: string[];
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  pageNumber?: number;
  confidence: number;
  url?: string;
}

export interface RelevantDocument {
  id: string;
  title: string;
  snippet: string;
  relevanceScore: number;
  metadata: any;
}

export interface Action {
  type: 'create_task' | 'send_message' | 'schedule_meeting' | 'update_document';
  description: string;
  parameters: any;
}

export class RAGSystem {
  private aiService: UnifiedAIService;
  private supabase: any;
  private config: RAGConfig;

  constructor(aiService: UnifiedAIService, config: RAGConfig = {}) {
    this.aiService = aiService;
    this.config = {
      retrievalTopK: 12,
      hybridSearchWeight: 0.7,
      rerankingEnabled: true,
      contextWindowSize: 8000,
      enableCitations: true,
      ...config
    };
    
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );
  }

  async query(ragQuery: RAGQuery): Promise<RAGResponse> {
    try {
      // Step 1: Create embedding for the query
      const queryEmbedding = await this.createQueryEmbedding(ragQuery.question);

      // Step 2: Perform hybrid search (vector + keyword)
      const searchResults = await this.hybridSearch(
        queryEmbedding,
        ragQuery.question,
        ragQuery.projectId,
        ragQuery.filters
      );

      // Step 3: Rerank results if enabled
      const rankedResults = this.config.rerankingEnabled
        ? await this.rerankResults(ragQuery.question, searchResults)
        : searchResults;

      // Step 4: Build context from top results
      const context = await this.buildContext(
        rankedResults,
        ragQuery.includeImages,
        ragQuery.includeTables
      );

      // Step 5: Generate response using multiple models
      const response = await this.generateResponse(
        ragQuery.question,
        context,
        ragQuery.conversationHistory
      );

      // Step 6: Extract citations and actions
      const { answer, citations, actions } = await this.processResponse(
        response,
        rankedResults
      );

      // Step 7: Generate related questions
      const relatedQuestions = await this.generateRelatedQuestions(
        ragQuery.question,
        answer,
        context
      );

      // Step 8: Calculate confidence score
      const confidence = this.calculateConfidence(rankedResults, citations);

      return {
        answer,
        citations,
        relevantDocuments: this.formatRelevantDocuments(rankedResults),
        confidence,
        suggestedActions: actions,
        relatedQuestions
      };
    } catch (error) {
      console.error('RAG query error:', error);
      throw new Error(`RAG system error: ${error.message}`);
    }
  }

  private async createQueryEmbedding(question: string): Promise<number[]> {
    const provider = this.config.providers?.embedding || 'openAI';
    return await this.aiService.createEmbedding(question, provider);
  }

  private async hybridSearch(
    embedding: number[],
    query: string,
    projectId?: string,
    filters?: any
  ): Promise<any[]> {
    // Vector search
    const vectorResults = await this.vectorSearch(embedding, projectId, filters);
    
    // Keyword search
    const keywordResults = await this.keywordSearch(query, projectId, filters);

    // Combine results with weighting
    return this.combineSearchResults(
      vectorResults,
      keywordResults,
      this.config.hybridSearchWeight!
    );
  }

  private async vectorSearch(
    embedding: number[],
    projectId?: string,
    filters?: any
  ): Promise<any[]> {
    const { data, error } = await this.supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: this.config.retrievalTopK! * 2, // Get more for filtering
      filter_project_id: projectId
    });

    if (error) {
      console.error('Vector search error:', error);
      return [];
    }

    // Apply additional filters
    let results = data || [];
    
    if (filters?.documentTypes?.length > 0) {
      results = results.filter(r => 
        filters.documentTypes.includes(r.metadata?.document_type)
      );
    }

    if (filters?.dateRange) {
      results = results.filter(r => {
        const docDate = new Date(r.metadata?.created_at);
        return docDate >= filters.dateRange.start && docDate <= filters.dateRange.end;
      });
    }

    return results.slice(0, this.config.retrievalTopK);
  }

  private async keywordSearch(
    query: string,
    projectId?: string,
    filters?: any
  ): Promise<any[]> {
    // Extract keywords from query
    const keywords = await this.extractKeywords(query);

    // Search using full-text search
    let searchQuery = this.supabase
      .from('vector_index')
      .select('*')
      .textSearch('content', keywords.join(' | '));

    if (projectId) {
      searchQuery = searchQuery.eq('project_id', projectId);
    }

    const { data, error } = await searchQuery.limit(this.config.retrievalTopK);

    if (error) {
      console.error('Keyword search error:', error);
      return [];
    }

    return data || [];
  }

  private combineSearchResults(
    vectorResults: any[],
    keywordResults: any[],
    weight: number
  ): any[] {
    const combined = new Map();

    // Add vector results with weighted scores
    vectorResults.forEach(result => {
      combined.set(result.chunk_id, {
        ...result,
        combinedScore: result.similarity * weight
      });
    });

    // Add or update with keyword results
    keywordResults.forEach(result => {
      if (combined.has(result.chunk_id)) {
        const existing = combined.get(result.chunk_id);
        existing.combinedScore += (1 - weight) * 0.8; // Keyword match bonus
      } else {
        combined.set(result.chunk_id, {
          ...result,
          combinedScore: (1 - weight) * 0.8
        });
      }
    });

    // Sort by combined score
    return Array.from(combined.values())
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, this.config.retrievalTopK);
  }

  private async rerankResults(query: string, results: any[]): Promise<any[]> {
    // Use a reranking model (e.g., Cohere rerank)
    const rerankPrompt = `Given the query "${query}", rank these text chunks by relevance:
    ${results.map((r, i) => `[${i}] ${r.content.substring(0, 200)}...`).join('\n\n')}
    
    Return the indices in order of relevance as a JSON array.`;

    const response = await this.aiService.processRequest({
      type: 'completion',
      prompt: rerankPrompt,
      options: {
        temperature: 0.1,
        model: this.config.providers?.reranking || 'gpt-4'
      }
    });

    try {
      const indices = JSON.parse(response.data);
      return indices.map(i => results[i]).filter(Boolean);
    } catch {
      return results; // Return original if reranking fails
    }
  }

  private async buildContext(
    results: any[],
    includeImages?: boolean,
    includeTables?: boolean
  ): Promise<string> {
    let context = 'Context from relevant documents:\n\n';

    for (const result of results) {
      // Add text content
      context += `[Document ${result.doc_id}, Page ${result.metadata?.page_numbers?.join(', ') || 'N/A'}]\n`;
      context += `${result.content}\n\n`;

      // Add images if requested
      if (includeImages && result.image_id) {
        const image = await this.fetchImage(result.image_id);
        if (image) {
          context += `[Image: ${image.description || 'No description'}]\n\n`;
        }
      }

      // Add tables if requested
      if (includeTables && result.metadata?.has_tables) {
        const tables = await this.fetchTables(result.doc_id);
        tables.forEach(table => {
          context += `[Table: ${table.headers?.join(' | ') || 'No headers'}]\n`;
          context += `${table.data.slice(0, 3).map(row => row.join(' | ')).join('\n')}\n\n`;
        });
      }
    }

    return context;
  }

  private async generateResponse(
    question: string,
    context: string,
    conversationHistory?: Message[]
  ): Promise<string> {
    const systemPrompt = `You are an AI assistant for construction project management. 
    Answer questions based on the provided context. Be precise and cite specific documents when possible.
    If you cannot answer based on the context, say so clearly.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` }
    ];

    // Try primary provider first
    const primaryProvider = this.config.providers?.generation || 'gpt-4';
    
    try {
      const response = await this.aiService.processRequest({
        type: 'completion',
        messages,
        options: {
          temperature: 0.7,
          maxTokens: 2000,
          model: primaryProvider
        }
      });

      return response.data;
    } catch (error) {
      // Fallback to another provider
      console.error(`Primary provider ${primaryProvider} failed:`, error);
      
      const fallbackResponse = await this.aiService.processRequest({
        type: 'completion',
        messages,
        options: {
          temperature: 0.7,
          maxTokens: 2000,
          model: 'claude-3-opus-20240229'
        }
      });

      return fallbackResponse.data;
    }
  }

  private async processResponse(
    response: string,
    searchResults: any[]
  ): Promise<{ answer: string; citations: Citation[]; actions: Action[] }> {
    // Extract citations from response
    const citationRegex = /\[(\d+)\]/g;
    const citationMatches = response.match(citationRegex) || [];
    
    const citations: Citation[] = [];
    const citedIndices = new Set<number>();

    citationMatches.forEach(match => {
      const index = parseInt(match.replace(/[\[\]]/g, ''));
      if (index < searchResults.length && !citedIndices.has(index)) {
        citedIndices.add(index);
        const result = searchResults[index];
        citations.push({
          id: result.chunk_id,
          text: result.content.substring(0, 200) + '...',
          source: result.metadata?.filename || 'Unknown source',
          pageNumber: result.metadata?.page_numbers?.[0],
          confidence: result.combinedScore || result.similarity,
          url: result.metadata?.url
        });
      }
    });

    // Extract suggested actions
    const actions = await this.extractActions(response);

    // Clean answer of citation markers
    const cleanAnswer = response.replace(citationRegex, '');

    return { answer: cleanAnswer, citations, actions };
  }

  private async extractActions(response: string): Promise<Action[]> {
    const actionPrompt = `Extract any actionable items from this response:
    "${response}"
    
    Return a JSON array of actions with type and parameters. Types can be: create_task, send_message, schedule_meeting, update_document.`;

    try {
      const actionResponse = await this.aiService.processRequest({
        type: 'completion',
        prompt: actionPrompt,
        options: {
          temperature: 0.1,
          model: 'gpt-4'
        }
      });

      return JSON.parse(actionResponse.data);
    } catch {
      return [];
    }
  }

  private async generateRelatedQuestions(
    originalQuestion: string,
    answer: string,
    context: string
  ): Promise<string[]> {
    const prompt = `Based on the question "${originalQuestion}" and the provided answer and context, 
    generate 3 related follow-up questions that the user might want to ask next.
    Return as a JSON array of strings.`;

    try {
      const response = await this.aiService.processRequest({
        type: 'completion',
        prompt,
        options: {
          temperature: 0.8,
          model: 'gpt-4'
        }
      });

      return JSON.parse(response.data);
    } catch {
      return [];
    }
  }

  private calculateConfidence(results: any[], citations: Citation[]): number {
    if (results.length === 0) return 0;

    // Factors: result relevance scores, citation count, consistency
    const avgRelevance = results.slice(0, 5)
      .reduce((sum, r) => sum + (r.combinedScore || r.similarity || 0), 0) / 5;
    
    const citationRatio = citations.length / Math.min(results.length, 5);
    
    return Math.min(avgRelevance * 0.7 + citationRatio * 0.3, 1);
  }

  private formatRelevantDocuments(results: any[]): RelevantDocument[] {
    return results.slice(0, 5).map(result => ({
      id: result.doc_id,
      title: result.metadata?.filename || 'Untitled Document',
      snippet: result.content.substring(0, 200) + '...',
      relevanceScore: result.combinedScore || result.similarity || 0,
      metadata: result.metadata
    }));
  }

  private async extractKeywords(query: string): Promise<string[]> {
    // Simple keyword extraction - in production, use NLP library
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but']);
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  private async fetchImage(imageId: string): Promise<any> {
    const { data } = await this.supabase
      .from('document_images')
      .select('*')
      .eq('id', imageId)
      .single();
    
    return data;
  }

  private async fetchTables(docId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('document_tables')
      .select('*')
      .eq('document_id', docId);
    
    return data || [];
  }

  // Advanced features
  async compareDocuments(
    docIds: string[],
    aspects?: string[]
  ): Promise<{
    similarities: string[];
    differences: string[];
    summary: string;
  }> {
    const documents = await Promise.all(
      docIds.map(id => this.fetchDocument(id))
    );

    const prompt = `Compare these documents:
    ${documents.map((doc, i) => `Document ${i + 1}: ${doc.content.substring(0, 1000)}...`).join('\n\n')}
    
    ${aspects ? `Focus on these aspects: ${aspects.join(', ')}` : ''}
    
    Provide similarities, differences, and a summary.`;

    const response = await this.aiService.processRequest({
      type: 'completion',
      prompt,
      options: { temperature: 0.7 }
    });

    // Parse and structure the response
    return this.parseComparisonResponse(response.data);
  }

  private async fetchDocument(docId: string): Promise<any> {
    const { data } = await this.supabase
      .from('documents')
      .select('*')
      .eq('id', docId)
      .single();
    
    return data;
  }

  private parseComparisonResponse(response: string): any {
    // Implementation would parse the structured response
    return {
      similarities: [],
      differences: [],
      summary: response
    };
  }
}