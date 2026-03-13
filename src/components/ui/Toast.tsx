'use client';

import { m, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ isVisible, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-neutral-900/80 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 rounded-full w-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.1)_360deg)] -z-10 blur-sm pointer-events-none" />
          
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <span className="text-sm font-medium text-white/90 tracking-wide font-mono">
            {message}
          </span>
        </m.div>
      )}
    </AnimatePresence>
  );
}
