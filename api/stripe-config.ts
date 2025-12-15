
export const STRIPE_API_VERSION = "2023-10-16";

export interface OfferConfig {
  key: string; // Used as lookup_key in Stripe
  name: string;
  amount: number; // In cents
  currency: string;
  description?: string;
}

export const OFFERS: OfferConfig[] = [
  {
    key: 'novelec-pistol',
    name: 'Pistolet NovElec™',
    amount: 1999, // 19.99 EUR
    currency: 'eur',
    description: 'Pistolet électrique compact. Portée 10m.'
  },
  {
    key: 'ciovelec-rifle',
    name: 'Fusil CiovElec™',
    amount: 2999, // 29.99 EUR
    currency: 'eur',
    description: 'Fusil tactique longue portée 12m.'
  },
  {
    key: 'novelec-gatling',
    name: 'Gatling NovElec™',
    amount: 9999, // 99.99 EUR
    currency: 'eur',
    description: 'Gatling automatique haute cadence.'
  }
];
