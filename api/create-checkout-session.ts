
import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { STRIPE_API_VERSION } from './stripe-config.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION as any,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body as {
      items: { key: string; quantity: number }[];
    };

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Construction des line_items Stripe à partir du panier
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      if (!item.key || item.quantity < 1) {
        throw new Error('Invalid cart item');
      }

      const prices = await stripe.prices.list({
        lookup_keys: [item.key],
        active: true,
        limit: 1,
      });

      if (prices.data.length === 0) {
        throw new Error(`Price not found for key: ${item.key}`);
      }

      line_items.push({
        price: prices.data[0].id,
        quantity: item.quantity,
      });
    }

    // Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,

      // 🔒 ADRESSE DE LIVRAISON OBLIGATOIRE
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH'],
      },

      // 📄 Adresse de facturation obligatoire (recommandé)
      billing_address_collection: 'required',

      // 📞 Téléphone client (optionnel mais utile pour livraison)
      phone_number_collection: {
        enabled: true,
      },

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
