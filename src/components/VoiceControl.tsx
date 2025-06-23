
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { useVoiceInterface } from '@/hooks/useVoiceInterface';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
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
  const [showTranscript, setShowTranscript] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const { toast } = useToast();

  const {
    isListening,
    isProcessing,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported,
  } = useVoiceInterface({
    language: 'en-US',
    continuous: false,
    interimResults: true,
  });

  const {
    processVoiceCommand,
    executeVoiceCommand,
    getAvailableCommands,
  } = useVoiceCommands();

  // Handle transcript changes
  useEffect(() => {
    if (transcript && !isListening && transcript.trim().length > 0) {
      handleVoiceInput(transcript);
    }
  }, [transcript, isListening]);

  const handleVoiceInput = useCallback(async (text: string) => {
    try {
      const availableCommands = getAvailableCommands();
      const command = processVoiceCommand(text, availableCommands);
      
      if (command) {
        // For now, execute commands directly without confirmation
        // In the future, we could add confirmation logic based on command type
        await executeVoiceCommand(command, onSendMessage, toast);
        setPendingCommand(null);
      } else {
        // Fallback to general query
        if (onSendMessage) {
          onSendMessage(text);
        }
      }
    } catch (error) {
      console.error('Voice input processing error:', error);
      speak("Sorry, I had trouble processing that command. Please try again.");
    }
  }, [processVoiceCommand, executeVoiceCommand, onSendMessage, speak, toast, getAvailableCommands]);

  const handleMicrophoneClick = useCallback(() => {
    if (disabled) return;
    
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) {
        stopSpeaking();
      }
      startListening();
      setShowTranscript(true);
    }
  }, [disabled, isListening, isSpeaking, startListening, stopListening, stopSpeaking]);

  const handleConfirmCommand = useCallback(async () => {
    if (pendingCommand) {
      await executeVoiceCommand(pendingCommand, onSendMessage, toast);
      setPendingCommand(null);
      setShowTranscript(false);
      speak("Command executed successfully.");
    }
  }, [pendingCommand, executeVoiceCommand, onSendMessage, speak, toast]);

  const handleCancelCommand = useCallback(() => {
    setPendingCommand(null);
    setShowTranscript(false);
    speak("Command cancelled.");
  }, [speak]);

  const toggleVoiceResponse = useCallback(() => {
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled]);

  // Handle voice responses from the AI
  useEffect(() => {
    if (onVoiceResponse && voiceEnabled) {
      // This would be called when the AI responds to speak the response
    }
  }, [onVoiceResponse, voiceEnabled]);

  if (!isSupported()) {
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
    <div className="flex items-center gap-2">
      {/* Microphone Control */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isListening ? "destructive" : "ghost"}
              size="sm"
              onClick={handleMicrophoneClick}
              disabled={disabled || isProcessing}
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
              className={isSpeaking ? 'animate-pulse' : ''}
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
        {isSpeaking && (
          <Badge variant="default" className="text-xs">
            Speaking
          </Badge>
        )}
        {isProcessing && (
          <Badge variant="secondary" className="text-xs">
            Processing
          </Badge>
        )}
      </div>

      {/* Transcript and Command Confirmation */}
      <AnimatePresence>
        {showTranscript && (transcript || pendingCommand) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-12 right-0 z-50"
          >
            <Card className="w-80 shadow-lg">
              <CardContent className="p-4">
                {transcript && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Transcript:</p>
                    <p className="text-sm text-muted-foreground">{transcript}</p>
                  </div>
                )}
                
                {pendingCommand && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Confirm Command:</p>
                    <p className="text-sm text-muted-foreground">
                      Action: {pendingCommand.action.replace('_', ' ')}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleConfirmCommand}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelCommand}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {!pendingCommand && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowTranscript(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-12 right-0 z-50"
          >
            <Card className="w-80 shadow-lg border-destructive">
              <CardContent className="p-4">
                <p className="text-sm text-destructive">{error}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowTranscript(false)}
                  className="w-full mt-2"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceControl;
