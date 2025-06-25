
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Extend existing Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: unknown;
    webkitSpeechRecognition: unknown;
  }
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
  const isCleaningUpRef = useRef(false);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const WindowWithSpeech = window as Window & {
        SpeechRecognition?: typeof SpeechRecognition;
        webkitSpeechRecognition?: typeof SpeechRecognition;
      };
      const SpeechRecognitionConstructor = WindowWithSpeech.SpeechRecognition || WindowWithSpeech.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      const recognition = recognitionRef.current;
      recognition.continuous = config.continuous || false;
      recognition.interimResults = config.interimResults || true;
      recognition.lang = config.language || 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started');
        if (!isCleaningUpRef.current) {
          setState(prev => ({ ...prev, isListening: true, error: null, isProcessing: false }));
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        console.log('Speech recognition result received');
        if (!isCleaningUpRef.current) {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setState(prev => ({ ...prev, transcript, isProcessing: false }));
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        if (!isCleaningUpRef.current) {
          setState(prev => ({ ...prev, isListening: false, isProcessing: false }));
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        // Don't show error if we're cleaning up (component unmounting)
        if (isCleaningUpRef.current || event.error === 'aborted') {
          return;
        }

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
          isProcessing: false,
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
      isCleaningUpRef.current = true;
      if (recognitionRef.current) {
        // Use stop() instead of abort() to prevent error events
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [config, toast]);

  const startListening = useCallback(() => {
    console.log('Attempting to start listening, current state:', state.isListening);
    if (recognitionRef.current && !state.isListening) {
      isCleaningUpRef.current = false;
      setState(prev => ({ ...prev, transcript: '', error: null, isProcessing: true }));
      try {
        recognitionRef.current.start();
        console.log('Speech recognition start() called');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setState(prev => ({ 
          ...prev, 
          isProcessing: false,
          error: 'Failed to start speech recognition. Please try again.' 
        }));
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    console.log('Attempting to stop listening, current state:', state.isListening);
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
      console.log('Speech recognition stop() called');
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
