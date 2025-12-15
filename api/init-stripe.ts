
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { OFFERS } from './stripe-config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Sécurité : Vérification du token Bootstrap
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.BOOTSTRAP_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: Stripe key missing' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  const logs: string[] = [];
  const log = (msg: string) => logs.push(msg);

  try {
    log('🚀 Starting Stripe Initialization...');

    for (const offer of OFFERS) {
      // Vérification existence via lookup_key
      const prices = await stripe.prices.list({
        lookup_keys: [offer.key],
      });

      if (prices.data.length > 0) {
        log(`✅ [SKIP] ${offer.key} already exists.`);
        continue;
      }

      // Création Produit
      const product = await stripe.products.create({
        name: offer.name,
        description: offer.description,
        metadata: {
            offerKey: offer.key
        }
      });

      // Création Prix
      await stripe.prices.create({
        product: product.id,
        unit_amount: offer.amount,
        currency: offer.currency,
        lookup_key: offer.key,
        transfer_lookup_key: true,
      });

      log(`✨ [CREATED] ${offer.key} created successfully.`);
    }

    log('🏁 Initialization complete.');
    return res.status(200).json({ success: true, logs });

  } catch (error: any) {
    console.error('Stripe Init Error:', error);
    return res.status(500).json({ success: false, error: error.message, logs });
  }
}
