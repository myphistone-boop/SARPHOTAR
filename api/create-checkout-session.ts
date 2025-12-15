
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { offerKey } = req.body;

  if (!offerKey) {
    return res.status(400).json({ error: 'Missing offerKey' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe configuration error' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  try {
    // 1. Récupérer le prix via lookup_key
    const prices = await stripe.prices.list({
      lookup_keys: [offerKey],
      limit: 1,
    });

    if (prices.data.length === 0) {
      return res.status(404).json({ error: 'Price not found for this offer' });
    }

    const priceId = prices.data[0].id;
    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin || 'http://localhost:3000';

    // 2. Créer la session Checkout
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      automatic_tax: { enabled: true },
    });

    return res.status(200).json({ url: session.url });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
