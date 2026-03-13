'use client';

import { motion, MotionValue } from 'framer-motion';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ProjectCard } from '../projects/ProjectCard';
import { projects } from '../projects/data';

export function HomeContent() {
  return (
    <div className="relative z-50 w-full bg-transparent">
      <Header />
      
      <div className="min-h-screen flex flex-col items-center pt-24 md:pt-32 pb-10 md:pb-20">
         
         <div className="max-w-6xl w-full px-4 sm:px-6">
            
            <div className="mb-16 md:mb-32">
              <h2 className="text-center text-[19vw] sm:text-[15vw] md:text-[13rem] lg:text-[17rem] font-thin text-white tracking-tighter mb-4 md:mb-6 leading-none">
               The Output 
              </h2>
              <p className="text-center text-neutral-400 font-mono text-sm">
               A curated collection of my best work, the tools that enable it, and the lessons learned over the years. 
              </p>
            </div>

            <div id="projects-section" className="flex flex-col items-center mb-8 md:mb-16 scroll-m-32">
              <h3 className="text-center text-4xl sm:text-5xl md:text-6xl font-thin text-white tracking-tighter mb-4 md:mb-6">
               Projects 
              </h3>
               <p className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 text-center md:text-start text-neutral-400 font-mono text-xs sm:text-sm px-4 md:px-0 leading-relaxed md:leading-normal">
	       These cover a wide range of technologies. Some of them are internal tools while others are public-facing. I strongly believe in cooperation so, even though not all of them have a public GitHub repo, these come with an explanation of the tools I used and part of the decision making along the way.
              </p>

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
    </div>
  );
}
