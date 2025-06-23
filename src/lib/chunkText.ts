
/**
 * Token-aware text chunker for embedding generation
 * Estimates tokens using ~4 chars per token for English text
 */

export interface TextChunk {
  content: string;
  startIndex: number;
  endIndex: number;
  estimatedTokens: number;
}

/**
 * Estimates token count using character-based approximation
 * GPT tokenizer averages ~4 characters per token for English
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Chunks text into segments of approximately maxTokens size
 * Preserves sentence boundaries when possible
 */
export function chunkText(
  text: string, 
  maxTokens: number = 500,
  overlapTokens: number = 50
): TextChunk[] {
  if (!text.trim()) return [];
  
  const chunks: TextChunk[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  let chunkStartIndex = 0;
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim() + '.';
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
    const estimatedTokens = estimateTokenCount(potentialChunk);
    
    if (estimatedTokens > maxTokens && currentChunk) {
      // Save current chunk
      const chunk: TextChunk = {
        content: currentChunk.trim(),
        startIndex: chunkStartIndex,
        endIndex: chunkStartIndex + currentChunk.length,
        estimatedTokens: estimateTokenCount(currentChunk)
      };
      chunks.push(chunk);
      
      // Start new chunk with overlap
      const overlapText = getOverlapText(currentChunk, overlapTokens);
      currentChunk = overlapText + sentence;
      chunkStartIndex = chunk.endIndex - overlapText.length;
    } else {
      currentChunk = potentialChunk;
    }
  }
  
  // Add final chunk if exists
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      startIndex: chunkStartIndex,
      endIndex: chunkStartIndex + currentChunk.length,
      estimatedTokens: estimateTokenCount(currentChunk)
    });
  }
  
  return chunks;
}

/**
 * Gets overlap text from end of chunk for context continuity
 */
function getOverlapText(text: string, overlapTokens: number): string {
  const targetLength = overlapTokens * 4; // Approximate characters
  if (text.length <= targetLength) return text;
  
  // Find last sentence boundary within overlap range
  const overlapSection = text.slice(-targetLength);
  const lastSentence = overlapSection.lastIndexOf('.');
  
  if (lastSentence > 0) {
    return overlapSection.slice(lastSentence + 1).trim() + ' ';
  }
  
  return overlapSection + ' ';
}

/**
 * Splits very long text by paragraphs first, then by sentences
 * Useful for documents with large paragraphs
 */
export function chunkLongText(text: string, maxTokens: number = 500): TextChunk[] {
  const paragraphs = text.split(/\n\s*\n/);
  const allChunks: TextChunk[] = [];
  let globalOffset = 0;
  
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      globalOffset += paragraph.length;
      continue;
    }
    
    const paragraphChunks = chunkText(paragraph.trim(), maxTokens);
    
    // Adjust chunk indices to global text position
    paragraphChunks.forEach(chunk => {
      chunk.startIndex += globalOffset;
      chunk.endIndex += globalOffset;
      allChunks.push(chunk);
    });
    
    globalOffset += paragraph.length;
  }
  
  return allChunks;
}
