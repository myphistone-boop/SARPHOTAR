
import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { OFFERS, STRIPE_API_VERSION } from './stripe-config.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION as any,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  
  const token = req.query.token;
  if (token !== process.env.BOOTSTRAP_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const logs: string[] = [];

  try {
    for (const offer of OFFERS) {
      // Check if price exists with lookup_key
      const prices = await stripe.prices.list({
        lookup_keys: [offer.key],
        active: true,
        limit: 1,
      });

      if (prices.data.length > 0) {
        logs.push(`Product/Price already exists for: ${offer.key}`);
        continue;
      }

      // Create Product & Price
      const product = await stripe.products.create({
        name: offer.name,
        description: offer.description,
      });

      await stripe.prices.create({
        product: product.id,
        unit_amount: offer.amount,
        currency: offer.currency,
        lookup_key: offer.key,
        transfer_lookup_key: true,
      });

      logs.push(`Created product and price for: ${offer.key}`);
    }

    return res.status(200).json({ success: true, logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
