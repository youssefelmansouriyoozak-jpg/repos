import { shopifyFetch, PRODUCT_FRAGMENT } from '@/lib/shopify';
import CatalogView from '@/components/ui/CatalogView';

export const dynamic = 'force-dynamic';

async function getCategoryProducts() {
  const res = await shopifyFetch({
    query: `
      query GetProducts {
        products(first: 50, query: "tag:mode") {
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

export default async function ModePage() {
  const products = await getCategoryProducts();

  return (
    <CatalogView
      title="Mode"
      subtitle="Votre style, votre signature"
      products={products}
      categories={['Hauts', 'Bas', 'Robes', 'Vestes', 'Ensembles']}
      bannerImage="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/gemini-2.5-flash-image_femme_elegante_joyeuse_faisant_du_shopping_et_portant_ces_chaussures-0-1766338834624.jpg?width=2000&height=1125&resize=contain"
    />
  );
}
