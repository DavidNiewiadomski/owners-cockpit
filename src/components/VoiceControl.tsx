
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceControlProps {
  onSendMessage?: (message: string) => void;
  onVoiceResponse?: (text: string) => void;
  disabled?: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  onSendMessage,
  onVoiceResponse,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

      recognitionInstance.onresult = (event: any) => {
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

      recognitionInstance.onerror = (event: any) => {
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
            setHasPermission(false);
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

  // Check microphone permissions
  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setHasPermission(false);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const handleMicrophoneClick = useCallback(async () => {
    if (disabled) return;
    
    if (isListening) {
      // Stop listening
      if (recognition) {
        recognition.stop();
      }
      setIsListening(false);
      return;
    }

    // Check permissions first
    if (hasPermission === null) {
      const permitted = await checkMicrophonePermission();
      if (!permitted) return;
    }

    if (!recognition) {
      toast({
        title: "Voice Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

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
  }, [disabled, isListening, recognition, hasPermission, checkMicrophonePermission, toast]);

  const toggleVoiceResponse = useCallback(() => {
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled]);

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" disabled>
              <MicOff className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice features not supported in this browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2 relative">
      {/* Microphone Control */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isListening ? "destructive" : "ghost"}
              size="sm"
              onClick={handleMicrophoneClick}
              disabled={disabled}
              className={`relative ${isListening ? 'animate-pulse' : ''}`}
            >
              {isListening ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
              {isListening && (
                <div className="absolute -inset-1 rounded-full bg-red-500/20 animate-ping" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isListening ? 'Stop listening' : 'Start voice input'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Voice Output Control */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceResponse}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Status Indicators */}
      <div className="flex items-center gap-1">
        {isListening && (
          <Badge variant="destructive" className="text-xs">
            Listening
          </Badge>
        )}
        {isProcessing && (
          <Badge variant="secondary" className="text-xs">
            Processing
          </Badge>
        )}
      </div>

      {/* Transcript Display */}
      <AnimatePresence>
        {(transcript || isListening) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-12 right-0 z-50"
          >
            <Card className="w-80 shadow-lg">
              <CardContent className="p-4">
                <div className="mb-2">
                  <p className="text-sm font-medium">
                    {isListening ? 'Listening...' : 'Processing...'}
                  </p>
                </div>
                {transcript && (
                  <p className="text-sm text-muted-foreground">{transcript}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceControl;
