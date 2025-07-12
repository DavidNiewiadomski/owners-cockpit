import { UnifiedAIService } from './unified-ai-service';
import { createClient } from '@supabase/supabase-js';

export interface DocumentProcessingOptions {
  extractText?: boolean;
  extractTables?: boolean;
  extractImages?: boolean;
  ocrLanguage?: string;
  enhanceQuality?: boolean;
  splitPages?: boolean;
}

export interface ProcessedDocument {
  id: string;
  pages: ProcessedPage[];
  metadata: DocumentMetadata;
  fullText: string;
  tables: ExtractedTable[];
  images: ExtractedImage[];
}

export interface ProcessedPage {
  pageNumber: number;
  text: string;
  boundingBoxes: BoundingBox[];
  confidence: number;
}

export interface BoundingBox {
  text: string;
  vertices: Array<{ x: number; y: number }>;
  confidence: number;
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
  fileSize: number;
  mimeType: string;
}

export interface ExtractedTable {
  pageNumber: number;
  rows: string[][];
  headers?: string[];
  confidence: number;
}

export interface ExtractedImage {
  pageNumber: number;
  imageData: string; // base64
  description?: string;
  labels?: string[];
  boundingBox?: BoundingBox;
}

export class DocumentProcessor {
  private aiService: UnifiedAIService;
  private supabase: any;

