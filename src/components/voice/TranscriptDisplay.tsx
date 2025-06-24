
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptDisplayProps {
  transcript: string;
  isListening: boolean;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, isListening }) => {
  return (
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
  );
};

export default TranscriptDisplay;
