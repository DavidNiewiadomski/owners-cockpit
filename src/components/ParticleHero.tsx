
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Building2, Brain, Mic } from 'lucide-react';
import { useRouter } from '@/hooks/useRouter';

// Hero content component
const HeroContent: React.FC<{ onLearnMore: () => void }> = ({ onLearnMore }) => {
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    console.log('Get Started clicked - navigating to /app');
    router.push('/app');
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
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 text-center px-6 max-w-4xl mx-auto"
    >
      <div className="glass rounded-3xl p-12 backdrop-blur-lg border border-white/10">
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-7xl md:text-8xl font-bold gradient-text mb-6"
        >
          Owners Cockpit
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
        >
          Your AI-powered construction management platform.
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
            className="neumorphic-button px-8 py-4 text-lg group min-h-[44px] hover:scale-105 hover:ring-2 hover:ring-indigo-400/60 transition-all duration-200"
          >
            Get Started
            <motion.div
              className="ml-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              →
            </motion.div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onLearnMore}
            className="glass border-primary/20 px-8 py-4 text-lg min-h-[44px] hover:scale-105 hover:ring-2 hover:ring-indigo-400/60 transition-all duration-200"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Features section component
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Building2,
      title: "Lifecycle Coverage",
      description: "From site selection to facilities management, track every phase of your building's journey with intelligent insights.",
      action: "See in Action"
    },
    {
      icon: Brain,
      title: "Role-Aware AI",
      description: "AI that adapts to your role - whether you're an executive, project manager, or facilities operator.",
      action: "See in Action"
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Control your dashboard, query data, and generate reports using natural voice commands.",
      action: "See in Action"
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Intelligent Construction Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of building management with AI-driven insights, 
            seamless workflows, and voice-powered controls.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 backdrop-blur-lg border border-white/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <button
                onClick={() => {
                  const demoSection = document.getElementById('demo');
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 group-hover:underline"
              >
                {feature.action} →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main ParticleHero component
const ParticleHero: React.FC = () => {
  const handleLearnMore = useCallback(() => {
    console.log('Learn More clicked - scrolling to features');
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Linear.app inspired gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        </div>
        
        <HeroContent onLearnMore={handleLearnMore} />
      </section>
      
      <FeaturesSection />
    </>
  );
};

export default ParticleHero;
