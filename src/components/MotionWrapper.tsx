
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'none';
  delay?: number;
  className?: string;
}

const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  },
  none: {
    initial: {},
    animate: {},
    transition: {}
  }
};

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  className,
  ...props
}) => {
  const animationConfig = animations[animation];

  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      transition={{
        ...animationConfig.transition,
        delay
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
