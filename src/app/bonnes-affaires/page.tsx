import { shopifyFetch, PRODUCT_FRAGMENT } from '@/lib/shopify';
import CatalogView from '@/components/ui/CatalogView';

export const dynamic = 'force-dynamic';

async function getPromotions() {
  const res = await shopifyFetch({
    query: `
      query GetPromotions {
        products(first: 50, query: "tag:promo OR tag:sale") {
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

export default async function BonnesAffairesPage() {
  const products = await getPromotions();

  return (
    <CatalogView
      title="Bonnes Affaires"
      subtitle="Jusqu'à -70% sur une sélection"
      products={products}
      categories={['Chaussures', 'Mode', 'Accessoires']}
      bannerImage="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/gemini-2.5-flash-image_femme_elegante_joyeuse_de_profil_levant_un_pied_en_arriere_pour_mettre_en_val-0-1766338834377.jpg?width=2000&height=1125&resize=contain"
    />
  );
}
