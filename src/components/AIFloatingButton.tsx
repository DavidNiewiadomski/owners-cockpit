
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIFloatingButtonProps {
  onClick: () => void;
}

const AIFloatingButton: React.FC<AIFloatingButtonProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔵 AIFloatingButton clicked - calling onClick handler');
    onClick();
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        onClick={handleClick}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    </motion.div>
  );
};

export default AIFloatingButton;
