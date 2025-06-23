
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/hooks/useRouter';

interface HeroContentProps {
  onLearnMore: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({ onLearnMore }) => {
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    console.log('Get Started clicked - navigating to /dashboard');
    router.push('/dashboard');
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 text-center px-6 max-w-5xl mx-auto"
    >
      <div className="linear-card rounded-2xl p-16 backdrop-blur-xl border border-white/[0.08]">
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl font-medium linear-gradient-text mb-8 tracking-tight"
        >
          Owners Cockpit
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light"
        >
          Your AI-powered building management platform.
          <br />
          Streamline projects, manage risks, and drive success.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="linear-button-primary px-8 py-4 text-lg font-medium min-h-[52px] hover:scale-[1.02] transition-all duration-200"
          >
            Get Started
            <motion.div
              className="ml-2"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              →
            </motion.div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onLearnMore}
            className="linear-button-secondary px-8 py-4 text-lg font-medium min-h-[52px] hover:scale-[1.02] transition-all duration-200"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroContent;
