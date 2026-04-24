'use client';

import React, { useState, FormEvent } from 'react';
import { ArrowLeft, Loader2, CheckCircle, Package, MapPin, Phone, Mail, User } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CODFormProps {
  amount: number;
  currency: string;
  productTitle: string;
  variantTitle: string;
  variantId: string;
  onBack: () => void;
  onSuccess: () => void;
  isOnProductPage?: boolean;
}

export function CODForm({
  amount,
  currency,
  productTitle,
  variantTitle,
  variantId,
  onBack,
  onSuccess,
  isOnProductPage = false,
}: CODFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productTitle,
          variantTitle,
          variantId,
          amount,
          currency,
          paymentMethod: 'COD',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la validation de la commande');
      }

      onSuccess();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 border-b border-zinc-100 pb-4">
          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">1</span>
          Informations personnelles
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">
              <User size={14} /> Nom complet *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Prénom et Nom"
              className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">
                  <Mail size={14} /> Email (Optionnel)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm"
                />
              </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">
                <Phone size={14} /> Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+212 6XX XXX XXX"
                className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 border-b border-zinc-100 pb-4">
          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">2</span>
          Adresse de livraison
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">
              <MapPin size={14} /> Ville *
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Ex: Casablanca"
              className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">
              Adresse complète *
            </label>
            <textarea
              name="address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Quartier, Rue, N°, Appt..."
              className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm resize-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2 font-medium">
          Note additionnelle (optionnel)
        </label>
        <textarea
          name="notes"
          rows={2}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Instructions particulières pour la livraison..."
          className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm resize-none"
        />
      </div>

      <div className="bg-zinc-50 p-4 rounded-sm flex items-start gap-3">
        <div className="mt-0.5 text-black">
          <Package size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black">Paiement à la livraison (Cash on Delivery)</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Vous paierez votre commande en espèces lors de la réception de votre colis.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="border-t border-zinc-100 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600">
            {productTitle} - {variantTitle}
          </span>
          <span className="font-bold text-lg">
            {formatPrice(amount / 100, currency)}
          </span>
        </div>
        
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-black text-white py-5 text-sm uppercase tracking-[0.3em] font-bold hover:bg-gold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Traitement en cours...
            </>
          ) : (
            `Confirmer ma commande`
            )}
          </button>
  
          {!isOnProductPage && (
            <button
              type="button"
              onClick={onBack}
              disabled={isProcessing}
              className="w-full text-zinc-500 hover:text-black py-3 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              Retour au produit
            </button>
          )}
        </div>

    </form>
  );
}

export function OrderSuccessMessage({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center animate-bounce">
        <CheckCircle className="text-green-600" size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-bold text-black">
          Commande enregistrée !
        </h2>
        <p className="text-zinc-600 max-w-sm">
          Merci pour votre confiance. Notre service client vous contactera par téléphone prochainement pour confirmer votre livraison.
        </p>
      </div>
      <button
        onClick={onContinue}
        className="bg-black text-white px-10 py-4 text-sm uppercase tracking-[0.2em] font-bold hover:bg-gold transition-all duration-500 shadow-xl"
      >
        Continuer mes achats
      </button>
    </div>
  );
}
