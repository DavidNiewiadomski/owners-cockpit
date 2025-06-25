interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

interface GenerationConfig {
  chunk_length_schedule: number[];
  enable_logging: boolean;
}

interface ElevenLabsResponse {
  audio: ArrayBuffer;
  contentType: string;
}

class ElevenLabsVoiceService {
  private apiKey: string;
  private baseUrl: string = 'https://api.elevenlabs.io/v1';
  private defaultVoiceId: string;
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  
  // Voice cache for faster repeated generations
  private voiceCache: Map<string, string> = new Map();
  
  // Streaming support for low latency
  private isStreamingEnabled: boolean = true;

  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    this.defaultVoiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Bella voice
    
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found. Voice features will be disabled.');
    }
    
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Handle browser autoplay policies
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  // Get available voices from ElevenLabs
  async getAvailableVoices(): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  // Optimized text-to-speech with streaming
  async synthesizeSpeech(
    text: string, 
    options: {
      voiceId?: string;
      voiceSettings?: Partial<VoiceSettings>;
      streaming?: boolean;
      priority?: 'low' | 'normal' | 'high';
    } = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const voiceId = options.voiceId || this.defaultVoiceId;
    const useStreaming = options.streaming !== false && this.isStreamingEnabled;
    
    // Check cache first for exact matches
    const cacheKey = `${voiceId}_${text}_${JSON.stringify(options.voiceSettings)}`;
    if (this.voiceCache.has(cacheKey)) {
      return this.voiceCache.get(cacheKey)!;
    }

    try {
      const voiceSettings: VoiceSettings = {
        stability: 0.75,
        similarity_boost: 0.85,
        style: 0.5,
        use_speaker_boost: true,
        ...options.voiceSettings
      };

      const requestBody = {
        text: text.trim(),
        voice_settings: voiceSettings,
        model_id: "eleven_multilingual_v2"
      };

      // Use streaming endpoint for better performance
      const endpoint = useStreaming 
        ? `${this.baseUrl}/text-to-speech/${voiceId}/stream`
        : `${this.baseUrl}/text-to-speech/${voiceId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the result for future use
      this.voiceCache.set(cacheKey, audioUrl);
      
      // Clean up cache if it gets too large
      if (this.voiceCache.size > 50) {
        const firstKey = this.voiceCache.keys().next().value;
        const oldUrl = this.voiceCache.get(firstKey);
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
        this.voiceCache.delete(firstKey);
      }

      return audioUrl;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  // Play audio with enhanced controls
  async playAudio(
    audioUrl: string, 
    options: {
      volume?: number;
      playbackRate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Stop any currently playing audio
        this.stopCurrentAudio();

        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.volume = options.volume !== undefined ? options.volume : 0.8;
        this.currentAudio.playbackRate = options.playbackRate || 1.0;

        this.currentAudio.onloadstart = () => {
          options.onStart?.();
        };

        this.currentAudio.onended = () => {
          options.onEnd?.();
          this.currentAudio = null;
          resolve();
        };

        this.currentAudio.onerror = (event) => {
          const error = new Error('Audio playback failed');
          options.onError?.(error);
          this.currentAudio = null;
          reject(error);
        };

        this.currentAudio.oncanplaythrough = () => {
          this.currentAudio?.play().catch(error => {
            console.error('Playback failed:', error);
            options.onError?.(error);
            reject(error);
          });
        };

        this.currentAudio.load();
      } catch (error) {
        console.error('Error setting up audio playback:', error);
        const audioError = error as Error;
        options.onError?.(audioError);
        reject(audioError);
      }
    });
  }

  // Enhanced speak method with conversation optimization
  async speak(
    text: string,
    options: {
      voiceId?: string;
      voiceSettings?: Partial<VoiceSettings>;
      priority?: 'low' | 'normal' | 'high';
      interrupt?: boolean;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<void> {
    try {
      // Interrupt current speech if requested
      if (options.interrupt) {
        this.stopCurrentAudio();
      }

      // Pre-process text for better speech synthesis
      const processedText = this.preprocessTextForSpeech(text);
      
      // Synthesize speech
      const audioUrl = await this.synthesizeSpeech(processedText, {
        voiceId: options.voiceId,
        voiceSettings: options.voiceSettings,
        streaming: true,
        priority: options.priority
      });

      // Play audio
      await this.playAudio(audioUrl, {
        onStart: options.onStart,
        onEnd: options.onEnd,
        onError: options.onError
      });

    } catch (error) {
      console.error('Error in speak method:', error);
      options.onError?.(error as Error);
      throw error;
    }
  }

  // Stop current audio playback
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  // Check if audio is currently playing
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  // Preprocess text for better speech synthesis
  private preprocessTextForSpeech(text: string): string {
    return text
      // Handle common abbreviations
      .replace(/\bDr\./g, 'Doctor')
      .replace(/\bMr\./g, 'Mister')
      .replace(/\bMrs\./g, 'Missus')
      .replace(/\bMs\./g, 'Miss')
      .replace(/\bSt\./g, 'Saint')
      .replace(/\bAve\./g, 'Avenue')
      .replace(/\bBlvd\./g, 'Boulevard')
      
      // Handle units and measurements
      .replace(/\bft\b/g, 'feet')
      .replace(/\bin\b/g, 'inches')
      .replace(/\bsq\.?\s?ft\b/g, 'square feet')
      .replace(/\bcu\.?\s?ft\b/g, 'cubic feet')
      .replace(/\blbs?\b/g, 'pounds')
      .replace(/\bkg\b/g, 'kilograms')
      
      // Handle construction terms
      .replace(/\bHVAC\b/g, 'H-V-A-C')
      .replace(/\bPSI\b/g, 'P-S-I')
      .replace(/\bCFM\b/g, 'C-F-M')
      .replace(/\bBTU\b/g, 'B-T-U')
      
      // Add pauses for better pacing
      .replace(/\.\s+/g, '. ')
      .replace(/!\s+/g, '! ')
      .replace(/\?\s+/g, '? ')
      .replace(/:\s+/g, ': ')
      .replace(/;\s+/g, '; ')
      
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Batch processing for multiple text chunks
  async speakBatch(
    textChunks: string[],
    options: {
      voiceId?: string;
      voiceSettings?: Partial<VoiceSettings>;
      pauseBetween?: number; // milliseconds
      onChunkStart?: (index: number, text: string) => void;
      onChunkEnd?: (index: number) => void;
      onComplete?: () => void;
      onError?: (error: Error, index: number) => void;
    } = {}
  ): Promise<void> {
    for (let i = 0; i < textChunks.length; i++) {
      try {
        options.onChunkStart?.(i, textChunks[i]);
        
        await this.speak(textChunks[i], {
          voiceId: options.voiceId,
          voiceSettings: options.voiceSettings,
          onError: (error) => options.onError?.(error, i)
        });
        
        options.onChunkEnd?.(i);
        
        // Pause between chunks if specified
        if (options.pauseBetween && i < textChunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, options.pauseBetween));
        }
        
      } catch (error) {
        options.onError?.(error as Error, i);
        break; // Stop processing on error
      }
    }
    
    options.onComplete?.();
  }

  // Clear voice cache
  clearCache(): void {
    for (const audioUrl of this.voiceCache.values()) {
      URL.revokeObjectURL(audioUrl);
    }
    this.voiceCache.clear();
  }

  // Get voice usage statistics
  getUsageStats(): {
    cacheSize: number;
    charactersProcessed: number;
    requestCount: number;
  } {
    return {
      cacheSize: this.voiceCache.size,
      charactersProcessed: 0, // Would track this in production
      requestCount: 0 // Would track this in production
    };
  }

  // Cleanup resources
  dispose(): void {
    this.stopCurrentAudio();
    this.clearCache();
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

export default ElevenLabsVoiceService;
export type { VoiceSettings, ElevenLabsResponse };
