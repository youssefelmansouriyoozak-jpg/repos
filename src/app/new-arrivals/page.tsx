import { shopifyFetch, PRODUCT_FRAGMENT } from '@/lib/shopify';
import CatalogView from '@/components/ui/CatalogView';

export const dynamic = 'force-dynamic';

async function getNewArrivals() {
  const res = await shopifyFetch({
    query: `
      query GetNewArrivals {
        products(first: 50, sortKey: CREATED_AT, reverse: true) {
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

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <CatalogView
      title="New Arrivals"
      subtitle="Découvrez nos dernières pépites"
      products={products}
      categories={['Chaussures', 'Mode', 'Accessoires']}
      bannerImage="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/gemini-2.5-flash-image_femme_elegante_joyeuse_de_profil_levant_un_pied_en_arriere_pour_mettre_en_val-0-1766338834377.jpg?width=2000&height=1125&resize=contain"
    />
  );
}
