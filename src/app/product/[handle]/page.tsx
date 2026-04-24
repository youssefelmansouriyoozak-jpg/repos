import { getProduct, shopifyFetch, PRODUCT_FRAGMENT } from '@/lib/shopify';
import ProductDetails from '@/components/product/ProductDetails';
import { notFound } from 'next/navigation';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export const dynamic = 'force-dynamic';

async function getRelatedProducts() {
  const res = await shopifyFetch({
    query: `
      query GetRelatedProducts {
        products(first: 4, sortKey: UPDATED_AT) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
  });

  return res.body.data?.products.edges.map((e: any) => e.node) || [];
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  const relatedProducts = await getRelatedProducts();

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="pt-20">
        <ProductDetails product={product} />
      </div>
      
      <div className="border-t border-zinc-100 py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col items-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-black">
              Vous aimerez aussi
            </h2>
            <div className="w-24 h-1 bg-gold" />
          </div>
          <FeaturedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
