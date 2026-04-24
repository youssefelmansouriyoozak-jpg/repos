'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="py-32 px-6 md:px-12 bg-black text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/20" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/20" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-12">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-serif font-bold tracking-tight"
        >
          Prêt à élever <br /> votre garde-robe ?
        </motion.h2>

        <p className="text-zinc-400 text-lg font-body max-w-xl mx-auto leading-relaxed">
          Rejoignez l'univers YOOZAK et découvrez une nouvelle dimension du style.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <Link href="/new-arrivals" className="luxury-button w-full sm:w-auto bg-white text-black hover:bg-gold hover:text-white border-white">
            Nouveautés
          </Link>
          <Link href="/bonnes-affaires" className="px-12 py-[11px] border border-white/20 text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto">
            Soldes
          </Link>
        </div>
      </div>
    </section>
  );
}
