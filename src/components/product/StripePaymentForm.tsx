'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ArrowLeft, Loader2, CreditCard, User, Phone, Mail, MapPin } from 'lucide-react';
import { getStripe } from '@/lib/stripe';
import { formatPrice } from '@/lib/utils';

interface StripePaymentFormProps {
  amount: number;
  currency: string;
  productTitle: string;
  variantTitle: string;
  variantId: string;
  onBack: () => void;
  onSuccess: () => void;
}

interface CustomerFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

function PaymentForm({
  amount,
  currency,
  productTitle,
  variantTitle,
  variantId,
  onBack,
  onSuccess,
  formData,
  onFormChange,
}: StripePaymentFormProps & {
  formData: CustomerFormData;
  onFormChange: (data: CustomerFormData) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isElementsReady, setIsElementsReady] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements || !isElementsReady) {
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.city || !formData.address) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'Une erreur est survenue');
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Une erreur est survenue lors du paiement');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const orderResponse = await fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            productTitle,
            variantTitle,
            variantId,
            amount,
            currency,
            paymentMethod: 'stripe',
            paymentIntentId: paymentIntent.id,
            isPaid: true,
          }),
        });

        if (!orderResponse.ok) {
          const data = await orderResponse.json();
          throw new Error(data.error || 'Erreur lors de la création de la commande');
        }

        onSuccess();
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Une erreur est survenue'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 border-b border-zinc-100 pb-4">
          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
            1
          </span>
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
              className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm bg-white"
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
                className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm bg-white"
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
                className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 border-b border-zinc-100 pb-4">
          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
            2
          </span>
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
              className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm bg-white"
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
              className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm resize-none bg-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 border-b border-zinc-100 pb-4">
          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
            3
          </span>
          Informations de paiement
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-sm">
          <PaymentElement
            onReady={() => setIsElementsReady(true)}
            options={{
              layout: 'tabs',
            }}
          />
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
          className="w-full px-4 py-3 border border-zinc-200 focus:border-black focus:outline-none transition-colors text-sm resize-none bg-white"
        />
      </div>

      <div className="bg-zinc-50 p-4 rounded-sm flex items-start gap-3">
        <div className="mt-0.5 text-black">
          <CreditCard size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black">
            Paiement sécurisé par carte
          </p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
            Vos informations de paiement sont cryptées et sécurisées par Stripe.
          </p>
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
          disabled={isProcessing || !stripe || !elements || !isElementsReady}
          className="w-full bg-black text-white py-5 text-sm uppercase tracking-[0.3em] font-bold hover:bg-gold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Traitement en cours...
            </>
          ) : !isElementsReady ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Chargement...
            </>
          ) : (
            `Payer ${formatPrice(amount / 100, currency)}`
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="w-full text-zinc-500 hover:text-black py-3 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} />
          Retour aux options de paiement
        </button>
      </div>
    </form>
  );
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: props.amount,
            currency: props.currency,
            metadata: {
              productTitle: props.productTitle,
              variantTitle: props.variantTitle,
              variantId: props.variantId,
            },
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Une erreur est survenue'
        );
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [props.amount, props.currency, props.productTitle, props.variantTitle, props.variantId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="animate-spin text-black" size={32} />
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Préparation du paiement...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
        <button
          onClick={props.onBack}
          className="w-full text-zinc-500 hover:text-black py-3 text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} />
          Retour aux options de paiement
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  const stripePromise = getStripe();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            colorText: '#000000',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '0px',
            spacingUnit: '4px',
          },
          rules: {
            '.Input': {
              border: '1px solid #e4e4e7',
              padding: '12px 16px',
            },
            '.Input:focus': {
              border: '1px solid #000000',
              boxShadow: 'none',
            },
            '.Label': {
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#71717a',
            },
            '.Tab': {
              border: '1px solid #e4e4e7',
              backgroundColor: '#ffffff',
            },
            '.Tab--selected': {
              border: '1px solid #000000',
              backgroundColor: '#000000',
              color: '#ffffff',
            },
          },
        },
      }}
    >
      <PaymentForm {...props} formData={formData} onFormChange={setFormData} />
    </Elements>
  );
}
