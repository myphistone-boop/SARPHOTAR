
import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { STRIPE_API_VERSION } from './stripe-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION as any,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { items } = req.body as { items: { key: string; quantity: number }[] };

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const line_items = [];

    for (const item of items) {
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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
