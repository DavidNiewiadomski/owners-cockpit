
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface WelcomeMessageProps {
  roleConfig: {
    displayName: string;
    description: string;
  };
  currentRole: string;
  voiceResponseEnabled: boolean;
  ttsSupported: boolean;
  getBestVoice: () => string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  roleConfig,
  currentRole,
  voiceResponseEnabled,
  ttsSupported,
  getBestVoice
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">
        {roleConfig.displayName} Assistant Ready
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        I'm your AI assistant specialized for {roleConfig.description.toLowerCase()}. 
        Ask me anything related to your {currentRole.toLowerCase()} responsibilities.
        {voiceResponseEnabled && ttsSupported && (
          <span className="block mt-2 text-primary">
            🎤 Speak your questions and I'll respond with natural voice using {getBestVoice()}!
          </span>
        )}
      </p>
    </motion.div>
  );
};

export default WelcomeMessage;
