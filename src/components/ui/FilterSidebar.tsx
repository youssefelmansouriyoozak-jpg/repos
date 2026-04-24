'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

interface FilterSidebarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  isOpen,
  onClose
}: FilterSidebarProps) {
  return (
    <aside className={cn(
      "w-full lg:w-64 space-y-12",
      isOpen ? "block" : "hidden lg:block"
    )}>
      {onClose && (
        <button onClick={onClose} className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-widest mb-8">
          <X size={16} /> Fermer les filtres
        </button>
      )}

      {/* Categories */}
      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">
          Catégories
        </h4>
        <div className="flex flex-col gap-4">
          {['Toutes', ...categories].map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "text-left text-sm font-sans transition-colors duration-200",
                activeCategory === category 
                  ? "text-gold font-bold" 
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">
          Prix
        </h4>
        <div className="space-y-6">
            <input
              type="range"
              min="0"
                max="2500"
                step="50"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-gold bg-zinc-100 dark:bg-zinc-800 h-1 appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
        </div>
      </section>

      {/* Other filters (Colors, Sizes) - Placeholders for now */}
      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">
          Couleurs
        </h4>
        <div className="flex flex-wrap gap-3">
          {['bg-black', 'bg-white', 'bg-[#D4AF37]', 'bg-zinc-400'].map((color) => (
            <button
              key={color}
              className={cn(
                "w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform",
                color
              )}
            />
          ))}
        </div>
      </section>

      <button className="w-full py-3 border border-black dark:border-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
        Réinitialiser
      </button>
    </aside>
  );
}
