'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      gsap.from(logoRef.current, {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: 'power4.out',
        delay: 0.5
      });

      gsap.from(textRef.current?.children || [], {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: 'power3.out',
        delay: 1.5
      });

      // Parallax Effect
      gsap.to(logoRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 200,
        scale: 1.1,
        opacity: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Background with animated gradient and noise */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/gemini-2.5-flash-image_Une_image_du_produit_qui_le_valorise_sur_un_fond_creatif_en_bois_ou_textile_ave-0-1-1766338834559.jpg?width=2000&height=1125&resize=contain')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
        <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gold/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]" 
        />
      </div>

      <div className="z-10 text-center px-6">
        <h1 
          ref={logoRef}
          className="text-[15vw] md:text-[12vw] font-serif font-bold tracking-tighter leading-none mb-8 mix-blend-difference"
        >
          YOOZAK
        </h1>
        
        <div ref={textRef} className="space-y-6">
          <p className="text-sm md:text-base uppercase tracking-[0.5em] font-sans font-light text-zinc-400">
            L'Élégance Redéfinie par le Style
          </p>
          <div className="pt-8">
            <button className="luxury-button group">
              Découvrir la collection
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
          </div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 cursor-pointer hover:text-gold transition-colors"
        onClick={() => {
          const next = containerRef.current?.nextElementSibling;
          next?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
