'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface CatalogViewProps {
  products: any[];
  title: string;
  subtitle?: string;
  bannerImage?: string;
  categories: string[];
}

export default function CatalogView({
  products,
  title,
  subtitle,
  bannerImage,
  categories
}: CatalogViewProps) {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2500]);
  const [sortBy, setSortBy] = useState('newest');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = activeCategory === 'Toutes' || product.tags.includes(activeCategory.toLowerCase());
      const price = Number(product.variants.edges[0].node.price.amount);
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];
      return categoryMatch && priceMatch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.variants.edges[0].node.price.amount) - Number(b.variants.edges[0].node.price.amount);
      if (sortBy === 'price-high') return Number(b.variants.edges[0].node.price.amount) - Number(a.variants.edges[0].node.price.amount);
      return 0; // default (newest handled by Shopify usually)
    });
  }, [products, activeCategory, priceRange, sortBy]);

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* Header Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        {bannerImage && (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={bannerImage}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base uppercase tracking-[0.3em] font-sans font-light opacity-80"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-20 px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <FilterSidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Product Grid */}
          <section className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold"
              >
                <SlidersHorizontal size={16} /> Filtres
              </button>
              
              <p className="hidden md:block text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Affichage de {filteredProducts.length} produits
              </p>

              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
                <span className="text-zinc-400">Trier par:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="newest">Nouveautés</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                </select>
              </div>
            </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">

              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-40 text-center">
                <p className="text-zinc-400 font-serif italic text-xl">Aucun produit trouvé pour ces critères.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
