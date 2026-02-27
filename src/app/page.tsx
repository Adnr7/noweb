'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });

const Hero = dynamic(() => import('@/components/sections/Hero'), { ssr: false });
const About = dynamic(() => import('@/components/sections/About'), { ssr: false });
const Identity = dynamic(() => import('@/components/sections/Identity'), { ssr: false });
const SkillsHub = dynamic(() => import('@/components/sections/SkillsHub'), { ssr: false });
const Projects = dynamic(() => import('@/components/sections/Projects'), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: false });

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const handlePreloaderComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <>
      {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}
      <SmoothScroll>
        <main>
          <Hero />
          <About />
          <Identity />
          <SkillsHub />
          <Projects />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
