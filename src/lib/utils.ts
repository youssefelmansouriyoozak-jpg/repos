import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: string | number, currencyCode: string = 'MAD') {
  const formatted = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
  }).format(Number(amount));
  
  return formatted.replace('MAD', 'DHS').replace('MAD', 'DHS');
}

export function getNumericId(id: string): string {
  if (!id) return '';
  // If it's base64 encoded, decode it
  let decodedId = id;
  if (!id.includes('/') && id.length > 20) {
    try {
      decodedId = atob(id);
    } catch (e) {
      // Not base64
    }
  }
  return decodedId.split('/').pop() || '';
}

export function getShopifyDomain() {
  return process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'yoozakshop.myshopify.com';
}

export function redirectExternal(url: string) {
  if (typeof window !== "undefined") {
    // If we're in an iframe (Orchids preview), use postMessage
    const isOrchids = window.self !== window.top;
    
    if (isOrchids) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
      // Fallback for non-Orchids iframes after a short delay
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    } else {
      window.location.href = url;
    }
  }
}
