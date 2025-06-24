
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

    // Set more natural voice options
    utterance.rate = options.rate || 0.85; // Slightly slower for more natural pace
    utterance.pitch = options.pitch || 0.95; // Slightly lower pitch
    utterance.volume = options.volume || 0.9;

    // Try to find the most natural voice
    const availableVoices = loadVoices();
    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      // Priority order for natural-sounding voices
      const preferredVoices = [
        // High-quality English voices (often neural/premium)
        'Google UK English Female',
        'Google US English',
        'Microsoft Zira - English (United States)',
        'Microsoft David - English (United States)',
        'Alex', // macOS
        'Samantha', // macOS
        'Karen', // macOS
        'Victoria', // macOS
        // Look for any voice with "neural" or "premium" in the name
        ...availableVoices.filter(v => 
          v.name.toLowerCase().includes('neural') || 
          v.name.toLowerCase().includes('premium')
        ),
        // Female voices tend to sound more natural
        ...availableVoices.filter(v => 
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('woman') ||
          ['Samantha', 'Alex', 'Victoria', 'Allison', 'Ava', 'Susan', 'Vicki'].some(name => 
            v.name.includes(name)
          )
        ),
        // General English voices
        ...availableVoices.filter(v => v.lang.startsWith('en'))
      ];

      // Find the first available preferred voice
      const selectedVoice = preferredVoices.find(voice => 
        availableVoices.some(av => av.name === voice.name || av === voice)
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
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

    // Add some natural pauses for better flow
    const processedText = text
      .replace(/\./g, '. ') // Pause after periods
      .replace(/,/g, ', ') // Pause after commas
      .replace(/:/g, ': ') // Pause after colons
      .replace(/;/g, '; '); // Pause after semicolons

    utterance.text = processedText;
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

  // Get the best available voice for display
  const getBestVoice = useCallback(() => {
    const availableVoices = loadVoices();
    const preferredVoices = [
      'Google UK English Female',
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Alex',
      'Samantha'
    ];

    return preferredVoices.find(name => 
      availableVoices.some(v => v.name.includes(name))
    ) || availableVoices.find(v => v.lang.startsWith('en'))?.name || 'Default';
  }, [loadVoices]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    voices,
    loadVoices,
    getBestVoice,
    isSupported: 'speechSynthesis' in window
  };
};
