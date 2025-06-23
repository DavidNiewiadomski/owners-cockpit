
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Brain, Mic } from 'lucide-react';

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

export default FeaturesSection;
