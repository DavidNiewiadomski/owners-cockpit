
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseSpeechRecognitionProps {
  onSendMessage?: (message: string) => void;
}

export const useSpeechRecognition = ({ onSendMessage }: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const WindowWithSpeech = window as Window & {
        SpeechRecognition?: typeof SpeechRecognition;
        webkitSpeechRecognition?: typeof SpeechRecognition;
      };
      const SpeechRecognitionConstructor = WindowWithSpeech.SpeechRecognition || WindowWithSpeech.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started successfully');
        setIsListening(true);
        setIsProcessing(false);
      };

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        console.log('Speech recognition result received:', event);
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript);
          setIsListening(false);
          setIsProcessing(true);
          
          setTimeout(() => {
            if (onSendMessage && finalTranscript.trim()) {
              onSendMessage(finalTranscript.trim());
            }
            setTranscript('');
            setIsProcessing(false);
          }, 500);
        }
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        if (!transcript) {
          setIsProcessing(false);
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        
        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking clearly.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error during speech recognition.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        toast({
          title: "Voice Recognition Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      setRecognition(recognitionInstance);
    }
  }, [onSendMessage, toast, transcript]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setIsProcessing(true);
        setTranscript('');
        console.log('Starting speech recognition...');
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsProcessing(false);
        toast({
          title: "Voice Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [recognition, toast]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  }, [recognition]);

  return {
    isListening,
    isProcessing,
    transcript,
    recognition,
    startListening,
    stopListening
  };
};
