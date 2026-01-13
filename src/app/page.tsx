'use client'; 
import { Intro } from '@/components/features/intro/Intro';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GuatemalanParticles from '@/components/3d/GuatemalanParticles';

export default function Home() {
  return (
    <main className="bg-neutral-950 text-neutral-200 selection:bg-cyan-500/30">
      <Intro />
      <section className='flex justify-center'>
      <Header />
      </section>

      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <GuatemalanParticles />
        </div>
        
        <div className="relative z-10 text-center pointer-events-none mix-blend-overlay">
           <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white/20">
             GUATEMALA
           </h1>
        </div>
      </section>

      <section className="flex justify-center items-center border-t border-neutral-800 py-4">
      <Footer />
      </section>
      
    </main>
  );
}
