import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/">
            <span className="text-3xl font-serif font-bold tracking-tighter">YOOZAK</span>
          </Link>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Premium fashion selection for the modern individual. Quality, elegance, and style delivered to your doorstep.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gold transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-gold transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-gold transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-gold transition-colors"><Mail size={20} /></a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="text-lg font-sans font-semibold uppercase tracking-wider mb-6">Collections</h4>
          <ul className="space-y-4 text-zinc-400 text-sm">
            <li><Link href="/chaussures" className="hover:text-gold transition-colors">Chaussures</Link></li>
            <li><Link href="/mode" className="hover:text-gold transition-colors">Mode</Link></li>
            <li><Link href="/accessoires" className="hover:text-gold transition-colors">Accessoires</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-gold transition-colors">Nouveautés</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-sans font-semibold uppercase tracking-wider mb-6">Support</h4>
          <ul className="space-y-4 text-zinc-400 text-sm">
            <li><Link href="#" className="hover:text-gold transition-colors">Contactez-nous</Link></li>
            <li><Link href="#" className="hover:text-gold transition-colors">Livraison & Retours</Link></li>
            <li><Link href="#" className="hover:text-gold transition-colors">Guide des tailles</Link></li>
            <li><Link href="#" className="hover:text-gold transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-sans font-semibold uppercase tracking-wider mb-6">Newsletter</h4>
          <p className="text-zinc-400 text-sm mb-6">
            Inscrivez-vous pour recevoir les dernières nouvelles et offres exclusives.
          </p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Votre email" 
              className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <button className="mt-4 w-full bg-white text-black font-sans font-bold uppercase text-xs tracking-widest py-3 hover:bg-gold hover:text-white transition-all duration-300">
              S'abonner
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between text-zinc-500 text-xs">
        <p>© {currentYear} YOOZAK. Tous droits réservés.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          <a href="#" className="hover:text-white transition-colors">Conditions générales</a>
        </div>
      </div>
    </footer>
  );
}
