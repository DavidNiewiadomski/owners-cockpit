import { UnifiedAIService } from './unified-ai-service';

export interface VoiceServiceConfig {
  defaultVoice?: string;
  defaultLanguage?: string;
  enableTranscription?: boolean;
  enableRealTime?: boolean;
}

export interface VoiceRequest {
  text?: string;
  audio?: ArrayBuffer | Blob;
  voice?: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language?: string;
  segments?: TranscriptionSegment[];
}

export interface TranscriptionSegment {
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export class VoiceService {
  private aiService: UnifiedAIService;
  private config: VoiceServiceConfig;
  private audioContext: AudioContext;
  private mediaRecorder?: MediaRecorder;
  private isRecording: boolean = false;

  constructor(aiService: UnifiedAIService, config: VoiceServiceConfig = {}) {
    this.aiService = aiService;
    this.config = {
      defaultVoice: 'EXAVITQu4vr4xnSDxMaL',
      defaultLanguage: 'en-US',
      enableTranscription: true,
      enableRealTime: false,
      ...config
    };
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // Text-to-Speech
  async synthesizeSpeech(request: VoiceRequest): Promise<AudioBuffer> {
    if (!request.text) {
      throw new Error('Text is required for speech synthesis');
    }

    try {
      // Get audio data from AI service
      const audioData = await this.aiService.synthesizeVoice(
        request.text,
        request.voice || this.config.defaultVoice
      );

      // Convert to AudioBuffer
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      
      // Apply speed and pitch modifications if requested
      if (request.speed !== 1 || request.pitch !== 1) {
        return this.modifyAudioBuffer(audioBuffer, request.speed || 1, request.pitch || 1);
      }

      return audioBuffer;
    } catch (error) {
      console.error('Speech synthesis error:', error);
      throw new Error(`Failed to synthesize speech: ${error.message}`);
    }
  }

  // Speech-to-Text
  async transcribeAudio(request: VoiceRequest): Promise<TranscriptionResult> {
    if (!request.audio) {
      throw new Error('Audio is required for transcription');
    }

    try {
      // Convert audio to base64 for API
      const audioBase64 = await this.audioToBase64(request.audio);

      // Use OpenAI Whisper or Google Speech-to-Text via unified AI service
      const response = await this.aiService.processRequest({
        type: 'transcription',
        data: {
          audio: audioBase64,
          language: request.language || this.config.defaultLanguage
        }
      });

      if (!response.success) {
        throw new Error(response.error || 'Transcription failed');
      }

      return response.data;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
  }

  // Real-time transcription
  async startRealTimeTranscription(
    onTranscript: (transcript: string) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (!this.config.enableRealTime) {
      throw new Error('Real-time transcription is not enabled');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        try {
          const result = await this.transcribeAudio({ audio: audioBlob });
          onTranscript(result.text);
        } catch (error) {
          onError?.(error);
        }
      };

      // Start recording in chunks for real-time processing
      this.isRecording = true;
      this.startChunkedRecording();

    } catch (error) {
      console.error('Failed to start real-time transcription:', error);
      throw error;
    }
  }

  private startChunkedRecording() {
    if (!this.mediaRecorder || !this.isRecording) return;

    this.mediaRecorder.start();
    
    // Stop and restart every 5 seconds for chunked processing
    setTimeout(() => {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        setTimeout(() => {
          if (this.isRecording) {
            this.startChunkedRecording();
          }
        }, 100);
      }
    }, 5000);
  }

  stopRealTimeTranscription() {
    this.isRecording = false;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  // Voice commands processing
  async processVoiceCommand(audioData: ArrayBuffer | Blob): Promise<{
    command: string;
    intent: string;
    entities: any[];
    confidence: number;
  }> {
    // First transcribe the audio
    const transcription = await this.transcribeAudio({ audio: audioData });

    // Then process the text for intent and entities
    const nlpResponse = await this.aiService.processRequest({
      type: 'completion',
      prompt: `Analyze this voice command and extract the intent and entities:
        "${transcription.text}"
        
        Respond in JSON format with:
        - intent: the primary action requested
        - entities: array of relevant entities (dates, names, locations, etc.)
        - confidence: confidence score 0-1`,
      options: {
        temperature: 0.1,
        model: 'gpt-4'
      }
    });

    try {
      const parsed = JSON.parse(nlpResponse.data);
      return {
        command: transcription.text,
        intent: parsed.intent,
        entities: parsed.entities,
        confidence: parsed.confidence * transcription.confidence
      };
    } catch (error) {
      return {
        command: transcription.text,
        intent: 'unknown',
        entities: [],
        confidence: 0
      };
    }
  }

  // Accessibility features
  async enableVoiceNavigation(
    onCommand: (command: any) => void
  ): Promise<void> {
    await this.startRealTimeTranscription(
      async (transcript) => {
        const command = await this.processVoiceCommand(new Blob([transcript]));
        if (command.confidence > 0.7) {
          onCommand(command);
        }
      },
      (error) => {
        console.error('Voice navigation error:', error);
      }
    );
  }

  // Voice notes
  async createVoiceNote(
    audioData: ArrayBuffer | Blob,
    metadata?: any
  ): Promise<{
    id: string;
    text: string;
    audio: string; // base64
    metadata: any;
    createdAt: Date;
  }> {
    const transcription = await this.transcribeAudio({ audio: audioData });
    const audioBase64 = await this.audioToBase64(audioData);

    const voiceNote = {
      id: this.generateId(),
      text: transcription.text,
      audio: audioBase64,
      metadata: {
        ...metadata,
        duration: await this.getAudioDuration(audioData),
        language: transcription.language,
        confidence: transcription.confidence
      },
      createdAt: new Date()
    };

    // Store in database if needed
    await this.storeVoiceNote(voiceNote);

    return voiceNote;
  }

  // Utility methods
  private async audioToBase64(audio: ArrayBuffer | Blob): Promise<string> {
    const blob = audio instanceof ArrayBuffer ? new Blob([audio]) : audio;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private modifyAudioBuffer(
    buffer: AudioBuffer,
    speed: number,
    pitch: number
  ): AudioBuffer {
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = speed;

    // Apply pitch shift if needed
    if (pitch !== 1) {
      const pitchShift = offlineContext.createScriptProcessor(4096, 1, 1);
      // Pitch shift implementation would go here
      source.connect(pitchShift);
      pitchShift.connect(offlineContext.destination);
    } else {
      source.connect(offlineContext.destination);
    }

    source.start();
    return offlineContext.startRendering();
  }

  private async getAudioDuration(audio: ArrayBuffer | Blob): Promise<number> {
    const arrayBuffer = audio instanceof Blob 
      ? await audio.arrayBuffer() 
      : audio;
    
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  }

  private generateId(): string {
    return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async storeVoiceNote(voiceNote: any): Promise<void> {
    // Implementation would store in Supabase
    console.log('Storing voice note:', voiceNote.id);
  }

  // Voice analytics
  async analyzeVoiceSentiment(audioData: ArrayBuffer | Blob): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions?: string[];
  }> {
    const transcription = await this.transcribeAudio({ audio: audioData });
    
    const sentimentResponse = await this.aiService.processRequest({
      type: 'completion',
      prompt: `Analyze the sentiment and emotion in this text: "${transcription.text}"
        Respond in JSON format with sentiment (positive/negative/neutral), confidence (0-1), and emotions array.`,
      options: {
        temperature: 0.1,
        model: 'gpt-4'
      }
    });

    try {
      return JSON.parse(sentimentResponse.data);
    } catch {
      return { sentiment: 'neutral', confidence: 0.5 };
    }
  }

  // Multi-speaker detection
  async detectSpeakers(audioData: ArrayBuffer | Blob): Promise<{
    speakers: number;
    segments: Array<{
      speaker: string;
      startTime: number;
      endTime: number;
      text: string;
    }>;
  }> {
    // This would use a service that supports speaker diarization
    // For now, return a simplified version
    const transcription = await this.transcribeAudio({ audio: audioData });
    
    return {
      speakers: 1,
      segments: [{
        speaker: 'Speaker 1',
        startTime: 0,
        endTime: await this.getAudioDuration(audioData),
        text: transcription.text
      }]
    };
  }
}