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

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setStatus('exiting');
      }
    };

    let touchStartY: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (deltaY > 10) {
        setStatus('exiting');
      }

      touchStartY = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      document.body.style.overflow = '';
    };
  }, [status]);

  return { currentLangIndex, status, setStatus };
}

