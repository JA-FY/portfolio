'use client';
import { m, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from './data';
import { useIntro } from './use-intro';

export function Intro() {
  const { currentLangIndex, status, setStatus } = useIntro();

  if (status === 'complete') return null;

  return (
    <m.div
      animate={status === 'exiting' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }} 
      onAnimationComplete={() => {
        if (status === 'exiting') setStatus('complete');
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-white"
    >
      <div className="relative flex items-center justify-center w-full">
        <AnimatePresence mode='popLayout'>
          {status === 'active' && (
             <m.h1
             key={currentLangIndex}
             className="absolute text-[15vw] font-bold tracking-tighter text-center leading-none whitespace-nowrap opacity-20"
             initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
             animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
             exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
             transition={{ duration: 0.2 }}
           >
             {LANGUAGES[currentLangIndex % LANGUAGES.length]}
           </m.h1>
          )}
        </AnimatePresence>
      </div>
      
      <m.div 
        animate={{ opacity: status === 'active' ? 1 : 0 }}
        className="absolute bottom-12 text-xs uppercase tracking-[0.3em] text-neutral-500 animate-pulse"
      >
      </m.div>
    </m.div>
  );
}
