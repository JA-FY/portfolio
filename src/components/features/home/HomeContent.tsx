'use client';

import { motion, MotionValue } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ProjectCard } from '../projects/ProjectCard';
import { projects } from '../projects/data';

interface HomeContentProps {
  opacity: MotionValue<number>;
  pointerEvents: MotionValue<"auto" | "none">;
  visibility: MotionValue<"visible" | "hidden">;
}

export function HomeContent({ opacity, pointerEvents, visibility }: HomeContentProps) {
  return (
    <motion.div 
      style={{ opacity, pointerEvents, visibility }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <Header show={true} />
      
      <div className="min-h-screen flex flex-col items-center pt-32 pb-20">
         
         <div className="max-w-5xl w-full px-6">
            
            <div className="mb-32">
              <h2 className="text-center text-5xl md:text-6xl font-thin text-white tracking-tighter mb-6">
               The Output 
              </h2>
              <p className="text-center text-neutral-400 font-mono text-sm">
               A curated collection of my best work, the tools that enable it, and the lessons learned over the years 
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-center text-5xl md:text-5xl font-thin text-white tracking-tighter mb-6">
               Projects 
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>

         </div>
         
         <div className="w-full h-24 mt-auto pt-20">
            <Footer />
         </div>
      </div>
    </motion.div>
  );
}
