import { shopifyFetch, PRODUCT_FRAGMENT } from '@/lib/shopify';
import CatalogView from '@/components/ui/CatalogView';

export const dynamic = 'force-dynamic';

async function getBestSellers() {
  const res = await shopifyFetch({
    query: `
      query GetBestSellers {
        products(first: 50, query: "tag:best-seller") {
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

export default async function BestSellersPage() {
  const products = await getBestSellers();

  return (
    <CatalogView
      title="Best Sellers"
      subtitle="Les préférés de notre communauté"
      products={products}
      categories={['Chaussures', 'Mode', 'Accessoires']}
      bannerImage="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/gemini-2.5-flash-image_Un_mannequin_femme_reel_d_origine_maghrebine_dans_un_bureau_portant_la_chaussu-2-1-1766338833567.jpg?width=2000&height=1125&resize=contain"
    />
  );
}
