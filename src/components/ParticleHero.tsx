
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
    <section id="features" className="py-32 px-6 linear-section-bg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-medium linear-gradient-text mb-8 tracking-tight">
            Intelligent Construction Management
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
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
              className="linear-feature-card rounded-xl p-8 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/[0.06] mb-6 group-hover:bg-white/[0.08] transition-all duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-medium mb-4 text-white tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-neutral-400 mb-6 leading-relaxed font-light">
                {feature.description}
              </p>
              
              <button
                onClick={() => {
                  const demoSection = document.getElementById('demo');
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-white/80 hover:text-white font-medium transition-colors duration-200 group-hover:underline"
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden linear-hero-bg">
        {/* Linear.app inspired background */}
        <div className="absolute inset-0">
          {/* Base dark background */}
          <div className="absolute inset-0 bg-[#0d0d0d]"></div>
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-transparent to-neutral-800/30"></div>
          
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCIvPgo8L3N2Zz4K')]"></div>
        </div>
        
        <HeroContent onLearnMore={handleLearnMore} />
      </section>
      
      <FeaturesSection />
    </>
  );
};

export default ParticleHero;
