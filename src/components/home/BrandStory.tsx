'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section className="py-24 px-6 md:px-12 overflow-hidden bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="w-full lg:w-1/2 relative aspect-[4/5]">
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            viewport={{ once: true }}
            className="w-full h-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
              alt="Brand Story"
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square bg-gold/10 -z-10" />
        </div>

        <div className="w-full lg:w-1/2 space-y-10">
          <header className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-gold">
              Notre Héritage
            </h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-black dark:text-white">
              Une Histoire de <br /> Passion et d'Art.
            </h3>
          </header>
          
          <div className="space-y-6 text-zinc-500 text-lg font-body leading-relaxed">
            <p>
              Fondée sur les principes de l'élégance intemporelle et du savoir-faire artisanal, 
              YOOZAK incarne la vision d'une mode qui traverse les époques sans jamais se faner.
            </p>
            <p className="text-sm">
              Chaque pièce de notre collection est choisie pour son caractère unique, sa qualité 
              irréprochable et sa capacité à raconter une histoire — votre histoire.
            </p>
          </div>

          <div className="pt-6">
            <button className="luxury-button">
              En savoir plus sur YOOZAK
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
