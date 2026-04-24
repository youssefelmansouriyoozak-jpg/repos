import { shopifyFetch, PRODUCT_FRAGMENT } from '@/lib/shopify';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CollectionGrid from '@/components/home/CollectionGrid';
import BrandStory from '@/components/home/BrandStory';
import FinalCTA from '@/components/home/FinalCTA';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  const res = await shopifyFetch({
    query: `
      query GetFeaturedProducts {
        products(first: 8, sortKey: UPDATED_AT) {
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

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="pt-0">
      <Hero />
      <FeaturedProducts products={products} />
      <CollectionGrid />
      <BrandStory />
      <FinalCTA />
    </div>
  );
}
