import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const requiredFields = ['fullName', 'phone', 'city', 'address', 'productTitle', 'variantId', 'amount', 'currency'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis.` },
          { status: 400 }
        );
      }
    }

    const {
      fullName,
      email,
      phone: rawPhone,
      city,
      address,
      notes,
      productTitle,
      variantTitle,
      variantId,
      amount,
      currency,
      paymentMethod,
      paymentIntentId,
      isPaid
    } = body;

    // Helper to format phone for Shopify E.164 requirement
    const formatPhone = (p: string) => {
      let cleaned = p.replace(/[^\d+]/g, '');
      if (cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '+212' + cleaned.substring(1);
      } else if (!cleaned.startsWith('+')) {
        cleaned = cleaned.startsWith('212') ? '+' + cleaned : '+212' + cleaned;
      }
      return cleaned;
    };

    const phone = formatPhone(rawPhone);

    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopifyDomain || !adminToken) {
      console.error('Shopify Admin credentials missing');
      return NextResponse.json(
        { error: 'Le serveur n\'est pas correctement configuré pour Shopify Admin.' },
        { status: 500 }
      );
    }

    const numericVariantId = variantId.includes('/') 
      ? variantId.split('/').pop() 
      : variantId;

    const isStripePayment = paymentMethod === 'stripe' && isPaid;
    
    const tags = isStripePayment 
      ? 'Stripe, Paid Online, Card Payment' 
      : 'COD, Cash on Delivery';

    const orderData = {
      order: {
        line_items: [
          {
            variant_id: parseInt(numericVariantId),
            quantity: 1,
            title: productTitle,
            variant_title: variantTitle
          }
        ],
        customer: {
          first_name: fullName.split(' ')[0],
          last_name: fullName.split(' ').slice(1).join(' ') || fullName.split(' ')[0],
          email: email || `${phone.replace(/[^\d]/g, '')}@no-email.com`
          // Removed phone from customer object as it often causes "is invalid" errors in Shopify REST API
          // while keeping it in shipping_address where it's required for delivery.
        },
        shipping_address: {
          first_name: fullName.split(' ')[0],
          last_name: fullName.split(' ').slice(1).join(' ') || '.',
          address1: address,
          city: city,
          phone: phone,
          country: 'Morocco'
        },
        billing_address: {
          first_name: fullName.split(' ')[0],
          last_name: fullName.split(' ').slice(1).join(' ') || '.',
          address1: address,
          city: city,
          phone: phone,
          country: 'Morocco'
        },
        financial_status: isStripePayment ? 'paid' : 'pending',
        note: buildOrderNote(notes, paymentMethod, paymentIntentId),
        tags: tags,
        send_receipt: true,
        ...(isStripePayment && {
          transactions: [
            {
              kind: 'sale',
              status: 'success',
              amount: (amount / 100).toFixed(2),
              gateway: 'Stripe'
            }
          ]
        })
      }
    };

    const response = await fetch(`https://${shopifyDomain}/admin/api/2024-04/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Shopify API error:', data);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande Shopify.' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.order.id,
      orderNumber: data.order.order_number,
      message: isStripePayment 
        ? 'Paiement reçu et commande confirmée!' 
        : 'Commande enregistrée avec succès.'
    });
  } catch (error) {
    console.error('Order placement error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la validation de la commande.' },
      { status: 500 }
    );
  }
}

function buildOrderNote(notes: string | undefined, paymentMethod: string | undefined, paymentIntentId: string | undefined): string {
  const parts: string[] = [];
  
  if (paymentMethod === 'stripe' && paymentIntentId) {
    parts.push(`Payment Method: Stripe (Card)`);
    parts.push(`Stripe Payment Intent: ${paymentIntentId}`);
    parts.push(`Status: Paid`);
  } else {
    parts.push(`Payment Method: Cash on Delivery`);
    parts.push(`Status: Pending Payment`);
  }
  
  if (notes) {
    parts.push(`Customer Note: ${notes}`);
  }
  
  return parts.join('\n');
}
