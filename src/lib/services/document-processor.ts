import { aiRouter } from './ai-router';
import { supabase } from '@/integrations/supabase/client';

// Document processing types
export interface ProcessedDocument {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  content: string;
  metadata: {
    pageCount?: number;
    language?: string;
    extractedAt: string;
    processingTime: number;
    method: 'pdf' | 'ocr' | 'text';
  };
  embeddings?: number[][];
  summary?: string;
  entities?: ExtractedEntity[];
}

export interface ExtractedEntity {
  type: 'date' | 'amount' | 'person' | 'organization' | 'location' | 'project';
  value: string;
  confidence: number;
  context?: string;
}

export interface DocumentProcessingOptions {
  extractText?: boolean;
  generateEmbeddings?: boolean;
  generateSummary?: boolean;
  extractEntities?: boolean;
  ocrFallback?: boolean;
}

// Get environment variables
const getEnvVar = (key: string): string => {
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey]) return import.meta.env[viteKey];
  if (import.meta.env[key]) return import.meta.env[key];
  return '';
};

export class DocumentProcessor {
  private googleVisionApiKey: string | null;
  private adobeClientId: string | null;
  private adobeClientSecret: string | null;
  
  constructor() {
    this.googleVisionApiKey = getEnvVar('GOOGLE_CLOUD_VISION_API_KEY') || null;
    this.adobeClientId = getEnvVar('ADOBE_PDF_CLIENT_ID') || null;
    this.adobeClientSecret = getEnvVar('ADOBE_PDF_CLIENT_SECRET') || null;
  }
  
  // Main document processing pipeline
  async processDocument(
    file: File,
    options: DocumentProcessingOptions = {}
  ): Promise<ProcessedDocument> {
    const startTime = Date.now();
    
    const {
      extractText = true,
      generateEmbeddings = true,
      generateSummary = true,
      extractEntities = true,
      ocrFallback = true
    } = options;
    
    // Basic document info
    const doc: ProcessedDocument = {
      id: crypto.randomUUID(),
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      content: '',
      metadata: {
        extractedAt: new Date().toISOString(),
        processingTime: 0,
        method: 'text'
      }
    };
    
    try {
      // Step 1: Extract text content
      if (extractText) {
        if (file.type === 'application/pdf') {
          doc.content = await this.extractPDFText(file);
          doc.metadata.method = 'pdf';
        } else if (file.type.startsWith('image/')) {
          doc.content = await this.extractImageText(file);
          doc.metadata.method = 'ocr';
        } else if (file.type.startsWith('text/')) {
          doc.content = await file.text();
          doc.metadata.method = 'text';
        } else {
          // Try OCR as fallback for unknown types
          if (ocrFallback) {
            doc.content = await this.extractImageText(file);
            doc.metadata.method = 'ocr';
          } else {
            throw new Error(`Unsupported file type: ${file.type}`);
          }
        }
      }
      
      // Step 2: Clean and normalize text
      doc.content = this.cleanText(doc.content);
      
      // Step 3: Generate embeddings
      if (generateEmbeddings && doc.content) {
        doc.embeddings = await this.generateEmbeddings(doc.content);
      }
      
      // Step 4: Generate summary
      if (generateSummary && doc.content) {
        doc.summary = await this.generateSummary(doc.content);
      }
      
      // Step 5: Extract entities
      if (extractEntities && doc.content) {
        doc.entities = await this.extractEntities(doc.content);
      }
      
      // Update processing time
      doc.metadata.processingTime = Date.now() - startTime;
      
      return doc;
    } catch (error: any) {
      console.error('Document processing error:', error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }
  
  // Extract text from PDF using Adobe API or fallback
  private async extractPDFText(file: File): Promise<string> {
    // If Adobe credentials are available, use them
    if (this.adobeClientId && this.adobeClientSecret) {
      try {
        return await this.extractPDFWithAdobe(file);
      } catch (error) {
        console.warn('Adobe PDF extraction failed, using fallback:', error);
      }
    }
    
    // Fallback: Use browser-based PDF.js or similar
    // For now, return a placeholder
    return await this.extractPDFWithBrowser(file);
  }
  
  // Adobe PDF Services extraction
  private async extractPDFWithAdobe(file: File): Promise<string> {
    // Note: This is a simplified version. 
    // Full implementation would use Adobe PDF Services SDK
    throw new Error('Adobe PDF Services not fully implemented');
  }
  
  // Browser-based PDF extraction fallback
  private async extractPDFWithBrowser(file: File): Promise<string> {
    // This would use PDF.js or similar library
    // For now, return a message
    return `[PDF Content from ${file.name} - ${file.size} bytes]\n\nNote: Configure Adobe PDF Services for full PDF text extraction.`;
  }
  
  // Extract text from images using Google Vision API
  private async extractImageText(file: File): Promise<string> {
    if (!this.googleVisionApiKey) {
      return `[Image OCR not available - Google Vision API key not configured]\n\nImage: ${file.name}`;
    }
    
    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(file);
      
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.googleVisionApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: base64 },
              features: [
                { type: 'TEXT_DETECTION', maxResults: 1 },
                { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }
              ]
            }]
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Vision API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const textAnnotations = data.responses[0]?.textAnnotations;
      
