
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Type declarations for speech APIs
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  
  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
}

interface VoiceInterfaceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface VoiceInterfaceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
}

export const useVoiceInterface = (config: VoiceInterfaceConfig = {}) => {
  const [state, setState] = useState<VoiceInterfaceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    transcript: '',
    error: null,
  });

  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      const recognition = recognitionRef.current;
      recognition.continuous = config.continuous || false;
      recognition.interimResults = config.interimResults || true;
      recognition.lang = config.language || 'en-US';

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null }));
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setState(prev => ({ ...prev, transcript }));
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognition.onerror = (event) => {
        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech was detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access was denied. Please enable microphone permissions.';
            break;
          case 'network':
            errorMessage = 'Network error occurred during speech recognition.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        setState(prev => ({ 
          ...prev, 
          isListening: false, 
          error: errorMessage 
        }));
        
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive",
        });
      };
    } else {
      setState(prev => ({ 
        ...prev, 
        error: 'Speech recognition is not supported in this browser' 
      }));
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [config, toast]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      setState(prev => ({ ...prev, transcript: '', error: null }));
      recognitionRef.current.start();
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const speak = useCallback((text: string, options: SpeechSynthesisUtterance = new SpeechSynthesisUtterance()) => {
    if (!synthRef.current) {
      toast({
        title: "Text-to-Speech Error",
        description: "Speech synthesis is not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.voice = options.voice || null;

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (event) => {
      setState(prev => ({ ...prev, isSpeaking: false }));
      toast({
        title: "Text-to-Speech Error",
        description: `Speech synthesis error: ${event.error}`,
        variant: "destructive",
      });
    };

    synthRef.current.speak(utterance);
  }, [toast]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const getAvailableVoices = useCallback(() => {
    if (synthRef.current) {
      return synthRef.current.getVoices();
    }
    return [];
  }, []);

  const isSupported = useCallback(() => {
    return !!(recognitionRef.current && synthRef.current);
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getAvailableVoices,
    isSupported,
  };
};
