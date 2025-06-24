
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TextToSpeechOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const loadVoices = useCallback(() => {
    if ('speechSynthesis' in window) {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      return availableVoices;
    }
    return [];
  }, []);

  const speak = useCallback((text: string, options: TextToSpeechOptions = {}) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Text-to-Speech Not Available",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive"
      });
      return;
    }

    // Cancel any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice options
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Try to use a more natural voice
    const availableVoices = loadVoices();
    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      // Prefer female voices for better conversational feel
      const preferredVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('allison') ||
        voice.name.toLowerCase().includes('karen')
      ) || availableVoices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      utteranceRef.current = null;
      console.error('Speech synthesis error:', event);
    };

    speechSynthesis.speak(utterance);
  }, [toast, loadVoices]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.resume();
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    voices,
    loadVoices,
    isSupported: 'speechSynthesis' in window
  };
};
