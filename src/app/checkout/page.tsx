'use client';

import { useEffect } from 'react';
import { redirectExternal, getShopifyDomain } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export default function CheckoutPage() {
  useEffect(() => {
    const domain = getShopifyDomain();
    const checkoutUrl = `https://${domain}/checkout`;
    redirectExternal(checkoutUrl);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-sans tracking-widest uppercase">Redirection vers le paiement...</p>
      </div>
    </div>
  );
}
