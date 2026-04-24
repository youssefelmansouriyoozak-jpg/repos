'use client';

import React from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeaturedProductsProps {
  products: any[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-24 px-6 md:px-12 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-gold">
              Sélection Exclusive
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-black dark:text-white">
              Produits Phares
            </h3>
          </div>
          <p className="text-zinc-500 max-w-sm text-sm font-body">
            Une collection méticuleusement sélectionnée pour ceux qui ne font aucun compromis sur l'excellence.
          </p>
        </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-12 md:gap-y-16">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link 
            href="/new-arrivals"
            className="inline-block px-12 py-4 border border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500"
          >
            Voir tous les produits
          </Link>
        </div>
      </div>
    </section>
  );
}
