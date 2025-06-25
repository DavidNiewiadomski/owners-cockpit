/**
 * Advanced Voice Service - Optimized for Apple Silicon
 * Premium voice recognition and synthesis for M4 Pro
 */

interface VoiceSettings {
  recognition: {
    language: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
  };
  synthesis: {
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
  };
}

interface VoiceEvent {
  type: 'start' | 'result' | 'end' | 'error';
  data?: any;
  confidence?: number;
  alternatives?: string[];
}

class AdvancedVoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private settings: VoiceSettings;
  private callbacks: Map<string, Function[]> = new Map();

  constructor() {
    this.settings = {
      recognition: {
        language: 'en-US',
        continuous: false,
        interimResults: true,
        maxAlternatives: 3
      },
      synthesis: {
        voice: 'enhanced',
        rate: 0.9,
        pitch: 0.95,
        volume: 0.9
      }
    };

    this.initializeVoiceServices();
  }

  private async initializeVoiceServices() {
    try {
      console.log('🎤 Initializing Advanced Voice Services for M4 Pro...');

      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = this.settings.recognition.continuous;
        this.recognition.interimResults = this.settings.recognition.interimResults;
        this.recognition.lang = this.settings.recognition.language;
        this.recognition.maxAlternatives = this.settings.recognition.maxAlternatives;

        this.setupRecognitionEvents();
        console.log('✅ Speech Recognition initialized');
      } else {
        console.warn('⚠️ Speech Recognition not supported');
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
        await this.loadVoices();
        console.log('✅ Speech Synthesis initialized');
      } else {
        console.warn('⚠️ Speech Synthesis not supported');
      }

    } catch (error) {
      console.error('❌ Voice service initialization failed:', error);
    }
  }

  private setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.emit('start', { type: 'recognition' });
      console.log('🎤 Voice recognition started');
    };

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const latest = results[results.length - 1];
      
      if (latest) {
        const transcript = latest[0].transcript;
        const confidence = latest[0].confidence;
        const alternatives = Array.from(latest).map(alt => alt.transcript);

        this.emit('result', {
          transcript,
          confidence,
          alternatives,
          isFinal: latest.isFinal
        });

        console.log(`🗣️ Voice result: "${transcript}" (confidence: ${confidence})`);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      this.emit('error', { error: event.error, message: event.message });
      console.error('❌ Voice recognition error:', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.emit('end', { type: 'recognition' });
      console.log('🔇 Voice recognition ended');
    };
  }

  private async loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoicesInternal = () => {
        this.voices = this.synthesis!.getVoices();
        if (this.voices.length > 0) {
          console.log(`📢 Loaded ${this.voices.length} voices`);
          this.logAvailableVoices();
          resolve();
        } else {
          // Voices might not be loaded yet, try again
          setTimeout(loadVoicesInternal, 100);
        }
      };

      if (this.synthesis!.onvoiceschanged !== undefined) {
        this.synthesis!.onvoiceschanged = loadVoicesInternal;
      }
      
      loadVoicesInternal();
    });
  }

  private logAvailableVoices() {
    console.log('🎵 Available voices:');
    const premiumVoices = this.voices.filter(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Premium') ||
      voice.name.includes('Enhanced') ||
      voice.name.includes('Neural')
    );

    console.log('🌟 Premium voices:', premiumVoices.map(v => v.name));
    
    const appleVoices = this.voices.filter(voice => 
      voice.name.includes('Alex') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Daniel') ||
      voice.name.includes('Fiona')
    );
    
    console.log('🍎 Apple voices:', appleVoices.map(v => v.name));
  }

  public async startListening(): Promise<boolean> {
    if (!this.recognition || this.isListening) {
      return false;
    }

    try {
      console.log('🎤 Starting voice recognition...');
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('❌ Failed to start voice recognition:', error);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public async speak(text: string, options?: Partial<VoiceSettings['synthesis']>): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not available');
    }

    // Stop any current speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Apply settings
    const voiceSettings = { ...this.settings.synthesis, ...options };
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    // Select best voice
    const selectedVoice = this.selectBestVoice(voiceSettings.voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎵 Using voice: ${selectedVoice.name}`);
    }

    // Enhance text for better speech
    utterance.text = this.enhanceTextForSpeech(text);

    // Set up events
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.emit('start', { type: 'synthesis' });
      console.log('🔊 Speech synthesis started');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.emit('end', { type: 'synthesis' });
      console.log('🔇 Speech synthesis ended');
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.emit('error', { error: event.error });
      console.error('❌ Speech synthesis error:', event.error);
    };

    // Start speaking
    this.synthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public pauseSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  public resumeSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  private selectBestVoice(preference: string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) return null;

    // Priority order for high-quality voices
    const voicePriorities = [
      // Enhanced/Neural voices (highest quality)
      'Google UK English Female',
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Microsoft David - English (United States)',
      'Amazon Polly Neural',
      'Enhanced',
      'Premium',
      'Neural',
      
      // Apple's high-quality voices
      'Alex',
      'Samantha',
      'Daniel',
      'Fiona',
      
      // Fallback voices
      'Google',
      'Microsoft'
    ];

    // Try to find voice by priority
    for (const priority of voicePriorities) {
      const voice = this.voices.find(v => 
        v.name.includes(priority) && v.lang.startsWith('en')
      );
      if (voice) return voice;
    }

    // Fallback to any English voice
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
  }

  private enhanceTextForSpeech(text: string): string {
    return text
      // Add natural pauses
      .replace(/\./g, '. ')
      .replace(/,/g, ', ')
      .replace(/:/g, ': ')
      .replace(/;/g, '; ')
      .replace(/\?/g, '? ')
      .replace(/!/g, '! ')
      
      // Handle abbreviations
      .replace(/\bLLM\b/g, 'Large Language Model')
      .replace(/\bAI\b/g, 'Artificial Intelligence')
      .replace(/\bAPI\b/g, 'Application Programming Interface')
      .replace(/\bHVAC\b/g, 'Heating, Ventilation, and Air Conditioning')
      .replace(/\bOSHA\b/g, 'Occupational Safety and Health Administration')
      .replace(/\bROI\b/g, 'Return on Investment')
      .replace(/\bQ\d+\b/g, (match) => `Quarter ${match.slice(1)}`)
      
      // Handle numbers and currencies
      .replace(/\$(\d+)/g, '$1 dollars')
      .replace(/(\d+)%/g, '$1 percent')
      
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  public on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Voice service callback error:', error);
        }
      });
    }
  }

  public getStatus() {
    return {
      recognition: {
        available: !!this.recognition,
        isListening: this.isListening,
        language: this.settings.recognition.language
      },
      synthesis: {
        available: !!this.synthesis,
        isSpeaking: this.isSpeaking,
        voicesLoaded: this.voices.length,
        currentVoice: this.currentUtterance?.voice?.name || null
      },
      capabilities: {
        continuousRecognition: true,
        interimResults: true,
        voiceSelection: true,
        enhancedProcessing: true,
        appleOptimized: true
      }
    };
  }

  public updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = {
      recognition: { ...this.settings.recognition, ...newSettings.recognition },
      synthesis: { ...this.settings.synthesis, ...newSettings.synthesis }
    };

    // Apply recognition settings if service is available
    if (this.recognition) {
      this.recognition.lang = this.settings.recognition.language;
      this.recognition.continuous = this.settings.recognition.continuous;
      this.recognition.interimResults = this.settings.recognition.interimResults;
      this.recognition.maxAlternatives = this.settings.recognition.maxAlternatives;
    }

    console.log('🔧 Voice settings updated:', this.settings);
  }

  public getBestVoices(limit = 5): SpeechSynthesisVoice[] {
    const premiumVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en') && (
        voice.name.includes('Google') ||
        voice.name.includes('Microsoft') ||
        voice.name.includes('Premium') ||
        voice.name.includes('Enhanced') ||
        voice.name.includes('Alex') ||
        voice.name.includes('Samantha')
      )
    );

    return premiumVoices.slice(0, limit);
  }
}

export const voiceService = new AdvancedVoiceService();
export type { VoiceSettings, VoiceEvent };