  constructor(aiService: UnifiedAIService) {
    this.aiService = aiService;
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );
  }

  async processDocument(
    file: File | Blob,
    projectId: string,
    options: DocumentProcessingOptions = {}
  ): Promise<ProcessedDocument> {
    const {
      extractText = true,
      extractTables = true,
      extractImages = true,
      ocrLanguage = 'en',
      enhanceQuality = true,
      splitPages = false
    } = options;

    try {
      // Step 1: Convert document to PDF if needed
      const pdfFile = await this.ensurePDF(file);

      // Step 2: Extract raw content using Adobe PDF Services
      const extractedContent = await this.extractPDFContent(pdfFile, {
        extractText,
        extractTables,
        extractImages
      });

      // Step 3: Process each page with Google Vision for OCR
      const processedPages = await this.processPages(
        extractedContent.pages,
        ocrLanguage,
        enhanceQuality
      );

      // Step 4: Extract and analyze images
      const extractedImages = extractImages 
        ? await this.extractAndAnalyzeImages(extractedContent.images)
        : [];

      // Step 5: Build full text and create embeddings
      const fullText = processedPages.map(p => p.text).join('\n\n');
      const chunks = this.createTextChunks(fullText, 1000, 200);
      
      // Step 6: Create embeddings for each chunk
      const embeddings = await Promise.all(
        chunks.map(chunk => this.aiService.createEmbedding(chunk.text))
      );

      // Step 7: Store in database
      const documentId = await this.storeDocument(
        projectId,
        file.name,
        extractedContent.metadata,
        processedPages,
        extractedContent.tables,
        extractedImages,
        chunks,
        embeddings
      );

      return {
        id: documentId,
        pages: processedPages,
        metadata: extractedContent.metadata,
        fullText,
        tables: extractedContent.tables,
        images: extractedImages
      };
    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }

  private async ensurePDF(file: File | Blob): Promise<Blob> {
    const mimeType = file.type || 'application/octet-stream';
    
    // If already PDF, return as is
    if (mimeType === 'application/pdf') {
      return file;
    }

    // Convert to PDF using Adobe PDF Services
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.aiService.processRequest({
      type: 'document',
      data: {
        operation: 'createPDF',
        jwt: await this.generateAdobeJWT(),
        params: {
          input: formData,
          output: { type: 'pdf' }
        }
      }
    });

    if (!response.success) {
      throw new Error('Failed to convert document to PDF');
    }

    return response.data;
  }

  private async extractPDFContent(pdfFile: Blob, options: any) {
    const response = await this.aiService.processRequest({
      type: 'document',
      data: {
        operation: 'extractPDF',
        jwt: await this.generateAdobeJWT(),
        params: {
          input: pdfFile,
          options: {
            elementsToExtract: options
          }
        }
      }
    });

    if (!response.success) {
      throw new Error('Failed to extract PDF content');
    }

    return response.data;
  }

  private async processPages(
    pages: any[],
    language: string,
    enhance: boolean
  ): Promise<ProcessedPage[]> {
    const processedPages = await Promise.all(
      pages.map(async (page, index) => {
        // Convert page to image for Vision API
        const pageImage = await this.convertPageToImage(page);
        
        // Process with Google Vision
        const visionResponse = await this.aiService.processRequest({
          type: 'vision',
          data: {
            image: {
              content: pageImage // base64 encoded
            },
            features: [
              { type: 'DOCUMENT_TEXT_DETECTION' },
              { type: 'TEXT_DETECTION' }
            ],
            imageContext: {
              languageHints: [language]
            }
          }
        });

        if (!visionResponse.success) {
          throw new Error(`Failed to process page ${index + 1}`);
        }

        const visionData = visionResponse.data;
        const fullTextAnnotation = visionData.fullTextAnnotation;

        return {
          pageNumber: index + 1,
          text: fullTextAnnotation?.text || '',
          boundingBoxes: this.extractBoundingBoxes(fullTextAnnotation),
          confidence: fullTextAnnotation?.pages?.[0]?.confidence || 0
        };
      })
    );

    return processedPages;
  }

  private async extractAndAnalyzeImages(images: any[]): Promise<ExtractedImage[]> {
    const analyzedImages = await Promise.all(
      images.map(async (image) => {
        const visionResponse = await this.aiService.processRequest({
          type: 'vision',
          data: {
            image: {
              content: image.data
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'IMAGE_PROPERTIES' },
              { type: 'SAFE_SEARCH_DETECTION' }
            ]
          }
        });

        if (!visionResponse.success) {
          console.error('Failed to analyze image');
          return null;
        }

        const labels = visionResponse.data.labelAnnotations?.map(l => l.description) || [];
        
        // Generate description using AI
        const description = await this.generateImageDescription(labels, image.context);

        return {
          pageNumber: image.pageNumber,
          imageData: image.data,
          description,
          labels,
          boundingBox: image.boundingBox
        };
      })
    );

    return analyzedImages.filter(img => img !== null);
  }

  private createTextChunks(
    text: string,
    chunkSize: number,
    overlap: number
  ): Array<{ text: string; start: number; end: number }> {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);
      
      chunks.push({
        text: chunk,
        start,
        end
      });

      start = end - overlap;
    }

    return chunks;
  }

  private async storeDocument(
    projectId: string,
    fileName: string,
    metadata: DocumentMetadata,
    pages: ProcessedPage[],
    tables: ExtractedTable[],
    images: ExtractedImage[],
    chunks: any[],
    embeddings: number[][]
  ): Promise<string> {
    const { data: document, error: docError } = await this.supabase
      .from('documents')
      .insert({
        project_id: projectId,
        filename: fileName,
        metadata,
        full_text: pages.map(p => p.text).join('\n\n'),
        page_count: metadata.pageCount,
        processed_at: new Date()
      })
      .select()
      .single();

    if (docError) {
      throw new Error(`Failed to store document: ${docError.message}`);
    }

    // Store chunks with embeddings
    const chunkInserts = chunks.map((chunk, index) => ({
      doc_id: document.id,
      project_id: projectId,
      content: chunk.text,
      embedding: embeddings[index],
      metadata: {
        start: chunk.start,
        end: chunk.end,
        page_numbers: this.getPageNumbersForChunk(chunk, pages)
      }
    }));

    const { error: chunkError } = await this.supabase
      .from('vector_index')
      .insert(chunkInserts);

    if (chunkError) {
      console.error('Failed to store chunks:', chunkError);
    }

    // Store extracted tables
    if (tables.length > 0) {
      const tableInserts = tables.map(table => ({
        document_id: document.id,
        page_number: table.pageNumber,
        data: table.rows,
        headers: table.headers,
        confidence: table.confidence
      }));

      await this.supabase.from('document_tables').insert(tableInserts);
    }

    // Store extracted images
    if (images.length > 0) {
      const imageInserts = images.map(image => ({
        document_id: document.id,
        page_number: image.pageNumber,
        description: image.description,
        labels: image.labels,
        data_url: image.imageData
      }));

      await this.supabase.from('document_images').insert(imageInserts);
    }

    return document.id;
  }

  private extractBoundingBoxes(annotation: any): BoundingBox[] {
    if (!annotation?.pages?.[0]?.blocks) {
      return [];
    }

    const boxes: BoundingBox[] = [];

    annotation.pages[0].blocks.forEach(block => {
      block.paragraphs?.forEach(paragraph => {
        paragraph.words?.forEach(word => {
          const text = word.symbols?.map(s => s.text).join('') || '';
          boxes.push({
            text,
            vertices: word.boundingBox?.vertices || [],
            confidence: word.confidence || 0
          });
        });
      });
    });

    return boxes;
  }

  private async convertPageToImage(page: any): Promise<string> {
    // Implementation would convert PDF page to image
    // This is a placeholder - actual implementation would use a library like pdf.js
    return page.imageData || '';
  }

  private getPageNumbersForChunk(chunk: any, pages: ProcessedPage[]): number[] {
    const pageNumbers = [];
    let currentPos = 0;

    for (const page of pages) {
      const pageEndPos = currentPos + page.text.length;
      
      if (chunk.start < pageEndPos && chunk.end > currentPos) {
        pageNumbers.push(page.pageNumber);
      }
      
      currentPos = pageEndPos + 2; // Account for \n\n between pages
    }

    return pageNumbers;
  }

  private async generateImageDescription(labels: string[], context: string): Promise<string> {
    const prompt = `Given these image labels: ${labels.join(', ')} and the context: "${context}", 
    provide a brief, construction-relevant description of what this image likely shows.`;

    try {
      return await this.aiService.generateText(prompt, {
        temperature: 0.3,
        maxTokens: 150
      });
    } catch (error) {
      console.error('Failed to generate image description:', error);
      return labels.join(', ');
    }
  }

  private async generateAdobeJWT(): Promise<string> {
    // This would generate a JWT for Adobe PDF Services
    // Implementation details depend on Adobe's requirements
    return 'jwt-token-placeholder';
  }

  // Batch processing method
  async batchProcessDocuments(
    files: File[],
    projectId: string,
    options: DocumentProcessingOptions = {}
  ): Promise<ProcessedDocument[]> {
    const results = [];
    const batchSize = 5; // Process 5 documents at a time

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(file => this.processDocument(file, projectId, options))
      );
      results.push(...batchResults);
    }

    return results;
  }
}