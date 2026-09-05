import { Product } from './types';

/**
 * Catalogue produit.
 *
 * `price` doit toujours correspondre au montant réellement configuré dans
 * Stripe pour le `lookup_key` égal à l'`id` — c'est Stripe qui fait foi au
 * moment du débit, pas cette valeur d'affichage.
 *
 * Les caractéristiques techniques ne sont volontairement PAS ici : elles
 * vivent dans content/facts.ts, seule source de vérité, où toute donnée non
 * confirmée reste `null` et n'est donc jamais affichée.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'pistol-novelec',
    name: 'Pistolet NovElec™',
    tagline: '100% Électrique',
    price: 34.99,
    currency: 'EUR',
    image: 'https://storage.googleapis.com/novelec_assets/Pistolet.webp',
    gallery: [
      'https://storage.googleapis.com/novelec_assets/Pistolet.webp',
      'https://storage.googleapis.com/novelec_assets/cross%20pistolet.webp',
      'https://storage.googleapis.com/novelec_assets/Accessoires_parfait.webp',
    ],
    story: {
      line1: 'La puissance électrique. Le style. La nuit.',
      line2: 'Un jet précis, des effets lumineux, et zéro effort.',
    },
    specs: { range: 70, rate: 60, capacity: 50 },
  },
  {
    id: 'ciovelec-rifle',
    name: 'Fusil CiovElec™',
    tagline: "L'Avantage Tactique",
    price: 49.99,
    currency: 'EUR',
    image: 'https://storage.googleapis.com/novelec_assets/fusil.webp',
    gallery: [
      'https://storage.googleapis.com/novelec_assets/fusil.webp',
      'https://storage.googleapis.com/novelec_assets/cross_fusil.webp',
    ],
    story: {
      line1: 'Le format fusil. L’avantage à mi-distance.',
      line2: 'Plus de contrôle, plus d’impact, plus de fun.',
    },
    specs: { range: 90, rate: 75, capacity: 85 },
  },
  {
    id: 'novelec-gatling',
    name: 'Gatling NovElec™',
    tagline: 'Domination Totale',
    price: 99.99,
    currency: 'EUR',
    image: 'https://storage.googleapis.com/novelec_assets/gatling.webp',
    gallery: [
      'https://storage.googleapis.com/novelec_assets/gatling.webp',
      'https://storage.googleapis.com/novelec_assets/batterie_gatling.webp',
    ],
    story: {
      line1: 'Rafales électriques. Signature RGB.',
      line2: 'Le mode “boss final” des batailles aquatiques.',
    },
    specs: { range: 60, rate: 100, capacity: 100 },
  },
];
