import axios from 'axios';

export class VoiceSynthesizer {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.apiUrl = 'https://api.elevenlabs.io/v1';
    
    // Premium voice configurations
    this.voices = {
      sarah: {
        voice_id: 'EXAVITQu4vr4xnSDxMaL',
        name: 'Sarah - Professional',
        description: 'Clear, professional female voice'
      },
      rachel: {
        voice_id: '21m00Tcm4TlvDq8ikWAM',
        name: 'Rachel - Friendly',
        description: 'Warm, approachable female voice'
      },
      josh: {
        voice_id: 'TxGEqnHWrfWFTfGW9XjX',
        name: 'Josh - Authoritative',
        description: 'Deep, confident male voice'
      },
      assistant: {
        voice_id: 'flq6f7yk4E4fJM5XTYuZ',
        name: 'Assistant - Premium',
        description: 'Natural AI assistant voice'
      }
    };
    
    // Default settings
    this.defaultSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true
    };
  }

  async synthesize(text, voiceId = 'sarah', settings = {}) {
    if (!this.apiKey) {
      console.warn('⚠️ ElevenLabs API key not configured');
      return null;
    }

    try {
      const voice = this.voices[voiceId] || this.voices.sarah;
      const voiceSettings = { ...this.defaultSettings, ...settings };
      
      console.log(`🎤 Synthesizing voice with ${voice.name}...`);
      
      const response = await axios.post(
        `${this.apiUrl}/text-to-speech/${voice.voice_id}`,
        {
          text: this.optimizeTextForSpeech(text),
          model_id: 'eleven_monolingual_v1',
          voice_settings: voiceSettings
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer'
        }
      );

      // Convert to base64 for easy transport
      const base64Audio = Buffer.from(response.data).toString('base64');
      const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
      
      console.log('✅ Voice synthesis successful');
      return audioUrl;
      
    } catch (error) {
      console.error('❌ Voice synthesis failed:', error.message);
      if (error.response?.status === 401) {
        console.error('Invalid ElevenLabs API key');
      }
      return null;
    }
  }

  async synthesizeStream(text, voiceId = 'sarah', settings = {}) {
    if (!this.apiKey) {
      return null;
    }

    try {
      const voice = this.voices[voiceId] || this.voices.sarah;
      const voiceSettings = { ...this.defaultSettings, ...settings };
      
      const response = await axios.post(
        `${this.apiUrl}/text-to-speech/${voice.voice_id}/stream`,
        {
          text: this.optimizeTextForSpeech(text),
          model_id: 'eleven_monolingual_v1',
          voice_settings: voiceSettings,
          optimize_streaming_latency: 3
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'stream'
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Voice streaming failed:', error.message);
      return null;
    }
  }

  optimizeTextForSpeech(text) {
    // Convert common abbreviations
    let optimized = text
      .replace(/\bAI\b/g, 'A.I.')
      .replace(/\bAPI\b/g, 'A.P.I.')
      .replace(/\bLEED\b/g, 'L.E.E.D.')
      .replace(/\bHVAC\b/g, 'H.V.A.C.')
      .replace(/\bROI\b/g, 'R.O.I.')
      .replace(/\bKPI\b/g, 'K.P.I.')
      .replace(/\bRFI\b/g, 'R.F.I.')
      .replace(/\bRFP\b/g, 'R.F.P.');
    
    // Add pauses for better speech flow
    optimized = optimized
      .replace(/\. /g, '. <break time="0.5s"/> ')
      .replace(/! /g, '! <break time="0.5s"/> ')
      .replace(/\? /g, '? <break time="0.5s"/> ')
      .replace(/: /g, ': <break time="0.3s"/> ')
      .replace(/, /g, ', <break time="0.2s"/> ');
    
    // Handle currency
    optimized = optimized.replace(/\$(\d+(?:,\d{3})*(?:\.\d+)?)/g, (match, amount) => {
      return `${amount} dollars`;
    });
    
    // Handle percentages
    optimized = optimized.replace(/(\d+)%/g, '$1 percent');
    
    return optimized;
  }

  getAvailableVoices() {
    return Object.entries(this.voices).map(([id, voice]) => ({
      id,
      ...voice
    }));
  }

  async previewVoice(voiceId, sampleText = "Hello, I'm your AI construction assistant. How can I help you today?") {
    return await this.synthesize(sampleText, voiceId, {
      stability: 0.5,
      similarity_boost: 0.75
    });
  }
}