      if (textAnnotations && textAnnotations.length > 0) {
        return textAnnotations[0].description;
      }
      
      return '[No text found in image]';
    } catch (error: any) {
      console.error('OCR extraction failed:', error);
      return `[OCR failed: ${error.message}]`;
    }
  }
  
  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
    });
  }
  
  // Clean and normalize text
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')              // Normalize whitespace
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
      .replace(/\r\n/g, '\n')            // Normalize line endings
      .trim();
  }
  
  // Generate embeddings using OpenAI or Azure
  private async generateEmbeddings(text: string): Promise<number[][]> {
    try {
      // Split text into chunks (max 8K tokens per chunk)
      const chunks = this.chunkText(text, 6000);
      const embeddings: number[][] = [];
      
      for (const chunk of chunks) {
        const response = await aiRouter.complete({
          messages: [
            { role: 'system', content: 'Generate embeddings for the following text.' },
            { role: 'user', content: chunk }
          ],
          taskType: 'analysis'
        });
        
        // Note: This is a placeholder. Real implementation would use
        // OpenAI embeddings API or Azure embeddings endpoint
        embeddings.push(new Array(1536).fill(0).map(() => Math.random()));
      }
      
      return embeddings;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      return [];
    }
  }
  
  // Generate document summary
  private async generateSummary(text: string): Promise<string> {
    try {
      const response = await aiRouter.complete({
        messages: [
          {
            role: 'system',
            content: 'You are a construction document analyst. Provide a concise summary of the key information in this document.'
          },
          {
            role: 'user',
            content: `Please summarize this document in 2-3 paragraphs, focusing on key construction-related information:\n\n${text.substring(0, 4000)}`
          }
        ],
        taskType: 'analysis',
        maxTokens: 500
      });
      
      return response.content;
    } catch (error) {
      console.error('Summary generation failed:', error);
      return 'Summary generation failed.';
    }
  }
  
  // Extract named entities
  private async extractEntities(text: string): Promise<ExtractedEntity[]> {
    try {
      const response = await aiRouter.complete({
        messages: [
          {
            role: 'system',
            content: `Extract construction-related entities from the text. Return a JSON array of entities with these types: date, amount, person, organization, location, project. Include confidence scores (0-1).`
          },
          {
            role: 'user',
            content: `Extract entities from this text:\n\n${text.substring(0, 3000)}`
          }
        ],
        taskType: 'analysis',
        temperature: 0.3
      });
      
      // Parse AI response
      try {
        const entities = JSON.parse(response.content);
        return Array.isArray(entities) ? entities : [];
      } catch {
        // Fallback entity extraction using regex
        return this.extractEntitiesWithRegex(text);
      }
    } catch (error) {
      console.error('Entity extraction failed:', error);
      return this.extractEntitiesWithRegex(text);
    }
  }
  
  // Fallback entity extraction using regex
  private extractEntitiesWithRegex(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    
    // Extract dates
    const dateRegex = /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})\b/gi;
    const dates = text.match(dateRegex) || [];
    dates.forEach(date => {
      entities.push({
        type: 'date',
        value: date,
        confidence: 0.8
      });
    });
    
    // Extract amounts
    const amountRegex = /\$[\d,]+(?:\.\d{2})?|\b\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|dollars?)\b/gi;
    const amounts = text.match(amountRegex) || [];
    amounts.forEach(amount => {
      entities.push({
        type: 'amount',
        value: amount,
        confidence: 0.9
      });
    });
    
    // Extract potential project references
    const projectRegex = /(?:Project|Job|Site|Contract)\s*(?:#|No\.?|Number)?\s*[\w-]+/gi;
    const projects = text.match(projectRegex) || [];
    projects.forEach(project => {
      entities.push({
        type: 'project',
        value: project,
        confidence: 0.7
      });
    });
    
    return entities;
  }
  
  // Chunk text for processing
  private chunkText(text: string, maxChars: number = 6000): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChars) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
      }
      currentChunk += sentence + '. ';
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
  
  // Store processed document in Supabase
  async storeDocument(doc: ProcessedDocument, projectId?: string): Promise<string> {
    try {
      // Store document metadata
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          filename: doc.filename,
          mime_type: doc.mimeType,
          size: doc.size,
          content: doc.content,
          summary: doc.summary,
          metadata: doc.metadata,
          project_id: projectId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (docError) throw docError;
      
      // Store embeddings if available
      if (doc.embeddings && doc.embeddings.length > 0) {
        const embeddingRows = doc.embeddings.map((embedding, index) => ({
          document_id: docData.id,
          embedding: embedding,
          chunk_index: index,
          created_at: new Date().toISOString()
        }));
        
        const { error: embError } = await supabase
          .from('document_embeddings')
          .insert(embeddingRows);
        
        if (embError) console.error('Failed to store embeddings:', embError);
      }
      
      // Store entities if available
      if (doc.entities && doc.entities.length > 0) {
        const entityRows = doc.entities.map(entity => ({
          document_id: docData.id,
          entity_type: entity.type,
          entity_value: entity.value,
          confidence: entity.confidence,
          context: entity.context,
          created_at: new Date().toISOString()
        }));
        
        const { error: entityError } = await supabase
          .from('document_entities')
          .insert(entityRows);
        
        if (entityError) console.error('Failed to store entities:', entityError);
      }
      
      return docData.id;
    } catch (error: any) {
      console.error('Failed to store document:', error);
      throw new Error(`Document storage failed: ${error.message}`);
    }
  }
  
  // Search documents using embeddings
  async searchSimilarDocuments(
    query: string,
    limit: number = 10,
    projectId?: string
  ): Promise<any[]> {
    try {
      // Generate query embedding
      const queryEmbeddings = await this.generateEmbeddings(query);
      if (!queryEmbeddings.length) {
        throw new Error('Failed to generate query embeddings');
      }
      
      // Use Supabase pgvector for similarity search
      // Note: This requires pgvector extension and proper setup
      const { data, error } = await supabase.rpc('search_documents', {
        query_embedding: queryEmbeddings[0],
        match_count: limit,
        project_id: projectId
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Document search failed:', error);
      
      // Fallback to text search
      const { data } = await supabase
        .from('documents')
        .select('*')
        .textSearch('content', query)
        .limit(limit);
      
      return data || [];
    }
  }
}

// Export singleton instance
export const documentProcessor = new DocumentProcessor();

// Convenience functions
export async function processDocument(
  file: File,
  options?: DocumentProcessingOptions
): Promise<ProcessedDocument> {
  return documentProcessor.processDocument(file, options);
}

export async function searchDocuments(
  query: string,
  limit?: number,
  projectId?: string
): Promise<any[]> {
  return documentProcessor.searchSimilarDocuments(query, limit, projectId);
}