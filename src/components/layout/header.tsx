'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/ToastContext';

const NAV_ITEMS = [
  { name: 'Projects', action: 'scroll', target: 'projects-section' },
  { name: 'Articles', action: 'toast', message: 'Articles coming soon' },
  { name: 'Contact', action: 'toast', message: 'Contact portal coming soon' },
] as const;

type NavItem = typeof NAV_ITEMS[number];

export default function Header() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    e.preventDefault();
    if (item.action === 'scroll' && 'target' in item) {
      const element = document.getElementById(item.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (item.action === 'toast' && 'message' in item) {
      showToast(item.message);
    }
  };

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav 
          onMouseLeave={() => setHoveredIndex(null)}
          className="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-neutral-900/50 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/5"
          >
            <span className="text-xs font-bold text-white tracking-tighter">JF</span>
          </button>

          <div className="w-px h-4 bg-white/10 mx-2" />

          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.name}>
                <button
                  type="button"
                  className="relative px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white block focus:outline-none"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  <span className="relative z-10">{item.name}</span>

                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <m.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white/10 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="w-2" />
        </nav>
      </header>
    </>
  );
}
