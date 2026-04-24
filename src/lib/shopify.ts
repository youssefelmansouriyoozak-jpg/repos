export const SHOPIFY_GRAPHQL_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

export async function shopifyFetch({
  query,
  variables = {},
  cache = 'no-store',
}: {
  query: string;
  variables?: any;
  cache?: RequestCache;
}) {
  try {
    const result = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
    });

    const body = await result.json();
    
    if (body.errors) {
      console.error('Shopify GraphQL Errors:', JSON.stringify(body.errors, null, 2));
    }

    // Transform Admin API fields to match Storefront API expectations
    if (body.data) {
        const transform = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;

          // Map Admin API fields to Storefront API expectations
          if (obj.priceRangeV2 && !obj.priceRange) {
            obj.priceRange = obj.priceRangeV2;
          }

          // Mock availableForSale since it's missing in Admin API
          if (obj.hasOwnProperty('title') && !obj.hasOwnProperty('availableForSale')) {
            obj.availableForSale = true;
          }

          // Map variant price strings to objects if they are strings
          if (obj.price && typeof obj.price === 'string') {
            obj.price = { amount: obj.price, currencyCode: 'MAD' };
          }
          if (obj.compareAtPrice && typeof obj.compareAtPrice === 'string') {
            obj.compareAtPrice = { amount: obj.compareAtPrice, currencyCode: 'MAD' };
          }

          Object.values(obj).forEach(val => {
            if (Array.isArray(val)) {
              val.forEach(item => transform(item));
            } else if (typeof val === 'object') {
              transform(val);
            }
          });
        };
        transform(body.data);
      }

      return {
        status: result.status,
        body,
      };
    } catch (e) {
      console.error('Error fetching from Shopify:', e);
      throw {
        error: e,
        query,
      };
    }
  }

  export const PRODUCT_FRAGMENT = `
    fragment ProductFields on Product {
      id
      handle
      title
      description
      descriptionHtml
      createdAt
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price
            compareAtPrice
            selectedOptions {
              name
              value
            }
          }
        }
      }
      priceRangeV2 {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  `;

export async function getProduct(handle: string) {
  const res = await shopifyFetch({
    query: `
      query GetProduct($query: String!) {
        products(first: 1, query: $query) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `,
    variables: {
      query: `handle:${handle}`,
    },
  });

  return res.body.data?.products.edges[0]?.node;
}
