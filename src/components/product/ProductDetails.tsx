'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Truck, RefreshCw, Ruler, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { CODForm, OrderSuccessMessage } from './CODForm';

interface ProductDetailsProps {
  product: any;
}

type ViewState = 'product' | 'checkout' | 'success';
type PaymentMethod = 'cod' | null;

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product?.variants.edges[0]?.node);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewState, setViewState] = useState<ViewState>('product');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);

  if (!product) return null;

  const images = product.images.edges.map((e: any) => e.node);
  const variants = product.variants.edges.map((e: any) => e.node);

  const priceAmount = parseFloat(selectedVariant?.price.amount || '0');
  const amountInCents = Math.round(priceAmount * 100);

  const handleBackToProduct = () => {
    setShowOrderForm(false);
    setSelectedPaymentMethod(null);
  };

  const handleOrderNow = () => {
    setShowOrderForm(true);
    setSelectedPaymentMethod('cod');
  };

  const handleBackToPaymentSelection = () => {
    setShowOrderForm(false);
    setSelectedPaymentMethod(null);
  };

  const handlePaymentSuccess = () => {
    setViewState('success');
    setShowOrderForm(false);
    setSelectedPaymentMethod(null);
  };

  const handleContinueShopping = () => {
    setViewState('product');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        <div className="w-full lg:w-3/5 space-y-4">
          <div className="relative aspect-[3/4] bg-white group overflow-hidden">
            <Image
              src={images[currentImageIndex]?.url || '/placeholder.png'}
              alt={product.title}
              fill
              priority
              className="object-contain object-center transition-transform duration-700 group-hover:scale-105 p-4 md:p-8"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white text-black transition-all shadow-lg rounded-full"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white text-black transition-all shadow-lg rounded-full"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="absolute top-8 left-8 flex flex-col gap-3">
              {product.tags.includes('new-arrival') && (
                <span className="bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 font-bold">
                  Nouveau
                </span>
              )}
              {product.tags.includes('best-seller') && (
                <span className="bg-gold text-white text-[10px] uppercase tracking-widest px-4 py-2 font-bold">
                  Best Seller
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {images.map((img: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={cn(
                  "relative aspect-[3/4] border-2 transition-all overflow-hidden",
                  currentImageIndex === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="sticky top-32">
            <AnimatePresence mode="wait">
                {viewState === 'product' && (
                  <motion.div
                    key="product"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <header className="space-y-4">
                      <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-[0.3em] font-bold">
                        <span className="w-8 h-px bg-gold" />
                        Détails du produit
                      </div>
                      <h1 className="text-4xl md:text-5xl font-serif font-bold text-black leading-[1.1]">
                        {product.title}
                      </h1>
                      <div className="flex items-center gap-6">
                        <span className="text-3xl font-light text-black">
                          {formatPrice(selectedVariant?.price.amount, selectedVariant?.price.currencyCode)}
                        </span>
                          {selectedVariant?.compareAtPrice && (
                            <span className="text-xl text-zinc-400 line-through">
                              {formatPrice(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
                            </span>
                          )}
                        </div>
                      </header>

                      <div className="space-y-6 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase tracking-[0.2em] font-bold text-black">Sélectionner Taille</span>
                          <button className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-gold flex items-center gap-2 transition-colors">
                            <Ruler size={14} /> Guide des tailles
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {variants.map((v: any) => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariant(v)}
                              disabled={!v.availableForSale}
                              className={cn(
                                "min-w-[60px] h-[60px] flex items-center justify-center text-sm border-2 transition-all duration-300 font-medium",
                                selectedVariant?.id === v.id 
                                  ? "border-black bg-black text-white" 
                                  : "border-zinc-100 hover:border-black text-zinc-600 hover:text-black",
                                !v.availableForSale && "opacity-30 cursor-not-allowed line-through bg-zinc-50"
                              )}
                            >
                              {v.title}
                            </button>
                          ))}
                        </div>
                      </div>

                        <div className="space-y-4 pt-4">
                          <button 
                            onClick={showOrderForm ? handleBackToProduct : handleOrderNow}
                            className={cn(
                              "w-full py-6 text-sm uppercase tracking-[0.3em] font-bold transition-all duration-500 shadow-xl",
                              showOrderForm ? "bg-zinc-100 text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-gold"
                            )}
                          >
                            {showOrderForm ? 'Annuler la commande' : 'Commander maintenant'}
                          </button>
                          
                          {!showOrderForm && (
                            <p className="text-center text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                              Paiement sécurisé à la livraison
                            </p>
                          )}

                          <AnimatePresence>
                            {showOrderForm && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-zinc-50 border border-zinc-100 mt-4 overflow-hidden"
                              >
                                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
                                  <motion.div
                                    key="cod-form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    <div className="mb-8">
                                      <h3 className="text-xl font-serif font-bold text-black uppercase tracking-tight">
                                        Informations de livraison
                                      </h3>
                                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest leading-relaxed">
                                        Complétez le formulaire ci-dessous pour valider votre commande.
                                      </p>
                                    </div>
                                    <CODForm
                                      amount={amountInCents}
                                      currency={selectedVariant?.price.currencyCode?.toLowerCase() || 'mad'}
                                      productTitle={product.title}
                                      variantTitle={selectedVariant?.title || ''}
                                      variantId={selectedVariant?.id || ''}
                                      onBack={handleBackToPaymentSelection}
                                      onSuccess={handlePaymentSuccess}
                                      isOnProductPage={false}
                                    />
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      <div 
                        className="text-zinc-600 text-lg leading-relaxed font-body border-t border-zinc-100 pt-8"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-zinc-100">


                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="p-3 bg-zinc-50 rounded-full text-black">
                        <Truck size={20} />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-900">Livraison Express</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="p-3 bg-zinc-50 rounded-full text-black">
                        <RefreshCw size={20} />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-900">Retours 30 jours</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="p-3 bg-zinc-50 rounded-full text-black">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-900">Garantie Qualité</span>
                    </div>
                  </div>
                </motion.div>
              )}

                {viewState === 'success' && (

                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrderSuccessMessage onContinue={handleContinueShopping} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
