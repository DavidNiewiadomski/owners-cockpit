
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

    // Try to find the highest quality voice
    const availableVoices = loadVoices();
    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      // Priority order for highest-quality voice names
      const preferredVoiceNames = [
        'Google UK English Female',
        'Google US English',
        'Microsoft Zira - English (United States)',
        'Microsoft David - English (United States)',
        'Amazon Polly Joanna',
        'Amazon Polly Matthew',
        'Amazon Polly Neural',
      ];

      // Find voices by preferred names first
      let selectedVoice = availableVoices.find(voice => 
        preferredVoiceNames.some(preferred => voice.name.includes(preferred))
      );

      // If no preferred voice found, look for neural/premium voices
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(voice => 
          voice.name.toLowerCase().includes('neural') || 
          voice.name.toLowerCase().includes('premium')
        );
      }

      // If still no voice found, look for expressive voices
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(voice => 
          ['Google UK English Female', 'Samantha', 'Alex'].some(name => 
            voice.name.includes(name)
          )
        );
      }

      // If still no voice found, use any English voice
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(voice => voice.lang.startsWith('en'));
      }

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
    const preferredVoiceNames = [
      'Google UK English Female',
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Alex',
      'Samantha'
    ];

    const foundVoice = availableVoices.find(voice => 
      preferredVoiceNames.some(preferred => voice.name.includes(preferred))
    ) || availableVoices.find(voice => voice.lang.startsWith('en'));

    return foundVoice?.name || 'Default';
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
