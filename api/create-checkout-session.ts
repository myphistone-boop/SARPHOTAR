
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

    // 1. Génération du numéro de commande interne
    // Format: SAR-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `SAR-${dateStr}-${randomSuffix}`;

    // 2. Préparation des line_items
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

    // 3. Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,

      // --- Metadata & Références Commande ---
      client_reference_id: orderNumber,
      metadata: {
        orderNumber: orderNumber,
        source: 'sarphotar_web'
      },
      payment_intent_data: {
        metadata: {
          orderNumber: orderNumber
        }
      },

      // --- Collecte d'informations ---
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },

      // --- Customisation UX ---
      custom_text: {
        shipping_address: {
          message: process.env.DELIVERY_DELAY_TEXT || 'Livraison estimée sous 3 à 5 jours ouvrés'
        },
        submit: {
            message: 'Payer et Commander'
        }
      },

      // --- Redirections ---
      // Redirection vers l'accueil avec paramètre de succès pour déclencher la notification
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
