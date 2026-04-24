'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice, cn } from '@/lib/utils';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.variants.edges[0].node.price;
  const compareAtPrice = product.variants.edges[0].node.compareAtPrice;
  const mainImage = product.images.edges[0]?.node;
  const hoverImage = product.images.edges[1]?.node || mainImage;
  
  const isOnSale = compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);
  const isNew = product.tags.includes('new-arrival');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/product/${product.handle}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {isNew && (
              <span className="bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1 font-sans font-bold">
                Nouveau
              </span>
            )}
            {isOnSale && (
              <span className="bg-gold text-white text-[10px] uppercase tracking-widest px-2 py-1 font-sans font-bold">
                PROMO
              </span>
            )}
          </div>

          <Image
            src={mainImage?.url || '/placeholder.png'}
            alt={mainImage?.altText || product.title}
            fill
            className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
          />
          <Image
            src={hoverImage?.url || '/placeholder.png'}
            alt={hoverImage?.altText || product.title}
            fill
            className="object-cover object-center absolute inset-0 opacity-0 transition-all duration-1000 group-hover:opacity-100"
          />

          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-end justify-center p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="w-full bg-white text-black py-3 text-xs uppercase tracking-widest text-center font-bold hover:bg-black hover:text-white transition-colors duration-300 shadow-xl">
              Voir les détails
            </div>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <h3 className="text-sm font-sans font-medium uppercase tracking-tight group-hover:text-gold transition-colors truncate px-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-center gap-3 font-sans text-sm">
            <span className={cn(isOnSale ? "text-gold font-bold" : "text-black")}>
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {isOnSale && (
              <span className="text-zinc-400 line-through">
                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
