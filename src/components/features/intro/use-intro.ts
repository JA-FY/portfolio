import { useState, useEffect } from 'react';

export function useIntro() {
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const [status, setStatus] = useState<'active' | 'exiting' | 'complete'>('active');

  useEffect(() => {
    if (status !== 'active') return;
    const interval = setInterval(() => setCurrentLangIndex((p) => p + 1), 550);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'complete') {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleInteraction = (e: Event) => {
        setStatus('exiting');
    };

    window.addEventListener('wheel', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      document.body.style.overflow = '';
    };
  }, [status]);

  return { currentLangIndex, status, setStatus };
}
