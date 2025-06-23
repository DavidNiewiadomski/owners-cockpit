
import React, { useCallback } from 'react';
import HeroContent from '@/components/hero/HeroContent';
import FeaturesSection from '@/components/hero/FeaturesSection';

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
