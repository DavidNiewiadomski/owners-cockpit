import { ElevenLabsApi } from '@elevenlabs/elevenlabs-js';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface VoiceConfig {
  voice_id: string;
  model_id: string;
  voice_settings: VoiceSettings;
  output_format: string;
}

class ElevenLabsVoiceService {
  private api: ElevenLabsApi | null = null;
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isInitialized = false;

  // Premium voice configurations optimized for construction assistant
  private readonly voiceConfigs: Record<string, VoiceConfig> = {
    sarah: {
      voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel - Professional female voice
      model_id: 'eleven_turbo_v2', // Fastest model for low latency
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.85,
        style: 0.2,
        use_speaker_boost: true
      },
      output_format: 'mp3_44100_128'
    },
    assistant: {
      voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - Clear male voice
      model_id: 'eleven_turbo_v2',
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.8,
        style: 0.15,
        use_speaker_boost: true
      },
      output_format: 'mp3_44100_128'
    }
  };

  private readonly defaultVoice = 'sarah';

  async initialize(apiKey: string): Promise<boolean> {
    try {
      if (!apiKey) {
        console.warn('ElevenLabs API key not provided - using fallback TTS');
        return false;
      }

      this.api = new ElevenLabsApi({ apiKey });
      
      // Initialize Web Audio API for better performance
      if (typeof window !== 'undefined' && !this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      this.isInitialized = true;
      console.log('✅ ElevenLabs Voice Service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize ElevenLabs:', error);
      return false;
    }
  }

  async synthesizeSpeech(
    text: string, 
    voiceName: string = this.defaultVoice,
    options: { stream?: boolean; optimize?: boolean } = {}
  ): Promise<{ audioUrl?: string; audioBuffer?: ArrayBuffer; success: boolean; error?: string }> {
    
    if (!this.api || !this.isInitialized) {
      return { success: false, error: 'ElevenLabs service not initialized' };
    }

    try {
      const config = this.voiceConfigs[voiceName] || this.voiceConfigs[this.defaultVoice];
      
      // Optimize text for speech synthesis
      const optimizedText = options.optimize ? this.optimizeTextForSpeech(text) : text;

      if (options.stream) {
        // Use streaming for longer text (lower latency)
        return await this.streamSynthesis(optimizedText, config);
      } else {
        // Use standard synthesis for shorter text (better quality)
        return await this.standardSynthesis(optimizedText, config);
      }
    } catch (error) {
      console.error('❌ Speech synthesis failed:', error);
      return { success: false, error: error.message || 'Speech synthesis failed' };
    }
  }

  private async standardSynthesis(text: string, config: VoiceConfig) {
    try {
      const audioStream = await this.api!.generate({
        voice: config.voice_id,
        model_id: config.model_id,
        voice_settings: config.voice_settings,
        text: text,
        output_format: config.output_format
      });

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      const reader = audioStream.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const audioBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        audioBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      // Create audio URL
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      return { audioUrl, audioBuffer: audioBuffer.buffer, success: true };
    } catch (error) {
      throw new Error(`Standard synthesis failed: ${error.message}`);
    }
  }

  private async streamSynthesis(text: string, config: VoiceConfig) {
    try {
      const audioStream = await this.api!.generate({
        voice: config.voice_id,
        model_id: config.model_id,
        voice_settings: config.voice_settings,
        text: text,
        output_format: config.output_format
      });

      // Process stream in chunks for immediate playback
      const chunks: Uint8Array[] = [];
      const reader = audioStream.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const audioBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        audioBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      return { audioUrl, audioBuffer: audioBuffer.buffer, success: true };
    } catch (error) {
      throw new Error(`Stream synthesis failed: ${error.message}`);
    }
  }

  async playAudio(audioUrl: string): Promise<boolean> {
    try {
      // Stop any currently playing audio
      this.stopAudio();

      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.crossOrigin = 'anonymous';
      
      // Optimize for low latency
      this.currentAudio.preload = 'auto';
      
      return new Promise((resolve, reject) => {
        if (!this.currentAudio) {
          reject(new Error('Audio element not created'));
          return;
        }

        this.currentAudio.onloadeddata = () => {
          this.currentAudio!.play()
            .then(() => resolve(true))
            .catch(reject);
        };

        this.currentAudio.onerror = () => {
          reject(new Error('Audio playback failed'));
        };

        this.currentAudio.onended = () => {
          this.cleanup();
        };
      });
    } catch (error) {
      console.error('❌ Audio playback failed:', error);
      return false;
    }
  }

  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.cleanup();
    }
  }

  private cleanup(): void {
    if (this.currentAudio) {
      if (this.currentAudio.src) {
        URL.revokeObjectURL(this.currentAudio.src);
      }
      this.currentAudio = null;
    }
  }

  private optimizeTextForSpeech(text: string): string {
    return text
      // Add natural pauses
      .replace(/\./g, '. ')
      .replace(/,/g, ', ')
      .replace(/:/g, ': ')
      .replace(/;/g, '; ')
      // Handle numbers and percentages
      .replace(/(\d+)%/g, '$1 percent')
      .replace(/\$(\d+)/g, '$1 dollars')
      // Handle abbreviations
      .replace(/\bRFI\b/g, 'R F I')
      .replace(/\bBIM\b/g, 'B I M')
      .replace(/\bHVAC\b/g, 'H V A C')
      .replace(/\bLEED\b/g, 'L E E D')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  async getAvailableVoices(): Promise<string[]> {
    if (!this.api || !this.isInitialized) {
      return ['sarah', 'assistant']; // Fallback
    }

    try {
      const voices = await this.api.voices.getAll();
      return voices.voices?.map(voice => voice.voice_id) || ['sarah', 'assistant'];
    } catch (error) {
      console.error('❌ Failed to fetch voices:', error);
      return ['sarah', 'assistant'];
    }
  }

  isReady(): boolean {
    return this.isInitialized && !!this.api;
  }

  isPlaying(): boolean {
    return !!(this.currentAudio && !this.currentAudio.paused);
  }

  // Estimate speech duration for latency optimization
  estimateSpeechDuration(text: string): number {
    const words = text.split(' ').length;
    const wordsPerMinute = 160; // Average speaking rate
    return (words / wordsPerMinute) * 60 * 1000; // Convert to milliseconds
  }

  dispose(): void {
    this.stopAudio();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.api = null;
    this.isInitialized = false;
  }
}

// Singleton instance
export const elevenLabsVoiceService = new ElevenLabsVoiceService();
export default elevenLabsVoiceService;
