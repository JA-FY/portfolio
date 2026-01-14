'use client';

import { useRef, useLayoutEffect } from 'react';
import { useScroll, useTransform, m } from 'framer-motion';
import dynamic from 'next/dynamic';

import { Intro } from '@/components/features/intro/Intro';
import { useIntro } from '@/components/features/intro/use-intro';
import { HomeContent } from '@/components/features/home/HomeContent';

const GuatemalanParticles = dynamic(
  () => import('@/components/3d/GuatemalanParticles'), 
  { ssr: false }
);

export default function Home() {
  const { currentLangIndex, status, setStatus } = useIntro();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      
      window.scrollTo(0, 0);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const contentOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const contentPointerEvents = useTransform(scrollYProgress, (val) => val > 0.85 ? 'auto' : 'none');
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const contentVisibility = useTransform(scrollYProgress, (val) => val > 0.85 ? 'visible' : 'hidden');

  return (
    <main ref={containerRef} className="relative h-[400vh] bg-transparent selection:bg-cyan-500/30">
      <GuatemalanParticles scrollProgress={scrollYProgress} />

      <m.div style={{ opacity: introOpacity }} className=" will-change-opacity bg-transparent fixed inset-0 z-40 pointer-events-none">
        <Intro 
          status={status} 
          setStatus={setStatus} 
          currentLangIndex={currentLangIndex} 
        />
        <div className="absolute bottom-10 left-0 right-0 text-center text-white/30 text-xs tracking-[0.3em] uppercase animate-pulse">
          Scroll to Dive
        </div>
      </m.div>

      <HomeContent 
        opacity={contentOpacity} 
        pointerEvents={contentPointerEvents} 
	visibility={contentVisibility}
      />
    </main>
  );
}
