
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
    const { items, referrer } = req.body as {
      items: { key: string; quantity: number }[];
      referrer?: string;
    };

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Referrer tracking: defaults to 'direct' if not provided
    const customerReferrer = referrer || 'direct';

    // CONFIGURATION DOMAINE
    // Utilise la variable d'env si elle existe (pour le dev local http://localhost:3000), 
    // sinon force votre domaine de production.
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarphotar.fr';

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
        source: 'sarphotar_web',
        referrer: customerReferrer
      },
      payment_intent_data: {
        metadata: {
          orderNumber: orderNumber,
          referrer: customerReferrer
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
          message: process.env.DELIVERY_DELAY_TEXT || 'Livraison packée sous 1 à 2 jours ouvrés'
        },
        submit: {
            message: 'Payer et Commander'
        }
      },

      // --- Redirections ---
      // Succès : Retour accueil avec modale de confirmation
      success_url: `${BASE_URL}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
      // Annulation : Retour accueil simple (évite une 404 sur /cancel)
      cancel_url: `${BASE_URL}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
