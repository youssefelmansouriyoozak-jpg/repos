'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const collections = [
  {
    title: 'Chaussures',
    href: '/chaussures',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    size: 'lg'
  },
  {
    title: 'Mode',
    href: '/mode',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    size: 'sm'
  },
  {
    title: 'Accessoires',
    href: '/accessoires',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    size: 'sm'
  }
];

export default function CollectionGrid() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[700px]">
        {collections.map((col, i) => (
          <Link 
            key={col.title}
            href={col.href}
            className={cn(
              "group relative overflow-hidden",
              col.size === 'lg' ? "md:row-span-2 h-[400px] md:h-full" : "h-[300px] md:h-[calc(50%-16px)]"
            )}
          >
            <Image
              src={col.image}
              alt={col.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-4xl font-serif font-bold mb-4 tracking-tight">
                  {col.title}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 inline-block pb-1">
                  Explorer
                </span>
              </motion.div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
