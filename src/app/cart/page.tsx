'use client';

import { useEffect } from 'react';
import { redirectExternal, getShopifyDomain } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export default function CartPage() {
  useEffect(() => {
    const domain = getShopifyDomain();
    const cartUrl = `https://${domain}/cart`;
    redirectExternal(cartUrl);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-sans tracking-widest uppercase">Redirection vers votre panier...</p>
      </div>
    </div>
  );
}
