'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
import { cn, redirectExternal, getShopifyDomain } from '@/lib/utils';

const navLinks = [
  { name: 'Nouveautés', href: '/new-arrivals' },
  { name: 'Meilleures Ventes', href: '/best-sellers' },
  { name: 'Chaussures', href: '/chaussures' },
  { name: 'Mode', href: '/mode' },
  { name: 'Accessoires', href: '/accessoires' },
  { name: 'Exclusivités', href: '/bonnes-affaires' },
];

const socialLinks = [
  { name: 'Instagram', href: '#' },
  { name: 'TikTok', href: '#' },
  { name: 'Pinterest', href: '#' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuVariants: any = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.07,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-5 md:px-12',
        scrolled || isOpen
          ? 'h-16 bg-white dark:bg-black/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5' 
          : 'h-20 bg-transparent'
      )}
    >
      <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between">
        {/* Left - Menu Toggle (Mobile) */}
        <div className="flex-1 lg:hidden">
          <button 
            className="p-2 -ml-2 text-black dark:text-white group relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center transition-all duration-300">
              <span className={cn(
                "w-full h-[1.5px] bg-current transition-all duration-300 origin-center",
                isOpen ? "rotate-45 translate-y-2" : ""
              )} />
              <span className={cn(
                "w-full h-[1.5px] bg-current transition-all duration-300",
                isOpen ? "opacity-0 scale-x-0" : ""
              )} />
              <span className={cn(
                "w-full h-[1.5px] bg-current transition-all duration-300 origin-center",
                isOpen ? "-rotate-45 -translate-y-2" : ""
              )} />
            </div>
          </button>
        </div>

        {/* Desktop Nav - Left */}
        <nav className="hidden lg:flex flex-1 items-center space-x-6">
          {navLinks.slice(0, 4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-[11px] font-sans font-semibold uppercase tracking-[0.15em] transition-all hover:text-black/50 dark:hover:text-white/50 relative py-1',
                pathname === link.href ? 'text-black dark:text-white underline underline-offset-4' : 'text-black/70 dark:text-white/70'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Logo - Center */}
        <div className="flex-[2] flex justify-center">
          <Link href="/" className="z-50" onClick={() => setIsOpen(false)}>
            <span className="text-xl md:text-2xl font-serif font-black tracking-[-0.05em] uppercase text-black dark:text-white">
              YOOZAK
            </span>
          </Link>
        </div>

        {/* Desktop Nav - Right + Icons */}
        <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6 z-50">
          <nav className="hidden lg:flex items-center space-x-6 mr-6">
            {navLinks.slice(4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[11px] font-sans font-semibold uppercase tracking-[0.15em] transition-all hover:text-black/50 dark:hover:text-white/50 relative py-1',
                  pathname === link.href ? 'text-black dark:text-white underline underline-offset-4' : 'text-black/70 dark:text-white/70'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <button className="text-black dark:text-white transition-opacity hover:opacity-50">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button 
            className="text-black dark:text-white transition-opacity hover:opacity-50 relative"
            onClick={() => {
              const domain = getShopifyDomain();
              redirectExternal(`https://${domain}/cart`);
            }}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 top-16 bg-white dark:bg-black z-40 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full bg-white dark:bg-black px-8 pt-12 pb-20 justify-between">
              <div className="space-y-6">
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'text-4xl font-serif lowercase tracking-tight block py-1 transition-all group overflow-hidden',
                        pathname === link.href ? 'text-black dark:text-white underline' : 'text-black/40 dark:text-white/40'
                      )}
                    >
                      <span className="inline-block transition-transform duration-500 group-hover:translate-x-3">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                variants={itemVariants}
                className="space-y-10 pt-12 border-t border-black/5 dark:border-white/5"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 block mb-4">Suivez-nous</span>
                    <div className="flex flex-col space-y-3">
                      {socialLinks.map(s => (
                        <a key={s.name} href={s.href} className="text-sm font-sans text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">{s.name}</a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 block mb-4">Compte</span>
                    <div className="flex flex-col space-y-3">
                      <button className="text-sm font-sans text-black/70 dark:text-white/70 text-left hover:text-black dark:hover:text-white transition-colors">Connexion</button>
                      <button className="text-sm font-sans text-black/70 dark:text-white/70 text-left hover:text-black dark:hover:text-white transition-colors">Panier</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
